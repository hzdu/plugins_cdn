import ctEvents from 'ct-events'
import {
	updateAndSaveEl,
	handleBackgroundOptionFor,
	typographyOption,
	getRootSelectorFor,
	assembleSelector,
	mutateSelector,
	responsiveClassesFor,
} from 'blocksy-customizer-sync'

const getVariables = ({ itemId, panelType }) => ({
	ls_items_spacing: {
		selector: assembleSelector(getRootSelectorFor({ panelType, itemId })),
		variable: 'items-spacing',
		responsive: true,
		unit: 'px',
	},

	...typographyOption({
		id: 'ls_font',
		selector: assembleSelector(getRootSelectorFor({ panelType, itemId })),
	}),

	ls_dropdown_offset: {
		selector: assembleSelector(
			mutateSelector({
				selector: getRootSelectorFor({ panelType, itemId }),
				operation: 'suffix',
				to_add: 'ul',
			})
		),
		variable: 'margin-top',
		unit: 'px',
	},

	ls_dropdown_items_spacing: {
		selector: assembleSelector(
			mutateSelector({
				selector: getRootSelectorFor({ panelType, itemId }),
				operation: 'suffix',
				to_add: 'ul',
			})
		),
		variable: 'padding',
		unit: 'px',
	},

	...typographyOption({
		id: 'ls_dropdown_font',
		selector: assembleSelector(
			mutateSelector({
				selector: getRootSelectorFor({ panelType, itemId }),
				operation: 'suffix',
				to_add: 'ul[data-placement]',
			})
		),
	}),

	ls_dropdown_font_color: [
		{
			selector: assembleSelector(
				mutateSelector({
					selector: getRootSelectorFor({ panelType, itemId }),
					operation: 'suffix',
					to_add: 'ul',
				})
			),
			variable: 'linkInitialColor',
			type: 'color:default',
		},

		{
			selector: assembleSelector(
				mutateSelector({
					selector: getRootSelectorFor({ panelType, itemId }),
					operation: 'suffix',
					to_add: 'ul',
				})
			),
			variable: 'linkHoverColor',
			type: 'color:hover',
		},
	],

	ls_dropdown_divider: {
		selector: assembleSelector(
			mutateSelector({
				selector: getRootSelectorFor({ panelType, itemId }),
				operation: 'suffix',
				to_add: 'ul',
			})
		),
		variable: 'border',
		type: 'border',
	},

	ls_dropdown_background: [
		{
			selector: assembleSelector(
				mutateSelector({
					selector: getRootSelectorFor({ panelType, itemId }),
					operation: 'suffix',
					to_add: 'ul',
				})
			),
			variable: 'background-color',
			type: 'color:default',
		},
	],

	ls_dropdown_shadow: {
		selector: assembleSelector(
			mutateSelector({
				selector: getRootSelectorFor({ panelType, itemId }),
				operation: 'suffix',
				to_add: 'ul',
			})
		),
		type: 'box-shadow',
		variable: 'box-shadow',
		responsive: true,
	},

	ls_dropdown_radius: {
		selector: assembleSelector(
			mutateSelector({
				selector: getRootSelectorFor({ panelType, itemId }),
				operation: 'suffix',
				to_add: 'ul',
			})
		),
		type: 'spacing',
		variable: 'border-radius',
		responsive: true,
	},

	ls_margin: {
		selector: assembleSelector(getRootSelectorFor({ panelType, itemId })),
		type: 'spacing',
		variable: 'margin',
		responsive: true,
	},

	// default state
	ls_label_color: [
		{
			selector: assembleSelector(
				mutateSelector({
					selector: getRootSelectorFor({ panelType, itemId }),
					operation: 'suffix',
					to_add: '.ct-language',
				})
			),
			variable: 'linkInitialColor',
			type: 'color:default',
		},

		{
			selector: assembleSelector(
				mutateSelector({
					selector: getRootSelectorFor({ panelType, itemId }),
					operation: 'suffix',
					to_add: '.ct-language',
				})
			),
			variable: 'linkHoverColor',
			type: 'color:hover',
		},
	],

	// transparent state
	transparent_ls_label_color: [
		{
			selector: assembleSelector(
				mutateSelector({
					selector: mutateSelector({
						selector: getRootSelectorFor({ panelType, itemId }),
						operation: 'suffix',
						to_add: '.ct-language',
					}),
					operation: 'between',
					to_add: '[data-transparent-row="yes"]',
				})
			),

			variable: 'linkInitialColor',
			type: 'color:default',
		},

		{
			selector: assembleSelector(
				mutateSelector({
					selector: mutateSelector({
						selector: getRootSelectorFor({ panelType, itemId }),
						operation: 'suffix',
						to_add: '.ct-language',
					}),
					operation: 'between',
					to_add: '[data-transparent-row="yes"]',
				})
			),

			variable: 'linkHoverColor',
			type: 'color:hover',
		},
	],

	// sticky state
	sticky_ls_label_color: [
		{
			selector: assembleSelector(
				mutateSelector({
					selector: mutateSelector({
						selector: getRootSelectorFor({ panelType, itemId }),
						operation: 'suffix',
						to_add: '.ct-language',
					}),
					operation: 'between',
					to_add: '[data-sticky*="yes"]',
				})
			),
			variable: 'linkInitialColor',
			type: 'color:default',
		},

		{
			selector: assembleSelector(
				mutateSelector({
					selector: mutateSelector({
						selector: getRootSelectorFor({ panelType, itemId }),
						operation: 'suffix',
						to_add: '.ct-language',
					}),
					operation: 'between',
					to_add: '[data-sticky*="yes"]',
				})
			),
			variable: 'linkHoverColor',
			type: 'color:hover',
		},
	],

	// footer language switcher
	footer_ls_horizontal_alignment: {
		selector: assembleSelector(
			mutateSelector({
				selector: getRootSelectorFor({
					itemId,
					panelType: 'footer',
				}),
				operation: 'replace-last',
				to_add: '[data-column="language-switcher"]',
			})
		),
		variable: 'horizontal-alignment',
		responsive: true,
		unit: '',
	},

	footer_ls_vertical_alignment: {
		selector: assembleSelector(
			mutateSelector({
				selector: getRootSelectorFor({
					itemId,
					panelType: 'footer',
				}),
				operation: 'replace-last',
				to_add: '[data-column="language-switcher"]',
			})
		),
		variable: 'vertical-alignment',
		responsive: true,
		unit: '',
	},
})

ctEvents.on(
	'ct:header:sync:collect-variable-descriptors',
	(variableDescriptors) => {
		variableDescriptors['language-switcher'] = ({ itemId }) =>
			getVariables({
				itemId,
				panelType: 'header',
			})
	}
)

ctEvents.on(
	'ct:footer:sync:collect-variable-descriptors',
	(variableDescriptors) => {
		variableDescriptors['language-switcher'] = ({ itemId }) =>
			getVariables({
				itemId,
				panelType: 'footer',
			})
	}
)

ctEvents.on(
	'ct:header:sync:item:language-switcher',
	({ itemId, optionId, optionValue }) => {
		const selector = `[data-id="${itemId}"]`

		if (optionId === 'visibility') {
			updateAndSaveEl(selector, (el) => {
				responsiveClassesFor({ ...optionValue, desktop: true }, el)
			})
		}
	}
)

ctEvents.on(
	'ct:footer:sync:item:language-switcher',
	({ itemId, optionId, optionValue }) => {
		const selector = `.ct-footer [data-id="${itemId}"]`
		const el = document.querySelector(selector)

		if (optionId === 'footer_visibility') {
			responsiveClassesFor(optionValue, el)
		}
	}
)
