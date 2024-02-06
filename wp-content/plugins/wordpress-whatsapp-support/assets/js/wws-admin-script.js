(function( $ ) {
	"use strict";

	var whatsappIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path></svg>'

	jQuery( document ).ready( function() {

		// Init select2
		jQuery('.wws-select2').select2();

		// Init WordPress color picker
		jQuery('.colorpicker').wpColorPicker();
		jQuery( '[data-color-picker="color-picker"]' ).wpColorPicker();

		// Time picker initilization
		jQuery( '.wws-timepicker' ).timepicker( {
			'timeFormat': 'HH:mm:ss',
			'dynamic': false,
			'scrollbar': true,
		} );

		/*
		* Button generator JS
		* @since 1.3
		*/
		jQuery( document ).on('keyup change click load', '.wws-button-generator', function(event) {
			event.preventDefault();

			var buttonType          = jQuery( '#wws-button-gen-button-type' ).val();
			var buttonText          = jQuery( '#wws-button-gen-button-text' ).val();
			var buttonBgColor       = jQuery( '#wws-button-gen-bg-color' ).val();
			var buttonTextColor     = jQuery( '#wws-button-gen-text-color' ).val();
			var buttonBoldText      = jQuery( '#wws-button-gen-bold-text' ).val();
			var buttonFullWidth     = jQuery( '#wws-button-gen-full-width' ).val();

			jQuery( '#wws-button-gen-support, #wws-button-gen-invitation' ).hide();
			if ( buttonType == 'support-button' ) {
				jQuery( '#wws-button-gen-support' ).show();
			} else {
				jQuery( '#wws-button-gen-invitation' ).show();
			}

			// change button text
			jQuery( '#wws-button-gen-btn-visual' ).html( whatsappIcon + ' <span>' + buttonText + '</span>' );
			// change button style
			jQuery( '#wws-button-gen-btn-visual' ).css({
				'background-color': buttonBgColor,
				'color': buttonTextColor,
				'font-weight': ( buttonBoldText == 1 ) ? '700' : 'inherit',
				'width': ( buttonFullWidth == 1 ) ? '100%' : 'auto',
			});

		});

		jQuery( document ).on('click', '#wws-button-gen-code', function(event) {
			event.preventDefault();
			var html                = '';
			var shortcodeBox        = jQuery( '#wws-button-gen-shortcode' );
			var htmlBox             = jQuery( '#wws-button-gen-html' );
			var supportNumber       = jQuery( '#wws-button-gen-support-number' ).val();
			var invitationID        = jQuery( '#wws-button-gen-invitation-id' ).val();
			var buttonType          = jQuery( '#wws-button-gen-button-type' ).val();
			var buttonText          = jQuery( '#wws-button-gen-button-text' ).val();
			var buttonBgColor       = jQuery( '#wws-button-gen-bg-color' ).val();
			var buttonTextColor     = jQuery( '#wws-button-gen-text-color' ).val();
			var buttonBoldText      = jQuery( '#wws-button-gen-bold-text' ).val();
			var buttonFullWidth     = jQuery( '#wws-button-gen-full-width' ).val();
			var buttonFont          = jQuery( '#wws-button-gen-font' ).val();
			var message             = jQuery( '#wws-button-gen-message' ).val();
			var onMobile            = jQuery( '#wws-button-gen-on-mobile' ).val();
			var onDesktop           = jQuery( '#wws-button-gen-on-desktop' ).val();

			var shortcode = '';
				shortcode += '[whatsappsupport ';

			if ( buttonType == 'support-button' ) {
				shortcode += 'number="'+supportNumber+'" ';
			} else if ( buttonType == 'invitation-button' ) {
				shortcode += 'group="'+invitationID+'" ';
			}

				shortcode += 'text="'+buttonText+'" ';
				shortcode += 'text-color="'+buttonTextColor+'" ';
				shortcode += 'bg-color="'+buttonBgColor+'" ';

				if ( buttonBoldText == 1 ) {
					shortcode += 'bold-text="'+( ( buttonBoldText == 1 ) ? '700' : 'inherit' )+'" ';
				}
				if ( buttonFont != 'inherit' ) {
					shortcode += 'font="'+buttonFont+'" ';
				}
				shortcode += 'message="'+message+'" ';

				if ( buttonFullWidth == 1 ) {
					shortcode += 'full-width="'+( ( buttonFullWidth == 1 ) ? 'yes' : 'no' )+'" ';
				}
				if ( onMobile == 0 ) {
					shortcode += 'on-mobile="'+( ( onMobile == 1 ) ? 'yes' : 'no' )+'" ';
				}
				if ( onDesktop == 0 ) {
					shortcode += 'on-desktop="'+( ( onDesktop == 1 ) ? 'yes' : 'no' )+'"';
				}

				shortcode += ']';

				if ( buttonType == 'support-button' ) {
					html += '<a href="https://wa.me/'+supportNumber+'?text='+message+'" ';
				} else if ( buttonType == 'invitation-button' ) {
					html += '<a href="https://chat.whatsapp.com/'+invitationID+'" ';
				}

				html += 'style="';
				html += 'background-color:'+buttonBgColor+'; ';
				html += 'color:'+buttonTextColor+'; ';
				html += 'font-weight:'+( ( buttonBoldText == 1 ) ? '700' : 'inherit' )+'; ';
				html += 'width:'+( ( buttonFullWidth == 1 ) ? '100%; display: block; ' : 'auto' )+'; ';
				html += 'padding: 8px 25px; ';
				html += 'margin: 2px ;';
				html += 'border-radius: 3px; ';
				html += 'text-align: center;';
				html += '" '; // Style tag close
				html += 'target="_blank">'+buttonText+'</a>';

				htmlBox.val( html );
				shortcodeBox.val( shortcode );

		});


		/*
		* Link generator JS
		* @since 1.3
		*/
		jQuery( document ).on('keyup change click load', '.wws-link-generator', function(event) {
			event.preventDefault();

			var linkType        = jQuery( '#wws-link-gen-link-type' ).val();

			jQuery( '#wws-link-gen-chat, #wws-link-gen-group, #wws-link-gen-message-field' ).hide();

			if ( linkType == 'chat-link' ) {
				jQuery( '#wws-link-gen-chat, #wws-link-gen-message-field' ).show();
			} else if ( linkType == 'group-link' ) {
				jQuery( '#wws-link-gen-group' ).show();
			}

		});

		jQuery( document ).on('click', '#wws-link-gen-code', function(event) {
			event.preventDefault();

			var linkBox         = jQuery( '#wws-link-gen-link' );
			var linkType        = jQuery( '#wws-link-gen-link-type' ).val();
			var whatsappNumber  = jQuery( '#wws-link-gen-chat-number' ).val();
			var groupID         = jQuery( '#wws-link-gen-group-id' ).val();
			var message         = jQuery( '#wws-link-gen-message' ).val();

			if ( linkType == 'chat-link' ) {
				linkBox.val( 'https://wa.me/'+whatsappNumber+'?text='+message+'' );
			} else if ( linkType == 'group-link' ) {
				linkBox.val( 'https://chat.whatsapp.com/'+groupID+'' );
			}

		});

		// Analytics deep report
		jQuery( document ).on( 'click', '[data-ip]', function() {
			var ip = jQuery( this ).attr( 'data-ip' );
			tb_show('Analytics Deep Report', 'admin-ajax.php?action=wws_analytics_deep_report&ip=' + ip );
			return false;

		});

		// QR Code generation.
		jQuery( '#wws-qr-gen-code' ).on( 'click', function() {
			jQuery( '#wws-qr-gen-code i' ).css( 'display', 'inline-block' );

			jQuery.ajax({
				url: wwsAdminObj.admin_url,
				type: 'post',
				dataType: 'json',
				data: {
					'action':   'wws_admin_qr_generator',
					'support_number' : jQuery( '#wws-qr-number' ).val(),
					'pre_message' : jQuery( '#wws-qr-textarea' ).val(),
					'qr_size' : jQuery( '#wws-qr-size' ).val(),
				}
			}).done(function( response ) {
				jQuery( '#wws-qr-gen-shortcode' ).val( response.shortcode );
				jQuery( '#wws-admin-qr-view img' ).attr( 'src', response.generatedQR );
				jQuery( '#wws-admin-qr-view div' ).html( response.preMessage );
				jQuery( '#wws-qr-gen-code i' ).hide();
			});

		} );

		// Input masking selection.
		jQuery( '[data-wws-mask]' ).on( 'click', function( e ) {
			e.preventDefault();

			var maskFormat = jQuery( this ).attr( 'data-wws-mask' );
			jQuery( '#wws_number_masking' ).val( maskFormat );
		} );

		// Upload image.
		jQuery( document ).on( 'click', '.wpsa-browse', function( event ) {
			event.preventDefault();

			var self = jQuery( this );

			// Create the media frame.
			var file_frame = wp.media.frames.file_frame = wp.media( {
				title: self.data('uploader_title'),
				button: {
					text: self.data('uploader_button_text'),
				},
				multiple: false
			} );

			file_frame.on( 'select', function() {
				var attachment = file_frame.state().get( 'selection' ).first().toJSON();

				self.prev( '.wpsa-url' ).val( attachment.url ).change();
			} );

			// Finally, open the modal
			file_frame.open();
		} );

		// Multiple support person JS.
		$( document ).on( 'click', '.js-wws-support-person-avaliability-remove', function( e ) {
			e.preventDefault();

			$( this ).closest( 'div' ).remove();
		} );
		$( document ).on( 'click', '.js-wws-support-person-avaliability-add', function( e ) {
			e.preventDefault();

			var slots     = $( this ).closest( '.wws-support-person-avaliability' ).find( 'div' )
			var lastSlots = slots.last().attr( 'data-slot' );
			var newSlot   = Number( lastSlots ) + 1;
			var day       = $( this ).attr( 'data-day' );

			$( this ).closest( '.wws-support-person-avaliability' ).append(
				'<div data-slot="' + newSlot + '">' +
					'<input type="text" class="wws-timepicker" name="wws_multi_account[schedule][' + day + '][timing][' + newSlot + '][start]" required> - ' +
					'<input type="text" class="wws-timepicker" name="wws_multi_account[schedule][' + day + '][timing][' + newSlot + '][end]" required> ' +
					'<a href="javascript:;" class="js-wws-support-person-avaliability-remove wws-support-person-avaliability--remove">' +
						'<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">' +
							'<path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />' +
						'</svg>' +
					'</a>' +
				'</div>'
			);

			jQuery( '.wws-timepicker' ).timepicker( {
				'timeFormat': 'HH:mm:ss',
				'dynamic': false,
				'scrollbar': true,
			} );
		} );

	} ); // Document ready end here

})(jQuery)
