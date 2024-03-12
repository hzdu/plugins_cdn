import { Field }             from 'formik';
import React                 from 'react';
import withVisibilityControl from '../withVisibilityControl';

const RadioGroupField = ( { label, name, description, nested = false, options, enabled = true, ...props } ) => (
    <div className={`cfw-admin-field-container cfw-admin-field-radio-group ${nested ? 'ml-7 p-4 bg-gray-100' : ''}`}>
        <legend className="text-base font-medium text-gray-900">{label}</legend>
        <p className="text-sm leading-5 text-gray-500">{description}</p>
        <div className="space-y-5 mt-4">
            {options.map( ( { value, label: optionLabel, description: optionDescription } ) => (
                <div key={value} className="relative flex items-start">
                    <div className="flex items-center h-5">
                        <Field
                            type="radio"
                            name={name}
                            value={value}
                            id={`${name}_${value}`}
                            className="focus:ring-blue-800 h-4 w-4 text-blue-500 border-gray-300"
                            disabled={!enabled}
                        />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor={`${name}_${value}`} style={{ verticalAlign: 'unset' }} className="font-medium text-gray-700">
                            {optionLabel}
                        </label>
                        {optionDescription && (
                            <p id="small-description" className="text-gray-500" dangerouslySetInnerHTML={ { __html: optionDescription }}></p>
                        )}
                    </div>
                </div>
            ) )}
        </div>
    </div>
);

export default withVisibilityControl( RadioGroupField );
