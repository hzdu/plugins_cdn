"use strict";
jQuery(document).ready(function()
{
	jQuery('table.shop_table.my_account_orders tbody tr.order').each(function(index)
	{
		var wcsts_var = wcsts.wc_ver;
		var main_element = wcsts_versionCompare(wcsts_var, "3.0.0") < 0 ? jQuery(this).find('td.order-actions') : jQuery(this).find('td.woocommerce-orders-table__cell.woocommerce-orders-table__cell-order-actions');
		
		//new
		var order_num = wcsts_versionCompare(wcsts_var, "3.0.0") < 0 ? jQuery(this).find('td.order-number a').data("wcst-id") : jQuery(this).find('td.woocommerce-orders-table__cell-order-number a').data("wcst-id");
		if(!isNaN(order_num))
		{
			var order_url = wcsts.view_order_url.replace('wcsts_order_id_place_holder',order_num)
			var button_element = jQuery('<a href="'+order_url+'/?wcsts_get_help=true" class="button wcsts-get-help-button" >'+wcsts.get_help_text+'</a>');
			main_element.append(button_element);
		}		
		
	});
});
function wcsts_versionCompare(a, b) {
    var i, cmp, len, re = /(\.0)+[^\.]*$/;
    a = (a + '').replace(re, '').split('.');
    b = (b + '').replace(re, '').split('.');
    len = Math.min(a.length, b.length);
    for( i = 0; i < len; i++ ) {
        cmp = parseInt(a[i], 10) - parseInt(b[i], 10);
        if( cmp !== 0 ) {
            return cmp;
        }
    }
    return a.length - b.length;
}

function gteVersion(a, b) {
    return cmpVersion(a, b) >= 0;
}
function ltVersion(a, b) {
    return cmpVersion(a, b) < 0;
}