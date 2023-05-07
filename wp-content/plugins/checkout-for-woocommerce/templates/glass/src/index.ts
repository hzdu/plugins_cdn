import './scss/style.scss';

jQuery( document.body ).on( 'updated_checkout', () => {
    jQuery( '.cfw-shipping-methods-list' ).each( ( index, element ) => {
        jQuery( element ).find( 'input[type="radio"]' ).each( ( i, el ) => {
            if ( jQuery( el ).is( ':checked' ) ) {
                jQuery( el ).parents( 'li' ).first().addClass( 'active' );
            } else {
                jQuery( el ).parents( 'li' ).first().removeClass( 'active' );
            }
        } );
    } );
} );
