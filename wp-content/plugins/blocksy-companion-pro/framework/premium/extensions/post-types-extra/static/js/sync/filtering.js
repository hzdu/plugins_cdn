import ctEvents from 'ct-events'
import {
	watchOptionsWithPrefix,
	getPrefixFor,
	getOptionFor,
} from 'blocksy-customizer-sync'

import {
	handleBackgroundOptionFor,
	responsiveClassesFor,
	typographyOption,
	applyPrefixFor,
} from 'blocksy-customizer-sync'

ctEvents.on(
	'ct:customizer:sync:collect-variable-descriptors',
	(allVariables) => {
		allVariables.result = {
			...allVariables.result,
			[`${prefix}_filter_items_horizontal_spacing`]: {
				selector: applyPrefixFor('.ct-dynamic-filter', prefix),
				variable: 'items-horizontal-spacing',
				responsive: true,
				unit: 'px',
			},

			[`${prefix}_filter_items_vertical_spacing`]: {
				selector: applyPrefixFor('.ct-dynamic-filter', prefix),
				variable: 'items-vertical-spacing',
				responsive: true,
				unit: 'px',
			},

			[`${prefix}_filter_container_spacing`]: {
				selector: applyPrefixFor('.ct-dynamic-filter', prefix),
				variable: 'container-spacing',
				responsive: true,
				unit: 'px',
			},

			[`${prefix}_horizontal_alignment`]: {
				selector: applyPrefixFor('.ct-dynamic-filter', prefix),
				variable: 'filter-items-alignment',
				unit: '',
				responsive: true,
			},

			...typographyOption({
				id: `${prefix}_filter_font`,
				selector: applyPrefixFor('.ct-dynamic-filter', prefix),
			}),

			[`${prefix}_filter_font_color`]: [
				{
					selector: applyPrefixFor('.ct-dynamic-filter', prefix),
					variable: 'linkInitialColor',
					type: 'color:default',
				},

				{
					selector: applyPrefixFor('.ct-dynamic-filter', prefix),
					variable: 'linkHoverColor',
					type: 'color:hover',
				},
			],

			[`${prefix}_filter_button_color`]: [
				{
					selector: applyPrefixFor('.ct-dynamic-filter', prefix),
					variable: 'buttonInitialColor',
					type: 'color:default',
				},

				{
					selector: applyPrefixFor('.ct-dynamic-filter', prefix),
					variable: 'buttonHoverColor',
					type: 'color:hover',
				},
			],

			[`${prefix}_filter_button_padding`]: {
				selector: applyPrefixFor('.ct-dynamic-filter', prefix),
				type: 'spacing',
				variable: 'padding',
				responsive: true,
				unit: '',
			},

			[`${prefix}_filter_button_border_radius`]: {
				selector: applyPrefixFor('.ct-dynamic-filter', prefix),
				type: 'spacing',
				variable: 'border-radius',
				responsive: true,
			},
		}
	}
)

const prefix = getPrefixFor({
	allowed_prefixes: ['blog', 'woo_categories'],
	default_prefix: 'blog',
})

watchOptionsWithPrefix({
	getPrefix: () => prefix,
	getOptionsForPrefix: () => [
		`${prefix}_filter_visibility`,
		`${prefix}_filter_type`,
	],

	render: () => {
		;[...document.querySelectorAll('.ct-dynamic-filter')].map((el) => {
			responsiveClassesFor(getOptionFor('filter_visibility', prefix), el)
			el.closest('main').classList.add('ct-no-transition')
			requestAnimationFrame(() => {
				el.dataset.type = getOptionFor('filter_type', prefix)

				setTimeout(() => {
					el.closest('main').classList.remove('ct-no-transition')
				})
			})
		})
	},
})
