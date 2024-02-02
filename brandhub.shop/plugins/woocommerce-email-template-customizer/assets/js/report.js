jQuery(document).ready(function ($) {
    'use strict';

    const viwecReportApp = {
        chart: '',

        init() {
            this.drawChart();
        },

        generateColors(length) {
            let colors = ['#00a099', ''];
            let start = 16711680, end = 0;
            let range = (start - end) / (length - 2);

            for (let i = 0; i < length - 2; i++) {
                colors.push('#' + ((start - range * i)).toString(16));
            }
            return colors;
        },

        drawChart() {
            let chartCanvas = $('#viwec-report-chart'),
                ctx = chartCanvas.get(0).getContext('2d'),
                height = viwecParams.chartLabel.length * 30 + 60,
                bgColor = this.generateColors(viwecParams.chartLabel.length);

            chartCanvas.css('height', height + 'px');
            var horizontalBarChartData = {
                labels: viwecParams.chartLabel,
                datasets: [{
                    backgroundColor: 'rgba(0,160,160,0.5)',
                    borderColor: '#00a0a0',
                    borderWidth: 0,
                    data: viwecParams.chartData
                }]
            };

            this.chart = new Chart(ctx, {
                type: 'horizontalBar',
                data: horizontalBarChartData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    legend: {
                        display: false,
                    },

                    scales: {
                        xAxes: [
                            {ticks: {beginAtZero: true, min: 0, precision: 0}},
                        ],
                        yAxes: [{
                            gridLines: {
                                display: false,
                            }
                        }],
                    }
                }
            });
        },
    };

    viwecReportApp.init();
});