import React                                                                               from 'react';
import { select }                                                                          from '@wordpress/data';
import { cfwDomReady, cfwDefineScrollToNotices }                                           from './_functions';
import TrustBadges                                                                         from './frontend/Components/TrustBadges';
import DataService                                                                         from './frontend/Services/DataService';
import LoggingService                                                                      from './frontend/Services/LoggingService';
import cfwGetWPHooks                                                                       from './functions/cfwGetWPHooks';
import ShippingMethodReviewPane                                                            from './frontend/Components/ReviewPane/ShippingMethodReviewPane';
import PaymentMethodReviewPane                                                             from './frontend/Components/ReviewPane/PaymentMethodReviewPane';
import OrderReviewStepReviewPane                                                           from './frontend/Components/ReviewPane/OrderReviewStepReviewPane';
import cfwRenderComponentIfElementExists                                                   from './functions/cfwRenderComponentIfElementExists';
import UpdateCheckoutService                                                               from './frontend/Services/UpdateCheckoutService';
import TabService                                                                          from './frontend/Services/TabService';
import ChromeAutocompleteBugService                                                        from './frontend/Services/ChromeAutocompleteBugService';
import AddressInternationalizationService                                                  from './frontend/Services/AddressInternationalizationService';
import AccountValidation                                                                   from './frontend/AccountValidation';
import ValidationService                                                                   from './frontend/Services/ValidationService';
import cfwValidateShippingTab                                                              from './functions/cfwValidateShippingTab';
import cfwValidatePaymentTab                                                               from './functions/cfwValidatePaymentTab';
import BillingAddressSyncService                                                           from './frontend/Services/BillingAddressSyncService';
import FieldPersistenceService                                                             from './frontend/Services/FieldPersistenceService';
import ParsleyService                                                                      from './frontend/Services/ParsleyService';
import ZipAutocompleteService                                                              from './frontend/Services/ZipAutocompleteService';
import GoogleAddressAutocompleteService                                                    from './frontend/Services/GoogleAddressAutocompleteService';
import DiscreetAddressLine1Fields                                                          from './frontend/Components/DiscreetAddressLine1Fields';
import FetchifyAddressAutocompleteService                                                  from './frontend/Services/FetchifyAddressAutocompleteService';
import SmartyStreetsAddressValidationService                                               from './frontend/Services/SmartyStreetsAddressValidationService';
import CompleteOrderService                                                                from './frontend/Services/CompleteOrderService';
import PaymentGatewaysService                                                              from './frontend/Services/PaymentGatewaysService';
import AlertService                                                                        from './frontend/Services/AlertService';
import TooltipService                                                                      from './frontend/Services/TooltipService';
import OrderReviewStepService                                                              from './frontend/Services/OrderReviewStepService';
import InternationalPhoneFieldService                                                      from './frontend/Services/InternationalPhoneFieldService';
import PreventEnterSubmit                                                                  from './frontend/Components/PreventEnterSubmit';
import Accordion                                                                           from './frontend/Components/Accordion';
import LoginForm                                                                           from './frontend/Components/LoginForm';
import FormField                                                                           from './frontend/Components/FormField';
import Coupons                                                                             from './frontend/Components/Coupons';
import TermsAndConditions                                                                  from './frontend/Components/TermsAndConditions';
import PaymentRequestButtons                                                               from './frontend/Components/PaymentRequestButtons';
import AddableFields                                                                       from './frontend/Components/AddableFields';
import FullName                                                                            from './frontend/Components/FullName';
import Pickup                                                                              from './frontend/Features/Pickup';
import AmazonPay                                                                           from './frontend/Compatibility/Gateways/AmazonPay';
import AmazonPayLegacy                                                                     from './frontend/Compatibility/Gateways/AmazonPayLegacy';
import AmazonPayV1                                                                         from './frontend/Compatibility/Gateways/AmazonPayV1';
import Braintree                                                                           from './frontend/Compatibility/Gateways/Braintree';
import BraintreeForWooCommerce                                                             from './frontend/Compatibility/Gateways/BraintreeForWooCommerce';
import CO2OK                                                                               from './frontend/Compatibility/Plugins/CO2OK';
import EUVatNumber                                                                         from './frontend/Compatibility/Plugins/EUVatNumber';
import KlarnaCheckout                                                                      from './frontend/Compatibility/Gateways/KlarnaCheckout';
import KlarnaPayments                                                                      from './frontend/Compatibility/Gateways/KlarnaPayments';
import MondialRelay                                                                        from './frontend/Compatibility/Plugins/MondialRelay';
import NIFPortugal                                                                         from './frontend/Compatibility/Plugins/NIFPortugal';
import NLPostcodeChecker                                                                   from './frontend/Compatibility/Plugins/NLPostcodeChecker';
import OrderDeliveryDate                                                                   from './frontend/Compatibility/Plugins/OrderDeliveryDate';
import PayPalForWooCommerce                                                                from './frontend/Compatibility/Gateways/PayPalForWooCommerce';
import PayPalPlusCw                                                                        from './frontend/Compatibility/Gateways/PayPalPlusCw';
import PortugalVaspKios                                                                    from './frontend/Compatibility/Plugins/PortugalVaspKios';
import PostNL                                                                              from './frontend/Compatibility/Plugins/PostNL';
import SendCloud                                                                           from './frontend/Compatibility/Plugins/SendCloud';
import ShipMondo                                                                           from './frontend/Compatibility/Plugins/ShipMondo';
import Square                                                                              from './frontend/Compatibility/Gateways/Square';
import Stripe                                                                              from './frontend/Compatibility/Gateways/Stripe';
import WCPont                                                                              from './frontend/Compatibility/Plugins/WCPont';
import WooCommerceAddressValidation                                                        from './frontend/Compatibility/Plugins/WooCommerceAddressValidation';
import WooCommerceGermanized                                                               from './frontend/Compatibility/Plugins/WooCommerceGermanized';
import WooCommerceGiftCards                                                                from './frontend/Compatibility/Plugins/WooCommerceGiftCards';
import WooFunnelsOrderBumps                                                                from './frontend/Compatibility/Plugins/WooFunnelsOrderBumps';
import WooSquarePro                                                                        from './frontend/Compatibility/Gateways/WooSquarePro';
import WooCommercePensoPay                                                                 from './frontend/Compatibility/Gateways/WooCommercePensoPay';
import MyShipper                                                                           from './frontend/Compatibility/Plugins/MyShipper';
import ExtraCheckoutFieldsBrazil                                                           from './frontend/Compatibility/Plugins/ExtraCheckoutFieldsBrazil';
import NMI                                                                                 from './frontend/Compatibility/Gateways/NMI';
import PaymentPluginsPayPal                                                                from './frontend/Compatibility/Gateways/PaymentPluginsPayPal';
import Mercado                                                                             from './frontend/Compatibility/Gateways/Mercado';
import cfwAddOverlay                                                                       from './functions/cfwAddOverlay';
import CartTotals                                                                          from './frontend/Components/CartTotals';
import MobileOrderTotal                                                                    from './frontend/Components/MobileOrderTotal';
import CartTotalsReview                                                                    from './frontend/Components/CartTotalsReview';
import OwnID                                                                               from './frontend/Compatibility/Plugins/OwnID';
import OrderBumpsList                                                                      from './components/OrderBumpsList';
import { Bump }                                                                            from './Types/BumpTypes';
import DataStores                                                                          from './frontend/DataStores';
import StorePoliciesList                                                                   from './frontend/Components/StorePoliciesList';
import ComponentMappingInterface                                                           from './interfaces/ComponentMappingInterface';
import AfterCheckoutBumps                                                                  from './frontend/Components/AfterCheckoutBumps';
import LoginFormModal                                                                      from './frontend/Components/LoginFormModal';
import LostPasswordModal                                                                   from './frontend/Components/LostPasswordModal';
import SmartyStreetsModal                                                                  from './frontend/Components/SmartyStreetsModal';
import PromoFieldControl                                                                   from './frontend/Components/PromoFieldControl';
import ShippingPackages                                                                    from './frontend/Components/ShippingPackages';
import Mollie                                                                              from './frontend/Compatibility/Gateways/Mollie';
import WooCommercePayments                                                                 from './frontend/Compatibility/Gateways/WooCommercePayments';
import CheckoutCartTable                                                                   from './frontend/Components/CheckoutCartTable';

cfwDomReady( () => {
    ( window as any ).cfwGetWPHooks = cfwGetWPHooks;

    // Allow users to add their own Typescript Compatibility classes
    jQuery( document ).trigger( 'cfw_checkout_before_load' );
    LoggingService.logEvent( 'Fired cfw_checkout_before_load event.' );

    // Init runtime params
    DataService.initRunTimeParams();
    DataService.checkoutForm = jQuery( 'form.checkout' );

    // Init data stores
    DataStores.init();

    // Get the bumps
    const bumps = select( DataStores.cart_store_key ).getOrderBumps( null ) as Bump[];

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
        { id: 'cfw_bumps_mobile_output', component: <OrderBumpsList locations={[ 'below_cart_items', 'above_terms_and_conditions' ]} containerClass={'cfw-order-bumps-mobile'} /> },
        { id: 'cfw-store-policies-container', component: <StorePoliciesList policies={DataService.getSetting( 'store_policies' )} /> },
        { id: 'cfw_after_checkout_bumps_root', component: <AfterCheckoutBumps /> },
        { id: 'cfw_login_modal', component: <LoginFormModal /> },
        { id: 'cfw_lost_password_container', component: <LostPasswordModal /> },
        { id: 'cfw_smartystreets_confirm_modal_container', component: <SmartyStreetsModal /> },
        { id: 'cfw-shipping-packages-container', component: <ShippingPackages /> },
    ];

    bumps.map( ( bump: Bump ) => {
        componentMappings.push( { id: `cfw_bumps_${bump.location}`, component: <OrderBumpsList locations={[ bump.location ]} /> } );
    } );

    componentMappings.forEach( ( { id, component, condition = true } ) => {
        cfwRenderComponentIfElementExists( id, component, condition );
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

    const hasDiscreetAddress1Fields = DataService.getSetting( 'enable_discreet_address_1_fields' );

    jQuery( document.body ).on( 'cfw_load_google_autocomplete', () => {
        if ( hasDiscreetAddress1Fields ) {
            return;
        }

        new GoogleAddressAutocompleteService( ParsleyService.instance );
    } );

    jQuery( document.body ).trigger( 'cfw_load_google_autocomplete' );

    if ( hasDiscreetAddress1Fields ) {
        new DiscreetAddressLine1Fields().setupListeners();
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
