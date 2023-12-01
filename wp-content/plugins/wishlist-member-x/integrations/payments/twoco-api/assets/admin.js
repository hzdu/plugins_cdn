WLM3ThirdPartyIntegration['twoco-api'].fxn = {
	test_keys : function(api_keys_data) {
		var c = $('#thirdparty-provider-container-twoco-api'); 
		c.find('.api-status').html('<div class="text-warning"><p><em>Checking...</em></p></div>');
		var b = c.find('.save-keys').first();
		if(api_keys_data.save) {
			b.text(b.data('saving'));
		}
		b.addClass('disabled');
		$.post(
			WLM3VARS.ajaxurl,
			{
				action: 'wlm3_twoco-api_test_keys',
				data: api_keys_data
			},
			function(result) {
				if(result.status) {
					c.removeClass('api-fail');
					c.find('.api-status').html('<div class="text-success"><p>' + get_integration_api_message(1, '2Checkout') + '</p></div>');
				} else {
					c.addClass('api-fail');
					var msg = (api_keys_data.twocheckoutapisettings.twocheckoutapi_seller_id.trim() && api_keys_data.twocheckoutapisettings.twocheckoutapi_publishable_key.trim() && api_keys_data.twocheckoutapisettings.twocheckoutapi_private_key.trim()) ? get_integration_api_message(2, result.message) : get_integration_api_message(3);
					c.find('.api-status').html('<div class="text-danger"><p>' + msg + '</p></div>');
				}
				if(api_keys_data.save) {
					b.text(b.data('saved'));
				}
				b.removeClass('disabled');
			},
			'json'
		);
	},
	get_keys : function(obj) {
		var $me = $('#thirdparty-provider-container-twoco-api');
// 		if(!$me.hasClass('api-fail')) {
// 			// clear settings to disconnect
// 			obj.find('.-integration-keys :input').val('');
// 		}
		var x = {twocheckoutapisettings : {}};

		$.each(obj.find('.-integration-keys :input').serialize().split('&'), function(i, v) {
			v = v.split('=');
			v[0] = decodeURIComponent(v[0]).replace('[', '["').replace(']', '"]');
			v[1] = decodeURIComponent(v[1]);
			eval ('x.' + v[0] + '=v[1]');
		});
		return x;
	}
}

integration_before_open['twoco-api'] = function(obj) {
	obj = $(obj);
	var $me = $('#thirdparty-provider-container-twoco-api');

	$me.off('.twoco-api');

	$me.on('click.twoco-api', '.save-keys', function() {
		var x = $.extend({save : true},WLM3ThirdPartyIntegration['twoco-api'].fxn.get_keys(obj));
		WLM3ThirdPartyIntegration['twoco-api'].fxn.test_keys(x);
	});

	$me.on('change.twoco-api', '.twoco-api-recurring-toggle', function() {
		var inputs = $($(this).data('target'));
		if($(this).is(':checked')) {
			inputs.show();
		} else {
			inputs.hide();
		}
	});

	$me.on('change.twoco-api', '#twoco-api-seller-id', function() {
		$('#twoco-api-vendor-id').val($(this).val());
	});

	$me.addClass('api-fail'); 

}

integration_after_open['twoco-api'] = function(obj) {
	obj = $(obj);
	var keydata = WLM3ThirdPartyIntegration['twoco-api'].fxn.get_keys(obj);
	WLM3ThirdPartyIntegration['twoco-api'].fxn.test_keys(keydata);

	obj.find('.twoco-api-recurring-toggle').change();
}