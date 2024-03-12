import { Field }             from 'formik';
import React                 from 'react';
import withVisibilityControl from '../withVisibilityControl';

const IconRadioGroupRowField = ( { label, name, description, nested = false, options, disabled = false, ...props } ) => (
    <div className={`cfw-admin-field-container cfw-admin-field-horizontal-icon-radio-group ${nested ? 'ml-7 p-4 bg-gray-100' : ''}`}>
        <legend className="text-base font-medium text-gray-900">{label}</legend>
        <p className="text-sm leading-5 text-gray-500">{description}</p>
        <div className="mt-4 space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
            {options.map( ( { value, label } ) => (
                <div key={value} className="relative flex items-start">
                    <div className="flex items-center h-8">
                        <Field
                            type="radio"
                            id={`${name}_${value}`}
                            name={name}
                            value={value}
                            className="focus:ring-blue-800 h-4 w-4 text-blue-500 border-gray-300"
                            disabled={disabled}
                        />
                    </div>
                    <div className="ml-3 text-sm flex items-center">
                        <label htmlFor={`${name}_${value}`} style={{ verticalAlign: 'unset' }} className="font-medium text-gray-700 ml-2" dangerouslySetInnerHTML={ { __html: label } }></label>
                    </div>
                </div>
            ) )}
        </div>
    </div>
);

export default withVisibilityControl( IconRadioGroupRowField );
