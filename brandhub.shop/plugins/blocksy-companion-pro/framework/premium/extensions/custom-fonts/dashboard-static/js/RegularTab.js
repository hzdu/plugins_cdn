import { createElement } from '@wordpress/element'

import { __, sprintf } from 'ct-i18n'
import { AddVariation, FontName, SingleVariation } from './Uploader'

const RegularTab = ({
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
							"Upload only the %s.woff2%s or %s.ttf%s font file formats (see browser coverage %shere%s). Use %sthis converter tool%s if you don't have these font formats.",
							'blocksy-companion'
						),
						'<code>',
						'</code>',
						'<code>',
						'</code>',
						'<a href="https://caniuse.com/#search=woff2" target="_blank">',
						'</a>',
						'<a href="https://transfonter.org/" target="_blank">',
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

				{futureFont.fontType === 'regular' && (
					<li className="ct-add-variation">
						<AddVariation
							futureFont={futureFont}
							setFutureFont={setFutureFont}
						/>
					</li>
				)}
			</ul>
		</>
	)
}

export default RegularTab
