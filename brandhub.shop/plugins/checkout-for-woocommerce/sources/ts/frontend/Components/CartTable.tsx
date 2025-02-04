import React                                   from 'react';
import { dispatch, useSelect }                 from '@wordpress/data';
import ReactHtmlParser                         from 'react-html-parser';
import CartItemInterface                       from '../../interfaces/CartItemInterface';
import CartTableRow                            from './CartTableRow';
import DataStores                              from '../DataStores';
import LoggingService                          from '../Services/LoggingService';
import DataService                             from '../Services/DataService';
import FreeShippingProgressBar                 from './FreeShippingProgressBar';
import cfwDangerouslyOutputTableRowAction      from '../../functions/cfwDangerouslyOutputTableRowAction';

const CartTable: React.FC = () => {
    const isEmpty = useSelect( ( select: any ) => select( DataStores.cart_store_key ).getCartIsEmpty( null ), [] );
    const items = useSelect( ( select: any ) => select( DataStores.cart_store_key ).getCartItems( null ), [] );
    const shippingData = useSelect( ( select: any ) => select( DataStores.cart_store_key ).getShippingData( null ), [] );
    const staticActions = useSelect( ( select: any ) => select( DataStores.cart_store_key ).getCartStaticActions( null ), [] );
    const actions = useSelect( ( select: any ) => select( DataStores.cart_store_key ).getCartActions( null ), [] );

    const updateItem = ( item: CartItemInterface ) => {
        // Find the index of the item to update
        const index = items.findIndex( ( i: CartItemInterface ) => i.item_key === item.item_key );

        if ( index !== -1 ) {
            // Create a new array with the updated item
            const updatedItems = [ ...items ];
            updatedItems[ index ] = item;

            // Trigger update checkout event
            DataService.setRuntimeParameter( 'needsAjaxUpdate', true );
            DataService.setRuntimeParameter( 'updateCartItems', true );

            // Use dispatch to update the items in the store
            ( dispatch( DataStores.cart_store_key ) as any ).setCartItems( updatedItems );
        } else {
            LoggingService.logError( 'Cannot update item quantity. Item not found in items array.' );
        }
    };

    return (
        <>
            {
                !isEmpty
                && DataService.getSetting( 'enable_free_shipping_progress_bar' )
                && shippingData?.length ? (
                        <FreeShippingProgressBar/>
                    ) : null
            }
            <table className="cfw-cart-table cfw-module">
                <tbody>
                    {cfwDangerouslyOutputTableRowAction( staticActions?.cfw_cart_html_table_start )}
                    {items.map( ( item: CartItemInterface ) => ( <CartTableRow item={item} updateItem={updateItem} key={item.item_key} /> ) )}
                </tbody>
            </table>
            {ReactHtmlParser( actions?.cfw_after_cart_html )}
        </>
    );
};

export default CartTable;
