import { select, subscribe }                  from '@wordpress/data';
import Cookies                                from 'js-cookie';
import UpdateSideCart                         from '../Actions/UpdateSideCart';
import DataService                            from '../Services/DataService';
import DataStores                             from '../DataStores';
import CartItemInterface                      from '../../interfaces/CartItemInterface';
import { Bump }                               from '../../Types/BumpTypes';
import LoggingService                         from '../Services/LoggingService';

declare let wc_cart_fragments_params: any;

class SideCart {
    constructor() {
        this.setDataStoreListeners();
        this.setTriggers();
    }

    setDataStoreListeners(): void {
        // Catch cart fragment updates
        jQuery( window ).on( 'wc_fragments_refreshed', () => {
            if ( DataService.getRuntimeParameter( 'dataAlreadyUpdated' ) ) {
                DataService.setRuntimeParameter( 'dataAlreadyUpdated', false );
                return;
            }

            DataStores.tryToUpdateDataStoreFromLocalStorage();
        } );

        jQuery( document.body ).on( 'added_to_cart removed_from_cart', ( event, fragments, cart_hash, button, source ) => {
            if ( !fragments ) {
                return;
            }

            if ( DataService.getRuntimeParameter( 'dataAlreadyUpdated' ) ) {
                DataService.setRuntimeParameter( 'dataAlreadyUpdated', false );
                return;
            }

            if ( fragments && fragments.cfw_data ) {
                DataStores.updateDataStore( fragments.cfw_data, true );
            }
        } );
    }

    setTriggers(): void {
        // Allow non-data based updates to the cart
        jQuery( document.body ).on( 'cfw_update_cart', () => {
            this.processCartUpdates();
        } );

        // Subscribe to changes in the store
        subscribe( () => {
            // Check if an AJAX update is needed
            if ( DataService.getRuntimeParameter( 'needsAjaxUpdate' ) ) {
                this.processCartUpdates();
            }
        }, DataStores.cart_store_key );

        const additionalSideCartTriggerSelectors = DataService.getSetting( 'additional_side_cart_trigger_selectors' );

        if ( additionalSideCartTriggerSelectors ) {
            jQuery( document.body ).on( 'click', additionalSideCartTriggerSelectors, SideCart.openCart.bind( this ) );
        }

        jQuery( document.body ).on( 'cfw_open_side_cart', SideCart.openCart.bind( this ) );
        jQuery( document.body ).on( 'click', '.cfw-side-cart-open-trigger, .added_to_cart', SideCart.openCart.bind( this ) );
        jQuery( document.body ).on( 'keydown', '.cfw-side-cart-open-trigger', SideCart.maybeOpenCart.bind( this ) );
        jQuery( document.body ).on( 'click', '.menu-item a:has(.cfw-side-cart-open-trigger)', SideCart.openCart.bind( this ) );
        jQuery( document.body ).on( 'click', '.cfw-side-cart-close-trigger, .cfw-side-cart-close-btn, #cfw-side-cart-overlay', SideCart.closeCart.bind( this ) );
        jQuery( document.body ).on( 'added_to_cart', () => {
            this.maybeOpenCartOrShakeButton();
        } );

        document.body.addEventListener( 'wc-blocks_added_to_cart', () => {
            // Manually refresh and handle opening the cart
            jQuery( document.body ).one( 'wc_fragments_refreshed', () => {
                this.maybeOpenCartOrShakeButton();
            } );

            // Trigger the manual refresh
            jQuery( document.body ).trigger( 'wc_fragment_refresh' );
        } );

        jQuery( document.body ).on( 'click', `a.wc-forward:contains(${DataService.getMessage( 'view_cart' )})`, SideCart.openCart.bind( this ) );
        jQuery( document.body ).on( 'cfw_suggested_variable_product_added_to_cart cfw_order_bump_variation_added_to_cart', ( e, resp ) => {
            if ( typeof resp !== 'object' ) {
                // eslint-disable-next-line no-param-reassign
                resp = JSON.parse( resp );
            }

            if ( resp.data ) {
                DataStores.updateDataStore( resp.data, true );
            }

            jQuery( document.body ).trigger( 'wc_fragment_refresh' );
            jQuery( document.body ).trigger( 'added_to_cart', [ resp.fragments, resp.cart_hash, jQuery( e.target ) ] );
            jQuery( document.body ).trigger( 'updated_cart_totals' );
        } );

        jQuery( document.body ).on( 'cfw_cart_item_variation_edited', ( e, resp ) => {
            if ( resp.data ) {
                DataStores.updateDataStore( resp.data, true );
            }

            jQuery( document.body ).trigger( 'wc_fragment_refresh' );
            jQuery( document.body ).trigger( 'updated_cart_totals' );
        } );

        jQuery( window ).on( 'load', () => {
            if ( window.location.hash === '#cfw-cart' || DataService.getRuntimeParameter( 'openCart' ) ) {
                this.maybeOpenCartOrShakeButton();
            }
        } );

        jQuery( window ).on( 'load', () => {
            if ( Cookies.get( 'cfw_cart_hash' ) !== Cookies.get( 'woocommerce_cart_hash' ) ) {
                jQuery( document.body ).trigger( 'wc_fragment_refresh' );
            }
        } );
    }

    maybeOpenCartOrShakeButton(): void {
        if ( !DataService.getSetting( 'disable_side_cart_auto_open' ) ) {
            SideCart.openCart();

            return;
        }

        if ( !DataService.getSetting( 'enable_floating_cart_button' ) ) {
            return;
        }

        jQuery( document.body  ).on( 'wc_fragments_loaded', () => {
            this.shakeCartButton();
        } );
    }

    static tryToGetDataFromLocalStorage(): void {
        if ( !SideCart.supportsHTML5Storage() ) {
            return;
        }

        // eslint-disable-next-line camelcase
        const data: any = sessionStorage.getItem( wc_cart_fragments_params.fragment_name );
        const fragments = JSON.parse( data );

        if ( fragments && fragments.cfw_data ) {
            LoggingService.logNotice( 'Successfully fetched fragments from session storage' );
            DataStores.updateDataStore( fragments.cfw_data, true );
        } else {
            LoggingService.logNotice( 'Failed to fetch fragments from session storage' );
        }
    }

    shakeCartButton(): void {
        jQuery( '#cfw-side-cart-floating-button' ).addClass( 'cfw-shake' );

        setTimeout( () => {
            jQuery( '#cfw-side-cart-floating-button' ).removeClass( 'cfw-shake' );
        }, 850 );
    }

    static maybeOpenCart( e?: KeyboardEvent ): void {
        // open the cart if the user presses enter or space on the floating cart button due to us using an anchor tag with role="button"
        if ( e.keyCode === 32 || e.keyCode === 13 ) {
            e.preventDefault();

            SideCart.openCart();
        }
    }

    static openCart( e?: Event ): void {
        if ( e ) {
            e.preventDefault();
        }

        setTimeout( () => {
            const checkoutBtn = jQuery( '.wc-proceed-to-checkout a' );

            // Focus on the checkout button if it exists, otherwise focus on the close button (e.g. empty cart)
            if ( checkoutBtn?.length ) {
                checkoutBtn.trigger( 'focus' );
            } else {
                jQuery( '.cfw-side-cart-close-btn' ).trigger( 'focus' );
            }
        }, 500 );

        jQuery( 'body' ).addClass( 'cfw-side-cart-open' ).removeClass( 'cfw-side-cart-close' );
        jQuery( '.cfw-side-cart-floating-button' ).attr( 'aria-expanded', 'true' );
    }

    static closeCart( e?: Event ): void {
        if ( e ) {
            e.preventDefault();
        }
        jQuery( 'body' ).removeClass( 'cfw-side-cart-open' ).addClass( 'cfw-side-cart-close' );
        jQuery( '.cfw-side-cart-floating-button' ).attr( 'aria-expanded', 'false' );
    }

    processCartUpdates(): void {
        const blockedElements = jQuery( '#cfw-side-cart' );

        blockedElements.block( {
            message: null,
            overlayCSS: {
                background: '#fff',
                opacity: 0.6,
            },
        } );

        const formDataParams = new URLSearchParams();

        const promoCode = DataService.getRuntimeParameter( 'promoCodeToApply' );

        if ( promoCode ) {
            formDataParams.append( 'cfw-promo-code', promoCode );
            DataService.setRuntimeParameter( 'promoCodeToApply', null );
        }

        const items = ( select( DataStores.cart_store_key ) as any ).getCartItems( null );

        // Loop through items array and append to formDataParams
        items.forEach( ( item: CartItemInterface ) => {
            formDataParams.append( `cart[${item.item_key}][qty]`, item.quantity.toString() );
        } );

        const bumps = select( DataStores.cart_store_key ).getOrderBumps( null ) as Bump[];

        if ( bumps.length ) {
            bumps.forEach( ( bump: Bump ) => {
                if ( bump.selected && !bump.variationParent ) {
                    formDataParams.append( `cfw_order_bump[${bump.id}]`, bump.id.toString() );
                }
            } );
        }

        new UpdateSideCart( blockedElements ).load( {
            security: DataService.getCheckoutParam( 'update_side_cart_nonce' ),
            cart_data: formDataParams.toString(),
        } );
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
}

export default SideCart;
