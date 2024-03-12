import React                      from 'react';
import { SelectControl }          from '@wordpress/components';

const MetaboxSelect = ( { label, options, value, onChange } ) => (
    <>
        <SelectControl
            label={label}
            value={ value }
            options={options}
            onChange={onChange}
        />
    </>
);
export default MetaboxSelect;
