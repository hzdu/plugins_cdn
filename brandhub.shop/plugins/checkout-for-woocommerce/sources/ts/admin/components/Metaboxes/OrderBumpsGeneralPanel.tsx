import React                                                                                   from 'react';
import { PluginDocumentSettingPanel }                                                          from '@wordpress/edit-post';
import { CheckboxControl }                                                                     from '@wordpress/components';
import withMetaboxValidation                                                                   from './withMetaboxValidation';
import { OrderBumpsMeta, ValidationRules }                                                     from '../../Types/ValidationRules';
import SelectWithLabel                                                                         from '../SelectWithLabel';
import ProductsAndVariationsCompleter                                                          from './ProductsAndVariationsCompleter';

const getValidationRules: ( meta: OrderBumpsMeta ) => ValidationRules = ( meta ) => ( {
    cfw_ob_upsell_product: {
        required: () => meta.cfw_ob_upsell === 'yes',
        error: 'You must set an upsell replacement product.',
    },
} );

const OrderBumpsGeneralPanel = ( { meta, handleFieldChange } ) => (
    <PluginDocumentSettingPanel
        name="cfw-ob-general"
        title="Offer Type"
        className="cfw-ob-general-mb"
    >
        <CheckboxControl
            label="Use Order Bump As Upsell"
            help={
                (
                    <>
                        Replace a cart item with offer product when this Order Bump is taken.
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

        {meta.cfw_ob_upsell === 'yes' && <SelectWithLabel
            type="custom"
            label={'Which product does this upsell replace in the cart?'}
            autocompleter={ProductsAndVariationsCompleter}
            placeholder="Search for product"
            multiple={false}
            selected={meta.cfw_ob_upsell_product}
            help={
                (
                    <>
                        This product must be in the cart for this order bump to be shown.
                    </>
                )
            }
            onChange={
                ( newValues: any ) => {
                    handleFieldChange( 'cfw_ob_upsell_product', newValues );
                }
            }
        />}
    </PluginDocumentSettingPanel>
);

export default withMetaboxValidation( OrderBumpsGeneralPanel, getValidationRules );
