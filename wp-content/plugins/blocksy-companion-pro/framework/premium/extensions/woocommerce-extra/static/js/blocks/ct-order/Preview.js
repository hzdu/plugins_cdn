import { createElement } from '@wordpress/element'

import OrderOverview from './OrderOverview'
import OrderDetails from './OrderDetails'
import CustomerDetails from './CustomerDetails'

const Preview = ({ attributes }) => {
	const { showOrderOverview, showOrderDetails, showCustomerDetails } =
		attributes

	return (
		<>
			{showOrderOverview ? <OrderOverview /> : null}
			{showOrderDetails ? <OrderDetails /> : null}
			{showCustomerDetails ? <CustomerDetails /> : null}
		</>
	)
}

export default Preview
