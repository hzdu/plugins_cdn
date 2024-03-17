import ctEvents from 'ct-events'
import { registerDynamicChunk } from 'blocksy-frontend'

const constructFilterableList = (id, el) => {
	const list = []

	el.querySelectorAll('.ct-filter-label').forEach((item) => {
		const clonedItem = item.cloneNode(true)

		clonedItem.querySelector('.ct-filter-count')?.remove()
		list.push(clonedItem.textContent.trim().toLowerCase())
	})

	return list
}

let buttonHasEventListener = false

const handleSearch = (el, query) => {
	const id = el.closest('.ct-filter-widget-wrapper').id
	const filter = el
		.closest('.ct-filter-widget-wrapper')
		.querySelector('.ct-filter-widget')

	const searchResults = filter.parentNode.querySelector(
		'.ct-filter-search-results'
	)

	if (searchResults) {
		searchResults.remove()
	}

	if (!query) {
		el.closest('.ct-filter-widget-wrapper').classList.remove('ct-active')

		ctEvents.trigger('blocksy:frontend:init')
		return
	}

	el.closest('.ct-filter-widget-wrapper').classList.add('ct-active')

	const list = constructFilterableList(id, filter)
	const visible_items = []

	filter.querySelectorAll('.ct-filter-item').forEach((item) => {
		const label = item.querySelector('a').ariaLabel

		if (!label) {
			return
		}

		const formatedLabel = label.trim().toLowerCase()

		if (list.includes(formatedLabel) && formatedLabel.includes(query)) {
			const clonedItem = item.cloneNode(true)
			clonedItem.querySelector('.ct-expandable-trigger')?.remove()
			clonedItem.querySelector('.ct-filter-children')?.remove()

			visible_items.push(clonedItem)
		}
	})

	const clonedFilter = filter.cloneNode(true)
	clonedFilter.classList.add('ct-filter-search-results')
	clonedFilter.innerHTML = ''

	if (visible_items.length === 0) {
		clonedFilter.innerHTML = `<li class="ct-filter-item ct-no-results">${ct_localizations.search_live_results}</li>`
	} else {
		visible_items.forEach((item) => {
			clonedFilter.appendChild(item)
		})
	}

	filter.parentNode.insertBefore(clonedFilter, filter.nextSibling)

	if (!buttonHasEventListener) {
		el.closest('.ct-filter-search')
			.querySelector('.ct-filter-search-icon')
			.addEventListener('click', (e) => {
				el.closest('.ct-filter-search').classList.remove('ct-active')
				el.value = ''

				ctEvents.trigger('blocksy:filters:search', {
					el,
					value: '',
				})

				ctEvents.trigger('blocksy:frontend:init')
			})

		buttonHasEventListener = true
	}

	ctEvents.trigger('blocksy:frontend:init')
}

registerDynamicChunk('blocksy_ext_woo_extra_filters_search', {
	mount: (el, { event }) => {
		handleSearch(el, event.target.value.trim().toLowerCase())
	},
})

ctEvents.on('blocksy:filters:search', ({ el, value }) => {
	if (value) {
		buttonHasEventListener = false
	}

	handleSearch(el, value)
})
