import { __ } from 'ct-i18n'
import { createElement, render } from '@wordpress/element'
import { onDocumentLoaded } from 'blocksy-options'
import $ from 'jquery'
import SettingsManager from './SettingsManager'

import ctEvents from 'ct-events'

onDocumentLoaded(() => {
	const div = document.createElement('div')
	document.body.appendChild(div)

	render(<SettingsManager />, div)
})

$(document).on('click.ctMegaMenu', '.blocksy-mega-menu-trigger', (e) => {
	e.preventDefault()

	const el = e.target.closest('.blocksy-mega-menu-trigger')

	ctEvents.trigger('blocksy:mega-menu:edit-item-settings', {
		el,

		depth: parseFloat(
			[...e.target.closest('.menu-item').classList]
				.find((c) => c.indexOf('menu-item-depth') > -1)
				.replace('menu-item-depth-', '')
		),

		itemTitle: e.target
			.closest('.menu-item')
			.querySelector('.edit-menu-item-title').value,
		itemId: el.dataset.itemId,
	})
})
