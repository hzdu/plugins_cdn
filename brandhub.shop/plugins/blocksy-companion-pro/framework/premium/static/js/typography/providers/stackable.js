import { __, sprintf } from 'ct-i18n'

export const mountStackableFontsIntegration = ({ getFontsData }) => {
	wp.hooks.addFilter(
		'stackable.font-family-control.options',
		'blocksy',
		(options) => {
			const fontsData = getFontsData()

			if (!fontsData) {
				return options
			}

			let product_name = (
				window.ct_localizations || window.ct_customizer_localizations
			).product_name

			Object.values(fontsData)
				.filter(({ type }) => type !== 'system' && type !== 'google')
				.map(({ type, families }) => {
					let titles = {
						'local-google-fonts': sprintf(
							__('%s Local Google Fonts', 'blocksy-companion'),
							product_name
						),
						typekit: sprintf(
							__('%s Typekit', 'blocksy-companion'),
							product_name
						),
						file: sprintf(
							__('%s Custom Fonts', 'blocksy-companion'),
							product_name
						),
					}

					if (
						!options.some(
							(option) => option.id === `blocksy-${type}`
						)
					) {
						options.unshift({
							id: `blocksy-${type}`,
							title: titles[type],
							options: families.map(({ display, family }) => ({
								label: display,
								value: family.replace('ct_typekit_', ''),
							})),
						})
					}
				})

			if (!fontsData.google) {
				options = options.filter(({ id }) => id !== 'google-fonts')
			}

			return options
		}
	)
}
