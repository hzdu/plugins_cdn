export const mountHooksSwitch = () => {
	const allSwitches = Array.from(
		document.querySelectorAll('.ct-content-block-switch')
	)

	allSwitches.map((toggle) => {
		const postId = toggle.dataset.postId

		toggle.addEventListener('click', (e) => {
			e.preventDefault()

			let enabled = toggle.classList.contains('ct-active') ? 'no' : 'yes'

			toggle.classList.toggle('ct-active')

			fetch(
				`${ct_localizations.ajax_url}?action=blocksy_content_blocksy_toggle&post_id=${postId}&enabled=${enabled}`
			)
				.then((r) => r.json())
				.then(({ data }) => {
					console.log('here', { data })
				})
		})
	})
}
