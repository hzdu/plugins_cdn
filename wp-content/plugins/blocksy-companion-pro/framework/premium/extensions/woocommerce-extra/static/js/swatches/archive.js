import $ from 'jquery'

import { computeSwatch } from './common'

const preloadImage = (imageSource) =>
	new Promise((resolve, reject) => {
		const image = new Image()
		image.onload = resolve
		image.onerror = reject
		image.src = imageSource.src
		image.sizes = imageSource.sizes
	})

const replaceFirstImage = ({ container, image }) => {
	if (!image) {
		return
	}

	preloadImage(image).then(() => {
		const containersToReplace = []

		const selectorsToTry = ['.ct-media-container']

		selectorsToTry.map((selector) => {
			if (container.parentNode.querySelector(selector)) {
				containersToReplace.push(
					container.parentNode.querySelector(selector)
				)
			}
		})

		containersToReplace.map((imgContainer) => {
			if (imgContainer.dataset.height) {
				imgContainer.dataset.height = image.full_src_h
			}

			if (imgContainer.dataset.width) {
				imgContainer.dataset.width = image.full_src_w
			}

			;[
				...imgContainer.querySelectorAll('img:not(.ct-swap), source'),
			].map((img) => {
				if (img.getAttribute('width')) {
					img.width =
						image.width ||
						(img.closest('.flexy-pills')
							? image.gallery_thumbnail_src_w
							: image.src_w)
				}

				if (img.getAttribute('height')) {
					img.height =
						image.height ||
						(img.closest('.flexy-pills')
							? image.gallery_thumbnail_src_h
							: image.src_h)
				}

				img.src = img.closest('.flexy-pills')
					? image.gallery_thumbnail_src
					: image.src

				if (image.srcset && img.srcset && image.srcset !== 'false') {
					img.srcset = image.srcset
				} else {
					img.removeAttribute('srcset')
				}
			})
		})
	})
}

export const maybeHandleArchiveSwatches = (el) => {
	if (!el.closest('.product')) {
		return
	}

	const form = el
		.closest('.product')
		.querySelector('[data-product_variations]')

	if (!form || form.hasEventListener) {
		return
	}

	form.hasEventListener = true

	const getDynamicData = () => {
		return JSON.parse(form.dataset.dynamicCardData)
	}

	$(form).on('found_variation', function (event, variation) {
		computeSwatch(form)
		const currentPrice = form.closest('.product').querySelector('.price')

		if (currentPrice && variation.price_html) {
			currentPrice.insertAdjacentHTML('afterend', variation.price_html)

			currentPrice.remove()
		}

		replaceFirstImage({ container: form, image: variation.image })

		const maybeButton = form.closest('.product').querySelector('.button')

		const dynamicData = getDynamicData()

		if (maybeButton) {
			if (maybeButton.querySelector('.ct-icon')) {
				const tooltip = maybeButton.querySelector('.ct-tooltip')

				if (tooltip) {
					tooltip.innerHTML = dynamicData.simple.text
				}
			} else {
				maybeButton.innerHTML = dynamicData.simple.text
			}

			const link = dynamicData.simple.link

			const url = new URL(dynamicData.simple.link, window.location)
			const searchParams = new URLSearchParams(url.search)

			Object.keys(variation.attributes).map((key) => {
				let value = variation.attributes[key]

				if (value === '') {
					value = form.querySelector(`[name="${key}"]`).value.trim()
					maybeButton.dataset[key] = value
				}

				searchParams.set(key, value)
			})

			searchParams.set('variation_id', variation.variation_id)

			url.search = searchParams.toString()

			maybeButton.href = url.toString()

			maybeButton.dataset.product_sku = variation.sku
			maybeButton.dataset.product_id = variation.variation_id

			maybeButton.dataset.blocksy_archive_add_to_cart = 'yes'

			maybeButton.classList.add('add_to_cart_button', 'ajax_add_to_cart')

			maybeButton.classList.remove('added')

			if (form.closest('.product').querySelector('.added_to_cart')) {
				form.closest('.product')
					.querySelector('.added_to_cart')
					.remove()
			}
		}
	})

	$(form).on('reset_data', function (event, variation) {
		computeSwatch(form)
		const vars = JSON.parse(form.dataset.product_variations)[0]

		if (vars.blocksy_original_image) {
			replaceFirstImage({
				container: form,
				image: vars.blocksy_original_image,
			})
		}

		const maybeButton = form.closest('.product').querySelector('.button')

		const dynamicData = getDynamicData()

		const currentPrice = form.closest('.product').querySelector('.price')

		if (currentPrice && dynamicData.variable.price) {
			currentPrice.insertAdjacentHTML(
				'afterend',
				dynamicData.variable.price
			)
			currentPrice.remove()
		}

		if (maybeButton) {
			if (maybeButton.querySelector('.ct-icon')) {
				const tooltip = maybeButton.querySelector('.ct-tooltip')

				if (tooltip) {
					tooltip.innerHTML = dynamicData.variable.text
				}
			} else {
				maybeButton.innerHTML = dynamicData.variable.text
			}
			maybeButton.href = dynamicData.variable.link

			maybeButton.classList.remove(
				'add_to_cart_button',
				'ajax_add_to_cart'
			)
		}
	})

	$(form).wc_variation_form()
}
