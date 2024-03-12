import { dispatch, register }                        from '@wordpress/data';
import DataService                                   from './Services/DataService';
import CartItemInterface                             from '../interfaces/CartItemInterface';
import { CartTotalsData }                            from '../interfaces/CartTotalInterface';
import Actions                                       from '../Types/Actions';
import ReviewPaneDataInterface                       from './Interfaces/ReviewPaneDataInterface';
import { Bump }                                      from '../Types/BumpTypes';
import CartStore, { CartStoreStateInterface }        from './Stores/CartStore';
import SideCartData                                  from '../interfaces/SideCartData';
import { ShippingPackageInterface }                  from '../interfaces/ShippingPackageInterface';

class DataStores {
    static cart_store_key = 'cfw-cart-store';

    static hasInitialized = false;

    static init(): void {
        // Prevent re-initialization
        if ( DataStores.hasInitialized ) {
            return;
        }

        register( CartStore );

        ( dispatch( DataStores.cart_store_key ) as any ).setCartNeedsPayment( DataService.getData( 'cart' ).needsPayment as boolean );
        ( dispatch( DataStores.cart_store_key ) as any ).setCartItems( DataService.getData( 'cart' ).items as CartItemInterface[] );
        ( dispatch( DataStores.cart_store_key ) as any ).setCartActions( DataService.getData( 'cart' ).actions as Actions );
        ( dispatch( DataStores.cart_store_key ) as any ).setCartTotals( DataService.getData( 'cart' ).totals as CartTotalsData );
        ( dispatch( DataStores.cart_store_key ) as any ).setCartNotices( DataService.getData( 'cart' ).notices as string );
        ( dispatch( DataStores.cart_store_key ) as any ).setShippingData( DataService.getData( 'cart' ).shipping as ShippingPackageInterface[] );
        ( dispatch( DataStores.cart_store_key ) as any ).setOrderBumps( DataService.getData( 'bumps' ) as Bump[] );
        ( dispatch( DataStores.cart_store_key ) as any ).setReviewData( DataService.getData( 'review' ) as ReviewPaneDataInterface );
        ( dispatch( DataStores.cart_store_key ) as any ).setSideCartData( DataService.getData( 'side_cart' ) as SideCartData );

        DataStores.hasInitialized = true;
    }
}

export default DataStores;
