(function ($) {
	"use strict";

	var PENCI = PENCI || {};

	PENCI.loadMorePostAjx = function () {
		var $body = $("body"),
			layout = PCAJXNAV.layout;

		$(document).pjax(".penci-pagination a", {
			timeout: 10000,
			container: ".penci-main-sticky-sidebar",
			fragment: ".penci-main-sticky-sidebar",
			replace: true,
		});

		$( document ).on( 'pjax:send', function ( xhr, options ) {
			var mainClass = $( xhr.relatedTarget ), 
				bodyClass = $( mainClass ).closest( 'body' )

			if ( $( 'body' ).hasClass('woocommerce') ) {
				return;
			}

			$( 'body' ).addClass( 'loading-posts' );
			window.scrollTo({top: 0, behavior: 'smooth'});
			
		} )

		$(document).on("pjax:complete", function () {
			if (layout === "masonry" || layout === "masonry-2") {
				$('.penci-wrapper-data').imagesLoaded(function () {
					$('.penci-wrapper-data').isotope({
						itemSelector: '.item-masonry',
						transitionDuration: '.55s',
						layoutMode: 'masonry',
					});
				});

				if ($().fitVids) {
					$(".container").fitVids();
				}
				if ($().easyPieChart) {
					$(".penci-piechart").each(function () {
						var $this = $(this);
						$this.one(
							"inview",
							function (
								event,
								isInView,
								visiblePartX,
								visiblePartY
							) {
								var chart_args = {
									barColor: $this.data("color"),
									trackColor: $this.data("trackcolor"),
									scaleColor: false,
									lineWidth: $this.data("thickness"),
									size: $this.data("size"),
									animate: 1000,
								};
								$this.easyPieChart(chart_args);
							}
						); // bind inview
					}); // each
				}
			} else {
				if ($().fitVids) {
					$(".container").fitVids();
				}

				$("body").trigger("penci_swiper_sliders");

				if ($().easyPieChart) {
					$(".penci-piechart").each(function () {
						var $this = $(this);
						$this.one(
							"inview",
							function (
								event,
								isInView,
								visiblePartX,
								visiblePartY
							) {
								var chart_args = {
									barColor: $this.data("color"),
									trackColor: $this.data("trackcolor"),
									scaleColor: false,
									lineWidth: $this.data("thickness"),
									size: $this.data("size"),
									animate: 1000,
								};
								$this.easyPieChart(chart_args);
							}
						); // bind inview
					}); // each
				}

				var $justified_gallery = $(
					".penci-post-gallery-container.justified"
				);
				var $masonry_gallery = $(
					".penci-post-gallery-container.masonry"
				);
				if ($().justifiedGallery && $justified_gallery.length) {
					$(".penci-post-gallery-container.justified").each(
						function () {
							var $this = $(this);
							$this.justifiedGallery({
								rowHeight: $this.data("height"),
								lastRow: "nojustify",
								margins: $this.data("margin"),
								randomize: false,
							});
						}
					); // each .penci-post-gallery-container
				}

				if ($().isotope && $masonry_gallery.length) {
					$(
						".penci-post-gallery-container.masonry .item-gallery-masonry"
					).each(function () {
						var $this = $(this);
						if ($this.attr("title")) {
							var $title = $this.attr("title");
							$this
								.children()
								.append(
									'<div class="caption">' + $title + "</div>"
								);
						}
					});
				}

				if ($masonry_gallery.length) {
					$masonry_gallery.each(function () {
						var $this = $(this);
						$this.imagesLoaded(function () {
							// initialize isotope
							$this.isotope({
								itemSelector: ".item-gallery-masonry",
								transitionDuration: ".55s",
								layoutMode: "masonry",
							});

							$this.addClass("loaded");

							$(
								".penci-post-gallery-container.masonry .item-gallery-masonry"
							).each(function () {
								var $this = $(this);
								$this.one(
									"inview",
									function (
										event,
										isInView,
										visiblePartX,
										visiblePartY
									) {
										$this.addClass("animated");
									}
								); // inview
							}); // each
						});
					});
				}

				if ($().theiaStickySidebar) {
					var top_margin = 90;
					if ($("body").hasClass("admin-bar")) {
						top_margin = 122;
					}
					$(
						"#main.penci-main-sticky-sidebar, #sidebar.penci-sticky-sidebar"
					).theiaStickySidebar({
						// settings
						additionalMarginTop: top_margin,
					});
				} // if sticky
			}
			$("body").trigger("penci_swiper_sliders");
			$body.removeClass("loading-posts");
			$(document).trigger("penci_bf_check");
		});
	};

	$(document).ready(function () {
		PENCI.loadMorePostAjx();
	});
})(jQuery);
