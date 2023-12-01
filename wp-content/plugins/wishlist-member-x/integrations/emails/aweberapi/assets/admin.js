WLM3ThirdPartyIntegration.aweberapi.fxn = {
	test_keys : function(x) {
		var c = $('#thirdparty-provider-container-aweberapi');
		c.addClass('api-testing');
		c.find('.api-status').html('<div class="text-warning"><p><em>Checking...</em></p></div>');
		var b = c.find('.save-keys').first();
		if(x.save) {
			b.text(b.data('saving'));
		}
		b.addClass('disabled');
		$.post(
			WLM3VARS.ajaxurl,
			{
				action: 'wlm3_aweberapi_test_keys',
				data: x
			},
			function(result) {
				c.removeClass('api-testing');
				if(result.status) {
					c.removeClass('api-fail');
					c.find('.api-status').html('<div class="text-success"><p>' + get_integration_api_message(1, 'AWeber API') + '</p></div>');
					WLM3ThirdPartyIntegration.aweberapi.fxn.set_list_options(result.lists);
					$('#connectedkey, [name=auth_key]').val(result.data.auth_key);
				} else {
					c.addClass('api-fail');
					x = $.extend({}, {auth_key : '', connectedkey : ''}, x);
					var msg = (x.auth_key.trim() || x.connectedkey.trim()) ? get_integration_api_message(2, result.message) : get_integration_api_message(3);
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
		var $me = $('#thirdparty-provider-container-aweberapi');
// 		if(!$me.hasClass('api-fail')) {
// 			obj.find('.-integration-keys textarea').val('');
// 		}
		var x = {};
		obj.find('.-integration-keys textarea[name]').each(function(i,v) {
			x[v.name] = v.value;
		});

		return x;
	},
	set_list_options : function(lists) {
		var $me = $('#thirdparty-provider-container-aweberapi');
		var selects = $me.find('.aweberapi-connections');
		selects.empty().append($('<option>', {value : '', text : '- None -'}));
		$.each(lists, function(index, list) {
			selects.append($('<option>', {value: list.id, text: list.name}));
		});
		$me.find('.lists_column').set_form_data(WLM3ThirdPartyIntegration.aweberapi);
	}
}
integration_before_open['aweberapi'] = function(obj) {
	var fxn = this;
	obj = $(obj);
	var $me = $('#thirdparty-provider-container-aweberapi');

	fxn.save_keys = function(){
		var c = $('#thirdparty-provider-container-aweberapi');
		var api_status = c.find('.api-status')[0].innerText;
		c.addClass('api-testing');
		if ( api_status == "Connected" ){
		    var x = $.extend({ remove : true},WLM3ThirdPartyIntegration.aweberapi.fxn.get_keys(obj));
		}else{
		    var x = $.extend({save : true},WLM3ThirdPartyIntegration.aweberapi.fxn.get_keys(obj));
		}
		WLM3ThirdPartyIntegration.aweberapi.fxn.test_keys(x);
	};

	$me.off('click', '.save-keys', fxn.save_keys);
	$me.on('click', '.save-keys', fxn.save_keys);

	$me.addClass('api-fail');

	$me.off('click', '#hassites-toggle input');
	$me.on('click', '#hassites-toggle input', function() {
		if( '-hassites-yes' == this.id ) {
			$('#hassites-yes').show();
		} else {
			$('#hassites-yes').hide();
		}
	});

}
integration_after_open['aweberapi'] = function(obj) {
	var fxn = this;
	obj = $(obj);

	WLM3ThirdPartyIntegration.aweberapi.fxn.test_keys(
		WLM3ThirdPartyIntegration.aweberapi.fxn.get_keys(obj)
	);
}
