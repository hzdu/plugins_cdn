import { registerDynamicChunk } from 'blocksy-frontend'
import ctEvents from 'ct-events'

import { patchCurrentPageWith } from './filters/patch-current-page'
import { scrollToTarget } from '../../../../../../static/js/helpers/scroll-to-target'

const store = {}

const cachedFetch = (url) =>
	store[url]
		? new Promise((resolve) => {
				resolve(store[url])
				if (!window.ct_customizer_localizations) {
					store[url] = store[url].clone()
				}
		  })
		: new Promise((resolve) =>
				fetch(url, {
					headers: {
						'X-Requested-With': 'XMLHttpRequest',
					},
				}).then((response) => {
					resolve(response)

					if (!window.ct_customizer_localizations) {
						store[url] = response.clone()
					}
				})
		  )

const beforeRequest = (fromCache) => {
	return new Promise((resolve) => {
		let products = document.querySelector('.ct-products-container')

		if (
			document.querySelector('[data-ajax-filters*="scroll"]') &&
			products &&
			products.closest('.ct-container')
		) {
			scrollToTarget(products.closest('.ct-container'))
		}

		const loading = document.querySelector('.ct-filters-loading')

		if (!fromCache && loading) {
			loading.classList.add('active')
		}

		products.dataset.animate = 'leave:start'

		requestAnimationFrame(() => {
			products.dataset.animate = 'leave:end'

			const itemWithTransition = [...products.children].find((c) =>
				c.matches('[data-products], .woocommerce-no-products-found')
			)

			whenTransitionEnds(itemWithTransition, () => {
				products.dataset.animate = 'leave'
				resolve()
			})
		})
	})
}

const afterRequest = () => {
	const loading = document.querySelector('.ct-filters-loading')

	if (!loading) {
		return
	}

	const mount = () => {
		let products = document.querySelector('.ct-products-container')

		products.dataset.animate = 'appear:start'

		requestAnimationFrame(() => {
			products.dataset.animate = 'appear:end'

			const itemWithTransition = [...products.children].find((c) =>
				c.matches('[data-products], .woocommerce-no-products-found')
			)

			whenTransitionEnds(itemWithTransition, () => {
				products.removeAttribute('data-animate')
			})
		})

		ctEvents.trigger('blocksy:frontend:init')
	}

	if (loading.classList.contains('active')) {
		loading.classList.remove('active')

		whenTransitionEnds(loading, () => {
			mount()
		})
	} else {
		mount()
	}
}

const updateQueryParams = (uri) => {
	// const searchParams = new URLSearchParams(uri)

	// searchParams.forEach((value, key) => {
	// 	if (!value) {
	// 		searchParams.delete(key)
	// 	}
	// })

	// const newUlr = searchParams.toString().length
	// 	? decodeURIComponent(searchParams.toString())
	// 	: window.location.pathname
	window.history.pushState({}, document.title, uri)
}

const fetchData = (uri) =>
	new Promise((resolve) => {
		cachedFetch(uri)
			.then((res) => res.text())
			.then((data) => {
				patchCurrentPageWith(data)
				resolve()
			})
	})

const fetchDataFor = (url) => {
	const fromCache = !!store[url]

	beforeRequest(fromCache).then(() => {
		fetchData(url).then(() => {
			setTimeout(() => {
				afterRequest()
			}, 50)
		})
	})
}

registerDynamicChunk('blocksy_ext_woo_extra_ajax_filters', {
	mount: (el, { event }) => {
		const isAjax = document.querySelector('[data-ajax-filters*="yes"]')

		if (
			el.tagName === 'INPUT' &&
			el.type === 'checkbox' &&
			event.type === 'change'
		) {
			const link = el.closest('.ct-filter-item').querySelector('a')

			if (!isAjax) {
				window.location.href = link.getAttribute('href')

				return
			}

			el = link
		}

		if (el.tagName === 'A') {
			const maybeParent = el.closest('.ct-filter-item')

			if (maybeParent) {
				if (maybeParent.classList.contains('active')) {
					maybeParent.classList.remove('active')
				} else {
					maybeParent.classList.add('active')
				}
			}

			if (el.closest('.ct-filter-item')) {
				const maybeCheckbox = el
					.closest('.ct-filter-item')
					.querySelector('[type="checkbox"]')

				if (maybeCheckbox) {
					if (maybeCheckbox.getAttribute('checked')) {
						maybeCheckbox.checked = false
						maybeCheckbox.removeAttribute('checked')
					} else {
						maybeCheckbox.checked = true
						maybeCheckbox.setAttribute('checked', 'checked')
					}

					const newCheckbox = maybeCheckbox.cloneNode(true)
					maybeCheckbox.parentNode.replaceChild(
						newCheckbox,
						maybeCheckbox
					)
				}
			}

			if (!isAjax) {
				window.location.href = el.getAttribute('href')

				return
			}
		}

		if (el.tagName === 'FORM') {
			return
		}

		if (!isAjax) {
			return
		}

		if (el.tagName === 'SELECT' && el.closest('.woocommerce-ordering')) {
			const url = new URL(window.location.href)
			const formData = new FormData(el.closest('.woocommerce-ordering'))

			;[...formData.entries()].map(([key, value]) => {
				url.searchParams.set(key, value)
			})

			updateQueryParams(url.href)
			fetchDataFor(url.href)

			return
		}

		const requestUrl = el.getAttribute('href')
		updateQueryParams(requestUrl)
		fetchDataFor(requestUrl)
	},
})

window.addEventListener(
	'popstate',
	function (event) {
		fetchDataFor(window.location.href)
	},
	false
)

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
