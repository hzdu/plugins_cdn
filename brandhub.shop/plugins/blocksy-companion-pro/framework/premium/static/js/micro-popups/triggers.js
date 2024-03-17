let handled = false

const handleGenericPopups = () => {
	if (handled) {
		return
	}

	handled = true

	import('./lazy/triggers/generic').then(({ handleTriggers }) => {
		handleTriggers()
	})
}

const genericTriggers = [
	'[data-popup-mode*="page_load"]',
	'[data-popup-mode*="after_x_time"]',
	'[data-popup-mode*="after_x_pages"]',
	'[data-popup-mode*="exit_intent"]',
	'[data-popup-mode*="element_reveal"]',
	'[data-popup-mode*="element_click"]',
	'[data-popup-mode*="after_inactivity"]',
]

export const handleMicroPopupTriggers = () => {
	genericTriggers.map((selector) => {
		if (document.querySelector(selector)) {
			handleGenericPopups()
		}
	})

	if (document.querySelector('[data-popup-mode*="scroll"]')) {
		import('./lazy/triggers/popup-mode-scroll').then(
			({ handleScrollModePopups }) => {
				handleScrollModePopups()
			}
		)
	}
}
