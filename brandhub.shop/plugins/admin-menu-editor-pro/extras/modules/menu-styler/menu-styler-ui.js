///<reference path="../../../js/common.d.ts"/>
///<reference path="../../../js/jquery.biscuit.d.ts"/>
import { AmeStyleGenerator } from '../../style-generator/style-generator.js';
import { AmeCustomizableViewModel } from '../../pro-customizables/assets/customizable.js';
jQuery(function ($) {
    const _ = wsAmeLodash;
    const styleConfigKey = 'menu_styles';
    /**
     * Utility class that tells WordPress to pin or unpin the admin menu as needed
     * when the menu dimensions or the top margin change.
     *
     * Uses throttling to avoid excessive updates.
     */
    class StickyMenuUpdater {
        constructor() {
            this.$document = $(document);
            this.$adminmenu = $('#adminmenu');
            this.previousHeight = null;
            this.previousWidth = null;
            this.previousTopMargin = null;
            this.updateMenuPinState = _.throttle(() => {
                const menuHeight = this.$adminmenu.outerHeight();
                const menuWidth = this.$adminmenu.outerWidth();
                const topMargin = parseInt(this.$adminmenu.css('margin-top'), 10);
                if ((menuHeight !== this.previousHeight)
                    || (menuWidth !== this.previousWidth)
                    || (topMargin !== this.previousTopMargin)) {
                    this.previousHeight = menuHeight;
                    this.previousWidth = menuWidth;
                    this.previousTopMargin = topMargin;
                    //In practice, this update doesn't always work if done immediately.
                    //Not sure why, maybe menu dimensions don't change instantly when, for example,
                    //the user adds a logo image. Adding a small delay seems to help.
                    window.requestAnimationFrame(() => {
                        //The custom "wp-pin-menu" event was added to WP core in 2015. It can be used to update
                        //the menu "sticky" state. I'm using triggerHandler() instead of trigger() because this
                        //is what /wp-admin/js/widgets.js does. Hopefully, that will improve compatibility.
                        this.$document.triggerHandler('wp-pin-menu');
                    });
                }
            }, 1000, { leading: true, trailing: true });
        }
        queueUpdate() {
            this.updateMenuPinState();
        }
    }
    class MenuStylerViewModel extends AmeCustomizableViewModel.SimpleVm {
        constructor() {
            /**
             * This observable is initially stored in a local variable because TypeScript doesn't
             * allow accessing `this` in the constructor before calling super(), but we still
             * want to establish a dependency on the dialog open state so that preview gets enabled
             * when the dialog is open. The observable will get updated later.
             */
            const extraPreviewCondition = ko.observable(false);
            super(extraPreviewCondition);
            this.isFirstOpen = true;
            this.$dialog = null;
            this.stickyMenuUpdater = new StickyMenuUpdater();
            this.dialogOpenObservable = extraPreviewCondition;
            this.previewPreference = new WsAmePreferenceCookie('MsPreviewEnabled', 90, true);
            //Read settings from the currently loaded admin menu configuration
            //using the aux-data API. Setting ID prefixes should already be registered.
            const auxDataSettingReader = (settingId, defaultValue) => {
                const path = AmeEditorApi.configDataAdapter.mapSettingIdToPath(settingId);
                if (path === null) {
                    return defaultValue;
                }
                const value = AmeEditorApi.configDataAdapter.getPath(path, this.notFound);
                if (value !== this.notFound) {
                    return value;
                }
                else if (ameMenuStylerConfig.defaults.hasOwnProperty(settingId)) {
                    return ameMenuStylerConfig.defaults[settingId];
                }
                else {
                    throw new Error('Unknown aux config setting ID: ' + settingId);
                }
            };
            for (const auxPrefix of AmeEditorApi.configDataAdapter.getKnownPrefixes()) {
                this.registerSettingReader(auxDataSettingReader, auxPrefix);
            }
            for (const previewConfig of ameMenuStylerConfig.stylePreviewConfigs) {
                const previewInstance = new AmeStyleGenerator.Preview.StyleGeneratorPreview(previewConfig);
                this.registerPreviewUpdater(previewInstance.getPreviewableSettingIDs(), previewInstance);
            }
            $(document).trigger('adminMenuEditor:menuStylerUiRegister', [this]);
        }
        saveChanges() {
            const settingsById = this.getAllSettingValues();
            //Sort by length of the setting ID and then by the ID itself to ensure parent settings
            //are updated before their children. For example, this matters for color presets where
            //the "activePreset" setting maps to the "[global]" property of the "colorPresets" setting.
            const sortedIds = Object.keys(settingsById);
            sortedIds.sort((a, b) => {
                if (a.length !== b.length) {
                    return a.length - b.length;
                }
                return a.localeCompare(b);
            });
            //Write all settings into a new object, then save the top-level properties
            //of that. This way stale and empty settings will automatically be removed.
            const updatedConfig = {};
            for (const settingId of sortedIds) {
                const path = AmeEditorApi.configDataAdapter.mapSettingIdToPath(settingId);
                if (path === null) {
                    continue;
                }
                const value = settingsById[settingId];
                //To save space, don't store null values. This could be extended by using
                //the "deleteWhenBlank" property of the setting definition.
                if (value === null) {
                    continue;
                }
                _.set(updatedConfig, path, value);
            }
            //Special: Update the last modified timestamp for menu styles.
            _.set(updatedConfig, [styleConfigKey, '_lastModified'], (new Date()).toISOString());
            //Special: Remove empty color presets.
            const colorPresets = _.get(updatedConfig, ['color_presets'], {});
            for (const presetName of Object.keys(colorPresets)) {
                //Remove empty string values (i.e. no color selected). This also
                //covers nulls and empty arrays/objects, but that shouldn't happen.
                colorPresets[presetName] = _.omitBy(colorPresets[presetName], _.isEmpty);
                //Remove the preset if it's empty.
                if (_.isEmpty(colorPresets[presetName])) {
                    delete colorPresets[presetName];
                }
            }
            //Finally, write the top-level properties to the menu configuration.
            for (const key in updatedConfig) {
                if (!updatedConfig.hasOwnProperty(key)) {
                    continue;
                }
                const value = updatedConfig[key];
                AmeEditorApi.configDataAdapter.setPath(key, value);
            }
            $(document).trigger('adminMenuEditor:menuConfigChanged');
        }
        isDialogOpen(newValue = null) {
            if (!this.dialogOpenObservable) {
                return false;
            }
            if (newValue !== null) {
                this.dialogOpenObservable(newValue);
                return newValue;
            }
            return this.dialogOpenObservable();
        }
        getPreviewActiveState() {
            //Disable preview when the dialog is not open.
            if (!this.isDialogOpen()) {
                return false;
            }
            return super.getPreviewActiveState();
        }
        updatePreview(settingIds) {
            super.updatePreview(settingIds);
            this.stickyMenuUpdater.queueUpdate();
        }
        setDialog($dialog) {
            this.$dialog = $dialog;
            let $overlay = null;
            $dialog.on('dialogopen', () => {
                this.isDialogOpen(true);
                this.onOpenDialog();
                //Add a custom class to the overlay so that we can style it.
                $overlay = $dialog.closest('.ui-dialog').nextAll('.ui-widget-overlay').first();
                $overlay.addClass('ame-ms-dialog-overlay');
            });
            $dialog.on('dialogclose', () => {
                this.isDialogOpen(false);
                if ($overlay) {
                    $overlay.removeClass('ame-ms-dialog-overlay');
                    $overlay = null;
                }
            });
        }
        onOpenDialog() {
            if (!this.isFirstOpen) {
                this.reloadAllSettings();
            }
            if (this.isFirstOpen) {
                this.isFirstOpen = false;
                //Load the preview state from a cookie.
                this.isPreviewEnabled(this.previewPreference.readAndRefresh(true));
            }
        }
        // noinspection JSUnusedGlobalSymbols -- Used in the KO template.
        onConfirmDialog() {
            //Save the preview state in a cookie.
            this.previewPreference.write(this.isPreviewEnabled());
            this.saveChanges();
            this.closeDialog();
        }
        onCancelDialog() {
            this.closeDialog();
        }
        closeDialog() {
            if (this.$dialog !== null) {
                this.$dialog.dialog('close');
            }
        }
    }
    const $styleDialog = $('#ws-ame-menu-style-settings');
    let isDialogInitialized = false;
    function initializeDialog() {
        $styleDialog.dialog({
            autoOpen: false,
            closeText: ' ',
            draggable: false,
            modal: true,
            //Dialog dimensions and position are set in CSS.
            minWidth: 300,
            height: 400,
            classes: {
                'ui-dialog': 'ui-corner-all ws-ame-menu-style-dialog',
            }
        });
        isDialogInitialized = true;
        const vm = new MenuStylerViewModel();
        window['ameMenuStylerVm'] = vm;
        ko.applyBindings(vm, $styleDialog[0]);
        vm.setDialog($styleDialog);
    }
    //Open the dialog when the user clicks the style button.
    $('#ws_edit_menu_styles').on('click', () => {
        //Optimization: Initialize the dialog on the first click.
        if (!isDialogInitialized) {
            initializeDialog();
        }
        //Reset the scroll position of the tab content area.
        $styleDialog.find('.ame-tp-content').scrollTop(0);
        $styleDialog.dialog('open');
    });
});
//# sourceMappingURL=menu-styler-ui.js.map