import React from 'react';
import CartItemInterface from '../../interfaces/CartItemInterface';
interface CartTableRowProps {
    item: CartItemInterface;
    updateItem: (item: CartItemInterface) => void;
}
declare const CheckoutCartTableRow: ({ item, updateItem }: CartTableRowProps) => React.JSX.Element;
export default CheckoutCartTableRow;
