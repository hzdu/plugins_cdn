WLM3ThirdPartyIntegration.mailchimp.fxn = {
	test_keys : function(x) {
		var c = $('#thirdparty-provider-container-mailchimp'); 
		c.find('.api-status').html('<div class="text-warning"><p><em>Checking...</em></p></div>');
		var b = c.find('.save-keys').first();
		if(x.save) {
			b.text(b.data('saving'));
		}
		b.addClass('disabled');
		$.post(
			WLM3VARS.ajaxurl,
			{
				action: 'wlm3_mailchimp_test_keys',
				data: x
			},
			function(result) {
				if(result.status) {
					c.removeClass('api-fail');
					c.find('.api-status').html('<div class="text-success"><p>' + get_integration_api_message(1, 'MailChimp') + '</p></div>');
					WLM3ThirdPartyIntegration.mailchimp.lists = result.lists;
					WLM3ThirdPartyIntegration.mailchimp.fxn.set_list_options();
				} else {
					c.addClass('api-fail');
					var msg = x.mcapi.trim() ? get_integration_api_message(2, result.message) : get_integration_api_message(3);
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
		var $me = $('#thirdparty-provider-container-mailchimp');
		var x = {};
		obj.find('.-integration-keys :input').each(function(i,v) {
			x[v.name] = v.value;
			if(v.type == 'checkbox' && !v.checked) {
				x[v.name] = 0;
			}
		});
		return x;
	},
	set_list_options : function() {
		var $me = $('#thirdparty-provider-container-mailchimp');
		var selects = $me.find('.mailchimp-lists-select');
		var lists = WLM3ThirdPartyIntegration.mailchimp.lists;

		lists = $.map( lists, function( list ) {
			return { id : list.id, value : list.id, text : list.name, name : list.name };
		} );
		lists.unshift( { id : '', value : '', text : '', name : '' } );
		selects.select2({data : lists, placeholder : wp.i18n.__( 'Select a List', 'wishlist-member' ), allowClear : true}, true);

		$('#thirdparty-provider-container-mailchimp').set_form_data(WLM3ThirdPartyIntegration.mailchimp);
	}
}
integration_before_open['mailchimp'] = function(obj) {
	var fxn = this;
	obj = $(obj);
	var $me = $('#thirdparty-provider-container-mailchimp');

	fxn.save_keys = function(){
		var x = $.extend({save : true},WLM3ThirdPartyIntegration.mailchimp.fxn.get_keys(obj));
		WLM3ThirdPartyIntegration.mailchimp.fxn.test_keys(x);
	};

	$me.undelegate('.mailchimp');

	$me.on('click.mailchimp', '.save-keys', fxn.save_keys);

	$me.on('change.mailchimp', '.mailchimp-lists-select, .mailchimp-actions-select', function() {
		var v = $(this).val();
		WLM3ThirdPartyIntegration.mailchimp[this.name] = v;
		var ig = $(this).closest('.row').find('.interest-group');
		var igs = $(this).closest('.modal').find('.interest-group select');
		var list = $(this).closest('.row').find('select.mailchimp-lists-select').first().val();
		if(v && v!='unsub') {
			if(v == list) {
				var data = {
					action : 'wlm3_mailchimp_get_list_groups',
					data : {
						mcapi : WLM3ThirdPartyIntegration.mailchimp.mcapi,
						list_id : list,
					},
				}
				ig.show();
				igs.closest(".form-group").find("label").html("Loading Interest Groups, please wait...");

				$.post(WLM3VARS.ajaxurl, data, function(result) {
                    var items = [];
                    $.each( result.groups, function () {
                        var item = {
                            text : this.title,
                            children : [],
                        }
                        $.each( this.interests, function( key, value ) {
                            item.children.push( {
                                id : key,
                                text : value
                            } );
                        })
                        items.push( item );
                    } );
                    igs.closest(".form-group").find("label").html("Interest Groups");
                    if ( igs.data('select2') ) igs.select2('destroy');
                    igs.html("");
                    igs.select2( { data : items, allowEmpty : true }, true );
                    igs.closest(".form-group").set_form_data(WLM3ThirdPartyIntegration.mailchimp);
                    igs.trigger('change');
                });
			} else {
				ig.show();
			}
		} else {
			ig.hide();
		}
	});

	$me.addClass('api-fail'); 
}
integration_after_open['mailchimp'] = function(obj) {
	var fxn = this;
	obj = $(obj);

	WLM3ThirdPartyIntegration.mailchimp.fxn.test_keys(
		WLM3ThirdPartyIntegration.mailchimp.fxn.get_keys(obj)
	);
}