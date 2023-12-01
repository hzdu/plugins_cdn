$(function() {
	$('body').off('.wlm3dataprivacy');

	// save options
	var save_options = {
		data : {
			action : 'admin_actions',
			WishListMemberAction : 'save'
		},
		on_done : function($me, $options, $data) {
			form_data = $('.data-privacy').get_form_data();
			var myparent = $me.parent();
			myparent.addClass( 'has-success' );
			window.setTimeout( function( container ) {
				container.removeClass( 'has-success' );
			}, 2000, myparent );
			$('.wlm-message-holder').show_message();
		}
	};

	// toggle handler
	$('body').on('change.wlm3dataprivacy', '.data-privacy :input.wlm_toggle-adjacent, .privacy-page', function(e, initial) {
		if(initial) return;
		$(this).closest('.form-group, .form-check').save_settings( save_options );
	});
	$('.wlm_toggle-adjacent').trigger('change', true);

	$('body').on('click.wlm3dataprivacy', '.create-page-btn', function(e) {
		e.preventDefault();
		var btn = $(this);
		var input = btn.closest('.row').find('input.create-page');
		input.closest('.form-group').removeClass('has-error');
		var title = input.val().trim();
		var target = $('[name="' + btn.data('input') + '"]');


		if(!title) {
			input.closest('.form-group').addClass('has-error');
		} else {
			var default_message = $(this).closest('.-holder').find('textarea.form-control').attr('name');
			var data = {
				action : 'admin_actions',
				WishListMemberAction : 'create_system_page',
				page_title : title
			}
			$('<div/>').save_settings({
				data: data,
				on_done: function($me, $settings, $data) {
					$data = wlm.json_parse($data);
					if(!$data.success) {
						$('.wlm-message-holder').show_message({
							message: $data.msg,
							type: $data.msg_type
						});
						input.closest('.form-group').addClass('has-error');
					} else {
						// add new page to privacy page dropdowns and save
						target.append( new Option( $data.post_title, $data.post_id, true, true) ).trigger('change');
						btn.closest('.collapse').collapse('hide');
						input.val('');
					}
				},
			});
		}
	})

	// set initial form data
	var form_data = $('.data-privacy').get_form_data();

	// modal stuff
	var modal_handlers = {
		save : function(event) {
			var close = false;
			if($(this).hasClass('modal-cancel') || $(this).hasClass('modal-save-and-close')) {
				close = true;
			}
			if($(this).hasClass('modal-save-and-continue') || $(this).hasClass('modal-save-and-close')) {
				$('#' + event.data.modal.data.id).save_settings( save_options );
			}
			if(close) {
				event.data.modal.close();
			}
		},
		before : function(event) {
			$('.data-privacy').set_form_data(form_data);		
		},
		purge_login_ip : function( event ) {
			if( $( this ).hasClass( 'modal-cancel' ) ) {
				event.data.modal.close();
				return;
			}
			
			$.post(
				WLM3VARS.ajaxurl,
				{
					action : 'wishlistmember_purge_login_ip',
				},
			).done(
				function() {
					$( '.wlm-message-holder' ).show_message( {
						message: wp.i18n.__( 'Login IPs purged', 'wishlist-member' ),
					} );
					event.data.modal.close();
				}
			).fail(
				function() {
					$( '.wlm-message-holder' ).show_message( {
						message: wp.i18n.__( 'Failed purging Login IPs', 'wishlist-member' ),
						type: 'error'
					} );
				}
			);
		}
	}

	new wlm3_modal( '#additional-marketing-consent-markup', { save_handler : modal_handlers.save, before_open : modal_handlers.before } );
	new wlm3_modal( '#display-pp-on-footer-markup', { save_handler : modal_handlers.save, before_open : modal_handlers.before } );
	new wlm3_modal( '#display-tos-on-footer-markup', { save_handler : modal_handlers.save, before_open : modal_handlers.before } );
	new wlm3_modal( '#require-tos-on-regform-markup', { save_handler : modal_handlers.save, before_open : modal_handlers.before } );
	new wlm3_modal( '#purge-login-ip-markup', { save_handler : modal_handlers.purge_login_ip } );
});