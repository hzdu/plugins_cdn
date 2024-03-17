export const handleOutofStock = (el) => {
	const form = el.closest('[data-product_variations]')

	if (!form || form.dataset.product_variations === 'false') {
		return
	}

	const outOfStockLabel =
		wc_add_to_cart_variation_params?.i18n_out_of_stock || ''

	const selects = Array.from(form.querySelectorAll('select'))

	const selectedAttributes = selects
		.filter((s) => s.value && s.closest('.ct-variation-swatches'))
		.reduce((acc, s) => {
			acc[`attribute_${s.getAttribute('id')}`] = s.value

			return acc
		}, {})

	const filteredVariations = JSON.parse(form.dataset.product_variations)
		.filter((variation) =>
			Object.keys(selectedAttributes).every(
				(key) => variation.attributes[key] === selectedAttributes[key]
			)
		)
		.filter((variation) => {
			return variation.is_in_stock
		})

	const availableAttributes = filteredVariations.reduce((acc, variation) => {
		Object.keys(variation.attributes).forEach((key) => {
			if (!acc[key]) {
				acc[key] = []
			}

			if (!acc[key].includes(variation.attributes[key])) {
				acc[key].push(variation.attributes[key])
			}
		})

		return acc
	}, {})

	selects
		.filter((s) => !s.value)
		.forEach((s) => {
			if (!s.closest('.ct-variation-swatches')) {
				return
			}

			s.closest('.ct-variation-swatches')
				.querySelectorAll('[data-value]')
				.forEach((singleSwatchEl) => {
					if (
						(
							availableAttributes[
								`attribute_${s.getAttribute('id')}`
							] || []
						).includes(singleSwatchEl.dataset.value) ||
						singleSwatchEl.classList.contains('disabled')
					) {
						singleSwatchEl.classList.remove('ct-out-of-stock')

						const maybeTooltip =
							singleSwatchEl.querySelector('.ct-tooltip')

						if (maybeTooltip) {
							maybeTooltip.textContent =
								maybeTooltip.textContent.replace(
									` - ${outOfStockLabel}`,
									''
								)
						}
					} else {
						singleSwatchEl.classList.add('ct-out-of-stock')

						const maybeTooltip =
							singleSwatchEl.querySelector('.ct-tooltip')

						if (
							maybeTooltip &&
							!maybeTooltip.textContent.includes(outOfStockLabel)
						) {
							maybeTooltip.textContent = `${maybeTooltip.textContent} - ${outOfStockLabel}`
						}
					}
				})
		})
}

export const computeSwatch = (el) => {
	;[...el.querySelectorAll('.ct-variation-swatches')].map((swatchesEl) => {
		const select = swatchesEl.querySelector('select')

		if (!select) {
			return
		}

		const maybeActive = swatchesEl.querySelector('.active')

		if (maybeActive) {
			maybeActive.classList.remove('active')

			const labelConteiner = document.querySelector(
				`[for="${select.getAttribute('id')}"]`
			)
			if (labelConteiner) {
				labelConteiner.textContent =
					labelConteiner.textContent.split(':')?.[0].trim() ||
					labelConteiner.textContent
			}
		}

		if (
			select.value &&
			swatchesEl.querySelector(`[data-value="${select.value}"]`)
		) {
			const label = select.querySelector(
				`[value="${select.value}"]`
			).textContent
			const labelConteiner = document.querySelector(
				`[for="${select.getAttribute('id')}"]`
			)
			if (labelConteiner) {
				labelConteiner.textContent = `${
					labelConteiner.textContent.split(':')?.[0].trim() ||
					labelConteiner.textContent
				}: ${label}`
			}

			swatchesEl
				.querySelector(`[data-value="${select.value}"]`)
				.classList.add('active')
		}

		;[...swatchesEl.querySelectorAll('[data-value]')].map(
			(singleSwatchEl) => {
				singleSwatchEl.classList.remove('active', 'disabled')

				if (singleSwatchEl.dataset.value === select.value) {
					singleSwatchEl.classList.add('active')
				}

				if (
					!select.querySelector(
						`[value="${singleSwatchEl.dataset.value}"]`
					) ||
					select
						.querySelector(
							`[value="${singleSwatchEl.dataset.value}"]`
						)
						.hasAttribute('disabled')
				) {
					singleSwatchEl.classList.add('disabled')
				}
			}
		)

		handleOutofStock(el)
	})
}
