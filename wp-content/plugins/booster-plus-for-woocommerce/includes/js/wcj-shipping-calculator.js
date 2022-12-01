/**
 * wcj-shipping-calculator.
 *
 * @version 1.0.0
 * @since  1.0.0
 */

jQuery(document).ready(change_labels);
jQuery(document).ajaxComplete(change_labels);
function change_labels() {
	jQuery("a.shipping-calculator-button").each( function () {
		jQuery(this).text( wcj_object.calculate_shipping_label );
		jQuery(this).css( "visibility", "visible" );
	});
	jQuery("button[name=calc_shipping]").each( function () {
		jQuery(this).text( wcj_object.update_totals_label );
		jQuery(this).css( "visibility", "visible" );
	});
}
