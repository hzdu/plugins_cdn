import $ from 'jquery'
import { __ } from 'ct-i18n'

export const mountMediaVideoUpload = () => {
	if (!$) {
		return
	}

	$(document.body).on('click', '.ct-upload-video', (event) => {
		var $button = $(event.target)
		var media_thumbnail_id = $button.data('image-id')

		event.preventDefault()

		wp.media.frames.original = wp.media.frame

		wp.media.frames.original.close()
		wp.media.frames.original.state().deactivate()

		if (wp.media.frames.blocksy_media_video) {
			wp.media.frames.blocksy_media_video.media_thumbnail_id = media_thumbnail_id
			wp.media.frames.blocksy_media_video.open()
			return
		}

		wp.media.frames.blocksy_media_video = wp.media({
			title: __('Select MP4', 'blocksy-companion'),
			button: {
				text: __('Attach MP4', 'blocksy-companion'),
			},
			library: {
				type: 'video/mp4',
			},
			multiple: false,
		})

		wp.media.frames.blocksy_media_video.on('select', function () {
			wp.media.frames.original.state().activate()
			wp.media.frames.original.open()
			wp.media.frame = wp.media.frames.original
			if (wp.media.frames.original.state().get('selection')) {
				wp.media.frames.original
					.state()
					.get('selection')
					.add(
						wp.media.attachment(
							wp.media.frames.blocksy_media_video
								.media_thumbnail_id
						)
					)
			}

			var selected_media = wp.media.frames.blocksy_media_video
				.state()
				.get('selection')

			var $media_field = $(
				'#attachments-' +
					wp.media.frames.blocksy_media_video.media_thumbnail_id +
					'-blocksy_media_video'
			)

			selected_media.map((attachment) => {
				attachment = attachment.toJSON()
				$media_field.val(attachment.url).change()
			})
		})

		wp.media.frames.blocksy_media_video.media_thumbnail_id = media_thumbnail_id
		wp.media.frames.blocksy_media_video.open()
	})
}
