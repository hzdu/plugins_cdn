(function($) {
	'use strict';
	
	var pieChartWithIcon = {};
	qode.modules.pieChartWithIcon = pieChartWithIcon;
	
	pieChartWithIcon.initPieChartWithIcon = initPieChartWithIcon;
	pieChartWithIcon.qodeInitElementorPieChartWithIcon = qodeInitElementorPieChartWithIcon;
	
	pieChartWithIcon.qodeOnDocumentReady = qodeOnDocumentReady;
	pieChartWithIcon.qodeOnWindowLoad = qodeOnWindowLoad;
	
	$(document).ready(qodeOnDocumentReady);
	$(window).on('load', qodeOnWindowLoad);
	
	function qodeOnDocumentReady() {
		initPieChartWithIcon();
	}
	
	function qodeOnWindowLoad() {
		qodeInitElementorPieChartWithIcon();
	}
	
	function initPieChartWithIcon(){
		"use strict";
		
		if($('.q_percentage_with_icon').length){
			$('.q_percentage_with_icon').each(function() {
				
				var $barColor = piechartcolor;
				
				if($(this).data('active') !== ""){
					$barColor = $(this).data('active');
				}
				
				var $trackColor = '#eeeeee';
				
				if($(this).data('noactive') !== ""){
					$trackColor = $(this).data('noactive');
				}
				
				var $line_width = 10;
				
				if($(this).data('linewidth') !== ""){
					$line_width = $(this).data('linewidth');
				}
				
				var $size = 174;
				
				$(this).appear(function() {
					$(this).parent().css('opacity', '1');
					$(this).css('opacity', '1');
					$(this).easyPieChart({
						barColor: $barColor,
						trackColor: $trackColor,
						scaleColor: false,
						lineCap: 'butt',
						lineWidth: $line_width,
						animate: 1500,
						size: $size
					});
				},{accX: 0, accY: -200});
			});
		}
	}
	
	function qodeInitElementorPieChartWithIcon(){
		$(window).on('elementor/frontend/init', function () {
			elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_pie_chart_with_icon.default', function() {
				initPieChartWithIcon();
			} );
		});
	}
	
})(jQuery);
