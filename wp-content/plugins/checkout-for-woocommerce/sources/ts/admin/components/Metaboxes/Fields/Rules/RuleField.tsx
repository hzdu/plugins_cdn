import React, { useEffect } from 'react';
import {
    SelectControl,
    __experimentalNumberControl as NumberControl,
    DateTimePicker,
    TextControl,
} from '@wordpress/components';
import { getSetting }                 from '@woocommerce/settings';
import Select                         from 'react-select';
import { Field, SubField, fields }    from './fields';
import ProductsAndVariationsCompleter from '../../ProductsAndVariationsCompleter';
import SelectWithLabel                from '../../../SelectWithLabel';
import ProductTagCompleter            from '../../ProductTagCompleter';
import UserRoleCompleter              from '../../../UserRoleCompleter';

export interface RuleType {
    fieldKey: string;
    subFields: {
        [key: string]: any;
    };
}

interface RuleFieldProps {
    rule: RuleType;
    onChange: ( updatedRule: RuleType ) => void;
}

interface LockedRuleFieldProps {
    children: React.ReactNode;
    fieldKey: string;
    requiredPlanLevel: number;
}

export const LockedRuleField: React.FC<LockedRuleFieldProps> = ( { children, fieldKey, requiredPlanLevel } ) => {
    // Get plan level and label information from global script data
    const planLevel = ( window as any ).cfwOrderBumpsData?.plan_level || 0;
    const requiredPlansLabel = ( window as any ).cfwOrderBumpsData?.labels?.required_list?.[ requiredPlanLevel ] || '';

    // Check if field is locked based on plan level
    const isLocked = planLevel < requiredPlanLevel;

    // Generate the upgrade URL based on plan level
    const upgradeUrl = planLevel === 0
        ? 'https://www.checkoutwc.com/lite-upgrade/?utm_campaign=liteplugin&utm_medium=admin-page-rules&utm_source=WordPress&utm_content=Unlock+with+Premium'
        : 'https://www.checkoutwc.com/documentation/upgrading-your-license/';

    if ( !isLocked ) {
        return <>{children}</>;
    }

    // Render locked UI for small space
    return (
        <div className="cfw-locked-field-wrapper cfw-tw">
            <div className="relative">
                {/* Disable interactions with opacity & pointer-events */}
                <div className="opacity-50 pointer-events-none">
                    {children}
                </div>
                {/* Overlay with upgrade button */}
                <div className="absolute inset-0 bg-white/95 shadow-md ring-1 ring-black ring-opacity-5 flex flex-col items-center justify-center z-10 rounded p-2">
                    <div className="flex flex-col gap-2 items-center justify-center">
                        <a
                            href={upgradeUrl}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 px-4 rounded shadow hover:text-white"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {planLevel > 0 ? 'Upgrade License' : 'Unlock Premium'}
                        </a>
                        <div className="flex items-center gap-1">
                            <span
                                className="text-[13px] italic text-center"
                                dangerouslySetInnerHTML={{ __html: `A ${requiredPlansLabel} plan is required to access this rule type.` }}
                            ></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const RuleField: React.FC<RuleFieldProps> = ( { rule, onChange } ) => {
    const field = fields.find( ( f ) => f.key === rule.fieldKey ) || ( {} as Field );

    useEffect( () => {
        const newSubFields = { ...rule.subFields };
        let shouldCallOnChange = false;

        field.fields.forEach( ( subField: SubField, index ) => {
            const fieldName = subField.name || `field_${index}`;

            let shouldDisplay = true;
            if ( subField.displayConditions ) {
                shouldDisplay = subField.displayConditions.every( ( condition ) => {
                    const dependencyValue = rule.subFields[ condition.dependencyName || '' ];
                    return condition.dependencyValues.includes( dependencyValue );
                } );
            }

            if ( shouldDisplay ) {
                if ( newSubFields[ fieldName ] === undefined ) {
                    let defaultValue;
                    if ( subField.valueType === 'select' && subField.options && subField.options.length > 0 ) {
                        defaultValue = subField.options[ 0 ].value;
                    } else if ( subField.valueType === 'number' ) {
                        defaultValue = 0;
                    } else if ( subField.valueType === 'date' ) {
                        defaultValue = new Date().toISOString();
                    } else if (
                        subField.valueType === 'productsSelect'
                        || subField.valueType === 'termsSelect'
                    ) {
                        defaultValue = [];
                    } else {
                        defaultValue = '';
                    }
                    newSubFields[ fieldName ] = defaultValue;
                    shouldCallOnChange = true;
                }
            } else if ( newSubFields.hasOwnProperty( fieldName ) ) {
                delete newSubFields[ fieldName ];
                shouldCallOnChange = true;
            }
        } );

        if ( shouldCallOnChange ) {
            onChange( {
                ...rule,
                subFields: newSubFields,
            } );
        }
    }, [ rule.subFields, field.fields ] );

    const handleFieldKeyChange = ( fieldKey: string ) => {
        const newField = fields.find( ( f ) => f.key === fieldKey ) || ( {} as Field );
        const subFields: { [key: string]: any } = {};
        newField.fields.forEach( ( subField: SubField, index ) => {
            const fieldName = subField.name || `field_${index}`;
            let defaultValue;
            if ( subField.valueType === 'select' && subField.options && subField.options.length > 0 ) {
                defaultValue = subField.options[ 0 ].value;
            } else if ( subField.valueType === 'number' ) {
                defaultValue = 0;
            } else if ( subField.valueType === 'date' ) {
                defaultValue = new Date().toISOString();
            } else if (
                subField.valueType === 'productsSelect'
                || subField.valueType === 'termsSelect'
            ) {
                defaultValue = [];
            } else {
                defaultValue = '';
            }
            subFields[ fieldName ] = defaultValue;
        } );
        onChange( {
            fieldKey,
            subFields,
        } );
    };

    const handleSubFieldChange = ( name: string, value: any, subField: SubField ) => {
        let newSubFields = { ...rule.subFields, [ name ]: value };

        if ( subField && subField.triggerReset ) {
            newSubFields = {};
            field.fields.forEach( ( sf: SubField, index ) => {
                const fieldName = sf.name || `field_${index}`;
                if ( fieldName === name ) {
                    newSubFields[ fieldName ] = value;
                } else {
                    let defaultValue;
                    if ( sf.valueType === 'select' && sf.options && sf.options.length > 0 ) {
                        defaultValue = sf.options[ 0 ].value;
                    } else if ( sf.valueType === 'number' ) {
                        defaultValue = 0;
                    } else if ( sf.valueType === 'date' ) {
                        defaultValue = new Date().toISOString();
                    } else if (
                        sf.valueType === 'productsSelect'
                        || sf.valueType === 'termsSelect'
                    ) {
                        defaultValue = [];
                    } else {
                        defaultValue = '';
                    }
                    newSubFields[ fieldName ] = defaultValue;
                }
            } );
        }

        onChange( {
            ...rule,
            subFields: newSubFields,
        } );
    };

    // Conditional rendering for userRole field
    const renderRuleFieldContent = ( valueType: string, valueTypeVariant: string, subField: SubField, fieldName: string, index: number, subFieldValue: any ) => {
        const onChangeSubField = ( value: any ) => {
            handleSubFieldChange( fieldName, value, subField );
        };

        const countryOptions = Object.entries( getSetting( 'countries', {} ) ).map(
            ( [ code, name ] ) => ( {
                label: name as string,
                value: code,
            } ),
        );

        switch ( valueType ) {
            case 'select':
                return (
                    <SelectControl
                        key={index}
                        value={subFieldValue}
                        options={subField.options}
                        onChange={onChangeSubField}
                    />
                );
            case 'number':
                return (
                    <NumberControl
                        key={index}
                        value={subFieldValue}
                        onChange={onChangeSubField}
                    />
                );
            case 'date':
                return (
                    <DateTimePicker
                        key={index}
                        currentDate={subFieldValue}
                        onChange={onChangeSubField}
                    />
                );
            case 'productsSelect':
                return (
                    <SelectWithLabel
                        key={index}
                        type="custom"
                        autocompleter={ProductsAndVariationsCompleter}
                        placeholder={subField.placeholder || 'Search for products'}
                        multiple={true}
                        selected={subFieldValue}
                        onChange={onChangeSubField}
                    />
                );
            case 'termsSelect':
                if ( valueTypeVariant === 'product_cat' ) {
                    return (
                        <SelectWithLabel
                            key={index}
                            type="categories"
                            placeholder={subField.placeholder || 'Search for categories'}
                            multiple={true}
                            selected={subFieldValue}
                            onChange={onChangeSubField}
                        />
                    );
                }

                if ( valueTypeVariant === 'product_tag' ) {
                    return (
                        <SelectWithLabel
                            key={index}
                            type="custom"
                            autocompleter={ProductTagCompleter}
                            placeholder={subField.placeholder || 'Search for product tags'}
                            multiple={true}
                            selected={subFieldValue}
                            onChange={onChangeSubField}
                        />
                    );
                }
                return null;
            case 'text':
                return (
                    <TextControl
                        key={index}
                        help={subField.help || ''}
                        value={subFieldValue}
                        placeholder={subField.placeholder || ''}
                        onChange={onChangeSubField}
                    />
                );
            case 'countries':
                return (
                    <Select
                        isMulti={true}
                        key={index}
                        value={subFieldValue}
                        options={countryOptions}
                        placeholder={subField.placeholder || 'Search for countries...'}
                        onChange={onChangeSubField}
                    />
                );
            case 'userRoles':
                return (
                    <SelectWithLabel
                        key={index}
                        type="custom"
                        autocompleter={UserRoleCompleter}
                        placeholder={subField.placeholder || 'Search for user roles...'}
                        multiple={true}
                        selected={subFieldValue}
                        onChange={onChangeSubField}
                        description={'Use Guest for non-logged in users.'}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="rule-fields">
            <SelectControl
                value={rule.fieldKey}
                options={fields.map( ( f ) => ( {
                    label: typeof f.label === 'function' ? f.label() : f.label,
                    value: f.key,
                } ) )}
                onChange={handleFieldKeyChange}
            />
            {field.fields
                && field.fields.map( ( subField: SubField, index ) => {
                    const fieldName = subField.name || `field_${index}`;
                    const subFieldValue = rule.subFields[ fieldName ];

                    let shouldDisplay = true;
                    if ( subField.displayConditions ) {
                        shouldDisplay = subField.displayConditions.every( ( condition ) => {
                            const dependencyValue = rule.subFields[ condition.dependencyName || '' ];
                            return condition.dependencyValues.includes( dependencyValue );
                        } );
                    }

                    if ( !shouldDisplay ) {
                        return null;
                    }

                    let { valueType, valueTypeVariant } = subField;
                    if ( subField.conditionalValueTypes ) {
                        subField.conditionalValueTypes.forEach( ( conditional ) => {
                            const dependencyValue = rule.subFields[ conditional.dependencyName || '' ];
                            if ( conditional.dependencyValues.includes( dependencyValue ) ) {
                                const matchingValueType = conditional.valueTypes.find(
                                    ( vt ) => vt.value === dependencyValue,
                                );
                                if ( matchingValueType ) {
                                    valueType = matchingValueType.valueType;
                                    valueTypeVariant = matchingValueType.valueTypeVariant;
                                }
                            }
                        } );
                    }

                    // Special handling for userRole field
                    if ( rule.fieldKey === 'userRole' && valueType === 'userRoles' ) {
                        return (
                            <LockedRuleField key={index} fieldKey="userRole" requiredPlanLevel={3}>
                                {renderRuleFieldContent( valueType, valueTypeVariant, subField, fieldName, index, subFieldValue )}
                            </LockedRuleField>
                        );
                    }

                    return renderRuleFieldContent( valueType, valueTypeVariant, subField, fieldName, index, subFieldValue );
                } )}
        </div>
    );
};

export default RuleField;
