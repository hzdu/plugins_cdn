import cfwAddOverlay         from '../../functions/cfwAddOverlay';
import CompleteOrderAction   from '../Actions/CompleteOrderAction';
import DataService           from './DataService';
import LoggingService        from './LoggingService';
import UpdateCheckoutService from './UpdateCheckoutService';

class CompleteOrderService {
    constructor() {
        this.setCheckoutErrorHandler();
        this.setCompleteOrderListener();
    }

    setCheckoutErrorHandler(): void {
        jQuery( document.body ).on( 'checkout_error', () => {
            jQuery( document.body ).trigger( 'cfw-remove-overlay' );
            LoggingService.logEvent( 'Fired cfw-remove-overlay event.' );
        } );
    }

    setCompleteOrderListener(): void {
        DataService.checkoutForm.on( 'submit', CompleteOrderService.completeOrderSubmitHandler.bind( this ) );
    }

    /**
     * Kick off complete order
     */
    static completeOrderSubmitHandler(): boolean {
        // Prevent any update checkout calls from spawning
        UpdateCheckoutService.resetUpdateCheckoutTimer();

        if ( DataService.checkoutForm.is( '.processing' ) ) {
            return false;
        }

        // If all the payment stuff has finished any ajax calls, run the complete order.
        // eslint-disable-next-line max-len
        if ( DataService.checkoutForm.triggerHandler( 'checkout_place_order', [ ( window as any ).wc_checkout_form ] ) !== false && DataService.checkoutForm.triggerHandler( `checkout_place_order_${DataService.checkoutForm.find( 'input[name="payment_method"]:checked' ).val()}`, [ ( window as any ).wc_checkout_form ] ) !== false ) {
            DataService.checkoutForm.addClass( 'processing' );

            cfwAddOverlay();

            new CompleteOrderAction().load( DataService.checkoutForm.serialize() );
        } else {
            jQuery( document.body ).trigger( 'cfw_checkout_place_order_event_returned_false' );
        }

        /**
         * Throwing an error here seems to cause situations where the error
         * briefly appears during a successful order
         */
        return false;
    }
}

export default CompleteOrderService;
