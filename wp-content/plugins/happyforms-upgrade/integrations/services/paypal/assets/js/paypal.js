( function( $, Cookies ) {
	$( function() {
		$( document ).on( 'happyforms.submitted', function( e, response ) {
			if ( ! response.data.paypal || ! response.data.paypal.paymentId ) {
				return;
			}

			var $form = $( e.target );
			var form_id = $( '[name=happyforms_form_id]', $form ).val();

			Cookies.set( 'happyforms_checkout', {
				id: response.data.paypal.paymentId,
				status: window.location.href,
				form_id: form_id,
			} );
		} );
	} );
} )( jQuery, Cookies );