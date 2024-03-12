import React                                   from 'react';

type PrimaryButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    label: string;
};

const PrimaryButton: React.FC<PrimaryButtonProps> = ( { label, ...props } ) => (
    <>
        <button
            type={'button'}
            className="cfw-primary-btn"
            {...props}
        >
            { label }
        </button>
    </>
);

export default PrimaryButton;
