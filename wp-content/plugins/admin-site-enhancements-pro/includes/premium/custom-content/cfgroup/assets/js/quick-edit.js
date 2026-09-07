/* global inlineEditPost, jQuery, CFG, tinymce, wp */
(function ($) {
	'use strict';

	function asenhaCfgroupResolveValue(values, fieldId) {
		if (Object.prototype.hasOwnProperty.call(values, fieldId)) {
			return values[fieldId];
		}
		var numericId = parseInt(fieldId, 10);
		if (Object.prototype.hasOwnProperty.call(values, numericId)) {
			return values[numericId];
		}
		return '';
	}

	function asenhaCfgroupNormalizeArray(value) {
		if (Array.isArray(value)) {
			return value.map(String);
		}
		if (null === value || typeof value === 'undefined' || '' === value) {
			return [];
		}
		return [String(value)];
	}

	function asenhaCfgroupNormalizeHyperlink(value) {
		if (value && typeof value === 'object' && !Array.isArray(value)) {
			return {
				url: typeof value.url === 'undefined' || null === value.url ? '' : String(value.url),
				text: typeof value.text === 'undefined' || null === value.text ? '' : String(value.text),
				target: value.target ? String(value.target) : 'none'
			};
		}
		return { url: '', text: '', target: 'none' };
	}

	function asenhaCfgroupNormalizeMap(value) {
		if (value && typeof value === 'object' && !Array.isArray(value)) {
			return {
				address: typeof value.address === 'undefined' || null === value.address ? '' : String(value.address),
				latitude: typeof value.latitude === 'undefined' || null === value.latitude ? '' : String(value.latitude),
				longitude: typeof value.longitude === 'undefined' || null === value.longitude ? '' : String(value.longitude),
				zoom: typeof value.zoom === 'undefined' || null === value.zoom ? '' : String(value.zoom)
			};
		}
		return { address: '', latitude: '', longitude: '', zoom: '' };
	}

	function asenhaCfgroupNormalizeFile(value) {
		if (value && typeof value === 'object' && !Array.isArray(value)) {
			return {
				id: typeof value.id === 'undefined' || null === value.id ? '' : String(value.id),
				preview: typeof value.preview === 'undefined' || null === value.preview ? '' : String(value.preview),
				mime: typeof value.mime === 'undefined' || null === value.mime ? '' : String(value.mime)
			};
		}
		if (null === value || typeof value === 'undefined' || '' === value) {
			return { id: '', preview: '', mime: '' };
		}
		return { id: String(value), preview: '', mime: '' };
	}

	function asenhaCfgroupNormalizeGallery(value) {
		if (value && typeof value === 'object' && !Array.isArray(value)) {
			return {
				ids: typeof value.ids === 'undefined' || null === value.ids ? '' : String(value.ids),
				preview: typeof value.preview === 'undefined' || null === value.preview ? '' : String(value.preview)
			};
		}
		if (null === value || typeof value === 'undefined' || '' === value) {
			return { ids: '', preview: '' };
		}
		return { ids: String(value), preview: '' };
	}

	function asenhaCfgroupInitColorPickers($editRow) {
		if (typeof $.fn.colorPicker !== 'function') {
			return;
		}

		$editRow.find('.asenha-cfgroup-qe-input.color').each(function () {
			var $input = $(this);
			if ($input.hasClass('ready')) {
				return;
			}
			$input.addClass('ready').colorPicker({
				animationSpeed: 0
			});
		});
	}

	/**
	 * Ensure wpLink editor textarea IDs are unique on the cloned Quick Edit row.
	 *
	 * @param {jQuery} $editRow Quick Edit row.
	 * @param {string|number} postId Post ID.
	 */
	function asenhaCfgroupUniqueHyperlinkEditorIds($editRow, postId) {
		$editRow.find('.cfgroup-hyperlink-wplink').each(function () {
			var $container = $(this);
			var fieldId = String($container.find('.asenha-cfgroup-qe-input.link-url').data('field-id') || '');
			var editorId = 'asenha-cfgroup-qe-wplink-' + postId + '-' + fieldId;
			$container.attr('data-editor-id', editorId);
			$container.find('.cfgroup-hyperlink-wplink-editor').attr('id', editorId);
		});
	}

	/**
	 * Remove TinyMCE instances inside a Quick Edit row.
	 *
	 * Strips orphaned TinyMCE chrome left by cloning an already-initialized
	 * #inline-edit template, then restores a clean pending textarea shell.
	 *
	 * @param {jQuery} $scope Row or document scope.
	 */
	function asenhaCfgroupDestroyWysiwyg($scope) {
		if (!$scope || !$scope.length) {
			return;
		}

		$scope.find('textarea.asenha-cfgroup-qe-input[data-field-type="wysiwyg"]').each(function () {
			var $textarea = $(this);
			var id = $textarea.attr('id');
			var $pending = $textarea.closest('.cfg-wysiwyg-pending, .cfg-wysiwyg-initialized');

			if (id && window.wp && window.wp.editor && typeof window.wp.editor.remove === 'function') {
				window.wp.editor.remove(id);
			} else if (id && window.tinymce) {
				window.tinymce.execCommand('mceRemoveEditor', false, id);
			}

			// Prefer scoped cleanup inside the field shell (avoids wrong match on duplicate IDs).
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
	 * Prepare wysiwyg textareas and initialize TinyMCE via CFG helper.
	 *
	 * @param {jQuery} $editRow Quick Edit row.
	 * @param {string|number} postId Post ID.
	 */
	function asenhaCfgroupInitWysiwyg($editRow, postId) {
		$editRow.find('textarea.asenha-cfgroup-qe-input[data-field-type="wysiwyg"]').each(function () {
			var $textarea = $(this);
			var fieldId = String($textarea.data('field-id') || '');
			var editorId = 'asenha-cfgroup-qe-wysi-' + postId + '-' + fieldId;
			var $pending = $textarea.closest('.cfg-wysiwyg-pending, .cfg-wysiwyg-initialized');

			$textarea.attr('id', editorId);
			if ($pending.length) {
				$pending.removeClass('cfg-wysiwyg-initialized').addClass('cfg-wysiwyg-pending');
			}
		});

		if (window.CFG && typeof window.CFG.refreshWysiwygInContext === 'function') {
			window.requestAnimationFrame(function () {
				window.CFG.refreshWysiwygInContext($editRow, {
					preserveFocus: true,
					skipEditorShow: true
				});
			});
		}
	}

	/**
	 * Copy TinyMCE content into QE wysiwyg textareas before serialize/save.
	 */
	function asenhaCfgroupSyncWysiwyg() {
		$('textarea.asenha-cfgroup-qe-input[data-field-type="wysiwyg"]').each(function () {
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

	function asenhaCfgroupQuickEditInit() {
		if (typeof inlineEditPost === 'undefined' || !inlineEditPost || typeof inlineEditPost.edit !== 'function') {
			return;
		}

		if (inlineEditPost._asenhaCfgroupQePatched) {
			return;
		}
		inlineEditPost._asenhaCfgroupQePatched = true;

		var originalEdit = inlineEditPost.edit;
		var originalSave = inlineEditPost.save;

		inlineEditPost.edit = function (id) {
			var args = [].slice.call(arguments);
			originalEdit.apply(this, args);

			if (typeof id === 'object') {
				id = this.getId(id);
			}

			var editRow = $('#edit-' + id);
			var postRow = $('#post-' + id);
			var dataEl = postRow.find('.asenha-cfgroup-qe-data');
			var raw = dataEl.attr('data-cfgroup-qe') || '{}';
			var values = {};

			try {
				values = JSON.parse(raw);
			} catch (e) {
				values = {};
			}

			var processedMulti = {};

			asenhaCfgroupDestroyWysiwyg(editRow);
			if (typeof window.asenhaCfgroupDestroyRelationshipQe === 'function') {
				window.asenhaCfgroupDestroyRelationshipQe(editRow);
			}
			if (typeof window.asenhaCfgroupDestroyTermQe === 'function') {
				window.asenhaCfgroupDestroyTermQe(editRow);
			}
			asenhaCfgroupUniqueHyperlinkEditorIds(editRow, id);

			editRow.find('.asenha-cfgroup-qe-input').each(function () {
				var $input = $(this);
				var fieldId = String($input.data('field-id'));
				var fieldType = $input.data('field-type');
				var value = asenhaCfgroupResolveValue(values, fieldId);

				if ('true_false' === fieldType) {
					$input.prop('checked', 0 < parseInt(value, 10));
					return;
				}

				if ('radio' === fieldType) {
					$input.prop('checked', String($input.val()) === String(value));
					return;
				}

				if ('checkbox' === fieldType || 'select_multiple' === fieldType) {
					if (processedMulti[fieldId]) {
						return;
					}
					processedMulti[fieldId] = true;

					var selected = asenhaCfgroupNormalizeArray(value);
					editRow.find('.asenha-cfgroup-qe-input').filter(function () {
						return String($(this).data('field-id')) === fieldId;
					}).each(function () {
						var $box = $(this);
						$box.prop('checked', -1 !== selected.indexOf(String($box.val())));
					});
					return;
				}

				if ('hyperlink' === fieldType) {
					var link = asenhaCfgroupNormalizeHyperlink(value);
					var subkey = String($input.data('subkey') || '');
					if (Object.prototype.hasOwnProperty.call(link, subkey)) {
						$input.val(link[subkey]);
					} else {
						$input.val('');
					}
					return;
				}

				if ('map' === fieldType) {
					var mapVal = asenhaCfgroupNormalizeMap(value);
					var mapSub = String($input.data('subkey') || '');
					if (Object.prototype.hasOwnProperty.call(mapVal, mapSub)) {
						$input.val(mapVal[mapSub]);
					} else {
						$input.val('');
					}
					return;
				}

				if ('file' === fieldType) {
					var file = asenhaCfgroupNormalizeFile(value);
					var $wrapper = $input.closest('.cfgroup_file_input');
					var $add = $wrapper.find('.media.button.add');
					var $remove = $wrapper.find('.media.button.remove');

					$input.val(file.id);
					$wrapper.find('.file_url').html(file.preview);
					$wrapper.attr('data-selected-mime', file.mime || '');

					if (file.id) {
						$add.addClass('hidden').hide();
						$remove.removeClass('hidden').show();
					} else {
						$remove.addClass('hidden').hide();
						$add.removeClass('hidden').show();
					}
					return;
				}

				if ('gallery' === fieldType) {
					var gallery = asenhaCfgroupNormalizeGallery(value);
					var $gallery = $input.closest('.cfgroup_gallery');
					var $gAdd = $gallery.find('.cfg-button');
					var $gEdit = $gallery.find('.cfg-edit-gallery');
					var $gClear = $gallery.find('.cfg-clear-gallery');

					$input.val(gallery.ids);
					$gallery.find('.gallery-preview').html(gallery.preview);

					if (gallery.ids) {
						$gAdd.addClass('hidden');
						$gEdit.removeClass('hidden');
						$gClear.removeClass('hidden');
					} else {
						$gAdd.removeClass('hidden');
						$gEdit.addClass('hidden');
						$gClear.addClass('hidden');
					}
					return;
				}

				if ('relationship' === fieldType) {
					// Populated after the loop via asenhaCfgroupPopulateRelationshipQe.
					return;
				}

				if ('term' === fieldType) {
					// Populated after the loop via asenhaCfgroupPopulateTermQe.
					return;
				}

				if ('user' === fieldType) {
					// Populated after the loop via asenhaCfgroupPopulateUserQe.
					return;
				}

				$input.val(null === value || typeof value === 'undefined' ? '' : value);
			});

			asenhaCfgroupInitColorPickers(editRow);
			$(document).trigger('asenha-cfgroup-hyperlink-refresh', [editRow]);
			asenhaCfgroupInitWysiwyg(editRow, id);
			if (typeof window.asenhaCfgMapInit === 'function') {
				editRow.find('.cfgroup-map').each(function () {
					var $wrap = $(this);
					var inst = $wrap.data('map-instance');
					if (inst && typeof inst.destroy === 'function') {
						inst.destroy();
					}
					$wrap.removeData('map-instance');
				});
				window.asenhaCfgMapInit(editRow);
				setTimeout(function () {
					// Only active panes have layout; inactive tabs invalidate on show.
					var $activePanes = editRow.find('.asenha-cfgroup-qe-tab-pane.active');
					if (typeof window.asenhaCfgMapInvalidateIn === 'function') {
						if ($activePanes.length) {
							$activePanes.each(function () {
								window.asenhaCfgMapInvalidateIn(this);
							});
						} else {
							window.asenhaCfgMapInvalidateIn(editRow);
						}
					} else if (typeof window.asenhaCfgMapInvalidate === 'function') {
						window.asenhaCfgMapInvalidate();
					}
				}, 100);
			}
			if (typeof window.asenhaCfgroupPopulateRelationshipQe === 'function') {
				window.asenhaCfgroupPopulateRelationshipQe(editRow, values, asenhaCfgroupResolveValue);
			}
			if (typeof window.asenhaCfgroupPopulateTermQe === 'function') {
				window.asenhaCfgroupPopulateTermQe(editRow, values, asenhaCfgroupResolveValue);
			}
			if (typeof window.asenhaCfgroupPopulateUserQe === 'function') {
				window.asenhaCfgroupPopulateUserQe(editRow, values, asenhaCfgroupResolveValue);
			}
		};

		// Sync TinyMCE into textareas before WP serializes the Quick Edit row.
		if (typeof originalSave === 'function') {
			inlineEditPost.save = function () {
				asenhaCfgroupSyncWysiwyg();
				if (typeof window.asenhaCfgroupValidateRelationshipQe === 'function') {
					if (!window.asenhaCfgroupValidateRelationshipQe()) {
						return false;
					}
				}
				if (typeof window.asenhaCfgroupValidateTermQe === 'function') {
					if (!window.asenhaCfgroupValidateTermQe()) {
						return false;
					}
				}
				if (typeof window.asenhaCfgroupValidateUserQe === 'function') {
					if (!window.asenhaCfgroupValidateUserQe()) {
						return false;
					}
				}
				return originalSave.apply(this, arguments);
			};
		}

		// Safety: init picker on focus if a cloned row lost the ready flag.
		$(document).on('focus', '.asenha-cfgroup-qe-input.color', function () {
			var $input = $(this);
			if ($input.hasClass('ready') || typeof $.fn.colorPicker !== 'function') {
				return;
			}
			$input.addClass('ready').colorPicker({
				animationSpeed: 0
			});
		});

		$(document).on('click', '.asenha-cfgroup-qe-tab', function (e) {
			e.preventDefault();
			var $tab = $(this);
			var tabKey = String($tab.data('tab') || '');
			var $fieldset = $tab.closest('fieldset.asenha-cfgroup-qe');

			if (!$fieldset.length || !tabKey) {
				return;
			}

			$fieldset.find('.asenha-cfgroup-qe-tab').removeClass('active').attr('aria-selected', 'false');
			$tab.addClass('active').attr('aria-selected', 'true');

			$fieldset.find('.asenha-cfgroup-qe-tab-pane').each(function () {
				var $pane = $(this);
				if (String($pane.data('tab') || '') === tabKey) {
					$pane.addClass('active').prop('hidden', false);
					// Leaflet/Google maps init at 0×0 while pane was display:none.
					setTimeout(function () {
						if (typeof window.asenhaCfgMapInvalidateIn === 'function') {
							window.asenhaCfgMapInvalidateIn($pane);
						}
					}, 50);
				} else {
					$pane.removeClass('active').prop('hidden', true);
				}
			});
		});

		$(document).on('click', '.inline-edit-row .inline-edit-save .cancel', function () {
			var $row = $(this).closest('tr.inline-edit-row');
			asenhaCfgroupDestroyWysiwyg($row);
			if (typeof window.asenhaCfgroupDestroyRelationshipQe === 'function') {
				window.asenhaCfgroupDestroyRelationshipQe($row);
			}
			if (typeof window.asenhaCfgroupDestroyTermQe === 'function') {
				window.asenhaCfgroupDestroyTermQe($row);
			}
			if (typeof window.asenhaCfgroupDestroyUserQe === 'function') {
				window.asenhaCfgroupDestroyUserQe($row);
			}
			$row.find('.cfgroup-map').each(function () {
				var $wrap = $(this);
				var inst = $wrap.data('map-instance');
				if (inst && typeof inst.destroy === 'function') {
					inst.destroy();
				}
				$wrap.removeData('map-instance');
			});
		});
	}

	if (typeof inlineEditPost !== 'undefined' && inlineEditPost) {
		asenhaCfgroupQuickEditInit();
	} else {
		$(asenhaCfgroupQuickEditInit);
	}
}(jQuery));
