var wlm3_infusionsoft = {};
var wlm3_infusionsoft_last_options = '';
WLM3ThirdPartyIntegration.infusionsoft.fxn = {
	create_lists_tab : function() {
		$('#infusionsoft-lists-table').empty();
		var tmpl = _.template($('script#infusionsoft-lists-template').html(), {variable: 'data'});
		$.each(all_levels, function(k, v) {
			var data = {
				label : post_types[k].labels.name,
				ltype : k,
				levels : v
			}
			var html = tmpl(data);
			$('#infusionsoft-lists-table').append(html);
			return false;
		});
		$('#thirdparty-provider-container-infusionsoft .modal').set_form_data(WLM3ThirdPartyIntegration.infusionsoft);
	},
	tags_select : function(groups, tags) {
		wlm3_infusionsoft.options = $('<div/>');
		var optgroup, option;
		$.each(groups, function(group_id, group_name) {
				optgroup = $('<optgroup/>', {label : group_name})
		    $.each(tags[group_id], function(tag_id, tag) {
		    		optgroup.append($('<option/>', {value : tag.Id, text : tag.Name}));
		    });
		    wlm3_infusionsoft.options.append(optgroup);
		});
		if(wlm3_infusionsoft.options[0].innerHTML != wlm3_infusionsoft_last_options ) {
			wlm3_infusionsoft_last_options = wlm3_infusionsoft.options[0].innerHTML;
			// Create the products tab but don't load the tags-data as that will be handled by loadLevelPopUp().
			WLM3ThirdPartyIntegration.infusionsoft.fxn.create_lists_tab();
		}
	},
	test_keys : function(x) {
		var c = $('#thirdparty-provider-container-infusionsoft'); 
		c.find('.api-status').html('<div class="text-warning"><p><em>Checking...</em></p></div>');
		var b = c.find('.save-keys').first();
		if(x.save) {
			b.text(b.data('saving'));
		}
		b.addClass('disabled');
		$.post(
			WLM3VARS.ajaxurl,
			{
				action: 'wlm3_infusionsoft_ar_test_keys',
				data: x
			},
			function(result) {
				if(result.status) {
					c.removeClass('api-fail');
					c.find('.api-status').html('<div class="text-success"><p>' + get_integration_api_message(1, 'Infusionsoft') + ' <em>(Loading Tags)</em></p></div>');
					window.setTimeout(function() {
						WLM3ThirdPartyIntegration.infusionsoft.fxn.tags_select(result.tagscategory, result.tags);
						c.find('.api-status').html('<div class="text-success"><p>' + get_integration_api_message(1, 'Infusionsoft') + '</p></div>');
					}, 10);
				} else {
					c.addClass('api-fail');
					var msg = (x.ismname.trim() && x.iskey.trim()) ? get_integration_api_message(2, result.message) : get_integration_api_message(3);
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
		var $me = $('#thirdparty-provider-container-infusionsoft');
// 		if(!$me.hasClass('api-fail')) {
// 			obj.find('.-integration-keys :input').val('');
// 		}
		var x = {};
		obj.find('.-integration-keys :input').each(function(i,v) {
			x[v.name] = v.value;
		});
		return x;
	}
}
integration_before_open['infusionsoft'] = function(obj) {
	var fxn = this;
	obj = $(obj);
	var $me = $('#thirdparty-provider-container-infusionsoft');

	fxn.save_keys = function(){
		var x = $.extend({save : true},WLM3ThirdPartyIntegration.infusionsoft.fxn.get_keys(obj));
		WLM3ThirdPartyIntegration.infusionsoft.fxn.test_keys(x);
	};

	$me.off('click', '.save-keys', fxn.save_keys);
	$me.on('click', '.save-keys', fxn.save_keys);

	$me.addClass('api-fail'); 
}
integration_after_open['infusionsoft'] = function(obj) {
	var fxn = this;
	obj = $(obj);

	WLM3ThirdPartyIntegration.infusionsoft.fxn.test_keys(
		WLM3ThirdPartyIntegration.infusionsoft.fxn.get_keys(obj)
	);
}
// Only load the pop-up/tags data of the selected level.
function loadLevelPopUp(lvlid){
	var classname = 'select.infusionsoft-tags-' + lvlid;
	$(classname).html(wlm3_infusionsoft_last_options);
	$('#thirdparty-provider-container-infusionsoft').set_form_data(WLM3ThirdPartyIntegration.infusionsoft);
}