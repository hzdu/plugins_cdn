WLM3ThirdPartyIntegration.gotomeetingapi.fxn = {
	test_keys : function(x) {
		var c = $('#thirdparty-provider-container-gotomeetingapi'); 
		c.find('.api-status').html('<div class="text-warning"><p><em>Checking...</em></p></div>');
		var b = c.find('.save-keys').first();
		if(x.save) {
			b.text(b.data('saving'));
		}
		b.addClass('disabled');
		$.post(
			WLM3VARS.ajaxurl,
			{
				action: 'wlm3_gotomeetingapi_test_keys',
				data: x
			},
			function(result) {
				if(result.status) {
					c.removeClass('api-fail');
					c.find('.api-status').html('<div class="text-success"><p>' + get_integration_api_message(1, 'GoToWebinar&reg;') + '</p></div>');
					WLM3ThirdPartyIntegration.gotomeetingapi.webinars = result.webinars
					WLM3ThirdPartyIntegration.gotomeetingapi.webinars.unshift({id : '', text : ''});
					WLM3ThirdPartyIntegration.gotomeetingapi.fxn.load_webinars();
				} else {
					c.addClass('api-fail');
					var msg = x.webinar.gotomeetingapi.authorizationcode.trim() ? get_integration_api_message(2, result.message) : get_integration_api_message(3);
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
		var x = wlm.form2object( obj.find( '.-integration-keys' ).first() );
		$.extend(true, WLM3ThirdPartyIntegration.gotomeetingapi.webinar, x.webinar);
		return x;
	},
	load_webinars : function() {
		var $me = $('#thirdparty-provider-container-gotomeetingapi');
		$('select.gotomeetingapi-webinars').select2({"data" : WLM3ThirdPartyIntegration.gotomeetingapi.webinars}, true);
		$me.set_form_data(WLM3ThirdPartyIntegration.gotomeetingapi);
	}
}
integration_before_open['gotomeetingapi'] = function(obj) {
	var fxn = this;
	obj = $(obj);
	var $me = $('#thirdparty-provider-container-gotomeetingapi');

	fxn.save_keys = function(){
		var x = $.extend({save : true},WLM3ThirdPartyIntegration.gotomeetingapi.fxn.get_keys(obj));
		WLM3ThirdPartyIntegration.gotomeetingapi.fxn.test_keys(x);
	};

	$me.off('click', '.save-keys', fxn.save_keys);
	$me.on('click', '.save-keys', fxn.save_keys);

	$me.addClass('api-fail'); 
}
integration_after_open['gotomeetingapi'] = function(obj) {
	var fxn = this;
	obj = $(obj);

	WLM3ThirdPartyIntegration.gotomeetingapi.fxn.test_keys(
		WLM3ThirdPartyIntegration.gotomeetingapi.fxn.get_keys(obj)
	);
}