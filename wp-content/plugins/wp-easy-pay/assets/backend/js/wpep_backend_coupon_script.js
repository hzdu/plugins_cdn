jQuery('#wpep_coupons_generate_code').on('click', function(e){
	e.preventDefault();
	jQuery.ajax({
		url: wpep_hide_elements.ajax_url,
		type: 'POST',
		data: {
			'action' : 'wpep_generate_coupons'
		},
		success: function(response) {
			jQuery('#wpep_coupons_code').val(response);
		}
	});
});

jQuery( "#wpep_coupons_expiry" ).datepicker({ 
	dateFormat: 'd-M-yy',
	minDate: '0'
});

jQuery('#wpep_coupons_form_include').multiSelect();
jQuery('#wpep_coupons_form_exclude').multiSelect();