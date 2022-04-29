(function( $ ) {
	"use strict";
	
	var ajaxAttr = {
		'date': { min: '', max: ''},
		'lang': '',
		'from': '',
		'page_type': '',
		'filter_post_id': '',
	};

	var chartType = { type: 'donut', height: 350  };

	var generalDashes = {
		init: function ( dashData ) {

			if ( '' === dashData ) {
				return;
			}
			
			dashData['chartID'] = 'pwf-chart-filters-used-per';
			let content = dashboardTemplate.createDash( dashData );
			generalDashes.appendDashes( content );
			generalDashes.addChart( dashData );
		},
		appendDashes: function( content ) {
			$('.pwf-general-dash').append( content );
		},
		removeDashes: function() {
			$('.pwf-general-dash').empty();
		},
		addChart: function( data ) {
			var options = {
				series: [{
					name: '',
					data: data.series,
				}],
				chart: {
					height: 400,
					type: 'line',
					zoom: {
				  		enabled: false
					}
			  	},
			  	dataLabels: {
					enabled: true
			  	},
			  	stroke: {
					curve: 'straight',
			  	},
			  	xaxis: {
					categories: data.labels,
					labels: {
						show: true,
						rotate: -45,
						rotateAlways: true,
					},
			  	},
			};

			let chart = new ApexCharts(document.querySelector('#' + data.chartID), options);  
			chart.render();
		},
	};

	var generateDashes = {
		init: function ( dashesData ) {
			let content = '';

			dashesData.forEach(function ( dash, index ) {
				dashesData[index]['chartID'] = 'pwf-chart-' + ( 1 + index );
				content += dashboardTemplate.createDash( dash );
			});

			generateDashes.appendDashes( content );
			generateDashes.addChart( dashesData );
		},
		addLayout: function() {
			return '2col';
		},
		appendDashes: function( content ) {
			$('.pwf-dashboards').append( content );
		},
		removeDashes: function() {
			$('.pwf-dashboards').empty();
		},
		noDataMessage: function( text ) {
			let output = '<div class="error-message no-data-message"><p>' + text + '</p></div>';

			$('.pwf-wrap-dashboards').append( output );
		},
		addChart: function( dashesData ) {
			dashesData.forEach(function ( data, index  ) {
				let options = {
					chart: chartType,
					series: data.series,
					labels: data.labels,
					legend: {
						labels: {
							useSeriesColors: false
						},
						markers: {
							radius: 0,
						},
						itemMargin: {
							horizontal: 0,
							vertical: 2
						},
						offsetX: 40,
						position: 'right',
					},
					tooltip: {
						fillSeriesColor: false,
						theme: 'dark',
						style: {
							fontSize: '13px',
							fontFamily: 'Open Sans, Helvetica, Arial'
						},
					},
					theme: {
						palette: 'palette1',
					},
					/*colors: ["#f72585","#b5179e","#7209b7","#560bad","#480ca8","#3a0ca3","#3f37c9","#4361ee","#4895ef","#4cc9f0"],*/
				};  
				let chart = new ApexCharts(document.querySelector('#' + data.chartID ), options);  
				chart.render();
			});
		},
	};

	var dashboardTemplate = {
		createDash: function( dashData ) {
			let content = '';

			content += dashboardTemplate.dashHeader( dashData.title );
			content += dashboardTemplate.dashContent(dashData);
			content += dashboardTemplate.dashFooter();

			return content;
		},
		dashHeader: function( title ) {
			let output = '<div class="pwf-dashboard"><div class="pwf-dashboard-inner">';
			output    += '<div class="field-header"><h3 class="header-text">' + title + '</h3></div>';
			return output;
		},
		dashFooter: function() {
			return '</div></div>';
		},
		dashContent: function( dashData ) {
			return '<div class="field-content"><div id="' + dashData.chartID + '" class="pwf-chart"></div></div>';			
		},
	};

	var filterComponent = {
		init: function() {
			$('.pwf-component-filters').on( 'change', '.pwf-filters-lang', function( event ) {
				event.preventDefault();
				ajaxAttr.lang = $(this).val();
			});

			$('.pwf-component-filters').on( 'change', '.pwf-filters-post-id', function( event ) {
				event.preventDefault();
				ajaxAttr.filter_post_id = $(this).val();
			});

			$('.pwf-component-filters').on( 'change', '.pwf-select-filters-from', function( event ) {
				event.preventDefault();
				ajaxAttr.from = $(this).val();
			});

			$('.pwf-component-filters').on( 'change', '.pwf-filters-page-type', function( event ) {
				event.preventDefault();
				ajaxAttr.page_type = $(this).val();
			});

			$('.pwf-component-filters').on( 'click', '.pwf-filter-button', function( event ) {
				event.preventDefault();
				doingAjax.init();
			});

			$(document).on( 'click', '.pwf-filter-date-btn', function( event ) {
				event.preventDefault();
				$('.pwf-date-range-popover').removeClass('show');
				doingAjax.init();
			});

			
			// Date range
			$('.pwf-component-filters').on( 'click', '.pwf-btn-range-date', function( event ) {
				$(this).closest('.pwf-filter-content').find('.pwf-date-range-popover').addClass('show');
			});
			$( document ).on( 'click', function( event ) {
				let hideShow = true;
				if ( $(event.target).hasClass('pwf-btn-range-date') ) {
					hideShow = false;
				} else if ( $(event.target).hasClass('pwf-range-date-lable') ) {
					hideShow = false;
				} else if ( $(event.target).hasClass('label-text') ) {
					hideShow = false;
				} else if ( $(event.target).hasClass('pwf-date-range-popover') ) {
					hideShow = false;
				} else if ( $(event.target).closest('.pwf-date-range-popover').length ) {
					hideShow = false;
				} else if ( $(event.target).hasClass('pwf-wrap-date') ) {
					hideShow = false;
				} else if ( $(event.target).closest('.pwf-wrap-date').length || $(event.target).closest('.ui-datepicker').length ) {
					hideShow = false;
				} else if ( $(event.target).hasClass('ui-datepicker-prev') ) {
					hideShow = false;
				} else if ( $(event.target).hasClass('ui-datepicker-nex') ) {
					hideShow = false;
				} else if ( $(event.target).hasClass('ui-icon') ) {
					hideShow = false;
				}

				if ( hideShow ) {
					$('.pwf-date-range-popover').removeClass('show');
				}
			});

			let dateFormat = "mm-dd-yy";
			let RTL        = ( $('body').hasClass('rtl') ) ? true : false;
			let dateField  = $('.pwf-input-date-range');
			let minDate    = $('.pwf-input-date-range').attr('data-min-date');
			let maxDate    = $('.pwf-input-date-range').attr('data-max-date');
			
			let from = $(dateField).find('.pwf-date-from')
				.datepicker({
					isRTL: RTL,
					autoSize: true,
					dateFormat: dateFormat,
					minDate: new Date( minDate ),
					maxDate: new Date( maxDate ),
					beforeShow: function(input, inst) {
						$('.ui-datepicker').addClass("pwf-wrap-date");
					},
					onClose: function(input, inst) {
						$('.ui-datepicker').removeClass("pwf-wrap-date");
					},
				})
				.on( "change", function() {
					to.datepicker( "option", "minDate", getDate( this, dateFormat ) );
				}),
				to = $(dateField).find('.pwf-date-to').datepicker({
					isRTL: RTL,
					autoSize: true,
					currentText: "Now",
					dateFormat: dateFormat,
					minDate: new Date( minDate ),
					maxDate: new Date( maxDate ),
					beforeShow: function(input, inst) {
						$('.ui-datepicker').addClass("pwf-wrap-date");
					},
					onClose: function(input, inst) {
						$('.ui-datepicker').removeClass("pwf-wrap-date");
					},
				})
				.on( "change", function() {
					from.datepicker( "option", "maxDate", getDate( this, dateFormat ) );
				});

			function getDate( element, dateFormat ) {
				let date;
				try {
					date = $.datepicker.parseDate( dateFormat, element.value );
				} catch( error ) {
					date = null;
				}
				return date;
			}
		}
	};

	var doingAjax = {
		init: function() {
			doingAjax.addDateValue();;
			if ( doingAjax.IsAjaxAttrEmpty() ) {
				return;
			}
			
			let data = {
				'action': 'get_ajax_analytic_data_result',
				'nonce':  pwf_woocommerce_analytic.nonce,
				'atts':   ajaxAttr,
			};

			let request = $.ajax({
				type: 'POST',
				dataType: 'json',
				url: pwf_woocommerce_analytic.ajaxurl,
				data: data,
				beforeSend: function() {
					doingAjax.beforeSendingAjax();
				}
			});

			request.done( function( data ) {
				let items = data.items;
				generalDashes.removeDashes();
				generateDashes.removeDashes();
				doingAjax.updateDateText();
				if ( '' !== items ) {
					$('.no-data-message').remove();
					generalDashes.init( data.filters_used_per );
					generateDashes.init( items );
				} else {
					generateDashes.noDataMessage( data.no_data_text );
				}
			});
			request.always( function() {
				$('.pwf-overlay').removeClass('pwf-active').addClass('pwf-unactive');
			});
			request.fail(function( jqXHR, textStatus ) {
  				console.log( "Request failed: " + textStatus );
			});
		},
		beforeSendingAjax: function() {
			if ( $('.pwf-overlay').length > 0 ) {
				$('.pwf-overlay').removeClass('pwf-unactive').addClass('pwf-active');
			} else {
				$('.pwf-layout-primary').prepend('<div class="pwf-overlay pwf-active"><span class="pwf-loader"></span></div>');
			}
		},
		IsAjaxAttrEmpty: function() {
			let isEmpty = true;
			const keys    = Object.keys(ajaxAttr);
			for ( const key of keys ) {
				if ( 'date' === key ) {
					let date = ajaxAttr[key];
					if ( '' !== date.min && '' !== date.max ) {
						isEmpty = false;
					} else {
						ajaxAttr.date.min = '';
						ajaxAttr.date.max = '';
					}
				} else if ( '' !== ajaxAttr[key] ) {
					isEmpty = false;
				}
			}
			return isEmpty;
		},
		addDateValue: function() {
			let min = $('.pwf-date-from').val();
			let max = $('.pwf-date-to').val();
			if ( '' !== min && '' !== max ) {
				ajaxAttr.date.min = min;
				ajaxAttr.date.max = max;
			} else {
				ajaxAttr.date.min = '';
				ajaxAttr.date.max = '';
			}			
		},
		updateDateText: function() {
			let min = $('.pwf-date-from').val();
			let max = $('.pwf-date-to').val();
			if ( '' !== min && '' !== max ) {
				min = $.datepicker.formatDate( 'M dd, yy', new Date( min ) );
				max = $.datepicker.formatDate( 'M dd, yy', new Date( max ) );
				let text = 'Custom (' + min + '-' + max + ')';
				$('.pwf-btn-range-date .label-text').text( text );
			}
		}
	};
	
	if ( typeof pwf_woocommerce_analytic !== 'undefined' ) {
		let analytic_data = JSON.parse( pwf_woocommerce_analytic.analytic_data );
		let items         = analytic_data.items;
		filterComponent.init();
		if ( '' !== items ) {
			generalDashes.init( analytic_data.filters_used_per );
			generateDashes.init( items );
		} else {
			generateDashes.noDataMessage( analytic_data.no_data_text );
		}
	}

}(jQuery));