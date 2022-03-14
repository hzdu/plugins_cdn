(function($) {

    var start = moment().subtract(29, 'days');
    var end = moment();
	var label = 'Last 30 Days';

    function cb(start, end, label) {		
        $('#fullfillment_date span.date_placeholder').html(label);
    }

    $('#fullfillment_date').daterangepicker({
        startDate: start,
        endDate: end,
		showCustomRangeLabel: false,
        ranges: {
           'Today': [moment(), moment()],           
           'Last 7 Days': [moment().subtract(6, 'days'), moment()],
           'Last 30 Days': [moment().subtract(29, 'days'), moment()],       
        },
		locale: {
		  format: 'YYYY-MM-DD'
		},
		autoclose: true,
		autoApply:true,
		autoUpdateInput: false,
    }, cb);

    cb( start, end,label );

})( jQuery );

jQuery('.fullfillment_date').on('apply.daterangepicker', function(ev, picker) {
	jQuery(this).val(picker.startDate.format('YYYY-MM-DD') + ' - ' + picker.endDate.format('YYYY-MM-DD')).trigger("change");
});

jQuery('.fullfillment_date').on('cancel.daterangepicker', function(ev, picker) {
	jQuery(this).val('').trigger("change");
});

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
		"lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
		"pageLength":10,
		"drawCallback": function(settings) {
			jQuery(window).resize();
		},		
		oLanguage: {
			sProcessing: '<div id=loader><div class="fa-3x"><i class="fas fa-sync fa-spin"></i></div>'
		},
		
		"columns":[
			{
				'width': 100,	
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
				'width': 50,
				'orderable': false,
				'data': 'order_items',				
			},
			{
				'orderable': false,
				'data': 'ship_to',				
			},
			{
				'orderable': false,
				'data' : 'shipping_country',	
			},
			{
				'orderable': false,	
				'data' : 'shipping_method',	
			},
			{
				'orderable': false,	
				'data' : 'actions_html',
				'width': 100,
			},	
		],
	});	
	
	
	jQuery('#fullfillment_date').change(function() {		
		reload_fullfillment_widgets();		
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
	
	
	function reload_fullfillment_widgets(){
		var fullfillment_date = jQuery("#fullfillment_date").val();
		var ajax_nonce = jQuery("#nonce_fullfillment_dashbaord").val();	
		
		var ajax_data = {
			action: 'reload_fullfillment_widgets',
			fullfillment_date: fullfillment_date,
			ajax_nonce: ajax_nonce,			
		};
	
		jQuery.ajax({
			url: ajaxurl,
			data: ajax_data,
			type: 'POST',
			dataType:"json",	
			success: function(response) {
				jQuery('.total_orders_count').html(response.total_orders_count);
				jQuery('.unfulfilled_orders_count').html(response.unfullfilled_orders_count);
				jQuery('.fullfilled_order_count').html(response.fullfilled_orders_count);
				jQuery('.delivered_order_count').html(response.delivered_orders_count);				
				jQuery('.fulfilll_time_days').html(response.time_to_fulfill);
			},
			error: function(response) {
				console.log(response);				
			}
		});
	}
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