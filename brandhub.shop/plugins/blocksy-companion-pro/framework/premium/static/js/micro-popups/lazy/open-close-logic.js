import ctEvents from 'ct-events'
import { getPastPopups } from './persistence'

import { focusLockManager } from './focus-lock'
import { scrollLockManager } from './scroll-lock'

import { mountAdditionalCloseForPopup } from './popup-additional-close'

const onKeydown = (event) => {
	if (event.keyCode !== 27) return
	;[...document.querySelectorAll('.ct-popup.active')].map((popup) => {
		closeMicroPopup(popup)
	})
}

export const closeMicroPopup = (popup, args = {}) => {
	args = {
		unmount: true,

		// cancel | success
		reason: 'cancel',

		...args,
	}

	let popupId = popup.id.replace('ct-popup-', '')

	ctEvents.trigger('blocksy:micro-popups:close', popupId, popup)

	localStorage.setItem(
		'blocksyPastPopups',
		JSON.stringify({
			...getPastPopups(),
			[popupId]: {
				...(getPastPopups()[popupId] || {}),
				pages: [location.href],
				closed: {
					reason: args.reason,
					timestamp: new Date().getTime(),
				},
			},
		})
	)

	popup.classList.toggle('active')

	setTimeout(() => {
		const maybeDynamic = popup.querySelector('.ct-dynamic-popup-content')

		if (maybeDynamic) {
			maybeDynamic.remove()
		}
	}, 500)

	focusLockManager().focusLockOff(popup)
	if (popup.dataset.scrollLock) {
		scrollLockManager().enable(popup.querySelector('.entry-content'))
	}
	;[...popup.querySelectorAll('iframe[src*="youtu"]')].map((i) => {
		i.contentWindow.postMessage(
			'{"event":"command","func":"stopVideo","args":""}',
			'*'
		)
	})
	;[...popup.querySelectorAll('video')].map((i) => {
		i.pause()
	})
	;[...popup.querySelectorAll('iframe:not([src*="youtu"])')].map((i) => {
		const source = i.src
		i.src = ''
		i.src = source
	})

	document.removeEventListener('keyup', onKeydown)

	if (popup.unmount && args.unmount) {
		popup.unmount()
	}
}

const actuallyOpenPopup = (popup) => {
	const popupId = popup.id.replace('ct-popup-', '')
	ctEvents.trigger('blocksy:micro-popups:open', popupId, popup)

	popup.classList.add('active')

	localStorage.setItem(
		'blocksyPastPopups',
		JSON.stringify({
			...getPastPopups(),
			[popupId]: {
				...(getPastPopups()[popupId] || {}),
				pages: [...((getPastPopups()[popupId] || {}).pages || [])],
				closed: null,
			},
		})
	)

	focusLockManager().focusLockOn(popup)
	if (popup.dataset.scrollLock) {
		scrollLockManager().disable(popup.querySelector('.entry-content'))
	}

	let maybeClose = popup.querySelector('.ct-toggle-close')

	if (maybeClose && !maybeClose.hasClickListener) {
		maybeClose.hasClickListener = true

		popup
			.querySelector('.ct-toggle-close')
			.addEventListener('click', (e) => {
				e.preventDefault()
				closeMicroPopup(popup)
			})
	}

	if (popup.dataset.popupBackdrop === 'yes' && !popup.hasClickListener) {
		popup.hasClickListener = true
		popup.addEventListener('click', (e) => {
			if (e.target.dataset.popupBackdrop === 'yes') {
				e.preventDefault()
				closeMicroPopup(popup)
			}
		})
	}

	document.addEventListener('keyup', onKeydown)

	if (popup.dataset.popupAdditionalClose) {
		mountAdditionalCloseForPopup(popup)
	}
}

let controller = null

export const openMicroPopup = (popup, payload = {}) => {
	let isOpen = popup.classList.contains('active')

	if (isOpen) {
		closeMicroPopup(popup)
		return
	}

	if (!popup.querySelector('.entry-content')) {
		const receivedPopupContent = (content) => {
			const tempContainer = document.createElement('div')
			tempContainer.innerHTML = content

			if (tempContainer.querySelector('.entry-content')) {
				popup
					.querySelector('article')
					.appendChild(tempContainer.querySelector('.entry-content'))

				popup
					.querySelector('article')
					.lastElementChild.classList.add('ct-dynamic-popup-content')
			}

			actuallyOpenPopup(popup)
		}

		const popupId = popup.id.replace('ct-popup-', '')

		const persistedPopup = getPastPopups()[popupId]

		const popupCacheKey = popup.dataset.cacheKey

		if (
			popupCacheKey &&
			persistedPopup &&
			persistedPopup.content &&
			persistedPopup.content.cacheKey === popupCacheKey
		) {
			receivedPopupContent(persistedPopup.content.content)
			return
		}

		const body = new FormData()

		let maybePostId = payload.postId

		if (!maybePostId) {
			const maybeClass = [...document.body.classList].find(
				(c) => c.indexOf('postid-') === 0
			)

			if (maybeClass) {
				maybePostId = maybeClass.replace('postid-', '')
			}
		}

		body.append('popup_id', popupId)
		if (maybePostId) {
			body.append('post_id', maybePostId)
		}

		if (controller) {
			controller.abort()
		}

		if ('AbortController' in window) {
			controller = new AbortController()
		}

		fetch(
			`${ct_localizations.ajax_url}?action=blc_retrieve_popup_content`,
			{
				method: 'POST',
				body,
				signal: controller.signal,
			}
		)
			.then((response) => response.json())
			.then(({ success, data }) => {
				if (!success) {
					return
				}

				if (!data || !data.content) {
					return
				}

				if (popupCacheKey) {
					localStorage.setItem(
						'blocksyPastPopups',
						JSON.stringify({
							...getPastPopups(),
							[popupId]: {
								...(getPastPopups()[popupId] || {}),
								content: {
									content: data.content,
									cacheKey: popupCacheKey,
								},
							},
						})
					)
				}

				receivedPopupContent(data.content)
			})

		return
	}

	actuallyOpenPopup(popup)
}
