WLM3ThirdPartyIntegration.ontraport.fxn = {
	test_keys : function(x) {
		var c = $('#thirdparty-provider-container-ontraport'); 
		c.find('.api-status').html('<div class="text-warning"><p><em>Checking...</em></p></div>');
		var b = c.find('.save-keys').first();
		if(x.save) {
			b.text(b.data('saving'));
		}
		b.addClass('disabled');
		$.post(
			WLM3VARS.ajaxurl,
			{
				action: 'wlm3_ontraport_test_keys',
				data: x
			},
			function(result) {
				if(result.status) {
					c.removeClass('api-fail');
					c.find('.api-status').html('<div class="text-success"><p>' + get_integration_api_message(1, 'Ontraport') + '</p></div>');
					WLM3ThirdPartyIntegration.ontraport.tag_options = result.tag_options;
					WLM3ThirdPartyIntegration.ontraport.sequence_options = result.sequence_options;
					WLM3ThirdPartyIntegration.ontraport.fxn.load_lists();
				} else {
					c.addClass('api-fail');
					var msg = (x.app_id.trim() && x.api_key.trim()) ? get_integration_api_message(2, result.message) : get_integration_api_message(3);
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
		var $me = $('#thirdparty-provider-container-ontraport');
// 		if(!$me.hasClass('api-fail')) {
// 			obj.find('.-integration-keys :input').val('');
// 		}
		var x = {};
		obj.find('.-integration-keys :input').each(function(i,v) {
			x[v.name] = v.value;
		});
		return x;
	},
	load_lists : function() {
		var $me = $('#thirdparty-provider-container-ontraport');
		$('select.ontraport-tags').select2({"data" : WLM3ThirdPartyIntegration.ontraport.tag_options}, true);
		$('select.ontraport-sequences').select2({"data" : WLM3ThirdPartyIntegration.ontraport.sequence_options}, true);
		$me.set_form_data(WLM3ThirdPartyIntegration.ontraport);
	}
}
integration_before_open['ontraport'] = function(obj) {
	var fxn = this;
	obj = $(obj);
	var $me = $('#thirdparty-provider-container-ontraport');

	fxn.save_keys = function(){
		var x = $.extend({save : true},WLM3ThirdPartyIntegration.ontraport.fxn.get_keys(obj));
		WLM3ThirdPartyIntegration.ontraport.fxn.test_keys(x);
	};

	$me.off('click', '.save-keys', fxn.save_keys);
	$me.on('click', '.save-keys', fxn.save_keys);

	$me.addClass('api-fail'); 
}
integration_after_open['ontraport'] = function(obj) {
	var fxn = this;
	obj = $(obj);

	WLM3ThirdPartyIntegration.ontraport.fxn.test_keys(
		WLM3ThirdPartyIntegration.ontraport.fxn.get_keys(obj)
	);
}