import { Field, useField }   from 'formik';
import Select                from 'react-select';
import React                 from 'react';
import withVisibilityControl from '../withVisibilityControl';

const CountriesMultiselectField = ( { label, name, description, nested = false, countries, placeholder = null, ariaLabel = null, ...props } ) => {
    const [ field, , helpers ] = useField( name );

    const formattedCountries = Object.keys( countries ).map( ( countryValue ) => ( {
        value: countryValue,
        label: countries[ countryValue ],
    } ) );

    // Function to handle changes in the select component
    const handleChange = ( selectedOptions ) => {
        // Extract values from selected options
        const values = selectedOptions.map( ( option ) => option.value );
        // Update Formik's state
        helpers.setValue( values );
    };

    return (
        <div className={`cfw-admin-field-container cfw-admin-select-field ${nested ? 'ml-7 p-4 bg-gray-100' : ''}`}>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <Field
                name={name}
                isMulti={true}
                component={Select}
                data-placeholder={placeholder}
                aria-label={ariaLabel}
                options={formattedCountries}
                value={formattedCountries.filter( ( option ) => field.value.includes( option.value ) )}
                onChange={handleChange}
            />
            <p className="mt-2 text-sm text-gray-500">
                {description}
            </p>
        </div>
    );
};

export default withVisibilityControl( CountriesMultiselectField );
