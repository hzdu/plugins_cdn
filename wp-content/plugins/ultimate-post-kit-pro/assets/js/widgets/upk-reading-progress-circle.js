/**
 * Start news ticker widget script
 */

(function ($, elementor) {

	'use strict';

	var widgetReadingProgressCircle = function ($scope, $) {

		var $readingProgress = $scope.find('#upk-reading-progress-circle'),
			$settings = $readingProgress.data('settings');
		
		if (!$readingProgress.length) {
			return;
		}

		var scrollPercentage = () => {
			var scrollProgress = document.getElementById("upk-reading-progress-circle");
			var progressValue = document.getElementById("upk-reading-progress-circle-value");
			var pos = document.documentElement.scrollTop;
			var calcHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
			var scrollValue = Math.round( pos * 100 / calcHeight);

			var baseColor = $settings.baseColor || '#c2cbd2';
        	var fillColor = $settings.fillColor || '#e62a3f';
		
			scrollProgress.style.background = `conic-gradient(${fillColor} ${scrollValue}%, ${baseColor} ${scrollValue}%)`;
			progressValue.textContent = `${scrollValue}%`;
		}
		
		
		window.onscroll = scrollPercentage;
		// window.onload = scrollPercentage;
		scrollPercentage();
	};

	jQuery(window).on('elementor/frontend/init', function () {
		elementorFrontend.hooks.addAction('frontend/element_ready/upk-reading-progress-circle.default', widgetReadingProgressCircle);
	});

}(jQuery, window.elementorFrontend));

/**
 * End news ticker widget script
 */


//  let scrollPercentage = () => {
// 	let scrollProgress = document.getElementById("upk-reading-progress-circle");
// 	let progressValue = document.getElementById("upk-reading-progress-circle-value");
// 	let pos = document.documentElement.scrollTop;
// 	let calcHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
// 	let scrollValue = Math.round( pos * 100 / calcHeight);

// 	scrollProgress.style.background = `conic-gradient(#008fff ${scrollValue}%, #c0c0ff ${scrollValue}%)`;
// 	progressValue.textContent = `${scrollValue}%`;
// }


// window.onscroll = scrollPercentage;
// window.onload = scrollPercentage;