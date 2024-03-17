import { registerDynamicChunk } from 'blocksy-frontend'
import ctEvents from 'ct-events'

import { handleMicroPopupTriggers } from './micro-popups/triggers'

const openMicroPopup = (...args) => {
	import('./micro-popups/lazy/open-close-logic').then(
		({ openMicroPopup: o }) => o(...args)
	)
}

window.blocksyOpenMicroPopup = openMicroPopup

const getPopupTarget = (popupTrigger) => {
	let popupTarget = null

	try {
		popupTarget = document.querySelector(popupTrigger.getAttribute('href'))
	} catch (e) {
		return null
	}

	return popupTarget
}

const listenForClicks = () => {
	;[...document.querySelectorAll('[href*="ct-popup-"]')].map(
		(popupTrigger) => {
			if (popupTrigger.hasClickListener) {
				return
			}

			if (!getPopupTarget(popupTrigger)) {
				return
			}

			popupTrigger.hasClickListener = true

			popupTrigger.addEventListener('click', (e) => {
				e.preventDefault()

				let popup = getPopupTarget(popupTrigger)

				if (!popup) {
					return
				}

				const payload = {}

				if (popupTrigger.dataset.postId) {
					payload.postId = popupTrigger.dataset.postId
				}

				openMicroPopup(popup, payload)
			})
		}
	)
}

let mounted = false

registerDynamicChunk('blocksy_pro_micro_popups', {
	mount: () => {
		if (!mounted) {
			mounted = true
			handleMicroPopupTriggers()
		}

		listenForClicks()
	},
})

ctEvents.on('blocksy:frontend:init', () => {
	listenForClicks()
})
