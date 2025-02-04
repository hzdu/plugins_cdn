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
declare const RuleField: React.FC<RuleFieldProps>;
export default RuleField;
