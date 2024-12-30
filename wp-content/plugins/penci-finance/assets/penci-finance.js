(function ($) {
    "use strict";
    var ELFINANCE = ELFINANCE || {};

    ELFINANCE.general = function () {
        $('.penci-fncrypto-table').each(function() {
            var t = $(this),
                id = t.attr('id');

            if ( ! $.fn.dataTable.isDataTable( '#' + id ) ) {
                t.DataTable({
                    paging: false,
                    searching: false,
                    columnDefs: [{ width: '10px', targets: 0 },{ width: '120px', targets: 1 }]
                });
            }
        });
        $('.pcfic-chart').each(function() {
            // Check if the custom class "chart-loaded" is already added
            if (!$(this).hasClass('chart-loaded')) {
                const ctx = $(this)[0].getContext('2d');
        
                // Extract the chart data from the data-chart attribute
                const chartData = $(this).data('chart').split(',').map(Number); // Convert the string data to an array of numbers
                const chartBackgroundColor = getComputedStyle(this).getPropertyValue('--upbdcl').trim();
                const bgColor = getComputedStyle(this).getPropertyValue('--upbgcl').trim();
        
                // Generate the Chart.js chart
                const myChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: chartData.map((_, index) => `Label ${index + 1}`), // Create labels for each data point
                        datasets: [{
                            data: chartData,  // Use the extracted data
                            backgroundColor: bgColor,  // Area under the line
                            borderColor: chartBackgroundColor,        // Line color
                            borderWidth: 2,
                            fill: true,
                            pointRadius: 0 // No points on the line
                        }]
                    },
                    options: {
                        plugins: {
                            legend: {
                                display: false  // No legend
                            },
                            tooltip: {
                                enabled: false  // No tooltip
                            }
                        },
                        scales: {
                            x: {
                                display: false  // No X axis
                            },
                            y: {
                                display: false  // No Y axis
                            }
                        },
                        elements: {
                            line: {
                                tension: 0.4  // Smooth curve
                            }
                        },
                        maintainAspectRatio: false, // Allow the chart to resize with the container
                        responsive: true            // Make the chart responsive
                    }
                });
        
                // Once the chart is fully loaded, add the custom class
                $(this).addClass('chart-loaded');
            }
        });        

        $('.marquee3k').each( function(){
            var t = $(this);

            if ( ! t.find('.js-marquee-wrapper').length ) {
                t.marquee({
                    speed: 50,
                    gap: 30,
                    delayBeforeStart: 0,
                    direction: $('body').hasClass('rtl') ? 'right' : 'left',
                    duplicated: true,
                    pauseOnHover: true,
                    startVisible: true,
                });
            }
        });
        return false;
    }

    $(window).on('elementor/frontend/init', function () {
        if ( window.elementorFrontend && window.elementorFrontend.isEditMode() ) {

            elementorFrontend.hooks.addAction('frontend/element_ready/penci-finance-elementor-crypto.default', function ($scope) {
                ELFINANCE.general();
            });
            
            elementorFrontend.hooks.addAction('frontend/element_ready/penci-finance-elementor.default', function ($scope) {
                ELFINANCE.general();
            });
            
        }
    });

    $(document).ready(function () {
        ELFINANCE.general();
    });

})(jQuery);	// EOF