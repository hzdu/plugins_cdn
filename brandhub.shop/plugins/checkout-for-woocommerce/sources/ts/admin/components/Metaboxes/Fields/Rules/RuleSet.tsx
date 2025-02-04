// RuleSet.tsx

import React                  from 'react';
import { plus }               from '@wordpress/icons';
import { Button }             from '@wordpress/components';
import { __ }                 from '@wordpress/i18n';
import Rule                   from './Rule';
import { RuleType }           from './RuleField';
import { fields }             from './fields';
import { cfw__ }              from '../../../../../functions/translationWrappers';

interface RuleSetProps {
    rules: RuleType[];
    onChange: ( updatedRules: RuleType[] ) => void;
}

const RuleSet: React.FC<RuleSetProps> = ( { rules, onChange } ) => {
    const handleRuleChange = ( index: number, updatedRule: RuleType ) => {
        const newRules = [ ...rules ];
        newRules[ index ] = updatedRule;
        onChange( newRules );
    };

    const handleRuleAdd = () => {
        onChange( [
            ...rules,
            {
                fieldKey: fields[ 0 ].key, // Set to the first field's key
                subFields: {}, // Empty subFields, will be initialized in RuleField
            },
        ] );
    };

    const handleRuleRemove = ( index: number ) => {
        const newRules = rules.filter( ( _, i ) => i !== index );
        onChange( newRules );
    };

    return (
        <div className="cfw-rule-set">
            {rules.map( ( rule, index ) => (
                <Rule
                    key={index}
                    index={index}
                    rule={rule}
                    onChange={handleRuleChange}
                    onRemove={handleRuleRemove}
                />
            ) )}
            <Button onClick={handleRuleAdd} size={'default'} variant={'link'}>
                { cfw__( 'Add rule', 'checkout-wc' ) }
            </Button>
        </div>
    );
};

export default RuleSet;
