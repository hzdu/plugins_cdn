import ctEvents from 'ct-events'
import {
	updateAndSaveEl,
	handleBackgroundOptionFor,
	typographyOption,
	getRootSelectorFor,
	assembleSelector,
	responsiveClassesFor,
	mutateSelector,
} from 'blocksy-customizer-sync'

ctEvents.on(
	'ct:header:sync:collect-variable-descriptors',
	(variableDescriptors) => {
		variableDescriptors['wish-list'] = ({ itemId }) => ({
			wishlist_icon_size: {
				selector: assembleSelector(getRootSelectorFor({ itemId })),
				variable: 'theme-icon-size',
				responsive: true,
				unit: 'px',
			},

			...typographyOption({
				id: 'wishlist_label_font',
				selector: assembleSelector(
					mutateSelector({
						selector: [getRootSelectorFor({ itemId })[0]],
						operation: 'suffix',
						to_add: '.ct-header-wishlist .ct-label',
					})
				),
			}),

			header_wishlist_margin: {
				selector: assembleSelector(getRootSelectorFor({ itemId })),
				type: 'spacing',
				variable: 'margin',
				responsive: true,
				important: true,
			},

			// default state
			header_wishlist_font_color: [
				{
					selector: assembleSelector(getRootSelectorFor({ itemId })),
					variable: 'theme-link-initial-color',
					type: 'color:default',
					responsive: true,
				},

				{
					selector: assembleSelector(getRootSelectorFor({ itemId })),
					variable: 'theme-link-hover-color',
					type: 'color:hover',
					responsive: true,
				},
			],

			header_wishlist_icon_color: [
				{
					selector: assembleSelector(getRootSelectorFor({ itemId })),
					variable: 'theme-icon-color',
					type: 'color:default',
					responsive: true,
				},

				{
					selector: assembleSelector(getRootSelectorFor({ itemId })),
					variable: 'theme-icon-hover-color',
					type: 'color:hover',
					responsive: true,
				},
			],

			header_wishlist_badge_color: [
				{
					selector: assembleSelector(getRootSelectorFor({ itemId })),
					variable: 'theme-cart-badge-background',
					type: 'color:background',
					responsive: true,
				},

				{
					selector: assembleSelector(getRootSelectorFor({ itemId })),
					variable: 'theme-cart-badge-text',
					type: 'color:text',
					responsive: true,
				},
			],

			// transparent state
			transparent_header_wishlist_font_color: [
				{
					selector: assembleSelector(
						mutateSelector({
							selector: getRootSelectorFor({ itemId }),
							operation: 'between',
							to_add: '[data-transparent-row="yes"]',
						})
					),
					variable: 'theme-link-initial-color',
					type: 'color:default',
					responsive: true,
				},

				{
					selector: assembleSelector(
						mutateSelector({
							selector: getRootSelectorFor({ itemId }),
							operation: 'between',
							to_add: '[data-transparent-row="yes"]',
						})
					),
					variable: 'theme-link-hover-color',
					type: 'color:hover',
					responsive: true,
				},
			],

			transparent_header_wishlist_icon_color: [
				{
					selector: assembleSelector(
						mutateSelector({
							selector: getRootSelectorFor({ itemId }),
							operation: 'between',
							to_add: '[data-transparent-row="yes"]',
						})
					),
					variable: 'theme-icon-color',
					type: 'color:default',
					responsive: true,
				},

				{
					selector: assembleSelector(
						mutateSelector({
							selector: getRootSelectorFor({ itemId }),
							operation: 'between',
							to_add: '[data-transparent-row="yes"]',
						})
					),
					variable: 'theme-icon-hover-color',
					type: 'color:hover',
					responsive: true,
				},
			],

			transparent_header_wishlist_badge_color: [
				{
					selector: assembleSelector(
						mutateSelector({
							selector: getRootSelectorFor({ itemId }),
							operation: 'between',
							to_add: '[data-transparent-row="yes"]',
						})
					),
					variable: 'theme-cart-badge-background',
					type: 'color:background',
					responsive: true,
				},

				{
					selector: assembleSelector(
						mutateSelector({
							selector: getRootSelectorFor({ itemId }),
							operation: 'between',
							to_add: '[data-transparent-row="yes"]',
						})
					),
					variable: 'theme-cart-badge-text',
					type: 'color:text',
					responsive: true,
				},
			],

			// sticky state
			sticky_header_wishlist_font_color: [
				{
					selector: assembleSelector(
						mutateSelector({
							selector: getRootSelectorFor({ itemId }),
							operation: 'between',
							to_add: '[data-sticky*="yes"]',
						})
					),
					variable: 'theme-link-initial-color',
					type: 'color:default',
					responsive: true,
				},

				{
					selector: assembleSelector(
						mutateSelector({
							selector: getRootSelectorFor({ itemId }),
							operation: 'between',
							to_add: '[data-sticky*="yes"]',
						})
					),
					variable: 'theme-link-hover-color',
					type: 'color:hover',
					responsive: true,
				},
			],

			sticky_header_wishlist_icon_color: [
				{
					selector: assembleSelector(
						mutateSelector({
							selector: getRootSelectorFor({ itemId }),
							operation: 'between',
							to_add: '[data-sticky*="yes"]',
						})
					),
					variable: 'theme-icon-color',
					type: 'color:default',
					responsive: true,
				},

				{
					selector: assembleSelector(
						mutateSelector({
							selector: getRootSelectorFor({ itemId }),
							operation: 'between',
							to_add: '[data-sticky*="yes"]',
						})
					),
					variable: 'theme-icon-hover-color',
					type: 'color:hover',
					responsive: true,
				},
			],

			sticky_header_wishlist_badge_color: [
				{
					selector: assembleSelector(
						mutateSelector({
							selector: getRootSelectorFor({ itemId }),
							operation: 'between',
							to_add: '[data-sticky*="yes"]',
						})
					),
					variable: 'theme-cart-badge-background',
					type: 'color:background',
					responsive: true,
				},

				{
					selector: assembleSelector(
						mutateSelector({
							selector: getRootSelectorFor({ itemId }),
							operation: 'between',
							to_add: '[data-sticky*="yes"]',
						})
					),
					variable: 'theme-cart-badge-text',
					type: 'color:text',
					responsive: true,
				},
			],
		})
	}
)

ctEvents.on(
	'ct:header:sync:item:wish-list',
	({ values: { wishlist_label }, optionId, optionValue }) => {
		const selector = '[data-id="wish-list"]'

		if (optionId === 'wishlist_label') {
			updateAndSaveEl(selector, (el) => {
				;[...el.querySelectorAll('.ct-label')].map((label) => {
					label.innerHTML = optionValue
				})
			})

			updateAndSaveEl(
				selector,
				(el) => {
					if (!optionValue.desktop) {
						optionValue = {
							desktop: optionValue,
							mobile: optionValue,
						}
					}

					;[...el.querySelectorAll('.ct-label')].map((label) => {
						label.innerHTML = optionValue.desktop
					})
				},
				{ onlyView: 'desktop' }
			)

			updateAndSaveEl(
				selector,
				(el) => {
					if (!optionValue.desktop) {
						optionValue = {
							desktop: optionValue,
							mobile: optionValue,
						}
					}

					;[...el.querySelectorAll('.ct-label')].map((label) => {
						label.innerHTML = optionValue.mobile
					})
				},
				{ onlyView: 'mobile' }
			)
		}

		if (optionId === 'has_wishlist_badge') {
			updateAndSaveEl(selector, (el) => {
				const targetCounter = el.getElementsByClassName(
					'ct-dynamic-count-wishlist'
				)[0]
				targetCounter.dataset.count = targetCounter.innerText

				if (optionValue === 'yes') return
				targetCounter.dataset.count = 0
			})
		}

		if (optionId === 'wishlist_label_visibility') {
			updateAndSaveEl(selector, (el) => {
				;[...el.querySelectorAll('.ct-label')].map((label) => {
					responsiveClassesFor(optionValue, label)
				})
			})
		}

		if (optionId === 'wishlist_label_position') {
			updateAndSaveEl(
				selector,
				(el) => {
					if (!optionValue.desktop) {
						optionValue = {
							desktop: optionValue,
							mobile: optionValue,
						}
					}

					el.dataset.label = optionValue.desktop
				},
				{ onlyView: 'desktop' }
			)

			updateAndSaveEl(
				selector,
				(el) => {
					if (!optionValue.desktop) {
						optionValue = {
							desktop: optionValue,
							mobile: optionValue,
						}
					}

					el.dataset.label = optionValue.mobile
				},
				{ onlyView: 'mobile' }
			)
		}

		if (optionId === 'header_wishlist_visibility') {
			updateAndSaveEl(selector, (el) =>
				responsiveClassesFor({ ...optionValue, desktop: true }, el)
			)
		}
	}
)
