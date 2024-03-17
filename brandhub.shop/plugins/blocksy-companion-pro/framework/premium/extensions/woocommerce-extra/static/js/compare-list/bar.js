import ctEvents from 'ct-events'

let store = {}

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

export const getFetchDescriptorFor = () => {
	const searchParams = new URLSearchParams()

	searchParams.append('action', 'blocksy_get_woo_compare_bar')
	searchParams.append(
		'items',
		JSON.stringify(ct_localizations.blc_ext_compare_list.list)
	)

	const fetchUrl = `${ct_localizations.ajax_url}?${searchParams.toString()}`

	return {
		fetch: () =>
			new Promise((r) => {
				cachedFetch(fetchUrl)
					.then((r) => r.json())
					.then(({ success, data }) => {
						const div = document.createElement('div')
						div.innerHTML = data.content

						r({
							...data,
							content: div.firstElementChild,
						})
					})
			}),
	}
}

export const syncBarItems = (args = {}) => {
	args = {
		cb: () => {},
		forceSync: false,
		...args,
	}

	const fetchDescriptor = getFetchDescriptorFor()
	const bar = document.querySelector('.ct-compare-bar')

	if (!bar && !args.forceSync) {
		return
	}

	fetchDescriptor.fetch().then((data) => {
		const { content } = data

		if (bar) {
			const container = bar.querySelector('.ct-container')
			const newContent = content.querySelector('.ct-container')

			if (container && newContent) {
				container.outerHTML = newContent.outerHTML
			} else {
				if (container) {
					container.remove()
				} else {
					if (newContent) {
						bar.appendChild(newContent)
					}
				}
			}

			const items = document.querySelectorAll('.ct-compare-bar ul li')

			if (!items.length) {
				bar.closest('.ct-drawer-canvas').removeAttribute(
					'data-compare-bar'
				)
			} else {
				bar.closest('.ct-drawer-canvas').dataset.compareBar = ''
			}

			ctEvents.trigger('blocksy:frontend:init')
		}

		args.cb(data)
	})
}
