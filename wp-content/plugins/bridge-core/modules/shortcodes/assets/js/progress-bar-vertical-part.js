(function($) {
	'use strict';
	
	var progressBarVertical = {};
	qode.modules.progressBarVertical = progressBarVertical;
	
	progressBarVertical.initProgressBarsVertical = initProgressBarsVertical;
	progressBarVertical.qodeElementorInitProgressBarVertical = qodeElementorInitProgressBarVertical;
	
	progressBarVertical.qodeOnDocumentReady = qodeOnDocumentReady;
	progressBarVertical.qodeOnWindowLoad = qodeOnWindowLoad;
	
	$(document).ready(qodeOnDocumentReady);
	$(window).on('load', qodeOnWindowLoad);
	
	function qodeOnDocumentReady() {
		initProgressBarsVertical();
	}
	
	function qodeOnWindowLoad() {
		qodeElementorInitProgressBarVertical();
	}
	
	function initProgressBarsVertical(){
		"use strict";
		
		if($('.q_progress_bars_vertical').length){
			$('.q_progress_bars_vertical').each(function() {
				$(this).appear(function() {
					initToCounterVerticalProgressBar($(this));
					var percentage = $(this).find('.progress_content').data('percentage');
					$(this).find('.progress_content').css('height', '0%');
					$(this).find('.progress_content').animate({
						height: percentage+'%'
					}, 1500);
				},{accX: 0, accY: -200});
			});
		}
	}
	
	function initToCounterVerticalProgressBar($this){
		"use strict";
		
		if($this.find('.progress_number span').length){
			$this.find('.progress_number span').each(function() {
				var $max = parseFloat($(this).text());
				$(this).countTo({
					from: 0,
					to: $max,
					speed: 1500,
					refreshInterval: 50
				});
			});
		}
	}
	
	function qodeElementorInitProgressBarVertical(){
		$(window).on('elementor/frontend/init', function () {
			elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_progress_bar_vertical.default', function() {
				initProgressBarsVertical();
			} );
		});
	}
	
})(jQuery);