import {
	prepareListWithSimpleProduct,
	prepareListWithVariableItem,
} from './common'

export const maybeHandleFavoriteArchiveProduct = (el, operation, variable) => {
	const productCard = el.closest('.product')
	let newList = []

	if (
		productCard.querySelector('.add_to_cart_button') &&
		productCard
			.querySelector('.add_to_cart_button')
			.getAttribute('href')
			.includes('variation_id') &&
		variable
	) {
		const params = new URLSearchParams(
			productCard
				.querySelector('.add_to_cart_button')
				.getAttribute('href')
		)
		const variation_id = parseFloat(params.get('variation_id'))
		const variations = JSON.parse(
			productCard.querySelector('.ct-card-variation-swatches').dataset
				.product_variations
		)

		newList = prepareListWithVariableItem(
			variations,
			variation_id,
			operation
		)
	} else {
		const productId = parseFloat(el.dataset.id)

		newList = prepareListWithSimpleProduct(productId, operation)
	}

	return newList
}
