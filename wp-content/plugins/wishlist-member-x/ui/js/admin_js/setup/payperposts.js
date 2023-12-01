$(function() {
	var first_load = true;
	$('*').off('.wlm3-ppps');
	$('#ppps-list, #ppps-form').on('click.wlm3-ppps', '.-ajax-btn', function(e) {
		if(!(e.shiftKey || e.ctrlKey || e.altKey || e.metaKey)) {
			e.preventDefault();
			$('#the-content').load_screen($(this), document.title);
			return false;
		}
	});
	$('#ppps-form').on('click.wlm3-ppps', 'button[data-toggle="modal"]', function(e) { e.preventDefault() } );
	$('#ppps-form').on('click.wlm3-ppps', '.btn.modal-cancel', function(e) {
		e.preventDefault();
		$(this).closest('.modal').modal('hide');
	} );

	$('#ppps-form').on('change.wlm3-ppps', '.switch :input.ppp-toggle', function() {
		if(first_load) return;
		var data = $('#save-action-fields').get_form_data();
		data.WishListMemberAction = 'toggle_payperpost';
		console.log($(this).closest('.switch'));
		$(this).closest('.switch').save_settings({
			data : data,
			on_done : function() {
				$('.wlm-message-holder').show_message();
			}
		});
	} );

	$('#ppps-form').on('click.wlm3-ppps', '.btn.modal-save-and-continue, .btn.modal-save-and-close', function(e) {
		e.preventDefault();
		var modal = $(this).closest('.modal');
		var button = $(this);

		modal.save_settings( {
			data : $('#save-action-fields').get_form_data(),
			on_init : function() {
				$('.modal-loader-overlay-holder').removeClass('d-none');
			},
			on_done : function() {
				$('.wlm-message-holder').show_message();
				if(button.hasClass('modal-save-and-close')) {
					button.closest('.modal').modal('hide');
				}
				$('.modal-loader-overlay-holder').addClass('d-none');
			}
		} );
	} );

	$('#ppp-global-settings').on('click.wlm3-ppps', 'input.-redirect-type', function() {
		var value = this.value;
		var holder = $(this).closest('.-holder');
		holder.find('.redirect-type').hide();
		holder.find('.redirect-type.type-' + value).show();
	});

	// email notifications modal
	new wlm3_modal(
		'#ppp-email-notification-settings-modal', {
			save_handler: function(event) {
				event.data.modal.close();
				return false;
			},
			before_open: function(event) {
				var btn = $(event.relatedTarget);

				var modal = $('#ppp-email-notification-settings');

				modal.data('save-section', '.-holder.' + btn.data('notif-setting'));

				var modalbody = modal.find('.modal-body').first();

				modalbody[0].className = 'modal-body';
				modalbody.addClass(btn.data('notif-setting'));

				var modaltitle = modal.find('.modal-title').first();
				modaltitle.find('span').text(btn.data('notif-title'));

				$('#ppp-email-notification-settings .-holder.' + btn.data('notif-setting') + ' .nav-tabs a:first').click();
			},
			before_close: this.modal_close,
		}
	);

	$('button.email-reset-button').on('click.wlm3-ppps', function( e ) { e.preventDefault() } ); 
	$('button.email-reset-button').do_confirm({placement:'right',yes_classes:'-success'})
	.on('yes.do_confirm', function() {
		var type = $(this).data('target');
		var subject = type + '_subject';
		var message = type + '_message';
		$('[name="' + subject + '"]').val(WLM3VARS.ppp_email_defaults[subject]);
		
		var target = $('[name="' + message + '"]');
		var editor = tinymce.get(target[0].id);
		editor.setContent(WLM3VARS.ppp_email_defaults[message]);
		target.val(WLM3VARS.ppp_email_defaults[message]);
		$('.modal-save-and-continue').click();
	});

	if($('#all-ppps-data').length) {
		$('#all-ppps-data').set_form_data(payperpost_data);
		$('#ppps-form :input[name]').trigger('change');
		first_load = false;
	}

	// recaptcha modal
	new wlm3_modal(
		'#recaptcha-settings-modal', {
			save_handler: function(event) {
				var close = false;
				switch($(event.currentTarget).data('btype')) {
					case 'save-close':
						close = true;
					case 'save':
						$('form#recaptcha-settings-form').save_settings( {
							on_done : function() {
								$( '.wlm-message-holder' ).show_message();
							}
						} );
					break;
					case 'cancel':
						close = true;
				}
				if(close) {
					event.data.modal.close();
				}
				return false;
			}
		}
	);



	// after reg and after login modals
	
	[ 'afterreg', 'login' ].forEach( function( type ) {
		new wlm3_modal(
			'#custom-redirects-modal-' + type, {
				save_handler: function(event) {
					var close = false;
					var holder = $($(event.currentTarget).closest('.modal-content'));
					switch($(event.currentTarget).data('btype')) {
						case 'save-close':
							close = true;
						case 'save':
							holder.save_settings( {
								on_done : function() {
									$( '.wlm-message-holder' ).show_message();
								}
							} );
						break;
						case 'cancel':
							close = true;
					}
					if(close) {
						event.data.modal.close();
					}
					return false;
				}
			}
		);
	});

	$('button.page-message-reset-button').on('click.wlm3-ppps', function( e ) { e.preventDefault() } ); 
	$('button.page-message-reset-button').do_confirm({placement:'right',yes_classes:'-success'})
	.on('yes.do_confirm', function() {
		var target = $($(this).data('target'));

		var type = $(this).data('type');
		var message = WLM3VARS.ppp_defaults[type + '_message'];

		var editor = tinymce.get(target[0].id);
		editor.setContent(message);
		target.val(message);
		
		$(this).closest('.modal').find('.save-button[data-btype="save"]').click();
	});


} );