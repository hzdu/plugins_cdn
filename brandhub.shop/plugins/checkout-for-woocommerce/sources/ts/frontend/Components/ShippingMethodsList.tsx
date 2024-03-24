import React                                                 from 'react';
import { useSelect }                                         from '@wordpress/data';
import { Markup }                                            from 'interweave';
import ReactHtmlParser                                       from 'react-html-parser';
import DataStores                                            from '../DataStores';
import { ShippingPackageInterface, ShippingMethodInterface } from '../../interfaces/ShippingPackageInterface';
import DataService                                           from '../Services/DataService';

type ShippingProps = {
    packageCount: number,
    package: ShippingPackageInterface,
    updateSelectedMethod: ( method: ShippingMethodInterface ) => void,
};

const ShippingMethodsList: React.FC<ShippingProps> = (
    {
        packageCount,
        package: {
            index,
            packageName,
            packageDetails,
            availableMethods,
            chosenMethod,
        },
        updateSelectedMethod,
    },
) => (
    <div>
        {availableMethods.length > 0 ? (
            <>
                {packageCount > 1 && <h4 className="cfw-shipping-package-title">{packageName}</h4>}

                <ul id="shipping_method" className="cfw-shipping-methods-list">
                    {availableMethods.map( ( method ) => (
                        <li key={method.id}>
                            <div className="cfw-shipping-method-inner">
                                <input
                                    type="radio"
                                    name={`shipping_method[${index}]`}
                                    data-index={index}
                                    id={`shipping_method_${index}_${method.sanitizedId}`}
                                    value={method.id}
                                    className="shipping_method"
                                    checked={method.id === chosenMethod}
                                    onChange={() => updateSelectedMethod( method )}
                                    data-persist={false}
                                />
                                <label
                                    htmlFor={`shipping_method_${index}_${method.sanitizedId}`}
                                    onClick={() => updateSelectedMethod( method )}
                                    dangerouslySetInnerHTML={{ __html: method.label }}
                                >
                                </label>
                            </div>

                            {/* eslint-disable-next-line max-len */}
                            {method.actions?.woocommerce_after_shipping_rate.trim() && /<thead|<tbody|<tfoot|<th|<tr/.test( method.actions?.woocommerce_after_shipping_rate ) && method.actions?.woocommerce_after_shipping_rate.trim().substring( 0, 6 ) !== '<table' ? (
                                <table dangerouslySetInnerHTML={{ __html: method.actions?.woocommerce_after_shipping_rate }} />
                            ) : (
                                <div dangerouslySetInnerHTML={{ __html: method.actions?.woocommerce_after_shipping_rate }} />
                            )}
                        </li>
                    ) )}
                </ul>
            </>
        ) : (
            <div className="shipping-message" dangerouslySetInnerHTML={ { __html: DataService.getMessage( 'no_shipping_methods_notice' ) } }></div>
        )}

        {packageCount > 1 && (
            <p className="woocommerce-shipping-contents">
                <small>
                    <Markup content={packageDetails} noWrap={true}/>
                </small>
            </p>
        )}
    </div>
);

export default ShippingMethodsList;
