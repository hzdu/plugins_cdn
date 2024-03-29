(function ($) {
	'use strict';
	
	var lineGraph = {};
	qode.modules.lineGraph = lineGraph;

	lineGraph.qodeLineGraph = qodeLineGraph;
	lineGraph.qodeInitElementorLineGraph = qodeInitElementorLineGraph;
	
	lineGraph.qodeOnDocumentReady = qodeOnDocumentReady;
	lineGraph.qodeOnWindowLoad = qodeOnWindowLoad;

	$(document).ready(qodeOnDocumentReady);
	$(window).on('load', qodeOnWindowLoad);
	
	function qodeOnDocumentReady() {
		qodeLineGraph();
	}
	
	function qodeOnWindowLoad() {
		qodeInitElementorLineGraph();
	}
	
	function qodeLineGraph() {
		var holder = $('.q_line_graf_holder');
		
		if (holder.length) {
			holder.each(function () {
				var lineGraph = $(this).find('.q_line_graf'),
					canvasLineGraph = lineGraph.find('canvas');

				var scaleStepWidth = typeof lineGraph.data('scale-step-width') !== 'undefined' ? lineGraph.data('scale-step-width') : {},
					scaleSteps = typeof lineGraph.data('scale-steps') !== 'undefined' ? lineGraph.data('scale-steps') : {},
					bezierCurve = typeof lineGraph.data('bezier-curve') !== 'undefined' ? lineGraph.data('bezier-curve') : {},
					scaleFontColor = typeof lineGraph.data('scale-font-color') !== 'undefined' ? lineGraph.data('scale-font-color') : {},
					scaleFontSize = typeof lineGraph.data('scale-font-size') !== 'undefined' ? lineGraph.data('scale-font-size') : {},
					values = typeof lineGraph.data('values') !== 'undefined' ? lineGraph.data('values') : {},
					labels = typeof lineGraph.data('labels') !== 'undefined' ? lineGraph.data('labels') : {},
					backgroundColors = typeof lineGraph.data('background-colors') !== 'undefined' ? lineGraph.data('background-colors') : {};

				var datasets = [];
				values.forEach(
					function ( item, index ) {
						var dataset_item = {};
						dataset_item.data                   = values[index].split( ',' );
						dataset_item.borderWidth            = 1;
						dataset_item.pointRadius  			= 0;
						dataset_item.pointBorderWidth  		= 0;
						dataset_item.backgroundColor  		= backgroundColors[index];
						dataset_item.cubicInterpolationMode = "default";
						dataset_item.fill					= true;

						datasets.push( dataset_item );
					}
				);

				var data = {
					type: 'line',
					data: {
						labels: labels,
						datasets: datasets
					},
					options: {
						responsive: true,
						hover: {
							mode: 'nearest',
							intersect: true
						},
						plugins: {
							legend: {
								display: false,
							},
							tooltips: {
								enabled: false,
							},
						},
						scales: {
							x: {
								display: true,
								scaleLabel: {
									display: true
								},
								gridLines:{
									zeroLineColor: "#505050",
									drawOnChartArea: false
								},
								ticks:{
									color: scaleFontColor,
									font: {
										size: scaleFontSize,
									}
								}
								// barPercentage: barSize,
								// categoryPercentage: catSize,
							},
							y: {
								display: true,
								scaleLabel: {
									display: true,
								},
								gridLines:{
									zeroLineColor: "#505050"
								},
								ticks: {
									color: scaleFontColor,
									font: {
										size: scaleFontSize,
									},
									stepSize: scaleStepWidth
								},
								suggestedMax: scaleSteps*scaleStepWidth,
							}
						},
						elements: {
							line: {
								tension: 0.4 // disables bezier curves
							}
						}
					}
				};

				var lineGraphObject = new Chart(canvasLineGraph[0].getContext('2d'), data);
			});
		}
	}
	
	function qodeInitElementorLineGraph(){
		$(window).on('elementor/frontend/init', function () {
			elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_line_graph.default', function() {
				qodeLineGraph();
			} );
		});
	}

})(jQuery);
