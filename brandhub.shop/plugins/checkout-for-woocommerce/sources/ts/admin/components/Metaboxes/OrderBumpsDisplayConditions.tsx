import React, { useEffect }                                           from 'react';
import { PluginDocumentSettingPanel }                                 from '@wordpress/edit-post';
import { CheckboxControl, RadioControl }                              from '@wordpress/components';
import { useDispatch }                                                from '@wordpress/data';
import { store as noticesStore }                                      from '@wordpress/notices';
import MetaboxSelect                                                  from './Fields/MetaboxSelect';
import ProductsAndVariationsCompleter                                 from './ProductsAndVariationsCompleter';
import SelectWithLabel                                                from '../SelectWithLabel';
import withMetaboxValidation                                          from './withMetaboxValidation';
import { OrderBumpsMeta, ValidationRules }                            from '../../Types/ValidationRules';

const getValidationRules: ( meta: OrderBumpsMeta ) => ValidationRules = ( meta ) => ( {
    cfw_ob_products: {
        required: () => meta.cfw_ob_display_for === 'specific_products',
        error: 'You must specify at least one product.',
    },
    cfw_ob_categories: {
        required: () => meta.cfw_ob_display_for === 'specific_categories',
        error: 'You must specify at least one category.',
    },
} );

const OrderBumpsDisplayConditions = ( { meta, handleFieldChange } ) => {
    const { createNotice, removeNotice } = useDispatch( noticesStore );

    useEffect( () => {
        if ( meta.cfw_ob_display_location !== 'complete_order' ) {
            createNotice(
                'warning',
                'Block Editor is only used for Full Screen Order Bumps (Configurable for After Checkout Submit Bumps). Blocks are ignored for other configurations.',
                { id: 'notice-cfw_ob_display_location', isDismissible: false },
            );
        } else {
            removeNotice( 'notice-cfw_ob_display_location' );
        }

        return () => {
            removeNotice( 'notice-cfw_ob_display_location' );
        };
    }, [ meta.cfw_ob_display_location ] );

    return (
        <PluginDocumentSettingPanel
            name="cfw-ob-display-conditions"
            title="Display Conditions"
            className="cfw-ob-display-conditions-mb"
        >
            <MetaboxSelect
                label='Display Offer For'
                options={[
                    { label: 'All Products', value: 'all_products' },
                    { label: 'Specific Products', value: 'specific_products' },
                    { label: 'Specific Categories', value: 'specific_categories' },
                ]}
                value={meta.cfw_ob_display_for}
                onChange={( displayFor: string ) => handleFieldChange( 'cfw_ob_display_for', displayFor )}
            />
            {meta.cfw_ob_display_for === 'specific_products'
                && <>
                    <SelectWithLabel
                        type="custom"
                        label={'Products'}
                        autocompleter={ProductsAndVariationsCompleter}
                        placeholder="Search for products"
                        multiple={true}
                        selected={meta.cfw_ob_products}
                        onChange={
                            ( newValues: any ) => {
                                handleFieldChange( 'cfw_ob_products', newValues );
                            }
                        }
                    />

                    <CheckboxControl
                        label="Apply if all matching products are in the cart."
                        help="If checked, all products above must be in the cart. If unchecked order bump will show if any of the above products are in the cart."
                        checked={meta.cfw_ob_any_product === 'no'}
                        onChange={
                            ( newValue: boolean ) => {
                                handleFieldChange( 'cfw_ob_any_product', newValue ? 'no' : 'yes' );
                            }
                        }
                    />
                </>
            }

            {meta.cfw_ob_display_for === 'specific_categories'
                && <>
                    <SelectWithLabel
                        type="categories"
                        label={'Categories'}
                        placeholder="Search for categories"
                        multiple={true}
                        selected={meta.cfw_ob_categories}
                        onChange={
                            ( newValues: any ) => {
                                handleFieldChange( 'cfw_ob_categories', newValues );
                            }
                        }
                    />
                </>
            }

            <div
                style={{ marginBottom: '1rem' }}
            >
                <RadioControl
                    label="Display Location"
                    help="Where to display order bumps. Below Cart Items bumps will always display above the terms and conditions on mobile."
                    selected={meta.cfw_ob_display_location}
                    options={[
                        { label: 'Below Cart Items', value: 'below_cart_items' },
                        { label: 'Below Cart Items (Side Cart Only)', value: 'below_side_cart_items' },
                        { label: 'Below Cart Items (Checkout Only)', value: 'below_checkout_cart_items' },
                        { label: 'Above Terms and Conditions', value: 'above_terms_and_conditions' },
                        { label: 'Above Express Checkout', value: 'above_express_checkout' },
                        { label: 'Bottom of Information Step', value: 'bottom_information_tab' },
                        { label: 'Bottom of Shipping Step', value: 'bottom_shipping_tab' },
                        { label: 'Below Complete Order Button', value: 'below_complete_order_button' },
                        { label: 'After Checkout Submit Modal', value: 'complete_order' },
                    ]}
                    onChange={
                        ( newValue: any ) => {
                            handleFieldChange( 'cfw_ob_display_location', newValue );
                        }
                    }
                />
                {meta.cfw_ob_display_location === 'complete_order'
                    && <CheckboxControl
                        label="Full Screen Landing Page (Use Block Editor To Design)"
                        help="If checked, the bump offer will be displayed full screen. Use Order Bump Offer Form block to design the offer."
                        checked={meta.cfw_ob_full_screen === 'yes'}
                        onChange={
                            ( newValue: boolean ) => {
                                handleFieldChange( 'cfw_ob_full_screen', newValue ? 'yes' : 'no' );
                            }
                        }
                    />
                }
            </div>

            <SelectWithLabel
                type="custom"
                label={'Excluded Products'}
                autocompleter={ProductsAndVariationsCompleter}
                placeholder="Search for excluded products"
                multiple={true}
                selected={meta.cfw_ob_exclude_products}
                onChange={
                    ( newValues: any ) => {
                        handleFieldChange( 'cfw_ob_exclude_products', newValues );
                    }
                }
            />

            <SelectWithLabel
                type="categories"
                label={'Excluded Categories'}
                placeholder="Search for excluded categories"
                multiple={true}
                selected={meta.cfw_ob_exclude_categories}
                onChange={
                    ( newValues: any ) => {
                        handleFieldChange( 'cfw_ob_exclude_categories', newValues );
                    }
                }
            />

        </PluginDocumentSettingPanel>
    );
};

export default withMetaboxValidation( OrderBumpsDisplayConditions, getValidationRules );
