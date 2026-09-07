(function ($) {
	'use strict';

	var cfg = window.gbtLicenseConverter || {};
	var ui = window.gbtUi || {};
	var $form = $('#gbt-convert-license-form');
	if (!$form.length) {
		return;
	}

	var $btn = $('#gbt-convert-license-submit');
	var $error = $('#gbt-convert-license-error');
	var $status = $('#gbt-convert-license-status');
	var $confirmModal = $('#gbt-confirm-email-modal');
	var $confirmEmail = $('#gbt-confirm-email-value');
	var $confirmSubmit = $('#gbt-confirm-email-submit');
	var $confirmClose = $confirmModal.find('[data-gbt-confirm-email-close]');
	var $confirmEdit = $('#gbt-confirm-email-edit');
	var $overlay = $('#gbt-tf-email-overlay');
	var $overlayEmail = $('#gbt_tf_overlay_email');
	var $overlaySubmit = $('#gbt-tf-overlay-submit');
	var $overlayError = $('#gbt-tf-overlay-error');
	var $formEmail = $('#gbt_tf_email');
	var defaultLabel = $btn.html();
	var confirmDefaultLabel = $confirmSubmit.length ? $confirmSubmit.html() : '';
	var overlayDefaultLabel = $overlaySubmit.length ? $overlaySubmit.html() : '';
	var pending = null;
	var lastFocus = null;
	var busy = false;

	function loadingLabel(text) {
		return ui.loadingLabel ? ui.loadingLabel(text) : text;
	}

	function setBusy(isBusy) {
		busy = !!isBusy;

		$btn.prop('disabled', busy).attr('aria-busy', busy ? 'true' : 'false');
		$confirmSubmit.prop('disabled', busy).attr('aria-busy', busy ? 'true' : 'false');
		$overlaySubmit.prop('disabled', busy).attr('aria-busy', busy ? 'true' : 'false');
		$confirmClose.prop('disabled', busy);
		if ($confirmEdit.length) {
			$confirmEdit.prop('disabled', busy).prop('hidden', busy);
			if (busy) {
				$confirmEdit.css('display', 'none');
			} else {
				$confirmEdit.css('display', '');
			}
		}
		$formEmail.prop('disabled', busy);
		$overlayEmail.prop('disabled', busy);

		[$btn, $confirmSubmit, $overlaySubmit].forEach(function ($el) {
			if (!$el.length) {
				return;
			}
			$el.toggleClass('gbt-btn-loading', busy);
		});

		if (busy) {
			var label = cfg.convertingText || 'Converting…';
			$btn.html(loadingLabel(label));
			$confirmSubmit.html(loadingLabel(label));
			$overlaySubmit.html(loadingLabel(label));
			$status.removeClass('hidden').text(label);
			if ($overlay.length) {
				$overlay.attr('aria-busy', 'true');
			}
			if ($confirmModal.length) {
				$confirmModal.attr('aria-busy', 'true');
			}
		} else {
			$btn.html(defaultLabel);
			if (confirmDefaultLabel) {
				$confirmSubmit.html(confirmDefaultLabel);
			}
			if (overlayDefaultLabel) {
				$overlaySubmit.html(overlayDefaultLabel);
			}
			$status.addClass('hidden').text('');
			if ($overlay.length) {
				$overlay.attr('aria-busy', 'false');
			}
			if ($confirmModal.length) {
				$confirmModal.attr('aria-busy', 'false');
			}
		}
	}

	function showError(message) {
		$error
			.removeClass('hidden')
			.css('white-space', 'pre-wrap')
			.text(message || cfg.errorText || 'Conversion failed.');
		if ($overlayError.length) {
			$overlayError
				.removeClass('hidden')
				.text(message || cfg.errorText || 'Conversion failed.');
		}
	}

	function clearError() {
		$error.addClass('hidden').text('');
		if ($overlayError.length) {
			$overlayError.addClass('hidden').text('');
		}
	}

	function focusEmailInput($el) {
		if (!$el || !$el.length || $el.prop('disabled')) {
			return false;
		}
		var el = $el.get(0);
		if (!el) {
			return false;
		}
		el.focus();
		var len = (el.value || '').length;
		if (typeof el.setSelectionRange === 'function') {
			el.setSelectionRange(len, len);
		}
		return true;
	}

	function focusEmailField() {
		var overlayVisible = $overlay.length && !$overlay.hasClass('hidden');
		if (overlayVisible && focusEmailInput($overlayEmail)) {
			return;
		}
		focusEmailInput($formEmail);
	}

	function openConfirmModal(email) {
		if (!$confirmModal.length) {
			return false;
		}
		lastFocus = document.activeElement;
		$confirmEmail.text(email);
		$confirmModal.removeClass('hidden').attr('aria-hidden', 'false');
		document.body.style.overflow = 'hidden';
		$confirmSubmit.trigger('focus');
		return true;
	}

	function closeConfirmModal() {
		if (!$confirmModal.length || busy) {
			return;
		}
		$confirmModal.addClass('hidden').attr('aria-hidden', 'true');
		document.body.style.overflow = '';
		if (lastFocus && typeof lastFocus.focus === 'function') {
			lastFocus.focus();
		}
	}

	function runConversion(purchaseCode, email) {
		if (busy) {
			return;
		}

		// Consume pending immediately so a second confirm click cannot re-fire.
		pending = null;
		setBusy(true);

		$.ajax({
			url: cfg.ajaxurl || (window.ajaxurl || ''),
			method: 'POST',
			dataType: 'json',
			data: {
				action: cfg.action || 'gbt_convert_tf_license',
				nonce: cfg.nonce || '',
				purchase_code: purchaseCode,
				email: email
			}
		})
			.done(function (res) {
				if (res && res.success && res.data && res.data.redirect) {
					window.location.href = res.data.redirect;
					return;
				}
				var msg = (res && res.data && res.data.message) ? res.data.message : (cfg.errorText || 'Conversion failed.');
				setBusy(false);
				closeConfirmModal();
				showError(msg);
			})
			.fail(function (xhr) {
				var msg = cfg.errorText || 'Conversion failed.';
				if (xhr.responseJSON && xhr.responseJSON.data && xhr.responseJSON.data.message) {
					msg = xhr.responseJSON.data.message;
				}
				setBusy(false);
				closeConfirmModal();
				showError(msg);
			});
	}

	function startMigrationWithEmail(email) {
		if (busy) {
			return;
		}

		clearError();

		email = $.trim(email || '');

		if (!email) {
			showError(cfg.emailRequiredText || 'Email is required.');
			focusEmailField();
			return;
		}

		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			showError(cfg.emailInvalidText || 'Please enter a valid email address.');
			focusEmailField();
			return;
		}

		var purchaseCode = $.trim($('#gbt_tf_purchase_code').val() || '');
		if (!purchaseCode) {
			showError(cfg.requiredText || 'Purchase code and email are required.');
			return;
		}

		$formEmail.val(email);

		pending = { purchaseCode: purchaseCode, email: email };

		if (!openConfirmModal(email)) {
			runConversion(purchaseCode, email);
		}
	}

	$form.on('submit', function (e) {
		e.preventDefault();
		if (busy) {
			return;
		}
		var emailEl = $formEmail[0];
		if (emailEl && !emailEl.checkValidity()) {
			emailEl.reportValidity();
			return;
		}
		startMigrationWithEmail($formEmail.val());
	});

	if ($overlay.length) {
		$overlaySubmit.on('click', function () {
			if (busy) {
				return;
			}
			var emailEl = $overlayEmail[0];
			if (emailEl && !emailEl.checkValidity()) {
				emailEl.reportValidity();
				return;
			}
			startMigrationWithEmail($overlayEmail.val());
		});

		$overlayEmail.on('keydown', function (e) {
			if (e.key === 'Enter') {
				e.preventDefault();
				if (busy) {
					return;
				}
				var emailEl = $overlayEmail[0];
				if (emailEl && !emailEl.checkValidity()) {
					emailEl.reportValidity();
					return;
				}
				startMigrationWithEmail($overlayEmail.val());
			}
		});
	}

	$confirmSubmit.on('click', function () {
		if (busy || !pending) {
			return;
		}
		runConversion(pending.purchaseCode, pending.email);
	});

	$confirmModal.on('click', '[data-gbt-confirm-email-close]', function () {
		if (busy) {
			return;
		}
		pending = null;
		closeConfirmModal();
	});

	$(document).on('keydown', function (e) {
		if (e.key === 'Escape' && $confirmModal.length && !$confirmModal.hasClass('hidden')) {
			if (busy) {
				return;
			}
			pending = null;
			closeConfirmModal();
		}
	});
})(jQuery);
