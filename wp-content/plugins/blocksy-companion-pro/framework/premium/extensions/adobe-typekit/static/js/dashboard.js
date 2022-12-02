import ctEvents from 'ct-events'

import { createElement } from '@wordpress/element'

import AdobeTypekit from './AdobeTypekit'

ctEvents.on('ct:extensions:card', ({ CustomComponent, extension }) => {
	if (extension.name !== 'adobe-typekit') return
	CustomComponent.extension = AdobeTypekit
})
