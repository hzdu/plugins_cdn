/**
 * UserRegistration Conditional Logic Admin Form Settings JS
 * global urcl_data
 */
jQuery(function ($) {
	var URCL_Form_Settings = {
		/**
		 * Runs as soon as script is loaded, before DOM is ready.
		 */
		init: function() {
			// Init hooks.

			$(document).on(
				"change",
				".urcl-form-settings-logic-wrap .urcl-conditional-group .urcl-field-conditional-field-select",
				function () {
					URCL_Form_Settings.replace_field_values(".urcl-conditional-group", this);
				}
			);
		
			$(document).on(
				"change",
				".urcl-form-settings-logic-wrap .urcl-conditional-or-group .urcl-field-conditional-field-select",
				function () {
					URCL_Form_Settings.replace_field_values(".urcl-conditional-or-group", this);
				}
			);
			
			URCL_Redirection.add_settings();
		},


		/**
		 * Runs after DOM is ready.
		 */
		ready: function() {
			// Ready hooks.
			URCL_Redirection.ready();

			$(document).on(
				"click",
				".urcl-form-settings-logic-wrap .urcl-add-or-condition-btn",
				function() {
					URCL_Form_Settings.add_or_condition_handler( $(this), 'urcl-user-role-field' )
				}
			);

			$(document).on(
				"click",
				".urcl-conditional-group .add-btn, .urcl-or-groups .add-btn",
				URCL_Form_Settings.and_condition_handler
			);

			$(document).on(
				"click",
				".urcl-form-settings-logic-wrap .remove-btn",
				URCL_Form_Settings.remove_logic_handler
			);

			$(document).on(
				'click',
				'.urcl-add-or-condition-btn, .add-btn, .remove-btn',
				URCL_Form_Settings.hide_show_remove_btn
			);
			URCL_Form_Settings.hide_show_remove_btn();

			$(document.body).on( 'ur_field_option_changed', URCL_Form_Settings.update_dropdown_value_on_change);

			$(document).on( 'change', '.ur-options-list li', function( e ) {
				var $wrapper = $(".ur-selected-item.ur-item-active");
				URCL_Form_Settings.update_dropdown_value_on_change( e, {action: 'change', $wrapper} );
			});
		},


		/**
		 * Get list of fields wrapped in `option` tag.
		 * Warning: The output will NOT be wrapped with the `select` tag.
		 */
		get_fields_list: function() {
			var output = "";
			$(".ur-grid-lists .ur-selected-item .ur-general-setting").each(
				function () {
					var field_label = $(this)
						.closest(".ur-selected-item")
						.find(" .ur-admin-template .ur-label label")
						.clone()    //clone the element
						.children() //select all the children
						.remove()   //remove all the children
						.end()  //again go back to selected element
						.text();

					var field_key = $(this)
						.closest(".ur-selected-item")
						.find(" .ur-admin-template .ur-field")
						.data("field-key");


					var strip_fields = [
						"user_pass",
						"user_confirm_password",
						"section_title",
						"html",
						"wysiwyg",
						"billing_address_title",
						"shipping_address_title",
					];

					if ( strip_fields.includes( field_key ) ) {
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
		},


		/**
		 * Logic handler for 'Add OR Contition' button.
		 */
		add_or_condition_handler: function( element, field_key = '' ) {
			var conditionid = element
				.closest(".urcl-form-settings-logic-wrap")
				.attr("data-group");
			var or_text = typeof urcl_redirection_params.or_text !== 'undefined' ? urcl_redirection_params.or_text : 'OR';
			var $output = '<p class="urcl-or-label"> ' + or_text + ' </p>';

			$output +=
				'<ul class="urcl-form-settings-logic-box urcl-or-groups urcl-redirection-logic-box" data-group ="' +
				conditionid +
				'" data-last-key="1">';
			$output += '<li class="urcl-conditional-or-group" data-key="1">';
			$output += '<div class="urcl-form-group">';
			$output +=
				'<select class="urcl-form-settings-field ' + field_key + ' urcl-field-conditional-field-select" name="user_registration_form_fields[condition_' +
				conditionid +
				'][1]">';
			$output += '<option value="">-- Select Field --</option>';
			$output += URCL_Form_Settings.get_fields_list();
			$output += "</select></div>";
			$output +=
				'<div class="urcl-operator"><select class="urcl-form-settings-field ' + field_key + '" name="user_registration_form_operator[condition_' +
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
				'<div class="urcl-value"><input class="urcl-form-settings-field ' + field_key + '" name="user_registration_form_value[condition_' +
				conditionid +
				'][1]" type="text" /></div>';
			$output += '<span class="add add-btn">';
			$output += "AND";
			$output += "</span>";
			$output += '<span class="remove remove-btn">';
			$output += '<i class="dashicons dashicons-minus"></i>';
			$output += "</span></li>";
			$output += "</ul>";

			element.before($output);
		},


		/**
		 * Logic handler for 'AND' button.
		 */
		and_condition_handler: function() {
			condition_id = $(this)
				.closest(".urcl-form-settings-logic-box")
				.attr("data-group");
			var data_key = $(this)
				.closest(".urcl-form-settings-logic-box")
				.attr("data-last-key");
			data_key++;

			var or_condition = $(this).closest(".urcl-or-groups").length;
			var $group_class = "urcl-conditional-group";

			if (1 === or_condition) {
				$group_class = "urcl-conditional-or-group";
			}

			var $output = URCL_Form_Settings.get_single_condition_row_html( $group_class, data_key, condition_id );

			$(this).closest(".urcl-form-settings-logic-box").append($output);
			$(this).closest(".urcl-form-settings-logic-box").attr("data-last-key", data_key);
		},


		/**
		 * Returns html for single condition row.
		 * @param {string} $group_class Group Classname.
		 * @param {string} data_key Group Key.
		 * @param {string} condition_id Condition Id.
		 * @returns HTML string.
		 */
		get_single_condition_row_html: function( $group_class = '', data_key = '', condition_id = '' ) {
			$output = '<li class="' + $group_class + '" data-key=' + data_key + ">";
			$output += '<div class="urcl-form-group">';
			$output +=
				'<select class="urcl-form-settings-field urcl-user-role-field urcl-field-conditional-field-select" name="user_registration_form_fields[' +
				condition_id +
				"][" +
				data_key +
				']">';
			$output += '<option value="">-- Select Field --</option>';
			$output += URCL_Form_Settings.get_fields_list();
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
				'<div class="urcl-value"><input class="urcl-form-settings-field" name = "user_registration_form_value[' +
				condition_id +
				"][" +
				data_key +
				']" type="text" /></div>';

			$output += '<span class="add add-btn">';
			$output += "AND";
			$output += "</span>";
			$output += '<span class="remove remove-btn">';
			$output += '<i class="dashicons dashicons-minus"></i>';
			$output += "</span></li>";

			return $output;
		},


		/**
		 * Logic handle for single condition Remove button.
		 */
		remove_logic_handler: function () {
			var logic_box_count = 0;

			if ($(this).parent().hasClass("urcl-conditional-group")) {
				// Get logic box count
				logic_box_count = $(this)
					.closest( '.urcl-form-settings-logic-wrap' )
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
		},


		/**
		 * Hide remove button when only one logic left.
		 */
		hide_show_remove_btn: function() {
			var logic_wraps = $( '.urcl-form-settings-logic-wrap');

			$.each( logic_wraps, function(i, logic_wrap) {
				var logic_boxes = $( logic_wrap ).find('.urcl-conditional-group, .urcl-conditional-or-group');

				if ( logic_boxes.length === 1 ) {
					var logic_box = logic_boxes.first();

					logic_box
						.find( '.remove-btn' )
						.addClass( 'urcl-remove-btn-hidden')
						.hide();
				} else if ( logic_boxes.length > 1 ) {
					logic_boxes
					.find( '.urcl-remove-btn-hidden' )
					.removeClass( 'urcl-remove-btn-hidden' )
					.show();
				}
			});
		},

		/**
		 * Replace input field with dropdown field that has all the options of the selected field.
		 * @param {*} $class 
		 * @param {*} $this 
		 */
		replace_field_values: function($class, $this) {
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
				var options = "<option value>-- Select --</option>";
	
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


		/**
		 * Get all the conditions datas for specific conditional form setting.
		 *
		 * @param wrapper Condition Logic Wrapper class.
		 */
		get_conditional_setting_data: function ( conditions_wrapper ) {
			var form_data = [];

			var single_row = $( conditions_wrapper );

			$.each(single_row, function () {
				var all_conditions = [];
				var rule_actions = {};

				// Get action inputs.
				var action_inputs = $('.urcl-form-settings-action-wrapper').find( 'select, input');
				$.each( action_inputs, function() {
					var input_id = $(this).attr('name');
					var input_value = $(this).val();

					rule_actions[input_id] = input_value;
				});

				var or_conditions_wrappers = $(this).find('.urcl-form-settings-logic-box');

				$.each( or_conditions_wrappers, function() {
					var single_or_condition = [];
					$.each( $(this).find(".urcl-conditional-group, .urcl-conditional-or-group"), function() {
						var single_condition = [];
						var grid_list_item = $(this).find(
							".urcl-form-settings-field"
						);

						$.each(grid_list_item, function () {
							var conditions = {
								field_key: $(this).attr("name"),
								field_value: $(this).val(),
							};
							single_condition.push(conditions);
						});
						single_or_condition.push(single_condition);
					});
					all_conditions.push( single_or_condition );
				});

				var all_fields = {
					actions: rule_actions,
					conditions: all_conditions,
				};
				form_data.push(all_fields);
			});

			return form_data;
		},

		/**
		 * Select correct option for non-input fields like checkbox or select on load.
		 * @param {object} fields Conditional Logic Select fields.
		 */
		select_dropdown_value_on_load: function() {

			var fields = $(document).find( '.urcl-form-settings-logic-wrap.urcl-redirection-wrap').find( '.urcl-form-group' );

			var dropdown_fields = 
			[
				"check_box", 
				"radio", 
				"select", 
				"country", 
				"billing_country", 
				"shipping_country", 
				"select2", 
				"multi_select2"
			];

			$.each( fields, function( i, el ) {
				var select_element = $(el).find( 'select' );

				$.each( dropdown_fields, function( i, field ) {
					if ( select_element.val().startsWith( field ) ) {
						var value_element = $(el).parent().find( '.urcl-value' );
						var initial_value = value_element.find('input').val();

						select_element.change();
						
						value_element.find( 'select' ).find(
							'option[value="' + initial_value + '"]'
							)
						.attr('selected', 'selected');
						
						return false;
					}
				});
			});
		},

		/**
		 * Update field options when options changed in field settings.
		 * @param {*} e 
		 * @param {*} data 
		 */
		update_dropdown_value_on_change: function( e, data ) {

			var fields = $(document).find( '.urcl-form-settings-logic-wrap.urcl-redirection-wrap').find( '.urcl-form-group' );
			var changed_field_name = URCL_Form_Settings.get_active_field_name();

			$.each( fields, function( i, el ) {
				var select_element = $(el).find( 'select' ),
					selected_field = select_element.find( ':selected' ).val();

				if ( selected_field === changed_field_name ) {

					var selected_option = select_element
					.closest( '.urcl-conditional-group' )
					.find( '.urcl-value select' )
					.find( ':selected' )
					.val();


					select_element.change();

					// Select previously selected option.
					select_element
					.closest( '.urcl-conditional-group' )
					.find( '.urcl-value select' )
					.find( 'option[value="' + selected_option + '"]')
					.attr( 'selected', 'selected' );
				}
			});
		},

		/**
		 * Returns field name for active field.
		 * @returns 
		 */
		get_active_field_name: function() {
			var field_key = false,
				wrapper = $(".ur-selected-item.ur-item-active");

			if ( wrapper.length ) {
				var field_key_input = wrapper.find( '[name="ur_general_setting[field_name]"]');
	
				if ( field_key_input.length ) {
					field_key = field_key_input.val();
				}
			}

			return field_key;
		}
	}



	/**
	 * URCL_Redirection Object.
	 */
	var URCL_Redirection =  {
		/**
		 * Register event handlers here.
		 */
		ready: function() {
			URCL_Redirection.hide_show_settings();
			URCL_Redirection.hide_show_redirection_target_fields();

			$(
				"#user_registration_form_setting_enable_conditional_redirection"
			).on(
				"change",
				URCL_Redirection.hide_show_settings
			);

			$(document).ready( function() {

				$(".urcl-redirection-field").on(
					"change",
					URCL_Redirection.hide_show_redirection_target_fields
				);
			});


			$(document).on( 'user_registration_admin_before_form_submit', URCL_Redirection.save_settings );

			
			URCL_Form_Settings.select_dropdown_value_on_load();

		},


		/**
		 * Add Conditional redirection setting to DOM.
		 */
		add_settings: function() {
			var enable_conditional_redirection_wrapper = $('#user_registration_form_setting_enable_conditional_redirection').closest('.form-row');
			var conditional_redirection_template = $( urcl_redirection_params.templates.redirection_action );

			var saved_settings = urcl_redirection_params.conditional_settings.redirection;
			var logic_template = '';

			if ( ! saved_settings.length ) {
				// Load initial ui if no saved settings found.
				var logic_template = '<ul class="urcl-form-settings-logic-box" data-group="condition_1" data-last-key="1">';
				var conditional_group_html = $( URCL_Form_Settings.get_single_condition_row_html( 'urcl-conditional-group', 1, 'condition_1' ) );
				logic_template += conditional_group_html.prop('outerHTML');
				logic_template += '</ul>';
			} else {
				// Load logic ui from saved settings.
				$.each( saved_settings, function() {
	
					var $this = $(this)[0];
					var actions =  $this.actions;
	
					var action_wrapper = conditional_redirection_template.find( '.urcl-form-settings-action-wrapper' );
	
					// Set saved action inputs.
					$.each( actions, function(key) {
						var input_value = actions[key];
						var action_input = action_wrapper.find( '#' + key );
						if( typeof action_input !== 'undefined' ) {
							if ( 'SELECT' ===  action_input.prop('tagName') ) {
								action_input.val(input_value).change();
							} else {
								action_input.val(input_value);
							}
						}
					});
	
					var conditions = $this.conditions;
	
					$.each( conditions, function(i) {
						var or_conditions = this;
						var logic_box = '';
	
						if ( i ) {
							logic_template += '<p class="urcl-or-label">OR</p>';
						}
	
						var logic_box_template = '<ul class="urcl-form-settings-logic-box" data-group="condition_1" data-last-key="1">';
	
						$.each(or_conditions, function(index) {
							// Single Condition.
							var conditional_group_html = $( URCL_Form_Settings.get_single_condition_row_html( 'urcl-conditional-group', index + 1, 'condition_1' ) );
							var condition_obj = this;
	
							$.each(condition_obj, function(index, condition_input) {
								// Single Condition Input Fields.
								var condition_input_element = conditional_group_html.find( '[name="' + condition_input.field_key + '"]');
								if ( 'undefined' !== typeof condition_input_element ) {
									if ( 'SELECT' ===  condition_input_element.prop('tagName') ) {
										condition_input_element
										.find(
											'option[value="' + condition_input.field_value + '"]'
											)
										.attr('selected', 'selected')
										.change();
									} else {
										condition_input_element.attr('value', condition_input.field_value);
									}
								}
							});
							logic_box_template += conditional_group_html.prop('outerHTML');
						});
						logic_box_template += '</ul>';
						logic_template += logic_box_template;
					});
	
				});
			}

			conditional_redirection_template.find('.urcl-redirection-wrap .urcl-form-settings-action-wrapper').after( $(logic_template ) );

			enable_conditional_redirection_wrapper.after( conditional_redirection_template );

		},


		/**
		 * Logic for hiding and showing conditional redirection settings.
		 */
		hide_show_settings: function() {
			var redirection_wrapper = $( '.urcl-redirection-wrap' ).parent();

			if( $('#user_registration_form_setting_enable_conditional_redirection').is( ':checked') ) {
				redirection_wrapper.slideDown(500);
			} else {
				redirection_wrapper.slideUp(500);
			}
		},


		/**
		 * Logic for hiding and showing redirection target fields.
		 */
		hide_show_redirection_target_fields: function() {
			var $this = $('.urcl-redirection-field');

			$( '#urcl-redirection-custom-page' ).hide(500);
			$( '#urcl-redirection-external-url' ).hide(500);

			if ( 'custom_page' === $this.val() ) {
				$( '#urcl-redirection-custom-page' ).show(500);
			} else if ( 'external_url' === $this.val() ) {
				$( '#urcl-redirection-external-url' ).show(500);
			}
		},


		/**
		 * Adds conditional redirection settings data to the Ajax request data.
		 * @param {object} event Event object.
		 * @param {object} data Ajax request data.
		 */
		save_settings: function( event, data ) {
			var conditional_redirection_data = URCL_Form_Settings.get_conditional_setting_data( '.urcl-redirection-wrap' );
			data.data.conditional_redirection_settings = conditional_redirection_data;
		}

	}


	///////////////////   WRITE CODE ABOVE HERE   //////////////////////////

	URCL_Form_Settings.init();
	$(document).ready( URCL_Form_Settings.ready );
});
