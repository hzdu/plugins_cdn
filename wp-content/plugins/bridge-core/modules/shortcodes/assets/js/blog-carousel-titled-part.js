(function($) {
	'use strict';
	
	var blogCarouselTitled = {};
	qode.modules.blogCarouselTitled = blogCarouselTitled;
	
	blogCarouselTitled.qodeInitBlogCarouselTitled = qodeInitBlogCarouselTitled;
	blogCarouselTitled.qodeInitElementorBlogCarouselTitled = qodeInitElementorBlogCarouselTitled;
	
	blogCarouselTitled.qodeOnDocumentReady = qodeOnDocumentReady;
	blogCarouselTitled.qodeOnWindowLoad = qodeOnWindowLoad;
	
	$(document).ready(qodeOnDocumentReady);
	$(window).on('load', qodeOnWindowLoad);
	
	function qodeOnDocumentReady() {
		qodeInitBlogCarouselTitled();
	}
	
	function qodeOnWindowLoad() {
		qodeInitElementorBlogCarouselTitled();
	}
	
	function qodeInitBlogCarouselTitled(){
		"use strict";
		
		if($('.qode-blog-carousel-titled').length){
			$('.qode-blog-carousel-titled').each(function(){
				var slider = $(this);
				var maxItems = 4;
				var itemWidth;
				var autoPlay = false;
				
				if(typeof slider.data('posts-shown') !== 'undefined') {
					maxItems = slider.data('posts-shown');
				}
				
				if ( $window_width < 769 && maxItems > 2){
					maxItems = 2;
				}
				
				if ( $window_width < 601 && maxItems > 1){
					maxItems = 1;
				}
				
				itemWidth = slider.width()/maxItems;
				
				slider.find('.qode-bct-posts').carouFredSel({
					circular: true,
					responsive: true,
					scroll: 1,
					prev : {
						button : function() {
							return slider.find('.qode-bct-caroufredsel-prev');
						}
					},
					next : {
						button : function() {
							return slider.find('.qode-bct-caroufredsel-next');
						}
					},
					items: {
						width: itemWidth,
						visible: {
							min: 1,
							max: maxItems
						}
					},
					auto: autoPlay,
					mousewheel: false,
					swipe: {
						onMouse: true,
						onTouch: true
					}
				});
				slider.animate({'opacity': 1},1000)
			});
			
			calculateHeights();
			
		}
	}
	
	function calculateHeights(){
		if($('.qode-bct-posts').length){
			$('.qode-bct-posts').each(function(){
				$(this).parents('.caroufredsel_wrapper').css({'height' : ($(this).find('.qode-bct-post').outerHeight()) + 'px'});
			});
		}
	}
	
	function qodeInitElementorBlogCarouselTitled(){
		$(window).on('elementor/frontend/init', function () {
			elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_blog_carousel_titled.default', function() {
				qodeInitBlogCarouselTitled();
			} );
		});
	}
	
})(jQuery);