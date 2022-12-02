import {
	createElement,
	Component,
	useEffect,
	useState,
	Fragment,
} from '@wordpress/element'
import ctEvents from 'ct-events'

import classnames from 'classnames'
import { __, sprintf } from 'ct-i18n'
import { Switch, Select } from 'blocksy-options'
import Overlay from '../../../../../../static/js/helpers/Overlay'
import { getAllVariations, humanizeVariations } from './helpers'

const preloadAttachment = (ID, callback) => {
	if (wp.media.attachment(ID).get('url')) {
		wp.media
			.attachment(ID)
			.fetch()
			.then(() => callback(wp.media.attachment(ID)))

		return
	}

	callback(wp.media.attachment(ID))
}

const getDefaultVariation = (prefill) => ({
	variation: 'n4',
	attachment_id: null,
	url: '',
	filename: '',

	...prefill,
})

export const getDefaultFutureFont = (fontType = 'regular') => ({
	name: '',
	// regular | variable
	fontType,
	variations: [
		getDefaultVariation({ variation: 'n4' }),
		...(fontType === 'variable'
			? [getDefaultVariation({ variation: 'i4' })]
			: []),
	],
})

const AddVariation = ({ futureFont, setFutureFont }) => {
	const itemsThatAreNotAdded = Object.keys(getAllVariations())
		.filter(
			(variation) =>
				!futureFont.variations.find((v) => v.variation === variation)
		)
		.reduce(
			(all, currentVariation) => ({
				...all,
				[currentVariation]: humanizeVariations(currentVariation),
			}),
			{}
		)

	if (itemsThatAreNotAdded.length === 0) {
		return null
	}

	return (
		<button
			className="button"
			onClick={() => {
				setFutureFont({
					...futureFont,
					variations: [
						...futureFont.variations,
						getDefaultVariation({
							variation: '',
						}),
					],
				})
			}}>
			{__('Add Variation', 'blocksy-companion')}
		</button>
	)
}

const SingleVariation = ({ futureFont, variation, onChange, onRemove }) => {
	const itemsThatAreNotAdded = {
		...Object.keys(getAllVariations())
			.filter(
				(singleVariation) =>
					variation.variation === singleVariation ||
					!futureFont.variations.find(
						(v) => v.variation === singleVariation
					)
			)
			.reduce(
				(all, currentVariation) => ({
					...all,
					[currentVariation]: humanizeVariations(currentVariation),
				}),
				{}
			),
	}

	return (
		<li>
			<button
				className="button button-primary"
				onClick={() => {
					let frame = wp.media({
						button: {
							text: 'Select',
						},
						states: [
							new wp.media.controller.Library({
								title: 'Select font',
								// library: wp.media.query({
								// }),
								multiple: false,
								date: false,
								priority: 20,
							}),
						],
					})

					if (variation.attachment_id) {
						frame.on('open', () => {
							frame.reset()

							preloadAttachment(variation.attachment_id, () => {
								frame
									.state()
									.get('selection')
									.add(
										wp.media.attachment(
											variation.attachment_id
										)
									)
							})
						})
					}

					frame.setState('library').open()

					frame.on('select', () => {
						var attachment = frame
							.state()
							.get('selection')
							.first()
							.toJSON()

						onChange({
							...variation,
							attachment_id: attachment.id,
							url: wp.media.attachment(attachment.id).get('url'),
							filename: attachment.filename,
						})
					})
				}}>
				{variation.attachment_id
					? __('Change', 'blocksy-companion')
					: __('Choose', 'blocksy-companion')}
			</button>

			{variation.attachment_id && (
				<span className="ct-font-preview">{variation.filename}</span>
			)}

			{futureFont.fontType === 'regular' && (
				<Select
					option={{
						appendToBody: true,
						placeholder: __(
							'Select variation',
							'blocksy-companion'
						),
						choices: itemsThatAreNotAdded,
						defaultToFirstItem: false,
					}}
					value={variation.variation}
					onChange={(value) => {
						onChange({
							...variation,
							variation: value,
						})
					}}
				/>
			)}

			{futureFont.fontType === 'variable' &&
				variation.variation === 'n4' && (
					<span className="ct-variation-name">
						{__('Regular', 'blocksy-companion')}
					</span>
				)}

			{futureFont.fontType === 'variable' &&
				variation.variation === 'i4' && (
					<span className="ct-variation-name">
						{__('Italic', 'blocksy-companion')}
					</span>
				)}

			{futureFont.fontType === 'regular' &&
				futureFont.variations.length > 1 && (
					<button className="ct-remove" onClick={() => onRemove()}>
						×
					</button>
				)}

			{futureFont.fontType === 'variable' && variation.attachment_id && (
				<button
					className="ct-remove"
					onClick={() => {
						onChange({
							...variation,
							attachment_id: null,
							url: '',
							filename: '',
						})
					}}>
					×
				</button>
			)}
		</li>
	)
}

const Uploader = ({
	customFontsSettings,
	onChange,
	futureFont,
	moveToAllFonts,
	setFutureFont,
	editedIndex,
}) => {
	const { name, variations } = futureFont

	useEffect(() => {
		if (window._wpPluploadSettings) {
			window._wpPluploadSettings.defaults.filters.mime_types[0].extensions =
				window._wpPluploadSettings.defaults.filters.mime_types[0]
					.extensions + ',ttf,woff2'

			jQuery.extend(wp.Uploader, window._wpPluploadSettings)
		}
	}, [])

	const isDisabled =
		!name ||
		// ((!editedIndex || editedIndex !== 0) &&
		// customFontsSettings.fonts.find(font => font.name === name)) ||
		variations.length === 0 ||
		(futureFont.fontType === 'regular' &&
			variations.length > 0 &&
			variations.some(
				({ attachment_id, variation }) => !attachment_id || !variation
			)) ||
		(futureFont.fontType === 'variable' &&
			variations.length > 0 &&
			variations.find(
				({ attachment_id, variation }) =>
					(!attachment_id || !variation) && variation === 'n4'
			))

	return (
		<div className="ct-modal-content ct-upload-fonts">
			{futureFont.fontType === 'regular' && (
				<Fragment>
					<h2>{__('Upload Simple Font', 'blocksy-companion')}</h2>
					<p
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
				</Fragment>
			)}

			{futureFont.fontType === 'variable' && (
				<Fragment>
					<h2>{__('Upload Variable Font', 'blocksy-companion')}</h2>
					<p
						dangerouslySetInnerHTML={{
							__html: sprintf(
								__(
									"Upload only the %s.woff2%s or %s.ttf%s font file formats. Please don't convert non-woff variable fonts by yourself. Instead, just ask the font provider to hand a correct file otherwise the %svariable%s font will loose its capabilities.",
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
				</Fragment>
			)}

			<div className="ct-font-name">
				<div className="ct-option-input">
					<input
						onChange={({ target: { value: name } }) => {
							setFutureFont({
								...futureFont,
								name,
							})
						}}
						type="text"
						placeholder={__('Font Name', 'blocksy-companion')}
						value={name}
					/>
				</div>
			</div>

			<div className="ct-modal-scroll">
				<ul>
					{variations.map((variation, index) => (
						<SingleVariation
							futureFont={futureFont}
							key={index}
							variation={variation}
							onChange={(newVariation) =>
								setFutureFont({
									...futureFont,
									variations: variations.map(
										(v, nestedIndex) =>
											nestedIndex === index
												? newVariation
												: v
									),
								})
							}
							onRemove={() =>
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
							}
						/>
					))}

					{futureFont.fontType === 'regular' && (
						<li className="ct-add-variation">
							<span className="ct-notification">
								{__(
									'Add/upload another font variation',
									'blocksy-companion'
								)}
							</span>
							<AddVariation
								futureFont={futureFont}
								setFutureFont={setFutureFont}
							/>
						</li>
					)}
				</ul>
			</div>

			<div className="ct-modal-actions has-divider" data-buttons="2">
				<button
					className="button"
					onClick={() => {
						moveToAllFonts()
						setFutureFont(getDefaultFutureFont())
					}}>
					&#8592; {__('Back to All Fonts', 'blocksy-companion')}
				</button>
				<button
					className="button button-primary"
					disabled={isDisabled}
					onClick={() => {
						onChange({
							...customFontsSettings,
							fonts:
								editedIndex || editedIndex === 0
									? customFontsSettings.fonts.map(
											(f, index) =>
												index === editedIndex
													? futureFont
													: f
									  )
									: [
											...customFontsSettings.fonts,
											futureFont,
									  ],
						})

						setFutureFont(getDefaultFutureFont())
						moveToAllFonts()
					}}>
					{__('Save Custom Font', 'blocksy-companion')}
				</button>
			</div>
		</div>
	)
}

export default Uploader
