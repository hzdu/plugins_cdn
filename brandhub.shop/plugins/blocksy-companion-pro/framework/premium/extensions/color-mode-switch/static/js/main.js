import { registerDynamicChunk } from 'blocksy-frontend'
import cookie from 'js-cookie'

const syncPalette = () => {
	const theme =
		cookie.get('blocksy_current_theme') ||
		document.documentElement.dataset.colorMode

	if (theme === 'os-default') {
		document.documentElement.dataset.colorMode = theme
	} else {
		document.documentElement.dataset.colorMode = `${theme}:updating`

		setTimeout(() => {
			document.documentElement.dataset.colorMode = theme
		}, 300)
	}
}

let synced = false

registerDynamicChunk('blocksy_dark_mode', {
	mount: (el, payload = {}) => {
		const { event } = payload || {}

		if (!event) {
			if (!synced) {
				synced = true
				syncPalette()
			}

			return
		}

		const periods = {
			onehour: 36e5,
			oneday: 864e5,
			oneweek: 7 * 864e5,
			onemonth: 31 * 864e5,
			threemonths: 3 * 31 * 864e5,
			sixmonths: 6 * 31 * 864e5,
			oneyear: 365 * 864e5,
			forever: 10000 * 864e5,
		}

		let theme =
			cookie.get('blocksy_current_theme') ||
			(document.documentElement.dataset.colorMode === 'os-default'
				? 'os-default'
				: 'light')

		if (theme === 'os-default') {
			theme = window.matchMedia('(prefers-color-scheme: dark)').matches
				? 'dark'
				: 'light'
		}

		cookie.set(
			'blocksy_current_theme',
			theme === 'light' ? 'dark' : 'light',
			{
				expires: new Date(new Date() * 1 + periods.threemonths),
				sameSite: 'lax',
			}
		)

		setTimeout(() => {
			syncPalette()
		})
	},
})
