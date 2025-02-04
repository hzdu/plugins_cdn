// MyBlock.ts
import { registerBlockType }                      from '@wordpress/blocks';
import React, { useEffect, useState }             from 'react';
import { useBlockProps }                          from '@wordpress/block-editor';
import apiFetch                                   from '@wordpress/api-fetch';
import { useSelect }                              from '@wordpress/data';
import { useEntityProp }                          from '@wordpress/core-data';
import metadata                                   from '../../../blocks/order-bump-offer-form/block.json';

class OrderBumpOfferForm {
    name: string;

    settings: any;

    constructor() {
        this.name = 'cfw/order-bump-offer-form';
        this.settings = {
            edit: () => {
                const postId = useSelect( ( select: any ) => select( 'core/editor' ).getCurrentPostId(), [] );
                const [ html, setHtml ] = useState( '' );
                const postType = useSelect(
                    ( select: any ) => select( 'core/editor' ).getCurrentPostType(),
                    [],
                );
                const [ meta ] = useEntityProp( 'postType', postType, 'meta' );

                useEffect( () => {
                    apiFetch( { path: `checkoutwc/v1/order-bump-offer-form-preview/${meta.cfw_ob_offer_product_v9[ 0 ].key}/${postId}` } ).then( ( response ) => {
                        setHtml( response as string );
                    } );
                }, [ meta ] );

                return (
                    <div {...useBlockProps()} dangerouslySetInnerHTML={{ __html: html }}></div>
                );
            },
        };
    }

    register() {
        if ( ( window as any ).pagenow !== 'cfw_order_bumps' ) {
            return;
        }

        registerBlockType( metadata as any, this.settings );
    }
}

export default OrderBumpOfferForm;
