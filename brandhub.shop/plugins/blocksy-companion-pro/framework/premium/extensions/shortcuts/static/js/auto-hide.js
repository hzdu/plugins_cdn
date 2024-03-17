import ctEvents from 'ct-events'
import { registerDynamicChunk } from 'blocksy-frontend'

registerDynamicChunk('blocksy_shortcuts_auto_hide', {
	mount: (el) => {
		if (el.registered) {
			return
		}

		el.registered = true
		let maybeShortcuts = el

		let prevScrollY = window.scrollY
		let hasListener = false
		let scrolling = false

		const compute = () => {
			const startPosition = 0

			const isSticky =
				(startPosition > 0 &&
					Math.abs(window.scrollY - startPosition) < 5) ||
				window.scrollY > startPosition

			if (window.scrollY < startPosition) {
				prevScrollY = window.scrollY
			}

			if (
				// we are not at the end of the page!
				window.innerHeight + Math.round(scrollY) >=
					document.body.offsetHeight &&
				scrollY > 10
			) {
				prevScrollY = window.scrollY - 10
			}

			let stickyContainer = maybeShortcuts

			const controlEl = stickyContainer.closest('[data-shortcuts-bar]')

			if (!controlEl) {
				return
			}

			if (isSticky && window.scrollY - prevScrollY < -5) {
				controlEl.dataset.shortcutsBar = 'scroll:yes'
			} else {
				if (!isSticky) {
					prevScrollY = window.scrollY
					return
				}

				if (
					controlEl.dataset.shortcutsBar.indexOf('no') === -1 &&
					window.scrollY - prevScrollY > 5
				) {
					controlEl.dataset.shortcutsBar = 'scroll:no'
				}
			}

			prevScrollY = window.scrollY
		}

		compute()

		if (!hasListener) {
			hasListener = true

			window.addEventListener('scroll', () => {
				if (scrolling) return

				scrolling = true

				requestAnimationFrame(() => {
					compute()
					scrolling = false
				})
			})
		}
	},
})
