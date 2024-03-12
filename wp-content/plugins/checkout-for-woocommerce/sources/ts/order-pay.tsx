import React                                           from 'react';
import { cfwDomReady, cfwDefineScrollToNotices }       from './_functions';
import Accordion                                       from './frontend/Components/Accordion';
import TermsAndConditions                              from './frontend/Components/TermsAndConditions';
import AddressInternationalizationService              from './frontend/Services/AddressInternationalizationService';
import AlertService                                    from './frontend/Services/AlertService';
import DataService                                     from './frontend/Services/DataService';
import LoggingService                                  from './frontend/Services/LoggingService';
import PaymentGatewaysService                          from './frontend/Services/PaymentGatewaysService';
import cfwGetWPHooks                                   from './functions/cfwGetWPHooks';
import OwnID                                           from './frontend/Compatibility/Plugins/OwnID';
import cfwRenderComponentIfElementExists               from './functions/cfwRenderComponentIfElementExists';
import StorePoliciesList                               from './frontend/Components/StorePoliciesList';
import ComponentMappingInterface                       from './interfaces/ComponentMappingInterface';

// eslint-disable-next-line import/prefer-default-export
class OrderPay {
    constructor() {
        cfwDomReady( () => {
            /**
             * Services
             */
            // Init runtime params
            DataService.initRunTimeParams();

            new AddressInternationalizationService();
            new PaymentGatewaysService();

            ( window as any ).cfwGetWPHooks = cfwGetWPHooks;

            new AlertService();

            /**
             * Components
             */
            // Accordion Component
            new Accordion();

            jQuery( '#cfw-mobile-cart-header' ).on( 'click', ( e ) => {
                e.preventDefault();
                jQuery( '#cfw-cart-summary-content' ).slideToggle( 300 );
                jQuery( '#cfw-expand-cart' ).toggleClass( 'active' );
            } );

            // Load Terms and Conditions Component
            new TermsAndConditions();

            // Payment Gateway Service
            new PaymentGatewaysService();

            // Trigger updated checkout
            jQuery( document.body ).trigger( 'updated_checkout' );

            cfwDefineScrollToNotices();

            // Load React components
            const componentMappings: ComponentMappingInterface[] = [
                { id: 'cfw-store-policies-container', component: <StorePoliciesList policies={DataService.getSetting( 'store_policies' )} /> },
            ];
            componentMappings.forEach( ( { id, component, condition = true } ) => {
                cfwRenderComponentIfElementExists( id, component, condition );
            } );

            // Init checkout ( WooCommerce native event )
            jQuery( document.body ).trigger( 'init_checkout' );
            LoggingService.logEvent( 'Fired init_checkout event.' );

            jQuery( window ).on( 'load', () => {
                jQuery( '#wpadminbar' ).appendTo( 'html' );

                // Remove the animation blocker
                jQuery( document.body ).removeClass( 'cfw-preload' );
            } );

            [
                new OwnID(),
            ].forEach( ( compat ) => compat.maybeLoad() );

            jQuery( document.body ).trigger( 'cfw_order_pay_loaded' );
        } );
    }
}

new OrderPay();
