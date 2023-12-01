WLM3ThirdPartyIntegration['authorizenet-arb'].fxn = {
	test_keys : function(x) {
		var c = $('#thirdparty-provider-container-authorizenet-arb'); 
		c.find('.api-status').html('<div class="text-warning"><p><em>Checking...</em></p></div>');
		var b = c.find('.save-keys').first();
		if(x.save) {
			b.text(b.data('saving'));
		}
		b.addClass('disabled');
		$.post(
			WLM3VARS.ajaxurl,
			{
				action: 'wlm3_anetarb_test_keys',
				data: x
			},
			function(result) {
				var toaster = {
					type : 'success',
					message : wp.i18n.__( 'Keys Saved', 'wishlist-member' )
				};
				if(result.status) {
					c.removeClass('api-fail');
					c.find('.api-status').html('<div class="text-success"><p>' + get_integration_api_message(1, 'Authorize.net - Automatic Recurring Billing') + '</p></div>');
					WLM3ThirdPartyIntegration['authorizenet-arb'] = $.extend( {}, WLM3ThirdPartyIntegration['authorizenet-arb'], result.data );
					WLM3ThirdPartyIntegration['authorizenet-arb'].fxn.load_products(WLM3ThirdPartyIntegration['authorizenet-arb']['anetarbsubscriptions'], true);
				} else {
					c.addClass('api-fail');
					var msg = (x.anetarbsettings.api_login_id.trim() && x.anetarbsettings.api_transaction_key.trim()) ? get_integration_api_message(2, result.message) : get_integration_api_message(3);
					c.find('.api-status').html('<div class="text-danger"><p>' + msg + '</p></div>');
				}
				if(x.save) {
					$('.wlm-message-holder').show_message(toaster);
					b.text(b.data('saved'));
				}
				b.removeClass('disabled');
			},
			'json'
		);
	},
	get_keys : function(obj) {
		var $me = $('#thirdparty-provider-container-authorizenet-arb');
// 		if(!$me.hasClass('api-fail')) {
// 			obj.find('.-integration-keys :input').val('');
// 		}
		var x = {anetarbsettings : {}};

		$.each(obj.find('.-integration-keys :input').serialize().split('&'), function(i, v) {
			v = v.split('=');
			v[0] = decodeURIComponent(v[0]).replace('[', '["').replace(']', '"]');
			v[1] = decodeURIComponent(v[1]);
			eval ('x.' + v[0] + '=v[1]');
		});
		return x;
	},
	load_products : function(products, clear) {
		if(clear === true) {
			$('#authorizenet-arb-products-table tbody').replaceWith('<tbody/>');
		}
		var data = {
			subscriptions : products
		}
		var tmpl = _.template($('script#authorizenet-arb-products-table-template').html(), {variable: 'data'});
		var html = tmpl(data);
		$('#authorizenet-arb-products-table tbody').append(html.trim());

        $( '#authorizenet-arb-products-table .-del-btn' ).do_confirm( { confirm_message : wp.i18n.__( 'Delete this Product?', 'wishlist-member' ), yes_button : wp.i18n.__( 'Delete', 'wishlist-member' ) } ).on( 'yes.do_confirm', function() {
			var row = $(this).closest('tr');
			var pid = row.data('id');

			// remove modal
			$('#authorizenet-arb-products-' + pid).remove();

			// remove row
			row.remove();
			if(!$('#authorizenet-arb-products-table tbody tr').length) {
				$('#authorizenet-arb-products-table tbody').replaceWith('<tbody/>');
			}

			$.post(
				WLM3VARS.ajaxurl,
				{
					action : 'wlm_anetarb_delete-subscription',
					id : pid
				}
			);

			delete WLM3ThirdPartyIntegration['authorizenet-arb']['anetarbsubscriptions'][pid];
            return false;
		});

	    // generate modals
	    if(!$('body').hasClass('modal-open')) {
	        var tmpl = _.template($('script#authorizenet-arb-products-template').html(), {
	            variable: 'data'
	        });
	        var html = tmpl(products);
	        if(clear === true) $('#authorizenet-arb-products').empty();
	        $('#authorizenet-arb-products').append(html);

	        $('#authorizenet-arb-products').transformers();
	        $('#authorizenet-arb-products [data-process="modal"]').each(function() {
	            new wlm3_modal(
	                '#' + $(this)[0].id
	            );
	        });
	        $('#authorizenet-arb-products').set_form_data(WLM3ThirdPartyIntegration['authorizenet-arb']);
	        $('#authorizenet-arb-products :input').trigger('change');
	    }

	}
}
integration_before_open['authorizenet-arb'] = function(obj) {
	var fxn = this;
	obj = $(obj);
	var $me = $('#thirdparty-provider-container-authorizenet-arb');

	fxn.save_keys = function(){
		var x = $.extend({save : true},WLM3ThirdPartyIntegration['authorizenet-arb'].fxn.get_keys(obj));
		WLM3ThirdPartyIntegration['authorizenet-arb'].fxn.test_keys(x);
	};

	$me.off('.anetarb');
	$me.on('click.anetarb', '.save-keys', fxn.save_keys);

	$me.on('click.anetarb', '.-add-btn', function() {
        var pid = (Date.now() + 1).toString(36).toUpperCase();
        var data = {};

        data[pid] = {
            id: pid,
            new_product: true,
            name: wp.i18n.__( 'Product #', 'wishlist-member' ) + parseInt(window.performance.now()),
            recurring : '0',
            amount : '10.00',
            recur_amount : '10.00',
            currency : 'USD',
            recur_billing_frequency : '1',
            recur_billing_period : wp.i18n.__( 'Month', 'wishlist-member' ),
            trial_amount : '',
        }

        WLM3ThirdPartyIntegration['authorizenet-arb']['anetarbsubscriptions'][pid] = data[pid];
        WLM3ThirdPartyIntegration['authorizenet-arb'].fxn.load_products(data, false);

		$('#authorizenet-arb-products-' + pid).modal('show');
        return false;
	});

	$me.on('change.anetarb', '.anetarb-recurring-toggle', function() {
		if(!$(this).is(':checked')) return;
		var modal = $(this).closest('.modal');
		if(this.value == '1') {
			modal.find('.-anetarb-recurring').show();
			modal.find('.-anetarb-onetime').hide();
		} else {
			modal.find('.-anetarb-recurring').hide();
			modal.find('.-anetarb-onetime').show();
		}
	});

	$me.addClass('api-fail'); 
}
integration_after_open['authorizenet-arb'] = function(obj) {
	var fxn = this;
	obj = $(obj);
	WLM3ThirdPartyIntegration['authorizenet-arb'].fxn.test_keys(WLM3ThirdPartyIntegration['authorizenet-arb'].fxn.get_keys(obj));
}

integration_modal_save['authorizenet-arb'] = function(me, settings_data, result, textStatus) {
	WLM3ThirdPartyIntegration['authorizenet-arb'].fxn.load_products(WLM3ThirdPartyIntegration['authorizenet-arb']['anetarbsubscriptions'], true);
}
