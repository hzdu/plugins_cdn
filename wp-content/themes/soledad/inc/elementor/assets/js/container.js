(function ($, elementor) {
	"use strict";

	var PenciCarouselContainer = function ($scope, $) {
		if (!$scope.data("penci-carousel")) {
			return;
		}

        const owl_slider_name = {}
		$scope.find(".e-con-inner").addClass("swiper-wrapper");
		$scope.find(".e-child").addClass("swiper-slide");

		var $auto = true,
			$dots = false,
			$nav = true,
			$loop = true,
			$rtl = false,
			$items_desktop = 1,
			$items_tablet = 1,
			$items_tabsmall = 1,
			$items_mobile = 1,
			$speed = 600,
			$item = 1,
			$margin = 0,
			$autotime = 5000,
			$height = true,
			$datalazy = false,
			$id =
				"penci-container-swiper-" +
				Math.floor(Math.random() * (1 - 999999) + 1) +
				1;

		if ($scope.hasClass("penci-owl-loaded")) {
			return;
		}

		if ($scope.hasClass("penci-featured-loaded")) {
			return;
		}

		if ($scope.attr("data-slider-id")) {
			$id = $scope.attr("data-slider-id");
		}

		if ($scope.attr("data-ceffect")) {
			$carousel_effect = $scope.attr("data-ceffect");
		}

		if ($scope.attr("data-seffect")) {
			$slide_effect = $scope.attr("data-seffect");
		}

		$scope.addClass($id);

		if ($scope.attr("data-nav") !== "false") {
			$scope.append(
				'<div class="penci-owl-nav"><div class="owl-prev"><i class="penciicon-left-chevron"></i></div><div class="owl-next"><i class="penciicon-right-chevron"></i></div></div>'
			);
		}

		if ($("html").attr("dir") === "rtl") {
			$rtl = true;
		}
		if ($scope.attr("data-dots") === "true") {
			$dots = true;
			if (!$scope.find(".penci-owl-dots").length) {
				$scope.append('<div class="penci-owl-dots"></div>');
			}
		}
		if ($scope.attr("data-loop") === "false") {
			$loop = false;
		}
		if ($scope.attr("data-nav") === "false") {
			$nav = false;
		}
		if ($scope.attr("data-auto") === "false") {
			$auto = false;
		}

		if ($scope.attr("data-margin")) {
			$margin = parseInt($scope.data("margin"));
		}
		if ($scope.attr("data-desktop")) {
			$items_desktop = parseInt($scope.data("desktop"));
		}
		if ($scope.attr("data-tablet")) {
			$items_tablet = parseInt($scope.data("tablet"));
		}
		if ($scope.attr("data-tabsmall")) {
			$items_tabsmall = parseInt($scope.data("tabsmall"));
		}
		if ($scope.attr("data-mobile")) {
			$items_mobile = parseInt($scope.data("mobile"));
		}
		if ($scope.attr("data-speed")) {
			$speed = parseInt($scope.data("speed"));
		}
		if ($scope.attr("data-autotime")) {
			$autotime = parseInt($scope.data("autotime"));
		}
		if ($scope.attr("data-item")) {
			$item = parseInt($scope.data("item"));
		}
		if ($scope.attr("data-lazy")) {
			$datalazy = true;
		}
		if ($scope.attr("data-height")) {
			$height = $scope.attr("data-height");
		}

		var swiper_arg = {
			loop: $loop,
			spaceBetween: $margin,
			slidesPerView: $item,
			speed: $speed,
			autoplay: $auto,
			pauseOnMouseEnter: true,
			autoHeight: $height,
			slideActiveClass: "active",
			watchSlidesProgress: true,
			lazyLoading: $datalazy,
			navigation: {
				nextEl: "." + $id + " .owl-next",
				prevEl: "." + $id + " .owl-prev",
			},
			breakpoints: {
				320: {
					slidesPerView: $items_mobile,
				},
				768: {
					slidesPerView: $items_tablet,
				},
				1170: {
					slidesPerView: $items_desktop,
				},
			},
			on: {
				init: function () {
					$scope.addClass("penci-owl-loaded");
				},
				afterInit: function () {
					$scope.addClass("penci-featured-loaded");
				}
			},
		}

		if ($dots) {
			swiper_arg["pagination"] = {
				el: "." + $id + " .penci-owl-dots",
				type: "bullets",
				bulletElement: "div",
				clickable: true,
				bulletClass: "penci-owl-dot",
				bulletActiveClass: "active",
				renderBullet: function (index, className) {
					return '<div class="' + className + '"><span></span></div>';
				},
			};
		}

		if ($scope.attr("data-thumb")) {
			swiper_arg["slideToClickedSlide"] = true;
		}

		if ($auto) {
			swiper_arg["autoplay"] = {
				delay: $autotime,
				disableOnInteraction: false,
				pauseOnMouseEnter: true,
			};
		}

		owl_slider_name[$id] = new Swiper("." + $id, swiper_arg);
	};

	jQuery(window).on("elementor/frontend/init", function () {
		elementorFrontend.hooks.addAction(
			"frontend/element_ready/container",
			PenciCarouselContainer
		);
	});
})(jQuery, window.elementorFrontend);
