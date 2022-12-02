import {
	createElement,
	render,
	createPortal,
	Fragment,
	useRef,
	useState,
} from '@wordpress/element'
import useFetch from 'react-fetch-hook'
import { Overlay, OptionsPanel } from 'blocksy-options'
import { __, sprintf } from 'ct-i18n'

import createTrigger from 'react-use-trigger'
import useTrigger from 'react-use-trigger/useTrigger'

export const SingleSidebarSettings = ({ sidebar, updateList }) => {
	const [isEditing, setIsEditing] = useState(false)
	const [localSidebar, setLocalSidebar] = useState(null)

	const containerRef = useRef()

	const saveSettings = () => {
		wp.ajax
			.send({
				url: `${wp.ajax.settings.url}?action=blocksy_sidebars_update`,
				contentType: 'application/json',
				data: JSON.stringify(localSidebar),
			})
			.then(() => {
				updateList()
				setIsEditing(false)
			})
	}

	return (
		<Fragment>
			<div
				className="ct-custom-sidebar-settings"
				onClick={() => {
					if (!sidebar) {
						return
					}

					setLocalSidebar(null)
					setIsEditing(true)
				}}>
				<span className="dashicons dashicons-admin-generic"></span>
				<span className="ct-tooltip-top">
					{__('Display Conditions', 'blocksy-companion')}
				</span>
			</div>

			<Overlay
				items={isEditing}
				className="ct-admin-modal ct-custom-sidebars-modal"
				initialFocusRef={containerRef}
				onDismiss={() => {
					setIsEditing(false)
				}}
				render={() => (
					<div className="ct-modal-content" ref={containerRef}>
						<h2>
							{sprintf(
								__(
									'%s - Sidebar Display Conditions',
									'blocksy-companion'
								),
								sidebar.name
							)}
						</h2>
						<p>
							{__(
								'Add one or more conditions in order to display your sidebar.',
								'blocksy-companion'
							)}
						</p>

						<div className="ct-modal-scroll">
							<OptionsPanel
								onChange={(optionId, conditions) =>
									setLocalSidebar({
										...sidebar,
										...(localSidebar || {}),
										conditions,
									})
								}
								options={{
									conditions: {
										type: 'blocksy-display-condition',
										value: [],
										label: false,
										design: 'none',
									},
								}}
								value={{
									conditions:
										(localSidebar
											? localSidebar.conditions
											: sidebar.conditions) || [],
								}}
								hasRevertButton={false}
							/>
						</div>

						<div className="ct-modal-actions has-divider">
							<button
								className="button-primary"
								disabled={!localSidebar}
								onClick={saveSettings}>
								{__('Save Settings', 'blocksy-companion')}
							</button>
						</div>
					</div>
				)}
			/>
		</Fragment>
	)
}

const requestTrigger = createTrigger()

const SettingsManager = () => {
	const requestTriggerValue = useTrigger(requestTrigger)

	const allElls = Array.from(
		document.querySelectorAll(
			'[id*="ct-dynamic-sidebar"] .blocksy-settings'
		)
	)

	const { data: sidebars, isLoading, error } = useFetch(
		`${ct_localizations.ajax_url}?action=blocksy_sidebars_list`,
		{
			method: 'POST',
			formatter: async (r) => {
				const { success, data } = await r.json()

				if (!success || !data.sidebars) {
					throw new Error()
				}

				return data.sidebars
			},
			depends: [requestTriggerValue],
		}
	)

	return (
		<div>
			{!isLoading &&
				allElls.map((el, index) => {
					const sidebarId = el.parentNode.id.replace(
						'ct-dynamic-sidebar-',
						''
					)

					const sidebar = sidebars.find(({ id }) => id === sidebarId)

					if (!sidebar) {
						return null
					}

					return createPortal(
						<SingleSidebarSettings
							el={el}
							id={sidebarId}
							sidebar={sidebar}
							updateList={() => requestTrigger()}
						/>,
						el
					)
				})}
		</div>
	)
}

export default SettingsManager
