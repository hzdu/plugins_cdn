/* global user_registration_customize_my_account_preview_script_data */
(function ($, data) {
	var settings = "user_registration_customize_my_account",
		wrapper = $("#user-registration"),
		navWrapper = wrapper.find(".user-registration-MyAccount-navigation"),
		label = wrapper.find("label"),
		field_choice = wrapper.find(".ur-checkbox-list, .ur-radio-list"),
		inputs = wrapper
			.find(
				"input[type=text], .ur-edit-profile-field, .user-registration-Input"
			)
			.not(".input-checkbox")
			.not(".input-radio"),
		buttons = wrapper.find("button.button, a.button, .button");
	(controls_wrapper = $(parent.document).find("#customize-controls")),
		(preview_buttons = controls_wrapper.find(
			"#customize-footer-actions .devices button"
		));
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

		if ($.isArray(font_name)) {
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
	 * Wrapper
	 *
	 * Styles for wrapper and body
	 */
	// Wrapper : background_color
	wp.customize(settings + "[wrapper][background_color]", function (value) {
		value.bind(function (newval) {
			wrapper.css("background-color", newval);
		});
	});

	// Wrapper:main-content padding
	wp.customize(settings + "[wrapper][content_padding]", function (value) {
		preview_buttons.on("click", function () {
			var control_value = value.get();
			var active_responsive_device = $(this).data("device");
			var default_unit = "px";

			wrapper
				.find(".user-registration-MyAccount-content")
				.css("padding", "");
			if (typeof control_value[active_responsive_device] == "undefined") {
				active_responsive_device = "desktop";
			}
			$.each(
				control_value[active_responsive_device],
				function (prop, val) {
					wrapper
						.find(".user-registration-MyAccount-content")
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
					.find(".user-registration-MyAccount-content")
					.css("padding-" + prop, val + default_unit);
			});
		});
	});

	// Wrapper: margin
	wp.customize(settings + "[wrapper][margin]", function (value) {
		preview_buttons.on("click", function () {
			var control_value = value.get();
			var active_responsive_device = $(this).data("device");
			var default_unit = "px";

			wrapper.css("margin", "");
			if (typeof control_value[active_responsive_device] == "undefined") {
				active_responsive_device = "desktop";
			}
			$.each(
				control_value[active_responsive_device],
				function (prop, val) {
					wrapper.css("margin-" + prop, val + default_unit);
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
				wrapper.css("margin-" + prop, val + default_unit);
			});
		});
	});

	// Wrapper : border_type
	wp.customize(settings + "[wrapper][border_type]", function (value) {
		value.bind(function (newval) {
			wrapper.css("border-style", newval);

			wp.customize(
				settings + "[wrapper][border_color]",
				function (value) {
					wrapper.css("border-color", value.get());
				}
			);
		});
	});

	// Wrapper : border_width
	wp.customize(settings + "[wrapper][border_width]", function (value) {
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

	// Wrapper : border_color
	wp.customize(settings + "[wrapper][border_color]", function (value) {
		value.bind(function (newval) {
			wrapper.css("border-color", newval);
		});
	});

	// Wrapper : border_radius
	wp.customize(settings + "[wrapper][border_radius]", function (value) {
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

	/*
	 * Color
	 *
	 * Global styles for color
	 */
	// Color : heading
	wp.customize(settings + "[color][heading]", function (value) {
		value.bind(function (newval) {
			wrapper.find(":header").css("color", newval);
		});
	});
	// Color : body
	wp.customize(settings + "[color][body]", function (value) {
		value.bind(function (newval) {
			wrapper.find("p").css("color", newval);
		});
	});
	// Color : link
	var pre_link_color = "";
	wp.customize(settings + "[color][link]", function (value) {
		value.bind(function (newval) {
			pre_link_color = newval;
			wrapper.find("a").css("color", newval);
		});
	});
	// Color : link_hover
	wp.customize(settings + "[color][link_hover]", function (value) {
		value.bind(function (newval) {
			wrapper
				.find("a")
				.on("mouseenter", function () {
					$(this).css("color", newval);
				})
				.on("mouseleave", function () {
					wrapper.find("a").css("color", pre_link_color);
				});
		});
	});

	/*
	 * Navigation
	 *
	 * Global styles for navigation
	 */

	// Navigation Wrapper : Layout style
	wp.customize(settings + "[navigation][navigation_style]", function (value) {
		value.bind(function (newval) {
			if ("horizontal" === newval) {
				wrapper.removeClass("vertical").addClass(newval);
				wrapper.find("nav").css("width", "");
				wrapper
					.find(".user-registration-MyAccount-content")
					.css("width", "");
			} else {
				wrapper.removeClass("horizontal").addClass(newval);
				wrapper.find("nav").css("width", value.get());
				wrapper
					.find(".user-registration-MyAccount-content")
					.css("width", value.get());
			}
		});
	});

	// Navigation Wrapper : Width
	wp.customize(
		settings + "[navigation][nav_wrapper_width]",
		function (value) {
			value.bind(function (newval) {
				navWrapper.css("width", newval + "%");
				wrapper
					.find(".user-registration-MyAccount-content")
					.css("width", Math.round(100 - newval) + "%");
			});
		}
	);

	// Navigation Wrapper : Background color
	wp.customize(
		settings + "[navigation][nav_wrapper_background_color]",
		function (value) {
			value.bind(function (newval) {
				navWrapper.css("background-color", newval);
			});
		}
	);

	// Navigation Wrapper : Border type
	wp.customize(
		settings + "[navigation][nav_wrapper_border_type]",
		function (value) {
			value.bind(function (newval) {
				navWrapper.css("border-style", newval);

				wp.customize(
					settings + "[navigation][nav_wrapper_border_color]",
					function (value) {
						navWrapper.css("border-color", value.get());
					}
				);
			});
		}
	);

	// Navigation Wrapper : Border width
	wp.customize(
		settings + "[navigation][nav_wrapper_border_width]",
		function (value) {
			value.bind(function (newval) {
				var default_unit = "px";

				if (typeof newval != "object") {
					newval = JSON.parse(newval);
				}

				$.each(newval, function (prop, val) {
					if (dimension_directions.indexOf(prop) != -1) {
						navWrapper.css(
							"border-" + prop + "-width",
							val + default_unit
						);
					}
				});
			});
		}
	);

	// Navigation Wrapper : Border color
	wp.customize(
		settings + "[navigation][nav_wrapper_border_color]",
		function (value) {
			value.bind(function (newval) {
				navWrapper.css("border-color", newval);
			});
		}
	);

	// Navigation Wrapper : Border radius
	wp.customize(
		settings + "[navigation][nav_wrapper_border_radius]",
		function (value) {
			value.bind(function (newval) {
				if (typeof newval != "object") {
					newval = JSON.parse(newval);
				}

				var unit = newval["unit"];

				$.each(newval, function (prop, val) {
					switch (prop) {
						case "top":
							navWrapper.css(
								"border-top-left-radius",
								val + unit
							);
							break;
						case "right":
							navWrapper.css(
								"border-top-right-radius",
								val + unit
							);
							break;
						case "bottom":
							navWrapper.css(
								"border-bottom-right-radius",
								val + unit
							);
							break;
						case "left":
							navWrapper.css(
								"border-bottom-left-radius",
								val + unit
							);
							break;
					}
				});
			});
		}
	);

	// Navigation Link : Background color
	var pre_nav_link_background_color = "";
	wp.customize(
		settings + "[navigation][nav_link_background_color]",
		function (value) {
			value.bind(function (newval) {
				pre_nav_link_background_color = newval;
				navWrapper
					.find(".user-registration-MyAccount-navigation-link a")
					.css("background-color", newval);
			});
		}
	);

	// Navigation Link:hover : Background color
	wp.customize(
		settings + "[navigation][hover_background_color]",
		function (value) {
			value.bind(function (newval) {
				navWrapper
					.find(".user-registration-MyAccount-navigation-link a")
					.on("mouseenter", function () {
						$(this).css("background-color", newval);
					})
					.on("mouseleave", function (e) {
						$(this).css(
							"background-color",
							pre_nav_link_background_color
						);
					});
			});
		}
	);

	// Navigation Link : Link color
	var pre_nav_link_text_color = "";
	wp.customize(
		settings + "[navigation][nav_link_text_color]",
		function (value) {
			value.bind(function (newval) {
				pre_nav_link_text_color = newval;
				navWrapper
					.find(".user-registration-MyAccount-navigation-link a")
					.css("color", newval);
			});
		}
	);

	// Navigation Link:hover : Text color
	wp.customize(settings + "[navigation][hover_text_color]", function (value) {
		value.bind(function (newval) {
			navWrapper
				.find(".user-registration-MyAccount-navigation-link a")
				.on("mouseenter", function () {
					$(this).css("color", newval);
				})
				.on("mouseleave", function (e) {
					$(this).css("color", pre_nav_link_text_color);
				});
		});
	});

	// Navigation Link : Border type
	wp.customize(
		settings + "[navigation][nav_link_border_type]",
		function (value) {
			value.bind(function (newval) {
				navWrapper
					.find(".user-registration-MyAccount-navigation-link a")
					.css("border-style", newval);

				wp.customize(
					settings + "[navigation][nav_link_border_color]",
					function (value) {
						navWrapper
							.find(
								".user-registration-MyAccount-navigation-link a"
							)
							.css("border-color", value.get());
					}
				);
			});
		}
	);

	// Navigation Link : Border width
	wp.customize(
		settings + "[navigation][nav_link_border_width]",
		function (value) {
			value.bind(function (newval) {
				var default_unit = "px";

				if (typeof newval != "object") {
					newval = JSON.parse(newval);
				}

				$.each(newval, function (prop, val) {
					if (dimension_directions.indexOf(prop) != -1) {
						navWrapper
							.find(
								".user-registration-MyAccount-navigation-link a"
							)
							.css(
								"border-" + prop + "-width",
								val + default_unit
							);
					}
				});
			});
		}
	);

	// Navigation Link : Border color
	var pre_nav_link_border_color = "";
	wp.customize(
		settings + "[navigation][nav_link_border_color]",
		function (value) {
			value.bind(function (newval) {
				pre_nav_link_border_color = newval;
				navWrapper
					.find(".user-registration-MyAccount-navigation-link a")
					.css("border-color", newval);
			});
		}
	);

	// Navigation Link:hover: Border color
	wp.customize(
		settings + "[navigation][hover_nav_link_border_color]",
		function (value) {
			value.bind(function (newval) {
				navWrapper
					.find(".user-registration-MyAccount-navigation-link a")
					.on("mouseenter", function () {
						$(this).css("border-color", newval);
					})
					.on("mouseleave", function (e) {
						$(this).css("border-color", pre_nav_link_border_color);
					});
			});
		}
	);

	// Navigation Link: padding
	wp.customize(settings + "[navigation][padding]", function (value) {
		preview_buttons.on("click", function () {
			var control_value = value.get();
			var active_responsive_device = $(this).data("device");
			var default_unit = "px";

			navWrapper
				.find(".user-registration-MyAccount-navigation-link a")
				.css("padding", "");
			if (typeof control_value[active_responsive_device] == "undefined") {
				active_responsive_device = "desktop";
			}
			$.each(
				control_value[active_responsive_device],
				function (prop, val) {
					navWrapper
						.find(".user-registration-MyAccount-navigation-link a")
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
				navWrapper
					.find(".user-registration-MyAccount-navigation-link a")
					.css("padding-" + prop, val + default_unit);
			});
		});
	});

	// Navigation Link : Border radius
	wp.customize(
		settings + "[navigation][nav_link_border_radius]",
		function (value) {
			value.bind(function (newval) {
				if (typeof newval != "object") {
					newval = JSON.parse(newval);
				}

				var unit = newval["unit"];

				$.each(newval, function (prop, val) {
					switch (prop) {
						case "top":
							navWrapper
								.find("li, a")
								.css("border-top-left-radius", val + unit);
							break;
						case "right":
							navWrapper
								.find("li, a")
								.css("border-top-right-radius", val + unit);
							break;
						case "bottom":
							navWrapper
								.find("li, a")
								.css("border-bottom-right-radius", val + unit);
							break;
						case "left":
							navWrapper
								.find("li, a")
								.css("border-bottom-left-radius", val + unit);
							break;
					}
				});
			});
		}
	);

	/*
	 * Form
	 *
	 * Global styles for form
	 */

	// Form : input_padding
	wp.customize(settings + "[form][input_padding]", function (value) {
		preview_buttons.on("click", function () {
			var control_value = value.get();
			var active_responsive_device = $(this).data("device");
			var default_unit = "px";

			inputs.css("padding", "");
			if (typeof control_value[active_responsive_device] == "undefined") {
				active_responsive_device = "desktop";
			}
			$.each(
				control_value[active_responsive_device],
				function (prop, val) {
					inputs.css("padding-" + prop, val + default_unit);
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
				inputs.css("padding-" + prop, val + default_unit);
			});
		});
	});

	// Form : input_background_color
	var pre_input_background_color = "";
	wp.customize(settings + "[form][input_background_color]", function (value) {
		value.bind(function (newval) {
			pre_input_background_color = newval;
			inputs.css("background-color", newval);
		});
	});

	// Form : input_text_color
	var pre_input_text_color = "";
	wp.customize(settings + "[form][input_text_color]", function (value) {
		value.bind(function (newval) {
			pre_input_text_color = newval;
			inputs.css("color", newval);
		});
	});

	// Form : input_focus_background_color
	wp.customize(
		settings + "[form][input_focus_background_color]",
		function (value) {
			value.bind(function (newval) {
				inputs
					.on("focus", function () {
						$(this).css("background-color", newval);
					})
					.on("focusout", function (e) {
						$(this).css(
							"background-color",
							pre_input_background_color
						);
					});
			});
		}
	);

	// Form : input_focus_text_color
	wp.customize(settings + "[form][input_focus_text_color]", function (value) {
		value.bind(function (newval) {
			inputs
				.on("focus", function () {
					$(this).css("color", newval);
				})
				.on("focusout", function (e) {
					$(this).css("color", pre_input_text_color);
				});
		});
	});

	// Form : Border type
	wp.customize(settings + "[form][input_border_type]", function (value) {
		value.bind(function (newval) {
			inputs.css("border-style", newval);

			wp.customize(
				settings + "[form][input_border_color]",
				function (value) {
					inputs.css("border-color", value.get());
				}
			);
		});
	});

	// Form : Border width
	wp.customize(settings + "[form][input_border_width]", function (value) {
		value.bind(function (newval) {
			var default_unit = "px";

			if (typeof newval != "object") {
				newval = JSON.parse(newval);
			}

			$.each(newval, function (prop, val) {
				if (dimension_directions.indexOf(prop) != -1) {
					inputs.css("border-" + prop + "-width", val + default_unit);
				}
			});
		});
	});

	// Form : Border color
	var pre_input_border_color = "";
	wp.customize(settings + "[form][input_border_color]", function (value) {
		value.bind(function (newval) {
			pre_input_border_color = newval;
			inputs.css("border-color", newval);
		});
	});

	// Form : input_focus_border_color
	wp.customize(
		settings + "[form][input_focus_border_color]",
		function (value) {
			value.bind(function (newval) {
				inputs
					.on("focus", function () {
						$(this).css("border-color", newval);
					})
					.on("focusout", function (e) {
						$(this).css("border-color", pre_input_border_color);
					});
			});
		}
	);

	// Form : input_border_radius
	wp.customize(settings + "[form][input_border_radius]", function (value) {
		value.bind(function (newval) {
			if (typeof newval != "object") {
				newval = JSON.parse(newval);
			}

			var unit = newval["unit"];

			$.each(newval, function (prop, val) {
				switch (prop) {
					case "top":
						inputs.css("border-top-left-radius", val + unit);
						break;
					case "right":
						inputs.css("border-top-right-radius", val + unit);
						break;
					case "bottom":
						inputs.css("border-bottom-right-radius", val + unit);
						break;
					case "left":
						inputs.css("border-bottom-left-radius", val + unit);
						break;
				}
			});
		});
	});

	// Form : label_font_size
	wp.customize(settings + "[form][label_font_size]", function (value) {
		value.bind(function (newval) {
			label.css("font-size", newval);
		});
	});

	// Form : label_color
	wp.customize(settings + "[form][label_color]", function (value) {
		value.bind(function (newval) {
			label.css("color", newval);
		});
	});

	// Form : label_margin
	wp.customize(settings + "[form][label_margin]", function (value) {
		preview_buttons.on("click", function () {
			var control_value = value.get();
			var active_responsive_device = $(this).data("device");
			var default_unit = "px";

			label.css("margin", "");
			if (typeof control_value[active_responsive_device] == "undefined") {
				active_responsive_device = "desktop";
			}
			$.each(
				control_value[active_responsive_device],
				function (prop, val) {
					label.css("margin-" + prop, val + default_unit);
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
				label.css("margin-" + prop, val + default_unit);
			});
		});
	});

	// Form : choice_font_size
	wp.customize(settings + "[form][choice_font_size]", function (value) {
		value.bind(function (newval) {
			field_choice.find("label").css("font-size", newval);
		});
	});

	// Form : choice_font_color
	wp.customize(settings + "[form][choice_font_color]", function (value) {
		value.bind(function (newval) {
			field_choice.find("label").css("color", newval);
		});
	});

	// Form : choice_margin
	wp.customize(settings + "[form][choice_margin]", function (value) {
		preview_buttons.on("click", function () {
			var control_value = value.get();
			var active_responsive_device = $(this).data("device");
			var default_unit = "px";

			field_choice.css("margin", "");
			if (typeof control_value[active_responsive_device] == "undefined") {
				active_responsive_device = "desktop";
			}
			$.each(
				control_value[active_responsive_device],
				function (prop, val) {
					field_choice.css("margin-" + prop, val + default_unit);
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
				field_choice.css("margin-" + prop, val + default_unit);
			});
		});
	});

	/*
	 * Button
	 *
	 * Global styles for button
	 */
	// Button : button_font_size
	wp.customize(settings + "[button][button_font_size]", function (value) {
		value.bind(function (newval) {
			buttons.css("font-size", newval);
		});
	});

	// Button: button_margin
	wp.customize(settings + "[button][margin]", function (value) {
		preview_buttons.on("click", function () {
			var control_value = value.get();
			var active_responsive_device = $(this).data("device");
			var default_unit = "px";

			buttons.css("margin", "");
			if (typeof control_value[active_responsive_device] == "undefined") {
				active_responsive_device = "desktop";
			}
			$.each(
				control_value[active_responsive_device],
				function (prop, val) {
					buttons.css("margin-" + prop, val + default_unit);
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
				buttons.css("margin-" + prop, val + default_unit);
			});
		});
	});

	// Button : button_padding
	wp.customize(settings + "[button][padding]", function (value) {
		preview_buttons.on("click", function () {
			var control_value = value.get();
			var active_responsive_device = $(this).data("device");
			var default_unit = "px";

			buttons.css("padding", "");
			if (typeof control_value[active_responsive_device] == "undefined") {
				active_responsive_device = "desktop";
			}
			$.each(
				control_value[active_responsive_device],
				function (prop, val) {
					buttons.css("padding-" + prop, val + default_unit);
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
				buttons.css("padding-" + prop, val + default_unit);
			});
		});
	});

	// Button : button_background_color
	wp.customize(
		settings + "[button][button_background_color]",
		function (value) {
			value.bind(function (newval) {
				buttons.css("background-color", newval);

				buttons.on("mouseleave", function (e) {
					$(this).css("background-color", newval);
				});
			});
		}
	);

	// Button : button_text_color
	wp.customize(settings + "[button][button_text_color]", function (value) {
		value.bind(function (newval) {
			buttons.css("color", newval);

			buttons.on("mouseleave", function (e) {
				$(this).css("color", newval);
			});
		});
	});

	// Button : button_hover_background_color
	wp.customize(
		settings + "[button][button_hover_background_color]",
		function (value) {
			value.bind(function (newval) {
				buttons.on("mouseenter", function () {
					$(this).css("background-color", newval);
				});
			});
		}
	);

	// Button : button_hover_text_color
	wp.customize(
		settings + "[button][button_hover_text_color]",
		function (value) {
			value.bind(function (newval) {
				buttons.on("mouseenter", function () {
					$(this).css("color", newval);
				});
			});
		}
	);
})(jQuery, user_registration_customize_my_account_preview_script_data);
