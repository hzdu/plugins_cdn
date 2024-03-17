import ctEvents from 'ct-events'
import { getFetchDescriptorFor, afterRequest } from '../quick-view'

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

let ajaxLoaderContent = ''

const handleNavigation = (event, panel, isPrev = false) => {
	let maybeTarget = document.querySelector(`[href="#${panel.id}"]`)
	let el = null

	if (maybeTarget) {
		el = maybeTarget.closest('.type-product')
	} else {
		maybeTarget = document.querySelector(
			`.products .type-product.post-${panel.id.replace(
				`ct-quick-view-`,
				''
			)}`
		)

		if (!maybeTarget) {
			return
		}

		el = maybeTarget
	}

	let nextEl = null

	if (isPrev) {
		nextEl = el.previousElementSibling || el.parentNode.lastElementChild
	} else {
		nextEl = el.nextElementSibling || el.parentNode.firstElementChild
	}

	const nextProductId = Array.from(nextEl.classList)
		.find((className) => className.indexOf('post-') === 0)
		.split('-')[1]

	const fetchDescriptor = getFetchDescriptorFor(nextProductId)

	if (!fetchDescriptor.isCached) {
		const container = panel.querySelector('.ct-quick-view-card')

		panel.classList.add('loading')

		requestAnimationFrame(() => {
			whenTransitionEnds(container, () => {
				container.outerHTML = ajaxLoaderContent

				fetchDescriptor.fetch().then((content) => {
					panel.querySelector('.ct-ajax-loader').outerHTML =
						content.querySelector('.ct-quick-view-card').outerHTML

					panel.id = content.id

					const container = panel.querySelector('.ct-quick-view-card')

					requestAnimationFrame(() => {
						panel.classList.remove('loading')
					})

					afterRequest(panel, event)
				})
			})
		})
	}

	if (fetchDescriptor.isCached) {
		fetchDescriptor.fetch().then((content) => {
			panel.querySelector('.ct-quick-view-card').outerHTML =
				content.querySelector('.ct-quick-view-card').outerHTML

			panel.id = content.id
			afterRequest(panel, event)
		})
	}
}

export const mountNavigation = (ajaxLoader) => {
	ajaxLoaderContent = ajaxLoader

	ctEvents.on('blocksy:frontend:init', () => {
		const maybeNext = document.querySelector('.ct-quick-view-nav-next')
		const maybePrev = document.querySelector('.ct-quick-view-nav-prev')

		if (maybeNext && !maybeNext.hasClickListener) {
			maybeNext.hasClickListener = true

			maybeNext.addEventListener('click', (e) => {
				e.preventDefault()
				handleNavigation(e, e.target.closest('.ct-panel'))
			})
		}

		if (maybePrev && !maybePrev.hasClickListener) {
			maybePrev.hasClickListener = true

			maybePrev.addEventListener('click', (e) => {
				e.preventDefault()
				handleNavigation(e, e.target.closest('.ct-panel'), true)
			})
		}

		if (maybeNext) {
			const panel = maybeNext.closest('.ct-panel')

			if (!panel.hasNavigationListener) {
				panel.hasNavigationListener = true

				panel.addEventListener('keydown', (e) => {
					if (!panel.querySelector('.ct-quick-view-nav-next')) {
						return
					}

					if (e.keyCode === 39) {
						handleNavigation(e, panel)
					}

					if (e.keyCode === 37) {
						handleNavigation(e, panel, true)
					}
				})
			}
		}
	})
}
