(function ($) {
	'use strict';
	
	var pieChartFull = {};
	qode.modules.pieChartFull = pieChartFull;

	pieChartFull.qodePieChartFull = qodePieChartFull;
	pieChartFull.qodeInitElementorPieChartFull = qodeInitElementorPieChartFull;
	
	pieChartFull.qodeOnDocumentReady = qodeOnDocumentReady;
	pieChartFull.qodeOnWindowLoad = qodeOnWindowLoad;

	$(document).ready(qodeOnDocumentReady);
	$(window).on('load', qodeOnWindowLoad);
	
	function qodeOnDocumentReady() {
		qodePieChartFull();
	}
	
	function qodeOnWindowLoad() {
		qodeInitElementorPieChartFull();
	}
	
	function qodePieChartFull() {
		var holder = $('.q-pie-chart-full');
		
		if (holder.length) {

			holder.each(function () {
				var pieChart = $(this).find('.q_pie_graf'),
					canvasPieChart = pieChart.find('canvas');

				var pieChartValues = typeof pieChart.data('values') !== 'undefined' ? pieChart.data('values') : [],
					pieChartColors = typeof pieChart.data('colors') !== 'undefined' ? pieChart.data('colors') : [],
					pieChartElementAppearance = typeof pieChart.data('element-appearance') !== 'undefined' ? pieChart.data('element-appearance') : 200;


				var data = {
					datasets: [{
						data: pieChartValues,
						backgroundColor: pieChartColors,
						hoverBackgroundColor: pieChartColors,
						borderWidth: 0,
					}]
				};

				canvasPieChart.appear(function () {

					var pieChartFullObject = new Chart(canvasPieChart[0].getContext('2d'), {
						type: 'pie',
						data: data,
						options: {
							responsive: true,
							aspectRatio: 1,
							plugins: {
								legend: {
									display: false,
								},
								tooltips: {
									enabled: false,
								},
							},
							animation: {
								easing: "easeOutBounce",
								duration: 1500
							},
						}
					});

				},{accX: 0, accY: -pieChartElementAppearance});

			});
		}
	}
	
	function qodeInitElementorPieChartFull(){
		$(window).on('elementor/frontend/init', function () {
			elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_pie_chart_full.default', function() {
				qodePieChartFull();
			} );
		});
	}

})(jQuery);
