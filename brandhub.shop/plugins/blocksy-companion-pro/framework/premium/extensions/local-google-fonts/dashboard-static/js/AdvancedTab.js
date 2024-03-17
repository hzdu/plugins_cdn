import { createElement } from '@wordpress/element'
import { Checkboxes } from 'blocksy-options'
import { __ } from 'ct-i18n'
import {
	getHumanizedUnicodes,
	humanizeVariations,
} from '../../../custom-fonts/dashboard-static/js/helpers'

const AdvancedTab = ({
	futureVariations = [],
	remoteFont,
	futurePreloads,
	setFuturePreloads,
}) => {
	return (
		<>
			<section className="ct-group-preload-variation">
				<h4 className="ct-title">
					{__('Preload Variations', 'blocksy-companion')}
				</h4>

				<Checkboxes
					value={(futureVariations || []).reduce((acc, current) => {
						return {
							...acc,
							[current]:
								(futureVariations || []).includes(current) &&
								(futurePreloads?.variations || []).includes(
									current
								),
						}
					}, {})}
					option={{
						choices: (futureVariations || []).map((variation) => ({
							key: variation,
							value: humanizeVariations(variation),
						})),
						attr: {
							'data-columns': 2,
						},
						allow_empty: true,
					}}
					onChange={(v) => {
						setFuturePreloads({
							...futurePreloads,
							variations: Object.keys(v).filter((key) => v[key]),
						})
					}}
				/>
			</section>

			<section className="ct-group-preload-subset">
				<h4 className="ct-title">
					{__('Preload Subsets', 'blocksy-companion')}
				</h4>

				<Checkboxes
					value={remoteFont.subsets.reduce((acc, current) => {
						return {
							...acc,
							[current]:
								remoteFont.subsets.includes(current) &&
								(futurePreloads?.subsets || []).includes(
									current
								),
						}
					}, {})}
					option={{
						choices: remoteFont.subsets.map((subsets) => ({
							key: subsets,
							value: getHumanizedUnicodes[subsets] || subsets,
						})),
						attr: {
							'data-columns': 2,
						},
						allow_empty: true,
					}}
					onChange={(v) => {
						setFuturePreloads({
							...futurePreloads,
							subsets: Object.keys(v).filter((key) => v[key]),
						})
					}}
				/>
			</section>
		</>
	)
}

export default AdvancedTab
