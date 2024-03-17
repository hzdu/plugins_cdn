import { openMicroPopup, closeMicroPopup } from '../open-close-logic'

import { isPopupExpired } from '../persistence'

export const handleScrollModePopups = () => {
	;[...document.querySelectorAll('[data-popup-mode*="scroll"]')]
		.filter((popup) => !isPopupExpired(popup))
		.map((popup) => {
			let isUp = popup.dataset.popupMode.indexOf('up') > -1

			let currentScrollY = scrollY

			const cb = () => {
				let scrollOffset = popup.dataset.popupMode.split(':')[1]

				if (scrollOffset.indexOf('px') > -1) {
					scrollOffset = parseFloat(scrollOffset)
				}

				if (scrollOffset.toString().indexOf('%') > -1) {
					let body = document.body
					let html = document.documentElement

					let height = Math.max(
						body.scrollHeight,
						body.offsetHeight,
						html.clientHeight,
						html.scrollHeight,
						html.offsetHeight
					)

					scrollOffset = (parseFloat(scrollOffset) / 100) * height
				}

				if (scrollOffset.toString().indexOf('vh') > -1) {
					scrollOffset =
						(parseFloat(scrollOffset) / 100) * innerHeight
				}

				if (isUp) {
					if (scrollY > currentScrollY) {
						currentScrollY = scrollY
					} else {
						if (Math.abs(currentScrollY - scrollY) > scrollOffset) {
							if (!popup.classList.contains('active')) {
								openMicroPopup(popup)

								popup.unmount = () => {
									window.removeEventListener(
										'scroll',
										cb,
										true
									)
								}
							}

							if (
								popup.dataset.popupMode.indexOf(
									'close-back'
								) === -1
							) {
								window.removeEventListener('scroll', cb, true)
							}
						} else {
							if (popup.classList.contains('active')) {
								closeMicroPopup(popup, { unmount: false })
							}
						}
					}
				}

				if (!isUp) {
					if (scrollOffset <= scrollY) {
						if (!popup.classList.contains('active')) {
							openMicroPopup(popup)
							popup.unmount = () => {
								window.removeEventListener('scroll', cb, true)
							}
						}

						if (
							popup.dataset.popupMode.indexOf('close-back') === -1
						) {
							window.removeEventListener('scroll', cb, true)
						}
					} else {
						if (popup.classList.contains('active')) {
							closeMicroPopup(popup, { unmount: false })
						}
					}
				}
			}

			window.addEventListener('scroll', cb, true)
		})
}
