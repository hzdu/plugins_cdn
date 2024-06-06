import TabService    from '../../Services/TabService';
import Compatibility from '../Compatibility';

class WooCommercePayments extends Compatibility {
    constructor() {
        super( 'WooCommercePayments' );
    }

    load(): void {
        jQuery( document ).on( 'stripeError', WooCommercePayments.onError );
    }

    static onError(): void {
        window.location.hash = TabService.paymentMethodTabId;
    }
}

export default WooCommercePayments;
