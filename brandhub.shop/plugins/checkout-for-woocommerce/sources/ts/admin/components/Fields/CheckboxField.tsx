import { Field }                  from 'formik';
import React                      from 'react';
import withVisibilityControl      from '../withVisibilityControl';
import { pickValidCheckboxProps } from '../../functions/pickValidCheckboxProps';

const CheckboxField = ( { name, label, description, nested = false, enabled = true, disabled = false, ...props } ) => (
    <div className={`cfw-admin-field-container relative flex items-start ${nested ? 'ml-7 p-4 bg-gray-100' : ''}`}>
        <div className="flex items-center h-5">
            <Field
                type="checkbox"
                id={`cfw_checkbox_${name}`}
                name={name}
                className="focus:ring-blue-800 h-4 w-4 text-blue-500 border-gray-300 rounded disabled:bg-gray-100 disabled:border"
                disabled={disabled}
                {...pickValidCheckboxProps( {
                    ...props,
                } )}
            />
        </div>
        <div className="ml-3 text-sm">
            <label htmlFor={`cfw_checkbox_${name}`} className="font-medium text-gray-700" style={{ verticalAlign: 'unset' }}>
                {label}
            </label>
            {description && (
                <p className="text-gray-500" dangerouslySetInnerHTML={{ __html: description }} />
            )}
        </div>
    </div>
);

export default withVisibilityControl( CheckboxField );
