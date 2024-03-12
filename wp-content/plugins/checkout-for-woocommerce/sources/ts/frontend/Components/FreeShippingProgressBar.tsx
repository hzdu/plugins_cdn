import React                                     from 'react';
import { useSelect }                             from '@wordpress/data';
import ReactHtmlParser                           from 'react-html-parser';
import DataStores                                from '../DataStores';

const FreeShippingProgressBar = () => {
    const sideCartData = useSelect( ( select: any ) => select( DataStores.cart_store_key ).getSideCartData( null ), [] );

    return (
        <div className="cfw-side-cart-free-shipping-progress-wrap">
            <p className="cfw-xtra-small">
                {
                    sideCartData.free_shipping_progress_bar.has_free_shipping ? (
                        <>
                            {ReactHtmlParser( sideCartData.free_shipping_progress_bar.free_shipping_message )}
                        </>
                    ) : (
                        <>
                            {ReactHtmlParser( sideCartData.free_shipping_progress_bar.amount_remaining_message )}
                        </>
                    )
                }
            </p>

            <div className="cfw-side-cart-free-shipping-progress">
                <div
                    className="cfw-side-cart-free-shipping-progress-indicator"
                    style={{ width: `${sideCartData.free_shipping_progress_bar.fill_percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

export default FreeShippingProgressBar;
