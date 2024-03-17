export const generateQuerySelector = (el) => {
	let parents = []

	let elem = el

	for (; elem && elem !== document; elem = elem.parentNode) {
		parents.push(elem)
	}

	parents = parents.reverse()

	return parents
		.filter((el) => !el.matches('body, html'))
		.map((elForSelector) => {
			if (elForSelector === document.body) {
				return 'body'
			}

			let str = elForSelector.tagName

			if (elForSelector !== el) {
				str += elForSelector.id != '' ? '#' + elForSelector.id : ''
				str += elForSelector.dataset.target
					? `[data-target="${elForSelector.dataset.target}"]`
					: ''
			}

			if (elForSelector.className) {
				const classes = elForSelector.className.split(/\s/)

				for (let i = 0; i < classes.length; i++) {
					if (
						classes[i] &&
						classes[i] !== 'active' &&
						classes[i] !== 'ct-active'
					) {
						str += '.' + classes[i]
					}
				}
			}

			return str
		})
		.join(' > ')
}
