import React, { useEffect, useState }                from 'react';
import { Modal }                                     from 'react-responsive-modal';
import apiFetch                                      from '@wordpress/api-fetch';
import LoggingService                                from '../Services/LoggingService';
import CartItemInterface                             from '../../interfaces/CartItemInterface';
import PrimaryButton                                 from './PrimaryButton';
import DataService                                   from '../Services/DataService';
import SecondaryButton                               from './SecondaryButton';
import cfwAjax                                       from '../../functions/cfwAjax';

interface CartItemEditVariationLinkProps {
    item: CartItemInterface;
}

const CartItemEditVariationLink = ( { item }: CartItemEditVariationLinkProps ) => {
    const [ isOpen, setOpen ] = useState( false );
    const [ content, setContent ] = useState( '' );
    const [ confirmDisabled, setConfirmDisabled ] = useState( false );
    const [ id ] = useState( () => `component-${Math.random().toString( 16 ).slice( 2 )}` );

    const openModal = ( e ) => {
        e.preventDefault();

        const url = `checkoutwc/v1/get-variation-form/${item.product_parent_id}?key=${item.item_key}`;

        apiFetch( { path: url } )
            .then( ( data: Record<string, string> ) => {
                setContent( data.html ?? 'Could not load product' );
                setOpen( true );
            } )
            .catch( ( error ) => {
                LoggingService.logError( 'Error fetching variation form:', error );
                setContent( 'Could not load product' );
            } );
    };

    const closeModal = () => setOpen( false );

    const syncPrice = ( e: Event ) => {
        const form = jQuery( e.currentTarget );

        const updatedPrice = form.find( '.single_variation_wrap .woocommerce-variation-price' ).html();

        if ( updatedPrice ) {
            form.find( '.cfw-product-form-modal-price' ).html( updatedPrice );
        }
    };

    const onSubmit = ( e ) => {
        const form = jQuery( `.${id} form` );
        let productData = form.serializeArray();

        if ( jQuery( e.currentTarget ).data( 'cart-item-key' ) ) {
            productData.push( { name: 'key', value: jQuery( e.currentTarget ).data( 'cart-item-key' ) } );
        }

        productData = productData.filter( ( pd ) => pd.name !== 'add-to-cart' );

        return cfwAjax( 'update_cart_item_variation', {
            type: 'POST',
            data: productData,
            dataType: 'json',
            cache: false,
        } ).done(
            ( resp ) => {
                jQuery( document.body ).trigger( 'cfw_cart_item_variation_edited', [ resp ] );
            },
        ).always( () => {
            closeModal();
        } );
    };

    const maybeDisableConfirmButtons = ( event, variation, purchasable ) => {
        if ( purchasable ) {
            setConfirmDisabled( false );
            return;
        }

        setConfirmDisabled( true );
    };

    const setConfirmButtonDisabled = () => {
        setConfirmDisabled( true );
    };

    useEffect( () => {
        const syncPriceBound = syncPrice.bind( this );
        const maybeDisableConfirmButtonsBound = maybeDisableConfirmButtons.bind( this );
        const setConfirmButtonDisabledBound = setConfirmButtonDisabled.bind( this );

        jQuery( document.body ).on( 'woocommerce_variation_has_changed', `.${id} form`, syncPriceBound  );
        jQuery( document.body ).on( 'wc_variation_form', `.${id} form`, syncPriceBound  );
        jQuery( document.body ).on( 'show_variation', `.${id} form`, maybeDisableConfirmButtonsBound );
        jQuery( document.body ).on( 'reset_data', `.${id} form`, setConfirmButtonDisabledBound );

        return () => {
            jQuery( document.body ).off( 'woocommerce_variation_has_changed', `.${id} form`, syncPriceBound );
            jQuery( document.body ).off( 'wc_variation_form', `.${id} form`, syncPriceBound );
            jQuery( document.body ).off( 'show_variation', `.${id} form`, maybeDisableConfirmButtonsBound );
            jQuery( document.body ).off( 'reset_data', `.${id} form`, setConfirmButtonDisabledBound );
        };
    }, [ id ] );

    return (
        <>
            <a
                href="#"
                className="cfw-cart-edit-item-variation cfw-xtra-small"
                onClick={ openModal }
            >
                {DataService.getMessage( 'edit_cart_variation_label' )}
            </a>

            { isOpen && (
                <Modal
                    open={true}
                    onClose={ closeModal }
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
                    <div dangerouslySetInnerHTML={ { __html: content } } />

                    <div style={ { marginTop: '1em', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' } }>
                        <div style={ { margin: '0 10px' } }>
                            <PrimaryButton disabled={confirmDisabled} onClick={onSubmit} style={{ padding: '0.82rem' }} label={DataService.getMessage( 'update_cart_item_variation_button' )} />
                        </div>
                        <div style={ { margin: '0 10px' } }>
                            <SecondaryButton label={DataService.getMessage( 'cancel_button_label' )} onClick={closeModal} />
                        </div>
                    </div>
                </Modal>
            ) }
        </>
    );
};

export default CartItemEditVariationLink;
