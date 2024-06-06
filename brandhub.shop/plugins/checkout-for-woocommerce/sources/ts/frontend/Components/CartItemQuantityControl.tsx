import React                   from 'react';
import MinusIcon               from '@heroicons/react/16/solid/MinusIcon';
import PlusIcon                from '@heroicons/react/16/solid/PlusIcon';
import DataService             from '../Services/DataService';
import cfwGetWPHooks           from '../../functions/cfwGetWPHooks';

const CartItemQuantityControl = ( { quantity, setQuantity, min, max, step } ) => {
    const onDecrement = () => {
        const newQuantity = Math.max( quantity - step, min );
        // eslint-disable-next-line no-alert
        if ( newQuantity > 0 || window.confirm( DataService.getMessage( 'delete_confirm_message' ) ) ) {
            setQuantity( newQuantity );
        }
    };

    const onIncrement = () => {
        const newQuantity = Math.min( quantity + step, max );
        setQuantity( newQuantity );
    };

    const handleBulkEditClick = () => {
        if ( cfwGetWPHooks().applyFilters( 'cfw_js_disable_cart_quantity_prompt', DataService.getSetting( 'disable_cart_quantity_prompt' ) ) ) {
            return;
        }

        // eslint-disable-next-line no-alert
        const response = window.prompt( DataService.getMessage( 'quantity_prompt_message' ), quantity.toString() );

        if ( response !== null ) {
            let newQuantity = Number( response );

            if ( newQuantity > 0 && newQuantity < min ) {
                newQuantity = min;
            }

            if ( newQuantity > max ) {
                newQuantity = max;
            }

            // Make sure newQuantity is a multiple of step
            newQuantity = Math.round( newQuantity / step ) * step;

            if ( newQuantity > 0 || window.confirm( DataService.getMessage( 'delete_confirm_message' ) ) ) {
                setQuantity( newQuantity );
            }
        }
    };

    return (
        <div className="cfw-edit-item-quantity-control-wrap">
            <div className="cfw-quantity-stepper">
                <button
                    type="button"
                    aria-label="Decrement"
                    className={`cfw-quantity-stepper-btn-minus ${quantity === min ? 'cfw-disabled' : ''}`}
                    onClick={onDecrement}
                >
                    <MinusIcon className="h-4 w-4" />
                </button>
                <a
                    className={`cfw-quantity-stepper-value-label ${max === quantity ? '' : 'cfw-quantity-bulk-edit'}`}
                    aria-label="Edit"
                    onClick={handleBulkEditClick}
                >
                    {quantity}
                </a>
                <button
                    type="button"
                    aria-label="Increment"
                    className={`cfw-quantity-stepper-btn-plus ${max === quantity ? 'cfw-disabled' : ''}`}
                    onClick={onIncrement}
                >
                    <PlusIcon className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

export default CartItemQuantityControl;
