/* global user_registration_email_templates_preview_script_data */
(function ($, data) {
	var settings =
			"user_registration_email_templates[" + data.template_id + "]",
		container = $(".user-registration-email-body"),
		wrapper = container.find(".user-registration-email"),
		controls_wrapper = $(parent.document).find("#customize-controls"),
		preview_buttons = controls_wrapper.find(
			"#customize-footer-actions .devices button"
		);
	(control_selector =
		"customize-control-user_registration_styles-" + data.form_id + "-"),
		(dimension_directions = ["top", "right", "bottom", "left"]);

	/**
	 * Add Google font link into header.
	 *
	 * @param {string} font_name Google Font Name.
	 */
	function addGoogleFont(font_name) {
		var font_plus = "",
			font_name = font_name.split(" ");

		if (Array.isArray(font_name)) {
			font_plus = font_name[0];
			for (var i = 1; i < font_name.length; i++) {
				font_plus = font_plus + "+" + font_name[i];
			}
		}

		$(
			'<link href="https://fonts.googleapis.com/css?family=' +
				font_plus +
				'" rel="stylesheet" type="text/css">'
		).appendTo("head");
	}

	/*
	 * General
	 *
	 * Includes global stylings
	 */
	// Headings (h1 - h6): font_family
	wp.customize(settings + "[general][font_family]", function (value) {
		value.bind(function (newval) {
			if ("" === newval) {
				wrapper.css("font-family", "inherit");
				wrapper
					.find("h1, h2, h3, h4, h5, h6")
					.css("font-family", "inherit");
			} else {
				addGoogleFont(newval);
				wrapper
					.find("h1, h2, h3, h4, h5, h6")
					.css("font-family", newval);
			}
		});
	});

	// Headings (h1 - h6): line_height
	wp.customize(settings + "[general][line_height]", function (value) {
		value.bind(function (newval) {
			wrapper.find("h1, h2, h3, h4, h5, h6").css("line-height", newval);
		});
	});

	// Headings (h1): font_size
	wp.customize(settings + "[general][font_size_1]", function (value) {
		value.bind(function (newval) {
			wrapper
				.find("h1")
				.attr("style", "font-size: " + newval + "px !important");
		});
	});

	// Headings (h1): font_color
	wp.customize(settings + "[general][colors_heading_1]", function (value) {
		value.bind(function (newval) {
			wrapper.find("h1").css("color", newval);
		});
	});

	// Headings (h1): line_height
	wp.customize(settings + "[general][line_height_1]", function (value) {
		value.bind(function (newval) {
			wrapper.find("h1").css("line-height", newval);
		});
	});

	// Headings (h2): font_size
	wp.customize(settings + "[general][font_size_2]", function (value) {
		value.bind(function (newval) {
			wrapper
				.find("h2")
				.attr("style", "font-size: " + newval + "px !important");
		});
	});

	// Headings (h2): font_color
	wp.customize(settings + "[general][colors_heading_2]", function (value) {
		value.bind(function (newval) {
			wrapper.find("h2").css("color", newval);
		});
	});

	// Headings (h2): line_height
	wp.customize(settings + "[general][line_height_2]", function (value) {
		value.bind(function (newval) {
			wrapper.find("h2").css("line-height", newval);
		});
	});

	// Headings (h3): font_size
	wp.customize(settings + "[general][font_size_3]", function (value) {
		value.bind(function (newval) {
			wrapper
				.find("h3")
				.attr("style", "font-size: " + newval + "px !important");
		});
	});

	// Headings (h3): font_color
	wp.customize(settings + "[general][colors_heading_3]", function (value) {
		value.bind(function (newval) {
			wrapper.find("h3").css("color", newval);
		});
	});

	// Headings (h3): line_height
	wp.customize(settings + "[general][line_height_3]", function (value) {
		value.bind(function (newval) {
			wrapper.find("h3").css("line-height", newval);
		});
	});

	// Headings (h4): font_size
	wp.customize(settings + "[general][font_size_4]", function (value) {
		value.bind(function (newval) {
			wrapper
				.find("h4")
				.attr("style", "font-size: " + newval + "px !important");
		});
	});

	// Headings (h4): font_color
	wp.customize(settings + "[general][colors_heading_4]", function (value) {
		value.bind(function (newval) {
			wrapper.find("h4").css("color", newval);
		});
	});

	// Headings (h5): font_size
	wp.customize(settings + "[general][font_size_5]", function (value) {
		value.bind(function (newval) {
			wrapper
				.find("h5")
				.attr("style", "font-size: " + newval + "px !important");
		});
	});

	// Headings (h5): font_color
	wp.customize(settings + "[general][colors_heading_5]", function (value) {
		value.bind(function (newval) {
			wrapper.find("h5").css("color", newval);
		});
	});

	// Headings (h6): font_size
	wp.customize(settings + "[general][font_size_6]", function (value) {
		value.bind(function (newval) {
			wrapper.find("h6").attr("style", "font-size: " + newval + "px");
		});
	});

	// Headings (h6): font_color
	wp.customize(settings + "[general][colors_heading_6]", function (value) {
		value.bind(function (newval) {
			wrapper.find("h6").css("color", newval);
		});
	});

	// Text: font_family
	wp.customize(settings + "[general][font_family_text]", function (value) {
		value.bind(function (newval) {
			if ("" === newval) {
				wrapper.css("font-family", "inherit");
				wrapper.css("font-family", "inherit");
			} else {
				addGoogleFont(newval);
				wrapper.css("font-family", newval);
			}
		});
	});

	// Text: font_color
	wp.customize(settings + "[general][colors_text]", function (value) {
		value.bind(function (newval) {
			wrapper.css("color", newval);
		});
	});

	// Text: font_size
	wp.customize(settings + "[general][font_size_text]", function (value) {
		value.bind(function (newval) {
			wrapper.attr("style", "font-size: " + newval + "px");
		});
	});

	// Text: line_height
	wp.customize(settings + "[general][line_height_text]", function (value) {
		value.bind(function (newval) {
			wrapper.css("line-height", newval);
		});
	});

	// Link: font_color
	wp.customize(settings + "[general][colors_link]", function (value) {
		value.bind(function (newval) {
			wrapper.find("a").css("color", newval);
		});
	});

	/*
	 * Container
	 *
	 * Styles for email container and body
	 */
	// Outside Container: background_color
	wp.customize(
		settings + "[container][background_color_outside]",
		function (value) {
			value.bind(function (newval) {
				container.css("background-color", newval);
			});
		}
	);

	// Outside Container: padding
	wp.customize(settings + "[container][padding_outside]", function (value) {
		preview_buttons.on("click", function () {
			var control_value = value.get();
			var active_responsive_device = $(this).data("device");
			var default_unit = "px";

			container.css("padding", "");
			if (typeof control_value[active_responsive_device] == "undefined") {
				active_responsive_device = "desktop";
			}
			$.each(
				control_value[active_responsive_device],
				function (prop, val) {
					container.css("padding-" + prop, val + default_unit);
				}
			);
		});
		value.bind(function (newval) {
			var default_unit = "px";
			var active_responsive_device = controls_wrapper
				.find("#customize-footer-actions .devices button.active")
				.data("device");

			if (typeof newval != "object") {
				newval = JSON.parse(newval);
			}
			$.each(newval[active_responsive_device], function (prop, val) {
				container.css("padding-" + prop, val + default_unit);
			});
		});
	});

	// Inside Container: width
	wp.customize(settings + "[container][width]", function (value) {
		value.bind(function (newval) {
			wrapper.css("max-width", newval + "px");
		});
	});

	// Inside Container: background_color
	wp.customize(
		settings + "[container][background_color_inside]",
		function (value) {
			value.bind(function (newval) {
				wrapper.css("background-color", newval);
			});
		}
	);

	// Inside Container: background_image
	wp.customize(settings + "[container][background_image]", function (value) {
		value.bind(function (newval) {
			wrapper.css("background-image", "url(" + newval + ")");
		});
	});

	// Inside Container: background_size
	wp.customize(settings + "[container][background_size]", function (value) {
		value.bind(function (newval) {
			wrapper.css("background-size", newval);
		});
	});

	// Inside Container: background_position_x
	wp.customize(
		settings + "[container][background_position_x]",
		function (value) {
			value.bind(function (newval) {
				var position = newval;
				wp.customize(
					settings + "[container][background_position_y]",
					function (value) {
						position += " " + value.get();
					}
				);
				wrapper.css("background-position", position);
			});
		}
	);

	// Inside Container: background_position_y
	wp.customize(
		settings + "[container][background_position_y]",
		function (value) {
			value.bind(function (newval) {
				var position = "";
				wp.customize(
					settings + "[container][background_position_x]",
					function (value) {
						position += value.get();
					}
				);
				position += " " + newval;
				wrapper.css("background-position", position);
			});
		}
	);

	// Inside Container: background_repeat
	wp.customize(settings + "[container][background_repeat]", function (value) {
		value.bind(function (newval) {
			wrapper.css("background-repeat", newval);
		});
	});

	// Inside Container: border_type
	wp.customize(settings + "[container][border_type]", function (value) {
		value.bind(function (newval) {
			wrapper.css("border-style", newval);

			wp.customize(
				settings + "[container][border_color]",
				function (value) {
					wrapper.css("border-color", value.get());
				}
			);
		});
	});

	// Inside Container: border_width
	wp.customize(settings + "[container][border_width]", function (value) {
		value.bind(function (newval) {
			var default_unit = "px";

			if (typeof newval != "object") {
				newval = JSON.parse(newval);
			}

			$.each(newval, function (prop, val) {
				if (dimension_directions.indexOf(prop) != -1) {
					wrapper.css(
						"border-" + prop + "-width",
						val + default_unit
					);
				}
			});
		});
	});

	// Inside Container: border_color
	wp.customize(settings + "[container][border_color]", function (value) {
		value.bind(function (newval) {
			wrapper.css("border-color", newval);
		});
	});

	// Inside Container: border_radius
	wp.customize(settings + "[container][border_radius]", function (value) {
		value.bind(function (newval) {
			if (typeof newval != "object") {
				newval = JSON.parse(newval);
			}

			var unit = newval["unit"];

			$.each(newval, function (prop, val) {
				switch (prop) {
					case "top":
						wrapper.css("border-top-left-radius", val + unit);
						break;
					case "right":
						wrapper.css("border-top-right-radius", val + unit);
						break;
					case "bottom":
						wrapper.css("border-bottom-right-radius", val + unit);
						break;
					case "left":
						wrapper.css("border-bottom-left-radius", val + unit);
						break;
				}
			});
		});
	});

	// Inside Container: padding
	wp.customize(settings + "[container][padding_inside]", function (value) {
		preview_buttons.on("click", function () {
			var control_value = value.get();
			var active_responsive_device = $(this).data("device");
			var default_unit = "px";

			wrapper.css("padding", "");
			if (typeof control_value[active_responsive_device] == "undefined") {
				active_responsive_device = "desktop";
			}
			$.each(
				control_value[active_responsive_device],
				function (prop, val) {
					wrapper.css("padding-" + prop, val + default_unit);
				}
			);
		});
		value.bind(function (newval) {
			var default_unit = "px";
			var active_responsive_device = controls_wrapper
				.find("#customize-footer-actions .devices button.active")
				.data("device");

			if (typeof newval != "object") {
				newval = JSON.parse(newval);
			}
			$.each(newval[active_responsive_device], function (prop, val) {
				wrapper.css("padding-" + prop, val + default_unit);
			});
		});
	});

	/*
	 * Email Header
	 *
	 * Includes header logo, content and layout stylings
	 */
	// Logo Styles - Upload logo
	wp.customize(settings + "[header][logo_image]", function (value) {
		value.bind(function (newval) {
			wrapper.find("thead .user-registration-email__brand-logo").show();
			wrapper
				.find("thead .user-registration-email__brand-logo img")
				.attr("src", newval);
		});
	});

	// Logo Styles: width
	wp.customize(settings + "[header][logo_width]", function (value) {
		value.bind(function (newval) {
			wrapper
				.find("thead .user-registration-email__brand-logo img")
				.css("max-width", newval + "px");
		});
	});

	// Logo Styles - Alignment.
	wp.customize(settings + "[header][logo_inline]", function (value) {
		value.bind(function (newval) {
			wrapper
				.find("thead .user-registration-email__brand")
				.removeClass("user-registration-email__brand--vertical");
			wrapper
				.find("thead .user-registration-email__brand")
				.removeClass("user-registration-email__brand--left");
			if (true === newval) {
				wrapper
					.find("thead .user-registration-email__brand")
					.addClass("user-registration-email__brand--vertical");
			} else {
				wrapper
					.find("thead .user-registration-email__brand")
					.addClass("user-registration-email__brand--left");
			}
		});
	});

	// Logo Styles - Edit Logo title.
	wp.customize(settings + "[header][logo_title]", function (value) {
		value.bind(function (newval) {
			wrapper
				.find("thead .user-registration-email__brand__title")
				.html(newval);
		});
	});

	// Logo Styles - Logo title: font_size
	wp.customize(settings + "[header][font_size_logo_title]", function (value) {
		value.bind(function (newval) {
			wrapper
				.find(
					".user-registration-email__brand .user-registration-email__brand__title"
				)
				.css("font-size", newval);
		});
	});

	// Logo Styles - Logo title: font_color
	wp.customize(
		settings + "[header][font_color_logo_title]",
		function (value) {
			value.bind(function (newval) {
				wrapper
					.find(
						".user-registration-email__brand .user-registration-email__brand__title"
					)
					.css("color", newval);
			});
		}
	);

	// Logo Styles - Logo title: margin
	wp.customize(settings + "[header][margin_logo_title]", function (value) {
		preview_buttons.on("click", function () {
			var control_value = value.get();
			var active_responsive_device = $(this).data("device");
			var default_unit = "px";

			container.css("margin", "");
			if (typeof control_value[active_responsive_device] == "undefined") {
				active_responsive_device = "desktop";
			}
			$.each(
				control_value[active_responsive_device],
				function (prop, val) {
					wrapper
						.find(
							".user-registration-email__brand .user-registration-email__brand__title"
						)
						.css("margin-" + prop, val + default_unit);
				}
			);
		});
		value.bind(function (newval) {
			var active_responsive_device = controls_wrapper
				.find("#customize-footer-actions .devices button.active")
				.data("device");
			var default_unit = "px";

			if (typeof newval != "object") {
				newval = JSON.parse(newval);
			}
			$.each(newval[active_responsive_device], function (prop, val) {
				wrapper
					.find(
						".user-registration-email__brand .user-registration-email__brand__title"
					)
					.css("margin-" + prop, val + default_unit);
			});
		});
	});

	// Logo Styles - Edit Logo tagline.
	wp.customize(settings + "[header][logo_tagline]", function (value) {
		value.bind(function (newval) {
			wrapper
				.find("thead .user-registration-email__brand__desc")
				.html(newval);
		});
	});

	// Logo Styles - Logo tagline: font_size
	wp.customize(
		settings + "[header][font_size_logo_tagline]",
		function (value) {
			value.bind(function (newval) {
				wrapper
					.find(
						".user-registration-email__brand .user-registration-email__brand__desc"
					)
					.css("font-size", newval);
			});
		}
	);

	// Logo Styles - Logo tagline: font_color
	wp.customize(
		settings + "[header][font_color_logo_tagline]",
		function (value) {
			value.bind(function (newval) {
				wrapper
					.find(
						".user-registration-email__brand .user-registration-email__brand__desc"
					)
					.css("color", newval);
			});
		}
	);

	// Logo Styles - Logo tagline: margin
	wp.customize(settings + "[header][margin_logo_tagline]", function (value) {
		preview_buttons.on("click", function () {
			var control_value = value.get();
			var active_responsive_device = $(this).data("device");
			var default_unit = "px";

			container.css("margin", "");
			if (typeof control_value[active_responsive_device] == "undefined") {
				active_responsive_device = "desktop";
			}
			$.each(
				control_value[active_responsive_device],
				function (prop, val) {
					wrapper
						.find(
							".user-registration-email__brand .user-registration-email__brand__desc"
						)
						.css("margin-" + prop, val + default_unit);
				}
			);
		});
		value.bind(function (newval) {
			var active_responsive_device = controls_wrapper
				.find("#customize-footer-actions .devices button.active")
				.data("device");
			var default_unit = "px";

			if (typeof newval != "object") {
				newval = JSON.parse(newval);
			}
			$.each(newval[active_responsive_device], function (prop, val) {
				wrapper
					.find(
						".user-registration-email__brand .user-registration-email__brand__desc"
					)
					.css("margin-" + prop, val + default_unit);
			});
		});
	});

	// Header Content - Editor.
	wp.customize(settings + "[header][editor]", function (value) {
		value.bind(function (newval) {
			wrapper
				.find("thead .user-registration-email__header__content")
				.html(newval);
		});
	});

	// Header layout Alignment.
	wp.customize(settings + "[header][header_layout]", function (value) {
		value.bind(function (newval) {
			wrapper
				.find("thead .user-registration-email__header")
				.removeClass("user-registration-email__header--left");
			wrapper
				.find("thead .user-registration-email__header")
				.removeClass("user-registration-email__header--right");
			wrapper
				.find("thead .user-registration-email__header")
				.removeClass("user-registration-email__header--center");
			wrapper
				.find("thead .user-registration-email__header")
				.removeClass("user-registration-email__header--vertical");
			wrapper
				.find("thead .user-registration-email__header")
				.addClass("user-registration-email__header--" + newval);
		});
	});

	// Header layout: background_color
	wp.customize(settings + "[header][background_color]", function (value) {
		value.bind(function (newval) {
			wrapper
				.find("thead .user-registration-email__header")
				.css("background-color", newval);
		});
	});

	// Header Layout: background_image
	wp.customize(settings + "[header][background_image]", function (value) {
		value.bind(function (newval) {
			wrapper
				.find("thead .user-registration-email__header")
				.css("background-image", "url(" + newval + ")");
		});
	});

	// Header Layout: background_size
	wp.customize(settings + "[header][background_size]", function (value) {
		value.bind(function (newval) {
			wrapper
				.find("thead .user-registration-email__header")
				.css("background-size", newval);
		});
	});

	// Header Layout: background_position_x
	wp.customize(
		settings + "[header][background_position_x]",
		function (value) {
			value.bind(function (newval) {
				var position = newval;
				wp.customize(
					settings + "[header][background_position_y]",
					function (value) {
						position += " " + value.get();
					}
				);
				wrapper
					.find("thead .user-registration-email__header")
					.css("background-position", position);
			});
		}
	);

	// Header Layout: background_position_y
	wp.customize(
		settings + "[header][background_position_y]",
		function (value) {
			value.bind(function (newval) {
				var position = "";
				wp.customize(
					settings + "[header][background_position_x]",
					function (value) {
						position += value.get();
					}
				);
				position += " " + newval;
				wrapper
					.find("thead .user-registration-email__header")
					.css("background-position", position);
			});
		}
	);

	// Header Layout: background_repeat
	wp.customize(settings + "[header][background_repeat]", function (value) {
		value.bind(function (newval) {
			wrapper
				.find("thead .user-registration-email__header")
				.css("background-repeat", newval);
		});
	});

	// Header Layout: border_type
	wp.customize(settings + "[header][border_type]", function (value) {
		value.bind(function (newval) {
			wrapper
				.find("thead .user-registration-email__header")
				.css("border-style", newval);

			wp.customize(settings + "[header][border_color]", function (value) {
				wrapper
					.find("thead .user-registration-email__header")
					.css("border-color", value.get());
			});
		});
	});

	// Header Layout: border_width
	wp.customize(settings + "[header][border_width]", function (value) {
		value.bind(function (newval) {
			var default_unit = "px";

			if (typeof newval != "object") {
				newval = JSON.parse(newval);
			}

			$.each(newval, function (prop, val) {
				if (dimension_directions.indexOf(prop) != -1) {
					wrapper
						.find("thead .user-registration-email__header")
						.css("border-" + prop + "-width", val + default_unit);
				}
			});
		});
	});

	// Header Layout: border_color
	wp.customize(settings + "[header][border_color]", function (value) {
		value.bind(function (newval) {
			wrapper
				.find("thead .user-registration-email__header")
				.css("border-color", newval);
		});
	});

	// Header Layout: border_radius
	wp.customize(settings + "[header][border_radius]", function (value) {
		value.bind(function (newval) {
			if (typeof newval != "object") {
				newval = JSON.parse(newval);
			}

			var unit = newval["unit"];

			$.each(newval, function (prop, val) {
				switch (prop) {
					case "top":
						wrapper
							.find("thead .user-registration-email__header")
							.css("border-top-left-radius", val + unit);
						break;
					case "right":
						wrapper
							.find("thead .user-registration-email__header")
							.css("border-top-right-radius", val + unit);
						break;
					case "bottom":
						wrapper
							.find("thead .user-registration-email__header")
							.css("border-bottom-right-radius", val + unit);
						break;
					case "left":
						wrapper
							.find("thead .user-registration-email__header")
							.css("border-bottom-left-radius", val + unit);
						break;
				}
			});
		});
	});

	// Header Layout: padding
	wp.customize(settings + "[header][padding]", function (value) {
		preview_buttons.on("click", function () {
			var control_value = value.get();
			var active_responsive_device = $(this).data("device");
			var default_unit = "px";

			wrapper
				.find("thead .user-registration-email__header")
				.css("padding", "");
			if (typeof control_value[active_responsive_device] == "undefined") {
				active_responsive_device = "desktop";
			}
			$.each(
				control_value[active_responsive_device],
				function (prop, val) {
					wrapper
						.find("thead .user-registration-email__header")
						.css("padding-" + prop, val + default_unit);
				}
			);
		});
		value.bind(function (newval) {
			var default_unit = "px";
			var active_responsive_device = controls_wrapper
				.find("#customize-footer-actions .devices button.active")
				.data("device");

			if (typeof newval != "object") {
				newval = JSON.parse(newval);
			}
			$.each(newval[active_responsive_device], function (prop, val) {
				wrapper
					.find("thead .user-registration-email__header")
					.css("padding-" + prop, val + default_unit);
			});
		});
	});

	/*
	 * Email Body
	 *
	 * Includes email body (tbody) styles
	 */
	// Email Body: font_color_headings
	wp.customize(
		settings + "[email_body][font_color_heading]",
		function (value) {
			value.bind(function (newval) {
				wrapper
					.find(
						"tbody h1, tbody h2, tbody h3, tbody h4, tbody h5, tbody h6"
					)
					.css("color", newval);
			});
		}
	);

	// Email Body: font_color
	wp.customize(settings + "[email_body][font_color]", function (value) {
		value.bind(function (newval) {
			wrapper.find("tbody").css("color", newval);
		});
	});

	// Email Body: link_color
	wp.customize(settings + "[email_body][font_color_link]", function (value) {
		value.bind(function (newval) {
			wrapper.find("tbody a").css("color", newval);
		});
	});

	// Email body: background_color
	wp.customize(settings + "[email_body][background_color]", function (value) {
		value.bind(function (newval) {
			container
				.find(".user-registration-email > tbody")
				.css("background-color", newval);
		});
	});
	// Email Body: background_image
	wp.customize(settings + "[email_body][background_image]", function (value) {
		value.bind(function (newval) {
			container
				.find(".user-registration-email > tbody")
				.css("background-image", "url(" + newval + ")");
		});
	});

	// Email body: background_size
	wp.customize(settings + "[email_body][background_size]", function (value) {
		value.bind(function (newval) {
			container
				.find(".user-registration-email > tbody")
				.css("background-size", newval);
		});
	});

	// Email body: background_position_x
	wp.customize(
		settings + "[email_body][background_position_x]",
		function (value) {
			value.bind(function (newval) {
				var position = newval;
				wp.customize(
					settings + "[email_body][background_position_y]",
					function (value) {
						position += " " + value.get();
					}
				);
				container
					.find(".user-registration-email > tbody")
					.css("background-position", position);
			});
		}
	);

	// Email body: background_position_y
	wp.customize(
		settings + "[email_body][background_position_y]",
		function (value) {
			value.bind(function (newval) {
				var position = "";
				wp.customize(
					settings + "[email_body][background_position_x]",
					function (value) {
						position += value.get();
					}
				);
				position += " " + newval;
				container
					.find(".user-registration-email > tbody")
					.css("background-position", position);
			});
		}
	);

	// Email Body: background_repeat
	wp.customize(
		settings + "[email_body][background_repeat]",
		function (value) {
			value.bind(function (newval) {
				container
					.find(".user-registration-email > tbody")
					.css("background-repeat", newval);
			});
		}
	);

	// Email Body: font_size
	wp.customize(settings + "[email_body][font_size]", function (value) {
		value.bind(function (newval) {
			wrapper.find("tbody").css("font-size", newval);
		});
	});

	// Email Body: border_type
	wp.customize(settings + "[email_body][border_type]", function (value) {
		value.bind(function (newval) {
			container
				.find(".user-registration-email > tbody > tr > td")
				.css("border-style", newval);

			wp.customize(
				settings + "[email_body][border_color]",
				function (value) {
					container
						.find(".user-registration-email > tbody > tr > td")
						.css("border-color", value.get());
				}
			);
		});
	});

	// Email Body: border_width
	wp.customize(settings + "[email_body][border_width]", function (value) {
		value.bind(function (newval) {
			var default_unit = "px";

			if (typeof newval != "object") {
				newval = JSON.parse(newval);
			}

			$.each(newval, function (prop, val) {
				if (dimension_directions.indexOf(prop) != -1) {
					container
						.find(".user-registration-email > tbody > tr > td")
						.css("border-" + prop + "-width", val + default_unit);
				}
			});
		});
	});

	// Email Body: border_color
	wp.customize(settings + "[email_body][border_color]", function (value) {
		value.bind(function (newval) {
			container
				.find(".user-registration-email > tbody > tr > td")
				.css("border-color", newval);
		});
	});

	// Email Body: border_radius
	wp.customize(settings + "[email_body][border_radius]", function (value) {
		value.bind(function (newval) {
			if (typeof newval != "object") {
				newval = JSON.parse(newval);
			}

			var unit = newval["unit"];

			$.each(newval, function (prop, val) {
				switch (prop) {
					case "top":
						container
							.find(".user-registration-email > tbody > tr > td")
							.css("border-top-left-radius", val + unit);
						break;
					case "right":
						container
							.find(".user-registration-email > tbody > tr > td")
							.css("border-top-right-radius", val + unit);
						break;
					case "bottom":
						container
							.find(".user-registration-email > tbody > tr > td")
							.css("border-bottom-right-radius", val + unit);
						break;
					case "left":
						container
							.find(".user-registration-email > tbody > tr > td")
							.css("border-bottom-left-radius", val + unit);
						break;
				}
			});
		});
	});

	// Email Body: padding
	wp.customize(settings + "[email_body][padding]", function (value) {
		preview_buttons.on("click", function () {
			var control_value = value.get();
			var active_responsive_device = $(this).data("device");
			var default_unit = "px";

			container
				.find(".user-registration-email > tbody > tr > td")
				.css("padding", "");
			if (typeof control_value[active_responsive_device] == "undefined") {
				active_responsive_device = "desktop";
			}
			$.each(
				control_value[active_responsive_device],
				function (prop, val) {
					container
						.find(".user-registration-email > tbody > tr > td")
						.css("padding-" + prop, val + default_unit);
				}
			);
		});
		value.bind(function (newval) {
			var default_unit = "px";
			var active_responsive_device = controls_wrapper
				.find("#customize-footer-actions .devices button.active")
				.data("device");

			if (typeof newval != "object") {
				newval = JSON.parse(newval);
			}
			$.each(newval[active_responsive_device], function (prop, val) {
				container
					.find(".user-registration-email > tbody > tr > td")
					.css("padding-" + prop, val + default_unit);
			});
		});
	});

	// Email Body Entries: font_color
	wp.customize(
		settings + "[email_body][entries_font_color]",
		function (value) {
			value.bind(function (newval) {
				container
					.find(".user-registration-email__entries tbody")
					.css("color", newval);
			});
		}
	);

	// Email Body Entries: link_color
	wp.customize(
		settings + "[email_body][entries_font_color_link]",
		function (value) {
			value.bind(function (newval) {
				container
					.find(".user-registration-email__entries tbody a")
					.css("color", newval);
			});
		}
	);

	// Email body Entries: background_color
	wp.customize(
		settings + "[email_body][entries_background_color]",
		function (value) {
			value.bind(function (newval) {
				container
					.find(".user-registration-email__entries")
					.css("background-color", newval);
			});
		}
	);

	// Email Body Entries: border_type
	wp.customize(
		settings + "[email_body][entries_border_type]",
		function (value) {
			value.bind(function (newval) {
				container
					.find(".user-registration-email__entries td")
					.css("border-style", newval);

				wp.customize(
					settings + "[email_body][entries_border_color]",
					function (value) {
						container
							.find(".user-registration-email__entries td")
							.css("border-color", value.get());
					}
				);
			});
		}
	);

	// Email Body Entries: border_width
	wp.customize(
		settings + "[email_body][entries_border_width]",
		function (value) {
			value.bind(function (newval) {
				var default_unit = "px";

				if (typeof newval != "object") {
					newval = JSON.parse(newval);
				}

				$.each(newval, function (prop, val) {
					if (dimension_directions.indexOf(prop) != -1) {
						container
							.find(".user-registration-email__entries td")
							.css(
								"border-" + prop + "-width",
								val + default_unit
							);
					}
				});
			});
		}
	);

	// Email Body Entries: border_color
	wp.customize(
		settings + "[email_body][entries_border_color]",
		function (value) {
			value.bind(function (newval) {
				container
					.find(".user-registration-email__entries td")
					.css("border-color", newval);
			});
		}
	);

	// Email Body Entries: padding
	wp.customize(settings + "[email_body][entries_padding]", function (value) {
		preview_buttons.on("click", function () {
			var control_value = value.get();
			var active_responsive_device = $(this).data("device");
			var default_unit = "px";

			container
				.find(".user-registration-email__entries tbody td")
				.css("padding", "");
			if (typeof control_value[active_responsive_device] == "undefined") {
				active_responsive_device = "desktop";
			}
			$.each(
				control_value[active_responsive_device],
				function (prop, val) {
					container
						.find(".user-registration-email__entries tbody td")
						.css("padding-" + prop, val + default_unit);
				}
			);
		});
		value.bind(function (newval) {
			var default_unit = "px";
			var active_responsive_device = controls_wrapper
				.find("#customize-footer-actions .devices button.active")
				.data("device");

			if (typeof newval != "object") {
				newval = JSON.parse(newval);
			}
			$.each(newval[active_responsive_device], function (prop, val) {
				container
					.find(".user-registration-email__entries tbody td")
					.css("padding-" + prop, val + default_unit);
			});
		});
	});

	/*
	 * Footer Styles
	 *
	 * Includes footer logo, content and styles
	 */
	// Logo Styles - Use header logo on footer.
	wp.customize(settings + "[footer][logo_footer]", function (value) {
		value.bind(function (newval) {
			var logo = wrapper
				.find("thead .user-registration-email__brand-logo img")
				.attr("src");
			if ("use_header" === newval) {
				wrapper
					.find("tfoot .user-registration-email__footer__brand-logo")
					.show();
				wrapper
					.find(
						"tfoot .user-registration-email__footer__brand-logo img"
					)
					.attr("src", logo);
			} else {
				wrapper
					.find("tfoot .user-registration-email__footer__brand-logo")
					.hide();
			}
		});
	});

	// Logo Styles - Upload footer logo.
	wp.customize(settings + "[footer][footer_logo_image]", function (value) {
		value.bind(function (newval) {
			wrapper
				.find("tfoot .user-registration-email__footer__brand-logo")
				.show();
			wrapper
				.find("tfoot .user-registration-email__footer__brand-logo img")
				.attr("src", newval);
		});
	});

	// Logo Styles: width
	wp.customize(settings + "[footer][footer_logo_width]", function (value) {
		value.bind(function (newval) {
			wrapper
				.find("tfoot .user-registration-email__footer__brand-logo img")
				.css("max-width", newval + "px");
		});
	});

	// Logo Styles - Footer Styles: Editor.
	wp.customize(settings + "[footer][editor]", function (value) {
		value.bind(function (newval) {
			wrapper
				.find("tfoot .user-registration-email__footer__content")
				.html(newval);
		});
	});

	// Footer Content - Editor.
	wp.customize(settings + "[footer][editor]", function (value) {
		value.bind(function (newval) {
			wrapper
				.find("tfoot .user-registration-email__footer__content")
				.html(newval);
		});
	});

	// Footer layout Alignment.
	wp.customize(settings + "[footer][footer_layout]", function (value) {
		value.bind(function (newval) {
			wrapper
				.find("tfoot .user-registration-email__footer")
				.removeClass("user-registration-email__footer--left");
			wrapper
				.find("tfoot .user-registration-email__footer")
				.removeClass("user-registration-email__footer--right");
			wrapper
				.find("tfoot .user-registration-email__footer")
				.removeClass("user-registration-email__footer--center");
			wrapper
				.find("tfoot .user-registration-email__footer")
				.removeClass("user-registration-email__footer--vertical");
			wrapper
				.find("tfoot .user-registration-email__footer")
				.addClass("user-registration-email__footer--" + newval);
		});
	});

	// Footer layout: background_color
	wp.customize(settings + "[footer][background_color]", function (value) {
		value.bind(function (newval) {
			wrapper
				.find("tfoot .user-registration-email__footer")
				.css("background-color", newval);
		});
	});

	// Footer Layout: background_image
	wp.customize(settings + "[footer][background_image]", function (value) {
		value.bind(function (newval) {
			wrapper
				.find("tfoot .user-registration-email__footer")
				.css("background-image", "url(" + newval + ")");
		});
	});

	// Footer Layout: background_size
	wp.customize(settings + "[footer][background_size]", function (value) {
		value.bind(function (newval) {
			wrapper
				.find("tfoot .user-registration-email__footer")
				.css("background-size", newval);
		});
	});

	// Footer Layout: background_position_x
	wp.customize(
		settings + "[footer][background_position_x]",
		function (value) {
			value.bind(function (newval) {
				var position = newval;
				wp.customize(
					settings + "[footer][background_position_y]",
					function (value) {
						position += " " + value.get();
					}
				);
				wrapper
					.find("tfoot .user-registration-email__footer")
					.css("background-position", position);
			});
		}
	);

	// Footer Layout: background_position_y
	wp.customize(
		settings + "[footer][background_position_y]",
		function (value) {
			value.bind(function (newval) {
				var position = "";
				wp.customize(
					settings + "[footer][background_position_x]",
					function (value) {
						position += value.get();
					}
				);
				position += " " + newval;
				wrapper
					.find("tfoot .user-registration-email__footer")
					.css("background-position", position);
			});
		}
	);

	// Footer Layout: background_repeat
	wp.customize(settings + "[footer][background_repeat]", function (value) {
		value.bind(function (newval) {
			wrapper
				.find("tfoot .user-registration-email__footer")
				.css("background-repeat", newval);
		});
	});

	// Footer Layout: border_type
	wp.customize(settings + "[footer][border_type]", function (value) {
		value.bind(function (newval) {
			wrapper
				.find("tfoot .user-registration-email__footer")
				.css("border-style", newval);

			wp.customize(settings + "[footer][border_color]", function (value) {
				wrapper
					.find("tfoot .user-registration-email__footer")
					.css("border-color", value.get());
			});
		});
	});

	// Footer Layout: border_width
	wp.customize(settings + "[footer][border_width]", function (value) {
		value.bind(function (newval) {
			var default_unit = "px";

			if (typeof newval != "object") {
				newval = JSON.parse(newval);
			}

			$.each(newval, function (prop, val) {
				if (dimension_directions.indexOf(prop) != -1) {
					wrapper
						.find("tfoot .user-registration-email__footer")
						.css("border-" + prop + "-width", val + default_unit);
				}
			});
		});
	});

	// Footer Layout: border_color
	wp.customize(settings + "[footer][border_color]", function (value) {
		value.bind(function (newval) {
			wrapper
				.find("tfoot .user-registration-email__footer")
				.css("border-color", newval);
		});
	});

	// Footer Layout: border_radius
	wp.customize(settings + "[footer][border_radius]", function (value) {
		value.bind(function (newval) {
			if (typeof newval != "object") {
				newval = JSON.parse(newval);
			}

			var unit = newval["unit"];

			$.each(newval, function (prop, val) {
				switch (prop) {
					case "top":
						wrapper
							.find("tfoot .user-registration-email__footer")
							.css("border-top-left-radius", val + unit);
						break;
					case "right":
						wrapper
							.find("tfoot .user-registration-email__footer")
							.css("border-top-right-radius", val + unit);
						break;
					case "bottom":
						wrapper
							.find("tfoot .user-registration-email__footer")
							.css("border-bottom-right-radius", val + unit);
						break;
					case "left":
						wrapper
							.find("tfoot .user-registration-email__footer")
							.css("border-bottom-left-radius", val + unit);
						break;
				}
			});
		});
	});

	// Footer Layout: padding
	wp.customize(settings + "[footer][padding]", function (value) {
		preview_buttons.on("click", function () {
			var control_value = value.get();
			var active_responsive_device = $(this).data("device");
			var default_unit = "px";

			wrapper
				.find("tfoot .user-registration-email__footer")
				.css("padding", "");
			if (typeof control_value[active_responsive_device] == "undefined") {
				active_responsive_device = "desktop";
			}
			$.each(
				control_value[active_responsive_device],
				function (prop, val) {
					wrapper
						.find("tfoot .user-registration-email__footer")
						.css("padding-" + prop, val + default_unit);
				}
			);
		});
		value.bind(function (newval) {
			var default_unit = "px";
			var active_responsive_device = controls_wrapper
				.find("#customize-footer-actions .devices button.active")
				.data("device");

			if (typeof newval != "object") {
				newval = JSON.parse(newval);
			}
			$.each(newval[active_responsive_device], function (prop, val) {
				wrapper
					.find("tfoot .user-registration-email__footer")
					.css("padding-" + prop, val + default_unit);
			});
		});
	});

	// Footer Copyright: Editor
	wp.customize(settings + "[footer][copyright_editor]", function (value) {
		value.bind(function (newval) {
			container
				.find(".user-registration-email__footer-copyright")
				.html(newval);
		});
	});

	// Footer Copyright: text_alignment
	wp.customize(settings + "[footer][copyright_alignment]", function (value) {
		value.bind(function (newval) {
			container
				.find(".user-registration-email__footer-copyright")
				.css("text-align", newval);
		});
	});

	// Footer Copyright: background_color
	wp.customize(
		settings + "[footer][copyright_background_color]",
		function (value) {
			value.bind(function (newval) {
				container
					.find(".user-registration-email__footer-copyright")
					.css("background-color", newval);
			});
		}
	);

	// Footer Copyright: border_type
	wp.customize(
		settings + "[footer][copyright_border_type]",
		function (value) {
			value.bind(function (newval) {
				container
					.find(".user-registration-email__footer-copyright")
					.css("border-style", newval);

				wp.customize(
					settings + "[footer][copyright_border_color]",
					function (value) {
						container
							.find(".user-registration-email__footer-copyright")
							.css("border-color", value.get());
					}
				);
			});
		}
	);

	// Footer Copyright: border_width
	wp.customize(
		settings + "[footer][copyright_border_width]",
		function (value) {
			value.bind(function (newval) {
				var default_unit = "px";

				if (typeof newval != "object") {
					newval = JSON.parse(newval);
				}

				$.each(newval, function (prop, val) {
					if (dimension_directions.indexOf(prop) != -1) {
						container
							.find(".user-registration-email__footer-copyright")
							.css(
								"border-" + prop + "-width",
								val + default_unit
							);
					}
				});
			});
		}
	);

	// Footer Copyright: border_color
	wp.customize(
		settings + "[footer][copyright_border_color]",
		function (value) {
			value.bind(function (newval) {
				container
					.find(".user-registration-email__footer-copyright")
					.css("border-color", newval);
			});
		}
	);

	// Footer Copyright: border_radius
	wp.customize(
		settings + "[footer][copyright_border_radius]",
		function (value) {
			value.bind(function (newval) {
				if (typeof newval != "object") {
					newval = JSON.parse(newval);
				}

				var unit = newval["unit"];

				$.each(newval, function (prop, val) {
					switch (prop) {
						case "top":
							container
								.find(
									".user-registration-email__footer-copyright"
								)
								.css("border-top-left-radius", val + unit);
							break;
						case "right":
							container
								.find(
									".user-registration-email__footer-copyright"
								)
								.css("border-top-right-radius", val + unit);
							break;
						case "bottom":
							container
								.find(
									".user-registration-email__footer-copyright"
								)
								.css("border-bottom-right-radius", val + unit);
							break;
						case "left":
							container
								.find(
									".user-registration-email__footer-copyright"
								)
								.css("border-bottom-left-radius", val + unit);
							break;
					}
				});
			});
		}
	);

	// Footer Copyright: padding
	wp.customize(settings + "[footer][copyright_padding]", function (value) {
		preview_buttons.on("click", function () {
			var control_value = value.get();
			var active_responsive_device = $(this).data("device");
			var default_unit = "px";

			container
				.find(".user-registration-email__footer-copyright")
				.css("padding", "");
			if (typeof control_value[active_responsive_device] == "undefined") {
				active_responsive_device = "desktop";
			}
			$.each(
				control_value[active_responsive_device],
				function (prop, val) {
					container
						.find(".user-registration-email__footer-copyright")
						.css("padding-" + prop, val + default_unit);
				}
			);
		});
		value.bind(function (newval) {
			var default_unit = "px";
			var active_responsive_device = controls_wrapper
				.find("#customize-footer-actions .devices button.active")
				.data("device");

			if (typeof newval != "object") {
				newval = JSON.parse(newval);
			}
			$.each(newval[active_responsive_device], function (prop, val) {
				container
					.find(".user-registration-email__footer-copyright")
					.css("padding-" + prop, val + default_unit);
			});
		});
	});

	/**
	 * Custom CSS.
	 */
	wp.customize("custom_css[" + data.theme + "]", function (value) {
		value.bind(function (newval) {
			$("#ur-email-template-custom-css").text(newval);
		});
	});
})(jQuery, user_registration_email_templates_preview_script_data);
