import '../../header-items/color-mode-switcher/sync'

import ctEvents from 'ct-events'
import {
	withKeys,
	handleBackgroundOptionFor,
	responsiveClassesFor,
	typographyOption,
} from 'blocksy-customizer-sync'

ctEvents.on(
	'ct:customizer:sync:collect-variable-descriptors',
	(allVariables) => {
		allVariables.result = {
			...allVariables.result,

			darkColorPalette: (value) =>
				Object.keys(value).reduce(
					(acc, key) => [
						...acc,
						{
							selector: ':root[data-color-mode*="dark"]',
							variable: value[key].variable
								? value[key].variable
								: `theme-palette-color-${key.replace(
										'color',
										''
								  )}`,
							type: `color:${key}`,
						},
					],
					[]
				),
		}
	}
)

ctEvents.on(
	'ct:header:sync:item:color-mode-switcher',
	({ itemId, optionId, optionValue }) => {
		if (optionId === 'default_color_mode') {
			document.documentElement.dataset.colorMode =
				optionValue === 'system' ? 'os-default' : optionValue
		}
	}
)
