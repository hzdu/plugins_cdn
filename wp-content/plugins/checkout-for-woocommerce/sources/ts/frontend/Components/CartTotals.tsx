import React                                  from 'react';
import { Markup }                             from 'interweave';
import ReactHtmlParser                        from 'react-html-parser';
import { useSelect }                          from '@wordpress/data';
import DataStores                             from '../DataStores';
import { CartCoupon, CartTotalsData }         from '../../interfaces/CartTotalInterface';
import cfwDangerouslyOutputTableRowAction     from '../../functions/cfwDangerouslyOutputTableRowAction';

const CartTotals = () => {
    const totals = useSelect( ( select: any ) => select( DataStores.cart_store_key ).getCartTotals( null ), [] ) as CartTotalsData;

    return (
        <div className="cfw-module cfw-totals-list">
            <table className="cfw-module">
                <tbody>
                    {cfwDangerouslyOutputTableRowAction( totals.actions?.cfw_before_cart_summary_totals )}

                    <tr className="cart-subtotal">
                        <th>{totals.subtotal.label}</th>
                        <td>
                            <Markup content={totals.subtotal.value} noWrap={true} />
                        </td>
                    </tr>

                    {totals.coupons.map( ( coupon: CartCoupon ) => (
                        <tr key={coupon.code} className={`cart-discount coupon-${coupon.class}`}>
                            <th>
                                <Markup content={coupon.label} noWrap={true} />
                            </th>
                            <td>
                                <Markup content={coupon.value} noWrap={true} />
                            </td>
                        </tr>
                    ) )}

                    {typeof totals.shipping !== 'undefined' && (
                        <tr className="shipping">
                            <th>
                                <Markup content={totals.shipping.label} noWrap={true} />
                            </th>
                            <td>
                                <Markup content={totals.shipping.value} noWrap={true} />
                            </td>
                        </tr>
                    )}

                    {totals.fees.map( ( fee, index ) => (
                        <tr key={index} className="fee">
                            <th>{fee.label}</th>
                            <td>
                                <Markup content={fee.value} noWrap={true} />
                            </td>
                        </tr>
                    ) )}

                    {totals.taxes.map( ( tax, index ) => (
                        <tr key={index} className={tax.class}>
                            <th>{tax.label}</th>
                            <td>
                                <Markup content={tax.value} noWrap={true} />
                            </td>
                        </tr>
                    ) )}

                    {cfwDangerouslyOutputTableRowAction( totals.actions?.woocommerce_review_order_before_order_total )}

                    <tr className="order-total">
                        <th>{totals.total.label}</th>
                        <td>
                            <Markup content={totals.total.value} noWrap={true} />
                        </td>
                    </tr>

                    {cfwDangerouslyOutputTableRowAction( totals.actions?.woocommerce_review_order_after_order_total )}
                    {cfwDangerouslyOutputTableRowAction( totals.actions?.cfw_after_cart_summary_totals )}
                </tbody>
            </table>
        </div>
    );
};

export default CartTotals;
