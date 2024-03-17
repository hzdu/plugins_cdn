import { render, createElement, Fragment } from '@wordpress/element'
import { __ } from 'ct-i18n'

import EditVideoButton from './components/EditVideoButton'

export const appendToGutenbergFeaturedImage = () => {
	const featuredImageGutenberg = document.querySelector(
		'.editor-post-featured-image__container'
	)

	if (
		!featuredImageGutenberg ||
		featuredImageGutenberg.hasAction ||
		!window.wp.data
	) {
		return
	}

	featuredImageGutenberg.hasAction = true

	const attachment_id = window.wp.data
		.select('core/editor')
		.getEditedPostAttribute('featured_media')
	featuredImageGutenberg.attachment_id = attachment_id

	if (attachment_id) {
		const action = document.createElement('ul')
		action.classList.add('actions')
		featuredImageGutenberg.appendChild(action)

		render(
			<Fragment>
				<li>
					<EditVideoButton attachment_id={attachment_id} />
				</li>
				<li>
					<a
						href="#"
						className="delete"
						onClick={(e) => {
							e.preventDefault()
							e.stopPropagation()

							const maybeDeleteButton = document.querySelector(
								'.editor-post-featured-image > .is-destructive'
							)

							if (maybeDeleteButton) {
								maybeDeleteButton.click()
								return
							}

							if (wp.data?.dispatch('core/editor')?.editPost) {
								wp.data
									.dispatch('core/editor')
									.editPost({ featured_media: 0 })
							}
						}}
					/>
				</li>
			</Fragment>,
			action
		)
	}
}

export const appendToSimpleFeaturedImage = () => {
	const featuredImage = document.querySelector('#set-post-thumbnail')

	if (!featuredImage || featuredImage.hasAction) {
		return
	}

	featuredImage.hasAction = true

	const attachment_id = document.querySelector('#_thumbnail_id').value

	if (attachment_id > -1) {
		const action = document.createElement('ul')
		action.classList.add('actions')
		featuredImage.appendChild(action)

		render(
			<Fragment>
				<li>
					<ActionButton attachment_id={attachment_id} />
				</li>
				<li>
					<a
						href="#"
						className="delete tips"
						onClick={(e) => {
							e.preventDefault()
							e.stopPropagation()

							document
								.querySelector('#remove-post-thumbnail')
								.click()
						}}
					/>
				</li>
			</Fragment>,
			action
		)
	}
}

const observer = new MutationObserver(() => appendToSimpleFeaturedImage())

export const listenForGutenbergImageUpdate = () => {
	if (!window.wp.data) {
		return
	}

	window.wp.data.subscribe(() => {
		setTimeout(() => {
			const featuredImage = document.querySelector(
				'.editor-post-featured-image__container'
			)

			if (featuredImage) {
				const attachment_id = window.wp.data
					.select('core/editor')
					.getEditedPostAttribute('featured_media')

				if (
					attachment_id &&
					featuredImage.attachment_id !== attachment_id
				) {
					featuredImage.hasAction = false

					if (featuredImage.querySelector('ul.actions')) {
						featuredImage.querySelector('ul.actions').remove()
					}

					appendToGutenbergFeaturedImage()
				}

				if (!attachment_id) {
					featuredImage.hasAction = false

					if (featuredImage.querySelector('ul.actions')) {
						featuredImage.querySelector('ul.actions').remove()
					}
				}
			}
		}, 50)
	})
}
