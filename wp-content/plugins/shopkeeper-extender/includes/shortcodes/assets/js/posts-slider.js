jQuery(function($) {

	"use strict";

	$('.from-the-blog.swiper-container').each(function() {

		var data_id = $(this).attr('data-id');

		var myPostsSwiper = new Swiper( '.swiper-' + data_id, {
			slidesPerView: 1,
			loop: true,
			breakpoints: {
				1024: {
					slidesPerView: 3,
				},
				640: {
					slidesPerView: 2,
				},
				480: {
					slidesPerView: 1,
				},
			},
			pagination: {
			    el: '.swiper-' + data_id + ' .swiper-pagination',
			},
		});
	});

});
