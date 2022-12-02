import $ from 'jquery'
import { registerDynamicChunk, getCurrentScreen } from 'blocksy-frontend'
import ctEvents from 'ct-events'
import { mountYithNameYourPrice} from './integrations/yith-name-your-price'

const store = {}

const cachedFetch = (url) =>
	store[url]
		? new Promise((resolve) => {
				resolve(store[url])
				store[url] = store[url].clone()
		  })
		: new Promise((resolve) =>
				fetch(url).then((response) => {
					resolve(response)
					store[url] = response.clone()
				})
		  )

const openQuickViewFor = ({ e, el }) => {
	if (e.target.matches('.add_to_cart_button')) {
		return
	}

	if (e.target.matches('.added_to_cart')) {
		return
	}

	e.preventDefault()

	let productId = Array.from(el.classList)
		.find((className) => className.indexOf('post-') === 0)
		.split('-')[1]

	let href = `#quick-view-${productId}`

	if (document.querySelector(href)) {
		ctEvents.trigger('ct:overlay:handle-click', {
			e,
			href,
			options: {
				clickOutside: true,
			},
		})
		return
	}

	let panel = document.querySelector('.ct-drawer-canvas').lastElementChild
	panel.id = `quick-view-${productId}`

	Promise.all([
		new Promise((resolve) => {
			cachedFetch(
				`${ct_localizations.ajax_url}?action=blocsky_get_woo_quick_view&product_id=${productId}`
			).then((r) => {
				if (r.status === 200) {
					r.json().then(({ success, data }) => {
						if (!success) {
							return
						}
						resolve(data)
					})
				}
			})
		}),
	]).then(([data]) => {
		const div = document.createElement('div')

		div.innerHTML = data.quickview

		if (document.body.innerHTML.indexOf(data.body_html) === -1) {
			document.body.insertAdjacentHTML('beforeend', data.body_html)
		}

		if (document.querySelector(href)) {
			document.querySelector(href).innerHTML =
				div.firstElementChild.innerHTML
		}

		if ($) {
			;[...document.querySelectorAll(`${href} .variations_form`)].map(
				(el) => $(el).wc_variation_form()
			)
		}

		ctEvents.trigger('ct:custom-select:init')
		ctEvents.trigger('ct:custom-select-allow:init')

		ctEvents.trigger('blocksy:frontend:init')

		setTimeout(() => {
			if ($) {
				$.wcpaInit && $.wcpaInit()
			}
		}, 50)

		setTimeout(() => {
			setTimeout(() => {
				ctEvents.trigger('ct:overlay:handle-click', {
					e,
					href,
					options: {
						openStrategy: 'skip',
						isModal: true,
						computeScrollContainer: () =>
							getCurrentScreen &&
							getCurrentScreen({ withTablet: true }) === 'mobile'
								? document.querySelector(href).firstElementChild
										.lastElementChild.lastElementChild
								: document
										.querySelector(href)
										.querySelector('.entry-summary'),
						clickOutside: true,
						focus: false,
					},
				})

				if (
					document
						.querySelector(href)
						.querySelector('#ywcnp_form_name_your_price')
				) {
					mountYithNameYourPrice(document.querySelector(href))
				}
			})
			setTimeout(() => ctEvents.trigger('ct:flexy:update'))
		}, 100)
	})
}

registerDynamicChunk('blocksy_ext_woo_extra_quick_view', {
	mount: (el, { event }) => {
		if (el.closest('[data-quick-view="card"]')) {
			openQuickViewFor({ e: event, el })
			return
		}

		openQuickViewFor({ e: event, el: el.closest('.product') })
	},
})

ctEvents.on('ct:modal:closed', (modalContainer) => {
	if (!modalContainer.closest('.quick-view-modal')) {
		return
	}

	if (modalContainer.querySelector('.flexy-container')) {
		const flexyEl =
			modalContainer.querySelector('.flexy-container').parentNode

		flexyEl.flexy && flexyEl.flexy.destroy && flexyEl.flexy.destroy()
	}

	setTimeout(() => {
		modalContainer.remove()
	})
})
