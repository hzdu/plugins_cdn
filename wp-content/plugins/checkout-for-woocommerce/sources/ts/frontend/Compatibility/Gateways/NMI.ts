import Main          from '../../Main';
import Compatibility from '../Compatibility';

class NMI extends Compatibility {
    constructor() {
        super( 'NMI' );
    }

    load( params ): void {
        jQuery( document.body ).on( 'cfw-payment-tab-loaded', () => {
            Main.instance.updateCheckoutService.triggerUpdateCheckout();
        } );
    }
}

export default NMI;
