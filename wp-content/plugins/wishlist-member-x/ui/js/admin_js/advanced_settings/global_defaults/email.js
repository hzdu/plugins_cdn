$(function() {
	new wlm3_modal(
		'#email-notification-settings-modal', {
			save_handler: function(event) {
				event.data.modal.close();
				return false;
			},
			before_open: function(event) {
				var btn = $(event.relatedTarget);

				var modal = $('#email-notification-settings');

				modal.data('save-section', '.-holder.' + btn.data('notif-setting'));

				$(':input.form-control, :input.form-check-input', '.-holder.' + btn.data('notif-setting')).each(function() {
					if(this.name in WLM3VARS.level_email_defaults) {
						$(this).val([WLM3VARS.level_email_defaults[this.name]]);
						if(tinymce.get(this.id)) {
							tinymce.get(this.id).setContent($(this).val());
						}
					}
				});

				var modalbody = modal.find('.modal-body').first();

				modalbody[0].className = 'modal-body';
				modalbody.addClass(btn.data('notif-setting'));

				var modaltitle = modal.find('.modal-title').first();
				modaltitle.find('span').text(btn.data('notif-title'));

				$('#apply-to-all-levels-content-hide').addClass('apply-to-all-levels-content-hide');

				$('#email-notification-settings .-holder.' + btn.data('notif-setting') + ' .nav-tabs a:first').click();
			},
			after_open: function(event) {
				$('#apply-to-all-levels').val('').change();
			},
			before_close: this.modal_close
		}
	);

	$('.notif-modal-cancel').click(function() {
		$(this).closest('.modal').modal('hide');
	});

	$('.notif-modal-save').click(function(e) {
		var button = this;
		var modal = $(button).closest('.modal');
		var target = $(modal.data('save-section')).first();

		var data = target.find(':input.form-control,:input.form-check-input').serialize() + '&action=admin_actions&WishListMemberAction=save_global_email_notifications';
		target.find(':input.form-check-input:not(:checked)').each(function() {
			data += '&' + this.name + '=0';
		});

		$(button).closest('.modal-dialog').find('.modal-loader-overlay-holder').removeClass('d-none');

		$.post(WLM3VARS.ajaxurl, data, function (result) {
			if(result.success) {
				$.each(result.data, function(key, value) {
					if(key in WLM3VARS.level_email_defaults) {
						WLM3VARS.level_email_defaults[key] = value;
					}
				});

				if(!e.wlm_no_message) {
					$('.wlm-message-holder').show_message({
						message: result.msg
					});
				}
			}

			// close if save & close
			if($(button).hasClass('-and-close')) {
				modal.modal('hide');
			}

			$(button).closest('.modal-dialog').find('.modal-loader-overlay-holder').addClass('d-none');
		}, 'json');
	});

	$('.email-reset-button').do_confirm({placement:'right',yes_classes:'-success'})
	.on('yes.do_confirm', function() {
		var type = $(this).data('target');

		var recipient = type + '_recipient';
		$('[name="' + recipient + '"]').val(WLM3VARS.original_email_values[recipient]);

		var subject = type + '_subject';
		$('[name="' + subject + '"]').val(WLM3VARS.original_email_values[subject]);

		var message = type + '_message';
		var target = $('[name="' + message + '"]');
		var editor = tinymce.get(target[0].id);
		editor.setContent(WLM3VARS.original_email_values[message]);
		target.val(WLM3VARS.original_email_values[message]);
		$('#apply-to-all-levels').val('').change();
		$('#email-notification-settings .notif-modal-save.-primary').click();
	});

	$( '#reset-email-sender' ).do_confirm({placement:'left',yes_classes:'-success'}).on( 'yes.do_confirm', function() {
		var $btn = $(this);
		$btn.prop('disabled', true).removeClass('-primary').addClass('-default');
		$.post(WLM3VARS.ajaxurl, { action : 'admin_actions', 'WishListMemberAction' : 'reset_level_sender_info_to_default' }, function(result) {
			$btn.prop('disabled', false).removeClass('-default').addClass('-primary');
			$('.wlm-message-holder').show_message({ message : result.msg });
		}, 'json');
		return false;
	});

	$('#apply-to-all-levels-btn').do_confirm({placement:'left',yes_classes:'-success'}).on('yes.do_confirm', function() {
		// check if we're applying to levels as well
		var mlevels = $('#apply-to-all-levels').val();
		if(mlevels.length > 0) {
			$('.notif-modal-save.-primary').trigger({
				type: 'click',
				wlm_no_message: true
			});

			$('#apply-to-all-levels').val('').change();

			var apply_content = {};
			var row = $('.modal-body :text:visible').first().closest('.row');
			row.find(':text,textarea,:checkbox.form-check-input').each(function() {
				apply_content[this.name] = this.type == 'checkbox' ? + this.checked : this.value;
			});

			$.post(WLM3VARS.ajaxurl, {
				'action' : 'admin_actions',
				'WishListMemberAction' : 'apply_email_template_to_selected_levels',
				'levels' : mlevels,
				'content' : apply_content,
			}, function(result) {
				if(result.success) {
					$('.wlm-message-holder').show_message({
						message: result.msg
					})
				} else {
					$('.wlm-message-holder').show_message({
						message: result.msg,
						type: 'danger'
					})
				}
			}, 'json');
		} else {
			$('.wlm-message-holder').show_message({
				message: wp.i18n.__( 'At least one level has to be selected', 'wishlist-member' )
			})
		}
	});

	$('label.apply-to-all-levels-toggle').click(function() {
		var row = $(this).closest('.row');
		row.toggleClass('apply-to-all-levels-content-hide');
		$('#apply-to-all-levels').change();
	});

	$('.richtextx').removeClass('richtextx').addClass('richtext');

	$('#apply-to-all-levels').allow_select_all();
	$('#apply-to-all-levels').select2({theme:"bootstrap"});

});