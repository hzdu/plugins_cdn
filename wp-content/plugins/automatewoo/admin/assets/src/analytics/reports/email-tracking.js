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
		key: 'sent',
		href: '',
		label: __( 'Sent', 'automatewoo' ),
		labelTooltipText: __( 'Trackable messages sent', 'automatewoo' ),
	},
	{
		key: 'opens',
		href: '',
		label: __( 'Opens', 'automatewoo' ),
		labelTooltipText: __( 'Unique opens', 'automatewoo' ),
	},
	{
		key: 'unique-clicks',
		href: '',
		label: __( 'Unique clicks', 'automatewoo' ),
	},
	{
		key: 'clicks',
		href: '',
		label: __( 'Clicks', 'automatewoo' ),
	},
	{
		key: 'unsubscribers',
		href: '',
		label: __( 'Unsubscribers', 'automatewoo' ),
	},
];

/**
 * Mocked email & sms tracking report.
 *
 * @param {Object} props       Props provided by WooCommerce routing.
 * @param {Object} props.query
 * @param {string} props.path
 */
export default function EmailTrackingReport( { query, path } ) {
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
