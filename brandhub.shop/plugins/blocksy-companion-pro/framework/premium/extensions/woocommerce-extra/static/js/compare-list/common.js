export const prepareListWithSimpleProduct = (productId, operation) => {
	let oldList = Object.values(ct_localizations.blc_ext_compare_list.list)

	const item = { id: productId }

	if (operation === 'add') {
		return [...oldList, item]
	}

	if (operation === 'remove') {
		return oldList.filter((w) => w.id !== item.id)
	}
}

export const removeEmptyRows = () => {
	const rows = document.querySelectorAll('.ct-compare-row')

	rows.forEach((row) => {
		const columns = row.querySelectorAll(
			'.ct-compare-column:not(.ct-compare-item-label)'
		)

		if (Array.from(columns).every((column) => column.innerHTML === '~')) {
			row.remove()
		}
	})
}

// compare bar
export const maybeHandleCompareBarProduct = (el) => {
	const item_id = el.dataset.id
	const item = { id: parseInt(item_id) }

	const compareView = Object.values(
		ct_localizations.blc_ext_compare_list.list
	)

	el.closest('li').remove()

	const items = document.querySelectorAll('.ct-compare-bar ul li')
	const bar = document.querySelector('.ct-compare-bar')

	if (bar) {
		if (!items.length) {
			bar.closest('.ct-drawer-canvas').removeAttribute('data-compare-bar')

			const container = bar.querySelector('.ct-container')

			if (container) {
				container.remove()
			}
		} else {
			bar.closest('.ct-drawer-canvas').dataset.compareBar = ''
		}
	}

	return compareView.filter((w) => w.id !== item.id)
}
