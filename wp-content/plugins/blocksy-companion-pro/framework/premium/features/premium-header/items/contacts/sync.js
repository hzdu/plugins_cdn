import ctEvents from 'ct-events'
import {
	updateAndSaveEl,
	handleBackgroundOptionFor,
	responsiveClassesFor,
	typographyOption,
	getRootSelectorFor,
	assembleSelector,
	mutateSelector,
} from 'blocksy-customizer-sync'

const getVariables = ({ itemId, fullItemId, panelType }) => ({
	contacts_icon_size: {
		selector: assembleSelector(getRootSelectorFor({ itemId, panelType })),
		variable: 'icon-size',
		responsive: true,
		unit: 'px',
	},

	contacts_spacing: {
		selector: assembleSelector(getRootSelectorFor({ itemId, panelType })),
		variable: 'items-spacing',
		responsive: true,
		unit: 'px',
	},

	...typographyOption({
		id: 'contacts_font',
		selector: assembleSelector(
			mutateSelector({
				selector: getRootSelectorFor({ itemId, panelType }),
				operation: 'suffix',
				to_add: '.contact-info',
			})
		),
	}),

	contacts_margin: {
		selector: assembleSelector(getRootSelectorFor({ itemId, panelType })),
		type: 'spacing',
		variable: 'margin',
		responsive: true,
		important: true,
	},

	// default state
	contacts_font_color: [
		{
			selector: assembleSelector(
				mutateSelector({
					selector: getRootSelectorFor({ itemId, panelType }),
					operation: 'suffix',
					to_add: '.contact-info',
				})
			),
			variable: 'color',
			type: 'color:default',
			responsive: true,
		},

		{
			selector: assembleSelector(
				mutateSelector({
					selector: getRootSelectorFor({ itemId, panelType }),
					operation: 'suffix',
					to_add: '.contact-info',
				})
			),
			variable: 'linkInitialColor',
			type: 'color:link_initial',
			responsive: true,
		},

		{
			selector: assembleSelector(
				mutateSelector({
					selector: getRootSelectorFor({ itemId, panelType }),
					operation: 'suffix',
					to_add: '.contact-info',
				})
			),
			variable: 'linkHoverColor',
			type: 'color:link_hover',
			responsive: true,
		},
	],

	contacts_icon_color: [
		{
			selector: assembleSelector(
				getRootSelectorFor({ itemId, panelType })
			),
			variable: 'icon-color',
			type: 'color:default',
			responsive: true,
		},

		{
			selector: assembleSelector(
				getRootSelectorFor({ itemId, panelType })
			),
			variable: 'icon-hover-color',
			type: 'color:hover',
			responsive: true,
		},
	],

	contacts_icon_background: [
		{
			selector: assembleSelector(
				getRootSelectorFor({ itemId, panelType })
			),
			variable: 'background-color',
			type: 'color:default',
			responsive: true,
		},

		{
			selector: assembleSelector(
				getRootSelectorFor({ itemId, panelType })
			),
			variable: 'background-hover-color',
			type: 'color:hover',
			responsive: true,
		},
	],

	// transparent state
	transparent_contacts_font_color: [
		{
			selector: assembleSelector(
				mutateSelector({
					selector: mutateSelector({
						selector: getRootSelectorFor({ itemId, panelType }),
						operation: 'suffix',
						to_add: '.contact-info',
					}),
					operation: 'between',
					to_add: '[data-transparent-row="yes"]',
				})
			),

			variable: 'color',
			type: 'color:default',
		},

		{
			selector: assembleSelector(
				mutateSelector({
					selector: mutateSelector({
						selector: getRootSelectorFor({ itemId, panelType }),
						operation: 'suffix',
						to_add: '.contact-info',
					}),
					operation: 'between',
					to_add: '[data-transparent-row="yes"]',
				})
			),

			variable: 'linkInitialColor',
			type: 'color:link_initial',
		},

		{
			selector: assembleSelector(
				mutateSelector({
					selector: mutateSelector({
						selector: getRootSelectorFor({ itemId, panelType }),
						operation: 'suffix',
						to_add: '.contact-info',
					}),
					operation: 'between',
					to_add: '[data-transparent-row="yes"]',
				})
			),

			variable: 'linkHoverColor',
			type: 'color:link_hover',
		},
	],

	transparent_contacts_icon_color: [
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

			variable: 'icon-hover-color',
			type: 'color:hover',
			responsive: true,
		},
	],

	transparent_contacts_icon_background: [
		{
			selector: assembleSelector(
				mutateSelector({
					selector: getRootSelectorFor({ itemId, panelType }),
					operation: 'between',
					to_add: '[data-transparent-row="yes"]',
				})
			),

			variable: 'background-color',
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

			variable: 'background-hover-color',
			type: 'color:hover',
			responsive: true,
		},
	],

	// sticky state
	sticky_contacts_font_color: [
		{
			selector: assembleSelector(
				mutateSelector({
					selector: mutateSelector({
						selector: getRootSelectorFor({ itemId, panelType }),
						operation: 'suffix',
						to_add: '.contact-info',
					}),
					operation: 'between',
					to_add: '[data-sticky*="yes"]',
				})
			),
			variable: 'color',
			type: 'color:default',
		},

		{
			selector: assembleSelector(
				mutateSelector({
					selector: mutateSelector({
						selector: getRootSelectorFor({ itemId, panelType }),
						operation: 'suffix',
						to_add: '.contact-info',
					}),
					operation: 'between',
					to_add: '[data-sticky*="yes"]',
				})
			),
			variable: 'linkInitialColor',
			type: 'color:link_initial',
		},

		{
			selector: assembleSelector(
				mutateSelector({
					selector: mutateSelector({
						selector: getRootSelectorFor({ itemId, panelType }),
						operation: 'suffix',
						to_add: '.contact-info',
					}),
					operation: 'between',
					to_add: '[data-sticky*="yes"]',
				})
			),
			variable: 'linkHoverColor',
			type: 'color:link_hover',
		},
	],

	sticky_contacts_icon_color: [
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
			variable: 'icon-hover-color',
			type: 'color:hover',
			responsive: true,
		},
	],

	sticky_contacts_icon_background: [
		{
			selector: assembleSelector(
				mutateSelector({
					selector: getRootSelectorFor({ itemId, panelType }),
					operation: 'between',
					to_add: '[data-sticky*="yes"]',
				})
			),
			variable: 'background-color',
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
			variable: 'background-hover-color',
			type: 'color:hover',
			responsive: true,
		},
	],
})

ctEvents.on(
	'ct:header:sync:collect-variable-descriptors',
	(variableDescriptors) => {
		variableDescriptors['contacts'] = ({ itemId, fullItemId }) =>
			getVariables({ itemId, fullItemId, panelType: 'header' })
	}
)

ctEvents.on(
	'ct:footer:sync:collect-variable-descriptors',
	(variableDescriptors) => {
		variableDescriptors['contacts'] = ({ itemId, fullItemId }) =>
			getVariables({ itemId, fullItemId, panelType: 'footer' })
	}
)

ctEvents.on(
	'ct:header:sync:item:contacts',
	({
		values: { contacts_icon_fill_type, contacts_icon_shape },
		optionId,
		optionValue,
		itemId,
	}) => {
		const selector = `[data-id="${itemId}"] > ul`

		if (
			optionId === 'contacts_icon_fill_type' ||
			optionId === 'contacts_icon_shape'
		) {
			updateAndSaveEl(selector, (el) => {
				el.dataset.iconsType = `${contacts_icon_shape}${
					contacts_icon_shape === 'simple'
						? ''
						: `:${contacts_icon_fill_type}`
				}`
			})
		}
	}
)

ctEvents.on(
	'ct:footer:sync:item:contacts',
	({
		values: { contacts_icon_fill_type, contacts_icon_shape },
		optionId,
		optionValue,
		itemId,
	}) => {
		const selector = `.ct-footer [data-id="${itemId}"] > ul`
		const el = document.querySelector(selector)

		if (
			optionId === 'contacts_icon_fill_type' ||
			optionId === 'contacts_icon_shape'
		) {
			el.dataset.iconsType = `${contacts_icon_shape}${
				contacts_icon_shape === 'simple'
					? ''
					: `:${contacts_icon_fill_type}`
			}`
		}

		if (optionId === 'contacts_items_direction') {
			el.dataset.itemsDirection = optionValue
		}

		if (optionId === 'footer_contacts_visibility') {
			responsiveClassesFor(
				optionValue,
				document.querySelector(`.ct-footer [data-id="${itemId}"]`)
			)
		}
	}
)
