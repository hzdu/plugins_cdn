import { ColorPicker }              from '@wordpress/components';
import { useField }                 from 'formik';
import React                        from 'react';
import withVisibilityControl        from '../withVisibilityControl';

const ColorPickerField = ( { label, name, nested = false, additionalClasses = [], defaultValue = '#FFFFFF', ...props } ) => {
    const [ field, , helpers ] = useField( name );

    const handleChangeComplete = ( color ) => {
        helpers.setValue( color.hex );
    };

    const resetColor = () => {
        helpers.setValue( defaultValue );

        return false;
    };

    return (
        <div className={`cfw-admin-field-container mb-4 w-min ${additionalClasses.join( ' ' )} ${nested ? 'ml-7 p-4 bg-gray-100' : ''}`}>
            <div className="text-sm mb-2">
                <label className="font-medium text-gray-700 flex justify-between" htmlFor={name}>
                    {label}
                </label>
            </div>
            <ColorPicker
                color={field.value}
                onChangeComplete={handleChangeComplete}
                defaultValue={defaultValue}
            />
            <a
                onClick={resetColor}
                className={'rounded bg-white w-full block text-center px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 cursor-pointer'}
            >
                Reset to Default
            </a>
        </div>
    );
};

export default withVisibilityControl( ColorPickerField );
