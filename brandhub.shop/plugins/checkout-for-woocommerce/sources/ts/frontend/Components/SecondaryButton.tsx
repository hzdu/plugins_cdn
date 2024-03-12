import React from 'react';

type SecondaryButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    label: string;
};

const SecondaryButton: React.FC<SecondaryButtonProps> = ( { label, ...props } ) => {
    const { className, ...otherProps } = props;
    const combinedClassName = `cfw-secondary-btn ${className || ''}`;

    return (
        <>
            <button
                type={'button'}
                className={combinedClassName}
                {...otherProps}
            >
                {label}
            </button>
        </>
    );
};

export default SecondaryButton;
