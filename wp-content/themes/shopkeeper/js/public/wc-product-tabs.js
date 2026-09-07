jQuery( function($){

	"use strict";

    //woocommerce tabs
	$('.woocommerce-tabs .row + .panel').addClass('current');
	$('.woocommerce-tabs ul.tabs li a').off('click').on('click', function(){
		var that = $(this);
		var currentPanel = that.attr('href');

		that.parent().siblings().removeClass('active')
					.end()
					.addClass('active');

        if( $('.woocommerce-tabs').find(currentPanel).siblings('.panel').filter(':visible').length > 0 ) {
            $('.woocommerce-tabs').find(currentPanel).siblings('.panel').filter(':visible').fadeOut(500,function(){
    			$('.woocommerce-tabs').find(currentPanel).siblings('.panel').removeClass('current');
    			$('.woocommerce-tabs').find(currentPanel).addClass('current').fadeIn(500);
    		});
        } else {
            $('.woocommerce-tabs').find(currentPanel).siblings('.panel').removeClass('current');
            $('.woocommerce-tabs').find(currentPanel).addClass('current').fadeIn(500);
        }

		return false;
	});

    //scroll on reviews tab
	$('.woocommerce-review-link').off('click').on('click',function(){

		$('.tabs li a').each(function(){
			if ($(this).attr('href')=='#tab-reviews') {
				$(this).trigger('click');
			}
		});

		var elem_on_screen_height = 0;

		if ( $('body').hasClass('admin-bar') ) {
			elem_on_screen_height += 32;
		}

		var tab_reviews_topPos = $('.woocommerce-tabs').offset().top - elem_on_screen_height;

		$('html, body').animate({
            scrollTop: tab_reviews_topPos
        }, 1000);

		return false;
	});

});
