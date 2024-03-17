import { setRatioFor } from 'blocksy-customizer-sync'

export const mountCompareSync = () => {
	wp.customize('product_compare_layout', (val) => {
		val.bind((to) => {
			to.forEach((layout) => {
				if (layout['id'] === 'product_main') {
					const images = document.querySelectorAll(
						'.ct-compare-column .thumb_class'
					)

					images.forEach((el) => {
						setRatioFor(layout['compare_image_ratio'], el)
					})
				}
			})
		})
	})
}
