export const prepareListWithVariableItem = (
	variations,
	variation_id,
	operation
) => {
	const { attributes } = variations.find(
		(v) => v.variation_id === variation_id
	)
	const additional_attrs = {}

	Object.keys(attributes).forEach((key) => {
		if (attributes[key] === '') {
			additional_attrs[key] = el.querySelector(
				`select[name="${key}"]`
			).value
		}
	})

	const item = { id: variation_id }

	if (operation === 'add') {
		if (Object.keys(additional_attrs).length) {
			item.attributes = additional_attrs
		}

		return [...ct_localizations.blc_ext_wish_list.list.items, item]
	}

	if (operation === 'remove') {
		const wishlist = ct_localizations.blc_ext_wish_list.list.items

		return wishlist.filter(
			(w) =>
				w.id !== item.id ||
				Object.keys(w?.attributes || {}).some((aKey) => {
					return (
						item?.attributes?.[aKey] &&
						w.attributes[aKey] &&
						w.attributes[aKey] !== item?.attributes[aKey]
					)
				})
		)
	}
}

export const prepareListWithSimpleProduct = (productId, operation) => {
	const item = { id: +productId }

	if (operation === 'add') {
		return [...ct_localizations.blc_ext_wish_list.list.items, item]
	}

	if (operation === 'remove') {
		const wishlist = ct_localizations.blc_ext_wish_list.list.items

		return wishlist.filter((w) => w.id !== item.id)
	}
}
