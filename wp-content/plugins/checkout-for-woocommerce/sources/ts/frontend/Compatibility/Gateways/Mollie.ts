import Compatibility    from '../Compatibility';

class Mollie extends Compatibility {
    constructor() {
        super( 'Mollie' );
    }

    load(): void {
        // Mollie intercepts the submission process and reroutes it to their own submission handler, even when a non-mollie gatweway is selected
        // So we can't rely on detecting whether mollie is actually selected
        jQuery( document.body ).on( 'click', 'input#place_order, button#place_order', ( e ) => {
            if ( jQuery( document.body ).triggerHandler( 'cfw_request_after_checkout_submit_bumps' ) === false ) {
                e.preventDefault();
                e.stopImmediatePropagation();
                return false;
            }

            return true;
        } );

        jQuery( document.body ).on( 'cfw_after_checkout_bump_handle_rejection cfw_after_checkout_bump_handle_add_to_cart', () => {
            jQuery( document.body ).find( 'input#place_order, button#place_order' ).first().trigger( 'click' );
        } );
    }
}

export default Mollie;
