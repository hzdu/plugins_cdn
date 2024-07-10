/**
 * URCLConditional JS
 */

(function($) {

    var URCLConditionalLogic = {
		data: {},
		/**
		 * Start the engine.
		 */
        init: function() {

			// Document ready
			$(document).ready(URCLConditionalLogic.ready);

			URCLConditionalLogic.data.isFetchConditionalBlock = false;

			URCLConditionalLogic.bindUIActions();
		},

        ready: function() {

		},

		/**
		 * Element bindings.
		 *
		 */
		 bindUIActions: function() {
			$( document ).on( 'change', '.ur-enable-conditional-logic', function(e) {
				if( $(this).parents('div#user_registration_form_setting_enable_submit_conditional_logic_field').next( '.urcl-conditional-logic-container' ).length === 0 ) {
					if( $(this).is(':checked') && ! URCLConditionalLogic.data.isFetchConditionalBlock ) {
						URCLConditionalLogic.data.isFetchConditionalBlock = true;
						URCLConditionalLogic.fetchConditionalBlock($(this));
					}
				} else {
					URCLConditionalLogic.showHideConditionalBlock(e);
				}
			});

			$( document ).on('click', '.ui-tabs-tab[aria-controls="ur-tab-field-settings"]', function(e) {
				if( $('#user_registration_form_setting_enable_submit_conditional_logic').is(':checked') && ! URCLConditionalLogic.data.isFetchConditionalBlock ) {
					URCLConditionalLogic.data.isFetchConditionalBlock = true;
					URCLConditionalLogic.fetchConditionalBlock($('#user_registration_form_setting_enable_submit_conditional_logic'));
				}
			} );

			// Add click event handler to AND button
			$(document).on('click', '.urcl-submit-conditional-container .add', function() {
				var $ul     = $(this).closest('ul.urcl-role-logic-box'),
				 	counter = $ul.data('last-key');
					connectionId = $(this).parents( 'div.urcl-submit-logic-wrap' ).data('group').match(/condition_(\d+)/)[1];
				
				counter = counter ? counter : $ul.data('last-or-key');

				URCLConditionalLogic.addAndCondtion($ul, counter, connectionId);
			});

			// Add click event handler to Add OR Condition button
			$(document).on('click', '.urcl-submit-conditional-container .urcl-add-or-condition', function() {
				var connectionId = $(this).parent( 'div.urcl-submit-logic-wrap' ).data('group').match(/condition_(\d+)/)[1];
				URCLConditionalLogic.addOrCondtion(connectionId, $(this));
			});

			// Add click event handler to remove Condition button
			$(document).on('click', '.urcl-submit-conditional-container .remove', function() {
				URCLConditionalLogic.removeCondtion($(this));
			});

			// Add click event handler to new Condition button
			$(document).on('click', '.urcl-conditional-logic-container .urcl-add-new-condition', function() {
				URCLConditionalLogic.addNewCondtion($(this));
			});

			// Add click event handler to remove new Condition button
			$(document).on('click', '.urcl-submit-conditional-container .urcl-remove-condition', function() {
				URCLConditionalLogic.removeNewCondtion($(this));
			});

			$(document).on( "change", ".urcl-submit-conditional-container .urcl-conditional-group .urcl-field-conditional-field-select", function () {
					URCLConditionalLogic.replace_field_values(".urcl-conditional-group", this);
				}
			);
		
			$(document).on( "change", ".urcl-submit-conditional-container .urcl-conditional-or-group .urcl-field-conditional-field-select", function () {
					URCLConditionalLogic.replace_field_values(".urcl-conditional-or-group", this);
				}
			);
		},

		/**
		 * Element bindings.
		 *
		 */
        showHideConditionalBlock: function(e) {
            var $this     = $(e.target),
                isEnabled = $this.is(':checked');

            var wrapper = $this.parents('div#user_registration_form_setting_enable_submit_conditional_logic_field').next( '.urcl-conditional-logic-container' );

            if( 0 >= wrapper.length && isEnabled && ! URCLConditionalLogic.data.isFetchConditionalBlock ) {
				URCLConditionalLogic.data.isFetchConditionalBlock = true;

                URCLConditionalLogic.fetchConditionalBlock($this);
            }

			if( isEnabled ) {
				wrapper.show();
			}else{
				wrapper.hide();
			} 
		},

		/**
		 * Fetch the conditional block.
		 *
		 */
        fetchConditionalBlock: function(self) {
			var searchParams = new URLSearchParams(window.location.search);
			var formID = searchParams.get('edit-registration');

            $.ajax({
                url: urcl_params.ajax_url,
                type: 'POST',
                data: {
                  _wpnonce: urcl_params.nonce,
				  action: "urcl_fetch_conditional_block",
				  formID: formID
                },
                dataType: 'json', // Expected data type of the response
                success: function(response) {

				  if(response.success) {
					var $parent = self.parents('div#user_registration_form_setting_enable_submit_conditional_logic_field');

					if( $parent.next( '.urcl-submit-conditional-container' ).length ) {
						return;
					}

					URCLConditionalLogic.data.template = response.data.template;

					if( response.data.html ) {
						$(response.data.html).insertAfter($parent);
					} else {
						var $outerDiv = $("<div>", {class: "urcl-form-settings-container urcl-conditional-logic-container"});
						var $innerDiv = $("<div>", {class: "urcl-submit-conditional-container"});

						$outerDiv.append($innerDiv);
						$innerDiv.html(response.data.template);
						$($outerDiv).insertAfter($parent);
					}
				  }
                },
                error: function(xhr, status, error) {
                //   console.log('Error: ', xhr.responseText);
                }
              });
              
		},

		addAndCondtion: function(current, counter, connectionId) {
			var $clone = $(URCLConditionalLogic.data.template).find('li.urcl-conditional-group').clone();

			$clone.find('.urcl-form-group select.urcl-field-conditional-field-select option:not(:first)').remove();
			$clone.find('.urcl-form-group select.urcl-field-conditional-field-select').append(URCLConditionalLogic.get_fields_list());
			
			// Update data-key attribute
			++counter;

			$clone.attr('data-key', counter);
		
			// Update select element name attribute
			$clone.find('select.urcl-field-conditional-field-select')
				.attr('name', 'user_registration_form_fields[condition_' + connectionId + '][' + counter + ']');
		
			$clone.find('div.urcl-operator').find('select.urcl-submit-field')
				.attr('name', 'user_registration_form_fields[condition_' + connectionId + '][' + counter + ']');

			// Update input element name attribute
			$clone.find('input.urcl-form-settings-field.urcl-submit-field')
				.attr('name', 'user_registration_form_value[condition_' + connectionId + '][' + counter + ']');
			
			// current.attr( 'data-last-key', counter );
			current.data('last-key', counter);


			if(current.find('.urcl-conditional-or-group').length) {
				$clone.addClass('urcl-conditional-or-group').removeClass('urcl-conditional-group')
			}

			// Insert the cloned element after the original element
			current.append($clone);
		},

		addOrCondtion: function(connectionId, self) {
			var $clone = $(URCLConditionalLogic.data.template).find('li.urcl-conditional-group').clone();

			$clone.find('.urcl-form-group select.urcl-field-conditional-field-select option:not(:first)').remove();
			$clone.find('.urcl-form-group select.urcl-field-conditional-field-select').append(URCLConditionalLogic.get_fields_list());
			
			$clone.find('li.urcl-conditional-group').addClass('urcl-conditional-or-group').removeClass('urcl-conditional-group');
		
			// Update select element name attribute
			$clone.find('select.urcl-field-conditional-field-select')
				.attr('name', 'user_registration_form_fields[condition_' + connectionId + '][1]');
		
			$clone.find('div.urcl-operator').find('select.urcl-submit-field')
				.attr('name', 'user_registration_form_fields[condition_' + connectionId + '][1]');

			// Update input element name attribute
			$clone.find('input.urcl-form-settings-field.urcl-submit-field')
				.attr('name', 'user_registration_form_value[condition_' + connectionId + '][1]');
		
			var $output = '<p class="urcl-or-label"> '+ urcl_params.or_text +' </p>';
		
			$output += '<ul class="urcl-form-settings-logic-box urcl-or-groups urcl-role-logic-box" data-group ="' +
				connectionId +
				'" data-last-key="1">';
			$output += '<li class="urcl-conditional-or-group" data-key="1">';
			$output += $clone.html(); // Append the HTML of the cloned element
			$output += "</li>";
			$output += "</ul>";
		
			self.before($output);
		},

		removeCondtion: function(self) {
			var currentUl = self.parents('ul.urcl-role-logic-box'),
				currentLi = self.parents('li'),
				wrapper   = self.parents('div.urcl-submit-logic-wrap');


			if(wrapper.find('li').length > 1 ) {
				if(currentUl.hasClass('urcl-or-groups') ) {
					if( currentUl.find('li').length === 1 ) {
						currentUl.prev('p.urcl-or-label').remove();
						currentUl.remove();
					} else if( currentUl.find('li').length === 2 && wrapper.find('li').length ===2 ) {
						currentUl.prev('p.urcl-or-label').remove();
						currentUl.removeClass('urcl-or-groups');
						currentLi.addClass('urcl-conditional-group').removeClass('urcl-conditional-or-group');
					} else {
						currentLi.remove();
					}
				} else {
					if( currentUl.find('li').length === 1 && wrapper.find('li').length === 2 ) {
						currentUl.remove();
						
						wrapper.find('ul.urcl-role-logic-box').prev('p.urcl-or-label').remove();
						wrapper.find('ul.urcl-role-logic-box').removeClass('urcl-or-groups');
						wrapper.find('ul.urcl-role-logic-box').find('li').addClass('urcl-conditional-group').removeClass('urcl-conditional-or-group');
					} else {
						currentLi.remove();
					}
				}
			}

			$allUl = wrapper.find( '.urcl-form-settings-logic-box' );

			if ($allUl.length && $allUl.first().prev().hasClass('urcl-or-label')) {
				$allUl.first().prev().remove();
				$allUl.find('.urcl-conditional-or-group').addClass('.urcl-conditional-group').removeClass('.urcl-conditional-or-group');
			}
		},

		addNewCondtion: function(self) {
			var $clone 		 = $(URCLConditionalLogic.data.template).clone(),
				connectionId = self.data('last-conditionid');

			var elementsWithDataGroup = $clone.find('[data-group]');

			// Update the value of the data-group attribute for each element
			elementsWithDataGroup.attr('data-group', connectionId);

			$clone.find('.urcl-form-group select.urcl-field-conditional-field-select option:not(:first)').remove();
			$clone.find('.urcl-form-group select.urcl-field-conditional-field-select').append(URCLConditionalLogic.get_fields_list());
			
			$clone.find('div.urcl-assign-role').find('select.urcl-form-settings-field urcl-submit-field')
				.attr('name', 'user_registration_form_conditional_user_role[condition_' + connectionId + ']');
		
			$clone.find('select.urcl-field-conditional-field-select')
				.attr('name', 'user_registration_form_fields[condition_' + connectionId + '][1]');
		
			$clone.find('div.urcl-operator').find('select.urcl-submit-field')
				.attr('name', 'user_registration_form_fields[condition_' + connectionId + '][1]');

			$clone.find('input.urcl-form-settings-field.urcl-submit-field')
				.attr('name', 'user_registration_form_value[condition_' + connectionId + '][1]')
				.val('');

			const newConnectionId = connectionId + 1;

			self.data('last-conditionid', newConnectionId);

			if(self.parents('.urcl-conditional-logic-container').find('.urcl-submit-conditional-container').find('.urcl-submit-logic-wrap').length === 1) {
				self.parents('.urcl-conditional-logic-container').find('.urcl-submit-conditional-container').find('.urcl-submit-logic-wrap').append('<button class="urcl-remove-condition"></button>');
			}

			self.prev('div.urcl-submit-conditional-container').append($clone);
		},

		removeNewCondtion: function(self) {
			var container   = self.parents('div.urcl-submit-conditional-container');

			if(container.find('.urcl-submit-logic-wrap').length > 1){
				self.parent('.urcl-submit-logic-wrap').remove();

				if(container.find('.urcl-submit-logic-wrap').length == 1) {
					container.find('.urcl-submit-logic-wrap').find('.urcl-remove-condition').remove();
				}
			}
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
		},

		replace_field_values: function(className, selectedOption) {
			let dataType = $("option:selected", selectedOption).attr("data-type");
			let selectedValue = $("option:selected", selectedOption).val();
			let inputNode = $(selectedOption).closest(className).find(".urcl-value").children().first();
		
			let nodeName = inputNode.attr("name");
			let nodeClass = inputNode.attr("class");
		
			if (["checkbox", "radio", "select", "country", "billing_country", "shipping_country", "select2", "multi_select2"].includes(dataType)) {
				let values = [];
				let options = "<option value>"+ urcl_params.select_option_placeholder +"</option>";
		
				if (["select", "select2", "multi_select2"].includes(dataType)) {
					values = $('.ur-selected-inputs .ur-selected-item .ur-general-setting-field-name input[value="' + selectedValue + '"]').closest(".ur-selected-item").find(".ur-field option").map(function () { return $(this).val() });
				} else if (["country", "billing_country", "shipping_country"].includes(dataType)) {
					let optionsHtml = [];
		
					$('.ur-general-setting-field-name input[value="' + selectedValue + '"]').closest(".ur-selected-item").find(".ur-advance-selected_countries select option:selected").each(function () {
						let countryIso = $(this).val();
						let countryName = $(this).text();
		
						optionsHtml.push('<option value="' + countryIso + '">' + countryName + '</option>');
					});
					options = optionsHtml.join("");
				} else {
					values = $('.ur-selected-inputs .ur-selected-item .ur-general-setting-field-name input[value="' + selectedValue + '"]').closest(".ur-selected-item").find(".ur-field input").map(function () { return $(this).val() });
				}
		
				if (values.length == 1 && values[0] === "") {
					options = '<option value="1">' + urcl_data.checkbox_checked + '</option>';
				} else {
					$(values).each(function (index, value) {
						options += '<option value="' + value + '">' + value + '</option>';
					});
				}
		
				inputNode.replaceWith('<select name="' + nodeName + '" class="' + nodeClass + '">' + options + '</select>');
			} else {
				inputNode.replaceWith('<input type="text" name="' + nodeName + '" class="' + nodeClass + '">');
			}
		},
    }

	URCLConditionalLogic.init();
})(jQuery);