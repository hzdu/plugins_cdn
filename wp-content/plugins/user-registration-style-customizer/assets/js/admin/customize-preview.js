/* global _urCustomizePreviewL10n */
(function ($, api, data) {
	var settings = "user_registration_styles[" + data.form_id + "]",
		login_settings = "user_registration_login_styles",
		container = $(".user-registration.ur-frontend-form"),
		login_container = $(".ur-frontend-form.login"),
		field_label = container.find(
			".ur-form-row .ur-field-item .form-row > .ur-label"
		),
		login_field_label = login_container.find(
			".ur-form-row .user-registration-form-row > label"
		),
		field_description = container.find(".ur-form-row .description");
	(controls_wrapper = $(parent.document).find("#customize-controls")),
		(preview_buttons = controls_wrapper.find(
			"#customize-footer-actions .devices button"
		));
	dimension_directions = ["top", "right", "bottom", "left"];

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

	var field_style_placeholder = {
		color: "",
		weight: "",
		style: "",
		decoration: "",
		transform: "",
	};

	/**
	 * Add placeholder styles for form fields.
	 *
	 * @param {string} id         Field ID.
	 * @param {string} color      Color for placeholder.
	 * @param {string} decoration Text decoration for placeholder.
	 */
	function addPlaceholderStyles(id, options) {
		if (0 === id.length) {
			id = "ur-frontend-form";
		}
		var style =
			"#" +
			id +
			" input::placeholder, #" +
			id +
			" textarea::placeholder {\n";
		Object.assign(field_style_placeholder, options);

		if ("" !== field_style_placeholder.color) {
			style +=
				"color: " + field_style_placeholder.color + " !important;\n";
		}
		if ("" !== field_style_placeholder.decoration) {
			style +=
				"text-decoration: " +
				field_style_placeholder.decoration +
				" !important;\n";
		}
		if ("" !== field_style_placeholder.weight) {
			style +=
				"font-weight: " +
				field_style_placeholder.weight +
				" !important;\n";
		}
		if ("" !== field_style_placeholder.style) {
			style +=
				"font-style: " +
				field_style_placeholder.style +
				" !important;\n";
		}
		if ("" !== field_style_placeholder.transform) {
			style +=
				"text-transform: " +
				field_style_placeholder.transform +
				" !important;\n";
		}
		style += "}\n";

		return style;
	}

	function addInputStylesOutlineVariation(id, color, checked_color) {
		if (0 === id.length) {
			id = "ur-frontend-form";
		}
		var style =
			"#" +
			id +
			" input[type='radio'], #" +
			id +
			" input[type='checkbox'] {\n";
		style += "border: 1px solid " + color + " !important;\n";
		style += "}\n";

		style =
			"#" +
			id +
			" input[type='radio']:checked, #" +
			id +
			" input[type='checkbox']:checked {\n";
		style += "border: 1px solid " + checked_color + " !important;\n";
		style += "}\n";

		style +=
			"#" +
			id +
			" input[type='radio']:checked::before, #" +
			id +
			" input[type='checkbox']:checked::before {\n";
		style += "content: '';\n";
		style += "}\n";

		style += "#" + id + " input[type='radio']:checked::before {\n";
		style += "height: 50%;\n";
		style += "width: 50%;\n";
		style += "display: inline-block;\n";
		style += "border-radius: 50%;\n";
		style += "background-color: " + checked_color + " !important;\n";
		style += "margin-top: 25%;\n";
		style += "}\n";

		style += "#" + id + " input[type='checkbox']:checked::before {\n";
		style += "height: 50%;\n";
		style += "width: 25%;\n";
		style += "display: inline-block;\n";
		style += "border: solid " + checked_color + " !important;\n";
		style += "border-width: 0 2px 2px 0 !important;\n";
		style += "transform: rotate(45deg);\n";
		style += "margin-top: 12.5%;\n";
		style += "}\n";

		return style;
	}

	function addInputStylesFilledVariation(id, checked_color) {
		if (0 === id.length) {
			id = "ur-frontend-form";
		}
		var style =
			"#" +
			id +
			" input[type='radio']:checked, #" +
			id +
			" input[type='checkbox']:checked {\n";
		style += "background-color: " + checked_color + " !important;\n";
		style += "}\n";

		style +=
			"#" +
			id +
			" input[type='radio']:checked::before, #" +
			id +
			" input[type='checkbox']:checked::before {\n";
		style += "content: '';\n";
		style += "height: 50%;\n";
		style += "margin-top: 25%;\n";
		style += "}\n";

		style += "#" + id + " input[type='radio']:checked::before {\n";
		style += "width: 50%;\n";
		style += "display: inline-block;\n";
		style += "border-radius: 50%;\n";
		style += "background-color: #fff !important;\n";
		style += "margin-top: 25%;\n";
		style += "}\n";

		style += "#" + id + " input[type='checkbox']:checked::before {\n";
		style += "width: 25%;\n";
		style += "display: inline-block;\n";
		style += "border: solid #fff !important;\n";
		style += "border-width: 0 2px 2px 0 !important;\n";
		style += "transform: rotate(45deg);\n";
		style += "margin-top: 12%;\n";
		style += "}\n";

		return style;
	}
	function addInputStylesDefaultVariation(id) {
		if (0 === id.length) {
			id = "ur-frontend-form";
		}
		var style =
			"#" +
			id +
			" input[type='radio']:checked::before, #" +
			id +
			" input[type='checkbox']:checked::before {\n";
		style += "content: none !important;\n";

		return style;
	}

	// Render style for live previews.
	$(document).ready(function () {
		var id = container.attr("id");
		var style = "<style id='placeholder-" + id + "'>\n";
		style += "</style>";
		style += "<style id='inputstyle-" + id + "'>\n";
		style += "</style>";
		container.prepend(style);
	});

	// Render style for login live previews.
	$(document).ready(function () {
		var style = "<style id='placeholder'>\n";
		style += "</style>";
		style += "<style id='inputstyle'>\n";
		style += "</style>";
		login_container.prepend(style);
	});

	// Active template.
	wp.customize(settings + "[template]", function (value) {
		controls_wrapper
			.find(".control-section-ur-templates")
			.find(".customize-template-name")
			.text(data.templates[value.get()].name);
		value.bind(function (newval) {
			controls_wrapper
				.find(".control-section-ur-templates")
				.find(".customize-template-name")
				.text(data.templates[newval].name);
		});
	});
	/* Form Wrapper start */

	// Form Wrapper: width
	wp.customize(settings + "[wrapper][width]", function (value) {
		value.bind(function (newval) {
			container.css("width", newval + "%");
		});
	});

	// Form Wrapper: font_family
	wp.customize(settings + "[wrapper][font_family]", function (value) {
		value.bind(function (newval) {
			if ("" === newval) {
				container.css("font-family", "inherit");
			} else {
				addGoogleFont(newval);
				container.css("font-family", newval);
			}
		});
	});

	// Form Wrapper: background_color
	wp.customize(settings + "[wrapper][background_color]", function (value) {
		value.bind(function (newval) {
			container.css("background-color", newval);
		});
	});

	// Form Wrapper: background_image
	wp.customize(settings + "[wrapper][background_image]", function (value) {
		value.bind(function (newval) {
			container.css("background-image", "url(" + newval + ")");
		});
	});

	// Form Wrapper: background_size
	wp.customize(settings + "[wrapper][background_size]", function (value) {
		value.bind(function (newval) {
			container.css("background-size", newval);
		});
	});

	// Form Wrapper: background_position_x
	wp.customize(
		settings + "[wrapper][background_position_x]",
		function (value) {
			value.bind(function (newval) {
				var position = newval;
				wp.customize(
					settings + "[wrapper][background_position_y]",
					function (value) {
						position += " " + value.get();
					}
				);
				container.css("background-position", position);
			});
		}
	);

	// Form Wrapper: background_position_y
	wp.customize(
		settings + "[wrapper][background_position_y]",
		function (value) {
			value.bind(function (newval) {
				var position = "";
				wp.customize(
					settings + "[wrapper][background_position_x]",
					function (value) {
						position += value.get();
					}
				);
				position += " " + newval;
				container.css("background-position", position);
			});
		}
	);

	// Form Wrapper: background_repeat
	wp.customize(settings + "[wrapper][background_repeat]", function (value) {
		value.bind(function (newval) {
			container.css("background-repeat", newval);
		});
	});

	// Form Wrapper: background_attachment
	wp.customize(
		settings + "[wrapper][background_attachment]",
		function (value) {
			value.bind(function (newval) {
				container.css("background-attachment", newval);
			});
		}
	);

	// Form Wrapper: border_type
	wp.customize(settings + "[wrapper][border_type]", function (value) {
		value.bind(function (newval) {
			container.css("border-style", newval);

			wp.customize(
				settings + "[wrapper][border_color]",
				function (value) {
					container.css("border-color", value.get());
				}
			);
		});
	});

	// Form Wrapper: border_width
	wp.customize(settings + "[wrapper][border_width]", function (value) {
		value.bind(function (newval) {
			var default_unit = "px";

			if (typeof newval != "object") {
				newval = JSON.parse(newval);
			}

			$.each(newval, function (prop, val) {
				if (dimension_directions.indexOf(prop) != -1) {
					container.css(
						"border-" + prop + "-width",
						val + default_unit
					);
				}
			});
		});
	});

	// Form Wrapper: border_color
	wp.customize(settings + "[wrapper][border_color]", function (value) {
		value.bind(function (newval) {
			container.css("border-color", newval);
		});
	});

	// Form Wrapper: border_radius
	wp.customize(settings + "[wrapper][border_radius]", function (value) {
		value.bind(function (newval) {
			if (typeof newval != "object") {
				newval = JSON.parse(newval);
			}

			var unit = newval["unit"];

			$.each(newval, function (prop, val) {
				switch (prop) {
					case "top":
						container.css("border-top-left-radius", val + unit);
						break;
					case "right":
						container.css("border-top-right-radius", val + unit);
						break;
					case "bottom":
						container.css("border-bottom-right-radius", val + unit);
						break;
					case "left":
						container.css("border-bottom-left-radius", val + unit);
						break;
				}
			});
		});
	});

	// Form Wrapper: margin
	wp.customize(settings + "[wrapper][margin]", function (value) {
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
					container.css("margin-" + prop, val + default_unit);
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
				container.css("margin-" + prop, val + default_unit);
			});
		});
	});

	// Form Wrapper: padding
	wp.customize(settings + "[wrapper][padding]", function (value) {
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

	/* Form Wrapper End */

	/* Field Labels Start */

	// Field Labels: font_size
	wp.customize(settings + "[field_label][font_size]", function (value) {
		var default_unit = "px";
		value.bind(function (newval) {
			field_label.css("font-size", newval + default_unit);
		});
	});

	// Field Labels: color
	wp.customize(settings + "[field_label][font_color]", function (value) {
		value.bind(function (newval) {
			field_label.css("color", newval);
		});
	});

	// Field Labels: font_style
	wp.customize(settings + "[field_label][font_style]", function (value) {
		value.bind(function (newval) {
			if (typeof newval != "object") {
				newval = JSON.parse(newval);
			}

			$.each(newval, function (prop, val) {
				switch (prop) {
					case "bold":
						field_label.css(
							"font-weight",
							val === true ? "bold" : "normal"
						);
						break;
					case "italic":
						field_label.css(
							"font-style",
							val === true ? "italic" : "normal"
						);
						break;
					case "underline":
						field_label.css(
							"text-decoration",
							val === true ? "underline" : "none"
						);
						break;
					case "uppercase":
						field_label.css(
							"text-transform",
							val === true ? "uppercase" : "none"
						);
						break;
				}
			});
		});
	});

	// Field Labels: text_alignment
	wp.customize(settings + "[field_label][text_alignment]", function (value) {
		value.bind(function (newval) {
			field_label.css("text-align", newval);
		});
	});

	// Field Labels: line_height
	wp.customize(settings + "[field_label][line_height]", function (value) {
		value.bind(function (newval) {
			field_label.css("line-height", newval);
		});
	});

	// Field Labels: margin
	wp.customize(settings + "[field_label][margin]", function (value) {
		preview_buttons.on("click", function () {
			var control_value = value.get();
			var active_responsive_device = $(this).data("device");
			var default_unit = "px";

			field_label.css("margin", "");
			if (typeof control_value[active_responsive_device] == "undefined") {
				active_responsive_device = "desktop";
			}
			$.each(
				control_value[active_responsive_device],
				function (prop, val) {
					field_label.css("margin-" + prop, val + default_unit);
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
				field_label.css("margin-" + prop, val + default_unit);
			});
		});
	});

	// Field Labels: padding
	wp.customize(settings + "[field_label][padding]", function (value) {
		preview_buttons.on("click", function () {
			var control_value = value.get();
			var active_responsive_device = $(this).data("device");
			var default_unit = "px";

			field_label.css("padding", "");
			if (typeof control_value[active_responsive_device] == "undefined") {
				active_responsive_device = "desktop";
			}
			$.each(
				control_value[active_responsive_device],
				function (prop, val) {
					field_label.css("padding-" + prop, val + default_unit);
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
				field_label.css("padding-" + prop, val + default_unit);
			});
		});
	});

	/* Field Labels End */

	/* Field Description Start */

	// Field Descriptin: font_size
	wp.customize(settings + "[field_description][font_size]", function (value) {
		var default_unit = "px";
		value.bind(function (newval) {
			field_description.css("font-size", newval + default_unit);
		});
	});

	// Field Description: font_color
	wp.customize(
		settings + "[field_description][font_color]",
		function (value) {
			value.bind(function (newval) {
				field_description.css("color", newval);
			});
		}
	);

	// Field Description: font_style
	wp.customize(
		settings + "[field_description][font_style]",
		function (value) {
			value.bind(function (newval) {
				if (typeof newval != "object") {
					newval = JSON.parse(newval);
				}

				$.each(newval, function (prop, val) {
					switch (prop) {
						case "bold":
							field_description.css(
								"font-weight",
								val === true ? "bold" : "normal"
							);
							break;
						case "italic":
							field_description.css(
								"font-style",
								val === true ? "italic" : "normal"
							);
							break;
						case "underline":
							field_description.css(
								"text-decoration",
								val === true ? "underline" : "none"
							);
							break;
						case "uppercase":
							field_description.css(
								"text-transform",
								val === true ? "uppercase" : "none"
							);
							break;
					}
				});
			});
		}
	);

	// Field Description: text_alignment
	wp.customize(
		settings + "[field_description][text_alignment]",
		function (value) {
			value.bind(function (newval) {
				field_description.css("text-align", newval);
			});
		}
	);

	// Field Description: line_height
	wp.customize(
		settings + "[field_description][line_height]",
		function (value) {
			value.bind(function (newval) {
				field_description.css("line-height", newval);
			});
		}
	);

	// Field Description: margin
	wp.customize(settings + "[field_description][margin]", function (value) {
		preview_buttons.on("click", function () {
			var control_value = value.get();
			var active_responsive_device = $(this).data("device");
			var default_unit = "px";

			field_description.css("margin", "");
			if (typeof control_value[active_responsive_device] == "undefined") {
				active_responsive_device = "desktop";
			}
			$.each(
				control_value[active_responsive_device],
				function (prop, val) {
					field_description.css("margin-" + prop, val + default_unit);
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
				field_description.css("margin-" + prop, val + default_unit);
			});
		});
	});

	// Field Description: padding
	wp.customize(settings + "[field_description][padding]", function (value) {
		preview_buttons.on("click", function () {
			var control_value = value.get();
			var active_responsive_device = $(this).data("device");
			var default_unit = "px";

			field_description.css("padding", "");
			if (typeof control_value[active_responsive_device] == "undefined") {
				active_responsive_device = "desktop";
			}
			$.each(
				control_value[active_responsive_device],
				function (prop, val) {
					field_description.css(
						"padding-" + prop,
						val + default_unit
					);
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
				field_description.css("padding-" + prop, val + default_unit);
			});
		});
	});

	/* Field Styles Start */

	// Field Styles: font_size
	wp.customize(settings + "[field_styles][font_size]", function (value) {
		var default_unit = "px";
		value.bind(function (newval) {
			container
				.find("input, textarea, select")
				.css("font-size", newval + default_unit);
		});
	});

	// Field Styles: font_color
	var prev_field_style_font_color = "";
	wp.customize(settings + "[field_styles][font_color]", function (value) {
		value.bind(function (newval) {
			prev_field_style_font_color = newval;
			container.find("input, textarea, select").css("color", newval);
		});
	});

	// Field Styles: placeholder_font_color
	wp.customize(
		settings + "[field_styles][placeholder_font_color]",
		function (value) {
			var id = container.attr("id");
			value.bind(function (newval) {
				container
					.find("style#placeholder-" + id)
					.html(addPlaceholderStyles(id, { color: newval }));
			});
		}
	);

	// Field Styles: font_style
	wp.customize(settings + "[field_styles][font_style]", function (value) {
		value.bind(function (newval) {
			var id = container.attr("id");
			if (typeof newval != "object") {
				newval = JSON.parse(newval);
			}

			$.each(newval, function (prop, val) {
				var string_value = "";
				switch (prop) {
					case "bold":
						string_value = val === true ? "bold" : "normal";
						container
							.find("input, textarea, select")
							.css("font-weight", string_value);
						container.find("style#placeholder-" + id).html(
							addPlaceholderStyles(id, {
								weight: string_value,
							})
						);
						break;
					case "italic":
						string_value = val === true ? "italic" : "normal";
						container
							.find("input, textarea, select")
							.css("font-style", string_value);
						container.find("style#placeholder-" + id).html(
							addPlaceholderStyles(id, {
								style: string_value,
							})
						);
						break;
					case "underline":
						string_value = val === true ? "underline" : "none";
						container
							.find("input, textarea, select")
							.css("text-decoration", string_value);
						container.find("style#placeholder-" + id).html(
							addPlaceholderStyles(id, {
								decoration: string_value,
							})
						);
						break;
					case "uppercase":
						string_value = val === true ? "uppercase" : "none";
						container
							.find("input, textarea, select")
							.css("text-transform", string_value);
						container.find("style#placeholder-" + id).html(
							addPlaceholderStyles(id, {
								transform: string_value,
							})
						);
						break;
				}
			});
		});
	});

	// Field Styles: alignment
	wp.customize(settings + "[field_styles][alignment]", function (value) {
		value.bind(function (newval) {
			container.find("input, textarea").css("text-align", newval);
			container.find("select").css("text-align-last", newval);

			var option_direction = "ltr";
			if ("right" == newval) {
				option_direction = "rtl";
			}

			container.find("option").css("direction", option_direction);
		});
	});

	// Field Styles: border_type
	wp.customize(settings + "[field_styles][border_type]", function (value) {
		value.bind(function (newval) {
			container
				.find("input, textarea, select")
				.css("border-style", newval);
		});
	});

	// Field Styles: border_width
	wp.customize(settings + "[field_styles][border_width]", function (value) {
		value.bind(function (newval) {
			var default_unit = "px";

			if (typeof newval != "object") {
				newval = JSON.parse(newval);
			}

			$.each(newval, function (prop, val) {
				if (dimension_directions.indexOf(prop) != -1) {
					container
						.find("input, textarea, select")
						.css("border-" + prop + "-width", val + default_unit);
				}
			});
		});
	});

	// Field Styles: border_color
	var prev_border_color = "";
	wp.customize(settings + "[field_styles][border_color]", function (value) {
		value.bind(function (newval) {
			prev_border_color = newval;
			container
				.find("input, textarea, select")
				.css("border-color", newval);
		});
	});

	// Field Styles: border_focus_color
	wp.customize(
		settings + "[field_styles][border_focus_color]",
		function (value) {
			container
				.find("input, textarea, select")
				.on("focus blur", function (e) {
					if ("focus" == e.type) {
						var control_value = value.get();
						$(this).css("border-color", control_value);
					} else {
						$(this).css("border-color", prev_border_color);
					}
				});
		}
	);

	// Field Styles: border_radius
	wp.customize(settings + "[field_styles][border_radius]", function (value) {
		value.bind(function (newval) {
			if (typeof newval != "object") {
				newval = JSON.parse(newval);
			}

			var unit = newval["unit"];

			$.each(newval, function (prop, val) {
				switch (prop) {
					case "top":
						container
							.find("input, textarea, select")
							.css("border-top-left-radius", val + unit);
						break;
					case "right":
						container
							.find("input, textarea, select")
							.css("border-top-right-radius", val + unit);
						break;
					case "bottom":
						container
							.find("input, textarea, select")
							.css("border-bottom-right-radius", val + unit);
						break;
					case "left":
						container
							.find("input, textarea, select")
							.css("border-bottom-left-radius", val + unit);
						break;
				}
			});
		});
	});

	// Field Styles: background_color
	wp.customize(
		settings + "[field_styles][background_color]",
		function (value) {
			value.bind(function (newval) {
				container
					.find("input, textarea, select")
					.css("background-color", newval);
			});
		}
	);

	// Field Styles: margin
	wp.customize(settings + "[field_styles][margin]", function (value) {
		preview_buttons.on("click", function () {
			var control_value = value.get();
			var active_responsive_device = $(this).data("device");
			var default_unit = "px";

			container.find("input, textarea, select").css("margin", "");
			if (typeof control_value[active_responsive_device] == "undefined") {
				active_responsive_device = "desktop";
			}
			$.each(
				control_value[active_responsive_device],
				function (prop, val) {
					container
						.find("input, textarea, select")
						.css("margin-" + prop, val + default_unit);
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
					.find("input, textarea, select")
					.css("margin-" + prop, val + default_unit);
			});
		});
	});

	// Field Styles: padding
	wp.customize(settings + "[field_styles][padding]", function (value) {
		preview_buttons.on("click", function () {
			var control_value = value.get();
			var active_responsive_device = $(this).data("device");
			var default_unit = "px";

			container.find("input, textarea, select").css("padding", "");
			if (typeof control_value[active_responsive_device] == "undefined") {
				active_responsive_device = "desktop";
			}
			$.each(
				control_value[active_responsive_device],
				function (prop, val) {
					container
						.find("input, textarea, select")
						.css("padding-" + prop, val + default_unit);
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
				container
					.find("input, textarea, select")
					.css("padding-" + prop, val + default_unit);
			});
		});
	});

	/* Field Styles End */

	/* Checkbox and Radio Styles Starts */

	// Checkbox and Radio: font_size
	wp.customize(
		settings + "[checkbox_radio_styles][font_size]",
		function (value) {
			var default_unit = "px";
			value.bind(function (newval) {
				container
					.find(
						".field-radio label.radio, .field-checkbox label.ur-checkbox-label"
					)
					.css("font-size", newval + default_unit);
			});
		}
	);

	// Checkbox and Radio: font_color
	wp.customize(
		settings + "[checkbox_radio_styles][font_color]",
		function (value) {
			value.bind(function (newval) {
				container
					.find(
						".field-radio label.radio, .field-checkbox label.ur-checkbox-label"
					)
					.css("color", newval);
			});
		}
	);

	// Checkbox and Radio: font_style
	wp.customize(
		settings + "[checkbox_radio_styles][font_style]",
		function (value) {
			value.bind(function (newval) {
				if (typeof newval != "object") {
					newval = JSON.parse(newval);
				}

				$.each(newval, function (prop, val) {
					switch (prop) {
						case "bold":
							container
								.find(
									".field-radio label.radio, .field-checkbox label.ur-checkbox-label"
								)
								.css(
									"font-weight",
									val === true ? "bold" : "normal"
								);
							break;
						case "italic":
							container
								.find(
									".field-radio label.radio, .field-checkbox label.ur-checkbox-label"
								)
								.css(
									"font-style",
									val === true ? "italic" : "normal"
								);
							break;
						case "underline":
							container
								.find(
									".field-radio label.radio, .field-checkbox label.ur-checkbox-label"
								)
								.css(
									"text-decoration",
									val === true ? "underline" : "none"
								);
							break;
						case "uppercase":
							container
								.find(
									".field-radio label.radio, .field-checkbox label.ur-checkbox-label"
								)
								.css(
									"text-transform",
									val === true ? "uppercase" : "none"
								);
							break;
					}
				});
			});
		}
	);

	// Checkbox and Radio Styles: alignment
	wp.customize(
		settings + "[checkbox_radio_styles][alignment]",
		function (value) {
			value.bind(function (newval) {
				container
					.find(
						".field-radio li.ur-radio-list, .field-checkbox li.ur-checkbox-list"
					)
					.css("text-align", newval);

				var option_direction = "ltr";
				if ("right" == newval) {
					option_direction = "rtl";
				}

				container.find("option").css("direction", option_direction);
			});
		}
	);

	// Checkbox and Radio Styles: default_style, inline_style, two_columns_style
	wp.customize(
		settings + "[checkbox_radio_styles][inline_style]",
		function (value) {
			value.bind(function (newval) {
				var ul = container.find(".field-radio ul, .field-checkbox ul");
				ul.addClass(newval);
				switch (newval) {
					case "inline":
						ul.css({
							display: "flex",
							"flex-wrap": "wrap",
						});
						ul.find("li").css({
							display: "",
							flex: "0 auto",
						});
						break;
					case "two_columns":
						ul.css({
							display: "flex",
							"flex-wrap": "wrap",
						});
						ul.find("li").css({
							display: "",
							flex: "0 50%",
						});
						ul.find("li label").css({
							flex: "1",
						});
						break;
					default:
						ul.css({
							display: "inherit",
							"flex-wrap": "",
						});
						ul.find("li").css({
							display: "inherit",
							flex: "",
							"max-width": "",
						});
						ul.find("li label").css({
							display: "inline",
							flex: "",
						});
						break;
				}
			});
		}
	);

	// Checkbox and Radio Styles: design_style
	wp.customize(
		settings + "[checkbox_radio_styles][style_variation]",
		function (value) {
			var id = container.attr("id");
			value.bind(function (newval) {
				var size = 0;
				var color = "";
				var checked_color = "";
				wp.customize(
					settings + "[checkbox_radio_styles][size]",
					function (value) {
						var default_unit = "px";
						size = value.get() + default_unit;
					}
				);
				wp.customize(
					settings + "[checkbox_radio_styles][color]",
					function (value) {
						color = value.get();
					}
				);
				wp.customize(
					settings + "[checkbox_radio_styles][checked_color]",
					function (value) {
						checked_color = value.get();
					}
				);
				var input = container.find(
					'.field-radio ul input[type="radio"], .field-checkbox ul input[type="checkbox"]'
				);
				switch (newval) {
					case "outline":
						container
							.find("style#placeholder-" + id)
							.html(
								addInputStylesOutlineVariation(
									id,
									color,
									checked_color
								)
							);
						input.css({
							width: size,
							height: size,
							display: "inline-block",
							"text-align": "center",
							"background-color": "transparent",
							border: "1px solid " + color,
						});
						break;
					case "filled":
						container
							.find("style#placeholder-" + id)
							.html(
								addInputStylesFilledVariation(id, checked_color)
							);
						input.css({
							border: "",
							width: size,
							height: size,
							display: "inline-block",
							"text-align": "center",
							"background-color": color,
							border: "none",
						});
						break;
					default:
						container
							.find("style#placeholder-" + id)
							.html(addInputStylesDefaultVariation(id));
						input.css({
							width: "inherit",
							height: "inherit",
							display: "",
							"text-align": "",
							"background-color": "",
							border: "",
						});
						break;
				}
				var input = container.find('input[type="checkbox"]');
				switch (newval) {
					case "outline":
						input.css({
							"-webkit-appearance": "none",
						});
						break;
					case "filled":
						input.css({
							"-webkit-appearance": "none",
						});
						break;
					default:
						input.css({
							"-webkit-appearance": "checkbox",
						});
						break;
				}
				var input = container.find('input[type="radio"]');
				input.css({
					"border-radius": "50%",
				});
				switch (newval) {
					case "outline":
						input.css({
							"-webkit-appearance": "none",
						});
						break;
					case "filled":
						input.css({
							"-webkit-appearance": "none",
						});
						break;
					default:
						input.css({
							"-webkit-appearance": "radio",
						});
						break;
				}
			});
		}
	);

	// Checkbox and Radio: size
	wp.customize(settings + "[checkbox_radio_styles][size]", function (value) {
		var default_unit = "px";
		value.bind(function (newval) {
			container
				.find(
					'.field-radio ul input[type="radio"], .field-checkbox ul input[type="checkbox"]'
				)
				.css({
					width: newval + default_unit,
					height: newval + default_unit,
				});
		});
	});

	// Checkbox and Radio: color
	wp.customize(settings + "[checkbox_radio_styles][color]", function (value) {
		var style_variation = "default";
		value.bind(function (newval) {
			wp.customize(
				settings + "[checkbox_radio_styles][style_variation]",
				function (value) {
					style_variation = value.get();
				}
			);
			if ("outline" === style_variation) {
				container
					.find(
						'.field-radio ul input[type="radio"], .field-checkbox ul input[type="checkbox"]'
					)
					.css("border-color", newval)
					.css("background-color", "transparent");
			} else if ("filled" === style_variation) {
				container
					.find(
						'.field-radio ul input[type="radio"], .field-checkbox ul input[type="checkbox"]'
					)
					.css("border-color", newval)
					.css("background-color", newval);
			} else {
				container
					.find(
						'.field-radio ul input[type="radio"], .field-checkbox ul input[type="checkbox"]'
					)
					.css("border-color", "inherit")
					.css("background-color", "inherit");
			}
		});
	});

	// Checkbox and Radio: checked_color
	wp.customize(
		settings + "[checkbox_radio_styles][checked_color]",
		function (value) {
			var id = container.attr("id");
			var style_variation = "default";
			var color = "";
			value.bind(function (newval) {
				wp.customize(
					settings + "[checkbox_radio_styles][color]",
					function (value) {
						color = value.get();
					}
				);
				wp.customize(
					settings + "[checkbox_radio_styles][style_variation]",
					function (value) {
						style_variation = value.get();
					}
				);
				if ("outline" === style_variation) {
					container
						.find("style#placeholder-" + id)
						.html(
							addInputStylesOutlineVariation(id, color, newval)
						);
				} else if ("filled" === style_variation) {
					container
						.find("style#placeholder-" + id)
						.html(addInputStylesFilledVariation(id, newval));
				} else {
					container
						.find("style#placeholder-" + id)
						.html(addInputStylesDefaultVariation(id));
				}
			});
		}
	);

	// Checkbox and Radio Styles: margin
	wp.customize(
		settings + "[checkbox_radio_styles][margin]",
		function (value) {
			var inline_style = "default";
			preview_buttons.on("click", function () {
				var control_value = value.get();
				var active_responsive_device = $(this).data("device");
				var default_unit = "px";
				wp.customize(
					settings + "[checkbox_radio_styles][inline_style]",
					function (value) {
						inline_style = value.get();
					}
				);

				container
					.find(
						".field-radio ul .ur-radio-list, .field-checkbox ul .ur-checkbox-list"
					)
					.css("margin", "");
				if (
					typeof control_value[active_responsive_device] ==
					"undefined"
				) {
					active_responsive_device = "desktop";
				}
				$.each(
					control_value[active_responsive_device],
					function (prop, val) {
						if (
							"two_columns" === inline_style &&
							("right" === prop || "left" === prop)
						) {
							val = 0;
						}
						container
							.find(
								".field-radio ul .ur-radio-list, .field-checkbox ul .ur-checkbox-list"
							)
							.css("margin-" + prop, val + default_unit);
					}
				);
			});
			value.bind(function (newval) {
				var default_unit = "px";
				var active_responsive_device = controls_wrapper
					.find("#customize-footer-actions .devices button.active")
					.data("device");
				wp.customize(
					settings + "[checkbox_radio_styles][inline_style]",
					function (value) {
						inline_style = value.get();
					}
				);

				if (typeof newval != "object") {
					newval = JSON.parse(newval);
				}

				$.each(newval[active_responsive_device], function (prop, val) {
					if (
						"two_columns" === inline_style &&
						("right" === prop || "left" === prop)
					) {
						val = 0;
					}
					container
						.find(
							".field-radio ul .ur-radio-list, .field-checkbox ul .ur-checkbox-list"
						)
						.css("margin-" + prop, val + default_unit);
				});
			});
		}
	);

	// Checkbox and Radio Styles: padding
	wp.customize(
		settings + "[checkbox_radio_styles][padding]",
		function (value) {
			preview_buttons.on("click", function () {
				var control_value = value.get();
				var active_responsive_device = $(this).data("device");
				var default_unit = "px";

				container
					.find(
						".field-radio ul .ur-radio-list, .field-checkbox ul .ur-checkbox-list"
					)
					.css("padding", "");
				if (
					typeof control_value[active_responsive_device] ==
					"undefined"
				) {
					active_responsive_device = "desktop";
				}
				$.each(
					control_value[active_responsive_device],
					function (prop, val) {
						container
							.find(
								".field-radio ul .ur-radio-list, .field-checkbox ul .ur-checkbox-list"
							)
							.css("padding-" + prop, val + default_unit);
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
					container
						.find(
							".field-radio ul .ur-radio-list, .field-checkbox ul .ur-checkbox-list"
						)
						.css("padding-" + prop, val + default_unit);
				});
			});
		}
	);

	/* Checkbox and Radio Styles Ends */

	/* Section Title Start */

	// Section Title: font_size
	wp.customize(settings + "[section_title][font_size]", function (value) {
		var default_unit = "px";
		value.bind(function (newval) {
			container
				.find(".field-section_title h3")
				.css("font-size", newval + default_unit);
		});
	});

	// Section Title: font_color
	wp.customize(settings + "[section_title][font_color]", function (value) {
		value.bind(function (newval) {
			container.find(".field-section_title h3").css("color", newval);
		});
	});

	// Section Title: font_style
	wp.customize(settings + "[section_title][font_style]", function (value) {
		value.bind(function (newval) {
			var id = container.attr("id");
			if (typeof newval != "object") {
				newval = JSON.parse(newval);
			}

			$.each(newval, function (prop, val) {
				switch (prop) {
					case "bold":
						container
							.find(".field-section_title h3")
							.css(
								"font-weight",
								val === true ? "bold" : "normal"
							);
						break;
					case "italic":
						container
							.find(".field-section_title h3")
							.css(
								"font-style",
								val === true ? "italic" : "normal"
							);
						break;
					case "underline":
						container
							.find(".field-section_title h3")
							.css(
								"text-decoration",
								val === true ? "underline" : "none"
							);
						container
							.find(".field-section_title h3")
							.find("style#" + id)
							.html(
								addPlaceholderStyles(
									id,
									"",
									val === true ? "underline" : "none"
								)
							);
						break;
					case "uppercase":
						container
							.find(".field-section_title h3")
							.css(
								"text-transform",
								val === true ? "uppercase" : "none"
							);
						break;
				}
			});
		});
	});

	// Section Title: text_alignment
	wp.customize(
		settings + "[section_title][text_alignment]",
		function (value) {
			value.bind(function (newval) {
				container
					.find(".field-section_title h3")
					.css("text-align", newval);
			});
		}
	);

	// Section Title: line_height
	wp.customize(settings + "[section_title][line_height]", function (value) {
		value.bind(function (newval) {
			container
				.find(".field-section_title h3")
				.css("line-height", newval);
		});
	});

	// Section Title: margin
	wp.customize(settings + "[section_title][margin]", function (value) {
		preview_buttons.on("click", function () {
			var control_value = value.get();
			var active_responsive_device = $(this).data("device");
			var default_unit = "px";

			container.find(".field-section_title h3").css("margin", "");
			if (typeof control_value[active_responsive_device] == "undefined") {
				active_responsive_device = "desktop";
			}
			$.each(
				control_value[active_responsive_device],
				function (prop, val) {
					container
						.find(".field-section_title h3")
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
				container
					.find(".field-section_title h3")
					.css("margin-" + prop, val + default_unit);
			});
		});
	});

	// Section Title: padding
	wp.customize(settings + "[section_title][padding]", function (value) {
		preview_buttons.on("click", function () {
			var control_value = value.get();
			var active_responsive_device = $(this).data("device");
			var default_unit = "px";

			container.find(".field-section_title h3").css("padding", "");
			if (typeof control_value[active_responsive_device] == "undefined") {
				active_responsive_device = "desktop";
			}
			$.each(
				control_value[active_responsive_device],
				function (prop, val) {
					container
						.find(".field-section_title h3")
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
					.find(".field-section_title h3")
					.css("padding-" + prop, val + default_unit);
			});
		});
	});

	/* Section Title End */

	/* Button Styles Start */

	// Button Styles: font_size
	wp.customize(settings + "[button][font_size]", function (value) {
		var default_unit = "px";
		value.bind(function (newval) {
			container
				.find(".ur-button-container button")
				.css("font-size", newval + default_unit);
		});
	});

	// Button Styles: font_style
	wp.customize(settings + "[button][font_style]", function (value) {
		value.bind(function (newval) {
			if (typeof newval != "object") {
				newval = JSON.parse(newval);
			}

			$.each(newval, function (prop, val) {
				switch (prop) {
					case "bold":
						container
							.find(".ur-button-container button")
							.css(
								"font-weight",
								val === true ? "bold" : "normal"
							);
						break;
					case "italic":
						container
							.find(".ur-button-container button")
							.css(
								"font-style",
								val === true ? "italic" : "normal"
							);
						break;
					case "underline":
						container
							.find(".ur-button-container button")
							.css(
								"text-decoration",
								val === true ? "underline" : "none"
							);
						break;
					case "uppercase":
						container
							.find(".ur-button-container button")
							.css(
								"text-transform",
								val === true ? "uppercase" : "none"
							);
						break;
				}
			});
		});
	});

	// Button Styles: font_color
	var button_pev_hover_font_color = "";
	wp.customize(settings + "[button][font_color]", function (value) {
		value.bind(function (newval) {
			button_pev_hover_font_color = newval;
			container.find(".ur-button-container button").css("color", newval);
		});
	});

	// Button Styles: hover_font_color
	wp.customize(settings + "[button][hover_font_color]", function (value) {
		container
			.find(".ur-button-container button")
			.on("mouseover mouseleave", function (e) {
				if ("mouseover" == e.type) {
					var control_value = value.get();
					$(this).css("color", control_value);
				} else {
					$(this).css("color", button_pev_hover_font_color);
				}
			});
	});

	// Button Styles: background_color
	var button_pev_color = "";
	wp.customize(settings + "[button][background_color]", function (value) {
		value.bind(function (newval) {
			button_pev_color = newval;
			container
				.find(".ur-button-container button")
				.css("background-color", newval);
		});
	});

	// Button Styles: hover_background_color
	wp.customize(
		settings + "[button][hover_background_color]",
		function (value) {
			container
				.find(".ur-button-container button")
				.on("mouseover mouseleave", function (e) {
					if ("mouseover" == e.type) {
						var control_value = value.get();
						$(this).css("background-color", control_value);
					} else {
						$(this).css("background-color", button_pev_color);
					}
				});
		}
	);

	// Button Styles: alignment
	wp.customize(settings + "[button][alignment]", function (value) {
		value.bind(function (newval) {
			container.find(".ur-button-container").css("text-align", newval);
			container.find(".ur-button-container").css({
				display: "block",
			});
			container.find(".ur-button-container button").css({
				float: "none",
			});
		});
	});

	// Button Styles: border_type
	wp.customize(settings + "[button][border_type]", function (value) {
		value.bind(function (newval) {
			container
				.find(".ur-button-container button")
				.css("border-style", newval);
		});
	});

	// Button Styles: border_width
	wp.customize(settings + "[button][border_width]", function (value) {
		value.bind(function (newval) {
			var default_unit = "px";
			if (typeof newval != "object") {
				newval = JSON.parse(newval);
			}
			$.each(newval, function (prop, val) {
				if (dimension_directions.indexOf(prop) != -1) {
					container
						.find(".ur-button-container button")
						.css("border-" + prop + "-width", val + default_unit);
				}
			});
		});
	});

	// Button Styles: border_color
	var button_pev_border_hover_color = "";
	wp.customize(settings + "[button][border_color]", function (value) {
		value.bind(function (newval) {
			button_pev_border_hover_color = newval;
			container
				.find(".ur-button-container button")
				.css("border-color", newval);
		});
	});

	// Button Styles: border_hover_color
	wp.customize(settings + "[button][border_hover_color]", function (value) {
		container
			.find(".ur-button-container button")
			.on("mouseover mouseleave", function (e) {
				if ("mouseover" == e.type) {
					var control_value = value.get();
					$(this).css("border-color", control_value);
				} else {
					$(this).css("border-color", button_pev_border_hover_color);
				}
			});
	});

	// Button Styles: border_radius
	wp.customize(settings + "[button][border_radius]", function (value) {
		value.bind(function (newval) {
			if (typeof newval != "object") {
				newval = JSON.parse(newval);
			}

			var unit = newval["unit"];

			$.each(newval, function (prop, val) {
				switch (prop) {
					case "top":
						container
							.find(".ur-button-container button")
							.css("border-top-left-radius", val + unit);
						break;
					case "right":
						container
							.find(".ur-button-container button")
							.css("border-top-right-radius", val + unit);
						break;
					case "bottom":
						container
							.find(".ur-button-container button")
							.css("border-bottom-right-radius", val + unit);
						break;
					case "left":
						container
							.find(".ur-button-container button")
							.css("border-bottom-left-radius", val + unit);
						break;
				}
			});
		});
	});

	// Button Styles: line_height
	wp.customize(settings + "[button][line_height]", function (value) {
		value.bind(function (newval) {
			container
				.find(".ur-button-container button")
				.css("line-height", newval);
		});
	});

	// Button Styles: margin
	wp.customize(settings + "[button][margin]", function (value) {
		preview_buttons.on("click", function () {
			var control_value = value.get();
			var active_responsive_device = $(this).data("device");
			var default_unit = "px";

			container.find(".ur-button-container button").css("margin", "");
			if (typeof control_value[active_responsive_device] == "undefined") {
				active_responsive_device = "desktop";
			}
			$.each(
				control_value[active_responsive_device],
				function (prop, val) {
					container
						.find(".ur-button-container button")
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
				container
					.find(".ur-button-container button")
					.css("margin-" + prop, val + default_unit);
			});
		});
	});

	// Button Styles: padding
	wp.customize(settings + "[button][padding]", function (value) {
		preview_buttons.on("click", function () {
			var control_value = value.get();
			var active_responsive_device = $(this).data("device");
			var default_unit = "px";

			container.find(".ur-button-container button").css("padding", "");
			if (typeof control_value[active_responsive_device] == "undefined") {
				active_responsive_device = "desktop";
			}
			$.each(
				control_value[active_responsive_device],
				function (prop, val) {
					container
						.find(".ur-button-container button")
						.css("padding-" + prop, val + default_unit);
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
				container
					.find(".ur-button-container button")
					.css("padding-" + prop, val + default_unit);
			});
		});
	});

	/* Button Styles End */

	/* Messages Styles Start */

	// Show error message
	wp.customize(settings + "[messages][show_error_message]", function (value) {
		var toggle_error_message = function (display) {
			container.find(".user-registration-error").remove();
			container
				.find("#ur-submit-message-node.user-registration-error")
				.remove();

			if (true === display) {
				var field_message =
					'<label class="user-registration-error" for="dummy_message">This field is required.</label>';
				var form_message =
					'<div class="ur-message user-registration-error" id="ur-submit-message-node"><ul class=""><li>Email field is required.</li><li>Password field is required.</li></ul></div>';
				container.find(".form-row").append(field_message);
				container.prepend(form_message);
			}
		};

		toggle_error_message(value.get());
		value.bind(function (val) {
			toggle_error_message(val);
		});
	});

	// Error Message Styles: font_size
	wp.customize(settings + "[messages][error_font_size]", function (value) {
		var default_unit = "px";
		value.bind(function (newval) {
			container
				.find(".user-registration-error")
				.css("font-size", newval + default_unit);
		});
	});

	// Error Message Styles: font_color
	var button_pev_hover_font_color = "";
	wp.customize(settings + "[messages][error_font_color]", function (value) {
		value.bind(function (newval) {
			button_pev_hover_font_color = newval;
			container.find(".user-registration-error").css("color", newval);
		});
	});

	// Error Message Styles: background_color
	var button_pev_color = "";
	wp.customize(
		settings + "[messages][error_background_color]",
		function (value) {
			value.bind(function (newval) {
				button_pev_color = newval;
				container
					.find(".user-registration-error")
					.css("background-color", newval);
			});
		}
	);

	// Error Message Styles: font_style
	wp.customize(settings + "[messages][error_font_style]", function (value) {
		value.bind(function (newval) {
			if (typeof newval != "object") {
				newval = JSON.parse(newval);
			}

			$.each(newval, function (prop, val) {
				switch (prop) {
					case "bold":
						container
							.find(".user-registration-error")
							.css(
								"font-weight",
								val === true ? "bold" : "normal"
							);
						break;
					case "italic":
						container
							.find(".user-registration-error")
							.css(
								"font-style",
								val === true ? "italic" : "normal"
							);
						break;
					case "underline":
						container
							.find(".user-registration-error")
							.css(
								"text-decoration",
								val === true ? "underline" : "none"
							);
						break;
					case "uppercase":
						container
							.find(".user-registration-error")
							.css(
								"text-transform",
								val === true ? "uppercase" : "none"
							);
						break;
				}
			});
		});
	});

	// Error Message Styles: alignment
	wp.customize(settings + "[messages][error_alignment]", function (value) {
		value.bind(function (newval) {
			container
				.find(".user-registration-error")
				.css("text-align", newval);
		});
	});

	// Error Message Styles: border_type
	wp.customize(settings + "[messages][error_border_type]", function (value) {
		value.bind(function (newval) {
			container
				.find(".user-registration-error")
				.css("border-style", newval);
		});
	});

	// Error Message Styles: border_width
	wp.customize(settings + "[messages][error_border_width]", function (value) {
		value.bind(function (newval) {
			var default_unit = "px";
			if (typeof newval != "object") {
				newval = JSON.parse(newval);
			}
			$.each(newval, function (prop, val) {
				if (dimension_directions.indexOf(prop) != -1) {
					container
						.find(".user-registration-error")
						.css("border-" + prop + "-width", val + default_unit);
				}
			});
		});
	});

	// Error Message Styles: border_color
	var button_pev_border_hover_color = "";
	wp.customize(settings + "[messages][error_border_color]", function (value) {
		value.bind(function (newval) {
			button_pev_border_hover_color = newval;
			container
				.find(".user-registration-error")
				.css("border-color", newval);
		});
	});

	// Error Message Styles: border_radius
	wp.customize(
		settings + "[messages][error_border_radius]",
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
								.find(".user-registration-error")
								.css("border-top-left-radius", val + unit);
							break;
						case "right":
							container
								.find(".user-registration-error")
								.css("border-top-right-radius", val + unit);
							break;
						case "bottom":
							container
								.find(".user-registration-error")
								.css("border-bottom-right-radius", val + unit);
							break;
						case "left":
							container
								.find(".user-registration-error")
								.css("border-bottom-left-radius", val + unit);
							break;
					}
				});
			});
		}
	);

	// Error Message Styles: line_height
	wp.customize(settings + "[messages][error_line_height]", function (value) {
		value.bind(function (newval) {
			container
				.find(".user-registration-error")
				.css("line-height", newval);
		});
	});

	// Error Message Styles: margin
	wp.customize(settings + "[messages][error_margin]", function (value) {
		preview_buttons.on("click", function () {
			var control_value = value.get();
			var active_responsive_device = $(this).data("device");
			var default_unit = "px";

			container.find(".user-registration-error").css("margin", "");
			if (typeof control_value[active_responsive_device] == "undefined") {
				active_responsive_device = "desktop";
			}
			$.each(
				control_value[active_responsive_device],
				function (prop, val) {
					container
						.find(".user-registration-error")
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
				container
					.find(".user-registration-error")
					.css("margin-" + prop, val + default_unit);
			});
		});
	});

	// Error Message Styles: padding
	wp.customize(settings + "[messages][error_padding]", function (value) {
		preview_buttons.on("click", function () {
			var control_value = value.get();
			var active_responsive_device = $(this).data("device");
			var default_unit = "px";

			container.find(".user-registration-error").css("padding", "");
			if (typeof control_value[active_responsive_device] == "undefined") {
				active_responsive_device = "desktop";
			}
			$.each(
				control_value[active_responsive_device],
				function (prop, val) {
					container
						.find(".user-registration-error")
						.css("padding-" + prop, val + default_unit);
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
				container
					.find(".user-registration-error")
					.css("padding-" + prop, val + default_unit);
			});
		});
	});
	/* Error Message Styles End */

	// Show success message
	wp.customize(
		settings + "[messages][show_success_message]",
		function (value) {
			var toggle_success_message = function (display) {
				container
					.find("#ur-submit-message-node.user-registration-message")
					.remove();

				if (true === display) {
					var message =
						'<div class="ur-message user-registration-message" id="ur-submit-message-node"><ul class=""><li>User successfully registered.</li></ul></div>';
					container.append(message);
				}
			};

			toggle_success_message(value.get());
			value.bind(function (val) {
				toggle_success_message(val);
			});
		}
	);

	// Success Message Styles: font_size
	wp.customize(settings + "[messages][success_font_size]", function (value) {
		var default_unit = "px";
		value.bind(function (newval) {
			container
				.find(".user-registration-message")
				.css("font-size", newval + default_unit);
		});
	});

	// Success Message Styles: font_color
	var button_pev_hover_font_color = "";
	wp.customize(settings + "[messages][success_font_color]", function (value) {
		value.bind(function (newval) {
			button_pev_hover_font_color = newval;
			container.find(".user-registration-message").css("color", newval);
		});
	});

	// Success Message Styles: background_color
	var button_pev_color = "";
	wp.customize(
		settings + "[messages][success_background_color]",
		function (value) {
			value.bind(function (newval) {
				button_pev_color = newval;
				container
					.find(".user-registration-message")
					.css("background-color", newval);
			});
		}
	);

	// Success Message Styles: font_style
	wp.customize(settings + "[messages][success_font_style]", function (value) {
		value.bind(function (newval) {
			if (typeof newval != "object") {
				newval = JSON.parse(newval);
			}

			$.each(newval, function (prop, val) {
				switch (prop) {
					case "bold":
						container
							.find(".user-registration-message")
							.css(
								"font-weight",
								val === true ? "bold" : "normal"
							);
						break;
					case "italic":
						container
							.find(".user-registration-message")
							.css(
								"font-style",
								val === true ? "italic" : "normal"
							);
						break;
					case "underline":
						container
							.find(".user-registration-message")
							.css(
								"text-decoration",
								val === true ? "underline" : "none"
							);
						break;
					case "uppercase":
						container
							.find(".user-registration-message")
							.css(
								"text-transform",
								val === true ? "uppercase" : "none"
							);
						break;
				}
			});
		});
	});

	// Success Message Styles: alignment
	wp.customize(settings + "[messages][success_alignment]", function (value) {
		value.bind(function (newval) {
			container
				.find(".user-registration-message")
				.css("text-align", newval);
		});
	});

	// Success Message Styles: border_type
	wp.customize(
		settings + "[messages][success_border_type]",
		function (value) {
			value.bind(function (newval) {
				container
					.find(".user-registration-message")
					.css("border-style", newval);
			});
		}
	);

	// Success Message Styles: border_width
	wp.customize(
		settings + "[messages][success_border_width]",
		function (value) {
			value.bind(function (newval) {
				var default_unit = "px";
				if (typeof newval != "object") {
					newval = JSON.parse(newval);
				}
				$.each(newval, function (prop, val) {
					if (dimension_directions.indexOf(prop) != -1) {
						container
							.find(".user-registration-message")
							.css(
								"border-" + prop + "-width",
								val + default_unit
							);
					}
				});
			});
		}
	);

	// Success Message Styles: border_color
	var button_pev_border_hover_color = "";
	wp.customize(
		settings + "[messages][success_border_color]",
		function (value) {
			value.bind(function (newval) {
				button_pev_border_hover_color = newval;
				container
					.find(".user-registration-message")
					.css("border-color", newval);
			});
		}
	);

	// Success Message Styles: border_radius
	wp.customize(
		settings + "[messages][success_border_radius]",
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
								.find(".user-registration-message")
								.css("border-top-left-radius", val + unit);
							break;
						case "right":
							container
								.find(".user-registration-message")
								.css("border-top-right-radius", val + unit);
							break;
						case "bottom":
							container
								.find(".user-registration-message")
								.css("border-bottom-right-radius", val + unit);
							break;
						case "left":
							container
								.find(".user-registration-message")
								.css("border-bottom-left-radius", val + unit);
							break;
					}
				});
			});
		}
	);

	// Success Message Styles: line_height
	wp.customize(
		settings + "[messages][success_line_height]",
		function (value) {
			value.bind(function (newval) {
				container
					.find(".user-registration-message")
					.css("line-height", newval);
			});
		}
	);

	// Success Message Styles: margin
	wp.customize(settings + "[messages][success_margin]", function (value) {
		preview_buttons.on("click", function () {
			var control_value = value.get();
			var active_responsive_device = $(this).data("device");
			var default_unit = "px";

			container.find(".user-registration-message").css("margin", "");
			if (typeof control_value[active_responsive_device] == "undefined") {
				active_responsive_device = "desktop";
			}
			$.each(
				control_value[active_responsive_device],
				function (prop, val) {
					container
						.find(".user-registration-message")
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
				container
					.find(".user-registration-message")
					.css("margin-" + prop, val + default_unit);
			});
		});
	});

	// Success Message Styles: padding
	wp.customize(settings + "[messages][success_padding]", function (value) {
		preview_buttons.on("click", function () {
			var control_value = value.get();
			var active_responsive_device = $(this).data("device");
			var default_unit = "px";

			container.find(".user-registration-message").css("padding", "");
			if (typeof control_value[active_responsive_device] == "undefined") {
				active_responsive_device = "desktop";
			}
			$.each(
				control_value[active_responsive_device],
				function (prop, val) {
					container
						.find(".user-registration-message")
						.css("padding-" + prop, val + default_unit);
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
				container
					.find(".user-registration-message")
					.css("padding-" + prop, val + default_unit);
			});
		});
	});
	/* Success Message Styles End */

	/* Messages Styles End */

	/*
	 * Login Form Styles
	 */

	// Active template.
	wp.customize(login_settings + "[template]", function (value) {
		controls_wrapper
			.find(".control-section-ur-templates")
			.find(".customize-template-name")
			.text(data.templates[value.get()].name);
		value.bind(function (newval) {
			controls_wrapper
				.find(".control-section-ur-templates")
				.find(".customize-template-name")
				.text(data.templates[newval].name);
		});
	});

	// Form Wrapper: width
	wp.customize(login_settings + "[wrapper][width]", function (value) {
		value.bind(function (newval) {
			login_container.css("width", newval + "%");
			login_container
				.closest("#user-registration")
				.find(".user-registration-error")
				.css("width", newval + "%");
		});
	});

	// Form Wrapper: font_family
	wp.customize(login_settings + "[wrapper][font_family]", function (value) {
		value.bind(function (newval) {
			if ("" === newval) {
				login_container.css("font-family", "inherit");
			} else {
				addGoogleFont(newval);
				login_container.css("font-family", newval);
			}
		});
	});

	// Form Wrapper: background_color
	wp.customize(
		login_settings + "[wrapper][background_color]",
		function (value) {
			value.bind(function (newval) {
				login_container.css("background-color", newval);
			});
		}
	);

	// Form Wrapper: background_image
	wp.customize(
		login_settings + "[wrapper][background_image]",
		function (value) {
			value.bind(function (newval) {
				login_container.css("background-image", "url(" + newval + ")");
			});
		}
	);

	// Form Wrapper: background_size
	wp.customize(
		login_settings + "[wrapper][background_size]",
		function (value) {
			value.bind(function (newval) {
				login_container.css("background-size", newval);
			});
		}
	);

	// Form Wrapper: background_position_x
	wp.customize(
		login_settings + "[wrapper][background_position_x]",
		function (value) {
			value.bind(function (newval) {
				var position = newval;
				wp.customize(
					login_settings + "[wrapper][background_position_y]",
					function (value) {
						position += " " + value.get();
					}
				);
				login_container.css("background-position", position);
			});
		}
	);

	// Form Wrapper: background_position_y
	wp.customize(
		login_settings + "[wrapper][background_position_y]",
		function (value) {
			value.bind(function (newval) {
				var position = "";
				wp.customize(
					login_settings + "[wrapper][background_position_x]",
					function (value) {
						position += value.get();
					}
				);
				position += " " + newval;
				login_container.css("background-position", position);
			});
		}
	);

	// Form Wrapper: background_repeat
	wp.customize(
		login_settings + "[wrapper][background_repeat]",
		function (value) {
			value.bind(function (newval) {
				login_container.css("background-repeat", newval);
			});
		}
	);

	// Form Wrapper: background_attachment
	wp.customize(
		login_settings + "[wrapper][background_attachment]",
		function (value) {
			value.bind(function (newval) {
				login_container.css("background-attachment", newval);
			});
		}
	);

	// Form Wrapper: border_type
	wp.customize(login_settings + "[wrapper][border_type]", function (value) {
		value.bind(function (newval) {
			login_container.css("border-style", newval);

			wp.customize(
				login_settings + "[wrapper][border_color]",
				function (value) {
					login_container.css("border-color", value.get());
				}
			);
		});
	});

	// Form Wrapper: border_width
	wp.customize(login_settings + "[wrapper][border_width]", function (value) {
		value.bind(function (newval) {
			var default_unit = "px";

			if (typeof newval != "object") {
				newval = JSON.parse(newval);
			}

			$.each(newval, function (prop, val) {
				if (dimension_directions.indexOf(prop) != -1) {
					login_container.css(
						"border-" + prop + "-width",
						val + default_unit
					);
				}
			});
		});
	});

	// Form Wrapper: border_color
	wp.customize(login_settings + "[wrapper][border_color]", function (value) {
		value.bind(function (newval) {
			login_container.css("border-color", newval);
		});
	});

	// Form Wrapper: border_radius
	wp.customize(login_settings + "[wrapper][border_radius]", function (value) {
		value.bind(function (newval) {
			if (typeof newval != "object") {
				newval = JSON.parse(newval);
			}

			var unit = newval["unit"];

			$.each(newval, function (prop, val) {
				switch (prop) {
					case "top":
						login_container.css(
							"border-top-left-radius",
							val + unit
						);
						break;
					case "right":
						login_container.css(
							"border-top-right-radius",
							val + unit
						);
						break;
					case "bottom":
						login_container.css(
							"border-bottom-right-radius",
							val + unit
						);
						break;
					case "left":
						login_container.css(
							"border-bottom-left-radius",
							val + unit
						);
						break;
				}
			});
		});
	});

	// Form Wrapper: margin
	wp.customize(login_settings + "[wrapper][margin]", function (value) {
		preview_buttons.on("click", function () {
			var control_value = value.get();
			var active_responsive_device = $(this).data("device");
			var default_unit = "px";

			login_container.css("margin", "");
			if (typeof control_value[active_responsive_device] == "undefined") {
				active_responsive_device = "desktop";
			}
			$.each(
				control_value[active_responsive_device],
				function (prop, val) {
					login_container.css("margin-" + prop, val + default_unit);
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
				login_container.css("margin-" + prop, val + default_unit);
			});
		});
	});

	// Form Wrapper: padding
	wp.customize(login_settings + "[wrapper][padding]", function (value) {
		preview_buttons.on("click", function () {
			var control_value = value.get();
			var active_responsive_device = $(this).data("device");
			var default_unit = "px";

			login_container.css("padding", "");
			if (typeof control_value[active_responsive_device] == "undefined") {
				active_responsive_device = "desktop";
			}
			$.each(
				control_value[active_responsive_device],
				function (prop, val) {
					login_container.css("padding-" + prop, val + default_unit);
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
				login_container.css("padding-" + prop, val + default_unit);
			});
		});
	});

	/* Form Wrapper End */

	/* Field Labels Start */

	// Field Labels: font_size
	wp.customize(login_settings + "[field_label][font_size]", function (value) {
		var default_unit = "px";
		value.bind(function (newval) {
			login_field_label.css("font-size", newval + default_unit);
		});
	});

	// Field Labels: color
	wp.customize(
		login_settings + "[field_label][font_color]",
		function (value) {
			value.bind(function (newval) {
				login_field_label.css("color", newval);
			});
		}
	);

	// Field Labels: font_style
	wp.customize(
		login_settings + "[field_label][font_style]",
		function (value) {
			value.bind(function (newval) {
				if (typeof newval != "object") {
					newval = JSON.parse(newval);
				}

				$.each(newval, function (prop, val) {
					switch (prop) {
						case "bold":
							login_field_label.css(
								"font-weight",
								val === true ? "bold" : "normal"
							);
							break;
						case "italic":
							login_field_label.css(
								"font-style",
								val === true ? "italic" : "normal"
							);
							break;
						case "underline":
							login_field_label.css(
								"text-decoration",
								val === true ? "underline" : "none"
							);
							break;
						case "uppercase":
							login_field_label.css(
								"text-transform",
								val === true ? "uppercase" : "none"
							);
							break;
					}
				});
			});
		}
	);

	// Field Labels: text_alignment
	wp.customize(
		login_settings + "[field_label][text_alignment]",
		function (value) {
			value.bind(function (newval) {
				login_field_label.css("text-align", newval);
			});
		}
	);

	// Field Labels: line_height
	wp.customize(
		login_settings + "[field_label][line_height]",
		function (value) {
			value.bind(function (newval) {
				login_field_label.css("line-height", newval);
			});
		}
	);

	// Field Labels: margin
	wp.customize(login_settings + "[field_label][margin]", function (value) {
		preview_buttons.on("click", function () {
			var control_value = value.get();
			var active_responsive_device = $(this).data("device");
			var default_unit = "px";

			login_field_label.css("margin", "");
			if (typeof control_value[active_responsive_device] == "undefined") {
				active_responsive_device = "desktop";
			}
			$.each(
				control_value[active_responsive_device],
				function (prop, val) {
					login_field_label.css("margin-" + prop, val + default_unit);
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
				login_field_label.css("margin-" + prop, val + default_unit);
			});
		});
	});

	// Field Labels: padding
	wp.customize(login_settings + "[field_label][padding]", function (value) {
		preview_buttons.on("click", function () {
			var control_value = value.get();
			var active_responsive_device = $(this).data("device");
			var default_unit = "px";

			login_field_label.css("padding", "");
			if (typeof control_value[active_responsive_device] == "undefined") {
				active_responsive_device = "desktop";
			}
			$.each(
				control_value[active_responsive_device],
				function (prop, val) {
					login_field_label.css(
						"padding-" + prop,
						val + default_unit
					);
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
				login_field_label.css("padding-" + prop, val + default_unit);
			});
		});
	});

	/* Field Labels End */

	/* Field Styles Start */

	// Field Styles: font_size
	wp.customize(
		login_settings + "[field_styles][font_size]",
		function (value) {
			var default_unit = "px";
			value.bind(function (newval) {
				login_container
					.find("input.input-text")
					.css("font-size", newval + default_unit);
			});
		}
	);

	// Field Styles: font_color
	var prev_field_style_font_color = "";
	wp.customize(
		login_settings + "[field_styles][font_color]",
		function (value) {
			value.bind(function (newval) {
				prev_field_style_font_color = newval;
				login_container.find("input.input-text").css("color", newval);
			});
		}
	);

	// Field Styles: font_style
	wp.customize(
		login_settings + "[field_styles][font_style]",
		function (value) {
			value.bind(function (newval) {
				var id = login_container.attr("id");
				if (typeof newval != "object") {
					newval = JSON.parse(newval);
				}

				$.each(newval, function (prop, val) {
					var string_value = "";
					switch (prop) {
						case "bold":
							string_value = val === true ? "bold" : "normal";
							login_container
								.find("input.input-text")
								.css("font-weight", string_value);
							login_container
								.find("style#placeholder-" + id)
								.html(
									addPlaceholderStyles(id, {
										weight: string_value,
									})
								);
							break;
						case "italic":
							string_value = val === true ? "italic" : "normal";
							login_container
								.find("input.input-text")
								.css("font-style", string_value);
							login_container
								.find("style#placeholder-" + id)
								.html(
									addPlaceholderStyles(id, {
										style: string_value,
									})
								);
							break;
						case "underline":
							string_value = val === true ? "underline" : "none";
							login_container
								.find("input.input-text")
								.css("text-decoration", string_value);
							login_container
								.find("style#placeholder-" + id)
								.html(
									addPlaceholderStyles(id, {
										decoration: string_value,
									})
								);
							break;
						case "uppercase":
							string_value = val === true ? "uppercase" : "none";
							login_container
								.find("input.input-text")
								.css("text-transform", string_value);
							login_container
								.find("style#placeholder-" + id)
								.html(
									addPlaceholderStyles(id, {
										transform: string_value,
									})
								);
							break;
					}
				});
			});
		}
	);

	// Field Styles: alignment
	wp.customize(
		login_settings + "[field_styles][alignment]",
		function (value) {
			value.bind(function (newval) {
				login_container
					.find("input, textarea")
					.css("text-align", newval);
				login_container.find("select").css("text-align-last", newval);

				var option_direction = "ltr";
				if ("right" == newval) {
					option_direction = "rtl";
				}

				login_container
					.find("option")
					.css("direction", option_direction);
			});
		}
	);

	// Field Styles: border_type
	wp.customize(
		login_settings + "[field_styles][border_type]",
		function (value) {
			value.bind(function (newval) {
				login_container
					.find("input.input-text")
					.css("border-style", newval);
			});
		}
	);

	// Field Styles: border_width
	wp.customize(
		login_settings + "[field_styles][border_width]",
		function (value) {
			value.bind(function (newval) {
				var default_unit = "px";

				if (typeof newval != "object") {
					newval = JSON.parse(newval);
				}

				$.each(newval, function (prop, val) {
					if (dimension_directions.indexOf(prop) != -1) {
						login_container
							.find("input.input-text")
							.css(
								"border-" + prop + "-width",
								val + default_unit
							);
					}
				});
			});
		}
	);

	// Field Styles: border_color
	var prev_border_color = "";
	wp.customize(
		login_settings + "[field_styles][border_color]",
		function (value) {
			value.bind(function (newval) {
				prev_border_color = newval;
				login_container
					.find("input.input-text")
					.css("border-color", newval);
			});
		}
	);

	// Field Styles: border_focus_color
	wp.customize(
		login_settings + "[field_styles][border_focus_color]",
		function (value) {
			login_container
				.find("input.input-text")
				.on("focus blur", function (e) {
					if ("focus" == e.type) {
						var control_value = value.get();
						$(this).css("border-color", control_value);
					} else {
						$(this).css("border-color", prev_border_color);
					}
				});
		}
	);

	// Field Styles: border_radius
	wp.customize(
		login_settings + "[field_styles][border_radius]",
		function (value) {
			value.bind(function (newval) {
				if (typeof newval != "object") {
					newval = JSON.parse(newval);
				}

				var unit = newval["unit"];

				$.each(newval, function (prop, val) {
					switch (prop) {
						case "top":
							login_container
								.find("input.input-text")
								.css("border-top-left-radius", val + unit);
							break;
						case "right":
							login_container
								.find("input.input-text")
								.css("border-top-right-radius", val + unit);
							break;
						case "bottom":
							login_container
								.find("input.input-text")
								.css("border-bottom-right-radius", val + unit);
							break;
						case "left":
							login_container
								.find("input.input-text")
								.css("border-bottom-left-radius", val + unit);
							break;
					}
				});
			});
		}
	);

	// Field Styles: background_color
	wp.customize(
		login_settings + "[field_styles][background_color]",
		function (value) {
			value.bind(function (newval) {
				login_container
					.find("input.input-text")
					.css("background-color", newval);
			});
		}
	);

	// Field Styles: margin
	wp.customize(login_settings + "[field_styles][margin]", function (value) {
		preview_buttons.on("click", function () {
			var control_value = value.get();
			var active_responsive_device = $(this).data("device");
			var default_unit = "px";

			login_container.find("input.input-text").css("margin", "");
			if (typeof control_value[active_responsive_device] == "undefined") {
				active_responsive_device = "desktop";
			}
			$.each(
				control_value[active_responsive_device],
				function (prop, val) {
					login_container
						.find("input.input-text")
						.css("margin-" + prop, val + default_unit);
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
				login_container
					.find("input.input-text")
					.css("margin-" + prop, val + default_unit);
			});
		});
	});

	// Field Styles: padding
	wp.customize(login_settings + "[field_styles][padding]", function (value) {
		preview_buttons.on("click", function () {
			var control_value = value.get();
			var active_responsive_device = $(this).data("device");
			var default_unit = "px";

			login_container.find("input.input-text").css("padding", "");
			if (typeof control_value[active_responsive_device] == "undefined") {
				active_responsive_device = "desktop";
			}
			$.each(
				control_value[active_responsive_device],
				function (prop, val) {
					login_container
						.find("input.input-text")
						.css("padding-" + prop, val + default_unit);
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
				login_container
					.find("input.input-text")
					.css("padding-" + prop, val + default_unit);
			});
		});
	});

	/* Field Styles End */

	/* Checkbox Styles Starts */

	// Checkbox: font_size
	wp.customize(
		login_settings + "[checkbox_radio_styles][font_size]",
		function (value) {
			var default_unit = "px";
			value.bind(function (newval) {
				login_container
					.find("label.user-registration-form__label-for-checkbox")
					.css("font-size", newval + default_unit);
			});
		}
	);

	// Checkbox: font_color
	wp.customize(
		login_settings + "[checkbox_radio_styles][font_color]",
		function (value) {
			value.bind(function (newval) {
				login_container
					.find("label.user-registration-form__label-for-checkbox")
					.css("color", newval);
			});
		}
	);

	// Checkbox: font_style
	wp.customize(
		login_settings + "[checkbox_radio_styles][font_style]",
		function (value) {
			value.bind(function (newval) {
				if (typeof newval != "object") {
					newval = JSON.parse(newval);
				}

				$.each(newval, function (prop, val) {
					switch (prop) {
						case "bold":
							login_container
								.find(
									"label.user-registration-form__label-for-checkbox"
								)
								.css(
									"font-weight",
									val === true ? "bold" : "normal"
								);
							break;
						case "italic":
							login_container
								.find(
									"label.user-registration-form__label-for-checkbox"
								)
								.css(
									"font-style",
									val === true ? "italic" : "normal"
								);
							break;
						case "underline":
							login_container
								.find(
									"label.user-registration-form__label-for-checkbox"
								)
								.css(
									"text-decoration",
									val === true ? "underline" : "none"
								);
							break;
						case "uppercase":
							login_container
								.find(
									"label.user-registration-form__label-for-checkbox"
								)
								.css(
									"text-transform",
									val === true ? "uppercase" : "none"
								);
							break;
					}
				});
			});
		}
	);

	// Checkbox Styles: design_style
	wp.customize(
		login_settings + "[checkbox_radio_styles][style_variation]",
		function (value) {
			var id = login_container.attr("id");
			value.bind(function (newval) {
				var size = 0;
				var color = "";
				var checked_color = "";
				wp.customize(
					login_settings + "[checkbox_radio_styles][size]",
					function (value) {
						var default_unit = "px";
						size = value.get() + default_unit;
					}
				);
				wp.customize(
					login_settings + "[checkbox_radio_styles][color]",
					function (value) {
						color = value.get();
					}
				);
				wp.customize(
					login_settings + "[checkbox_radio_styles][checked_color]",
					function (value) {
						checked_color = value.get();
					}
				);
				var input = login_container.find(
					"label.user-registration-form__label-for-checkbox input"
				);
				switch (newval) {
					case "outline":
						login_container
							.find("style#placeholder")
							.html(
								addInputStylesOutlineVariation(
									"",
									color,
									checked_color
								)
							);
						input.css({
							width: size,
							height: size,
							display: "inline-block",
							"text-align": "center",
							"background-color": "transparent",
							border: "1px solid " + color,
						});
						break;
					case "filled":
						login_container
							.find("style#placeholder")
							.html(
								addInputStylesFilledVariation("", checked_color)
							);
						input.css({
							border: "",
							width: size,
							height: size,
							display: "inline-block",
							"text-align": "center",
							"background-color": color,
							border: "none",
						});
						break;
					default:
						login_container
							.find("style#placeholder")
							.html(addInputStylesDefaultVariation(""));
						input.css({
							width: "inherit",
							height: "inherit",
							display: "",
							"text-align": "",
							"background-color": "",
							border: "",
						});
						break;
				}
				var input = login_container.find('input[type="checkbox"]');
				switch (newval) {
					case "outline":
						input.css({
							"-webkit-appearance": "none",
						});
						break;
					case "filled":
						input.css({
							"-webkit-appearance": "none",
						});
						break;
					default:
						input.css({
							"-webkit-appearance": "checkbox",
						});
						break;
				}
			});
		}
	);

	// Checkbox: size
	wp.customize(
		login_settings + "[checkbox_radio_styles][size]",
		function (value) {
			var default_unit = "px";
			value.bind(function (newval) {
				login_container
					.find(
						'label.user-registration-form__label-for-checkbox input[type="checkbox"]'
					)
					.css({
						width: newval + default_unit,
						height: newval + default_unit,
					});
			});
		}
	);

	// Checkbox: color
	wp.customize(
		login_settings + "[checkbox_radio_styles][color]",
		function (value) {
			var style_variation = "default";
			value.bind(function (newval) {
				wp.customize(
					login_settings + "[checkbox_radio_styles][style_variation]",
					function (value) {
						style_variation = value.get();
					}
				);
				if ("outline" === style_variation) {
					login_container
						.find(
							'label.user-registration-form__label-for-checkbox input[type="checkbox"]'
						)
						.css("border-color", newval)
						.css("background-color", "transparent");
				} else if ("filled" === style_variation) {
					login_container
						.find(
							'label.user-registration-form__label-for-checkbox input[type="checkbox"]'
						)
						.css("border-color", newval)
						.css("background-color", newval);
				} else {
					login_container
						.find(
							'label.user-registration-form__label-for-checkbox input[type="checkbox"]'
						)
						.css("border-color", "inherit")
						.css("background-color", "inherit");
				}
			});
		}
	);

	// Checkbox: checked_color
	wp.customize(
		login_settings + "[checkbox_radio_styles][checked_color]",
		function (value) {
			var style_variation = "default";
			var color = "";
			value.bind(function (newval) {
				wp.customize(
					login_settings + "[checkbox_radio_styles][color]",
					function (value) {
						color = value.get();
					}
				);
				wp.customize(
					login_settings + "[checkbox_radio_styles][style_variation]",
					function (value) {
						style_variation = value.get();
					}
				);
				if ("outline" === style_variation) {
					login_container
						.find("style#placeholder")
						.html(
							addInputStylesOutlineVariation("", color, newval)
						);
				} else if ("filled" === style_variation) {
					login_container
						.find("style#placeholder")
						.html(addInputStylesFilledVariation("", newval));
				} else {
					login_container
						.find("style#placeholder")
						.html(addInputStylesDefaultVariation(""));
				}
			});
		}
	);

	// Checkbox Styles: margin
	wp.customize(
		login_settings + "[checkbox_radio_styles][margin]",
		function (value) {
			var inline_style = "default";
			preview_buttons.on("click", function () {
				var control_value = value.get();
				var active_responsive_device = $(this).data("device");
				var default_unit = "px";
				wp.customize(
					login_settings + "[checkbox_radio_styles][inline_style]",
					function (value) {
						inline_style = value.get();
					}
				);

				login_container
					.find(
						".field-radio ul .ur-radio-list, .field-checkbox ul .ur-checkbox-list"
					)
					.css("margin", "");
				if (
					typeof control_value[active_responsive_device] ==
					"undefined"
				) {
					active_responsive_device = "desktop";
				}
				$.each(
					control_value[active_responsive_device],
					function (prop, val) {
						if (
							"two_columns" === inline_style &&
							("right" === prop || "left" === prop)
						) {
							val = 0;
						}
						login_container
							.find(
								"label.user-registration-form__label-for-checkbox"
							)
							.css("margin-" + prop, val + default_unit);
					}
				);
			});
			value.bind(function (newval) {
				var default_unit = "px";
				var active_responsive_device = controls_wrapper
					.find("#customize-footer-actions .devices button.active")
					.data("device");
				wp.customize(
					login_settings + "[checkbox_radio_styles][inline_style]",
					function (value) {
						inline_style = value.get();
					}
				);

				if (typeof newval != "object") {
					newval = JSON.parse(newval);
				}

				$.each(newval[active_responsive_device], function (prop, val) {
					if (
						"two_columns" === inline_style &&
						("right" === prop || "left" === prop)
					) {
						val = 0;
					}
					login_container
						.find(
							"label.user-registration-form__label-for-checkbox"
						)
						.css("margin-" + prop, val + default_unit);
				});
			});
		}
	);

	// Checkbox Styles: padding
	wp.customize(
		login_settings + "[checkbox_radio_styles][padding]",
		function (value) {
			preview_buttons.on("click", function () {
				var control_value = value.get();
				var active_responsive_device = $(this).data("device");
				var default_unit = "px";

				login_container
					.find("label.user-registration-form__label-for-checkbox")
					.css("padding", "");
				if (
					typeof control_value[active_responsive_device] ==
					"undefined"
				) {
					active_responsive_device = "desktop";
				}
				$.each(
					control_value[active_responsive_device],
					function (prop, val) {
						login_container
							.find(
								"label.user-registration-form__label-for-checkbox"
							)
							.css("padding-" + prop, val + default_unit);
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
					login_container
						.find(
							"label.user-registration-form__label-for-checkbox"
						)
						.css("padding-" + prop, val + default_unit);
				});
			});
		}
	);

	/* Checkbox Styles Start */

	/* Button Styles Start */

	// Button Styles: font_size
	wp.customize(login_settings + "[button][font_size]", function (value) {
		var default_unit = "px";
		value.bind(function (newval) {
			login_container
				.find(".user-registration-Button")
				.css("font-size", newval + default_unit);
		});
	});

	// Button Styles: font_style
	wp.customize(login_settings + "[button][font_style]", function (value) {
		value.bind(function (newval) {
			if (typeof newval != "object") {
				newval = JSON.parse(newval);
			}

			$.each(newval, function (prop, val) {
				switch (prop) {
					case "bold":
						login_container
							.find(".user-registration-Button")
							.css(
								"font-weight",
								val === true ? "bold" : "normal"
							);
						break;
					case "italic":
						login_container
							.find(".user-registration-Button")
							.css(
								"font-style",
								val === true ? "italic" : "normal"
							);
						break;
					case "underline":
						login_container
							.find(".user-registration-Button")
							.css(
								"text-decoration",
								val === true ? "underline" : "none"
							);
						break;
					case "uppercase":
						login_container
							.find(".user-registration-Button")
							.css(
								"text-transform",
								val === true ? "uppercase" : "none"
							);
						break;
				}
			});
		});
	});

	// Button Styles: font_color
	var button_pev_hover_font_color = "";
	wp.customize(login_settings + "[button][font_color]", function (value) {
		value.bind(function (newval) {
			button_pev_hover_font_color = newval;
			login_container
				.find(".user-registration-Button")
				.css("color", newval);
		});
	});

	// Button Styles: hover_font_color
	wp.customize(
		login_settings + "[button][hover_font_color]",
		function (value) {
			login_container
				.find(".user-registration-Button")
				.on("mouseover mouseleave", function (e) {
					if ("mouseover" == e.type) {
						var control_value = value.get();
						$(this).css("color", control_value);
					} else {
						$(this).css("color", button_pev_hover_font_color);
					}
				});
		}
	);

	// Button Styles: background_color
	var button_pev_color = "";
	wp.customize(
		login_settings + "[button][background_color]",
		function (value) {
			value.bind(function (newval) {
				button_pev_color = newval;
				login_container
					.find(".user-registration-Button")
					.css("background-color", newval);
			});
		}
	);

	// Button Styles: hover_background_color
	wp.customize(
		login_settings + "[button][hover_background_color]",
		function (value) {
			login_container
				.find(".user-registration-Button")
				.on("mouseover mouseleave", function (e) {
					if ("mouseover" == e.type) {
						var control_value = value.get();
						$(this).css("background-color", control_value);
					} else {
						$(this).css("background-color", button_pev_color);
					}
				});
		}
	);

	// Button Styles: alignment
	wp.customize(login_settings + "[button][alignment]", function (value) {
		value.bind(function (newval) {
			login_container.find(".form-row").css("text-align", newval);
			login_container.find(".form-row").css({
				display: "block",
			});
			login_container.find(".form-row").css({
				float: "none",
			});
		});
	});

	// Button Styles: border_type
	wp.customize(login_settings + "[button][border_type]", function (value) {
		value.bind(function (newval) {
			login_container
				.find(".user-registration-Button")
				.css("border-style", newval);
		});
	});

	// Button Styles: border_width
	wp.customize(login_settings + "[button][border_width]", function (value) {
		value.bind(function (newval) {
			var default_unit = "px";
			if (typeof newval != "object") {
				newval = JSON.parse(newval);
			}
			$.each(newval, function (prop, val) {
				if (dimension_directions.indexOf(prop) != -1) {
					login_container
						.find(".user-registration-Button")
						.css("border-" + prop + "-width", val + default_unit);
				}
			});
		});
	});

	// Button Styles: border_color
	var button_pev_border_hover_color = "";
	wp.customize(login_settings + "[button][border_color]", function (value) {
		value.bind(function (newval) {
			button_pev_border_hover_color = newval;
			login_container
				.find(".user-registration-Button")
				.css("border-color", newval);
		});
	});

	// Button Styles: border_hover_color
	wp.customize(
		login_settings + "[button][border_hover_color]",
		function (value) {
			login_container
				.find(".user-registration-Button")
				.on("mouseover mouseleave", function (e) {
					if ("mouseover" == e.type) {
						var control_value = value.get();
						$(this).css("border-color", control_value);
					} else {
						$(this).css(
							"border-color",
							button_pev_border_hover_color
						);
					}
				});
		}
	);

	// Button Styles: border_radius
	wp.customize(login_settings + "[button][border_radius]", function (value) {
		value.bind(function (newval) {
			if (typeof newval != "object") {
				newval = JSON.parse(newval);
			}

			var unit = newval["unit"];

			$.each(newval, function (prop, val) {
				switch (prop) {
					case "top":
						login_container
							.find(".user-registration-Button")
							.css("border-top-left-radius", val + unit);
						break;
					case "right":
						login_container
							.find(".user-registration-Button")
							.css("border-top-right-radius", val + unit);
						break;
					case "bottom":
						login_container
							.find(".user-registration-Button")
							.css("border-bottom-right-radius", val + unit);
						break;
					case "left":
						login_container
							.find(".user-registration-Button")
							.css("border-bottom-left-radius", val + unit);
						break;
				}
			});
		});
	});

	// Button Styles: line_height
	wp.customize(login_settings + "[button][line_height]", function (value) {
		value.bind(function (newval) {
			login_container
				.find(".user-registration-Button")
				.css("line-height", newval);
		});
	});

	// Button Styles: margin
	wp.customize(login_settings + "[button][margin]", function (value) {
		preview_buttons.on("click", function () {
			var control_value = value.get();
			var active_responsive_device = $(this).data("device");
			var default_unit = "px";

			login_container.find(".user-registration-Button").css("margin", "");
			if (typeof control_value[active_responsive_device] == "undefined") {
				active_responsive_device = "desktop";
			}
			$.each(
				control_value[active_responsive_device],
				function (prop, val) {
					login_container
						.find(".user-registration-Button")
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
				login_container
					.find(".user-registration-Button")
					.css("margin-" + prop, val + default_unit);
			});
		});
	});

	// Button Styles: padding
	wp.customize(login_settings + "[button][padding]", function (value) {
		preview_buttons.on("click", function () {
			var control_value = value.get();
			var active_responsive_device = $(this).data("device");
			var default_unit = "px";

			login_container
				.find(".user-registration-Button")
				.css("padding", "");
			if (typeof control_value[active_responsive_device] == "undefined") {
				active_responsive_device = "desktop";
			}
			$.each(
				control_value[active_responsive_device],
				function (prop, val) {
					login_container
						.find(".user-registration-Button")
						.css("padding-" + prop, val + default_unit);
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
				login_container
					.find(".user-registration-Button")
					.css("padding-" + prop, val + default_unit);
			});
		});
	});

	/* Button Styles End */

	/* Login Messages Styles Start */

	// Show error message
	wp.customize(
		login_settings + "[messages][show_error_message]",
		function (value) {
			var toggle_error_message = function (display) {
				login_container
					.closest("#user-registration")
					.find(".user-registration-error")
					.remove();

				if (true === display) {
					var login_form_message =
						'<ul class="user-registration-error"><li><strong>ERROR:</strong>This is dummy error message.</li></ul>';
					login_container.before(login_form_message);
				}
			};

			toggle_error_message(value.get());
			value.bind(function (val) {
				toggle_error_message(val);
			});
		}
	);

	// Error Message Styles: font_size
	wp.customize(
		login_settings + "[messages][error_font_size]",
		function (value) {
			var default_unit = "px";
			value.bind(function (newval) {
				login_container
					.closest("#user-registration")
					.find(".user-registration-error")
					.css("font-size", newval + default_unit);
			});
		}
	);

	// Error Message Styles: font_color
	var button_pev_hover_font_color = "";
	wp.customize(
		login_settings + "[messages][error_font_color]",
		function (value) {
			value.bind(function (newval) {
				button_pev_hover_font_color = newval;
				login_container
					.closest("#user-registration")
					.find(".user-registration-error")
					.css("color", newval);
			});
		}
	);

	// Error Message Styles: background_color
	var button_pev_color = "";
	wp.customize(
		login_settings + "[messages][error_background_color]",
		function (value) {
			value.bind(function (newval) {
				button_pev_color = newval;
				login_container
					.closest("#user-registration")
					.find(".user-registration-error")
					.css("background-color", newval);
			});
		}
	);

	// Error Message Styles: border_type
	wp.customize(
		login_settings + "[messages][error_border_type]",
		function (value) {
			value.bind(function (newval) {
				login_container
					.closest("#user-registration")
					.find(".user-registration-error")
					.css("border-style", newval);
			});
		}
	);

	// Error Message Styles: border_width
	wp.customize(
		login_settings + "[messages][error_border_width]",
		function (value) {
			value.bind(function (newval) {
				var default_unit = "px";
				if (typeof newval != "object") {
					newval = JSON.parse(newval);
				}
				$.each(newval, function (prop, val) {
					if (dimension_directions.indexOf(prop) != -1) {
						login_container
							.closest("#user-registration")
							.find(".user-registration-error")
							.css(
								"border-" + prop + "-width",
								val + default_unit
							);
					}
				});
			});
		}
	);

	// Error Message Styles: border_color
	var button_pev_border_hover_color = "";
	wp.customize(
		login_settings + "[messages][error_border_color]",
		function (value) {
			value.bind(function (newval) {
				button_pev_border_hover_color = newval;
				login_container
					.closest("#user-registration")
					.find(".user-registration-error")
					.css("border-color", newval);
			});
		}
	);

	// Error Message Styles: border_radius
	wp.customize(
		login_settings + "[messages][error_border_radius]",
		function (value) {
			value.bind(function (newval) {
				if (typeof newval != "object") {
					newval = JSON.parse(newval);
				}

				var unit = newval["unit"];

				$.each(newval, function (prop, val) {
					switch (prop) {
						case "top":
							login_container
								.closest("#user-registration")
								.find(".user-registration-error")
								.css("border-top-left-radius", val + unit);
							break;
						case "right":
							login_container
								.closest("#user-registration")
								.find(".user-registration-error")
								.css("border-top-right-radius", val + unit);
							break;
						case "bottom":
							login_container
								.closest("#user-registration")
								.find(".user-registration-error")
								.css("border-bottom-right-radius", val + unit);
							break;
						case "left":
							login_container
								.closest("#user-registration")
								.find(".user-registration-error")
								.css("border-bottom-left-radius", val + unit);
							break;
					}
				});
			});
		}
	);

	// Error Message Styles: line_height
	wp.customize(
		login_settings + "[messages][error_line_height]",
		function (value) {
			value.bind(function (newval) {
				login_container
					.closest("#user-registration")
					.find(".user-registration-error")
					.css("line-height", newval);
			});
		}
	);
})(jQuery, wp.customize, _urCustomizePreviewL10n);
