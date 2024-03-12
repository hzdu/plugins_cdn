import React                                from 'react';
import { useSelect }                        from '@wordpress/data';
import ReviewPaneItem                       from './ReviewPane/ReviewPaneItem';
import DataStores                           from '../DataStores';
import { CartTotalsData }                   from '../../interfaces/CartTotalInterface';

const CartTotalsReview = () => {
    const totals = useSelect( ( select: any ) => select( DataStores.cart_store_key ).getCartTotals( null ), [] ) as CartTotalsData;

    return (
        <ul className="cfw-review-pane cfw-module">
            <ReviewPaneItem
                label={totals.subtotal.label}
                content={totals.subtotal.value}
                showChangeLink={false}
            />

            {totals.coupons.map( ( coupon ) => (
                <ReviewPaneItem
                    key={coupon.code}
                    label={coupon.label}
                    content={coupon.value}
                    showChangeLink={false}
                />
            ) )}

            {typeof totals.shipping !== 'undefined' && (
                <ReviewPaneItem
                    label={totals.shipping.label}
                    content={totals.shipping.value}
                    showChangeLink={false}
                />
            )}

            {totals.fees.map( ( fee, index ) => (
                <ReviewPaneItem
                    key={index}
                    label={fee.label}
                    content={fee.value}
                    showChangeLink={false}
                />
            ) )}

            {totals.taxes.map( ( tax, index ) => (
                <ReviewPaneItem
                    key={index}
                    label={tax.label}
                    content={tax.value}
                    showChangeLink={false}
                />
            ) )}

            <ReviewPaneItem
                wrapperClass={'cfw-order-review-total'}
                label={totals.total.label}
                content={totals.total.value}
                showChangeLink={false}
            />
        </ul>
    );
};

export default CartTotalsReview;
