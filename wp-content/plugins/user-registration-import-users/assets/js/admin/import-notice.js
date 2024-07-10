jQuery( function( $ ) {

   	// Import notice.
	   jQuery('body').on('click', '#user_registration_import_users_notice .notice-dismiss', function(e) {
        e.preventDefault();

		$('#user_registration_import_users_notice').hide();

		var data = {
			action: 'user_registration_dismiss_user_import_action',
			security: uriu_notice_script_data.uriu_import_users_save,
			dismissed: true,
		};

		$.post( uriu_notice_script_data.ajax_url, data, function( response ) {
			// Success. Do nothing. Silence is golden.
        });
	});
});
