import React from 'react';
type PrimaryButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    label: string;
};
declare const PrimaryButton: React.FC<PrimaryButtonProps>;
export default PrimaryButton;
