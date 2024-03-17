import $ from 'jquery'
import { computeFavorite, hasAttributeSelected } from './common'

export const maybeHandleSingleProduct = (el) => {
	if (!el.closest('.entry-summary')) {
		return
	}

	const container = el.closest('.entry-summary')
	const form = container.querySelector('.variations_form')

	if (!form || form.hasVarEventListener) {
		return
	}

	form.hasVarEventListener = true

	const favoritesButton = document.querySelector('.ct-wishlist-button-single')

	if (!favoritesButton) {
		return
	}

	const productId = parseFloat(form.dataset.product_id)

	computeFavorite(el, form, container, favoritesButton, productId)
}