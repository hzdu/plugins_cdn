import React                                                      from 'react';
import { Markup }                                                 from 'interweave';
import ReactHtmlParser                                            from 'react-html-parser';
import CartItemInterface                                          from '../../interfaces/CartItemInterface';
import DataService                                                from '../Services/DataService';
import CartItemQuantityControl                                    from './CartItemQuantityControl';
import CartItemRemoveButton                                       from './CartItemRemoveButton';
import CartItemEditVariationLink                                  from './CartItemEditVariationLink';

interface CartTableRowProps {
    item: CartItemInterface;
    updateItem: ( item: CartItemInterface ) => void;
}

const CartTableRow = ( { item, updateItem }: CartTableRowProps ) => (
    <tr className={`cart-item-row cart-item-${item.item_key} ${item.row_class}`} data-product_sku={item.product_sku}>
        { item.thumbnail.length ? (
            <td className="cfw-cart-item-image">
                <div className="cfw-cart-item-image-wrap">
                    { DataService.getSetting( 'link_items' ) ? (
                        <a target="_blank" href={item.url}>
                            <Markup content={item.thumbnail} noWrap={true} />
                        </a>
                    ) : (
                        <Markup content={item.thumbnail} noWrap={true} />
                    ) }
                    { !DataService.getSetting( 'enable_cart_editing' ) || item.has_quantity_override ? (
                        <span className="cfw-cart-item-quantity-bubble">
                            <Markup content={item.quantity.toString()} noWrap={true} />
                        </span>
                    ) : null }
                </div>
            </td>
        ) : null }
        <th className="cfw-cart-item-description" colSpan={ !item.thumbnail.length ? 2 : undefined }>
            <div className="cfw-cart-item-title">
                { DataService.getSetting( 'link_items' ) ? (
                    <a target="_blank" href={item.url}>
                        <Markup content={item.title} noWrap={true} />
                    </a>
                ) : (
                    <Markup content={item.title} noWrap={true} />
                ) }
            </div>
            { DataService.getSetting( 'show_item_discount' ) ? (
                <div className="cfw-items-summary-item-discount">
                    <Markup content={item.discount_html} noWrap={true} />
                </div>
            ) : null }
            { item.formatted_data.length ? (
                <div className="cfw-cart-item-data">
                    <Markup content={item.formatted_data} noWrap={true} />
                </div>
            ) : null }

            <div className="cfw_cart_item_after_data">
                {!item.disable_cart_editing ? (
                    <CartItemQuantityControl
                        quantity={item.quantity}
                        setQuantity={( newQuantity: number ) => {
                            const updatedItem = { ...item, quantity: newQuantity };
                            updateItem( updatedItem );
                        }}
                        min={item.min_quantity}
                        max={item.max_quantity}
                        step={item.step}
                    />
                ) : null }

                {!item.disable_cart_variation_editing ? (
                    <CartItemEditVariationLink item={item} />
                ) : null }

                {ReactHtmlParser( item.actions.cfw_cart_item_after_data ?? '' )}
            </div>
        </th>
        <td className="cfw-cart-item-quantity visually-hidden">
            <Markup content={item.quantity.toString()} noWrap={true} />
        </td>
        <td className="cfw-cart-item-subtotal">
            {ReactHtmlParser( item.actions.cfw_before_cart_item_subtotal ? item.actions.cfw_before_cart_item_subtotal : '' )}
            <CartItemRemoveButton
                handleRemove={() => {
                    const updatedItem = { ...item, quantity: 0 };
                    updateItem( updatedItem );
                }}
            />
            <Markup content={item.subtotal} noWrap={true} />
        </td>
    </tr>
);

export default CartTableRow;
