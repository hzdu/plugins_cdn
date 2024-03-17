import './variables'
import ctEvents from 'ct-events'

import { responsiveClassesFor } from 'blocksy-customizer-sync'

import { mountQuickViewSync } from './sync/quick-view'
import { mountCompareSync } from './sync/compare'

mountQuickViewSync()
mountCompareSync()

wp.customize('floatingBarTitleVisibility', (val) =>
	val.bind((to) => {
		responsiveClassesFor(
			'floatingBarTitleVisibility',
			document.querySelector('.ct-floating-bar .product-title')
		)
	})
)

wp.customize('woo_active_filters_label', (val) =>
	val.bind((to) => {
		document.querySelectorAll('.ct-active-filters > span').forEach((el) => {
			el.textContent = to
		})
	})
)

wp.customize('woo_has_new_custom_badge_label', (val) =>
	val.bind((to) => {
		Array.from(document.querySelectorAll('.ct-woo-badge-new')).map((el) => {
			el.textContent = to
		})
	})
)

wp.customize('woo_has_featured_custom_badge_label', (val) =>
	val.bind((to) => {
		Array.from(document.querySelectorAll('.ct-woo-badge-featured')).map(
			(el) => {
				el.textContent = to
			}
		)
	})
)

wp.customize('floatingBarVisibility', (val) =>
	val.bind((to) => {
		responsiveClassesFor(
			'floatingBarVisibility',
			document.querySelector('.ct-floating-bar')
		)
	})
)

wp.customize('has_product_slider_arrows', (val) =>
	val.bind((to) => {
		responsiveClassesFor(
			'has_product_slider_arrows',
			document.querySelector('.flexy > .flexy-arrow-prev')
		)

		responsiveClassesFor(
			'has_product_slider_arrows',
			document.querySelector('.flexy > .flexy-arrow-next')
		)
	})
)

wp.customize('has_product_pills_arrows', (val) =>
	val.bind((to) => {
		responsiveClassesFor(
			'has_product_pills_arrows',
			document.querySelector('.flexy-pills > .flexy-arrow-prev')
		)

		responsiveClassesFor(
			'has_product_pills_arrows',
			document.querySelector('.flexy-pills > .flexy-arrow-next')
		)
	})
)

wp.customize('filter_panel_position', (val) => {
	val.bind((to) => {
		const el = document.querySelector('#woo-filters-panel')

		ctEvents.trigger('ct:offcanvas:force-close', {
			container: el,
		})

		setTimeout(() => {
			el.removeAttribute('data-behaviour')
			el.classList.add('ct-no-transition')

			requestAnimationFrame(() => {
				el.dataset.behaviour = `${to}-side`

				setTimeout(() => {
					el.classList.remove('ct-no-transition')
				})
			})
		}, 300)
	})
})

wp.customize('woocommerce_filter_visibility', (val) => {
	val.bind((to) => {
		const trigger = document.querySelector('.ct-toggle-filter-panel')

		if (trigger) {
			responsiveClassesFor('woocommerce_filter_visibility', trigger)
		}
	})
})

wp.customize('woocommerce_filter_label', (val) => {
	val.bind((to) => {
		const trigger = document.querySelector('.ct-toggle-filter-panel')

		if (trigger) {
			const maybeIcon = trigger.querySelector('.ct-icon')

			trigger.innerHTML = `${maybeIcon.outerHTML || ''}${to}`
		}
	})
})

wp.customize('filter_panel_close_button_type', (val) => {
	val.bind((to) => {
		let offcanvasModalClose = document.querySelector(
			'#woo-filters-panel .ct-toggle-close'
		)

		setTimeout(() => {
			offcanvasModalClose.classList.add('ct-disable-transitions')

			requestAnimationFrame(() => {
				if (offcanvasModalClose) {
					offcanvasModalClose.dataset.type = to
				}

				setTimeout(() => {
					offcanvasModalClose.classList.remove(
						'ct-disable-transitions'
					)
				})
			})
		}, 300)
	})
})

wp.customize('size_guide_close_button_type', (val) => {
	val.bind((to) => {
		let offcanvasModalClose = document.querySelector(
			'#ct-size-guide-modal .ct-toggle-close'
		)

		setTimeout(() => {
			offcanvasModalClose.classList.add('ct-disable-transitions')

			requestAnimationFrame(() => {
				if (offcanvasModalClose) {
					offcanvasModalClose.dataset.type = to
				}

				setTimeout(() => {
					offcanvasModalClose.classList.remove(
						'ct-disable-transitions'
					)
				})
			})
		}, 300)
	})
})

wp.customize('single_page_share_box_visibility', (val) => {
	val.bind((to) => {
		responsiveClassesFor(
			'single_page_share_box_visibility',
			document.querySelector('[data-prefix="single_page"] .ct-share-box')
		)
	})
})

wp.customize('color_swatch_shape', (value) => {
	value.bind((to) => {
		const swatches = document.querySelectorAll(
			'[data-swatches-type="color"]'
		)

		if (swatches && swatches.length) {
			swatches.forEach((el) => {
				el.dataset.swatchesShape = to
			})
		}
	})
})

wp.customize('image_swatch_shape', (value) => {
	value.bind((to) => {
		const swatches = document.querySelectorAll(
			'[data-swatches-type="image"]'
		)

		if (swatches && swatches.length) {
			swatches.forEach((el) => {
				el.dataset.swatchesShape = to
			})
		}
	})
})

wp.customize('button_swatch_shape', (value) => {
	value.bind((to) => {
		const swatches = document.querySelectorAll(
			'[data-swatches-type="button"]'
		)

		if (swatches && swatches.length) {
			swatches.forEach((el) => {
				el.dataset.swatchesShape = to
			})
		}
	})
})

wp.customize('variations_swatches_display_type', (val) => {
	val.bind((to) => {
		const swatches = document.querySelectorAll('.single-product .product')

		if (swatches && swatches.length) {
			swatches.forEach((el) => {
				if (to === 'yes') {
					el.classList.add('ct-inline-variations')
				} else {
					el.classList.remove('ct-inline-variations')
				}
			})
		}
	})
})

wp.customize('product_compare_bar_button_label', (val) => {
	val.bind((to) => {
		const compareButton = document.querySelector(
			'.ct-compare-bar .ct-button'
		)

		if (compareButton) {
			const maybeIcon = compareButton.querySelector('svg')

			compareButton.innerHTML = `${maybeIcon.outerHTML || ''}${to}`
		}
	})
})

wp.customize('product_compare_bar_visibility', (val) => {
	val.bind((to) => {
		const compareBar = document.querySelector('.ct-compare-bar')

		if (compareBar) {
			responsiveClassesFor('product_compare_bar_visibility', compareBar)
		}
	})
})
