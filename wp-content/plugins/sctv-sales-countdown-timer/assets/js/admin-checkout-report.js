
jQuery(document).ready(function () {
    'use strict';
    if (jQuery('.vi-ui.dropdown').length) {
        jQuery('.vi-ui.dropdown').dropdown();
    }

    if (jQuery('#myChart').length) {
        var ctx = jQuery("#myChart");
        var options = {}, data = {
            labels: vi_sct_chart_params.chart_labels,
        };
        if (!vi_sct_chart_params.subpage) {
            data['datasets'] = [
                {
                    label: vi_sct_chart_params.click_label,
                    borderWidth: 1,
                    fill: false,
                    backgroundColor: "#fff",
                    borderColor: "rgb(42,187,192)",
                    pointBorderColor: "rgb(27,173,192)",
                    pointBackgroundColor: "#fff",
                    data: vi_sct_chart_params.click_data,
                },
                {
                    label: vi_sct_chart_params.sct_order_label,
                    fill: false,
                    borderWidth: 1,
                    lineTension: 0.1,
                    backgroundColor: "#fff",
                    borderColor: "rgb(192,79,71)",
                    pointBorderColor: "rgb(192,83,66)",
                    pointBackgroundColor: "#fff",
                    data: vi_sct_chart_params.sct_order_data,
                },
                {
                    label: vi_sct_chart_params.order_label,
                    fill: false,
                    borderWidth: 1,
                    backgroundColor: "#fff",
                    borderColor: "rgb(96,192,121)",
                    pointBorderColor: "rgb(74,192,105)",
                    data: vi_sct_chart_params.order_data,
                },
            ];
        } else if (vi_sct_chart_params.subpage === 'orders') {
            data['datasets'] = [
                {
                    label: vi_sct_chart_params.sct_time_order_label,
                    fill: false,
                    borderWidth: 1,
                    lineTension: 0.1,
                    backgroundColor: "#fff",
                    borderColor: "rgb(192,79,71)",
                    pointBorderColor: "rgb(192,83,66)",
                    pointBackgroundColor: "#fff",
                    data: vi_sct_chart_params.sct_time_order_data,
                },
            ];
            options = {
                scales: {
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Time to checkout(' + vi_sct_chart_params.time + ')',
                            fontSize: 16
                        }
                    }],
                    yAxes: [{
                        gridLines: {
                            display: true,
                        },
                        ticks: {
                            beginAtZero: true,
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Total orders',
                            fontSize: 16
                        }
                    }]
                },

            };
        }
        var myLineChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: options,
        });
    }
});