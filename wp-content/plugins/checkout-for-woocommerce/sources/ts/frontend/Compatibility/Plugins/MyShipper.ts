import Alert                 from '../../Components/Alert';
import AlertService          from '../../Services/AlertService';
import TabService            from '../../Services/TabService';
import Compatibility         from '../Compatibility';
import UpdateCheckoutService from '../../Services/UpdateCheckoutService';

class MyShipper extends Compatibility {
    constructor() {
        super( 'MyShipper' );
    }

    load( params ): void {
        const easyTabsWrap: any = TabService.tabContainer;

        easyTabsWrap.on( 'easytabs:after', () => {
            if ( TabService.getCurrentTab().attr( 'id' ) === TabService.shippingMethodTabId ) {
                UpdateCheckoutService.queueUpdateCheckout();
            }
        } );

        easyTabsWrap.on( 'easytabs:before', ( event, clicked, target ) => {
            if ( jQuery( target ).attr( 'id' ) === TabService.paymentMethodTabId ) {
                const selectedShippingMethod = jQuery( "input[name='shipping_method[0]']:checked" );
                const shippingNumber = jQuery( 'input.shipper_number' ).first();

                if ( selectedShippingMethod.length && selectedShippingMethod.val().toString().indexOf( 'use_my_shipper' ) !== -1 ) {
                    if ( shippingNumber.length === 0 || shippingNumber.val() === '' ) {
                        // Prevent removing alert on next update checkout
                        AlertService.preserveAlerts = true;

                        const alert: Alert = new Alert( 'error', params.notice, null, true );
                        AlertService.queueAlert( alert );
                        AlertService.showAlerts();

                        event.stopImmediatePropagation();

                        return false;
                    }
                }
            }

            return true;
        } );
    }
}

export default MyShipper;
