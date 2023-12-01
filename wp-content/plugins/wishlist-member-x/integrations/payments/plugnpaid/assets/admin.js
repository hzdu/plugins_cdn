WLM3ThirdPartyIntegration.plugnpaid.fxn = {
	test_keys : function(x) {
		var c = $('#thirdparty-provider-container-plugnpaid'); 
		c.find('.api-status').html('<div class="text-warning"><p><em>Checking...</em></p></div>');
		var b = c.find('.save-keys').first();
		if(x.save) {
			b.text(b.data('saving'));
		}
		b.addClass('disabled');
		$.post(
			WLM3VARS.ajaxurl,
			{
				action: 'wlm3_plugnpaid_test_keys',
				data: x
			},
			function(result) {
				if(result.status) {
					c.removeClass('api-fail');
					c.find('.api-status').html('<div class="text-success"><p>' + get_integration_api_message(1, 'plug&paid') + '</p></div>');
					WLM3ThirdPartyIntegration.plugnpaid = $.extend( {}, WLM3ThirdPartyIntegration.plugnpaid, result.data );
					var products = Object.values(result.data.products_options);
					$('select[name^=plugnpaid_products]').select2({data : products}, true);
					$('#thirdparty-provider-container-plugnpaid').set_form_data(WLM3ThirdPartyIntegration.plugnpaid);

					WLM3ThirdPartyIntegration.plugnpaid.fxn.reload_table();
				} else {
					c.addClass('api-fail');
					var msg = x.plugnpaidapikey.trim() ? get_integration_api_message(2, result.message) : get_integration_api_message(3);
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
		var $me = $('#thirdparty-provider-container-plugnpaid');
// 		if(!$me.hasClass('api-fail')) {
// 			obj.find('.-integration-keys :input').val('');
// 		}
		var x = {};
		obj.find('.-integration-keys :input').each(function(i,v) {
			x[v.name] = v.value;
		});
		return x;
	},
	reload_table : function() {
		$('#plugnpaid-products-table').empty();
		$.each(all_levels, function(k, v) {
			if(!Object.keys(v).length) return true;
			var data = {
				type : k,
				label : post_types[k].labels.name,
				levels : v
			}
			var tmpl = _.template($('script#plugnpaid-products-template').html(), {variable: 'data'});
			var html = tmpl(data);
			$('#plugnpaid-products-table').append(html);
		});

	}
}
integration_before_open['plugnpaid'] = function(obj) {
	var fxn = this;
	obj = $(obj);
	var $me = $('#thirdparty-provider-container-plugnpaid');

	fxn.save_keys = function(){
		var x = $.extend({save : true},WLM3ThirdPartyIntegration.plugnpaid.fxn.get_keys(obj));
		WLM3ThirdPartyIntegration.plugnpaid.fxn.test_keys(x);
	};

	$me.on('click', '.save-keys', fxn.save_keys);

	$me.addClass('api-fail'); 
}
integration_after_open['plugnpaid'] = function(obj) {
	var fxn = this;
	obj = $(obj);

	$('#plugnpaid-products-table .plugnpaid-plan-toggle').trigger('change');

	WLM3ThirdPartyIntegration.plugnpaid.fxn.test_keys(WLM3ThirdPartyIntegration.plugnpaid.fxn.get_keys(obj));
}
integration_modal_save['plugnpaid'] = function() {
	WLM3ThirdPartyIntegration.plugnpaid.fxn.reload_table();
}