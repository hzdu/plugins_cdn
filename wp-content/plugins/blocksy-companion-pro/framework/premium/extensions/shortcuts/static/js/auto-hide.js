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

			let stickyContainer = maybeShortcuts

			if (isSticky && window.scrollY - prevScrollY < -5) {
				stickyContainer.dataset.behaviour = 'scroll'
			} else {
				if (!isSticky) {
					prevScrollY = window.scrollY
					return
				}

				if (
					stickyContainer.dataset.behaviour.indexOf('hide') === -1 &&
					window.scrollY - prevScrollY > 5
				) {
					stickyContainer.dataset.behaviour = 'scroll:hide'
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
