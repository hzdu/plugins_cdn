jQuery(function($) {

	"use strict";

	$('.shortcode_getbowtied_slider').each(function() {

		var autoplay = $(this).attr('data-autoplay');
		if ($.isNumeric(autoplay)) {
			autoplay = autoplay * 1000;
		} else {
			autoplay = 10000;
		}

		var data_id = $(this).attr('data-id');

		var mySwiper = new Swiper( '.swiper-' + data_id, {

			// Optional parameters
		    direction: 'horizontal',
		    loop: true,
		    grabCursor: true,
			preventClicks: true,
			preventClicksPropagation: true,
			autoplay: {
			    delay: autoplay,
		  	},
			speed: 600,
			effect: 'slide',
			parallax: true,
		    // Pagination
		    pagination: {
			    el: '.swiper-' + data_id + ' .shortcode-slider-pagination',
			    type: 'bullets',
			    clickable: true
			},
		    // Navigation
		    navigation: {
			    nextEl: '.swiper-' + data_id + ' .swiper-button-next',
			    prevEl: '.swiper-' + data_id + ' .swiper-button-prev',
			},
		});

	});
});
