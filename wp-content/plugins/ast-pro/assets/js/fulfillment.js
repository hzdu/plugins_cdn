jQuery(document).ready(function() {	
	'use strict';
	var url;
	var $table = jQuery("#fullfilments_table").DataTable({		
		dom: "it<'datatable_footer'pl>",
		searching: false,
		fixedHeader: true,
		"processing": true,
		"serverSide": true,	
		"pagingType": "simple",	
		//"order": [[ 5, "desc" ]],		
		"ajax": {
			'type': 'POST',
			'url': ajaxurl+'?action=get_unfulfilled_orders',
			'data': function ( d ) {
				d.ajax_nonce = jQuery("#nonce_fullfillment_dashbaord").val();													
				d.fullfillment_date = jQuery("#fullfillment_date").val();
				d.unfulfilled_order_status = jQuery("#unfulfilled_order_status").val();
				d.fulfillment_filter = jQuery("#fulfillment_filter").val();
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
					return '<a href="'+fulfillment_script.admin_url+'post.php?post='+full.order_id+'&action=edit">' + full.order_number + '</a>';
				},
			},
			{
				'orderable': false,
				'data': 'order_status',
			},
			{
				'width': 30,	
				'orderable': false,
				'data': 'order_view',
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
				'data' : 'actions_html',
				'width': 100,
				'className': 'text-right'
			},	
		],
	});	
	
	jQuery('#fulfillment_filter').change(function() {		
		$table.ajax.reload();	
	});	
	
	jQuery('#shipping_method_filter').change(function() {		
		$table.ajax.reload();	
	});
	
	jQuery('#fulfillment_search_submit').click(function() {		
		$table.ajax.reload();	
	});		
	
	jQuery(document).on("click", ".unfulfilled_order_status_filter", function(){
		if ( jQuery(this).hasClass('active') ) {
			jQuery('.unfulfilled_order_status_filter').removeClass('active');
			jQuery("#unfulfilled_order_status").val('all');
		} else {
			jQuery('.unfulfilled_order_status_filter').removeClass('active');
			jQuery(this).addClass('active');
			var status = jQuery(this).data('status');
			jQuery("#unfulfilled_order_status").val(status);	
		}						
		$table.ajax.reload();	
	});
});

jQuery(document).on("click", ".show_fulfilled_order_items", function(){
	var order_id = jQuery(this).attr('href');
	order_id = order_id.replace("#", "");
	
	var ajax_nonce = jQuery("#nonce_fullfillment_dashbaord").val();	
	
	var ajax_data = {
		action: 'show_fulfilled_order_items',
		order_id: order_id,
		security: ajax_nonce,
	};
	
	jQuery.ajax({
		url: ajaxurl,
		data: ajax_data,
		type: 'POST',		
		success: function(response) {
			jQuery( ".fulfilled_order_items_popup" ).remove();			
			jQuery("body").append(response);				
			jQuery('.fulfilled_order_items_popup').show();
		},
		error: function(response) {
			console.log(response);				
		}
	});
});
jQuery(document).on("click", ".popupclose,.popup_close_icon", function(){
	jQuery('.fulfilled_order_items_popup').hide();	
});

jQuery(document).on("click", ".fulfillment-order-preview", function(){
	var $previewButton    = jQuery( this ),
		$order_id         = $previewButton.data( 'orderId' );
		
	if ( $previewButton.data( 'order-data' ) ) {
		jQuery( this ).WCBackboneModal({
			template: 'wc-modal-view-order',
			variable : $previewButton.data( 'orderData' )
		});
	} else {
		$previewButton.addClass( 'disabled' );

		jQuery.ajax({
			url:     ajaxurl,
			data:    {
				order_id: $order_id,
				action  : 'woocommerce_get_order_details',
				security: fulfillment_script.preview_nonce
			},
			type:    'GET',
			success: function( response ) {
				jQuery( '.fulfillment-order-preview' ).removeClass( 'disabled' );

				if ( response.success ) {
					$previewButton.data( 'orderData', response.data );

					jQuery( this ).WCBackboneModal({
						template: 'wc-modal-view-order',
						variable : response.data
					});
				}
			}
		});
	}
	return false;	
});

jQuery(document).on("click", ".show_fulfillment_actions", function(){
	jQuery('.ast_fulfillment_actions_list').hide();
	jQuery(this).next('.ast_fulfillment_actions_list').show();
	var Div = jQuery(this);	
	setTimeout( function() { 
		jQuery(Div).next('.ast_fulfillment_actions_list').hide(); 
	}, 3000);
});
