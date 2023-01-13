/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	ReportFilters,
	SummaryList,
	SummaryNumber,
	Chart,
} from '@woocommerce/components';
/**
 * Internal dependencies
 */
import { filtersConfig } from './filters-config';

const metrics = [
	{
		key: 'value',
		href: '',
		label: __( 'Value', 'automatewoo' ),
		labelTooltipText: __( 'Converted order value', 'automatewoo' ),
		isCurrency: true,
	},
	{
		key: 'orders',
		href: '',
		label: __( 'Orders', 'automatewoo' ),
		labelTooltipText: __( 'Converted orders', 'automatewoo' ),
	},
];

/**
 * Mocked Conversions report.
 *
 * @param {Object} props       Props provided by WooCommerce routing.
 * @param {Object} props.query
 * @param {string} props.path
 */
export default function ConversionsReport( { query, path } ) {
	return (
		<>
			<ReportFilters
				query={ query }
				path={ path }
				filters={ filtersConfig }
			/>
			<SummaryList>
				{ () =>
					metrics.map( ( metric ) => {
						const selected = false; // selectedMetric === key;
						const href = ''; // getNewPath( { selectedMetric: key } );
						return (
							<SummaryNumber
								key={ metric.key }
								href={ href }
								selected={ selected }
								{ ...metric }
								delta={ 0 }
								value="0"
								prevValue="0"
							/>
						);
					} )
				}
			</SummaryList>
			<Chart />
		</>
	);
}
