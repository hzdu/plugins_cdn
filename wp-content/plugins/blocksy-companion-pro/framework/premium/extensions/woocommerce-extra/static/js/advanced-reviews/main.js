import { registerDynamicChunk } from 'blocksy-frontend'

const fileListFrom = (files) => {
	const b = new ClipboardEvent('').clipboardData || new DataTransfer()
	for (const file of files) b.items.add(file)
	return b.files
}

let prevFiles = []

registerDynamicChunk('blocksy_ext_woo_extra_advanced_reviews', {
	mount: (el, { event }) => {
		const form = el.closest('form')

		if (!form) {
			return
		}

		form.enctype = 'multipart/form-data'

		const files = el.files
		const previewContainer = document.querySelector(
			'.ct-review-upload-actions'
		)

		const images = previewContainer.querySelectorAll('.ct-media-container')

		images.forEach((image) => {
			image.remove()
		})

		const filesToRender = event.bubbles
			? [...prevFiles, ...Array.from(files)]
			: prevFiles
		prevFiles = filesToRender
		el.files = fileListFrom(filesToRender)

		if (filesToRender.length > 0) {
			filesToRender.forEach((element, index) => {
				const fileURL = URL.createObjectURL(element)

				const figure = document.createElement('figure')
				figure.classList.add('ct-media-container')
				figure.innerHTML = `
					<img src="${fileURL}" style="aspect-ratio: 1/1" alt="Review Image">
					<span class="ct-remove-image">
						<svg width="10" height="10" viewBox="0 0 15 15" fill="currentColor">
							<path d="M8.5,7.5l4.5,4.5l-1,1L7.5,8.5L3,13l-1-1l4.5-4.5L2,3l1-1l4.5,4.5L12,2l1,1L8.5,7.5z"></path>
						</svg>
					</span>
				`
				previewContainer.insertBefore(
					figure,
					previewContainer.querySelector('[for="blc-review-images"]')
				)

				const removeImageBtn = figure.querySelector('.ct-remove-image')
				removeImageBtn.addEventListener('click', () => {
					figure.remove()
					const updatedFiles = filesToRender.filter(
						(_, i) => i !== index
					)
					el.files = fileListFrom(updatedFiles)
					prevFiles = updatedFiles
					el.dispatchEvent(new Event('change'))
				})
			})
		}
	},
})
