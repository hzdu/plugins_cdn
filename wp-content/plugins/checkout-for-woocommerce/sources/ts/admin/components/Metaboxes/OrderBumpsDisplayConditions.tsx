import React                                                                                 from 'react';
import { PluginDocumentSettingPanel }                                                        from '@wordpress/edit-post';
import withMetaboxValidation                                                                 from './withMetaboxValidation';
import { OrderBumpsMeta, ValidationRules }                                                   from '../../Types/ValidationRules';
import { RuleType }                                                                          from './Fields/Rules/RuleField';
import RuleSet                                                                               from './Fields/Rules/RuleSet';
import { cfw__ }                                                                             from '../../../functions/translationWrappers';

const getValidationRules: ( meta: OrderBumpsMeta ) => ValidationRules = ( meta ) => ( {
} );

const OrderBumpsDisplayConditions = ( { meta, handleFieldChange } ) => {
    const rules: RuleType[] = meta.cfw_ob_rules || [];

    const handleRulesChange = ( newRules: RuleType[] ) => {
        handleFieldChange( 'cfw_ob_rules', newRules );
    };

    return (
        <PluginDocumentSettingPanel
            name="cfw-ob-display-conditions"
            title="Display Conditions"
            className="cfw-ob-display-conditions-mb"
        >
            {rules.length > 0 ? (
                <h3>{cfw__( 'Show Bump When These Conditions Are True:', 'checkout-wc' )}</h3>
            ) : (
                meta.cfw_ob_upsell === 'yes' ? (
                    <p>{cfw__( 'This bump will be shown when the correct upsell product is in the cart and the Offer Product is not in the cart. To further limit when this bump is shown, add a rule below.', 'checkout-wc' )}</p>
                ) : (
                    <p>{cfw__( 'This bump will always be shown when the Offer Product is not in the cart. To limit when this bump is shown, add a rule below.', 'checkout-wc' )}</p>
                )
            )}
            <RuleSet rules={rules} onChange={handleRulesChange}/>

        </PluginDocumentSettingPanel>
    );
};

export default withMetaboxValidation( OrderBumpsDisplayConditions, getValidationRules );
