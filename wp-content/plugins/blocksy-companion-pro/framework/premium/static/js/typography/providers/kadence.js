import { __, sprintf } from 'ct-i18n'
import { humanizeVariations } from '../../../../extensions/custom-fonts/dashboard-static/js/helpers'

export const mountKadenceFontsIntegration = ({ getFontsData }) => {
	wp.hooks.addFilter('kadence.typography_options', 'blocksy', (options) => {
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

					typekit: __(
						__('%s Typekit', 'blocksy-companion'),
						product_name
					),

					file: sprintf(
						__('%s Custom Fonts', 'blocksy-companion'),
						product_name
					),
				}

				if (
					!options.some((option) => option.id === `blocksy-${type}`)
				) {
					options.unshift({
						type: 'group',
						id: `blocksy-${type}`,
						label: titles[type],
						options: families.map((fullFamily) => {
							let { display, family } = fullFamily

							let allVariations = [
								...new Set(
									fullFamily.all_variations.map((v) => v[1])
								),
							]

							return {
								label: display,
								value: family.replace('ct_typekit_', ''),
								google: false,
								styles: [
									{
										value: 'normal',
										label: __(
											'Normal',
											'blocksy-companion'
										),
									},

									...(fullFamily.all_variations.find(
										(v) => v[0] === 'i'
									)
										? [
												{
													value: 'italic',
													label: __(
														'Italic',
														'kadence-blocks'
													),
												},
										  ]
										: []),
								],

								weights: [
									{
										value: 'inherit',
										label: __('Inherit', 'kadence-blocks'),
									},

									...allVariations.map((v) => ({
										value: (v * 100).toString(),
										label: humanizeVariations(`n${v}`),
									})),
								],
							}
						}),
					})
				}
			})

		if (!fontsData.google) {
			options = options.filter(({ label }) => label !== 'Google Fonts')
		}

		return options
	})
}
