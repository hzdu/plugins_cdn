export interface Field {
    key: string;
    label: string | (() => string);
    help?: string;
    group: string;
    fields: SubField[];
    hasSimplifiedLayout?: boolean;
    hasMultipleSubFields?: boolean;
}
export interface SubField {
    type: 'subField' | 'operatorField' | 'valueField';
    name?: string;
    valueType?: string;
    options?: Array<{
        label: string;
        value: string;
    }>;
    placeholder?: string;
    displayConditions?: Array<DisplayCondition>;
    conditionalValueTypes?: Array<ConditionalValueType>;
    valueTypeVariant?: string;
    triggerReset?: boolean;
    help?: string;
}
export interface DisplayCondition {
    dependencyType: 'subField' | 'operatorField' | 'valueField';
    dependencyName?: string;
    dependencyValues: string[];
}
export interface ConditionalValueType {
    dependencyType: 'subField' | 'operatorField' | 'valueField';
    dependencyName?: string;
    dependencyValues: string[];
    valueTypes: Array<{
        value: string;
        valueType: string;
        placeholder?: string;
        valueTypeVariant?: string;
    }>;
}
export declare const fields: Field[];
