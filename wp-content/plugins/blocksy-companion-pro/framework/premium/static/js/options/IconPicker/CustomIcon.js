import {
	Fragment,
	createElement,
	createPortal,
	useState,
	useMemo,
} from '@wordpress/element'

import { ImageUploader } from 'blocksy-options'

import { __ } from 'ct-i18n'

const CustomIcon = ({ onChange, value }) => {
	return (
		<div className="ct-modal-tabs-content ct-upload-icon-container">
			<ImageUploader
				option={{
					attr: {
						'data-type': 'small',
					},
					mediaType: 'image/svg+xml',
					emptyLabel: __('Click to upload', 'blocksy-companion'),
				}}
				value={value}
				onChange={(data) => {
					onChange({
						...value,
						...data,
					})
				}}
			/>

			<p className="ct-option-description">
				{__(
					'For performance and customization reasons, only SVG files are allowed.',
					'blocksy-companion'
				)}
			</p>
		</div>
	)
}

export default CustomIcon
