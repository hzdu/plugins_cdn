import Action                  from './Action';

class AddToCartAction extends Action {
    protected button: JQuery;

    /**
     * @param button
     */
    constructor( button: JQuery ) {
        super( 'cfw_add_to_cart' );

        this.button = button;
    }

    /**
     * @param resp
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public response( resp: any ): void {
        if ( typeof resp !== 'object' ) {
            // eslint-disable-next-line no-param-reassign
            resp = JSON.parse( resp );
        }

        if ( resp.redirect ) {
            window.location.href = resp.redirect;
            return;
        }

        jQuery( '#cfw_empty_side_cart_message' ).hide();

        jQuery( document.body ).trigger( 'wc_fragment_refresh' );
        jQuery( document.body ).trigger( 'added_to_cart', [ resp.fragments, resp.cart_hash, this.button ] );
        jQuery( document.body ).trigger( 'updated_cart_totals' );
    }

    public complete(): void {
        this.button.removeClass( 'loading' ).addClass( 'added' );
    }
}

export default AddToCartAction;
