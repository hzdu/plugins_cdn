import { dispatch, register }                        from '@wordpress/data';
import DataService                                   from './Services/DataService';
import CartItemInterface                             from '../interfaces/CartItemInterface';
import { CartTotalsData }                            from '../interfaces/CartTotalInterface';
import Actions                                       from '../Types/Actions';
import ReviewPaneDataInterface                       from './Interfaces/ReviewPaneDataInterface';
import { Bump }                                      from '../Types/BumpTypes';
import CartStore                                     from './Stores/CartStore';
import SideCartData                                  from '../interfaces/SideCartData';
import { ShippingPackageInterface }                  from '../interfaces/ShippingPackageInterface';
import LoggingService                                from './Services/LoggingService';

declare let wc_cart_fragments_params: any;

interface UpdateDataInterface {
    cart?: {
        isEmpty?: boolean;
        needsPayment?: boolean;
        items?: CartItemInterface[];
        totals?: CartTotalsData;
        staticActions?: Actions;
        actions?: Actions;
        notices?: string;
        shipping: ShippingPackageInterface[],
    };
    side_cart?: SideCartData;
    review?: ReviewPaneDataInterface;
    bumps?: Bump[];
}

class DataStores {
    static cart_store_key = 'cfw-cart-store';

    static hasInitialized = false;

    static init(): void {
        // Prevent re-initialization
        if ( DataStores.hasInitialized ) {
            return;
        }

        register( CartStore );

        DataStores.hasInitialized = DataStores.tryToUpdateDataStoreFromLocalStorage();

        if ( DataStores.hasInitialized ) {
            return;
        }

        // Fallback, get from the page
        ( dispatch( DataStores.cart_store_key ) as any ).setCartIsEmpty( DataService.getData( 'cart' ).isEmpty as boolean );
        ( dispatch( DataStores.cart_store_key ) as any ).setCartNeedsPayment( DataService.getData( 'cart' ).needsPayment as boolean );
        ( dispatch( DataStores.cart_store_key ) as any ).setCartItems( DataService.getData( 'cart' ).items as CartItemInterface[] );
        ( dispatch( DataStores.cart_store_key ) as any ).setCartActions( DataService.getData( 'cart' ).actions as Actions );
        ( dispatch( DataStores.cart_store_key ) as any ).setCartStaticActions( DataService.getData( 'cart' ).staticActions as Actions );
        ( dispatch( DataStores.cart_store_key ) as any ).setCartTotals( DataService.getData( 'cart' ).totals as CartTotalsData );
        ( dispatch( DataStores.cart_store_key ) as any ).setCartNotices( DataService.getData( 'cart' ).notices as string );
        ( dispatch( DataStores.cart_store_key ) as any ).setShippingData( DataService.getData( 'cart' ).shipping as ShippingPackageInterface[] );
        ( dispatch( DataStores.cart_store_key ) as any ).setOrderBumps( DataService.getData( 'bumps' ) as Bump[] );
        ( dispatch( DataStores.cart_store_key ) as any ).setReviewData( DataService.getData( 'review' ) as ReviewPaneDataInterface );
        ( dispatch( DataStores.cart_store_key ) as any ).setSideCartData( DataService.getData( 'side_cart' ) as SideCartData );

        DataStores.hasInitialized = true;
    }

    static tryToUpdateDataStoreFromLocalStorage() {
        if ( DataService.getCheckoutParam( 'is_checkout' ) ) {
            return false;
        }

        if ( !DataStores.supportsHTML5Storage() ) {
            return false;
        }

        // eslint-disable-next-line camelcase
        const data: any = sessionStorage.getItem( wc_cart_fragments_params.fragment_name );
        const fragments = JSON.parse( data );

        if ( fragments && fragments.cfw_data ) {
            LoggingService.logNotice( 'Successfully fetched fragments from session storage' );
            DataStores.updateDataStore( fragments.cfw_data, true );

            return true;
        }
        LoggingService.logNotice( 'Failed to fetch fragments from session storage' );
        return false;
    }

    static supportsHTML5Storage(): boolean {
        let supportsHTML5Storage: boolean;

        try {
            supportsHTML5Storage = ( 'sessionStorage' in window && window.sessionStorage !== null );
            window.sessionStorage.setItem( 'wc', 'test' );
            window.sessionStorage.removeItem( 'wc' );
            window.localStorage.setItem( 'wc', 'test' );
            window.localStorage.removeItem( 'wc' );
        } catch ( err ) {
            supportsHTML5Storage = false;
        }

        return supportsHTML5Storage;
    }

    /**
     * Updates data store with data from AJAX response
     *
     * Does NOT update actions store
     */
    static updateDataStore( data: UpdateDataInterface, updateStaticActions = false ) {
        // Reset the AJAX update flag to prevent a recursive loop
        DataService.setRuntimeParameter( 'needsAjaxUpdate', false );

        if ( !data ) {
            return;
        }

        if ( typeof data.cart?.isEmpty !== 'undefined' ) {
            ( dispatch( DataStores.cart_store_key ) as any ).setCartIsEmpty( data.cart.isEmpty as boolean );
        }

        if ( typeof data.cart?.needsPayment !== 'undefined' ) {
            ( dispatch( DataStores.cart_store_key ) as any ).setCartNeedsPayment( data.cart.needsPayment as boolean );
        }

        if ( data.cart?.items ) {
            ( dispatch( DataStores.cart_store_key ) as any ).setCartItems( data.cart.items as CartItemInterface[] );
        }

        /**
         * Don't update static actions by default because plugins don't expect actions to be updated from the server
         * unless they are part of a fragment, in which case they are updated by the fragment
         *
         * Actions are only updated by default on page load from CartStore.ts
         */
        if ( updateStaticActions && data.cart?.staticActions ) {
            ( dispatch( DataStores.cart_store_key ) as any ).setCartStaticActions( data.cart.staticActions as Actions );
        }

        // Always update dynamic actions
        ( dispatch( DataStores.cart_store_key ) as any ).setCartActions( data.cart.actions as Actions );

        if ( data.cart?.totals ) {
            ( dispatch( DataStores.cart_store_key ) as any ).setCartTotals( data.cart.totals as CartTotalsData );
        }

        if ( data.cart?.notices ) {
            ( dispatch( DataStores.cart_store_key ) as any ).setCartNotices( data.cart.notices );
        }

        if ( data.cart.shipping ) {
            ( dispatch( DataStores.cart_store_key ) as any ).setShippingData( data.cart.shipping as ShippingPackageInterface[] );
        }

        if ( data.review ) {
            ( dispatch( DataStores.cart_store_key ) as any ).setReviewData( data.review as ReviewPaneDataInterface );
        }

        if ( data.side_cart ) {
            ( dispatch( DataStores.cart_store_key ) as any ).setSideCartData( data.side_cart as SideCartData );
        }

        if ( data.bumps ) {
            ( dispatch( DataStores.cart_store_key ) as any ).setOrderBumps( data.bumps as Bump[] );
        }
    }
}

export default DataStores;
