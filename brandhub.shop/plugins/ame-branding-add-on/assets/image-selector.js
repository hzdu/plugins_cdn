'use strict';

jQuery(function ($) {
	var mediaFrame = null,
		$currentImageSelector = null;

	//The "Select Image" button.
	$('.ame-image-selector .ame-select-image').on('click', function (event) {
		event.preventDefault();
		$currentImageSelector = $(this).closest('.ame-image-selector');

		//If the media frame already exists, reopen it.
		if (mediaFrame) {
			mediaFrame.open();
			return;
		}

		//Initialise the media frame.
		mediaFrame = wp.media({
			title: 'Select Image',
			button: {
				text: 'Select Image'
			},
			library: {
				type: 'image'
			},
			multiple: false  //Only select one image.
		});

		//Save the choice the user clicks the select button.
		mediaFrame.on('select', function () {

			//Get media attachment details from the frame.
			var attachment = mediaFrame.state().get('selection').first().toJSON();

			//Store the attachment ID.
			$currentImageSelector.find('input.ame-image-attachment-id').val(attachment.id);

			//Display the image.
			var $preview = $currentImageSelector.find('.ame-image-preview');
			$preview.find('.ame-image-preview-placeholder').hide();
			$preview.find('img').remove();
			$preview.append($('<img src="" alt="Image preview">').attr('src', attachment.url));

			//Clear the external URL.
			$currentImageSelector.find('.ame-external-image-url').val('');
			$currentImageSelector.find('.ame-external-image-url-preview').hide();

			//Show the "remove image" link.
			$currentImageSelector.find('.ame-remove-image-link').show();

			$currentImageSelector.trigger('admin-menu-editor:media-image-selected');
		});

		//Open the modal.
		mediaFrame.open();
	});

	//The "Remove Image" link.
	$('.ame-image-selector .ame-remove-image-link').on('click', function (event) {
		event.preventDefault();
		$currentImageSelector = $(this).closest('.ame-image-selector');

		//Remove the preview and show a placeholder instead.
		var $preview = $currentImageSelector.find('.ame-image-preview');
		$preview.find('img').remove();
		$preview.find('.ame-image-preview-placeholder').show();

		//Clear attachment data.
		$currentImageSelector.find('input.ame-image-attachment-id').val(0);

		//Clear the external URL.
		$currentImageSelector.find('.ame-external-image-url').val('');
		$currentImageSelector.find('.ame-external-image-url-preview').hide();

		//Hide the "remove image" link.
		$(this).hide();

		$currentImageSelector.trigger('admin-menu-editor:media-image-removed');
	});

	//The "Set External URL" button.
	$('.ame-image-selector .ame-set-external-image-url').on('click', function (event) {
		event.preventDefault();
		$currentImageSelector = $(this).closest('.ame-image-selector');

		var basicUrlValidator = /^(?:https?:\/\/)(?:[-\w]+)(?:\.[-\w]+)*(:\d{1,6})?\/./;

		var $urlField = $currentImageSelector.find('.ame-external-image-url');
		var oldUrl = $urlField.val();
		var newUrl = window.prompt('Please enter the image URL:', oldUrl);
		if ((newUrl === null) || (newUrl === '')) {
			//The user cancelled the prompt or left it empty. Do nothing.
			return;
		} else if (!basicUrlValidator.test(newUrl)) {
			alert('Sorry, that doesn\'t look like a fully qualified image URL.');
			return;
		}

		//Update and display the URL.
		$urlField.val(newUrl);
		$currentImageSelector.find('.ame-external-image-url-preview').show();

		//Display the image.
		var $preview = $currentImageSelector.find('.ame-image-preview');
		$preview.find('.ame-image-preview-placeholder').hide();
		$preview.find('img').remove();
		$preview.append($('<img  src="" alt="Image preview">').attr('src', newUrl));

		//Clear the attachment ID.
		$currentImageSelector.find('input.ame-image-attachment-id').val(0);

		//Show the "remove image" link.
		$currentImageSelector.find('.ame-remove-image-link').show();

		$currentImageSelector.trigger('admin-menu-editor:external-image-selected');
	});
});
