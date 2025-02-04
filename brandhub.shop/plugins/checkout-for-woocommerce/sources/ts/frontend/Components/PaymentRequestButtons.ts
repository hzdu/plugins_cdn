import { select }            from '@wordpress/data';
import DataStores            from '../DataStores';

class PaymentRequestButtons {
    private expressButtonContainer: any;

    private expressButtonSeparator: any;

    constructor() {
        this.expressButtonContainer = jQuery( '#cfw-payment-request-buttons' );
        this.expressButtonSeparator = jQuery( '#payment-info-separator-wrap .pay-button-separator' );

        // Catch buttons as soon as possible
        if ( this.maybeShowExpressButtons() ) {
            return;
        }

        jQuery( window ).on( 'load', () => {
            if ( this.maybeShowExpressButtons() ) {
                return;
            }

            // Handle very slow loading buttons
            let iterations = 0;
            const timer = setInterval( () => {
                if ( this.maybeShowExpressButtons() || iterations > 5 ) {
                    clearInterval( timer );
                }

                iterations += 1;
            }, 1000 );
        } );
    }

    showExpressButtons(): void {
        this.expressButtonContainer.css( 'position', 'relative' ).css( 'opacity', '100' ).css( 'pointer-events', 'auto' );
        this.expressButtonSeparator.show();
    }

    maybeShowExpressButtons(): boolean {
        const needsPayment = select( DataStores.cart_store_key ).getCartNeedsPayment( null ) as boolean;
        const hasButtons = this.hasButtons();

        if ( hasButtons && needsPayment ) {
            this.showExpressButtons();
        }

        return hasButtons;
    }

    hasButtons(): boolean {
        let hasButtons = false;
        const potentialButtons = this.expressButtonContainer.children().not( 'h2, .blockUI, #wc-stripe-payment-request-button-separator, #wc-stripe-express-checkout-button-separator' );

        potentialButtons.each( ( index, element ) => {
            const elementId = jQuery( element ).attr( 'id' );

            // If element ID contains stripe but no children, skip it
            if ( elementId && elementId.includes( 'stripe' ) && !jQuery( element ).children().length ) {
                return;
            }

            if ( jQuery( element ).get( 0 ).getBoundingClientRect().height > 0 ) {
                hasButtons = true;
            }
        } );

        return hasButtons;
    }
}

export default PaymentRequestButtons;
