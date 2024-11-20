import React, { useEffect, useState }                  from 'react';
import { Modal }                                       from 'react-responsive-modal';
import DataService                                     from '../Services/DataService';
import LostPasswordAction                              from '../Actions/LostPasswordAction';

const LostPasswordModal: React.FC = () => {
    const [ isModalOpen, setIsModalOpen ] = React.useState( false );
    const [ content, setContent ] = React.useState( '' );
    const [ id ] = useState( () => `component-${Math.random().toString( 16 ).slice( 2 )}` );

    const openModal = () => {
        setContent( DataService.getData( 'lost_password_form' ) );
        setIsModalOpen( true );
        jQuery( document.body ).trigger( 'cfw_login_modal_close' );
    };

    const closeModal = () => {
        setIsModalOpen( false );
    };

    const onSubmit = ( event: { preventDefault: () => void; } ) => {
        event.preventDefault();

        new LostPasswordAction().load( {
            user_login: jQuery( '#user_login' ).val(),
            'woocommerce-lost-password-nonce': jQuery( '#woocommerce-lost-password-nonce' ).val(),
        } );
    };

    useEffect( () => {
        // Click listener (always)
        jQuery( document.body ).on( `click.${id}`, '#cfw_lost_password_trigger', ( e ) => {
            e.preventDefault();

            openModal();

            return false;
        } );

        jQuery( document.body ).on( 'click', '#cfw-login-alert-container .cfw-alert-error a', ( e ) => {
            e.preventDefault();

            openModal();

            return false;
        } );

        // Lost password form submit handler
        jQuery( document.body ).on( `submit.${id}`, `.${id} #cfw_lost_password_form`, onSubmit );

        return () => {
            jQuery( document.body ).off( `click.${id}` );
            jQuery( document.body ).off( `submit.${id}` );
        };
    }, [] );

    return (
        <>
            {isModalOpen && (
                <Modal
                    open={true}
                    onClose={() => closeModal()}
                    classNames={{
                        root: 'cfw-modal-root',
                        overlay: 'cfw-modal-overlay',
                        modal: `cfw-modal cfw-grid ${id}`,
                        modalContainer: 'cfw-modal-container',
                    }}
                    showCloseIcon={false}
                    onAnimationEnd={() => {
                        if ( content && isModalOpen ) {
                            const tempDiv = document.createElement( 'div' );

                            tempDiv.innerHTML = content;

                            const scripts = tempDiv.querySelectorAll( 'script' );

                            scripts.forEach( ( script ) => {
                                const newScript = document.createElement( 'script' );

                                newScript.type = 'text/javascript';

                                if ( script.src ) {
                                    newScript.src = script.src;
                                    newScript.async = true;
                                } else {
                                    newScript.textContent = script.textContent;
                                }

                                document.body.appendChild( newScript );
                                document.body.removeChild( newScript );
                            } );

                            // Workaround for Cloudflare Turnstile. Once fixed in Cloudflare plugin, remove this
                            document.dispatchEvent( new Event( 'DOMContentLoaded' ) );
                        }
                        jQuery( `.${id} #user_login` ).val( jQuery( '#billing_email' ).val() );
                    }}
                    focusTrapped={false}
                >
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                </Modal>
            )}
        </>
    );
};

export default LostPasswordModal;
