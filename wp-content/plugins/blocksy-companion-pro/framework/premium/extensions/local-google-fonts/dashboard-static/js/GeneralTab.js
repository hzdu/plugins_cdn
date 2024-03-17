import { createElement } from '@wordpress/element'
import { Checkboxes } from 'blocksy-options'
import { __ } from 'ct-i18n'
import { humanizeVariations } from '../../../custom-fonts/dashboard-static/js/helpers'

const GeneralTab = ({ futureVariations, setFutureVariations, remoteFont }) => {
	return (
		<>
			<h4 className="ct-title">
				{__('Select Variations', 'blocksy-companion')}
			</h4>
			{futureVariations && (
				<Checkboxes
					value={remoteFont.all_variations.reduce((acc, current) => {
						return {
							...acc,
							[current]: futureVariations.includes(current),
						}
					}, {})}
					option={{
						choices: remoteFont.all_variations.map((variation) => ({
							key: variation,
							value: humanizeVariations(variation),
						})),
						attr: {
							'data-columns': 2,
						},
					}}
					onChange={(v) => {
						setFutureVariations(
							Object.keys(v).reduce((acc, current) => {
								return [
									...acc,
									...(v[current] ? [current] : []),
								]
							}, [])
						)
					}}
				/>
			)}
		</>
	)
}

export default GeneralTab
