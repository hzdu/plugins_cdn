'use strict';

(function ($) {
	let doc = $( document );

	doc.ready( function () {
		let lastSelectedSharesType;
		let lastSelectedClicksType;
		let chart_1;
		let chart_2;
		let colors = [
			'#FFD17A',
			'#DBC9FF',
			'#85CEF9',
			'#9FFFB2',
			'rgb(242, 210, 73)',
			'rgb(147, 185, 198)',
			'rgb(204, 197, 168)',
			'rgb(83, 186, 205)',
			'rgb(156, 196, 45)',
			'rgb(152, 170, 252)',
			'rgb(97, 166, 86)',
			'rgb(225, 124, 36)',
			'rgb(210, 32, 48)'
		];

		$( '#fspReports_sharesTypes' ).on( 'select2:select', function () {
			let _this = $( this );
			let type = _this.val();

			if ( type === lastSelectedSharesType )
			{
				return;
			}

			lastSelectedSharesType = type;

			FSPoster.ajax( 'report1_data', { type }, function (result) {
				if ( chart_1 )
				{
					chart_1.destroy();
				}

				let bgColors = [];

				for ( let i = 0; i <= result[ 'data' ].length; i++ )
				{
					bgColors.push( colors[ i % colors.length ] );
				}

				let ctx = document.getElementById( 'fspReports_sharesChart' ).getContext( '2d' );
				chart_1 = new Chart( ctx, {
					type: 'bar',
					data: {
						labels: result[ 'labels' ],
						datasets: [ {
							data: result[ 'data' ],
							backgroundColor: bgColors,
							borderColor: bgColors,
							borderWidth: 1
						} ]
					},
					options: {
						legend: {
							display: false
						},
						scales: {
							yAxes: [ {
								ticks: {
									beginAtZero: true
								}
							} ]
						},
						gridLines: {
							color: '#E3EAF3'
						}
					}
				} );
			} )
		} ).trigger( 'select2:select' );

		$( '#fspReports_clicksTypes' ).on( 'select2:select', function () {
			let _this = $( this );
			let type = _this.val();

			if ( type === lastSelectedClicksType )
			{
				return;
			}

			lastSelectedClicksType = type;

			FSPoster.ajax( 'report2_data', { type }, function (result) {
				if ( chart_2 )
				{
					chart_2.destroy();
				}

				let ctx = document.getElementById( 'fspReports_clicksChart' ).getContext( '2d' );
				chart_2 = new Chart( ctx, {
					type: 'line',
					data: {
						labels: result[ 'labels' ],
						datasets: [ {
							data: result[ 'data' ],
							fill: true,
							borderColor: "#5DD775",
							borderWidth: 2,
							backgroundColor: "#eefbf1",
							pointBackgroundColor: '#5DD775',
							pointRadius: 4,
							pointHoverBackgroundColor: "#eefbf1",
							pointHoverRadius: 4,
							pointHoverBorderWidth: 2,
							pointHoverBorderColor: '#5DD775'
						} ]
					},
					options: {
						legend: {
							display: false
						},
						scales: {
							yAxes: [ {
								ticks: {
									beginAtZero: true
								},
								gridLines: {
									color: '#E3EAF3'
								}
							} ]
						}
					}
				} );
			} );
		} ).trigger( 'select2:select' );

		let bgColors = [];

		for ( let i = 0; i <= fspConfig.comparison.data.length; i++ )
		{
			bgColors.push( colors[ i % colors.length ] );
		}

		let ctx3 = document.getElementById( 'fspReports_comparisonChart' ).getContext( '2d' );
		new Chart( ctx3, {
			type: 'doughnut',
			data: {
				datasets: [ {
					backgroundColor: bgColors,
					data: fspConfig.comparison.data
				} ],

				labels: fspConfig.comparison.labels
			},
			options: {
				legend: {
					position: 'right',

					labels: {
						usePointStyle: true,
						generateLabels: function (chart) {
							var data = chart.data;
							if ( data.labels.length && data.datasets.length )
							{
								return data.labels.map( function (label, i) {
									var meta = chart.getDatasetMeta( 0 );
									var ds = data.datasets[ 0 ];
									var arc = meta.data[ i ];
									var custom = arc && arc.custom || {};
									var getValueAtIndexOrDefault = Chart.helpers.getValueAtIndexOrDefault;
									var arcOpts = chart.options.elements.arc;
									var fill = custom.backgroundColor ? custom.backgroundColor : getValueAtIndexOrDefault( ds.backgroundColor, i, arcOpts.backgroundColor );
									var stroke = custom.borderColor ? custom.borderColor : getValueAtIndexOrDefault( ds.borderColor, i, arcOpts.borderColor );
									var bw = custom.borderWidth ? custom.borderWidth : getValueAtIndexOrDefault( ds.borderWidth, i, arcOpts.borderWidth );

									var value = chart.config.data.datasets[ arc._datasetIndex ].data[ arc._index ];

									return {
										// Instead of `text: label,`
										// We add the value to the string
										text: label + " : " + value,
										fillStyle: fill,
										strokeStyle: stroke,
										lineWidth: bw,
										hidden: isNaN( ds.data[ i ] ) || meta.data[ i ].hidden,
										index: i
									};
								} );
							}
							else
							{
								return [];
							}
						}
					}


				},
				responsive: true
			}
		} );

		let bgColors2 = [];

		for ( let i = 0; i <= fspConfig.accComparison.data.length; i++ )
		{
			bgColors2.push( colors[ i % colors.length ] );
		}

		let ctx4 = document.getElementById( 'fspReports_accComparisonChart' ).getContext( '2d' );
		new Chart( ctx4, {
			type: 'doughnut',
			data: {
				datasets: [ {
					backgroundColor: bgColors2,
					data: fspConfig.accComparison.data
				} ],

				labels: fspConfig.accComparison.labels
			},
			options: {
				legend: {
					position: 'right',

					labels: {
						usePointStyle: true,
						generateLabels: function (chart) {
							var data = chart.data;
							if ( data.labels.length && data.datasets.length )
							{
								return data.labels.map( function (label, i) {
									var meta = chart.getDatasetMeta( 0 );
									var ds = data.datasets[ 0 ];
									var arc = meta.data[ i ];
									var custom = arc && arc.custom || {};
									var getValueAtIndexOrDefault = Chart.helpers.getValueAtIndexOrDefault;
									var arcOpts = chart.options.elements.arc;
									var fill = custom.backgroundColor ? custom.backgroundColor : getValueAtIndexOrDefault( ds.backgroundColor, i, arcOpts.backgroundColor );
									var stroke = custom.borderColor ? custom.borderColor : getValueAtIndexOrDefault( ds.borderColor, i, arcOpts.borderColor );
									var bw = custom.borderWidth ? custom.borderWidth : getValueAtIndexOrDefault( ds.borderWidth, i, arcOpts.borderWidth );

									var value = chart.config.data.datasets[ arc._datasetIndex ].data[ arc._index ];

									return {
										// Instead of `text: label,`
										// We add the value to the string
										text: label + " : " + value,
										fillStyle: fill,
										strokeStyle: stroke,
										lineWidth: bw,
										hidden: isNaN( ds.data[ i ] ) || meta.data[ i ].hidden,
										index: i
									};
								} );
							}
							else
							{
								return [];
							}
						}
					}


				},
				responsive: true
			}
		} );
	} );
})( jQuery );