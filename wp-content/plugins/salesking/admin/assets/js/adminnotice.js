/**
*
* JavaScript file that controls global admin notices (enables permanent dismissal)
*
*/
(function($){

	"use strict";

	$( document ).ready(function() {

		/* Admin notice permanent dismissal */
		$('.salesking_activate_woocommerce_notice button').on('click', function(){
			// Run ajax function that permanently dismisses notice
			var datavar = {
	            action: 'salesking_dismiss_activate_woocommerce_admin_notice',
	            security: salesking_notice.security,
	        };

			$.post(ajaxurl, datavar, function(response){
				// do nothing
			});

		});

		$('.salesking_groups_howto_notice button').on('click', function(){
			// Run ajax function that permanently dismisses notice
			var datavar = {
	            action: 'salesking_dismiss_groups_howto_admin_notice',
	            security: salesking_notice.security,
	        };

			$.post(ajaxurl, datavar, function(response){
				// do nothing
			});

		});

		$('.salesking_groupsrules_howto_notice button').on('click', function(){
			// Run ajax function that permanently dismisses notice
			var datavar = {
	            action: 'salesking_dismiss_groupsrules_howto_admin_notice',
	            security: salesking_notice.security,
	        };

			$.post(ajaxurl, datavar, function(response){
				// do nothing
			});

		});


		$('.salesking_announcements_howto_notice button').on('click', function(){
			// Run ajax function that permanently dismisses notice
			var datavar = {
	            action: 'salesking_dismiss_announcements_howto_admin_notice',
	            security: salesking_notice.security,
	        };

			$.post(ajaxurl, datavar, function(response){
				// do nothing
			});

		});

		$('.salesking_messages_howto_notice button').on('click', function(){
			// Run ajax function that permanently dismisses notice
			var datavar = {
	            action: 'salesking_dismiss_messages_howto_admin_notice',
	            security: salesking_notice.security,
	        };

			$.post(ajaxurl, datavar, function(response){
				// do nothing
			});

		});

		$('.salesking_payouts_howto_notice button').on('click', function(){
			// Run ajax function that permanently dismisses notice
			var datavar = {
	            action: 'salesking_dismiss_payouts_howto_admin_notice',
	            security: salesking_notice.security,
	        };

			$.post(ajaxurl, datavar, function(response){
				// do nothing
			});
		});

		$('.salesking_earnings_howto_notice button').on('click', function(){
			// Run ajax function that permanently dismisses notice
			var datavar = {
	            action: 'salesking_dismiss_earnings_howto_admin_notice',
	            security: salesking_notice.security,
	        };

			$.post(ajaxurl, datavar, function(response){
				// do nothing
			});

		});

		$('.salesking_rules_howto_notice button').on('click', function(){
			// Run ajax function that permanently dismisses notice
			var datavar = {
	            action: 'salesking_dismiss_rules_howto_admin_notice',
	            security: salesking_notice.security,
	        };

			$.post(ajaxurl, datavar, function(response){
				// do nothing
			});

		});

	});

})(jQuery);