import Alert        from '../frontend/Components/Alert';
import AlertService from '../frontend/Services/AlertService';
import DataService  from '../frontend/Services/DataService';

export default function cfwValidateTab( tab: string ): Promise<any> {
    return new Promise<void>( ( resolve, reject ) => {
        jQuery( `${tab} .validate-required:visible` ).each( ( i, el ) => {
            const container = jQuery( el );
            const field = container.find( ':input' ).not( '[data-parsley-group]' );

            if ( !field.length || field.val() !== '' ) {
                return; // continue
            }

            if ( field.is( '.iti__search-input, .iti__selected-country' ) ) {
                return; // special international phone field handling
            }

            // If field doesn't have label, look for TH
            let label = container.find( 'label' ).text() || container.closest( 'td' ).siblings( 'th' ).text();
            label = label.replace( '*', '' );
            label = label.trim();

            const template = DataService.getMessage( 'generic_field_validation_error_message' );
            const message = template.replace( '%s', label );

            AlertService.queueAlert( new Alert( 'error', message ) );
            AlertService.showAlerts();

            reject( new Error( 'CheckoutWC: A non-parsley required field was detected to be invalid.' ) );
        } );

        resolve();
    } );
}
