/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { TableCard } from '@woocommerce/components';
import { CheckboxControl } from '@wordpress/components';

const headers = [
	{
		key: 'select',
		label: <CheckboxControl />,
		required: true,
	},
	{
		key: 'order',
		label: __( 'Order', 'automatewoo' ),
		isLeftAligned: true,
	},
	{
		key: 'customer',
		label: __( 'Customer', 'automatewoo' ),
		isLeftAligned: true,
	},
	{
		key: 'Workflow',
		label: __( 'Workflow', 'automatewoo' ),
		isLeftAligned: true,
	},
	{
		key: 'log',
		label: __( 'Log', 'automatewoo' ),
		isLeftAligned: true,
	},
	{
		key: 'interacted',
		label: __( 'First Interacted', 'automatewoo' ),
	},
	{
		key: 'placed',
		label: __( 'Order Placed', 'automatewoo' ),
	},
	{
		key: 'total',
		label: __( 'Order Total', 'automatewoo' ),
		isCurrency: true,
	},
];

/**
 * Mocked conversions list report.
 */
export default function ConversionsListReport() {
	return <TableCard headers={ headers } />;
}
