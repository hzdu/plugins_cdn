import {
	createElement,
	Component,
	useEffect,
	useState,
	Fragment
} from '@wordpress/element'
import ctEvents from 'ct-events'

import classnames from 'classnames'
import { __, sprintf } from 'ct-i18n'
import { Switch } from 'blocksy-options'
import Overlay from '../../../../../../static/js/helpers/Overlay'

import { humanizeVariations } from '../../../custom-fonts/dashboard-static/js/helpers'

// import AllFonts from './AllFonts'
// import Uploader, { getDefaultFutureFont } from './Uploader'

let adobeTypekitSettingsCache = {
	project_id: '',
	fonts: []
}

const EditSettings = () => {
	const [isEditing, setIsEditing] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const [adobeTypekitSettings, setAdobeTypekitSettings] = useState(
		adobeTypekitSettingsCache
	)

	const [futureProjectId, setFutureProjectId] = useState(null)
	const [hasError, setHasError] = useState(false)

	const loadData = async () => {
		const body = new FormData()
		body.append('action', 'blocksy_get_adobe_typekit_settings')

		try {
			const response = await fetch(ctDashboardLocalizations.ajax_url, {
				method: 'POST',
				body
			})

			if (response.status === 200) {
				const { success, data } = await response.json()

				if (success) {
					adobeTypekitSettingsCache = data.settings
					setAdobeTypekitSettings(data.settings)
				}
			}
		} catch (e) {}
	}

	const persistProjectId = () => {
		setHasError(false)
		setIsLoading(true)
		wp.ajax
			.send({
				url: `${wp.ajax.settings.url}?action=blocksy_update_adobe_typekit_settings`,
				contentType: 'application/json',
				data: JSON.stringify({
					project_id:
						futureProjectId || adobeTypekitSettings.project_id
				})
			})
			.then(({ settings }) => {
				adobeTypekitSettingsCache = settings
				setAdobeTypekitSettings(settings)
				setIsLoading(false)
			})
			.fail(error => {
				console.error(error)
				setHasError(true)
				setIsLoading(false)
			})
	}

	useEffect(() => {
		loadData()
	}, [])

	useEffect(() => {
		if (isEditing) {
			setAdobeTypekitSettings(adobeTypekitSettingsCache)
		}
	}, [isEditing])

	return (
		<Fragment>
			<button
				className="ct-button ct-config-btn"
				data-button="white"
				title={__('Edit Settings', 'blocksy-companion')}
				onClick={() => setIsEditing(true)}>
				{__('Add/Edit Fonts', 'blocksy-companion')}
			</button>

			<Overlay
				items={isEditing}
				onDismiss={() => setIsEditing(false)}
				className={'ct-typekit-modal'}
				render={() => (
					<Fragment>
						<div className="ct-modal-content">
							<h2>{__('Adobe Fonts Settings', 'blocksy-companion')}</h2>

							<p
								dangerouslySetInnerHTML={{
									__html: sprintf(
										__(
											'You can find %shere%s your Project ID. Once you insert your Project ID and click the "Fetch fonts" button, your fonts will become available in all theme’s typography options.',
											'blocksy-companion'
										),
										'<a href="https://fonts.adobe.com/my_fonts?browse_mode=all#web_projects-section" target="_blank">',
										'</a>'
									)
								}}
							/>

							<form
								onSubmit={e => {
									e.preventDefault()

									if (
										(!futureProjectId &&
											!adobeTypekitSettings.project_id) ||
										(futureProjectId !== null &&
											!futureProjectId)
									) {
										return
									}

									persistProjectId()
								}}>
								<div className="ct-option-input">
									<input
										type="text"
										placeholder={__('Project ID', 'blocksy-companion')}
										value={
											futureProjectId === null
												? adobeTypekitSettings.project_id
												: futureProjectId
										}
										onChange={e =>
											setFutureProjectId(e.target.value)
										}
									/>

									{isLoading && (
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
									)}
								</div>
								<button className="ct-button">
									{__('Fetch Fonts', 'blocksy-companion')}
								</button>
							</form>

							{hasError && (
								<div className="notice notice-error">
									<p>
										{__(
											'Please enter the valid Project ID to get the kit details',
											'blocksy-companion'
										)}
										.
									</p>
								</div>
							)}

							{adobeTypekitSettings.fonts &&
								adobeTypekitSettings.fonts.length > 0 && (
									<div className="ct-modal-scroll">
										<ul>
											{adobeTypekitSettings.fonts.map(
												({ name, variations }, index) => (
													<li>
														<span>{name}</span>

														<i>
															{__(
																'Variations',
																'blocksy-companion'
															)}
															:&nbsp;
															{variations
																.map(variation =>
																	humanizeVariations(
																		variation
																	)
																)
																.join(', ')}
														</i>
													</li>
												)
											)}
										</ul>
									</div>
								)}
						</div>
					</Fragment>
				)}
			/>
		</Fragment>
	)
}

export default EditSettings
