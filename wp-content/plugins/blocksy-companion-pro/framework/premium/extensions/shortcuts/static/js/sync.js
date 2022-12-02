import './variables'
import { responsiveClassesFor } from 'blocksy-customizer-sync'

wp.customize('shortcuts_bar_type', (val) => {
	val.bind((to) => {
		let maybeShortcuts = document.querySelector('.ct-shortcuts-container')

		if (maybeShortcuts) {
			maybeShortcuts.dataset.type = to
		}
	})
})

wp.customize('shortcuts_label_position', (val) => {
	val.bind((to) => {
		;[...document.querySelectorAll('.ct-shortcuts-container a')].map(
			(a) => {
				a.dataset.label = to
			}
		)
	})
})

wp.customize('shortcuts_bar_items', (val) => {
	val.bind((to) => {
		let maybeShortcuts = document.querySelector('.ct-shortcuts-container')

		if (!maybeShortcuts) {
			return
		}

		to.map((layer) => {
			let shortcutContainer = maybeShortcuts.querySelector(
				`[data-shortcut="${layer.id}"]`
			)

			if (shortcutContainer) {
				responsiveClassesFor(
					layer.item_visibility || {
						desktop: true,
						tablet: true,
						mobile: true,
					},
					shortcutContainer
				)

				let maybeLabel = shortcutContainer.querySelector('.ct-label')

				if (maybeLabel) {
					maybeLabel.innerHTML = layer.label
				}
			}
		})
	})
})
