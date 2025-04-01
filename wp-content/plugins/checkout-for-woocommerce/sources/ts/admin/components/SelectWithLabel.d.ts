import React from 'react';
interface SelectWithLabelProps {
    description?: string;
    [key: string]: any;
}
declare const SelectWithLabel: ({ description, ...baseProps }: SelectWithLabelProps) => React.JSX.Element;
export default SelectWithLabel;
