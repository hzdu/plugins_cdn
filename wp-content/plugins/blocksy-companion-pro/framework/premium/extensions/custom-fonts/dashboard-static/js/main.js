import { createElement } from '@wordpress/element'

import CustomFonts from './CustomFonts'

import ctEvents from 'ct-events'

ctEvents.on('ct:extensions:card', ({ CustomComponent, extension }) => {
	if (extension.name !== 'custom-fonts') return
	CustomComponent.extension = CustomFonts
})
