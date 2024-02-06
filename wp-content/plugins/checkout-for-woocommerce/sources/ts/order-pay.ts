import { cfwDomReady, cfwDefineScrollToNotices }       from './_functions';
import Accordion                                       from './frontend/Components/Accordion';
import StorePolicyModals                               from './frontend/Components/StorePolicyModals';
import TermsAndConditions                              from './frontend/Components/TermsAndConditions';
import AddressInternationalizationService              from './frontend/Services/AddressInternationalizationService';
import AlertService                                    from './frontend/Services/AlertService';
import DataService                                     from './frontend/Services/DataService';
import LoggingService                                  from './frontend/Services/LoggingService';
import PaymentGatewaysService                          from './frontend/Services/PaymentGatewaysService';
import cfwGetWPHooks                                   from './functions/cfwGetWPHooks';

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

            ( window as any ).cfwGetWPHooks = cfwGetWPHooks;

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

            if ( typeof ( <any>window ).ownid === 'function' ) {
                jQuery( 'a.cfw-password-toggle' ).css( 'top', '-2px' );
                ( <any>window ).ownid( 'destroy', 'login' );
                ( <any>window ).ownid( 'login', {
                    loginIdField: document.getElementById( 'login' ),
                    passwordField: document.getElementById( 'password' ),
                    onError: ( error ) => {
                        LoggingService.logError( `CheckoutWC: Problem loading OwnID on Order Pay page: ${error}` );
                    },
                    onLogin( data ) {
                        const req = new XMLHttpRequest();
                        req.open( 'POST', '/wp-json/ownid/v1/login-with-jwt', true );
                        req.setRequestHeader( 'Content-type', 'application/x-www-form-urlencoded' );
                        req.onload = function () {
                            // do something to response
                            window.location.reload();
                        };
                        req.send( `jwt=${data.token}` );
                    },
                } );
            }
        } );
    }
}

new OrderPay();
