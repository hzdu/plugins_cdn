import { createElement } from '@wordpress/element'

import { onDocumentLoaded } from 'blocksy-options'
import { appendToGalleryItems, listenForGalleryUpdate } from './woo-gallery'
import {
	appendToSimpleFeaturedImage,
	listenForFeaturedImageUpdate,
} from './featuredImage'
import {
	appendToGutenbergFeaturedImage,
	listenForGutenbergImageUpdate,
} from './featuredGutenbergImage'

import { addFilter } from '@wordpress/hooks'

import EditVideoButton from './components/EditVideoButton'

const POST_TYPES_TO_SKIP = ['post-type-guest-author']

const appendActionsOnLoad = () => {
	if (
		POST_TYPES_TO_SKIP.some((selector) =>
			document.querySelector('body').classList.contains(selector)
		)
	) {
		return
	}

	appendToGalleryItems()
	appendToSimpleFeaturedImage()
	appendToGutenbergFeaturedImage()
}

export const mountVideoMetaOptions = () => {
	addFilter(
		'blocksy.options.ct-multi-image-uploader.actions',
		'blocksy-companion',
		(result) => {
			return [
				({ props, attachment: { attachment_id } }) => {
					return (
						<li>
							<EditVideoButton attachment_id={attachment_id} />
						</li>
					)
				},
				...result,
			]
		}
	)

	onDocumentLoaded(() => {
		appendActionsOnLoad()

		listenForGalleryUpdate()
		listenForFeaturedImageUpdate()
		listenForGutenbergImageUpdate()
	})
}
