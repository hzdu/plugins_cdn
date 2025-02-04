import React from 'react';
import { RuleType } from './RuleField';
interface RuleProps {
    rule: RuleType;
    index: number;
    onChange: (index: number, updatedRule: RuleType) => void;
    onRemove: (index: number) => void;
}
declare const Rule: React.FC<RuleProps>;
export default Rule;
