import React, { useState } from 'react';

const PromoFieldInput = ( { label, placeholder, value, setValue } ) => {
    const floatClass = value !== '' ? 'cfw-label-is-floated' : '';
    const [ id ] = useState( () => `component-${Math.random().toString( 16 ).slice( 2 )}` );

    return (
        <p
            className={`form-row cfw-text-input cfw-input-wrap ${floatClass}`}
            data-priority=""
        >
            <label
                htmlFor={id}
                className="cfw-floatable-label"
            >
                {label}
            </label>
            <span className="woocommerce-input-wrapper">
                <input
                    type="text"
                    className="input-text"
                    data-persist={'false'}
                    id={id}
                    placeholder={placeholder}
                    value={value}
                    onChange={( e ) => setValue( e.target.value )}
                />
            </span>
        </p>
    );
};

export default PromoFieldInput;
