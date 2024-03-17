import { generateQuerySelector } from './utils'

// support 3 strategies:
// 1. data-target on el
// 2. when no data-target, find aria-hidden element on the same level
// 3. when no data-target attribute is present, find aria-hidden element on
//    upper level.
//
// If you can't find target — do nothing.
const findTargetForEl = (el) => {
	// case 1
	if (el.hasAttribute('data-target')) {
		return document.querySelector(el.getAttribute('data-target'))
	}

	// case 2
	const maybeCurrentLevel = el.parentNode.querySelector('[aria-hidden]')

	if (maybeCurrentLevel) {
		return maybeCurrentLevel
	}

	// case 3
	const maybeUpperLevel =
		el.parentNode.parentNode.querySelector('[aria-hidden]')

	if (maybeUpperLevel) {
		return maybeUpperLevel
	}

	// When nothing found -- do nothing
	return null
}

class AccordionsPatcher {
	id = 'accordions'

	getAllExpandables() {
		return [
			...document.querySelectorAll(
				'.ct-filter-item-inner .ct-expandable-trigger, .ct-block-wrapper > .ct-expandable-trigger'
			),
		]
	}

	generateElIdentifier(el) {
		return {
			selector: generateQuerySelector(el),
			text: (el.innerText || el.parentNode.innerText).replace(
				/[\d\(\)]/gu,
				''
			),
		}
	}

	elementMatchesIdentifier(el, identifier) {
		let innerTextForMatching = (
			el.innerText || el.parentNode.innerText
		).replace(/[\d\(\)]/gu, '')

		return (
			identifier.text === innerTextForMatching &&
			el.matches(identifier.selector)
		)
	}

	beforeReplace() {
		const allTriggersStates = this.getAllExpandables().map((el) =>
			this.generateElIdentifier(el)
		)

		const previousExpandedTriggersStates = this.getAllExpandables()
			.filter((el) => el.ariaExpanded === 'true')
			.map((el) => this.generateElIdentifier(el))

		return {
			allTriggersStates,
			previousExpandedTriggersStates,
		}
	}

	afterReplace({ previousExpandedTriggersStates, allTriggersStates }) {
		this.getAllExpandables().map((el) => {
			const wasOnThePageBefore = allTriggersStates.some((identifier) =>
				this.elementMatchesIdentifier(el, identifier)
			)

			// Leave as is if it was not on the page before
			if (!wasOnThePageBefore) {
				return
			}

			const isExpandedNow = el.ariaExpanded === 'true'
			const wasExpandedBefore = previousExpandedTriggersStates.some(
				(identifier) => this.elementMatchesIdentifier(el, identifier)
			)

			if (isExpandedNow && wasExpandedBefore) {
				return
			}

			el.ariaExpanded = wasExpandedBefore ? 'true' : 'false'

			const targetEl = findTargetForEl(el)

			if (targetEl) {
				targetEl.ariaHidden = wasExpandedBefore ? 'false' : 'true'
			}
		})
	}
}

export default AccordionsPatcher
