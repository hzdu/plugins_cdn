export const getAllVariations = (short) => ({
	n1: 'Thin 100',
	i1: 'Thin 100 Italic',
	n2: 'Extra-Light 200',
	i2: 'Extra-Light 200 Italic',
	n3: 'Light 300',
	i3: 'Light 300 Italic',
	n4: 'Regular',
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

export const humanizeVariations = (variation, short = false) =>
	getAllVariations(short)[variation]
