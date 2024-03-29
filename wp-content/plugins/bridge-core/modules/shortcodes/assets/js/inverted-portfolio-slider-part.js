(function ($) {
	'use strict';
	
	var invertedPortfolioSlider = {};
	qode.modules.invertedPortfolioSlider = invertedPortfolioSlider;

	invertedPortfolioSlider.qodeInvertedPortfolioSlider = qodeInvertedPortfolioSlider;
	invertedPortfolioSlider.qodeInitElementorInvertedPortfolioSlider = qodeInitElementorInvertedPortfolioSlider;
	
	invertedPortfolioSlider.qodeOnDocumentReady = qodeOnDocumentReady;
	invertedPortfolioSlider.qodeOnWindowLoad = qodeOnWindowLoad;
	
	$(document).ready(qodeOnDocumentReady);
	$(window).on('load', qodeOnWindowLoad);
	
	function qodeOnDocumentReady() {
		qodeInvertedPortfolioSlider();
	}
	
	function qodeOnWindowLoad() {
		qodeInitElementorInvertedPortfolioSlider();
	}
	
	function qodeInvertedPortfolioSlider() {
		
		var holder = $('.qode-inverted-portfolio-slider');
		
		if (holder.length) {
			
			holder.each(function () {
				var sliderOptions = typeof $(this).data('options') !== 'undefined' ? $(this).data('options') : {},
					autoplay = sliderOptions.autoplay !== undefined && sliderOptions.autoplay !== '' ? sliderOptions.autoplay : true,
					mousewheel = sliderOptions.mousewheel !== undefined && sliderOptions.mousewheel !== '' ? sliderOptions.mousewheel : false,
					speed = sliderOptions.speed !== undefined && sliderOptions.speed !== '' ? parseInt(sliderOptions.speed, 10) : 5000,
					speedAnimation = sliderOptions.speedAnimation !== undefined && sliderOptions.speedAnimation !== '' ? parseInt(sliderOptions.speedAnimation, 10) : 800,
					loop = sliderOptions.loop !== undefined && sliderOptions.loop !== '' ? sliderOptions.loop : true,
					drag = sliderOptions.enableDrag !== undefined && sliderOptions.enableDrag !== '' && sliderOptions.enableDrag == 'yes' ? 1 : 0,
					slidesPerView =  sliderOptions.slidesPerView !== undefined && sliderOptions.slidesPerView !== '' ? sliderOptions.slidesPerView : 'auto',
					grabCursor = drag == '0' ? false : true;
				
				if (autoplay === true) {
					autoplay = {
						delay: speed,
						disableOnInteraction: false
					};
				}
				
				var mySwiper = new Swiper ('.swiper-container', {
					slideEffect: 'fade',
					loop: loop,
					slidesPerView: slidesPerView,
					centeredSlides: false,
					autoplay: autoplay,
					spaceBetween: 0,
					mousewheel: mousewheel,
					speed: speedAnimation,
					touchRatio: drag,
					grabCursor: grabCursor,
					navigation: {
						nextEl: '.qode-ips-button-next',
						prevEl: '.qode-ips-button-prev',
					},
				})
			})
		}
	}
	
	function qodeInitElementorInvertedPortfolioSlider() {
		$(window).on('elementor/frontend/init', function () {
			elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_inverted_portfolio_slider.default', function() {
				qodeInvertedPortfolioSlider();
			} );
		});
	}

})(jQuery);