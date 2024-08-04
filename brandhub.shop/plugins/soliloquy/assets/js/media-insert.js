/**
 * Creates and handles a wp.media instance for soliloquy Galleries, allowing
 * the user to insert images from the Media Library into their Gallery
 */
jQuery(document).ready(function ($) {
	// Add Images
	$('a.soliloquy-media-library').on('click', function (e) {
		// Prevent default action
		e.preventDefault();

		// If the wp.media.frames.soliloquy instance already exists, reopen it
		if (wp.media.frames.soliloquy) {
			wp.media.frames.soliloquy.open();

			return;
		} else {
			// Create the wp.media.frames.soliloquy instance (one time)
			wp.media.frames.soliloquy = wp.media({
				frame: 'post',
				title: wp.media.view.l10n.insertIntoPost,
				library: {
					type: ['image'],
				},
				button: {
					text: wp.media.view.l10n.insertIntoPost,
				},
				multiple: true,
			});
		}

		// Mark existing Gallery images as selected when the modal is opened
		wp.media.frames.soliloquy.on('open', function () {
			// Get any previously selected images
			var selection = wp.media.frames.soliloquy
				.state()
				.get('selection');

			if (typeof selection !== 'undefined') {
				// Get images that already exist in the gallery, and select each one in the modal
				$('ul#soliloquy-output li').each(function () {
					var attachment = wp.media.attachment(
						$(this).attr('id'),
					);

					selection.add(attachment ? [attachment] : []);
				});
			}
		});

		//Trigger Event when the frame is ready.
		wp.media.frames.soliloquy.on('ready', function (e) {});
		// Insert into Gallery Button Clicked
		wp.media.frames.soliloquy.on('insert', function (selection) {
			// Get state
			var state = wp.media.frames.soliloquy.state(),
				images = [];

			// Iterate through selected images, building an images array
			selection.each(function (attachment) {
				// Get the chosen options for this image (size, alignment, link type, link URL)
				var display = state.display(attachment).toJSON(),
					type = attachment.get('type');

				// Change the image link parameter based on the "Link To" setting the user chose in the media view
				switch (display.link) {
					case 'none':
						attachment.set('link', '');
						break;
					case 'file':
						attachment.set('link', attachment.get('url'));
						break;
					case 'post':
						// Already linked to post by default
						break;
					case 'custom':
						attachment.set('link', display.linkUrl);
						break;
				}

				//Only allow images selections to be inserted
				if (type === 'image') {
					// Add the image to the images array
					images.push(attachment.toJSON());
				}
			}, this);
			// Send the ajax request with our data to be processed.
			$.post(
				soliloquy_metabox.ajax,
				{
					action: 'soliloquy_insert_slides',
					nonce: soliloquy_metabox.insert_nonce,
					post_id: soliloquy_metabox.id,
					images: JSON.stringify(images),
				},
				function (response) {
					// Response should be a JSON success with the HTML for the image grid
					if (response) {
						// Set the image grid to the HTML we received
						$('#soliloquy-output').html(response.data);

						// Repopulate the Soliloquy Slide Collection
						SoliloquySlidesUpdate();

						$(document).trigger('insertSlides');
					}
				},
				'json',
			);
		});

		// Open the media frame
		wp.media.frames.soliloquy.open();
		// Remove the 'Create Gallery' left hand menu item in the modal, as we don't
		// want users inserting galleries!
		// Remove the 'Create Gallery' left hand menu item in the modal, as we don't
		// want users inserting galleries!
		$('div.media-menu #menu-item-gallery').css('display', 'none');
		$('div.media-menu #menu-item-embed').css('display', 'none');
		$('div.media-menu #menu-item-playlist').css('display', 'none');
		$('div.media-menu #menu-item-video-playlist').css('display', 'none');
		$('div.media-menu #menu-item-featured-image').css('display', 'none');

		return;
	});
});
