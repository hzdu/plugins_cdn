import {
	createElement,
	useMemo,
	useState,
	useRef,
	useEffect,
} from '@wordpress/element'
import { __ } from 'ct-i18n'
import { Overlay, OptionsPanel } from 'blocksy-options'
import ctEvents from 'ct-events'
import classnames from 'classnames'

const settingsCache = {}

const SettingsManager = () => {
	const [remoteItemData, setRemoteItemData] = useState({
		itemTitle: 'Name',
		itemId: null,
		depth: 0,
		data: null,
	})

	const [localItemSettings, setLocalItemSettigns] = useState(null)
	const [isLoading, setIsLoading] = useState(false)

	const actualData = useMemo(() => localItemSettings || remoteItemData.data, [
		localItemSettings,
		remoteItemData.data,
	])

	const isEditing = useMemo(() => !!(remoteItemData.itemId && actualData), [
		remoteItemData.itemId,
		actualData,
	])

	const containerRef = useRef()

	const persistItemSettings = async (itemId, settings) => {
		settingsCache[itemId] = settings

		setIsLoading(true)

		fetch(
			`${wp.ajax.settings.url}?action=blocksy_ext_mega_menu_update_nav_item_setting&item_id=${itemId}`,
			{
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				method: 'POST',
				body: JSON.stringify(settings),
			}
		).then(() => {
			setTimeout(() => {
				setIsLoading(false)
			}, 500)
		})
	}

	const loadItemSettings = async (itemId, depth, itemTitle) => {
		setLocalItemSettigns(null)

		if (settingsCache[itemId]) {
			setRemoteItemData((remoteItemData) => ({
				...remoteItemData,
				itemTitle,
				itemId,
				depth,
				data: settingsCache[itemId],
			}))

			return
		} else {
			setRemoteItemData((remoteItemData) => ({
				...remoteItemData,
				itemTitle,
				itemId,
				depth,
				data: null,
			}))
		}

		const body = new FormData()

		body.append('action', 'blocksy_ext_mega_menu_get_nav_item_settings')
		body.append('item_id', itemId)

		const response = await fetch(wp.ajax.settings.url, {
			method: 'POST',
			body,
		})

		if (response.status === 200) {
			const body = await response.json()

			if (body.success) {
				setRemoteItemData((remoteItemData) => ({
					...remoteItemData,
					itemId,
					depth,
					data: body.data.settings,
				}))

				settingsCache[itemId] = body.data.settings
			}
		}
	}

	useEffect(() => {
		ctEvents.on(
			'blocksy:mega-menu:edit-item-settings',
			({ itemId, depth, itemTitle }) => {
				if (!itemId) {
					return
				}

				loadItemSettings(itemId, depth, itemTitle)
			}
		)
	}, [])

	return (
		<div>
			<Overlay
				items={isEditing}
				className="ct-admin-modal ct-mega-menu-modal"
				initialFocusRef={containerRef}
				onDismiss={() => {
					setRemoteItemData((remoteItemData) => ({
						...remoteItemData,
						itemId: null,
					}))
				}}
				render={() => (
					<div className="ct-modal-content" ref={containerRef}>
						<h2>
							{remoteItemData.itemTitle} -{' '}
							{__('Item Settings', 'blocksy-companion')}
						</h2>

						{null && <p>Level: {remoteItemData.depth + 1}</p>}

						<div className="ct-options-container ct-tabs-scroll">
							<OptionsPanel
								onChange={(optionId, optionValue) => {
									setLocalItemSettigns(
										(localItemSettings) => ({
											...(localItemSettings ||
												actualData),
											[optionId]: optionValue,
										})
									)
								}}
								options={
									blocksy_ext_mega_menu_localization.mega_menu_options
								}
								value={{
									...(Array.isArray(actualData) || !actualData
										? {}
										: actualData),

									menu_item_level: remoteItemData.depth + 1,
								}}
								hasRevertButton={false}
							/>
						</div>

						<div className="ct-modal-actions has-divider">
							<button
								className={classnames(
									'button-primary ct-large-button'
								)}
								disabled={isLoading}
								onClick={() => {
									persistItemSettings(
										remoteItemData.itemId,
										actualData
									)

									setRemoteItemData((remoteItemData) => ({
										...remoteItemData,
										data: actualData,
									}))

									setLocalItemSettigns(null)
								}}>
								{isLoading ? (
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
									__('Save Settings', 'blocksy-companion')
								)}
							</button>
						</div>
					</div>
				)}
			/>
		</div>
	)
}

export default SettingsManager
