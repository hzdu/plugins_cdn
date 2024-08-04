/**
 * Handles changing Slider Types, for example from Default to Instagram
 */
(function ($, window, document, soliloquy_metabox) {
	'use strict';

	//Dom Ready
	$(function () {
		// Change the radio checked option and fire the change event when a Gallery Type is clicked
		$('#soliloquy-types-nav').on('click', 'li', function (e) {
			//Return if this is the active class
			if ($(this).hasClass('soliloquy-active')) {
				return;
			}

			$('input[name="_soliloquy[type]"]', $(this))
				.prop('checked', true)
				.trigger('change');
		});

		// Retrieve the settings HTML when the Gallery Type is changed, so the relevent options are displayed
		$(document).on(
			'change',
			'input[name="_soliloquy[type]"]:radio',
			function (e) {
				// Setup some vars
				var soliloquy_spinner = $(
						'#soliloquy-tabs #soliloquy-tab-images .spinner',
					),
					soliloquy_tab_settings = $('#soliloquy-slider-main');

				// Switch the Settings Metabox to the first tab (Images)
				$('a', $('#soliloquy-settings-tabs li').first()).trigger(
					'click',
				);

				// Remove the content from the now displayed tab settings
				$(soliloquy_tab_settings).html('');

				// Display the spinner, so the user knows something is happening
				$(soliloquy_spinner).css('visibility', 'visible');

				// Remove the soliloquy-active class from all Gallery Types
				$(
					'li',
					$(this).closest('#soliloquy-types-nav'),
				).removeClass('soliloquy-active');

				// Add the soliloquy-active class to the chosen Slider Type
				$(this).closest('li').addClass('soliloquy-active');

				// Make an AJAX call to get the content for the tab
				$.ajax({
					type: 'post',
					url: soliloquy_metabox.ajax,
					dataType: 'json',
					data: {
						action: 'soliloquy_change_type',
						post_id: soliloquy_metabox.id,
						type: $(this).val(),
						nonce: soliloquy_metabox.change_nonce,
					},
					success: function (response) {
						// Inject the response into the tab settings area
						$(soliloquy_tab_settings).html(response.html);

						// Fire an event to tell Addons that the Gallery Type has changed.
						// (e.g. Featured Content Addon uses this to initialize some JS with the DOM).
						$(document).trigger('soliloquyType', response);

						// Hide the spinner
						$(soliloquy_spinner).hide();
					},
					error: function (textStatus, errorThrown) {
						// Inject the error message into the tab settings area
						$(soliloquy_tab_settings).html(
							'<div class="error"><p>' +
								textStatus.responseText +
								'</p></div>',
						);

						// Hide the spinner
						$(soliloquy_spinner).hide();
					},
				});
			},
		);
	});
})(jQuery, window, document, soliloquy_metabox);

jQuery(document).ready(function ($) {
	// Delete multiple images from slider
	$('a.soliloquy-slides-delete').click(function (e) {
		//Prevent Default
		e.preventDefault();

		// Bail out if the user does not actually want to remove the image.
		var confirm_delete = confirm(soliloquy_metabox.remove_multiple);
		if (!confirm_delete) {
			return false;
		}

		// Build array of image attachment IDs
		var attach_ids = [];

		//Get all selectd Images
		$('ul#soliloquy-output > li.selected').each(function () {
			attach_ids.push($(this).attr('id'));
		});

		// Prepare our data to be sent via Ajax.
		var remove = {
			action: 'soliloquy_remove_slides',
			attachment_ids: attach_ids,
			post_id: soliloquy_metabox.id,
			nonce: soliloquy_metabox.remove_nonce,
		};

		// Process the Ajax response and output all the necessary data.
		$.post(
			soliloquy_metabox.ajax,
			remove,
			function (response) {
				// Remove each image
				$('ul#soliloquy-output > li.selected').remove();

				//Hide Bulk Actions
				$('.soliloquy-bulk-actions').fadeOut();

				//Uncheck the checkbox
				$('.soliloquy-select-all').prop('checked', false);

				// Refresh the modal view to ensure no items are still checked if they have been removed.
				$('.soliloquy-load-library')
					.attr('data-soliloquy-offset', 0)
					.addClass('has-search')
					.trigger('click');

				// Repopulate the Soliloquy Slide Collection
				SoliloquySlidesUpdate(false);

				//Get Slide Count
				var list = $('#soliloquy-output li').length;

				//Update the slide count text
				$('.soliloquy-count').text(list.toString());

				//If there are no slides
				if (list === 0) {
					//Make sure bulk actions are out of view
					$('.soliloquy-bulk-actions').fadeOut();

					//Fade out Settings header
					$('.soliloquy-slide-header')
						.fadeOut()
						.addClass('soliloquy-hidden');

					//Add Empty Slider Content
					$('#soliloquy-empty-slider')
						.removeClass('soliloquy-hidden')
						.fadeIn();
				}
			},
			'json',
		);
	});

	// Process image removal from a gallery.
	$('#soliloquy-settings-content ').on(
		'click',
		'.soliloquy-remove-slide',
		function (e) {
			e.preventDefault();

			// Bail out if the user does not actually want to remove the image.
			var confirm_delete = confirm(soliloquy_metabox.remove);
			if (!confirm_delete) {
				return;
			}

			// Prepare our data to be sent via Ajax.
			var attach_id = $(this).parent().attr('id'),
				remove = {
					action: 'soliloquy_remove_slide',
					attachment_id: attach_id,
					post_id: soliloquy_metabox.id,
					nonce: soliloquy_metabox.remove_nonce,
				};

			// Process the Ajax response and output all the necessary data.
			$.post(
				soliloquy_metabox.ajax,
				remove,
				function (response) {
					$('#' + attach_id).fadeOut('normal', function () {
						$(this).remove();

						// Refresh the modal view to ensure no items are still checked if they have been removed.
						$('.soliloquy-load-library')
							.attr('data-soliloquy-offset', 0)
							.addClass('has-search')
							.trigger('click');

						// Repopulate the Soliloquy Image Collection
						SoliloquySlidesUpdate(false);

						//Get the slide count
						var list = $('#soliloquy-output li').length;

						//Update Slide Count
						$('.soliloquy-count').text(list.toString());

						if (list === 0) {
							//Make sure bulk actions are out of view
							$('.soliloquy-bulk-actions').fadeOut();

							//Fade out Settings header
							$('.soliloquy-slide-header')
								.fadeOut()
								.addClass('soliloquy-hidden');

							//Add Empty Slider Content
							$('#soliloquy-empty-slider')
								.removeClass('soliloquy-hidden')
								.fadeIn();
						}
					});
				},
				'json',
			);
		},
	);
});

/**
 * Slide Model
 */
var SoliloquySlide = Backbone.Model.extend({
	/**
	 * Defaults
	 * As we always populate this model with existing data, we
	 * leave these blank to just show how this model is structured.
	 */
	defaults: {
		id: '',
		title: '',
		caption: '',
		alt: '',
		link: '',
		type: '',
	},
});

/**
 * Images Collection
 * - Comprises of all slides in an Soliloquy Slider
 * - Each image is represented by an SoliloquySlides Model
 */
var SoliloquySlides = new Backbone.Collection();

/**
 * Modal Window
 */
var SoliloquyModalWindow = new wp.media.view.Modal({
	controller: {
		trigger: function () {},
	},
});

/**
 * View
 */
var SoliloquyView = wp.Backbone.View.extend({
	/**
	 * The Tag Name and Tag's Class(es)
	 */
	id: 'soliloquy-meta-edit',
	tagName: 'div',
	className: 'edit-attachment-frame mode-select hide-menu hide-router',

	/**
	 * Template
	 * - The template to load inside the above tagName element
	 */
	template: wp.template('soliloquy-meta-editor'),

	/**
	 * Events
	 * - Functions to call when specific events occur
	 */
	events: {
		'click .edit-media-header .left': 'loadPreviousItem',
		'click .edit-media-header .right': 'loadNextItem',

		'keyup input': 'updateItem',
		'keyup textarea': 'updateItem',
		'change input': 'updateItem',
		'change textarea': 'updateItem',
		'keyup .CodeMirror': 'updateCode',
		'blur textarea': 'updateItem',

		'change select': 'updateItem',

		'click a.soliloquy-meta-submit': 'saveItem',

		'keyup input#link-search': 'searchLinks',
		'click div.query-results li': 'insertLink',

		'click a.soliloquy-thumbnail': 'insertThumb',
		'click a.soliloquy-thumbnail-delete': 'removeThumb',

		'click button.media-file': 'insertMediaFileLink',
		'click button.attachment-page': 'insertAttachmentPageLink',
	},

	/**
	 * Initialize
	 *
	 * @param object model   SoliloquyImage Backbone Model
	 */
	initialize: function (args) {
		// Define loading and loaded events, which update the UI with what's happening.
		this.on('loading', this.loading, this);
		this.on('loaded', this.loaded, this);

		// Set some flags
		this.is_loading = false;
		this.collection = args.collection;
		this.child_views = args.child_views;
		this.attachment_id = args.attachment_id;
		this.attachment_index = 0;
		this.search_timer = '';

		// Get the model from the collection
		var count = 0;
		this.collection.each(function (model) {
			// If this model's id matches the attachment id, this is the model we want
			if (model.get('id') == this.attachment_id) {
				this.model = model;
				this.attachment_index = count;
				return false;
			}
			// Increment the index count
			count++;
		}, this);
	},
	updateCode: function (e) {
		$model = this.model;

		$textarea = this.$el.find('.soliloquy-html-slide-code');

		$model.set('code', this.editor.getValue(), { silent: true });

		$textarea.text();
	},
	insertThumb: function (e) {
		$model = this.model;

		e.preventDefault();

		// Get input field class name
		var fieldClassName = this.$el.data('field');

		var soliloquy_media_frame = (wp.media.frames.soliloquy_media_frame =
			wp.media({
				className: 'media-frame soliloquy-media-frame',
				frame: 'select',
				multiple: false,
				title: soliloquy_metabox.videoframe,
				library: {
					type: 'image',
				},
				button: {
					text: soliloquy_metabox.videouse,
				},
			}));

		soliloquy_media_frame.on('select', function () {
			// Grab our attachment selection and construct a JSON representation of the model.
			var thumbnail = soliloquy_media_frame
				.state()
				.get('selection')
				.first()
				.toJSON();

			$model.set('src', thumbnail.url, { silent: true });
			jQuery(
				'div.thumbnail > img',
				$parent.find('.media-frame-content'),
			).attr('src', thumbnail.url);
		});

		// Now that everything has been set, let's open up the frame.
		soliloquy_media_frame.open();
	},

	removeThumb: function (e) {
		e.preventDefault();

		$model = this.model;
		$parent = this.$el.parent();

		jQuery(
			'div.thumbnail > img',
			$parent.find('.media-frame-content'),
		).attr('src', '');

		$model.set('src', '', { silent: true });
	},

	/**
	 * Render
	 * - Binds the model to the view, so we populate the view's fields and data
	 */
	render: function () {
		// Get HTML
		this.$el.html(this.template(this.model.attributes));
		// If any child views exist, render them now
		if (this.child_views.length > 0) {
			this.child_views.forEach(function (view) {
				// Init with model
				var child_view = new view({
					model: this.model,
				});

				// Render view within our main view
				this.$el.find('div.addons').append(child_view.render().el);
			}, this);
		}

		// Set caption
		this.$el
			.find('textarea[name=caption]')
			.val(this.model.get('caption'));

		// Init QuickTags on the caption editor
		// Delay is required for the first load for some reason
		setTimeout(function () {
			quicktags({
				id: 'caption',
				buttons: 'strong,em,link,ul,ol,li,close',
			});
			QTags._buttonsInit();
		}, 500);

		// Init Link Searching
		wpLink.init;

		// Enable / disable the buttons depending on the index
		if (this.attachment_index == 0) {
			// Disable left button
			this.$el.find('button.left').addClass('disabled');
		}
		if (this.attachment_index == this.collection.length - 1) {
			// Disable right button
			this.$el.find('button.right').addClass('disabled');
		}

		textarea = this.$el.find('.soliloquy-html-slide-code');

		if (textarea.length) {
			this.editor = CodeMirror.fromTextArea(textarea[0], {
				enterMode: 'keep',
				indentUnit: 4,
				electricChars: false,
				lineNumbers: true,
				lineWrapping: true,
				matchBrackets: true,
				mode: 'php',
				smartIndent: false,
				tabMode: 'shift',
				theme: 'ttcn',
			});
		}

		this.$el.trigger('soliloquyRenderMeta');

		// Return
		return this;
	},

	/**
	 * Tells the view we're loading by displaying a spinner
	 */
	loading: function () {
		// Set a flag so we know we're loading data
		this.is_loading = true;

		// Show the spinner
		this.$el.find('.spinner').css('visibility', 'visible');
	},

	/**
	 * Hides the loading spinner
	 */
	loaded: function (response) {
		// Set a flag so we know we're not loading anything now
		this.is_loading = false;

		// Hide the spinner
		this.$el.find('.spinner').css('visibility', 'hidden');

		// Display the error message, if it's provided
		if (typeof response !== 'undefined') {
			alert(response);
		}
	},

	/**
	 * Load the previous model in the collection
	 */
	loadPreviousItem: function (event) {
		// Save and Update So User Doesn't Have To Press Update Button?
		this.saveItem(event);
		this.updateItem(event);

		// Decrement the index
		this.attachment_index--;

		// Get the model at the new index from the collection
		this.model = this.collection.at(this.attachment_index);

		// Update the attachment_id
		this.attachment_id = this.model.get('id');

		// Re-render the view
		this.render();
	},

	/**
	 * Load the next model in the collection
	 */
	loadNextItem: function (event) {
		// Save and Update So User Doesn't Have To Press Update Button?
		this.saveItem(event);
		this.updateItem(event);

		// Increment the index
		this.attachment_index++;

		// Get the model at the new index from the collection
		this.model = this.collection.at(this.attachment_index);

		// Update the attachment_id
		this.attachment_id = this.model.get('id');

		// Re-render the view
		this.render();
	},

	/**
	 * Updates the model based on the changed view data
	 */
	updateItem: function (event) {
		// Check if the target has a name. If not, it's not a model value we want to store
		if (event.target.name == '') {
			return;
		}

		// Update the model's value, depending on the input type
		if (event.target.type == 'checkbox') {
			value = event.target.checked ? 1 : 0;
		} else {
			value = event.target.value;
		}

		// Update the model
		this.model.set(event.target.name, value);
	},

	/**
	 * Saves the image metadata
	 */
	saveItem: function (event) {
		event.preventDefault();

		// Tell the View we're loading
		this.trigger('loading');

		// Make an AJAX request to save the image metadata
		wp.media.ajax('soliloquy_save_meta', {
			context: this,
			data: {
				nonce: soliloquy_metabox.save_nonce,
				post_id: soliloquy_metabox.id,
				attach_id: this.model.get('id'),
				meta: this.model.attributes,
			},
			success: function (response) {
				// Tell the view we've finished successfully
				this.trigger('loaded loaded:success');

				// Assign the model's JSON string back to the underlying item
				var item = JSON.stringify(this.model.attributes);
				jQuery(
					'ul#soliloquy-output li#' + this.model.get('id'),
				).attr('data-soliloquy-image-model', item);
				// Show the user the 'saved' notice for 1.5 seconds
				var saved = this.$el.find('.saved');
				saved.fadeIn();
				setTimeout(function () {
					saved.fadeOut();
				}, 1500);
			},
			error: function (error_message) {
				// Tell wp.media we've finished, but there was an error
				this.trigger('loaded loaded:error', error_message);
			},
		});
	},

	/**
	 * Searches Links
	 */
	searchLinks: function (event) {},

	/**
	 * Inserts the clicked link into the URL field
	 */
	insertLink: function (event) {},

	/**
	 * Inserts the direct media link for the Media Library item
	 *
	 * The button triggering this event is only displayed if we are editing a
	 * Media Library item, so there's no need to perform further checks
	 */
	insertMediaFileLink: function (event) {
		// Tell the View we're loading
		this.trigger('loading');

		// Make an AJAX request to get the media link
		wp.media.ajax('soliloquy_get_attachment_links', {
			context: this,
			data: {
				nonce: soliloquy_metabox.save_nonce,
				attachment_id: this.model.get('id'),
			},
			success: function (response) {
				// Update model
				this.model.set('link', response.media_link);

				// Tell the view we've finished successfully
				this.trigger('loaded loaded:success');

				// Re-render the view
				this.render();
			},
			error: function (error_message) {
				// Tell wp.media we've finished, but there was an error
				this.trigger('loaded loaded:error', error_message);
			},
		});
	},

	/**
	 * Inserts the attachment page link for the Media Library item
	 *
	 * The button triggering this event is only displayed if we are editing a
	 * Media Library item, so there's no need to perform further checks
	 */
	insertAttachmentPageLink: function (event) {
		// Tell the View we're loading
		this.trigger('loading');

		// Make an AJAX request to get the media link
		wp.media.ajax('soliloquy_get_attachment_links', {
			context: this,
			data: {
				nonce: soliloquy_metabox.save_nonce,
				attachment_id: this.model.get('id'),
			},
			success: function (response) {
				// Update model
				this.model.set('link', response.attachment_page);

				// Tell the view we've finished successfully
				this.trigger('loaded loaded:success');

				// Re-render the view
				this.render();
			},
			error: function (error_message) {
				// Tell wp.media we've finished, but there was an error
				this.trigger('loaded loaded:error', error_message);
			},
		});
	},
});

/**
 * Sub Views
 * - Addons must populate this array with their own Backbone Views, which will be appended
 * to the settings region
 */
var SoliloquyChildViews = [];
var SoliloquyContentViews = [];

/**
 * DOM
 */
(function ($) {
	$(document).ready(function () {
		soliloquy_edit = {
			init: function () {
				// Populate the collection
				SoliloquySlidesUpdate();

				// Edit Image
				$('#soliloquy-settings-content').on(
					'click.soliloquyModify',
					'.soliloquy-modify-slide',
					function (e) {
						// Prevent default action
						e.preventDefault();

						// Get the selected attachment
						var attachment_id = $(this)
							.parent()
							.data('soliloquy-slide');

						// Pass the collection of images for this gallery to the modal view, as well
						// as the selected attachment
						SoliloquyModalWindow.content(
							new SoliloquyView({
								collection: SoliloquySlides,
								child_views: SoliloquyChildViews,
								attachment_id: attachment_id,
							}),
						);

						$(document).trigger('soliloquyRenderMeta');

						// Open the modal window
						SoliloquyModalWindow.open();

						$(document).trigger('soliloquyEditOpen');

						$('.CodeMirror').each(function (i, el) {
							el.CodeMirror.refresh();
						});
					},
				);
			},
		};

		soliloquy_edit.init();
	});

	$(document).on('soliloquyUploaded', function () {
		soliloquy_edit.init();
	});
})(jQuery);

/**
 * Populates the SoliloquySlides Backbone collection
 *
 * Called when images are added, deleted or reordered
 * Doesn't need to be called when an image is edited, as the model will be updated automatically in the collection
 */
function SoliloquySlidesUpdate(selected) {
	// Clear the collection
	SoliloquySlides.reset();

	var $items =
		'ul#soliloquy-output li.soliloquy-slide' +
		(selected ? '.selected' : '');

	// Iterate through the gallery images in the DOM, adding them to the collection
	jQuery($items).each(function () {
		// Build an SoliloquyImage Backbone Model from the JSON supplied in the element
		var soliloquy_slide = jQuery.parseJSON(
			jQuery(this).attr('data-soliloquy-image-model'),
		);

		// Add the model to the collection
		SoliloquySlides.add(new SoliloquySlide(soliloquy_slide));
	});
}

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

/* global soliloquy_metabox, SoliloquySlidesUpdate, wp */
/**
 * Handles Mangement functions, deselection and sorting of media in an Soliloquy slider
 */
(function ($, window, document, soliloquy_metabox) {
	'use strict';

	var soliloquy_manage = {
		//Init, Triggers all functions, used as callback on JS events.
		init: function () {
			this.select_all();

			this.sortable();

			this.select();

			this.display();

			this.chosen();

			this.slide_size();

			this.uploadImage();

			this.toggleStatus();

			this.tooltip();

			this.sort_slides();

			this.clear_selected();

			//Init the Clipboard
			new Clipboard('.soliloquy-clipboard');

			//Prevent Default Action on check
			$('ul#soliloquy-output').on('click', 'a.check', function (e) {
				e.preventDefault();
			});

			//Prevent Default on Clipboard
			$('.soliloquy-clipboard').on('click', function (e) {
				e.preventDefault();
			});

			//How many slides are in the list
			var list = $('#soliloquy-output li').length;

			//Set the Count
			$('.soliloquy-count').text(list.toString());

			// Initialise conditional fields
			$('input,select').conditional();
		},

		//Toggles slides status
		toggleStatus: function () {
			$('#soliloquy-settings-content').on(
				'click.soliloquyStatus',
				'.soliloquy-slide-status',
				function (e) {
					// Prevent default action
					e.preventDefault();

					if ($(this).hasClass('list-status')) {
						var $parent = $(this).parent().parent().parent();
					} else {
						var $parent = $(this).parent();
					}

					var $this = $(this),
						$data = $this.data('status'),
						$list_view = $parent.find(
							'.soliloquy-slide-status.list-status',
						),
						$grid_view = $parent.find(
							'.soliloquy-slide-status.grid-status',
						),
						$view = $this.parent().parent().data('view'),
						id = $this.data('id'),
						$icon = $grid_view.find('span.dashicons'),
						$text = $list_view.find('span'),
						$tooltip = $this.data('soliloquy-tooltip');

					//Set the slider sta
					if ($data === 'active') {
						var $status = 'pending';
					} else {
						var $status = 'active';
					}

					var opts = {
						url: soliloquy_metabox.ajax,
						type: 'post',
						async: true,
						cache: false,
						dataType: 'json',
						data: {
							action: 'soliloquy_change_slide_status',
							post_id: soliloquy_metabox.id,
							slide_id: id,
							status: $status,
							nonce: soliloquy_metabox.save_nonce,
						},
						success: function (response) {
							if ($status === 'active') {
								//Toggle Classes
								$grid_view
									.removeClass(
										'soliloquy-draft-slide',
									)
									.addClass(
										'soliloquy-active-slide',
									);
								$list_view
									.removeClass(
										'soliloquy-draft-slide',
									)
									.addClass(
										'soliloquy-active-slide',
									);

								//Set the proper icons
								$icon.removeClass(
									'dashicons-hidden',
								).addClass('dashicons-visibility');

								//Set the Text
								$text.text(soliloquy_metabox.active);
								$grid_view.attr(
									'data-soliloquy-tooltip',
									soliloquy_metabox.active,
								);

								//Set the Data
								$list_view.data('status', 'active');
								$grid_view.data('status', 'active');
							} else {
								//Toggle Classes
								$grid_view
									.removeClass(
										'soliloquy-active-slide',
									)
									.addClass('soliloquy-draft-slide');
								$list_view
									.removeClass(
										'soliloquy-active-slide',
									)
									.addClass('soliloquy-draft-slide');

								//Set the proper icons
								$icon.removeClass(
									'dashicons-visibility',
								).addClass('dashicons-hidden');

								//Set the text
								$text.text(soliloquy_metabox.draft);
								//Set the Data
								$list_view.data('status', 'pending');
								$grid_view.data('status', 'pending');
								$grid_view.attr(
									'data-soliloquy-tooltip',
									soliloquy_metabox.draft,
								);
							}
						},
						error: function (xhr, textStatus, e) {
							return;
						},
					};

					$.ajax(opts);
				},
			);
		},

		//Simple Tooltip
		tooltip: function () {
			$('[data-soliloquy-tooltip]').on('mouseover', function (e) {
				e.preventDefault();
				var $this = $(this),
					$data = $this.data('soliloquy-tooltip');
			});
		},
		//Select all slides
		select_all: function () {
			//Select all
			$('.soliloquy-select-all').change(function () {
				var checked = this.checked;

				if (checked) {
					$('ul#soliloquy-output li').addClass('selected');
					$('.soliloquy-bulk-actions').fadeIn();

					var selected = $(
						'ul#soliloquy-output li.selected',
					).length;

					$('.select-all').text(soliloquy_metabox.selected);
					$('.soliloquy-count').text(selected.toString());
					$('.soliloquy-clear-selected').fadeIn();
				} else {
					$('ul#soliloquy-output li').removeClass('selected');
					$('.soliloquy-bulk-actions').fadeOut();

					var list = $('ul#soliloquy-output li').length;

					$('.select-all').text(soliloquy_metabox.select_all);
					$('.soliloquy-count').text(list.toString());
					$('.soliloquy-clear-selected').fadeOut();
				}
			});
		},

		//Sort the slides in the admin
		sort_slides: function () {
			$(document).on(
				'change',
				'#soliloquy-config-slide-sort',
				function () {
					var $this = $(this),
						$sort = $this.val(),
						opts = {
							url: soliloquy_metabox.ajax,
							type: 'post',
							async: true,
							cache: false,
							dataType: 'json',
							data: {
								action: 'soliloquy_sort_publish',
								post_id: soliloquy_metabox.id,
								order: $sort,
								nonce: soliloquy_metabox.save_nonce,
							},
							success: function (response) {
								// Response should be a JSON success with the HTML for the image grid
								if (response) {
									// Set the image grid to the HTML we received
									$('#soliloquy-output').html(
										response.data,
									);

									// Repopulate the Soliloquy Slide Collection
									SoliloquySlidesUpdate();

									if ($sort === 'manual') {
										console.log($sort);

										$('#soliloquy-output').attr(
											'data-sortable',
											'1',
										);
									} else {
										$('#soliloquy-output').attr(
											'data-sortable',
											'0',
										);
									}

									//Re-Trigger sortable
									soliloquy_manage.sortable();
								}
							},
							error: function (xhr, textStatus, e) {
								return;
							},
						};

					$.ajax(opts);
				},
			);
		},
		//Makes Slides Sortable
		sortable: function () {
			// Make slider items sortable.
			var slider = $('#soliloquy-output'),
				is_sortable = slider.attr('data-sortable');

			if (is_sortable === '1') {
				if (slider.hasClass('ui-sortable')) {
					slider.sortable('enable');
				}

				slider.sortable({
					containment: '#soliloquy-slider-main',
					items: 'li',
					cursor: 'move',
					forcePlaceholderSize: true,
					placeholder: 'dropzone',
					update: function (event, ui) {
						// Make ajax request to sort out items.
						var opts = {
							url: soliloquy_metabox.ajax,
							type: 'post',
							async: true,
							cache: false,
							dataType: 'json',
							data: {
								action: 'soliloquy_sort_images',
								order: slider
									.sortable('toArray')
									.toString(),
								post_id: soliloquy_metabox.id,
								nonce: soliloquy_metabox.sort,
							},
							success: function (response) {
								// Repopulate the Soliloquy slider Slide Collection
								SoliloquySlidesUpdate();

								return;
							},
							error: function (xhr, textStatus, e) {
								return;
							},
						};
						$.ajax(opts);
					},
				});
			} else {
				if (slider.hasClass('ui-sortable')) {
					slider.sortable('disable');
				}
			}
		},

		//Select a slide
		select: function () {
			// Select / deselect images
			var soliloquy_shift_key_pressed = false,
				soliloquy_last_selected_image = false;

			$(
				'li.soliloquy-slide .soliloquy-item-content, .soliloquy-list li a.check',
			).on('click', function (e) {
				var $this = $(this),
					slider_item = $(this).parent();

				e.preventDefault();

				if ($(slider_item).hasClass('selected')) {
					$(slider_item).removeClass('selected');

					soliloquy_last_selected_image = false;

					var selected = $(
						'ul#soliloquy-output li.selected',
					).length;

					if (selected !== 0) {
						$('.select-all').text(soliloquy_metabox.selected);
						$('.soliloquy-count').text(selected.toString());
						$('.soliloquy-clear-selected').fadeIn();
					} else {
						var list = $('ul#soliloquy-output li').length;

						$('.select-all').text(
							soliloquy_metabox.select_all,
						);
						$('.soliloquy-count').text(list.toString());
						$('.soliloquy-clear-selected').fadeOut();
					}
				} else {
					// If the shift key is being held down, and there's another image selected, select every image between this clicked image
					// and the other selected image
					if (
						soliloquy_shift_key_pressed &&
						soliloquy_last_selected_image !== false
					) {
						// Get index of the selected image and the last image
						var start_index = $(
								'ul#soliloquy-output li',
							).index($(soliloquy_last_selected_image)),
							end_index = $(
								'ul#soliloquy-output li',
							).index($(slider_item)),
							i = 0;

						// Select images within the range
						if (start_index < end_index) {
							for (i = start_index; i <= end_index; i++) {
								$(
									'ul#soliloquy-output li:eq( ' +
										i +
										')',
								).addClass('selected');
							}
						} else {
							for (i = end_index; i <= start_index; i++) {
								$(
									'ul#soliloquy-output li:eq( ' +
										i +
										')',
								).addClass('selected');
							}
						}
					}

					// Select the clicked image
					$(slider_item).addClass('selected');
					soliloquy_last_selected_image = $(slider_item);

					selected = $('ul#soliloquy-output li.selected').length;
					$('.soliloquy-clear-selected').fadeIn();

					$('.select-all').text(soliloquy_metabox.selected);
					$('.soliloquy-count').text(selected.toString());
				}

				// Show/hide 'Deleted Selected Images from Slider' button depending on whether
				// any slides have been selected
				if ($('ul#soliloquy-output > li.selected').length > 0) {
					$('.soliloquy-bulk-actions').fadeIn();
				} else {
					$('.soliloquy-bulk-actions').fadeOut();
				}
			});

			// Determine whether the shift key is pressed or not
			$(document).on('keyup keydown', function (e) {
				soliloquy_shift_key_pressed = e.shiftKey;
			});
		},

		//Updates slider dimenisons on Config screen
		slide_size: function () {
			// Set size of slider dimension fields when changing size type.
			$(document).on(
				'change',
				'#soliloquy-config-slider-size',
				function () {
					var $this = $(this),
						value = $this.val(),
						width = $this
							.find(':selected')
							.data('soliloquy-width'),
						height = $this
							.find(':selected')
							.data('soliloquy-height');

					// Do nothing if the default value is the new value.
					if ('default' === value) {
						$('#soliloquy-config-slider-width').val(
							soliloquy_metabox.slide_width,
						);
						$('#soliloquy-config-slider-height').val(
							soliloquy_metabox.slide_height,
						);
					}

					// Otherwise, attempt to grab width/height data and apply it to dimensions.
					if (width) {
						$('#soliloquy-config-slider-width').val(width);
					}

					if (height) {
						$('#soliloquy-config-slider-height').val(height);
					}
				},
			);
		},

		//Clear Selected Slides
		clear_selected: function () {
			$('.soliloquy-clear-selected').on('click', function (e) {
				e.preventDefault();

				var list = $('#soliloquy-output li').length;

				$('ul#soliloquy-output li').removeClass('selected');

				$('.select-all').text(soliloquy_metabox.select_all);
				$('.soliloquy-count').text(list.toString());
				$('.soliloquy-select-all').prop('checked', false);
				$('.soliloquy-bulk-actions').fadeOut();

				$(this).fadeOut();
			});
		},

		//Change ul#soliloquy-output display type. Uses ajax to store data for each slider
		display: function () {
			//Toggle Grid/List Display
			$('a.soliloquy-display').on('click', function (e) {
				//Prevent Default
				e.preventDefault();

				//Don't do anything is its already active.
				if ($(this).hasClass('active-display')) {
					return;
				}

				var $this = $(this),
					$view = $this.data('soliloquy-display'),
					$output = $('#soliloquy-output'),
					opts = {
						url: soliloquy_metabox.ajax,
						type: 'post',
						async: true,
						cache: false,
						dataType: 'json',
						data: {
							action: 'soliloquy_slider_view',
							post_id: soliloquy_metabox.id,
							view: $view,
							nonce: soliloquy_metabox.save_nonce,
						},
						success: function (response) {},
					};

				$.ajax(opts);

				//Find the current active button and remove class
				$('.soliloquy-display-toggle')
					.find('.active-display')
					.removeClass('active-display');

				//Add the active class to $this
				$this.addClass('active-display');

				if ($view === 'grid') {
					$output
						.removeClass('soliloquy-list')
						.addClass('soliloquy-grid');
				} else if ($view === 'list') {
					$output
						.removeClass('soliloquy-grid')
						.addClass('soliloquy-list');
				}
			});
		},

		//Chosen Select Boxes Init
		chosen: function () {
			//Create the Select boxes
			$('.soliloquy-chosen').each(function () {
				//Get the options from the data.
				var data_options = $(this).data('soliloquy-chosen-options');

				$(this).chosen(data_options);
			});
		},

		//Upload Image functioned Used in Woo and FC addons fallback.
		uploadImage: function () {
			$('.soliloquy-insert-image').on('click', function (e) {
				var soliloquy_image_frame;

				e.preventDefault();

				var $button = $(event.currentTarget),
					input_box = $button.parent().find('input');

				if (soliloquy_image_frame) {
					soliloquy_image_frame.open();

					return;
				}

				soliloquy_image_frame =
					wp.media.frames.soliloquy_image_frame = wp.media({
						frame: 'select',
						library: {
							type: 'image',
						},
						title: soliloquy_metabox.insert_image,
						button: {
							text: soliloquy_metabox.insert_image,
						},
						contentUserSetting: false,
						multiple: false,
					});

				soliloquy_image_frame.on('select', function () {
					var attachment = soliloquy_image_frame
						.state()
						.get('selection')
						.first()
						.toJSON();

					input_box.val(attachment.url);
				});

				soliloquy_image_frame.open();
			});
		},
		updateSlideCount: function () {
			var list = $('#soliloquy-output li').length;

			//update the count value
			$('.soliloquy-count').text(list.toString());

			if (list > 0) {
				$('#soliloquy-empty-slider')
					.fadeOut()
					.addClass('soliloquy-hidden');
				$('.soliloquy-slide-header')
					.removeClass('soliloquy-hidden')
					.fadeIn();
				$('.soliloquy-bulk-actions').fadeOut();
			}
		},
	};

	//DOM ready
	$(function () {
		soliloquy_manage.init();
	});

	//Re init on type change
	$(document).on('soliloquyType', function () {
		soliloquy_manage.init();
	});

	//Update slide count
	$(document).on('insertSlides', function () {
		soliloquy_manage.updateSlideCount();
	});
})(jQuery, window, document, soliloquy_metabox);

(function ($, window, document, soliloquy_metabox) {
	/**
	 * Model: A Video
	 * Collection: A number of Models
	 */

	/**
	 * View: Video Error
	 */
	wp.media.view.SoliloquyVideosError = wp.Backbone.View.extend({
		// The outer tag and class name to use. The item is wrapped in this
		tagName: 'div',
		className: 'soliloquy-error soliloquy-videos-error',

		render: function () {
			// Load the template to render
			this.template = wp.media.template('soliloquy-video-error');

			// Define the HTML for the template
			this.$el.html(this.template(this.model));

			// Return the template
			return this;
		},
	});

	/**
	 * Model: Video Item
	 */
	wp.media.model.SoliloquyVideo = Backbone.Model.extend({
		/**
		 * Define defaults
		 */
		defaults: {
			title: '',
			url: '', // Video URL
			src: '', // Image Placeholder URL (if self hosted)
			caption: '',
			alt: '',
			hosted_video: false,
		},
	});

	/**
	 * View: Videos Item
	 */
	wp.media.view.SoliloquyVideosItem = wp.Backbone.View.extend({
		// The outer tag and class name to use. The item is wrapped in this
		tagName: 'li',
		className: 'attachment soliloquy-videos-attachment',

		/**
		 * Events
		 */
		events: {
			// Update Model on input change
			'keyup input': 'updateItem',
			'keyup textarea': 'updateItem',

			// Delete Model on view deletion
			'click .soliloquy-delete-video-slide': 'deleteItem',
			'click .soliloquy-insert-video': 'insertVideo',
			'click .soliloquy-insert-placeholder': 'insertPlaceholder',
			'click .soliloquy-item-collapse': 'collapse',
		},

		/**
		 * Initialize
		 */
		initialize: function () {
			this.model.view = this;
		},
		collapse: function (event) {
			var $this = $(this.$el);
			$text = $this.find('.soliloquy-item-collapse');

			event.preventDefault();
			if (
				$this
					.find('.soliloquy-item-setting')
					.not('.title')
					.is(':visible')
			) {
				$text.text(soliloquy_metabox.expand);
				$this.find('.soliloquy-item-setting')
					.not('.title')
					.fadeOut();
			} else {
				$text.text(soliloquy_metabox.collapse);

				$this.find('.soliloquy-item-setting')
					.not('.title')
					.fadeIn();
			}
		},
		/**
		 * Update the model associated with this view (i.e. the SoliloquyVideo model)
		 * when a change to an input happens
		 */
		updateItem: function (event) {
			var self = this;
			this.model.set(event.target.name, event.target.value, {
				silent: true,
			});

			// If the target is the video field, check whether the video entered is a self hosted
			// video or not
			if (event.target.name == 'url') {
				// If no video link, revert the hosted_video flag
				if (event.target.value == '') {
					this.model.set('hosted_video', false);
				} else {
					// Perform an AJAX query to determine the video type
					// This allows addons to hook into the PHP function to determine whether their own
					// video types are hosted videos or not
					wp.media.ajax('soliloquy_is_hosted_video', {
						context: self,
						data: {
							nonce: soliloquy_metabox.hosted_nonce,
							video_url: event.target.value,
						},
						success: function (response) {
							if (response) {
								// Is a self hosted video
								this.model.set('hosted_video', true);
							} else {
								// Not a self hosted video
								this.model.set('hosted_video', false);
							}
						},
						error: function (error_message) {
							// Something went wrong
							// Assume it isn't a hosted video
							this.model.set('hosted_video', false);

							// Tell wp.media we've finished, but there was an error
							this.frame.content
								.get()
								.trigger(
									'loaded loaded:error',
									error_message,
								);
						},
					});
				}
			}
		},
		/**
		 * Insert Video from media modal
		 */
		insertVideo: function (event) {
			var soliloquy_video_frame,
				$model = this.model;

			event.preventDefault();

			var $button = $(event.currentTarget),
				input_box = $button.parent().parent().find('input');

			if (soliloquy_video_frame) {
				soliloquy_video_frame.open();

				return;
			}

			soliloquy_video_frame = wp.media.frames.soliloquy_video_frame =
				wp.media({
					frame: 'select',
					library: {
						type: 'video',
					},
					title: soliloquy_metabox.insert_video,
					button: {
						text: soliloquy_metabox.insert_video,
					},
					contentUserSetting: false,
					multiple: false,
				});

			soliloquy_video_frame.on('select', function () {
				attachment = soliloquy_video_frame
					.state()
					.get('selection')
					.first()
					.toJSON();

				$value = input_box.val(attachment.url);

				$model.set('url', attachment.url, { silent: true });
			});

			soliloquy_video_frame.open();
		},
		/**
		 * Insert Placeholder Image from media library
		 */
		insertPlaceholder: function (event) {
			var soliloquy_placeholder_frame,
				$model = this.model;

			event.preventDefault();

			var $button = $(event.currentTarget),
				input_box = $button.parent().parent().find('input');

			if (soliloquy_placeholder_frame) {
				soliloquy_placeholder_frame.open();

				return;
			}

			soliloquy_placeholder_frame =
				wp.media.frames.soliloquy_placeholder_frame = wp.media({
					frame: 'select',
					library: {
						type: 'image',
					},
					title: soliloquy_metabox.insert_placeholder,
					button: {
						text: soliloquy_metabox.insert_placeholder,
					},
					contentUserSetting: false,
					multiple: false,
				});

			soliloquy_placeholder_frame.on('select', function () {
				attachment = soliloquy_placeholder_frame
					.state()
					.get('selection')
					.first()
					.toJSON();

				input_box.val(attachment.url);
				$model.set('src', attachment.url, { silent: true });
			});

			soliloquy_placeholder_frame.open();
		},
		/**
		 * Destroys the model and view when deleted
		 */
		deleteItem: function (event) {
			// Trigger the loading event
			this.trigger('loading');

			// Delete the view from the modal
			var item = jQuery(event.target);

			//Remove the LI Element
			item.parent().parent().parent().remove();

			// Delete the model
			// This will automatically remove the model from the collection
			this.model.destroy();

			// Trigger the loaded event
			this.trigger('loaded loaded:success');
		},

		/**
		 * Render the HTML output
		 */
		render: function () {
			// Load the template to render
			this.template = wp.media.template('soliloquy-video-item');

			// Define the HTML for the template
			this.$el.html(this.template(this.model.toJSON()));

			// Return the template
			return this;
		},
	});

	/**
	 * View: Bottom Toolbar
	 */
	wp.media.view.Toolbar.SoliloquyVideos = wp.media.view.Toolbar.extend({
		/**
		 * Initialize
		 */
		initialize: function () {
			_.defaults(this.options, {
				event: 'soliloquy_videos_insert',
				close: false,
				items: {
					/**
					 * Insert Button
					 */
					soliloquy_videos_insert: {
						id: 'soliloquy-videos-button',
						style: 'primary',
						text: wp.media.view.l10n.insertIntoPost, // Will read "Insert into Gallery", as we modify this in Soliloquy metaboxes.php::media_view_strings()
						priority: 80,
						requires: false,

						/**
						 * On Click
						 */
						click: function () {
							// Insert the selected videos into the Gallery
							this.controller
								.state()
								.SoliloquyVideosInsert();
						},
					},
				},
			});

			// Initialize the bottom toolbar
			wp.media.view.Toolbar.prototype.initialize.apply(
				this,
				arguments,
			);
		},

		/**
		 * Refreshes the toolbar items (i.e. button) enable/disabled state, depending on whether any items were selected
		 * Fired by the main controller when an item is selected or deselected
		 */
		refresh: function () {
			// Disable the Insert into Gallery Button if nothing was selected
			this.get('soliloquy_videos_insert').model.set('disabled', false);

			// Apply the refresh
			wp.media.view.Toolbar.prototype.refresh.apply(this, arguments);
		},
	});

	/**
	 * View: Media Content Area
	 */
	wp.media.view.SoliloquyVideos = wp.media.View.extend({
		/**
		 * Define any events you want to watch for here, for example
		 * a search, item selection / deselection etc.
		 */
		events: {
			// Add
			'click .soliloquy-videos-add': 'addItem',

			// Change Video URL
			'change': 'refreshView',
		},

		/**
		 * Initialize
		 * - Fired when the main UI view is loaded by clicking "Insert Videos"
		 */
		initialize: function () {
			// Define a collection, which will store the items (folders and images)
			this.collection = new Backbone.Collection();

			// Define some flags
			this.is_loading = false; // Tells us whether we're making an AJAX request or doing something

			// Initialise the view, comprising of a sidebar and attachment (items) area
			this.$el.prepend(wp.media.template('soliloquy-video-router'));
			this.$el.prepend(wp.media.template('soliloquy-video-side-bar'));
			this.$el.prepend(wp.media.template('soliloquy-video-items'));

			//Insert the first item
			this.addItem();

			// Define events
			this.on('loading', this.loading, this);
			this.on('loaded', this.loaded, this);
		},

		/**
		 * Displays the loading spinner
		 */
		loading: function () {
			// Set a flag so we know we're loading data
			this.is_loading = true;

			// Show the spinner
			this.$el.find('.spinner').addClass('is-active');
		},

		/**
		 * Hides the loading spinner
		 */
		loaded: function (response) {
			// Set a flag so we know we're not loading anything now
			this.is_loading = false;

			// Hide the spinner
			this.$el.find('.spinner').removeClass('is-active');

			// Remove any existing errors
			this.$el.find('div.soliloquy-error').remove();

			// Extract the error message
			if (typeof response == 'object') {
				response = response.responseText;
			}

			// Display the error message, if it's provided
			if (typeof response !== 'undefined') {
				this.$el
					.find('div.media-toolbar-secondary')
					.append(this.renderError(response));
				this.$el
					.find('ul.attachments.soliloquy-videos-attachments')
					.css(
						'margin-top',
						this.$el.find('div.soliloquy-error').height() +
							20,
					);
			}

			// Update toolbar
			this.controller.toolbar.get().refresh();
		},

		/**
		 * Clears items from the media view
		 */
		clearItems: function () {
			this.$el.find('ul.soliloquy-videos-attachments').empty();
		},

		/**
		 * Renders an individual error, by calling
		 * wp.media.view.SoliloquyVideosError
		 */
		renderError: function (error) {
			// Define model
			var model = {};
			model.error = error;

			// Define view
			var view = new wp.media.view.SoliloquyVideosError({
				model: model,
			});

			// Return rendered view
			return view.render().el;
		},

		/**
		 * Adds a Video to the media modal view, for the user to complete
		 */
		addItem: function (event) {
			// Trigger the loading event
			this.trigger('loading');

			// Create a new SoliloquyVideo model
			model = new wp.media.model.SoliloquyVideo();

			// Add the model to the selection
			this.getSelection().add(model);

			// Load the view, assigning it to the model
			var view = new wp.media.view.SoliloquyVideosItem({
				model: model,
				controller: this,
			});

			// Render the view in the modal window
			this.$el
				.find('ul.soliloquy-videos-attachments')
				.append(view.render().el);

			// Init QuickTags on the caption editor
			// Delay is required for the first load for some reason
			setTimeout(function () {
				quicktags({
					id: 'caption-video',
					buttons: 'strong,em,link,ul,ol,li,close',
				});
				QTags._buttonsInit();
			}, 500);

			// Trigger the loaded event
			this.trigger('loaded loaded:success');
		},

		/**
		 * Iterates through each model in the collection, checking whether
		 * the hosted_video flag is true or false.  Depending on this, we then
		 * show/hide a field in the view attached to that model
		 */
		refreshView: function (event) {
			this.model.each(function (model) {
				if (model.get('hosted_video')) {
					model.view.$el.find('div.image').fadeIn();
				} else {
					model.view.$el.find('div.image').fadeOut();
				}
			});
		},

		/**
		 * Get the selected items
		 */
		getSelection: function () {
			return this.controller.state().props;
		},

		/**
		 * Clears all selected items
		 */
		clearSelection: function () {
			// Get selection
			this.selection = this.getSelection();

			// Remove from UI
			jQuery('li.attachment.soliloquy-videos-attachment').remove();

			// Clear the selected models
			this.selection.reset();
		},
	});

	/**
	 * View: Media Frame
	 */
	var soliloquy_videos_post_frame = wp.media.view.MediaFrame.Post;
	wp.media.view.MediaFrame.Post = soliloquy_videos_post_frame.extend({
		/**
		 * Init
		 */
		initialize: function () {
			soliloquy_videos_post_frame.prototype.initialize.apply(
				this,
				arguments,
			);

			// Add the Video Importer to the modal's left hand menu
			this.states.add([
				new wp.media.controller.SoliloquyVideos({
					id: 'soliloquy-videos',
					content: 'soliloquy-videos-content',
					toolbar: 'soliloquy-videos-toolbar',
					menu: 'default',
					title: wp.media.view.l10n.soliloquyVideosTitle,
					priority: 200,
					type: 'link',
				}),
			]);

			// Main UI (where attachments are displayed)
			this.on(
				'content:render:soliloquy-videos-content',
				this.renderSoliloquyVideosContent,
				this,
			);

			// Bottom Toolbar (where the selected items and button are displayed)
			this.on(
				'toolbar:create:soliloquy-videos-toolbar',
				this.createSoliloquyVideosToolbar,
				this,
			);
		},

		/**
		 * Main UI
		 */
		renderSoliloquyVideosContent: function () {
			this.content.set(
				new wp.media.view.SoliloquyVideos({
					controller: this,
					model: this.state().props,
					className:
						'attachments-browser soliloquy soliloquy-videos',
				}),
			);
		},

		/**
		 * Bottom Toolbar
		 */
		createSoliloquyVideosToolbar: function (toolbar) {
			toolbar.view = new wp.media.view.Toolbar.SoliloquyVideos({
				controller: this,
			});
		},
	});

	/**
	 * Controller
	 */
	wp.media.controller.SoliloquyVideos = wp.media.controller.State.extend({
		/**
		 * Init
		 */
		initialize: function (options) {
			this.props = new Backbone.Collection();
		},
		/**
		 * Renders an individual error, by calling
		 * wp.media.view.SoliloquyVideosError
		 */
		renderError: function (error) {
			// Define model
			var model = {};
			model.error = error;

			// Define view
			var view = new wp.media.view.SoliloquyVideosError({
				model: model,
			});

			// Return rendered view
			return view.render().el;
		},
		/**
		 * Called when the Insert button is clicked
		 */
		SoliloquyVideosInsert: function () {
			// Get selected items
			var frame = this.frame.content.get(),
				videos = [],
				validated = true;

			// Get toolbar button
			this.button = this.frame.toolbar
				.get()
				.get('soliloquy_videos_insert');

			// Disable button and change label
			this.button.model.set('text', wp.media.view.l10n.inserting);
			this.button.model.set('disabled', true);

			// Tell wp.media we're loading items
			frame.trigger('loading');

			// Build an array of items, validating them along the way
			frame.getSelection().each(function (model) {
				// Validate the model to ensure it has the required fields
				if (model.get('title') === '') {
					// Cancel operation
					validated = false;
				}
				if (model.get('url') === '') {
					// Cancel operation
					validated = false;
				}
				// If a self hosted video, we need an image placeholder
				if (model.get('hosted_video')) {
					if (model.get('src') === '') {
						// Cancel
						validated = false;
					}
				}

				videos.push(model.toJSON()); // toJSON will take the model's keys and build an array for us
			}, this);

			// If inputs failed validation, stop
			if (!validated) {
				// Tell wp.media we're finished, but there was an error
				frame.trigger(
					'loaded loaded:error',
					wp.media.view.l10n.soliloquyVideosValidationError,
				);

				// Revert the button back to its original state
				this.button.model.set(
					'text',
					wp.media.view.l10n.insertIntoPost,
				);
				this.button.model.set('disabled', false);

				// Exit
				return false;
			}

			// Make an AJAX request to import these items into the gallery
			wp.media.ajax('soliloquy_insert_slides', {
				context: this,
				data: {
					nonce: soliloquy_metabox.insert_nonce,
					post_id: soliloquy_metabox.id,
					videos: videos,
				},
				success: function (response) {
					// Set the image grid to the HTML we received
					jQuery('#soliloquy-output').html(response);

					// Tell wp.media we've finished
					frame.trigger('loaded loaded:success');
					// Revert the button back to its original state
					this.button.model.set(
						'text',
						wp.media.view.l10n.insertIntoPost,
					);
					this.button.model.set('disabled', false);

					SoliloquySlidesUpdate();

					$(document).trigger('insertSlides');

					// Reset the selection
					frame.clearSelection();

					// Close the modal
					this.frame.close();
				},
				error: function (error_message) {
					// Revert the button back to its original state
					this.button.model.set(
						'text',
						wp.media.view.l10n.insertIntoPost,
					);
					this.button.model.set('disabled', false);

					$('.soliloquy-videos')
						.find('div.media-toolbar-secondary')
						.append(
							this.renderError(error_message.statusText),
						);

					// Tell wp.media we've finished, but there was an error
					frame.trigger(
						'soliloquy-loaded soliloquy-loaded:error',
						error_message.statusText,
					);
				},
			});
		},
	});
})(jQuery, window, document, soliloquy_metabox);

(function ($, window, document) {
	/**
	 * Model: A Video
	 * Collection: A number of Models
	 */

	/**
	 * View: Video Error
	 */
	wp.media.view.SoliloquyHTMLError = wp.Backbone.View.extend({
		// The outer tag and class name to use. The item is wrapped in this
		tagName: 'div',
		className: 'soliloquy-error soliloquy-html-error',

		render: function () {
			// Load the template to render
			this.template = wp.media.template('soliloquy-html-error');

			// Define the HTML for the template
			this.$el.html(this.template(this.model));

			// Return the template
			return this;
		},
	});

	/**
	 * Model: Video Item
	 */
	wp.media.model.SoliloquyHTML = Backbone.Model.extend({
		/**
		 * Define defaults
		 */
		defaults: {
			title: '',
			code: '', // HTML Code
		},
	});

	/**
	 * View: Videos Item
	 */
	wp.media.view.SoliloquyHTMLItem = wp.Backbone.View.extend({
		// The outer tag and class name to use. The item is wrapped in this
		tagName: 'li',
		className: 'attachment soliloquy-html-attachment',

		/**
		 * Events
		 */
		events: {
			// Update Model on input change
			'keyup input': 'updateItem',
			'keyup textarea': 'updateItem',
			'blur .Codemirror': 'updateCode',

			// Delete Model on view deletion
			'click .soliloquy-delete-html-slide': 'deleteItem',
			'click .soliloquy-item-collapse': 'collapse',
		},

		/**
		 * Initialize
		 */
		initialize: function () {
			this.model.view = this;
		},
		collapse: function (event) {
			var $this = $(this.$el);
			$text = $this.find('.soliloquy-item-collapse');

			event.preventDefault();
			if (
				$this
					.find('.soliloquy-item-setting')
					.not('.title')
					.is(':visible')
			) {
				$text.text(soliloquy_metabox.expand);
				$this.find('.soliloquy-item-setting')
					.not('.title')
					.fadeOut();
			} else {
				$text.text(soliloquy_metabox.collapse);

				$this.find('.soliloquy-item-setting')
					.not('.title')
					.fadeIn();
			}
		},
		updateCode: function (event) {
			//this.model.set( event.target.name, event.target.value, { silent: true } );
			//$('#' + id).text(obj.getValue());
		},
		updateItem: function (event) {
			this.model.set(event.target.name, event.target.value, {
				silent: true,
			});
		},
		/**
		 * Destroys the model and view when deleted
		 */
		deleteItem: function (event) {
			// Trigger the loading event
			this.trigger('loading');

			// Delete the view from the modal
			var item = jQuery(event.target);

			//Remove the LI Element
			item.parent().parent().parent().remove();

			// Delete the model
			// This will automatically remove the model from the collection
			this.model.destroy();

			// Trigger the loaded event
			this.trigger('loaded loaded:success');
		},
		updateCode: function (event) {},
		/**
		 * Render the HTML output
		 */
		render: function () {
			// Load the template to render
			this.template = wp.media.template('soliloquy-html-item');

			// Define the HTML for the template
			this.$el.html(this.template(this.model.toJSON()));

			var $textarea = this.$el.find('.soliloquy-html-slide-code');

			this.editor = CodeMirror.fromTextArea($textarea[0], {
				enterMode: 'keep',
				indentUnit: 4,
				electricChars: false,
				lineNumbers: true,
				lineWrapping: true,
				matchBrackets: true,
				mode: 'php',
				smartIndent: false,
				tabMode: 'shift',
				theme: 'ttcn',
			});

			this.editor.on('blur', function (obj) {
				this.model.set('code', obj.getValue(), { silent: true });

				$textarea.text(obj.getValue());
			});

			return this;
		},
	});

	/**
	 * View: Bottom Toolbar
	 */
	wp.media.view.Toolbar.SoliloquyHTML = wp.media.view.Toolbar.extend({
		/**
		 * Initialize
		 */
		initialize: function () {
			_.defaults(this.options, {
				event: 'soliloquy_html_insert',
				close: false,
				items: {
					/**
					 * Insert Button
					 */
					soliloquy_html_insert: {
						id: 'soliloquy-html-button',
						style: 'primary',
						text: wp.media.view.l10n.insertIntoPost, // Will read "Insert into Gallery", as we modify this in Soliloquy metaboxes.php::media_view_strings()
						priority: 80,
						requires: false,

						/**
						 * On Click
						 */
						click: function () {
							// Insert the selected videos into the Gallery
							this.controller
								.state()
								.SoliloquyHTMLInsert();
						},
					},
				},
			});

			// Initialize the bottom toolbar
			wp.media.view.Toolbar.prototype.initialize.apply(
				this,
				arguments,
			);
		},

		/**
		 * Refreshes the toolbar items (i.e. button) enable/disabled state, depending on whether any items were selected
		 * Fired by the main controller when an item is selected or deselected
		 */
		refresh: function () {
			// Disable the Insert into Gallery Button if nothing was selected
			this.get('soliloquy_html_insert').model.set('disabled', false);

			// Apply the refresh
			wp.media.view.Toolbar.prototype.refresh.apply(this, arguments);
		},
	});

	/**
	 * View: Media Content Area
	 */
	wp.media.view.SoliloquyHTML = wp.media.View.extend({
		/**
		 * Define any events you want to watch for here, for example
		 * a search, item selection / deselection etc.
		 */
		events: {
			// Add
			'click .soliloquy-html-add': 'addItem',

			// Change Video URL
			'change': 'refreshView',
		},

		/**
		 * Initialize
		 * - Fired when the main UI view is loaded by clicking "Insert Videos"
		 */
		initialize: function () {
			// Define a collection, which will store the items (folders and images)
			this.collection = new Backbone.Collection();

			// Define some flags
			this.is_loading = false; // Tells us whether we're making an AJAX request or doing something

			// Initialise the view, comprising of a sidebar and attachment (items) area
			this.$el.prepend(wp.media.template('soliloquy-html-router'));
			this.$el.prepend(wp.media.template('soliloquy-html-side-bar'));
			this.$el.prepend(wp.media.template('soliloquy-html-items'));

			this.addItem();

			setTimeout(function () {
				$('.CodeMirror').each(function (i, el) {
					el.CodeMirror.refresh();
				});
			}, 100);

			// Define events
			this.on('loading', this.loading, this);
			this.on('loaded', this.loaded, this);
		},

		/**
		 * Displays the loading spinner
		 */
		loading: function () {
			// Set a flag so we know we're loading data
			this.is_loading = true;

			// Show the spinner
			this.$el.find('.spinner').addClass('is-active');
		},

		/**
		 * Hides the loading spinner
		 */
		loaded: function (response) {
			// Set a flag so we know we're not loading anything now
			this.is_loading = false;

			// Hide the spinner
			this.$el.find('.spinner').removeClass('is-active');

			// Remove any existing errors
			this.$el.find('div.soliloquy-error').remove();

			// Extract the error message
			if (typeof response == 'object') {
				response = response.responseText;
			}

			// Display the error message, if it's provided
			if (typeof response !== 'undefined') {
				this.$el
					.find('div.media-toolbar-secondary')
					.append(this.renderError(response));
				this.$el
					.find('ul.attachments.soliloquy-html-attachments')
					.css(
						'margin-top',
						this.$el.find('div.soliloquy-error').height() +
							20,
					);
			}

			// Update toolbar
			this.controller.toolbar.get().refresh();
		},

		/**
		 * Clears items from the media view
		 */
		clearItems: function () {
			this.$el.find('ul.soliloquy-html-attachments').empty();
		},

		/**
		 * Renders an individual error, by calling
		 * wp.media.view.SoliloquyHTMLError
		 */
		renderError: function (error) {
			// Define model
			var model = {};
			model.error = error;

			// Define view
			var view = new wp.media.view.SoliloquyHTMLError({
				model: model,
			});

			// Return rendered view
			return view.render().el;
		},

		/**
		 * Adds a Video to the media modal view, for the user to complete
		 */
		addItem: function (event) {
			// Trigger the loading event
			this.trigger('loading');

			// Create a new SoliloquyVideo model
			model = new wp.media.model.SoliloquyHTML();

			// Add the model to the selection
			this.getSelection().add(model);

			// Load the view, assigning it to the model
			var view = new wp.media.view.SoliloquyHTMLItem({
				model: model,
				controller: this,
			});

			// Render the view in the modal window
			this.$el
				.find('ul.soliloquy-html-attachments')
				.append(view.render().el);

			$('.CodeMirror').each(function (i, el) {
				el.CodeMirror.refresh();
			});

			// Trigger the loaded event
			this.trigger('loaded loaded:success');
		},

		/**
		 * Iterates through each model in the collection, checking whether
		 * the hosted_video flag is true or false.  Depending on this, we then
		 * show/hide a field in the view attached to that model
		 */
		refreshView: function (event) {},

		/**
		 * Get the selected items
		 */
		getSelection: function () {
			return this.controller.state().props;
		},

		/**
		 * Clears all selected items
		 */
		clearSelection: function () {
			// Get selection
			this.selection = this.getSelection();

			// Remove from UI
			jQuery('li.attachment.soliloquy-html-attachment').remove();

			// Clear the selected models
			this.selection.reset();
		},
	});

	/**
	 * View: Media Frame
	 */
	var soliloquy_html_post_frame = wp.media.view.MediaFrame.Post;
	wp.media.view.MediaFrame.Post = soliloquy_html_post_frame.extend({
		/**
		 * Init
		 */
		initialize: function () {
			soliloquy_html_post_frame.prototype.initialize.apply(
				this,
				arguments,
			);

			// Add the Video Importer to the modal's left hand menu
			this.states.add([
				new wp.media.controller.SoliloquyHTML({
					id: 'soliloquy-html',
					content: 'soliloquy-html-content',
					toolbar: 'soliloquy-html-toolbar',
					menu: 'default',
					title: wp.media.view.l10n.SoliloquyHTMLTitle,
					priority: 200,
					type: 'link',
				}),
			]);

			// Main UI (where attachments are displayed)
			this.on(
				'content:render:soliloquy-html-content',
				this.renderSoliloquyHTMLContent,
				this,
			);

			// Bottom Toolbar (where the selected items and button are displayed)
			this.on(
				'toolbar:create:soliloquy-html-toolbar',
				this.createSoliloquyHTMLToolbar,
				this,
			);
		},

		/**
		 * Main UI
		 */
		renderSoliloquyHTMLContent: function () {
			this.content.set(
				new wp.media.view.SoliloquyHTML({
					controller: this,
					model: this.state().props,
					className:
						'attachments-browser soliloquy soliloquy-html',
				}),
			);
		},

		/**
		 * Bottom Toolbar
		 */
		createSoliloquyHTMLToolbar: function (toolbar) {
			toolbar.view = new wp.media.view.Toolbar.SoliloquyHTML({
				controller: this,
			});
		},
	});

	/**
	 * Controller
	 */
	wp.media.controller.SoliloquyHTML = wp.media.controller.State.extend({
		/**
		 * Init
		 */
		initialize: function (options) {
			this.props = new Backbone.Collection();
		},

		/**
		 * Called when the Insert button is clicked
		 */
		SoliloquyHTMLInsert: function () {
			// Get selected items
			var frame = this.frame.content.get(),
				html = [],
				validated = true;

			// Get toolbar button
			this.button = this.frame.toolbar
				.get()
				.get('soliloquy_html_insert');

			// Disable button and change label
			this.button.model.set('text', wp.media.view.l10n.inserting);
			this.button.model.set('disabled', true);

			// Tell wp.media we're loading items
			frame.trigger('loading');

			// Build an array of items, validating them along the way
			frame.getSelection().each(function (model) {
				// Validate the model to ensure it has the required fields
				if (model.get('title') == '') {
					// Cancel operation
					validated = false;
				}
				if (model.get('code') == '') {
					// Cancel operation
					validated = false;
				}

				html.push(model.toJSON()); // toJSON will take the model's keys and build an array for us
			}, this);

			// If inputs failed validation, stop
			if (!validated) {
				// Tell wp.media we're finished, but there was an error
				frame.trigger(
					'loaded loaded:error',
					wp.media.view.l10n.SoliloquyHTMLValidationError,
				);

				// Revert the button back to its original state
				this.button.model.set(
					'text',
					wp.media.view.l10n.insertIntoPost,
				);
				this.button.model.set('disabled', false);

				// Exit
				return false;
			}

			// Make an AJAX request to import these items into the gallery
			wp.media.ajax('soliloquy_insert_slides', {
				context: this,
				data: {
					nonce: soliloquy_metabox.insert_nonce,
					post_id: soliloquy_metabox.id,
					html: html,
				},
				success: function (response) {
					// Set the image grid to the HTML we received
					jQuery('#soliloquy-output').html(response);

					// Tell wp.media we've finished
					frame.trigger('loaded loaded:success');

					SoliloquySlidesUpdate();

					// Revert the button back to its original state
					this.button.model.set(
						'text',
						wp.media.view.l10n.insertIntoPost,
					);
					this.button.model.set('disabled', false);

					$(document).trigger('insertSlides');

					// Reset the selection
					frame.clearSelection();

					// Close the modal
					this.frame.close();
				},
				error: function (error_message) {
					// Revert the button back to its original state
					this.button.model.set(
						'text',
						wp.media.view.l10n.insertIntoPost,
					);
					this.button.model.set('disabled', false);

					// Tell wp.media we've finished, but there was an error
					frame.trigger('loaded loaded:error', error_message);
				},
			});
		},
	});
})(jQuery, window, document);

/**
 * Soliloquy Admin Tabs
 */
(function ($, window, document) {
	'use strict';
	var soliloquy_tabs_hash = window.location.hash,
		soliloquy_tabs_current_tab = window.location.hash.replace('!', '');

	if (
		soliloquy_tabs_hash &&
		soliloquy_tabs_hash.indexOf('soliloquy-tab') >= 0
	) {
		var $current_tab_container = $(
				soliloquy_tabs_current_tab.replace('tab_', ''),
			),
			$tab_container = $current_tab_container.parent(),
			$tab_nav = $current_tab_container
				.parent()
				.parent()
				.find('ul.soliloquy-tabs-nav'),
			soliloquy_post_action = $('#post').attr('action');

		$tab_container
			.find('.soliloquy-tab-active')
			.removeClass('soliloquy-tab-active');
		$current_tab_container.addClass('soliloquy-tab-active');

		//Remove Active Class from the nav tab
		$tab_nav
			.find('.soliloquy-tab-nav-active')
			.removeClass('soliloquy-tab-nav-active');

		//Add Class to $this
		$tab_nav
			.find(
				'a[href="' +
					soliloquy_tabs_current_tab.replace('tab_', '') +
					'"]',
			)
			.parent()
			.addClass('soliloquy-tab-nav-active');
		// Update the form action to contain the selected tab as a hash in the URL
		// This means when the user saves their Gallery, they'll see the last selected
		// tab 'open' on reload
		if (soliloquy_post_action) {
			// Remove any existing hash from the post action
			soliloquy_post_action = soliloquy_post_action.split('#')[0];

			// Append the selected tab as a hash to the post action
			$('#post').attr(
				'action',
				soliloquy_post_action + window.location.hash,
			);
		}

		$('body').trigger('SoliloquyTabChange');
	}
	//Dom Ready
	$(function () {
		//Tab Clicked
		$('[data-soliloquy-tab]').on('click', function (e) {
			//Prevent Default
			e.preventDefault();

			//
			var $this = $(this),
				tab_id = $this.attr('data-tab-id'),
				$parent = $this.parent(),
				$container = $parent.parent(),
				soliloquy_update_hash = $parent.attr(
					'data-update-hashbang',
				),
				$tab =
					typeof $this.attr('href') !== 'undefined'
						? 'tab_' + $this.attr('href')
						: 'tab_' + tab_id;

			//If the tabs active return
			if ($this.hasClass('soliloquy-tab-nav-active')) {
				return;
			}

			//Remove Active Class from container
			$container
				.find('.soliloquy-tab-active')
				.removeClass('soliloquy-tab-active');

			//Remove Active Class from the nav tab
			$parent
				.find('.soliloquy-tab-nav-active')
				.removeClass('soliloquy-tab-nav-active');

			//Add Class to $this
			$this.addClass('soliloquy-tab-nav-active');

			//Add Class to Tab
			$('#' + tab_id).addClass('soliloquy-tab-active');

			//Trigger an event
			$this.trigger('SoliloquyTabChange');

			//TYPE CHANGE
			if (
				tab_id === 'soliloquy-native' &&
				$('#soliloquy-type-default').prop('checked') !== true
			) {
				// Remove the Soliloquy class from all Slider Types
				$('#soliloquy-types-nav li').removeClass(
					'soliloquy-active',
				);
				$('#soliloquy-type-default')
					.prop('checked', true)
					.trigger('change');
			}

			// Update the window URL to contain the selected tab as a hash in the URL.
			if (soliloquy_update_hash === '1') {
				window.location.hash = $tab.split('#').join('#!');

				// Update the form action to contain the selected tab as a hash in the URL
				// This means when the user saves their Gallery, they'll see the last selected
				// tab 'open' on reload
				var soliloquy_post_action = $('#post').attr('action');

				if (soliloquy_post_action) {
					// Remove any existing hash from the post action
					soliloquy_post_action =
						soliloquy_post_action.split('#')[0];

					// Append the selected tab as a hash to the post action
					$('#post').attr(
						'action',
						soliloquy_post_action + window.location.hash,
					);
				}
			}

			return false;
		});
	});
})(jQuery, window, document);
