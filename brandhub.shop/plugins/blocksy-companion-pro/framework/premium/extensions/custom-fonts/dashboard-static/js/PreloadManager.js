import { createElement } from '@wordpress/element'
import { __ } from 'ct-i18n'
import { Checkboxes } from 'blocksy-options'
import { humanizeVariations } from './helpers'

const PreloadManager = ({
	variations = [],
	setFuturePreloadFonts,
	futurePreloadFonts,
}) => {
	return (
		<Checkboxes
			value={futurePreloadFonts.variations.reduce((acc, current) => {
				return {
					...acc,
					[current]: futurePreloadFonts.variations.includes(current),
				}
			}, {})}
			option={{
				choices: variations
					.filter(({ url }) => url)
					.map(({ variation }) => ({
						key: variation,
						value: humanizeVariations(variation),
					})),
				attr: {
					'data-columns': 2,
				},
				allow_empty: true,
			}}
			onChange={(v) => {
				setFuturePreloadFonts({
					...futurePreloadFonts,
					variations: Object.keys(v).filter((key) => v[key]),
				})
			}}
		/>
	)
}

export default PreloadManager
