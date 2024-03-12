import React from 'react';

const TextField = ( { label, value, onChange, placeholder, show = true, child = false } ) => (
    <div className={`cfw-admin-field-container ${child ? 'ml-7 p-4 bg-gray-100' : ''}`} style={ !show ? { display: 'none' } : {}}>
        <label htmlFor={`cfw_admin_text_field_${value}`} className="block text-sm font-medium text-gray-700">{label}</label>
        <input
            id={`cfw_admin_text_field_${value}`}
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
        />
        <p className="mt-2 text-sm text-gray-500">{placeholder}</p>
    </div>
);

export default TextField;
