jQuery( function ($) {

	"use strict";

	// sticky header
	if( getbowtied_scripts_vars.sticky_header ) {

		var headerHeight = $('.top-headers-wrapper').length ? $('.top-headers-wrapper').outerHeight() : 0;
		
		var totalHeaderHeight = $('.site-header').length ? $('.site-header').outerHeight() : 0;
		
		if( $('#site-top-bar').length ) {
			totalHeaderHeight += $('#site-top-bar').outerHeight();
		}

		$(window).on( 'scroll', function() {
			if (getbowtied_scripts_vars.mobile_sticky_header) {
				var that = $('.site-header-sticky');

				if ( $(this).scrollTop() > totalHeaderHeight ) {
					$('.st-content').css( 'padding-top', headerHeight-1 ); // -1 fix top-headers-wrapper border-top / margin-top
					that.addClass('sticky');
				} else {
					that.removeClass('sticky');
					$('.st-content').css( 'padding-top', '' );
				}
			}
		});
	}

	// menu dropdown apply scrollbar when longer than the screen
	if( $('.site-header .main-navigation').length && $('.site-header .main-navigation > ul > li > .sub-menu').length ) {
		var menu_height = $(window).height() - $('.site-header .main-navigation > ul > li > .sub-menu').offset().top;
		$('.site-header .main-navigation > ul > li > .sub-menu').each( function () {
			if( $(this).outerHeight() > menu_height ) {
				$(this).css( {'max-height': menu_height - 100, 'overflow-y': 'auto' });
			}
		});
	}

	// adjust dropdowns' position to avoid offscreen display
	function adjust_dropdown_position() {
		if( $(window).width() >= 1024 ) {
		    $('.top-headers-wrapper .main-navigation > ul li.menu-item-has-children').each( function() {

				var submenuWidth = $(this).find('> .sub-menu').outerWidth();

				var submenuOffset = $(this).find('> .sub-menu').offset().left;
				var totalSubMenuWidth = submenuWidth + submenuOffset;
		        if ( ( totalSubMenuWidth - $(window).width() ) > 0 ) {
					if( $(this).hasClass('mega-menu') ) {
						var position = totalSubMenuWidth - $(window).width();
						$(this).find('> .sub-menu').css( 'left', '-' + position + 'px' );
					} else {
						$(this).find('> .sub-menu').addClass('reverse');
					}
				}
		    });
		} else {
			$('.top-headers-wrapper .main-navigation > ul li.menu-item-has-children').each( function() {
				$(this).children('ul').removeClass('reverse');
				if( $(this).hasClass('mega-menu') ) {
					$(this).children('ul').css( 'left', 0 );
				}
			});
		}
	}

	adjust_dropdown_position();
	var resizeTimer;
	$(window).on( 'resize', function() {
		clearTimeout(resizeTimer);
		$('.top-headers-wrapper .main-navigation > ul li.menu-item-has-children.mega-menu > .sub-menu').css( 'left', 0 );
  		resizeTimer = setTimeout(function() {
			adjust_dropdown_position();
		}, 250);
	});

	// close search offcanvas
	$(document).on('click', '.site-search .close-button', function(){
		$(document).find('#offCanvasTop1').removeAttr("style");
	});

	// dropdown levels
	$('.main-navigation > ul > li').on({
		mouseenter: function() {
			$(this).addClass('active');
		},
		mouseleave: function() {
			$(this).removeClass('active');
		}
	});

	$('.main-navigation > ul > li ul li').on({
		mouseenter: function() {
			clearTimeout($(this).data('timeoutId'));
			$(this).addClass('active');
		},
		mouseleave: function() {
			var that = $(this);
			var timeoutId = setTimeout( function() {
				that.removeClass('active');
			}, 200);
			that.data('timeoutId', timeoutId);
		}
	});

});
