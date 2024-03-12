import React from 'react';

const SecondaryButton = ( { url, buttonText, onClick = null } ) => {
    // Default onClick handler if none is provided
    const defaultOnClick = ( e ) => {
        // Normal behavior: navigate to the URL
    };

    // Use the provided onClick handler if available, otherwise use the default
    const handleClick = onClick || defaultOnClick;

    return (
        <div className="cfw-admin-field-container relative flex">
            <a href={url}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={handleClick}>
                {buttonText}
            </a>
        </div>
    );
};

export default SecondaryButton;
