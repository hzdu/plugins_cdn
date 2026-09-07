/* global jQuery, asenhaCfgroupRelationshipQe */
/**
 * CFG relationship field — Quick Edit / Bulk Edit Select2 multi + AJAX search.
 *
 * Uses a hidden CSV input (Select2 v3 AJAX multi pattern), same as Placement Rules.
 */
(function ($) {
	'use strict';

	var settings = (typeof asenhaCfgroupRelationshipQe === 'object' && asenhaCfgroupRelationshipQe)
		? asenhaCfgroupRelationshipQe
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

	function parsePostTypes($field) {
		var raw = $field.attr('data-post-types') || '[]';
		try {
			var parsed = JSON.parse(raw);
			return Array.isArray(parsed) ? parsed.map(String) : [];
		} catch (e) {
			return [];
		}
	}

	function parseLimit($field, attr) {
		var raw = $field.attr(attr);
		if (null === raw || typeof raw === 'undefined' || '' === String(raw).trim()) {
			return 0;
		}
		var n = parseInt(raw, 10);
		return isNaN(n) || n < 0 ? 0 : n;
	}

	function formatItem(item) {
		if (!item || (typeof item.id === 'undefined' && 0 !== item.id)) {
			return item && item.text ? escapeHtml(item.text) : '';
		}

		var label = item.post_type_label ? String(item.post_type_label) : '';
		var title = typeof item.text === 'undefined' || null === item.text ? '' : String(item.text);
		var html = '';

		if (label) {
			html += '<span class="asenha-cfgroup-qe-rel-type">' + escapeHtml(label) + '</span>';
		}
		html += '<span class="asenha-cfgroup-qe-rel-title">' + escapeHtml(title) + '</span>';

		return html;
	}

	function showError($field, message) {
		var $error = $field.find('.asenha-cfgroup-qe-relationship-error, .asenha-cfgroup-be-relationship-error');
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
	 * @return {Array<{id:string,text:string,post_type_label:string}>}
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
				post_type_label: opt.post_type_label ? String(opt.post_type_label) : ''
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
				data.push({ id: id, text: id, post_type_label: '' });
			}
		});

		return data;
	}

	/**
	 * Populate and (re)initialize a relationship Select2 on a hidden CSV input.
	 *
	 * @param {jQuery} $input Hidden relationship input.
	 * @param {Object} data   Column JSON: { ids, options, … }.
	 */
	function populateRelationshipInput($input, data) {
		if (!$input.length || typeof $.fn.select2 !== 'function') {
			return;
		}

		var $field = $input.closest('.asenha-cfgroup-qe-field-relationship, .asenha-cfgroup-be-field-relationship');
		var options = (data && Array.isArray(data.options)) ? data.options : [];
		var idsCsv = (data && typeof data.ids !== 'undefined' && null !== data.ids) ? String(data.ids) : '';
		var initData = buildInitData(idsCsv, options);
		var postTypes = parsePostTypes($field);
		var limitMax = parseLimit($field, 'data-limit-max');

		destroySelect2($input);
		$input.val(idsCsv);
		showError($field, '');

		var select2Opts = {
			multiple: true,
			width: '100%',
			placeholder: getI18n('placeholder', 'Search posts…'),
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
						action: 'asenha_cfgroup_qe_search_posts',
						nonce: settings.nonce,
						q: term,
						page: page || 1,
						post_types: JSON.stringify(postTypes)
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

		$input.off('select2-selecting.asenhaRelQe').on('select2-selecting.asenhaRelQe', function (e) {
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

		$input.off('change.asenhaRelQe').on('change.asenhaRelQe', function () {
			showError($field, '');
		});
	}

	/**
	 * Normalize column JSON for relationship.
	 *
	 * @param {*} value Raw column value.
	 * @return {{ids:string,options:Array}}
	 */
	function normalizeRelationshipValue(value) {
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
	 * Init / repopulate all relationship fields in a Quick Edit row.
	 *
	 * @param {jQuery} $editRow Quick Edit row.
	 * @param {Object} values   Map of fieldId → column JSON.
	 * @param {Function} resolveValue Resolver matching quick-edit.js.
	 */
	window.asenhaCfgroupPopulateRelationshipQe = function ($editRow, values, resolveValue) {
		$editRow.find('input.asenha-cfgroup-qe-relationship').each(function () {
			var $input = $(this);
			var fieldId = String($input.data('field-id'));
			var value = (typeof resolveValue === 'function')
				? resolveValue(values, fieldId)
				: (values[fieldId] || '');
			populateRelationshipInput($input, normalizeRelationshipValue(value));
		});
	};

	/**
	 * Validate limit_min on open Quick Edit rows before save.
	 *
	 * @return {boolean} False when validation fails.
	 */
	window.asenhaCfgroupValidateRelationshipQe = function () {
		var ok = true;
		var $row = $('tr.inline-edit-row:visible');

		if (!$row.length) {
			return true;
		}

		$row.find('.asenha-cfgroup-qe-field-relationship').each(function () {
			var $field = $(this);
			var $input = $field.find('input.asenha-cfgroup-qe-relationship');
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
	window.asenhaCfgroupDestroyRelationshipQe = function ($editRow) {
		$editRow.find('input.asenha-cfgroup-qe-relationship').each(function () {
			destroySelect2($(this));
		});
	};

	/**
	 * Initialize empty relationship Select2 controls in Bulk Edit Replace panels.
	 *
	 * @param {jQuery} $scope Bulk Edit row or field wrap.
	 */
	window.asenhaCfgroupInitRelationshipBe = function ($scope) {
		$scope = $scope && $scope.length ? $scope : $('#bulk-edit');
		$scope.find('input.asenha-cfgroup-be-relationship').each(function () {
			var $input = $(this);
			if ($input.prop('disabled')) {
				return;
			}
			populateRelationshipInput($input, { ids: '', options: [] });
		});
	};

	/**
	 * Validate limit_min on Bulk Edit relationship fields in Replace mode.
	 *
	 * @return {boolean} False when validation fails.
	 */
	window.asenhaCfgroupValidateRelationshipBe = function () {
		var ok = true;
		var $row = $('#bulk-edit');

		if (!$row.length || !$row.is(':visible')) {
			return true;
		}

		$row.find('.asenha-cfgroup-be-field-relationship').each(function () {
			var $field = $(this);
			var $mode = $field.find('.asenha-cfgroup-be-mode').first();
			var $input = $field.find('input.asenha-cfgroup-be-relationship');
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
	window.asenhaCfgroupDestroyRelationshipBe = function ($scope) {
		$scope = $scope && $scope.length ? $scope : $('#bulk-edit');
		$scope.find('input.asenha-cfgroup-be-relationship').each(function () {
			destroySelect2($(this));
		});
	};
}(jQuery));
