WLM3ThirdPartyIntegration.mailpoet.fxn = {
	set_list_options : function() {
		WLM3ThirdPartyIntegration.mailpoet.fxn.load_list_table();

		var $me = $('#thirdparty-provider-container-mailpoet');
		var selects = $me.find('.mailpoet-lists-select');
		var lists = WLM3ThirdPartyIntegration.mailpoet.mailpoet_lists;

		lists = $.map( lists, function( list ) {
			return { id : list.id, value : list.id, text : list.name, name : list.name };
		} );
		lists.unshift( { id : '', value : '', text : '', name : '' } );
		selects.select2({data : lists, placeholder : wp.i18n.__( 'Select a List', 'wishlist-member' ), allowClear : true}, true);

		$('#thirdparty-provider-container-mailpoet').set_form_data(WLM3ThirdPartyIntegration.mailpoet);
	},
	load_list_table : function() {
		$.each(all_levels, function(k, v) {
			var data = {
				label : post_types[k].labels.name,
				levels : v
			}
			var tmpl = _.template($('script#mailpoet-lists-template').html(), {variable: 'data'});
			var html = tmpl(data);
			$('#mailpoet-lists-table table tbody').html(html);
			return false;
		});		
	}
}
integration_before_open['mailpoet'] = function(obj) {
	var fxn = this;
	obj = $(obj);
	var $me = $('#thirdparty-provider-container-mailpoet');

	fxn.save_keys = function(){
		var x = $.extend({save : true},WLM3ThirdPartyIntegration.mailpoet.fxn.get_keys(obj));
		WLM3ThirdPartyIntegration.mailpoet.fxn.test_keys(x);
	};

	$me.off('click', '.save-keys', fxn.save_keys);
	$me.on('click', '.save-keys', fxn.save_keys);

	$me.addClass('api-fail'); 
}

integration_after_open['mailpoet'] = function(obj) {
	WLM3ThirdPartyIntegration.mailpoet.fxn.set_list_options();
}