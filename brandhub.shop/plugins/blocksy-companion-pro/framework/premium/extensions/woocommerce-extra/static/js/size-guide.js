import { registerDynamicChunk, getCurrentScreen } from 'blocksy-frontend'
import ctEvents from 'ct-events'

let store = {}

export const afterRequest = (panel, e) => {
	ctEvents.trigger('blocksy:frontend:init')

	setTimeout(() => {
		ctEvents.trigger('ct:overlay:handle-click', {
			e,
			href: `#${panel.id}`,
			options: {
				openStrategy: 'skip',
				isModal: panel.dataset.behaviour === 'modal',
				computeScrollContainer: () => {
					if (!panel.closest('body')) {
						return
					}

					if (
						getCurrentScreen &&
						getCurrentScreen({ withTablet: true }) === 'mobile'
					) {
						return panel.querySelector('.ct-size-guide-content')
					} else {
						return panel.querySelector('.entry-summary')
					}
				},
				clickOutside: true,
				focus: false,
			},
		})
	})
}

const cachedFetch = (url) =>
	store[url]
		? new Promise((resolve) => {
				resolve(store[url])
				store[url] = store[url].clone()
		  })
		: new Promise((resolve) =>
				fetch(url).then((response) => {
					resolve(response)
					store[url] = response.clone()
				})
		  )

export const getFetchDescriptorFor = (trigger) => {
	const searchParams = new URLSearchParams()

	searchParams.append('action', 'blocksy_get_woo_size_guide')
	searchParams.append('table_id', trigger.dataset.id)
	searchParams.append('product_id', trigger.dataset.product)

	if (window.wp && window.wp.customize) {
		searchParams.append(
			'size_guide_placement',
			wp.customize('size_guide_placement')()
		)
		searchParams.append(
			'size_guide_side_panel_position',
			wp.customize('size_guide_side_panel_position')()
		)
	}

	const fetchUrl = `${ct_localizations.ajax_url}?${searchParams.toString()}`

	return {
		isCached: !!store[fetchUrl],

		fetch: () =>
			new Promise((r) => {
				cachedFetch(fetchUrl)
					.then((r) => r.json())
					.then(({ success, data }) => {
						const div = document.createElement('div')
						div.innerHTML = data.content

						r(div.firstElementChild)
					})
			}),
	}
}

const openSizesModal = ({ event, el, completeAction }) => {
	const fetchDescriptor = getFetchDescriptorFor(el)

	fetchDescriptor.fetch().then((content) => {
		completeAction({
			finalState: '',
			onCompleted: () => {
				document.querySelector('.ct-drawer-canvas').appendChild(content)
				const panel = document.querySelector('#ct-size-guide-modal')

				setTimeout(() => {
					ctEvents.trigger('ct:overlay:handle-click', {
						event,
						options: {
							openStrategy: 'fast',
							container: panel,
						},
					})

					afterRequest(panel, event)
				}, 10)
			},
		})
	})
}

registerDynamicChunk('blocksy_ext_woo_extra_size_guide', {
	mount: (el, { event, completeAction }) => {
		event.preventDefault()
		event.stopPropagation()

		openSizesModal({
			event,
			el,
			completeAction,
		})
	},

	maybeGetPanelContent: (el, { event }) => {
		const fetchDescriptor = getFetchDescriptorFor(el)

		if (fetchDescriptor.isCached) {
			return new Promise((resolve) => {
				// TODO: maybe implement actual content retrieval if will be
				// needed in the future.
				resolve('')
			})
		}

		return null
	},
})

ctEvents.on('ct:modal:closed', (modalContainer) => {
	if (modalContainer.id !== 'ct-size-guide-modal') {
		return
	}

	setTimeout(() => {
		modalContainer.remove()
	})
})
