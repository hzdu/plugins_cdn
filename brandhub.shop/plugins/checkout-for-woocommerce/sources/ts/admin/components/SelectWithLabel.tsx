import React                                                 from 'react';
import { BaseControl, useBaseControlProps }                  from '@wordpress/components';
import { Search }                                            from '@woocommerce/components';

const SelectWithLabel = ( { ...baseProps } ) => {
    const { baseControlProps, controlProps } = useBaseControlProps( baseProps );
    return (
        <BaseControl {...baseControlProps} >
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/*
            // @ts-ignore */}
            <Search
                { ...controlProps }
                {...baseControlProps}
            />
        </BaseControl>
    );
};
export default SelectWithLabel;
