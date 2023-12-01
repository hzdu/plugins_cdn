WLM3ThirdPartyIntegration.moosend.fxn = {
	test_keys : function(x) {
		var c = $('#thirdparty-provider-container-moosend'); 
		c.find('.api-status').html('<div class="text-warning"><p><em>Checking...</em></p></div>');
		var b = c.find('.save-keys').first();
		if(x.save) {
			b.text(b.data('saving'));
		}
		b.addClass('disabled');
		$.post(
			WLM3VARS.ajaxurl,
			{
				action: 'wlm3_moosend_test_keys',
				data: x
			},
			function(result) {
				if(result.status) {
					c.removeClass('api-fail');
					c.find('.api-status').html('<div class="text-success"><p>' + get_integration_api_message(1, 'Moosend') + '</p></div>');
					WLM3ThirdPartyIntegration.moosend.apilists = result.lists;
					WLM3ThirdPartyIntegration.moosend.fxn.set_list_options();
				} else {
					c.addClass('api-fail');
					var msg = (x.api_key.trim()) ? get_integration_api_message(2, result.message) : get_integration_api_message(3);
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
		var $me = $('#thirdparty-provider-container-moosend');
		var x = {};
		obj.find('.-integration-keys :input').each(function(i,v) {
			x[v.name] = v.value;
		});
		return x;
	},
	set_list_options : function() {
		var $me = $('#thirdparty-provider-container-moosend');
		var selects = $me.find('.moosend-lists-select');
		var lists = WLM3ThirdPartyIntegration.moosend.apilists;

		lists = $.map( lists, function( list ) {
			return { id : list.ID, value : list.ID, text : list.Name, name : list.Name };
		} );
		lists.unshift( { id : '', value : '', text : '', name : '' } );
		selects.select2({data : lists, placeholder : wp.i18n.__( 'Select a List', 'wishlist-member' ), allowClear : true}, true);

		$('#thirdparty-provider-container-moosend').set_form_data(WLM3ThirdPartyIntegration.moosend);
	}
}
integration_before_open['moosend'] = function(obj) {
	var fxn = this;
	obj = $(obj);
	var $me = $('#thirdparty-provider-container-moosend');

	fxn.save_keys = function(){
		var x = $.extend({save : true},WLM3ThirdPartyIntegration.moosend.fxn.get_keys(obj));
		WLM3ThirdPartyIntegration.moosend.fxn.test_keys(x);
	};

	$me.off('click', '.save-keys', fxn.save_keys);
	$me.on('click', '.save-keys', fxn.save_keys);

	$me.addClass('api-fail'); 
}
integration_after_open['moosend'] = function(obj) {
	var fxn = this;
	obj = $(obj);

	WLM3ThirdPartyIntegration.moosend.fxn.test_keys(
		WLM3ThirdPartyIntegration.moosend.fxn.get_keys(obj)
	);
}