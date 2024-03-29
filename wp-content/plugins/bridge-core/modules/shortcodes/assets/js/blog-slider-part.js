(function($) {
	'use strict';
	
	var blogSlider = {};
	
	qode.modules.blogSlider = blogSlider;
	
	blogSlider.initBlogSlider = initBlogSlider;
	blogSlider.qodeInitElementorBlogSlider = qodeInitElementorBlogSlider;
	
	blogSlider.qodeOnDocumentReady = qodeOnDocumentReady;
	blogSlider.qodeOnWindowLoad = qodeOnWindowLoad;
	
	$(document).ready(qodeOnDocumentReady);
	$(window).on('load', qodeOnWindowLoad);
	
	function qodeOnDocumentReady() {
		initBlogSlider();
	}
	
	function qodeOnWindowLoad() {
		qodeInitElementorBlogSlider();
	}
	
	function initBlogSlider(){
		"use strict";
		
		if($('.blog_slider').length){
			
			$('.blog_slider').each(function(){
				var $this = $(this);
				var blogs_shown;
				var maxItems;
				var itemWidth;
				var autoPlay = false;
				if(typeof $this.data('blogs_shown') !== 'undefined') {
					blogs_shown = $this.data('blogs_shown');
				}
				else if($this.hasClass('simple_slider')){
					blogs_shown = 1;
				}
				else{
					blogs_shown = 'auto';
				}
				
				autoPlay = $this.data('auto_start');
				
				if ($this.hasClass('simple_slider')) {
					maxItems = 1;
					itemWidth = 300;
				}
				else {
					maxItems = ($this.parents('.grid_section').length == 1) ? 3 : blogs_shown;
					var itemWidthTemp;
					
					switch (blogs_shown) {
						case 3:
							itemWidthTemp = 667;
							break;
						case 4:
							itemWidthTemp = 500;
							break;
						case 5:
							itemWidthTemp = 400;
							break;
						case 6:
							itemWidthTemp = 334;
							break;
						default:
							itemWidthTemp = 500;
							
							break;
					}
					
					itemWidth = ($this.parents('.grid_section').length == 1) ? 353 : itemWidthTemp;
				}
				
				$this.find('.blog_slides').carouFredSel({
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
					auto: autoPlay,
					mousewheel: false,
					swipe: {
						onMouse: true,
						onTouch: true
					}
				}).animate({'opacity': 1},1000);
			});
			
			calculateHeights();
			
			$('.blog_slider .flex-direction-nav a').on('click', function(e){
				e.preventDefault();
				e.stopImmediatePropagation();
				e.stopPropagation();
			});
		}
	}
	
	function calculateHeights(){
		if($('.blog_slides').length){
			var maxHeight = 0;
			
			$('.blog_slides').each(function(){
				var items = $(this).find('li.item');
				
				if( items.length ) {
					items.each(function() {
						var currentHeight = $(this).outerHeight();
						
						if( currentHeight > maxHeight ) {
							maxHeight = currentHeight;
						}
					})
				}
			
				$(this).parents('.caroufredsel_wrapper').css({'height' : (maxHeight - 3) + 'px'});
			});
		}
	}
	
	function qodeInitElementorBlogSlider(){
		$(window).on('elementor/frontend/init', function () {
			elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_blog_slider.default', function() {
				initBlogSlider();
			} );
		});
	}
	
})(jQuery);