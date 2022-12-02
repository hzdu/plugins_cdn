import {
	createElement,
	Component,
	useEffect,
	useState,
	Fragment,
} from '@wordpress/element'
import ctEvents from 'ct-events'

import { OptionsPanel } from 'blocksy-options'
import nanoid from 'nanoid'

import classnames from 'classnames'
import { __, sprintf } from 'ct-i18n'
import { Switch } from 'blocksy-options'
import Overlay from '../../../../../../static/js/helpers/Overlay'

function getFormattedDate(date) {
	let year = date.getFullYear()
	let month = (1 + date.getMonth()).toString().padStart(2, '0')
	let day = date.getDate().toString().padStart(2, '0')

	let hours = date.getHours().toString().padStart(2, '0')
	let minutes = date.getMinutes().toString().padStart(2, '0')

	return `${month}/${day}/${year} at ${hours}:${minutes}`
}

const EditSettings = ({ extsSyncLoading, extensionData, onExtsSync }) => {
	const [isEditing, setIsEditing] = useState(false)
	const [fonts, setFonts] = useState(null)

	const [hasConsent, setHasConsent] = useState(false)

	const handleSubmit = async (e) => {
		e.preventDefault()

		if (fonts.length === 0) {
			return
		}

		await onExtsSync({
			extAction: {
				type: 'start-persistence',
				settings: {
					// ...extensionData.settings,
					last_saved: new Date().getTime(),
					fonts: fonts.map(({ id }) => ({
						name: id,
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
						fonts: [{ name: font.id }],
					},
				},
			})
		}

		await onExtsSync({
			extAction: {
				type: 'conclude-persistence',
				settings: {
					// ...extensionData.settings,
					last_saved: new Date().getTime(),
					fonts: fonts.map(({ id }) => ({
						name: id,
					})),
				},
			},
		})
	}

	return (
		<Fragment>
			<button
				className="ct-button ct-config-btn"
				data-button="white"
				onClick={() => {
					setHasConsent(false)
					setIsEditing(true)

					setFonts(
						extensionData.settings.fonts.map(({ name }) => ({
							id: name,
							__id: nanoid(),
						}))
					)
				}}>
				{__('Add Google Fonts', 'blocksy-companion')}
			</button>

			<Overlay
				items={isEditing}
				onDismiss={() => setIsEditing(false)}
				className={'ct-glocal-fonts-modal'}
				render={() => (
					<div className={classnames('ct-modal-content')}>
						<h2>
							{__(
								'Local Google Fonts (GDPR)',
								'blocksy-companion'
							)}
						</h2>

						<p className="ct-modal-description">
							{__(
								'Download a font and serve it directly from your server, this is handy for those who want to comply with GDPR regulations or serve the font via CDN.',
								'blocksy-companion'
							)}
						</p>

						<OptionsPanel
							onChange={(optionId, fonts) => {
								setFonts(fonts)
							}}
							options={{
								fonts: {
									type: 'ct-layers',
									manageable: true,
									disableHiding: true,
									value: [],
									label: false,
									wrapperAttr: {
										className: 'ct-modal-scroll',
									},
									settings:
										extensionData.all_google_fonts_map,

									disableDrag: true,
									selectOption: {
										search: true,
										appendToBody: true,
									},
								},
							}}
							value={{
								fonts:
									fonts ||
									extensionData.settings.fonts.map(
										({ name }) => ({
											id: name,
										})
									),
							}}
							hasRevertButton={false}
						/>

						<div className="ct-modal-actions has-divider">
							{extensionData.settings.last_saved ? (
								<p class="ct-lgf-date">
									Last synced:{' '}
									{getFormattedDate(
										new Date(
											parseFloat(
												extensionData.settings
													.last_saved
											)
										)
									)}
								</p>
							) : (
								<div
									className="ct-checkbox-container"
									onClick={() => {
										setHasConsent(!hasConsent)
									}}>
									<span
										className={classnames('ct-checkbox', {
											active: hasConsent,
										})}>
										<svg
											width="10"
											height="8"
											viewBox="0 0 11.2 9.1">
											<polyline
												className="check"
												points="1.2,4.8 4.4,7.9 9.9,1.2 "></polyline>
										</svg>
									</span>

									{__(
										'By checking this option you will download and replace the existing Google Fonts with the above ones.',
										'blocksy-companion'
									)}
								</div>
							)}

							<button
								className="button-primary"
								disabled={
									extsSyncLoading ||
									!fonts ||
									(!extensionData.settings.last_saved &&
										!hasConsent)
								}
								onClick={handleSubmit}>
								{extsSyncLoading ? (
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
								) : (
									__('Sync Google Fonts', 'blocksy-companion')
								)}
							</button>
						</div>
					</div>
				)}
			/>
		</Fragment>
	)
}

export default EditSettings
