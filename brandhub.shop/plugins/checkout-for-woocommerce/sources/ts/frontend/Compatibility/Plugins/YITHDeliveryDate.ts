import Compatibility         from '../Compatibility';
import TabService            from '../../Services/TabService';
import UpdateCheckoutService from '../../Services/UpdateCheckoutService';

class YITHDeliverDate extends Compatibility {
    constructor() {
        super( 'YITHDeliveryDate' );
    }

    load(): void {
        jQuery( document.body ).on( 'cfw-after-tab-change', () => {
            const currentTab = TabService.getCurrentTab();

            if ( currentTab.attr( 'id' ) === TabService.shippingMethodTabId ) {
                UpdateCheckoutService.queueUpdateCheckout();
            }
        } );
    }
}

export default YITHDeliverDate;
