/**
 * wcj-checkout-fees.
 *
 * @version 1.0.0
 * @since  1.0.0
 */

jQuery('body').on('change',wcj_checkout_fees.checkout_fields,function(){
	jQuery('body').trigger('update_checkout');
});
