import $ from 'jquery'

import { computeSwatch } from './common'

export const maybeHandleSingleSwatches = (el) => {
	if (!el.closest('.entry-summary')) {
		return
	}

	const form = el.closest('.entry-summary').querySelector('.variations_form')

	if (!form || form.hasEventListener) {
		return
	}

	form.hasEventListener = true

	$(form).on('found_variation', () => computeSwatch(form))
	$(form).on('reset_data', () => computeSwatch(form))

	$(form).wc_variation_form()
}
