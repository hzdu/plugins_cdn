import { createElement } from '@wordpress/element'

import { __ } from 'ct-i18n'

const errors = {
	brands: __(
		'Please install and activate the Blocksy Brands extension.',
		'blocksy-companion'
	),
	attributes: __('Please select a valid attribute.', 'blocksy-companion'),
}

const Disabled = ({ isError, type, placement, children }) => {
	if (isError) {
		if (placement === 'sidebar') {
			return children
		}

		return (
			<div className="ct-block-notice components-notice is-warning">
				<div className="components-notice__content">
					<p>{errors?.[type]}</p>
				</div>
			</div>
		)
	}

	return children
}

export default Disabled
