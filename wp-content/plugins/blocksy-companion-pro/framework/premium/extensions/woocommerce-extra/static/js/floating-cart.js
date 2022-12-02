import { registerDynamicChunk, areWeDealingWithSafari } from 'blocksy-frontend'

registerDynamicChunk('blocksy_ext_woo_extra_floating_cart', {
	mount: (el, { state }) => {
		if (state === 'target-after-bottom') {
			el.classList.add('ct-active-start')

			requestAnimationFrame(() => {
				el.classList.remove('ct-active-start')
				el.classList.add('ct-active-end')

				setTimeout(() => {
					el.classList.remove('ct-active-end')
					el.classList.add('ct-active')
				}, 200)
			})
		}

		if (state !== 'target-after-bottom') {
			el.classList.add('ct-active-start')
			requestAnimationFrame(() => {
				el.classList.remove('ct-active')
			})
		}

		const maybeButton = el.querySelector(
			'.button:not(.single_add_to_cart_button):not(.product_type_external)'
		)

		if (!maybeButton) {
			return
		}

		if (maybeButton.hasClickListener) {
			return
		}

		maybeButton.hasClickListener = true

		maybeButton.addEventListener('click', (event) => {
			event.preventDefault()

			var start = window.scrollY
			var currentTime = null

			const animateScroll = (timestamp) => {
				if (!currentTime) currentTime = timestamp
				var progress = timestamp - currentTime

				const easeInOutQuad = (t, b, c, d) => {
					t /= d / 2
					if (t < 1) return (c / 2) * t * t + b
					t--
					return (-c / 2) * (t * (t - 2) - 1) + b
				}

				if (
					!document
						.querySelector(
							'.single-product .single_add_to_cart_button'
						)
						.closest('form')
				) {
					return
				}

				const summary = document
					.querySelector('.single-product .single_add_to_cart_button')
					.closest('form')
					.getBoundingClientRect()

				const destination =
					window.scrollY +
					summary.top -
					(parseFloat(
						getComputedStyle(document.body).getPropertyValue(
							'--header-sticky-height'
						)
					) || 0)

				var val = Math.max(
					easeInOutQuad(progress, start, -start, 700),
					destination
				)

				if (areWeDealingWithSafari) {
					scrollTo(0, val)

					if (progress < 700) {
						requestAnimationFrame(animateScroll)
					}
				} else {
					scrollTo(0, destination)
				}
			}

			if (areWeDealingWithSafari) {
				requestAnimationFrame(animateScroll)
			} else {
				animateScroll(0)
			}
		})
	},
})
