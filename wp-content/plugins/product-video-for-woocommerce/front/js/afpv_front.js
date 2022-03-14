jQuery(document).ready(function($){

	var dot_option_selected = true;
	if ( 'yes' == (afpv_gallery_thumb_setting.afpv_dots_gallery_controller) ) {
		dot_option_selected = true;
	}

	if ( 'yes' != (afpv_gallery_thumb_setting.afpv_dots_gallery_controller) ) {
		dot_option_selected = false;
	}

	var arrows_option_selected = true;
	if ( 'yes' == (afpv_gallery_thumb_setting.afpv_arrows_gallery_controller) ) {
		arrows_option_selected = true;
	}

	if ( 'yes' != (afpv_gallery_thumb_setting.afpv_arrows_gallery_controller) ) {
		arrows_option_selected = false;
	}

	var autoplay_option_selected = true;
	if ( 'yes' == (afpv_gallery_thumb_setting.afpv_autoplay_gallery) ) {
		autoplay_option_selected = true;
	}

	if ( 'yes' != (afpv_gallery_thumb_setting.afpv_autoplay_gallery) ) {
		autoplay_option_selected = false;
	}


	if ( afpv_gallery_thumb_setting.afpv_gallery_pos == 'pv_gallery_thumbnail_left_position' ) {
	
		$('.gl-product-slides').slick({
			slidesToShow: 1,
			slidesToScroll: 1,
			autoplay: false,
			autoplaySpeed: 4000,
			arrows: false,
			dots: false,
			fade:true,
			asNavFor: '.gl-product-slider-left-nav' 
		});

		$('.gl-product-slider-left-nav').slick({
			slidesToShow: afpv_gallery_thumb_setting.afpv_gallery_thumbnail_to_show,
			vertical: true,
			verticalSwiping: true,
			infinite: true,
			slidesToScroll: 2,
			asNavFor: '.gl-product-slides',
			dots: dot_option_selected,
			arrows:arrows_option_selected,
			focusOnSelect: true,
			autoplay:autoplay_option_selected
		});

	} else if ( afpv_gallery_thumb_setting.afpv_gallery_pos == 'pv_gallery_thumbnail_right_position' ) {

		jQuery('.gl-product-slides').slick({
			slidesToShow: 1,
			slidesToScroll: 1,
			autoplay: false,
			autoplaySpeed: 4000,
			arrows: false,
			dots: false,
			fade:true,
			asNavFor: '.gl-product-slider-right-nav' 
		});

		jQuery('.gl-product-slider-right-nav').slick({
			slidesToShow: afpv_gallery_thumb_setting.afpv_gallery_thumbnail_to_show,
			vertical: true,
			verticalSwiping: true,
			infinite: true,
			slidesToScroll: 2,
			asNavFor: '.gl-product-slides',
			dots: dot_option_selected,
			arrows:arrows_option_selected,
			focusOnSelect: true,
			autoplay:autoplay_option_selected
		});

	} else if ( afpv_gallery_thumb_setting.afpv_gallery_pos == 'pv_gallery_thumbnail_top_position' ) {

		jQuery('.gl-product-slides').slick({
			slidesToShow: 1,
			slidesToScroll: 1,
			autoplay: false,
			autoplaySpeed: 4000,
			arrows: false,
			dots: false,
			fade:true,
			asNavFor: '.gl-product-slider-top-nav' 
		});

		jQuery('.gl-product-slider-top-nav').slick({
			slidesToShow: afpv_gallery_thumb_setting.afpv_gallery_thumbnail_to_show,
			infinite: true,
			slidesToScroll: 2,
			asNavFor: '.gl-product-slides',
			dots: dot_option_selected,
			arrows:arrows_option_selected,
			focusOnSelect: true,
			autoplay:autoplay_option_selected
		});
	
	} else {

		jQuery('.gl-product-slides').slick({
			slidesToShow: 1,
			slidesToScroll: 1,
			autoplay: false,
			autoplaySpeed: 4000,
			arrows: false,
			dots: false,
			fade:true,
			asNavFor: '.gl-product-slider-bottom-nav' 
		});

		jQuery('.gl-product-slider-bottom-nav').slick({
			slidesToShow: afpv_gallery_thumb_setting.afpv_gallery_thumbnail_to_show,
			infinite: true,
			slidesToScroll: 2,
			asNavFor: '.gl-product-slides',
			dots: dot_option_selected,
			arrows:arrows_option_selected,
			focusOnSelect: true,
			autoplay:autoplay_option_selected
		});

	}
  

	jQuery('.gl-product-slides').slickLightbox({
		itemSelector        : 'a',
		navigateByKeyboard  : true
	});



	/*========== Feature Video Script ============*/

	// jQuery('#gl-product-video iframe').fadeOut();
	// jQuery('#gl-product-rule-video iframe').fadeOut();
	// jQuery('#gl-product-video video').fadeOut();
	// jQuery('#gl-product-rule-video video').fadeOut();
	jQuery('.video-thumbnail iframe').fadeOut();
	jQuery('.video-thumbnail video').fadeOut();

	$('.afpv-product-video-play-icon img').click(function(event) {
		event.preventDefault();
		$('.afpv-product-video-thumbnail-image').fadeOut();
		$('.afpv-product-video-play-icon img').fadeOut();
		$('.afpv-product-video-play-icon').fadeOut();
		$('#gl-product-video iframe').fadeIn(2500);
		$('#gl-product-video video').fadeIn(2500);
	});

	$('.afpv-rule-video-play-icon img').click(function(event) {
		event.preventDefault();
		$('.afpv-rule-video-thumbnail-image').fadeOut();
		$('.afpv-rule-video-play-icon img').fadeOut();
		$('.afpv-rule-video-play-icon').fadeOut();
		$('#gl-product-rule-video iframe').fadeIn(2500);
		$('#gl-product-rule-video video').fadeIn(2500);
	});

	/*=========== Zoom Script =============*/

	jQuery('#gl-proucts .gl-product-thumbnail-zoom').zoom();



});


