(function($) {
	'use strict';
	
	var imageSliderNoSpace = {};
	qode.modules.imageSliderNoSpace = imageSliderNoSpace;
	
	imageSliderNoSpace.initImageGallerySliderNoSpace = initImageGallerySliderNoSpace;
	imageSliderNoSpace.qodeInitElementorImageSliderNoSpace = qodeInitElementorImageSliderNoSpace;
	
	imageSliderNoSpace.qodeOnDocumentReady = qodeOnDocumentReady;
	imageSliderNoSpace.qodeOnWindowLoad = qodeOnWindowLoad;
	
	$(document).ready(qodeOnDocumentReady);
	$(window).on('load', qodeOnWindowLoad);
	
	/*
	 All functions to be called on $(window).load() should be in this function
	 */
	function qodeOnDocumentReady() {
		initImageGallerySliderNoSpace();
	}
	
	function qodeOnWindowLoad() {
		qodeInitElementorImageSliderNoSpace();
	}
	
	function initImageGallerySliderNoSpace(){
		if($('.qode_image_gallery_no_space').length){
			$('.qode_image_gallery_no_space').each(function(){
				$(this).animate({'opacity': 1},1000);
				$(this).find('.qode_image_gallery_holder').lemmonSlider({infinite: true});
			});
			
			//disable click on non active image
			$('.qode_image_gallery_no_space').on('click', 'li:not(.active) a', function() {
				if(window.innerWidth>800){
					return false;
				}
				else {
					return true;
				}
			});
		}
	}
	
	function qodeInitElementorImageSliderNoSpace(){
		$(window).on('elementor/frontend/init', function () {
			elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_image_slider_no_space.default', function() {
				initImageGallerySliderNoSpace();
			} );
		});
	}
	
})(jQuery);