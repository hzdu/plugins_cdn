import { registerPlugin } from '@wordpress/plugins';
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import editOrderDetails from './edit-order-details';
import componentMetaBoxes from './component-meta-boxes';

registerPlugin( 'nv-cty-meta-boxes', {
	render: componentMetaBoxes,
} );

registerBlockType( 'neve-pro-addon/neve-custom-thank-you', {
	apiVersion: 2,
	title: __( 'Order Details', 'neve' ),
	icon: 'admin-page',
	category: 'design',
	edit: editOrderDetails,
} );
