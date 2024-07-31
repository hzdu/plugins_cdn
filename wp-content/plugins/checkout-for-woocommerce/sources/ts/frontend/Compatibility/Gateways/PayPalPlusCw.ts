import Compatibility         from '../Compatibility';
import UpdateCheckoutService from '../../Services/UpdateCheckoutService';

class PayPalPlusCw extends Compatibility {
    constructor() {
        super( 'PayPalPlusCw' );
    }

    load(): void {
        jQuery( document.body ).on( 'cfw-payment-tab-loaded', () => {
            UpdateCheckoutService.queueUpdateCheckout();
        } );
    }
}

export default PayPalPlusCw;
