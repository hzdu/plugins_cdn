jQuery(document).ready(function() {	
	'use strict';
	var url;
	var $vendor_fullfilments_table = jQuery("#vendor_fullfilments_table").DataTable({		
		dom: "it<'datatable_footer'pl>",
		searching: false,
		fixedHeader: true,
		"processing": true,
		"serverSide": true,	
		"pagingType": "simple",	
		//"order": [[ 5, "desc" ]],		
		"ajax": {
			'type': 'POST',
			'url': ajaxurl+'?action=get_vendor_unfulfilled_orders',
			'data': function ( d ) {
				d.ajax_nonce = jQuery("#nonce_fullfillment_dashbaord").val();													
				d.fullfillment_date = jQuery("#fullfillment_date").val();
				d.unfulfilled_order_status = jQuery("#unfulfilled_order_status").val();
				d.fulfillment_filter = jQuery("#vendor_fulfillment_filter").val();
				d.fulfillment_search_input = jQuery("#fulfillment_search_input").val();
				d.shipping_method_filter = jQuery("#shipping_method_filter").val();
			},
		},
		"lengthMenu": [[25, 50, -1], [25, 50, "All"]],
		"pageLength":25,
		"drawCallback": function(settings) {
			jQuery(window).resize();
		},		
		oLanguage: {
			sProcessing: '<div id=loader><div class="fa-3x"><i class="fas fa-sync fa-spin"></i></div>'
		},
		
		"columns":[
			{
				'width': 120,	
				'orderable': false,		
				'data': 'order_date',	
			},
			{
				'width': 50,
				'orderable': false,				
				"mRender":function(data,type,full) {
					return '<a href="'+fulfillment_script.admin_url+'admin.php?page=wcpv-vendor-order&id='+full.order_id+'">' + full.order_number + '</a>';
				},
			},
			{
				'orderable': false,
				'data': 'ship_to',				
			},
			{
				'width': 50,
				'orderable': false,
				'data': 'order_items',				
			},						
			{
				'orderable': false,	
				'data' : 'shipping_method',	
			},
			{
				'orderable': false,
				'data' : 'shipping_country',	
			},
			{
				'orderable': false,	
				'data' : 'shipment_tracking',	
			},
			{
				'orderable': false,	
				'data' : 'actions_html',
				'width': 100,
				'className': 'text-right'
			},	
		],
	});

	$vendor_fullfilments_table.columns(6).visible(false);		
	
	jQuery(document).on("change", "#vendor_fulfillment_filter", function(){
		var fulfillment_filter = jQuery(this).val();
		if ( fulfillment_filter == 'recently_unfulfilled' ) {
			$vendor_fullfilments_table.columns(6).visible(true);
		} else {
			$vendor_fullfilments_table.columns(6).visible(false);
		}
		$vendor_fullfilments_table.ajax.reload();
	});
	
	jQuery(document).on("click", "#vendor_fulfillment_search_submit", function(){
		$vendor_fullfilments_table.ajax.reload();
	});
});

jQuery(document).on("click", ".add_inline_tracking_vendor", function(){
	
	jQuery(this).closest('.wc_actions').block({
		message: null,
		overlayCSS: {
			background: "#fff",
			opacity: .6
		}	
    });
	
	var order_id = jQuery(this).attr('href');
	order_id = order_id.replace("#", "");
	jQuery('.add_tracking_number_form #order_id').val(order_id);	
	
	var ajax_data = {
		action: 'ast_open_inline_tracking_form_for_vendor',
		order_id: order_id,
		security: ast_orders_params.order_nonce,
	};
	
	jQuery.ajax({
		url: ajaxurl,		
		data: ajax_data,
		dataType: "json",
		type: 'POST',						
		success: function(response) {
			jQuery( ".add_tracking_popup" ).remove();
			jQuery( ".tracking_details_popup" ).remove();	
			jQuery("body").append(response.data.html);				
			jQuery('.add_tracking_popup').show();
			jQuery( "#add_tracking_number_form #tracking_number" ).focus();		
			jQuery('.tracking_provider_dropdown').select2();					
			
			var selected_provider = jQuery("#tracking_provider").val();	
			
			if(selected_provider == 'nz-couriers' || selected_provider == 'post-haste' || selected_provider == 'castle-parcels' || selected_provider == 'dx-mail' || selected_provider == 'now-couriers'){
				jQuery('.tracking_product_code_field').show();
			} else{
				jQuery('.tracking_product_code_field').hide();
			}
			
			jQuery( '.ast-date-picker-field' ).datepicker({
				dateFormat: 'yy-mm-dd'
			});
	
			jQuery('.wc_actions').unblock();
		},
		error: function(response) {			
			jQuery('.wc_actions').unblock();			
		}
	});		
});

jQuery(document).on("click", ".delete-vendor-tracking", function(){
	var tracking_id = jQuery( this ).attr( 'rel' );
	var order_id = jQuery( this ).data( 'orderid' );
	
	var data = {
		action:      'wc_shipment_tracking_delete_item',
		order_id:    order_id,
		tracking_id: tracking_id,
		security:    $( '#vendor_tracking_delete_nonce' ).val()
	};
	
	jQuery( '#tracking-item-' + tracking_id ).block({
		message: null,
		overlayCSS: {
			background: '#fff',
			opacity: 0.6
		}
	});
	
	jQuery.ajax({
		url: ajaxurl,
		data: data,
		type: 'POST',		
		success: function(response) {
			jQuery( '#tracking-item-' + tracking_id ).unblock();
			if ( response != '-1' ) {
				jQuery( '#tracking-item-' + tracking_id ).remove();
			}
		},
		error: function(response) {
			console.log(response);				
		}
	});
}); 
