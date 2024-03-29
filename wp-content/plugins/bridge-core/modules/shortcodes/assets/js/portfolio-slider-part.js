(function($) {
	'use strict';
	
	var portfolioSlider = {};
	qode.modules.portfolioSlider = portfolioSlider;
	
	portfolioSlider.initPortfolioSlider = initPortfolioSlider;
	portfolioSlider.qodeInitElementorPortfolioSlider = qodeInitElementorPortfolioSlider;
	
	portfolioSlider.qodeOnDocumentReady = qodeOnDocumentReady;
	portfolioSlider.qodeOnWindowLoad = qodeOnWindowLoad;
	
	$(document).ready(qodeOnDocumentReady);
	$(window).on('load', qodeOnWindowLoad);
	
	function qodeOnDocumentReady() {
		initPortfolioSlider();
	}
	
	function qodeOnWindowLoad() {
		qodeInitElementorPortfolioSlider();
	}
	
	function initPortfolioSlider(){
		"use strict";
		
		if($('.portfolio_slider').length){
			
			$('.portfolio_slider').each(function(){
				
				var number_of_items;
				var autoplay = false;
				var item_width_fw;
				if(typeof $(this).data('number_of_items') !== 'undefined') {
					number_of_items = $(this).data('number_of_items');
				}
				
				if( typeof $(this).data('autoplay') !== 'undefined' && 'yes' == $(this).data('autoplay') ) {
					autoplay = true;
				}
				else {
					number_of_items = 'auto';
				}
				
				switch(number_of_items){
					case 4:
						item_width_fw = 500;
						break;
					case 5:
						item_width_fw = 350;
						break;
					default:
						item_width_fw = 500;
						break;
				}
				
				var maxItems = ($(this).parents('.grid_section').length == 1) ? 3 : number_of_items;
				var itemWidth = ($(this).parents('.grid_section').length == 1) ? 353 : item_width_fw;
				
				$(this).find('.portfolio_slides').carouFredSel({
					circular: true,
					responsive: true,
					scroll: 1,
					prev : {
						button : function() {
							return $(this).parent().siblings('.caroufredsel-direction-nav').find('#caroufredsel-prev');
						}
					},
					next : {
						button : function() {
							return $(this).parent().siblings('.caroufredsel-direction-nav').find('#caroufredsel-next');
						}
					},
					items: {
						width: itemWidth,
						visible: {
							min: 1,
							max: maxItems
						}
					},
					auto: autoplay,
					mousewheel: false,
					swipe: {
						onMouse: true,
						onTouch: true
					}
				}).animate({'opacity': 1},1000);
			});
			
			calculateHeights();
			
			$('.portfolio_slider .flex-direction-nav a').on('click', function(e){
				e.preventDefault();
				e.stopImmediatePropagation();
				e.stopPropagation();
			});
		}
	}
	
	function calculateHeights(){
		if($('.portfolio_slides').length){
			var maxHeight = 0;

			$('.portfolio_slides').each(function(){
				var items = $(this).find('li.item');

				if( items.length ) {
					items.each(function() {
						var currentHeight = $(this).outerHeight();

						if( currentHeight > maxHeight ) {
							maxHeight = currentHeight;
						}
					})
				}

				$(this).parents('.caroufredsel_wrapper').css({'height' : (maxHeight - 3) + 'px'}); //3 is because of the white line bellow the slider
			});
		}
	}
	
	function qodeInitElementorPortfolioSlider(){
		$(window).on('elementor/frontend/init', function () {
			elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_portfolio_slider.default', function() {
				qode.modules.portfolioSlider.initPortfolioSlider();
			} );
		});
	}
	
})(jQuery);