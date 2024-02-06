import cfwAddOverlay                        from '../../functions/cfwAddOverlay';
import AfterCheckoutOrderBumpModal          from '../Modals/AfterCheckoutOrderBumpModal';
import ChoosableVariationOrderBumpModal     from '../Modals/ChoosableVariationOrderBumpModal';
import CompleteOrderService                 from './CompleteOrderService';
import DataService                          from './DataService';
import LoggingService                       from './LoggingService';

class OrderBumpService {
    protected modal: AfterCheckoutOrderBumpModal;

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

        if ( typeof DataService.checkoutForm === 'undefined' || !DataService.checkoutForm || !DataService.checkoutForm.length ) {
            return;
        }

        DataService.checkoutForm.firstOn( 'checkout_place_order', OrderBumpService.maybeDisplayAfterCheckoutSubmitBumps.bind( this ) );
    }

    static maybeDisplayAfterCheckoutSubmitBumps( event: Event ): boolean {
        const bumps = DataService.getData( 'after_checkout_bumps' );

        if ( !Object.keys( bumps ).length ) {
            return true;
        }

        cfwAddOverlay();

        OrderBumpService.displayNextAfterCheckoutSubmitBump();

        event.preventDefault();
        event.stopImmediatePropagation();
        return false;
    }

    static displayNextAfterCheckoutSubmitBump(): boolean {
        const apiRoot = ( <any>window ).wpApiSettings.root;

        const bumps: Record<string, unknown> = DataService.getData( 'after_checkout_bumps' );

        if ( !Object.keys( bumps ).length ) {
            return false;
        }

        const bumpId = Object.keys( bumps )[ 0 ];
        delete bumps[ bumpId ];

        DataService.updateData( 'after_checkout_bumps', bumps );

        // Foreach bump
        jQuery.ajax( {
            url: `${apiRoot}checkoutwc/v1/order-bump-upsell-product-form/${bumpId}`,
            method: 'GET',
            beforeSend( xhr ) {
                xhr.setRequestHeader( 'X-WP-Nonce', ( <any>window ).wpApiSettings.nonce );
            },
            error( xhr, status, error ) {
                LoggingService.logError( 'Could not load order bump product form.', error );
            },
            success( data ) {
                const modal = new AfterCheckoutOrderBumpModal( data.html ?? 'Could not load product.' );
                DataService.setRuntimeParameter( 'open_after_checkout_bump', modal );
                modal.open();
            },
        } );

        return true;
    }
}

export default OrderBumpService;
