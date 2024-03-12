import { Field, ErrorMessage } from 'formik';
import React                   from 'react';
import withVisibilityControl   from '../withVisibilityControl';

const NumberField = ( { label, name, description, nested = false, ...props } ) => (
    <div className={`cfw-admin-field-container ${nested ? 'ml-7 p-4 bg-gray-100' : ''}`}>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
            {label}
        </label>
        <Field
            type="number"
            name={name}
            id={name}
            className="w-64 shadow-sm focus:ring-blue-500 focus:border-blue-500 block sm:text-sm border border-gray-300 rounded-md"
        />
        <ErrorMessage name={name} component="div" className="error" />
        <p className="mt-2 text-sm text-gray-500">
            {description}
        </p>
    </div>
);

export default withVisibilityControl( NumberField );
