import { createElement } from '@wordpress/element'

import { __, sprintf } from 'ct-i18n'
import { AddVariation, FontName, SingleVariation } from './Uploader'

const VariableTab = ({
	name,
	futureFont,
	setFutureFont,
	variations,
	onChange,
	customFontsSettings,
}) => {
	return (
		<>
			<FontName
				name={name}
				onChange={(name) =>
					setFutureFont({
						...futureFont,
						name,
					})
				}
			/>

			<span
				className="ct-option-description"
				dangerouslySetInnerHTML={{
					__html: sprintf(
						__(
							"Upload only the %s.woff2%s or %s.ttf%s font file formats. Don't convert variable fonts by yourself. Ask the font provider to hand a correct file or the %svariable%s font won't work.",
							'blocksy-companion'
						),
						'<code>',
						'</code>',
						'<code>',
						'</code>',
						'<a href="https://web.dev/variable-fonts/" target="_blank">',
						'</a>'
					),
				}}
			/>

			<ul className="ct-upload-fonts">
				{variations.map((variation, index) => (
					<SingleVariation
						futureFont={futureFont}
						key={index}
						variation={variation}
						onChange={(newVariation) =>
							setFutureFont({
								...futureFont,
								variations: variations.map((v, nestedIndex) =>
									nestedIndex === index ? newVariation : v
								),
							})
						}
						onRemove={() => {
							setFutureFont({
								...futureFont,
								variations: variations
									.slice(0, index)
									.concat(
										variations.slice(
											index + 1,
											variations.length
										)
									),
							})
						}}
					/>
				))}
			</ul>
		</>
	)
}

export default VariableTab
