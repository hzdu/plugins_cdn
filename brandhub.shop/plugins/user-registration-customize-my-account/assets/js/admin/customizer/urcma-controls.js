/* global wp, _wpCustomizeBackground, user_registration_customize_my_account_controls_script_data */
(function ($, api, data) {
	"use strict";

	// Modify customize info.
	api.bind("ready", function () {
		$("#customize-info")
			.find(".panel-title.site-title")
			.text(data.panelTitle);
		$("#customize-info")
			.find(".customize-panel-description:first")
			.text(data.panelDescription);
	});

	/**
	 * A toggle switch control.
	 *
	 * @class    wp.customize.ToggleControl
	 * @augments wp.customize.Control
	 */
	api.ToggleControl = api.Control.extend({
		/**
		 * Initialize behaviors.
		 *
		 * @returns {void}
		 */
		ready: function () {
			var control = this;

			control.container.on("change", "input:checkbox", function () {
				var value = this.checked ? true : false;
				control.setting.set(value);
			});
		},
	});

	/**
	 * A range slider control.
	 *
	 * @class    wp.customize.SliderControl
	 * @augments wp.customize.Class
	 */
	api.SliderControl = api.Control.extend({
		/**
		 * Initialize behaviors.
		 *
		 * @returns {void}
		 */
		ready: function ready() {
			var control = this,
				$container = control.container,
				$slider = $container.find(".user-registration-slider"),
				$input = $container.find(
					'.user-registration-slider-input input[type="number"]'
				),
				min = Number($input.attr("min")),
				max = Number($input.attr("max")),
				step = Number($input.attr("step"));

			$slider.slider({
				range: "min",
				min: min,
				max: max,
				value: $input.val(),
				step: step,
				slide: function (event, ui) {
					// Trigger keyup in input.
					$input.val(ui.value).on("keyup");
				},
				change: function (event, ui) {
					control.setting.set(ui.value);
				},
			});

			control.container.on("click", ".reset", function (e) {
				e.preventDefault();
				$slider.slider("option", "value", control.params.default);
			});

			control.container.on(
				"change keyup input",
				"input.slider-input",
				function (e) {
					if (
						("keyup" === e.type || "input" === e.type) &&
						"" === $(this).val()
					) {
						return;
					}
					$slider.slider("option", "value", $(this).val());
				}
			);
		},
	});

	/**
	 * A enhanced select2 control.
	 *
	 * @class    wp.customize.Select2Control
	 * @augments wp.customize.Class
	 */
	api.Select2Control = api.Control.extend({
		/**
		 * Initialize behaviors.
		 *
		 * @returns {void}
		 */
		ready: function ready() {
			var control = this,
				$container = control.container,
				$select_input = $container.find(".ur-select2");

			// Enhanced Select2.
			$select_input.select2({
				minimumResultsForSearch: 10,
				allowClear: $select_input.data("allow_clear") ? true : false,
				placeholder: $select_input.data("placeholder"),
			});
		},
	});

	/**
	 * A dimension control.
	 *
	 * @class    wp.customize.DimensionControl
	 * @augments wp.customize.Class
	 */
	api.DimensionControl = api.Control.extend({
		/**
		 * Initialize behaviors.
		 *
		 * @returns {void}
		 */
		ready: function () {
			var control = this,
				$container = control.container,
				$inputs = $container.find(".dimension-input");

			// Hide except first responsive item
			control.container.find(".responsive-tabs li:not(:first)").hide();

			control.container.on(
				"keyup input",
				".dimension-input",
				function () {
					var this_input = $(this),
						key = this_input.attr("name"),
						min = parseInt(this_input.attr("min")),
						max = parseInt(this_input.attr("max"));

					// Number validation for min or max value.
					if (this_input.val() < min) {
						this_input.val(this_input.attr("min"));
					}
					if (this_input.val() > max) {
						this_input.val(this_input.attr("max"));
					}
					if (control.is_anchor()) {
						$inputs.each(function (index, input) {
							$(input).val(this_input.val());
							control.saveValue(
								$(input).attr("name"),
								this_input.val()
							);
						});
					} else {
						control.saveValue(key, this_input.val());
					}
				}
			);

			control.container.on(
				"change",
				'.dimension-unit-item input[type="radio"]',
				function () {
					control.saveValue("unit", $(this).val());
				}
			);

			control.container.on("change", ".dimension-anchor", function () {
				if ($(this).is(":checked")) {
					$(this)
						.parent("label")
						.removeClass("unlinked")
						.addClass("linked");
					$inputs.first().trigger("keyup");
				} else {
					$(this)
						.parent("label")
						.removeClass("linked")
						.addClass("unlinked");
				}
			});

			control.container.on(
				"change",
				'.responsive-tab-item input[type="radio"]',
				function () {
					var value = control.get_value();
					var this_value = $(this).val();

					if (value[this_value] !== undefined) {
						$inputs.each(function (index, input) {
							$(input).val(
								value[this_value][$(input).attr("name")]
							);
						});
						control.container
							.find(
								'.dimension-unit-item input[value="' +
									value[this_value].unit +
									'"]'
							)
							.attr("checked", "checked");
					} else {
						$inputs.val("");
					}
					control.saveValue(
						"top",
						$container.find('input[name="top"]').val()
					);
				}
			);

			// Hide show buttons.
			control.container.on(
				"click",
				'.responsive-tab-item input[type="radio"]',
				function () {
					var $this = $(this);
					var current_tab = $this.val();
					var $all_responsive_tabs = $("#customize-controls")
						.find(
							'.responsive-tab-item input[type="radio"][value="' +
								current_tab +
								'"]'
						)
						.prop("checked", true);
					$all_responsive_tabs.each(function (index, element) {
						var $tab_item = $(element)
							.closest(".responsive-tab-item")
							.closest("li");
						if ($tab_item.index() === 0) {
							$tab_item.siblings().toggle();
						}
					});
					// Set the toggled device.
					api.previewedDevice.set(current_tab);
				}
			);
			
			// dimension control reset
			control.container.on("click", ".reset", function (e) {
				e.preventDefault();
				$inputs.each(function (index,input) {
				if(control.params.default.desktop) {
					$(input).val(control.params.default.desktop[$(input).attr("name")]);
					control.saveValue(
						$(input).attr("name"),
						control.params.default.desktop[$(input).attr("name")]
					);
				} else {
					$(input).val(control.params.default[$(input).attr("name")]);
					control.saveValue(
						$(input).attr("name"),
						control.params.default[$(input).attr("name")]
					);
				 }
				});
			});
		},

		/**
		 * Returns anchor status.
		 */
		is_anchor: function () {
			return $(this.container).find(".dimension-anchor").is(":checked");
		},

		/**
		 * Returns responsive selected.
		 */
		selected_responsive: function () {
			return $(this.container)
				.find('.responsive-tab-item input[type="radio"]:checked')
				.val();
		},

		/**
		 * Returns Unit selected.
		 */
		selected_unit: function () {
			return $(this.container)
				.find('.dimension-unit-item input[type="radio"]:checked')
				.val();
		},

		/**
		 * Returns Value Object.
		 */
		get_value: function () {
			return Object.assign({}, this.setting._value);
		},

		/**
		 * Saves the value.
		 */
		saveValue: function (property, value) {
			var control = this,
				input = control.container.find(".dimension-hidden-value"),
				val = control.get_value();

			if (control.params.responsive === true) {
				if (undefined === val[control.selected_responsive()]) {
					val[control.selected_responsive()] = {};
				}

				val[control.selected_responsive()][property] = value;
				if (control.params.unit_choices.length > 0) {
					val[
						control.selected_responsive()
					].unit = control.selected_unit();
				}
			} else {
				val[property] = value;
				if (Object.keys(control.params.unit_choices).length > 0) {
					val.unit = control.selected_unit();
				}
			}

			jQuery(input).val(JSON.stringify(val)).trigger("change");
			control.setting.set(val);
		},
	});

	/**
	 * An Editor control.
	 *
	 * @class    wp.customize.EditorControl
	 * @augments wp.customize.Class
	 */
	api.EditorControl = api.Control.extend({
		/**
		 * Initialize behaviors.
		 *
		 * @returns {void}
		 */
		ready: function ready() {
			var control = this,
				$container = control.container,
				$editor = $container.find(".user-registration-editor").first();

			// Initialize the custom content.
			wp.editor.initialize($editor.attr("id"), {
				tinymce: {
					wpautop: true,
					plugins:
						"charmap colorpicker compat3x directionality fullscreen hr image lists media paste tabfocus textcolor wordpress wpautoresize wpdialogs wpeditimage wpemoji wpgallery wplink wptextpattern wpview",
					toolbar1:
						"bold italic underline strikethrough | bullist numlist | blockquote hr wp_more | link unlink | fullscreen | wp_adv",
					toolbar2:
						"formatselect alignjustify forecolor | fontsizeselect | pastetext removeformat charmap | outdent indent | undo redo | wp_help",
					setup: function (editor) {
						editor.on("init", function (e) {
							editor.on(
								"keyup input keydown change",
								function (e) {
									control.setting.set(editor.getContent());
									e.target.trigger("focus");
								}
							);
						});
					},
				},
				quicktags: true,
				mediaButtons: true,
			});
		},
	});

	/**
	 * An image checkbox control.
	 *
	 * @class    wp.customize.ImageCheckboxControl
	 * @augments wp.customize.Class
	 */
	api.ImageCheckboxControl = api.Control.extend({
		/**
		 * Initialize behaviors.
		 *
		 * @returns {void}
		 */
		ready: function ready() {
			var control = this,
				$container = control.container;

			$container.on("change", 'input[type="checkbox"]', function () {
				control.saveValue($(this).val(), $(this).is(":checked"));
			});
		},

		/**
		 * Saves the value.
		 */
		saveValue: function (property, value) {
			var control = this,
				input = control.container.find(".image-checkbox-hidden-value"),
				val = control.params.value;

			val[property] = value;
			val = Object.assign({}, val);

			jQuery(input).val(JSON.stringify(val)).trigger("change");
			control.setting.set(val);
		},
	});

	api.controlConstructor = $.extend(api.controlConstructor, {
		"ur-color": api.ColorControl,
		"ur-toggle": api.ToggleControl,
		"ur-slider": api.SliderControl,
		"ur-select2": api.Select2Control,
		"ur-dimension": api.DimensionControl,
		"ur-background": api.BackgroundControl,
		"ur-image_checkbox": api.ImageCheckboxControl,
		"ur-background_image": api.BackgroundImageControl,
		"ur-editor": api.EditorControl,
	});

	$(function () {
		// Control visibility for default controls.
		$.each(["wrapper", "navigation", "form"], function (i, type) {
			$.each(
				{
					border_type: {
						controls: ["border_width", "border_color"],
						callback: function (to) {
							return "none" !== to;
						},
					},
					navigation_style: {
						controls: ["nav_wrapper_width"],
						callback: function (to) {
							return "horizontal" !== to;
						},
					},
					nav_wrapper_border_type: {
						controls: [
							"nav_wrapper_border_width",
							"nav_wrapper_border_color",
						],
						callback: function (to) {
							return "none" !== to;
						},
					},
					nav_link_border_type: {
						controls: [
							"nav_link_border_width",
							"nav_link_border_color",
						],
						callback: function (to) {
							return "none" !== to;
						},
					},
					input_border_type: {
						controls: [
							"input_border_width",
							"input_border_color",
							"input_focus_border_color",
						],
						callback: function (to) {
							return "none" !== to;
						},
					},
					style_variation: {
						controls: ["size", "color", "checked_color"],
						callback: function (to) {
							return "default" !== to;
						},
					},
				},
				function (settingId, o) {
					api(
						"user_registration_customize_my_account[" +
							type +
							"][" +
							settingId +
							"]",
						function (setting) {
							$.each(o.controls, function (i, controlId) {
								api.control(
									"user_registration_customize_my_account[" +
										type +
										"][" +
										controlId +
										"]",
									function (control) {
										var visibility = function (to) {
											control.container.toggle(
												o.callback(to)
											);
										};

										visibility(setting.get());
										setting.bind(visibility);
									}
								);
							});
						}
					);
				}
			);
		});
	});
})(
	jQuery,
	wp.customize,
	user_registration_customize_my_account_controls_script_data
);
