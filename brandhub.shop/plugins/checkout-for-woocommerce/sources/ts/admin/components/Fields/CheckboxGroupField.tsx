import { Field, useField }   from 'formik';
import React                 from 'react';
import withVisibilityControl from '../withVisibilityControl';

const CheckboxGroupField = ( { label, name, description, nested = false, notice = null, enabled = true, options, ...props } ) => {
    const [ field ] = useField( { name } );

    const handleChange = ( value, checked ) => {
        const set = new Set( field.value );
        if ( checked ) {
            set.add( value );
        } else {
            set.delete( value );
        }
        field.onChange( { target: { name, value: Array.from( set ) } } );
    };

    return (
        <div className={`cfw-admin-field-container ${nested ? 'ml-7 p-4 bg-gray-100' : ''}`}>
            <input type="hidden" name={name} />
            <div dangerouslySetInnerHTML={{ __html: notice }} />
            <legend className="text-base font-medium text-gray-900">{label}</legend>
            <p className="text-sm leading-5 text-gray-500">{description}</p>
            <div>
                {options.map( ( { value, label } ) => (
                    <div key={value} className="flex items-start mt-3">
                        <div className="h-5 flex items-center">
                            <Field
                                type="checkbox"
                                name={name}
                                value={value}
                                id={`${name}_${value}`}
                                checked={field.value.includes( value )}
                                onChange={( e ) => handleChange( value, e.target.checked )}
                                disabled={!enabled}
                                className="focus:ring-blue-800 h-4 w-4 text-blue-500 border-gray-300 rounded"
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor={`${name}_${value}`} style={{ verticalAlign: 'unset' }} className="font-medium text-gray-700">
                                {label}
                            </label>
                        </div>
                    </div>
                ) )}
            </div>
        </div>
    );
};

export default withVisibilityControl( CheckboxGroupField );
