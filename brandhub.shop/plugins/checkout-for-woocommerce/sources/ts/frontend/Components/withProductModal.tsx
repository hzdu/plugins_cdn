import React, { useEffect, useState }             from 'react';
import apiFetch                                   from '@wordpress/api-fetch';
import { Modal }                                  from 'react-responsive-modal';
import LoggingService                             from '../Services/LoggingService';
import cfwAjax                                    from '../../functions/cfwAjax';
import jqXHR = JQuery.jqXHR;

const withProductModal = ( WrappedComponent: React.ComponentType, apiUrl: string ) => ( props ) => {
    const [ isModalOpen, setIsModalOpen ] = useState( false );
    const [ content, setContent ] = useState( '' );
    const [ id ] = useState( () => `component-${Math.random().toString( 16 ).slice( 2 )}` );

    const openModal = ( entityId: any, suffix = '' ) => {
        const url = `${apiUrl}/${entityId}${suffix}`;

        apiFetch( { path: url } )
            .then( ( data: any ) => {
                setContent( data.html ?? 'Could not load product' );
                setIsModalOpen( true );
            } )
            .catch( ( error ) => {
                LoggingService.logError( 'Error fetching variation form:', error );
                setContent( 'Could not load product' );
            } );
    };

    const closeModal = () => {
        setIsModalOpen( false );
        jQuery( document.body ).trigger( 'cfw_product_modal_closed' );
    };

    const syncPrice = ( e: Event ) => {
        const form = jQuery( e.currentTarget );

        const updatedPrice = form.find( '.single_variation_wrap .woocommerce-variation-price' ).html();

        if ( updatedPrice ) {
            form.find( '.cfw-product-form-modal-price' ).html( updatedPrice );
        }
    };

    const handleFormSubmit = ( e: Event ): jqXHR => {
        e.preventDefault();

        const form = jQuery( e.currentTarget );

        const button = form.find( 'button[type="submit"]' );
        const productData = form.serializeArray();
        let hasProductId = false;

        // Check for woocommerce custom quantity code
        // https://docs.woocommerce.com/document/override-loop-template-and-show-quantities-next-to-add-to-cart-buttons/
        jQuery.each( productData, ( key, formItem ) => {
            if ( formItem.name === 'productID' || formItem.name === 'add-to-cart' ) {
                if ( formItem.value ) {
                    hasProductId = true;
                    return false;
                }
            }

            return true;
        } );

        let productID: string | boolean = false;

        // If no product id found , look for the form action URL
        if ( !hasProductId && form.attr( 'action' ) ) {
            const isUrl = form.attr( 'action' ).match( /add-to-cart=([0-9]+)/ );
            productID = isUrl ? isUrl[ 1 ] : false;
        }

        // if button as name add-to-cart get it and add to form
        if ( button.attr( 'name' ) && button.attr( 'name' ) === 'add-to-cart' && button.attr( 'value' ) ) {
            productID = button.attr( 'value' );
        }

        if ( productID ) {
            productData.push( { name: 'add-to-cart', value: productID } );
        }

        button.addClass( 'loading' );

        // Trigger event.
        jQuery( document.body ).trigger( 'adding_to_cart', [ button, productData ] );

        return cfwAjax( 'cfw_add_to_cart', {
            type: 'POST',
            data: productData,
            dataType: 'json',
            cache: false,
        } ).done(
            ( resp ) => {
                jQuery( document.body ).trigger( 'cfw_order_bump_variation_added_to_cart', [ resp ] );
            },
        ).always( () => {
            setIsModalOpen( false );
        } );
    };

    useEffect( () => {
        const syncPriceBound = syncPrice.bind( this );
        const handleFormSubmitBound = handleFormSubmit.bind( this );

        jQuery( document.body ).on( 'woocommerce_variation_has_changed', `.${id} form`, syncPriceBound );
        jQuery( document.body ).on( 'wc_variation_form', `.${id} form`, syncPriceBound );
        jQuery( document.body ).on( 'submit', `.${id} form`, handleFormSubmitBound );

        return () => {
            jQuery( document.body ).off( 'woocommerce_variation_has_changed', `.${id} form`, syncPriceBound );
            jQuery( document.body ).off( 'wc_variation_form', `.${id} form`, syncPriceBound );
            jQuery( document.body ).off( 'submit', `.${id} form`, handleFormSubmitBound );
        };
    }, [ id ] ); // You may need to include other dependencies in this array if they are used in the event handlers

    return (
        <>
            <WrappedComponent
                {...props}
                openModal={openModal}
                closeModal={closeModal}
                containerId={id}
            />
            <Modal
                open={isModalOpen}
                onClose={closeModal}
                classNames={{
                    root: 'cfw-modal-root',
                    overlay: 'cfw-modal-overlay',
                    modal: `cfw-modal cfw-grid ${id}`,
                    modalContainer: 'cfw-modal-container',
                }}
                onAnimationEnd={() => {
                    const form = jQuery( `.${id} form` );
                    form.wc_variation_form();
                }}
                showCloseIcon={false}
                focusTrapped={false}
            >
                <div dangerouslySetInnerHTML={{ __html: content }} />
            </Modal>
        </>
    );
};

export default withProductModal;
