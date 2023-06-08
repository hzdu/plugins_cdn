import AfterCheckoutOrderBumpModal          from '../Modals/AfterCheckoutOrderBumpModal';
import ChoosableVariationOrderBumpModal     from '../Modals/ChoosableVariationOrderBumpModal';
import DataService                          from './DataService';

class OrderBumpService {
    protected modal: AfterCheckoutOrderBumpModal;

    protected bumpDisplayed = false;

    constructor() {
        this.setListeners();
    }

    setListeners(): void {
        jQuery( document.body ).on( 'change', '.cfw_order_bump_check', ( e ) => {
            if ( jQuery( e.currentTarget ).data( 'variable' ) && jQuery( e.currentTarget ).is( ':checked' ) ) {
                const apiRoot = ( <any>window ).wpApiSettings.root;
                const url = `${apiRoot}checkoutwc/v1/modal-order-bump-product-form/${jQuery( e.currentTarget ).val()}`;

                jQuery.get( url, ( data ) => {
                    const modal = new ChoosableVariationOrderBumpModal( data.html ?? 'Could not load product.', {}, e );
                    modal.open();
                } );

                return;
            }

            jQuery( document.body ).trigger( 'cfw_update_cart' );
        } );

        DataService.checkoutForm && DataService.checkoutForm.firstOn( 'checkout_place_order', this.maybeDisplayBumps.bind( this ) );
    }

    maybeDisplayBumps( event: Event ): boolean {
        if ( this.bumpDisplayed ) {
            return true;
        }

        const bumps = DataService.getData( 'after_checkout_bumps' );
        const apiRoot = ( <any>window ).wpApiSettings.root;

        if ( !Object.keys( bumps ).length ) {
            return true;
        }

        // Foreach bump
        Object.keys( bumps ).forEach( ( bumpId ) => {
            jQuery.ajax( {
                url: `${apiRoot}checkoutwc/v1/order-bump-upsell-product-form/${bumpId}`,
                method: 'GET',
                beforeSend( xhr ) {
                    xhr.setRequestHeader( 'X-WP-Nonce', ( <any>window ).wpApiSettings.nonce );
                },
                success( data ) {
                    this.modal = new AfterCheckoutOrderBumpModal( data.html ?? 'Could not load product.' );
                    this.modal.open();
                },
            } );
        } );

        this.bumpDisplayed = true;

        event.preventDefault();
        event.stopImmediatePropagation();
        return false;
    }
}

export default OrderBumpService;
