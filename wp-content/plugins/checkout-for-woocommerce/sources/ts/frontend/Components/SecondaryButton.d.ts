import React from 'react';
type SecondaryButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    label: string;
};
declare const SecondaryButton: React.FC<SecondaryButtonProps>;
export default SecondaryButton;
