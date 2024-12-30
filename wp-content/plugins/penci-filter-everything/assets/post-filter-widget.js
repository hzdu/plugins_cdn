(function ($) {
	"use strict";
	var PENCI = PENCI || {};
	PENCI.PostFilters = function () {
		var $body = $("body");

		$(document).ready(function () {

			$('.pmfa-chosen-select').chosen();

			$(".pmfa").on("click", function (e) {
				e.preventDefault(); // Prevent default link behavior
			
				// Determine which filter parameter to use based on the class
				const filterParam = $(this).hasClass("pmfa-t") ? "pcmtt" : "pcmtf";
				const pmfa_input  = $(this).closest('.penci-fte-groups').find('.filter_url');
				const post_types  = $(this).closest('.penci-fte-groups').find('.post_types').val();
			
				// Get the filter key and value from the clicked element
				const filterKey = $(this).attr("data-filter-key");
				const filterValue = $(this).attr("data-filter-value");
				const newFilter = `${filterKey}:${filterValue}`;
			
				// Get the current URL and check for existing filter query
				let currentUrl = new URL(window.location.href);
				if ($(this).hasClass('pmfa-no-ajax')){
					currentUrl = new URL(pmfa_input.val());
				}
				let searchParams = currentUrl.searchParams;
				let existingFilter = searchParams.get(filterParam) || "";
				let existingTypes = searchParams.get('pcptype') || "";

				// Split the existing filter into an array of "key:value" pairs
				let filterArray = existingFilter ? existingFilter.split("|") : [];
				let filterTypesArray = existingTypes ? existingTypes.split("|") : [];
			
				if ($(this).hasClass("action-radio")) {
					// Remove all filters with the same filterKey if the element has the class 'radio'
					filterArray = filterArray.filter(
						(item) => !item.startsWith(`${filterKey}:`)
					);
					filterArray.push(newFilter); // Add the new filter
					$(this)
						.closest(".penci-fte-group")
						.find(".pmfa.added")
						.removeClass("added");
					$(this).addClass("added");
				} else {
					if (filterArray.includes(newFilter)) {
						// If the new filter already exists, remove it
						filterArray = filterArray.filter((item) => item !== newFilter);
						$(this).removeClass("added");
					} else {
						// If the new filter does not exist, add it
						filterArray.push(newFilter);
						$(this).addClass("added");
					}
				}

				if (!filterTypesArray.includes(post_types) && post_types) {
					filterTypesArray.push(post_types);
				}

				// Join the filter array back into a string
				let updatedFilter = filterArray.join("|");
				let updatedTypeFilter = filterTypesArray.join("|");

			
				// Update or remove the filter parameter in the URL
				if (updatedFilter) {
					searchParams.set(filterParam, updatedFilter);
				} else {
					searchParams.delete(filterParam);
				}
				
				if (updatedTypeFilter) {
					searchParams.set('pcptype', updatedTypeFilter);
				} else {
					searchParams.delete('pcptype');
				}
			
				let filterContainer = $(this)
					.closest(".pcptf-mt")
					.attr("data-selector");
			
				filterContainer = filterContainer
					? "." + filterContainer
					: ".penci-main-sticky-sidebar";
			
				// Update the URL and use Pjax to load the new content
				currentUrl.search = searchParams.toString().replace(/%3A/g, ':');
				
				if ($(this).hasClass('pmfa-ajax')){
					$.pjax({
						url: currentUrl.toString().replace(/%3A/g, ':'),
						timeout: 10000,
						container: filterContainer,
						fragment: filterContainer,
						replace: true,
					});
				} else {
					pmfa_input.val( currentUrl.toString().replace(/%3A/g, ':') );
				}
			});

			$(".pmfa-chosen-select").on("change", function () {
				const filterKey = $(this).attr("name"); // Get the key from the select element
				const selectedValues = $(this).val() || []; // Get selected values, or empty array if none
				const filterParam = $(this).hasClass("pmfa-t") ? "pcmtt" : "pcmtf";
				const post_types = $(this).closest('.penci-fte-groups').find('.post_types').val();
				const pmfa_input = $(this).closest('.penci-fte-groups').find('.filter_url');
			
				// Get the current URL and check for the existing filter query
				let currentUrl = new URL(window.location.href);
				let searchParams = currentUrl.searchParams;
				let existingFilter = searchParams.get(filterParam) || "";
				let existingTypes = searchParams.get('pcptype') || "";
			
				// Split the existing filter into an array of "key:value" pairs
				let filterArray = existingFilter ? existingFilter.split('|') : [];
				let filterTypesArray = existingTypes ? existingTypes.split("|") : [];
			
				let filterContainer = $(this)
					.closest(".pcptf-mt")
					.attr("data-selector");
			
				filterContainer = filterContainer
					? "." + filterContainer
					: ".penci-main-sticky-sidebar";
			
				// Parse the filter array into an object to group by key
				let filterObj = {};
				filterArray.forEach(filter => {
					const [key, values] = filter.split(':');
					if (!filterObj[key]) {
						filterObj[key] = new Set();
					}
					values.split(',').forEach(value => filterObj[key].add(value));
				});
			
				// Update the filter object with the selected values for the current key
				if (selectedValues.length > 0) {
					if (!Array.isArray(selectedValues)) {
						// Handle single select (string value)
						filterObj[filterKey] = new Set([selectedValues]);
					} else {
						// Handle multi-select (array of values)
						filterObj[filterKey] = new Set(selectedValues);
					}
				} else {
					delete filterObj[filterKey]; // Remove the key if no values are selected
				}
			
				if (!filterTypesArray.includes(post_types) && post_types) {
					filterTypesArray.push(post_types);
				}
			
				// Rebuild the filter string
				let updatedFilter = Object.entries(filterObj)
					.map(([key, values]) => `${key}:${[...values].join(',')}`)
					.join('|');
			
				let updatedTypeFilter = filterTypesArray.join("|");
			
				// Update or remove the filter parameter in the URL
				if (updatedFilter) {
					searchParams.set(filterParam, updatedFilter);
				} else {
					searchParams.delete(filterParam);
				}
			
				if (updatedTypeFilter) {
					searchParams.set('pcptype', updatedTypeFilter);
				} else {
					searchParams.delete('pcptype');
				}
			
				// Update the URL and use Pjax to load the new content
				currentUrl.search = searchParams.toString().replace(/%3A/g, ':');
				if ($(this).hasClass('pmfa-ajax')) {
					$.pjax({
						url: currentUrl.toString().replace(/%3A/g, ':'),
						timeout: 10000,
						container: filterContainer,
						fragment: filterContainer,
						replace: true,
					});
				} else {
					pmfa_input.val(currentUrl.toString().replace(/%3A/g, ':'));
				}
			});
			

			$(document).on('click','.pcft-filter-btn',function(e){
				e.preventDefault();
				var t = $(this),
					btn_group = t.closest('.pcft-buttons'),
					url = btn_group.find('.filter_url').val();

				window.location.href = url;
			});
			
			$(document).on('click','.pcft-reset-btn',function(e){
				e.preventDefault();
				// Get the current URL
				let currentUrl = window.location.href;

				// Find the base URL (everything before '?' or '#')
				let baseUrl = currentUrl.split(/[?#]/)[0];

				let filterContainer = $(this)
					.closest(".pcptf-mt")
					.attr("data-selector");
			
				filterContainer = filterContainer
					? "." + filterContainer
					: ".penci-main-sticky-sidebar";

				if ($(this).hasClass('pcft-no-ajax')) {
					window.location.href = baseUrl;
				} else {
					$(this).closest('.penci-fte-groups').find('.pmfa').removeClass('added');
					$('.pcfe-ds-multi-select').val([]).trigger('chosen:updated');
					$.pjax({
						url: baseUrl,
						timeout: 10000,
						container: filterContainer,
						fragment: filterContainer,
						replace: true,
					});
				}
			});

		});

		$(document).on("pjax:send", function (xhr, options) {
			var mainClass = $(xhr.relatedTarget),
				bodyClass = $(mainClass).closest("body");

			if ($("body").hasClass("woocommerce")) {
				return;
			}

			$("body").addClass("loading-posts");
			window.scrollTo({ top: 0, behavior: "smooth" });
		});

		$(document).on("pjax:complete", function () {
			if ($(".penci-wrapper-data").hasClass("penci-masonry")) {
				$(".penci-wrapper-data").imagesLoaded(function () {
					$(".penci-wrapper-data").isotope({
						itemSelector: ".item-masonry",
						transitionDuration: ".55s",
						layoutMode: "masonry",
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
		PENCI.PostFilters();
	});

	$(window).on('elementor/frontend/init', function () {
        if (window.elementorFrontend) {
            elementorFrontend.hooks.addAction('frontend/element_ready/penci-filter.default', function ($scope) {
                PENCI.PostFilters();
            });
        }
    });
	
})(jQuery);
