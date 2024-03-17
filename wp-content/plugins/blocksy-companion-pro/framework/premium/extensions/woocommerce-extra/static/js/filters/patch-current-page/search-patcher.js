import { generateQuerySelector } from './utils'

class SearchPatcher {
	id = 'search'

	beforeReplace() {
		const previousSearchInputValue = [
			...document.querySelectorAll(
				'.ct-filter-search input[type="search"]'
			),
		]
			.map((el) => ({
				selector: generateQuerySelector(el),
				value: el.value,
			}))
			.filter(({ value }) => value)

		return { previousSearchInputValue }
	}

	afterReplace({ previousSearchInputValue = [] }) {
		previousSearchInputValue.map(({ selector, value }) => {
			const maybeCurrentInput = document.querySelector(selector)

			if (maybeCurrentInput) {
				maybeCurrentInput.value = value

				ctEvents.trigger('blocksy:filters:search', {
					el: maybeCurrentInput,
					value,
				})
			}
		})
	}
}

export default SearchPatcher
