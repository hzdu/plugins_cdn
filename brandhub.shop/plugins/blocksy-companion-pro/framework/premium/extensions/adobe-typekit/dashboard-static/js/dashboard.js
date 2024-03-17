import { createElement } from '@wordpress/element'
import { addFilter } from '@wordpress/hooks'

import AdobeTypekit from './AdobeTypekit'

addFilter(
	'blocksy.extensions.current_extension_content',
	'blocksy',
	(contentDescriptor, { extension, onExtsSync }) => {
		if (extension.name !== 'adobe-typekit') return contentDescriptor

		return {
			...contentDescriptor,
			content: (
				<AdobeTypekit extension={extension} onExtsSync={onExtsSync} />
			),
		}
	}
)
