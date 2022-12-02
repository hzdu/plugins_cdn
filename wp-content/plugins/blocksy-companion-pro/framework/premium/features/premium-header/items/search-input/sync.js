import ctEvents from 'ct-events'
import {
	updateAndSaveEl,
	ehandleBackgroundOptionFor,
	typographyOption,
	getRootSelectorFor,
	assembleSelector,
	mutateSelector,
	responsiveClassesFor,
} from 'blocksy-customizer-sync'

const getVariables = ({ itemId, panelType }) => ({
	searchBoxMaxWidth: [
		{
			selector: assembleSelector(
				mutateSelector({
					selector: [getRootSelectorFor({ itemId, panelType })[0]],
					operation: 'suffix',
					to_add: '[data-middle="search-input"]',
				})
			),
			variable: 'search-box-max-width',
			responsive: true,
			unit: '%',
		},

		{
			selector: assembleSelector(
				getRootSelectorFor({ itemId, panelType })
			),
			variable: 'max-width',
			responsive: true,
			unit: '%',
		},
	],

	headerSearchBoxHeight: {
		selector: assembleSelector(getRootSelectorFor({ itemId, panelType })),
		variable: 'form-field-height',
		responsive: true,
		unit: 'px',
	},

	// default state
	sb_font_color: [
		{
			selector: assembleSelector(getRootSelectorFor({ itemId, panelType })),
			variable: 'form-text-initial-color',
			type: 'color:default',
		},

		{
			selector: assembleSelector(getRootSelectorFor({ itemId, panelType })),
			variable: 'form-text-focus-color',
			type: 'color:focus',
		},
	],

	sb_icon_color: [
		{
			selector: assembleSelector(getRootSelectorFor({ itemId, panelType })),
			variable: 'icon-color',
			type: 'color:default',
		},

		{
			selector: assembleSelector(getRootSelectorFor({ itemId, panelType })),
			variable: 'icon-focus-color',
			type: 'color:focus',
		},
	],

	sb_border_color: [
		{
			selector: assembleSelector(
				getRootSelectorFor({ itemId, panelType })
			),
			variable: 'form-field-border-initial-color',
			type: 'color:default',
			responsive: true,
		},

		{
			selector: assembleSelector(
				getRootSelectorFor({ itemId, panelType })
			),
			variable: 'form-field-border-focus-color',
			type: 'color:focus',
			responsive: true,
		},
	],

	sb_background: [
		{
			selector: assembleSelector(
				getRootSelectorFor({ itemId, panelType })
			),
			variable: 'form-field-initial-background',
			type: 'color:default',
			responsive: true,
		},

		{
			selector: assembleSelector(
				getRootSelectorFor({ itemId, panelType })
			),
			variable: 'form-field-focus-background',
			type: 'color:focus',
			responsive: true,
		},
	],

	// transparent state
	transparent_sb_font_color: [
		{
			selector: assembleSelector(
				mutateSelector({
					selector: getRootSelectorFor({ itemId, panelType }),
					operation: 'between',
					to_add: '[data-transparent-row="yes"]',
				})
			),

			variable: 'form-text-initial-color',
			type: 'color:default',
		},

		{
			selector: assembleSelector(
				mutateSelector({
					selector: getRootSelectorFor({ itemId, panelType }),
					operation: 'between',
					to_add: '[data-transparent-row="yes"]',
				})
			),

			variable: 'form-text-focus-color',
			type: 'color:focus',
		},
	],

	transparent_sb_icon_color: [
		{
			selector: assembleSelector(
				mutateSelector({
					selector: getRootSelectorFor({ itemId, panelType }),
					operation: 'between',
					to_add: '[data-transparent-row="yes"]',
				})
			),

			variable: 'icon-color',
			type: 'color:default',
		},

		{
			selector: assembleSelector(
				mutateSelector({
					selector: getRootSelectorFor({ itemId, panelType }),
					operation: 'between',
					to_add: '[data-transparent-row="yes"]',
				})
			),

			variable: 'icon-focus-color',
			type: 'color:focus',
		},
	],

	transparent_sb_border_color: [
		{
			selector: assembleSelector(
				mutateSelector({
					selector: getRootSelectorFor({ itemId, panelType }),
					operation: 'between',
					to_add: '[data-transparent-row="yes"]',
				})
			),

			variable: 'form-field-border-initial-color',
			type: 'color:default',
			responsive: true,
		},

		{
			selector: assembleSelector(
				mutateSelector({
					selector: getRootSelectorFor({ itemId, panelType }),
					operation: 'between',
					to_add: '[data-transparent-row="yes"]',
				})
			),

			variable: 'form-field-border-focus-color',
			type: 'color:focus',
			responsive: true,
		},
	],

	transparent_sb_background: [
		{
			selector: assembleSelector(
				mutateSelector({
					selector: getRootSelectorFor({ itemId, panelType }),
					operation: 'between',
					to_add: '[data-transparent-row="yes"]',
				})
			),

			variable: 'form-field-initial-background',
			type: 'color:default',
			responsive: true,
		},

		{
			selector: assembleSelector(
				mutateSelector({
					selector: getRootSelectorFor({ itemId, panelType }),
					operation: 'between',
					to_add: '[data-transparent-row="yes"]',
				})
			),

			variable: 'form-field-focus-background',
			type: 'color:focus',
			responsive: true,
		},
	],

	// sticky state
	sticky_sb_font_color: [
		{
			selector: assembleSelector(
				mutateSelector({
					selector: getRootSelectorFor({ itemId, panelType }),
					operation: 'between',
					to_add: '[data-sticky*="yes"]',
				})
			),
			variable: 'form-text-initial-color',
			type: 'color:default',
		},

		{
			selector: assembleSelector(
				mutateSelector({
					selector: getRootSelectorFor({ itemId, panelType }),
					operation: 'between',
					to_add: '[data-sticky*="yes"]',
				})
			),
			variable: 'form-text-focus-color',
			type: 'color:focus',
		},
	],

	sticky_sb_icon_color: [
		{
			selector: assembleSelector(
				mutateSelector({
					selector: getRootSelectorFor({ itemId, panelType }),
					operation: 'between',
					to_add: '[data-sticky*="yes"]',
				})
			),
			variable: 'icon-color',
			type: 'color:default',
		},

		{
			selector: assembleSelector(
				mutateSelector({
					selector: getRootSelectorFor({ itemId, panelType }),
					operation: 'between',
					to_add: '[data-sticky*="yes"]',
				})
			),
			variable: 'icon-focus-color',
			type: 'color:focus',
		},
	],

	sticky_sb_border_color: [
		{
			selector: assembleSelector(
				mutateSelector({
					selector: getRootSelectorFor({ itemId, panelType }),
					operation: 'between',
					to_add: '[data-sticky*="yes"]',
				})
			),
			variable: 'form-field-border-initial-color',
			type: 'color:default',
			responsive: true,
		},

		{
			selector: assembleSelector(
				mutateSelector({
					selector: getRootSelectorFor({ itemId, panelType }),
					operation: 'between',
					to_add: '[data-sticky*="yes"]',
				})
			),
			variable: 'form-field-border-focus-color',
			type: 'color:focus',
			responsive: true,
		},
	],

	sticky_sb_background: [
		{
			selector: assembleSelector(
				mutateSelector({
					selector: getRootSelectorFor({ itemId, panelType }),
					operation: 'between',
					to_add: '[data-transparent-row="yes"]',
				})
			),

			variable: 'form-field-initial-background',
			type: 'color:default',
			responsive: true,
		},

		{
			selector: assembleSelector(
				mutateSelector({
					selector: getRootSelectorFor({ itemId, panelType }),
					operation: 'between',
					to_add: '[data-transparent-row="yes"]',
				})
			),

			variable: 'form-field-focus-background',
			type: 'color:focus',
			responsive: true,
		},
	],

	sb_radius: {
		selector: assembleSelector(getRootSelectorFor({ itemId, panelType })),
		type: 'spacing',
		variable: 'form-field-border-radius',
		responsive: true,
	},

	sb_margin: {
		selector: assembleSelector(getRootSelectorFor({ itemId, panelType })),
		type: 'spacing',
		variable: 'margin',
		responsive: true,
		important: true,
	},

	...typographyOption({
		id: 'sb_dropdown_font',
		selector: assembleSelector(
			mutateSelector({
				selector: getRootSelectorFor({ itemId, panelType }),
				operation: 'suffix',
				to_add: '.ct-search-results',
			})
		),
	}),

	sb_dropdown_text: [
		{
			selector: assembleSelector(
				mutateSelector({
					selector: getRootSelectorFor({ itemId, panelType }),
					operation: 'suffix',
					to_add: '.ct-search-results',
				})
			),
			variable: 'linkInitialColor',
			type: 'color:default',
			responsive: true,
		},

		{
			selector: assembleSelector(
				mutateSelector({
					selector: getRootSelectorFor({ itemId, panelType }),
					operation: 'suffix',
					to_add: '.ct-search-results',
				})
			),
			variable: 'linkHoverColor',
			type: 'color:hover',
			responsive: true,
		},
	],

	sb_dropdown_background: [
		{
			selector: assembleSelector(
				mutateSelector({
					selector: getRootSelectorFor({ itemId, panelType }),
					operation: 'suffix',
					to_add: '.ct-search-results',
				})
			),
			variable: 'search-dropdown-background',
			type: 'color:default',
			responsive: true,
		},
	],

	sb_dropdown_divider: {
		selector: assembleSelector(
			mutateSelector({
				selector: getRootSelectorFor({ itemId, panelType }),
				operation: 'suffix',
				to_add: '.ct-search-results',
			})
		),
		variable: 'items-divider',
		type: 'border',
	},

	sb_dropdown_shadow: {
		selector: assembleSelector(
			mutateSelector({
				selector: getRootSelectorFor({ itemId, panelType }),
				operation: 'suffix',
				to_add: '.ct-search-results',
			})
		),
		type: 'box-shadow',
		variable: 'search-dropdown-box-shadow',
		responsive: true,
	},

	// footer logo
	footer_search_box_horizontal_alignment: {
		selector: assembleSelector(
			mutateSelector({
				selector: getRootSelectorFor({
					itemId,
					panelType: 'footer',
				}),
				operation: 'replace-last',
				to_add: '[data-column="search-input"]',
			})
		),
		variable: 'horizontal-alignment',
		responsive: true,
		unit: '',
	},

	footer_search_box_vertical_alignment: {
		selector: assembleSelector(
			mutateSelector({
				selector: getRootSelectorFor({
					itemId,
					panelType: 'footer',
				}),
				operation: 'replace-last',
				to_add: '[data-column="search-input"]',
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
		variableDescriptors['search-input'] = ({ itemId }) =>
			getVariables({ itemId, panelType: 'header' })
	}
)

ctEvents.on(
	'ct:footer:sync:collect-variable-descriptors',
	(variableDescriptors) => {
		variableDescriptors['search-input'] = ({ itemId }) =>
			getVariables({ itemId, panelType: 'footer' })
	}
)

ctEvents.on(
	'ct:header:sync:item:search-input',
	({ values: { search_box_placeholder }, optionId, optionValue }) => {
		const selector = '[data-id="search-input"] input[type="search"]'

		if (optionId === 'search_box_placeholder') {
			updateAndSaveEl(selector, (el) => {
				el.placeholder = optionValue
			})
		}

		if (optionId === 'live_results_images') {
			updateAndSaveEl(selector, (el) => {
				if (el.closest('[data-live-results]')) {
					el.closest('[data-live-results]').dataset.liveResults =
						optionValue === 'yes' ? 'thumbs' : ''
				}
			})
		}

		if (optionId === 'visibility') {
			updateAndSaveEl('[data-id="search-input"]', (el) =>
				responsiveClassesFor({ ...optionValue, desktop: true }, el)
			)
		}
	}
)

ctEvents.on(
	'ct:footer:sync:item:search-input',
	({ values: { search_box_placeholder }, optionId, optionValue }) => {
		const selector =
			'.ct-footer [data-id="search-input"] input[type="search"]'
		const el = document.querySelector(selector)

		if (optionId === 'search_box_placeholder') {
			el.placeholder = optionValue
		}

		if (optionId === 'live_results_images') {
			if (el.closest('[data-live-results]')) {
				el.closest('[data-live-results]').dataset.liveResults =
					optionValue === 'yes' ? 'thumbs' : ''
			}
		}

		if (optionId === 'footer_visibility') {
			responsiveClassesFor(
				optionValue,
				document.querySelector('.ct-footer [data-id="search-input"]')
			)
		}
	}
)
