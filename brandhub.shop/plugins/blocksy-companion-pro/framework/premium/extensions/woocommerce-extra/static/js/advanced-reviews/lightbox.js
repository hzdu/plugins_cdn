import $ from 'jquery'
import { registerDynamicChunk } from 'blocksy-frontend'

const openPhotoswipeFor = (el, container, index = null) => {
	if (el.closest('.elementor-section-wrap')) {
		return
	}

	const pswpElement = document.querySelector('.pswp')
	const clicked = el

	let items = [...container.querySelectorAll('.ct-media-container')]

	items = items.map((mediaContainer) => {
		const img = mediaContainer.querySelector('img')

		return {
			mediaContainer,
			img,
			src: img.closest('[data-src]')
				? img.closest('[data-src]').dataset.src ||
				  img.closest('[data-src]').href ||
				  img.src
				: img.src,
			w:
				(img.closest('[data-width]')
					? img.closest('[data-width]').dataset.width
					: img.width) || img.width,
			h:
				(img.closest('[data-height]')
					? img.closest('[data-height]').dataset.height
					: img.width) || img.width,
			title: img.getAttribute('data-caption'),
		}
	})

	if (
		items.length === 1 &&
		items[0].img &&
		items[0].img.closest('a') &&
		!items[0].img.closest('a').getAttribute('data-src')
	) {
		return
	}

	var options = $.extend(
		{
			index: index === 0 ? 0 : index || $(clicked).index(),
			addCaptionHTMLFn: function (item, captionEl) {
				if (!item.title) {
					captionEl.children[0].textContent = ''
					return false
				}
				captionEl.children[0].textContent = item.title
				return true
			},
		},
		{
			shareEl: false,
			fullscreenEl: true,
			closeOnScroll: false,
			history: false,
			showHideOpacity: false,
			hideAnimationDuration: 0,
			showAnimationDuration: 0,
		}
	)

	// Initializes and opens PhotoSwipe.
	var photoswipe = new PhotoSwipe(
		pswpElement,
		PhotoSwipeUI_Default,
		items,
		options
	)

	photoswipe.init()
}

registerDynamicChunk('blocksy_ext_woo_extra_advanced_reviews_lightbox', {
	mount: (el, { event }) => {
		const container = el.closest('.ct-review-images')

		const images = container.querySelectorAll('img')
		const activeIndex = Array.from(images)
			.map((img) => img.src)
			.indexOf(el.querySelector('img').src)

		openPhotoswipeFor(el, container, activeIndex)
	},
})
