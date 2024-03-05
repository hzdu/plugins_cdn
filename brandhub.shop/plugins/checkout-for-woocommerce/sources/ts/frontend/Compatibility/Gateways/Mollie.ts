import OrderBumpService from '../../Services/OrderBumpService';
import Compatibility    from '../Compatibility';

class Mollie extends Compatibility {
    constructor() {
        super( 'Mollie' );
    }

    load(): void {
        jQuery( document.body ).on( 'click', 'input#place_order, button#place_order', ( e ) => {
            if ( !Mollie.isMollieSelected() ) {
                return;
            }

            OrderBumpService.maybeDisplayAfterCheckoutSubmitBumps( e as unknown as Event );
        } );

        jQuery( document.body ).on( 'cfw_after_checkout_bump_handle_rejection cfw_after_checkout_bump_handle_add_to_cart', ( e ) => {
            if ( !Mollie.isMollieSelected() ) {
                return false;
            }

            jQuery( document.body ).find( 'input#place_order, button#place_order' ).first().trigger( 'click' );

            return true;
        } );
    }

    static isMollieSelected(): boolean {
        if ( jQuery( 'input[name="payment_method"]:checked' ).length ) {
            const selectedValue = jQuery( 'input[name="payment_method"]:checked' ).val().toString();
            return selectedValue.indexOf( 'mollie' ) !== -1;
        }

        return false;
    }
}

export default Mollie;
