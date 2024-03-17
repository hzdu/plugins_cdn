import { registerDynamicChunk } from 'blocksy-frontend'
import $ from 'jquery'

import { maybeHandleSingleSwatches } from './swatches/single'
import { maybeHandleArchiveSwatches } from './swatches/archive'

registerDynamicChunk('blocksy_ext_woo_extra_swatches', {
	mount: (el, { event }) => {
		maybeHandleSingleSwatches(el)
		maybeHandleArchiveSwatches(el)

		if (el.classList.contains('disabled')) {
			return
		}

		const variationSwatches = el.closest('.ct-variation-swatches')

		if (!variationSwatches) {
			return
		}

		const select = variationSwatches.querySelector('select')

		if (el === select) {
			return
		}

		if (el.classList.contains('active')) {
			$(select).val('').trigger('change')
			return
		}

		$(select).val(el.dataset.value).trigger('change')
	},
})
