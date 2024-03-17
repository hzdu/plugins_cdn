const icons = require('./icons.json')
const fs = require('fs')

const makePack = (pack) =>
	Object.keys(icons)
		.filter((key) => icons[key].styles.includes(pack))
		.map((icon) => {
			let { svg } = icons[icon]

			return {
				icon,
				svg: `<svg width="20" height="20" viewBox="${svg[pack].viewBox}"><path d="${svg[pack].path}" /></svg>`,
			}
		})

const writePack = (pack) => {}

const packs = [
	{
		style: 'brands',
		name: 'fab',
	},

	{
		style: 'regular',
		name: 'far',
	},

	{
		style: 'solid',
		name: 'fas',
	},
]

packs.map(({ style, name }) => {
	let packResult = makePack(style)
	fs.writeFileSync(`${name}.json`, JSON.stringify(packResult))
})
