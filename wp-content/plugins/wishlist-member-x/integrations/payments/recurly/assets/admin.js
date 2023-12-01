WLM3ThirdPartyIntegration['recurly'].fxn = {
	test_keys : function(api_keys_data) {
		var c = $('#thirdparty-provider-container-recurly'); 
		c.find('.api-status').html('<div class="text-warning"><p><em>Checking...</em></p></div>');
		var b = c.find('.save-keys').first();
		if(api_keys_data.save) {
			b.text(b.data('saving'));
		}
		b.addClass('disabled');
		$.post(
			WLM3VARS.ajaxurl,
			{
				action: 'wlm3_recurly_test_keys',
				data: api_keys_data
			},
			function(result) {
				if(result.status) {
					c.removeClass('api-fail');
					c.find('.api-status').html('<div class="text-success"><p>' + get_integration_api_message(1, 'Recurly') + '</p></div>');
					WLM3ThirdPartyIntegration.recurly.plans = result.plans;
					WLM3ThirdPartyIntegration.recurly.fxn.populate_plans();
				} else {
					c.addClass('api-fail');
					var msg = api_keys_data.recurlyapikey.trim() ? get_integration_api_message(2, result.message) : get_integration_api_message(3);
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
		var $me = $('#thirdparty-provider-container-recurly');
// 		if(!$me.hasClass('api-fail')) {
// 			// clear settings to disconnect
// 			obj.find('.-integration-keys :input').val('');
// 		}
		var x = {recurlysettings : {}};

		$.each(obj.find('.-integration-keys :input').serialize().split('&'), function(i, v) {
			v = v.split('=');
			v[0] = decodeURIComponent(v[0]).replace('[', '["').replace(']', '"]');
			v[1] = decodeURIComponent(v[1]);
			eval ('x.' + v[0] + '=v[1]');
		});
		return x;
	},
	populate_plans() {
		var $me = $('#thirdparty-provider-container-recurly');
		$('.recurlyplans').select2({data : WLM3ThirdPartyIntegration.recurly.plans}, true);
		$me.set_form_data(WLM3ThirdPartyIntegration.recurly);
	}
}

integration_before_open['recurly'] = function(obj) {
	obj = $(obj);
	var $me = $('#thirdparty-provider-container-recurly');

	$me.off('.recurly');

	$me.on('click.recurly', '.save-keys', function() {
		var x = $.extend({save : true},WLM3ThirdPartyIntegration['recurly'].fxn.get_keys(obj));
		WLM3ThirdPartyIntegration['recurly'].fxn.test_keys(x);
	});

	$me.addClass('api-fail'); 
}

integration_after_open['recurly'] = function(obj) {
	obj = $(obj);
	var keydata = WLM3ThirdPartyIntegration['recurly'].fxn.get_keys(obj);
	WLM3ThirdPartyIntegration['recurly'].fxn.test_keys(keydata);
}