import React, { useEffect, useState }                  from 'react';
import { Modal }                                       from '@wordpress/components';
import DataService                                     from '../Services/DataService';
import LostPasswordAction                              from '../Actions/LostPasswordAction';

const LostPasswordModal: React.FC = () => {
    const [ isModalOpen, setIsModalOpen ] = React.useState( false );
    const [ content, setContent ] = React.useState( '' );
    const [ id ] = useState( () => `component-${Math.random().toString( 16 ).slice( 2 )}` );

    const openModal = () => {
        setContent( DataService.getData( 'lost_password_form' ) );
        setIsModalOpen( true );

        jQuery( `.${id} #user_login` ).val( jQuery( '#billing_email' ).val() );
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
                    title={''}
                    __experimentalHideHeader={true}
                    onRequestClose={() => closeModal()}
                    className={`cfw-modal cfw-grid ${id}`}
                >
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                </Modal>
            )}
        </>
    );
};

export default LostPasswordModal;
