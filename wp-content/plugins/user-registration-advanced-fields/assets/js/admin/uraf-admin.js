(function ($) {
	var URAF_Admin = {
		init: function () {
			$(
				'.ur-input-type-select2 .ur-field[data-field-key="select2"] select, .ur-input-type-multi-select2 .ur-field[data-field-key="multi_select2"] select'
			).selectWoo();
			$(document).on("click", ".ur-selected-item", function () {
				URAF_Admin.init_settings();
			});
			//GD extension notice.
			$(document).on(
				"mousedown",
				".ur-field-requirements-needed",
				function (e) {
					e.preventDefault();

					var icon = '<i class="dashicons dashicons-lock"></i>';
					var label = $(this).text();
					var title =
						icon +
						'<span class="user-registration-swal2-modal__title">' +
						" GD Library is disabled !!</span>";
					var plan = $(this).data("plan");
					var message =
						" Enable GD library from your hosting provider to use <strong>" +
						label +
						"</strong> field.";

					Swal.fire({
						title: title,
						html: message,
						customClass:
							"user-registration-swal2-modal user-registration-swal2-modal--centered",
						showCloseButton: true,
					}).then(function (result) {});
				}
			);
			URAF_Admin.load_init();
		},

		/**
		 * Load initial configurations.
		 */
		load_init: function () {
			URAF_Admin.add_phone_mask_templates();

			$(document.body).on(
				"ur_new_field_created",
				URAF_Admin.add_phone_mask_templates
			);
		},

		/**
		 * Initialize settings of advanced fields.
		 */
		init_settings: function () {
			var $general_setting = $(".ur-general-setting-field");
			$.each($general_setting, function () {
				var $this = $(this);
				switch ($this.attr("data-field")) {
					case "default_value":
						$this.on("change", function () {
							if (
								$(this)
									.closest(".ur-general-setting-block")
									.hasClass("ur-general-setting-select2")
							) {
								URAF_Admin.render_select_box($(this));
							}
							if (
								$(this)
									.closest(".ur-general-setting-block")
									.hasClass(
										"ur-general-setting-multi_select2"
									)
							) {
								URAF_Admin.render_multiple_select_box($(this));
							}
						});
						break;
					case "options":
						$this.on("keyup", function () {
							if (
								$(this)
									.closest(".ur-general-setting-block")
									.hasClass("ur-general-setting-select2") &&
								$(this)
									.siblings(
										'input[data-field="default_value"]'
									)
									.is(":checked")
							) {
								URAF_Admin.render_select_box($(this));
							}
							if (
								$(this)
									.closest(".ur-general-setting-block")
									.hasClass(
										"ur-general-setting-multi_select2"
									) &&
								$(this)
									.siblings(
										'input[data-field="default_value"]'
									)
									.is(":checked")
							) {
								URAF_Admin.render_multiple_select_box($(this));
							}
						});
						break;
					case "header_attribute":
						$this.on("change", function () {
							URAF_Admin.render_section_title_heading($(this));
						});
						break;
					case "phone_format":
						if (
							"smart" ===
							$this
								.closest(".ur-general-setting-block")
								.find('select[data-field="phone_format"]')
								.val()
						) {
							$this
								.closest(".ur-general-setting-block")
								.find(".ur-general-setting-input-mask")
								.hide();
						} else {
							$this
								.closest(".ur-general-setting-block")
								.find(".ur-general-setting-input-mask")
								.show();
						}

						$this.on("change", function () {
							URAF_Admin.render_phone_format($(this));
						});
						break;
					case "label":
						$this.on("keyup", function () {
							URAF_Admin.render_section_title_label($(this));
						});
						break;
					case "input_mask":
						URAF_Admin.validate_input_mask(this);
						$this.on("input", function () {
							URAF_Admin.validate_input_mask(this);
						});
						break;
				}
			});

			/**
			 * Handle advance setting changes.
			 *
			 * @since 1.4.0
			 */
			var $advance_setting = $(".ur_advance_setting");
			$.each($advance_setting, function () {
				var $this_obj = $(this);

				switch ($this_obj.attr("data-advance-field")) {
					case "enable_payment_slider":
						$this_obj.on("change", function () {
							URAF_Admin.enable_payment_slider_change_handler(
								$this_obj
							);
						});
						break;
					case "enable_prefix_postfix":
						URAF_Admin.render_prefix_postfix_div($this_obj);

						$this_obj.on("change", function () {
							URAF_Admin.display_range_prefix_postfix();

							URAF_Admin.render_prefix_postfix_div($(this));
							URAF_Admin.render_range_field($this_obj);
						});

						break;
					case "enable_text_prefix_postfix":
						URAF_Admin.render_prefix_postfix_div($this_obj);
						URAF_Admin.render_range_field($this_obj);

						$this_obj.on("change", function () {
							URAF_Admin.render_prefix_postfix_div($(this));
							URAF_Admin.render_range_field($(this));
						});
						break;
					case "range_min":
						URAF_Admin.render_range_field($this_obj);
						$this_obj.on("change", function () {
							URAF_Admin.render_range_field($(this));

							var range_max = $(this)
									.closest(".ur-advance-setting-block")
									.find(
										'input[data-advance-field="range_max"]'
									),
								range_min = parseInt($(this).val(), 10);

							if ("" === range_max.val()) {
								range_max.val(range_min + 1).trigger("change");
							}
							range_max.attr("min", range_min + 1);
						});

						break;
					case "range_max":
						URAF_Admin.render_range_field($this_obj);

						$this_obj.on("change", function () {
							URAF_Admin.render_range_field($(this));
							var max_value = parseInt($(this).val(), 10),
								min_value = parseInt(
									$(this)
										.closest(".ur-advance-setting-block")
										.find(
											'input[data-advance-field="range_min"]'
										)
										.val(),
									10
								);

							if ("" === $(this).val() || max_value < min_value) {
								$(this).val(min_value + 1);
							}
						});

						break;
					case "range_prefix":
						$this_obj.on("keyup", function () {
							URAF_Admin.render_range_field($(this));
						});
						break;
					case "range_postfix":
						$this_obj.on("keyup", function () {
							URAF_Admin.render_range_field($(this));
						});
						break;
					// case "valid_file_type":
					// 	URAF_Admin.take_snapshot_display($(this));
					// 	$this_obj.on("change", function () {
					// 		URAF_Admin.take_snapshot_display($(this));
					// 	});
					// 	break;
				}
			});
		},
		/**
		 * Reflects changes in select field of field settings into selected field in form builder area.
		 *
		 * @param object this_node Select field from field settings.
		 */
		render_select_box: function (this_node) {
			var value = $.trim(this_node.val());
			var wrapper = $(".ur-selected-item.ur-item-active");
			var checked_index = this_node.closest("li").index();
			var select = wrapper.find(".ur-field").find("select");

			select.html("");
			select.append(
				"<option value='" + value + "'>" + value + "</option>"
			);

			// Loop through options in active fields general setting hidden div.
			wrapper
				.find(".ur-general-setting-options > ul.ur-options-list > li")
				.each(function (index, element) {
					var radio_input = $(element).find(
						'[data-field="default_value"]'
					);
					if (index === checked_index) {
						radio_input.prop("checked", true);
					} else {
						radio_input.prop("checked", false);
					}
				});
		},
		/**
		 * Reflects changes in multi-select field of field settings into selected field in form builder area.
		 *
		 * @param object this_node Multi-Select field from field settings.
		 */
		render_multiple_select_box: function (this_node) {
			var wrapper = $(".ur-selected-item.ur-item-active"),
				this_index = this_node.closest("li").index(),
				select = wrapper.find(".ur-field").find("select"),
				options = this_node.closest("ul").find("li");

			select.html("");
			$.each(options, function () {
				var option = $(this).find('input[data-field="default_value"]');
				if (option.is(":checked")) {
					select.append(
						"<option value='" +
							option.val() +
							"' selected>" +
							option.val() +
							"</option>"
					);
				}
			});

			if (this_node.is(":checked")) {
				wrapper
					.find(
						".ur-general-setting-options li:nth(" +
							this_index +
							') input[data-field="default_value"]'
					)
					.prop("checked", true);
			} else {
				wrapper
					.find(
						".ur-general-setting-options li:nth(" +
							this_index +
							') input[data-field="default_value"]'
					)
					.prop("checked", false);
			}
		},

		/**
		 * Reflects changes in section title field of field settings into selected field in form builder area.
		 *
		 * @param object this_node Section Title field from field settings.
		 */
		render_section_title_heading: function (this_node) {
			var wrapper = $(".ur-selected-item.ur-item-active"),
				value = $.trim(this_node.val()),
				label = wrapper.find(".ur-general-setting-label input").val();
			wrapper
				.find(".ur-general-setting-select-header select option")
				.prop("selected", false);
			wrapper
				.find(
					'.ur-general-setting-select-header select option[value="' +
						value +
						'"]'
				)
				.prop("selected", true);

			wrapper
				.find(".ur-label")
				.html("<" + value + ">" + label + "</" + value + ">");
		},

		/**
		 * Reflects changes in phone field of field settings into selected field in form builder area.
		 *
		 * @param object this_node Phone field from field settings.
		 */
		render_phone_format: function (this_node) {
			var wrapper = $(".ur-selected-item.ur-item-active"),
				selector_field_name = this_node
					.closest("#ur-setting-form")
					.find("[data-field='field_name']")
					.val(),
				active_field_name = wrapper
					.find("[data-field='field_name']")
					.val();

			if (selector_field_name === active_field_name) {
				var value = this_node.val().trim();

				if ("smart" === value) {
					$(".ur-general-setting-input-mask").hide();
				} else {
					$(".ur-general-setting-input-mask").show();
				}
				wrapper
					.find(".ur-general-setting-select-format select option")
					.prop("selected", false);
				wrapper
					.find(
						'.ur-general-setting-select-format select option[value="' +
							value +
							'"]'
					)
					.prop("selected", true);
			}
		},

		/**
		 * Reflects changes in section title field's label into selected section title field in form builder area.
		 *
		 * @param object this_node Section Title field from field settings.
		 */
		render_section_title_label: function (this_node) {
			var wrapper = $(".ur-selected-item.ur-item-active");
			var section_title = wrapper.find(
				"[data-field-key='section_title']"
			).length;
			if (section_title < 1) {
				return;
			}
			var value = $.trim(this_node.val());
			heading = wrapper
				.find(".ur-general-setting-select-header select")
				.val();

			wrapper
				.find(".ur-label")
				.html("<" + heading + ">" + value + "</" + heading + ">");
		},

		/**
		 * Handle range field value updates.
		 *
		 * @since 1.4.0
		 */
		enable_payment_slider_change_handler: function (obj) {
			var wrapper = $(".ur-selected-item.ur-item-active");

			if (obj.is(":checked")) {
				wrapper.find("span.ur-payment-slider-label").show();

				wrapper
					.find(".ur-input-type-range")
					.addClass("ur-payment-enabled-slider");
			} else {
				wrapper.find("span.ur-payment-slider-label").hide();

				wrapper
					.find(".ur-input-type-range")
					.removeClass("ur-payment-enabled-slider");
			}

			wrapper
				.find(".ur_advance_setting.ur-settings-enable-payment-slider")
				.val(obj.is(":checked"));
		},

		/**
		 * Handle range field label display.
		 *
		 * @since 1.4.0
		 */
		display_range_prefix_postfix: function () {
			var wrapper = $(".ur-selected-item.ur-item-active");
			wrapper.find("span.ur-range-slider-label").toggle();
		},

		/**
		 * Take Picture Hide Show according to file type.
		 */
		take_snapshot_display: function (selector) {
			var valid_file_type = selector.val();
			if (
				"" !== valid_file_type &&
				!valid_file_type.includes("image/jpeg")
			) {
				$(".wp_uraf_take_snapshot").hide();
			} else {
				$(".wp_uraf_take_snapshot").show();
			}
		},
		/**
		 * Render range field prefix postfix settings.
		 *
		 * @since 1.4.0
		 */
		render_prefix_postfix_div: function (selector) {
			/**
			 * Check if prefix and postfix can be displayed or not
			 * so as to show/hide enable text prefix/postfix div.
			 */
			if (
				selector
					.closest(".ur-advance-setting-block")
					.find(".ur-settings-enable-prefix-postfix")
					.is(":checked")
			) {
				selector
					.closest(".ur-advance-setting-block")
					.find(".ur-advance-enable_text_prefix_postfix")
					.show();

				/**
				 * Check if text prefix and postfix can be displayed or not
				 * so as to show/hide range_prefix and range_postfix div.
				 */
				if (
					selector
						.closest(".ur-advance-setting-block")
						.find(".ur-settings-enable-text-prefix-postfix")
						.is(":checked")
				) {
					selector
						.closest(".ur-advance-setting-block")
						.find(
							".ur-advance-range_prefix, .ur-advance-range_postfix"
						)
						.show();
				} else {
					selector
						.closest(".ur-advance-setting-block")
						.find(
							".ur-advance-range_prefix, .ur-advance-range_postfix"
						)
						.hide();
				}
			} else {
				selector
					.closest(".ur-advance-setting-block")
					.find(".ur-advance-enable_text_prefix_postfix")
					.hide();
				selector
					.closest(".ur-advance-setting-block")
					.find(".ur-advance-range_prefix, .ur-advance-range_postfix")
					.hide();
			}
		},

		/**
		 * Render range field in form builder as per settings.
		 *
		 * @since 1.4.0
		 */
		render_range_field: function (selector) {
			var wrapper = $(".ur-selected-item.ur-item-active");
			var prefix = "",
				postfix = "",
				selector_field_name = selector
					.closest("#ur-setting-form")
					.find("[data-field='field_name']")
					.val(),
				active_field_name = wrapper
					.find("[data-field='field_name']")
					.val();

			// Check if selected field and active field are same.
			if (selector_field_name === active_field_name) {
				// Check if prefix and postfix can be displayed or not.
				if (
					selector
						.closest(".ur-advance-setting-block")
						.find(".ur-settings-enable-prefix-postfix")
						.is(":checked")
				) {
					// Check if text prefix and postfix can be displayed or not.
					if (
						selector
							.closest(".ur-advance-setting-block")
							.find(".ur-settings-enable-text-prefix-postfix")
							.is(":checked")
					) {
						prefix = selector
							.closest(".ur-advance-setting-block")
							.find('input[data-advance-field="range_prefix"]')
							.val();
						postfix = selector
							.closest(".ur-advance-setting-block")
							.find('input[data-advance-field="range_postfix"]')
							.val();
					} else {
						// Check if minimum value of range is set so to assign as prefix.
						if (
							"" !==
							selector
								.closest(".ur-advance-setting-block")
								.find('input[data-advance-field="range_min"]')
								.val()
						) {
							prefix = selector
								.closest(".ur-advance-setting-block")
								.find('input[data-advance-field="range_min"]')
								.val();
						} else {
							prefix = "0";
						}

						// Check if maximum value of range is set so to assign as postfix.
						if (
							"" !==
							selector
								.closest(".ur-advance-setting-block")
								.find('input[data-advance-field="range_max"]')
								.val()
						) {
							postfix = selector
								.closest(".ur-advance-setting-block")
								.find('input[data-advance-field="range_max"]')
								.val();
						} else {
							postfix = "10";
						}
					}

					// Reflect changes in form builder too.
					wrapper
						.find(".ur-settings-enable-text-prefix-postfix")
						.val(
							selector
								.closest(".ur-advance-setting-block")
								.find(".ur-settings-enable-text-prefix-postfix")
								.is(":checked")
						);
				}

				// Reflect changes in form builder too.
				wrapper
					.find(".ur-settings-enable-prefix-postfix")
					.val(
						selector
							.closest(".ur-advance-setting-block")
							.find(
								".ur-settings-enable-prefix-postfix :selected"
							)
							.is(":checked")
					);
			}

			// Check if prefix is not null and display in range field.
			if (prefix) {
				wrapper.find("span.ur-range-slider-prefix").text(prefix);
			}

			// Check if prefix is not null and display in range field.
			if (postfix) {
				wrapper.find("span.ur-range-slider-postfix").text(postfix);
			}
		},
		/**
		 * Validate the input mask provided by the user
		 */
		validate_input_mask: function (element) {
			var user_input_mask = $(element).val();
			var error_in_input_mask = false;
			var error_message =
				"Your input mask is not valid! If you save as it is, it will not work in the frontend.";
			try {
				$(element).clone().inputmask(user_input_mask);
			} catch (error) {
				error_in_input_mask = true;
			}

			$(element).siblings(".input-mask-error-message").remove();
			if (error_in_input_mask) {
				$(element).after(
					'<label style="color: red" class="input-mask-error-message">' +
						error_message +
						"</label>"
				);
			}
		},

		/**
		 * Add Phone Mask Templates Dropdown for Input Mask Setting.
		 */
		add_phone_mask_templates: function () {
			// Available Phone Input Masks.
			var mask_templates_list = {
				blank: ["-- Custom Mask --", ""],
				us_canadian: ["US/Canadian Phone Number", "(999) 999-9999"],
				us_canadian_int: [
					"US/Canadian Phone Number (International)",
					"+1 (999) 999-9999",
				],
			};

			// Create templates dropdown element.
			var templates_container = $(
				"<select id='user_registration_templates_container'></select>"
			);
			for (key in mask_templates_list) {
				const template = mask_templates_list[key];
				var option_template = $("<option></option>");
				option_template.html(template[0]);
				option_template.val(template[1]);
				templates_container.append(option_template);
			}
			templates_container.hide();

			$(".ur-general-setting-phone input[data-field='input_mask']").each(
				function (i, field) {
					if (
						!$(field)
							.parent()
							.find("#user_registration_templates_container")
							.length
					) {
						var templates_box = templates_container.clone();
						$(field).after(templates_box);

						const selected_template = templates_box.find(
							'option[value="' + $(field).val() + '"]'
						);
						if (selected_template.length) {
							selected_template.attr("selected", "selected");
						}
					}
				}
			);

			URAF_Admin.init_phone_mask_triggers();
		},

		/**
		 * Triggers for Phone Field Input Mask Template Dropdown.
		 */
		init_phone_mask_triggers: function () {
			var show_templates = true;

			// Function to hide templates dropdown.
			function hide_template_container(template_container) {
				show_templates = false;
				setTimeout(function () {
					if (!show_templates) {
						template_container.hide();
					}
				}, 100);
			}

			// Hide/Show templates dropdown.
			$(document).on(
				"click focus",
				"input[data-field='input_mask'], #user_registration_templates_container",
				function () {
					show_templates = true;
					var $this = $(this);
					$this
						.parent()
						.find("#user_registration_templates_container")
						.show();
				}
			);

			$(document).on(
				"blur",
				"input[data-field='input_mask'], #user_registration_templates_container",
				function () {
					var $this = $(this);
					var template_container = $this
						.parent()
						.find("#user_registration_templates_container");
					hide_template_container(template_container);
				}
			);

			// Change input mask according to selected template.
			$(document).on(
				"change",
				"#user_registration_templates_container",
				function () {
					var select_field = $(this);
					var input_field = select_field.siblings("input").first();
					var clicked_template = select_field
						.find(":selected")
						.first();
					var field = $(".ur-selected-item.ur-item-active").find(
						"input[data-field='input_mask']"
					);
					var hidden_templates_container = field
						.parent()
						.find("#user_registration_templates_container");

					input_field.val(clicked_template.val());
					field.val(clicked_template.val());

					hidden_templates_container
						.find("option:selected")
						.removeAttr("selected", "selected");
					hidden_templates_container
						.find('option[value="' + $(field).val() + '"]')
						.attr("selected", "selected");
				}
			);

			// Update selected template when user inputs custom mask.
			$(document).on(
				"change",
				"input[data-field='input_mask']",
				function (el) {
					var input_mask_field = $(el.target);
					var select_field = input_mask_field
						.parent()
						.find("#user_registration_templates_container");
					select_field.find("option:selected").removeAttr("selected");

					var custom_mask_template = select_field.find(
						'option[value="' + input_mask_field.val() + '"]'
					);
					if (custom_mask_template.length) {
						select_field.val(input_mask_field.val());
					} else {
						select_field
							.find("option")
							.first()
							.attr("selected", "selected");
					}
				}
			);
		},
	};

	$(document).ready(function () {
		URAF_Admin.init();
	});
})(jQuery);
