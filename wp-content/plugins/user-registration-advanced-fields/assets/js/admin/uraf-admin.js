(function ($) {
	var URAF_Admin = {
		init: function () {
			$(
				'.ur-input-type-select2 .ur-field[data-field-key="select2"] select, .ur-input-type-multi-select2 .ur-field[data-field-key="multi_select2"] select'
			).selectWoo();
			$(document).on("click", ".ur-selected-item", function () {
				URAF_Admin.init_settings();
			});
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
							URAF_Admin.display_currency();
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
				.attr("selected", "selected");

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
		 * Handle range field label display.
		 *
		 * @since 1.4.0
		 */
		display_currency: function () {
			var wrapper = $(".ur-selected-item.ur-item-active");
			wrapper.find("span.ur-payment-slider-label").toggle();
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
				"true" ===
				selector
					.closest(".ur-advance-setting-block")
					.find(".ur-settings-enable-prefix-postfix :selected")
					.val()
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
					"true" ===
					selector
						.closest(".ur-advance-setting-block")
						.find(
							".ur-settings-enable-text-prefix-postfix :selected"
						)
						.val()
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
					"true" ===
					selector
						.closest(".ur-advance-setting-block")
						.find(".ur-settings-enable-prefix-postfix :selected")
						.val()
				) {
					// Check if text prefix and postfix can be displayed or not.
					if (
						"true" ===
						selector
							.closest(".ur-advance-setting-block")
							.find(
								".ur-settings-enable-text-prefix-postfix :selected"
							)
							.val()
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
								.find(
									".ur-settings-enable-text-prefix-postfix :selected"
								)
								.val()
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
							.val()
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
	};

	$(document).ready(function () {
		URAF_Admin.init();
	});
})(jQuery);
