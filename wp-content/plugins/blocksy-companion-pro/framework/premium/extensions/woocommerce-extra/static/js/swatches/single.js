import $ from 'jquery'

import { computeSwatch } from './common'

export const maybeHandleSingleSwatches = (el) => {
	if (!el.closest('.entry-summary')) {
		return
	}

	const forms = el
		.closest('.entry-summary')
		.querySelectorAll('.variations_form')

	if (!forms || !forms.length) {
		return
	}

	forms.forEach((form) => {
		if (form.hasEventListener) {
			return
		}

		form.hasEventListener = true

		$(form).on('found_variation', () => computeSwatch(form))
		$(form).on('reset_data', () => computeSwatch(form))

		$(form).wc_variation_form()
	})
}
