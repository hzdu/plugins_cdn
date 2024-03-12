import React, { useEffect, useState }                  from 'react';
import { Modal }                                       from '@wordpress/components';

const SmartyStreetsModal: React.FC = () => {
    const [ isModalOpen, setIsModalOpen ] = React.useState( false );
    const [ content, setContent ] = React.useState( '' );
    const [ id ] = useState( () => `component-${Math.random().toString( 16 ).slice( 2 )}` );

    const openModal = ( e, form: string ) => {
        setContent( form );
        setIsModalOpen( true );
    };

    const closeModal = () => {
        setIsModalOpen( false );
    };

    useEffect( () => {
        jQuery( document.body ).on( 'cfw_smarty_streets_modal_open', openModal );
        jQuery( document.body ).on( 'cfw_smarty_streets_modal_close', closeModal );
    }, [] );

    return (
        <>
            {isModalOpen && (
                <Modal
                    title={''}
                    __experimentalHideHeader={true}
                    onRequestClose={() => closeModal()}
                    className={`cfw-modal checkoutwc cfw-grid smarty-modal ${id}`}
                >
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                </Modal>
            )}
        </>
    );
};

export default SmartyStreetsModal;
