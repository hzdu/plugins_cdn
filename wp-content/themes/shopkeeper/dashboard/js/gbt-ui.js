(function (window) {
	'use strict';

	var spinnerHtml = '<span class="gbt-btn-spinner" aria-hidden="true"></span>';

	function loadingLabel(text) {
		return spinnerHtml + '<span>' + text + '</span>';
	}

	function setButtonBusy(btn, label, isBusy, mode) {
		if (!btn) {
			return;
		}

		btn.disabled = !!isBusy;
		btn.setAttribute('aria-busy', isBusy ? 'true' : 'false');
		btn.classList.toggle('gbt-btn-loading', !!isBusy);

		// Icon-only: keep the same button, spin the existing SVG.
		if (mode === 'icon') {
			btn.classList.toggle('gbt-btn-spinning', !!isBusy);
			return;
		}

		if (isBusy) {
			if (!btn.getAttribute('data-gbt-default-html')) {
				btn.setAttribute('data-gbt-default-html', btn.innerHTML);
			}
			btn.innerHTML = loadingLabel(label || 'Please wait…');
			return;
		}

		var defaultHtml = btn.getAttribute('data-gbt-default-html');
		if (defaultHtml) {
			btn.innerHTML = defaultHtml;
		}
	}

	function bindBusySubmit(root) {
		var scope = root && root.querySelectorAll ? root : document;
		scope.querySelectorAll('form[data-gbt-busy-submit]').forEach(function (form) {
			var btn = form.querySelector('button[type="submit"]');
			if (!btn) {
				return;
			}

			form.addEventListener('submit', function (e) {
				if (form.getAttribute('data-gbt-busy') === '1') {
					e.preventDefault();
					return;
				}

				form.setAttribute('data-gbt-busy', '1');
				var mode = form.hasAttribute('data-gbt-busy-icon') ? 'icon' : 'label';
				setButtonBusy(btn, form.getAttribute('data-gbt-busy-label') || 'Please wait…', true, mode);

				var disableSel = form.getAttribute('data-gbt-busy-disable-input');
				if (disableSel) {
					var input = form.querySelector(disableSel);
					if (input) {
						var hidden = document.createElement('input');
						hidden.type = 'hidden';
						hidden.name = input.name;
						hidden.value = input.value;
						form.appendChild(hidden);
						input.disabled = true;
					}
				}
			});
		});
	}

	window.gbtUi = {
		spinnerHtml: spinnerHtml,
		loadingLabel: loadingLabel,
		setButtonBusy: setButtonBusy,
		bindBusySubmit: bindBusySubmit,
	};
})(window);
