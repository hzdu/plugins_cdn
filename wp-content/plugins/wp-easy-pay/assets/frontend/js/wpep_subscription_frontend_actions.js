jQuery(document).on( 'click', '.wpep_subscription_action', function () {
		var subscription_action = jQuery( this ).data( 'action' );
		var subscription_id     = jQuery( this ).data( 'subscription' );
		var This = jQuery(this);

		var data = {

			'action': 'wpep_subscription_action_update',
			'subscription_action': subscription_action,
			'subscription_id': subscription_id
		};

		jQuery.post(
			wpep_subscription_vars.ajax_url,
			data,
			function(response) {

				if ( response == 'success_renew' ) {
					var p = This.parent('.wpep-btn-wrap');
					p.html("<input type='button' value='cancel' data-action='cancel' data-subscription='"+ subscription_id +"' class='wpep_subscription_action wpep-btn wpep-btn-primary wpep-full wpep-btn-square wpep-btn-danger' /><input type='button' value='Pause' data-action='Paused' data-subscription='"+ subscription_id +"' class='wpep_subscription_action wpep-btn wpep-btn-primary wpep-full wpep-btn-square wpep-btn-warning' />");
					jQuery(`.wpep_sub_status_${subscription_id}`).html('<span class="Active">Active</span>');
				}

				if ( response == 'success_cancel' ) {
					var p = This.parent('.wpep-btn-wrap');
					p.html("<input type='button' value='Renew Now' data-action='renew' data-subscription='"+ subscription_id +"' class='wpep_subscription_action wpep-btn wpep-btn-primary wpep-full wpep-btn-square wpep-btn-success' />");
					jQuery(`.wpep_sub_status_${subscription_id}`).html('<span class="Cancelled">Cancelled</span>');
				}

				if (response == 'success') {
					
					var p = This.parent('.wpep-btn-wrap');
					if ( This.val() == 'Pause' ) {
						p.html("<input type='button' value='cancel' data-action='cancel' data-subscription='"+ subscription_id +"' class='wpep_subscription_action wpep-btn wpep-btn-primary wpep-full wpep-btn-square wpep-btn-danger' /><input type='button' value='Start' data-action='Active' data-subscription='"+ subscription_id +"' class='wpep_subscription_action wpep-btn wpep-btn-primary wpep-full wpep-btn-square wpep-btn-success' />");
						jQuery(`.wpep_sub_status_${subscription_id}`).html('<span class="Paused">Paused</span>');
					} else {
						p.html("<input type='button' value='cancel' data-action='cancel' data-subscription='"+ subscription_id +"' class='wpep_subscription_action wpep-btn wpep-btn-primary wpep-full wpep-btn-square wpep-btn-danger' /><input type='button' value='Pause' data-action='Paused' data-subscription='"+ subscription_id +"' class='wpep_subscription_action wpep-btn wpep-btn-primary wpep-full wpep-btn-square wpep-btn-warning' />");
						jQuery(`.wpep_sub_status_${subscription_id}`).html('<span class="Active">Active</span>');
					}
					
				}

			}
		);

	}
);

jQuery(document).on( 'click', '.wpep_card_delete', function (e) {
	e.preventDefault();
	var This = jQuery(this);
	var myParent = This.parents('.credit-card');
	var card_id = This.data('card-id');
	var data = {

		'action': 'wpep_delete_user_card',
		'card_id': card_id
	};
	jQuery.post(
		wpep_subscription_vars.ajax_url,
		data,
		function(response) {

			if (response == 'success') {
				console.log(myParent);
				myParent.remove();
			}

		}
	);
});

jQuery('.sub_details').on('click', function(e){
	e.preventDefault();
	var pointer = jQuery(this);
	var subscription_id = pointer.data('id');
	var data = {

		'action': 'get_wpep_subscription_details',
		'subscription_id': subscription_id

	};
	
	jQuery('.wpep_overlay_bg').css('display', 'flex');

	jQuery.post(
		wpep_subscription_vars.ajax_url,
		data,
		function(response) {
			jQuery('#single-subscription').html(response);
			jQuery('#wpep_thickbox_trigger').attr('title', `Subscription #${subscription_id}`);
			jQuery('#wpep_thickbox_trigger').trigger('click');
			jQuery('.wpep_overlay_bg').css('display', 'none');
		}
	);	
});

jQuery('div.wpep-subscription-tabs > a').on('click', function(e){
	e.preventDefault();
	var id = jQuery(this).data('id');
	jQuery(this).addClass('wpep-tab-active');
	jQuery(this).siblings('.wpep-tab-link').removeClass('wpep-tab-active');
	jQuery(`div#${id}`).addClass('wpep-subs-active');
	jQuery(`div#${id}`).siblings('div.wpep-subscriptions-content').removeClass('wpep-subs-active');
});
