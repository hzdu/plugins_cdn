import React                                                                                                                    from 'react';
import { PluginDocumentSettingPanel }                                                                                           from '@wordpress/edit-post';
import { RadioControl, __experimentalNumberControl as NumberControl }                                                           from '@wordpress/components';
import withMetaboxValidation                                                                                                    from './withMetaboxValidation';
import { OrderBumpsMeta, ValidationRules }                                                                                      from '../../Types/ValidationRules';

const getValidationRules: ( meta: OrderBumpsMeta ) => ValidationRules = ( meta ) => ( {

} );

const OrderBumpsOfferDiscountPanel = ( { meta, handleFieldChange } ) => (
    <PluginDocumentSettingPanel
        name="cfw-ob-offer-discount"
        title="Offer Discount"
        className="cfw-ob-offer-discount-mb"
    >
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
            help={ 'The amount or percentage applied as a discount to the Offer Product. Leave blank or enter 0 to charge full price.' }
            value={ meta.cfw_ob_offer_discount }
            onChange={
                ( newValue: string ) => {
                    handleFieldChange( 'cfw_ob_offer_discount', newValue );
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

export default withMetaboxValidation( OrderBumpsOfferDiscountPanel, getValidationRules );
