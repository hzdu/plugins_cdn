import { mountStackableFontsIntegration } from './providers/stackable'
import { mountKadenceFontsIntegration } from './providers/kadence'
import { mountPlusAddonsFontsIntegration } from './providers/plus-addons'

let fontsData = null

const fetchFontsList = async () => {
	const body = new FormData()

	body.append('action', 'blocksy_get_fonts_list')

	try {
		const response = await fetch(ajaxurl, {
			method: 'POST',
			body,
		})

		if (response.status === 200) {
			const {
				success,
				data: { fonts },
			} = await response.json()

			if (success) {
				fontsData = fonts
			}
		}
	} catch (e) {}
}

export const mountDynamicFontsIntegration = () => {
	if (
		!document.body.classList.contains('wp-customizer') &&
		!document.body.classList.contains('block-editor-page')
	) {
		return
	}

	fetchFontsList()

	mountKadenceFontsIntegration({ getFontsData: () => fontsData })
	mountStackableFontsIntegration({ getFontsData: () => fontsData })
	mountPlusAddonsFontsIntegration({ getFontsData: () => fontsData })
}
