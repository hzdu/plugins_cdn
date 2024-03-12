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
            <h3 className="cfw-shipping-methods-heading">
                <Markup content={DataService.getMessage( 'shipping_methods_heading' )} noWrap={true} />
            </h3>

            {ReactHtmlParser( actions.cfw_after_shipping_method_heading )}

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

            <div dangerouslySetInnerHTML={{ __html: actions.cfw_checkout_after_shipping_methods }} />
        </>
    );
};

export default ShippingPackages;
