import {
	createElement,
	Component,
	useEffect,
	useState,
	Fragment,
} from '@wordpress/element'

import WhiteLabel from './WhiteLabel'

import ctEvents from 'ct-events'

ctEvents.on('ct:extensions:card', ({ CustomComponent, extension }) => {
	if (extension.name !== 'white-label') return
	CustomComponent.extension = WhiteLabel
})

ctEvents.on('ct:dashboard:heading:advanced-click', async () => {
	const body = new FormData()
	body.append('action', 'blocksy_white_label_maybe_unlock')

	try {
		const response = await fetch(ctDashboardLocalizations.ajax_url, {
			method: 'POST',
			body,
		})

		if (response.status === 200) {
			const { success, data } = await response.json()

			if (success) {
				ctEvents.trigger('blocksy_exts_sync_exts')
			}
		}
	} catch (e) {}
})
