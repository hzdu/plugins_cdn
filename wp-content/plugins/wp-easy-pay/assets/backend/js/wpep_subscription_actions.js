jQuery(document).ready(function(){

	jQuery( '.wpep_subscription_action' ).click(
		function() {
	
			var subscription_action = jQuery( this ).data( 'action' );
			var subscription_id     = jQuery( this ).data( 'subscription' );
	
			var data = {
	
				'action': 'wpep_subscription_action_update',
				'subscription_action': subscription_action,
				'subscription_id': subscription_id
	
			};
	
			jQuery.post(
				ajaxurl,
				data,
				function(response) {
	
					if ( response == 'success' || response == 'success_renew' || response == 'success_cancel' ) {
						location.reload();
					}
	
				}
			);
	
		}
	);

});
