/**
 * Custom Field Groups — Bulk Edit UI.
 *
 * Moves CFG fieldsets to full width under #bulk-edit, toggles multi-choice /
 * media / relational Replace mode, tabs, color pickers, and TinyMCE for wysiwyg.
 */
(function ($) {
	'use strict';

	/**
	 * Whether a Bulk Edit field wrap is a Select2 relational type.
	 *
	 * @param {jQuery} $wrap Field wrap.
	 * @return {boolean}
	 */
	function asenhaCfgroupBeIsRelational($wrap) {
		return $wrap.hasClass('asenha-cfgroup-be-field-relationship')
			|| $wrap.hasClass('asenha-cfgroup-be-field-term')
			|| $wrap.hasClass('asenha-cfgroup-be-field-user');
	}

	/**
	 * Destroy Select2 on relational Bulk Edit fields in a scope.
	 *
	 * @param {jQuery} $scope Field wrap or broader scope.
	 */
	function asenhaCfgroupBeDestroyRelational($scope) {
		if (!$scope || !$scope.length) {
			return;
		}

		if (typeof window.asenhaCfgroupDestroyRelationshipBe === 'function') {
			window.asenhaCfgroupDestroyRelationshipBe($scope);
		}
		if (typeof window.asenhaCfgroupDestroyTermBe === 'function') {
			window.asenhaCfgroupDestroyTermBe($scope);
		}
		if (typeof window.asenhaCfgroupDestroyUserBe === 'function') {
			window.asenhaCfgroupDestroyUserBe($scope);
		}
	}

	/**
	 * Initialize Select2 on relational Bulk Edit Replace panels in a scope.
	 *
	 * @param {jQuery} $scope Field wrap, tab pane, or bulk row.
	 */
	function asenhaCfgroupBeInitRelational($scope) {
		if (!$scope || !$scope.length) {
			return;
		}

		if (typeof window.asenhaCfgroupInitRelationshipBe === 'function') {
			window.asenhaCfgroupInitRelationshipBe($scope);
		}
		if (typeof window.asenhaCfgroupInitTermBe === 'function') {
			window.asenhaCfgroupInitTermBe($scope);
		}
		if (typeof window.asenhaCfgroupInitUserBe === 'function') {
			window.asenhaCfgroupInitUserBe($scope);
		}
	}

	/**
	 * Validate relational Bulk Edit Replace fields before form POST.
	 *
	 * @return {boolean}
	 */
	function asenhaCfgroupBeValidateRelational() {
		var ok = true;

		if (typeof window.asenhaCfgroupValidateRelationshipBe === 'function'
			&& !window.asenhaCfgroupValidateRelationshipBe()) {
			ok = false;
		}
		if (typeof window.asenhaCfgroupValidateTermBe === 'function'
			&& !window.asenhaCfgroupValidateTermBe()) {
			ok = false;
		}
		if (typeof window.asenhaCfgroupValidateUserBe === 'function'
			&& !window.asenhaCfgroupValidateUserBe()) {
			ok = false;
		}

		return ok;
	}

	/**
	 * Remove TinyMCE instances inside Bulk Edit wysiwyg fields.
	 *
	 * @param {jQuery} $scope Field wrap or broader scope.
	 */
	function asenhaCfgroupBeDestroyWysiwyg($scope) {
		if (!$scope || !$scope.length) {
			return;
		}

		$scope.find('textarea.asenha-cfgroup-be-input[data-field-type="wysiwyg"]').each(function () {
			var $textarea = $(this);
			var id = $textarea.attr('id');
			var $pending = $textarea.closest('.cfg-wysiwyg-pending, .cfg-wysiwyg-initialized');

			if (id && window.wp && window.wp.editor && typeof window.wp.editor.remove === 'function') {
				window.wp.editor.remove(id);
			} else if (id && window.tinymce) {
				window.tinymce.execCommand('mceRemoveEditor', false, id);
			}

			if ($pending.length) {
				if (id) {
					$pending.find('#wp-' + id + '-wrap').remove();
				}
				$pending.find('.mce-tinymce, .wp-editor-wrap').remove();
				$pending
					.empty()
					.append($textarea)
					.removeClass('cfg-wysiwyg-initialized')
					.addClass('cfg-wysiwyg-pending');
			} else if (id) {
				$('#wp-' + id + '-wrap').remove();
			}
		});
	}

	/**
	 * Initialize TinyMCE for visible Bulk Edit wysiwyg Replace panels.
	 *
	 * @param {jQuery} $scope Field wrap or bulk row.
	 */
	function asenhaCfgroupBeInitWysiwyg($scope) {
		if (!$scope || !$scope.length) {
			return;
		}

		var $fields = $scope.hasClass('asenha-cfgroup-be-field-wysiwyg')
			? $scope
			: $scope.find('.asenha-cfgroup-be-field-wysiwyg');
		var $targets = $fields.find('.asenha-cfgroup-be-replace-panel:not([hidden])');
		if (!$targets.length) {
			return;
		}

		$targets.find('textarea.asenha-cfgroup-be-input[data-field-type="wysiwyg"]').each(function () {
			var $textarea = $(this);
			var fieldId = String($textarea.data('field-id') || '');
			var editorId = 'asenha-cfgroup-be-wysi-' + fieldId;
			var $pending = $textarea.closest('.cfg-wysiwyg-pending, .cfg-wysiwyg-initialized');

			$textarea.attr('id', editorId);
			if ($pending.length) {
				$pending.removeClass('cfg-wysiwyg-initialized').addClass('cfg-wysiwyg-pending');
			}
		});

		if (window.CFG && typeof window.CFG.refreshWysiwygInContext === 'function') {
			window.requestAnimationFrame(function () {
				window.CFG.refreshWysiwygInContext($targets, {
					preserveFocus: true,
					skipEditorShow: true,
					forceBulkEdit: true
				});
			});
		}
	}

	/**
	 * Copy TinyMCE content into Bulk Edit wysiwyg textareas before form POST.
	 */
	function asenhaCfgroupBeSyncWysiwyg() {
		$('#bulk-edit').find('textarea.asenha-cfgroup-be-input[data-field-type="wysiwyg"]').each(function () {
			var id = $(this).attr('id');
			if (!id) {
				return;
			}
			if (window.wp && window.wp.editor && typeof window.wp.editor.save === 'function') {
				window.wp.editor.save(id);
			}
		});

		if (window.tinymce && typeof window.tinymce.triggerSave === 'function') {
			window.tinymce.triggerSave();
		}
	}

	function asenhaCfgroupBeInitColorPickers($scope) {
		if (typeof $.fn.colorPicker !== 'function') {
			return;
		}

		$scope.find('.asenha-cfgroup-be-input.color').each(function () {
			var $input = $(this);
			if ($input.hasClass('ready')) {
				return;
			}
			$input.addClass('ready').colorPicker({
				renderCallback: function ($elm) {
					var $preview = $elm.closest('.asenha-cfgroup-be-color').find('.cfgroup-color-preview');
					if ($preview.length) {
						$preview.css('background-color', $elm.val() || 'transparent');
					}
				}
			});
		});
	}

	function asenhaCfgroupBeInitTabs($scope) {
		$scope.find('.asenha-cfgroup-be-tabs').each(function () {
			var $tabs = $(this);
			var $panes = $tabs.nextAll('.asenha-cfgroup-be-tab-pane');

			$tabs.off('click.asenhaCfgroupBe').on('click.asenhaCfgroupBe', '.asenha-cfgroup-be-tab', function (e) {
				e.preventDefault();
				var $btn = $(this);
				var tab = $btn.data('tab');

				$tabs.find('.asenha-cfgroup-be-tab').removeClass('active').attr('aria-selected', 'false');
				$btn.addClass('active').attr('aria-selected', 'true');

				$panes.each(function () {
					var $pane = $(this);
					if (String($pane.data('tab')) === String(tab)) {
						$pane.addClass('active').prop('hidden', false);
						asenhaCfgroupBeInitWysiwyg($pane);
						asenhaCfgroupBeInitRelational($pane);
					} else {
						$pane.removeClass('active').prop('hidden', true);
					}
				});
			});
		});
	}

	function asenhaCfgroupBeInitMultiMode($scope) {
		$scope.find('.asenha-cfgroup-be-mode').each(function () {
			var $mode = $(this);
			var $wrap = $mode.closest('.asenha-cfgroup-be-field');
			var $panel = $wrap.find('.asenha-cfgroup-be-replace-panel').first();
			var $inputs = $panel.find('input, select, textarea, button');
			var $clearLinks = $panel.find('a.cfg-clear-gallery');
			var isWysiwyg = $wrap.hasClass('asenha-cfgroup-be-field-wysiwyg');
			var isRelational = asenhaCfgroupBeIsRelational($wrap);
			var isMap = $wrap.hasClass('asenha-cfgroup-be-field-map');

			function sync() {
				var isReplace = 'replace' === $mode.val();

				if (!isReplace && isWysiwyg) {
					asenhaCfgroupBeDestroyWysiwyg($wrap);
				}
				if (!isReplace && isRelational) {
					asenhaCfgroupBeDestroyRelational($wrap);
				}
				if (!isReplace && isMap) {
					$wrap.find('.cfgroup-map').each(function () {
						var $mapWrap = $(this);
						var inst = $mapWrap.data('map-instance');
						if (inst && typeof inst.destroy === 'function') {
							inst.destroy();
						}
						$mapWrap.removeData('map-instance');
					});
				}

				$panel.prop('hidden', !isReplace);
				$inputs.prop('disabled', !isReplace);
				$clearLinks.attr('aria-disabled', isReplace ? 'false' : 'true');

				if (isReplace && typeof jQuery !== 'undefined') {
					$(document).trigger('asenha-cfgroup-hyperlink-refresh', [$panel]);
				}

				if (isReplace && isWysiwyg) {
					asenhaCfgroupBeInitWysiwyg($wrap);
				}
				if (isReplace && isRelational) {
					asenhaCfgroupBeInitRelational($wrap);
				}
				if (isReplace && isMap && typeof window.asenhaCfgMapInit === 'function') {
					window.asenhaCfgMapInit($wrap);
					setTimeout(function () {
						if (typeof window.asenhaCfgMapInvalidate === 'function') {
							window.asenhaCfgMapInvalidate();
						}
					}, 100);
				}
			}

			$mode.off('change.asenhaCfgroupBe').on('change.asenhaCfgroupBe', sync);
			sync();
		});
	}

	function asenhaCfgroupBePrepareBulkRow() {
		var $bulkRow = $('#bulk-edit');
		if (!$bulkRow.length) {
			return;
		}

		var $fieldsets = $bulkRow.find('fieldset.asenha-cfgroup-be');
		if (!$fieldsets.length) {
			return;
		}

		var $wrapper = $bulkRow.find('.inline-edit-wrapper').first();
		if ($wrapper.length) {
			var $submit = $wrapper.find('.submit.inline-edit-save').first();

			// Place CFG fieldsets above Update/Cancel (core prints submit last).
			if ($submit.length) {
				$fieldsets.insertBefore($submit);
				// Keep submit last if Tags/other custom boxes also end up after it.
				$submit.appendTo($wrapper);
			} else {
				$fieldsets.appendTo($wrapper);
			}
		}

		asenhaCfgroupBeInitTabs($bulkRow);
		asenhaCfgroupBeInitMultiMode($bulkRow);
		asenhaCfgroupBeInitColorPickers($bulkRow);
	}

	$(function () {
		$('#doaction, #doaction2').on('click', function () {
			var action = $(this).attr('id') === 'doaction'
				? $('#bulk-action-selector-top').val()
				: $('#bulk-action-selector-bottom').val();

			if (action === 'edit') {
				setTimeout(asenhaCfgroupBePrepareBulkRow, 100);
			}
		});

		// Sync TinyMCE + validate relational limits before bulk Update POST.
		$('#posts-filter').on('submit.asenhaCfgroupBe', function (e) {
			if (!$('#bulk-edit').is(':visible')) {
				return;
			}

			asenhaCfgroupBeSyncWysiwyg();

			if (!asenhaCfgroupBeValidateRelational()) {
				e.preventDefault();
				e.stopImmediatePropagation();
			}
		});

		$(document).on('focus', '.asenha-cfgroup-be-input.color', function () {
			var $input = $(this);
			if ($input.hasClass('ready') || typeof $.fn.colorPicker !== 'function') {
				return;
			}
			$input.addClass('ready').colorPicker({
				renderCallback: function ($elm) {
					var $preview = $elm.closest('.asenha-cfgroup-be-color').find('.cfgroup-color-preview');
					if ($preview.length) {
						$preview.css('background-color', $elm.val() || 'transparent');
					}
				}
			});
		});
	});
})(jQuery);
