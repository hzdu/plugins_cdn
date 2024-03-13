import TabService    from '../../Services/TabService';
import Compatibility from '../Compatibility';

class WooCommercePayments extends Compatibility {
    constructor() {
        super( 'WooCommercePayments' );
    }

    load(): void {
        jQuery( document ).on( 'stripeError', WooCommercePayments.onError );

        // Hide empty buttons
        jQuery( window ).on( 'load', () => {
            const parent = jQuery( '.wcpay-payment-request-wrapper' );

            parent.children( 'div' ).each( ( index, element ) => {
                // if there is nothing in the button, hide it
                if ( jQuery( element ).children().length === 0 ) {
                    jQuery( element ).hide();
                }
            } );

            // If all children are hidden, hide the parent
            if ( parent.children( ':visible' ).length === 0 ) {
                parent.hide();
            }
        } );
    }

    static onError(): void {
        window.location.hash = TabService.paymentMethodTabId;
    }
}

export default WooCommercePayments;
