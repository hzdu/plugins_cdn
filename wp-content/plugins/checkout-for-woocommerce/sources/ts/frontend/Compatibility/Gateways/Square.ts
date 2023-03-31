import LoggingService from '../../Services/LoggingService';
import Compatibility  from '../Compatibility';

class Square extends Compatibility {
    constructor() {
        super( 'Square' );
    }

    load(): void {
        jQuery( document.body ).on( 'cfw-after-tab-change', () => {
            try {
                ( <any>window )?.wc_square_credit_card_payment_form_handler?.payment_form?.recalculateSize();
            } catch ( e ) {
                LoggingService.logError( 'Could not recalculate Square payment form size', e );
            }
        } );
    }
}

export default Square;
