// Rule.tsx

import React                         from 'react';
import { Button }                    from '@wordpress/components';
import { closeSmall }                from '@wordpress/icons';
import RuleField, { RuleType }       from './RuleField';
import { cfw__ }                     from '../../../../../functions/translationWrappers';

interface RuleProps {
    rule: RuleType;
    index: number;
    onChange: ( index: number, updatedRule: RuleType ) => void;
    onRemove: ( index: number ) => void;
}

const Rule: React.FC<RuleProps> = ( { rule, index, onChange, onRemove } ) => {
    const handleRuleChange = ( updatedRule: RuleType ) => {
        onChange( index, updatedRule );
    };

    const ruleLabel = index === 0 ? cfw__( 'Show If', 'checkout-wc' ) : cfw__( 'And If', 'checkout-wc' );

    return (
        <div className="cfw-rule">
            <div className="rule__header">
                <span>{ruleLabel}</span>

                <Button
                    label={cfw__( 'Delete Rule', 'block-visibility' )}
                    icon={closeSmall}
                    onClick={() => onRemove( index )}
                    variant={'tertiary'}
                    size={'small'}
                />
            </div>
            <RuleField rule={rule} onChange={handleRuleChange}/>
        </div>
    );
};

export default Rule;
