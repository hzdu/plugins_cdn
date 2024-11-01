import Alert         from '../../Components/Alert';
import AlertService  from '../../Services/AlertService';
import TabService    from '../../Services/TabService';
import Compatibility from '../Compatibility';

class SendCloud extends Compatibility {
    constructor() {
        super( 'SendCloud' );
    }

    load( params ): void {
        const easyTabsWrap: any = TabService.tabContainer;

        easyTabsWrap.on( 'easytabs:before', ( event, clicked, target ) => {
            if ( jQuery( target ).attr( 'id' ) === TabService.paymentMethodTabId ) {
                const selectedShippingMethod = jQuery( "input[name='shipping_method[0]']:checked" );
                const selectedServicePoint = jQuery( `#${selectedShippingMethod.attr( 'id' )}_submit_data` );

                if ( selectedShippingMethod.length && selectedShippingMethod.val().toString().indexOf( 'sc_service_point' ) !== -1 ) {
                    if ( selectedServicePoint.length === 0 || selectedServicePoint.val() === '' ) {
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
        } );
    }
}

export default SendCloud;
