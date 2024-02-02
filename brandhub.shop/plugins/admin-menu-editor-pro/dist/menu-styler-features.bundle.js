"use strict";
(self["wsAmeWebpackChunk"] = self["wsAmeWebpackChunk"] || []).push([["menu-styler-features"],{

/***/ "./extras/modules/menu-styler/menu-styler-features.ts":
/*!************************************************************!*\
  !*** ./extras/modules/menu-styler/menu-styler-features.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AmeMenuStylerJsFeatures": () => (/* binding */ AmeMenuStylerJsFeatures)
/* harmony export */ });

var AmeMenuStylerJsFeatures;
(function (AmeMenuStylerJsFeatures) {
    const $ = jQuery;
    class StylerJsFeature {
        constructor(config) {
            this.initialSettings = config.settings;
            this.activeSettings = this.initialSettings;
            this.settingMap = config.settingMap;
            //Note: Subclasses should call `this.update(this.initialSettings)` in their constructor.
            //It is not done here because the subclass constructor may need to do some setup first.
        }
        clearPreview() {
            this.update(this.initialSettings);
        }
        ;
        preview(settingId, value, getSettingValue) {
            const localKey = this.settingMap[settingId];
            if (typeof localKey === 'undefined') {
                if (console.warn) {
                    console.warn('Preview failed: The feature "' + this.getFeatureId()
                        + '" does not use the setting "' + settingId + '".');
                }
                return;
            }
            let newSettings = Object.assign({}, this.activeSettings);
            newSettings[localKey] = value;
            //Get any known but missing settings using the callback.
            for (const settingId in this.settingMap) {
                if (this.settingMap.hasOwnProperty(settingId)) {
                    const localKey = this.settingMap[settingId];
                    if (!newSettings.hasOwnProperty(localKey)) {
                        newSettings[localKey] = getSettingValue(settingId, null);
                    }
                }
            }
            this.update(newSettings);
        }
        update(settings) {
            this.activeSettings = settings;
        }
        /**
         * Get the setting IDs that this feature uses. The feature can preview any of these settings.
         */
        getPreviewableSettingIds() {
            return Object.keys(this.settingMap);
        }
    }
    class CollapseButtonTextFeature extends StylerJsFeature {
        constructor(config) {
            super(config);
            this.originalLabel = null;
            this.update(this.initialSettings);
        }
        update(settings) {
            super.update(settings);
            const $label = $('#adminmenu #collapse-button .collapse-button-label');
            if (this.originalLabel === null) {
                this.originalLabel = $label.text();
            }
            if ((typeof settings['label'] === 'undefined') || (settings.label === '') || (settings.label === null)) {
                $label.text(this.originalLabel);
            }
            else {
                $label.text(settings.label);
            }
        }
        getFeatureId() {
            return 'CollapseButtonTextFeature';
        }
    }
    AmeMenuStylerJsFeatures.CollapseButtonTextFeature = CollapseButtonTextFeature;
    class MenuLogoFeature extends StylerJsFeature {
        constructor(config) {
            super(config);
            this.$container = null;
            this.$link = null;
            this.$styleElement = null;
            this.logoId = 'ame_ms_admin_menu_logo';
            this.linkId = 'ame_ms_menu_logo_link';
            /*
             * Note: The logo container is set up so that the logo image is inside the content
             * box (i.e. it does not overlap the padding or the margin), but the logo link covers
             * the padding area. This way the user can control the clickable (padding) area and
             * the unclickable (margin) area separately.
             */
            this.staticLogoStyles = [
                'background-size: contain;',
                'background-repeat: no-repeat;',
                'background-position: 0;',
                'background-origin: content-box;',
                'min-height: 10px;',
                'position: relative;',
                'display: block;',
                'box-sizing: content-box;',
            ];
            this.staticLinkCss = `#adminmenu #${this.linkId} {
			display: block;
			position: absolute;
			top: 0; left: 0; right: 0; bottom: 0;
			margin: 0;
			padding: 0;
			background: transparent;
			text-decoration: none;
		}
		#adminmenu #${this.linkId}:hover, #adminmenu #${this.linkId}:focus {
			box-shadow: none;
			transition: none;
			color: transparent;
		}`;
            this.defaultMenuMarginTop = null;
            this.defaultMenuMarginBottom = null;
            this.update(this.initialSettings);
        }
        update(config) {
            super.update(config);
            this.updateFromActiveSettings();
        }
        updateFromActiveSettings() {
            const config = this.activeSettings; //Local reference in case the config changes while loading images.
            const hasBaseImage = this.settingContainsImage(config.baseImage);
            const hasCollapsedImage = this.settingContainsImage(config.collapsedImage);
            if (!hasBaseImage && !hasCollapsedImage) {
                this.removeLogo();
                return;
            }
            this.withLogoImages(config, (baseImageUrl, collapsedImageUrl) => {
                const [$styleElement, $link] = this.getOrCreateElements();
                let baseLogoStyles = [];
                let collapsedLogoStyles = [];
                let hasBaseLogo = false;
                let hasCollapsedLogo = false;
                if (baseImageUrl) {
                    hasBaseLogo = true;
                    baseLogoStyles.push(`background-image: url("${baseImageUrl}");`);
                    const baseHeight = Math.max(config.baseHeight ? config.baseHeight : 10, 10);
                    baseLogoStyles.push(`height: ${baseHeight}px;`);
                }
                else {
                    baseLogoStyles.push('display: none;');
                }
                if (collapsedImageUrl) {
                    hasCollapsedLogo = true;
                    collapsedLogoStyles.push(`background-image: url("${collapsedImageUrl}");`);
                    collapsedLogoStyles.push('display: block;');
                    const collapsedHeight = Math.max(config.collapsedHeight ? config.collapsedHeight : 10, 10);
                    collapsedLogoStyles.push(`height: ${collapsedHeight}px;`);
                }
                else {
                    collapsedLogoStyles.push('display: none;');
                }
                if (config.backgroundColor) {
                    baseLogoStyles.push(`background-color: ${config.backgroundColor};`);
                }
                const linkUrl = (typeof config.linkUrl === 'string') ? config.linkUrl.trim() : '';
                if (linkUrl) {
                    $link.show().attr('href', linkUrl);
                }
                else {
                    $link.hide().removeAttr('href');
                }
                baseLogoStyles.unshift(...this.staticLogoStyles);
                const baseStyle = `#adminmenu #${this.logoId} {\n${baseLogoStyles.join('\n')} }`;
                const collapsedStyle = `.folded #adminmenu #${this.logoId} {\n${collapsedLogoStyles.join('\n')} }`;
                //Remove the top margin from the admin menu when the logo is visible.
                //We also need to let other AME components know that the vertical margin has changed.
                //This affects the "Collapse button position" setting.
                const [, menuMarginBottom] = this.getDefaultVerticalMenuMargins();
                let wrapperCss = `#adminmenuwrap { --ame-ms-menu-margin-bottom: ${menuMarginBottom}px; }`;
                if (hasBaseLogo) {
                    wrapperCss += `body:not(.folded) #adminmenu { margin-top: 0; }\n`;
                    wrapperCss += `body:not(.folded) #adminmenuwrap { --ame-ms-menu-margin-top: 0px; }\n`;
                }
                if (hasCollapsedLogo) {
                    wrapperCss += `.folded #adminmenu { margin-top: 0; }\n`;
                    wrapperCss += `.folded #adminmenuwrap { --ame-ms-menu-margin-top: 0px; }\n`;
                }
                $styleElement.text(baseStyle + "\n" + collapsedStyle + "\n" + this.staticLinkCss + "\n" + wrapperCss);
            });
        }
        settingContainsImage(setting) {
            if (setting === null) {
                return false;
            }
            return !!(((setting.attachmentId !== null) && (setting.attachmentId > 0)) || setting.externalUrl);
        }
        withLogoImages(config, callback) {
            let imageUrls = [
                this.getImageUrl(config.baseImage),
                this.getImageUrl(config.collapsedImage),
            ];
            //Add the logo as quickly as possible to prevent the menu from visibly shifting.
            //Promises are usually asynchronous, so let's avoid them when possible and call
            //the callback immediately if both URLs are already known or invalid.
            if ((typeof imageUrls[0] === 'string') && (typeof imageUrls[1] === 'string')) {
                callback(imageUrls[0], imageUrls[1]);
                return;
            }
            //Assume that ES2020 is not available, so we can't use Promise.allSettled().
            //However, we want to wait for all promises to resolve, even if some fail.
            Promise.all(imageUrls.map((p) => {
                //Convert known values to resolved promises.
                if ((typeof p === 'string') || (p === null)) {
                    return Promise.resolve(p);
                }
                return p.then((value) => (typeof value === 'string') ? value : null, () => null //Convert errors to null.
                );
            })).then((results) => {
                //If the active config has changed, don't apply the results.
                //The URLs that we just loaded might not be relevant any more.
                if (this.activeSettings !== config) {
                    return;
                }
                const [baseImageUrl, collapsedImageUrl] = results;
                callback(baseImageUrl !== null && baseImageUrl !== void 0 ? baseImageUrl : null, collapsedImageUrl !== null && collapsedImageUrl !== void 0 ? collapsedImageUrl : null);
            });
        }
        getOrCreateElements() {
            if (!this.$container) {
                this.$container = $(`<li id="${this.logoId}"></li>`);
                this.$link = $(`<a id="${this.linkId}"></a>`).appendTo(this.$container);
                this.$container.prependTo('#adminmenu');
            }
            if (!this.$styleElement) {
                this.$styleElement = $('<style></style>').appendTo('head');
            }
            return [this.$styleElement, this.$link];
        }
        getImageUrl(imageSetting) {
            if (imageSetting === null) {
                return null;
            }
            const externalUrl = (typeof imageSetting.externalUrl === 'string') ? imageSetting.externalUrl.trim() : '';
            if (externalUrl) {
                return externalUrl;
            }
            const attachmentId = imageSetting.attachmentId || 0;
            //const attachmentSiteId = imageSetting.attachmentSiteId || 0;
            if (attachmentId > 0) {
                //Use the cached attachment URL if possible.
                if (imageSetting.attachmentUrl) {
                    return imageSetting.attachmentUrl;
                }
                //Load the attachment URL from the server.
                if ((typeof wp !== 'undefined') && wp.media && wp.media.attachment) {
                    //Maybe it's already loaded?
                    let attachmentUrl = wp.media.attachment(attachmentId).get('url');
                    if (attachmentUrl) {
                        return attachmentUrl;
                    }
                    const deferredLoader = $.Deferred();
                    wp.media.attachment(attachmentId).fetch().then(
                    //Success
                    (attachment) => {
                        if (attachment && attachment.url) {
                            deferredLoader.resolve(attachment.url);
                        }
                        else {
                            deferredLoader.reject();
                        }
                    }, 
                    //Error
                    () => deferredLoader.reject());
                    return deferredLoader.promise();
                }
            }
            //No image.
            return null;
        }
        getDefaultVerticalMenuMargins() {
            if ((this.defaultMenuMarginTop === null) || (this.defaultMenuMarginBottom === null)) {
                //Get the vertical margins of the admin menu. The value includes the "px" suffix,
                //but parseInt() will ignore it.
                const $adminmenu = $('#adminmenu');
                this.defaultMenuMarginTop = parseInt($adminmenu.css('margin-top'), 10);
                this.defaultMenuMarginBottom = parseInt($adminmenu.css('margin-bottom'), 10);
                if (isNaN(this.defaultMenuMarginTop)) {
                    this.defaultMenuMarginTop = 0;
                }
                if (isNaN(this.defaultMenuMarginBottom)) {
                    this.defaultMenuMarginBottom = 0;
                }
            }
            return [this.defaultMenuMarginTop, this.defaultMenuMarginBottom];
        }
        removeLogo() {
            if (this.$container) {
                this.$container.remove();
                this.$container = null;
                this.$link = null;
            }
            if (this.$styleElement) {
                this.$styleElement.remove();
                this.$styleElement = null;
            }
        }
        getFeatureId() {
            return 'MenuLogoFeature';
        }
    }
    AmeMenuStylerJsFeatures.MenuLogoFeature = MenuLogoFeature;
    //Always initialize the features if their config is available.
    //They work normally on most admin pages, and are used for preview on the settings page.
    AmeMenuStylerJsFeatures.collapseButtonFeature = null;
    AmeMenuStylerJsFeatures.menuLogoFeature = null;
    const collapseButtonFeatureKey = 'ameMenuStyler_collapseButtonTextFt';
    const menuLogoFeatureKey = 'ameMenuStyler_menuLogoFt';
    let isInitialized = false;
    function createFeatureInstances() {
        if (isInitialized) {
            return;
        }
        isInitialized = true;
        //If the script is loaded multiple times, the features might already exist.
        //This can happen because the script is both enqueued normally and imported
        //as a module on the settings page.
        //We want each feature to be initialized only once, so we'll store them
        //in the window object and reuse them.
        if (ameMenuStylerFeatureConfig.collapseButtonText) {
            if (window[collapseButtonFeatureKey]) {
                AmeMenuStylerJsFeatures.collapseButtonFeature = window[collapseButtonFeatureKey];
            }
            else {
                AmeMenuStylerJsFeatures.collapseButtonFeature = new CollapseButtonTextFeature(ameMenuStylerFeatureConfig.collapseButtonText);
                window[collapseButtonFeatureKey] = AmeMenuStylerJsFeatures.collapseButtonFeature;
            }
        }
        if (ameMenuStylerFeatureConfig.menuLogo) {
            if (window[menuLogoFeatureKey]) {
                AmeMenuStylerJsFeatures.menuLogoFeature = window[menuLogoFeatureKey];
            }
            else {
                AmeMenuStylerJsFeatures.menuLogoFeature = new MenuLogoFeature(ameMenuStylerFeatureConfig.menuLogo);
                window[menuLogoFeatureKey] = AmeMenuStylerJsFeatures.menuLogoFeature;
            }
        }
        /**
         * Register the features with the Admin Customizer preview handler, if active.
         *
         * @param {AmeAdminCustomizerPreview.PreviewHandler} previewHandler
         */
        function registerFeaturePreview(previewHandler) {
            //Both features should exist in the AC preview, but let's check just in case.
            if (!AmeMenuStylerJsFeatures.collapseButtonFeature || !AmeMenuStylerJsFeatures.menuLogoFeature) {
                console.warn('Menu Styler: One or more features are not initialized in AC preview.');
                return;
            }
            previewHandler.registerPreviewUpdater(AmeMenuStylerJsFeatures.collapseButtonFeature.getPreviewableSettingIds(), AmeMenuStylerJsFeatures.collapseButtonFeature);
            previewHandler.registerPreviewUpdater(AmeMenuStylerJsFeatures.menuLogoFeature.getPreviewableSettingIds(), AmeMenuStylerJsFeatures.menuLogoFeature);
        }
        if (typeof window['wsAdminCustomizerPreview'] !== 'undefined') {
            registerFeaturePreview(window['wsAdminCustomizerPreview']);
        }
        else {
            $(document).on('adminMenuEditor:acPreviewStart', (event, previewHandler) => {
                registerFeaturePreview(previewHandler);
            });
        }
    }
    //The #adminmenu element must be available before initialization. The DOMContentLoaded event
    //works, but we can better avoid a visible change/FOUC by using a custom event that the plugin
    //triggers immediately after WordPress outputs the admin menu.
    $(document).one('adminMenuEditor:menuDomReady', createFeatureInstances);
    $(createFeatureInstances);
    //Register the features with the menu styler dialog.
    $(document).on('adminMenuEditor:menuStylerUiRegister', function (_unused, vm) {
        if (!vm) {
            return;
        }
        createFeatureInstances();
        if (AmeMenuStylerJsFeatures.collapseButtonFeature) {
            vm.registerPreviewUpdater(AmeMenuStylerJsFeatures.collapseButtonFeature.getPreviewableSettingIds(), AmeMenuStylerJsFeatures.collapseButtonFeature);
        }
        if (AmeMenuStylerJsFeatures.menuLogoFeature) {
            vm.registerPreviewUpdater(AmeMenuStylerJsFeatures.menuLogoFeature.getPreviewableSettingIds(), AmeMenuStylerJsFeatures.menuLogoFeature);
        }
    });
})(AmeMenuStylerJsFeatures || (AmeMenuStylerJsFeatures = {}));


/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__("./extras/modules/menu-styler/menu-styler-features.ts"));
/******/ }
]);
//# sourceMappingURL=menu-styler-features.bundle.js.map