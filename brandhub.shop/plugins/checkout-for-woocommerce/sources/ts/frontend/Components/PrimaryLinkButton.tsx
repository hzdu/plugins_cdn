import React                                   from 'react';

const PrimaryLinkButton = ( { label, href, ...props } ) => (
    <>
        <a
            href={href}
            className="cfw-primary-btn"
            {...props}
        >
            { label }
        </a>
    </>
);

export default PrimaryLinkButton;
