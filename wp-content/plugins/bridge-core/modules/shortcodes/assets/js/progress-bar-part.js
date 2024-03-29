(function($) {
	'use strict';
	
	var progressBar = {};
	qode.modules.progressBar = progressBar;
	
	progressBar.initProgressBars = initProgressBars;
	progressBar.qodeElementorInitProgressBar = qodeElementorInitProgressBar;
	
	progressBar.qodeOnDocumentReady = qodeOnDocumentReady;
	progressBar.qodeOnWindowLoad = qodeOnWindowLoad;
	
	$(document).ready(qodeOnDocumentReady);
	$(window).on('load', qodeOnWindowLoad) ;
	
	function qodeOnDocumentReady() {
		initProgressBars();
	}
	
	function qodeOnWindowLoad() {
		qodeElementorInitProgressBar();
	}
	
	function initProgressBars(){
		"use strict";
		
		if($('.q_progress_bar').length){
			$('.q_progress_bar').each(function() {
				if($(this).parents('.vertical_split_slider').length){
					initToCounterHorizontalProgressBar($(this));
					var percentage = $(this).find('.progress_content').data('percentage');
					$(this).find('.progress_content').css('width', '0%');
					$(this).find('.progress_content').animate({'width': percentage+'%'}, 1500);
					$(this).find('.progress_number_wrapper').css('width', '0%');
					$(this).find('.progress_number_wrapper').animate({'width': percentage+'%'}, 1500);
				}
				else {
					$(this).appear(function() {
						initToCounterHorizontalProgressBar($(this));
						var percentage = $(this).find('.progress_content').data('percentage');
						$(this).find('.progress_content').css('width', '0%');
						$(this).find('.progress_content').animate({'width': percentage+'%'}, 1500);
						$(this).find('.progress_number_wrapper').css('width', '0%');
						$(this).find('.progress_number_wrapper').animate({'width': percentage+'%'}, 1500);
						
						
					},{accX: 0, accY: -200});
				}
			});
		}
	}
	
	function initToCounterHorizontalProgressBar($this){
		"use strict";
		
		var percentage = parseFloat($this.find('.progress_content').data('percentage'));
		if($this.find('.progress_number span').length) {
			$this.find('.progress_number span').each(function() {
				$(this).parents('.progress_number_wrapper').css('opacity', '1');
				$(this).countTo({
					from: 0,
					to: percentage,
					speed: 1500,
					refreshInterval: 50
				});
			});
		}
	}
	
	function qodeElementorInitProgressBar(){
		$(window).on('elementor/frontend/init', function () {
			elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_progress_bar.default', function() {
				initProgressBars();
			} );
		});
	}
	
})(jQuery);