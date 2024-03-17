class PaginationPatcher {
	id = 'pagination'

	beforeReplace() {
		const maybeCurrentPagination = document.querySelector('.ct-pagination')

		if (maybeCurrentPagination) {
			if (maybeCurrentPagination.infiniteScroll) {
				maybeCurrentPagination.infiniteScroll.destroy()
			}

			maybeCurrentPagination.remove()
		}
	}

	afterReplace() {}
}

export default PaginationPatcher
