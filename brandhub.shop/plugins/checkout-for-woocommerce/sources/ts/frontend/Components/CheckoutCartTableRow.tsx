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

const CheckoutCartTableRow = ( { item, updateItem }: CartTableRowProps ) => (
    <tr className={`cart-item-row cart-item-${item.item_key} ${item.row_class}`} data-product_sku={item.product_sku}>
        { item.thumbnail.length ? (
            <td className="cfw-cart-item-image">
                <div className="cfw-cart-item-image-wrap">
                    { DataService.getSetting( 'link_items' ) ? (
                        <a target={ DataService.getSetting( 'cart_item_link_target_new_window' ) ? '_blank' : '_self' } href={item.url} dangerouslySetInnerHTML={{ __html: item.thumbnail }} />
                    ) : (
                        <span dangerouslySetInnerHTML={{ __html: item.thumbnail }} />
                    ) }
                    { ( item.disable_cart_editing_at_checkout || item.has_quantity_override ) && (
                        <span className="cfw-cart-item-quantity-bubble">
                            <Markup content={item.quantity.toString()} noWrap={true} />
                        </span>
                    ) }
                </div>
            </td>
        ) : null }
        <th className="cfw-cart-item-description" colSpan={ !item.thumbnail.length ? 2 : undefined }>
            <div className="cfw-cart-item-title">
                { DataService.getSetting( 'link_items' ) ? (
                    <a target={ DataService.getSetting( 'cart_item_link_target_new_window' ) ? '_blank' : '_self' } href={item.url} dangerouslySetInnerHTML={ { __html: item.title }} />
                ) : (
                    <span dangerouslySetInnerHTML={ { __html: item.title }} />
                ) }
            </div>
            { DataService.getSetting( 'show_item_discount' ) && (
                <div className="cfw-items-summary-item-discount">
                    <Markup content={item.discount_html} noWrap={true} />
                </div>
            ) }
            { item.formatted_data.length > 0 && (
                <div className="cfw-cart-item-data">
                    <Markup content={item.formatted_data} noWrap={true} />
                </div>
            ) }

            <div className="cfw_cart_item_after_data">
                {ReactHtmlParser( item.actions?.cfw_cart_item_after_data ?? '' )}

                {!item.disable_cart_editing_at_checkout && !item.has_quantity_override && (
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
                ) }

                { !item.disable_cart_variation_editing_checkout && (
                    <CartItemEditVariationLink item={item} />
                ) }
            </div>
        </th>
        <td className="cfw-cart-item-quantity visually-hidden">
            <Markup content={item.quantity.toString()} noWrap={true} />
        </td>
        <td className="cfw-cart-item-subtotal">
            {ReactHtmlParser( item.actions?.cfw_before_cart_item_subtotal ? item.actions?.cfw_before_cart_item_subtotal : '' )}

            { !item.hide_remove_item && DataService.getSetting( 'show_item_remove_button' ) && (
                <CartItemRemoveButton
                    handleRemove={() => {
                        const updatedItem = { ...item, quantity: 0 };
                        updateItem( updatedItem );
                    }}
                />
            ) }

            <Markup content={item.subtotal} noWrap={true} />
        </td>
    </tr>
);

export default CheckoutCartTableRow;
