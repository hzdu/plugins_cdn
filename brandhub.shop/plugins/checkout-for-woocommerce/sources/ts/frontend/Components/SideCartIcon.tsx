import React                                           from 'react';
import { Markup }                                      from 'interweave';
import { ReactSVG }                                    from 'react-svg';
import { useSelect }                                   from '@wordpress/data';
import DataService                                     from '../Services/DataService';
import DataStores                                      from '../DataStores';
import { CartTotalsData }                              from '../../interfaces/CartTotalInterface';

const SideCartIcon = ( { additionalClass = '' } ) => {
    const totals = useSelect( ( select: any ) => select( DataStores.cart_store_key ).getCartTotals( null ), [] ) as CartTotalsData;

    return (
        <div className={`cfw-side-cart-quantity-wrap ${additionalClass}`}>
            <ReactSVG
                beforeInjection={( svg ) => {
                    // Do any SVG elements have a stroke attribute? If not add cfw-side-cart-icon-solid class to SVG
                    const hasStroke = svg.querySelectorAll( '[stroke]' ).length > 0;
                    if ( !hasStroke ) {
                        svg.classList.add( 'cfw-side-cart-icon-solid' );
                    }
                }}
                afterInjection={( svg ) => {
                    const parent = svg.parentNode.parentNode;
                    parent.parentNode.insertBefore( svg, parent );
                    parent.parentNode.removeChild( parent );
                }}
                src={DataService.getSetting( 'cart_icon_url' )}
            />

            {totals.quantity > 0
                ? (
                    <div className="cfw-side-cart-quantity" dangerouslySetInnerHTML={{ __html: totals.quantity }}>
                    </div>
                ) : null
            }
        </div>
    );
};

export default SideCartIcon;
