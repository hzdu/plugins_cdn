import ctEvents from 'ct-events'
import { registerDynamicChunk } from 'blocksy-frontend'
import { maybeHandleCompareSingleProduct } from './single'
import { maybeHandleCompareArchiveProduct } from './archive'
import { maybeHandleCompareTableProduct } from './table'
import { maybeHandleCompareBarProduct, removeEmptyRows } from './common'
import { syncBarItems } from './bar'
import { getFetchDescriptorFor } from './modal'

const createCookie = (name, value, days = 365) => {
	var expires

	if (days) {
		var date = new Date()

		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
		expires = '; expires=' + date.toGMTString()
	} else {
		expires = ''
	}

	document.cookie = name + '=' + value + expires + '; path=/'
}

const syncCounters = (newList = []) => {
	Array.from(
		document.querySelectorAll(
			'.ct-header-compare, [data-id="compare"], [data-shortcut="compare"]'
		)
	).map((el) => {
		el.classList.remove('ct-added')
		el.classList.add('ct-adding')

		el.removeAttribute('style')
		;[...document.querySelectorAll('.ct-dynamic-count-compare')].map(
			(counter) => {
				counter.innerHTML = newList.length
				counter.dataset.count = newList.length
			}
		)

		setTimeout(() => {
			el.classList.remove('ct-adding')
			el.classList.add('ct-added')
		})
	})
}

const syncCompareProductsState = ({
	// add | remove
	operation,
	productId: productIdInternal,

	el,

	cb = () => {},
} = {}) => {
	let oldList = Object.values(ct_localizations.blc_ext_compare_list.list)

	let newList = oldList

	if (operation) {
		let productId =
			productIdInternal ||
			Array.from(el.classList)
				.find((className) => className.indexOf('post-') === 0)
				.split('-')[1]

		if (el) {
			if (el.classList.contains('ct-compare-button-single')) {
				newList = maybeHandleCompareSingleProduct(el, operation)
			}

			if (el.classList.contains('ct-compare-button-archive')) {
				newList = maybeHandleCompareArchiveProduct(el, operation)
			}

			if (
				operation === 'remove' &&
				el.classList.contains('ct-compare-remove') &&
				!el.closest('.ct-compare-bar')
			) {
				newList = maybeHandleCompareTableProduct(el)
			}

			if (operation === 'remove' && el.closest('.ct-compare-bar')) {
				newList = maybeHandleCompareBarProduct(el)
			}
		}

		createCookie('blc_products_compare_list', JSON.stringify([...newList]))

		setTimeout(() => {
			cb()
		})

		window.ct_localizations.blc_ext_compare_list.list = newList

		ctEvents.trigger(`blocksy:woocommerce:compare-list-change`, {
			operation,
			productId,
		})
	}

	syncCounters(newList)
}

const syncBarItemsCallback = (data) => {
	window.ct_localizations.blc_ext_compare_list = {
		list: data.items_to_compare,
	}

	let selector = '[class*="ct-compare-button"], .ct-compare-remove'

	const allCompareItems = data.items_to_compare.map((item) => item.id)

	;[...document.querySelectorAll(selector)].map((el) => {
		el.dataset.buttonState = ''

		if (
			allCompareItems.indexOf(
				parseInt(el.getAttribute('href').replace('#compare-add-', ''))
			) > -1
		) {
			el.dataset.buttonState = 'active'
		}
	})

	syncCounters(data.items_to_compare)
}

let loadedCompareItems = false

ctEvents.on('blocksy:compare:sync', () =>
	syncBarItemsCallback({
		items_to_compare: window.ct_localizations.blc_ext_compare_list.list,
	})
)

registerDynamicChunk('blocksy_ext_woo_extra_compare_list', {
	mount: (el, payload = {}) => {
		const { event, initialState, completeAction } = payload || {}

		if (!event) {
			if (!loadedCompareItems) {
				loadedCompareItems = true

				syncBarItems({
					forceSync: true,
					cb: syncBarItemsCallback,
				})
			}

			return
		}

		event.preventDefault()
		event.stopPropagation()

		const operation =
			initialState === 'active' ||
			el.classList.contains('ct-compare-remove')
				? 'remove'
				: 'add'

		syncCompareProductsState({
			productId: el.dataset.id,
			el,
			operation,
			cb: () => {
				if (!el.classList.contains('ct-compare-remove')) {
					if (operation === 'add') {
						completeAction({
							finalState: 'active',
							ensureAtLeast: 500,
						})
					} else {
						completeAction({
							finalState: '',
							ensureAtLeast: 500,
						})
					}
				}

				const compareTable = el.closest('.ct-compare-table')

				if (compareTable) {
					setTimeout(() => {
						if (
							el.closest('.ct-compare-row').children.length === 2
						) {
							const panel =
								document.querySelector('#ct-compare-modal')

							if (panel) {
								const closeTrigger =
									panel.querySelector('.ct-toggle-close')

								if (closeTrigger) {
									closeTrigger.click()
								}
							} else {
								const fetchDescriptor = getFetchDescriptorFor()

								fetchDescriptor.fetch().then((content) => {
									const message =
										content.querySelector(
											'.woocommerce-info'
										)

									if (message) {
										compareTable.outerHTML =
											message.outerHTML
									}
								})
							}
						} else {
							const compareItemsStyles =
								getComputedStyle(compareTable)
							const tableIitemsCount =
								compareItemsStyles.getPropertyValue(
									'--compare-products'
								)

							compareTable.style.setProperty(
								'--compare-products',
								tableIitemsCount - 1 || 1
							)
							const index = Array.from(
								el.closest('.ct-compare-column').parentNode
									.children
							).indexOf(el.closest('.ct-compare-column'))

							const columns = document.querySelectorAll(
								`.ct-compare-row > .ct-compare-column:nth-child(${
									index + 1
								})`
							)

							if (columns.length > 2) {
								columns.forEach((column) => {
									column.remove()
								})
							}

							removeEmptyRows()
						}
					}, 500)
				}

				setTimeout(() => {
					syncBarItems({
						forceSync: true,
						cb: syncBarItemsCallback,
					})
				}, 500)
			},
		})
	},
})
