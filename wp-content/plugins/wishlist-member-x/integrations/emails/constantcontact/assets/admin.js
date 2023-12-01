WLM3ThirdPartyIntegration.constantcontact.fxn = {
	test_keys : function(x) {
		var c = $( '#thirdparty-provider-container-constantcontact' );
		c.find( '.api-status' ).html( '<div class="text-warning"><p><em>Checking...</em></p></div>' );
		$.post(
			WLM3VARS.ajaxurl,
			{
				action: 'wlm3_constantcontact_test_keys',
			},
			function(result) {
				if (result.status) {
					c.removeClass( 'api-fail' );
					c.find( '.api-status' ).html( '<div class="text-success"><p>' + get_integration_api_message( 1, 'Constant Contact' ) + '</p></div>' );
					WLM3ThirdPartyIntegration.constantcontact.lists = result.lists;
					WLM3ThirdPartyIntegration.constantcontact.fxn.set_list_options();
					WLM3ThirdPartyIntegration.constantcontact.tags = result.tags;
					WLM3ThirdPartyIntegration.constantcontact.fxn.set_tag_options();
				} else {
					c.addClass( 'api-fail' );
					c.find( '.api-status' ).html( '<div class="text-danger"><p>' + get_integration_api_message( 2, result.message ) + '</p></div>' );
				}
			},
			'json'
		);
	},

	set_list_options : function() {
		var $me     = $( '#thirdparty-provider-container-constantcontact' );
		var selects = $me.find( 'select.constantcontact-lists-select' );
		selects.empty().append( $( '<option/>', {value : '', text : '- None -'} ) )
		$.each(
			WLM3ThirdPartyIntegration.constantcontact.lists,
			function(index, list) {
				selects.append( $( '<option/>', {value : list.list_id, text : list.name} ) );
			}
		);
		$me.set_form_data( WLM3ThirdPartyIntegration.constantcontact );
	},
	set_tag_options : function() {
		var $me     = $( '#thirdparty-provider-container-constantcontact' );
		var selects = $me.find( 'select.constantcontact-tags-select' );
		selects.empty().append( $( '<option/>', {value : '', text : '- None -'} ) )
		$.each(
			WLM3ThirdPartyIntegration.constantcontact.tags,
			function(index, tag) {
				selects.append( $( '<option/>', {value : tag.tag_id, text : tag.name} ) );
			}
		);
		$me.set_form_data( WLM3ThirdPartyIntegration.constantcontact );
	}
}
integration_before_open['constantcontact'] = function(obj) {
	var fxn = this;
	obj     = $( obj );
	var $me = $( '#thirdparty-provider-container-constantcontact' );

	fxn.save_keys = function(){
		WLM3ThirdPartyIntegration.constantcontact.fxn.test_keys();
	};

	$me.off( 'click', '.save-keys', fxn.save_keys );
	$me.on( 'click', '.save-keys', fxn.save_keys );

	$me.addClass( 'api-fail' );
}
integration_after_open['constantcontact']  = function(obj) {
	var fxn = this;
	obj     = $( obj );

	WLM3ThirdPartyIntegration.constantcontact.fxn.test_keys();
}
