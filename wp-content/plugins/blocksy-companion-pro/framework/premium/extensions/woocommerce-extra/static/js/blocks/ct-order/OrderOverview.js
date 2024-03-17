import { createElement } from '@wordpress/element'
import { __ } from 'ct-i18n'

const OrderOverview = () => {
	return (
		<ul className="woocommerce-order-overview woocommerce-thankyou-order-details order_details">
			<li className="woocommerce-order-overview__order order">
				{__('Order number', 'blocksy-companion')}: <strong>752</strong>
			</li>

			<li className="woocommerce-order-overview__date date">
				{__('Dete', 'blocksy-companion')}:{' '}
				<strong>
					{new Date().toLocaleDateString('en-US', {
						year: 'numeric',
						month: 'long',
						day: 'numeric',
					})}
				</strong>
			</li>

			<li className="woocommerce-order-overview__email email">
				{__('Email', 'blocksy-companion')}:{' '}
				<strong>info@company.com</strong>
			</li>

			<li className="woocommerce-order-overview__total total">
				{__('Total', 'blocksy-companion')}:{' '}
				<strong>
					<span className="woocommerce-Price-amount amount">
						<bdi>
							<span className="woocommerce-Price-currencySymbol">
								$
							</span>
							35.00
						</bdi>
					</span>
				</strong>
			</li>

			<li className="woocommerce-order-overview__payment-method method">
				{__('Payment method', 'blocksy-companion')}:{' '}
				<strong>{__('Cash on delivery', 'blocksy-companion')}</strong>
			</li>
		</ul>
	)
}

export default OrderOverview
