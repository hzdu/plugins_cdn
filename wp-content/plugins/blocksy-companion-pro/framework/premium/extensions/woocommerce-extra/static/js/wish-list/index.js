import ctEvents from 'ct-events'
import { registerDynamicChunk } from 'blocksy-frontend'
import { maybeHandleFavoriteSingleProduct } from './single'
import { maybeHandleFavoriteArchiveProduct } from './archive'
import { maybeHandleFavoriteTableProduct } from './table'
import { prepareListWithSimpleProduct } from './common'

let loadedLikes = false

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

const syncCounter = () => {
	let wishlistItems = Object.values(
		ct_localizations.blc_ext_wish_list.list.items
	)

	Array.from(
		document.querySelectorAll(
			'.ct-header-wishlist, [data-id="wishlist"], [data-shortcut="wishlist"]'
		)
	).map((el) => {
		const counterWrapper = el.querySelector('.ct-dynamic-count-wishlist')

		if (counterWrapper) {
			if (wishlistItems.length !== +counterWrapper.dataset.count) {
				el.classList.remove('ct-added')
				el.classList.add('ct-adding')

				el.removeAttribute('style')
				;[
					...document.querySelectorAll('.ct-dynamic-count-wishlist'),
				].map((counter) => {
					if (counter.innerHTML !== wishlistItems.length) {
						counter.innerHTML = wishlistItems.length
						counter.dataset.count = wishlistItems.length
					}
				})

				setTimeout(() => {
					el.classList.remove('ct-adding')
					el.classList.add('ct-added')
				})
			}
		}
	})
}

const syncLikedProductsState = ({
	// add | remove
	operation,
	productId: productIdInternal,
	variable = false,

	el,

	cb = () => {},
} = {}) => {
	let newList = Object.values(ct_localizations.blc_ext_wish_list.list.items)

	if (operation) {
		let productId =
			productIdInternal ||
			Array.from(el.classList)
				.find((className) => className.indexOf('post-') === 0)
				.split('-')[1]

		if (el) {
			if (el.classList.contains('ct-wishlist-button-single')) {
				newList = maybeHandleFavoriteSingleProduct(
					el,
					operation,
					variable
				)
			}

			if (
				el.classList.contains('ct-wishlist-button-archive') &&
				!el.closest('.ct-compare-column')
			) {
				newList = maybeHandleFavoriteArchiveProduct(
					el,
					operation,
					variable
				)
			}

			if (el.closest('.ct-compare-column')) {
				newList = prepareListWithSimpleProduct(productId, operation)
			}

			if (
				operation === 'remove' &&
				(el.closest('.wishlist-product-remove') ||
					el.closest('.product-mobile-actions'))
			) {
				newList = maybeHandleFavoriteTableProduct(el, variable)
			}
		}

		if (
			window.ct_localizations.blc_ext_wish_list.user_logged_in === 'yes'
		) {
			fetch(
				`${ct_localizations.ajax_url}?action=blc_ext_wish_list_sync_likes`,
				{
					method: 'POST',
					body: JSON.stringify({
						...ct_localizations.blc_ext_wish_list.list,
						items: newList,
					}),
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
				}
			)
				.then((response) => response.json())
				.then(({ success, data }) => {
					if (success) {
						cb(operation)
					}
				})
		} else {
			createCookie(
				'blc_products_wish_list',
				JSON.stringify({
					...ct_localizations.blc_ext_wish_list.list,
					items: newList,
				})
			)

			setTimeout(() => {
				cb(operation)
			})
		}

		window.ct_localizations.blc_ext_wish_list.list.items = newList

		ctEvents.trigger(`blocksy:woocommerce:wish-list-change`, {
			operation,
			productId,
		})
	}

	syncCounter()
}

const syncLikesClasses = (likes) => {
	let selector = [
		'[class*="ct-wishlist-button"]',
		'.ct-wishlist-remove',
		'.wishlist-product-remove > .remove',
		'.product-mobile-actions > [href*="wishlist-remove"]',
	].join(', ')

	const allLikes = likes.items.map((item) => item.id)

	;[...document.querySelectorAll(selector)].map((el) => {
		el.dataset.buttonState = ''

		if (
			allLikes.indexOf(
				parseFloat(
					el.getAttribute('href').replace('#wishlist-add-', '')
				)
			) > -1
		) {
			el.dataset.buttonState = 'active'
		}
	})
}

ctEvents.on('blocksy:wishlist:sync', () =>
	syncLikesClasses(window.ct_localizations.blc_ext_wish_list.list)
)

const handleCachedSync = () => {
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

			syncCounter()
			syncLikesClasses(data.likes)
		})
}

registerDynamicChunk('blocksy_ext_woo_extra_wish_list', {
	mount: (el, payload = {}) => {
		const { event, completeAction, initialState } = payload || {}

		if (!event) {
			handleCachedSync()
			return
		}

		event.preventDefault()
		event.stopPropagation()

		syncLikedProductsState({
			productId: el.dataset.id,
			el,
			operation:
				initialState === 'active' || el.classList.contains('remove')
					? 'remove'
					: 'add',
			variable: typeof el.dataset.variable !== 'undefined',
			cb: (operation) => {
				ctEvents.trigger('blocksy:wishlist:sync')

				if (operation === 'add') {
					completeAction({
						finalState: 'active',
					})
				} else {
					completeAction({ finalState: '' })
				}

				if (el.closest('.ct-woocommerce-wishlist-table')) {
					if (el.closest('tbody').children.length === 1) {
						location.reload()
					} else {
						el.closest('tr').remove()
					}
				}
			},
		})
	},
})
