import { addAction } from '@wordpress/hooks'
import { setRatioFor } from 'blocksy-customizer-sync'

const quickViewData = {
	navPrev: '',
	navNext: '',
}

const render = (container = document) => {
	let content = container.querySelector('.ct-quick-view-card')

	if (!content) {
		return
	}

	content = content.closest('.ct-panel-content')
	;[
		...container.querySelectorAll(
			'.ct-quick-view-content .ct-media-container'
		),
	].map((el) => {
		setRatioFor(wp.customize('woocommerce_quickview_gallery_ratio')(), el)
	})

	const woocommerce_quickview_navigation = wp.customize(
		'woocommerce_quickview_navigation'
	)()

	if (woocommerce_quickview_navigation !== 'yes') {
		;[
			...container.querySelectorAll(
				'.ct-quick-view-nav-prev, .ct-quick-view-nav-next'
			),
		].map((el) => {
			el.remove()
		})

		content.removeAttribute('data-arrows')
	} else {
		if (!container.querySelector('.ct-quick-view-nav-next')) {
			content.insertAdjacentHTML('afterbegin', quickViewData.navPrev)
			content.insertAdjacentHTML('beforeend', quickViewData.navNext)
		}

		content.dataset.arrows = ''
	}

	ctEvents.trigger('blocksy:frontend:init')
}

export const mountQuickViewSync = () => {
	addAction(
		'ct.quick-view.insert-content',
		'blocksy-companion',
		(div, { data, productId }) => {
			quickViewData.navPrev = div.querySelector(
				'.ct-quick-view-nav-prev'
			).outerHTML

			quickViewData.navNext = div.querySelector(
				'.ct-quick-view-nav-next'
			).outerHTML

			render(div)
		}
	)

	wp.customize('woocommerce_quickview_gallery_ratio', (val) =>
		val.bind((to) => {
			render()
		})
	)

	wp.customize('woocommerce_quickview_navigation', (val) =>
		val.bind((to) => {
			render()
		})
	)
}
