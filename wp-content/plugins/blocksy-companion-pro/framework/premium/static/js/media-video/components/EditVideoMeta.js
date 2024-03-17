import { createElement, useState } from '@wordpress/element'
import { __ } from 'ct-i18n'
import { Overlay, OptionsPanel } from 'blocksy-options'

const handleSave = async (attachment_id, data, setAttributes) => {
	const body = new FormData()

	body.append('attachment_id', attachment_id)
	body.append('attachment_video', JSON.stringify(data))
	body.append('action', 'blocksy_update_video_meta_fields')

	try {
		const response = await fetch(ct_localizations.ajax_url, {
			method: 'POST',
			body,
		})

		if (response.status === 200) {
			const body = await response.json()

			if (body.success) {
				setAttributes(data)
			}
		}
	} catch (e) {}
}

const EditVideoMeta = ({
	attachment_id,
	isCreating,
	setIsCreating,
	attributes,
	setAttributes,
}) => {
	const [isLoading, setIsLoading] = useState(false)

	return (
		<Overlay
			items={isCreating}
			className="ct-admin-modal ct-media-video-modal"
			onDismiss={() => setIsCreating(false)}
			render={() => (
				<div className="ct-modal-content">
					<h2>{__('Video Options', 'blocksy-companion')}</h2>

					<div className="ct-modal-scroll">
						<div className="ct-options-container">
							<OptionsPanel
								onChange={(optionId, optionValue) =>
									setAttributes({
										...attributes,
										[optionId]: optionValue,
									})
								}
								options={window.videoOptions.options}
								value={attributes}
								hasRevertButton={false}
							/>
						</div>
					</div>

					<div className="ct-modal-actions has-divider">
						<button
							className="button-primary"
							disabled={isLoading}
							onClick={async () => {
								setIsLoading(true)
								await handleSave(attachment_id, attributes)
								setAttributes(attributes)
								setIsLoading(false)
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
	)
}

export default EditVideoMeta
