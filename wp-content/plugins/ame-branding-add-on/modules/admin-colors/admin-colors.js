/**
 * @namespace wsAmeBrandingColorData
 * @property {string} wsAmeBrandingColorData.previewBaseUrl
 * @property {Array} wsAmeBrandingColorData.colorOrderForPreview
 *
 * @property {_.LoDashStatic} window.wsAmeLodash
 * @property {function} JQuery.fn.wpColorPicker Should be available as long as we're using the built-in WP color picker.
 */
'use strict';

jQuery(function ($) {
	const _ = window.wsAmeLodash;

	let $currentPreview = null,
		$previousPreview = null,
		loadingPreviews = 0,
		$previewButton = $('#ame-color-preview-button'),
		$progressIndicator = $('#ame-color-preview-in-progress'),

		$livePreviewCheckbox = $('#ame-is_live_preview_enabled, .ame-ac-is_live_preview_enabled input[type="checkbox"]'),
		isLivePreviewEnabled = $livePreviewCheckbox.prop('checked'),

		$colorInputs = $('.wrap form input.ame-color-picker');

	function updatePreview() {
		let validColorCount = 0, previewColors = [''], stylesheetUrl, lastSetIndex = -1;

		$colorInputs.each(function () {
			const $input = $(this);
			if ($input.val() !== '') {
				const index = wsAmeBrandingColorData.colorOrderForPreview[$input.data('color-variable')];
				previewColors[index] = $input.val().replace('#', '');
				validColorCount++;
				lastSetIndex = Math.max(lastSetIndex, index);
			}
		});

		if (validColorCount < 1) {
			return false;
		}

		$previewButton.prop('disabled', true);
		$progressIndicator.addClass('is-active');

		previewColors = previewColors.slice(0, lastSetIndex + 1);
		stylesheetUrl = wsAmeBrandingColorData.previewBaseUrl
			+ '&colors=' + encodeURIComponent(previewColors.join('.'));

		if ($currentPreview) {
			$previousPreview = $currentPreview;
		}

		$currentPreview = $(
			'<link/>',
			{
				'id': 'ame-color-preview',
				'rel': 'stylesheet',
				'type': 'text/css',
				'href': stylesheetUrl
			}
		);

		const $nodeToRemove = $previousPreview;
		$currentPreview.on('load', function () {
			if ($nodeToRemove) {
				$nodeToRemove.remove();
			}
			loadingPreviews--;
			$previewButton.prop('disabled', loadingPreviews > 0);
			$progressIndicator.toggleClass('is-active', loadingPreviews > 0);
		});

		loadingPreviews++;
		$currentPreview.appendTo('head');

		return true;
	}

	$previewButton.on('click', function () {
		const hasColors = updatePreview();
		if (!hasColors) {
			alert('Please select at least one color to enable preview');
		}
	});

	const refreshLivePreview = _.throttle(function () {
		if (isLivePreviewEnabled) {
			//When wp-color-picker triggers a "change" or "clear" event, the corresponding input
			//still has the old color value. Let's wait for it to be updated before previewing.
			setTimeout(updatePreview, 30);
		}
	}, 1000, {leading: true, trailing: true});

	$livePreviewCheckbox.on('change', function () {
		isLivePreviewEnabled = $(this).prop('checked');
		refreshLivePreview();

		//When live preview gets turned off, remove the preview style sheet.
		if (!isLivePreviewEnabled && $currentPreview) {
			$currentPreview.remove();
			$currentPreview = null;
		}
	});

	function addColorChangeHandlers() {
		//This must be done *after* color pickers have been initialized.
		const instance = $colorInputs.wpColorPicker('instance');
		if (!instance) {
			setTimeout(addColorChangeHandlers, 100);
			return;
		}

		$colorInputs.wpColorPicker('option', 'change', refreshLivePreview);
		$colorInputs.wpColorPicker('option', 'clear', refreshLivePreview);
	}
	setTimeout(addColorChangeHandlers, 100);

	let $wrapper = $('#ame-admin-colors-wrapper'),
		$advancedOptionsCheckbox = $('#ame-are_advanced_options_visible, .ame-ac-are_advanced_options_visible input[type="checkbox"]'),
		$advancedOptionsLink = $('#ame-branding-toggle-advanced-fields'),
		areAdvancedOptionsVisible = $advancedOptionsCheckbox.prop('checked');

	function refreshAdvancedOptions() {
		$wrapper.toggleClass('ame-advanced-options-visible', areAdvancedOptionsVisible);
		$advancedOptionsCheckbox.prop('checked', areAdvancedOptionsVisible);
		$advancedOptionsLink.text(
			areAdvancedOptionsVisible ? 'Hide advanced options' : 'Show advanced options'
		)
	}

	$advancedOptionsCheckbox.on('change', function () {
		areAdvancedOptionsVisible = $(this).prop('checked');
		refreshAdvancedOptions();
	});
	$advancedOptionsLink.on('click', function () {
		areAdvancedOptionsVisible = !areAdvancedOptionsVisible;
		refreshAdvancedOptions();
		return false;
	});
});