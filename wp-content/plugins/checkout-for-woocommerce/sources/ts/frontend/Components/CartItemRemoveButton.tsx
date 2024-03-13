import React                                from 'react';
import XMarkIcon                            from '@heroicons/react/16/solid/XMarkIcon';
import DataService                          from '../Services/DataService';

const CartItemRemoveButton = ( { handleRemove } ) => {
    const handleRemoveClick = ( event ) => {
        event.preventDefault();

        handleRemove();
    };
    return (
        <a
            href="#"
            className="cfw-remove-item-button"
            aria-label={DataService.getMessage( 'remove_item_label' )}
            onClick={handleRemoveClick}
        >
            <XMarkIcon className="" />
        </a>
    );
};

export default CartItemRemoveButton;
