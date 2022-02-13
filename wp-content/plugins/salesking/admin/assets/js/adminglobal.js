/**
*
* JavaScript file that has global action in the admin menu
*
*/
(function($){

	"use strict";

	$( document ).ready(function() {

		// Show Hide Color Scheme Settings
		colorschemeshowhide();

		$('input[name=salesking_change_color_scheme_setting]').change(function() {
			colorschemeshowhide();
		});

		function colorschemeshowhide(){
			let selectedValue = $('input[name=salesking_change_color_scheme_setting]').is(":checked");
			if(selectedValue === true) {
		      	$(".salesking_change_color_scheme_container").css("display","block");
		   	} else {
				$(".salesking_change_color_scheme_container").css("display","none");
			}
		}

		// Group movements
		$("body.post-type-salesking_group .wrap a.page-title-action").after('&nbsp;<a href="'+salesking.group_rules_link+'" class="page-title-action">'+salesking.group_rules_text+'</a>');

		/* Tools */

	    // On clicking set accounts as subaccounts
	    $('#salesking_set_accounts_as_subaccounts').on('click', function(){
	    	if (confirm(salesking.are_you_sure_set_subaccounts)){
				var datavar = {
		            action: 'saleskingbulksetsubaccounts',
		            security: salesking.security,
		            option_first: $('#salesking_set_user_subaccounts_first').val(),
		            option_second: $('#salesking_set_user_subaccounts_second').val(),
		        };

				$.post(ajaxurl, datavar, function(response){
					alert(salesking.subaccounts_have_been_set);
					location.reload();
				});
	    	}
	    });

        // On clicking set accounts as regular accounts
        $('#salesking_set_subaccounts_regular_button').on('click', function(){
        	if (confirm(salesking.are_you_sure_set_subaccounts_regular)){
    			var datavar = {
    	            action: 'saleskingbulksetsubaccountsregular',
    	            security: salesking.security,
    	            option_first: $('#salesking_set_subaccounts_regular_input').val(),
    	        };

    			$.post(ajaxurl, datavar, function(response){
    				alert(salesking.subaccounts_have_been_set);
    				location.reload();
    			});
        	}
        });

		/* Orders */
		// On Order commissions click
		$('.salesking_main_edit_icon').on('click', function(){
			var commissions_value = $('#salesking_main_commission_order_value').val();
			$('.salesking_main_commission_order').html('<input type="number" name="salesking_main_commission_order_value_edited" step="0.01" value="'+commissions_value+'"></input>');
			$(this).remove();
		});

		$('.salesking_edit_icon').on('click', function(){
			var agent_id = $(this).parent().find('.salesking_edit_icon_agent').val();
			var commissions_value = $(this).parent().parent().parent().find('.salesking_commission_order_value_'+agent_id).val();

			$(this).parent().parent().parent().find('.salesking_commission_order_'+agent_id).html('<input type="number" name="salesking_commission_order_value_edited_'+agent_id+'" step="0.01" value="'+commissions_value+'"></input>');
			$(this).remove();
		});

		/* Payouts */
		if (typeof $('#salesking_admin_payouts_table').DataTable === "function") { 
			$('#salesking_admin_payouts_table').DataTable();
		}
		if (typeof $('#salesking_payout_history_table').DataTable === "function") { 
			$('#salesking_payout_history_table').DataTable({
		        order: [[ 0, "desc" ]],
		    });
		}

		if (typeof $('#salesking_payout_history_table2').DataTable === "function") { 
			$('#salesking_payout_history_table2').DataTable({
		        order: [[ 0, "desc" ]],
		    });
		}

		/* Earnings */
		if (typeof $('#salesking_admin_earnings_table').DataTable === "function") { 
			$('#salesking_admin_earnings_table').DataTable();
		}


		// On clicking "Save Payment"
	    $('#salesking_save_payment').on('click', function(){
	    	var amount = $('#salesking_reimbursement_value').val();
	    	var method = $('#salesking_reimbursement_method').val();
	    	var note = $('#salesking_reimbursement_note').val();
	    	var uid = $('input[name=salesking_admin_user_id]').val();

	    	if (confirm(salesking.sure_save_payment)){
				var datavar = {
		            action: 'saleskingsavepayment',
		            security: salesking.security,
		            pamount: amount,
		            pmethod: method,
		            pnote: note,
		            userid: uid,
		            bonus: $('#salesking_bonus_payment').is(":checked"),
		        };

				$.post(ajaxurl, datavar, function(response){
					location.reload();
				});
	    	}
	    });

	    // Teams table

		/* Customers */
		//initialize admin customers table if function exists (we are in the Customers panel)
		if (typeof $('#salesking_admin_customers_table').DataTable === "function") { 
			$('#salesking_admin_customers_table').DataTable({
	            "language": {
				    "url": salesking.datatables_folder+salesking.tables_language_option+'.json'
				},
	        });
		}

	    // On clicking the "Add user button in the Product Category User Visibility table"
	    $("#salesking_category_add_user").on("click",function(){
	    	// Get username
	    	let username = $("#salesking_all_users_dropdown").children("option:selected").text();
	    	// Get content and check if username already exists
	    	let content = $("#salesking_category_users_textarea").val();
	    	let usersarray = content.split(',');
	    	let exists = 0;

	    	$.each( usersarray, function( i, val ) {
	    		if (val.trim() === username){
	    			exists = 1;
	    		}
	    	});

	    	if (exists === 1){
	    		// Show "Username already in the list" for 3 seconds
	    		$("#salesking_category_add_user").text(b2bking.username_already_list);
	    		setTimeout(function(){
	    			$("#salesking_category_add_user").text(b2bking.add_user);
	    		}, 2000);

	    	} else {
	    		// remove last comma and whitespace after
	    		content = content.replace(/,\s*$/, "");
	    		// if list is not empty, add comma
	    		if (content.length > 0){
	    			content = content + ', ';
	    		}
	    		// add username
	    		content = content + username;
	    		$("#salesking_category_users_textarea").val(content);
	    	}
	    });
		

		// Show Hide Custom Method Payment Settings
		custommethodshowhide();

		$('input[name=salesking_different_commission_price_increase_setting]').change(function() {
			custommethodshowhide();
		});

		function custommethodshowhide(){
			let selectedValue = $('input[name=salesking_different_commission_price_increase_setting]').is(":checked");
			if(selectedValue === true) {
		      	$("#salesking_custom_commission_container").css("display","block");
		   	} else {
				$("#salesking_custom_commission_container").css("display","none");
			}
		}

		// Show Hide Commission
		commissionshowhide();

		$('input[name=salesking_enable_custom_payouts_setting]').change(function() {
			commissionshowhide();
		});

		function commissionshowhide(){
			let selectedValue = $('input[name=salesking_enable_custom_payouts_setting]').is(":checked");
			if(selectedValue === true) {
		      	$("#salesking_custom_method_container").css("display","block");
		   	} else {
				$("#salesking_custom_method_container").css("display","none");
			}
		}

		// Customer or Agent group show hide
		agentcustomershowhide();
		$('input[type=radio][name="salesking_user_choice"]').change(function () {   
		    agentcustomershowhide();
		});
		function agentcustomershowhide(){
			let selectedValue = $('input[type=radio][name="salesking_user_choice"]:checked').val();
			if(selectedValue === "customer") {
		      	$(".salesking_agent_settings_agent").css("display","none");
		      	$(".salesking_agent_settings_customer").css("display","flex");
		   	} else if (selectedValue === "agent"){
				$(".salesking_agent_settings_agent").css("display","flex");
				$(".salesking_agent_settings_customer").css("display","none");
			}
		}

		// User profile sales agent group show/hide
		salesagentshowhide();

		$('#salesking_group').change(function() {
			salesagentshowhide();
		});

		function salesagentshowhide(){
			let selectedValue = $("#salesking_group").children("option:selected").val();
			if(selectedValue === "none") {
		      	$(".salesking_discount_percentage_column").css("display","none");
		   	} else {
				$(".salesking_discount_percentage_column").css("display","block");
			}
		}

		// In admin emails, modify email path for theme folder.
		if (($('#woocommerce_salesking_new_announcement_email_enabled').val() !== undefined)){
			var text = $('.template_html').html();
			var newtext = text.replace("/woocommerce/", "/");
			$('.template_html').html(newtext);
			$('.template_html p a:nth-child(2)').remove();
		}

				
		/* Conversations */
		// On load conversation, scroll to conversation end
		// if conversation exists
		if ($('#salesking_conversation_messages_container').length){
			$("#salesking_conversation_messages_container").scrollTop($("#salesking_conversation_messages_container")[0].scrollHeight);
		}

	
		/* Dynamic Rules */
		// On page load, before everything, set up conditions from hidden field to selectors
		setUpConditionsFromHidden();
		// update dynamic pricing rules
		updateDynamicRulesOptionsConditions();

		// Initialize Select2s
		$('#salesking_rule_select_who').select2();
		$('#salesking_rule_select_agents_who').select2();

		$('#salesking_rule_select_applies').select2();
		

		// initialize multiple products / categories selector as Select2
		$('.salesking_select_multiple_product_categories_selector_select, .salesking_select_multiple_users_selector_select').select2({'width':'100%', 'theme':'classic'});
		// show hide multiple products categories selector
		showHideMultipleProductsCategoriesSelector();
		$('#salesking_rule_select_what').change(showHideMultipleProductsCategoriesSelector);
		$('#salesking_rule_select_applies').change(showHideMultipleProductsCategoriesSelector);
		function showHideMultipleProductsCategoriesSelector(){
			let selectedValue = $('#salesking_rule_select_applies').val();
			let selectedWhat = $('#salesking_rule_select_what').val();
			if ( (selectedValue === 'multiple_options' && selectedWhat !== 'tax_exemption_user') || (selectedValue === 'excluding_multiple_options' && selectedWhat !== 'tax_exemption_user')){
				$('#salesking_select_multiple_product_categories_selector').css('display','block');
			} else {
				$('#salesking_select_multiple_product_categories_selector').css('display','none');
			}
		}

		showHideMultipleUsersSelector();
		$('#salesking_rule_select_who').change(showHideMultipleUsersSelector);
		function showHideMultipleUsersSelector(){
			let selectedValue = $('#salesking_rule_select_who').val();
			if (selectedValue === 'multiple_options'){
				$('#salesking_select_multiple_users_selector').css('display','block');
			} else {
				$('#salesking_select_multiple_users_selector').css('display','none');
			}
		}

		showHideMultipleAgentsSelector();
		$('#salesking_rule_select_agents_who').change(showHideMultipleAgentsSelector);
		function showHideMultipleAgentsSelector(){
			let selectedValue = $('#salesking_rule_select_agents_who').val();
			if (selectedValue === 'multiple_options'){
				$('#salesking_select_multiple_agents_selector').css('display','block');
			} else {
				$('#salesking_select_multiple_agents_selector').css('display','none');
			}
		}

		function setUpConditionsFromHidden(){
			// get all conditions
			let conditions = $('#salesking_rule_select_conditions').val();
			if (conditions === undefined) {
				conditions = '';
			}

			if(conditions.trim() !== ''){  
				let conditionsArray = conditions.split('|');
				let i=1;
				// foreach condition, create selectors
				conditionsArray.forEach(function(item){
					let conditionDetails = item.split(';');
					// if condition not empty
					if (conditionDetails[0] !== ''){
						$('.salesking_dynamic_rule_condition_name.salesking_condition_identifier_'+i).val(conditionDetails[0]);
						$('.salesking_dynamic_rule_condition_operator.salesking_condition_identifier_'+i).val(conditionDetails[1]);
						$('.salesking_dynamic_rule_condition_number.salesking_condition_identifier_'+i).val(conditionDetails[2]);
						addNewCondition(i, 'programatically');
						i++;
					}
				});
			}
		}

		// On clicking "add condition" in Dynamic rule
		$('body').on('click', '.salesking_dynamic_rule_condition_add_button', function(event) {
		    addNewCondition(1,'user');
		});

		function addNewCondition(buttonNumber = 1, type = 'user'){
			let currentNumber;
			let nextNumber;

			// If condition was added by user
			if (type === 'user'){
				// get its current number
				let classList = $('.salesking_dynamic_rule_condition_add_button').attr('class').split(/\s+/);
				$.each(classList, function(index, item) {
				    if (item.includes('identifier')) {
				    	var itemArray = item.split("_");
				    	currentNumber = parseInt(itemArray[3]);
				    }
				});
				// set next number
				nextNumber = (currentNumber+1);
			} else {
				// If condition was added at page load automatically
				currentNumber = buttonNumber;
				nextNumber = currentNumber+1;
			}

			// add delete button same condition
			$('.salesking_dynamic_rule_condition_add_button.salesking_condition_identifier_'+currentNumber).after('<button type="button" class="salesking_dynamic_rule_condition_delete_button salesking_condition_identifier_'+currentNumber+'">'+salesking.delete+'</button>');
			// add next condition
			$('#salesking_condition_number_'+currentNumber).after('<div id="salesking_condition_number_'+nextNumber+'" class="salesking_rule_condition_container">'+
				'<select class="salesking_dynamic_rule_condition_name salesking_condition_identifier_'+nextNumber+'">'+
					'<option value="cart_total_quantity" selected="selected">'+salesking.cart_total_quantity+'</option>'+
					'<option value="cart_total_value">'+salesking.cart_total_value+'</option>'+
					'<option value="category_product_quantity">'+salesking.category_product_quantity+'</option>'+
					'<option value="category_product_value">'+salesking.category_product_value+'</option>'+
					'<option value="product_quantity">'+salesking.product_quantity+'</option>'+
					'<option value="product_value">'+salesking.product_value+'</option>'+
				'</select>'+
				'<select class="salesking_dynamic_rule_condition_operator salesking_condition_identifier_'+nextNumber+'">'+
					'<option value="greater">'+salesking.greater+'</option>'+
					'<option value="equal">'+salesking.equal+'</option>'+
					'<option value="smaller">'+salesking.smaller+'</option>'+
				'</select>'+
				'<input type="number" step="0.00001" class="salesking_dynamic_rule_condition_number salesking_condition_identifier_'+nextNumber+'" placeholder="'+salesking.enter_quantity_value+'">'+
				'<button type="button" class="salesking_dynamic_rule_condition_add_button salesking_condition_identifier_'+nextNumber+'">'+salesking.add_condition+'</button>'+
			'</div>');

			// remove self 
			$('.salesking_dynamic_rule_condition_add_button.salesking_condition_identifier_'+currentNumber).remove();

			// update available options
			updateDynamicRulesOptionsConditions();
		}

		// On clicking "delete condition" in Dynamic rule
		$('body').on('click', '.salesking_dynamic_rule_condition_delete_button', function () {
			// get its current number
			let currentNumber;
			let classList = $(this).attr('class').split(/\s+/);
			$.each(classList, function(index, item) {
			    if (item.includes('identifier')) {
			    	var itemArray = item.split("_");
			    	currentNumber = parseInt(itemArray[3]);
			    }
			});
			// remove current element
			$('#salesking_condition_number_'+currentNumber).remove();

			// update conditions hidden field
			updateConditionsHiddenField();
		});

		// On Rule selector change, update dynamic rule conditions
		$('#salesking_rule_select_what, #salesking_rule_select_who, #salesking_rule_select_orders, #salesking_rule_select_agents_who, #salesking_rule_select_applies, #salesking_rule_select, #salesking_rule_select_showtax, #salesking_container_tax_shipping').change(function() {
			updateDynamicRulesOptionsConditions();
		});

		function updateDynamicRulesOptionsConditions(){
			$('#salesking_rule_select_applies_replaced_container').css('display','none');
			// Hide one-time fee
			$('#salesking_one_time').css('display','none');
			// Hide all condition options
			$('.salesking_dynamic_rule_condition_name option').css('display','none');
			// Hide quantity/value
			$('#salesking_container_quantity_value').css('display','none');
			// Hide currency
			$('#salesking_container_currency').css('display','none');
			// Hide payment methods
			$('#salesking_container_paymentmethods, #salesking_container_paymentmethods_minmax, #salesking_container_paymentmethods_percentamount').css('display','none');
			// Hide countries and requires
			$('#salesking_container_countries, #salesking_container_requires, #salesking_container_showtax').css('display','none');
			// Hide tax name
			$('#salesking_container_taxname, #salesking_container_tax_shipping, #salesking_container_tax_shipping_rate').css('display','none');
			// Hide discount checkbox
			$('.salesking_dynamic_rule_discount_show_everywhere_checkbox_container, .salesking_discount_options_information_box').css('display','none');
			$('#salesking_container_discountname').css('display','none');
			$('.salesking_rule_label_discount').css('display','none');
			$("#salesking_container_x").css('display','none');

			// conditions box text
			$('#salesking_rule_conditions_information_box_text').text(salesking.conditions_apply_cumulatively);

			// Show all options
			$("#salesking_container_howmuch").css('display','inline-block');
			$('#salesking_container_applies').css('display','inline-block');
			// Show conditions + conditions info box
			$('#salesking_rule_select_conditions_container').css('display','inline-block');
			$('.salesking_rule_conditions_information_box').css('display','flex');

			let selectedWhat = $("#salesking_rule_select_what").val();
			let selectedApplies = $("#salesking_rule_select_applies").val();
			let selectedOrders = $('#salesking_rule_select_orders').val();

			if (selectedOrders !== 'all' && selectedOrders !== 'all_agent' && selectedOrders !== 'all_earnings'){
				$("#salesking_container_x").css('display','inline-block');
			}


			// Select Discount Amount or Percentage
			if (selectedWhat === 'discount_amount' || selectedWhat === 'discount_percentage'){
				// if select Cart: cart_total_quantity and cart_total_value
				if (selectedApplies === 'cart_total' || selectedApplies === 'excluding_multiple_options'){
					$('.salesking_dynamic_rule_condition_name option[value=cart_total_quantity], .salesking_dynamic_rule_condition_name option[value=cart_total_value]').css('display','block');
				} else if (selectedApplies.startsWith("category")){
				// if select Category also have: category_product_quantity and category_product_value
					$('.salesking_dynamic_rule_condition_name option[value=cart_total_quantity], .salesking_dynamic_rule_condition_name option[value=cart_total_value], .salesking_dynamic_rule_condition_name option[value=category_product_quantity], .salesking_dynamic_rule_condition_name option[value=category_product_value]').css('display','block');
				} else if (selectedApplies.startsWith("product")){
				// if select Product also have: product_quantity and product_value  
					$('.salesking_dynamic_rule_condition_name option[value=cart_total_quantity], .salesking_dynamic_rule_condition_name option[value=cart_total_value], .salesking_dynamic_rule_condition_name option[value=product_quantity], .salesking_dynamic_rule_condition_name option[value=product_value]').css('display','block');
				} else if (selectedApplies === 'multiple_options' || selectedApplies === 'excluding_multiple_options' || selectedApplies === 'replace_ids'){
					$('.salesking_dynamic_rule_condition_name option').css('display','block');
					// conditions box text
					$('#salesking_rule_conditions_information_box_text').text(salesking.conditions_multiselect);
				}
				// Show discount everywhere checkbox
				$('.salesking_dynamic_rule_discount_show_everywhere_checkbox_container, .salesking_discount_options_information_box').css('display','flex');
				$('.salesking_rule_label_discount').css('display','block');
				$('#salesking_container_discountname').css('display','inline-block');
			} else if (selectedWhat === 'fixed_price'){
				if (selectedApplies === 'cart_total'){
					$('.salesking_dynamic_rule_condition_name option[value=cart_total_quantity], .salesking_dynamic_rule_condition_name option[value=cart_total_value]').css('display','block');
				} else if (selectedApplies.startsWith("category")){
					$('.salesking_dynamic_rule_condition_name option[value=cart_total_quantity], .salesking_dynamic_rule_condition_name option[value=category_product_quantity]').css('display','block');
				} else if (selectedApplies.startsWith("product")){
					$('.salesking_dynamic_rule_condition_name option[value=cart_total_quantity], .salesking_dynamic_rule_condition_name option[value=product_quantity]').css('display','block');
				} else if (selectedApplies === 'multiple_options' || selectedApplies === 'replace_ids'){
					$('.salesking_dynamic_rule_condition_name option[value=cart_total_quantity], .salesking_dynamic_rule_condition_name option[value=category_product_quantity], .salesking_dynamic_rule_condition_name option[value=product_quantity]').css('display','block');
					$('#salesking_rule_conditions_information_box_text').text(salesking.conditions_multiselect);
				}
			} else if (selectedWhat === 'free_shipping'){
				// How much does not apply - hide
				$('#salesking_container_howmuch').css('display','none');
				// if select Cart: cart_total_quantity and cart_total_value
				if (selectedApplies === 'cart_total'){
					$('.salesking_dynamic_rule_condition_name option[value=cart_total_quantity], .salesking_dynamic_rule_condition_name option[value=cart_total_value]').css('display','block');
				} else if (selectedApplies.startsWith("category")){
				// if select Category also have: category_product_quantity and category_product_value
					$('.salesking_dynamic_rule_condition_name option[value=cart_total_quantity], .salesking_dynamic_rule_condition_name option[value=cart_total_value], .salesking_dynamic_rule_condition_name option[value=category_product_quantity], .salesking_dynamic_rule_condition_name option[value=category_product_value]').css('display','block');
				} else if (selectedApplies.startsWith("product")){
				// if select Product also have: product_quantity and product_value 
					$('.salesking_dynamic_rule_condition_name option[value=cart_total_quantity], .salesking_dynamic_rule_condition_name option[value=cart_total_value], .salesking_dynamic_rule_condition_name option[value=product_quantity], .salesking_dynamic_rule_condition_name option[value=product_value]').css('display','block'); 
				} else if (selectedApplies === 'multiple_options' || selectedApplies === 'replace_ids'){
					$('.salesking_dynamic_rule_condition_name option').css('display','block');
					$('#salesking_rule_conditions_information_box_text').text(salesking.conditions_multiselect);
				}
			} else if (selectedWhat === 'hidden_price'){
				// How much does not apply - hide
				$('#salesking_container_howmuch').css('display','none');
				// hide Conditions input and available conditions text
				$('#salesking_rule_select_conditions_container').css('display','none');
				$('.salesking_rule_conditions_information_box').css('display','none');

			} else if (selectedWhat === 'required_multiple'){

				// if select Cart: cart_total_quantity and cart_total_value
				if (selectedApplies === 'cart_total'){
					$('.salesking_dynamic_rule_condition_name option[value=cart_total_quantity], .salesking_dynamic_rule_condition_name option[value=cart_total_value]').css('display','block');
				} else if (selectedApplies.startsWith("category")){
				// if select Category also have: category_product_quantity and category_product_value
					$('.salesking_dynamic_rule_condition_name option[value=cart_total_quantity], .salesking_dynamic_rule_condition_name option[value=cart_total_value], .salesking_dynamic_rule_condition_name option[value=category_product_quantity], .salesking_dynamic_rule_condition_name option[value=category_product_value]').css('display','block');
				} else if (selectedApplies.startsWith("product")){
				// if select Product also have: product_quantity and product_value  
					$('.salesking_dynamic_rule_condition_name option[value=cart_total_quantity], .salesking_dynamic_rule_condition_name option[value=cart_total_value], .salesking_dynamic_rule_condition_name option[value=product_quantity], .salesking_dynamic_rule_condition_name option[value=product_value]').css('display','block');
				} else if (selectedApplies === 'multiple_options' || selectedApplies === 'replace_ids'){
					$('.salesking_dynamic_rule_condition_name option').css('display','block');
					$('#salesking_rule_conditions_information_box_text').text(salesking.conditions_multiselect);
				}

			} else if (selectedWhat === 'minimum_order' || selectedWhat === 'maximum_order' ) {
				// show Quantity/value
				$('#salesking_container_quantity_value').css('display','inline-block');
				// hide Conditions input and available conditions text
				$('#salesking_rule_select_conditions_container').css('display','none');
				$('.salesking_rule_conditions_information_box').css('display','none');
			} else if (selectedWhat === 'tax_exemption' ) {
				// How much does not apply - hide
				$('#salesking_container_howmuch').css('display','none');
				// show countries and requires
				$('#salesking_container_countries, #salesking_container_requires').css('display','inline-block');
				// hide Conditions input and available conditions text
				$('#salesking_rule_select_conditions_container').css('display','none');
				$('.salesking_rule_conditions_information_box').css('display','none');
			} else if (selectedWhat === 'tax_exemption_user' ) {
				// How much does not apply - hide
				$('#salesking_container_howmuch').css('display','none');
				// Applies does not apply - hide
				$('#salesking_container_applies').css('display','none');
				// show countries and requires
				$('#salesking_container_countries, #salesking_container_requires, #salesking_container_showtax').css('display','inline-block');
				if ($('#salesking_rule_select_showtax').val() === 'display_only'){
					$('#salesking_container_tax_shipping').css('display','inline-block');
					if ($('#salesking_rule_select_tax_shipping').val() === 'yes'){
						$('#salesking_container_tax_shipping_rate').css('display', 'inline-block');
					}
				}
				// hide Conditions input and available conditions text
				$('#salesking_rule_select_conditions_container').css('display','none');
				$('.salesking_rule_conditions_information_box').css('display','none');
			} else if (selectedWhat === 'add_tax_amount' || selectedWhat === 'add_tax_percentage' ) {
				// show one time
				$('#salesking_one_time').css('display','inline-block');
				// show tax name
				$('#salesking_container_taxname').css('display','inline-block');
				if (selectedApplies === 'one_time' && selectedWhat === 'add_tax_percentage'){
					$('#salesking_container_tax_shipping').css('display','inline-block');
				}
				// if select Cart: cart_total_quantity and cart_total_value
				if (selectedApplies === 'cart_total' || selectedApplies === 'one_time'){
					$('.salesking_dynamic_rule_condition_name option[value=cart_total_quantity], .salesking_dynamic_rule_condition_name option[value=cart_total_value]').css('display','block');
				} else if (selectedApplies.startsWith("category")){
				// if select Category also have: category_product_quantity and category_product_value
					$('.salesking_dynamic_rule_condition_name option[value=cart_total_quantity], .salesking_dynamic_rule_condition_name option[value=cart_total_value], .salesking_dynamic_rule_condition_name option[value=category_product_quantity], .salesking_dynamic_rule_condition_name option[value=category_product_value]').css('display','block');
				} else if (selectedApplies.startsWith("product")){
				// if select Product also have: product_quantity and product_value  
					$('.salesking_dynamic_rule_condition_name option[value=cart_total_quantity], .salesking_dynamic_rule_condition_name option[value=cart_total_value], .salesking_dynamic_rule_condition_name option[value=product_quantity], .salesking_dynamic_rule_condition_name option[value=product_value]').css('display','block');
				} else if (selectedApplies === 'multiple_options' || selectedApplies === 'replace_ids'){
					$('.salesking_dynamic_rule_condition_name option').css('display','block');
					$('#salesking_rule_conditions_information_box_text').text(salesking.conditions_multiselect);
				}
			} else if (selectedWhat === 'replace_prices_quote'){
				// How much does not apply - hide
				$('#salesking_container_howmuch, #salesking_container_applies').css('display','none');
				// hide Conditions input and available conditions text
				$('#salesking_rule_select_conditions_container').css('display','none');
				$('.salesking_rule_conditions_information_box').css('display','none');
			} else if (selectedWhat === 'rename_purchase_order'){
				// How much does not apply - hide
				$('#salesking_container_howmuch, #salesking_container_applies').css('display','none');
				// hide Conditions input and available conditions text
				$('#salesking_rule_select_conditions_container').css('display','none');
				$('.salesking_rule_conditions_information_box').css('display','none');
				$('#salesking_container_taxname').css('display','inline-block');
			} else if (selectedWhat === 'set_currency_symbol'){
				// How much does not apply - hide
				$('#salesking_container_howmuch, #salesking_container_applies').css('display','none');
				// hide Conditions input and available conditions text
				$('#salesking_rule_select_conditions_container').css('display','none');
				$('.salesking_rule_conditions_information_box').css('display','none');
				$('#salesking_container_currency').css('display','inline-block');
			} else if (selectedWhat === 'payment_method_minmax_order'){
				// How much does not apply - hide
				$('#salesking_container_applies').css('display','none');
				// hide Conditions input and available conditions text
				$('#salesking_rule_select_conditions_container').css('display','none');
				$('.salesking_rule_conditions_information_box').css('display','none');
				$('#salesking_container_paymentmethods, #salesking_container_paymentmethods_minmax').css('display','inline-block');
			}  else if (selectedWhat === 'payment_method_discount'){
				// How much does not apply - hide
				$('#salesking_container_applies').css('display','none');
				// hide Conditions input and available conditions text
				$('#salesking_rule_select_conditions_container').css('display','none');
				$('.salesking_rule_conditions_information_box').css('display','none');
				$('#salesking_container_paymentmethods, #salesking_container_paymentmethods_percentamount').css('display','inline-block');
			}  else if (selectedWhat === 'bogo_discount'){
				$('.salesking_dynamic_rule_condition_name option[value=cart_total_quantity], .salesking_dynamic_rule_condition_name option[value=cart_total_value], .salesking_dynamic_rule_condition_name option[value=category_product_quantity], .salesking_dynamic_rule_condition_name option[value=category_product_value]').css('display','block');
				$('.salesking_dynamic_rule_condition_name option[value=product_quantity], .salesking_dynamic_rule_condition_name option[value=product_value]').css('display','block');

			}

			if (selectedApplies === 'replace_ids' && selectedWhat !== 'tax_exemption_user'){
				$('#salesking_rule_select_applies_replaced_container').css('display','block');
			}


			if (selectedOrders === 'all_earnings' || selectedOrders === 'reach_x_number' || selectedOrders === 'first_x_earnings' || selectedOrders === 'first_x_days'){
				$('#salesking_container_applies, #salesking_container_forcustomers, #salesking_select_multiple_product_categories_selector, #salesking_select_multiple_users_selector').css('display','none');
			} else {
				$('#salesking_container_applies, #salesking_container_forcustomers').css('display','inline-block');
				if (selectedApplies === 'multiple_options'){
					$('#salesking_select_multiple_product_categories_selector').css('display','block');
				}
				if ($('#salesking_rule_select_who').val() === 'multiple_options'){
					$('#salesking_select_multiple_users_selector').css('display','block');
				}
			}

			// Check all conditions. If selected condition what is display none, change to Cart Total Quantity (available for all)
			$(".salesking_dynamic_rule_condition_name").each(function (i) {
				let selected = $(this).val();
				let selectedOption = $(this).find("option[value="+selected+"]");
				if (selectedOption.css('display')==='none'){
					$(this).val('cart_total_quantity');
				}
			});

			// Update Conditions
			updateConditionsHiddenField();
		}

		// On condition text change, update conditions hidden field
		$('body').on('input', '.salesking_dynamic_rule_condition_number, .salesking_dynamic_rule_condition_operator, .salesking_dynamic_rule_condition_name', function () {
			updateConditionsHiddenField();
		});

		function updateConditionsHiddenField(){
			// Clear condtions field
			$('#salesking_rule_select_conditions').val('');
			// For each condition, if not empty, add to field
			let conditions = '';

			$(".salesking_dynamic_rule_condition_name").each(function (i) {
				// get its current number
				let currentNumber;
				let classList = $(this).attr('class').split(/\s+/);
				$.each(classList, function(index, item) {
				    if (item.includes('identifier')) {
				    	var itemArray = item.split("_");
				    	currentNumber = parseInt(itemArray[3]);
				    }
				});

				let numberField = $(".salesking_dynamic_rule_condition_number.salesking_condition_identifier_"+currentNumber).val();
				if (numberField === undefined){
					numberField = '';
				}

				if (numberField.trim() !== ''){
					conditions+=$(this).val()+';';
					conditions+=$(".salesking_dynamic_rule_condition_operator.salesking_condition_identifier_"+currentNumber).val()+';';
					conditions+=$(".salesking_dynamic_rule_condition_number.salesking_condition_identifier_"+currentNumber).val()+'|';
				}
			});
			// remove last character
			conditions = conditions.substring(0, conditions.length - 1);
			$('#salesking_rule_select_conditions').val(conditions);
		}

		
		/* REGISTRATION FIELD */
	
		// show hide Registration Role Automatic Approval - show only if automatic approval is selected
		showHideAutomaticApprovalGroup();
		$('.salesking_custom_role_settings_metabox_container_element_select').change(showHideAutomaticApprovalGroup);
		function showHideAutomaticApprovalGroup(){
			let selectedValue = $('.salesking_custom_role_settings_metabox_container_element_select').val();
			if (selectedValue === 'automatic'){
				$('.salesking_automatic_approval_customer_group_container').css('display','block');
			} else {
				$('.salesking_automatic_approval_customer_group_container').css('display','none');
			}
		}

		// show hide multiple roles selector
		showHideMultipleRolesSelector();
		$('.salesking_custom_field_settings_metabox_top_column_registration_role_select').change(showHideMultipleRolesSelector);
		function showHideMultipleRolesSelector(){
			let selectedValue = $('.salesking_custom_field_settings_metabox_top_column_registration_role_select').val();
			if (selectedValue === 'multipleroles'){
				$('#salesking_select_multiple_roles_selector').css('display','block');
			} else {
				$('#salesking_select_multiple_roles_selector').css('display','none');
			}
		}

 
	});

})(jQuery);