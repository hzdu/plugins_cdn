import React from 'react';
export interface RuleType {
    fieldKey: string;
    subFields: {
        [key: string]: any;
    };
}
interface RuleFieldProps {
    rule: RuleType;
    onChange: (updatedRule: RuleType) => void;
}
interface LockedRuleFieldProps {
    children: React.ReactNode;
    fieldKey: string;
    requiredPlanLevel: number;
}
export declare const LockedRuleField: React.FC<LockedRuleFieldProps>;
declare const RuleField: React.FC<RuleFieldProps>;
export default RuleField;
