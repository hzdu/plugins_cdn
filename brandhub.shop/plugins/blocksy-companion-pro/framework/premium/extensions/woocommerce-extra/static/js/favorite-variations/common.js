import $ from 'jquery'

export const computeFavorite = (
	el,
	form,
	container,
	favoritesButton,
	productId
) => {
	$(form).on('found_variation', (e, variation) => {
		const { variation_id, attributes } = variation

		const wishlist = ct_localizations.blc_ext_wish_list.list.items
		const additional_attrs = {}

		Object.keys(attributes).forEach((key) => {
			if (attributes[key] === '') {
				additional_attrs[key.trim()] = container
					.querySelector(`select[name="${key}"]`)
					.value.trim()
			}
		})

		const item = wishlist.find(
			(w) =>
				w.id === variation_id &&
				Object.keys(w?.attributes || {}).every(
					(aKey) =>
						additional_attrs?.[aKey] &&
						w.attributes[aKey] &&
						w.attributes[aKey] === additional_attrs[aKey]
				)
		)

		if (item) {
			favoritesButton.dataset.buttonState = 'active'
		} else {
			favoritesButton.dataset.buttonState = ''
		}
	})

	$(form).on('reset_data', (e, variation) => {
		const hasAttributes = hasAttributeSelected(el)

		setTimeout(() => {
			if (hasAttributes) {
				favoritesButton.dataset.buttonState = 'disabled'
			} else {
				favoritesButton.dataset.id = productId
				favoritesButton.dataset.buttonState = ''

				const wishlist = ct_localizations.blc_ext_wish_list.list.items

				const item = wishlist.find(
					(i) => i.id === productId && !i.attributes
				)

				if (item) {
					favoritesButton.dataset.buttonState = 'active'
				}
			}
		})
	})
}

export const hasAttributeSelected = (el) =>
	[...el.querySelectorAll('select')].some((swatchesSelect) => {
		if (!swatchesSelect) {
			return false
		}

		return !!swatchesSelect.value
	})
