import React              from 'react';
import { useSelect }      from '@wordpress/data';
import DataStores         from '../DataStores';
import DataService        from '../Services/DataService';
import SideCartIcon       from './SideCartIcon';

const SideCartFloatingButton: React.FC = () => {
    const isEmpty = useSelect( ( select: any ) => select( DataStores.cart_store_key ).getCartIsEmpty( null ), [] );

    let shouldHideButton = false;

    if ( isEmpty && DataService.getSetting( 'hide_floating_cart_button_empty_cart' ) ) {
        shouldHideButton = true;
    }

    if ( shouldHideButton ) {
        return ( <></> );
    }

    return (
        <a
            className="cfw-side-cart-open-trigger cfw-side-cart-floating-button-anchor"
            aria-expanded="false"
            aria-controls="cfw_side_cart"
            tabIndex={10}
            role="button"
            aria-label="View cart"
        >
            <SideCartIcon />
        </a>
    );
};

export default SideCartFloatingButton;
