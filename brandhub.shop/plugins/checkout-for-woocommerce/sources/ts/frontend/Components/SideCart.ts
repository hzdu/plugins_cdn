import { select, subscribe }                  from '@wordpress/data';
import UpdateSideCart                         from '../Actions/UpdateSideCart';
import DataService                            from '../Services/DataService';
import DataStores                             from '../DataStores';
import CartItemInterface                      from '../../interfaces/CartItemInterface';
import { Bump }                               from '../../Types/BumpTypes';
import Action                                 from '../Actions/Action';
import LoggingService                         from '../Services/LoggingService';

declare let wc_cart_fragments_params: any;

class SideCart {
    constructor() {
        this.setTriggers();
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

        jQuery( document.body ).on( 'click', '.cfw-side-cart-open-trigger, .added_to_cart', SideCart.openCart.bind( this ) );
        jQuery( document.body ).on( 'click', '.menu-item a:has(.cfw-side-cart-open-trigger)', SideCart.openCart.bind( this ) );
        jQuery( document.body ).on( 'click', '.cfw-side-cart-close-trigger, .cfw-side-cart-close-btn, #cfw-side-cart-overlay', SideCart.closeCart.bind( this ) );
        jQuery( document.body ).on( 'added_to_cart', ( e, fragments, hash, button, source ) => {
            if ( !source ) {
                if ( fragments && fragments.cfw_data ) {
                    Action.updateDataStore( fragments.cfw_data );
                }  else {
                    // Workaround - try to get the cart data from the session storage
                    SideCart.tryToGetDataFromLocalStorage();
                }
            }

            if ( !DataService.getSetting( 'disable_side_cart_auto_open' ) ) {
                jQuery( '#cfw_empty_side_cart_message' ).hide();

                SideCart.openCart();

                return;
            }

            if ( !DataService.getSetting( 'enable_floating_cart_button' ) ) {
                return;
            }

            jQuery( document.body  ).on( 'wc_fragments_loaded', () => {
                this.shakeCartButton();
            } );
        } );
        jQuery( document.body ).on( 'click', `a.wc-forward:contains(${DataService.getMessage( 'view_cart' )})`, SideCart.openCart.bind( this ) );
        jQuery( document.body ).on( 'cfw_suggested_variable_product_added_to_cart cfw_order_bump_variation_added_to_cart', ( e, resp ) => {
            if ( typeof resp !== 'object' ) {
                // eslint-disable-next-line no-param-reassign
                resp = JSON.parse( resp );
            }

            if ( resp.data ) {
                Action.updateDataStore( resp.data );
            }

            jQuery( '#cfw_empty_side_cart_message' ).hide();

            jQuery( document.body ).trigger( 'wc_fragment_refresh' );
            jQuery( document.body ).trigger( 'added_to_cart', [ resp.fragments, resp.cart_hash, jQuery( e.target ) ] );
            jQuery( document.body ).trigger( 'updated_cart_totals' );
        } );

        jQuery( document.body ).on( 'cfw_cart_item_variation_edited', ( e, resp ) => {
            jQuery( document.body ).trigger( 'wc_fragment_refresh' );
            jQuery( document.body ).trigger( 'updated_cart_totals' );

            if ( resp.data ) {
                Action.updateDataStore( resp.data );
            }
        } );

        jQuery( window ).on( 'load', () => {
            if (
                window.location.hash === '#cfw-cart'
                || (
                    DataService.getRuntimeParameter( 'openCart' )
                    && !DataService.getSetting( 'disable_side_cart_auto_open' )
                )
            ) {
                SideCart.openCart();
            }

            if ( DataService.getRuntimeParameter( 'openCart' ) && DataService.getSetting( 'disable_side_cart_auto_open' ) ) {
                this.shakeCartButton();
            }
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
            Action.updateDataStore( fragments.cfw_data );
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

    static openCart( e?: Event ): void {
        if ( e ) {
            e.preventDefault();
        }

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
