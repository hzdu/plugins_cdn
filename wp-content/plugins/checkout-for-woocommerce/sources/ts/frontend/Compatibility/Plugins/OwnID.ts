import Compatibility  from '../Compatibility';
import LoggingService from '../../Services/LoggingService';

class OwnID extends Compatibility {
    // Params
    private params: any;

    constructor() {
        super( 'OwnID' );
    }

    load( params ): void {
        this.params = params;

        jQuery( document.body ).on( 'cfw_login_modal_open', this.maybeInitOwnID.bind( this ) );
        jQuery( document.body ).on( 'cfw_order_pay_loaded', this.maybeInitOrderPayOwnID.bind( this ) );
    }

    maybeInitOwnID(): void {
        // Check if ownid function exists
        if ( typeof ( <any>window ).ownid !== 'function' ) {
            return;
        }

        if ( !jQuery( '#cfw_login_username' ).length ) {
            return;
        }

        let loginInfoTooltip = true;

        if ( this.params.loginVariant === 'ownid-auth-button' ) {
            jQuery( '#cfw_login_password' ).hide();
            jQuery( '.cfw-login-modal-footer' ).remove();
            jQuery( '#cfw-login-btn' ).remove();
            jQuery( '.cfw-password-toggle' ).remove();
            loginInfoTooltip = false;
        } else {
            jQuery( '#cfw_login_password_field .woocommerce-input-wrapper' ).css( 'display', 'block' );
        }

        ( <any>window ).ownid( 'destroy', 'login' );
        ( <any>window ).ownid( 'login', {
            variant: this.params.loginVariant,
            language: this.params.language,
            infoTooltip: loginInfoTooltip,
            loginIdField: document.getElementById( 'cfw_login_username' ),
            passwordField: document.getElementById( 'cfw_login_password' ),
            onError: ( error ) => {
                LoggingService.logError( `CheckoutWC: Problem loading OwnID: ${error}` );
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

    maybeInitOrderPayOwnID(): void {
        // Check if ownid function exists
        if ( typeof ( <any>window ).ownid !== 'function' ) {
            return;
        }

        if ( !jQuery( '#username' ).length ) {
            return;
        }

        let loginInfoTooltip = true;

        if ( this.params.loginVariant === 'ownid-auth-button' ) {
            jQuery( '#password' ).hide();
            jQuery( '.login-optional' ).remove();
            jQuery( '.woocommerce-form-login__submit' ).remove();
            jQuery( '.cfw-password-toggle' ).remove();
            loginInfoTooltip = false;
        } else {
            jQuery( '#password_field .woocommerce-input-wrapper' ).css( 'display', 'block' );
            jQuery( '#password_field label' ).remove();
        }

        ( <any>window ).ownid( 'destroy', 'login' );
        ( <any>window ).ownid( 'login', {
            variant: this.params.loginVariant,
            language: this.params.language,
            infoTooltip: loginInfoTooltip,
            loginIdField: document.getElementById( 'username' ),
            passwordField: document.getElementById( 'password' ),
            onError: ( error ) => {
                LoggingService.logError( `CheckoutWC: Problem loading OwnID: ${error}` );
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
}

export default OwnID;
