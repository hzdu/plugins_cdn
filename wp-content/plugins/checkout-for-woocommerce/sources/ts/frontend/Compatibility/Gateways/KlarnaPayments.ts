import Compatibility    from '../Compatibility';

class KlarnaPayments extends Compatibility {
    constructor() {
        super( 'KlarnaPayments' );
    }

    load(): void {
        jQuery( document.body ).on( 'click', 'input#place_order, button#place_order', ( e ) => {
            if ( !KlarnaPayments.isKlarnaPaymentsSelected() ) {
                return true;
            }

            if ( jQuery( document.body ).triggerHandler( 'cfw_request_after_checkout_submit_bumps', [ e ] ) === false ) {
                e.preventDefault();
                e.stopImmediatePropagation();
                return false;
            }
        } );

        jQuery( document.body ).on( 'cfw_after_checkout_bump_handle_rejection cfw_after_checkout_bump_handle_add_to_cart', ( e ) => {
            if ( !KlarnaPayments.isKlarnaPaymentsSelected() ) {
                return false;
            }

            jQuery( document.body ).find( 'input#place_order, button#place_order' ).first().trigger( 'click' );

            return true;
        } );

        jQuery( document.body ).firstOn( 'updated_checkout', () => {
            if ( KlarnaPayments.isKlarnaPaymentsSelected() ) {
                return;
            }

            jQuery( 'li.wc_payment_method' ).not( '.cfw-active' ).find( '.payment_box' ).hide();
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
