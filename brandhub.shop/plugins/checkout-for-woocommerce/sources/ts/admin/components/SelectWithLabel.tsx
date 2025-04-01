import React                                                 from 'react';
import { BaseControl, useBaseControlProps }                  from '@wordpress/components';
import { Search }                                            from '@woocommerce/components';

interface SelectWithLabelProps {
    description?: string;
    [key: string]: any;
}

const SelectWithLabel = ( { description, ...baseProps }: SelectWithLabelProps ) => {
    const { baseControlProps, controlProps } = useBaseControlProps( baseProps );
    return (
        <BaseControl {...baseControlProps} className={'cfw-tw'} >
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/*
            // @ts-ignore */}
            <Search
                { ...controlProps }
                {...baseControlProps}
            />
            {description && (
                <p className="mt-1 text-xs text-gray-500 italic pt-2">
                    {description}
                </p>
            )}
        </BaseControl>
    );
};
export default SelectWithLabel;
