import Alert         from '../../Components/Alert';
import AlertService  from '../../Services/AlertService';
import TabService    from '../../Services/TabService';
import Compatibility from '../Compatibility';

class ShipMondo extends Compatibility {
    constructor() {
        super( 'ShipMondo' );
    }

    load( params ): void {
        TabService.tabContainer.on( 'easytabs:before', ( event, clicked, target ) => {
            if ( jQuery( target ).attr( 'id' ) === TabService.paymentMethodTabId ) {
                const selectedShippingMethod = jQuery( "input[name='shipping_method[0]']:checked" );

                if ( selectedShippingMethod.length && selectedShippingMethod.val().toString().indexOf( 'shipmondo_shipping_gls' ) !== -1 ) {
                    const shopIdField = jQuery( 'input[name^="shop_ID"]' );

                    if ( shopIdField.length > 0 &&  shopIdField.val().toString() === '' ) {
                        const alert: Alert = new Alert( 'error', params.notice, null, true );
                        AlertService.queueAlert( alert );
                        AlertService.showAlerts();

                        event.stopImmediatePropagation();

                        return false;
                    }
                }
            }
        } );
    }
}

export default ShipMondo;
