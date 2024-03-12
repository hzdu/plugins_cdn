import { Field }               from 'formik';
import React                   from 'react';
import withVisibilityControl   from '../withVisibilityControl';

const TextField = ( { label, name, description = null, placeholder = null, nested = false, ...props } ) => (
    <div className={`cfw-admin-field-container ${nested ? 'ml-7 p-4 bg-gray-100' : ''}`}>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
            {label}
        </label>
        <Field
            name={name}
            type="text"
            id={name}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
            placeholder={placeholder}
        />
        {description && ( <p className="mt-2 text-sm text-gray-500" dangerouslySetInnerHTML={ { __html: description } }></p> )}
    </div>
);

export default withVisibilityControl( TextField );
