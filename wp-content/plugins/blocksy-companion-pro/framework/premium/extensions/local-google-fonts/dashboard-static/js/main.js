import { createElement } from '@wordpress/element'

import LocalGoogleFonts from './LocalGoogleFonts'

import ctEvents from 'ct-events'

ctEvents.on('ct:extensions:card', ({ CustomComponent, extension }) => {
	if (extension.name !== 'local-google-fonts') return
	CustomComponent.extension = LocalGoogleFonts
})
