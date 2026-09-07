jQuery(function($) {

	"use strict";

	// dismiss dashboard notices
	$( document ).on( 'click', '.black_friday_2023_notice .notice-dismiss', function () {
		var data = {
            'action' : 'shopkeeper_extender_dismiss_dashboard_notice',
            'notice' : 'black_friday_2023'
        };

        jQuery.post( 'admin-ajax.php', data );
	});

	$( document ).on( 'click', '.remove-additional-js-notice .notice-dismiss', function () {
		var data = {
			'action' : 'sk_ext_notifications_dismiss',
			'notice' : 'remove-additional-js-notice'
		};
		jQuery.post( 'admin-ajax.php', data );
	});
});
