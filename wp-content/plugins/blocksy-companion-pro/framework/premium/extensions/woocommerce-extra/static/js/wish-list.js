import ctEvents from 'ct-events'
import { registerDynamicChunk } from 'blocksy-frontend'

const createCookie = (name, value, days = 365) => {
	var expires

	if (days) {
		var date = new Date()

		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
		expires = '; expires=' + date.toGMTString()
	} else {
		expires = ''
	}

	document.cookie = name + '=' + value + expires + '; path=/'
}

const getCookie = (c_name) => {
	if (document.cookie.length > 0) {
		c_start = document.cookie.indexOf(c_name + '=')

		if (c_start != -1) {
			c_start = c_start + c_name.length + 1
			c_end = document.cookie.indexOf(';', c_start)

			if (c_end == -1) {
				c_end = document.cookie.length
			}

			return unescape(document.cookie.substring(c_start, c_end))
		}
	}

	return ''
}

const syncLikedProductsState = ({
	// add | remove
	operation,
	productId: productIdInternal,

	el,

	cb = () => {},
} = {}) => {
	let oldList = ct_localizations.blc_ext_wish_list.list

	let newList = oldList

	if (operation) {
		let productId =
			productIdInternal ||
			Array.from(el.classList)
				.find((className) => className.indexOf('post-') === 0)
				.split('-')[1]

		if (operation === 'add') {
			newList = [...oldList, parseFloat(productId)]
		}

		if (operation === 'remove') {
			newList = oldList.filter(
				(id) => parseFloat(id) !== parseFloat(productId)
			)
		}

		if (
			window.ct_localizations.blc_ext_wish_list.user_logged_in === 'yes'
		) {
			fetch(
				`${ct_localizations.ajax_url}?action=blc_ext_wish_list_sync_likes`,
				{
					method: 'POST',
					body: JSON.stringify(newList),
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
				}
			)
				.then((response) => response.json())
				.then(({ success, data }) => {
					if (success) {
						cb()
					}
				})
		} else {
			createCookie('blc_products_wish_list', JSON.stringify(newList))

			setTimeout(() => {
				cb()
			})
		}

		window.ct_localizations.blc_ext_wish_list.list = newList

		ctEvents.trigger(`blocksy:woocommerce:wish-list-change`, {
			operation,
			productId,
		})
	}

	Array.from(
		document.querySelectorAll('.ct-header-wishlist, [data-id="wishlist"]')
	).map((el) => {
		el.classList.remove('ct-added')
		el.classList.add('ct-adding')

		el.removeAttribute('style')
		;[...document.querySelectorAll('.ct-dynamic-count-wishlist')].map(
			(counter) => {
				counter.innerHTML = newList.length
				counter.dataset.count = newList.length
			}
		)

		setTimeout(() => {
			el.classList.remove('ct-adding')
			el.classList.add('ct-added')
		})
	})
}

let loadedLikes = false

registerDynamicChunk('blocksy_ext_woo_extra_wish_list', {
	mount: (el, { event }) => {
		if (!event) {
			if (loadedLikes) {
				return
			}

			loadedLikes = true

			fetch(
				`${ct_localizations.ajax_url}?action=blc_ext_wish_list_get_all_likes`,
				{
					method: 'POST',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
				}
			)
				.then((response) => response.json())
				.then(({ success, data }) => {
					window.ct_localizations.blc_ext_wish_list = {
						list: data.likes,
						user_logged_in: data.user_logged_in,
					}

					syncLikedProductsState()

					let selector =
						'[class*="ct-wishlist-button"], .ct-wishlist-remove, .wishlist-product-remove > .remove, .product-mobile-actions > [href*="wishlist-remove"]'

					const allLikes = data.likes

					;[...document.querySelectorAll(selector)].map((el) => {
						el.classList.remove('active')

						if (
							allLikes.indexOf(
								parseFloat(
									el
										.getAttribute('href')
										.replace('#wishlist-add-', '')
								)
							) > -1
						) {
							el.classList.add('active')
						}
					})
				})

			return
		}

		event.preventDefault()
		event.stopPropagation()

		syncLikedProductsState({
			productId: el.dataset.id,
			el: el.closest('.type-product') || el.closest('li'),
			operation:
				el.classList.contains('active') ||
				el.classList.contains('remove')
					? 'remove'
					: 'add',

			cb: () => {
				if (el.closest('.wishlist-table')) {
					if (el.closest('tbody').children.length === 1) {
						location.reload()
					} else {
					}
				}
			},
		})

		if (!el.classList.contains('remove')) {
			el.classList.toggle('active')
		}

		if (el.closest('.wishlist-table')) {
			if (el.closest('tbody').children.length === 1) {
			} else {
				el.closest('tr').remove()
			}
		}
	},
})
