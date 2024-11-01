import React from 'react';
import CartItemInterface from '../../interfaces/CartItemInterface';
interface CartTableRowProps {
    item: CartItemInterface;
    updateItem: (item: CartItemInterface) => void;
}
declare const CartTableRow: ({ item, updateItem }: CartTableRowProps) => React.JSX.Element;
export default CartTableRow;
