jQuery(document).on("click", "#decrease", function(){			
	var input = jQuery(this).next(".ast_product_number");			
	var value = jQuery(this).next(".ast_product_number").val();
	
	if(value > input.attr('min')) {
		value = isNaN(value) ? 0 : value;				
		value < 1 ? value = 1 : '';
		value--;
		jQuery('.mark_shipped_checkbox').prop('checked', false);
		jQuery("input[value=change_order_to_partial_shipped").prop('checked', true);	
		jQuery(input).val(value);
	}
});
jQuery(document).on("click", "#increase", function(){			
	var input = jQuery(this).prev(".ast_product_number");			
	var value = jQuery(this).prev(".ast_product_number").val();
	
	if(value < input.attr('max')) {
		value = isNaN(value) ? 0 : value;
		value++;	
		jQuery('.mark_shipped_checkbox').prop('checked', false);
		jQuery("input[value=change_order_to_partial_shipped").prop('checked', true);				
		jQuery(input).val(value);
	}
});
jQuery(document).on("change", ".enable_tracking_per_item", function(){	
	if(jQuery(this).prop("checked") == true){
		jQuery( this ).closest('div').find( ".ast-product-table" ).show();					
	} else{
		jQuery( this ).closest('div').find( ".ast-product-table" ).hide();				
	}
});
jQuery(document).on( "input", ".ast_product_number", function(){	
	jQuery('.mark_shipped_checkbox').prop('checked', false);
	jQuery("input[value=change_order_to_partial_shipped").prop('checked', true);	
});