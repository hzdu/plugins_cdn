import { createElement } from '@wordpress/element'
import { addFilter } from '@wordpress/hooks'

import CustomFonts from './CustomFonts'

addFilter(
	'blocksy.extensions.current_extension_content',
	'blocksy',
	(contentDescriptor, { extension, onExtsSync, setExtsStatus }) => {
		if (extension.name !== 'custom-fonts') return contentDescriptor

		return {
			...contentDescriptor,
			content: (
				<CustomFonts
					setExtsStatus={setExtsStatus}
					extension={extension}
					onExtsSync={onExtsSync}
				/>
			),
		}
	}
)
