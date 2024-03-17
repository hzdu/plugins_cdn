export const getPastPopups = () => {
	const received = JSON.parse(localStorage.getItem('blocksyPastPopups'))

	let result = {}

	if (Array.isArray(received)) {
		received.forEach((key) => {
			result[key] = {
				closed: {
					reason: 'cancel',
					timestamp: new Date().getTime(),
				},
				pages: [],
			}
		})
	} else {
		result = received
	}

	result = Object.keys(result || {}).reduce((acc, key) => {
		const { isExpired, ...newPopup } = result[key]

		return {
			...acc,
			[key]: {
				...newPopup,
				...(newPopup.closed
					? {}
					: {
							closed: isExpired
								? {
										reason: 'cancel',
										timestamp: new Date().getTime(),
								  }
								: null,
					  }),
			},
		}
	}, {})

	return result || {}
}

export const isPopupExpired = (popup) => {
	let popupId = popup.id.replace('ct-popup-', '')

	const maybePastPopupDescriptor = getPastPopups()[popupId]

	if (
		popup.dataset.popupRelaunch &&
		popup.dataset.popupRelaunch.indexOf('custom') > -1 &&
		maybePastPopupDescriptor
	) {
		const popupRelaunchDescriptor = popup.dataset.popupRelaunch.split(':')

		let daysAfterCancel = 0
		let daysAfterSuccess = 0

		if (popupRelaunchDescriptor.length > 1) {
			daysAfterCancel = parseInt(popupRelaunchDescriptor[1])
			daysAfterSuccess = daysAfterCancel
		}

		if (popupRelaunchDescriptor.length > 2) {
			daysAfterSuccess = parseInt(popupRelaunchDescriptor[2])
		}

		const { closed } = maybePastPopupDescriptor

		if (!closed || !closed.timestamp) {
			return false
		}

		const days =
			closed.reason === 'cancel' ? daysAfterCancel : daysAfterSuccess

		const diffInMs = new Date() - new Date(closed.timestamp)
		const diffInDays = diffInMs / (1000 * 60 * 60 * 24)

		if (diffInDays > days) {
			return false
		}

		return true
	}

	return maybePastPopupDescriptor && maybePastPopupDescriptor.closed
}
