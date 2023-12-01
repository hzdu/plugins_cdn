WLM3ThirdPartyIntegration['eway'].fxn = {
	test_keys : function(x) {
		var c = $('#thirdparty-provider-container-eway'); 
		c.find('.api-status').html('<div class="text-warning"><p><em>Checking...</em></p></div>');
		var b = c.find('.save-keys').first();
		if(x.save) {
			b.text(b.data('saving'));
		}
		b.addClass('disabled');
		$.post(
			WLM3VARS.ajaxurl,
			{
				action: 'wlm3_eway_test_keys',
				data: x
			},
			function(result) {
				if(result.status) {
					c.removeClass('api-fail');
					c.find('.api-status').html('<div class="text-success"><p>' + get_integration_api_message(1, 'eWAY') + '</p></div>');
				} else {
					c.addClass('api-fail');
					var msg = (x.ewaysettings.eway_customer_id.trim() && x.ewaysettings.eway_username.trim() && x.ewaysettings.eway_password.trim()) ? get_integration_api_message(2, result.message) : get_integration_api_message(3);
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
		var $me = $('#thirdparty-provider-container-eway');
// 		if(!$me.hasClass('api-fail')) {
// 			// clear settings to disconnect
// 			obj.find('.-integration-keys :input').val('');
// 		}
		var x = {ewaysettings : {}};

		$.each(obj.find('.-integration-keys :input').serialize().split('&'), function(i, v) {
			v = v.split('=');
			v[0] = decodeURIComponent(v[0]).replace('[', '["').replace(']', '"]');
			v[1] = decodeURIComponent(v[1]);
			eval ('x.' + v[0] + '=v[1]');
		});
		return x;
	}
}

integration_before_open['eway'] = function(obj) {
	obj = $(obj);
	var $me = $('#thirdparty-provider-container-eway');

	$me.off('.eway');

	$me.on('click.eway', '.save-keys', function() {
		var x = $.extend({save : true},WLM3ThirdPartyIntegration['eway'].fxn.get_keys(obj));
		WLM3ThirdPartyIntegration['eway'].fxn.test_keys(x);
	});

	$me.on('change.eway', '.eway-recurring-toggle', function() {
		var inputs = $($(this).data('target'));
		if($(this).is(':checked')) {
			inputs.show();
		} else {
			inputs.hide();
		}
	});

	$me.on('change.eway', '#eway-seller-id', function() {
		$('#eway-vendor-id').val($(this).val());
	});

	$me.find('.wlm-datetimepicker').daterangepicker({
		singleDatePicker: true,
		showCustomRangeLabel: false,
		startDate: moment(),
		locale: {
			format: "MM/DD/YYYY"
		}
	});

	$me.addClass('api-fail'); 
}

integration_after_open['eway'] = function(obj) {
	obj = $(obj);
	var keydata = WLM3ThirdPartyIntegration['eway'].fxn.get_keys(obj);
	WLM3ThirdPartyIntegration['eway'].fxn.test_keys(keydata);

	obj.find('.eway-recurring-toggle').change();
}