import { dispatch }                     from '@wordpress/data';
import DataService                      from '../Services/DataService';
import LoggingService                   from '../Services/LoggingService';
import DataStores                       from '../DataStores';
import CartItemInterface                from '../../interfaces/CartItemInterface';
import { CartTotalsData }               from '../../interfaces/CartTotalInterface';
import Actions                          from '../../Types/Actions';
import ReviewPaneDataInterface          from '../Interfaces/ReviewPaneDataInterface';
import { Bump }                         from '../../Types/BumpTypes';
import SideCartData                     from '../../interfaces/SideCartData';
import { ShippingPackageInterface }     from '../../interfaces/ShippingPackageInterface';

interface UpdateDataInterface {
    cart?: {
        needsPayment?: boolean;
        items?: CartItemInterface[];
        totals?: CartTotalsData;
        actions?: Actions;
        notices?: string;
        shipping: ShippingPackageInterface[],
    };
    side_cart?: SideCartData;
    review?: ReviewPaneDataInterface;
    bumps?: Bump[];
}

/**
 * Base class for our ajax handling. Child classes will extend this and override the response function and implement their
 * own custom solutions for the php side of actions
 */
abstract class Action {
    /**
     * @type {string}
     * @private
     */
    protected id: string;

    /**
     * @param id
     */
    protected constructor( id: string ) {
        this.id = id;

        LoggingService.log( `Running ${this.id} action. ☄️` );
        jQuery( document.body ).trigger( `cfw_pre_${this.id}_action` );
    }

    /**
     * Fire the ajax request
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
            url: `${url}&nocache=${n}`,
            data,
            success: this.response.bind( this ),
            error: this.error.bind( this ),
            complete: this.complete.bind( this ),
            dataType: 'json',
            cache: false,
        } );
    }

    static isValidJSON( rawJSON: string ): boolean {
        try {
            const json = JSON.parse( rawJSON );

            return ( json && typeof json === 'object' );
        } catch ( e ) {
            return false;
        }
    }

    /**
     * Our ajax response handler. Overridden in child classes
     * @param resp
     */
    abstract response( resp: any ): void;

    /**
     * Our ajax error handler. Overridden in child classes
     * @param xhr
     * @param textStatus
     * @param errorThrown
     */
    error( xhr: any, textStatus: string, errorThrown: string ): void {
        if ( textStatus !== 'abort' ) {
            LoggingService.logError( `${this.constructor.name} Error: ${errorThrown} (${textStatus}` );
        }
    }

    /**
     * Updates data store with data from AJAX response
     *
     * Does NOT update actions store
     */
    static updateDataStore( data: UpdateDataInterface, updateActions = false ) {
        // Reset the AJAX update flag to prevent a recursive loop
        DataService.setRuntimeParameter( 'needsAjaxUpdate', false );

        if ( !data ) {
            return;
        }

        if ( data.cart?.needsPayment ) {
            ( dispatch( DataStores.cart_store_key ) as any ).setCartNeedsPayment( data.cart.needsPayment as boolean );
        }

        if ( data.cart?.items ) {
            ( dispatch( DataStores.cart_store_key ) as any ).setCartItems( data.cart.items as CartItemInterface[] );
        }

        /**
         * Don't update actions by default because plugins don't expect actions to be updated from the server
         * unless they are part of a fragment, in which case they are updated by the fragment
         *
         * Actions are only updated by default on page load from CartStore.ts
         */
        if ( updateActions && data.cart?.actions ) {
            ( dispatch( DataStores.cart_store_key ) as any ).setCartActions( data.cart.actions as Actions );
        }

        if ( data.cart?.totals ) {
            ( dispatch( DataStores.cart_store_key ) as any ).setCartTotals( data.cart.totals as CartTotalsData );
        }

        if ( data.cart?.notices ) {
            ( dispatch( DataStores.cart_store_key ) as any ).setCartNotices( data.cart.notices );
        }

        if ( data.cart.shipping ) {
            ( dispatch( DataStores.cart_store_key ) as any ).setShippingData( data.cart.shipping as ShippingPackageInterface[] );
        }

        if ( data.review ) {
            ( dispatch( DataStores.cart_store_key ) as any ).setReviewData( data.review as ReviewPaneDataInterface );
        }

        if ( data.side_cart ) {
            ( dispatch( DataStores.cart_store_key ) as any ).setSideCartData( data.side_cart as SideCartData );
        }

        if ( data.bumps ) {
            ( dispatch( DataStores.cart_store_key ) as any ).setOrderBumps( data.bumps as Bump[] );
        }
    }

    complete( xhr: any, textStatus: string ): void {}
}

export default Action;
