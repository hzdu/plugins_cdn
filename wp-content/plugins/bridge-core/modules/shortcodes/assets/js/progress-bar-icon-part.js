(function($) {
	'use strict';
	
	var progressBarIcon = {};
	qode.modules.progressBarIcon = progressBarIcon;
	
	progressBarIcon.initProgressBarsIcon = initProgressBarsIcon;
	progressBarIcon.qodeElementorInitProgressBarIcon = qodeElementorInitProgressBarIcon;
	
	progressBarIcon.qodeOnDocumentReady = qodeOnDocumentReady;
	progressBarIcon.qodeOnWindowLoad = qodeOnWindowLoad;
	
	$(document).ready(qodeOnDocumentReady);
	$(window).on('load', qodeOnWindowLoad);
	
	function qodeOnDocumentReady() {
		initProgressBarsIcon();
	}
	
	function qodeOnWindowLoad() {
		qodeElementorInitProgressBarIcon();
	}
	
	function initProgressBarsIcon(){
		"use strict";
		
		var timeOuts = [];
		
		if($('.q_progress_bars_icons_holder').length){
			$('.q_progress_bars_icons_holder').each(function() {
				var $this = $(this);
				var axis = 200;
				if(typeof $this.data('element-appearance') !== 'undefined' && $this.data('element-appearance') !== false) {
					axis = $this.data('element-appearance');
				}
				$this.appear(function() {
					$this.find('.q_progress_bars_icons').css('opacity','1');
					$this.find('.q_progress_bars_icons').each(function() {
						var number = $(this).find('.q_progress_bars_icons_inner').data('number');
						var size = $(this).find('.q_progress_bars_icons_inner').data('size');
						
						if(size !== ""){
							$(this).find('.q_progress_bars_icons_inner.custom_size .bar').css({'width': size+'px','height':size+'px'});
							$(this).find('.q_progress_bars_icons_inner.custom_size .bar .fa-stack').css({'font-size': size/2+'px'});
						}
						
						var bars = $(this).find('.bar');
						
						bars.each(function(i){
							if(i < number){
								var time = (i + 1)*150;
								timeOuts[i] = setTimeout(function(){
									$(bars[i]).addClass('active');
								},time);
							}
						});
					});
				},{accX: 0, accY: -axis});
			});
		}
	}
	
	function qodeElementorInitProgressBarIcon(){
		$(window).on('elementor/frontend/init', function () {
			elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_progress_bar_icon.default', function() {
				initProgressBarsIcon();
			} );
		});
	}
	
})(jQuery);