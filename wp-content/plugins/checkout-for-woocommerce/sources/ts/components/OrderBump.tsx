import React, { useEffect }                           from 'react';
import ReactHtmlParser                                from 'react-html-parser';
import { Bump }                                       from '../Types/BumpTypes';
import withProductModal                               from '../frontend/Components/withProductModal';

const OrderBump = ( { bump, updateBump, openModal, closeModal, containerId } ) => {
    const {
        id,
        offerProductId,
        offerLanguage,
        offerDescription,
        offerPrice,
        variationParent,
        wrappedThumb,
        selected,
    } = bump as Bump;

    useEffect( () => {
        jQuery( document.body ).on( 'cfw_product_modal_closed', () => {
            // Hacky, so sue me
            jQuery( `input.cfw_order_bump_check[value=${id}]` ).prop( 'checked', false );
        } );

        jQuery( document.body  ).on( `click.${containerId}`, `.${containerId} .cfw-bump-reject`, ( e ) => {
            e.preventDefault();
            closeModal();
        } );

        if ( selected ) {
            openModal( bump.id );
        }

        return () => {
            jQuery( document.body ).off( 'cfw_product_modal_closed' );
            jQuery( document.body ).off( `click.${containerId}` );
        };
    }, [] );

    return (
        <div className="cfw-order-bump cfw-module">
            <input type="hidden" name="cfw_displayed_order_bump[]" value={id} />

            <div className="cfw-order-bump-header">
                <label>
                    <input
                        type="checkbox"
                        className="cfw_order_bump_check"
                        value={id}
                        data-parsley-excluded={'true'}
                        data-variable={variationParent ? 'true' : 'false'}
                        data-product={offerProductId} // Assuming offerProduct is an object with a get_id method
                        onChange={( e ) => {
                            if ( variationParent ) {
                                openModal( bump.id );
                                return;
                            }
                            updateBump( { ...bump, selected: e.target.checked } );
                        }}
                    />
                    <span dangerouslySetInnerHTML={{ __html: offerLanguage }} />
                </label>
            </div>

            <div className="cfw-order-bump-body">
                <div className="row">
                    <div className="col-2" dangerouslySetInnerHTML={{ __html: wrappedThumb }} />
                    <div className="col-10 cfw-order-bump-content">
                        {ReactHtmlParser( offerDescription )}

                        <div className="cfw-order-bump-total" dangerouslySetInnerHTML={{ __html: offerPrice }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withProductModal( OrderBump, 'checkoutwc/v1/modal-order-bump-product-form' );
