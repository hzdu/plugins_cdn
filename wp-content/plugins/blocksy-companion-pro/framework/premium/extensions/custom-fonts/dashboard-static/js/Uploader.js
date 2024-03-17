import { createElement, useEffect, useState } from '@wordpress/element'

import classnames from 'classnames'
import { __ } from 'ct-i18n'
import { Select } from 'blocksy-options'

import { getAllVariations, humanizeVariations } from './helpers'

import RegularTab from './RegularTab'
import VariableTab from './VariableTab'
import PreloadTab from './PreloadTab'

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

export const AddVariation = ({ futureFont, setFutureFont }) => {
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

export const FontName = ({ name, onChange }) => (
	<div className="ct-font-name">
		<div className="ct-option-input">
			<input
				onChange={({ target: { value: name } }) => onChange(name)}
				type="text"
				placeholder={__('Font Name', 'blocksy-companion')}
				value={name}
			/>
		</div>
	</div>
)

export const SingleVariation = ({
	futureFont,
	variation,
	onChange,
	onRemove,
}) => {
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

			{variation.attachment_id && (
				<span className="ct-font-preview">{variation.filename}</span>
			)}

			<button
				className="button ct-upload-edit-font-button"
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
	futureFont: futureFontGlobal,
	moveToAllFonts,
	setFutureFont: setFutureFontGlobal,
}) => {
	const [futurePreloadFonts, setFuturePreloadFonts] = useState({
		variations: [],
	})

	const [currentFontTypeInitial, setCurrentFontType] = useState('regular')
	const [currentTab, setCurrentTab] = useState('regular')

	let currentFontType = currentFontTypeInitial

	if (!futureFontGlobal.regular) {
		currentFontType = 'variable'
	}

	if (!futureFontGlobal.variable) {
		currentFontType = 'regular'
	}

	const setFutureFont = (font) => {
		setFutureFontGlobal({
			...futureFontGlobal,
			[currentFontType]: font,
		})
	}

	const futureFont = futureFontGlobal[currentFontType]

	const { name, variations } = futureFont

	useEffect(() => {
		if (futureFont.preloads) {
			setFuturePreloadFonts(futureFont.preloads)
		}
	}, [futureFont])

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

	const isEditMode = Object.keys(futureFont).includes('editedIndex')

	return (
		<div
			className="ct-modal-content"
			data-state={isEditMode ? 'edit' : 'new'}>
			{!isEditMode ? (
				<h2>{__('Upload Font', 'blocksy-companion')}</h2>
			) : (
				<h2>{__('Edit Font', 'blocksy-companion')}</h2>
			)}

			<div className="ct-tabs-scroll">
				<div className="ct-tabs">
					<ul>
						{(isEditMode
							? ['regular', 'advanced']
							: ['regular', 'variable']
						).map((tab) => {
							const isActive = isEditMode
								? currentTab === tab
								: currentFontType === tab

							return (
								<li
									key={tab}
									className={classnames({
										active: isActive,
									})}
									onClick={() => {
										if (isEditMode) {
											setCurrentTab(tab)
											return
										}
										setCurrentFontType(tab)
									}}>
									{
										{
											regular: isEditMode
												? __(
														'General',
														'blocksy-companion'
												  )
												: __(
														'Simple Font',
														'blocksy-companion'
												  ),
											variable: __(
												'Variable Font',
												'blocksy-companion'
											),
											advanced: __(
												'Preload',
												'blocksy-companion'
											),
										}[tab]
									}
								</li>
							)
						})}
					</ul>
					<div className="ct-current-tab">
						{isEditMode ? (
							currentTab === 'regular' ? (
								<RegularTab
									{...{
										name,
										futureFont,
										setFutureFont,
										variations,
										onChange,
										customFontsSettings,
									}}
								/>
							) : (
								<PreloadTab
									{...{
										variations,
										futurePreloadFonts,
										setFuturePreloadFonts,
									}}
								/>
							)
						) : currentFontType === 'regular' ? (
							<RegularTab
								{...{
									name,
									futureFont,
									setFutureFont,
									variations,
									onChange,
									customFontsSettings,
								}}
							/>
						) : (
							<VariableTab
								{...{
									name,
									futureFont,
									setFutureFont,
									variations,
									onChange,
									customFontsSettings,
								}}
							/>
						)}
					</div>
				</div>
			</div>

			<div className="ct-modal-actions has-divider">
				<button
					className="button button-primary"
					disabled={isDisabled}
					onClick={() => {
						const { editedIndex, ...actualFont } = futureFont
						const currentFonts = {
							...actualFont,
							...{
								preloads:
									futurePreloadFonts.variations.length > 0
										? futurePreloadFonts
										: {
												variations: [],
										  },
							},
						}

						onChange({
							...customFontsSettings,
							fonts:
								editedIndex || editedIndex === 0
									? customFontsSettings.fonts.map(
											(f, index) =>
												index === editedIndex
													? currentFonts
													: f
									  )
									: [
											...customFontsSettings.fonts,
											currentFonts,
									  ],
						})

						moveToAllFonts()
					}}>
					{__('Save Custom Font', 'blocksy-companion')}
				</button>
			</div>
		</div>
	)
}

export default Uploader
