// Three cfw_ to be edited here

function cfw_sendwp_remote_install() {
    const data = {
        action: 'cfw_sendwp_remote_install',
        sendwp_nonce: sendwp_vars.nonce,
    };

    // since 2.8 ajaxurl is always defined in the admin header and points to admin-ajax.php
    jQuery.post( ajaxurl, data, ( response ) => {
        const data = JSON.parse( response );
        // Check for errors before calling cfw_sendwp_register_client()
        if ( data.error === true ) {
            if ( data.debug === '!security' ) {
                jQuery( '#cf-email-settings-ui' ).prepend( `<div class="notice error"><p>${sendwp_vars.security_failed_message}</p></div>` );
            } else if ( data.debug === '!user_capablity' ) {
                jQuery( '#cf-email-settings-ui' ).prepend( `<div class="notice error"><p>${sendwp_vars.user_capability_message}</p></div>` );
            } else if ( data.debug === 'sendwp_connected' ) {
                jQuery( '#cf-email-settings-ui' ).prepend( `<div class="notice error"><p>${sendwp_vars.sendwp_connected_message}</p></div>` );
            }
        } else {
            cfw_sendwp_register_client( data.register_url, data.client_name, data.client_secret, data.client_redirect, data.partner_id, data.client_url );
        }
    } );
}

function cfw_sendwp_register_client( register_url, client_name, client_secret, client_redirect, partner_id, client_url ) {
    const form = document.createElement( 'form' );
    form.setAttribute( 'method', 'POST' );
    form.setAttribute( 'action', register_url );

    function cfw_sendwp_append_form_input( name, value ) {
        const input = document.createElement( 'input' );
        input.setAttribute( 'type', 'hidden' );
        input.setAttribute( 'name', name );
        input.setAttribute( 'value', value );
        form.appendChild( input );
    }

    cfw_sendwp_append_form_input( 'client_name', client_name );
    cfw_sendwp_append_form_input( 'client_secret', client_secret );
    cfw_sendwp_append_form_input( 'partner_id', partner_id );
    cfw_sendwp_append_form_input( 'client_redirect', client_redirect );
    cfw_sendwp_append_form_input( 'client_url', client_url );

    document.body.appendChild( form );
    form.submit();
}
