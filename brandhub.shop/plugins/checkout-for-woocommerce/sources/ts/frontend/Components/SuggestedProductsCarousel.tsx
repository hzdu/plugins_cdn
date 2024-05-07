import React                                        from 'react';
import { useSelect }                                from '@wordpress/data';
import Slider                                       from 'react-slick';
import { Markup }                                   from 'interweave';
import DataService                                  from '../Services/DataService';
import SideCartData, { SuggestedProduct }           from '../../interfaces/SideCartData';
import DataStores                                   from '../DataStores';
import cfwAjax                                      from '../../functions/cfwAjax';
import withProductModal                             from './withProductModal';

const SuggestedProductsCarousel = ( { openModal } ) => {
    const sideCartData = useSelect( ( select: any ) => select( DataStores.cart_store_key ).getSideCartData( null ), [] ) as SideCartData;

    let options = {
        dots: true,
        arrows: false,
        rtl: false,
        infinite: false, // without this, slider does not work with one item. see: https://github.com/akiran/react-slick/issues/2050
    };

    if ( DataService.getCheckoutParam( 'is_rtl' ) ) {
        options = {
            ...options,
            rtl: true,
        };
    }

    if ( sideCartData.suggested_products.length === 0 ) {
        return null;
    }

    return (
        <div className="cfw-suggested-products-wrap">
            <h4 className="cfw-suggested-products-heading" dangerouslySetInnerHTML={ { __html: DataService.getSetting( 'suggested_products_heading' ) }}></h4>
            <Slider {...options} className="cfw-suggested-products">
                {sideCartData.suggested_products.map( ( product: SuggestedProduct, index ) => (
                    <div key={index} className="cfw-suggested-product">
                        <div className="row">
                            {product.imageTag && (
                                <div className="col-2">
                                    <Markup content={product.imageTag} noWrap={true} />
                                </div>
                            )}
                            <div className="cfw-suggested-product-description col">
                                <div className="cfw-suggested-product-title" dangerouslySetInnerHTML={ { __html: product.title } } />

                                {product.afterTitle && (
                                    <div className="cfw-suggested-product-after-title" dangerouslySetInnerHTML={ { __html: product.afterTitle }} />
                                )}

                                <div className="cfw-suggested-product-price">
                                    {DataService.getSetting( 'show_item_discount' ) && (
                                        <Markup content={product.priceHtml} noWrap={true} />
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    className="cfw-suggested-product-add-to-cart cfw-secondary-btn"
                                    onClick={() => {
                                        if ( product.isVariable ) {
                                            openModal( product.productId );
                                        }

                                        return cfwAjax( 'cfw_add_to_cart', {
                                            type: 'POST',
                                            data: {
                                                'add-to-cart': product.productId,
                                            },
                                            dataType: 'json',
                                            cache: false,
                                        } ).done(
                                            ( resp ) => {
                                                jQuery( document.body ).trigger( 'cfw_suggested_variable_product_added_to_cart', [ resp ] );
                                            },
                                        );
                                    }}
                                >
                                    {product.addToCartText}
                                </button>
                            </div>
                        </div>
                    </div>
                ) )}
            </Slider>
        </div>
    );
};

export default withProductModal( SuggestedProductsCarousel, 'checkoutwc/v1/get-variation-form' );
