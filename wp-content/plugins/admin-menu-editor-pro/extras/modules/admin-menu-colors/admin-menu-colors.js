/// <reference path="../../../js/menu-editor.d.ts" />
import { AmeCustomizableViewModel } from '../../pro-customizables/assets/customizable.js';
jQuery(function ($) {
    class PresetDropdownControl {
        constructor($control, initialPresets = {}) {
            this.isActive = true;
            this.areColorEventsIgnored = false;
            this.currentPresets = {};
            this.isGlobalPresetVisible = true;
            this.$control = $control;
            this.currentPresets = initialPresets;
            this.$mySection = $control.closest('.ame-mc-color-section');
            this.$presetSelect = $control.find('select').first();
            this.$presetSelect.on('change', this.onPresetChange.bind(this));
            this.$deleteButton = $control.find('.ame-mc-delete-color-preset').first();
            const globalVisibilityData = this.$control.data('global-preset-visible');
            if (typeof globalVisibilityData !== 'undefined') {
                this.isGlobalPresetVisible = (globalVisibilityData == 1); //Loose comparison is intentional.
            }
            //When the user changes any of the colors, deselect the current preset.
            const $colorInputs = this.getAssociatedColorInputs();
            $colorInputs.on('adminMenuEditor:colorPickerChange', () => {
                if (this.areColorEventsIgnored) {
                    return;
                }
                this.deselectPresets();
            });
            this.$deleteButton.on('click', (event) => {
                event.preventDefault();
                const presetName = this.$presetSelect.val();
                const targetPreset = this.getPresetByName(presetName);
                if (!targetPreset || (presetName === '[global]') || (presetName === '[save_preset]')) {
                    return;
                }
                if (!confirm('Are you sure you want to delete the preset "' + presetName + '"?')) {
                    return false;
                }
                this.deletePreset(presetName);
                this.deselectPresets();
            });
            this.$control.on('adminMenuEditor:observableValueChanged adminMenuEditor:observableBindingInit', (event, data) => {
                this.currentPresets = data || {};
                this.populateSelect(this.currentPresets);
            });
            //Initialize the dropdown.
            this.populateSelect(this.getPresetCollection());
        }
        onPresetChange() {
            if (!this.isActive) {
                return; //Ignore changes while inactive, e.g. when the dialog is closed.
            }
            const presetName = this.$presetSelect.val();
            //Show the "Delete" button only if the user selected a custom preset.
            //The global preset cannot be deleted.
            const metaPresets = ['[save_preset]', '[separator1]', '[global]', ''];
            this.$deleteButton.toggle((metaPresets.indexOf(presetName) < 0) && (presetName !== null));
            if (presetName === '[save_preset]') {
                //Create a new preset.
                const colors = this.getCurrentColors();
                if (colors === null) {
                    this.deselectPresets();
                    alert('Error: No colors selected');
                    return;
                }
                const newPresetName = window.prompt('New preset name:', '');
                if ((newPresetName === null) || ((newPresetName.trim()) === '')) {
                    this.deselectPresets();
                    return;
                }
                this.storePreset(newPresetName, colors);
                this.selectPresetByName(newPresetName);
            }
            else if (presetName !== '') {
                //Apply the selected preset.
                const preset = this.getPresetByName(presetName);
                if (preset) {
                    this.displayPresetColors(preset);
                }
            }
        }
        populateSelect(presets) {
            //Remember the current value.
            const currentValue = this.$presetSelect.val();
            //Clear the select.
            this.$presetSelect.empty();
            //The first option is a placeholder that just says "Select a preset".
            this.$presetSelect.append($('<option>', {
                value: '',
                text: 'Select a preset',
                disabled: true
            }));
            //Add the global option first.
            this.$presetSelect.append($('<option>', {
                value: '[global]',
                text: 'Use default settings',
                class: 'ame-meta-option ame-global-colors-preset'
            }).toggle(this.isGlobalPresetVisible && (typeof presets['[global]'] !== 'undefined')));
            //Sort presets alphabetically.
            const sortedPresetNames = Object.keys(presets).sort(function (a, b) {
                return a.localeCompare(b);
            });
            //Add the presets to the select.
            for (const presetName of sortedPresetNames) {
                if (presetName === '[global]') {
                    continue; //Already added.
                }
                const $option = $('<option></option>');
                $option.val(presetName);
                $option.text(presetName);
                this.$presetSelect.append($option);
            }
            //Add a separator between the presets and the option that adds a new preset.
            this.$presetSelect.append($('<option>', {
                value: '[separator1]',
                text: '────────────────────',
                disabled: true,
                class: 'ame-meta-option'
            }));
            //Add the "Save..." option.
            this.$presetSelect.append($('<option>', {
                value: '[save_preset]',
                text: 'Save current settings as a preset...',
                class: 'ame-meta-option ws-ame-save-color-preset'
            }));
            //Restore the previous value.
            this.$presetSelect.val(currentValue);
        }
        getPresetCollection() {
            return this.currentPresets;
        }
        updatePresetCollection(presets) {
            this.currentPresets = presets;
            this.populateSelect(presets);
            this.$control.trigger('adminMenuEditor:controlValueChanged', [presets]);
        }
        getPresetByName(presetName) {
            const presets = this.getPresetCollection();
            if (presetName in presets) {
                return presets[presetName];
            }
            return null;
        }
        storePreset(presetName, preset) {
            const collection = this.getPresetCollection();
            collection[presetName] = preset;
            this.updatePresetCollection(collection);
        }
        deletePreset(presetName) {
            const collection = this.getPresetCollection();
            delete collection[presetName];
            this.updatePresetCollection(collection);
        }
        deselectPresets() {
            this.selectPresetByName('');
        }
        selectPresetByName(presetName) {
            this.$presetSelect.val(presetName).triggerHandler('change');
        }
        displayPresetColors(preset) {
            const wereColorEventsIgnored = this.areColorEventsIgnored;
            this.areColorEventsIgnored = true;
            this.getAssociatedColorInputs().each(function () {
                const $input = $(this);
                const colorVariable = $input.data('color-variable');
                if (!colorVariable) {
                    return;
                }
                const color = preset[colorVariable];
                if (color) {
                    $input.wpColorPicker('color', color);
                }
                else {
                    $input.closest('.wp-picker-container').find('.wp-picker-clear').trigger('click');
                }
            });
            this.areColorEventsIgnored = wereColorEventsIgnored;
        }
        getAssociatedColorInputs() {
            return this.$mySection.find('input.ame-color-picker');
        }
        getCurrentColors() {
            let colors = {};
            let totalColors = 0;
            this.getAssociatedColorInputs().each(function () {
                const $input = $(this);
                const colorVariable = $input.data('color-variable');
                if (!colorVariable) {
                    return;
                }
                const color = $input.wpColorPicker('color');
                if (color && (color !== '')) {
                    colors[colorVariable] = color;
                    totalColors++;
                }
            });
            return (totalColors > 0) ? colors : null;
        }
    }
    class ColorDialogViewModel extends AmeCustomizableViewModel.SimpleVm {
        constructor() {
            super();
            this.idPrefix = 'ws_menu_colors--';
            this.$dialog = null;
            this.menuItem = null;
            this.$containerNode = null;
            this.currentItemColors = null;
            //Preview is always disabled for this dialog.
            this.isPreviewEnabled(false);
            const activePresetPrefix = 'ws_menu_colors--activePreset.';
            this.registerSettingReader((settingId, defaultResult) => {
                var _a;
                //Use the item's color settings if they exist.
                if (this.currentItemColors && (settingId.indexOf(activePresetPrefix) === 0)) {
                    const variableName = settingId.substring(activePresetPrefix.length);
                    return (_a = this.currentItemColors[variableName]) !== null && _a !== void 0 ? _a : null;
                }
                const path = AmeEditorApi.configDataAdapter.mapSettingIdToPath(settingId);
                if (path !== null) {
                    return AmeEditorApi.configDataAdapter.getPath(path, null);
                }
                return defaultResult;
            }, this.idPrefix);
        }
        setDialog($dialog) {
            this.$dialog = $dialog;
        }
        // noinspection JSUnusedGlobalSymbols -- Used in the Knockout template.
        onConfirmDialog() {
            let { presetCollection, activePreset } = this.readColorSettings();
            //If the custom colors match the global settings, reset them to null.
            //Using the [global] preset is the default.
            if (activePreset && (typeof presetCollection['[global]'] !== 'undefined')) {
                const globalPreset = presetCollection['[global]'];
                if (this.areObjectsEqual(globalPreset, activePreset)) {
                    activePreset = null;
                }
            }
            //Apply the active preset to the current menu item.
            if (this.menuItem) {
                this.menuItem.colors = activePreset;
                if (this.$containerNode) {
                    AmeEditorApi.updateItemEditor(this.$containerNode);
                }
            }
            //Save the presets.
            AmeEditorApi.configDataAdapter.setPath(['color_presets'], presetCollection);
            this.closeDialog();
            $(document).trigger('adminMenuEditor:menuConfigChanged');
        }
        areObjectsEqual(a, b) {
            let keysA = Object.keys(a);
            let keysB = Object.keys(b);
            if (keysA.length !== keysB.length) {
                return false;
            }
            for (let key of keysA) {
                if (a[key] !== b[key]) {
                    return false;
                }
            }
            return true;
        }
        readColorSettings() {
            const settings = this.getAllSettingValues();
            //Colors of the active preset are stored in the "ws_menu_colors--activePreset.variable-name" settings.
            const activePresetPrefix = this.idPrefix + 'activePreset.';
            let activePreset = {};
            for (const settingId in settings) {
                if (settingId.indexOf(activePresetPrefix) === 0) {
                    const colorVariable = settingId.substring(activePresetPrefix.length);
                    //Optimization: Don't store null/empty values.
                    const value = settings[settingId];
                    if ((value !== null) && (value !== '')) {
                        activePreset[colorVariable] = value;
                    }
                }
            }
            //If the active preset is empty, set it to null.
            if (Object.keys(activePreset).length <= 0) {
                activePreset = null;
            }
            //General presets are stored in the "ws_menu_colors--colorPresets" setting.
            let presetCollection = settings[this.idPrefix + 'colorPresets'];
            if (!presetCollection) {
                presetCollection = {};
            }
            //For consistency, filter out null and empty colors from other presets as well.
            for (const presetName in presetCollection) {
                const preset = presetCollection[presetName];
                for (const colorVariable in preset) {
                    const color = preset[colorVariable];
                    if ((color === null) || (color === '')) {
                        delete preset[colorVariable];
                    }
                }
            }
            return { presetCollection, activePreset };
        }
        onCancelDialog() {
            this.closeDialog();
        }
        // noinspection JSUnusedGlobalSymbols -- Used in the Knockout template.
        onApplyToAll() {
            if (!confirm('Apply these color settings to ALL top level menus?')) {
                return;
            }
            //Set the active preset as the global preset.
            const { presetCollection, activePreset } = this.readColorSettings();
            if (activePreset) {
                presetCollection['[global]'] = activePreset;
            }
            else {
                delete presetCollection['[global]'];
            }
            AmeEditorApi.configDataAdapter.setPath(['color_presets'], presetCollection);
            //Remove custom color settings from all menu items.
            AmeEditorApi.forEachMenuItem(function (menuItem, $containerNode) {
                if (menuItem) {
                    menuItem.colors = null;
                }
                AmeEditorApi.updateItemEditor($containerNode);
            }, true);
            this.closeDialog();
        }
        closeDialog() {
            if (this.$dialog !== null) {
                this.$dialog.dialog('close');
            }
            this.menuItem = null;
            this.$containerNode = null;
            this.currentItemColors = null;
        }
        openForMenuItem(menuItem, $containerNode) {
            this.menuItem = menuItem;
            this.$containerNode = $containerNode;
            if ((!this.menuItem) || (this.$dialog === null)) {
                return;
            }
            //Add menu title to the dialog caption.
            const title = AmeEditorApi.getFieldValue(menuItem, 'menu_title', null, $containerNode);
            this.$dialog.dialog('option', 'title', title ? ('Colors: ' + AmeEditorApi.formatMenuTitle(title)) : 'Colors');
            //Get custom colors from the menu item.
            let colors = AmeEditorApi.getFieldValue(menuItem, 'colors', {}, $containerNode);
            if (colors && (Object.keys(colors).length > 0)) {
                this.currentItemColors = colors;
            }
            else {
                //Normalization. No custom colors = use default colors, and null
                //is used to indicate default settings.
                menuItem.colors = null;
                this.currentItemColors = null;
            }
            this.reloadAllSettings();
            this.$dialog.dialog('open');
            //When there are no custom colors, select the global preset if it exists.
            //Otherwise, do not select any preset.
            const colorPresets = AmeEditorApi.configDataAdapter.getPath(['color_presets']);
            const $dropdown = this.$dialog.find('.ame-mc-preset-dropdown').first();
            if (!this.currentItemColors && colorPresets && (typeof colorPresets['[global]'] !== 'undefined')) {
                $dropdown.val('[global]');
            }
            else {
                $dropdown.val('');
            }
        }
    }
    $('.ame-mc-color-preset-control').each(function () {
        const $control = $(this);
        const instance = new PresetDropdownControl($(this));
        $control.data('wsAmeColorPresetControl', instance);
    });
    const $colorDialog = $('#ws-ame-mc-menu-color-settings');
    let itemColorDialogVm = null;
    let isColorDialogInitialized = false;
    function initializeColorDialog() {
        isColorDialogInitialized = true;
        $colorDialog.dialog({
            autoOpen: false,
            closeText: ' ',
            draggable: false,
            modal: true,
            minHeight: 400,
            minWidth: 520
        });
        itemColorDialogVm = new ColorDialogViewModel();
        itemColorDialogVm.setDialog($colorDialog);
        ko.applyBindings(itemColorDialogVm, $colorDialog[0]);
    }
    $('#ws_edit_global_colors2').on('click', function () {
        if (!isColorDialogInitialized) {
            initializeColorDialog();
        }
        $colorDialog.dialog('open');
    });
    //Color "Edit..." button in menu properties.
    $('#ws_menu_editor').on('click', '.ws_open_color_editor, .ws_color_scheme_display', function () {
        //Init and open the dialog for the current menu item.
        if (!isColorDialogInitialized) {
            initializeColorDialog();
        }
        if (itemColorDialogVm === null) {
            return; //Should never happen.
        }
        const $containerNode = $(this).parents('.ws_container').first();
        const menuItem = $containerNode.data('menu_item');
        itemColorDialogVm.openForMenuItem(menuItem, $containerNode);
    });
});
//# sourceMappingURL=admin-menu-colors.js.map