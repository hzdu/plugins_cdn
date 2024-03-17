import { getPastPopups, isPopupExpired } from '../persistence'

const openMicroPopup = (...args) => {
	import('../open-close-logic').then(({ openMicroPopup: o }) => o(...args))
}

export const handleTriggers = () => {
	;[...document.querySelectorAll('[data-popup-mode*="page_load"]')]
		.filter((popup) => !isPopupExpired(popup))
		.map((popup) => openMicroPopup(popup))
	;[...document.querySelectorAll('[data-popup-mode*="after_x_time"]')]
		.filter((popup) => !isPopupExpired(popup))
		.map((popup) => {
			let timeout = popup.dataset.popupMode.split(':')[1]

			setTimeout(() => {
				openMicroPopup(popup)
			}, parseInt(timeout, 10) * 1000)
		})

	if (document.querySelector('[data-popup-mode*="after_x_pages"]')) {
		let allPopupsWithExit = [
			...document.querySelectorAll('[data-popup-mode*="after_x_pages"]'),
		].filter((popup) => !isPopupExpired(popup))

		if (allPopupsWithExit.length > 0) {
			let pastPopups = getPastPopups()

			allPopupsWithExit.map((popup) => {
				const popupId = popup.id.replace('ct-popup-', '')

				//* +1 is the first one page, cause trigger name is ("After")
				const count =
					parseFloat(popup.dataset.popupMode.split(':')[1]) + 1

				const result = {
					...(pastPopups[popupId] ?? {}),
					pages: Array.from(
						new Set([
							...((pastPopups[popupId] ?? {}).pages || []),
							location.href,
						])
					),
				}

				pastPopups[popupId] = result

				if (result.pages.length >= count) {
					openMicroPopup(popup)
				}
			})

			localStorage.setItem(
				'blocksyPastPopups',
				JSON.stringify(pastPopups)
			)
		}
	}

	if (document.querySelector('[data-popup-mode*="exit_intent"]')) {
		let allPopupsWithExit = [
			...document.querySelectorAll('[data-popup-mode*="exit_intent"]'),
		].filter((popup) => !isPopupExpired(popup))

		if (allPopupsWithExit.length > 0) {
			const cb = (event) => {
				if (
					event.clientY <= 0 ||
					event.clientX <= 0 ||
					event.clientX >= window.innerWidth ||
					event.clientY >= window.innerHeight
				) {
					;[
						...document.querySelectorAll(
							'[data-popup-mode*="exit_intent"]'
						),
					].map((popup) => {
						if (popup.classList.contains('active')) {
							return
						}

						openMicroPopup(popup)
						document.removeEventListener('mouseout', cb)
					})
				}
			}

			document.addEventListener('mouseout', cb)
		}
	}

	if (document.querySelector('[data-popup-mode*="element_reveal"]')) {
		;[...document.querySelectorAll('[data-popup-mode*="element_reveal"]')]
			.filter((popup) => !isPopupExpired(popup))
			.map((popup) => {
				let selector = popup.dataset.popupMode.split(':')[1]

				if (!document.querySelector(selector)) {
					return
				}

				let io = new IntersectionObserver((entries) => {
					const visible = entries
						.filter(({ isIntersecting }) => isIntersecting)
						.map(({ target }) => target)

					if (visible.length === 0) {
						return
					}

					openMicroPopup(popup)

					io.disconnect()
				})

				;[...document.querySelectorAll(selector)].map((el) => {
					io.observe(el)
				})
			})
	}

	if (document.querySelector('[data-popup-mode*="element_click"]')) {
		;[...document.querySelectorAll('[data-popup-mode*="element_click"]')]
			.filter((popup) => !isPopupExpired(popup))
			.map((popup) => {
				let selector = popup.dataset.popupMode.split(':')[1]

				if (!document.querySelector(selector)) {
					return
				}

				;[...document.querySelectorAll(selector)].map((el) => {
					el.addEventListener('click', (e) => {
						e.preventDefault()
						e.stopPropagation()

						openMicroPopup(popup)
					})
				})
			})
	}

	if (document.querySelector('[data-popup-mode*="after_inactivity"]')) {
		;[...document.querySelectorAll('[data-popup-mode*="after_inactivity"]')]
			.filter((popup) => !isPopupExpired(popup))
			.map((popup) => {
				var t
				window.addEventListener('load', resetTimer)
				window.addEventListener('mousemove', resetTimer)
				window.addEventListener('mousedown', resetTimer)
				window.addEventListener('touchstart', resetTimer)
				window.addEventListener('click', resetTimer)
				window.addEventListener('keydown', resetTimer)
				window.addEventListener('scroll', resetTimer, true)

				function yourFunction() {
					openMicroPopup(popup)

					if (t) {
						clearTimeout(t)
					}

					window.removeEventListener('load', resetTimer)
					window.removeEventListener('mousemove', resetTimer)
					window.removeEventListener('mousedown', resetTimer)
					window.removeEventListener('touchstart', resetTimer)
					window.removeEventListener('click', resetTimer)
					window.removeEventListener('keydown', resetTimer)
					window.removeEventListener('scroll', resetTimer, true)
				}

				function resetTimer() {
					let timeout = popup.dataset.popupMode.split(':')[1]
					clearTimeout(t)

					t = setTimeout(yourFunction, parseInt(timeout, 10) * 1000)
				}
			})
	}
}
