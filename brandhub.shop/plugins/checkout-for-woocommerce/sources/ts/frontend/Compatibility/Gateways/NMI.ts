import Compatibility         from '../Compatibility';
import UpdateCheckoutService from '../../Services/UpdateCheckoutService';

class NMI extends Compatibility {
    constructor() {
        super( 'NMI' );
    }

    load( params ): void {
        jQuery( document.body ).on( 'cfw-payment-tab-loaded', () => {
            UpdateCheckoutService.queueUpdateCheckout();
        } );
    }
}

export default NMI;
