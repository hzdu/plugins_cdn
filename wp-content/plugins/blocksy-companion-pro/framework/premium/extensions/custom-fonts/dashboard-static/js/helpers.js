export const getAllVariations = (short) => ({
	n1: 'Thin 100',
	i1: 'Thin 100 Italic',
	n2: 'Extra-Light 200',
	i2: 'Extra-Light 200 Italic',
	n3: 'Light 300',
	i3: 'Light 300 Italic',
	n4: 'Regular 400',
	i4: short ? 'Italic' : 'Regular 400 Italic',
	n5: 'Medium 500',
	i5: 'Medium 500 Italic',
	n6: 'Semi-Bold 600',
	i6: 'Semi-Bold 600 Italic',
	n7: 'Bold 700',
	i7: 'Bold 700 Italic',
	n8: 'Extra-Bold 800',
	i8: 'Extra-Bold 800 Italic',
	n9: 'Ultra-Bold 900',
	i9: 'Ultra-Bold 900 Italic',
})

export const pragrammedUnicodes = {
	'U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F':
		'cyrillic-ext',
	'U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116': 'cyrillic',
	'U+1F00-1FFF': 'greek-ext',
	'U+0370-03FF': 'greek',
	'U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB':
		'vietnamese',
	'U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF':
		'latin-ext',
	'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD':
		'latin',
}

export const getHumanizedUnicodes = {
	'cyrillic-ext': 'Cyrillic Extended',
	cyrillic: 'Cyrillic',
	'greek-ext': 'Greek Extended',
	greek: 'Greek',
	vietnamese: 'Vietnamese',
	'latin-ext': 'Latin Extended',
	latin: 'Latin',
}

export const humanizeVariations = (variation, short = false) =>
	getAllVariations(short)[variation]
