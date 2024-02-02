'use strict';

import {AmeCustomizable, AmeCustomizableViewModel} from '../../pro-customizables/assets/customizable.js';

declare const ameMenuStylerFeatureConfig: AmeMenuStylerJsFeatures.FeatureScriptConfig;

export namespace AmeMenuStylerJsFeatures {
	import PreviewUpdater = AmeCustomizable.PreviewUpdater;
	import SimpleVm = AmeCustomizableViewModel.SimpleVm;
	const $ = jQuery;

	interface FeatureConfig<T extends FeatureSettings> {
		settings: T;
		settingMap: SettingMap<T>;
	}

	interface FeatureSettings {
	}

	interface SettingMap<T extends FeatureSettings> {
		[settingId: string]: keyof T;
	}

	abstract class StylerJsFeature<S extends FeatureSettings> implements PreviewUpdater {
		protected readonly initialSettings: S;
		protected readonly settingMap: SettingMap<S>;

		protected activeSettings: S;

		protected constructor(config: FeatureConfig<S>) {
			this.initialSettings = config.settings;
			this.activeSettings = this.initialSettings;
			this.settingMap = config.settingMap;
			//Note: Subclasses should call `this.update(this.initialSettings)` in their constructor.
			//It is not done here because the subclass constructor may need to do some setup first.
		}

		clearPreview(): void {
			this.update(this.initialSettings);
		};

		preview(settingId: string, value: any, getSettingValue: AmeCustomizable.SettingValueReader): void {
			const localKey = this.settingMap[settingId];
			if (typeof localKey === 'undefined') {
				if (console.warn) {
					console.warn(
						'Preview failed: The feature "' + this.getFeatureId()
						+ '" does not use the setting "' + settingId + '".'
					);
				}
				return;
			}

			let newSettings: S = {...this.activeSettings};
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

		protected update(settings: S): void {
			this.activeSettings = settings;
		}

		/**
		 * Get the setting IDs that this feature uses. The feature can preview any of these settings.
		 */
		getPreviewableSettingIds(): string[] {
			return Object.keys(this.settingMap);
		}

		abstract getFeatureId(): string;
	}

	interface CollapseButtonTextSettings extends FeatureSettings {
		label: string;
	}

	export class CollapseButtonTextFeature extends StylerJsFeature<CollapseButtonTextSettings> {
		protected originalLabel: string | null = null;

		constructor(config: FeatureConfig<CollapseButtonTextSettings>) {
			super(config);
			this.update(this.initialSettings);
		}

		protected update(settings: CollapseButtonTextSettings): void {
			super.update(settings);

			const $label = $('#adminmenu #collapse-button .collapse-button-label');
			if (this.originalLabel === null) {
				this.originalLabel = $label.text();
			}

			if ((typeof settings['label'] === 'undefined') || (settings.label === '') || (settings.label === null)) {
				$label.text(this.originalLabel);
			} else {
				$label.text(settings.label);
			}
		}

		getFeatureId(): string {
			return 'CollapseButtonTextFeature';
		}
	}

	interface ImageSettingValue {
		attachmentId: number | null;
		attachmentSiteId: number | null;
		attachmentUrl: string;
		externalUrl: string | null;
		width: number | null;
		height: number | null;
	}

	interface MenuLogoSettings extends FeatureSettings {
		baseImage: ImageSettingValue | null;
		collapsedImage: ImageSettingValue | null;
		linkUrl: string | null;
		backgroundColor: string | null;
		baseHeight: number | null;
		collapsedHeight: number | null;
	}

	export class MenuLogoFeature extends StylerJsFeature<MenuLogoSettings> {
		protected $container: JQuery | null = null;
		protected $link: JQuery | null = null;
		protected $styleElement: JQuery | null = null;

		private readonly logoId = 'ame_ms_admin_menu_logo';
		private readonly linkId = 'ame_ms_menu_logo_link';

		/*
		 * Note: The logo container is set up so that the logo image is inside the content
		 * box (i.e. it does not overlap the padding or the margin), but the logo link covers
		 * the padding area. This way the user can control the clickable (padding) area and
		 * the unclickable (margin) area separately.
		 */

		private readonly staticLogoStyles = [
			'background-size: contain;',
			'background-repeat: no-repeat;',
			'background-position: 0;',
			'background-origin: content-box;',
			'min-height: 10px;',
			'position: relative;',
			'display: block;',
			'box-sizing: content-box;',
		];

		private readonly staticLinkCss = `#adminmenu #${this.linkId} {
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

		private defaultMenuMarginTop: number | null = null;
		private defaultMenuMarginBottom: number | null = null;

		constructor(config: FeatureConfig<MenuLogoSettings>) {
			super(config);
			this.update(this.initialSettings);
		}

		protected update(config: MenuLogoSettings) {
			super.update(config);
			this.updateFromActiveSettings();
		}

		private updateFromActiveSettings(): void {
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
				} else {
					baseLogoStyles.push('display: none;')
				}
				if (collapsedImageUrl) {
					hasCollapsedLogo = true;
					collapsedLogoStyles.push(`background-image: url("${collapsedImageUrl}");`);
					collapsedLogoStyles.push('display: block;');

					const collapsedHeight = Math.max(config.collapsedHeight ? config.collapsedHeight : 10, 10);
					collapsedLogoStyles.push(`height: ${collapsedHeight}px;`);
				} else {
					collapsedLogoStyles.push('display: none;');
				}

				if (config.backgroundColor) {
					baseLogoStyles.push(`background-color: ${config.backgroundColor};`);
				}

				const linkUrl = (typeof config.linkUrl === 'string') ? config.linkUrl.trim() : '';
				if (linkUrl) {
					$link.show().attr('href', linkUrl);
				} else {
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

		private settingContainsImage(setting: ImageSettingValue | null): boolean {
			if (setting === null) {
				return false;
			}
			return !!(((setting.attachmentId !== null) && (setting.attachmentId > 0)) || setting.externalUrl);
		}

		private withLogoImages(
			config: MenuLogoSettings,
			callback: (baseImageUrl: string | null, collapsedImageUrl: string | null) => void
		): void {
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
			Promise.all(
				imageUrls.map((p) => {
					//Convert known values to resolved promises.
					if ((typeof p === 'string') || (p === null)) {
						return Promise.resolve(p);
					}

					return p.then(
						(value) => (typeof value === 'string') ? value : null,
						() => null //Convert errors to null.
					) as JQueryPromise<string | null>;
				})
			).then((results) => {
				//If the active config has changed, don't apply the results.
				//The URLs that we just loaded might not be relevant any more.
				if (this.activeSettings !== config) {
					return;
				}

				const [baseImageUrl, collapsedImageUrl] = results;
				callback(baseImageUrl ?? null, collapsedImageUrl ?? null);
			});
		}

		private getOrCreateElements(): [JQuery, JQuery] {
			if (!this.$container) {
				this.$container = $(`<li id="${this.logoId}"></li>`);
				this.$link = $(`<a id="${this.linkId}"></a>`).appendTo(this.$container);
				this.$container.prependTo('#adminmenu');
			}
			if (!this.$styleElement) {
				this.$styleElement = $('<style></style>').appendTo('head');
			}
			return [this.$styleElement, this.$link!];
		}

		private getImageUrl(imageSetting: ImageSettingValue | null): JQueryPromise<string> | string | null {
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

					const deferredLoader = $.Deferred<string>();
					wp.media.attachment(attachmentId).fetch().then(
						//Success
						(attachment: any) => {
							if (attachment && attachment.url) {
								deferredLoader.resolve(attachment.url);
							} else {
								deferredLoader.reject();
							}
						},
						//Error
						() => deferredLoader.reject()
					);
					return deferredLoader.promise();
				}
			}

			//No image.
			return null;
		}

		private getDefaultVerticalMenuMargins(): [number, number] {
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

		private removeLogo(): void {
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

		getFeatureId(): string {
			return 'MenuLogoFeature';
		}
	}

	export interface FeatureScriptConfig {
		collapseButtonText?: FeatureConfig<CollapseButtonTextSettings>;
		menuLogo?: FeatureConfig<MenuLogoSettings>;
	}

	//Always initialize the features if their config is available.
	//They work normally on most admin pages, and are used for preview on the settings page.
	export let collapseButtonFeature: CollapseButtonTextFeature | null = null;
	export let menuLogoFeature: MenuLogoFeature | null = null;
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
				collapseButtonFeature = window[collapseButtonFeatureKey];
			} else {
				collapseButtonFeature = new CollapseButtonTextFeature(ameMenuStylerFeatureConfig.collapseButtonText);
				window[collapseButtonFeatureKey] = collapseButtonFeature;
			}
		}
		if (ameMenuStylerFeatureConfig.menuLogo) {
			if (window[menuLogoFeatureKey]) {
				menuLogoFeature = window[menuLogoFeatureKey];
			} else {
				menuLogoFeature = new MenuLogoFeature(ameMenuStylerFeatureConfig.menuLogo);
				window[menuLogoFeatureKey] = menuLogoFeature;
			}
		}

		/**
		 * Register the features with the Admin Customizer preview handler, if active.
		 *
		 * @param {AmeAdminCustomizerPreview.PreviewHandler} previewHandler
		 */
		function registerFeaturePreview(previewHandler: any) {
			//Both features should exist in the AC preview, but let's check just in case.
			if (!collapseButtonFeature || !menuLogoFeature) {
				console.warn('Menu Styler: One or more features are not initialized in AC preview.');
				return;
			}
			previewHandler.registerPreviewUpdater(
				collapseButtonFeature.getPreviewableSettingIds(),
				collapseButtonFeature
			);
			previewHandler.registerPreviewUpdater(
				menuLogoFeature.getPreviewableSettingIds(),
				menuLogoFeature
			);
		}

		if (typeof window['wsAdminCustomizerPreview'] !== 'undefined') {
			registerFeaturePreview(window['wsAdminCustomizerPreview']);
		} else {
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
	$(document).on(
		'adminMenuEditor:menuStylerUiRegister',
		function (_unused, vm: SimpleVm) {
			if (!vm) {
				return;
			}
			createFeatureInstances();

			if (collapseButtonFeature) {
				vm.registerPreviewUpdater(collapseButtonFeature.getPreviewableSettingIds(), collapseButtonFeature);
			}
			if (menuLogoFeature) {
				vm.registerPreviewUpdater(menuLogoFeature.getPreviewableSettingIds(), menuLogoFeature);
			}
		}
	);
}

declare global {
	interface Window {
		ameMenuStyler_menuLogoFt?: AmeMenuStylerJsFeatures.MenuLogoFeature;
		ameMenuStyler_collapseButtonTextFt?: AmeMenuStylerJsFeatures.CollapseButtonTextFeature;
	}
}