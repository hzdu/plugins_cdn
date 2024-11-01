import React, { useEffect, useState }                  from 'react';
import { Modal }                                       from 'react-responsive-modal';
import Cookies                                         from 'js-cookie';
import DataService                                     from '../Services/DataService';
import cfwAjaxLogin                                    from '../../functions/cfwAjaxLogin';

const LoginFormModal: React.FC = () => {
    const [ isModalOpen, setIsModalOpen ] = useState( false );
    const [ content, setContent ] = useState( '' );
    const [ id ] = useState( () => `component-${Math.random().toString( 16 ).slice( 2 )}` );

    const openModal = () => {
        setContent( DataService.getData( 'login_form' ) );
        setIsModalOpen( true );
    };

    const closeModal = () => {
        setIsModalOpen( false );

        if ( DataService.getSetting( 'is_registration_required' ) ) {
            return;
        }

        // Don't bug user for 7 days if they already opened the modal
        Cookies.set( 'cfw_login_modal_shown', 'true', { expires: 7 } );
    };

    const autoOpen = () => {
        if ( !DataService.getSetting( 'is_login_at_checkout_allowed' ) ) {
            return;
        }

        // If the user already saw the login nag, don't show it again
        if ( Cookies.get( 'cfw_login_modal_shown' ) === 'true' && !DataService.getSetting( 'bypass_login_modal_shown_cookie' ) ) {
            return;
        }

        if ( DataService.getSetting( 'disable_auto_open_login_modal' ) ) {
            return;
        }

        openModal();

        jQuery( document.body ).on( 'cfw_login_modal_open', () => {
            const username = jQuery( '#cfw_login_username' );
            const emailValue = jQuery( '#billing_email' ).val();

            if ( emailValue !== '' ) {
                username.val( emailValue );

                setTimeout( () => {
                    jQuery( '#cfw_login_password' ).trigger( 'focus' );
                }, 200 );
            }
        } );
    };

    const loginSubmit = ( event: { preventDefault: () => void; } ) => {
        event.preventDefault();

        if ( !jQuery( '#cfw_login_modal_form' ).parsley().validate() ) {
            return false;
        }

        const username = jQuery( '#cfw_login_username' ).val() as string;
        const password = jQuery( '#cfw_login_password' ).val() as string;

        const allInputs          = jQuery( '#cfw_login_modal_form :input' );
        const otherInputElements = allInputs.not( '#cfw_login_username, #cfw_login_password, #cfw-login-btn' ).toArray() as Array<HTMLInputElement>;
        const namesToValues      = otherInputElements.map( ( input ) => [ input.name, jQuery( input ).val() ] );
        const otherInputs        = Object.fromEntries( namesToValues ) as Record<string, string>;

        cfwAjaxLogin( username, password, otherInputs );
        return false;
    };

    useEffect( () => {
        // Account exists listener (once)
        jQuery( document.body ).on( 'cfw_account_exists', autoOpen.bind( this )  );

        // Click listener (always)
        jQuery( document.body ).on( `click.${id}`, '.showlogin, #cfw-login-modal-trigger', ( e ) => {
            e.preventDefault();

            openModal();

            return false;
        } );

        // Close click listener
        jQuery( document.body ).on( `click.${id}`, '#cfw_login_modal_close', ( e ) => {
            e.preventDefault();

            closeModal();
        } );

        // Close event handler
        jQuery( document.body ).on( 'cfw_login_modal_close', closeModal );

        // Login form submit handler
        jQuery( document.body ).on( `click.${id}`, '#cfw-login-btn', loginSubmit  );

        return () => {
            jQuery( document.body ).off( `click.${id}` );
            jQuery( document.body ).off( 'cfw_login_modal_close' );
        };
    }, [] );

    useEffect( () => {
        const loginForm = jQuery( `.${id} #cfw_login_modal_form` );

        loginForm.parsley( {
            errorsContainer( parsleyElement ) {
                return parsleyElement.$element.parents( '.cfw-input-wrap' );
            },
        } );
    }, [ content ] );

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

                        jQuery( document.body ).trigger( 'cfw_login_modal_open' );
                    }}
                    focusTrapped={false}
                >
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                </Modal>
            )}
        </>
    );
};

export default LoginFormModal;
