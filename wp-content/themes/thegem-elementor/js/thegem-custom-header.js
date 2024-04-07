(function($) {

	$(window).resize(function() {
		window.updateGemClientSize(false);
		window.updateGemInnerSize();
	});

	$.headerBuilder = function() {
		var $header = $('.site-header'),
			$stickyElements = $('.header-sticky-row'),
			$firstSticky = '',
			$window = $(window),
			isSticked = false,
			stickAfter = 100,
			cloneHTML = '',
			previousScroll;

		$stickyElements.each(function() {
			var $this = $(this);

			if ($this[0].offsetHeight > 10) {
				$firstSticky = $this;
				return false;
			}
		});

		// Real header sticky option
		if (1 || !$header.hasClass('header-with-sticky-template')) {
			var $adminBar = $('#wpadminbar');
			var headerHeight = $header.find('.header-wrapper')[0].offsetHeight;
			var adminBarHeight = $adminBar.length > 0 ? $adminBar[0].offsetHeight : 0;

			if (!$header.hasClass('header-with-sticky-template')) {
				if ($firstSticky.length === 0 || $firstSticky[0].offsetHeight < 10) {
					return;
				}

				if(!$header.hasClass('header-transparent')) {
					$header.addClass('header-sticky-prepared').css({
						paddingTop: headerHeight
					});
				}

				stickAfter = $firstSticky.offset().top - adminBarHeight;
			}

			stickAfter = headerHeight + adminBarHeight;

		}

		if ($header.hasClass('header-with-sticky-template')) {
			$header = $header.next('.header-sticky-template');
			//$header.find('.whb-row').removeClass('whb-flex-equal-sides').addClass('whb-flex-flex-middle');
		}

		$window.on('scroll', function() {
			var after = stickAfter;
			var currentScroll = $window.scrollTop();
			var windowHeight = $window.height();
			var documentHeight = $(document).height();


			if (currentScroll > after) {
				stickHeader();
			} else {
				unstickHeader();
			}

			var startAfter = 100;

			if(($header.hasClass('header-hide-on-scroll-desktop') && $window.width() > 991) || ($header.hasClass('header-hide-on-scroll-mobile') && $window.width() < 992)) {
				if (previousScroll - currentScroll > 0 && currentScroll > after) {
					$header.addClass('header-scroll-up');
					$header.removeClass('header-scroll-down');
				} else if (currentScroll - previousScroll > 0 && currentScroll + windowHeight !== documentHeight && currentScroll > (after + startAfter)) {
					$header.addClass('header-scroll-down');
					$header.removeClass('header-scroll-up');
				} else if (currentScroll <= after) {
					$header.removeClass('header-scroll-down');
					$header.removeClass('header-scroll-up');
				} else if (currentScroll + windowHeight >= documentHeight - 5) {
					$header.addClass('header-scroll-up');
					$header.removeClass('header-scroll-down');
				}
			}

			previousScroll = currentScroll;
		});

		function stickHeader() {
			if (isSticked) {
				return;
			}

			if($header.hasClass('header-sticky-template') && !(($header.hasClass('header-sticky-on-desktop') && $window.width() > 991) || ($header.hasClass('header-sticky-on-mobile') && $window.width() < 992))) {
				return;
			}

			isSticked = true;
			$header.addClass('header-sticked');
			if($header.hasClass('header-light')) {
				$header.addClass('header-light-disabled');
				$header.removeClass('header-light');
			}
			menuDropdownRecalc();
		}

		function unstickHeader() {
			if (!isSticked) {
				return;
			}

			isSticked = false;
			$header.removeClass('header-sticked');
			if($header.hasClass('header-light-disabled')) {
				$header.addClass('header-light');
				$header.removeClass('header-light-disabled');
			}
			menuDropdownRecalc();
		}

		function menuDropdownRecalc() {
			if (!$header.hasClass('header-boxed')) {
				return;
			}

			$('.header-offsets-calculated .header-dropdown-menu').attr('style', '');
			$('.header-offsets-calculated').removeClass('header-offsets-calculated');
			//woodmartThemeModule.$window.trigger('wdHeaderBuilderStickyChanged');
		}

		//woodmartThemeModule.$document.trigger('wdHeaderBuilderInited');
	};

	$(document).on('ready', function() {
		$.headerBuilder();
	});
})(jQuery);
