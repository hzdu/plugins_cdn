import React, { useState } from 'react';
import apiFetch            from '@wordpress/api-fetch';
import { Modal }           from '@wordpress/components';
import LoggingService      from '../Services/LoggingService';

const StorePoliciesList = ( { policies } ) => {
    const [ isModalOpen, setIsModalOpen ] = useState( false );
    const [ modalContent, setModalContent ] = useState( '' );
    const [ modalTitle, setModalTitle ] = useState( '' );

    const openModal = ( policyId, title ) => {
        apiFetch( { path: `/wp/v2/pages/${policyId}` } ) // Adjust the API path according to your setup
            .then( ( response: any ) => {
                setModalTitle( title );
                setModalContent( response.content?.rendered ?? '' );
                setIsModalOpen( true );
            } )
            .catch( ( error ) => {
                LoggingService.logError( 'Error fetching policy content:', error );
                setModalTitle( title );
                setModalContent( 'Could not load policy content' );
                setIsModalOpen( true );
            } );
    };

    if ( !policies || !policies.length ) {
        return ( <></> );
    }

    return (
        <>
            <ul className="cfw-store-policies">
                {policies.map( ( policy ) => (
                    <li key={policy.page.id}>
                        <a href="#"
                            onClick={( e ) => {
                                e.preventDefault();
                                openModal( policy.page.id, policy.title );
                            }}
                        >
                            {policy.title}
                        </a>
                    </li>
                ) )}
            </ul>
            {isModalOpen && (
                <Modal
                    title={modalTitle}
                    onRequestClose={() => setIsModalOpen( false )}
                >
                    <div dangerouslySetInnerHTML={{ __html: modalContent }} />
                </Modal>
            )}
        </>
    );
};

export default StorePoliciesList;
