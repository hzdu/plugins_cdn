import Compatibility from '../Compatibility';

class Square extends Compatibility {
    constructor() {
        super( 'Square' );
    }

    load(): void {
        jQuery( document.body ).on( 'cfw-after-tab-change', () => {
            ( <any>window )?.wc_square_credit_card_payment_form_handler?.payment_form?.recalculateSize();
        } );
    }
}

export default Square;
