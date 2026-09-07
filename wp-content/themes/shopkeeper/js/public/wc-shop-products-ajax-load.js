jQuery(function($) {

	"use strict";

	var pagination_type 		= getbowtied_scripts_vars.shop_pagination_type;
	var load_more_text 			= getbowtied_scripts_vars.ajax_load_more_locale;
	var load_more_loading_text  = getbowtied_scripts_vars.ajax_loading_locale;
	var no_more_items_text 		= getbowtied_scripts_vars.ajax_no_more_items_locale;

	function reloadYithWishlistButtons() {
		if ( window.wp && window.wp.hooks ) {
			window.wp.hooks.doAction( 'yith_wcwl_init_add_to_wishlist_components' );
		}
	}

	if ( pagination_type == 'load_more_button' || pagination_type == 'infinite_scroll' ) {

		if ( $( '.woocommerce-pagination' ).length && $( 'body' ).hasClass( 'archive' ) ) {

			$( '.woocommerce-pagination' ).before( '<div class="getbowtied_ajax_load_button"><a getbowtied_ajax_load_more_processing="0">' + load_more_text + '</a></div>' );

			if ( pagination_type == 'infinite_scroll' ) {
				$( '.getbowtied_ajax_load_button' ).addClass( 'getbowtied_ajax_load_more_hidden' );
			}

			if ( $('.woocommerce-pagination a.next').length == 0 ) {
				$('.getbowtied_ajax_load_button').addClass( 'getbowtied_ajax_load_more_hidden' );
			}

			$('.woocommerce-pagination').hide();
		}

		$( 'body' ).on( 'click', '.getbowtied_ajax_load_button a', function(e) {

			e.preventDefault();

			if ( $('.woocommerce-pagination a.next').length ) {

				$( '.getbowtied_ajax_load_button a' ).attr( 'getbowtied_ajax_load_more_processing', 1 );
				var href = $( '.woocommerce-pagination a.next' ).attr( 'href' );

				$( '.getbowtied_ajax_load_button' ).fadeOut( 200, function() {
					$( '.woocommerce-pagination' ).before( '<div class="getbowtied_ajax_load_more_loader"><span>' + load_more_loading_text + '</span></div>' );
				});

				$.get(href, function(response) {

					$( '.woocommerce-pagination' ).html( $(response).find( '.woocommerce-pagination' ).html() );

					var i= 0;

					$( response ).find( '.site-content ul.products > li' ).each( function() {

						i++;
						$(this).addClass( "ajax-loaded delay-" + i );
						$('.site-content ul.products > li:last').after($(this));
					});

					$('.getbowtied_ajax_load_more_loader').fadeOut(200, function(){
						$('.getbowtied_ajax_load_button').fadeIn(200);
						$('.getbowtied_ajax_load_button a').attr('getbowtied_ajax_load_more_processing', 0);
					});

					setTimeout(function(){
						$('.getbowtied_ajax_load_more_loader').remove();
					}, 250 );

					$(document).trigger('post-load');
					reloadYithWishlistButtons();

					setTimeout(function(){

						$('.site-content ul.products > li').each( function(){
							//lazy loading tweak
							var image = $(this).find('.product_thumbnail > img.jetpack-lazy-image');
							if( image ) {
								if( image.attr('data-lazy-srcset') ) {
									image.attr('srcset', image.attr('data-lazy-srcset'));
								} else {
									image.attr('srcset', image.attr('src'));
								}
							}
						});

						$('.site-content ul.products > li.hidden').removeClass('hidden').addClass('animate');
					}, 500);

					if ($('.woocommerce-pagination a.next').length == 0) {
						$('.getbowtied_ajax_load_button').addClass('finished').removeClass('getbowtied_ajax_load_more_hidden');
						$('.getbowtied_ajax_load_button a').show().html(no_more_items_text).addClass('disabled');
					}

				});

			} else {

				$('.getbowtied_ajax_load_button').addClass('finished').removeClass('getbowtied_ajax_load_more_hidden');
				$('.getbowtied_ajax_load_button a').show().html(no_more_items_text).addClass('disabled');
			}

		});
	}

	if( pagination_type == 'infinite_scroll' ) {

		var buffer_pixels = Math.abs(0);

		$(window).on( 'scroll', function() {

			if ($('.site-content ul.products:not(.product-categories)').length) {

				var a = $('.site-content ul.products:not(.product-categories)').offset().top + $('.site-content ul.products:not(.product-categories)').outerHeight();
				var b = a - $(window).scrollTop();

				if ((b - buffer_pixels) < $(window).height()) {
					if ($('.getbowtied_ajax_load_button a').attr('getbowtied_ajax_load_more_processing') == 0) {
						$('.getbowtied_ajax_load_button a').trigger('click');
					}
				}

			}

		});
	}

	$('section.related.products').addClass('mobile-columns-' + getbowtied_scripts_vars.mobile_product_columns );
	$('section.upsells.products').addClass('mobile-columns-' + getbowtied_scripts_vars.mobile_product_columns );
});
