jQuery(document).on("submit", "#wc_ast_pro_addons_form", function( ){	
	var form = jQuery(this);
	jQuery("#wc_ast_pro_addons_form").block({
		message: null,
		overlayCSS: {
			background: "#fff",
			opacity: .6
		}	
    });
	jQuery('#ast_pro_license_message').hide();
	var action = jQuery('#ast-pro-license-action').val();			
	jQuery.ajax({
		url: ast_pro_ajax_object.ajax_url,		
		data: form.serialize(),
		type: 'POST',
		success: function(data) {
			jQuery("#wc_ast_pro_addons_form").unblock();	
			jQuery('#ast_pro_license_message').show();			
			var btn_value = 'Activate';
			if(data.success == true){
				if(action == 'ast-pro_license_activate'){
					var btn_value = 'Deactivate';
					jQuery('#ast-pro-license-action').val('ast_pro_license_deactivate');
					jQuery('#ast_pro_license_message').html('<span style="color:green;">Congratulation, your license successful activated</span>');
					jQuery('.activated').show();
					window.location.reload();
				} else {
					jQuery('#ast-pro-license-action').val('ast_pro_license_activate');
					jQuery('#ast_product_license_key').val('');					
					jQuery('#ast_pro_license_message').html('<span style="color:green;">Congratulation, your license successful deactivated</span>');
					jQuery('.activated').hide();
					window.location.reload();				
				}
			} else {
				jQuery('#ast_pro_license_message').html('<span style="color:red;">'+data.error+'</span>');
			}
			
			jQuery('#saveS').prop('disabled', false).val(btn_value);
		},
		error: function(jqXHR, exception) {
			console.log(jqXHR.status);			
		}
	});
	return false;
});

jQuery(document).on( "click", ".add_more_api_provider", function(){	
	jQuery(this).closest('.api_provider_name_container').append('<div class="api_provider_new"><input type="text" name="api_provider_name[]" class="api_provider_name" value="" placeholder="API Name"><span class="dashicons dashicons-remove remove_more_api_provider"></span></div>');
});

jQuery(document).on("click",".remove_more_api_provider", function(e){ //user click on remove text links
    e.preventDefault(); 
	jQuery(this).parent('.api_provider_new').remove(); 				
});

jQuery(document).on("click", ".edit_provider_pro", function(){		
	
	var id = jQuery(this).data('pid');
	var provider = jQuery(this).data('provider');
	var nonce = jQuery( '#nonce_shipping_provider' ).val();
	
	var ajax_data = {
		action: 'get_provider_details',		
		provider_id: id,
		security: nonce,	
	};
	
	jQuery.ajax({
		url: ajaxurl,		
		data: ajax_data,		
		type: 'POST',
		dataType: "json",
		success: function(response) {
			
			var provider_name = response.provider_name;
			var custom_provider_name = response.custom_provider_name;
			var provider_url = response.provider_url;
			var shipping_country = response.shipping_country;
			var custom_thumb_id = response.custom_thumb_id;									
			var image = response.image;
			var api_length = 0;
			jQuery('.edit_provider_title').html(provider_name);
			jQuery('.edit_provider_popup').removeClass('default_provider');	
			jQuery('.edit_provider_popup').removeClass('custom_provider');	
			jQuery('.edit_provider_popup').addClass(provider);	
			
			if(provider == 'custom_provider'){				
				jQuery('.edit_provider_popup .shipping_provider').val(provider_name);
				jQuery('.edit_provider_popup .shipping_display_name').val(custom_provider_name);
				jQuery('.edit_provider_popup .api_provider_name').val(api_provider_name);
				jQuery('.edit_provider_popup .tracking_url').val(provider_url);
				jQuery('.edit_provider_popup .thumb_url').val(image);
				jQuery('.edit_provider_popup .thumb_id').val(custom_thumb_id);
				jQuery('.edit_provider_popup #provider_id').val(id);
				jQuery(".edit_provider_popup .shipping_country").val(shipping_country);
				jQuery('.edit_provider_popup #provider_type').val(provider);
				jQuery('.edit_provider_popup .tracking_url').parent('div').show();
				jQuery(".edit_provider_popup .shipping_country").parent('div').show();
				jQuery(".edit_provider_popup .shipping_provider").parent('div').show();
				jQuery('.edit_provider_popup').show();					
				jQuery('.api_provider_name_container').hide();
				jQuery('.reset_default_provider').hide();
				jQuery('.custom_provider_instruction').show();				
			} else {				
				jQuery('.edit_provider_popup .shipping_provider').val(provider_name);
				jQuery('.edit_provider_popup .shipping_display_name').val(custom_provider_name);								
				jQuery('.api_provider_new').remove(); 
				
				if(response.api_provider_name == null){				
					//jQuery('.edit_provider_popup .api_provider_name').val(response.api_provider_name);
					//jQuery('.api_provider_name_container').hide();
				} else if( IsValidJSONString(response.api_provider_name) ){
					var api_provider_name = jQuery.parseJSON( response.api_provider_name );
					var api_length = api_provider_name.length;
					
					if( api_length > 1){
						jQuery( api_provider_name ).each(function( index, value ){							
							if( index  == 0){
								jQuery('.edit_provider_popup .api_provider_name').val(value);
							} else{
								jQuery('.api_provider_name_container').append('<div class="api_provider_new"><input type="text" name="api_provider_name[]" class="api_provider_name" value="'+value+'" placeholder="API Name"><span class="dashicons dashicons-remove remove_more_api_provider"></span></div>');
							}						
						});		
					} else{
						jQuery('.edit_provider_popup .api_provider_name').val(api_provider_name);	
					}
					jQuery('.api_provider_name_container').show();
				} else{
					jQuery('.edit_provider_popup .api_provider_name').val(response.api_provider_name);	
					
				}
				jQuery('.api_provider_name_container').show();
				jQuery('.edit_provider_popup .thumb_url').val(image);
				jQuery('.edit_provider_popup .thumb_id').val(custom_thumb_id);
				jQuery('.edit_provider_popup #provider_id').val(id);
				jQuery('.edit_provider_popup #provider_type').val(provider);
				jQuery('.edit_provider_popup .tracking_url').parent('div').hide();
				jQuery(".edit_provider_popup .shipping_country").parent('div').hide();
				jQuery(".edit_provider_popup .shipping_provider").parent('div').hide();				
				jQuery('.edit_provider_popup').show();					
				jQuery('.reset_default_provider').show();				
				jQuery('.custom_provider_instruction').hide();
			}						
		},
		error: function(response) {
			console.log(response);			
		}
	});
});

function IsValidJSONString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

jQuery('#wc_ast_status_shipped_label_color').wpColorPicker({
	change: function(e, ui) {
		var color = ui.color.toString();			
		jQuery('.order-status-table .order-label.wc-shipped').css('background',color);
	},
});

jQuery(document).on("change", "#wc_ast_status_shipped_label_font_color", function(){
	var font_color = jQuery(this).val();
	jQuery('.order-status-table .order-label.wc-shipped').css('color',font_color);
});

jQuery(document).on("click", "#wc_ast_status_new_shipped,#wc_ast_status_partial_shipped", function(){
	if ( jQuery(this).prop("checked") == true ) {
        jQuery(this).closest('tr').removeClass('disable_row');							
    } else {
		jQuery(this).closest('tr').addClass('disable_row');		
	}	
});

jQuery(document).ready(function() {
	if(jQuery('#wc_ast_status_shipped').prop("checked") == true){
		jQuery('#wc_ast_status_new_shipped').next().css('pointer-events','none');
	}
});

jQuery(document).on("change", "#wc_ast_status_shipped", function(){
	if(jQuery(this).prop("checked") == true){
		jQuery('#wc_ast_status_new_shipped').prop('checked', false);
		jQuery('#wc_ast_status_new_shipped').next().css('pointer-events','none');
	} else{
		jQuery('#wc_ast_status_new_shipped').next().css('pointer-events','auto');
	}
});

jQuery(document).on("change", "#wc_ast_status_new_shipped", function(){
	if(jQuery('#wc_ast_status_shipped').prop("checked") == true){
		jQuery('#wc_ast_status_new_shipped').prop('checked', false);
	}
});