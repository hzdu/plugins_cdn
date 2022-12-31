import LostPasswordAction from '../Actions/LostPasswordAction';
import LoginForm          from './LoginForm';

class LostPasswordModal {
    constructor() {
        jQuery( '#cfw_lost_password_trigger' ).modaal( {
            before_open() {
                LoginForm.closeModal();
            },
            width: 600,
        } );

        jQuery( document.body ).on( 'submit', '#cfw_lost_password_form', ( e ) => {
            e.preventDefault();

            new LostPasswordAction().load( {
                user_login: jQuery( '#user_login' ).val(),
                'woocommerce-lost-password-nonce': jQuery( '#woocommerce-lost-password-nonce' ).val(),
            } );
        } );

        // Pre-fill lost password form input when billing email is changed
        jQuery( document.body ).on( 'change', '#billing_email', function () {
            jQuery( '#cfw_lost_password_form #user_login' ).val( jQuery( this ).val() );
        } );
    }
}

export default LostPasswordModal;
