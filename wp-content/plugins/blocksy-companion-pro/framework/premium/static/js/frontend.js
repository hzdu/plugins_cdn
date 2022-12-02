import { onDocumentLoaded } from 'blocksy-frontend'

onDocumentLoaded(() => {
	;[...document.querySelectorAll('.blocksy-hook-indicator > span')].map(
		(el) =>
			el.addEventListener('click', (e) => {
				e.preventDefault()

				const name = `Hook ${el.dataset.hook.split('::')[0]}`

				fetch(
					`${ct_localizations.ajax_url}?action=blocksy_content_blocksy_create&name=${name}&type=hook&predefined_hook=${el.dataset.hook}`
				)
					.then((r) => r.json())
					.then(({ data: { url } }) => {
						window.location = url
					})
			})
	)
})
