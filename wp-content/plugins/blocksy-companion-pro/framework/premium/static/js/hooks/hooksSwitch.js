export const mountHooksSwitch = () => {
	const container = document.querySelector(
		'.post-type-ct_content_block .wp-list-table'
	)

	if (!container) {
		return
	}

	container.addEventListener('click', (e) => {
		if (e.target.classList.contains('ct-content-block-switch')) {
			e.preventDefault()

			const toggle = e.target
			const postId = toggle.dataset.postId

			let enabled = toggle.classList.contains('ct-active') ? 'no' : 'yes'

			toggle.classList.toggle('ct-active')

			fetch(
				`${ct_localizations.ajax_url}?action=blocksy_content_blocksy_toggle&post_id=${postId}&enabled=${enabled}`
			).then((r) => r.json())
		}
	})
}
