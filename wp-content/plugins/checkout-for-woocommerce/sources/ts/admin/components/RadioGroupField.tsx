import React from 'react';

const RadioGroupField = ( { selectedValue, onChange, options, title, description, show = true, child = false } ) => (
    <div className={`cfw-admin-field-container cfw-admin-field-radio-group ${child ? 'ml-7 p-4 bg-gray-100' : ''}`} style={ !show ? { display: 'none' } : {}}>
        <legend className="text-base font-medium text-gray-900">{title}</legend>
        <p className="text-sm leading-5 text-gray-500">{description}</p>
        <div className="space-y-5 mt-4">
            {options.map( ( option ) => (
                <div key={option.value} className="relative flex items-start">
                    <div className="flex items-center h-5">
                        <input
                            id={`cfw_admin_radio_group_${option.value}`}
                            type="radio"
                            value={option.value}
                            checked={selectedValue === option.value}
                            onChange={() => onChange( option.value )}
                            className="focus:ring-blue-800 h-4 w-4 text-blue-500 border-gray-300"
                        />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor={`cfw_admin_radio_group_${option.value}`} className="font-medium text-gray-700">{option.label}</label>
                        <p className="text-gray-500">{option.description}</p>
                    </div>
                </div>
            ) )}
        </div>
    </div>
);

export default RadioGroupField;
