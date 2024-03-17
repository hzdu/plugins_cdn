import {
	createElement,
	useState,
	useCallback,
	Fragment,
} from '@wordpress/element'
import cls from 'classnames'
import { __ } from 'ct-i18n'

import EditVideoMeta from './EditVideoMeta'

const cachedData = {}

const videoDefaults = {
	media_video_source: 'upload',
	media_video_upload: '',
	media_video_youtube_url: '',
	media_video_player: 'no',
	media_video_autoplay: 'no',
	media_video_overlya_information: 'yes',
}

const getData = async (attachment_id, cb) => {
	if (cachedData[attachment_id]) {
		cb(cachedData[attachment_id])

		return
	}

	try {
		const response = await fetch(
			`${ct_localizations.ajax_url}?action=blocksy_get_video_meta_fields&attachment_id=${attachment_id}`,
			{
				method: 'GET',
			}
		)

		if (response.status === 200) {
			const body = await response.json()

			if (body.success) {
				const newData = {
					...videoDefaults,
					...body.data.meta,
				}

				cachedData[attachment_id] = newData

				cb(newData)

				return
			}
		}

		cachedData[attachment_id] = videoDefaults
	} catch (e) {}
}

const EditVideoButton = ({ attachment_id }) => {
	const [attributes, setAttributes] = useState(videoDefaults)
	const [isLoading, setIsLoading] = useState(false)
	const [isCreating, setIsCreating] = useState(false)

	const loadExistingData = useCallback(async () => {
		setIsLoading(true)
		await getData(attachment_id, setAttributes)
		setIsLoading(false)
		setIsCreating((prev) => !prev)
	}, [attachment_id, getData, setIsLoading, setAttributes, setIsCreating])

	return (
		<Fragment>
			<a
				className={cls('ct-media-video-modal-trigger', {
					loading: isLoading,
				})}
				href="#"
				onClick={(e) => {
					e.preventDefault()
					e.stopPropagation()
					loadExistingData()
				}}>
				<svg width="12" height="12" viewBox="0 0 12 12">
					<path
						className="ct-play-path"
						fill="currentColor"
						d="M3.7,1.5v9L10.9,6C10.9,6,3.7,1.5,3.7,1.5z"
					/>

					<path
						className="ct-loader-path"
						opacity=".3"
						fill="currentColor"
						d="M6,0C2.7,0,0,2.7,0,6c0,3.3,2.7,6,6,6s6-2.7,6-6C12,2.7,9.3,0,6,0z M6,10.7c-2.6,0-4.7-2.1-4.7-4.7c0-2.6,2.1-4.7,4.7-4.7s4.7,2.1,4.7,4.7C10.7,8.6,8.6,10.7,6,10.7z"
					/>

					<path
						className="ct-loader-path"
						fill="currentColor"
						d="M8.3,2L9,0.8C8.1,0.3,7,0,6,0v1.3C6.8,1.3,7.6,1.6,8.3,2z">
						<animateTransform
							attributeName="transform"
							type="rotate"
							from="0 6 6"
							to="360 6 6"
							dur="0.6s"
							repeatCount="indefinite"
						/>
					</path>
				</svg>
			</a>
			<EditVideoMeta
				{...{
					attachment_id,
					isCreating,
					setIsCreating,
					attributes,
					setAttributes: (data) => {
						setAttributes(data)
						cachedData[attachment_id] = data
					},
				}}
			/>
		</Fragment>
	)
}

export default EditVideoButton
