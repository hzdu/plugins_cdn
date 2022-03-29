/**
 * Generate Chart JS options based on constants and passed annotation variables
 *
 * @checkthis https://dev.to/t/chartjs
 *
 * @param  {object} annotations Annotation object containing an array of annotations
 * @return {object}             Options object
 */
function chartJSOptions(annotationChartHolder, max = null) {
    const fontFamily = 'Mulish, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Segoe UI Emoji", "Apple Color Emoji"';

    Chart.defaults.font.family = fontFamily;

    const lineOptionsArray = {
        plugins: {
            tooltip: {
                intersect: false,
                mode: 'index'
            },
            legend: {
                position: 'top',
                align: 'start',
                labels: {
                    usePointStyle: true,
                    boxWidth: 6,
                    fontColor: '#000000'
                },
            },
            scales: {
                yAxes: [{
                    ticks: {
                        fontFamily: fontFamily,
                        fontColor: '#000000',
                        beginAtZero: true,
                        min: 0,
                    },
                    pointLabels: {
                        fontFamily: fontFamily,
                        fontColor: '#000000'
                    }
                }],
                xAxes: [{
                    ticks: {
                        fontFamily: fontFamily,
                        fontColor: '#000000',
                        autoSkip: true,
                        maxTicksLimit: 4,
                        minRotation: 0,
                        maxRotation: 0,
                        //display: false,
                    }
                }]
            }
        }
    };

    // Use max = 100 for percentage values
    if (max === 100) {
        lineOptionsArray.scales.yAxes[0].ticks.max = 100;
    }

    return lineOptionsArray;
}

document.addEventListener('DOMContentLoaded', function () {
    /**
     * Options array for the line chart
     *
     * @type array
     */
    const fontFamily = 'Mulish, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Segoe UI Emoji", "Apple Color Emoji"';



    if (document.getElementById('chartjs-bar-values')) {
        /**
         * Get chart holder element
         */
        const barValuesChartHolder = document.getElementById('chartjs-bar-values');
        const fontFamily = 'Mulish, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Segoe UI Emoji", "Apple Color Emoji"';

        /**
         * Get chart holder data attributes (labels and datasets)
         */
        let datasets = barValuesChartHolder.dataset.sets.split('|'),
            ctxBarValues = barValuesChartHolder.getContext('2d');

        /**
         * Build the speed factors chart
         */
        let chartBarValues = new Chart(ctxBarValues, {
            //type: 'horizontalBar',
            type: 'bar',

            data: {
                labels: ['Timing'],
                datasets: [{
                    label: 'Lookup Time',
                    data: [datasets[0]],
                    backgroundColor: '#72C8B7'
                },
                {
                    label: 'Connect Time',
                    data: [datasets[1]],
                    backgroundColor: '#FD95B4'
                },
                {
                    label: 'PreTransfer Time',
                    data: [datasets[2]],
                    backgroundColor: '#A6DAF0'
                },
                {
                    label: 'Redirect Time',
                    data: [datasets[3]],
                    backgroundColor: '#E1BDDF'
                },
                {
                    label: 'StartTransfer Time',
                    data: [datasets[4]],
                    backgroundColor: '#EA987B'
                }]
            },

            options: {
                    indexAxis: 'y',
                plugins: {
                    tooltips: {
                        titleFontSize: 15,
                        titleFontFamily: fontFamily,
                        bodyFontFamily: fontFamily,
                        bodyFontSize: 14,
                        intersect: true,
                        mode: 'index',
                        enabled: true
                    },
                    scales: {
                        xAxes: [{
                            ticks: {
                                beginAtZero: true,
                                fontSize: 12
                            },
                            scaleLabel: {
                                display: false
                            },
                            gridLines: {
                            },
                            stacked: true
                        }],
                        yAxes: [{
                            gridLines: {
                                display: false,
                                color: "#fff",
                                zeroLineColor: "#fff",
                                zeroLineWidth: 0
                            },
                            ticks: {
                                fontSize: 12
                            },
                            stacked: false
                        }]
                    },
                    legend: {
                        display: true,
                        position: 'top',
                        align: 'start',
                    },
                }
            }
        });
    }



    if (document.getElementById('ttfb-bar-values')) {
        /**
         * Get chart holder element
         */
        const ttfbBarValuesChartHolder = document.getElementById('ttfb-bar-values');

        /**
         * Get chart holder data attributes (labels and datasets)
         */
        let dateArrayPiped = ttfbBarValuesChartHolder.dataset.labels.split('|'),
            datasets = ttfbBarValuesChartHolder.dataset.values.split('|'),
            datasetsBeacon = ttfbBarValuesChartHolder.dataset.valuesBeacon.split('|'),
            ctxTtfbBarValues = ttfbBarValuesChartHolder.getContext('2d');

        /**
         * Build the speed factors chart
         */
        let chartTtfbBarValues = new Chart(ctxTtfbBarValues, {
            type: 'line',

            data: {
                labels: dateArrayPiped,
                datasets: [{
                    label: 'Time to First Byte',
                    fill: false,
                    backgroundColor: '#0652DD',
                    borderColor: '#0652DD',
                    borderWidth: 2,
                    pointRadius: 0,
                    data: datasets,
                    tension: 0.2
                },
                {
                    label: 'Time to First Byte (Beacon)',
                    fill: false,
                    backgroundColor: '#009432',
                    borderColor: '#009432',
                    borderWidth: 2,
                    pointRadius: 0,
                    data: datasetsBeacon,
                    tension: 0.2
                }]
            },

            options: chartJSOptions(ttfbBarValuesChartHolder)
        });
    }



    if (document.getElementById('cwv-bar-values')) {
        /**
         * Get chart holder element
         */
        const cwvBarValuesChartHolder = document.getElementById('cwv-bar-values');

        /**
         * Get chart holder data attributes (labels and datasets)
         */
        let dateArrayPiped = cwvBarValuesChartHolder.dataset.labels.split('|'),
            datasetsCLS = cwvBarValuesChartHolder.dataset.valuesCls.split('|'),
            datasetsFCP = cwvBarValuesChartHolder.dataset.valuesFcp.split('|'),
            datasetsLCP = cwvBarValuesChartHolder.dataset.valuesLcp.split('|'),
            datasetsFID = cwvBarValuesChartHolder.dataset.valuesFid.split('|'),
            ctxCwvBarValues = cwvBarValuesChartHolder.getContext('2d');

        /**
         * Build the speed factors chart
         */
        let chartCwvBarValues = new Chart(ctxCwvBarValues, {
            type: 'line',

            data: {
                labels: dateArrayPiped,
                datasets: [{
                    label: 'Cumulative Layout Shift (CLS)',
                    fill: false,
                    backgroundColor: '#f9ca24',
                    borderColor: '#f9ca24',
                    borderWidth: 2,
                    pointRadius: 0,
                    data: datasetsCLS,
                    tension: 0.2
                },
                {
                    label: 'First Contentful Paint (FCP)',
                    fill: false,
                    backgroundColor: '#f0932b',
                    borderColor: '#f0932b',
                    borderWidth: 2,
                    pointRadius: 0,
                    data: datasetsFCP,
                    tension: 0.2
                },
                {
                    label: 'Largest Contentful Paint (LCP)',
                    fill: false,
                    backgroundColor: '#eb4d4b',
                    borderColor: '#eb4d4b',
                    borderWidth: 2,
                    pointRadius: 0,
                    data: datasetsLCP,
                    tension: 0.2
                },
                {
                    label: 'First Input Delay (FID)',
                    fill: false,
                    backgroundColor: '#6ab04c',
                    borderColor: '#6ab04c',
                    borderWidth: 2,
                    pointRadius: 0,
                    data: datasetsFID,
                    tension: 0.2
                }]
            },

            options: chartJSOptions(cwvBarValuesChartHolder)
        });
    }



    if (document.getElementById('chartjs-payload')) {
        /**
         * Get chart holder element
         */
        const payloadChartHolder = document.getElementById('chartjs-payload');

        /**
         * Get chart holder data attributes (labels and datasets)
         */
        let dateArrayPiped = payloadChartHolder.dataset.labels.split('|')
            siteAssetsImg = payloadChartHolder.dataset.assetsImg.split(','),
            siteAssetsCss = payloadChartHolder.dataset.assetsCss.split(','),
            siteAssetsJs = payloadChartHolder.dataset.assetsJs.split(','),
            ctxPayloadValues = payloadChartHolder.getContext('2d');

        /**
         * Build the security chart
         */
        let chartPayloadValues = new Chart(ctxPayloadValues, {
            type: 'line',

            data: {
                labels: dateArrayPiped,
                datasets: [{
                    label: 'Images',
                    data: siteAssetsImg,
                    fill: false,
                    borderColor: '#FD95B4', // Mint Hint
                    borderWidth: 2,
                    pointRadius: 0,
                    backgroundColor: '#FD95B4',
                    tension: 0.2
                },
                {
                    label: 'JavaScript',
                    data: siteAssetsJs,
                    fill: false,
                    borderColor: '#A6DAF0', // Mint Hint
                    borderWidth: 2,
                    pointRadius: 0,
                    backgroundColor: '#A6DAF0',
                    tension: 0.2
                },
                {
                    label: 'Stylesheets',
                    data: siteAssetsCss,
                    fill: false,
                    borderColor: '#E1BDDF', // Mint Hint
                    borderWidth: 2,
                    pointRadius: 0,
                    backgroundColor: '#E1BDDF',
                    tension: 0.2
                }]
            },

            options: chartJSOptions(payloadChartHolder)
        });



        /**
         * Get chart holder element
         */
        const payloadRequestsChartHolder = document.getElementById('chartjs-payload-requests');

        /**
         * Get chart holder data attributes (labels and datasets)
         */
        let dateRequestsArrayPiped = payloadRequestsChartHolder.dataset.labels.split('|')
            siteRequests = payloadRequestsChartHolder.dataset.requests.split(','),
            ctxPayloadRequestsValues = payloadRequestsChartHolder.getContext('2d');

        /**
         * Build the security chart
         */
        let chartPayloadRequestsValues = new Chart(ctxPayloadRequestsValues, {
            type: 'line',

            data: {
                labels: dateRequestsArrayPiped,
                datasets: [{
                    label: 'Requests',
                    data: siteRequests,
                    fill: false,
                    borderColor: '#72C8B7', // Mint Hint
                    borderWidth: 2,
                    pointRadius: 0,
                    backgroundColor: '#72C8B7',
                    tension: 0.2
                }]
            },

            options: chartJSOptions(payloadRequestsChartHolder)
        });
    }
});
