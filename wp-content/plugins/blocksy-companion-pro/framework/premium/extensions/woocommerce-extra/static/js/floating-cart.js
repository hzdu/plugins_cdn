import { registerDynamicChunk } from 'blocksy-frontend'
import { scrollToTarget } from '../../../../../../static/js/helpers/scroll-to-target'

function whenTransitionEnds(el, cb) {
	const end = () => {
		el.removeEventListener('transitionend', onEnd)
		cb()
	}

	const onEnd = (e) => {
		if (e.target === el) {
			end()
		}
	}

	el.addEventListener('transitionend', onEnd)
}

registerDynamicChunk('blocksy_ext_woo_extra_floating_cart', {
	mount: (el, { state }) => {
		if (state === 'target-after-bottom') {
			el.closest('.ct-drawer-canvas').dataset.floatingBar = 'yes:start'

			requestAnimationFrame(() => {
				el.closest('.ct-drawer-canvas').dataset.floatingBar = 'yes'
			})
		}

		if (state !== 'target-after-bottom') {
			el.closest('.ct-drawer-canvas').dataset.floatingBar = 'no:updating'

			whenTransitionEnds(el, () => {
				if (
					el.closest('.ct-drawer-canvas').dataset.floatingBar ===
					'no:updating'
				) {
					el.closest('.ct-drawer-canvas').dataset.floatingBar = 'no'
				}
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

			scrollToTarget(
				document
					.querySelector('.single-product .single_add_to_cart_button')
					.closest('form')
			)
		})
	},
})
