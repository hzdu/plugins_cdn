document.addEventListener('DOMContentLoaded', function () {
    let colors = ['#18b663', '#fb8c00', '#e53935'],
        v;

    if (document.querySelector('.lhf-sf-metric-value.lhf-sf-metric-value--dns')) {
        let timing_dns_value = document.querySelector('.lhf-sf-metric-value--dns').dataset.value;

        // 20-120
        document.querySelector('.lhf-sf-metric-value--dns').style = 'color: ' + (timing_dns_value => {
            v = parseFloat(timing_dns_value);

            if (v <= 120) {
                return colors[0];
            } else if (v > 120 && v <= 240) {
                return colors[1];
            } else {
                return colors[2];
            }
        })(timing_dns_value) + ';';
    }

    if (document.querySelector('.lhf-sf-metric-value.lhf-sf-metric-value--tcp')) {
        let timing_tcp_value = document.querySelector('.lhf-sf-metric-value--tcp').dataset.value;

        // <200
        document.querySelector('.lhf-sf-metric-value--tcp').style = 'color: ' + (timing_tcp_value => {
            v = parseFloat(timing_tcp_value);

            if (v <= 180) {
                return colors[0];
            } else if (v > 180 && v <= 240) {
                return colors[1];
            } else {
                return colors[2];
            }
        })(timing_tcp_value) + ';';
    }

    if (document.querySelector('.lhf-sf-metric-value.lhf-sf-metric-value--redirect')) {
        let timing_redirect_value = document.querySelector('.lhf-sf-metric-value--redirect').dataset.value;

        // <200
        document.querySelector('.lhf-sf-metric-value--redirect').style = 'color: ' + (timing_redirect_value => {
            v = parseFloat(timing_redirect_value);

            if (v <= 0) {
                return colors[0];
            } else if (v > 0 && v <= 20) {
                return colors[1];
            } else {
                return colors[2];
            }
        })(timing_redirect_value) + ';';
    }

    if (document.querySelector('.lhf-sf-metric-value.lhf-sf-metric-value--ttfb')) {
        let timing_ttfb_value = document.querySelector('.lhf-sf-metric-value--ttfb').dataset.value;

        document.querySelector('.lhf-sf-metric-value--ttfb').style = 'color: ' + (timing_ttfb_value => {
            v = parseFloat(timing_ttfb_value);

            if (v <= 200) {
                return colors[0];
            } else if (v > 200 && v <= 400) {
                return colors[1];
            } else {
                return colors[2];
            }
        })(timing_ttfb_value) + ';';
    }

    if (document.querySelector('.lhf-sf-metric-value.lhf-sf-metric-value--dlt')) {
        let timing_dlt_value = document.querySelector('.lhf-sf-metric-value--dlt').dataset.value;

        // DLT: Document Loaded (DOMLoaded) Time is roughly the same as TTFB
        document.querySelector('.lhf-sf-metric-value--dlt').style = 'color: ' + (timing_dlt_value => {
            v = parseFloat(timing_dlt_value);

            if (v <= 200) {
                return colors[0];
            } else if (v > 200 && v <= 400) {
                return colors[1];
            } else {
                return colors[2];
            }
        })(timing_dlt_value) + ';';
    }

    if (document.querySelector('.lhf-sf-metric-value.lhf-sf-metric-value--fcp')) {
        let timing_fcp_value = document.querySelector('.lhf-sf-metric-value--fcp').dataset.value;

        // 0 – 1.8 Green (fast)
        // 1.8 – 3 Orange (moderate)
        // Over 3 Red (slow)
        document.querySelector('.lhf-sf-metric-value--fcp').style = 'color: ' + (timing_fcp_value => {
            v = parseFloat(timing_fcp_value);

            if (v <= 1.8) {
                return colors[0];
            } else if (v > 1.8 && v <= 3) {
                return colors[1];
            } else {
                return colors[2];
            }
        })(timing_fcp_value) + ';';
    }

    if (document.querySelector('.lhf-sf-metric-value.lhf-sf-metric-value--lcp')) {
        let timing_lcp_value = document.querySelector('.lhf-sf-metric-value--lcp').dataset.value;

        // 0 – 2.5 Green (fast)
        // 2.5 – 4 Orange (moderate)
        // Over 4 Red (slow)
        document.querySelector('.lhf-sf-metric-value--lcp').style = 'color: ' + (timing_lcp_value => {
            v = parseFloat(timing_lcp_value);

            if (v <= 2.5) {
                return colors[0];
            } else if (v > 2.5 && v <= 4) {
                return colors[1];
            } else {
                return colors[2];
            }
        })(timing_lcp_value) + ';';
    }

    if (document.querySelector('.lhf-sf-metric-value.lhf-sf-metric-value--fid')) {
        let timing_fid_value = document.querySelector('.lhf-sf-metric-value--fid').dataset.value;

        // 0 – 100 Green (fast)
        // 100 – 300 Orange (moderate)
        // Over 300 Red (slow)
        document.querySelector('.lhf-sf-metric-value--fid').style = 'color: ' + (timing_fid_value => {
            v = parseFloat(timing_fid_value);

            if (v <= 100) {
                return colors[0];
            } else if (v > 100 && v <= 300) {
                return colors[1];
            } else {
                return colors[2];
            }
        })(timing_fid_value) + ';';
    }

    if (document.querySelector('.lhf-sf-metric-value.lhf-sf-metric-value--cls')) {
        let timing_cls_value = document.querySelector('.lhf-sf-metric-value--cls').dataset.value;

        // 0 – 100 Green (fast)
        // 100 – 300 Orange (moderate)
        // Over 300 Red (slow)
        document.querySelector('.lhf-sf-metric-value--cls').style = 'color: ' + (timing_cls_value => {
            v = parseFloat(timing_cls_value);

            if (v <= 0.1) {
                return colors[0];
            } else if (v > 0.1 && v <= 0.25) {
                return colors[1];
            } else {
                return colors[2];
            }
        })(timing_cls_value) + ';';
    }



    // Sparkline Lab
    if (document.getElementById('sparkline-payload')) {
        var dataLabels = document.getElementById('sparkline-payload').dataset.labels;
        var dataValues = document.getElementById('sparkline-payload').dataset.values;

        dataLabels = dataLabels.split('|');
        dataValues = dataValues.split(',');

        SparklineGenerator('sparkline-payload', 'Site Assets', dataLabels, dataValues);
    }
});



/**
 * Generate a Sparkline chart
 *
 * Uses https://github.com/fnando/sparkline
 *
 * @param       {String} [element]    Element ID
 * @param       {String} [title]      Chart title
 * @param       {Array}  [dataLabels] Array of labels
 * @param       {Array}  [dataValues] Array of values
 * @constructor
 */
function SparklineGenerator(elementId, title, dataLabels, dataValues) {
    var sparklineChart = [];

    dataLabels.forEach(function (label, index) {
        sparklineChart.push({
            name: title,
            date: label,
            value: dataValues[index]
        });
    });

    var options = {
        onmousemove(event, datapoint) {
            var svg = findClosest(event.target, 'svg');
            var tooltip = svg.nextElementSibling;

            tooltip.hidden = false;
            tooltip.textContent = `${datapoint.date}: ${datapoint.value}`;
        },
        onmouseout() {
            var svg = findClosest(event.target, 'svg');
            var tooltip = svg.nextElementSibling;

            tooltip.textContent = tooltip.dataset.default;
        }
    };

    sparkline.sparkline(document.getElementById(elementId), sparklineChart, options);
}



function findClosest(target, tagName) {
    if (target.tagName === tagName) {
        return target;
    }

    while ((target = target.parentNode)) {
        if (target.tagName === tagName) {
            break;
        }
    }

    return target;
}
