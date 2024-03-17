import { prepareListWithSimpleProduct } from './common'

export const maybeHandleCompareSingleProduct = (el, operation) => {
	let newList = []

	const productId = parseInt(el.dataset.id)

	newList = prepareListWithSimpleProduct(productId, operation)

	return newList
}
