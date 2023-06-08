import cfwAjax                        from '../../functions/cfwAjax';
import UpdateSideCart                 from '../Actions/UpdateSideCart';
import SuggestedProductAddToCartModal from '../Modals/SuggestedProductAddToCartModal';
import DataService                    from '../Services/DataService';
import CartItemQuantityControl        from './CartItemQuantityControl';

class SideCart {
    constructor() {
        this.setTriggers();
    }

    setTriggers(): void {
        jQuery( document.body ).on( 'submit', '#cfw-side-cart-form', ( e ) => {
            // Prevent enter key from submitting the form
            e.preventDefault();
        } );

        // Prevent enter key on input with id #cfw-promo-code
        jQuery( document.body ).on( 'keydown', '#cfw-promo-code', ( e ) => {
            if ( e.key === 'Enter' ) {
                e.preventDefault();
            }
        } );

        const additionalSideCartTriggerSelectors = DataService.getSetting( 'additional_side_cart_trigger_selectors' );

        if ( additionalSideCartTriggerSelectors ) {
            jQuery( document.body ).on( 'click', additionalSideCartTriggerSelectors, this.openCart.bind( this ) );
        }

        jQuery( document.body ).on( 'click', '.cfw-side-cart-open-trigger, .added_to_cart', this.openCart.bind( this ) );
        jQuery( document.body ).on( 'click', '.menu-item a:has(.cfw-side-cart-open-trigger)', this.openCart.bind( this ) );
        jQuery( document.body ).on( 'click', '.cfw-side-cart-close-trigger, .cfw-side-cart-close-btn, #cfw-side-cart-overlay', this.closeCart.bind( this ) );
        jQuery( document.body ).on( 'added_to_cart', () => {
            if ( !DataService.getSetting( 'disable_side_cart_auto_open' ) ) {
                jQuery( '#cfw_empty_side_cart_message' ).hide();

                this.openCart();

                return;
            }

            if ( !DataService.getSetting( 'enable_floating_cart_button' ) ) {
                return;
            }

            jQuery( document.body  ).on( 'wc_fragments_loaded', () => {
                this.shakeCartButton();
            } );
        } );
        jQuery( document.body ).on( 'click', `a.wc-forward:contains(${DataService.getMessage( 'view_cart' )})`, this.openCart.bind( this ) );
        jQuery( document.body ).on( 'wc_fragments_loaded', this.initializeCart );
        jQuery( document.body ).on( 'click', '.cfw-remove-item-button', this.removeItem.bind( this ) );
        jQuery( document.body ).on( 'cfw_update_cart', this.processCartUpdates.bind( this ) );
        jQuery( document.body ).on( 'cfw_suggested_variable_product_added_to_cart cfw_order_bump_variation_added_to_cart', ( e, resp ) => {
            if ( typeof resp !== 'object' ) {
                // eslint-disable-next-line no-param-reassign
                resp = JSON.parse( resp );
            }

            jQuery( '#cfw_empty_side_cart_message' ).hide();

            jQuery( document.body ).trigger( 'wc_fragment_refresh' );
            jQuery( document.body ).trigger( 'added_to_cart', [ resp.fragments, resp.cart_hash ] );
            jQuery( document.body ).trigger( 'updated_cart_totals' );
        } );

        jQuery( document.body ).on( 'cfw_cart_item_variation_edited', () => {
            jQuery( document.body ).trigger( 'wc_fragment_refresh' );
            jQuery( document.body ).trigger( 'updated_cart_totals' );
        } );

        // Edit variations in cart
        jQuery( document.body ).on( 'click', '.cfw-variation-edit-btn', this.showVariationForm.bind( this ) );

        jQuery( document.body ).on( 'click', '#cfw-promo-code-btn', () => {
            const value = jQuery( '#cfw-promo-code' ).val();
            if ( value !== null && value.toString().length !== 0 ) {
                jQuery( document.body ).trigger( 'cfw_update_cart' );
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
                this.openCart();
            }

            if ( DataService.getRuntimeParameter( 'openCart' ) && DataService.getSetting( 'disable_side_cart_auto_open' ) ) {
                this.shakeCartButton();
            }
        } );

        jQuery( document.body ).on( 'click', '.cfw-show-coupons-module', () => {
            jQuery( '.cfw-promo-wrap' ).slideDown( 300 );
            jQuery( '.cfw-show-coupons-module' ).hide();
        } );

        jQuery( window ).on( 'load wc_fragments_refreshed wc_fragments_loaded', () => {
            // @ts-ignore
            jQuery( '.cfw-suggested-products' ).not( '.slick-initialized' ).slick( {
                dots: true,
                arrows: false,
                rtl: DataService.getCheckoutParam( 'is_rtl' ),
            } );
        } );

        jQuery( document.body ).on( 'click', '.cfw-suggested-product-add-to-cart', ( e ) => {
            e.preventDefault();

            if ( jQuery( e.currentTarget ).data( 'variable' ) ) {
                const apiRoot = ( <any>window ).wpApiSettings.root;
                const url = `${apiRoot}checkoutwc/v1/get-variation-form/${jQuery( e.currentTarget ).data( 'product' )}`;

                jQuery.get( url, ( data ) => {
                    const modal = new SuggestedProductAddToCartModal( data.html ?? 'Could not load product.' );
                    modal.open();
                } );
            } else {
                return cfwAjax( 'cfw_add_to_cart', {
                    type: 'POST',
                    data: {
                        'add-to-cart': jQuery( e.currentTarget ).data( 'product' ),
                    },
                    dataType: 'json',
                    cache: false,
                } ).done(
                    ( resp ) => {
                        jQuery( document.body ).trigger( 'cfw_suggested_variable_product_added_to_cart', [ resp ] );
                    },
                );
            }
        } );
    }

    shakeCartButton(): void {
        jQuery( '#cfw-side-cart-floating-button' ).addClass( 'cfw-shake' );

        setTimeout( () => {
            jQuery( '#cfw-side-cart-floating-button' ).removeClass( 'cfw-shake' );
        }, 850 );
    }

    initializeCart(): void {
        if ( jQuery( '#cfw-side-cart-form' ).hasClass( 'uninitialized' ) ) {
            jQuery( document.body ).trigger( 'wc_fragment_refresh' );
        }
    }

    openCart( e?: Event ): void {
        if ( e ) {
            e.preventDefault();
        }

        jQuery( 'body' ).addClass( 'cfw-side-cart-open' ).removeClass( 'cfw-side-cart-close' );
        jQuery( '.cfw-side-cart-floating-button' ).attr( 'aria-expanded', 'true' );
    }

    closeCart( e?: Event ): void {
        if ( e ) {
            e.preventDefault();
        }
        jQuery( 'body' ).removeClass( 'cfw-side-cart-open' ).addClass( 'cfw-side-cart-close' );
        jQuery( '.cfw-side-cart-floating-button' ).attr( 'aria-expanded', 'false' );
    }

    removeItem( event: Event ): void {
        event.preventDefault();

        const inputElement = jQuery( event.currentTarget ).parents( '.cart-item-row' ).find( '.cfw-edit-item-quantity-value' );

        if ( inputElement ) {
            inputElement.val( 0 );

            CartItemQuantityControl.triggerCartUpdate( inputElement );
        }
    }

    processCartUpdates( event: any, element?: JQuery ): void {
        let blockedElements = jQuery( '#cfw-side-cart' );

        if ( element ) {
            blockedElements = jQuery( element ).parents( '.cart-item-row' ).find( 'td, th' );
        }

        blockedElements.block( {
            message: null,
            overlayCSS: {
                background: '#fff',
                opacity: 0.6,
            },
        } );

        new UpdateSideCart( blockedElements ).load( {
            security: DataService.getCheckoutParam( 'update_side_cart_nonce' ),
            cart_data: jQuery( '#cfw-side-cart-form' ).serialize(),
        } );
    }

    showVariationForm( event: Event ): void {
        const url = DataService.getCheckoutParam( 'wc_ajax_url' ).toString().replace( '%%endpoint%%', 'cfw_get_variation_form' );
        // Get form from AJAX request and inject into adjacent div with cfw-variation-form class
        jQuery( event.currentTarget ).siblings( '.cfw-variation-form' ).load( `${url}&key=${jQuery( event.currentTarget ).data( 'item' )}` );
    }
}

export default SideCart;
