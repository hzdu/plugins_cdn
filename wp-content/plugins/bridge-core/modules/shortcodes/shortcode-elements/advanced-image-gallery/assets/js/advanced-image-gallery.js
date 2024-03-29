(function($) {
    'use strict';
	
	var imageGallery = {};
	qode.modules.imageGallery = imageGallery;
	
	imageGallery.qodeInitAdvancedImageGalleryMasonry = qodeInitAdvancedImageGalleryMasonry;
	
	
	imageGallery.qodeOnWindowLoad = qodeOnWindowLoad;
	
	$(window).on('load', qodeOnWindowLoad );
	
	/*
	 ** All functions to be called on $(window).load() should be in this function
	 */
	function qodeOnWindowLoad() {
		qodeInitAdvancedImageGalleryMasonry();
	}
	
	/*
	 ** Init Image Gallery shortcode - Masonry layout
	 */
	function qodeInitAdvancedImageGalleryMasonry(){
		var holder = $('.qode-advanced-image-gallery.qode-aig-masonry-type');
		
		if(holder.length){
			holder.each(function(){
				var thisHolder = $(this),
					masonry = thisHolder.find('.qode-aig-masonry'),
					size = thisHolder.find('.qode-aig-grid-sizer').width();

				qodeResizeAdvancedImageGalleryMasonryItems(size, thisHolder);

				masonry.waitForImages(function() {
					masonry.isotope({
						layoutMode: 'packery',
						itemSelector: '.qode-aig-image',
						percentPosition: true,
						packery: {
							gutter: '.qode-aig-grid-gutter',
							columnWidth: '.qode-aig-grid-sizer'
						}
					});
					
					setTimeout(function() {
						masonry.isotope('layout');
						initParallax();
					}, 800);
					
					masonry.css('opacity', '1');
				});
			});
		}
	}

	/**
	 * Init Resize Portfolio Items
	 */
	function qodeResizeAdvancedImageGalleryMasonryItems(size,container){
		if(container.hasClass('qode-aig-images-fixed')) {
			var padding = parseInt(container.find('.qode-aig-image').css('padding-left')),
				defaultMasonryItem = container.find('.qode-aig-default-masonry-item'),
				largeWidthMasonryItem = container.find('.qode-aig-large-width-masonry-item'),
				largeHeightMasonryItem = container.find('.qode-aig-large-height-masonry-item'),
				largeWidthHeightMasonryItem = container.find('.qode-aig-large-masonry-item');

			if (qode.windowWidth > 680) {
				defaultMasonryItem.css('height', size - 2 * padding);
				largeHeightMasonryItem.css('height', Math.round(2 * size) - 2 * padding);
				largeWidthHeightMasonryItem.css('height', Math.round(2 * size) - 2 * padding);
				largeWidthMasonryItem.css('height', size - 2 * padding);
			} else {
				defaultMasonryItem.css('height', size - 2 * padding);
				largeHeightMasonryItem.css('height', size*2 - 2 * padding);
				largeWidthHeightMasonryItem.css('height', size - 2 * padding);
				largeWidthMasonryItem.css('height', Math.floor(size / 2) - 2 * padding);
			}
		}
	}

})(jQuery);