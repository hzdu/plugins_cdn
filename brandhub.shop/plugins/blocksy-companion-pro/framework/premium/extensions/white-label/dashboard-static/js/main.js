import {
	createElement,
	Component,
	useEffect,
	useState,
	Fragment,
} from '@wordpress/element'

import WhiteLabel from './WhiteLabel'

import ctEvents from 'ct-events'
import { addFilter } from '@wordpress/hooks'

addFilter(
	'blocksy.extensions.current_extension_content',
	'blocksy',
	(contentDescriptor, { extension, onExtsSync, navigate }) => {
		if (extension.name !== 'white-label') return contentDescriptor

		return {
			...contentDescriptor,
			...(extension.data.locked ? { showExtension: false } : {}),
			content: (
				<WhiteLabel
					extension={extension}
					onExtsSync={onExtsSync}
					navigate={navigate}
				/>
			),
		}
	}
)

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
