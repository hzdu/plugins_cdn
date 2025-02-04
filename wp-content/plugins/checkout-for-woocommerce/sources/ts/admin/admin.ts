import swal                    from 'sweetalert2/dist/sweetalert2';
import { cfwDomReady }         from '../_functions';
import SettingsExporterButton  from './Components/SettingsExporterButton';
import SettingsImporterButton  from './Components/SettingsImporterButton';

// eslint-disable-next-line camelcase
declare const cfw_sendwp_remote_install: any;
// eslint-disable-next-line camelcase
declare const cfw_acr_preview: any;
// eslint-disable-next-line camelcase
declare const objectiv_cfw_admin: any;

cfwDomReady( () => {
    /**
     * Unload Handler
     */
    let changed = false;
    const beforeUnloadHandler = ( event ) => {
        if ( changed ) {
            event.preventDefault();
            event.returnValue = ( <any>window ).objectiv_cfw_admin.i18n_nav_warning;
        }
    };

    const fieldChangedHandler = () => {
        jQuery( '#cfw_admin_header_save_button' ).removeClass( 'cfw-save-inactive' );

        changed = true;
    };

    jQuery( document.body ).on( 'input keydown', '.cfw-admin-section-component-content', fieldChangedHandler );
    jQuery( document.body ).on( 'cfw_admin_field_changed', fieldChangedHandler );

    window.addEventListener( 'beforeunload', beforeUnloadHandler );

    jQuery( document.body ).on( 'click', '.cfw_admin_page_submit, #submit, #publish #cfw-activation-control input', () => {
        window.removeEventListener( 'beforeunload', beforeUnloadHandler );
    } );

    /**
     * Settings Export / Import
     */
    new SettingsExporterButton( '#export_settings_button' );
    new SettingsImporterButton( '#import_settings_button' );

    // Enable Select2
    jQuery( document.body ).trigger( 'wc-enhanced-select-init' );

    const activateAndUpdateLicense = ( e ) => {
        const key = jQuery( '#cfw_license_key' ).val().toString().trim();

        if ( key.length !== 32 ) {
            return;
        }

        const licenseContentDiv = jQuery( '#step-1-activate-your-license_content' );

        licenseContentDiv.block( {
            message: null,
            overlayCSS: {
                background: '#fff',
                opacity: 0.4,
            },
        } );

        jQuery.ajax( {
            type: 'POST',
            url: ( <any>window ).objectiv_cfw_admin.ajax_url,
            data: {
                action: 'cfw_license_save',
                key,
                refresh_only: e.target.id === 'cfw-admin-refresh-license',
                nonce: ( <any>window ).objectiv_cfw_admin.nonce,
            },
            success( response ) {
                if ( response.success === false ) {
                    return;
                }

                if ( response.fragments ) {
                    jQuery.each( response.fragments, ( selector: any, value ) => {
                        if ( typeof value === 'string' ) {
                            jQuery( selector ).replaceWith( value );
                        }
                    } );
                }

                jQuery( '#cfw_admin_header_save_button' ).addClass( 'cfw-save-inactive' );
            },
            complete() {
                licenseContentDiv.unblock();
            },
            dataType: 'json',
            cache: false,
        } );
    };

    jQuery( document.body ).on( 'click', '#cfw-admin-refresh-license', activateAndUpdateLicense );
    jQuery( document.body ).on( 'input', '#cfw_license_key', activateAndUpdateLicense  );

    jQuery( document.body ).on( 'click', '#cfw_admin_header_save_button', ( e ) => {
        e.preventDefault();
        jQuery( '.cfw_admin_page_submit' ).trigger( 'click' );
    } );

    jQuery( document.body ).on( 'click', '#cfw_reset_stats', ( e ) => {
        swal.fire( {
            title: 'Confirm',
            text: 'Are you sure you want to reset your conversion statistics for this Order Bump? This cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, reset!',
            confirmButtonColor: '#4e9ae0',
            customClass: {
                container: 'cfw-swal-container',
            },
        } ).then( ( result ) => {
            if ( !result.isConfirmed ) {
                jQuery( e.currentTarget ).prop( 'checked', false );
            }
        } );
    } );

    jQuery( document.body ).on( 'click', '#cfw_sendwp_install_button', ( e ) => {
        cfw_sendwp_remote_install();
    } );

    jQuery( document.body ).on( 'click', '#cfw_send_preview_button', ( e ) => {
        e.preventDefault();

        const email_address = jQuery( '#cfw_send_preview' ).val();
        const email_id = jQuery( '#post_ID' ).val();

        if ( email_address === '' ) {
            alert( 'Please enter an email address.' );
            return;
        }

        const data = {
            action: 'cfw_acr_preview_email_send',
            email_address,
            email_id,
            security: cfw_acr_preview.nonce,
            dataType: 'json',
        };

        jQuery.post( objectiv_cfw_admin.ajax_url, data, ( response ) => {
            // handle the response from wp_send_json_success
            if ( response.success ) {
                alert( 'Email sent successfully.' );
            } else {
                alert( response.data );
            }
        } );
    } );

    jQuery( '#cfw-delete-acr-carts' ).on( 'click', ( e ) => {
        // eslint-disable-next-line no-restricted-globals
        const confirmation = confirm( 'Are you sure you want to clear all tracked carts and reset all recovery statistics? This cannot be undone.' );
        if ( !confirmation ) {
            e.preventDefault();
        }
    } );
} );
