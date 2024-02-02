"use strict";
jQuery(document).ready(function()
{
	var params = wcsts_getUrlVars();
	
	if(wcsts_order_details_options.disable_smooth_scroll === 'false')
	{
		if(params["wcsts_get_help"] !== undefined)
			
			 jQuery('html, body').animate({
					scrollTop: jQuery("#wcsts_ticket_area").offset().top
				}, 1500);
	}
	else 
	{
		if(params["wcsts_get_help"] !== undefined)
			window.location.href = "#wcsts_ticket_area";
	}
		
	wcsts_move_ticket_area_after_billing_and_shipping_addresses();
});
function wcsts_getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
function wcsts_move_ticket_area_after_billing_and_shipping_addresses()
{
	if(wcsts_order_details_options.render_after_billign_and_shipping_details == 'true')
		jQuery('#wcsts_ticket_area').insertAfter('.woocommerce-customer-details');
}