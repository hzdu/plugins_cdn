(function($) {
	'use strict';
	
	var carousel = {};
	qode.modules.carousel = carousel;
	
	carousel.initQodeCarousel = initQodeCarousel;
	carousel.qodeInitElementorCarousel = qodeInitElementorCarousel;
	
	carousel.qodeOnDocumentReady = qodeOnDocumentReady;
	carousel.qodeOnWindowLoad = qodeOnWindowLoad;
	
	$(document).ready(qodeOnDocumentReady);
	$(window).on('load', qodeOnWindowLoad);
	
	function qodeOnDocumentReady() {
		initQodeCarousel();
	}
	
	function qodeOnWindowLoad() {
		qodeInitElementorCarousel();
	}
	
	function initQodeCarousel() {
		"use strict";
		
		if ($('.qode_carousels').length) {
			$('.qode_carousels').each(function () {
				var thisItem = $(this);
				var numberOfVisibleItems = 6;
				if (typeof thisItem.data('number-of-visible-items') !== 'undefined' && thisItem.data('number-of-visible-items') !== '') {
					if (thisItem.data('number-of-visible-items') === 4) {
						numberOfVisibleItems = 4;
					} else if (thisItem.data('number-of-visible-items') === 5) {
						numberOfVisibleItems = 5;
					}
				}
				var itemWidth = (thisItem.parents('.grid_section').length == 1 || thisItem.parents('.qode_elementor_container_inner').length == 1) ? 170 : 315;
				var maxItems = 6;
				if (numberOfVisibleItems === 4) {
					itemWidth = (thisItem.parents('.grid_section').length == 1 || thisItem.parents('.qode_elementor_container_inner').length == 1) ? 255 : 472;
					maxItems = 4;
				} else if (numberOfVisibleItems === 5) {
					itemWidth = (thisItem.parents('.grid_section').length == 1 || thisItem.parents('.qode_elementor_container_inner').length == 1) ? 204 : 378;
					maxItems = 5;
				}
				
				thisItem.find('.slides').carouFredSel({
					circular: true,
					responsive: true,
					scroll: {
						items: 1,
						duration: 1000,
						pauseOnHover: false
					},
					items: {
						width: itemWidth,
						visible: {
							min: 1,
							max: maxItems
						}
					},
					auto: true,
					mousewheel: false,
					swipe: {
						onMouse: true,
						onTouch: true
					}
					
				}).animate({'opacity': 1}, 1000);
			});
			calculateHeights();
		}
	}
	
	function calculateHeights(){
		if($('.qode_carousels .slides').length){
			$('.qode_carousels .slides').each(function(){
				$(this).parents('.caroufredsel_wrapper').css({'height' : ($(this).find('li.item').outerHeight()) + 'px'});
			});
		}
	}
	
	function qodeInitElementorCarousel(){
		$(window).on('elementor/frontend/init', function () {
			elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_carousel.default', function() {
				initQodeCarousel();
			} );
		});
	}
	
})(jQuery);