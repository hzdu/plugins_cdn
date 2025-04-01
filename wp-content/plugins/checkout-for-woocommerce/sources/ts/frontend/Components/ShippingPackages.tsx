import React                                                   from 'react';
import { dispatch, useSelect }                                 from '@wordpress/data';
import ReactHtmlParser                                         from 'react-html-parser';
import { Markup }                                              from 'interweave';
import DataStores                                              from '../DataStores';
import DataService                                             from '../Services/DataService';
import { ShippingPackageInterface, ShippingMethodInterface }   from '../../interfaces/ShippingPackageInterface';
import ShippingMethodsList                                     from './ShippingMethodsList';

const ShippingPackages: React.FC = () => {
    const shippingData = useSelect( ( select: any ) => select( DataStores.cart_store_key ).getShippingData( null ), [] ) as ShippingPackageInterface[];
    const actions = useSelect( ( select: any ) => select( DataStores.cart_store_key ).getCartActions( null ), [] );
    const staticActions = useSelect( ( select: any ) => select( DataStores.cart_store_key ).getCartStaticActions( null ), [] );

    const updateSelectedMethodForPackage = ( shippingPackage: ShippingPackageInterface, method: ShippingMethodInterface ) => {
        const newShippingData = shippingData.map( ( packageData: ShippingPackageInterface ) => {
            if ( packageData.index === shippingPackage.index ) {
                return {
                    ...packageData,
                    chosenMethod: method.id,
                };
            }
            return packageData;
        } );

        // Trigger update checkout event
        DataService.setRuntimeParameter( 'needsAjaxUpdate', true );
        DataService.setRuntimeParameter( 'updateSelectedShippingMethods', true );

        ( dispatch( DataStores.cart_store_key ) as any ).setShippingData( newShippingData );
    };

    return (
        <>
            {ReactHtmlParser( staticActions?.cfw_before_shipping_method_heading )}

            <h3 className="cfw-shipping-methods-heading">
                <Markup content={DataService.getMessage( 'shipping_methods_heading' )} noWrap={true} />
            </h3>

            {ReactHtmlParser( staticActions?.cfw_after_shipping_method_heading )}

            {actions?.woocommerce_review_order_before_shipping.length > 0 && (
                <table id="cfw-before-shipping">
                    <tbody dangerouslySetInnerHTML={ { __html: actions?.woocommerce_review_order_before_shipping }}></tbody>
                </table>
            )}

            <div className="cfw-module">
                {
                    shippingData.map( ( shippingPackage: ShippingPackageInterface ) => (
                        <ShippingMethodsList
                            key={shippingPackage.index}
                            packageCount={shippingData.length}
                            package={shippingPackage}
                            updateSelectedMethod={( method: ShippingMethodInterface ) => {
                                updateSelectedMethodForPackage( shippingPackage, method );
                            }}
                        />
                    ) )
                }
            </div>

            <div dangerouslySetInnerHTML={{ __html: staticActions?.cfw_checkout_after_shipping_methods }} />

            {( actions?.woocommerce_review_order_after_shipping.length > 0 || actions?.cfw_after_shipping_methods.length > 0 ) && (
                <table id="cfw-after-shipping">
                    <tbody dangerouslySetInnerHTML={ { __html: actions?.cfw_after_shipping_methods + actions?.woocommerce_review_order_after_shipping }}></tbody>
                </table>
            )}
        </>
    );
};

export default ShippingPackages;
