/* global jQuery, wp */
/**
 * CFG gallery field media picker (meta-box, taxonomy, Quick Edit, Bulk Edit).
 */
(function ($) {
	'use strict';

	var selectEditSelector = [
		'.cfgroup_input .cfgroup_gallery .cfg-button',
		'.cfgroup_input .cfgroup_gallery .cfg-edit-gallery',
		'#addtag .cfgroup_gallery .cfg-button',
		'#addtag .cfgroup_gallery .cfg-edit-gallery',
		'#edittag .cfgroup_gallery .cfg-button',
		'#edittag .cfgroup_gallery .cfg-edit-gallery',
		'.inline-edit-row .asenha-cfgroup-qe-field-gallery .cfg-button',
		'.inline-edit-row .asenha-cfgroup-qe-field-gallery .cfg-edit-gallery',
		'.inline-edit-row .asenha-cfgroup-be-field-gallery .cfg-button',
		'.inline-edit-row .asenha-cfgroup-be-field-gallery .cfg-edit-gallery'
	].join(', ');

	var clearSelector = [
		'.cfgroup_input .cfgroup_gallery .cfg-clear-gallery',
		'#addtag .cfgroup_gallery .cfg-clear-gallery',
		'#edittag .cfgroup_gallery .cfg-clear-gallery',
		'.inline-edit-row .asenha-cfgroup-qe-field-gallery .cfg-clear-gallery',
		'.inline-edit-row .asenha-cfgroup-be-field-gallery .cfg-clear-gallery'
	].join(', ');

	function getGalleryValueInput($gallery) {
		var $input = $gallery.find('input.cfg-gallery-value, input.gallery_value').first();

		if ($input.length) {
			return $input;
		}

		return $gallery.find('input[type="hidden"]').first();
	}

	function setGalleryButtons($gallery, hasIds) {
		var $add = $gallery.find('.cfg-button');
		var $edit = $gallery.find('.cfg-edit-gallery');
		var $clear = $gallery.find('.cfg-clear-gallery');

		if (hasIds) {
			$add.addClass('hidden');
			$edit.removeClass('hidden');
			$clear.removeClass('hidden');
		} else {
			$add.removeClass('hidden');
			$edit.addClass('hidden');
			$clear.addClass('hidden');
		}
	}

	$(function () {
		$(document).on('click', selectEditSelector, function (e) {
			var $el = $(this);
			var $gallery = $el.closest('.cfgroup_gallery');
			var $list = $gallery.find('.gallery-preview');
			var $input = getGalleryValueInput($gallery);
			var ids = $input.val() || '';
			var what = $el.hasClass('cfg-edit-gallery') ? 'edit' : 'add';
			var state = ('add' === what && !ids.length) ? 'gallery' : 'gallery-edit';
			var wp_media_frame;

			e.preventDefault();

			if (typeof window.wp === 'undefined' || !window.wp.media || !window.wp.media.gallery) {
				return;
			}

			if ('gallery' === state) {
				wp_media_frame = window.wp.media({
					library: {
						type: 'image'
					},
					frame: 'post',
					state: 'gallery',
					multiple: true
				});

				wp_media_frame.open();
			} else {
				wp_media_frame = window.wp.media.gallery.edit('[gallery ids="' + ids + '"]');

				if ('add' === what) {
					wp_media_frame.setState('gallery-library');
				}
			}

			wp_media_frame.on('update', function (selection) {
				var selectedIds;

				$list.empty();

				selectedIds = selection.models.map(function (attachment) {
					var item = attachment.toJSON();
					var thumb = (item.sizes && item.sizes.thumbnail && item.sizes.thumbnail.url)
						? item.sizes.thumbnail.url
						: item.url;

					$list.append('<div class="preview-image"><img src="' + thumb + '"></div>');

					return item.id;
				});

				$input.val(selectedIds.join(',')).trigger('change');
				setGalleryButtons($gallery, selectedIds.length > 0);
			});
		});

		$(document).on('click', clearSelector, function (e) {
			var $gallery = $(this).closest('.cfgroup_gallery');
			var $list = $gallery.find('.gallery-preview');
			var $input = getGalleryValueInput($gallery);

			e.preventDefault();

			$list.empty();
			$input.val('').trigger('change');
			setGalleryButtons($gallery, false);
		});
	});
}(jQuery));
