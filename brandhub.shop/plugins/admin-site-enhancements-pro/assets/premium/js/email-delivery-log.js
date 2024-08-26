(function( $ ) {
	'use strict';

	// Reference: https://plugins.trac.wordpress.org/browser/postbox-email-logs/trunk/js/script.js
	$(document).ready( function() {

		// View log details
	    $('.log-view-more-info').click(function(e){
	        e.preventDefault();
            $('.log-more-info .modal-header .modal-message').html();
            $('.log-more-info .modal-header .modal-message').hide();
            $('.log-more-info .modal-body').removeClass( 'message-to-resend' );
	        $('.log-more-info .modal-body .data').html('');
	        $('body').addClass('log-more-info-popup-open');
	        $('.log-more-info .popup').show();
	        $('.log-more-info .loader').show();
            $('.log-more-info .modal-footer').hide();
            $('.log-more-info .modal-footer #resend-to-label').hide();
            $('.log-more-info .modal-footer #resend-to').hide();
	        if ($('.log-more-info .modal-footer .primary-action').hasClass('resend-now')) {
	            $('.log-more-info .modal-footer .primary-action').removeClass( 'resend-now' );        	
	        }
            $('.log-more-info .modal-footer .primary-action').data( 'db-row-id', '' );
            $('.log-more-info .modal-footer .primary-action').data( 'nonce', '' );
	        var data = {
	            'action': 'get_ed_log_data',
	            'db_row_id': $(this).data('db-row-id'),
	            'purpose' : 'view',
	            'nonce': emailLog.nonce
	        };
	        $.ajax({
	            method: "POST",
	            url: ajaxurl,
	            data: data,
	            success: function(response){
	            	const responseObj = JSON.parse(response);
	                $('.log-more-info .loader').hide();
	                $('.log-more-info .modal-body .data').html( responseObj.data );
		            $('.log-more-info .modal-footer').show();
	                $('.log-more-info .modal-footer .primary-action').html( responseObj.button_label );
	                $('#log-more-info-tabs').tabs();
	            }
	        });
	        return false;
	    });

		// Clicking on the Resend button to open modal
	    $('.resend-email').click(function(e){
	        e.preventDefault();
            $('.log-more-info .modal-header .modal-message').html();
            $('.log-more-info .modal-header .modal-message').hide();
            $('.log-more-info .modal-body').removeClass( 'message-to-resend' );
	        $('.log-more-info .modal-body .data').html('');
	        $('body').addClass('log-more-info-popup-open');
	        $('.log-more-info .popup').show();
	        $('.log-more-info .loader').show();
            $('.log-more-info .modal-footer').hide();
            $('.log-more-info .modal-footer #resend-to-label').hide();
            $('.log-more-info .modal-footer #resend-to').hide();
	        $('.log-more-info .modal-footer .resend-loader').hide();
	        var data = {
	            'action': 'get_ed_log_data',
	            'db_row_id': $(this).data('db-row-id'),
	            'purpose' : 'resend',
	            'nonce': emailLog.nonce
	        };
	        $.ajax({
	            method: "POST",
	            url: ajaxurl,
	            data: data,
	            success: function(response){
	            	const responseObj = JSON.parse(response);
	                $('.log-more-info .loader').hide();
	                $('.log-more-info .modal-header .modal-message').show();
	                $('.log-more-info .modal-header .modal-message').html( responseObj.modal_message );
	                $('.log-more-info .modal-body').addClass( 'message-to-resend' );
	                $('.log-more-info .modal-body .data').html( responseObj.data );
		            $('.log-more-info .modal-footer').show();
		            $('.log-more-info .modal-footer #resend-to-label').show();
		            $('.log-more-info .modal-footer #resend-to').show().val( responseObj.send_to );
	                $('.log-more-info .modal-footer .primary-action').removeClass( 'footer-close' );
	                $('.log-more-info .modal-footer .primary-action').addClass( 'resend-now' );
	                $('.log-more-info .modal-footer .primary-action').html( responseObj.button_label );
	                $('.log-more-info .modal-footer .primary-action').data( 'db-row-id', responseObj.db_row_id );
	                $('.log-more-info .modal-footer .primary-action').data( 'nonce', emailLog.nonce );
	                $('#log-more-info-tabs').tabs();
	            }
	        });
	        return false;
	    });

	    // Clicking on the Resend Now button
	    $('body').on('click', '.resend-now', function(e) {
	        e.preventDefault();
	        $('.log-more-info .modal-footer .resend-loader').show();
	        const resendTo = $('.log-more-info .modal-footer #resend-to').val();
	        const dbRowId = $('.log-more-info .modal-footer .primary-action').data( 'db-row-id' );
	        const nonce = $('.log-more-info .modal-footer .primary-action').data( 'nonce' );
	        var data = {
	            'action': 'resend_email',
	            'resend_to': resendTo,
	            'message_id' : dbRowId,
	            'nonce': nonce
	        };
	        $.ajax({
	            method: "POST",
	            url: ajaxurl,
	            data: data,
	            success: function(response){
					const responseClean = response.slice(0,-1); // remove strange trailing zero in string returned by AJAX call
	            	const responseObj = JSON.parse(responseClean);
	            	console.log(responseObj);
			        $('.log-more-info .modal-footer .resend-loader').hide();
			        $('.log-more-info .modal-footer #resend-to-label').hide();
			        $('.log-more-info .modal-footer .resend-to').hide();
			        $('.log-more-info .modal-footer .primary-action-wrapper').hide();
			        $('<div class="ajax-response">Response here...</div>').appendTo('.log-more-info .modal-footer');
			        $('.log-more-info .modal-footer .ajax-response').html(responseObj.notice_message);
			        if ('successful' == responseObj.resend_status) {
						setTimeout(function() {
							document.location.reload(true);
						}, 2500);
			        }
			        if ('failed' == responseObj.resend_status) {
						setTimeout(function() {
							document.location.reload(true);
						}, 3500);
			        }
	            },
               error:function(errorThrown) {
                  console.log(errorThrown);
               }
	        });
	        return false;	    	
	    });

	    // Close pop-up on clicking the X icon or the Close button
	    $('body').on('click', '.log-more-info .close, .log-more-info .footer-close', function(e){
	        $('.log-more-info .popup').hide();
	        $('body').removeClass('log-more-info-popup-open');
	        if (!$('.log-more-info .modal-footer .primary-action').hasClass('footer-close')) {
	            $('.log-more-info .modal-footer .primary-action').addClass( 'footer-close' );        	
	        }
	        if ($('.log-more-info .modal-footer .primary-action').hasClass('resend-now')) {
	            $('.log-more-info .modal-footer .primary-action').removeClass( 'resend-now' );        	
	        }
	        $('.log-more-info .modal-footer #resend-to-label').show();
	        $('.log-more-info .modal-footer .resend-to').show();
	        $('.log-more-info .modal-footer .primary-action-wrapper').show();
	        $('.log-more-info .modal-footer .primary-action-wrapper').show();
	        $('.log-more-info .modal-footer .ajax-response').remove()
	    });

	    // Close pop-up on hitting Esc key
		$(document).keyup(function(e) {
		    if (e.key === "Escape") {  
		        $('.log-more-info .popup').hide();
		        $('body').removeClass('log-more-info-popup-open');
		        if (!$('.log-more-info .modal-footer .primary-action').hasClass('footer-close')) {
		            $('.log-more-info .modal-footer .primary-action').addClass( 'footer-close' );        	
		        }
		        if ($('.log-more-info .modal-footer .primary-action').hasClass('resend-now')) {
		            $('.log-more-info .modal-footer .primary-action').removeClass( 'resend-now' );        	
		        }
		        $('.log-more-info .modal-footer #resend-to-label').show();
		        $('.log-more-info .modal-footer .resend-to').show();
		        $('.log-more-info .modal-footer .primary-action-wrapper').show();
		        $('.log-more-info .modal-footer .primary-action-wrapper').show();
		        $('.log-more-info .modal-footer .ajax-response').remove()
		    }
		});

	}); // END OF $(document).ready()

})( jQuery );