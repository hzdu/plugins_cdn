jQuery(document).ready(function ($) {
    'use strict';
    var cmplz_loader = '<div class="cmplz-loader"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div>';

    $(document).on('click', '.cmplz-archive-cookiebanner', function() {

        var banner_id = $(this).data('banner_id');
        var tr = $(this).closest('tr');
        tr.css('background-color','red');

        $.post(
            cmplz_statistics.admin_url,
            {
                action: 'cmplz_archive_cookiebanner',
                banner_id: banner_id,
            },
            function (response) {
                if (response) {
                    if (response.success){
                        tr.remove();
                    }

                }
            });
    });

    $(document).on('click', '.cmplz-restore-cookiebanner', function() {

        var banner_id = $(this).data('banner_id');
        var tr = $(this).closest('tr');
        tr.css('background-color','red');

        $.post(
            cmplz_statistics.admin_url,
            {
                action: 'cmplz_restore_cookiebanner',
                banner_id: banner_id,
            },
            function (response) {
                if (response.success) {
                    tr.remove();
                }
            });
    });

	// //chart dropdown
	if ( $('.cmplz-graph-container').length ) {
		cmplzInitChartJS()
	}

	$(document).on('change', 'select[name=cmplz_consenttype]', function(){
		cmplzInitChartJS();
	});

	function cmplzInitChartJS() {
		var hasChartData = $('select[name=cmplz_consenttype]').length;
		var XscaleLabelDisplay = true;
		var YscaleLabelDisplay = true;
		var titleDisplay = true;
		var legend = true;
		var chartTitle = cmplz_localize('loading...');
		var xAxis = cmplz_localize('category');
		var yAxis = cmplz_localize('conversions');

		var minimal = $('.cmplz-insights').length;
		if (minimal) {
			XscaleLabelDisplay = false;
			YscaleLabelDisplay = false;
			titleDisplay = false;
			legend = false;
		}

		var config = {
			type: 'bar',
			data: {
				labels: ['...', '...', '...', '...'],
				datasets: [{
					label: '...',
					backgroundColor: 'rgb(255, 99, 132)',
					borderColor: 'rgb(255, 99, 132)',
					data: [
						0, 0, 0, 0
					],
					fill: false,
				}

				]
			},
			options: {
				legend:{
					display:legend,
				},
				responsive: true,
				title: {
					display: titleDisplay,
					text: chartTitle,
				},
				tooltips: {
					mode: 'index',
					intersect: false,
				},
				hover: {
					mode: 'nearest',
					intersect: true
				},
				scales: {
					xAxes: [{
						display: XscaleLabelDisplay,
						scaleLabel: {
							display: true,
							labelString: xAxis
						}
					}],
					yAxes: [{
						display: YscaleLabelDisplay,
						scaleLabel: {
							display: true,
							labelString: yAxis
						},
						ticks: {
							min: 0,
							max: 1,
							stepSize: 5
						}
					}]
				}
			}
		};

		var ctx = document.getElementsByClassName('cmplz-graph');
		window.conversionGraph = new Chart(ctx, config);
		var consenttype = $('select[name=cmplz_consenttype]').val();

		$.ajax({
			type: "get",
			dataType: "json",
			url: ajaxurl,
			data: {
				action: "cmplz_get_graph",
				consenttype: consenttype,
			},
			success: function (response) {
				console.log(response);
				if (response.success == true) {
					var i = 0;
					response.data.datasets.forEach(function (dataset) {
						if (config.data.datasets.hasOwnProperty(i)) {
							config.data.datasets[i] = dataset;
						} else {
							var newDataset = dataset;
							config.data.datasets.push(newDataset);
						}

						i++;
					});
					config.data.labels = response.data.labels;
					config.options.title.text = response.title;
					config.options.scales.yAxes[0].ticks.max = parseInt(response.data.max);
					window.conversionGraph.update();
				} else {
					alert("Your experiment data could not be loaded")
				}
			}
		})
	}

    function cmplz_localize(str){

        var strings = cmplz_statistics.translations;
        for (var k in strings) {
            if (strings.hasOwnProperty(k)) {
                str = str.replace(k, strings[k]);
            }
        }
        return str;
    }


});
