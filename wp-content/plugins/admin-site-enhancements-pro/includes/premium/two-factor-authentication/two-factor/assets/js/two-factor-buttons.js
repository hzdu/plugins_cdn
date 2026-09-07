/**
 * Two-Factor action button helpers (ASE).
 */
(function($) {
	'use strict';

	const asenhaTwoFactorButtons = {
		showSpinner($btn) {
			if (!$btn || !$btn.length) {
				return;
			}

			$btn.find('.asenha-2fa-btn-checkmark').hide();
			$btn.find('.asenha-2fa-btn-spinner').addClass('is-active').show();
			$btn.prop('disabled', true);
		},
		showCheckmark($btn) {
			if (!$btn || !$btn.length) {
				return;
			}

			$btn.find('.asenha-2fa-btn-spinner').removeClass('is-active').hide();
			$btn.find('.asenha-2fa-btn-checkmark').show();
			$btn.prop('disabled', false);

			setTimeout(() => {
				$btn.find('.asenha-2fa-btn-checkmark').hide();
			}, 1500);
		},
		reset($btn) {
			if (!$btn || !$btn.length) {
				return;
			}

			$btn.find('.asenha-2fa-btn-spinner').removeClass('is-active').hide();
			$btn.find('.asenha-2fa-btn-checkmark').hide();
			$btn.prop('disabled', false);
		}
	};

	window.asenhaTwoFactorButtons = asenhaTwoFactorButtons;

	/**
	 * Ensure a clicked submit button's `name=value` is still submitted even if the
	 * button gets disabled (disabled controls are not submitted).
	 *
	 * @param {Object} $form jQuery object for form element.
	 * @param {Object} $submitter jQuery object for the submitter button/input.
	 */
	const preserveSubmitterNameValue = function($form, $submitter) {
		if (!$form || !$form.length) {
			return;
		}

		// Clear any previous overrides to avoid accidentally submitting stale flags.
		$form.find('input[type="hidden"][data-asenha-2fa-submit-override="1"]').remove();

		if (!$submitter || !$submitter.length) {
			return;
		}

		const submitName = $submitter.attr('name');
		if (!submitName) {
			return;
		}

		let submitValue = $submitter.val();
		if (typeof submitValue === 'undefined' || submitValue === null) {
			submitValue = $submitter.attr('value');
		}
		if (typeof submitValue === 'undefined' || submitValue === null || submitValue === '') {
			submitValue = '1';
		}

		$('<input />', {
			type: 'hidden',
			name: submitName,
			value: submitValue,
			'data-asenha-2fa-submit-override': '1'
		}).appendTo($form);
	};

	const onActionClick = function() {
		const $btn = $(this);
		if ($btn.prop('disabled')) {
			return;
		}

		const isSubmit = $btn.is('button[type="submit"], input[type="submit"]');
		if (isSubmit) {
			const $form = $btn.closest('form');
			if ($form.length) {
				$form.data('asenha2faSubmitter', $btn);
				$form.off('submit.asenha2fa').on('submit.asenha2fa', function(event) {
					const submitter = event?.originalEvent?.submitter;
					const $submitter = submitter ? $(submitter) : $(this).data('asenha2faSubmitter');
					if ($submitter && $submitter.length) {
						preserveSubmitterNameValue($(this), $submitter);
						asenhaTwoFactorButtons.showSpinner($submitter);
					}
				});
			}
			return;
		}

		asenhaTwoFactorButtons.showSpinner($btn);

		const resetDelay = parseInt($btn.data('2faResetDelay'), 10);
		if (!Number.isNaN(resetDelay) && resetDelay > 0) {
			setTimeout(() => {
				asenhaTwoFactorButtons.reset($btn);
			}, resetDelay);
		}
	};

	$(document).on('click', '.asenha-2fa-action-btn', onActionClick);

	$(function() {
		$('[data-2fa-show-checkmark="1"]').each(function() {
			asenhaTwoFactorButtons.showCheckmark($(this));
		});
	});
})(jQuery);
