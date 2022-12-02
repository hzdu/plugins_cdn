import ctEvents from 'ct-events'
import {
	updateAndSaveEl,
	handleBackgroundOptionFor,
	getRootSelectorFor,
	assembleSelector,
	mutateSelector,
} from 'blocksy-customizer-sync'

ctEvents.on(
	'ct:header:sync:collect-variable-descriptors',
	variableDescriptors => {
		variableDescriptors['divider'] = ({ itemId }) => ({
			divider_height: {
				selector: assembleSelector(getRootSelectorFor({ itemId })),
				variable: 'divider-size',
				responsive: true,
				unit: '%'
			},

			divider_horizontal_margin: {
				selector: assembleSelector(getRootSelectorFor({ itemId })),
				type: 'spacing',
				variable: 'margin',
				responsive: true
			},

			divider_vertical_margin: {
				selector: assembleSelector(getRootSelectorFor({ itemId })),
				type: 'spacing',
				variable: 'margin',
				responsive: true
			},

			header_divider: {
				selector: assembleSelector(getRootSelectorFor({ itemId })),
				variable: 'divider-style',
				type: 'border',
				responsive: true
			},

			// transparent state
			transparent_header_divider: {
				selector: assembleSelector(
					mutateSelector({
						selector: getRootSelectorFor({ itemId }),
						operation: 'between',
						to_add: '[data-transparent-row="yes"]',
					})
				),
				variable: 'divider-style',
				type: 'border',
				responsive: true
			},

			// sticky state
			sticky_header_divider: {
				selector: assembleSelector(
					mutateSelector({
						selector: getRootSelectorFor({ itemId }),
						operation: 'between',
						to_add: '[data-sticky*="yes"]',
					})
				),
				variable: 'divider-style',
				type: 'border',
				responsive: true
			},
			
		})
	}
)