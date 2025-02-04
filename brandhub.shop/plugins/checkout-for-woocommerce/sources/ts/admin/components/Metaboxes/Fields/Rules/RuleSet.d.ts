import React from 'react';
import { RuleType } from './RuleField';
interface RuleSetProps {
    rules: RuleType[];
    onChange: (updatedRules: RuleType[]) => void;
}
declare const RuleSet: React.FC<RuleSetProps>;
export default RuleSet;
