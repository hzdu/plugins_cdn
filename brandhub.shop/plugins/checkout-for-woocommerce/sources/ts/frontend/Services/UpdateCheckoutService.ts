import { select, subscribe }           from '@wordpress/data';
import UpdateCheckoutAction            from '../Actions/UpdateCheckoutAction';
import DataService                     from './DataService';
import LoggingService                  from './LoggingService';
import TabService                      from './TabService';
import CartItemInterface               from '../../interfaces/CartItemInterface';
import DataStores                      from '../DataStores';
import { Bump }                        from '../../Types/BumpTypes';

class UpdateCheckoutService {
    protected static timer: any;

    static load(): void {
        UpdateCheckoutService.setUpdateCheckoutTriggers();
    }

    static queueUpdateCheckout( e?, args? ): true {
        const keyCode = e?.keyCode ?? e?.which;

        if ( keyCode === 9 ) {
            return true;
        }

        UpdateCheckoutService.resetUpdateCheckoutTimer();
        jQuery( document.body ).trigger( 'cfw_queue_update_checkout' );
        LoggingService.logEvent( 'Fired cfw_queue_update_checkout event.' );

        UpdateCheckoutService.timer = window.setTimeout( UpdateCheckoutService.maybeUpdateCheckout, 1000, args );

        return true;
    }

    /**
     * All update_checkout triggers should happen here
     *
     * Exceptions would be edge cases involving TS compat classes
     */
    static setUpdateCheckoutTriggers(): void {
        // WooCommerce Core listens for both update and update_checkout
        jQuery( document.body ).on( 'update update_checkout', ( e, args ) => UpdateCheckoutService.maybeUpdateCheckout( args ) );

        const { checkoutForm } = DataService;

        const selectors = [
            '[name="bill_to_different_address"]',
            '.update_totals_on_change select',
            '.update_totals_on_change input[type="radio"]',
            '.update_totals_on_change input[type="checkbox"]',
            '.address-field select',
            '.address-field input.input-text',
            '.update_totals_on_change input.input-text',
            '#wc_checkout_add_ons :input',
            'input.update_totals_on_change',
        ];

        checkoutForm.on( 'change', selectors.join( ', ' ), UpdateCheckoutService.maybeUpdateCheckout );

        // Maybe update checkout on billing email change
        // - If ACR is enabled, always update
        // - If one-page checkout is enabled and ACR is not enabled - don't do it
        checkoutForm.on( 'change', '#billing_email', () => {
            if ( DataService.getSetting( 'enable_one_page_checkout' ) && !DataService.getSetting( 'enable_acr' ) ) {
                return;
            }

            UpdateCheckoutService.maybeUpdateCheckout();
        } );

        // The below line matches the WooCommerce core update_checkout trigger
        // But aren't using it because it's overly aggressive and causes errors that pull the customer out of context for slow typists
        // checkoutForm.on( 'keydown', '.address-field input.input-text, .update_totals_on_change input.input-text', UpdateCheckoutService.queueUpdateCheckout.bind( this ) );

        jQuery( document.body ).on( 'init_checkout', UpdateCheckoutService.maybeUpdateCheckout );

        /**
         * Special Case: Order Review tab
         *
         * This clears any errors and ensures that information is up to date
         */
        jQuery( document.body ).on( 'cfw-after-tab-change', () => {
            const currentTab = TabService.getCurrentTab();

            if ( currentTab.attr( 'id' ) === TabService.orderReviewTabId ) {
                UpdateCheckoutService.queueUpdateCheckout();
            }
        } );

        /**
         * Special case: User logged in, and we need to make sure the name updates
         */
        if ( DataService.getSetting( 'user_logged_in' ) ) {
            jQuery( document.body ).on( 'cfw-after-tab-change', ( e ) => {
                const currentTab = TabService.getCurrentTab();

                if ( currentTab.attr( 'id' ) === TabService.shippingMethodTabId ) {
                    UpdateCheckoutService.maybeUpdateCheckout( {
                        block_ui_selector: '.cfw-review-pane',
                    } );
                }
            } );
        }

        // Allow non-data based updates to the cart
        jQuery( document.body ).on( 'cfw_update_cart', () => {
            UpdateCheckoutService.maybeUpdateCheckout( {
                update_shipping_method: false,
            } );
        } );

        // Subscribe to changes in the store
        subscribe( () => {
            // Check if an AJAX update is needed
            if ( DataService.getRuntimeParameter( 'needsAjaxUpdate' ) ) {
                UpdateCheckoutService.maybeUpdateCheckout( {
                    update_shipping_method: DataService.getRuntimeParameter( 'updateSelectedShippingMethods' ) ?? false,
                } );
            }
        }, DataStores.cart_store_key );
    }

    /**
     * reset the update checkout timer (stop iteration)
     */
    static resetUpdateCheckoutTimer(): void {
        clearTimeout( UpdateCheckoutService.timer );
    }

    static maybeUpdateCheckout( args?: any ): void {
        UpdateCheckoutService.resetUpdateCheckoutTimer();

        if ( ( <any>window ).cfw_update_payment_method_request_xhr && typeof ( <any>window ).cfw_update_payment_method_request_xhr.abort === 'function' ) {
            ( <any>window ).cfw_update_payment_method_request_xhr.abort();
        }

        UpdateCheckoutService.timer =  window.setTimeout( UpdateCheckoutService.triggerUpdateCheckout, 5, args );
    }

    /**
     * Call update_checkout
     *
     * This should be the ONLY place we call this ourselves
     */
    static triggerUpdateCheckout( args? ): void {
        if ( DataService.getSetting( 'is_checkout_pay_page' ) ) {
            return;
        }

        const theArgs = typeof args !== 'undefined' ? args : {
            update_shipping_method: true,
        };

        new UpdateCheckoutAction().load( UpdateCheckoutService.getData( theArgs ), theArgs );
    }

    /**
     * Call updated_checkout
     *
     * This should be the ONLY place we call this ourselves
     */
    static triggerUpdatedCheckout( data? ): void {
        if ( typeof data === 'undefined' ) {
            // If this is running in the dark, we need
            // to shim in fragments because some plugins
            // ( like WooCommerce Smart Coupons ) expect it
            // eslint-disable-next-line no-param-reassign
            data = { fragments: {} };
        }

        requestAnimationFrame( () => {
            jQuery( document.body ).trigger( 'updated_checkout', [ data ] );
            LoggingService.logEvent( 'Fired updated_checkout event.' );
        } );
    }

    /**
     * @param args
     */
    static getData( args? ): Record<string, unknown> {
        /* eslint-disable camelcase */
        const { checkoutForm } = DataService;
        const billToDifferentAddress = jQuery( '[name="bill_to_different_address"]:checked' ).val() as string;
        const requiredShippingAddressFieldInputs         = checkoutForm.find( '.woocommerce-shipping-fields .address-field.validate-required:visible' );
        let has_full_address  = true;

        const billing_email = jQuery( '#billing_email' ).val();
        let s_company     = jQuery( '#shipping_company' ).val();
        let s_country     = jQuery( '#shipping_country' ).val();
        let s_state       = jQuery( '#shipping_state' ).val();
        let s_postcode    = jQuery( ':input#shipping_postcode' ).val();
        let s_city        = jQuery( '#shipping_city' ).val();
        let s_address     = jQuery( ':input#shipping_address_1' ).val();
        let s_address_2   = jQuery( ':input#shipping_address_2' ).val();
        let company         = s_company;
        let country         = s_country;
        let state           = s_state;
        let postcode        = s_postcode;
        let city            = s_city;
        let address         = s_address;
        let address_2       = s_address_2;

        if ( billToDifferentAddress !== 'same_as_shipping' ) {
            company   = jQuery( '#billing_company' ).val();
            country   = jQuery( '#billing_country' ).val();
            state     = jQuery( '#billing_state' ).val();
            postcode  = jQuery( ':input#billing_postcode' ).val();
            city      = jQuery( '#billing_city' ).val();
            address   = jQuery( ':input#billing_address_1' ).val();
            address_2 = jQuery( ':input#billing_address_2' ).val();
        }

        // WooCommerce core reverses the order it sets fields, so if billing address is forced we need to reverse it back
        if ( DataService.getSetting( 'ship_to_billing_address_only' ) !== false ) {
            s_company   = company;
            s_country   = country;
            s_state     = state;
            s_postcode  = postcode;
            s_city      = city;
            s_address   = address;
            s_address_2 = address_2;
        }

        if ( requiredShippingAddressFieldInputs.length ) {
            // eslint-disable-next-line func-names
            requiredShippingAddressFieldInputs.each( function () {
                if ( jQuery( this ).find( ':input' ).val() === '' ) {
                    has_full_address = false;
                }
            } );
        }

        const formDataParams = new URLSearchParams( checkoutForm.serialize() );

        if ( DataService.getRuntimeParameter( 'updateCartItems' ) ) {
            const items = ( select( DataStores.cart_store_key ) as any ).getCartItems();

            // Loop through items array and append to formDataParams
            items.forEach( ( item: CartItemInterface ) => {
                formDataParams.append( `cart[${item.item_key}][qty]`, item.quantity.toString() );
            } );

            DataService.setRuntimeParameter( 'updateCartItems', false );
        }

        const bumps = select( DataStores.cart_store_key ).getOrderBumps( null ) as Bump[];

        if ( bumps.length ) {
            bumps.forEach( ( bump: Bump ) => {
                if ( bump.selected && !bump.variationParent ) {
                    formDataParams.append( `cfw_order_bump[${bump.id}]`, bump.id.toString() );
                }
            } );
        }

        const promoCode = DataService.getRuntimeParameter( 'promoCodeToApply' );

        if ( promoCode ) {
            formDataParams.append( 'coupon_code', promoCode );
            DataService.setRuntimeParameter( 'promoCodeToApply', null );
        }

        const data = {
            security: DataService.getCheckoutParam( 'update_order_review_nonce' ),
            payment_method: checkoutForm.find( 'input[name="payment_method"]:checked' ).val(),
            billing_email, // has to be here or the field isn't accessible through WC()->checkout()->get_value()
            company,
            country,
            state,
            postcode,
            city,
            address,
            address_2,
            s_company,
            s_country,
            s_state,
            s_postcode,
            s_city,
            s_address,
            s_address_2,
            has_full_address,
            bill_to_different_address: billToDifferentAddress,
            post_data: formDataParams.toString(),
            shipping_method: undefined,
            cfw: true,
        };

        if ( typeof args !== 'undefined' && typeof args.update_shipping_method !== 'undefined' && args.update_shipping_method !== false ) {
            const shipping_methods = {};
            const shippingData = ( select( DataStores.cart_store_key ) as any ).getShippingData();

            if ( shippingData ) {
                shippingData.forEach( ( shippingPackage: any ) => {
                    shipping_methods[ shippingPackage.index ] = shippingPackage.chosenMethod;
                } );
            }

            data.shipping_method = shipping_methods;
        }

        return data;
    }

    static haveQuantitiesChanged = ( items1: CartItemInterface[], items2: CartItemInterface[] ): boolean => {
        if ( items1.length !== items2.length ) {
            return true; // Different number of items, so something has changed
        }

        for ( let i = 0; i < items1.length; i++ ) {
            if ( items1[ i ].quantity !== items2[ i ].quantity ) {
                return true; // Quantity has changed for this item
            }
        }

        return false; // No changes in quantities
    };
}

export default UpdateCheckoutService;
