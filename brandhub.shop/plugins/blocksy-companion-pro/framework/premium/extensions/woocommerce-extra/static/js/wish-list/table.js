export const maybeHandleFavoriteTableProduct = (el) => {
	const tableRow = el.closest('tr')
	const maybeAttributes = tableRow.querySelectorAll('[data-attribute-slug]')
	const item = { id: parseFloat(el.dataset.id) }

	const maybeDefault =
		tableRow.querySelector('.variation')?.dataset?.default === 'yes'

	if (Array.from(maybeAttributes).length && !maybeDefault) {
		Array.from(maybeAttributes).forEach((dt) => {
			item.attributes = {
				...item.attributes,
				[dt.dataset.attributeSlug]: dt.dataset.attributeVal,
			}
		})
	}

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
