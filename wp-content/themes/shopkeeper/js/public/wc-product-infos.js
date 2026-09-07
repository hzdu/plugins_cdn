jQuery( function($) {

	'use strict';

	// Stops Products_infos at Footer

	setTimeout(function(){
		if($(".single-product .product .product_infos .cart .StripeElement").children().length > 0) {
			$(".single-product .product .product_infos .cart").addClass("stripe-button");
		}
	},1000);

	function product_infos_adjust() {
		// if product description is too long
		var productInfosHeight 			= $('.product .product_content_wrapper .product_infos').length ? $('.product .product_content_wrapper .product_infos').outerHeight() : 0;
		var productInfosPos	   			= $('.product .product_content_wrapper .product_infos').position().top;
		var productInfosWidth  			= $('.product .product_content_wrapper .product_infos').length ? $('.product .product_content_wrapper .product_infos').outerWidth() : 0;
		var productContentWrapperOff 	= $('.product_content_wrapper').offset().top;

		if (  (productInfosHeight >  $(window).innerHeight() - productContentWrapperOff) && ($(window).width() >= 1024) ) {
			$('.product_infos').addClass('long-description'); // product description is longer than actual viewport
		} else {
			$('.product_infos').css({ top: productContentWrapperOff });
		}
	}

	if ( ($('.product_layout_cascade').length > 0) || ($('.product_layout_scattered').length > 0) ) {

		product_infos_adjust();

		// if product_infos is at at footer, stop it.
		$(window).on( 'scroll', function() {

		    var windowTop = $(window).scrollTop();
		    var footerTop = $("#site-footer").length ? $("#site-footer").offset().top : 0;
		    var productInfosOff = $('.product_infos.fixed').offset().top;
		    var productInfosH = $(".product_infos.fixed").length ? $(".product_infos.fixed").height() : 0;
		    var padding = 40;  // let a distance between the product_infos and the footer
			var productContentWrapperOff = $('.product_content_wrapper').length ? $('.product_content_wrapper').offset().top : 0;

		    if (windowTop + productInfosH + 200 > footerTop - padding ) {

		        $('.product_infos.fixed:not(.long-description)').css({
		        	top: (windowTop + productInfosH - footerTop + padding) * -1
		        });

		    } else {
		    	$('.product_infos.fixed:not(.long-description)').css({
		        	top :  productContentWrapperOff
		        });
		    }

		});

		$(window).on( 'orientationchange', function() {
			product_infos_adjust();
		});
	}

});
