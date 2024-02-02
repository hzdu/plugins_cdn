import { cfwDomReady }         from '../_functions';

declare let cfwAdminPluginsScreenData: any;

cfwDomReady( () => {
    const deactivationAnchor = jQuery( 'a#deactivate-checkout-for-woocommerce' );
    deactivationAnchor.addClass( 'cfw-deactivate-link' ); // Fix bug with modaal.js that manifested on WP Engine sites. Ticket: https://secure.helpscout.net/conversation/2326209718/16702?folderId=2454654

    const deactivateUrl = deactivationAnchor.attr( 'href' );

    const modal = deactivationAnchor.modaal( {
        content_source: '#cfw-deactivation-survey',
        hide_close: true,
        is_locked: true,
        custom_class: 'cfw-tw',
    } );

    jQuery( document.body ).on( 'change', '#cfw-deactivation-survey-form input[name="reason"]', ( e ) => {
        // If checked
        if ( jQuery( e.target ).val() === 'other' ) {
            jQuery( '#cfw-deactivation-survey-form #cfw_reason_other' ).show();
        } else {
            jQuery( '#cfw-deactivation-survey-form #cfw_reason_other' ).hide();
        }

        jQuery( '#cfw_deactivate_submit' ).show();
        jQuery( '#cfw_skip_deactivate' ).hide();
    } );

    jQuery( document.body ).on( 'submit', 'form#cfw-deactivation-survey-form', ( e ) => {
        e.preventDefault();

        const formDataArray = jQuery( 'form#cfw-deactivation-survey-form' ).serializeArray();
        const formData = {};

        // Convert the array into an object
        jQuery.each( formDataArray, ( index, field ) => {
            formData[ field.name ] = field.value;
        } );

        jQuery.ajax( {
            type: 'POST',
            url: cfwAdminPluginsScreenData.remote_url,
            beforeSend( xhr ) {
                // Set the custom header
                xhr.setRequestHeader( 'x-api-key', '5fPiyDFwGrnZjiCHnLXAU6CLvLbM5vfOOaAa3xwQ' );
            },
            data: {
                ...formData,
            },
            complete() {
                ( <Location>window.location ).replace( deactivateUrl );
                modal.modaal( 'close' );
            },
        } );
    } );

    jQuery( document.body ).on( 'click', '#cfw_skip_deactivate', ( e ) => {
        e.preventDefault();

        ( <Location>window.location ).replace( deactivateUrl );
    } );

    jQuery( document.body ).on( 'click', '#cfw_skip_deactivate, #cfw_deactivation_survey_close_button', ( e ) => {
        e.preventDefault();

        modal.modaal( 'close' );
    } );
} );
