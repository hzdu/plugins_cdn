import Compatibility  from '../Compatibility';
import ParsleyService from '../../Services/ParsleyService';

class PaymentPluginsPayPal extends Compatibility {
    constructor() {
        super( 'PaymentPluginsPayPal' );
    }

    load(): void {
        jQuery( document.body ).on( 'cfw_pre_update_order_review_action', () => {
            if ( typeof ( <any>window ).wcPPCPSettings === 'undefined' ) {
                return;
            }

            if ( typeof ( <any>window ).wcPPCPSettings.ppcp_data === 'undefined' ) {
                return;
            }

            if ( typeof ( <any>window ).wcPPCPSettings.ppcp_data.readyToCheckout !== 'undefined' && ( <any>window ).wcPPCPSettings.ppcp_data.readyToCheckout === true ) {
                jQuery( '#shipping_house_number_field' ).hide();
                jQuery( '#shipping_house_number' ).attr( 'disabled', 'disabled' );
                jQuery( '#shipping_street_name_field' ).hide();
                jQuery( '#shipping_street_name' ).attr( 'disabled', 'disabled' );
                jQuery( '#billing_house_number_field' ).hide();
                jQuery( '#billing_house_number' ).attr( 'disabled', 'disabled' );
                jQuery( '#billing_street_name_field' ).hide();
                jQuery( '#billing_street_name' ).attr( 'disabled', 'disabled' );
                jQuery( '#shipping_address_1_field' ).removeClass( 'cfw-hidden' );
                jQuery( '#billing_address_1_field' ).removeClass( 'cfw-hidden' );

                ParsleyService.instance.queueRefreshParsley();
            }
        } );
    }
}

export default PaymentPluginsPayPal;
