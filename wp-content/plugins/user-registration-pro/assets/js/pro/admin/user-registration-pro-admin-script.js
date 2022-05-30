/**
 * UserRegistrationProAdmin JS
 * global user_registration_pro_admin_script_data
 */
jQuery(function ($) {
	var UR_PRO = {
		init: function () {
			this.initalize_form_reset_settings();
			this.initalize_form_auto_password_generation_settings();
			this.initialize_conditional_logic_settings();
			this.initialize_extension_page();
		},
		initalize_form_reset_settings: function () {
			$(document).ready(function () {
				var form_reset_field = $(
						"#user_registration_form_setting_enable_reset_button"
					),
					form_reset_class_field = $(
						"#user_registration_form_setting_form_reset_class_field"
					),
					form_reset_label_field = $(
						"#user_registration_form_setting_form_reset_label_field"
					);

				UR_PRO.settings_fields_toggler(
					form_reset_field,
					form_reset_class_field
				);
				UR_PRO.settings_fields_toggler(
					form_reset_field,
					form_reset_label_field
				);

				// Check if enable search form is checked to hide/show search criteria settings div.
				form_reset_field.on("change", function () {
					UR_PRO.settings_fields_toggler(
						$(this),
						form_reset_class_field
					);
					UR_PRO.settings_fields_toggler(
						$(this),
						form_reset_label_field
					);
				});
			});
		},
		initalize_form_auto_password_generation_settings: function () {
			$(document).ready(function () {
				var auto_password_activate = $(
						"#user_registration_pro_auto_password_activate"
					),
					auto_generated_password_length_field = $(
						"#user_registration_pro_auto_generated_password_length_field"
					);

				UR_PRO.settings_fields_toggler(
					auto_password_activate,
					auto_generated_password_length_field
				);

				// Check if enable search form is checked to hide/show search criteria settings div.
				auto_password_activate.on("change", function () {
					UR_PRO.settings_fields_toggler(
						$(this),
						auto_generated_password_length_field
					);
				});
			});
		},
		initialize_conditional_logic_settings: function () {
			/**
			 * Replace input field according to selected field in list field such as country, select etc.
			 */
			$(document).on(
				"change",
				".ur-conditional-wrapper .ur_conditional_field",
				function () {
					UR_PRO.replaceFieldValues(".ur-conditional-wrapper", this);
				}
			);

			/**
			 * Default Hide show conditional logic container according to enable field.
			 */
			$(document)
				.find(".ur_use_conditional_logic_wrapper")
				.each(function () {
					var wrapper = $(this).closest(
						".ur_conditional_logic_container"
					);
					if (
						$(this).find("#ur_use_conditional_logic").is(":checked")
					) {
						wrapper.find(".ur_conditional_logic_wrapper").show();
					} else {
						wrapper.find(".ur_conditional_logic_wrapper").hide();
					}
				});

			/**
			 * Hide show conditional logic container on change of enable field.
			 */
			$(document).on("change", "#ur_use_conditional_logic", function () {
				var wrapper = $(this).closest(
					".ur_conditional_logic_container"
				);

				if ($(this).is(":checked")) {
					wrapper.find(".ur_conditional_logic_wrapper").show();
				} else {
					wrapper.find(".ur_conditional_logic_wrapper").hide();
				}
			});
		},
		/**
		 * Toggle a field with reference to other field's value.
		 */
		settings_fields_toggler: function (setting, toggle_field) {
			if (setting.is(":checked")) {
				toggle_field.show();
			} else {
				toggle_field.hide();
			}
		},
		/**
		 * Replace Input field with dropdown according to fields like checkbox, select, country, etc.
		 */
		replaceFieldValues: function ($class, $this) {
			var data_type = $("option:selected", $this).attr("data-type");
			var selected_val = $("option:selected", $this).val();
			var input_node = $($this)
				.closest($class)
				.find(".ur-conditional-input");

			//Grab input node attributes
			var nodeName = input_node.attr("name"),
				nodeClass = input_node.attr("class");

			if (
				data_type == "checkbox" ||
				data_type == "radio" ||
				data_type == "select" ||
				data_type == "country" ||
				data_type == "billing_country" ||
				data_type == "shipping_country" ||
				data_type == "select2" ||
				data_type == "multi_select2" ||
				data_type == "multi_choice"
			) {
				if (
					data_type == "select" ||
					data_type == "radio" ||
					data_type == "select2" ||
					data_type == "multi_select2"
				) {
					var values = $(
						'.ur-selected-inputs .ur-selected-item .ur-general-setting-field-name input[value="' +
							selected_val +
							'"]'
					)
						.closest(".ur-selected-item")
						.find(".ur-field option")
						.map(function () {
							return $(this).val();
						});
				} else if (
					data_type == "country" ||
					data_type == "billing_country" ||
					data_type == "shipping_country"
				) {
					var countryKey = $(
						'.ur-selected-inputs .ur-selected-item .ur-general-setting-field-name input[value="' +
							selected_val +
							'"]'
					)
						.closest(".ur-selected-item")
						.find(".ur-field option")
						.map(function () {
							return $(this).val();
						});
					var countryName = $(
						'.ur-selected-inputs .ur-selected-item .ur-general-setting-field-name input[value="' +
							selected_val +
							'"]'
					)
						.closest(".ur-selected-item")
						.find(".ur-field option")
						.map(function () {
							return $(this).text();
						});
				} else {
					var values = $(
						'.ur-selected-inputs .ur-selected-item .ur-general-setting-field-name input[value="' +
							selected_val +
							'"]'
					)
						.closest(".ur-selected-item")
						.find(".ur-field input")
						.map(function () {
							return $(this).val();
						});
				}
				var options = "<option value>--select--</option>";

				if (
					data_type == "country" ||
					data_type == "billing_country" ||
					data_type == "shipping_country"
				) {
					var countries = $(
						'.ur-general-setting-field-name input[value="' +
							selected_val +
							'"'
					)
						.closest(".ur-selected-item")
						.find(
							".ur-advance-selected_countries select option:selected"
						);
					var options_html = [];

					$(this)
						.find(".urcl-value select")
						.html('<option value="">--select--</option>');
					countries.each(function () {
						var country_iso = $(this).val();
						var country_name = $(this).text();

						options_html.push(
							'<option value="' +
								country_iso +
								'">' +
								country_name +
								"</option>"
						);
					});
					options = options_html.join("");
				} else {
					if (values.length == 1 && values[0] === "") {
						options =
							'<option value="1">' +
							urcl_data.checkbox_checked +
							"</option>";
					} else {
						$(values).each(function (index, el) {
							options =
								options +
								'<option value="' +
								el +
								'">' +
								el +
								"</option>";
						});
					}
				}

				input_node.replaceWith(
					'<select name="' +
						nodeName +
						'" class="' +
						nodeClass +
						'">' +
						options +
						"</select>"
				);
			} else {
				input_node.replaceWith(
					'<input type="text" name="' +
						nodeName +
						'" class="' +
						nodeClass +
						'">'
				);
			}
		},
		initialize_extension_page: function () {
			$(".ur_addons_wrap")
				.find(".install-now")
				.on("click", function (event) {
					var this_node = $(this),
						data = {
							action: "user_registration_pro_extension_install",
							security:
								user_registration_pro_admin_script_data.ur_pro_install_extension,
							slug: this_node.data("slug"),
							name: this_node.data("name"),
						};

					event.preventDefault();

					this_node.text("Installing...");
					this_node.append('<span class="ur-spinner"></span>');
					$.ajax({
						url: user_registration_pro_admin_script_data.ajax_url,
						data: data,
						type: "POST",
						success: function (response) {
							var notice_type = response.success
									? "notice-success"
									: "notice-error",
								notice =
									'<div class="notice ' +
									notice_type +
									'"><p>' +
									response.message +
									"</p></div>";

							$(notice).insertBefore(
								this_node
									.closest(".ur_addons_wrap")
									.find(".subsubsub")
							);

							if (response.success) {
								this_node.text("Installed");

								if (response.activateUrl) {
									this_node.text("Activate");
									this_node
										.removeClass("install-now")
										.addClass("activate-now button-primary")
										.attr("href", response.activateUrl);

									this_node
										.closest(".ur-plugin-card-bottom")
										.find(".status-label")
										.removeClass("status-install-now")
										.addClass("status-inactive")
										.text("Inactive");
								}
							} else {
								this_node
									.text(
										user_registration_pro_admin_script_data.ur_pro_extension_installed_failed_text
									)
									.prop("disabled", true);
							}

							$(".ur-spinner").remove();
							this_node.off("click");
						},
					});
				});
		},
	};

	UR_PRO.init();
});
