'use strict';

//Live preview for the "Custom CSS" setting.

declare const wsAdminCustomizerPreview: any;

declare const wsAmeDsCustomCssPreviewData: {
	settingId: string;
	normalStyleElementId: string;
};

{
	const $ = jQuery;
	let $previewStyle: JQuery|null = null;

	function registerCustomCssPreview() {
		wsAdminCustomizerPreview.registerPreviewer(
			wsAmeDsCustomCssPreviewData.settingId,
			function (newValue: string) {
				//Remove the normal (non-preview) style element if it exists.
				$('#' + wsAmeDsCustomCssPreviewData.normalStyleElementId).remove();

				//Create the preview style element.
				if ($previewStyle === null) {
					$previewStyle = $('<style/>');
					$previewStyle.attr('id', wsAmeDsCustomCssPreviewData.normalStyleElementId + '-preview');
					$previewStyle.appendTo('head');
				}

				//Update the preview style.
				$previewStyle.text(newValue);
			}
		);
	}

	if (typeof wsAdminCustomizerPreview !== 'undefined') {
		registerCustomCssPreview();
	} else {
		jQuery(document).one('adminMenuEditor:acPreviewStart', function () {
			registerCustomCssPreview();
		});
	}
}