WLM3ThirdPartyIntegration.drip2.fxn = {
	test_keys : function(x) {
		var c = $('#thirdparty-provider-container-drip2'); 
		c.find('.api-status').html('<div class="text-warning"><p><em>Checking...</em></p></div>');
		var b = c.find('.save-keys').first();
		if(x.save) {
			b.text(b.data('saving'));
		}
		b.addClass('disabled');
		$.post(
			WLM3VARS.ajaxurl,
			{
				action: 'wlm3_drip2_test_keys',
				data: x
			},
			function(result) {
				if(result.status) {
					c.removeClass('api-fail');
					c.find('.api-status').html('<div class="text-success"><p>' + get_integration_api_message(1, 'Drip') + '</p></div>');
					
					WLM3ThirdPartyIntegration.drip2.tags = result.tags;
					WLM3ThirdPartyIntegration.drip2.fxn.set_account_options(result.accounts);
					WLM3ThirdPartyIntegration.drip2.fxn.set_tags_options();
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
		var $me = $('#thirdparty-provider-container-drip2');
// 		if(!$me.hasClass('api-fail')) {
// 			obj.find('.-integration-keys :input').val('');
// 		}
		var x = {};
		obj.find('.-integration-keys :input').each(function(i,v) {
			x[v.name] = v.value;
		});
		return x;
	},
	set_account_options : function(accounts) {
		var $me = $('#thirdparty-provider-container-drip2');
		var select = $me.find('select[name=account]').first();
		select.empty();
		$.each(accounts, function(index, account) {
			select.append($('<option/>', account));
		});
		select.val(WLM3ThirdPartyIntegration.drip2.account).trigger('change.select2');
	},
	set_tags_options : function() {
		var tags = WLM3ThirdPartyIntegration.drip2.tags;
		var $me = $('#thirdparty-provider-container-drip2');
		var account = $me.find('select[name=account]').first().val();
		var selects = $me.find('select.drip2-tags-select');
		selects.empty();
		var the_tags = [];
		if(account in tags) {
			the_tags = tags[account];
		}
		$.each(the_tags, function(index, tag) {
			selects.append($('<option/>', tag));
		});

		$('#thirdparty-provider-container-drip2 .modal').set_form_data(WLM3ThirdPartyIntegration.drip2);
	}
}
integration_before_open['drip2'] = function(obj) {
	var fxn = this;
	obj = $(obj);
	var $me = $('#thirdparty-provider-container-drip2');

	fxn.save_keys = function(){
		var x = $.extend({save : true},WLM3ThirdPartyIntegration.drip2.fxn.get_keys(obj));
		WLM3ThirdPartyIntegration.drip2.fxn.test_keys(x);
	};

	$me.off('click', '.save-keys', fxn.save_keys);
	$me.on('click', '.save-keys', fxn.save_keys);

	$me.off('change', 'select[name=account]');
	$me.on('change', 'select[name=account]', WLM3ThirdPartyIntegration.drip2.fxn.set_tags_options);

	$me.addClass('api-fail'); 
	$me.transformers();
}
integration_after_open['drip2'] = function(obj) {
	var fxn = this;
	obj = $(obj);

	WLM3ThirdPartyIntegration.drip2.fxn.test_keys(
		WLM3ThirdPartyIntegration.drip2.fxn.get_keys(obj)
	);
}