import { Md5 }          from 'ts-md5';
import Alert            from '../Components/Alert';

const debounce = require( 'debounce' );

type alertQueue = Array<Alert>;
type queuesList = Record<string, alertQueue>;

class AlertService {
    private static alertContainer: JQuery<HTMLElement>;

    private static queues: queuesList = {};

    private static debouncedScrollToNotices;

    private static debouncedShowAlerts;

    /**
     * @type {boolean}
     * @private
     */
    public static preserveAlerts = false;

    constructor( alertContainer: JQuery<HTMLElement> ) {
        AlertService.alertContainer = alertContainer;

        AlertService.debouncedScrollToNotices = debounce( AlertService.scrollToNotices, 200 );
        AlertService.debouncedShowAlerts = debounce( AlertService.showAlerts, 200 );

        jQuery( document.body ).on( 'updated_checkout', () => {
            AlertService.showAlerts();
        } );

        jQuery( document.body ).on( 'cfw_checkout_place_order_event_returned_false', () => {
            AlertService.showAlerts();
        } );
    }

    public static scrollToNotices(): void {
        // Scroll to the top of the alert container
        jQuery.scroll_to_notices( AlertService.alertContainer );
    }

    public static queueAlert( alert: Alert, queue = 'default' ): void {
        if ( !AlertService.queues[ queue ] ) {
            AlertService.queues[ queue ] = [];
        }

        AlertService.queues[ queue ].push( alert );
    }

    public static showAlerts( queue = 'default', container: string = null ): void {
        AlertService.removeTemporaryAlerts( container );

        // If we don't have any alerts to show, let's bail here
        if ( !AlertService.queues[ queue ] || AlertService.queues[ queue ].length === 0 ) {
            return;
        }

        // Unless alerts should be preserved, let's hide them here
        // Then only new or duplicated alerts will be shown
        if ( !AlertService.preserveAlerts ) {
            AlertService.hideAlerts( container );
        }

        const containerElement = container ? jQuery( container ) : AlertService.alertContainer;

        AlertService.queues[ queue ].forEach( ( alert ) => {
            const alertElement = AlertService.getOrBuildAlert( alert.type, alert.message, alert.cssClass );

            alertElement.toggleClass( 'cfw-alert-temporary', alert.temporary );
            alertElement.appendTo( containerElement );
        } );

        AlertService.alertContainer.slideDown( 300 );
        ( AlertService.debouncedScrollToNotices )();

        AlertService.queues[ queue ] = [];

        if ( AlertService.preserveAlerts ) {
            AlertService.preserveAlerts = false;
        }
    }

    private static buildAlert( id: string, message: string, cssClass: string ): string {
        return `<div id="${id}" class="cfw-alert ${cssClass}"><div class="message">${message}</div></div>`;
    }

    public static getOrBuildAlert( type: string, message: string, cssClass: string ): JQuery<HTMLElement> {
        const hash = Md5.hashStr( message + cssClass + type );
        const id = AlertService.getAlertId( hash );
        const existingAlert = jQuery( `#${id}` );

        if ( existingAlert.length > 0 ) {
            existingAlert.show();

            if ( type === 'error' ) {
                existingAlert.addClass( 'cfw-alert-temporary-shake' );

                setTimeout( () => {
                    existingAlert.removeClass( 'cfw-alert-temporary-shake' );
                }, 500 );
            }

            return existingAlert;
        }

        return jQuery( AlertService.buildAlert( id, message, `${cssClass} ${hash}` ) );
    }

    private static getAlertId( hash: string ): string {
        return `cfw-alert-${hash}`;
    }

    public static hideAlerts( container: string = null ): void {
        const containerElement = container ? jQuery( container ) : AlertService.alertContainer;
        containerElement.find( '.cfw-alert' ).hide();
    }

    public static removeTemporaryAlerts( container: string = null ): void {
        const containerElement = container ? jQuery( container ) : AlertService.alertContainer;
        containerElement.find( '.cfw-alert-temporary' ).hide();
    }

    public static createAlertsFromMessages( messages: string, extraClasses: string = null ): boolean {
        let foundSuccessMessage = false; // used by coupon handler

        // Wrapping the response in a <div /> is required for correct parsing
        const wrappedMessages = jQuery( jQuery.parseHTML( `<div>${messages}</div>` ) );

        // Errors
        const woocommerceErrorMessages = wrappedMessages.find( 'ul.woocommerce-error li, div.woocommerce-error, div.wc-block-components-notice-banner.is-error .wc-block-components-notice-banner__content' );

        jQuery.each( woocommerceErrorMessages, ( i, el ) => {
            const alert: Alert = new Alert( 'error', jQuery( el ).html().trim(), `cfw-alert-error ${extraClasses}` );
            AlertService.queueAlert( alert );
        } );

        // Info
        const wooCommerceInfoMessages = wrappedMessages.find( 'ul.woocommerce-info li, div.woocommerce-info, div.wc-block-components-notice-banner.is-info .wc-block-components-notice-banner__content' );

        jQuery.each( wooCommerceInfoMessages, ( i, el ) => {
            const alert: Alert = new Alert( 'notice', jQuery( el ).html().trim(), `cfw-alert-info ${extraClasses}` );
            AlertService.queueAlert( alert );
        } );

        // Messages
        const wooCommerceMessages = wrappedMessages.find( 'ul.woocommerce-message li, div.woocommerce-message, div.wc-block-components-notice-banner.is-success .wc-block-components-notice-banner__content' );

        jQuery.each( wooCommerceMessages, ( i, el ) => {
            const alert: Alert = new Alert( 'success', jQuery( el ).html().trim(), `cfw-alert-success ${extraClasses}` );
            AlertService.queueAlert( alert );

            foundSuccessMessage = true;
        } );

        // EveryPay doesn't understand WooCommerce, so fix it for them
        if ( messages.indexOf( '<script' ) !== -1 ) {
            jQuery( document.body ).prepend( `<div style="display:none">${messages}</div>` );
        }

        return foundSuccessMessage;
    }
}

export default AlertService;
