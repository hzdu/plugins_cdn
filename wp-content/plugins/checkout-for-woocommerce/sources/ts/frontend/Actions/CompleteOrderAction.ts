import Alert                 from '../Components/Alert';
import AlertService          from '../Services/AlertService';
import DataService           from '../Services/DataService';
import LoggingService        from '../Services/LoggingService';
import Action                from './Action';
import ParsleyService        from '../Services/ParsleyService';

class CompleteOrderAction extends Action {
    /**
     */
    constructor() {
        super( 'checkout' );

        DataService.checkoutForm.off( 'form:validate' );
    }

    /**
     * Fire the ajax request
     *
     * Duplicate of Action.ts without the noncache parameter - necessary for PostFinance compatibility
     *
     * @param data
     */
    load( data: any ): void {
        const currentTime = new Date();
        const n = currentTime.getTime();
        const url = DataService.getCheckoutParam( 'wc_ajax_url' ).toString().replace( '%%endpoint%%', this.id );

        // ajaxSetup is global, but we use it to ensure JSON is valid once returned.
        jQuery.ajaxSetup( {
            dataFilter( rawResponse, dataType ) {
                let response = rawResponse;

                // We only want to work with JSON
                if ( dataType !== 'json' ) {
                    return rawResponse;
                }

                if ( Action.isValidJSON( response ) ) {
                    return response;
                }
                // Attempt to fix the malformed JSON
                const maybeValidJSON = response.match( /{".*}/ );

                if ( maybeValidJSON === null ) {
                    LoggingService.logError( 'Unable to fix malformed JSON' );
                    LoggingService.logError( 'Response:', response );
                } else if ( Action.isValidJSON( maybeValidJSON[ 0 ] ) ) {
                    LoggingService.logNotice( 'Fixed malformed JSON. Original:', response );
                    // eslint-disable-next-line prefer-destructuring
                    response = maybeValidJSON[ 0 ];
                } else {
                    LoggingService.logError( 'Unable to fix malformed JSON' );
                    LoggingService.logError( 'Response:', response );
                }

                return response;
            },
        } );

        jQuery.ajax( {
            type: 'POST',
            url: `${url}`,
            data,
            success: this.response.bind( this ),
            error: this.error.bind( this ),
            complete: this.complete.bind( this ),
            dataType: 'json',
            cache: false,
        } );
    }

    /**
     * @param resp
     */
    public response( resp: any ): void {
        try {
            if ( resp.result === 'success' && DataService.checkoutForm.triggerHandler( 'checkout_place_order_success', resp ) !== false ) {
                // Fire events that need to run before redirect
                jQuery( document.body ).trigger( 'cfw-order-complete-before-redirect', [ DataService.checkoutForm, resp ] );
                LoggingService.logEvent( 'Fired cfw-order-complete-before-redirect event.' );

                ParsleyService.instance.destroy();

                if ( typeof resp.redirect === 'undefined' ) {
                    // In the unlikely event this happens, assume someone else is handling the redirect for us
                    return;
                }

                if ( resp.redirect.indexOf( 'https://' ) === -1 || resp.redirect.indexOf( 'http://' ) === -1 ) {
                    ( <any>window ).location = resp.redirect;
                } else {
                    ( <any>window ).location = decodeURI( resp.redirect );
                }
            } else if ( resp.result === 'failure' ) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                throw new Error( 'Result failure' );
            } else {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                throw new Error( 'Invalid response' );
            }
        } catch ( err ) {
            jQuery( document.body ).trigger( 'cfw_complete_order_failure' );
            LoggingService.logEvent( 'Fired cfw_complete_order_failure event.' );

            // Reload page
            if ( resp.reload === true ) {
                ( <any>window ).location.reload();
                return;
            }

            if ( typeof resp.messages === 'string' && resp.messages.length ) {
                AlertService.createAlertsFromMessages( resp.messages );
            } else {
                /**
                 * If the payment gateway comes back with no message, show a generic error.
                 */
                const message = DataService.getCheckoutParam( 'i18n_checkout_error' ).toString();
                const rawResponse = JSON.stringify( resp, null, 2 );
                const alert: Alert = new Alert(
                    'error',
                    message,
                );
                AlertService.queueAlert( alert );

                // Console log the error + raw response
                LoggingService.logError( `${message}\n\n${rawResponse}` );
            }

            // Trigger update in case we need a fresh nonce
            if ( resp.refresh === true ) {
                jQuery( document.body ).trigger( 'update_checkout' );
            }

            this.submitError();
        }
    }

    /**
     * Try to fix invalid JSON
     *
     * @param rawResponse
     * @param dataType
     */
    public dataFilter( rawResponse: string, dataType: string ): any {
        // We only want to work with JSON
        if ( dataType !== 'json' ) {
            return rawResponse;
        }

        if ( this.isValidJSON( rawResponse ) ) {
            return rawResponse;
        }

        // Attempt to fix the malformed JSON
        const maybeValidJSON = rawResponse.match( /{"result.*}/ );

        if ( maybeValidJSON === null ) {
            LoggingService.logError( 'Unable to fix malformed JSON' );
            LoggingService.logError( 'Response:', rawResponse );
        } else if ( this.isValidJSON( maybeValidJSON[ 0 ] ) ) {
            LoggingService.logError( 'Fixed malformed JSON. Original:' );
            LoggingService.logError( rawResponse );
            // eslint-disable-next-line no-param-reassign,prefer-destructuring
            rawResponse = maybeValidJSON[ 0 ];
        } else {
            LoggingService.logError( 'Unable to fix malformed JSON' );
            LoggingService.logError( 'Response:', rawResponse );
        }

        return rawResponse;
    }

    public isValidJSON( rawJSON ): boolean {
        try {
            const json = JSON.parse( rawJSON );

            return ( json && typeof json === 'object' );
        } catch ( e ) {
            return false;
        }
    }

    /**
     * @param xhr
     * @param textStatus
     * @param errorThrown
     */
    public error( xhr: any, textStatus: string, errorThrown: string ): void {
        let message: string;

        if ( xhr.status === 0 ) {
            message = 'Could not connect to server. Please refresh and try again or contact site administrator.';
        } else if ( xhr.status === 404 ) {
            message = 'Requested resource could not be found. Please contact site administrator. (404)';
        } else if ( xhr.status === 500 ) {
            message = 'An internal server error occurred. Please contact site administrator. (500)';
        } else if ( textStatus === 'parsererror' ) {
            message = 'Server response could not be parsed. Please contact site administrator.';
        } else if ( textStatus === 'timeout' || xhr.status === 504 ) {
            message = 'The server timed out while processing your request. Please refresh and try again or contact site administrator.';
        } else if ( textStatus === 'abort' ) {
            message = 'Request was aborted. Please contact site administrator.';
        } else {
            message = `Uncaught Error: ${xhr.responseText}`;
        }

        LoggingService.logError( `CheckoutWC XHR response: ${xhr.response}` );
        LoggingService.logError( `CheckoutWC XHR responseText: ${xhr.responseText}` );
        LoggingService.logError( `CheckoutWC XHR status: ${xhr.status}` );
        LoggingService.logError( `CheckoutWC XHR errorThrown: ${errorThrown}` );

        if ( DataService.getCheckoutParam( 'cfw_debug_mode' ) ) {
            // Add response text to message
            message += `<br/>Response text:<pre>${xhr.responseText}</pre>`;
        }

        const alert: Alert = new Alert( 'error', message );
        AlertService.queueAlert( alert );

        this.submitError();
    }

    submitError(): void {
        // Remove processing / unblock it
        DataService.checkoutForm.removeClass( 'processing' ).unblock();

        jQuery( document.body ).trigger( 'checkout_error' );
        LoggingService.logEvent( 'Fired checkout_error event.' );

        AlertService.showAlerts();
    }
}

export default CompleteOrderAction;
