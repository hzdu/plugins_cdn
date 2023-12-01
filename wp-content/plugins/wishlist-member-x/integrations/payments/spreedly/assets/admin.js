WLM3ThirdPartyIntegration['spreedly'].fxn = {
	test_keys : function(x) {
		var c = $('#thirdparty-provider-container-spreedly'); 
		c.find('.api-status').html('<div class="text-warning"><p><em>Checking...</em></p></div>');
		var b = c.find('.save-keys').first();
		if(x.save) {
			b.text(b.data('saving'));
		}
		b.addClass('disabled');
		$.post(
			WLM3VARS.ajaxurl,
			{
				action: 'wlm3_spreedly_test_keys',
				data: x
			},
			function(result) {
				if(result.status) {
					c.removeClass('api-fail');
					c.find('.api-status').html('<div class="text-success"><p>' + get_integration_api_message(1, 'Pin Payments') + '</p></div>');
					WLM3ThirdPartyIntegration['spreedly'].subscriptions = result.subscriptions;
					WLM3ThirdPartyIntegration['spreedly'].fxn.load_subscriptions();
				} else {
					c.addClass('api-fail');
					var msg = (x.spreedlyname.trim() && x.spreedlytoken.trim()) ? get_integration_api_message(2, result.message) : get_integration_api_message(3);
					c.find('.api-status').html('<div class="text-danger"><p>' + msg + '</p></div>');
				}
				if(x.save) {
					b.text(b.data('saved'));
				}
				b.removeClass('disabled');
			},
			'json'
		);
	},
	get_keys : function(obj) {
		var $me = $('#thirdparty-provider-container-spreedly');
// 		if(!$me.hasClass('api-fail')) {
// 			// clear settings to disconnect
// 			obj.find('.-integration-keys :input').val('');
// 		}
		var x = {};

		$.each(obj.find('.-integration-keys :input').serialize().split('&'), function(i, v) {
			v = v.split('=');
			v[0] = decodeURIComponent(v[0]).replace('[', '["').replace(']', '"]');
			v[1] = decodeURIComponent(v[1]);
			eval ('x.' + v[0] + '=v[1]');
		});
		return x;
	},
	load_subscriptions() {
		$('#spreedly-subscriptions-table').empty();
		var subs = WLM3ThirdPartyIntegration['spreedly'].subscriptions;
		if(!subs.length) return;
		var data = {
			tyurl : WLM3ThirdPartyIntegration['spreedly'].spreedlythankyou_url,
			subscriptions : subs
		}
		var tmpl = _.template($('script#spreedly-subscriptions-template').html(), {variable: 'data'});
		var html = tmpl(data);
		$('#spreedly-subscriptions-table').append(html);
	}
}

integration_before_open['spreedly'] = function(obj) {
	obj = $(obj);
	var $me = $('#thirdparty-provider-container-spreedly');

	$me.off('.spreedly');

	$me.on('click.spreedly', '.save-keys', function() {
		var x = $.extend({save : true},WLM3ThirdPartyIntegration['spreedly'].fxn.get_keys(obj));
		WLM3ThirdPartyIntegration['spreedly'].fxn.test_keys(x);
	});

	$me.addClass('api-fail'); 

}

integration_after_open['spreedly'] = function(obj) {
	obj = $(obj);
	var keydata = WLM3ThirdPartyIntegration['spreedly'].fxn.get_keys(obj);
	WLM3ThirdPartyIntegration['spreedly'].fxn.test_keys(keydata);

	obj.find('.spreedly-recurring-toggle').change();
}