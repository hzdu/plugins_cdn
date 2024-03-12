import { useField }          from 'formik';
import ReactQuill            from 'react-quill';
import React                 from 'react';
import withVisibilityControl from '../withVisibilityControl'; // import the styles

const TextareaField = ( { label, name, description, nested = false, notice = null, enabled = true, ...props } ) => {
    const [ field, , helpers ] = useField( name );

    const handleChange = ( content ) => {
        helpers.setValue( content );
    };

    return (
        <div className={`cfw-admin-field-container ${nested ? 'ml-7 p-4 bg-gray-100' : ''}`}>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <div dangerouslySetInnerHTML={{ __html: notice }} />
            {!enabled ? (
                <div className="cfw_textarea_placeholder"></div>
            ) : (
                <ReactQuill
                    theme="snow"
                    value={field.value}
                    onChange={handleChange}
                />
            )}
            <p className="mt-2 text-sm text-gray-500">
                {description}
            </p>
        </div>
    );
};

export default withVisibilityControl( TextareaField );
