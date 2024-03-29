(function($) {
	'use strict';
	
	var pieChart = {};
	qode.modules.pieChart = pieChart;
	
	pieChart.initPieChart = initPieChart;
	pieChart.qodeInitElementorPieChart = qodeInitElementorPieChart;
	
	pieChart.qodeOnDocumentReady = qodeOnDocumentReady;
	pieChart.qodeOnWindowLoad = qodeOnWindowLoad;
	
	$(document).ready(qodeOnDocumentReady);
	$(window).on('load', qodeOnWindowLoad);
	
	function qodeOnDocumentReady() {
		initPieChart();
	}
	
	function qodeOnWindowLoad() {
		qodeInitElementorPieChart();
	}
	
	function initPieChart(){
		"use strict";
		
		if($('.q_percentage').length){
			$('.q_percentage').each(function() {
				
				var $barColor = piechartcolor;
				
				if(typeof $(this).data('active') !== 'undefined' && $(this).data('active') !== ""){
					$barColor = $(this).data('active');
				}
				
				var $trackColor = '#eeeeee';
				
				if(typeof $(this).data('noactive') !== 'undefined' && $(this).data('noactive') !== ""){
					$trackColor = $(this).data('noactive');
				}
				
				var $line_width = 10;
				
				if(typeof $(this).data('linewidth') !== 'undefined' && $(this).data('linewidth') !== ""){
					$line_width = $(this).data('linewidth');
				}
				
				var $size = 174;
				
				var axis = 200;
				if(typeof $(this).data('element-appearance') !== 'undefined' && $(this).data('element-appearance') !== false) {
					axis = $(this).data('element-appearance');
				}
				
				$(this).appear(function() {
					initToCounterPieChart($(this));
					$(this).parent().css('opacity', '1');
					
					$(this).easyPieChart({
						barColor: $barColor,
						trackColor: $trackColor,
						scaleColor: false,
						lineCap: 'butt',
						lineWidth: $line_width,
						animate: 1500,
						size: $size
					});
				},{accX: 0, accY: -axis});
			});
		}
	}
	
	function initToCounterPieChart($this){
		"use strict";
		
		$($this).css('opacity', '1');
		var $max = parseFloat($($this).find('.tocounter').text());
		$($this).find('.tocounter').countTo({
			from: 0,
			to: $max,
			speed: 1500,
			refreshInterval: 50
		});
	}
	
	function qodeInitElementorPieChart(){
		$(window).on('elementor/frontend/init', function () {
			elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_pie_chart.default', function() {
				initPieChart();
			} );
		});
	}
	
})(jQuery);