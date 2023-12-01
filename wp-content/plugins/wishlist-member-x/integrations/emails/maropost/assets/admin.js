WLM3ThirdPartyIntegration.maropost.fxn = {
	test_keys : function(x) {
		var c = $('#thirdparty-provider-container-maropost'); 
		c.find('.api-status').html('<div class="text-warning"><p><em>Checking...</em></p></div>');
		var b = c.find('.save-keys').first();
		if(x.save) {
			b.text(b.data('saving'));
		}
		b.addClass('disabled');
		$.post(
			WLM3VARS.ajaxurl,
			{
				action: 'wlm3_maropost_test_keys',
				data: x
			},
			function(result) {
				if(result.status) {
					c.removeClass('api-fail');
					c.find('.api-status').html('<div class="text-success"><p>' + get_integration_api_message(1, 'Maropost') + '</p></div>');
					WLM3ThirdPartyIntegration.maropost.lists = result.lists;
					WLM3ThirdPartyIntegration.maropost.fxn.load_lists();
				} else {
					c.addClass('api-fail');
					var msg = (x.account_id.trim() && x.auth_token.trim()) ? get_integration_api_message(2, result.message) : get_integration_api_message(3);
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
		var $me = $('#thirdparty-provider-container-maropost');
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
		var $me = $('#thirdparty-provider-container-maropost');
		$('select.maropost-lists-select').select2({"data" : WLM3ThirdPartyIntegration.maropost.lists}, true);
		$me.set_form_data(WLM3ThirdPartyIntegration.maropost);
	}
}
integration_before_open['maropost'] = function(obj) {
	var fxn = this;
	obj = $(obj);
	var $me = $('#thirdparty-provider-container-maropost');

	fxn.save_keys = function(){
		var x = $.extend({save : true},WLM3ThirdPartyIntegration.maropost.fxn.get_keys(obj));
		WLM3ThirdPartyIntegration.maropost.fxn.test_keys(x);
	};

	$me.off('click', '.save-keys', fxn.save_keys);
	$me.on('click', '.save-keys', fxn.save_keys);

	$me.addClass('api-fail'); 
}
integration_after_open['maropost'] = function(obj) {
	var fxn = this;
	obj = $(obj);

	WLM3ThirdPartyIntegration.maropost.fxn.test_keys(
		WLM3ThirdPartyIntegration.maropost.fxn.get_keys(obj)
	);
}