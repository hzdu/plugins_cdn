 jQuery(function($) {
	'use strict';

	var ajaxurl = phpInfo.admin_url;
	var nonce   = phpInfo.nonce;

	$('.aqbp_multiselect_products').select2({

		ajax: {
			url: ajaxurl, // AJAX URL is predefined in WordPress admin
			dataType: 'json',
			type: 'POST',
			delay: 250, // delay in ms while typing when to perform a AJAX search
			data: function (params) {
				return {
					q: params.term, // search query
					action: 'afqbsearchProducts', // AJAX action for admin-ajax.php
					nonce: nonce // AJAX nonce for admin-ajax.php
				};
			},
			processResults: function( data ) {
				var options = [];
				if ( data ) {
   
					// data is the array of arrays, and each of them contains ID and the Label of the option
					$.each( data, function( index, text ) { // do not forget that "index" is just auto incremented value
						options.push( { id: text[0], text: text[1]  } );
					});
   
				}
				return {
					results: options
				};
			},
			cache: true
		},
		multiple: true,
		placeholder: 'Choose Products',
		minimumInputLength: 3 // the minimum of symbols to input before perform a search
		
	});



	check_status_opt();
	$( "#addify_settings_tabs" ).tabs().addClass('ui-tabs-vertical ui-helper-clearfix');
	$(".chosen-select").select2();
	$('#aqbp_set_Red_loc').change(check_status_opt);
	$('#aqbp_single_button').change(check_status_opt);
	$('#aqbp_shop_button').change(check_status_opt);
	function check_status_opt(){
		var selectedloc    = $('#aqbp_set_Red_loc'). children("option:selected"). val();
		var btn_for_single = $('#aqbp_single_button'). children("option:selected"). val();
		var btn_for_shop   = $('#aqbp_shop_button'). children("option:selected"). val();

		if (selectedloc == 'custom') {
			$('#addify_custm_url_row').css('display' , 'block');
		} else {
			$('#addify_custm_url_row').css('display' , 'none');
		}
		if (btn_for_single == 'yes') {
			$('#aqbp_single_button_pos_row').css('display' , 'block');
			$('#aqbp_single_button_pos_row').addClass('addify-option-field');
		} else {
			$('#aqbp_single_button_pos_row').css('display' , 'none');
		}
		if (btn_for_shop == 'yes') {
			$('#aqbp_shop_button_pos_row').css('display' , 'block');
			$('#aqbp_shop_button_pos_row').addClass('addify-option-field');
		} else {
			$('#aqbp_shop_button_pos_row').css('display' , 'none');
		}
	}
}) ;
