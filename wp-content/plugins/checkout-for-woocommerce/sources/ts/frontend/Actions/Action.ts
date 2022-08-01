import DataService    from '../Services/DataService';
import LoggingService from '../Services/LoggingService';

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
                } else if ( Action.isValidJSON( maybeValidJSON[ 0 ] ) ) {
                    LoggingService.logNotice( 'Fixed malformed JSON. Original:', response );
                    // eslint-disable-next-line prefer-destructuring
                    response = maybeValidJSON[ 0 ];
                } else {
                    LoggingService.logError( 'Unable to fix malformed JSON' );
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

    complete( xhr: any, textStatus: string ): void {}
}

export default Action;
