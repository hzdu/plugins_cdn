(function ($) {
	'use strict';
	
	var pieChartDoughnut = {};
	qode.modules.pieChartDoughnut = pieChartDoughnut;

	pieChartDoughnut.qodePieChartDoughnut = qodePieChartDoughnut;
	pieChartDoughnut.qodeInitElementorPieChartDoughnut = qodeInitElementorPieChartDoughnut;
	
	pieChartDoughnut.qodeOnDocumentReady = qodeOnDocumentReady;
	pieChartDoughnut.qodeOnWindowLoad = qodeOnWindowLoad;

	$(document).ready(qodeOnDocumentReady);
	$(window).on('load', qodeOnWindowLoad);
	
	function qodeOnDocumentReady() {
		qodePieChartDoughnut();
	}
	
	function qodeOnWindowLoad() {
		qodeInitElementorPieChartDoughnut();
	}
	
	function qodePieChartDoughnut() {
		var holder = $('.q-pie-chart-doughnut');
		
		if (holder.length) {
			holder.each(function () {
				var pieChart = $(this).find('.q_pie_graf'),
					canvasPieChart = pieChart.find('canvas');

				var pieChartValues = typeof pieChart.data('values') !== 'undefined' ? pieChart.data('values') : [],
				 	pieChartColors = typeof pieChart.data('colors') !== 'undefined' ? pieChart.data('colors') : [];

				var data = {
					datasets: [{
						data: pieChartValues,
						backgroundColor: pieChartColors,
						hoverBackgroundColor: pieChartColors,
						borderWidth: 0,
					}]
				};

				canvasPieChart.appear(function () {

					var pieChartDoughnutObject = new Chart(canvasPieChart[0].getContext('2d'), {
						type: 'doughnut',
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
							}
						},
						segmentStrokeColor : 'transparent'
					});

				},{accX: 0, accY: -200});
			});
		}
	}
	
	function qodeInitElementorPieChartDoughnut(){
		$(window).on('elementor/frontend/init', function () {
			elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_pie_chart_doughnut.default', function() {
				qodePieChartDoughnut();
			} );
		});
	}

})(jQuery);
