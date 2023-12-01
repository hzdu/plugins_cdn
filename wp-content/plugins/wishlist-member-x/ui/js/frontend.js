jQuery(function($) {
  // toggle switch for login form password fields
	$( 'body' ).on( 'click', '.wishlist-member-login-password a', function( e ) {
		e.preventDefault();
		var fld = $( this ).closest( '.wishlist-member-login-password' ).find( 'input' );
		if( fld.length ) {
			switch( fld[0].type.toLowerCase() ) {
				case 'password':
					fld[0].type = 'text';
					$( this ).removeClass( 'dashicons-visibility' ).addClass( 'dashicons-hidden' );
					break;
				default:
					fld[0].type = 'password';
					$( this ).removeClass( 'dashicons-hidden' ).addClass( 'dashicons-visibility' );
			}
      fld[0].focus();
		}
	} );
} );