import { createElement } from '@wordpress/element'
import { __ } from 'ct-i18n'

const OrderDetails = () => {
	return (
		<section className="woocommerce-order-details">
			<table className="woocommerce-table woocommerce-table--order-details shop_table order_details">
				<thead>
					<tr>
						<th className="woocommerce-table__product-name product-name">
							{__('Product', 'blocksy-companion')}
						</th>
						<th className="woocommerce-table__product-table product-total">
							{__('Total', 'blocksy-companion')}
						</th>
					</tr>
				</thead>

				<tbody>
					<tr className="woocommerce-table__line-item order_item">
						<td className="woocommerce-table__product-name product-name">
							<a href="#">Faucibus Interdum</a>{' '}
							<strong className="product-quantity">
								×&nbsp;1
							</strong>{' '}
						</td>

						<td className="woocommerce-table__product-total product-total">
							<span className="woocommerce-Price-amount amount">
								<bdi>
									<span className="woocommerce-Price-currencySymbol">
										$
									</span>
									15.00
								</bdi>
							</span>{' '}
						</td>
					</tr>

					<tr className="woocommerce-table__line-item order_item">
						<td className="woocommerce-table__product-name product-name">
							<a href="#">Augue Neque</a>{' '}
							<strong className="product-quantity">
								×&nbsp;1
							</strong>{' '}
						</td>

						<td className="woocommerce-table__product-total product-total">
							<span className="woocommerce-Price-amount amount">
								<bdi>
									<span className="woocommerce-Price-currencySymbol">
										$
									</span>
									20.00
								</bdi>
							</span>{' '}
						</td>
					</tr>
				</tbody>

				<tfoot>
					<tr>
						<th scope="row">
							{__('Subtotal', 'blocksy-companion')}:
						</th>
						<td>
							<span className="woocommerce-Price-amount amount">
								<span className="woocommerce-Price-currencySymbol">
									$
								</span>
								35.00
							</span>
						</td>
					</tr>
					<tr>
						<th scope="row">
							{__('Shipping', 'blocksy-companion')}:
						</th>
						<td>{__('Free shipping', 'blocksy-companion')}</td>
					</tr>
					<tr>
						<th scope="row">
							{__('Payment method', 'blocksy-companion')}:
						</th>
						<td>{__('Cash on delivery', 'blocksy-companion')}</td>
					</tr>
					<tr>
						<th scope="row">{__('Total', 'blocksy-companion')}:</th>
						<td>
							<span className="woocommerce-Price-amount amount">
								<span className="woocommerce-Price-currencySymbol">
									$
								</span>
								35.00
							</span>
						</td>
					</tr>
				</tfoot>
			</table>
		</section>
	)
}

export default OrderDetails
