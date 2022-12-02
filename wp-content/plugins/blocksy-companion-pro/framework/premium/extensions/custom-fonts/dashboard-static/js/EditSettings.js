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

import AllFonts from './AllFonts'
import Uploader, { getDefaultFutureFont } from './Uploader'

let customFontsSettingsCache = {
	fonts: [],
}

const EditSettings = () => {
	const [isEditing, setIsEditing] = useState(false)
	const [futureFont, setFutureFont] = useState(getDefaultFutureFont())

	// upload | all
	const [openView, setOpenView] = useState('all')

	const [customFontsSettings, setCustomFontsSettings] = useState(
		customFontsSettingsCache
	)

	const loadData = async () => {
		const body = new FormData()
		body.append('action', 'blocksy_get_custom_fonts_settings')

		try {
			const response = await fetch(ctDashboardLocalizations.ajax_url, {
				method: 'POST',
				body,
			})

			if (response.status === 200) {
				const { success, data } = await response.json()

				if (success) {
					customFontsSettingsCache = data.settings
					setCustomFontsSettings(data.settings)
				}
			}
		} catch (e) {}
	}

	const saveCustomFontsSettings = (s = null) => {
		wp.ajax.send({
			url: `${wp.ajax.settings.url}?action=blocksy_update_custom_fonts_settings`,
			contentType: 'application/json',
			data: JSON.stringify(s || customFontsSettings),
		})
	}

	useEffect(() => {
		loadData()
	}, [])

	useEffect(() => {
		if (isEditing) {
			setFutureFont(getDefaultFutureFont())
		}
	}, [isEditing])

	return (
		<Fragment>
			<button
				className="ct-button ct-config-btn"
				data-button="white"
				title={__('Settings', 'blocksy-companion')}
				onClick={() => setIsEditing(true)}>
				{__('Settings', 'blocksy-companion')}
			</button>

			<Overlay
				items={isEditing}
				onDismiss={() => setIsEditing(false)}
				className={'ct-custom-fonts-modal'}
				render={() => (
					<Fragment>
						{openView.indexOf('edit:') > -1 && (
							<Uploader
								futureFont={futureFont}
								setFutureFont={setFutureFont}
								onChange={(e) => {
									setCustomFontsSettings(e)
									saveCustomFontsSettings(e)
								}}
								moveToAllFonts={() => {
									setOpenView('all')
								}}
								customFontsSettings={customFontsSettings}
								editedIndex={parseInt(
									openView.split(':')[1],
									10
								)}
							/>
						)}
						{openView === 'all' && (
							<AllFonts
								onChange={(e) => {
									setCustomFontsSettings(e)
									saveCustomFontsSettings(e)
								}}
								customFontsSettings={customFontsSettings}
								saveCustomFontsSettings={
									saveCustomFontsSettings
								}
								editFont={(index) => {
									setFutureFont(
										customFontsSettings.fonts[index]
									)
									setOpenView(`edit:${index}`)
								}}
								moveToUploader={(type) => {
									setFutureFont(getDefaultFutureFont(type))
									setOpenView('upload')
								}}
							/>
						)}
						{openView === 'upload' && (
							<Uploader
								futureFont={futureFont}
								setFutureFont={setFutureFont}
								onChange={(e) => {
									setCustomFontsSettings(e)
									saveCustomFontsSettings(e)
								}}
								moveToAllFonts={() => {
									setOpenView('all')
								}}
								customFontsSettings={customFontsSettings}
							/>
						)}
					</Fragment>
				)}
			/>
		</Fragment>
	)
}

export default EditSettings
