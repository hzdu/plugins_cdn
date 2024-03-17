import ctEvents from 'ct-events'
import { registerDynamicChunk } from 'blocksy-frontend'

const render = () => {
	let maybeEntryContent = document.querySelector(
		'#main > [class*="ct-container"] > article[id] > .entry-content'
	)

	if (!maybeEntryContent) {
		return
	}

	const entryContent = maybeEntryContent.getBoundingClientRect()

	document
		.querySelector('.ct-read-progress-bar')
		.style.setProperty(
			'--scroll',
			`${Math.max(
				0,
				Math.min(
					100,
					(100 * pageYOffset) /
						(entryContent.top +
							entryContent.height +
							pageYOffset -
							innerHeight)
				)
			)}%`
		)
}

registerDynamicChunk('blocksy_adv_cpt_read_progress', {
	mount: (el) => {
		if (el.registered) {
			return
		}

		el.registered = true

		render()
		document.addEventListener('scroll', () => render())
	},
})
