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
				variable: 'icon-size',
				responsive: true,
				unit: 'px',
			},

			...typographyOption({
				id: 'wishlist_label_font',
				selector: assembleSelector(
					mutateSelector({
						selector: [getRootSelectorFor({ itemId })[0]],
						operation: 'suffix',
						to_add: '.ct-label',
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
					variable: 'linkInitialColor',
					type: 'color:default',
					responsive: true,
				},

				{
					selector: assembleSelector(getRootSelectorFor({ itemId })),
					variable: 'linkHoverColor',
					type: 'color:hover',
					responsive: true,
				},
			],

			header_wishlist_icon_color: [
				{
					selector: assembleSelector(getRootSelectorFor({ itemId })),
					variable: 'icon-color',
					type: 'color:default',
					responsive: true,
				},

				{
					selector: assembleSelector(getRootSelectorFor({ itemId })),
					variable: 'icon-hover-color',
					type: 'color:hover',
					responsive: true,
				},
			],

			header_wishlist_badge_color: [
				{
					selector: assembleSelector(getRootSelectorFor({ itemId })),
					variable: 'cartBadgeBackground',
					type: 'color:background',
					responsive: true,
				},

				{
					selector: assembleSelector(getRootSelectorFor({ itemId })),
					variable: 'cartBadgeText',
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
					variable: 'linkInitialColor',
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
					variable: 'linkHoverColor',
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
					variable: 'icon-color',
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
					variable: 'icon-hover-color',
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
					variable: 'cartBadgeBackground',
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
					variable: 'cartBadgeText',
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
					variable: 'linkInitialColor',
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
					variable: 'linkHoverColor',
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
					variable: 'icon-color',
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
					variable: 'icon-hover-color',
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
					variable: 'cartBadgeBackground',
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
					variable: 'cartBadgeText',
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
		}

		if (optionId === 'has_wishlist_badge') {
			updateAndSaveEl(selector, (el) => {
				el.removeAttribute('data-skip-badge')
				if (optionValue === 'yes') return
				el.dataset.skipBadge = ''
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
