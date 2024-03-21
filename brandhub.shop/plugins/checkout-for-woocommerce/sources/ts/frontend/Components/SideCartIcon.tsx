import React                                           from 'react';
import { useSelect }                                   from '@wordpress/data';
import SVG                                             from 'react-inlinesvg';
import DataService                                     from '../Services/DataService';
import DataStores                                      from '../DataStores';
import { CartTotalsData }                              from '../../interfaces/CartTotalInterface';

const SideCartIcon = ( { additionalClass = '' } ) => {
    const totals = useSelect( ( select: any ) => select( DataStores.cart_store_key ).getCartTotals( null ), [] ) as CartTotalsData;

    return (
        <div className={`cfw-side-cart-quantity-wrap ${additionalClass}`}>
            <SVG src={DataService.getSetting( 'cart_icon_contents' )} />

            {/* Note: Always output the quantity even if it is hidden so people can show it if they want to */}
            <div className={`cfw-side-cart-quantity ${totals.quantity === 0 ? 'cfw-hidden' : ''}`} dangerouslySetInnerHTML={{ __html: totals.quantity }}></div>
        </div>
    );
};

export default SideCartIcon;
