import DataService from './DataService';
import cfwAjax     from '../../functions/cfwAjax';

class LoggingService {
    static logError( message: string, extraData: unknown = null ): void {
        LoggingService.log( `${message} ⚠️`, true, extraData );

        cfwAjax( 'cfw_log_error', {
            type: 'POST',
            data: {
                log_data: {
                    message,
                    ...( typeof extraData === 'object' && extraData !== null ? extraData : {
                        extraData,
                    } ),
                },
            },
            dataType: 'json',
            cache: false,
        } );
    }

    static logNotice( message: string, object: unknown = null ): void {
        LoggingService.log( `${message} ℹ️`, false, object );
    }

    static logEvent( message: string, object: unknown = null ): void {
        LoggingService.log( `${message} 🔈`, false, object );
    }

    static log( message: string, force = false, object: unknown = null ): void {
        if ( force || DataService.getCheckoutParam( 'cfw_debug_mode' ) ) {
            // eslint-disable-next-line no-console
            console.log( `CheckoutWC: ${message}` );

            if ( object ) {
                // eslint-disable-next-line no-console
                console.log( object );
            }
        }
    }
}

export default LoggingService;
