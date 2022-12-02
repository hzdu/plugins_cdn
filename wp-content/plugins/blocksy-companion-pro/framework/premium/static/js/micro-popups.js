import ctEvents from 'ct-events'
import { registerDynamicChunk } from 'blocksy-frontend'
import { focusLockManager } from './focus-lock'

const onKeydown = (event) => {
	if (event.keyCode !== 27) return
	;[...document.querySelectorAll('.ct-popup.active')].map((popup) => {
		closeMicroPopup(popup)
	})
}

const getPastPopups = () => {
	const received = JSON.parse(localStorage.getItem('blocksyPastPopups'))
	let result = {}

	if (Array.isArray(received)) {
		received.forEach((key) => {
			result[key] = {
				isExpired: true,
				pages: [],
			}
		})
	} else {
		result = received
	}

	return result ?? {}
}

const closeMicroPopup = (popup) => {
	let popupId = popup.id.replace('ct-popup-', '')

	localStorage.setItem(
		'blocksyPastPopups',
		JSON.stringify({
			...getPastPopups(),
			[popupId]: {
				isExpired: true,
				pages: [location.href],
			},
		})
	)

	popup.classList.toggle('active')

	focusLockManager().focusLockOff(popup)
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
}

const openMicroPopup = (popup) => {
	let isOpen = popup.classList.contains('active')

	popup.classList.toggle('active')

	focusLockManager().focusLockOn(popup)

	if (!isOpen) {
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
	}

	document.addEventListener('keyup', onKeydown)
}

window.blocksyOpenMicroPopup = openMicroPopup

let isPopupExpired = (popup) => {
	let popupId = popup.id.replace('ct-popup-', '')

	if (popup.dataset.popupMode.indexOf('once') === -1) {
		return false
	}

	return getPastPopups()[popupId]?.isExpired
}

let mounted = false

registerDynamicChunk('blocksy_pro_micro_popups', {
	mount: (el) => {
		if (!mounted) {
			mounted = true
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
					...document.querySelectorAll(
						'[data-popup-mode*="after_x_pages"]'
					),
				].filter((popup) => !isPopupExpired(popup))

				if (allPopupsWithExit.length > 0) {
					let pastPopups = getPastPopups()

					allPopupsWithExit.map((popup) => {
						const popupId = popup.id.replace('ct-popup-', '')
						//* +1 is the first one page, cause trigger name is ("After")
						const count =
							parseFloat(popup.dataset.popupMode.split(':')[1]) +
							1

						const result = {
							...(pastPopups[popupId] ?? {}),
							pages: Array.from(
								new Set([
									...((pastPopups[popupId] ?? {}).pages ||
										[]),
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
					...document.querySelectorAll(
						'[data-popup-mode*="exit_intent"]'
					),
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
				;[
					...document.querySelectorAll(
						'[data-popup-mode*="element_reveal"]'
					),
				]
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

			if (
				document.querySelector('[data-popup-mode*="after_inactivity"]')
			) {
				;[
					...document.querySelectorAll(
						'[data-popup-mode*="after_inactivity"]'
					),
				]
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
							window.removeEventListener(
								'scroll',
								resetTimer,
								true
							)
						}

						function resetTimer() {
							let timeout = popup.dataset.popupMode.split(':')[1]
							clearTimeout(t)

							t = setTimeout(
								yourFunction,
								parseInt(timeout, 10) * 1000
							)
						}
					})
			}

			if (document.querySelector('[data-popup-mode*="scroll"]')) {
				;[...document.querySelectorAll('[data-popup-mode*="scroll"]')]
					.filter((popup) => !isPopupExpired(popup))
					.map((popup) => {
						let isUp = popup.dataset.popupMode.indexOf('up') > -1

						let currentScrollY = scrollY

						const cb = () => {
							let scrollOffset =
								popup.dataset.popupMode.split(':')[1]

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

								scrollOffset =
									(parseFloat(scrollOffset) / 100) * height
							}

							if (scrollOffset.toString().indexOf('vh') > -1) {
								scrollOffset =
									(parseFloat(scrollOffset) / 100) *
									innerHeight
							}

							if (isUp) {
								if (scrollY > currentScrollY) {
									currentScrollY = scrollY
								} else {
									if (
										Math.abs(currentScrollY - scrollY) >
										scrollOffset
									) {
										openMicroPopup(popup)
										window.removeEventListener(
											'scroll',
											cb,
											true
										)
									}
								}
							} else {
								if (scrollOffset <= scrollY) {
									openMicroPopup(popup)
									window.removeEventListener(
										'scroll',
										cb,
										true
									)
								}
							}
						}

						window.addEventListener('scroll', cb, true)
					})
			}
		}

		;[...document.querySelectorAll('[href*="ct-popup-"]')].map(
			(popupTrigger) => {
				if (popupTrigger.hasClickListener) {
					return
				}

				if (
					!document.querySelector(popupTrigger.getAttribute('href'))
				) {
					return
				}

				popupTrigger.hasClickListener = true

				popupTrigger.addEventListener('click', (e) => {
					e.preventDefault()

					let popup = document.querySelector(
						popupTrigger.getAttribute('href')
					)

					openMicroPopup(popup)
				})
			}
		)
	},
})
