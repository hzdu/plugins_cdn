import React, { useEffect, useState }                  from 'react';
import { Modal }                                       from 'react-responsive-modal';

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
                    open={true}
                    onClose={() => closeModal()}
                    classNames={{
                        root: 'cfw-modal-root',
                        overlay: 'cfw-modal-overlay',
                        modal: `cfw-modal checkoutwc cfw-grid smarty-modal ${id}`,
                        modalContainer: 'cfw-modal-container',
                    }}
                    showCloseIcon={false}
                    focusTrapped={false}
                >
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                </Modal>
            )}
        </>
    );
};

export default SmartyStreetsModal;
