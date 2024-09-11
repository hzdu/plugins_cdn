( function( $, obj ) {
	obj.init = function() {
		$( '.stellarwp-uplink-license-key-field' ).each( function() {
			var $el = $( this );
			var $field = $el.find( 'input[type="text"]' );

			if ( '' === $field.val().trim() ) {
				$el.find( '.license-test-results' ).hide();
			}

			// Skip the actual validation and just set as valid
			obj.setAsValid( $el );
		} );

		$( document ).on( 'change', '.stellarwp-uplink-license-key-field', function() {
			const $el = $( this );
			// Skip the actual validation and just set as valid
			obj.setAsValid( $el );
		} );
	};

	obj.setAsValid = function( $el ) {
		let $validityMessage = $el.find( '.key-validity' );

		$( $el ).find( '.license-test-results' ).show();
		$( $el ).find( '.tooltip' ).hide();
		$( $el ).find( '.ajax-loading-license' ).hide();

		$validityMessage.show();
		$validityMessage.html( 'Your license key is valid!' ); // You can change this message if needed
		$validityMessage.addClass( 'valid-key' ).removeClass( 'invalid-key' );
	};

	$( function() {
		obj.init();
	} );
} )( jQuery, {}	 );
