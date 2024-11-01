import Alert         from '../../Components/Alert';
import AlertService  from '../../Services/AlertService';
import Compatibility from '../Compatibility';
import TabService    from '../../Services/TabService';

class WCPont extends Compatibility {
    constructor() {
        super( 'WCPont' );
    }

    load(): void {
        const easyTabsWrap: any = TabService.tabContainer;

        easyTabsWrap.on( 'easytabs:before', ( event ) => {
            const selected_shipping_method = jQuery( '[name="shipping_method[0]"]:checked' ).val().toString();

            if ( jQuery( '[name="wc_selected_pont"]' ).val() == '' && selected_shipping_method.indexOf( 'wc_pont_' ) >= 0 ) {
                // Prevent removing alert on next update checkout
                AlertService.preserveAlerts = true;

                const alert: Alert = new Alert(  'error', 'Nem választottál átvevőhelyet', null, true );
                AlertService.queueAlert( alert );
                AlertService.showAlerts();

                event.stopImmediatePropagation();

                return false;
            }

            return true;
        } );
    }
}

export default WCPont;
