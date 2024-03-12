import React                                            from 'react';
import { PluginDocumentSettingPanel }                   from '@wordpress/edit-post';
import { CheckboxControl }                              from '@wordpress/components';
import ProductsAndVariationsCompleter                   from './ProductsAndVariationsCompleter';
import SelectWithLabel                                  from '../SelectWithLabel';
import withMetaboxValidation                            from './withMetaboxValidation';
import { OrderBumpsMeta, ValidationRules }              from '../../Types/ValidationRules';

const getValidationRules: ( meta: OrderBumpsMeta ) => ValidationRules = ( meta ) => ( {} );

const OrderBumpsActionsPanel = ( { meta, handleFieldChange } ) => (
    <PluginDocumentSettingPanel
        name="cfw-ob-actions"
        title="Actions"
        className="cfw-ob-actions-mb"
    >
        { meta.cfw_ob_display_for === 'specific_products'
                && <>
                    <SelectWithLabel
                        type="custom"
                        label={ 'Remove These Products From The Cart' }
                        autocompleter={ProductsAndVariationsCompleter}
                        help={'If any of these products are in the cart, remove them when this bump is added to the cart.'}
                        placeholder="Search for products"
                        multiple={true}
                        selected={meta.cfw_ob_products_to_remove}
                        onChange={
                            ( newValues: any ) => {
                                handleFieldChange( 'cfw_ob_products_to_remove', newValues );
                            }
                        }
                    />

                    <CheckboxControl
                        label="Apply Free Shipping"
                        help="When this bump is added to the cart, apply free shipping to the cart."
                        checked={ meta.cfw_ob_apply_free_shipping === 'no' }
                        onChange={
                            ( newValue: boolean ) => {
                                handleFieldChange( 'cfw_ob_apply_free_shipping', newValue ? 'no' : 'yes' );
                            }
                        }
                    />
                </>
        }
    </PluginDocumentSettingPanel>
);

export default withMetaboxValidation( OrderBumpsActionsPanel, getValidationRules );
