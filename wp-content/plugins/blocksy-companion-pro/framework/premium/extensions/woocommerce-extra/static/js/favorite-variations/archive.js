import $ from 'jquery'
import { computeFavorite, hasAttributeSelected } from './common'

export const maybeHandleArchiveProduct = (el) => {
	if (!el.closest('.product')) {
		return
	}

	const container = el.closest('.product')
	const form = container.querySelector('.ct-card-variation-swatches')

	if (!form || form.hasVarEventListener) {
		return
	}

	form.hasVarEventListener = true

	const favoritesButton = container.querySelector('.ct-wishlist-button-archive')

	if (!favoritesButton) {
		return
	}

	const productId = parseFloat(Array.from(el.closest('.product').classList)
		.find((className) => className.indexOf('post-') === 0)
		.split('-')[1])

	computeFavorite(el, form, container, favoritesButton, productId)
}