import Main          from '../../Main';
import Compatibility from '../Compatibility';

class KlarnaPayments extends Compatibility {
    constructor() {
        super( 'KlarnaPayments' );
    }

    load(): void {
        jQuery( document.body ).on( 'click', 'input#place_order, button#place_order', ( e ) => {
            if ( !KlarnaPayments.isKlarnaPaymentsSelected() ) {
                return;
            }

            Main.instance.orderBumpService.maybeDisplayBumps( e as unknown as Event );
        } );

        jQuery( document.body ).on( 'cfw_after_checkout_bump_handle_rejection cfw_after_checkout_bump_handle_add_to_cart', ( e ) => {
            if ( !KlarnaPayments.isKlarnaPaymentsSelected() ) {
                return false;
            }

            jQuery( document.body ).find( 'input#place_order, button#place_order' ).first().trigger( 'click' );

            return true;
        } );
    }

    static isKlarnaPaymentsSelected(): boolean {
        if ( jQuery( 'input[name="payment_method"]:checked' ).length ) {
            const selectedValue = jQuery( 'input[name="payment_method"]:checked' ).val().toString();
            return selectedValue.indexOf( 'klarna_payments' ) !== -1;
        }

        return false;
    }
}

export default KlarnaPayments;
