import { cfwDomReady, cfwDefineScrollToNotices }       from './_functions';
import Accordion                                       from './frontend/Components/Accordion';
import StorePolicyModals                               from './frontend/Components/StorePolicyModals';
import TermsAndConditions                              from './frontend/Components/TermsAndConditions';
import AddressInternationalizationService              from './frontend/Services/AddressInternationalizationService';
import AlertService                                    from './frontend/Services/AlertService';
import DataService                                     from './frontend/Services/DataService';
import LoggingService                                  from './frontend/Services/LoggingService';
import PaymentGatewaysService                          from './frontend/Services/PaymentGatewaysService';

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
            new StorePolicyModals();

            // Alert Service
            const alertContainer = DataService.getElement( 'alertContainerId' );

            if ( alertContainer ) {
                AlertService.preserveAlerts = true;
                new AlertService( alertContainer );
            }

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

            // Init checkout ( WooCommerce native event )
            jQuery( document.body ).trigger( 'init_checkout' );
            LoggingService.logEvent( 'Fired init_checkout event.' );

            jQuery( window ).on( 'load', () => {
                jQuery( '#wpadminbar' ).appendTo( 'html' );

                // Remove the animation blocker
                jQuery( document.body ).removeClass( 'cfw-preload' );
            } );
        } );
    }
}

new OrderPay();
