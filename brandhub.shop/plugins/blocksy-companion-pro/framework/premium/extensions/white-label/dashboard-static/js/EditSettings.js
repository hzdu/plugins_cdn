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
import { Switch } from 'blocksy-options'
import Overlay from '../../../../../../static/js/helpers/Overlay'

let whiteLabelSettingsCache = {
	locked: false,
	hide_demos: false,

	author: {
		name: '',
		url: '',
		support: '',
	},

	theme: {
		name: '',
		description: '',
		screenshot: '',
	},

	plugin: {
		name: '',
		description: '',
		thumbnail: '',
	},
}

const EditSettings = ({ navigate }) => {
	// agency | theme | plugin | null
	const [openView, setOpenView] = useState(null)

	// details | advanced
	const [currentTab, setCurrentTab] = useState('details')

	const [whiteLabelSettings, setWhiteLabelSettings] = useState(
		whiteLabelSettingsCache
	)

	const loadData = async () => {
		const body = new FormData()
		body.append('action', 'blocksy_get_white_label_settings')

		try {
			const response = await fetch(ctDashboardLocalizations.ajax_url, {
				method: 'POST',
				body,
			})

			if (response.status === 200) {
				const { success, data } = await response.json()

				if (success) {
					whiteLabelSettingsCache = data.settings
					setWhiteLabelSettings(data.settings)
				}
			}
		} catch (e) {}
	}

	const saveWhiteLabelSettings = () => {
		wp.ajax
			.send({
				url: `${wp.ajax.settings.url}?action=blocksy_update_white_label_settings`,
				contentType: 'application/json',
				data: JSON.stringify(whiteLabelSettings),
			})
			.then(() => {
				navigate('/extensions')

				setTimeout(() => {
					location.reload()
				}, 500)
			})
	}

	useEffect(() => {
		loadData()
	}, [])

	return (
		<Fragment>
			<div className="ct-extension-options ct-white-label-options">
				<div className={classnames('ct-tabs')}>
					<ul>
						{['details', 'advanced'].map((tab) => (
							<li
								key={tab}
								className={classnames({
									active: tab === currentTab,
								})}
								onClick={() => setCurrentTab(tab)}>
								{
									{
										details: __(
											'General',
											'blocksy-companion'
										),
										advanced: __(
											'Advanced',
											'blocksy-companion'
										),
									}[tab]
								}
							</li>
						))}
					</ul>

					<div className="ct-current-tab">
						{currentTab === 'details' &&
							[
								{
									key: 'agency',
									title: __(
										'Agency Details',
										'blocksy-companion'
									),
									content: () => (
										<Fragment>
											<div>
												<label for="wl-agency-name">
													{__(
														'Agency Name',
														'blocksy-companion'
													)}
												</label>
												<input
													type="text"
													id="wl-agency-name"
													value={
														whiteLabelSettings
															.author.name
													}
													onChange={({
														target: { value: name },
													}) => {
														setWhiteLabelSettings({
															...whiteLabelSettings,
															author: {
																...whiteLabelSettings.author,
																name,
															},
														})
													}}
												/>
											</div>

											<div>
												<label for="wl-agency-url">
													{__(
														'Agency URL',
														'blocksy-companion'
													)}
												</label>
												<input
													type="text"
													id="wl-agency-url"
													value={
														whiteLabelSettings
															.author.url
													}
													onChange={({
														target: { value: url },
													}) => {
														setWhiteLabelSettings({
															...whiteLabelSettings,
															author: {
																...whiteLabelSettings.author,
																url,
															},
														})
													}}
												/>
											</div>

											<div>
												<label for="wl-agency-support-url">
													{__(
														'Agency Support/Contact Form URL',
														'blocksy-companion'
													)}
												</label>
												<input
													type="text"
													id="wl-agency-support-url"
													value={
														whiteLabelSettings
															.author.support
													}
													onChange={({
														target: {
															value: support,
														},
													}) => {
														setWhiteLabelSettings({
															...whiteLabelSettings,
															author: {
																...whiteLabelSettings.author,
																support,
															},
														})
													}}
												/>
											</div>
										</Fragment>
									),
								},

								{
									key: 'theme',
									title: __(
										'Theme Details',
										'blocksy-companion'
									),
									content: () => (
										<Fragment>
											<div>
												<label for="wl-theme-name">
													{__(
														'Theme Name',
														'blocksy-companion'
													)}
												</label>
												<input
													type="text"
													id="wl-theme-name"
													value={
														whiteLabelSettings.theme
															.name
													}
													onChange={({
														target: { value: name },
													}) => {
														setWhiteLabelSettings({
															...whiteLabelSettings,
															theme: {
																...whiteLabelSettings.theme,
																name,
															},
														})
													}}
												/>
											</div>

											<div>
												<label for="wl-theme-description">
													{__(
														'Theme Description',
														'blocksy-companion'
													)}
												</label>
												<textarea
													rows="5"
													id="wl-theme-description"
													value={
														whiteLabelSettings.theme
															.description
													}
													onChange={({
														target: {
															value: description,
														},
													}) => {
														setWhiteLabelSettings({
															...whiteLabelSettings,
															theme: {
																...whiteLabelSettings.theme,
																description,
															},
														})
													}}
												/>
											</div>

											<div>
												<label for="wl-theme-screenshot">
													{__(
														'Theme Screenshot URL',
														'blocksy-companion'
													)}
												</label>

												<div className="ct-upload-thumb">
													<input
														type="text"
														id="wl-theme-screenshot"
														value={
															whiteLabelSettings
																.theme
																.screenshot
														}
														onChange={({
															target: {
																value: screenshot,
															},
														}) => {
															setWhiteLabelSettings(
																{
																	...whiteLabelSettings,
																	theme: {
																		...whiteLabelSettings.theme,
																		screenshot,
																	},
																}
															)
														}}
													/>

													<button
														className="ct-button"
														data-hover="white"
														onClick={() => {
															let frame =
																wp.media({
																	button: {
																		text: 'Select',
																	},
																	states: [
																		new wp.media.controller.Library(
																			{
																				title: 'Select logo',
																				library:
																					wp.media.query(
																						{
																							type: 'image',
																						}
																					),
																				multiple: false,
																				date: false,
																				priority: 20,
																			}
																		),
																	],
																})

															frame
																.setState(
																	'library'
																)
																.open()

															frame.on(
																'select',
																() => {
																	var attachment =
																		frame
																			.state()
																			.get(
																				'selection'
																			)
																			.first()
																			.toJSON()

																	setWhiteLabelSettings(
																		{
																			...whiteLabelSettings,
																			theme: {
																				...whiteLabelSettings.theme,
																				screenshot:
																					attachment.url,
																			},
																		}
																	)
																}
															)
														}}>
														{__(
															'Choose File',
															'blocksy-companion'
														)}
													</button>
												</div>

												<span className="ct-option-description">
													{__(
														'You can insert the link to a self hosted image or upload one. The recommended image size is 1200px wide by 900px tall.',
														'blocksy-companion'
													)}
												</span>
											</div>

											<div>
												<label for="wl-theme-icon">
													{__(
														'Theme Icon URL',
														'blocksy-companion'
													)}
												</label>

												<div className="ct-upload-thumb">
													<input
														type="text"
														id="wl-theme-icon"
														value={
															whiteLabelSettings
																.theme.icon
														}
														onChange={({
															target: {
																value: icon,
															},
														}) => {
															setWhiteLabelSettings(
																{
																	...whiteLabelSettings,
																	theme: {
																		...whiteLabelSettings.theme,
																		icon,
																	},
																}
															)
														}}
													/>

													<button
														className="ct-button"
														data-hover="white"
														onClick={() => {
															let frame =
																wp.media({
																	button: {
																		text: 'Select',
																	},
																	states: [
																		new wp.media.controller.Library(
																			{
																				title: 'Select logo',
																				library:
																					wp.media.query(
																						{
																							type: 'image',
																						}
																					),
																				multiple: false,
																				date: false,
																				priority: 20,
																			}
																		),
																	],
																})

															frame
																.setState(
																	'library'
																)
																.open()

															frame.on(
																'select',
																() => {
																	var attachment =
																		frame
																			.state()
																			.get(
																				'selection'
																			)
																			.first()
																			.toJSON()

																	setWhiteLabelSettings(
																		{
																			...whiteLabelSettings,
																			theme: {
																				...whiteLabelSettings.theme,
																				icon: attachment.url,
																			},
																		}
																	)
																}
															)
														}}>
														{__(
															'Choose File',
															'blocksy-companion'
														)}
													</button>
												</div>

												<span className="ct-option-description">
													{__(
														'You can insert the link to a self hosted image or upload one. The recommended image size is 18px wide by 18px tall.',
														'blocksy-companion'
													)}
												</span>
											</div>

											<div>
												<label for="wl-gutenberg-panel-icon">
													{__(
														'Gutenberg Options Panel Icon URL',
														'blocksy-companion'
													)}
												</label>

												<div className="ct-upload-thumb">
													<input
														type="text"
														id="wl-gutenberg-panel-icon"
														value={
															whiteLabelSettings
																.theme
																.gutenberg_icon
														}
														onChange={({
															target: {
																value: gutenberg_icon,
															},
														}) => {
															setWhiteLabelSettings(
																{
																	...whiteLabelSettings,
																	theme: {
																		...whiteLabelSettings.theme,
																		gutenberg_icon,
																	},
																}
															)
														}}
													/>

													<button
														className="ct-button"
														data-hover="white"
														onClick={() => {
															let frame =
																wp.media({
																	button: {
																		text: 'Select',
																	},
																	states: [
																		new wp.media.controller.Library(
																			{
																				title: 'Select logo',
																				library:
																					wp.media.query(
																						{
																							type: 'image/svg+xml',
																						}
																					),
																				multiple: false,
																				date: false,
																				priority: 20,
																			}
																		),
																	],
																})

															frame
																.setState(
																	'library'
																)
																.open()

															frame.on(
																'select',
																() => {
																	var attachment =
																		frame
																			.state()
																			.get(
																				'selection'
																			)
																			.first()
																			.toJSON()

																	setWhiteLabelSettings(
																		{
																			...whiteLabelSettings,
																			theme: {
																				...whiteLabelSettings.theme,
																				gutenberg_icon:
																					attachment.url,
																			},
																		}
																	)
																}
															)
														}}>
														{__(
															'Choose File',
															'blocksy-companion'
														)}
													</button>
												</div>

												<span className="ct-option-description">
													{__(
														'You can insert the link to a self hosted image or upload one. Please note that only icons in SVG format are allowed here to not break the editor interactiveness.',
														'blocksy-companion'
													)}
												</span>
											</div>
										</Fragment>
									),
								},

								{
									key: 'plugin',
									title: __(
										'Companion Plugin Details',
										'blocksy-companion'
									),
									content: () => (
										<Fragment>
											<div>
												<label for="wl-plugin-name">
													{__(
														'Plugin Name',
														'blocksy-companion'
													)}
												</label>
												<input
													type="text"
													id="wl-plugin-name"
													value={
														whiteLabelSettings
															.plugin.name
													}
													onChange={({
														target: { value: name },
													}) => {
														setWhiteLabelSettings({
															...whiteLabelSettings,
															plugin: {
																...whiteLabelSettings.plugin,
																name,
															},
														})
													}}
												/>
											</div>

											<div>
												<label for="wl-plugin-description">
													{__(
														'Plugin Description',
														'blocksy-companion'
													)}
												</label>
												<textarea
													rows="5"
													id="wl-plugin-description"
													value={
														whiteLabelSettings
															.plugin.description
													}
													onChange={({
														target: {
															value: description,
														},
													}) => {
														setWhiteLabelSettings({
															...whiteLabelSettings,
															plugin: {
																...whiteLabelSettings.plugin,
																description,
															},
														})
													}}
												/>
											</div>

											<div>
												<label for="wl-plugin-thumbnail">
													{__(
														'Plugin Thumbnail URL',
														'blocksy-companion'
													)}
												</label>

												<div className="ct-upload-thumb">
													<input
														type="text"
														id="wl-plugin-thumbnail"
														value={
															whiteLabelSettings
																.plugin
																.thumbnail || ''
														}
														onChange={({
															target: {
																value: thumbnail,
															},
														}) => {
															setWhiteLabelSettings(
																{
																	...whiteLabelSettings,
																	plugin: {
																		...whiteLabelSettings.plugin,
																		thumbnail,
																	},
																}
															)
														}}
													/>

													<button
														className="ct-button"
														data-hover="white"
														onClick={() => {
															let frame =
																wp.media({
																	button: {
																		text: 'Select',
																	},
																	states: [
																		new wp.media.controller.Library(
																			{
																				title: 'Select logo',
																				library:
																					wp.media.query(
																						{
																							type: 'image',
																						}
																					),
																				multiple: false,
																				date: false,
																				priority: 20,
																			}
																		),
																	],
																})

															frame
																.setState(
																	'library'
																)
																.open()

															frame.on(
																'select',
																() => {
																	var attachment =
																		frame
																			.state()
																			.get(
																				'selection'
																			)
																			.first()
																			.toJSON()

																	setWhiteLabelSettings(
																		{
																			...whiteLabelSettings,
																			plugin: {
																				...whiteLabelSettings.plugin,
																				thumbnail:
																					attachment.url,
																			},
																		}
																	)
																}
															)
														}}>
														{__(
															'Choose File',
															'blocksy-companion'
														)}
													</button>
												</div>

												<span className="ct-option-description">
													{__(
														'You can insert the link to a self hosted image or upload one. The recommended image size is 256px wide by 256px tall.',
														'blocksy-companion'
													)}
												</span>
											</div>
										</Fragment>
									),
								},
							].map((section) => (
								<div
									className="ct-white-label-group"
									key={section.key}>
									<h4>{section.title}</h4>
									{section.content()}
								</div>
							))}

						{currentTab === 'advanced' && (
							<div className="ct-white-label-actions-group">
								{[
									{
										id: 'hide_billing_account',
										text: __(
											'Hide Account Menu Item',
											'blocksy-companion'
										),
									},

									{
										id: 'hide_demos',
										text: __(
											'Hide Starter Sites Tab',
											'blocksy-companion'
										),
									},
									{
										id: 'hide_plugins_tab',
										text: __(
											'Hide Useful Plugins Tab',
											'blocksy-companion'
										),
									},

									{
										id: 'hide_changelogs_tab',
										text: __(
											'Hide Changelog Tab',
											'blocksy-companion'
										),
									},

									{
										id: 'hide_support_section',
										text: __(
											'Hide Support Section',
											'blocksy-companion'
										),
									},

									{
										id: 'hide_docs_section',
										text: __(
											'Hide Documentation Links',
											'blocksy-companion'
										),
									},

									{
										id: 'hide_video_section',
										text: __(
											'Hide Video Links',
											'blocksy-companion'
										),
									},
								].map(({ id, text }) => (
									<label
										key={id}
										className="ct-white-label-switch"
										onClick={() =>
											setWhiteLabelSettings({
												...whiteLabelSettings,
												[id]: !whiteLabelSettings[id],
											})
										}>
										{text}
										<Switch
											option={{
												behavior: 'boolean',
											}}
											value={whiteLabelSettings[id]}
											onChange={() => {}}
										/>
									</label>
								))}

								<label
									className="ct-white-label-switch"
									onClick={() =>
										setWhiteLabelSettings({
											...whiteLabelSettings,
											locked: !whiteLabelSettings.locked,
										})
									}>
									{__(
										'Hide White Label Extension',
										'blocksy-companion'
									)}
									<Switch
										option={{
											behavior: 'boolean',
										}}
										value={whiteLabelSettings.locked}
										onChange={() => {}}
									/>
								</label>

								{whiteLabelSettings.locked && (
									<div className="extension-notice">
										{__(
											'Please note that the white label extension will be hidden if this option is enabled. In order to bring it back you have to hit the SHIFT key and click on the dashboard logo.',
											'blocksy-companion'
										)}
									</div>
								)}
							</div>
						)}
					</div>
				</div>

				<button
					className="ct-button-primary"
					onClick={(e) => {
						e.preventDefault()
						saveWhiteLabelSettings()

						ctEvents.trigger('blocksy_exts_sync_exts')
					}}>
					{__('Save Settings', 'blocksy-companion')}
				</button>
			</div>
		</Fragment>
	)
}

export default EditSettings
