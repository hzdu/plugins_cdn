/**
 * wcj-coupons-code-generator.
 *
 * @version 1.0.0
 * @since  1.0.0
 */

jQuery(document).ready(function() {
	if ( '' === jQuery("#title").val() ) {
		var data = {
			'action': 'wcj_generate_coupon_code',
		};
		jQuery.ajax({
			type: "POST",
			url: ajax_object.ajax_url,
			data: data,
			success: function(response) {
				if ( '' !== response && '' === jQuery("#title").val() ) {
					jQuery("#title").val(response);
					jQuery("#title-prompt-text").html('');
				}
			},
		});
	}
});
