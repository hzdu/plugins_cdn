/* global jQuery, wp, cfgFileL10n, cfgroupValidationI18n */
/**
 * CFG file field media picker (meta-box, taxonomy, Quick Edit).
 */
(function ($) {
	'use strict';

	$(function () {
		var cfgroup_frame;
		var cfgroup_invalid_file_message =
			(window.cfgFileL10n && cfgFileL10n.invalidFile)
				? cfgFileL10n.invalidFile
				: 'This file type is not allowed.';

		function cfgroup_get_allowed_mimes($wrapper) {
			var allowedMimes = [];

			try {
				allowedMimes = JSON.parse($wrapper.attr('data-allowed-mimes') || '[]');
			} catch (e) {
				allowedMimes = [];
			}

			return allowedMimes;
		}

		function cfgroup_get_allowed_extensions($wrapper) {
			var extensions = [];

			try {
				extensions = JSON.parse($wrapper.attr('data-allowed-extensions') || '[]');
			} catch (e) {
				extensions = [];
			}

			return extensions;
		}

		function cfgroup_get_library_type($wrapper) {
			var mode = $wrapper.attr('data-allowed-mime-mode') || 'all';
			var fileType = $wrapper.attr('data-file-type') || 'file';
			var allowedMimes = cfgroup_get_allowed_mimes($wrapper);

			if ('selected' === mode) {
				return allowedMimes.length ? allowedMimes : null;
			}

			switch (fileType) {
				case 'image':
					return 'image';
				case 'audio':
					return 'audio';
				case 'video':
					return 'video';
				case 'pdf':
					return 'application/pdf';
				case 'file':
				default:
					return null;
			}
		}

		function cfgroup_destroy_file_frame() {
			if (!cfgroup_frame) {
				return;
			}

			cfgroup_frame.close();

			if (wp.media.frames.cfgroup_frame) {
				delete wp.media.frames.cfgroup_frame;
			}

			cfgroup_frame = null;
		}

		function cfgroup_attachment_mime_is_allowed($wrapper, mime) {
			var mode = $wrapper.attr('data-allowed-mime-mode') || 'all';
			var allowedMimes = cfgroup_get_allowed_mimes($wrapper);

			if ('selected' === mode && !allowedMimes.length) {
				return false;
			}

			if (!allowedMimes.length) {
				return false;
			}

			return -1 !== allowedMimes.indexOf(mime);
		}

		function cfgroup_show_file_validation_error($field, message) {
			$field.addClass('cfgroup-validation-error');

			if ($field.find('.error').length < 1) {
				$field.append('<div class="error"></div>');
			}

			$field.find('.error').html(message).show();

			if ($('#cfgroup-validation-admin-notice').length) {
				$('#cfgroup-validation-admin-notice').show();
			}
		}

		function cfgroup_clear_file_validation_error($field) {
			$field.removeClass('cfgroup-validation-error');
			$field.find('.error').hide();
		}

		$(document).on(
			'click',
			'.cfgroup_input .media.button.add, #addtag .media.button.add, #edittag .media.button.add, .inline-edit-row .asenha-cfgroup-qe-field-file .media.button.add, .inline-edit-row .asenha-cfgroup-be-field-file .media.button.add',
			function () {
				var $button = $(this);
				var $field = $button.closest('.field, .asenha-cfgroup-qe-field-file, .asenha-cfgroup-be-field-file');
				var $wrapper = $button.closest('.cfgroup_file_input');
				var mode = $wrapper.attr('data-allowed-mime-mode') || 'all';
				var allowedMimes = cfgroup_get_allowed_mimes($wrapper);
				var allowedExtensions = cfgroup_get_allowed_extensions($wrapper);
				var libraryType = cfgroup_get_library_type($wrapper);
				var mediaArgs;
				var noExtensionsMessage;

				cfgroup_clear_file_validation_error($field);

				if ('selected' === mode && (!allowedMimes.length || !allowedExtensions.length)) {
					noExtensionsMessage = cfgroup_invalid_file_message;

					if (typeof cfgroupValidationI18n !== 'undefined' && cfgroupValidationI18n.invalid_file_none) {
						noExtensionsMessage = cfgroupValidationI18n.invalid_file_none;
					}

					cfgroup_show_file_validation_error($field, noExtensionsMessage);
					return;
				}

				cfgroup_destroy_file_frame();

				mediaArgs = {
					className: 'media-frame cfgroup_frame',
					frame: 'post',
					multiple: false,
					library: {}
				};

				if (libraryType) {
					mediaArgs.library.type = libraryType;
				}

				cfgroup_frame = wp.media.frames.cfgroup_frame = wp.media(mediaArgs);

				cfgroup_frame.on('insert', function () {
					var attachment = cfgroup_frame.state().get('selection').first().toJSON();
					var imageSize = $wrapper.attr('data-image-preview-size') || 'medium';
					var file_url;

					if (!cfgroup_attachment_mime_is_allowed($wrapper, attachment.mime)) {
						cfgroup_show_file_validation_error($field, cfgroup_invalid_file_message);
						return;
					}

					cfgroup_clear_file_validation_error($field);

					if ('image' == attachment.type && 'undefined' != typeof attachment.sizes) {
						file_url = attachment.sizes.full.url;
						if ('undefined' != typeof attachment.sizes.thumbnail && 'thumbnail' == imageSize) {
							file_url = attachment.sizes.thumbnail.url;
						}
						if ('undefined' != typeof attachment.sizes.medium && 'medium' == imageSize) {
							file_url = attachment.sizes.medium.url;
						}
						file_url = '<img src="' + file_url + '" />';
					} else {
						file_url = '<a href="' + attachment.url + '" target="_blank">' + attachment.filename + '</a>';
					}
					$wrapper.attr('data-selected-mime', attachment.mime || '');
					$button.hide();
					$button.siblings('.media.button.remove').removeClass('hidden').show();
					$button.siblings('.file_value').val(attachment.id).trigger('change');
					$button.siblings('.file_url').html(file_url);
				});

				cfgroup_frame.once('uploader:ready', function () {
					var extensions = cfgroup_get_allowed_extensions($wrapper);
					var uploader;

					if (!extensions.length) {
						return;
					}

					uploader = cfgroup_frame.uploader && cfgroup_frame.uploader.uploader && cfgroup_frame.uploader.uploader.uploader;

					if (!uploader) {
						return;
					}

					uploader.setOption('filters', {
						mime_types: [{
							title: 'Allowed files',
							extensions: extensions.join(',')
						}]
					});
					uploader.setOption('multi_selection', false);

					if (allowedMimes.length) {
						uploader.setOption('multipart_params', $.extend({}, uploader.getOption('multipart_params') || {}, {
							cfgroup_allowed_mimes: allowedMimes.join(',')
						}));

						if (cfgroup_frame.uploader && cfgroup_frame.uploader.options && cfgroup_frame.uploader.options.uploader) {
							cfgroup_frame.uploader.options.uploader.params = cfgroup_frame.uploader.options.uploader.params || {};
							cfgroup_frame.uploader.options.uploader.params.cfgroup_allowed_mimes = allowedMimes.join(',');
						}
					}
				});

				cfgroup_frame.open();
				cfgroup_frame.content.mode('upload');
			}
		);

		$(document).on(
			'click',
			'.cfgroup_input .media.button.remove, #addtag .media.button.remove, #edittag .media.button.remove, .inline-edit-row .asenha-cfgroup-qe-field-file .media.button.remove, .inline-edit-row .asenha-cfgroup-be-field-file .media.button.remove',
			function () {
				var $wrapper = $(this).closest('.cfgroup_file_input');
				var $field = $(this).closest('.field, .asenha-cfgroup-qe-field-file, .asenha-cfgroup-be-field-file');

				$wrapper.attr('data-selected-mime', '');
				$(this).siblings('.file_url').html('');
				$(this).siblings('.file_value').val('').trigger('change');
				$(this).siblings('.media.button.add').removeClass('hidden').show();
				$(this).addClass('hidden').hide();
				cfgroup_clear_file_validation_error($field);
			}
		);
	});
}(jQuery));
