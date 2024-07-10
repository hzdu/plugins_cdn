/**
 * UserRegistrationInviteCodes Admin JS
 * global ur_invite_codes_admin_data
 */
jQuery(function ( $ ) {
	setTimeout( function(){
		var date_selector = $('.user-registration form#mainform  input[type="date"]');
		if ( date_selector.length > 0 ) {
			date_selector.addClass('flatpickr-field').attr('type', 'text').flatpickr( {
				disableMobile: true
			} );
		}
	}, 2 );


	$( document ).on('click','.ur_import_invite_codes_action_button', function () {
		var file_data = $('#import_file').prop('files')[0];
		var form_id = $('#import_form_id').val();
		var form_data = new FormData();
		form_data.append('import_form_id', form_id);
		form_data.append('import_file', file_data);
		form_data.append('action', 'ur_invite_codes_import');
		form_data.append('security',ur_invite_codes_admin_data.ur_import_invite_code_save);

		$.ajax({
			url: ur_invite_codes_admin_data.ajax_url,
			dataType: 'json',  // what to expect back from the PHP script, if anything
			cache: false,
			contentType: false,
			processData: false,
			data:form_data,
			type: 'post',
			beforeSend: function () {
				var spinner = '<span class="spinner is-active" style="float: left;margin-top: 6px;"></span>';
				$('.ur_import_invite_codes_action_button').closest('.publishing-action').append(spinner);
				$('.ur-import_notice').remove();
				$('#message').remove();
			},
			complete: function (response) {
				var message_string = '';

				$('.ur_import_invite_codes_action_button').closest('.publishing-action').find('.spinner').remove();
				$('.ur-import_notice').remove();
				$('#message').remove();

				if (response.responseJSON.success === true) {
					message_string = '<div id="message" class="updated inline ur-import_notice"><p><strong>' + response.responseJSON.data.message + '</strong></p></div>';
				} else {
					message_string = '<div id="message" class="error inline ur-import_notice"><p><strong>' + response.responseJSON.data.message + '</strong></p></div>';
				}

				$('.ur-export-users-page').prepend(message_string);
				$('#import_file').val("");
			}
		});
	});

	$(document).ready(function () {

		$(document).on('click', '#user_registration_invite_codes_override_role', hide_show_role_selector);
		hide_show_role_selector();

		function hide_show_role_selector() {
			var override_role = $('#user_registration_invite_codes_override_role').is(':checked');
			var role_selector = $('#user_registration_invite_codes_user_role').closest('.user-registration-global-settings');

			if (override_role) {
				role_selector.show(500);
			} else {
				role_selector.hide(500);
			}
		}
	});

}( jQuery ));
