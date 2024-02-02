/* global nvCtyMetaOptions */
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { CheckboxControl } from '@wordpress/components';
import { State } from './state';
import { __ } from '@wordpress/i18n';

const Component = () => {
	const [ currentPaymentGateway, setPaymentGateway ] = State(
		'nv_ty_payment_gateways'
	);
	const [ currentShippingMethod, setShippingMethod ] = State(
		'nv_ty_shipping_methods'
	);

	return (
		<>
			<PluginDocumentSettingPanel
				name="shipping-methods"
				title={ __( 'Shipping Methods', 'neve' ) }
			>
				{ nvCtyMetaOptions.shipping.map( ( shippingMethod ) => (
					<CheckboxControl
						key={ shippingMethod.value }
						label={ shippingMethod.label }
						checked={ currentShippingMethod.includes(
							shippingMethod.value
						) }
						onChange={ () => {
							setShippingMethod( shippingMethod.value );
						} }
					/>
				) ) }
			</PluginDocumentSettingPanel>
			<PluginDocumentSettingPanel
				name="payment-gateway"
				title={ __( 'Payment Gateway', 'neve' ) }
			>
				{ nvCtyMetaOptions.paymentGateway.map( ( paymentGateway ) => (
					<CheckboxControl
						key={ paymentGateway.value }
						label={ paymentGateway.label }
						checked={ currentPaymentGateway.includes(
							paymentGateway.value
						) }
						onChange={ () => {
							setPaymentGateway( paymentGateway.value );
						} }
					/>
				) ) }
			</PluginDocumentSettingPanel>
		</>
	);
};

export default Component;
