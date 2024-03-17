import { createElement } from '@wordpress/element'
import { addFilter } from '@wordpress/hooks'

import LocalGoogleFonts from './LocalGoogleFonts'

addFilter(
	'blocksy.extensions.current_extension_content',
	'blocksy',
	(contentDescriptor, { extension, onExtsSync }) => {
		if (extension.name !== 'local-google-fonts') return contentDescriptor

		return {
			...contentDescriptor,
			content: (
				<LocalGoogleFonts
					extension={extension}
					onExtsSync={onExtsSync}
				/>
			),
		}
	}
)
