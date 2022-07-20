import Compatibility from '../Compatibility';

class KlarnaPayments extends Compatibility {
    constructor() {
        super( 'KlarnaPayments' );
    }

    load(): void {
        jQuery( document.body ).on( 'cfw-payment-tab-loaded', () => {
            // If this call doesn't run, Klarna won't load the iframe
            jQuery( 'input[name="payment_method"]:checked' ).trigger( 'change' );
        } );
    }
}

export default KlarnaPayments;
