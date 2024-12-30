(function ($, elementor) {
	"use strict";

	var widgetAvdGoogleMap = function ($scope, $) {
		var $advancedGoogleMap = $scope.find(".penci-advanced-map"),
			map_lists = $scope.find(
				"ul.penci-gmap-lists div.penci-gmap-list-item"
			),
			map_search_form = $scope.find(".penci-search"),
			map_search_text_box = $scope.find(".penci-search-input"),
			map_form = $scope.find(".penci-gmap-search-wrapper > form");

		if (!$advancedGoogleMap.length) {
			return;
		}

		$(map_lists).bind("click", function (e) {
			e.preventDefault();
			var $t = $(this),
				$index = $t.attr('data-index');
			

				$advancedGoogleMap.find('.penci_admap_item').removeClass('active')
				$advancedGoogleMap.find('.' + $index ).addClass('active')


		});

		$(map_search_form).submit(function (e) {
			e.preventDefault();
			let searchValue = $(map_search_text_box).val().toLowerCase();
			$(map_lists).filter(function () {
				$(this).toggle(
					$(this).text().toLowerCase().indexOf(searchValue) > -1
				);
			});
		});

		$(map_search_text_box).keyup(function () {
			let searchValue = $(this).val().toLowerCase();
			$(map_lists).filter(function () {
				$(this).toggle(
					$(this).text().toLowerCase().indexOf(searchValue) > -1
				);
			});
		});
	};

	jQuery(window).on("elementor/frontend/init", function () {
		elementorFrontend.hooks.addAction(
			"frontend/element_ready/penci-advanced-gmap.default",
			widgetAvdGoogleMap
		);
	});

})(jQuery, window.elementorFrontend);
