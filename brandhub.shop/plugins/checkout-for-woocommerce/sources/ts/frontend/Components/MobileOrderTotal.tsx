import React                                from 'react';
import { Markup }                           from 'interweave';
import { useSelect }                        from '@wordpress/data';
import DataStores                           from '../DataStores';
import { CartTotalsData }                   from '../../interfaces/CartTotalInterface';

const MobileOrderTotal = () => {
    const totals = useSelect( ( select: any ) => select( DataStores.cart_store_key ).getCartTotals( null ), [] ) as CartTotalsData;

    return (
        <Markup content={totals.total.value} noWrap={true} />
    );
};

export default MobileOrderTotal;
