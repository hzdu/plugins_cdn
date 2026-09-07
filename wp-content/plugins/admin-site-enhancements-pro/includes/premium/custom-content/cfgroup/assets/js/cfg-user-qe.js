/* global jQuery, asenhaCfgroupUserQe */
/**
 * CFG user field — Quick Edit / Bulk Edit Select2 multi + AJAX search.
 *
 * Uses a hidden CSV input (Select2 v3 AJAX multi pattern), same as relationship/term QE.
 * Display: Display Name + faded (username | email).
 */
(function ($) {
	'use strict';

	var settings = (typeof asenhaCfgroupUserQe === 'object' && asenhaCfgroupUserQe)
		? asenhaCfgroupUserQe
		: {
			ajaxUrl: (typeof ajaxurl !== 'undefined') ? ajaxurl : '',
			nonce: '',
			i18n: {}
		};

	function escapeHtml(str) {
		return String(str)
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#039;');
	}

	function getI18n(key, fallback) {
		if (settings.i18n && typeof settings.i18n[key] === 'string') {
			return settings.i18n[key];
		}
		return fallback;
	}

	function parseLimit($field, attr) {
		var raw = $field.attr(attr);
		if (null === raw || typeof raw === 'undefined' || '' === String(raw).trim()) {
			return 0;
		}
		var n = parseInt(raw, 10);
		return isNaN(n) || n < 0 ? 0 : n;
	}

	/**
	 * Format a user option: Display Name + faded (username | email).
	 *
	 * @param {Object} item Select2 item.
	 * @return {string}
	 */
	function formatItem(item) {
		if (!item || (typeof item.id === 'undefined' && 0 !== item.id)) {
			return item && item.text ? escapeHtml(item.text) : '';
		}

		var title = typeof item.text === 'undefined' || null === item.text ? '' : String(item.text);
		var username = item.username ? String(item.username) : '';
		var email = item.email ? String(item.email) : '';
		var html = '<span class="asenha-cfgroup-qe-user-name">' + escapeHtml(title) + '</span>';

		if (username || email) {
			var meta = '(';
			if (username) {
				meta += username;
			}
			if (username && email) {
				meta += ' | ';
			}
			if (email) {
				meta += email;
			}
			meta += ')';
			html += ' <span class="asenha-cfgroup-qe-user-meta">' + escapeHtml(meta) + '</span>';
		}

		return html;
	}

	function showError($field, message) {
		var $error = $field.find('.asenha-cfgroup-qe-user-error, .asenha-cfgroup-be-user-error');
		if (!$error.length) {
			return;
		}
		if (message) {
			$error.text(message).prop('hidden', false).show();
		} else {
			$error.text('').prop('hidden', true).hide();
		}
	}

	function destroySelect2($input) {
		if (!$input.length || typeof $.fn.select2 !== 'function') {
			return;
		}
		if ($input.data('select2')) {
			$input.select2('destroy');
		}
	}

	/**
	 * Build Select2 data objects from column JSON options, ordered by ids CSV.
	 *
	 * @param {string} idsCsv  Comma-separated IDs.
	 * @param {Array}  options Option objects from column JSON.
	 * @return {Array<{id:string,text:string,username:string,email:string}>}
	 */
	function buildInitData(idsCsv, options) {
		var byId = {};
		$.each(options || [], function (i, opt) {
			if (!opt || typeof opt.id === 'undefined') {
				return;
			}
			byId[String(opt.id)] = {
				id: String(opt.id),
				text: opt.text ? String(opt.text) : '',
				username: opt.username ? String(opt.username) : '',
				email: opt.email ? String(opt.email) : ''
			};
		});

		var ids = [];
		if (idsCsv) {
			ids = String(idsCsv).split(',').map(function (id) {
				return String(id).trim();
			}).filter(Boolean);
		}

		var data = [];
		$.each(ids, function (i, id) {
			if (byId[id]) {
				data.push(byId[id]);
			} else {
				data.push({ id: id, text: id, username: '', email: '' });
			}
		});

		return data;
	}

	/**
	 * Populate and (re)initialize a user Select2 on a hidden CSV input.
	 *
	 * @param {jQuery} $input Hidden user input.
	 * @param {Object} data   Column JSON: { ids, options, … }.
	 */
	function populateUserInput($input, data) {
		if (!$input.length || typeof $.fn.select2 !== 'function') {
			return;
		}

		var $field = $input.closest('.asenha-cfgroup-qe-field-user, .asenha-cfgroup-be-field-user');
		var options = (data && Array.isArray(data.options)) ? data.options : [];
		var idsCsv = (data && typeof data.ids !== 'undefined' && null !== data.ids) ? String(data.ids) : '';
		var initData = buildInitData(idsCsv, options);
		var limitMax = parseLimit($field, 'data-limit-max');

		destroySelect2($input);
		$input.val(idsCsv);
		showError($field, '');

		var select2Opts = {
			multiple: true,
			width: '100%',
			placeholder: getI18n('placeholder', 'Search users…'),
			minimumInputLength: 0,
			formatResult: formatItem,
			formatSelection: formatItem,
			escapeMarkup: function (m) {
				return m;
			},
			ajax: {
				url: settings.ajaxUrl,
				type: 'POST',
				dataType: 'json',
				quietMillis: 250,
				data: function (term, page) {
					return {
						action: 'asenha_cfgroup_qe_search_users',
						nonce: settings.nonce,
						q: term,
						page: page || 1
					};
				},
				results: function (response) {
					var results = (response && Array.isArray(response.results)) ? response.results : [];
					var more = !!(response && response.more);
					return {
						results: results,
						more: more
					};
				}
			},
			initSelection: function (element, callback) {
				callback(initData);
			}
		};

		if (limitMax > 0) {
			select2Opts.maximumSelectionSize = limitMax;
			select2Opts.formatSelectionTooBig = function (limit) {
				return getI18n('maxError', 'You can select at most %d item(s).').replace('%d', String(limit));
			};
		}

		$input.select2(select2Opts);

		$input.off('select2-selecting.asenhaUserQe').on('select2-selecting.asenhaUserQe', function (e) {
			if (limitMax < 1) {
				return;
			}
			var selected = $input.select2('data') || [];
			if (selected.length >= limitMax) {
				e.preventDefault();
				showError(
					$field,
					getI18n('maxError', 'You can select at most %d item(s).').replace('%d', String(limitMax))
				);
			}
		});

		$input.off('change.asenhaUserQe').on('change.asenhaUserQe', function () {
			showError($field, '');
		});
	}

	/**
	 * Normalize column JSON for user.
	 *
	 * @param {*} value Raw column value.
	 * @return {{ids:string,options:Array}}
	 */
	function normalizeUserValue(value) {
		if (value && typeof value === 'object' && !Array.isArray(value)) {
			return {
				ids: typeof value.ids === 'undefined' || null === value.ids ? '' : String(value.ids),
				options: Array.isArray(value.options) ? value.options : []
			};
		}
		if (null === value || typeof value === 'undefined' || '' === value) {
			return { ids: '', options: [] };
		}
		return { ids: String(value), options: [] };
	}

	/**
	 * Parse Select2 val() into an ID array (CSV string or array).
	 *
	 * @param {*} val Select2 val.
	 * @return {string[]}
	 */
	function parseSelectedIds(val) {
		if (Array.isArray(val)) {
			return val.map(String).filter(Boolean);
		}
		if (null === val || typeof val === 'undefined' || '' === val) {
			return [];
		}
		return String(val).split(',').map(function (id) {
			return String(id).trim();
		}).filter(Boolean);
	}

	/**
	 * Init / repopulate all user fields in a Quick Edit row.
	 *
	 * @param {jQuery} $editRow Quick Edit row.
	 * @param {Object} values   Map of fieldId → column JSON.
	 * @param {Function} resolveValue Resolver matching quick-edit.js.
	 */
	window.asenhaCfgroupPopulateUserQe = function ($editRow, values, resolveValue) {
		$editRow.find('input.asenha-cfgroup-qe-user').each(function () {
			var $input = $(this);
			var fieldId = String($input.data('field-id'));
			var value = (typeof resolveValue === 'function')
				? resolveValue(values, fieldId)
				: (values[fieldId] || '');
			populateUserInput($input, normalizeUserValue(value));
		});
	};

	/**
	 * Validate limit_min on open Quick Edit rows before save.
	 *
	 * @return {boolean} False when validation fails.
	 */
	window.asenhaCfgroupValidateUserQe = function () {
		var ok = true;
		var $row = $('tr.inline-edit-row:visible');

		if (!$row.length) {
			return true;
		}

		$row.find('.asenha-cfgroup-qe-field-user').each(function () {
			var $field = $(this);
			var $input = $field.find('input.asenha-cfgroup-qe-user');
			var limitMin = parseLimit($field, 'data-limit-min');

			if (limitMin < 1) {
				showError($field, '');
				return;
			}

			var selected = [];
			if ($input.data('select2') && typeof $input.select2 === 'function') {
				selected = parseSelectedIds($input.select2('val'));
			} else {
				selected = parseSelectedIds($input.val());
			}

			if (selected.length < limitMin) {
				showError(
					$field,
					getI18n('minError', 'Select at least %d item(s).').replace('%d', String(limitMin))
				);
				ok = false;
			} else {
				showError($field, '');
			}
		});

		return ok;
	};

	/**
	 * Destroy Select2 instances in a Quick Edit row (cancel / reopen).
	 *
	 * @param {jQuery} $editRow Quick Edit row.
	 */
	window.asenhaCfgroupDestroyUserQe = function ($editRow) {
		$editRow.find('input.asenha-cfgroup-qe-user').each(function () {
			destroySelect2($(this));
		});
	};

	/**
	 * Initialize empty user Select2 controls in Bulk Edit Replace panels.
	 *
	 * @param {jQuery} $scope Bulk Edit row or field wrap.
	 */
	window.asenhaCfgroupInitUserBe = function ($scope) {
		$scope = $scope && $scope.length ? $scope : $('#bulk-edit');
		$scope.find('input.asenha-cfgroup-be-user').each(function () {
			var $input = $(this);
			if ($input.prop('disabled')) {
				return;
			}
			populateUserInput($input, { ids: '', options: [] });
		});
	};

	/**
	 * Validate limit_min on Bulk Edit user fields in Replace mode.
	 *
	 * @return {boolean} False when validation fails.
	 */
	window.asenhaCfgroupValidateUserBe = function () {
		var ok = true;
		var $row = $('#bulk-edit');

		if (!$row.length || !$row.is(':visible')) {
			return true;
		}

		$row.find('.asenha-cfgroup-be-field-user').each(function () {
			var $field = $(this);
			var $mode = $field.find('.asenha-cfgroup-be-mode').first();
			var $input = $field.find('input.asenha-cfgroup-be-user');
			var limitMin = parseLimit($field, 'data-limit-min');

			if ('replace' !== $mode.val()) {
				showError($field, '');
				return;
			}

			if (limitMin < 1) {
				showError($field, '');
				return;
			}

			var selected = [];
			if ($input.data('select2') && typeof $input.select2 === 'function') {
				selected = parseSelectedIds($input.select2('val'));
			} else {
				selected = parseSelectedIds($input.val());
			}

			if (selected.length < limitMin) {
				showError(
					$field,
					getI18n('minError', 'Select at least %d item(s).').replace('%d', String(limitMin))
				);
				ok = false;
			} else {
				showError($field, '');
			}
		});

		return ok;
	};

	/**
	 * Destroy Select2 instances in a Bulk Edit scope.
	 *
	 * @param {jQuery} $scope Bulk Edit row or field wrap.
	 */
	window.asenhaCfgroupDestroyUserBe = function ($scope) {
		$scope = $scope && $scope.length ? $scope : $('#bulk-edit');
		$scope.find('input.asenha-cfgroup-be-user').each(function () {
			destroySelect2($(this));
		});
	};
}(jQuery));
