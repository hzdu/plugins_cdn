WLM3ThirdPartyIntegration.drip.fxn = {
	test_keys : function(x) {
		var c = $('#thirdparty-provider-container-drip'); 
		c.find('.api-status').html('<div class="text-warning"><p><em>Checking...</em></p></div>');
		var b = c.find('.save-keys').first();
		if(x.save) {
			b.text(b.data('saving'));
		}
		b.addClass('disabled');
		$.post(
			WLM3VARS.ajaxurl,
			{
				action: 'wlm3_drip_test_keys',
				data: x
			},
			function(result) {
				if(result.status) {
					c.removeClass('api-fail');
					c.find('.api-status').html('<div class="text-success"><p>' + get_integration_api_message(1, 'Drip') + '</p></div>');
					
					WLM3ThirdPartyIntegration.drip.fxn.set_campaigns_options(result.campaigns);
				} else {
					c.addClass('api-fail');
					var msg = x.apitoken.trim() ? get_integration_api_message(2, result.message) : get_integration_api_message(3);
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
		var $me = $('#thirdparty-provider-container-drip');
// 		if(!$me.hasClass('api-fail')) {
// 			obj.find('.-integration-keys :input').val('');
// 		}
		var x = {};
		obj.find('.-integration-keys :input').each(function(i,v) {
			x[v.name] = v.value;
		});
		return x;
	},
	set_campaigns_options : function(campaigns) {
		var $me = $('#thirdparty-provider-container-drip');
		var selects = $me.find('select.drip-campaigns-select');
		selects.empty().append($('<option/>', {value : '', text : '- None - '}));
		$.each(campaigns, function(index, campaign) {
			selects.append($('<option/>', campaign));
		});
		$('#thirdparty-provider-container-drip .modal').set_form_data(WLM3ThirdPartyIntegration.drip);
	}
}
integration_before_open['drip'] = function(obj) {
	var fxn = this;
	obj = $(obj);
	var $me = $('#thirdparty-provider-container-drip');

	fxn.save_keys = function(){
		var x = $.extend({save : true},WLM3ThirdPartyIntegration.drip.fxn.get_keys(obj));
		WLM3ThirdPartyIntegration.drip.fxn.test_keys(x);
	};

	$me.off('click', '.save-keys', fxn.save_keys);
	$me.on('click', '.save-keys', fxn.save_keys);

	$me.addClass('api-fail'); 
}
integration_after_open['drip'] = function(obj) {
	var fxn = this;
	obj = $(obj);

	WLM3ThirdPartyIntegration.drip.fxn.test_keys(
		WLM3ThirdPartyIntegration.drip.fxn.get_keys(obj)
	);
}