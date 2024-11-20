import Alert                          from '../Components/Alert';
import AlertService                   from '../Services/AlertService';
import DataService                    from '../Services/DataService';
import LoggingService                 from '../Services/LoggingService';
import TabService                     from '../Services/TabService';
import UpdateCheckoutService          from '../Services/UpdateCheckoutService';
import Action                         from './Action';
import DataStores                     from '../DataStores';

class UpdateCheckoutAction extends Action {
    private static _underlyingRequest: any = null;

    private static _fragments: any = [];

    private blockUISelector: string;

    /**
     * @param fields
     */
    constructor() {
        super( 'update_order_review' );

        this.blockUISelector = '#cfw-billing-methods, .cfw-review-pane, #cfw-cart-summary, #cfw-mobile-cart-summary, #cfw-place-order, #cfw-payment-request-buttons, #cfw-mobile-total, .cfw-order-bumps, #cfw-shipping-packages-container, .cfw-next-tab';
    }

    public load( data: any, args: any = {} ): void {
        this.blockUI( args.block_ui_selector ?? '' );

        if ( UpdateCheckoutAction.underlyingRequest !== null ) {
            UpdateCheckoutAction.underlyingRequest.abort();
        }

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

        UpdateCheckoutAction.underlyingRequest = jQuery.ajax( {
            type: 'POST',
            url: `${url}&nocache=${n}`,
            data,
            success: this.response.bind( this ),
            error: this.error.bind( this ),
            complete: this.complete.bind( this ),
            dataType: 'json',
            cache: false,
        } );
    }

    public blockUI( selector = '' ): void {
        let { blockUISelector } = this;

        if ( selector !== '' ) {
            blockUISelector = selector;
        }

        jQuery( blockUISelector ).addClass( 'cfw-blocked' );
    }

    public unblockUI(): void {
        jQuery( '.cfw-blocked' ).removeClass( 'cfw-blocked' );
    }

    /**
     *
     * @param resp
     */
    public response( resp: any ): void {
        if ( typeof resp !== 'object' ) {
            this.error( false, 'Invalid response', 'Server did not return proper JSON response.' );
            return;
        }

        // Prioritize redirect over reload lest we accidentally disable our own cart_edit_empty_cart_redirect setting
        if ( resp.redirect !== false ) {
            window.location = resp.redirect;
            return;
        }

        if ( resp.reload === true ) {
            ( <any>window ).location.reload();
            return;
        }

        // Fire core WooCommerce event
        if ( resp.applied_coupon.toString().length ) {
            jQuery( document.body ).trigger( 'applied_coupon_in_checkout', [ resp.applied_coupon ] );
        }

        requestAnimationFrame( () => {
            /**
             * Save payment details to a temporary object
             */
            const paymentBoxInputsSelector = '.payment_box :input';
            const paymentBoxInputs =  jQuery( paymentBoxInputsSelector );
            const paymentDetails = {};
            paymentBoxInputs.each( function () {
                const ID = jQuery( this ).attr( 'id' );

                if ( ID ) {
                    if ( jQuery.inArray( jQuery( this ).attr( 'type' ), [ 'checkbox', 'radio' ] ) !== -1 ) {
                        paymentDetails[ ID ] = jQuery( this ).prop( 'checked' );
                    } else {
                        paymentDetails[ ID ] = jQuery( this ).val();
                    }
                }
            } );

            /**
             * Special edge case gateway handling
             */
            try {
                const billingContainerID = '#cfw-billing-methods';
                if ( resp.fragments && resp.fragments[ billingContainerID ] ) {
                    const cachedElement = jQuery( UpdateCheckoutAction._fragments[ billingContainerID ] );
                    const newElement = jQuery( resp.fragments[ billingContainerID ] );

                    // Does our new element contain the total?
                    const children = newElement.find( `[value*='${resp.total}'], [data-gateway*='${resp.total}']` );

                    if ( children ) {
                        children.each( function () {
                            const child = jQuery( this );

                            if ( !child.is( 'input' ) ) {
                                return;
                            }

                            let selector = '';

                            const childName = child.attr( 'name' );

                            if ( childName ) {
                                selector = `[name="${childName}"]`;
                            } else {
                                const className = UpdateCheckoutAction.getGatewayDataClass( child );

                                if ( className ) {
                                    selector = `.${className}`;
                                }
                            }

                            if ( !selector ) {
                                return;
                            }

                            // Remove the matching elements from both copies
                            cachedElement.find( selector ).remove();

                            // Add the new version to the checkout form but remove it first to avoid duplicate elements
                            DataService.checkoutForm.find( selector ).remove();
                            newElement.find( selector ).appendTo( DataService.checkoutForm );

                            // Now remove it from the billing methods container
                            newElement.find( selector ).remove();

                            // Replace the billing container with a version that doesn't have the total containing elements
                            resp.fragments[ billingContainerID ] = newElement.get( 0 ).outerHTML;
                        } );
                    }
                }
            } catch ( e ) {
                LoggingService.logNotice( 'Unable to handle gateway edge case', e );
            }

            /**
             * Update Fragments
             *
             * For our elements as well as those from other plugins
             */
            if ( resp.fragments ) {
                jQuery.each( resp.fragments, ( key: any, value ) => {
                    try {
                        const cachedElement = jQuery( UpdateCheckoutAction._fragments[ key ] );
                        const newElement = jQuery( value );

                        const cachedCleansed = UpdateCheckoutAction.cleanseFragments( cachedElement.html() );
                        const newCleansed = UpdateCheckoutAction.cleanseFragments( newElement.html() );

                        if ( !Object.keys( UpdateCheckoutAction._fragments ).length || cachedCleansed !== newCleansed ) {
                            if ( typeof value === 'string' ) {
                                jQuery( key ).replaceWith( value );
                            }
                        }
                    } catch ( e ) {
                        LoggingService.logError( 'Unable to replace element', { key, value } );
                        LoggingService.logError( e );
                    }
                } );

                UpdateCheckoutAction._fragments = resp.fragments;
            }

            if ( !resp.show_shipping_tab ) {
                jQuery( 'body' ).addClass( 'cfw-hide-shipping' );

                // In case the current tab gets hidden
                if ( TabService.getCurrentTab().is( ':hidden' ) ) {
                    TabService.go( TabService.getCurrentTab().prev().attr( 'id' ) );
                }
            } else {
                jQuery( 'body' ).removeClass( 'cfw-hide-shipping' );
            }

            jQuery( '.cfw-continue-to-payment-btn' ).not( '.cfw-smartystreets-button' ).toggle( resp.has_valid_shipping_method );

            /**
             * Fill in the payment details if possible without overwriting data if set.
             */
            if ( !jQuery.isEmptyObject( paymentDetails ) ) {
                jQuery( paymentBoxInputsSelector ).each( function () {
                    const ID = jQuery( this ).attr( 'id' );
                    const val = jQuery( this ).val();

                    if ( ID ) {
                        if ( jQuery.inArray( jQuery( this ).attr( 'type' ), [ 'checkbox', 'radio' ] ) !== -1 ) {
                            jQuery( this ).prop( 'checked', paymentDetails[ ID ] ).trigger( 'change' );
                        } else if ( val !== null && val.toString().length === 0 ) {
                            jQuery( this ).val( paymentDetails[ ID ] ).trigger( 'change' );
                        }
                    }
                } );
            }

            const alerts = [];

            if ( resp.notices.success ) {
                Object.keys( resp.notices.success ).forEach( ( key: any ) => {
                    alerts.push( new Alert( 'success', resp.notices.success[ key ].notice, null, resp.notices.success[ key ].data.temporary ?? false ) );
                } );
            }

            if ( resp.notices.notice ) {
                Object.keys( resp.notices.notice ).forEach( ( key: any ) => {
                    alerts.push( new Alert( 'notice', resp.notices.notice[ key ].notice, null, resp.notices.notice[ key ].data.temporary ?? false ) );
                } );
            }

            if ( resp.notices.error ) {
                Object.keys( resp.notices.error ).forEach( ( key: any ) => {
                    alerts.push( new Alert( 'error', resp.notices.error[ key ].notice, null, resp.notices.error[ key ].data.temporary ?? false ) );
                } );
            }

            alerts.forEach( ( alert ) => { AlertService.queueAlert( alert ); } );

            // Fire finishing events
            jQuery( document.body ).trigger( 'cfw_pre_updated_checkout', [ resp ] );
            LoggingService.logEvent( 'Fired cfw_pre_updated_checkout event.' );

            if ( resp.data ) {
                // Update the data stores
                DataStores.updateDataStore( resp.data );

                // Update the cart hash - this will trigger a fragment refresh on other tabs
                localStorage.setItem( DataService.getCheckoutParam( 'cart_hash_key' ) as string, resp.cart_hash );
                sessionStorage.setItem( DataService.getCheckoutParam( 'cart_hash_key' ) as string, resp.cart_hash );

                // Blank out the cart creation time so that if they go back to the shop, a fragment refresh will be forced
                sessionStorage.setItem( 'wc_cart_created', '' );
            }

            UpdateCheckoutService.triggerUpdatedCheckout( resp );
        } );
    }

    static getGatewayDataClass( element: JQuery<HTMLElement> ): string {
        const classes = jQuery( element ).attr( 'class' ).split( ' ' );
        for ( let i = 0; i < classes.length; i++ ) {
            if ( classes[ i ].endsWith( '_data' ) ) {
                return classes[ i ];
            }
        }
        return null; // Return null if no such class exists
    }

    /**
     * @param xhr
     * @param textStatus
     * @param errorThrown
     */
    public error( xhr: any, textStatus: string, errorThrown: string ): void {
        if ( textStatus !== 'abort' ) {
            const alert = new Alert( 'error', DataService.getMessage( 'update_checkout_error' ) );
            AlertService.queueAlert( alert );
            AlertService.showAlerts();
        }

        super.error( xhr, textStatus, errorThrown );
    }

    public complete( xhr: any, textStatus: string ): void {
        // We are treating an aborted request as one that will always have a subsequent request
        if ( textStatus !== 'abort' ) {
            this.unblockUI();
        }
    }

    /**
     * Cleanses our beautiful fragments of evil dirty bad stuff
     */
    static cleanseFragments( value: string ) {
        if ( typeof value !== 'string' ) {
            return value;
        }

        return value.replace( /checked='checked' data-order_button_text/g, 'data-order_button_text' )
            .replace( /reveal-content" style="display:none;">/g, 'reveal-content">' )
            .replace( /cfw-radio-reveal-li cfw-active/g, 'cfw-radio-reveal-li' )
            .replace( /cfw-radio-reveal-li ">/g, 'cfw-radio-reveal-li">' )
            .replace( /cfw-radio-reveal-content" >/g, 'cfw-radio-reveal-content">' )
            .replace( /checked='checked'/g, '' )
            .replace( /checked="checked"/g, '' )
            .replace( / /g, '' );
    }

    /**
     * @returns {any}
     */
    static get underlyingRequest(): any {
        return this._underlyingRequest;
    }

    /**
     * @param value
     */
    static set underlyingRequest( value: any ) {
        this._underlyingRequest = value;
    }
}

export default UpdateCheckoutAction;
