"use strict";
var wcqt_single_product_ajax_request = false;
jQuery(document).ready(function()
{
	jQuery(document).on('click', 'button.single_add_to_quote_button', wcqt_on_single_add_to_quote_button_click);
	jQuery(document).on('change', 'input.variation_id', wcqt_on_variation_selection);
	console.log(wcqt_product_page.is_variable);
});

function wcqt_on_single_add_to_quote_button_click(e)
{
	//wcqt_refresh_fragments(); //defined on the quote-menui.js script
	event.preventDefault();
	
	if(wcqt_single_product_ajax_request)
		return false;
	
	wcqt_single_product_ajax_request = true;
	var product_id = wcqt_product_page.is_variable == 'no' ? jQuery(this).val() : jQuery("input[name=variation_id]").val(); 
	var quantity = jQuery('input.qty').val(); 
	jQuery(event.currentTarget).addClass('loading');
	
	console.log(product_id);
	
	var formData = new FormData();
	formData.append('action', 'wcqt_add_product_to_quote'); 	
	formData.append('product_id', product_id); 	
	formData.append('quantity', quantity); 	
	formData.append('security', wcqt_product_page.security); 	
	
	//UI
	jQuery('.single_add_to_quote_button, .single_add_to_cart_button, div.quantity').attr("disabled", true).css('opacity', '0.1');
	
	jQuery.ajax({
		url: wcqt_product_page.ajax_url,
		type: 'POST',
		data: formData,
		async: true,
		success: function (response) 
		{
			//Some themes (like DiVi) are not loading the cart-fragments.min.js library. The following code avoid the page is not reloaded when triggering the (useless) wc_fragment_refresh event
			if(wcqt_product_page.is_cart_fragments_js_enqueued == "false")
			{
				wcqt_product_page_reload();
				return;
			}
			//refresh
			jQuery( document.body ).trigger( 'wc_fragment_refresh' );
			jQuery(document).on('wc_fragments_refreshed', function()
			{
				
				wcqt_product_page_reload();
				/* cart page url  : wc_add_to_cart_params.cart_url;
				   quote paage url: wcqt_product_page.quote_page_url;
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
function wcqt_product_page_reload()
{
	window.onbeforeunload = null;
	window.location = window.location.href;
	window.location.reload(true);
}
function wcqt_on_variation_selection(event)
{
	let id = jQuery(event.currentTarget).val();
	if(!id || wcqt_product_page.quotable_variations.length == 0)
		return;
	console.log(id);
	id = Number(id);
	
	if(wcqt_product_page.can_be_purchased == 'false')
	{
		if(wcqt_product_page.quotable_variations.includes(id))
		{
			//jQuery('button.single_add_to_cart_button').html(wcqt_product_page.add_to_quote_txt );
			jQuery('button.single_add_to_cart_button').replaceWith(wcqt_product_page.add_to_quote_button_template);
			jQuery('button.single_add_to_cart_button').val(id);
		}
		else
		{
			//jQuery('button.single_add_to_cart_button').html(wcqt_product_page.add_to_cart_txt );
			jQuery('button.single_add_to_cart_button').replaceWith(wcqt_product_page.add_to_cart_button_template);
		}
	}
	else 
	{
		if(wcqt_product_page.quotable_variations.includes(id))
			jQuery('div#wcqt-optional-button-container').html(wcqt_product_page.add_to_quote_button_template.replace("%s", id));
		else
			jQuery('div#wcqt-optional-button-container').html("");
	}
		
}