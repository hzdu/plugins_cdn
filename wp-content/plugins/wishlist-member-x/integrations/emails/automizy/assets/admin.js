WLM3ThirdPartyIntegration.automizy.fxn = {
	test_keys : function(x) {
		var c = $('#thirdparty-provider-container-automizy');
		c.find('.api-status').html('<div class="text-warning"><p><em>Checking...</em></p></div>');
		var b = c.find('.save-keys').first();
		if(x.save) {
			b.text(b.data('saving'));
		}
		b.addClass('disabled');
		$.post(
			WLM3VARS.ajaxurl,
			{
				action: 'wlm3_automizy_test_keys',
				data: x,
			},
			function(result) {
				if ( result.status ) {
					c.removeClass('api-fail');
					c.find('.api-status').html('<div class="text-success"><p>' + get_integration_api_message(1, 'Automizy') + '</p></div>');

					WLM3ThirdPartyIntegration.automizy.tags = result.tags;
					WLM3ThirdPartyIntegration.automizy.lists = result.lists;
					WLM3ThirdPartyIntegration.automizy.fxn.set_options();
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
		var $me = $('#thirdparty-provider-container-automizy');
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
		var tags = WLM3ThirdPartyIntegration.automizy.tags;
		var lists = WLM3ThirdPartyIntegration.automizy.lists;

		var selects = $('select.automizy-tags-select');
		selects.empty();
		$.each( tags, function(index, tag) {
			selects.append($('<option/>', {value : index, text : tag}));
		});

		var selects = $('select.automizy-list-select');
		selects.empty();
		selects.append($('<option/>', {value : "", text : "- Select a list -"}));
		$.each( lists, function(index, list) {
			selects.append($('<option/>', {value : index, text : list}));
		});

		$('.modal-automizy-actions').set_form_data(WLM3ThirdPartyIntegration.automizy);
	}
}

integration_before_open['automizy'] = function(obj) {
	var fxn = this;
	obj = $(obj);
	var $me = $('#thirdparty-provider-container-automizy');

	fxn.save_keys = function(){
		var x = $.extend({save : true},WLM3ThirdPartyIntegration.automizy.fxn.get_keys(obj));
		WLM3ThirdPartyIntegration.automizy.fxn.test_keys(x);
	};

	$me.off('click', '.save-keys', fxn.save_keys);
	$me.on('click', '.save-keys', fxn.save_keys);

	$me.addClass('api-fail');
	$me.transformers();
}
integration_after_open['automizy'] = function(obj) {
	var fxn = this;
	obj = $(obj);

	WLM3ThirdPartyIntegration.automizy.fxn.test_keys(
		WLM3ThirdPartyIntegration.automizy.fxn.get_keys(obj)
	);
}