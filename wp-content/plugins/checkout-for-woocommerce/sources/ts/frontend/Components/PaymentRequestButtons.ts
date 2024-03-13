import { select, subscribe } from '@wordpress/data';
import DataStores            from '../DataStores';
import { Bump }              from '../../Types/BumpTypes';

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

        // Fix for WooPay
        jQuery( window ).on( 'load', () => {
            jQuery( '.wcpay-payment-request-wrapper' ).children( 'div' ).each( ( index, element ) => {
                // if only contains comment, hide it
                if ( jQuery( element ).children().length === 0 ) {
                    jQuery( element ).hide();
                }
            } );

            // If all children are hidden, hide the parent
            jQuery( '.wcpay-payment-request-wrapper' ).each( ( index, element ) => {
                if ( jQuery( element ).children( ':visible' ).length === 0 ) {
                    jQuery( element ).hide();
                }
            } );
        } );
    }

    showExpressButtons(): void {
        this.expressButtonContainer.css( 'position', 'relative' ).css( 'visibility', 'visible' );
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
        const potentialButtons = this.expressButtonContainer.children().not( 'h2, .blockUI' );

        potentialButtons.each( ( index, element ) => {
            if ( jQuery( element ).get( 0 ).getBoundingClientRect().height > 0 ) {
                hasButtons = true;
            }
        } );

        return hasButtons;
    }
}

export default PaymentRequestButtons;
