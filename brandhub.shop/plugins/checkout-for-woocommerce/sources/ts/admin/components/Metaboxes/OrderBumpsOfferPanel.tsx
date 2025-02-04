import React                                                                                                                    from 'react';
import { PluginDocumentSettingPanel }                                                                                           from '@wordpress/edit-post';
import { CheckboxControl, RadioControl, TextareaControl, TextControl, __experimentalNumberControl as NumberControl }            from '@wordpress/components';
import ProductsAndVariationsCompleter                                                                                           from './ProductsAndVariationsCompleter';
import SelectWithLabel                                                                                                          from '../SelectWithLabel';
import withMetaboxValidation                                                                                                    from './withMetaboxValidation';
import { OrderBumpsMeta, ValidationRules }                                                                                      from '../../Types/ValidationRules';

const getValidationRules: ( meta: OrderBumpsMeta ) => ValidationRules = ( meta ) => ( {
    cfw_ob_offer_quantity: {
        required() {
            return meta.cfw_ob_upsell === 'yes';
        },
        number: true,
    },
    cfw_ob_offer_product_v9: {
        required: true,
        error: 'You must select an offer product.',
    },
} );

const OrderBumpsOfferPanel = ( { meta, handleFieldChange } ) => (
    <PluginDocumentSettingPanel
        name="cfw-ob-display-conditions"
        title="Offer"
        className="cfw-ob-offer-mb"
    >
        <SelectWithLabel
            type="custom"
            label={ 'Offer Product' }
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

        <CheckboxControl
            label="Auto Add Order Bump to Cart"
            help="If conditions are satisfied, automatically add this order bump to the cart. Useful for free gifts or other offers that don't require customer action."
            checked={ meta.cfw_ob_auto_add === 'yes' }
            onChange={
                ( newValue: boolean ) => {
                    handleFieldChange( 'cfw_ob_auto_add', newValue ? 'yes' : 'no' );
                }
            }
        />

        {meta.cfw_ob_upsell !== 'yes' && (
            <CheckboxControl
                label="Auto Match Variations Between Search and Offer Product"
                help={
                    (
                        <>
                            <p>
                            Add offer product to the cart with the same variable configuration as the
                            product below.
                            </p>
                            <p>
                            Only applies when <em>Auto Match Cart Product</em> and <em>Offer Product</em> are variable products with matching variation
                            attributes (Size, Color, etc)
                            </p>
                            <p>
                            Leave unchecked to have customers to select variation options
                            in a modal window.
                            </p>
                            <p>
                                <b>If offer product is not variable, this option is ignored.</b>
                            </p>
                        </>
                    )
                }
                checked={ meta.cfw_ob_enable_auto_match === 'yes' }
                onChange={
                    ( newValue: boolean ) => {
                        handleFieldChange( 'cfw_ob_enable_auto_match', newValue ? 'yes' : 'no' );
                    }
                }
            /> )
        }

        {meta.cfw_ob_upsell !== 'yes' && meta.cfw_ob_enable_auto_match === 'yes' && (
            <SelectWithLabel
                type="custom"
                label={'Auto Match Variations Cart Product'}
                autocompleter={ProductsAndVariationsCompleter}
                placeholder="Search for product"
                multiple={false}
                selected={meta.cfw_ob_variation_match_product}
                help={
                    (
                        <>
                            The product in the cart to match the Order Bump variations to.
                        </>
                    )
                }
                onChange={
                    ( newValues: any ) => {
                        handleFieldChange( 'cfw_ob_variation_match_product', newValues );
                    }
                }
            />
        )}

        {meta.cfw_ob_upsell !== 'yes'
                && <>
                    <CheckboxControl
                        label="Match Quantity of Offer Product to Display Condition Product"
                        help="If customer has two of the display condition product in the cart, two of the offer product will be added to the cart."
                        checked={ meta.cfw_ob_match_offer_product_quantity === 'yes' }
                        onChange={
                            ( newValue: boolean ) => {
                                handleFieldChange( 'cfw_ob_match_offer_product_quantity', newValue ? 'yes' : 'no' );
                            }
                        }
                    />
                </>
        }

        {meta.cfw_ob_match_offer_product_quantity === 'yes' && (
            <SelectWithLabel
                type="custom"
                label={'Match Quantity Cart Product'}
                autocompleter={ProductsAndVariationsCompleter}
                placeholder="Search for product"
                multiple={false}
                selected={meta.cfw_ob_quantity_match_product}
                help={
                    (
                        <>
                            The product in the cart to match the Order Bump quantity to.
                        </>
                    )
                }
                onChange={
                    ( newValues: any ) => {
                        handleFieldChange( 'cfw_ob_quantity_match_product', newValues );
                    }
                }
            />
        )}

        { ( meta.cfw_ob_upsell !== 'yes' && meta.cfw_ob_match_offer_product_quantity !== 'yes' )
            && <>
                <NumberControl
                    label={ 'Quantity of Offer Product To Add' }
                    help={ 'The quantity to add to the cart when offer is accepted.' }
                    value={ meta.cfw_ob_offer_quantity }
                    onChange={
                        ( newValue: string ) => {
                            handleFieldChange( 'cfw_ob_offer_quantity', newValue );
                        }
                    }
                />
                <CheckboxControl
                    label="Allow Customer To Change Quantity In Cart"
                    help="Allow customer to change the quantity of this order bump in the cart."
                    checked={ meta.cfw_ob_enable_quantity_updates === 'yes' }
                    onChange={
                        ( newValue: boolean ) => {
                            handleFieldChange( 'cfw_ob_enable_quantity_updates', newValue ? 'yes' : 'no' );
                        }
                    }
                />
            </>
        }
    </PluginDocumentSettingPanel>
);

export default withMetaboxValidation( OrderBumpsOfferPanel, getValidationRules );
