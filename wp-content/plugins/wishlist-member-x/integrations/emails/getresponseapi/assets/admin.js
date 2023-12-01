WLM3ThirdPartyIntegration.getresponseAPI.fxn = {
	test_keys : function(x) {
		var c = $('#thirdparty-provider-container-getresponseAPI'); 
		c.find('.api-status').html('<div class="text-warning"><p><em>Checking...</em></p></div>');
		var b = c.find('.save-keys').first();
		if(x.save) {
			b.text(b.data('saving'));
		}
		b.addClass('disabled');
		$.post(
			WLM3VARS.ajaxurl,
			{
				action: 'wlm3_getresponseAPI_test_keys',
				data: x
			},
			function(result) {
				if(result.status) {
					c.removeClass('api-fail');
					c.find('.api-status').html('<div class="text-success"><p>' + get_integration_api_message(1, 'GetResponse') + '</p></div>');
					var select2data = [];
					$.each(result.campaigns, function(index, campaign) {
						select2data.push({id:campaign.name,text:campaign.name})
					});
					c.find(':input[name^="list_actions"]').css('width','100%').select2({theme:'bootstrap',data:select2data,allowClear:true,placeholder:wp.i18n.__('Select a list name')});
				} else {
					c.addClass('api-fail');
					var msg = (x.apikey.trim() && x.api_url.trim()) ? get_integration_api_message(2, result.message) : get_integration_api_message(3);
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
		var $me = $('#thirdparty-provider-container-getresponseAPI');
// 		if(!$me.hasClass('api-fail')) {
// 			obj.find('.-integration-keys :input').val('');
// 		}
		var x = {};
		obj.find('.-integration-keys :input').each(function(i,v) {
			x[v.name] = v.value;
		});
		return x;
	}
}
integration_before_open['getresponseAPI'] = function(obj) {
	var fxn = this;
	obj = $(obj);
	var $me = $('#thirdparty-provider-container-getresponseAPI');

	fxn.save_keys = function(){
		var x = $.extend({save : true},WLM3ThirdPartyIntegration.getresponseAPI.fxn.get_keys(obj));
		WLM3ThirdPartyIntegration.getresponseAPI.fxn.test_keys(x);
	};

	$me.off('click', '.save-keys', fxn.save_keys);
	$me.on('click', '.save-keys', fxn.save_keys);

	$me.addClass('api-fail'); 
}
integration_after_open['getresponseAPI'] = function(obj) {
	var fxn = this;
	obj = $(obj);

	WLM3ThirdPartyIntegration.getresponseAPI.fxn.test_keys(
		WLM3ThirdPartyIntegration.getresponseAPI.fxn.get_keys(obj)
	);
}