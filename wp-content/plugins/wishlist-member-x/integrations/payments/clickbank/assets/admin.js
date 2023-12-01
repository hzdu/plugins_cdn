WLM3ThirdPartyIntegration.clickbank.fxn = {
	load_products : function() {
		// $.each(all_levels, function(k, v) {
		// 	if(!Object.keys(v).length) return true;
			var data = {
				products : WLM3ThirdPartyIntegration.clickbank.cbproducts
			}
			var tmpl = _.template($('script#clickbank-products-template2').html(), {variable: 'data'});
			var html = tmpl(data);
			$('#clickbank-products tbody').html(html.trim());
		// });
		$('#thirdparty-provider-container-clickbank .-del-btn')
		.do_confirm( { confirm_message : wp.i18n.__( 'Delete this Product?', 'wishlist-member' ), yes_button : wp.i18n.__( 'Delete', 'wishlist-member' ) } )
		.on('yes.do_confirm', function() {
			var tr = $(this).closest('tr');
			$.post(
				WLM3VARS.ajaxurl,
				{
					action : 'wlm3_delete_clickbank_product',
					access : tr.data('access'),
					id : tr.data('id'),
				},
				function(result) {
					WLM3ThirdPartyIntegration.clickbank.cbproducts = result.data.cbproducts;
					WLM3ThirdPartyIntegration.clickbank.fxn.load_products();
				},
				'json'
			);
		});
	}
}

integration_after_open['clickbank'] = function(obj) {
	WLM3ThirdPartyIntegration.clickbank.fxn.load_products();
	var $me = $('#thirdparty-provider-container-clickbank');
	$me.off('.wlm3-clickbank');
	$me.on('click.wlm3-clickbank', '.-edit-btn', function() {
		var tr = $(this).closest('tr');
		$('#products-clickbank [name="access"]').val([tr.data('access')]);
		$('#products-clickbank [name="id"]').val([tr.data('id')]);
		$('#products-clickbank [name="old_access"]').val([tr.data('access')]);
		$('#products-clickbank [name="old_id"]').val([tr.data('id')]);
		$('#products-clickbank').modal('show');
	});
	$me.on('click.wlm3-clickbank', '.-add-btn', function() {
		var tr = $(this).closest('tr');
		$('#products-clickbank [name="id"]').val('');
		$('#products-clickbank [name="old_access"]').val('');
		$('#products-clickbank [name="old_id"]').val('');
		$('#products-clickbank').modal('show');
	});
}

integration_modal_save['clickbank'] = function(me, settings_data, result, textStatus) {
	WLM3ThirdPartyIntegration.clickbank.cbproducts = result.data.cbproducts;
	WLM3ThirdPartyIntegration.clickbank.fxn.load_products();
}