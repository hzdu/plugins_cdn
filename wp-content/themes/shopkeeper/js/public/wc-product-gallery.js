jQuery( function($) {

	"use strict";

	var classes = $(".custom-layout .mobile_gallery .woocommerce-product-gallery").attr("class");
	var ol_classes = $(".custom-layout .mobile_gallery .flex-control-thumbs").attr("class");

	$(window).on('resize', function() {
		if ($(window).width() <= 1024) {
			$(".custom-layout .mobile_gallery > div").addClass(classes);
			$(".custom-layout .mobile_gallery ol").addClass(ol_classes);
		} else {
			$(".custom-layout .mobile_gallery .woocommerce-product-gallery").removeClass(classes);
			$(".custom-layout .mobile_gallery .flex-control-thumbs").removeClass(ol_classes);
		}
	});

	$(window).on( 'load', function() {
		if ($(window).width() >= 1025) {
			$(".custom-layout .mobile_gallery .woocommerce-product-gallery").removeClass(classes);
			$(".custom-layout .mobile_gallery .flex-control-thumbs").removeClass(ol_classes);
		}
	});

	// Fresco Lightbox
	if ( getbowtied_scripts_vars.product_lightbox == 1 ) {

		// Add fresco to default gallery
		$( ".product_layout_classic .woocommerce-product-gallery__wrapper .woocommerce-product-gallery__image" ).each(function() {

			$(this).attr('id', 'product-gallery');
		  	$(this).find('a').addClass('fresco');
			$(this).find('.fresco').attr('data-fresco-group', $(this).attr('id'));
			$(this).find('.fresco').attr('data-fresco-group-options', "overflow: true, thumbnails: 'vertical', onClick: 'close'");
			$(this).find('.fresco img').addClass('fresco-img');

			if( ! $(this).find('.fresco').hasClass('video') ) {
				if ( $(this).find('.fresco img').attr('data-caption').length > 0 ) {
					$(this).find('.fresco').attr('data-fresco-caption', $(this).find('.fresco img').attr('data-caption'));
				}
			}
		});

		// Add fresco to mobile gallery
		$( ".woocommerce-product-gallery__wrapper.mobile-gallery .woocommerce-product-gallery__image" ).each(function() {

			$(this).attr('id', 'product-mobile-gallery');
		  	$(this).find('a').addClass('fresco');
			$(this).find('.fresco').attr('data-fresco-group', $(this).attr('id'));
			$(this).find('.fresco').attr('data-fresco-group-options', "overflow: true, thumbnails: 'horizontal', onClick: 'close'");
			$(this).find('.fresco img').addClass('fresco-img');

			$(this).find('.fresco').each( function() {
				if( $(this).find('img').length > 0 ) {
					$(this).attr('data-fresco-options', "thumbnail: '" + $(this).find('img').attr('src') + "'");
				}
			});

			if ( getbowtied_scripts_vars.product_gallery_zoom ) {
				$(this).find('.fresco').addClass('zoom');
			}

			if( ! $(this).find('.fresco').hasClass('video') ) {
				if ( $(this).find('.fresco img').attr('data-caption').length > 0 ) {
					$(this).find('.fresco').attr('data-fresco-caption', $(this).find('.fresco img').attr('data-caption'));
				}
			}
		});

		// Trigger fresco lightbox
		$('.product_layout_classic, .custom-layout').on('click', '.fresco-img, .zoomImg', function(){
			if ($(window).width() >= 1025) {
				$(this).siblings('.fresco').trigger('click');
			}
		});

		$('.custom-layout .easyzoom').on('click', '.easyzoom-flyout', function(){
			if ($(window).width() >= 1025) {
				$(this).siblings('.fresco.zoom').trigger('click');
			}
		});
		
	}

	// Default Gallery - Scroll thumbnails
	$(document).on('click touchend', '.product_layout_classic ol.flex-control-thumbs li img', function() {
		if ($(window).width() >= 1025) {

			var product_thumbnails 				= $('ol.flex-control-thumbs');
			var product_thumbnails_cells 		= product_thumbnails.find('li');
			var product_thumbnails_height 		= product_thumbnails.height();
			var product_thumbnails_cells_height	= product_thumbnails_cells.length ? product_thumbnails_cells.outerHeight() : 0;
			var product_images					= $('.woocommerce-product-gallery__wrapper');
			var index 							= $('.woocommerce-product-gallery__wrapper .woocommerce-product-gallery__image.flex-active-slide').index();

			var scrollY = (index * product_thumbnails_cells_height) - ( (product_thumbnails_height - product_thumbnails_cells_height) / 2) - 10;

			product_thumbnails.animate({
				scrollTop: scrollY
			}, 300);
		}
	});
});
