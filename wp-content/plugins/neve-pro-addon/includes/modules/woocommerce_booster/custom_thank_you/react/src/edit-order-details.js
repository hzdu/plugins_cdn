import { Disabled, TextControl } from '@wordpress/components';
import { useBlockProps } from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';
import { __ } from '@wordpress/i18n';

const editOrderDetails = ( props ) => {
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const blockProps = useBlockProps();

	return (
		<>
			<div { ...blockProps }>
				<TextControl
					label={ __(
						'Please enter an order ID to preview of the order details block.',
						'neve'
					) }
					onChange={ ( value ) => {
						props.setAttributes( { orderId: value } );
					} }
				/>
				<Disabled>
					<ServerSideRender
						block="neve-pro-addon/neve-custom-thank-you"
						attributes={ {
							orderId: props.attributes.orderId,
							previewMode: true,
						} }
					/>
				</Disabled>
			</div>
		</>
	);
};

export default editOrderDetails;
