class ToggleFilterPanelPatcher {
	id = 'toggle-filter-panel'

	beforeReplace() {
		const currentTop = document.querySelector('.woo-listing-top')

		const wasTopExanded =
			currentTop &&
			!!currentTop.querySelector(
				'.ct-toggle-filter-panel[aria-expanded="true"]'
			)

		return { wasTopExanded }
	}

	afterReplace({ wasTopExanded }) {
		const currentRef = document.querySelector(
			'.ct-products-container'
		).parentNode

		if (
			!currentRef.querySelector('.ct-filter-content')
			// ||
			// !currentRef.querySelector('.ct-filter-content > *')
		) {
			return
		}

		if (currentRef.querySelector('.ct-toggle-filter-panel')) {
			currentRef.querySelector('.ct-toggle-filter-panel').ariaExpanded =
				wasTopExanded
		} else {
			wasTopExanded = false
		}

		const maybeFilters = currentRef.querySelector('#woo-filters-panel')

		if (maybeFilters) {
			maybeFilters.ariaHidden = !wasTopExanded
		}
	}
}

export default ToggleFilterPanelPatcher
