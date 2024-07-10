/**
 * UserRegistration Conditional Logic Admin JS
 * global urcl_data
 */
jQuery(function ($) {
	var urcl_utils = {
		init: function () {
			// Render Conditional Logic UI when field options get rendered in the Field Options tab and when a new field is created.
			$(document.body).on(
				"ur_rendered_field_options ur_new_field_created",
				function () {
					urcl_utils.renderConditionalLogicMapUI();
				}
			);

			// Show/Hide when enabled/disabled conditional logic for a field.
			$(document.body).on(
				"change",
				".ur-enable-conditional-logic",
				function () {
					var enabled = $(this).is(":checked");

					// Update hidden enable/disable checkbox.
					$(".ur-selected-item.ur-item-active")
						.find(".ur-enable-conditional-logic")
						.attr("checked", enabled);

					if (enabled) {
						$("#ur-setting-form .urcl-logic-creator").slideDown(); // Visible UI.
						$(".ur-selected-item.ur-item-active")
							.find(".urcl-logic-creator")
							.show(); // Hidden UI.
					} else {
						$("#ur-setting-form .urcl-logic-creator").slideUp(); // Visible UI.
						$(".ur-selected-item.ur-item-active")
							.find(".urcl-logic-creator")
							.hide(); // Hidden UI.
					}
				}
			);

			// Add new conditional logic Group.
			$(document.body).on("click", ".urcl-add-new-group", function (e) {
				e.preventDefault();

				var groupHtml = urcl_utils.resolve_smart_tags(
					urcl_data.templates.group,
					{
						urcl_conditions: urcl_utils.createField(),
					}
				);

				$("#ur-setting-form .urcl-logic-map-container").append(
					groupHtml
				);
				urcl_utils.udpateRuleJSON();
			});

			// Add new conditional logic Field.
			$(document.body).on("click", ".urcl-add-field", function () {
				var $logic_group = $(this).closest(
					".urcl-conditional-logic__group"
				);

				if (
					$logic_group.find(".urcl-field").length === 1 &&
					$logic_group.find(".urcl-logic-gate.is-active").length === 0
				) {
					$logic_group
						.find(".urcl-logic-gate-or")
						.addClass("is-active");
				}

				$(this).closest(".urcl-field").after(urcl_utils.createField());

				urcl_utils.udpateRuleJSON();
			});

			// Remove conditional logic Group.
			$(document.body).on("click", ".urcl-remove-group", function () {
				if (
					$(this)
						.closest(".urcl-logic-map-container")
						.find(".urcl-group").length > 1
				) {
					var $this = $(this);

					Swal.fire({
						icon: "warning",
						title: "Are you sure?",
						text: "Are you sure you want to remove the Conditional Logic group? You will not be able to revert this action.",
						confirmButtonText: "Yeah! Go Ahead.",
						showCancelButton: true,
					}).then(function (result) {
						if (result.value) {
							$this.closest(".urcl-group").remove();

							urcl_utils.udpateRuleJSON();
						}
					});
				} else {
					Swal.fire({
						icon: "error",
						title: "Nope!",
						text: "You have to leave at least ONE group.",
					});
				}
			});

			// Remove conditional logic Field.
			$(document.body).on("click", ".urcl-remove-field", function () {
				if (
					$(this)
						.closest(".urcl-conditions-container")
						.find(".urcl-field").length > 1
				) {
					var $this = $(this),
						$logic_group = $(this).closest(
							".urcl-conditional-logic__group"
						);

					Swal.fire({
						icon: "warning",
						title: "Are you sure?",
						text: "Are you sure you want to remove the Conditional Logic field? You will not be able to revert this action.",
						confirmButtonText: "Yeah! Go Ahead.",
						showCancelButton: true,
					}).then(function (result) {
						if (result.value) {
							$this.closest(".urcl-field").remove();

							if (
								$logic_group.find(".urcl-field").length === 1 &&
								$logic_group.find(".urcl-logic-gate.is-active")
									.length
							) {
								$logic_group
									.find(".urcl-logic-gate")
									.removeClass("is-active");
							}

							urcl_utils.udpateRuleJSON();
						}
					});
				} else {
					Swal.fire({
						icon: "error",
						title: "Nope!",
						text: "You have to leave at least ONE field in a group.",
					});
				}
			});

			// Update the Rule JSON data on each related input event.
			$(document.body).on(
				"change",
				".urcl-action-input, .urcl-root-logic-gate, .urcl-triggerer-field, .urcl-field-operator, .urcl-field-value",
				function () {
					urcl_utils.udpateRuleJSON();
				}
			);

			// Change input element type for conditional logic field value when the triggerer field changes.
			$(document.body).on("change", ".urcl-triggerer-field", function () {
				var field_id = $(this).val(),
					cl_field_input =
						urcl_utils.getInputElementForCLField(field_id);

				$(this)
					.closest(".urcl-field")
					.find(".urcl-field-value")
					.remove();
				$(this)
					.closest(".urcl-field")
					.find(".urcl-field-operator")
					.after(cl_field_input);

				// Update Rule JSON.
				urcl_utils.udpateRuleJSON();
			});

			// Toggle the logic gate widget.
			$(document.body).on("click", ".urcl-logic-gate", function () {
				if (!$(this).is(".is-active")) {
					$(this)
						.closest(".urcl-logic-gate-container")
						.find(".urcl-logic-gate.is-active")
						.removeClass("is-active");
					$(this).addClass("is-active");

					urcl_utils.udpateRuleJSON();
				}
			});
		},

		/**
		 * Resolve smart tags in a string.
		 * - Normal Smart Tag:
		 * -- Format: `{{tag}}`
		 * -- Example: `{{label}}`
		 *
		 * - Variable Smart Tag:
		 * -- Format: `{{placeholder:tag}}`
		 * -- Example: `{{logic_gate:OR}}`
		 * -- Paramters: placeholder, tag, value
		 * -- Usage: When you have a dynamic value and you need to put that in only the place meeting a certain requirement, like it should have specific value.
		 *
		 * @param {String} str Subject string to operate on.
		 * @param {JSON} smart_tags Normal smart tags.
		 * @param {Array<JSON>} smart_tag_variables Variable smart tags.
		 */
		resolve_smart_tags: function (str, smart_tags, smart_tag_variables) {
			var regex;

			// Resolve normal smart tags.
			if (str && smart_tags && "object" === typeof smart_tags) {
				Object.keys(smart_tags).forEach(function (tag) {
					regex = new RegExp("{{{" + tag + "}}}", "g");
					str = str.replace(regex, smart_tags[tag]);
				});
			}

			// Resolve variable smart tags.
			if (
				smart_tag_variables &&
				Array.isArray(smart_tag_variables) &&
				smart_tag_variables.length
			) {
				smart_tag_variables.forEach(function (variable) {
					// Placeholder must be validated against the empty string to avoid unintended behaviour.
					if (
						variable &&
						"object" === typeof variable &&
						variable.placeholder &&
						"" !== variable.placeholder
					) {
						// Place the value.
						regex = new RegExp(
							"{{{" +
								variable.placeholder +
								":" +
								variable.tag +
								"}}}",
							"g"
						);
						str = str.replace(regex, variable.value);

						// Discard the remaining variables.
						regex = new RegExp(
							"{{{" + variable.placeholder + ":[A-z0-9_]+}}}",
							"g"
						);
						str = str.replace(regex, "");
					}
				});
			}
			return str;
		},

		/**
		 * Render conditional logic UI in the Field Options tab, using the Rule JSON data.
		 */
		renderConditionalLogicMapUI: function () {
			var ruleJsonText = $("#ur-setting-form .urcl-logic-map").val(),
				rule = null;

			try {
				ruleJsonText = ruleJsonText.replace(/\\"/g, '"');
				ruleJsonText = ruleJsonText.replace(/^"|"$/g, "");
				rule = JSON.parse(ruleJsonText);
			} catch (error) {}

			if (rule) {
				var map = rule.logic_map,
					$mapCreator = $("#ur-setting-form .urcl-logic-creator"),
					groupsHtml = [];

				$mapCreator.find(".urcl-action-input").val(rule.action);
				$mapCreator.find(".urcl-root-logic-gate").val(map.logic_gate);

				map.conditions.forEach(function (group) {
					groupsHtml.push(urcl_utils.createGroup(group));
				});
				$mapCreator
					.find(".urcl-logic-map-container")
					.html(groupsHtml.join(""));
			}
		},

		/**
		 * Create a conditional logic group element.
		 *
		 * @param {JSON} group Conditional Logic Group data.
		 *
		 * @return {String}
		 */
		createGroup: function (group) {
			var conditionsHtml = [];

			if (!group && "object" !== typeof group) {
				group = {};
			}

			if (Array.isArray(group.conditions)) {
				group.conditions.forEach(function (condition) {
					conditionsHtml.push(urcl_utils.createField(condition));
				});
			}

			return urcl_utils.resolve_smart_tags(
				urcl_data.templates.group,
				{
					urcl_conditions: conditionsHtml.join(""),
				},
				[
					{
						placeholder: "urcl_logic_gate",
						tag: group.logic_gate,
						value: "is-active",
					},
				]
			);
		},

		/**
		 * Create a conditional logic field element.
		 *
		 * @param {JSON} data Conditional Logic Field data.
		 *
		 * @return {String}
		 */
		createField: function (data) {
			if (!data && "object" !== typeof data) {
				data = {};
			}

			var fieldHtml = urcl_utils.resolve_smart_tags(
				urcl_data.templates.field,
				{
					urcl_triggerer_input: urcl_utils.getFormFields(
						data.triggerer_id,
						[urcl_utils.getSelectedFieldId()]
					),
					urcl_field_value_input:
						urcl_utils.getInputElementForCLField(
							data.triggerer_id,
							data.value
						),
				},
				[
					{
						placeholder: "operator",
						tag: data.operator,
						value: "selected",
					},
				]
			);
			return fieldHtml;
		},

		/**
		 * Get ID of currently active field.
		 */
		getSelectedFieldId: function () {
			var field_id = $(".ur-selected-item.ur-item-active")
				.find(
					".ur-general-setting-field-name .ur-general-setting-field"
				)
				.val();

			return field_id;
		},

		/**
		 * Get a list of fields wrapped in a "select" tag.
		 *
		 * @param {String} selectedOption Default selected option ID.
		 * @param {Array<String>} exclude_ids IDs to exclude.
		 * @param {Array<String>} exclude_field_types Field types to exclude.
		 *
		 * @returns {String}
		 */
		getFormFields: function (
			selectedOption,
			exclude_ids,
			exclude_field_types
		) {
			var fields = [
					'<option value="***">--- Select a field ---</option>',
				],
				field_type,
				field_label,
				field_id,
				selectedAttr;

			if (!Array.isArray(exclude_ids)) {
				exclude_ids = [];
			}
			if (!Array.isArray(exclude_field_types)) {
				exclude_field_types = [
					"phone",
					"date",
					"timepicker",
					"file",
					"profile_picture",
					"single_item",
					"section_title",
					"html",
					"wysiwyg",
					"hidden",
					"billing_address_title",
					"shipping_address_title",
				];
			}

			$(".ur-selected-item").each(function () {
				field_type = $(this).find(".ur-field").data("field-key");
				field_label = $(this)
					.find(".ur-general-setting-label .ur-general-setting-field")
					.val();
				field_id = $(this)
					.find(
						".ur-general-setting-field-name .ur-general-setting-field"
					)
					.val();
				selectedAttr = "";

				if (field_type && field_label && field_id) {
					if (
						!exclude_ids.includes(field_id) &&
						!exclude_field_types.includes(field_type)
					) {
						if (selectedOption === field_id) {
							selectedAttr = 'selected="selected"';
						}

						fields.push(
							'<option data-type="' +
								field_type +
								'" data-label="' +
								field_label +
								'" value="' +
								field_id +
								'" ' +
								selectedAttr +
								">" +
								field_label +
								"</option>"
						);
					}
				}
			});

			return (
				'<select class="urcl-conditional-logic__rule__param urcl-triggerer-field">' +
				fields.join("") +
				"</select>"
			);
		},

		/**
		 * Get input element to get Form Field value from user in a Conditional Logic Field UI.
		 *
		 * @param {String} field_id ID/Field Name of a field.
		 * @param {*} value Default value for the input element.
		 *
		 * @returns {String}
		 */
		getInputElementForCLField: function (field_id, value) {
			var html = "",
				field_type,
				current_field_id,
				options,
				selectedAttr,
				valueAttr;

			$(".ur-selected-item").each(function () {
				field_type = $(this).find(".ur-field").data("field-key");
				current_field_id = $(this)
					.find(
						".ur-general-setting-field-name .ur-general-setting-field"
					)
					.val();

				/**
				 * Pipe similiar field types.
				 */
				if (["checkbox", "multi_select2"].includes(field_type)) {
					field_type = "checkbox";
				}
				if (["radio", "select", "select2"].includes(field_type)) {
					field_type = "radio";
				}
				if (
					["country", "billing_country", "shipping_country"].includes(
						field_type
					)
				) {
					field_type = "country";
				}
				if (
					[
						"privacy_policy",
						"mailchimp",
						"separate_shipping",
					].includes(field_type)
				) {
					field_type = "check_uncheck";
				}

				if (field_id === current_field_id) {
					switch (field_type) {
						case "checkbox":
							options = [];

							$(this)
								.find(
									".ur-general-setting-options .ur-options-list .ur-type-checkbox-label"
								)
								.each(function () {
									selectedAttr = "";

									if ($(this).val() === value) {
										selectedAttr = "selected";
									}
									options.push(
										'<option value="' +
											$(this).val() +
											'" ' +
											selectedAttr +
											">" +
											$(this).val() +
											"</option>"
									);
								});
							html =
								'<select class="urcl-conditional-logic__rule__value urcl-field-value">' +
								options.join("") +
								"</select>";
							break;

						case "radio":
							options = [];

							$(this)
								.find(
									".ur-general-setting-options .ur-options-list .ur-type-radio-label"
								)
								.each(function () {
									selectedAttr = "";

									if ($(this).val() === value) {
										selectedAttr = "selected";
									}

									options.push(
										'<option value="' +
											$(this).val() +
											'" ' +
											selectedAttr +
											">" +
											$(this).val() +
											"</option>"
									);
								});
							html =
								'<select class="urcl-conditional-logic__rule__value urcl-field-value">' +
								options.join("") +
								"</select>";
							break;

						case "country":
							options = [];

							$(this)
								.find(
									".ur-settings-selected-countries option:selected"
								)
								.each(function () {
									selectedAttr = "";

									if ($(this).val() === value) {
										selectedAttr = "selected";
									}

									options.push(
										'<option value="' +
											$(this).val() +
											'" ' +
											selectedAttr +
											">" +
											$(this).html() +
											"</option>"
									);
								});
							html =
								'<select class="urcl-conditional-logic__rule__value urcl-field-value">' +
								options.join("") +
								"</select>";
							break;

						case "learndash_course":
							options = [];
							var field_type = $(
								".ur-general-setting-learndash_course .ur-general-setting-field-type select"
							).val();
							var optionValue;
							if ("select_box" === field_type) {
								$(this)
									.find(
										"#ur-input-type-learndash-course option"
									)
									.each(function () {
										selectedAttr = "";
										if ($(this).val() == value) {
											selectedAttr = "selected=selected";
										}
										options.push(
											'<option value="' +
												$(this).val() +
												'" ' +
												selectedAttr +
												">" +
												$(this).html() +
												"</option>"
										);
									});
							} else if ("check_box" === field_type) {
								$(this)
									.find(
										".ur-input-type-learndash_course .ur-field input"
									)
									.each(function () {
										selectedAttr = "";
										optionValue = $(this).data("value");
										optionLabel = $(this).data("label");
										if (optionValue == value) {
											selectedAttr = "selected=selected";
										}
										options.push(
											'<option value="' +
												optionValue +
												'" ' +
												selectedAttr +
												">" +
												optionLabel +
												"</option>"
										);
									});
							}
							html =
								'<select class="urcl-conditional-logic__rule__value urcl-field-value">' +
								options.join("") +
								"</select>";
							break;

						case "number":
							valueAttr = "";

							if (value) {
								valueAttr = 'value="' + value + '"';
							}
							html =
								'<input type="number" class="urcl-conditional-logic__rule__value urcl-field-value" ' +
								valueAttr +
								" />";
							break;

						case "check_uncheck":
							options = [
								'<option value="checked" ' +
									("checked" === value ? "selected" : "") +
									">Checked</option>",
								'<option value="unchecked" ' +
									("unchecked" === value ? "selected" : "") +
									">UnChecked</option>",
							];

							html =
								'<select class="urcl-conditional-logic__rule__value urcl-field-value">' +
								options.join("") +
								"</select>";
							break;

						default:
							valueAttr = "";

							if (value) {
								valueAttr = 'value="' + value + '"';
							}
							html =
								'<input type="text" class="urcl-conditional-logic__rule__value urcl-field-value" ' +
								valueAttr +
								" />";
							break;
					}
					return false;
				}
			});
			return html;
		},

		/**
		 * Update Rule JSON data of currently active field, using the Conditional Logic UI, residing in the Field Options tab, as source.
		 */
		udpateRuleJSON: function () {
			var $mapCreator = $("#ur-setting-form .urcl-logic-creator"),
				rule = {
					action: $mapCreator.find(".urcl-action-input").val(),
					logic_map: {
						type: "group",
						logic_gate: $mapCreator
							.find(".urcl-root-logic-gate")
							.val(),
						conditions: [],
					},
				},
				sub_group_conditions = [],
				logic_map = null,
				cl_fields,
				logic_gate;

			$mapCreator
				.find(".urcl-logic-map-container .urcl-group")
				.each(function () {
					cl_fields = [];
					logic_gate = $(this)
						.find(".urcl-logic-gate.is-active")
						.data("value");

					$(this)
						.find(".urcl-field")
						.each(function () {
							cl_fields.push({
								type: "field",
								triggerer_id: $(this)
									.find(".urcl-triggerer-field")
									.val(),
								operator: $(this)
									.find(".urcl-field-operator")
									.val(),
								value: $(this).find(".urcl-field-value").val(),
							});
						});

					sub_group_conditions.push({
						type: "group",
						logic_gate: logic_gate ? logic_gate : "",
						conditions: cl_fields,
					});
				});
			rule.logic_map.conditions = sub_group_conditions;
			logic_map = JSON.stringify(rule);

			// Update Rule JSON container in Field Options tab.
			$("#ur-setting-form .urcl-logic-map").val(logic_map);

			// Update Rule JSON container which is hidden in the active field.
			$(".ur-selected-item.ur-item-active")
				.find(".urcl-logic-map")
				.val(logic_map);
		},
	};
	urcl_utils.init();

	hide_show_conditional_user_role_fields();

	$(document).on(
		"change",
		"#user_registration_form_setting_enable_assign_user_role_conditionally",
		function () {
			hide_show_conditional_user_role_fields();
		}
	);

	/**
	 * Get list of fields wrapped in `option` tag.
	 * Warning: The output will NOT be wrapped with the `select` tag.
	 */
	function get_fields_list() {
		var output = "";
		$(".ur-grid-lists .ur-selected-item .ur-general-setting").each(
			function () {
				var field_label = $(this)
					.closest(".ur-selected-item")
					.find(" .ur-admin-template .ur-label label")
					.text();
				var field_key = $(this)
					.closest(".ur-selected-item")
					.find(" .ur-admin-template .ur-field")
					.data("field-key");

				//strip certain fields
				if (
					"section_title" == field_key ||
					"html" == field_key ||
					"wysiwyg" == field_key ||
					"billing_address_title" == field_key ||
					"shipping_address_title" == field_key
				) {
					return;
				}

				var field_name = $(this)
					.find("[data-field='field_name']")
					.val();

				if (typeof field_name !== "undefined") {
					output +=
						'<option value="' +
						field_name +
						'" data-type="' +
						field_key +
						'">' +
						field_label +
						"</option>";
				}
			}
		);
		return output;
	}

	function hide_show_conditional_user_role_fields() {
		var enable_assign_user_role = $(
			"#user_registration_form_setting_enable_assign_user_role_conditionally"
		).is(":checked");

		if (enable_assign_user_role) {
			if ($(".urcl-role-container").length === 0) {
				var $html = $(urcl_data.users_roles_conditional_fields);
				var $fields_list = $html.find(
					".urcl-field-conditional-field-select"
				);
				var $output =
					'<option value="">-- Select --</option>' +
					get_fields_list();
				$fields_list.each(function () {
					var selected_value = $(this).val();
					$(this).html($output);
					$(this).val(selected_value);
					$(this)
						.find('option[value="' + selected_value + '"]')
						.prop("selected", true);
				});
				$(
					"#user_registration_form_setting_enable_assign_user_role_conditionally"
				)
					.closest(".urcl-form-settings-enable-assign-user-role")
					.after($html);
			} else {
				$(".urcl-role-container").show();
			}
		} else {
			$(".urcl-role-container").hide();
		}
	}

	var users_roles_conditions_data = urcl_data.users_roles_conditions_data;
	$(document).on("click", ".urcl-role-conditional-container .urcl-role-logic-box .add", function () {
		condition_id = $(this)
			.closest(".urcl-role-logic-box")
			.attr("data-group");
		var data_key = $(this)
			.closest(".urcl-role-logic-box")
			.attr("data-last-key");
		data_key++;

		var or_condition = $(this).closest(".urcl-or-groups").length;
		var $group_class = "urcl-conditional-group";

		if (1 === or_condition) {
			$group_class = "urcl-conditional-or-group";
		}
		$output = '<li class="' + $group_class + '" data-key=' + data_key + ">";
		$output += '<div class="urcl-form-group">';
		$output +=
			'<select class="urcl-form-settings-field urcl-user-role-field urcl-field-conditional-field-select" name="user_registration_form_fields[' +
			condition_id +
			"][" +
			data_key +
			']">';
		$output += '<option value="">-- Select --</option>';
		$output += get_fields_list();
		$output += "</select></div>";
		$output +=
			'<div class="urcl-operator"><select class="urcl-form-settings-field urcl-user-role-field" name="user_registration_form_operator[' +
			condition_id +
			"][" +
			data_key +
			']">';

		$output += '<option value = "is" >is</option>';
		$output += '<option value = "is_not" >is not</option>';
		$output += '<option value = "empty"> empty </option>';
		$output += '<option value = "not_empty"> not empty </option>';
		$output += '<option value = "greater_than"> greater than </option>';
		$output += '<option value = "less_than"> less_than </option>';

		$output += "</select></div>";

		$output +=
			'<div class="urcl-value"><input class="urcl-form-settings-field urcl-user-role-field" name = "user_registration_form_value[' +
			condition_id +
			"][" +
			data_key +
			']" type="text" /></div>';

		$output += '<span class="add">';
		$output += "AND";
		$output += "</span>";
		$output += '<span class="remove">';
		$output += '<i class="dashicons dashicons-minus"></i>';
		$output += "</span></li>";
		$(this).closest(".urcl-role-logic-box").append($output);
		$(this).closest(".urcl-role-logic-box").attr("data-last-key", data_key);
	});

	$(document).on("click", ".urcl-role-conditional-container .urcl-role-logic-box .remove", function () {
		var logic_box_count = 0;

		if ($(this).parent().hasClass("urcl-conditional-group")) {
			// Get logic box count
			logic_box_count = $(this)
				.parent()
				.parent()
				.find(".urcl-conditional-group").length;

			/** If logic box is more than one then remove particular <li> Tag
			 * else check OR conditions exists or not if exists then remove OR label and that particular <ul> Tag.
			 */
			if (logic_box_count > 1) {
				$(this).parent().remove();
			} else if (
				$(this)
					.parent()
					.parent()
					.parent()
					.find(".urcl-conditional-or-group").length > 0
			) {
				$(this).parent().parent().next(".urcl-or-label").remove();
				$(this).parent().parent().remove();
			}
		} else if ($(this).parent().hasClass("urcl-conditional-or-group")) {
			// Get logic box count for OR condition
			logic_box_count = $(this)
				.parent()
				.parent()
				.find(".urcl-conditional-or-group").length;

			/** If only one OR condition remaining then first check further conditions and then remove.
			 * else remove that particular <li> Tag.
			 */
			if (logic_box_count == 1) {
				/** If First condition does not exist then check further condition and then remove.
				 * else remove Previous OR label and that particular <ul> Tag.
				 */
				if (
					$(this)
						.parent()
						.parent()
						.parent()
						.find(".urcl-conditional-group").length === 0
				) {
					var prev = $(this)
						.parent()
						.parent()
						.prev(".urcl-or-label").length;
					var next = $(this)
						.parent()
						.parent()
						.next(".urcl-or-label").length;

					// If OR label does not exits in previous then check for next OR label if it's exist then remove that OR label and that <ul> Tag.
					if (prev === 0) {
						if (next > 0) {
							$(this)
								.parent()
								.parent()
								.next(".urcl-or-label")
								.remove();
							$(this).parent().parent().remove();
						}
					} else {
						$(this)
							.parent()
							.parent()
							.prev(".urcl-or-label")
							.remove();
						$(this).parent().parent().remove();
					}
				} else {
					$(this).parent().parent().prev(".urcl-or-label").remove();
					$(this).parent().parent().remove();
				}
			} else {
				$(this).parent().remove();
			}
		}
	});

	$(document).on(
		"click",
		".urcl-role-logic-wrap .urcl-remove-condition",
		function () {
			$(this).parent().remove();
			var condition_count = $(".urcl-role-container").find(
				".urcl-role-logic-wrap"
			).length;

			if (1 === condition_count) {
				$(".urcl-role-container")
					.find(".urcl-remove-condition")
					.remove();
			}
		}
	);

	$(document).on(
		"click",
		".urcl-role-container .urcl-add-new-condition",
		function () {
			var condition_count = $(".urcl-role-container").find(
				".urcl-role-logic-wrap"
			).length;

			if (1 === condition_count) {
				var remove_button =
					'<button class="urcl-remove-condition"></button>';
				$(".urcl-role-container")
					.find(".urcl-role-logic-wrap .urcl-add-or-condition")
					.after(remove_button);
			}

			var conditionid = $(this).attr("data-last-conditionid");
			conditionid++;
			$output =
				'<div class="urcl-form-settings-logic-wrap urcl-role-logic-wrap" data-group ="condition_' +
				conditionid +
				'">';
			$output +=
				'<div class="urcl-form-settings-assign urcl-assign-role">';
			$output +=
				'<p class="urcl-assign-label">' + urcl_data.assign + "</p>";
			$output +=
				'<select class="urcl-form-settings-field urcl-user-role-field" name="user_registration_form_conditional_user_role[condition_' +
				conditionid +
				']">';
			$.each(
				users_roles_conditions_data.user_roles_list,
				function (role, user_role) {
					$output +=
						'<option value="' +
						role +
						'">' +
						user_role +
						"</option>";
				}
			);
			$output += "</select>";
			$output += "<p>" + urcl_data.only_if_following_matches + "</p>";
			$output += "</div>";

			$output +=
				'<ul class="urcl-form-settings-logic-box urcl-role-logic-box" data-group ="condition_' +
				conditionid +
				'" data-last-key="1">';
			$output += '<li class="urcl-conditional-group" data-key="1">';
			$output += '<div class="urcl-form-group">';
			$output +=
				'<select class="urcl-form-settings-field urcl-user-role-field urcl-field-conditional-field-select" name="user_registration_form_fields[condition_' +
				conditionid +
				'][1]">';
			$output += '<option value=""> -- Select --</option>';
			$output += get_fields_list();
			$output += "</select></div>";
			$output +=
				'<div class="urcl-operator"><select class="urcl-form-settings-field urcl-user-role-field" name="user_registration_form_operator[condition_' +
				conditionid +
				'][1]">';
			$output += '<option value = "is" >is</option>';
			$output += '<option value = "is_not" >is not</option>';
			$output += '<option value = "empty"> empty </option>';
			$output += '<option value = "not_empty"> not empty </option>';
			$output += '<option value = "greater_than"> greater than </option>';
			$output += '<option value = "less_than"> less_than </option>';
			$output += "</select></div>";
			$output +=
				'<div class="urcl-value"><input class="urcl-form-settings-field urcl-user-role-field" name="user_registration_user_registration_form_value[condition_' +
				conditionid +
				'][1]" type="text" /></div>';
			$output += '<span class="add">';
			$output += "AND";
			$output += "</span>";
			$output += '<span class="remove">';
			$output += '<i class="dashicons dashicons-minus"></i>';
			$output += "</span></li>";
			$output += "</ul>";
			$output +=
				'<button class="button button-secondary button-medium urcl-add-or-condition">Add OR Condition</button>';
			$output += '<button class="urcl-remove-condition"></button>';
			$output += "</div>";
			$(".urcl-role-conditional-container").append($output);
			$(this).attr("data-last-conditionid", conditionid);
		}
	);

	$(document).on(
		"click",
		".urcl-role-logic-wrap .urcl-add-or-condition",
		function () {
			var conditionid = $(this)
				.closest(".urcl-role-logic-wrap")
				.attr("data-group");
			var $output = '<p class="urcl-or-label"> OR </p>';

			$output +=
				'<ul class="urcl-form-settings-logic-box urcl-or-groups urcl-role-logic-box" data-group ="' +
				conditionid +
				'" data-last-key="1">';
			$output += '<li class="urcl-conditional-or-group" data-key="1">';
			$output += '<div class="urcl-form-group">';
			$output +=
				'<select class="urcl-form-settings-field urcl-user-role-field urcl-field-conditional-field-select" name="user_registration_form_fields[condition_' +
				conditionid +
				'][1]">';
			$output += '<option value=""> -- Select --</option>';
			$output += get_fields_list();
			$output += "</select></div>";
			$output +=
				'<div class="urcl-operator"><select class="urcl-form-settings-field urcl-user-role-field" name="user_registration_form_operator[condition_' +
				conditionid +
				'][1]">';
			$output += '<option value = "is" >is</option>';
			$output += '<option value = "is_not" >is not</option>';
			$output += '<option value = "empty"> empty </option>';
			$output += '<option value = "not_empty"> not empty </option>';
			$output += '<option value = "greater_than"> greater than </option>';
			$output += '<option value = "less_than"> less_than </option>';
			$output += "</select></div>";
			$output +=
				'<div class="urcl-value"><input class="urcl-form-settings-field urcl-user-role-field" name="user_registration_user_registration_form_value[condition_' +
				conditionid +
				'][1]" type="text" /></div>';
			$output += '<span class="add">';
			$output += "AND";
			$output += "</span>";
			$output += '<span class="remove">';
			$output += '<i class="dashicons dashicons-minus"></i>';
			$output += "</span></li>";
			$output += "</ul>";
			$(this).before($output);
		}
	);

	$(document).on(
		"change",
		".urcl-role-container .urcl-conditional-group .urcl-field-conditional-field-select",
		function () {
			replace_field_values(".urcl-conditional-group", this);
		}
	);

	$(document).on(
		"change",
		".urcl-role-container .urcl-conditional-or-group .urcl-field-conditional-field-select",
		function () {
			replace_field_values(".urcl-conditional-or-group", this);
		}
	);

	function replace_field_values($class, $this) {
		var data_type = $("option:selected", $this).attr("data-type");
		var selected_val = $("option:selected", $this).val();
		var input_node = $($this)
			.closest($class)
			.find(".urcl-value")
			.children()
			.first();

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
			data_type == "multi_select2"
		) {
			if (
				data_type == "select" ||
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
	}
});
