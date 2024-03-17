import { render, createElement } from '@wordpress/element'
import { __ } from 'ct-i18n'

import EditVideoButton from './components/EditVideoButton'

function observeElement(element, property, callback, delay = 0) {
	let elementPrototype = Object.getPrototypeOf(element)
	if (elementPrototype.hasOwnProperty(property)) {
		let descriptor = Object.getOwnPropertyDescriptor(
			elementPrototype,
			property
		)
		Object.defineProperty(element, property, {
			get: function () {
				return descriptor.get.apply(this, arguments)
			},
			set: function () {
				let oldValue = this[property]
				descriptor.set.apply(this, arguments)
				let newValue = this[property]
				if (typeof callback == 'function') {
					setTimeout(callback.bind(this, oldValue, newValue), delay)
				}
				return newValue
			},
		})
	}
}

export const listenForGalleryUpdate = () => {
	const galleryImages = document.querySelector('#product_image_gallery')

	if (galleryImages) {
		galleryImages.addEventListener('input', () => appendToGalleryItems())
		observeElement(galleryImages, 'value', () => appendToGalleryItems())
	}
}

export const appendToGalleryItems = () => {
	const images = document.querySelectorAll('.product_images .image')

	if (!images || !images.length) {
		return
	}

	images.forEach((image) => {
		if (image.hasAction) {
			return
		}

		image.hasAction = true

		const attachment_id = image.dataset.attachment_id
		const action = document.createElement('li')
		action.classList.add('options')
		image
			.querySelector('.actions')
			.insertBefore(action, image.querySelector('.actions').firstChild)

		render(<EditVideoButton attachment_id={attachment_id} />, action)
	})
}
