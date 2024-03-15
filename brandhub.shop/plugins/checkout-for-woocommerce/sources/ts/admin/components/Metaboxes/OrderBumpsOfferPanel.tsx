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
    cfw_ob_offer_discount: {
        required: true,
        number: true,
        error: 'Discount value must be a number. Example: 10, or 10.00',
    },
    cfw_ob_offer_product_v9: {
        required: true,
        error: 'You must select an offer product.',
    },
    cfw_ob_offer_language: {
        required: true,
        error: 'Offer Language is a required field.',
    },
    cfw_ob_offer_description: {
        required: true,
        error: 'Offer Description is a required field.',
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

        { meta.cfw_ob_display_for === 'specific_products' && meta.cfw_ob_products_v9.length === 1
                && <>
                    <CheckboxControl
                        label="Use Order Bump As Upsell"
                        help={
                            (
                                <>
                                    <>
                                    Replace cart product with offer product when this order bump is taken.
                                    </>
                                    <>
                                    Requirements: <i>Display Offer For</i> must be set to <i>Specific Products</i>. Only one product should be defined in <i>Products</i> list.
                                    </>
                                </>
                            )
                        }
                        checked={ meta.cfw_ob_upsell === 'yes' }
                        onChange={
                            ( newValue: boolean ) => {
                                handleFieldChange( 'cfw_ob_upsell', newValue ? 'yes' : 'no' );
                            }
                        }
                    />

                    <CheckboxControl
                        label="Auto Match Variations Between Search and Offer Product"
                        help={
                            (
                                <>
                                    <>
                                        Add offer product to the cart with the same variable configuration as the
                                        specific display condition product above.
                                    </>
                                    <>
                                        Only applies when <em>Display Condition Product</em> and <em>Offer Product</em> are variable products with matching variation
                                        attributes (Size, Color, etc)
                                    </>
                                    <>
                                        If either product is not a variable product,
                                        auto matching will not be attempted. Only one product should be defined in
                                        Products list. Leave unchecked to have customers to select variation options
                                        in a modal window.
                                    </>
                                    <>
                                        <b>If offer product is not variable, this option is ignored.</b>
                                    </>
                                </>
                            )
                        }
                        checked={ meta.cfw_ob_enable_auto_match === 'yes' }
                        onChange={
                            ( newValue: boolean ) => {
                                handleFieldChange( 'cfw_ob_enable_auto_match', newValue ? 'yes' : 'no' );
                            }
                        }
                    />
                </>
        }

        {meta.cfw_ob_upsell !== 'yes' && meta.cfw_ob_display_for === 'specific_products'
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

        { ( meta.cfw_ob_display_for !== 'specific_products' || ( meta.cfw_ob_upsell !== 'yes' && meta.cfw_ob_match_offer_product_quantity !== 'yes' ) )
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

        <RadioControl
            label="Discount Type"
            help="Amount Off: Remove fixed amount from the product price. Percent Off: Discount product by specified percentage."
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
            help={ 'The amount or percentage applied as a discount to the Offer Product. (See Discount Type)' }
            value={ meta.cfw_ob_offer_discount }
            onChange={
                ( newValue: string ) => {
                    handleFieldChange( 'cfw_ob_offer_discount', newValue );
                }
            }
        />

        {meta.cfw_ob_display_location === 'complete_order'
                && <>
                    <TextControl
                        label={ 'After Checkout Submit Modal Heading' }
                        help={ 'Default if blank: Your order is almost complete...' }
                        value={ meta.cfw_ob_offer_heading }
                        onChange={
                            ( newValue: string ) => {
                                handleFieldChange( 'cfw_ob_offer_heading', newValue );
                            }
                        }
                    />
                    <TextControl
                        label={ 'After Checkout Submit Modal Subheading' }
                        help={ 'Default if blank: Add this offer to your order and save!' }
                        value={ meta.cfw_ob_offer_subheading }
                        onChange={
                            ( newValue: string ) => {
                                handleFieldChange( 'cfw_ob_offer_subheading', newValue );
                            }
                        }
                    />
                </>
        }

        <TextControl
            label={ 'Modal Offer Rejection Link Text' }
            help={ (
                <>
                    <>
                        Displays in modal version of Order Bump, such as when configured as an <i>After Checkout Submit Modal</i> or when the Offer Product is a variable product (as opposed to a specific variation).
                    </>
                    <>
                        {meta.cfw_ob_display_location === 'complete_order' ? (
                            <>Default if blank: No thanks, just complete my order</>
                        ) : (
                            <>Default if blank: No thanks</>
                        )}
                    </>
                </>
            ) }
            value={ meta.cfw_ob_offer_cancel_button_text }
            onChange={
                ( newValue: string ) => {
                    handleFieldChange( 'cfw_ob_offer_cancel_button_text', newValue );
                }
            }
        />

        <TextControl
            label={ meta.cfw_ob_display_location !== 'complete_order' ? 'Offer Acceptance Checkbox Label' : 'Offer Acceptance Button Label' }
            help={ 'Example: Yes! Please add this offer to my order' }
            value={ meta.cfw_ob_offer_language }
            onChange={
                ( newValue: string ) => {
                    handleFieldChange( 'cfw_ob_offer_language', newValue );
                }
            }
        />

        <TextareaControl
            label={'Offer Description'}
            help={'Example: Limited time offer! Get an EXCLUSIVE discount right now! Click the checkbox above to add this product to your order now.'}
            value={ meta.cfw_ob_offer_description }
            onChange={
                ( newValue: string ) => {
                    handleFieldChange( 'cfw_ob_offer_description', newValue );
                }
            }
        />

        {meta.cfw_ob_upsell !== 'yes'
                && <RadioControl
                    label="Item Removal Behavior"
                    help="What happens when the display for product is removed from the cart. Default: Order Bump remains in the cart but bump specific discounts are removed."
                    selected={ meta.cfw_ob_item_removal_behavior }
                    options={ [
                        { label: 'Leave In Cart With Normal Price', value: 'keep' },
                        { label: 'Remove Order Bump From Cart', value: 'delete' },
                    ] }
                    onChange={
                        ( newValue: any ) => {
                            handleFieldChange( 'cfw_ob_item_removal_behavior', newValue );
                        }
                    }
                />
        }
    </PluginDocumentSettingPanel>
);

export default withMetaboxValidation( OrderBumpsOfferPanel, getValidationRules );
