import { Field, useField }   from 'formik';
import Select                from 'react-select';
import React                 from 'react';
import withVisibilityControl from '../withVisibilityControl';

const SelectField = ( { label, name, description, nested = false, options, placeholder = null, ariaLabel = null, ...props } ) => {
    const [ field, , helpers ] = useField( name );

    // Function to handle changes in the select component
    const handleChange = ( selectedOption ) => {
        // Update Formik's state with the value of the selected option
        helpers.setValue( selectedOption ? selectedOption.value : '' );
    };

    return (
        <div className={`cfw-admin-field-container cfw-admin-select-field ${nested ? 'ml-7 p-4 bg-gray-100' : ''}`}>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <Field
                name={name}
                isMulti={false}
                component={Select}
                data-placeholder={placeholder}
                aria-label={ariaLabel}
                options={options}
                value={options.find( ( option ) => option.value === field.value )}
                onChange={handleChange}
            />
            <p className="mt-2 text-sm text-gray-500">
                {description}
            </p>
        </div>
    );
};

export default withVisibilityControl( SelectField );
