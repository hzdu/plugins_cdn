(function ($) {
	'use strict';
	
	var verticalPortfolioSlider = {};
	qode.modules.verticalPortfolioSlider = verticalPortfolioSlider;
	
	verticalPortfolioSlider.qodeVerticalPortfolioSlider = qodeVerticalPortfolioSlider;
	verticalPortfolioSlider.qodeInitElementorVerticalPortfolioSlider = qodeInitElementorVerticalPortfolioSlider;
	
	verticalPortfolioSlider.qodeOnDocumentReady = qodeOnDocumentReady;
	verticalPortfolioSlider.qodeOnWindowLoad = qodeOnWindowLoad;
	
	$(document).ready(qodeOnDocumentReady);
	$(window).on('load', qodeOnWindowLoad);
	
	function qodeOnDocumentReady() {
		qodeVerticalPortfolioSlider();
	}
	
	function qodeOnWindowLoad() {
		qodeInitElementorVerticalPortfolioSlider();
	}
	
	function qodeVerticalPortfolioSlider() {
		var holder = $('.qode-vertical-portfolio-slider');
		
		if (holder.length) {
			holder.each(function () {
				var sliderOptions = typeof $(this).data('options') !== 'undefined' ? $(this).data('options') : {},
					autoplay = sliderOptions.autoplay !== undefined && sliderOptions.autoplay !== '' ? sliderOptions.autoplay : true,
					mousewheel = sliderOptions.mousewheel !== undefined && sliderOptions.mousewheel !== '' ? sliderOptions.mousewheel : false,
					speed = sliderOptions.speed !== undefined && sliderOptions.speed !== '' ? parseInt(sliderOptions.speed, 10) : 5000,
					speedAnimation = sliderOptions.speedAnimation !== undefined && sliderOptions.speedAnimation !== '' ? parseInt(sliderOptions.speedAnimation, 10) : 800,
					loop = sliderOptions.loop !== undefined && sliderOptions.loop !== '' ? sliderOptions.loop : true;

				if (autoplay === true) {
					autoplay = {
						delay: speed,
						disableOnInteraction: false
					};
				}
				
				var mySwiper = new Swiper (holder, {
					direction: 'vertical',
					slideEffect: 'fade',
					mousewheelControl: true,
					slidesPerView: '1',
					sliderScroll: true,
					speed: speedAnimation,
					loop: loop,
					autoplay: autoplay,
					pagination: {
						el: '.swiper-pagination',
						clickable: true,
						renderBullet: function (index, className) {
							return '<span class="' + className + '">' + (index + 1) + '</span>';
						},
					},
				})

				if( mousewheel ) {
					var scrollStart = false;
					holder.on('wheel', function (e) {
						e.preventDefault();
						if (!scrollStart) {
							scrollStart = true;
							var delta = e.originalEvent.deltaY;

							if (delta > 0) {
								holder[0].swiper.slideNext();
							} else {
								holder[0].swiper.slidePrev();
							}

							setTimeout(function () {
								scrollStart = false;
							}, 2000);
						}
					});
				}
			})
		}
	}
	
	function qodeInitElementorVerticalPortfolioSlider(){
		$(window).on('elementor/frontend/init', function () {
			elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_vertical_portfolio_slider.default', function() {
				qodeVerticalPortfolioSlider();
			} );
		});
	}

})(jQuery);