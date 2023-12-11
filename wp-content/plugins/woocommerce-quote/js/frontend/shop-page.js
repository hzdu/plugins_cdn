"use strict";
var wcqt_shop_page_ajax_request = false;
jQuery(document).ready(function()
{
	jQuery(document).on('click','.wcqt_add_to_quote_button' , wcqt_on_add_to_quote_list);
	/* used when adding product via ajax: 
	jQuery(document).on('wc_cart_button_updated', wcqt_modify_view_cart_button); */
	/* Before unloading 
	jQuery(window).on('beforeunload', wcqt_before_unload); //triggered when adding a product to quote */
	
	/*Quick view*/
	jQuery(document).on('click', 'button.single_add_to_quote_button', wcqt_on_quick_view_single_add_to_quote_button_click);
	
	//Update menu (just to be sure)
	jQuery( document.body ).trigger( 'wc_fragment_refresh' );
	
});
function wcqt_on_quick_view_single_add_to_quote_button_click(e) //Some themes might be using this feature
{
	event.preventDefault();
	
	if(wcqt_shop_page_ajax_request)
		return false;
	
	wcqt_shop_page_ajax_request = true;
	var product_id = jQuery(this).val(); 
	var quantity = jQuery('input.qty').val(); 
	jQuery(event.currentTarget).addClass('loading');
	
	var formData = new FormData();
	formData.append('action', 'wcqt_add_product_to_quote'); 	
	formData.append('product_id', product_id); 	
	formData.append('quantity', quantity); 	
	formData.append('security', wcqt_shop_page.security); 	
	
	//UI
	jQuery('.single_add_to_quote_button, .single_add_to_cart_button, div.quantity').attr("disabled", true).css('opacity', '0.1');
	
	jQuery.ajax({
		url: wcqt_shop_page.ajax_url,
		type: 'POST',
		data: formData,
		async: true,
		success: function (response) 
		{
			//Some themes (like DiVi) are not loading the cart-fragments.min.js library. The following code avoid the page is not reloaded when triggering the (useless) wc_fragment_refresh event
			if(wcqt_shop_page.is_cart_fragments_js_enqueued == "false")
			{
				wcqt_shop_page_reload();
				return;
			}
			
			//refresh
			jQuery( document.body ).trigger( 'wc_fragment_refresh' );
			jQuery(document).on('wc_fragments_refreshed', function()
			{
				wcqt_shop_page_reload();
			});
			
			
		},
		error: function (data) 
		{
			console.log(data);
		},
		cache: false,
		contentType: false,
		processData: false
	});
	
	return false;
}
function wcqt_shop_page_reload()
{
	window.location.reload(true);
}
function wcqt_on_add_to_quote_list(event)
{
	event.preventDefault();
	
	var product_id = jQuery(event.currentTarget).data('product_id'); 
	var quantity = jQuery(event.currentTarget).data('quantity'); 
	jQuery(event.currentTarget).addClass('loading');
	
	var formData = new FormData();
	formData.append('action', 'wcqt_add_product_to_quote'); 	
	formData.append('product_id', product_id); 	
	formData.append('quantity', quantity); 	
	formData.append('security', wcqt_shop_page.security); 	
	
	jQuery.ajax({
		url: wcqt_shop_page.ajax_url,
		type: 'POST',
		data: formData,
		async: true,
		success: function (response) 
		{
			//Some themes (like DiVi) are not loading the cart-fragments.min.js library. The following code avoid the page is not reloaded when triggering the (useless) wc_fragment_refresh event
			if(wcqt_shop_page.is_cart_fragments_js_enqueued == "false")
			{
				wcqt_shop_page_reload();
				return;
			}
			
			//refresh
			jQuery( document.body ).trigger( 'wc_fragment_refresh' );
			jQuery(document).on('wc_fragments_refreshed', function()
			{
				window.location.reload(true);
				/* cart page url  : wc_add_to_cart_params.cart_url;
				   quote paage url: wcqt_shop_page.quote_page_url;
				 */
			});
			
			
		},
		error: function (data) 
		{
			console.log(data);
			//alert("Error: "+data);
		},
		cache: false,
		contentType: false,
		processData: false
	});
	
	return false;
}
function wcqt_modify_view_cart_button(event, button)
{
	jQuery( document.body ).trigger( 'wc_fragment_refresh' );
	button.fadeOut();
	button.parent().find( '.added_to_cart' ).html(wcqt_menu.view_quote_button);
	button.parent().find( '.added_to_cart' ).attr("href", wcqt_menu.quote_page_url);
	
}
function wcqt_before_unload()
{
	jQuery( document.body ).trigger( 'wc_fragment_refresh' );
}