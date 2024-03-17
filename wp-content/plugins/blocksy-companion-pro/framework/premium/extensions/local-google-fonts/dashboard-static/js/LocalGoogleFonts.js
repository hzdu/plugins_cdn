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
import { Select } from 'blocksy-options'

import SingleFont from './SingleFont'

import * as shadyCss from 'shady-css-parser'
import { pragrammedUnicodes } from '../../../custom-fonts/dashboard-static/js/helpers'

function getFormattedDate(date) {
	let year = date.getFullYear()
	let month = (1 + date.getMonth()).toString().padStart(2, '0')
	let day = date.getDate().toString().padStart(2, '0')

	let hours = date.getHours().toString().padStart(2, '0')
	let minutes = date.getMinutes().toString().padStart(2, '0')

	return `${month}/${day}/${year} at ${hours}:${minutes}`
}

const LocalGoogleFonts = ({ extension, onExtsSync }) => {
	const [fonts, setFonts] = useState(null)
	const [isLoading, setIsLoading] = useState(false)

	const [fontToAdd, setFontToAdd] = useState(null)

	const extensionData = extension.data

	const syncFonts = async (fonts) => {
		setFonts(fonts)

		setIsLoading(true)

		await onExtsSync({
			extAction: {
				type: 'start-persistence',
				settings: {
					// ...extensionData.settings,
					last_saved: new Date().getTime(),
					fonts: fonts.map(({ id, variations, preloads }) => ({
						name: id,
						...(variations && variations.length > 0
							? {
									variations,
							  }
							: {}),
						...(preloads
							? {
									preloads,
							  }
							: {}),
					})),
				},
			},
		})

		for await (const font of fonts) {
			await onExtsSync({
				extAction: {
					type: 'persist-single-font',
					settings: {
						// ...extensionData.settings,
						last_saved: new Date().getTime(),
						fonts: [
							{
								name: font.id,

								...(font.variations &&
								font.variations.length > 0
									? {
											variations: font.variations,
									  }
									: {}),
								...(font.preloads
									? {
											preloads: font.preloads,
									  }
									: {}),
							},
						],
					},
				},
			})
		}

		const res = await onExtsSync({
			extAction: {
				type: 'conclude-persistence',
				settings: {
					// ...extensionData.settings,
					last_saved: new Date().getTime(),
					fonts: fonts.map(({ id, variations, preloads }) => ({
						name: id,
						...(variations && variations.length > 0
							? {
									variations,
							  }
							: {}),
						...(preloads
							? {
									preloads,
							  }
							: {}),
					})),
				},
			},
		})

		if (res.data.settings.cached_css) {
			const parser = new shadyCss.Parser()
			const parsed = parser.parse(
				res.data.settings.cached_css.replace(new RegExp('\n', 'g'), '')
			)

			const onlyRules = parsed.rules.filter(
				({ type }) => type === 'atRule'
			)

			const mapped = onlyRules.reduce((acc, current) => {
				const fontAttributes = current.rulelist.rules.reduce(
					(acc, current) => {
						if (current.name === 'font-family') {
							acc.family = current.value.text.replaceAll(
								/['"]/g,
								''
							)
						}

						if (current.name === 'src') {
							acc.src = current.value.text
						}

						if (current.name === 'font-style') {
							acc['style'] =
								current.value.text === 'italic' ? 'i' : 'n'
						}

						if (current.name === 'font-weight') {
							acc['weight'] = current.value.text / 100
						}

						if (current.name === 'unicode-range') {
							acc['subset'] =
								pragrammedUnicodes[current.value.text]
						}

						return acc
					},
					{}
				)

				if (!acc[fontAttributes.family]) {
					acc[fontAttributes.family] = {
						subsets: {},
					}
				}

				acc[fontAttributes.family].subsets[fontAttributes.subset] = {
					...acc[fontAttributes.family].subsets[
						fontAttributes.subset
					],
					[`${fontAttributes.style}${fontAttributes.weight}`]:
						fontAttributes.src,
				}

				return acc
			}, {})

			const urllsToPreload = fonts.map((font) => {
				if (!mapped[font.id]) {
					return []
				}

				const { preloads } = font

				if (!preloads) {
					return []
				}

				const { subsets } = mapped[font.id]

				return Object.entries(subsets)
					.map(([key, value]) => {
						if (!preloads.subsets.includes(key)) {
							return ''
						}

						return Object.entries(value).map(([key, value]) => {
							if (!preloads.variations.includes(key)) {
								return ''
							}

							return value
								.replace('url(', '')
								.replace(')', '')
								.split(' format')[0]
						})
					})
					.flat()
					.filter((v) => v)
			})

			await onExtsSync({
				extAction: {
					type: 'preload-urls',
					settings: {
						...extensionData.settings,
						urls: urllsToPreload.flat(),
					},
				},
			})
		}

		setIsLoading(false)
	}

	const fontsToDisplay =
		fonts ||
		extensionData.settings.fonts.map(({ name, variations, preloads }) => ({
			id: name,
			...(variations && variations.length > 0
				? {
						variations,
				  }
				: {}),
			...(preloads
				? {
						preloads,
				  }
				: {}),
		})) ||
		[]

	const fontsToAdd = extensionData.all_google_fonts.filter(
		({ family }) => !fontsToDisplay.find(({ id }) => id === family)
	)

	return (
		<div
			className={classnames(
				'ct-extension-options ct-local-google-fonts-options',
				{
					'ct-syncing': isLoading,
				}
			)}>
			<h4>{__('Local Google Fonts Settings', 'blocksy-companion')}</h4>

			<p>
				{__(
					'Download a font and serve it directly from your server, this is handy for those who want to comply with GDPR regulations or serve the font via CDN.',
					'blocksy-companion'
				)}
			</p>

			<form>
				<Select
					option={{
						placeholder: __('Select font', 'blocksy-companion'),
						choices: fontsToAdd.map((font) => ({
							key: font.family,
							value: font.family,
						})),
						search: true,
						defaultToFirstItem: false,
						selectInputStart: () => {
							if (!isLoading) {
								return null
							}

							return (
								<svg
									width="15"
									height="15"
									viewBox="0 0 100 100">
									<g transform="translate(50,50)">
										<g transform="scale(1)">
											<circle
												cx="0"
												cy="0"
												r="50"
												fill="#687c93"
											/>
											<circle
												cx="0"
												cy="-26"
												r="12"
												fill="#ffffff"
												transform="rotate(161.634)">
												<animateTransform
													attributeName="transform"
													type="rotate"
													calcMode="linear"
													values="0 0 0;360 0 0"
													keyTimes="0;1"
													dur="1s"
													begin="0s"
													repeatCount="indefinite"
												/>
											</circle>
										</g>
									</g>
								</svg>
							)
						},
					}}
					value={fontToAdd || fontsToAdd[0].family}
					onChange={(value) => {
						setFontToAdd(value)
					}}
				/>

				<button
					className="ct-button-primary"
					disabled={isLoading}
					onClick={(e) => {
						e.preventDefault()

						syncFonts([
							...fontsToDisplay,

							{
								id: fontToAdd || fontsToAdd[0].family,
							},
						])
					}}>
					{__('Download Font', 'blocksy-companion')}
				</button>
			</form>

			{fontsToDisplay.length > 0 && (
				<div className="ct-local-google-fonts-list">
					<h4>
						{__('Available Fonts', 'blocksy-companion')}
						{extensionData.settings.last_saved && (
							<span className="ct-sync-date">
								Last synced:{' '}
								{getFormattedDate(
									new Date(
										parseFloat(
											extensionData.settings.last_saved
										)
									)
								)}
							</span>
						)}
					</h4>

					<ul>
						{fontsToDisplay.map((font, index) => (
							<SingleFont
								key={font.id}
								font={font}
								isLoading={isLoading}
								remoteFont={extensionData.all_google_fonts.find(
									({ family }) => family === font.id
								)}
								onChange={async (font) => {
									await syncFonts(
										fontsToDisplay.map((singleFont) =>
											singleFont.id === font.id
												? font
												: singleFont
										)
									)
								}}
								onRemove={() => {
									syncFonts(
										fontsToDisplay.filter(
											({ id }) => id !== font.id
										)
									)
								}}
							/>
						))}
					</ul>
				</div>
			)}
		</div>
	)
}

export default LocalGoogleFonts
