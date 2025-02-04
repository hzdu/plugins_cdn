import { registerPlugin }                                                                  from '@wordpress/plugins';
import React                                                                               from 'react';
import { registerBlockType }                                                               from '@wordpress/blocks';
import { useEntityProp }                                                                   from '@wordpress/core-data';
import apiFetch                                                                            from '@wordpress/api-fetch';
import { useState, useEffect }                                                             from '@wordpress/element';
import { useSelect }                                                                       from '@wordpress/data';
import OrderBumpsDisplayConditions                                                         from './Components/Metaboxes/OrderBumpsDisplayConditions';
import OrderBumpsOfferPanel                                                                from './Components/Metaboxes/OrderBumpsOfferPanel';
import OrderBumpsActionsPanel                                                              from './Components/Metaboxes/OrderBumpsActionsPanel';
import OrderBump                                                                           from '../components/OrderBump';
import OrderBumpsDisplayLocation                                                           from './Components/Metaboxes/OrderBumpsDisplayLocation';
import OrderBumpsOfferDiscountPanel                                                        from './Components/Metaboxes/OrderBumpsOfferDiscountPanel';
import OrderBumpsOfferLanguagePanel                                                        from './Components/Metaboxes/OrderBumpsOfferLanguagePanel';
import OrderBumpsGeneralPanel                                                              from './Components/Metaboxes/OrderBumpsGeneralPanel';
import OrderBumpsSetupModal                                                                from './Components/Metaboxes/OrderBumpsSetupModal';

registerPlugin( 'cfw-ob-setup-modal', {
    render: OrderBumpsSetupModal,
} );

registerPlugin( 'cfw-ob-general-metabox', {
    render: OrderBumpsGeneralPanel,
    icon: 'info-outline',
} );

registerPlugin( 'cfw-ob-display-conditions-metabox', {
    render: OrderBumpsDisplayConditions,
    icon: 'ellipsis',
} );

registerPlugin( 'cfw-ob-display-location-metabox', {
    render: OrderBumpsDisplayLocation,
    icon: 'location',
} );

registerPlugin( 'cfw-ob-offer-metabox', {
    render: OrderBumpsOfferPanel,
    icon: 'awards',
} );

registerPlugin( 'cfw-ob-offer-discount-metabox', {
    render: OrderBumpsOfferDiscountPanel,
    icon: 'money-alt',
} );

registerPlugin( 'cfw-ob-offer-language-metabox', {
    render: OrderBumpsOfferLanguagePanel,
    icon: 'translation',
} );

registerPlugin( 'cfw-ob-actions-metabox', {
    render: OrderBumpsActionsPanel,
    icon: 'controls-play',
} );

registerBlockType( 'cfw/order-bump-preview', {
    title: 'Order Bump Preview',
    icon: 'cart',
    category: 'widgets',
    attributes: {},
    supports: {
        multiple: false,
    },
    edit: ( { attributes, setAttributes } ) => {
        const postType = useSelect(
            ( select: any ) => select( 'core/editor' ).getCurrentPostType(),
            [],
        );
        const [ meta ] = useEntityProp( 'postType', postType, 'meta' );
        const [ wrappedThumb, setWrappedThumb ] = useState( '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#cccccc"/></svg>' );
        const [ offerPrice, setOfferPrice ] = useState( '' );

        const getProductData = async ( productId ) => {
            try {
                const product = await apiFetch( {
                    path: `/wc/v3/products/${productId}`,
                    method: 'GET',
                } ) as any;
                return {
                    featuredImageUrl: product.images.length > 0 ? product.images[ 0 ].src : null,
                    price: product.price_html,
                };
            } catch ( error ) {
                console.error( 'Error fetching product data:', error );
            }
        };

        useEffect( () => {
            const fetchProductData = async () => {
                const productData = await getProductData( meta.cfw_ob_offer_product_v9[ 0 ].key ) as any;
                setWrappedThumb( productData.featuredImageUrl ? `<img src="${productData.featuredImageUrl}" alt="Featured Image">` : null );
                setOfferPrice( productData.price );
            };

            if ( meta?.cfw_ob_offer_product_v9 ) {
                fetchProductData();
            }
        }, [ meta.cfw_ob_offer_product_v9 ] );

        return (
            <div className={'cfw-order-bumps'}>
                <OrderBump
                    bump={{
                        id: '123',
                        offerProductId: meta.cfw_ob_offer_product_v9,
                        wrappedThumb,
                        offerDescription: meta.cfw_ob_offer_description,
                        offerLanguage: meta.cfw_ob_offer_language,
                        offerPrice: `${offerPrice}`,
                        variationParent: false,
                        location: 'below_cart_items',
                        selected: false,
                    }}
                    updateBump={ () => {} }
                />
                <p style={ { fontSize: '13px', marginTop: '0.5em', textAlign: 'center' }}><em>Note: This is just a preview. The price shown will not be properly discounted in this context.</em></p>
            </div>
        );
    },
    save: () => null,
} );
