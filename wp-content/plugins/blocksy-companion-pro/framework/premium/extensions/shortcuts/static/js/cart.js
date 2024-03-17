import ctEvents from 'ct-events'
import { registerDynamicChunk } from 'blocksy-frontend'

registerDynamicChunk('blocksy_shortcuts_cart', {
	mount: (el, { event }) => {
		let maybeCart = document.querySelector(
			'.ct-header-cart .ct-offcanvas-trigger'
		)

		if (!maybeCart) {
			location.href = el.getAttribute('href')
			return
		}

		maybeCart.dispatchEvent(
			new MouseEvent(event.type, {
				view: window,
				bubbles: true,
				cancelable: true,
			})
		)
	},
})
