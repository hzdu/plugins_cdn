import './variables'
import { responsiveClassesFor } from 'blocksy-customizer-sync'

wp.customize('shortcuts_bar_type', (val) => {
	val.bind((to) => {
		let maybeShortcuts = document.querySelector('.ct-shortcuts-bar')

		if (maybeShortcuts) {
			maybeShortcuts.dataset.type = to
		}
	})
})

wp.customize('shortcuts_label_position', (val) => {
	val.bind((to) => {
		;[...document.querySelectorAll('.ct-shortcuts-bar a')].map(
			(a) => {
				a.dataset.label = to
			}
		)
	})
})

wp.customize('shortcuts_bar_items', (val) => {
	val.bind((to) => {
		let maybeShortcuts = document.querySelector('.ct-shortcuts-bar')

		if (!maybeShortcuts) {
			return
		}

		to.filter(({ enabled }) => !!enabled).map((layer, index) => {
			const shortcutContainer = maybeShortcuts.children[index]

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

				if (layer.id === 'custom_link') {
					shortcutContainer.setAttribute('href', layer.link)
				}

				if (maybeLabel) {
					maybeLabel.innerHTML = layer.label
				}
			}
		})
	})
})
