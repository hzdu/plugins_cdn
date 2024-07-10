/* global ursc_widget_params. */
jQuery(function ($) {
	$(document).ready(function () {
		var $widget_container = $(
			"#user_registration_social_connect_dashboard_reporting"
		);

		var chart_canvas_area = $("#ursc-chart-report-area");
		var chart_options = {
			responsive: true,
			aspectRatio: 2,
			legend: {
				display: false,
			},
			legendCallback: function (chart) {
				var text = [];
				text.push('<ul class="ursc-legend-' + chart.id + '">');

				for (var i = 0; i < chart.data.labels.length; i++) {
					text.push(
						'<li><span class="ursc-color-tag" style="background-color:' +
							chart.data.datasets[0].backgroundColor[i] +
							'"></span>'
					);
					if (chart.data.labels[i]) {
						text.push(chart.data.labels[i]);
					}
					text.push("</li>");
				}
				text.push("</ul>");
				return text.join("");
			},
		};

		var data = {
			action: "user_registration_social_connect_dashboard_chart_widget",
			security: ursc_widget_params.widget_nonce,
		};

		$.post(ursc_widget_params.ajax_url, data, function (response) {
			var report = response.social_user_report;
			var other = response.others;

			$widget_container.find(".ursc-loading").hide();

			if (
				0 !== parseInt(response.social_total) &&
				0 !== parseInt(other.count)
			) {
				$widget_container.find(".ursc-chart").show();

				var networks = Object.keys(report).sort(),
					network_colors = [],
					count_data = [];

				networks.forEach(function (network) {
					network_colors.push(report[network].color);
					count_data.push(report[network].count);
				});

				// For other users.
				networks.push("Others");
				network_colors.push(other.color);
				count_data.push(other.count);

				var chart_data = {
					datasets: [
						{
							data: count_data,
							backgroundColor: network_colors,
						},
					],
					labels: networks,
				};
				var chart = new Chart(chart_canvas_area, {
					type: "doughnut",
					data: chart_data,
					options: chart_options,
				});

				$widget_container
					.find(".ursc-chart-report-legends")
					.html(chart.generateLegend());
				$widget_container
					.find(".ursc-total-social-reg .ursc-total")
					.text(response.social_total);
			} else {
				$widget_container.find(".no-user-found").show();
			}
		}).fail(function (xhr) {
			console.error(xhr.responseText);
		});
	});
});
