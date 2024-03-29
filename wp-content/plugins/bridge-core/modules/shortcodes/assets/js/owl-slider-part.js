(function($) {
	'use strict';
	
	var owlSlider = {};
	qode.modules.owlSlider = owlSlider;
	
	owlSlider.qodeOwlSlider = qodeOwlSlider;
	
	owlSlider.qodeOnDocumentReady = qodeOnDocumentReady;
	
	$(document).ready(qodeOnDocumentReady);
	
	function qodeOnDocumentReady() {
		qodeOwlSlider();
	}
	
	function qodeOwlSlider() {
		var sliders = $('.qode-owl-slider');
		
		if (sliders.length) {
			sliders.each(function(){
				var slider = $(this),
					slideItemsNumber = slider.children().length,
					numberOfItems = 1,
					loop = true,
					autoplay = true,
					autoplayHoverPause = true,
					sliderSpeed = 5000,
					sliderSpeedAnimation = 600,
					margin = 0,
					responsiveMargin = 0,
					stagePadding = 0,
					stagePaddingEnabled = false,
					center = false,
					autoWidth = false,
					animateInClass = false, // keyframe css animation
					animateOut = false, // keyframe css animation
					navigation = true,
					pagination = false,
					sliderIsPortfolio = !!slider.hasClass('qode-pl-is-slider'),
					sliderDataHolder = sliderIsPortfolio ? slider.parent() : slider;  // this is condition for portfolio slider
				
				if (typeof slider.data('number-of-items') !== 'undefined' && slider.data('number-of-items') !== false && !sliderIsPortfolio) {
					numberOfItems = slider.data('number-of-items');
				}
				if (typeof sliderDataHolder.data('number-of-columns') !== 'undefined' && sliderDataHolder.data('number-of-columns') !== false && sliderIsPortfolio) {
					numberOfItems = sliderDataHolder.data('number-of-columns');
				}
				if (sliderDataHolder.data('enable-loop') === 'no') {
					loop = false;
				}
				if (sliderDataHolder.data('enable-autoplay') === 'no') {
					autoplay = false;
				}
				if (sliderDataHolder.data('enable-autoplay-hover-pause') === 'no') {
					autoplayHoverPause = false;
				}
				if (typeof sliderDataHolder.data('slider-speed') !== 'undefined' && sliderDataHolder.data('slider-speed') !== false) {
					sliderSpeed = sliderDataHolder.data('slider-speed');
				}
				if (typeof sliderDataHolder.data('slider-speed-animation') !== 'undefined' && sliderDataHolder.data('slider-speed-animation') !== false) {
					sliderSpeedAnimation = sliderDataHolder.data('slider-speed-animation');
				}
				if (typeof sliderDataHolder.data('slider-margin') !== 'undefined' && sliderDataHolder.data('slider-margin') !== false) {
					margin = sliderDataHolder.data('slider-margin');
				}
				if(slider.parent().hasClass('qode-huge-space')) {
					margin = 60;
				} else if (slider.parent().hasClass('qode-large-space')) {
					margin = 50;
				} else if (slider.parent().hasClass('qode-medium-space')) {
					margin = 40;
				} else if(slider.parent().hasClass('qode-normal-space')) {
					margin = 30;
				} else if (slider.parent().hasClass('qode-small-space')) {
					margin = 20;
				} else if (slider.parent().hasClass('qode-tiny-space')) {
					margin = 10;
				}
				if (sliderDataHolder.data('slider-padding') === 'yes') {
					stagePaddingEnabled = true;
					stagePadding = parseInt(slider.outerWidth() * 0.28);
					margin = 50;
				}
				if (sliderDataHolder.data('enable-center') === 'yes') {
					center = true;
				}
				if (sliderDataHolder.data('enable-auto-width') === 'yes') {
					autoWidth = true;
				}
				if (typeof sliderDataHolder.data('slider-animate-in') !== 'undefined' && sliderDataHolder.data('slider-animate-in') !== false) {
					animateInClass = sliderDataHolder.data('slider-animate-in');
				}
				if (typeof sliderDataHolder.data('slider-animate-out') !== 'undefined' && sliderDataHolder.data('slider-animate-out') !== false) {
					animateOut = sliderDataHolder.data('slider-animate-out');
				}
				if (sliderDataHolder.data('enable-navigation') === 'no') {
					navigation = false;
				}
				if (sliderDataHolder.data('enable-pagination') === 'yes') {
					pagination = true;
				}
				
				if(navigation && pagination) {
					slider.addClass('qode-slider-has-both-nav');
				}
				
				if (slideItemsNumber <= 1) {
					loop       = false;
					autoplay   = false;
					navigation = false;
					pagination = false;
				}
				
				var responsiveNumberOfItems1 = 1,
					responsiveNumberOfItems2 = 2,
					responsiveNumberOfItems3 = 3,
					responsiveNumberOfItems4 = numberOfItems;
				
				if (numberOfItems < 3) {
					responsiveNumberOfItems2 = numberOfItems;
					responsiveNumberOfItems3 = numberOfItems;
				}
				
				if (numberOfItems > 4) {
					responsiveNumberOfItems4 = 4;
				}
				
				if (stagePaddingEnabled || margin > 0) {
					responsiveMargin = 20;
				}
				
				slider.waitForImages(function() {
					slider.owlCarousel({
						items: numberOfItems,
						loop: loop,
						autoplay: autoplay,
						autoplayHoverPause: autoplayHoverPause,
						autoplayTimeout: sliderSpeed,
						smartSpeed: sliderSpeedAnimation,
						margin: margin,
						stagePadding: stagePadding,
						center: center,
						autoWidth: autoWidth,
						animateInClass: animateInClass,
						animateOut: animateOut,
						dots: pagination,
						nav: navigation,
						navText: [
							'<span class="qode-prev-icon fa fa-angle-left"></span>',
							'<span class="qode-next-icon fa fa-angle-right"></span>'
						],
						responsive: {
							0: {
								items: responsiveNumberOfItems1,
								margin: responsiveMargin,
								stagePadding: 0,
								center: false,
								autoWidth: false
							},
							681: {
								items: responsiveNumberOfItems2
							},
							769: {
								items: responsiveNumberOfItems3
							},
							1025: {
								items: responsiveNumberOfItems4
							},
							1281: {
								items: numberOfItems
							}
						},
						onInitialize: function () {
							slider.css('visibility', 'visible');
						},
						onChanged: function () {
							if(slider.parent().length && slider.parent().hasClass('qode-image-behavior-lightbox')){
								prettyPhoto();
							}
						}
					});
				});
			});
		}
	}
	
})(jQuery);