jQuery(document).ready(function ($) {
	var urcl_util = {
		init: function () {
			/**
			 * Set hide fields to $_POST.
			 *
			 * Added $error_message @since v1.2.6
			 **/
			$(document).on(
				"user_registration_frontend_before_form_submit user_registration_frontend_before_edit_profile_submit",
				function (event, data, pointer, $error_message) {
					var urcl_hide_fields = $("#urcl_hide_fields");
					if (
						urcl_hide_fields != null &&
						urcl_hide_fields.length > 0
					) {
						data["urcl_hide_fields"] = urcl_hide_fields.val();
					}
				}
			);

			//Hide parent div if urcl hide field found
			$(".urcl-hide-field").closest(".ur-field-item").hide();

			//remove required if hidden already
			$(".urcl-hide-field").removeAttr("required");

			$("form, .user-registration").each(function () {
				if (
					$(this).is(".register") ||
					$(this).is(".user-registration-EditProfileForm") ||
					$(this).is(".user-registration")
				) {
					var form_id = $(this).data("form-id");
					var $this_form = form_id
						? $('form[data-form-id="' + form_id + '"')
						: $(this);
					var $fields = $(this).find(".ur-field-item");

					if ($fields.length === 0) {
						$fields = $(this).find(".form-row");
					}

					var urcl_hide_fields = document.createElement("input");
					urcl_hide_fields.setAttribute("type", "hidden");
					urcl_hide_fields.setAttribute("id", "urcl_hide_fields");
					urcl_hide_fields.setAttribute("name", "urcl_hide_fields");
					urcl_hide_fields.setAttribute("value", "");

					if ($(this).is(".register")) {
						var form = document.querySelector(
							"#user-registration-form-" +
								form_id +
								" form.register"
						);
					} else if (
						$(this).is(".user-registration-EditProfileForm")
					) {
						var form = document.querySelector(
							"form.user-registration-EditProfileForm"
						);
					}

					if (form) form.appendChild(urcl_hide_fields);

					$fields.each(function () {
						if ($(this).data("conditional-logic-enabled")) {
							var conditional_logic_map = $(this).data(
								"conditional-logic-map"
							);
							var field_id = $(this).data("field-id");

							if (!field_id) {
								field_id = $(this).attr("id");
							}

							if ("object" !== typeof conditional_logic_map) {
								try {
									conditional_logic_map = JSON.parse(
										conditional_logic_map
									);
								} catch (error) {}
							}

							if (
								conditional_logic_map &&
								"" !== conditional_logic_map &&
								"object" === typeof conditional_logic_map
							) {
								urcl_util.run(
									field_id,
									conditional_logic_map,
									$this_form
								);
								urcl_util.delegateRule(
									conditional_logic_map.action,
									field_id,
									conditional_logic_map.logic_map,
									conditional_logic_map,
									$this_form
								);
							}
						}
					});
				}
			});
		},
		delegateRule: function (action, target_id, rule, logic_map, $form) {
			if ("group" === rule.type) {
				if (Array.isArray(rule.conditions)) {
					rule.conditions.forEach(function (subRule) {
						urcl_util.delegateRule(
							action,
							target_id,
							subRule,
							logic_map,
							$form
						);
					});
				}
			} else {
				var triggerer_selector =
					'.ur-field-item[data-field-id="' +
					rule.triggerer_id +
					'"]  .ur-input-checkbox, .ur-frontend-field, .form-row#user_registration_' +
					rule.triggerer_id +
					'_field .urwc-field-input, .ur-field-item[data-field-id="' +
					rule.triggerer_id +
					'"] .urwc-field-input, .ur-field-item[data-field-id="' +
					rule.triggerer_id +
					'"] .ur-edit-profile-field';

				$form.on("change keyup", triggerer_selector, function () {
					urcl_util.run(target_id, logic_map, $form);
				});
			}
		},

		run: function (target_id, logic_map, $form) {
			var evaluation = urcl_util.evaluateCondition(
				logic_map.logic_map,
				$form
			);
			var $target_field = $form.find(
				'.ur-field-item[data-field-id="' + target_id + '"]'
			);
			var el_value = $form.find("#urcl_hide_fields").val();
			var urcl_hide_fields = new Set(
				!!el_value ? JSON.parse(el_value) : []
			);
			var is_hide_field = null;

			if ($target_field.length === 0) {
				$target_field = $form.find(".form-row#" + target_id);
			}

			if (evaluation) {
				if ("hide" === logic_map.action) {
					$target_field.hide();
					is_hide_field = true;
				} else {
					$target_field.show();
					is_hide_field = false;
				}
			} else {
				if ("hide" === logic_map.action) {
					$target_field.show();
					is_hide_field = false;
				} else {
					$target_field.hide();
					is_hide_field = true;
				}
			}

			if (is_hide_field) {
				urcl_hide_fields.add(target_id);
			} else {
				urcl_hide_fields.delete(target_id);
			}

			$form
				.find("#urcl_hide_fields")
				.val(JSON.stringify(Array.from(urcl_hide_fields)));
		},

		getFieldValue: function (field_id, $form) {
			var $field = $form.find(
					'.ur-field-item[data-field-id="' + field_id + '"]'
				),
				$inputElement = $field.find(".ur-frontend-field").length
					? $field.find(".ur-frontend-field")
					: $field.find(".ur-edit-profile-field");

			if ($field.find(".urwc-field-input").length) {
				$inputElement = $field.find(".urwc-field-input");
			}

			if (
				$field.is(".field-checkbox") ||
				"checkbox" === $inputElement.attr("type")
			) {
				var values = [];

				$inputElement
					.parent()
					.find(":checked")
					.each(function () {
						values.push($(this).val());
					});
				return values;
			} else if (
				$field.is(".field-radio") ||
				"radio" === $inputElement.attr("type")
			) {
				return $inputElement.parent().find(":checked").val();
			} else if (
				$field.is(".field-privacy_policy") ||
				$field.is(".field-mailchimp") ||
				$field.is(".field-separate_shipping")
			) {
				return $inputElement.is(":checked") ? "checked" : "unchecked";
			} else {
				return $inputElement.val();
			}
		},

		evaluateCondition: function (rule, $form) {
			if ("group" === rule.type) {
				if (Array.isArray(rule.conditions)) {
					// Set default logic gate as 'OR'.
					if (!rule.logic_gate || "" === rule.logic_gate) {
						rule.logic_gate = "OR";
					}

					for (var i = 0; i < rule.conditions.length; i++) {
						var subRule = rule.conditions[i],
							evaluation = this.evaluateCondition(subRule, $form);

						if ("OR" === rule.logic_gate && true === evaluation) {
							return true;
						}
						if ("AND" === rule.logic_gate && false === evaluation) {
							return false;
						}
						if ("NOT" === rule.logic_gate && true === evaluation) {
							return false;
						}
					}
					if ("OR" === rule.logic_gate) {
						return false;
					}
					if (
						"AND" === rule.logic_gate ||
						"NOT" === rule.logic_gate
					) {
						return true;
					}
					return false;
				}
				return true;
			} else {
				var subject = rule.value;
				var compareAgainst = this.getFieldValue(
					rule.triggerer_id,
					$form
				);

				if (
					urcl_util.resolveOperator(
						subject,
						compareAgainst,
						rule.operator
					)
				) {
					return true;
				}
				return false;
			}
		},

		/**
		 * Compare or resolve two values based on the provided operator.
		 *
		 * @param {String|Integer} subject The value that should be compared.
		 * @param {Array|String} compareAgainst The value to be compare against.
		 * @param {String} operator Operator to use for comparing.
		 */
		resolveOperator: function (subject, compareAgainst, operator) {
			switch (operator) {
				case "is":
					if (
						Array.isArray(subject) &&
						Array.isArray(compareAgainst)
					) {
						return urcl_util.compareArrays(subject, compareAgainst);
					}
					if (Array.isArray(compareAgainst)) {
						return compareAgainst.includes(subject);
					}
					return subject === compareAgainst;

				case "is_not":
					if (
						Array.isArray(subject) &&
						Array.isArray(compareAgainst)
					) {
						return urcl_util.compareArrays(subject, compareAgainst);
					}
					if (Array.isArray(compareAgainst)) {
						return !compareAgainst.includes(subject);
					}
					return subject !== compareAgainst;

				default:
					return false;
			}
		},

		compareArrays: function (array1, array2) {
			// Compare length.
			if (array1.length !== array2.length) {
				return false;
			}

			// Compare each element.
			for (var i = 0; i < array1.length; i++) {
				var item = array1[i];

				if (!array2.includes(item)) {
					return false;
				}
			}
			return true;
		},
	};

	urcl_util.init();
	$(document).on("elementor/popup/show", function () {
		urcl_util.init();
	});
});
