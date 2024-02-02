'use strict';

import {AmeCustomizable} from '../../pro-customizables/assets/customizable.js';
import {AmeAdminCustomizerBase} from './admin-customizer-base.js';
import {AmeStyleGenerator} from '../../style-generator/style-generator.js';

declare var wsAmeAcPreviewData: AmeAdminCustomizerPreview.PreviewScriptData;

//Compatibility note: This script is not compatible with IE11 because it uses some
//modern JS features like the URLSearchParams class.

namespace AmeAdminCustomizerPreview {
	import ThrottledPreviewRegistry = AmeCustomizable.ThrottledPreviewRegistry;
	const $ = jQuery;

	export interface PreviewScriptData extends AmeAdminCustomizerBase.ScriptData {
		stylePreviewConfigs?: AmeStyleGenerator.Preview.StyleGeneratorPreviewConfig[];
	}

	export class PreviewHandler extends AmeAdminCustomizerBase.AdminCustomizerBase {
		private readonly changesetName: string;
		private readonly connection: ReturnType<typeof AmeAcCommunicator.connectToParent>;

		private readonly previewRegistry: ThrottledPreviewRegistry;
		private readonly currentPreviewValues: Record<string, any> = {};

		constructor(scriptData: PreviewScriptData) {
			super(scriptData);
			this.changesetName = scriptData.changesetName;

			this.previewRegistry = new ThrottledPreviewRegistry(
				(settingId: string, defaultResult: any) => {
					if (this.currentPreviewValues.hasOwnProperty(settingId)) {
						return this.currentPreviewValues[settingId];
					}
					//Try the script data. It should have the current value from the changeset.
					if (
						scriptData.settings.hasOwnProperty(settingId)
						&& scriptData.settings[settingId].hasOwnProperty('value')
					) {
						return scriptData.settings[settingId].value;
					}
					return defaultResult;
				}
			);

			this.connection = AmeAcCommunicator.connectToParent(
				{
					'previewSetting': (settingId: string, value: any) => {
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
				},
				scriptData.allowedCommOrigins,
				scriptData.isWpDebugEnabled
			);

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
				this.previewRegistry.registerPreviewUpdater(
					previewInstance.getPreviewableSettingIDs(),
					previewInstance
				);
			}
		}

		/**
		 * Add preview-specific query parameters to all links.
		 */
		addPreviewParamsToLinks() {
			const self = this;
			$('a[href]').each(function (this: HTMLElement) {
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

		isPreviewableLink(element: HTMLAnchorElement): boolean {
			return this.isPreviewableUrl(element);
		}

		isInternalAnchor($link: JQuery): boolean {
			const href = $link.attr('href');
			if (typeof href === 'undefined') {
				return false;
			}
			return (href.substring(0, 1) === '#');
		}

		handleLinkClick(event: JQueryEventObject) {
			const $link = $(event.target).closest('a');

			//Let anchors work as normal.
			if (this.isInternalAnchor($link)) {
				return;
			}

			//Prevent the browser from navigating to non-previewable links.
			const anchorElement = $link.get(0) as HTMLAnchorElement;
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
		registerPreviewer(settingId: string, callback: (newValue: any) => void) {
			this.previewRegistry.registerPreviewCallback(settingId, callback);
		}

		// noinspection JSUnusedGlobalSymbols Also used in other modules.
		registerPreviewUpdater(settingIds: string[], updater: AmeCustomizable.PreviewUpdater) {
			this.previewRegistry.registerPreviewUpdater(settingIds, updater);
		}

		// noinspection JSUnusedGlobalSymbols
		registerRpcMethod(methodName: string, handler: (...args: any) => any) {
			this.connection.addRpcMethod(methodName, handler);
		}
	}

	const previewHandler = new PreviewHandler(wsAmeAcPreviewData);
	window['wsAdminCustomizerPreview'] = previewHandler;

	$('body').trigger('adminMenuEditor:acPreviewStart', [previewHandler]);
}

declare global {
	interface Window {
		wsAdminCustomizerPreview: AmeAdminCustomizerPreview.PreviewHandler;
	}
}