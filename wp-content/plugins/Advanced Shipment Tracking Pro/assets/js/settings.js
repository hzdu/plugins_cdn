jQuery(document).on("click", "#wc_ast_status_delivered", function(){
	if(jQuery(this).prop("checked") == true){
        jQuery(this).closest('tr').removeClass('disable_row');				
    } else{
		jQuery(this).closest('tr').addClass('disable_row');
	}	
});

jQuery(document).on("click", "#wc_ast_status_shipped_active", function(){
	if(jQuery(this).prop("checked") == true){
        jQuery(this).closest('tr').removeClass('disable_row');				
    } else{
		jQuery(this).closest('tr').addClass('disable_row');
	}	
});

jQuery( document ).ready(function() {	
	
	jQuery( '.tipTip' ).tipTip( {
		'attribute': 'data-tip'		
	} );
	
	if(jQuery('#wc_ast_status_delivered').prop("checked") == true){
		jQuery('.status_label_color_th').show();		
	} else{
		jQuery('.status_label_color_th').hide();		
	}

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
});
jQuery(document).on("change", "#wc_ast_status_partial_shipped_label_font_color", function(){
	var font_color = jQuery(this).val();
	jQuery('.order-status-table .order-label.wc-partially-shipped').css('color',font_color);
});
jQuery(document).on("change", "#wc_ast_status_updated_tracking_label_font_color", function(){
	var font_color = jQuery(this).val();
	jQuery('.order-status-table .order-label.wc-updated-tracking').css('color',font_color);
});

jQuery( document ).on( "click", "#activity-panel-tab-help", function() {
	jQuery(this).addClass( 'is-active' );
	jQuery( '.woocommerce-layout__activity-panel-wrapper' ).addClass( 'is-open is-switching' );
});

jQuery(document).click(function(){
	var $trigger = jQuery(".woocommerce-layout__activity-panel");
    if($trigger !== event.target && !$trigger.has(event.target).length){
		jQuery('#activity-panel-tab-help').removeClass( 'is-active' );
		jQuery( '.woocommerce-layout__activity-panel-wrapper' ).removeClass( 'is-open is-switching' );
    }   
});