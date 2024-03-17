import $ from 'jquery'
import { registerDynamicChunk, getCurrentScreen } from 'blocksy-frontend'
import ctEvents from 'ct-events'
import { mountYithNameYourPrice } from './integrations/yith-name-your-price'

import { doAction } from '@wordpress/hooks'

import { mountNavigation } from './quick-view/navigation'
const ajaxLoader = `<span class="ct-ajax-loader" data-type="boxed"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" opacity="0.2" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="2"/><path d="m12,2c5.52,0,10,4.48,10,10" fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2"><animateTransform attributeName="transform" attributeType="XML" type="rotate" dur="0.5s" from="0 12 12" to="360 12 12" repeatCount="indefinite" /></path></svg></span>`

const removeModalContent = (modalContainer) => {
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
}

let store = {}

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

export const getFetchDescriptorFor = (productId) => {
	const searchParams = new URLSearchParams()

	searchParams.append('action', 'blocsky_get_woo_quick_view')
	searchParams.append('product_id', productId)

	if (window.wp && window.wp.customize) {
		searchParams.append('is_customizer', true)
	}
	const fetchUrl = `${ct_localizations.ajax_url}?${searchParams.toString()}`

	return {
		fetch: () =>
			new Promise((r) => {
				cachedFetch(fetchUrl)
					.then((r) => r.json())
					.then(({ success, data }) => {
						const div = document.createElement('div')
						div.innerHTML = data.quickview

						if (window.wp && window.wp.hooks) {
							doAction('ct.quick-view.insert-content', div, {
								data,
								productId,
							})
						}

						if (
							document.body.innerHTML.indexOf(data.body_html) ===
							-1
						) {
							document.body.insertAdjacentHTML(
								'beforeend',
								data.body_html
							)
						}

						r(div.firstElementChild)
					})
			}),

		isCached: !!store[fetchUrl],
	}
}

export const afterRequest = (panel, e) => {
	if ($) {
		;[...panel.querySelectorAll(`.variations_form`)].map((el) =>
			$(el).wc_variation_form()
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
				href: `#${panel.id}`,
				options: {
					openStrategy: 'skip',
					isModal: true,
					computeScrollContainer: () => {
						if (!panel.closest('body')) {
							return
						}

						if (
							getCurrentScreen &&
							getCurrentScreen({ withTablet: true }) === 'mobile'
						) {
							return panel.querySelector('.ct-quick-view-content')
						} else {
							return panel.querySelector('.entry-summary')
						}
					},
					clickOutside: true,
					focus: false,
				},
			})

			if (panel.querySelector('#ywcnp_form_name_your_price')) {
				mountYithNameYourPrice(panel)
			}
		})
		setTimeout(() => ctEvents.trigger('ct:flexy:update'))
	})
}

const openQuickViewFor = ({ event, panel, el, completeAction }) => {
	if (event.target.matches('.add_to_cart_button')) {
		return
	}

	if (event.target.matches('.added_to_cart')) {
		return
	}

	event.preventDefault()

	let productId = Array.from(el.classList)
		.find((className) => className.indexOf('post-') === 0)
		.split('-')[1]

	const fetchDescriptor = getFetchDescriptorFor(productId)

	fetchDescriptor.fetch().then((content) => {
		if (!panel) {
			document.querySelector('.ct-drawer-canvas').appendChild(content)
			panel = document.querySelector('.ct-drawer-canvas').lastChild

			ctEvents.trigger('ct:overlay:handle-click', {
				event,
				options: {
					openStrategy: 'fast',
					container: panel,
				},
			})

			completeAction({
				finalState: '',
			})
		} else {
			if (!panel.id) {
				panel.id = `ct-quick-view-${productId}`
			}

			if (!panel.querySelector('.ct-panel-content')) {
				panel.innerHTML = content.innerHTML
			}

			panel.classList.remove('loading')
		}

		ctEvents.trigger('blocksy:wishlist:sync')
		ctEvents.trigger('blocksy:compare:sync')

		afterRequest(panel, event)
	})
}

registerDynamicChunk('blocksy_ext_woo_extra_quick_view', {
	mount: (el, { event, panel, completeAction }) => {
		mountNavigation(ajaxLoader)

		if (el.closest('[data-quick-view="card"]')) {
			openQuickViewFor({ event, panel, el })
			return
		}

		openQuickViewFor({
			event,
			panel,
			el: el.closest('.product'),
			completeAction,
		})
	},

	maybeGetPanelContent: (el, { event }) => {
		let container = el

		if (!el.closest('[data-quick-view="card"]')) {
			container = el.closest('.product')
		}

		let productId = Array.from(container.classList)
			.find((className) => className.indexOf('post-') === 0)
			.split('-')[1]

		const fetchDescriptor = getFetchDescriptorFor(productId)

		if (fetchDescriptor.isCached) {
			return new Promise((resolve) => {
				fetchDescriptor.fetch().then((content) => {
					resolve(content)
				})
			})
		}

		return null
	},
})

ctEvents.on('ct:modal:closed', removeModalContent)
