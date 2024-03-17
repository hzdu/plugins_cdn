import { registerDynamicChunk } from 'blocksy-frontend'
import ctEvents from 'ct-events'

const handleClick = (e) => {
	const bar = e.target.matches('.ct-compare-bar')
		? e.target
		: e.target.closest('.ct-compare-bar')

	if (!bar) {
		return
	}

	setTimeout(() => {
		handleMouseOut(bar)
		handleMouseIn(bar)
	}, 10)
}

const handleMouseIn = (el) => {
	const firstItem = el.querySelector('li')

	if (!firstItem) {
		return
	}

	const firstItemYPos = firstItem.getBoundingClientRect().top

	const restItems = el.querySelectorAll('li:not(:first-child)')

	restItems.forEach((item) => {
		if (item.getBoundingClientRect().top !== firstItemYPos) {
			item.style.display = 'none'
		}
	})

	el.addEventListener('click', handleClick, { capture: true })
}

const handleMouseOut = (el) => {
	const items = el.querySelectorAll('li')

	items.forEach((item) => {
		item.removeAttribute('style')
	})

	el.removeEventListener('click', handleClick, { capture: true })
}

registerDynamicChunk('blocksy_ext_woo_extra_compare_bar_tooltip', {
	mount: (el) => {
		if (el.hasListener) {
			return
		}

		handleMouseIn(el)

		el.addEventListener('mouseenter', () => {
			handleMouseIn(el)
		})

		el.addEventListener('mouseleave', () => {
			handleMouseOut(el)
		})

		el.hasListener = true
	},
})
