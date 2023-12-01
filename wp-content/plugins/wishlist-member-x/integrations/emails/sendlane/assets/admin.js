WLM3ThirdPartyIntegration.sendlane.fxn = {
	test_keys : function(x) {
		var c = $('#thirdparty-provider-container-sendlane');
		c.find('.api-status').html('<div class="text-warning"><p><em>Checking...</em></p></div>');
		var b = c.find('.save-keys').first();
		if(x.save) {
			b.text(b.data('saving'));
		}
		b.addClass('disabled');
		$.post(
			WLM3VARS.ajaxurl,
			{
				action: 'wlm3_sendlane_test_keys',
				data: x,
			},
			function(result) {
				if ( result.status ) {
					c.removeClass('api-fail');
					c.find('.api-status').html('<div class="text-success"><p>' + get_integration_api_message(1, 'Sendlane') + '</p></div>');

					WLM3ThirdPartyIntegration.sendlane.tags = result.tags;
					WLM3ThirdPartyIntegration.sendlane.lists = result.lists;
					WLM3ThirdPartyIntegration.sendlane.fxn.set_options();
				} else {
					c.addClass('api-fail');
					var msg = x.api_key.trim() ? get_integration_api_message(2, result.message) : get_integration_api_message(3);
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
		var $me = $('#thirdparty-provider-container-sendlane');
// 		if(!$me.hasClass('api-fail')) {
// 			obj.find('.-integration-keys :input').val('');
// 		}
		var x = {};
		obj.find('.-integration-keys :input').each(function(i,v) {
			x[v.name] = v.value;
		});
		return x;
	},
	set_options : function() {
		var tags = WLM3ThirdPartyIntegration.sendlane.tags;
		var lists = WLM3ThirdPartyIntegration.sendlane.lists;

		var selects = $('select.sendlane-tags-select');
		selects.empty();
		$.each( tags, function(index, tag) {
			selects.append($('<option/>', {value : index, text : tag}));
		});

		var selects = $('select.sendlane-list-select');
		selects.empty();
		selects.append($('<option/>', {value : "", text : "- Select a list -"}));
		$.each( lists, function(index, list) {
			selects.append($('<option/>', {value : index, text : list}));
		});

		$('.modal-sendlane-actions').set_form_data(WLM3ThirdPartyIntegration.sendlane);
	}
}

integration_before_open['sendlane'] = function(obj) {
	var fxn = this;
	obj = $(obj);
	var $me = $('#thirdparty-provider-container-sendlane');

	fxn.save_keys = function(){
		var x = $.extend({save : true},WLM3ThirdPartyIntegration.sendlane.fxn.get_keys(obj));
		WLM3ThirdPartyIntegration.sendlane.fxn.test_keys(x);
	};

	$me.off('click', '.save-keys', fxn.save_keys);
	$me.on('click', '.save-keys', fxn.save_keys);

	$me.addClass('api-fail');
	$me.transformers();
}
integration_after_open['sendlane'] = function(obj) {
	var fxn = this;
	obj = $(obj);

	WLM3ThirdPartyIntegration.sendlane.fxn.test_keys(
		WLM3ThirdPartyIntegration.sendlane.fxn.get_keys(obj)
	);
}