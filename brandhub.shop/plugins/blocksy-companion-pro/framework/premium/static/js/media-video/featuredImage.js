import { render, createElement, Fragment } from '@wordpress/element'
import { __ } from 'ct-i18n'

import EditVideoButton from './components/EditVideoButton'

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
					<EditVideoButton attachment_id={attachment_id} />
				</li>
				<li>
					<a
						href="#"
						className="delete"
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

export const listenForFeaturedImageUpdate = () => {
	if (document.querySelector('#postimagediv')) {
		const config = {
			attributes: false,
			characterData: false,
			childList: true,
			subtree: true,
			attributeOldValue: false,
			characterDataOldValue: false,
		}

		observer.observe(document.querySelector('#postimagediv'), config)
	}
}
