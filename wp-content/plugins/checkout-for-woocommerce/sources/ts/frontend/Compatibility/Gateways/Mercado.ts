import DataService          from '../../Services/DataService';
import TabService           from '../../Services/TabService';
import Compatibility        from '../Compatibility';

class Mercado extends Compatibility {
    constructor() {
        super( 'Mercado' );
    }

    load(): void {
        jQuery( document.body ).one( 'cfw-payment-tab-loaded', () => {
            Mercado.makeSureFormLoaded();
        } );

        jQuery( document.body ).one( 'updated_checkout', () => {
            if ( TabService.getCurrentTab().attr( 'id' ) === TabService.paymentMethodTabId || DataService.getSetting( 'enable_one_page_checkout' ) ) {
                Mercado.makeSureFormLoaded();
            }
        } );
    }

    static makeSureFormLoaded(): void {
        if ( typeof ( <any>window ).cardForm === 'undefined' ) {
            return;
        }

        ( <any>window ).cardForm.unmount();
        ( <any>window ).cardFormLoad();
    }
}

export default Mercado;
