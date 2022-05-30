/* global wp, _wpCustomizeBackground, user_registration_email_templates_controls_script_data */
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
	 * A number control.
	 *
	 * @class    wp.customize.NumberControl
	 * @augments wp.customize.Class
	 */
	 api.NumberControl = api.Control.extend({
		/**
		 * Initialize behaviors.
		 *
		 * @returns {void}
		 */
		ready: function ready() {
			var control = this,
				$container = control.container,
				$input = $container.find(
					'.number-input'
				);

			control.container.on(
				"keyup input",
				".user-registration-number-input input[type='number']",
				function () {
					$input.val($(this).val());
					control.saveValue($(this).val());
				});

			control.container.on("click", ".reset", function (e) {
				e.preventDefault();
				$input.val(control.params.default);
				control.saveValue(control.params.default);
			});
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
		saveValue: function (val) {
		var control = this,
			input = control.container.find(".number-hidden-value");

		jQuery(input).val(JSON.parse(val)).trigger("change");
		control.setting.set(val);
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

			// Dimension control reset
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
									e.target.focus();
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
		"ur-number": api.NumberControl,
	});

	$(function () {
		// Control visibility for default controls.
		$.each(
			["container", "email_body", "footer", "header"],
			function (i, type) {
				$.each(
					{
						border_type: {
							controls: ["border_width", "border_color"],
							callback: function (to) {
								return "none" !== to;
							},
						},
						entries_border_type: {
							controls: [
								"entries_border_width",
								"entries_border_color",
							],
							callback: function (to) {
								return "none" !== to;
							},
						},
						logo_footer: {
							controls: ["footer_logo_image"],
							callback: function (to) {
								return "use_different" === to;
							},
						},
						copyright_border_type: {
							controls: [
								"copyright_border_width",
								"copyright_border_color",
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
						background_image: {
							controls: [
								"background_preset",
								"background_position",
								"background_size",
								"background_repeat",
								"background_attachment",
							],
							callback: function (to) {
								return !!to;
							},
						},
						logo_image: {
							controls: [
								"logo_width",
								"logo_link",
								"logo_inline",
								"logo_footer",
							],
							callback: function (to) {
								return !!to;
							},
						},
					},
					function (settingId, o) {
						api(
							"user_registration_email_templates[" +
								data.template_id +
								"][" +
								type +
								"][" +
								settingId +
								"]",
							function (setting) {
								$.each(o.controls, function (i, controlId) {
									api.control(
										"user_registration_email_templates[" +
											data.template_id +
											"][" +
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
			}
		);

		api.control(
			"user_registration_email_templates[" +
				data.template_id +
				"][container][background_repeat]",
			function (control) {
				control.elements[0].unsync(
					api(
						"user_registration_email_templates[" +
							data.template_id +
							"][container][background_repeat]"
					)
				);

				control.element = new api.Element(
					control.container.find("input")
				);
				control.element.set("no-repeat" !== control.setting());

				control.element.bind(function (to) {
					control.setting.set(to ? "repeat" : "no-repeat");
				});

				control.setting.bind(function (to) {
					control.element.set("no-repeat" !== to);
				});
			}
		);

		api.control(
			"user_registration_email_templates[" +
				data.template_id +
				"][email_body][background_repeat]",
			function (control) {
				control.elements[0].unsync(
					api(
						"user_registration_email_templates[" +
							data.template_id +
							"][email_body][background_repeat]"
					)
				);

				control.element = new api.Element(
					control.container.find("input")
				);
				control.element.set("no-repeat" !== control.setting());

				control.element.bind(function (to) {
					control.setting.set(to ? "repeat" : "no-repeat");
				});

				control.setting.bind(function (to) {
					control.element.set("no-repeat" !== to);
				});
			}
		);

		api.control(
			"user_registration_email_templates[" +
				data.template_id +
				"][footer][background_repeat]",
			function (control) {
				control.elements[0].unsync(
					api(
						"user_registration_email_templates[" +
							data.template_id +
							"][footer][background_repeat]"
					)
				);

				control.element = new api.Element(
					control.container.find("input")
				);
				control.element.set("no-repeat" !== control.setting());

				control.element.bind(function (to) {
					control.setting.set(to ? "repeat" : "no-repeat");
				});

				control.setting.bind(function (to) {
					control.element.set("no-repeat" !== to);
				});
			}
		);

		api.control(
			"user_registration_email_templates[" +
				data.template_id +
				"][header][background_repeat]",
			function (control) {
				control.elements[0].unsync(
					api(
						"user_registration_email_templates[" +
							data.template_id +
							"][header][background_repeat]"
					)
				);

				control.element = new api.Element(
					control.container.find("input")
				);
				control.element.set("no-repeat" !== control.setting());

				control.element.bind(function (to) {
					control.setting.set(to ? "repeat" : "no-repeat");
				});

				control.setting.bind(function (to) {
					control.element.set("no-repeat" !== to);
				});
			}
		);
	});
})(
	jQuery,
	wp.customize,
	user_registration_email_templates_controls_script_data
);
/**
 * send test email
*/
(jQuery)( function( $ ) {
	$( ".uret-send-btn" ).on( "click", function( e ) {
		e.preventDefault();
		var uret_from = $( "#sub-accordion-section-uret_sender_option" ).find( '.uret_from' ).val();
		var uret_to = $( "#sub-accordion-section-uret_sender_option" ).find( '.uret_to' ).val();
		var template_id = user_registration_email_templates_controls_script_data.template_id;
		$.ajax({
			type: "post",
			url: user_registration_email_templates_controls_test_email_script.ajax_url,
			data: {
				'action': 'user_registration_email_templates_send_test_email',
				 from : uret_from,
				 email : uret_to,
				 template_id: template_id,
			},
			beforeSend: function () {
				var spinner = '<span class="ur-control-spinner"></span>';
				$( '.uret-send-btn' ).after( spinner );
			},
			complete: function ( response ) {
				$( '.ur-control-spinner' ).remove();
				$( '.uret-notice' ).remove();
				if( response.responseJSON.success === true ) {
					var msg = '<p class ="uret-notice">'+ response.responseJSON.data.message +'</p>';
				    $( ".uret-send-btn" ).after( msg );
				} else {
					var msg = '<p class ="uret-notice">'+ response.responseJSON.data.message +'</p>';
				    $( ".uret-send-btn" ).after( msg );
				}
			}
		});
	});
});
