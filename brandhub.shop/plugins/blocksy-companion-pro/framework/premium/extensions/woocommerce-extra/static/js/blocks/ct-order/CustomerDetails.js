import { createElement } from '@wordpress/element'
import { __ } from 'ct-i18n'

const CustomerDetails = () => {
	return (
		<section className="woocommerce-customer-details">
			<section className="woocommerce-columns woocommerce-columns--2 woocommerce-columns--addresses col2-set addresses">
				<div className="woocommerce-column woocommerce-column--1 woocommerce-column--billing-address col-1">
					<h2 className="woocommerce-column__title">
						{__('Billing address', 'blocksy-companion')}
					</h2>

					<address>
						John Doe
						<br />
						Runolfsdottir Cove, 39811 Herbert Extensions Apt. 862
						<br />
						Washington
						<br />
						23676
						<br />
						United States
						<p className="woocommerce-customer-details--phone">
							+123 456-5789
						</p>
						<p className="woocommerce-customer-details--email">
							info@company.com
						</p>
					</address>
				</div>

				<div className="woocommerce-column woocommerce-column--2 woocommerce-column--shipping-address col-2">
					<h2 className="woocommerce-column__title">
						{__('Shipping address', 'blocksy-companion')}
					</h2>
					<address>
						John Doe
						<br />
						Runolfsdottir Cove, 39811 Herbert Extensions Apt. 862
						<br />
						Washington
						<br />
						23676
						<br />
						United States
					</address>
				</div>
			</section>
		</section>
	)
}

export default CustomerDetails
