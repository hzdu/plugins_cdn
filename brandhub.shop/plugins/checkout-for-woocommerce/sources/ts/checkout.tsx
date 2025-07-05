import React                                                                                          from 'react';
import { flushSync }                                                                                  from 'react-dom';
import { cfwDomReady, cfwDefineScrollToNotices }                                                      from './_functions';
import TrustBadges                                                                                    from './frontend/Components/TrustBadges';
import DataService                                                                                    from './frontend/Services/DataService';
import LoggingService                                                                                 from './frontend/Services/LoggingService';
import cfwGetWPHooks                                                                                  from './functions/cfwGetWPHooks';
import ShippingMethodReviewPane                                                                       from './frontend/Components/ReviewPane/ShippingMethodReviewPane';
import PaymentMethodReviewPane                                                                        from './frontend/Components/ReviewPane/PaymentMethodReviewPane';
import OrderReviewStepReviewPane                                                                      from './frontend/Components/ReviewPane/OrderReviewStepReviewPane';
import cfwRenderComponentIfElementExists                                                              from './functions/cfwRenderComponentIfElementExists';
import UpdateCheckoutService                                                                          from './frontend/Services/UpdateCheckoutService';
import TabService                                                                                     from './frontend/Services/TabService';
import ChromeAutocompleteBugService                                                                   from './frontend/Services/ChromeAutocompleteBugService';
import AddressInternationalizationService                                                             from './frontend/Services/AddressInternationalizationService';
import AccountValidation                                                                              from './frontend/AccountValidation';
import ValidationService                                                                              from './frontend/Services/ValidationService';
import cfwValidateShippingTab                                                                         from './functions/cfwValidateShippingTab';
import cfwValidatePaymentTab                                                                          from './functions/cfwValidatePaymentTab';
import BillingAddressSyncService                                                                      from './frontend/Services/BillingAddressSyncService';
import FieldPersistenceService                                                                        from './frontend/Services/FieldPersistenceService';
import ParsleyService                                                                                 from './frontend/Services/ParsleyService';
import ZipAutocompleteService                                                                         from './frontend/Services/ZipAutocompleteService';
import GoogleAddressAutocompleteService                                                               from './frontend/Services/GoogleAddressAutocompleteService';
import SeparateAddressLine1Fields                                                                     from './frontend/Components/SeparateAddressLine1Fields';
import FetchifyAddressAutocompleteService                                                             from './frontend/Services/FetchifyAddressAutocompleteService';
import SmartyStreetsAddressValidationService                                                          from './frontend/Services/SmartyStreetsAddressValidationService';
import CompleteOrderService                                                                           from './frontend/Services/CompleteOrderService';
import PaymentGatewaysService                                                                         from './frontend/Services/PaymentGatewaysService';
import AlertService                                                                                   from './frontend/Services/AlertService';
import TooltipService                                                                                 from './frontend/Services/TooltipService';
import OrderReviewStepService                                                                         from './frontend/Services/OrderReviewStepService';
import InternationalPhoneFieldService                                                                 from './frontend/Services/InternationalPhoneFieldService';
import PreventEnterSubmit                                                                             from './frontend/Components/PreventEnterSubmit';
import Accordion                                                                                      from './frontend/Components/Accordion';
import LoginForm                                                                                      from './frontend/Components/LoginForm';
import FormField                                                                                      from './frontend/Components/FormField';
import Coupons                                                                                        from './frontend/Components/Coupons';
import TermsAndConditions                                                                             from './frontend/Components/TermsAndConditions';
import PaymentRequestButtons                                                                          from './frontend/Components/PaymentRequestButtons';
import AddableFields                                                                                  from './frontend/Components/AddableFields';
import FullName                                                                                       from './frontend/Components/FullName';
import Pickup                                                                                         from './frontend/Features/Pickup';
import AmazonPay                                                                                      from './frontend/Compatibility/Gateways/AmazonPay';
import AmazonPayLegacy                                                                                from './frontend/Compatibility/Gateways/AmazonPayLegacy';
import AmazonPayV1                                                                                    from './frontend/Compatibility/Gateways/AmazonPayV1';
import Braintree                                                                                      from './frontend/Compatibility/Gateways/Braintree';
import BraintreeForWooCommerce                                                                        from './frontend/Compatibility/Gateways/BraintreeForWooCommerce';
import CO2OK                                                                                          from './frontend/Compatibility/Plugins/CO2OK';
import EUVatNumber                                                                                    from './frontend/Compatibility/Plugins/EUVatNumber';
import KlarnaCheckout                                                                                 from './frontend/Compatibility/Gateways/KlarnaCheckout';
import KlarnaPayments                                                                                 from './frontend/Compatibility/Gateways/KlarnaPayments';
import MondialRelay                                                                                   from './frontend/Compatibility/Plugins/MondialRelay';
import NIFPortugal                                                                                    from './frontend/Compatibility/Plugins/NIFPortugal';
import NLPostcodeChecker                                                                              from './frontend/Compatibility/Plugins/NLPostcodeChecker';
import OrderDeliveryDate                                                                              from './frontend/Compatibility/Plugins/OrderDeliveryDate';
import PayPalForWooCommerce                                                                           from './frontend/Compatibility/Gateways/PayPalForWooCommerce';
import PayPalPlusCw                                                                                   from './frontend/Compatibility/Gateways/PayPalPlusCw';
import PortugalVaspKios                                                                               from './frontend/Compatibility/Plugins/PortugalVaspKios';
import PostNL                                                                                         from './frontend/Compatibility/Plugins/PostNL';
import SendCloud                                                                                      from './frontend/Compatibility/Plugins/SendCloud';
import ShipMondo                                                                                      from './frontend/Compatibility/Plugins/ShipMondo';
import Square                                                                                         from './frontend/Compatibility/Gateways/Square';
import Stripe                                                                                         from './frontend/Compatibility/Gateways/Stripe';
import WCPont                                                                                         from './frontend/Compatibility/Plugins/WCPont';
import WooCommerceAddressValidation                                                                   from './frontend/Compatibility/Plugins/WooCommerceAddressValidation';
import WooCommerceGermanized                                                                          from './frontend/Compatibility/Plugins/WooCommerceGermanized';
import WooCommerceGiftCards                                                                           from './frontend/Compatibility/Plugins/WooCommerceGiftCards';
import WooFunnelsOrderBumps                                                                           from './frontend/Compatibility/Plugins/WooFunnelsOrderBumps';
import WooSquarePro                                                                                   from './frontend/Compatibility/Gateways/WooSquarePro';
import WooCommercePensoPay                                                                            from './frontend/Compatibility/Gateways/WooCommercePensoPay';
import MyShipper                                                                                      from './frontend/Compatibility/Plugins/MyShipper';
import ExtraCheckoutFieldsBrazil                                                                      from './frontend/Compatibility/Plugins/ExtraCheckoutFieldsBrazil';
import NMI                                                                                            from './frontend/Compatibility/Gateways/NMI';
import PaymentPluginsPayPal                                                                           from './frontend/Compatibility/Gateways/PaymentPluginsPayPal';
import Mercado                                                                                        from './frontend/Compatibility/Gateways/Mercado';
import cfwAddOverlay                                                                                  from './functions/cfwAddOverlay';
import CartTotals                                                                                     from './frontend/Components/CartTotals';
import MobileOrderTotal                                                                               from './frontend/Components/MobileOrderTotal';
import CartTotalsReview                                                                               from './frontend/Components/CartTotalsReview';
import OwnID                                                                                          from './frontend/Compatibility/Plugins/OwnID';
import OrderBumpsList                                                                                 from './components/OrderBumpsList';
import { bumpLocations, BumpLocation }                                                                from './Types/BumpTypes';
import DataStores                                                                                     from './frontend/DataStores';
import StorePoliciesList                                                                              from './frontend/Components/StorePoliciesList';
import ComponentMappingInterface                                                                      from './interfaces/ComponentMappingInterface';
import AfterCheckoutBumps                                                                             from './frontend/Components/AfterCheckoutBumps';
import LoginFormModal                                                                                 from './frontend/Components/LoginFormModal';
import LostPasswordModal                                                                              from './frontend/Components/LostPasswordModal';
import SmartyStreetsModal                                                                             from './frontend/Components/SmartyStreetsModal';
import PromoFieldControl                                                                              from './frontend/Components/PromoFieldControl';
import ShippingPackages                                                                               from './frontend/Components/ShippingPackages';
import Mollie                                                                                         from './frontend/Compatibility/Gateways/Mollie';
import WooCommercePayments                                                                            from './frontend/Compatibility/Gateways/WooCommercePayments';
import CheckoutCartTable                                                                              from './frontend/Components/CheckoutCartTable';
import YITHDeliveryDate                                                                               from './frontend/Compatibility/Plugins/YITHDeliveryDate';

const hasSeparateAddress1Fields = DataService.getSetting( 'enable_separate_address_1_fields' );

// Google Places library may load before dom
( window as any ).cfw_google_maps_loaded = function () {
    if ( hasSeparateAddress1Fields ) {
        return;
    }

    new GoogleAddressAutocompleteService( ParsleyService.instance );
};

cfwDomReady( () => {
    ( window as any ).cfwGetWPHooks = cfwGetWPHooks;

    // Allow users to add their own Typescript Compatibility classes
    jQuery( document ).trigger( 'cfw_checkout_before_load' );
    LoggingService.logEvent( 'Fired cfw_checkout_before_load event.' );

    // Init runtime params
    DataService.initRunTimeParams();
    DataService.checkoutForm = jQuery( 'form.checkout' );

    // Shims for WC native checkout object - used by some gateways in CompleteOrderService
    ( window as any ).wc_checkout_form = {
        updateTimer: false,
        dirtyInput: false,
        selectedPaymentMethod: false,
        xhr: false,
        $order_review: null,
        $checkout_form: DataService.checkoutForm,
        init() {
            LoggingService.logNotice( 'Function called on wc_checkout_form shim object: init' );
        },
        init_payment_methods() {
            LoggingService.logNotice( 'Function called on wc_checkout_form shim object: init_payment_methods' );
        },
        get_payment_method() {
            return null;
        },
        payment_method_selected() {
            LoggingService.logNotice( 'Function called on wc_checkout_form shim object: payment_method_selected' );
        },
        toggle_create_account() {
            LoggingService.logNotice( 'Function called on wc_checkout_form shim object: toggle_create_account' );
        },
        init_checkout() {
            LoggingService.logNotice( 'Function called on wc_checkout_form shim object: init_checkout' );
        },
        maybe_input_changed() {
            LoggingService.logNotice( 'Function called on wc_checkout_form shim object: maybe_input_changed' );
        },
        input_changed() {
            LoggingService.logNotice( 'Function called on wc_checkout_form shim object: input_changed' );
        },
        queue_update_checkout() {
            UpdateCheckoutService.queueUpdateCheckout();
        },
        trigger_update_checkout( event ) {
            jQuery( document.body ).trigger( 'update_checkout', { current_target: event ? event.currentTarget : null } );
        },
        maybe_update_checkout() {
            UpdateCheckoutService.maybeUpdateCheckout();
        },
        ship_to_different_address() {},
        reset_update_checkout_timer() {
            UpdateCheckoutService.resetUpdateCheckoutTimer();
        },
        is_valid_json( rawJSON ) {
            try {
                const json = JSON.parse( rawJSON );

                return ( json && typeof json === 'object' );
            } catch ( e ) {
                return false;
            }
        },
        validate_field() {
            LoggingService.logNotice( 'Function called on wc_checkout_form shim object: validate_field' );
        },
        update_checkout() {
            UpdateCheckoutService.maybeUpdateCheckout();
        },
        update_checkout_action() {
            UpdateCheckoutService.triggerUpdateCheckout();
        },
        handleUnloadEvent() {
            LoggingService.logNotice( 'Function called on wc_checkout_form shim object: handleUnloadEvent' );
        },
        attachUnloadEventsOnSubmit() {
            LoggingService.logNotice( 'Function called on wc_checkout_form shim object: attachUnloadEventsOnSubmit' );
        },
        detachUnloadEventsOnSubmit() {
            LoggingService.logNotice( 'Function called on wc_checkout_form shim object: detachUnloadEventsOnSubmit' );
        },
        blockOnSubmit() {
            cfwAddOverlay();
        },
        submitOrder() {
            cfwAddOverlay();
        },
        submit() {
            UpdateCheckoutService.resetUpdateCheckoutTimer();
            CompleteOrderService.completeOrderSubmitHandler();
        },
        submit_error( errorMessage ) {
            jQuery( document.body ).trigger( 'checkout_error', [ errorMessage ] );
        },
        scroll_to_notices() {
            cfwDefineScrollToNotices();
        },
    };

    // Init data stores
    DataStores.init();

    cfwDefineScrollToNotices();

    // Load React components
    const componentMappings: ComponentMappingInterface[] = [
        { id: 'cfw-trust-badges', component: <TrustBadges /> },
        { id: 'cfw-mobile-cart-table', component: <CheckoutCartTable /> },
        { id: 'cfw-cart', component: <CheckoutCartTable /> },
        { id: 'cfw-cart-summary-coupons', component: <PromoFieldControl location={'checkout_cart_summary'} /> },
        { id: 'cfw-coupons-mobile', component: <PromoFieldControl /> },
        { id: 'cfw-mobile-cart-coupons', component: <PromoFieldControl /> },
        { id: 'cfw-mobile-cart-summary-totals', component: <CartTotals /> },
        { id: 'cfw-cart-summary-totals', component: <CartTotals /> },
        { id: 'cfw-mobile-totals', component: <CartTotals /> },
        { id: 'cfw-review-order-totals', component: <CartTotalsReview /> },
        { id: 'cfw-mobile-total', component: <MobileOrderTotal /> },
        { id: 'cfw-shipping-method-review-pane', component: <ShippingMethodReviewPane /> },
        { id: 'cfw-payment-method-review-pane', component: <PaymentMethodReviewPane /> },
        { id: 'cfw-order-review-step-review-pane', component: <OrderReviewStepReviewPane /> },
        { id: 'cfw_bumps_mobile_output', component: <OrderBumpsList locations={[ 'below_cart_items', 'below_checkout_cart_items' ]} containerClass={'cfw-order-bumps-mobile'} /> },
        { id: 'cfw-store-policies-container', component: <StorePoliciesList policies={DataService.getSetting( 'store_policies' )} /> },
        { id: 'cfw_after_checkout_bumps_root', component: <AfterCheckoutBumps /> },
        { id: 'cfw_login_modal', component: <LoginFormModal /> },
        { id: 'cfw_lost_password_container', component: <LostPasswordModal /> },
        { id: 'cfw_smartystreets_confirm_modal_container', component: <SmartyStreetsModal /> },
        { id: 'cfw-shipping-packages-container', component: <ShippingPackages /> },
    ];

    Object.keys( bumpLocations ).forEach( ( location: BumpLocation ) => {
        componentMappings.push( { id: `cfw_bumps_${location}`, component: <OrderBumpsList locations={[ location ]} /> } );
    } );

    componentMappings.forEach( ( { id, component, condition = true } ) => {
        if ( id === 'cfw-shipping-packages-container' ) {
            flushSync( () => {
                cfwRenderComponentIfElementExists( id, component, condition );
            } );
        } else {
            cfwRenderComponentIfElementExists( id, component, condition );
        }
    } );

    // Init static services
    TabService.load();
    UpdateCheckoutService.load();

    if ( TabService.tabsLoaded ) {
        // Only relevant on tabbed pages
        new ChromeAutocompleteBugService();
    }

    AddressInternationalizationService.load();

    // Setup the validation service - has to happen after tabs are setup
    AccountValidation.load();

    ValidationService.load();
    ValidationService.addValidatorFactory( 'cfw-customer-info', AccountValidation.getValidatorFactory() );
    ValidationService.addValidatorFactory( 'cfw-shipping-method', cfwValidateShippingTab );
    ValidationService.addValidatorFactory( 'cfw-payment-method', cfwValidatePaymentTab );

    BillingAddressSyncService.load();
    FieldPersistenceService.load();
    ParsleyService.instance.load();
    ZipAutocompleteService.load( ParsleyService.instance );

    if ( hasSeparateAddress1Fields ) {
        new SeparateAddressLine1Fields().setupListeners();
    }

    if ( DataService.getSetting( 'enable_fetchify_address_autocomplete' ) ) {
        new FetchifyAddressAutocompleteService( ParsleyService.instance );
    }

    if ( DataService.getSetting( 'enable_smartystreets_integration' ) ) {
        new SmartyStreetsAddressValidationService( DataService.getSetting( 'needs_shipping_address' ) ? 'shipping_' : 'billing_' );
    }

    new CompleteOrderService();
    new PaymentGatewaysService();
    new AlertService();
    new TooltipService();
    new OrderReviewStepService();
    new InternationalPhoneFieldService();

    /**
     * Components
     */
    new PreventEnterSubmit();
    new Accordion();
    new LoginForm();
    new FormField();
    new Coupons();
    new TermsAndConditions();
    new PaymentRequestButtons();
    new AddableFields();
    new FullName();

    /**
     * Features
     */
    new Pickup();

    [
        new AmazonPay(),
        new AmazonPayLegacy(),
        new AmazonPayV1(),
        new Braintree(),
        new BraintreeForWooCommerce(),
        new CO2OK(),
        new EUVatNumber(),
        new KlarnaCheckout(),
        new KlarnaPayments(),
        new MondialRelay(),
        new NIFPortugal(),
        new NLPostcodeChecker(),
        new OrderDeliveryDate(),
        new PayPalForWooCommerce(),
        new PayPalPlusCw(),
        new PortugalVaspKios(),
        new PostNL(),
        new SendCloud(),
        new ShipMondo(),
        new Square(),
        new Stripe(),
        new WCPont(),
        new WooCommerceAddressValidation(),
        new WooCommerceGermanized(),
        new WooCommerceGiftCards(),
        new WooFunnelsOrderBumps(),
        new WooSquarePro(),
        new WooCommercePensoPay(),
        new MyShipper(),
        new ExtraCheckoutFieldsBrazil(),
        new NMI(),
        new PaymentPluginsPayPal(),
        new Mercado(),
        new OwnID(),
        new Mollie(),
        new WooCommercePayments(),
        new YITHDeliveryDate(),
    ].forEach( ( compat ) => compat.maybeLoad() );

    // Init checkout ( WooCommerce native event )
    jQuery( document.body ).trigger( 'init_checkout' );
    LoggingService.logEvent( 'Fired init_checkout event.' );

    jQuery( document.body ).on( 'cfw-add-overlay', () => {
        cfwAddOverlay();
    } );

    jQuery( document.body ).on( 'cfw-remove-overlay', () => {
        DataService.checkoutForm.unblock();
    } );

    jQuery( document.body ).on( 'cfw_order_bump_variation_added_to_cart', ( e ) => {
        UpdateCheckoutService.queueUpdateCheckout( e, {
            update_shipping_method: false,
        } );
    } );

    jQuery( document.body ).on( 'cfw_cart_item_variation_edited', ( e ) => {
        UpdateCheckoutService.queueUpdateCheckout( e, {
            update_shipping_method: false,
        } );
    } );

    const expandCart = jQuery( '#cfw-expand-cart' );

    jQuery( '#cfw-mobile-cart-header' ).on( 'click', ( e ) => {
        e.preventDefault();
        jQuery( '#cfw-cart-summary-content' ).slideToggle( 300 );
        expandCart.toggleClass( 'active' );
    } );

    jQuery( document.body ).on( 'cfw-after-tab-change', () => {
        if ( expandCart.hasClass( 'active' ) ) {
            jQuery( '#cfw-cart-summary-content' ).slideUp( 300 );
            expandCart.removeClass( 'active' );
        }
    } );

    jQuery( window ).on( 'load', () => {
        // Remove the animation blocker
        jQuery( document.body ).removeClass( 'cfw-preload' );

        jQuery( '#wpadminbar' ).appendTo( 'html' );

        // Give plugins a chance to react to our hidden, invisible shim checkbox
        jQuery( '#ship-to-different-address-checkbox' ).trigger( 'change' );
    } );
} );
