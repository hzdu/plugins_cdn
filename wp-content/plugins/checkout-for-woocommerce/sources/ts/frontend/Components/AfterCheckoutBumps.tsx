import React, { useEffect, useState }                from 'react';
import { Modal }                                     from 'react-responsive-modal';
import apiFetch                                      from '@wordpress/api-fetch';
import LoggingService                                from '../Services/LoggingService';
import DataService                                   from '../Services/DataService';
import cfwAjax                                       from '../../functions/cfwAjax';
import cfwAddOverlay                                 from '../../functions/cfwAddOverlay';
import jqXHR = JQuery.jqXHR;

const AfterCheckoutBumps = () => {
    const [ isOpen, setOpen ] = useState( false );
    const [ content, setContent ] = useState( '' );
    const [ fullScreen, setFullScreen ] = useState( false );
    const [ id ] = useState( () => `component-${Math.random().toString( 16 ).slice( 2 )}` );

    const closeModal = () => setOpen( false );

    const syncPrice = ( e: Event ) => {
        const form = jQuery( e.currentTarget );

        const updatedPrice = form.find( '.single_variation_wrap .woocommerce-variation-price' ).html();

        if ( updatedPrice ) {
            form.find( '.cfw-product-form-modal-price' ).html( updatedPrice );
        }
    };

    const displayNextAfterCheckoutSubmitBump = (): boolean => {
        const bumps: Record<string, unknown> = DataService.getData( 'after_checkout_bumps' );

        if ( !Object.keys( bumps ).length ) {
            return false;
        }

        const bumpId = Object.keys( bumps )[ 0 ];
        const config = bumps[ bumpId ] as Record<string, boolean>;
        delete bumps[ bumpId ];

        DataService.updateData( 'after_checkout_bumps', bumps );

        let url = `checkoutwc/v1/order-bump-upsell-product-form/${bumpId}`;

        if ( !config.full_screen ) {
            apiFetch( { path: url } )
                .then( ( data: Record<string, string> ) => {
                    setFullScreen( false );
                    setContent( data.html ?? 'Could not load product' );
                    setOpen( true );
                } )
                .catch( ( error ) => {
                    LoggingService.logError( 'Error fetching after checkout bump product form:', error );
                } );

            return true;
        }

        url = `wp/v2/cfw_order_bumps/${bumpId}`;

        apiFetch( { path: url } )
            .then( ( response: any ) => {
                setFullScreen( true );
                setContent( response.content?.rendered ?? 'Could not load offer' );
                setOpen( true );
            } )
            .catch( ( error ) => {
                LoggingService.logError( 'Error fetching after checkout bump product form:', error );
            } );

        return true;
    };

    const handleBumpFormSubmit = ( e ): jqXHR => {
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

                closeModal();

                if ( displayNextAfterCheckoutSubmitBump() ) {
                    return;
                }

                if ( jQuery( document.body ).triggerHandler( 'cfw_after_checkout_bump_handle_add_to_cart' ) ) {
                    return;
                }

                DataService.checkoutForm.trigger( 'submit' );
            },
        ).fail( () => {
            DataService.checkoutForm.trigger( 'submit' );
        } );
    };

    const maybeDisplayAfterCheckoutSubmitBumps = ( event: Event ) => {
        const bumps = DataService.getData( 'after_checkout_bumps' );

        if ( !Object.keys( bumps ).length ) {
            return true;
        }

        cfwAddOverlay();

        displayNextAfterCheckoutSubmitBump();

        event.preventDefault();
        event.stopImmediatePropagation();
        return false;
    };

    const handleRejection = () => {
        closeModal();

        if ( displayNextAfterCheckoutSubmitBump() ) {
            return;
        }

        if ( jQuery( document.body ).triggerHandler( 'cfw_after_checkout_bump_handle_rejection' ) ) {
            return;
        }

        DataService.checkoutForm.trigger( 'submit' );
    };

    useEffect( () => {
        // Special, can't be removed
        DataService.checkoutForm.firstOn( 'checkout_place_order', maybeDisplayAfterCheckoutSubmitBumps );

        jQuery( document.body ).on( `cfw_request_after_checkout_submit_bumps.${id}`, maybeDisplayAfterCheckoutSubmitBumps );
        jQuery( document.body ).on( `submit.${id}`, `.${id} form.cfw-modal-order-bump-form`, handleBumpFormSubmit.bind( this )  );
        jQuery( document.body ).on( `woocommerce_variation_has_changed.${id}`, `.${id} form`, syncPrice.bind( this )  );
        jQuery( document.body ).on( `wc_variation_form.${id}`, `.${id} form`, syncPrice.bind( this )  );

        jQuery( document.body ).on( `show_variation.${id}`, ( event, variation, purchasable ) => {
            const addToCartButton = jQuery( '.cfw-modal .single_add_to_cart_button' );

            if ( purchasable ) {
                addToCartButton.prop( 'disabled', false );
                return;
            }

            addToCartButton.prop( 'disabled', true );
        } );
        jQuery( document.body ).on( `reset_data.${id}`, () => {
            jQuery( '.cfw-modal .single_add_to_cart_button' ).prop( 'disabled', true );
        } );
        jQuery( document.body  ).on( `click.${id}`, `.${id} .cfw-bump-reject`, handleRejection.bind( this ) );

        return () => {
            jQuery( document.body ).off( `submit.${id}`, `.${id} form.cfw-modal-order-bump-form` );
            jQuery( document.body ).off( `cfw_request_after_checkout_submit_bumps.${id}` );
            jQuery( document.body ).off( `woocommerce_variation_has_changed.${id}`, `.${id} form` );
            jQuery( document.body ).off( `wc_variation_form.${id}`, `.${id} form` );

            jQuery( document.body ).off( `show_variation.${id}` );
            jQuery( document.body ).off( `reset_data.${id}` );
            jQuery( document.body ).off( `click.${id}` );
        };
    }, [] );

    return (
        <>
            { isOpen && (
                <Modal
                    onClose={() => null}
                    classNames={{
                        root: 'cfw-modal-root',
                        overlay: 'cfw-modal-overlay',
                        modal: `cfw-modal cfw-grid ${id} ${fullScreen ? 'cfw-full-screen' : ''}`,
                        modalContainer: 'cfw-modal-container',
                    }}
                    open={true}
                    onAnimationEnd={() => {
                        const form = jQuery( 'form.cfw-product-form-modal.variable' );
                        form.wc_variation_form();
                    }}
                    onOverlayClick={() => {}}
                    onEscKeyDown={() => {}}
                    showCloseIcon={false}
                    focusTrapped={false}
                >
                    <div dangerouslySetInnerHTML={ { __html: content } } />
                </Modal>
            ) }
        </>
    );
};

export default AfterCheckoutBumps;
