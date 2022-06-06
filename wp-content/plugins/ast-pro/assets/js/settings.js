jQuery( document ).ready(function() {	
	
	jQuery( '.tipTip' ).tipTip( {
		'attribute': 'data-tip'		
	} );
	
	if(jQuery('#wc_ast_status_partial_shipped').prop("checked") == true){
		jQuery('.partial_shipped_status_label_color_th').show();
		jQuery('.partially_shipped_checkbox').show();		
	} else{
		jQuery('.partial_shipped_status_label_color_th').hide();
		jQuery('.partially_shipped_checkbox').hide();		
	}	
	
	if(jQuery('#wc_ast_status_updated_tracking').prop("checked") == true){
		jQuery('.updated_tracking_checkbox').show();		
	} else{
		jQuery('.updated_tracking_checkbox').hide();		
	}		
		
	jQuery('.color_field input').wpColorPicker();	

	var label = jQuery('input.tab_input:checked').data('label');
	jQuery('.breadcums_page_heading').text(label);
});

jQuery(document).on("click", ".tab_input", function(){
	var tab = jQuery(this).data('tab');
	var label = jQuery(this).data('label');
	jQuery('.breadcums_page_heading').text(label);
	var url = window.location.protocol + "//" + window.location.host + window.location.pathname+"?page=woocommerce-advanced-shipment-tracking&tab="+tab;
	window.history.pushState({path:url},'',url);	
});

jQuery(document).on("change", "#wc_ast_status_partial_shipped_label_font_color", function(){
	var font_color = jQuery(this).val();
	jQuery('.order-status-table .order-label.wc-partially-shipped').css('color',font_color);
});

jQuery(document).on("change", "#wc_ast_status_updated_tracking_label_font_color", function(){
	var font_color = jQuery(this).val();
	jQuery('.order-status-table .order-label.wc-updated-tracking').css('color',font_color);
});

jQuery( document ).on( "click", "#activity-panel-tab-help", function(e) {
	e.preventDefault(); // stops link from making page jump to the top
	e.stopPropagation(); // when you click the button, it stops the page from seeing it as clicking the body too
	jQuery(this).addClass( 'is-active' );
	jQuery( '.woocommerce-layout__activity-panel-wrapper' ).addClass( 'is-open is-switching' );
});

jQuery( document ).on( "click", ".woocommerce-layout__activity-panel-wrapper", function(e) {	
	e.stopPropagation(); // when you click the button, it stops the page from seeing it as clicking the body too	
});

jQuery( document ).on( "click", "body", function() {	
	jQuery('#activity-panel-tab-help').removeClass( 'is-active' );
	jQuery( '.woocommerce-layout__activity-panel-wrapper' ).removeClass( 'is-open is-switching' );
});
