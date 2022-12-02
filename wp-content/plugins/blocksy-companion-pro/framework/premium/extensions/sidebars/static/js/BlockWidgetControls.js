import {
	createElement,
	render,
	createPortal,
	Fragment,
	useRef,
	useState,
} from '@wordpress/element'
import useFetch from 'react-fetch-hook'
import { __, sprintf } from 'ct-i18n'
import createTrigger from 'react-use-trigger'
import useTrigger from 'react-use-trigger/useTrigger'

import { SingleSidebarSettings } from './SettingsManager'

const requestTrigger = createTrigger()

const BlockWidgetControls = ({ sidebarId }) => {
	const requestTriggerValue = useTrigger(requestTrigger)

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

	const sidebar = (sidebars || []).find(({ id }) => id === sidebarId)

	return (
		<Fragment>
			<SingleSidebarSettings
				sidebar={sidebar}
				updateList={() => requestTrigger()}
			/>

			<div
				className="ct-custom-sidebar-remove"
				onClick={() => {
					wp.ajax
						.send({
							url: `${wp.ajax.settings.url}?action=blocksy_sidebars_remove&id=${sidebarId}`,
							contentType: 'application/json',
						})
						.then(() => location.reload())
				}}>
				<span className="dashicons dashicons-no-alt"></span>
				<span className="ct-tooltip-top">
					{__('Remove Sidebar', 'blocksy-companion')}
				</span>
			</div>
		</Fragment>
	)
}

export default BlockWidgetControls
