'use strict';
import { AmeCustomizable } from '../../pro-customizables/assets/customizable.js';
import { AmeAdminCustomizerBase } from './admin-customizer-base.js';
import { AmeStyleGenerator } from '../../style-generator/style-generator.js';
//Compatibility note: This script is not compatible with IE11 because it uses some
//modern JS features like the URLSearchParams class.
var AmeAdminCustomizerPreview;
(function (AmeAdminCustomizerPreview) {
    var ThrottledPreviewRegistry = AmeCustomizable.ThrottledPreviewRegistry;
    const $ = jQuery;
    class PreviewHandler extends AmeAdminCustomizerBase.AdminCustomizerBase {
        constructor(scriptData) {
            super(scriptData);
            this.currentPreviewValues = {};
            this.changesetName = scriptData.changesetName;
            this.previewRegistry = new ThrottledPreviewRegistry((settingId, defaultResult) => {
                if (this.currentPreviewValues.hasOwnProperty(settingId)) {
                    return this.currentPreviewValues[settingId];
                }
                //Try the script data. It should have the current value from the changeset.
                if (scriptData.settings.hasOwnProperty(settingId)
                    && scriptData.settings[settingId].hasOwnProperty('value')) {
                    return scriptData.settings[settingId].value;
                }
                return defaultResult;
            });
            this.connection = AmeAcCommunicator.connectToParent({
                'previewSetting': (settingId, value) => {
                    this.currentPreviewValues[settingId] = value;
                    if (!this.previewRegistry.canPreview(settingId)) {
                        return false;
                    }
                    this.previewRegistry.queuePreview(settingId);
                    return true;
                },
                'getCurrentUrl': () => {
                    return window.location.href;
                }
            }, scriptData.allowedCommOrigins, scriptData.isWpDebugEnabled);
            this.connection.promise.then((c) => {
                if (typeof c === 'undefined') {
                    if (console && console.warn) {
                        console.warn('Connection succeeded, but the communicator is undefined. This should be impossible.');
                    }
                    return; //This should never happen.
                }
                //Let the parent know the current URL. The parent might not be able to
                //read it due to cross-domain restrictions, and if there are any redirects,
                //the actual URL might not match the frame src that was set by the parent.
                c.execute('notifyPreviewUrlChanged', window.location.href);
            });
            $(() => {
                this.addPreviewParamsToLinks();
                //Handle clicks on links.
                $(document.body).on('click.ame-ac-preview', 'a', (event) => {
                    return this.handleLinkClick(event);
                });
                //Block form submissions. Theme Customizer supports those, but we don't
                //(at least for now).
                $(document.body).on('submit.ame-ac-preview', 'form', function (event) {
                    event.preventDefault();
                });
            });
            //For convenience, support for StyleGenerator previews is built-in.
            for (const previewConfig of (scriptData.stylePreviewConfigs || [])) {
                const previewInstance = new AmeStyleGenerator.Preview.StyleGeneratorPreview(previewConfig);
                this.previewRegistry.registerPreviewUpdater(previewInstance.getPreviewableSettingIDs(), previewInstance);
            }
        }
        /**
         * Add preview-specific query parameters to all links.
         */
        addPreviewParamsToLinks() {
            const self = this;
            $('a[href]').each(function () {
                const element = this;
                if (!(element instanceof HTMLAnchorElement)) {
                    return;
                }
                const $link = $(this);
                //Don't modify internal anchors like "#abc".
                if (self.isInternalAnchor($link)) {
                    return;
                }
                //Flag and skip non-previewable links.
                if (!self.isPreviewableLink(element)) {
                    $link.addClass('ame-ac-not-previewable');
                    return;
                }
                //Add the preview query parameter(s).
                const params = new URLSearchParams(element.search);
                params.set('ame-ac-preview', '1');
                params.set('ame-ac-changeset', self.changesetName);
                element.search = '?' + params.toString();
            });
        }
        isPreviewableLink(element) {
            return this.isPreviewableUrl(element);
        }
        isInternalAnchor($link) {
            const href = $link.attr('href');
            if (typeof href === 'undefined') {
                return false;
            }
            return (href.substring(0, 1) === '#');
        }
        handleLinkClick(event) {
            const $link = $(event.target).closest('a');
            //Let anchors work as normal.
            if (this.isInternalAnchor($link)) {
                return;
            }
            //Prevent the browser from navigating to non-previewable links.
            const anchorElement = $link.get(0);
            if (!this.isPreviewableLink(anchorElement)) {
                event.preventDefault();
                return;
            }
            //Tell the parent (i.e. the admin customizer) to load the link.
            if (this.connection.isConnected) {
                event.preventDefault();
                this.connection.execute('setPreviewUrl', anchorElement.href);
            }
        }
        // noinspection JSUnusedGlobalSymbols Used in other modules.
        registerPreviewer(settingId, callback) {
            this.previewRegistry.registerPreviewCallback(settingId, callback);
        }
        // noinspection JSUnusedGlobalSymbols Also used in other modules.
        registerPreviewUpdater(settingIds, updater) {
            this.previewRegistry.registerPreviewUpdater(settingIds, updater);
        }
        // noinspection JSUnusedGlobalSymbols
        registerRpcMethod(methodName, handler) {
            this.connection.addRpcMethod(methodName, handler);
        }
    }
    AmeAdminCustomizerPreview.PreviewHandler = PreviewHandler;
    const previewHandler = new PreviewHandler(wsAmeAcPreviewData);
    window['wsAdminCustomizerPreview'] = previewHandler;
    $('body').trigger('adminMenuEditor:acPreviewStart', [previewHandler]);
})(AmeAdminCustomizerPreview || (AmeAdminCustomizerPreview = {}));
//# sourceMappingURL=preview-handler.js.map