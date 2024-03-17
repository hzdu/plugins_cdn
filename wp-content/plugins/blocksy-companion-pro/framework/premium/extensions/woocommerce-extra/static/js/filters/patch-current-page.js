import ToggleFilterPanelPatcher from './patch-current-page/toggle-filter-panel-patcher'
import PaginationPatcher from './patch-current-page/pagination-patcher'
import SearchPatcher from './patch-current-page/search-patcher'
import AccordionsPatcher from './patch-current-page/accordions-patcher'

import { generateQuerySelector } from './patch-current-page/utils'

// a replacement has to:
// 1. have beforeReplace method that returns some payload
// 2. have afterReplace method that accepts payload from beforeReplace
const replacements = [
	new ToggleFilterPanelPatcher(),
	new PaginationPatcher(),
	new SearchPatcher(),
	new AccordionsPatcher(),
]

const isKnownWidget = (el) => {
	return (
		el.querySelector('.ct-filter-widget') ||
		el.className.includes('ct-active-filters') ||
		el.querySelector('.ct-active-filters')
	)
}

const beforeReplace = (selectors) => {
	const payload = replacements.reduce((acc, replacement) => {
		const payload = replacement.beforeReplace()

		return {
			...acc,
			...(payload ? { [replacement.id]: payload } : {}),
		}
	}, {})

	// Persist unknown widgets into a buffer
	document.body.insertAdjacentHTML(
		'beforeend',
		'<div class="ct-tmp-filter-buffer"></div>'
	)

	selectors.map((selector) => {
		const maybeCurrentWidgetHolder = document.querySelector(selector)

		if (!maybeCurrentWidgetHolder) {
			return
		}

		;[...maybeCurrentWidgetHolder.children].map((el) => {
			if (!isKnownWidget(el)) {
				document.querySelector('.ct-tmp-filter-buffer').appendChild(el)
			} else {
				el.remove()
			}
		})
	})

	return payload
}

const replace = (nextPage, selectors) => {
	const currentRef = document.querySelector(
		'.ct-products-container'
	).parentNode

	let futureRef = null

	if (nextPage.querySelector('.ct-products-container')) {
		futureRef = nextPage.querySelector('.ct-products-container').parentNode
	}

	if (!futureRef) {
		futureRef = nextPage.querySelector('.ct-no-results').parentNode
	}

	if (!futureRef) {
		return
	}

	;[...currentRef.children].map((el) => {
		if (el.matches('.ct-products-container')) {
			;[...el.children].map((el) => {
				if (el.matches('.ct-filters-loading')) {
					return
				}

				el.remove()
			})

			return
		}

		el.remove()
	})
	;[...futureRef.children].map((el) => {
		if (el.matches('.ct-products-container')) {
			const currentProducts = currentRef.querySelector(
				'.ct-products-container'
			)

			;[...el.children].map((el) => {
				if (el.matches('.ct-filters-loading')) {
					return
				}

				currentProducts.appendChild(el)
			})

			currentRef.appendChild(currentProducts)

			return
		}

		currentRef.insertAdjacentHTML('beforeend', el.outerHTML)
	})

	selectors.map((selector) => {
		let maybeFutureWidgetHolder = nextPage.querySelector(selector)

		const maybeCurrentWidgetHolder = document.querySelector(selector)

		if (!maybeFutureWidgetHolder || !maybeCurrentWidgetHolder) {
			return
		}

		maybeCurrentWidgetHolder.innerHTML = ''
		;[...maybeFutureWidgetHolder.children].map((futureWidget) => {
			// If its our widget, just append it
			if (isKnownWidget(futureWidget)) {
				maybeCurrentWidgetHolder.insertAdjacentHTML(
					'beforeend',
					futureWidget.outerHTML
				)
				return
			}

			// If its not our widget, look for the same widget ID
			// in the tmp buffer and just re-append it to the parent

			if (futureWidget.id) {
				const maybeFutureWidget = document.querySelector(
					`.ct-tmp-filter-buffer #${futureWidget.id}`
				)

				if (maybeFutureWidget) {
					maybeCurrentWidgetHolder.appendChild(maybeFutureWidget)
				}
			}
		})
	})
}

const afterReplace = (payload) => {
	if (payload.previousExpandedTriggersStates) {
		const previousAllTriggersStates = payload.previousExpandedTriggersStates
			.map((selector) => document.querySelector(selector))
			.filter((el) => el)

		const previousExpandedTriggersStates =
			payload.previousExpandedTriggersStates
				.map((selector) => document.querySelector(selector))
				.filter((el) => el)
		;[
			...document.querySelectorAll(
				'.ct-filter-item-inner .ct-expandable-trigger, .ct-block-wrapper > .ct-expandable-trigger'
			),
		].map((el) => {
			if (
				el.ariaExpanded === 'true' &&
				previousExpandedTriggersStates.includes(el)
			) {
				return
			}

			if (!previousAllTriggersStates.includes(el)) {
				return
			}

			el.ariaExpanded = 'false'
			const { target } = el.dataset

			if (document.querySelector(target)) {
				document.querySelector(target).ariaHidden = 'true'
			}

			if (previousExpandedTriggersStates.includes(el)) {
				el.ariaExpanded = 'true'
				const { target } = el.dataset
				if (document.querySelector(target)) {
					document.querySelector(target).ariaHidden = 'false'
				}
			}
		})
	}

	document.querySelector('.ct-tmp-filter-buffer').remove()

	replacements.forEach((replacement) => {
		const maybePayload = payload[replacement.id]
			? payload[replacement.id]
			: {}

		replacement.afterReplace(maybePayload)
	})
}

export const patchCurrentPageWith = (nextPage) => {
	const virtualContainer = document.createElement('div')
	virtualContainer.innerHTML = nextPage

	const selectors = [
		...new Set(
			Array.from(
				document.querySelectorAll(
					'.ct-filter-widget, .ct-active-filters'
				)
			)
				.map((w) => {
					let parentForSelector = null

					if (w.closest('.ct-block-wrapper')) {
						parentForSelector =
							w.closest('.ct-block-wrapper').parentNode
					}

					if (w.closest('.ct-widget')) {
						parentForSelector = w.closest('.ct-widget').parentNode
					}

					if (parentForSelector) {
						return generateQuerySelector(parentForSelector)
					}

					return null
				})
				.filter((w) => w)
		),
	]

	const payload = beforeReplace(selectors)

	replace(virtualContainer, selectors)
	afterReplace(payload)
}
