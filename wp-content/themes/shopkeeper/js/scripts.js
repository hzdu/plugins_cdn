jQuery( function ($) {

	"use strict";

	// Global throttle.
	window.gb_throttle = function(func, wait, immediate) {
		var timeout;
		return function() {
			var context = this, args = arguments;
			var later   = function() {
				timeout = null;
				if ( ! immediate) {
					func.apply( context, args );
				}
			};
			var callNow = immediate && ! timeout;
			if ( ! timeout ) {
				timeout = setTimeout( later, wait );
			}
			if (callNow) {
				func.apply( context, args );
			}
		};
	};

	// RTL fix for wpbakery full width elements position
	$(window).on( 'resize', function() {
		if ($('body').hasClass("rtl")) {
			var $elements = $('[data-vc-full-width="true"]');
			$.each($elements, function () {
				var $el = jQuery(this);
				var $el_right = parseInt($el.css('right'));
				$el.css('right', -$el_right);
			});
		}
	});

	//mobile menu

	$(".mobile-navigation .menu-item-has-children .sub-menu").has('ul').addClass("has_children");

	$(".mobile-navigation .menu-item-has-children .sub-menu").before('<div class="more"><span class="spk-icon-down-small"></span></div>');

	$(".mobile-navigation").on("click", ".more", function(e) {
		e.stopPropagation();

		var submenus = $(this).parent().find(".sub-menu");
		$.each(submenus, function(x,y){
			$(y).find(".sub-menu").addClass("open");
			$(y).find(".more").remove();
		});

		$(this).parent().toggleClass("current")
						.children(".sub-menu").toggleClass("open");

		$(this).parent().find('.more').html($(this).parent().find('.more').html() == '<span class="spk-icon-down-small"></span>' ? '<span class="spk-icon-up-small"></span>' : '<span class="spk-icon-down-small"></span>');
	});

	$(".mobile-navigation").on("click", "a", function(e) {
		if($(this).attr('href') == '#' && $(this).parent('.menu-item').hasClass('menu-item-has-children')) {
			$(this).parent().find('.more').trigger('click');
		} else if($(this).attr('href').indexOf('#') > -1) {
			$('#offCanvasRight1').foundation('close');
		}
	});

	function replace_img_source(selector) {
		var data_src = $(selector).attr('data-src');
		$(selector).one('load', function() {
		}).each(function() {
			$(selector).attr('src', data_src);
			$(selector).css("opacity", "1");
		});
	}

	$('#products-grid li img').each(function(){
		replace_img_source(this);
	});

	$('.related.products li img').each(function(){
		replace_img_source(this);
	});

	$('.upsells.products li img').each(function(){
		replace_img_source(this);
	});

	$('.add_to_cart_button').on('click',function(){
		$(this).parents('li.animated').addClass('product_added_to_cart')
	})

	$('.add_to_wishlist').on('click',function(){
		$(this).parents('.yith-wcwl-add-button').addClass('show_overlay');
	})

	// Login/register
	var account_tab_list = $('.account-tab-list');

	account_tab_list.on('click','.account-tab-link',function(){

		if ( $('.account-tab-link').hasClass('registration_disabled') ) {
			return false;
		} else {

			var that = $(this),
				target = that.attr('href');

			that.parent().siblings().find('.account-tab-link').removeClass('current');
			that.addClass('current');

			$('.account-forms').find($(target)).siblings().stop().fadeOut(function(){
				$('.account-forms').find($(target)).fadeIn();
			});

			return false;
		}
	});

	// Login/register mobile
	$('.account-tab-link-register').on('click',function(){
		$('.login-form').stop().fadeOut(function(){
			$('.register-form').fadeIn();
		})
		return false;
	})

	$('.account-tab-link-login').on('click',function(){
		$('.register-form').stop().fadeOut(function(){
			$('.login-form').fadeIn();
		})
		return false;
	})

    // Disable fresco
    function disable_fresco() {

		if ( getbowtied_scripts_vars.product_lightbox != 1 ) {

			$(".product-images-layout .fresco, .product-images-layout-mobile .fresco, .woocommerce-product-gallery__wrapper .fresco").on('click',function() {
				return false;
			});
		}
	}

    disable_fresco();


	//add fresco groups to images galleries
	$(".gallery").each(function() {

		var that = $(this);

		that.find('.gallery-item').each(function(){

			var this_gallery_item = $(this);

			this_gallery_item.find('.fresco').attr('data-fresco-group', that.attr('id'));

			if ( this_gallery_item.find('.gallery-caption').length > 0 ) {
				this_gallery_item.find('.fresco').attr('data-fresco-caption', this_gallery_item.find('.gallery-caption').text());
			}

		});

	});

	function handleSelect() {
		if ( typeof $.fn.selectWoo === 'function' ) {
			$( '.woocommerce-ordering select.orderby' ).selectWoo({
				minimumResultsForSearch: Infinity,
				// allowClear: true,
				// width: 'auto',
				dropdownCssClass: "orderby-dropdown",
				// dropdownAutoWidth: true
			});
		}
		$('.woocommerce-ordering').css({ opacity: 1 });
	}

	handleSelect();


	//gallery caption

	$('.gallery-item').each(function(){

		var that = $(this);

		if ( that.find('.gallery-caption').length > 0 ) {
			that.append('<span class="gallery-caption-trigger">i</span>')
		}

	})

	$('.gallery-caption-trigger').on('mouseenter',function(){
		$(this).siblings('.gallery-caption').addClass('show');
	});

	$('.gallery-caption-trigger').on('mouseleave',function(){
		$(this).siblings('.gallery-caption').removeClass('show');
	});

	$('.trigger-footer-widget').on('click', function(){

		var trigger = $(this).parent();

		trigger.fadeOut('1000',function(){
			trigger.remove();
			$('.site-footer-widget-area').fadeIn();
		});
	});

	//Language Switcher
	$('.topbar-language-switcher').on( 'change', function(){
		window.location = $(this).val();
	});

	$(window).on( 'resize', function(){

        $('.site-search-form-wrapper-inner, .site-search .widget_search .search-form').css('margin-left',-$(window).width()/4);

	});

    $(window).on( 'scroll', function() {

		//single post overlay -  only for large-up
		if ( $(window).width() > 1024 ) {
			$('.single-post-header-overlay').css('opacity', 0.3 + ($(window).scrollTop()) / (($(window).height())*1.4) );
		}

    });

	$('.widget_layered_nav span.count, .widget_product_categories span.count').each(function(){
		var count = $(this).html();
		count = count.substring(1, count.length-1);
		$(this).html(count);
	})

	/******************** average rating widget ****************************/
	$('.widget_rating_filter ul li a').each(function(){
		var count = $(this).contents().filter(function(){
		  return this.nodeType == 3;
		})[0].nodeValue;

		$(this).contents().filter(function(){
		  return this.nodeType == 3;
		})[0].nodeValue = '';

		count = count.slice(2,-1);

		$(this).append('<span class="count">' + count + '</span>');
	})

	/********************** my account tabs by url **************************/
	if ( ('form#register').length > 0 )
	{
		var hash = window.location.hash;
		if (hash)
		{
			$('.account-tab-link').removeClass('current');
			$('a[href="'+hash+'"]').addClass('current');

			hash = hash.substring(1);
			$('.account-forms > form').hide();
			$('form#'+hash).show();
		}
	}

	/* BACK TO TOP */
	if( getbowtied_scripts_vars.back_to_top_button && $('.progress-wrap').length > 0 ) {
		var progressPath = document.querySelector('.progress-wrap path');
		var pathLength = progressPath.getTotalLength();
		progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
		progressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
		progressPath.style.strokeDashoffset = pathLength;
		progressPath.getBoundingClientRect();
		progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';
		var updateProgress = function () {
			var scroll = $(window).scrollTop();
			var height = $(document).height() - $(window).height();
			var progress = pathLength - (scroll * pathLength / height);
			progressPath.style.strokeDashoffset = progress;
		}
		updateProgress();
		$(window).on( 'scroll', updateProgress );
		var offset = 50;
		var duration = 550;
		$(window).on('scroll', function() {
			if ($(this).scrollTop() > offset) {
				$('.progress-wrap').addClass('active-progress');
			} else {
				$('.progress-wrap').removeClass('active-progress');
			}
		});
		$('.progress-wrap').on('click', function(event) {
			event.preventDefault();
			$('html, body').animate({scrollTop: 0}, duration);
			return false;
		});
	}

	// wpbakery
	function bs_fix_vc_full_width_row() {

        var elements = $('[data-vc-full-width="true"]');
        $.each(elements, function () {
            var el = jQuery(this);
            el.css('right', el.css('left')).css('left', '');
        });

    }

	// Fixes rows in RTL
    if( $('body').hasClass("rtl") ) {
        $(document).on('vc-full-width-row', function () {
            bs_fix_vc_full_width_row();
        });
    }

    // Run one time because it was not firing in Mac/Firefox and Windows/Edge some times
    if ($('body').hasClass("rtl")) {
        bs_fix_vc_full_width_row();
    }

	// Checkout expand forms
	$('.woocommerce-checkout').on('click', '.showlogin', function() {
		$('form.woocommerce-form-login').toggleClass('fade');
	});

	/*$('.woocommerce-checkout').on('click', '.showcoupon, .checkout_coupon_inner .button', function() {
		$('form.woocommerce-form-coupon').toggleClass('fade');
	});*/

	$(".vc_images_carousel").each(function() {
		var height = $(this).find(".vc_item.vc_active").height();
		$(this).css("height", height);
	});

	$(".vc_images_carousel").on('click', '.vc_right, .vc_left, .vc_carousel-indicators li', function(){

		var that = $(this);

		setTimeout(function(){
			var height = that.parents(".vc_images_carousel").find(".vc_item.vc_active").height();
			that.parents(".vc_images_carousel").css("height", height);
		}, 600);


	});

	// set focus on search input field in off-canvas
	$(document).on('click touchend', 'header .site-tools .search-button .spk-icon-search', function(){
		setTimeout( function(){
			$(".off-canvas .woocommerce-product-search .search-field").focus();
		}, 800);
	});

	// When Viewport Height is equal with 768, make the minicart image smaller
	var windowHeight 		 = $(window).height();
	var minicart_product_img = $('.shopkeeper-mini-cart .widget.woocommerce.widget_shopping_cart .widget_shopping_cart_content .cart_list.product_list_widget li.mini_cart_item .product-item-bg');

	if ( windowHeight == 768) {
		minicart_product_img.addClass('smaller-vh');
	} else {
		minicart_product_img.removeClass('smaller-vh');
	}

	// If both facebook messenger and get this theme plugins exists, make them look nice
	if ( $('#fbmsg').length ) {

		if ( $('.getbowtied_get_this_theme').length ) {
			$('#fbmsg').addClass('gbt_plugin_installed');
		} else {
			$('#fbmsg').removeClass('gbt_plugin_installed');
		}
	}

	$("body.single-product form.cart").on("change", "input.qty, input.custom-qty", function() {
        $('button.single_add_to_cart_button.ajax_add_to_cart').attr("data-quantity", this.value);
    });

	// overlay for loader on ajax add to cart and wishlist
	$('body').on("click", ".products .ajax_add_to_cart", function() {
		$(this).parents('.column').find('.product_thumbnail').prepend('<div class="overlay"></div>');
	});
	$('body').on('added_to_cart', function(){
		$('.product_thumbnail .overlay').remove();
	});

	//progress add to cart button
	$("button.single_add_to_cart_button.ajax_add_to_cart.progress-btn").on("click", function(e) {
		var progressBtn = $(this);

		if (!progressBtn.hasClass("active")) {
		  progressBtn.addClass("active");
		  setTimeout(function() {
		  	progressBtn.addClass("check");
		  }, 1500);
		  setTimeout(function() {
		  	progressBtn.removeClass("active");
		  	progressBtn.removeClass("check");
		  }, 3500);
		}
	});

	//my account order add class to order header
	$('.woocommerce-MyAccount-content .woocommerce-order-details').siblings('p').addClass('order-info');

	
	//off canvas
	var $offCanvas_close_overlay = $('.js-off-canvas-overlay');
	var $offCanvas_close_triggers = $('.js-off-canvas-overlay, .off-canvas .close-button');
	
	$('[data-toggle]').on("click", function() {
		var $offCanvas = $('#' + $(this).data('toggle')); // Use data-toggle attribute

		$offCanvas.attr('aria-hidden', 'true')
				  .removeClass('is-closed')
				  .addClass('is-open');

		$offCanvas_close_overlay.addClass('is-visible is-closable');
	});

	$offCanvas_close_triggers.on("click", function() {
		var $offCanvas = $('.off-canvas');

		$offCanvas.attr('aria-hidden', 'false')
				  .removeClass('is-open');

		setTimeout(function() {
			$offCanvas.addClass('is-closed');
		}, 600);

		$offCanvas_close_overlay.removeClass('is-visible is-closable');
	});
});
