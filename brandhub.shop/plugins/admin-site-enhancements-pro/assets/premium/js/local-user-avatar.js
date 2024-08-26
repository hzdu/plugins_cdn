(function( $ ) {
	// Link: https://plugins.trac.wordpress.org/browser/simple-user-avatar/tags/4.3/admin/js/scripts.js

	'use strict';

	// WordPress default media sizes
	var WPMediaSizes        = [ 'full', 'large', 'medium', 'thumbnail' ];

	// Get default Src and default SrcSet
	var defaultSrc          = lua_obj.default_avatar_src;
	var defaultSrcSet       = lua_obj.default_avatar_srcset;

	/*
	 * Update attachment
	 *
	 * @since  3.6
	 * @return void
	 */
	function updateAttachment( attachmentSrc = '', attachmentSrcSet = '', attachmentId = null ) {

		// Change the image attributes
		$('.asenha-attachment-avatar').attr({
			'src': attachmentSrc,
			'srcset': attachmentSrcSet
		});
		
		// Set attachment ID value
		$('input[name="' + lua_obj.input_name + '"]').val( attachmentId === null ? '' : parseInt( attachmentId ) );

		// Toggle class hidden
		// We're resetting the avatar back to the default one
		if ( attachmentSrc == defaultSrc ) {
			$('#asenha-attachment-description').removeClass('hidden');
			$('#btn-media-remove').removeClass('hidden');				
		} else {
			if ( ! $('#asenha-attachment-description').hasClass('hidden') ) {
				$('#asenha-attachment-description').addClass('hidden');
			} else {
				$('#asenha-attachment-description').removelass('hidden');				
			}
			if ( ! $('#btn-media-remove').hasClass('hidden') ) {
				$('#btn-media-remove').addClass('hidden');
			} else {
				$('#btn-media-remove').removeClass('hidden');				
			}
		}
	}


	/*
	 * Init functions
	 *
	 * @since 2.8
	 */
	$(function() {
		// Place the new Profile Picture section in the right location
		$(document).ready(function() {
			$('#local-user-avatar').insertAfter('.user-profile-picture');
		});

		// Set click functions
		$(document)
			.on( 'click', '#btn-media-add', function() {

				// Open WordPress Media Library
				wp.media.editor.open();
				
				// Change text
				$('.media-frame-title h1').html(lua_obj.add_media_title);
				$('.media-button-insert').html(lua_obj.button_text);

				// WP Media Editor function
				wp.media.editor.send.attachment = function( props, attachment ) {

					// Set attachment Src to default URL
					var attachmentSrc = attachment.url;

					// If there is a smaller version, let's use it
					for ( const WPMediaSize of WPMediaSizes ) {
						if ( typeof attachment.sizes[WPMediaSize] !== 'undefined' && typeof attachment.sizes[WPMediaSize].url !== 'undefined' ) {
							attachmentSrc = attachment.sizes[WPMediaSize].url;
						}
					}
					
					// Update Attachment
					updateAttachment( attachmentSrc, attachmentSrc, attachment.id );

				}
				
				wp.Uploader.queue.on('reset', function() {
					// Change text
					$('.media-button-insert').html(lua_obj.button_text);				
				});

			})
			.on( 'click', '#btn-media-remove', function() {
				// Update Attachment when resetting to default avatar
				updateAttachment( defaultSrc, defaultSrcSet );
				$(this).addClass('hidden');
			})
			.on( 'click', '.asenha-attachment-avatar', function() {
				// On clicking the avatar image, trigger the click of the Change avatar button
				$('#btn-media-add').trigger( 'click' );
			})
			.on( 'click', '.attachments-wrapper', function() {
				// Change text of media insertion button
				$('.media-button-insert').html(lua_obj.button_text);
			});
	});
})( jQuery );