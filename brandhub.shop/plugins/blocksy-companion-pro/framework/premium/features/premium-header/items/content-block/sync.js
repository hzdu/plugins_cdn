import ctEvents from 'ct-events'
import { getRootSelectorFor, assembleSelector } from 'blocksy-customizer-sync'

ctEvents.on(
	'ct:header:sync:collect-variable-descriptors',
	(variableDescriptors) => {
		variableDescriptors['content-block'] = ({ itemId }) => ({
			margin: {
				selector: assembleSelector(
					getRootSelectorFor({ itemId, panelType: 'header' })
				),
				type: 'spacing',
				variable: 'margin',
				responsive: true,
				important: true,
			},
		})
	}
)
