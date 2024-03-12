import React                                       from 'react';
import { Markup }                                  from 'interweave';
import { ReactSVG }                                from 'react-svg';
import DataService                                 from '../Services/DataService';

const SideCartIcon = ( { quantity, additionalClass = '' } ) => (
    <div className={`cfw-side-cart-quantity-wrap ${additionalClass}`}>
        <ReactSVG src={DataService.getSetting( 'cart_icon_url' )} />

        {quantity > 0
            ? (
                <div className="cfw-side-cart-quantity" dangerouslySetInnerHTML={ { __html: quantity } }>
                </div>
            ) : null
        }
    </div>
);

export default SideCartIcon;
