/**
 * Created by grola on 2016-11-25.
 */
jQuery(document).ready(function(){
    function fspro_free_shipping_requires() {
        if ( jQuery('#woocommerce_flexible_shipping_method_free_shipping_requires').length ) {
            let free_shipping_requires_val = jQuery('#woocommerce_flexible_shipping_method_free_shipping_requires').val();
            let show = false;
            if ( free_shipping_requires_val != 'coupon' ) {
            	show = true;
            }
			let show_free_shipping_notice = jQuery('#woocommerce_flexible_shipping_method_free_shipping').val() !== ''
				&& ( free_shipping_requires_val === 'order_amount' || free_shipping_requires_val === 'order_amount_or_coupon' );
			jQuery('#woocommerce_flexible_shipping_method_free_shipping').closest('tr').toggle(show);
			jQuery('#woocommerce_flexible_shipping_method_free_shipping_ignore_discounts').closest('tr').toggle(show);
			jQuery('#woocommerce_flexible_shipping_method_free_shipping_cart_notice').closest('tr').toggle(show_free_shipping_notice);
        }
    }

    jQuery('#woocommerce_flexible_shipping_method_free_shipping_requires').change(function() {
        fspro_free_shipping_requires();
    })

    fspro_free_shipping_requires();

    jQuery('#flexible_shipping_export_selected').click(function() {
        var methods = '';
        var first = true;
        jQuery('input.checkbox-select').each(function() {
            if (jQuery(this).is(':checked')) {
                if (!first) {
                    methods = methods + ',';
                }
                methods = methods + jQuery(this).val();
                first = false;
            }
        });
        var data = {
            action: 'flexible_shipping_export',
            flexible_shipping_nonce: jQuery(this).attr('data-nonce'),
            flexible_shipping_action: 'export',
            instance_id: jQuery(this).attr('data-instance-id'),
            methods: methods,
        };
        url = ajaxurl + '?action=flexible_shipping_export';
        url = url + '&flexible_shipping_nonce=' + jQuery(this).attr('data-nonce');
        url = url + '&flexible_shipping_action=export';
        url = url + '&instance_id=' + jQuery(this).attr('data-instance-id');
        url = url + '&methods=' + methods;
        console.log(url);
        window.open(url);
        return false;
    })

    jQuery('select.fs-shipping-class').select2({
        dropdownCssClass: 'fs_shipping_class',
    });

    jQuery(document).on( 'insert_rule', function() {
        jQuery('select.fs-shipping-class').select2({
            dropdownCssClass: 'fs_shipping_class',
        });
    })
})


