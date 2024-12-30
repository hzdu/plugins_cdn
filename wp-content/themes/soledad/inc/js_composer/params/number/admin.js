jQuery( function ( $ ) {
	'use strict';

	$( document ).on( 'change', '.penci-number-input, .penci-number-suffix', function () {
		var $number = $( this ).parent(),
			input = $number.find( '.penci-number-input' ).val(),
			unit = $number.find( '.penci-number-suffix' ).val();

		$number.find( '.wpb_vc_param_value' ).val( input + unit );
	} );
} );
