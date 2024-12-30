/**
 * Setting up customizer reset.
 *
 * Used global objects:
 * - wp
 * - ajaxurl
 * - jQuery
 * - customizerResetObj
 */
(function ($) {
	/**
	 * Setup the flow.
	 */
	function init() {
		setupOutput();
	}

	/**
	 * Setup output:
	 * - reset button
	 * - export & import buttons
	 * - import form
	 */
	function setupOutput() {

		$class_name = 'customizer-reset-area customizer-reset-footer';
		if ( customizerResetObj.has_previous ) {
			$class_name = 'customizer-reset-area customizer-reset-footer has-previous-btn';
		}

		var $buttonsWrapper = $('<div class="'+ $class_name +'"></div>');

		var $restoreButton = $(
			'<button name="customizer-restore" class="button-primary customizer-restore-button"><i class="dashicons dashicons-undo"></i>' + customizerResetObj.buttons.restore.text + '</button>'
		);

		var $resetButton = $(
			'<button name="customizer-reset" class="button-primary customizer-reset-button"><i class="dashicons dashicons-trash"></i>' + customizerResetObj.buttons.reset.text + '</button>'
		);

		var $exportButton = $(
			'<a href="' + customizerResetObj.customizerUrl + '?action=customizer_export&nonce=' + customizerResetObj.nonces.export + '" class="button-secondary customizer-export-import customizer-export-link"><i class="dashicons dashicons-download"></i><span class="customizer-export-import-hint">' + customizerResetObj.buttons.export.text + '</span></a>'
		);

		var $importButton = $(
			'<a href="" class="button-secondary customizer-export-import customizer-import-trigger"><i class="dashicons dashicons-upload"></i><span class="customizer-export-import-hint">' + customizerResetObj.buttons.import.text + '</span></a>'
		);

		$resetButton.on('click', resetCustomizer);
		$restoreButton.on('click', restoreCustomizer);
		$importButton.on('click', openImportForm);

		if ( customizerResetObj.has_previous ) {
			$buttonsWrapper.append($restoreButton);
		}

		$buttonsWrapper.append($resetButton);
		$buttonsWrapper.append($exportButton);
		$buttonsWrapper.append($importButton);

		$('#customize-footer-actions').prepend($buttonsWrapper);
		$('.customizer-reset-footer').append(customizerResetObj.importForm.templates);
		$('.customizer-import-form .close').on('click', closeImportForm);
		$('.customizer-import-form').on('submit', showImportWarning);
	}

	/**
	 * Reset customizer.
	 * 
	 * @param Event e Event object.
	 */
	function resetCustomizer(e) {
		e.preventDefault();

		if (!confirm(customizerResetObj.dialogs.resetWarning)) return;

		this.disabled = true;

		$.ajax({
			type: 'post',
			url: ajaxurl,
			data: {
				wp_customize: 'on',
				action: 'customizer_reset',
				nonce: customizerResetObj.nonces.reset
			}
		}).done(function (r) {
			if (!r || !r.success) return;

			wp.customize.state('saved').set(true);
			location.reload();
		}).always(function () {
			this.disabled = false;
		});
	}

	/**
	 * Restore customizer.
	 * 
	 * @param Event e Event object.
	 */
	function restoreCustomizer(e) {
		e.preventDefault();

		if (!confirm(customizerResetObj.dialogs.restoreWarning)) return;

		this.disabled = true;

		$.ajax({
			type: 'post',
			url: ajaxurl,
			data: {
				wp_customize: 'on',
				action: 'customizer_restore',
				nonce: customizerResetObj.nonces.reset
			}
		}).done(function (r) {
			if (!r || !r.success) return;

			wp.customize.state('saved').set(true);
			location.reload();
		}).always(function () {
			this.disabled = false;
		});
	}

	function openImportForm(e) {
		e.preventDefault();
		$('.customizer-import-form').addClass('is-expanded');
	}

	function closeImportForm(e) {
		e.preventDefault();
		$('.customizer-import-form').removeClass('is-expanded');
	}

	function showImportWarning(e) {
		e.preventDefault();

		if (confirm(customizerResetObj.dialogs.importWarning)) this.submit();
	}

	// Start!
	init();

})(jQuery);
