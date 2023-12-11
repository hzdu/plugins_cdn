/**
 * External dependencies
 */
/** global ywraq_gateway_settings **/

import { decodeEntities } from '@wordpress/html-entities';
const { registerPaymentMethod } = wc.wcBlocksRegistry;
/**
 * Internal dependencies
 */
import { PAYMENT_METHOD_NAME } from './constants';


const label = decodeEntities( ywraq_gateway_settings.title ) ;

/**
 * Content component
 */
const Content = () => {
  return decodeEntities( ywraq_gateway_settings.description || '' );
};

/**
 * Label component
 *
 * @param {*} props Props from payment API.
 */
const Label = ( props ) => {
  const { PaymentMethodLabel } = props.components;
  return <PaymentMethodLabel text={ ywraq_gateway_settings.title } />;
};

/**
 * Bank transfer (BACS) payment method config object.
 */
const quotePaymentMethod = {
  name: PAYMENT_METHOD_NAME,
  label: <Label />,
  content: <Content />,
  edit: <Content />,
  canMakePayment: () => true,
  ariaLabel: label,
  supports: {
    features: ['products'],
  },
};

registerPaymentMethod( quotePaymentMethod );
