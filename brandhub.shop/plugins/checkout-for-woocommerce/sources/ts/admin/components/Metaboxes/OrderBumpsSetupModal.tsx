import { useEffect, useState }                                                             from '@wordpress/element';
import { dispatch, useSelect }                                                             from '@wordpress/data';
import { Modal }                                                                           from 'react-responsive-modal';
import React                                                                               from 'react';
import {
    __experimentalNumberControl as NumberControl,
    Button,
    Flex,
    RadioControl,
    TextControl,
} from '@wordpress/components';
import SelectWithLabel                                                                       from '../SelectWithLabel';
import ProductsAndVariationsCompleter                                                        from './ProductsAndVariationsCompleter';
import { OrderBumpsMeta, ValidationRules }                                                   from '../../Types/ValidationRules';
import withMetaboxValidation                                                                 from './withMetaboxValidation';

const getValidationRules: ( meta: OrderBumpsMeta ) => ValidationRules = ( meta ) => ( {
} );

const OrderBumpsSetupModal = ( { meta, handleFieldChange } ) => {
    const [ open, setOpen ] = useState( false );

    const { isNewPost, postType, postTitle } = useSelect( ( select: any ) => {
        const editorSelect = select( 'core/editor' );
        return {
            postTitle: editorSelect.getEditedPostAttribute( 'title' ),
            isNewPost: editorSelect.isEditedPostNew(),
            postType: editorSelect.getCurrentPostType(),
        };
    }, [] );

    const { editPost } = dispatch( 'core/editor' ) as any;

    useEffect( () => {
        // Check if it's a new post and the correct post type
        if ( isNewPost && postType === 'cfw_order_bumps' ) {
            setOpen( true );
            handleFieldChange( 'cfw_new_bump_modal_open', true );
        }
    }, [ isNewPost, postType ] );

    const handleClose = () => {
        handleFieldChange( 'cfw_new_bump_modal_open', false );
        setOpen( false );
    };

    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                center={true}
                classNames={{
                    root: 'cfw-modal-root',
                    overlay: 'cfw-modal-overlay',
                    modal: 'cfw-modal',
                    modalContainer: 'cfw-modal-container',
                }}
            >
                <h1>New Order Bump</h1>
                <h3>Let's configure a few things to get you started quickly.</h3>

                <TextControl
                    label="Title"
                    help="Give your new Order Bump a name. This is just for admins - it won't be displayed to customers."
                    value={postTitle}
                    onChange={
                        ( value ) => {
                            editPost( { title: value } );
                        }
                    }
                />

                <SelectWithLabel
                    type="custom"
                    label="Offer Product"
                    help="Which product should be added to the cart when this Order Bump is accepted?"
                    autocompleter={ProductsAndVariationsCompleter}
                    placeholder="Search for product"
                    multiple={false}
                    selected={meta.cfw_ob_offer_product_v9}
                    onChange={
                        ( newValues: any ) => {
                            handleFieldChange( 'cfw_ob_offer_product_v9', newValues );
                        }
                    }
                />

                <RadioControl
                    label="Discount Type"
                    selected={ meta.cfw_ob_discount_type }
                    options={ [
                        { label: 'Percent Off', value: 'percent' },
                        { label: 'Amount Off', value: 'amount' },
                    ] }
                    onChange={
                        ( newValue: any ) => {
                            handleFieldChange( 'cfw_ob_discount_type', newValue );
                        }
                    }
                />

                <NumberControl
                    label={ 'Discount' }
                    help={ 'The amount or percentage applied as a discount to the Offer Product. Leave blank or enter 0 to charge full price.' }
                    value={ meta.cfw_ob_offer_discount }
                    onChange={
                        ( newValue: string ) => {
                            handleFieldChange( 'cfw_ob_offer_discount', newValue );
                        }
                    }
                />

                <Flex justify="flex-end">
                    <Button variant={'primary'} size={'default'} onClick={handleClose}>
                    Continue
                    </Button>
                </Flex>

                <Flex justify={'center'}>
                    <p>Continue to review your order bump, optionally add display conditions, and publish.</p>
                </Flex>
            </Modal>
        </>
    );
};
export default withMetaboxValidation( OrderBumpsSetupModal, getValidationRules );
