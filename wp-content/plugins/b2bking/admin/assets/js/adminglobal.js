/**
*
* JavaScript file that has global action in the admin menu
*
*/
(function($){

	"use strict";

	$( document ).ready(function() {

		// separate stock variable
	//	quantityseparatestockvariable();
		$('body').on('change', '.b2bking_separate_stock select', quantityseparatestockvariable);
	//	$('.inventory_tab').on('click', quantityseparatestockvariable);

		function quantityseparatestockvariable(){
			
			let val = $(this).val();
			let id = $(this).attr('id');
			let fieldnr = id.split('_')[3];

			if (val === 'yes'){
				$('.variable_stock_b2b_'+fieldnr+'_field').css('display','block');
				$('.variable_stock_b2b_'+fieldnr+'_field').removeClass('b2bking_hidden_wrapper');

			} else if (val === 'no'){
				$('.variable_stock_b2b_'+fieldnr+'_field').css('display','none');
			}

		}

		// separate stock simple
		quantityseparatestocksimple();
		$('#_separate_stock_quantities_b2b').on('change', quantityseparatestocksimple);
		$('.inventory_tab').on('click', quantityseparatestocksimple);

		function quantityseparatestocksimple(){
			
			let val = $('#_separate_stock_quantities_b2b').val();
			if (val === 'yes'){
				$('._stock_b2b_field').css('display','block');
			} else if (val === 'no'){
				$('._stock_b2b_field').css('display','none');
			}

		}


		// clear caches
		$('#b2bking_clear_caches_button').on('click', function(){
			var datavar = {
	            action: 'b2bkingclearcaches',
	            security: b2bking.security,
	        };
	        
			$.post(ajaxurl, datavar, function(response){
				alert(b2bking.caches_have_cleared);
			});

		});

		// Group movements
		setTimeout(function(){
			$("body.post-type-b2bking_group .wrap a.page-title-action").after('&nbsp;<a href="'+b2bking.group_rules_link+'" class="page-title-action">'+b2bking.group_rules_text+'</a>');
		}, 150);

		// Quote fields
		$("body.post-type-b2bking_quote_field .wrap a.page-title-action").after('&nbsp;<a href="'+b2bking.quote_fields_link+'" class="page-title-action">'+b2bking.view_quote_fields+'</a>');

		// In admin emails, modify email path for theme folder.
		if (($('#woocommerce_b2bking_new_customer_email_enabled').val() !== undefined)||($('#woocommerce_b2bking_your_account_approved_email_enabled').val() !== undefined)||($('#woocommerce_b2bking_new_customer_requires_approval_email_enabled').val() !== undefined)||($('#woocommerce_b2bking_new_message_email_enabled').val() !== undefined)){
			var text = $('.template_html').html();
			var newtext = text.replace("/woocommerce/", "/");
			$('.template_html').html(newtext);
			$('.template_html p a:nth-child(2)').remove();
			$('.template_html a').remove();
		}

		/* Special Groups: B2C Users and Guests - Payment and Shipping Methods */
		$('.b2bking_b2c_special_group_container_save_settings_button').on('click', function(){
			var datavar = {
	            action: 'b2bking_b2c_special_group_save_settings',
	            security: b2bking.security,
	        };

    		$("input:checkbox").each(function(){
    			let name = $(this).attr('name');
    			if ($(this).is(':checked')){
    				datavar[name] = 1;
    			} else {
    				datavar[name] = 0;
    			}
            });
	        
			$.post(ajaxurl, datavar, function(response){
				location.reload();
			});

		});

		$('.b2bking_email_offer_button').on('click', function(){
			if (confirm(b2bking.email_offer_confirm)){

				var datavar = {
		            action: 'b2bkingemailoffer',
		            security: b2bking.security,
		            offerid: $('#post_ID').val(),
		            offerlink: b2bking.offers_endpoint_link,
		        };

				$.post(ajaxurl, datavar, function(response){
					alert(b2bking.email_has_been_sent);
				});

				
			}
		});

		$('.b2bking_make_offer').on('click', function(){
			
			window.location = b2bking.new_offer_link+'&quote='+$('#post_ID').val();

		});

		

		// download offer
		$('.b2bking_download_offer_button').on('click', function(){

			var logoimg = b2bking.offers_logo;

			var imgToExport = document.getElementById('b2bking_img_logo');
			var canvas = document.createElement('canvas');
	        canvas.width = imgToExport.width; 
	        canvas.height = imgToExport.height; 
	        canvas.getContext('2d').drawImage(imgToExport, 0, 0);
	  		var dataURL = canvas.toDataURL("image/png"); 

	  		// get all thumbnails 
	  		var thumbnails = [];
	  		var thumbnr = 0;
	  		if (parseInt(b2bking.offers_images_setting) === 1){
		  		// get field;
		  		let field = $('#b2bking_offers_thumbnails_str').val();
		  		let itemsArray = field.split('|');
		  		// foreach condition, add condition, add new item
		  		itemsArray.forEach(function(item){
		  			if (item !== 'no'){
		  				var idimg = 'b2bking_img_logo'+thumbnr;
  						var imgToExport = document.getElementById(idimg);
  						var canvas = document.createElement('canvas');
  				        canvas.width = imgToExport.width; 
  				        canvas.height = imgToExport.height; 
  				        canvas.getContext('2d').drawImage(imgToExport, 0, 0);
  				  		let datau = canvas.toDataURL("image/png"); 
  				  		thumbnr++;
  				  		thumbnails.push(datau);
		  			} else {
		  				thumbnails.push('no');
		  			}
		  		});
		  	}

		  	var names = $('#b2bking_offers_names_str').val();
		  	let namesArray = names.split('*|||*');
		  	var namenr=0;

		  	thumbnr = 0;
			var customtext = jQuery('#b2bking_offer_customtext_textarea').val();
			var customtexttitle = b2bking.offer_custom_text;
			if (customtext.length === 0){
				customtexttitle = '';
			}

			var bodyarray = [];
			bodyarray.push([{ text: b2bking.item_name, style: 'tableHeader', margin: [7, 7, 7, 7] }, { text: b2bking.item_quantity, style: 'tableHeader', margin: [7, 7, 7, 7] }, { text: b2bking.unit_price, style: 'tableHeader', margin: [7, 7, 7, 7] }, { text: b2bking.item_subtotal, style: 'tableHeader', margin: [7, 7, 7, 7] }]);

			// get values
			jQuery('.b2bking_offer_line_number').each(function(i){
				let tempvalues = [];

				// let namevalue = jQuery(this).find('.b2bking_offer_item_name option:selected').text();
				let namevalue = namesArray[namenr];
				namenr++;

				if (parseInt(b2bking.offers_images_setting) === 1){
					if (thumbnails[thumbnr] !== 'no'){
						// add name + images
						tempvalues.push([{ text: namevalue, margin: [7, 7, 7, 7] },{
								image: thumbnails[thumbnr],
								width: 40,
								margin: [15, 5, 5, 5]
							}]);
					} else {
						// add name only
						tempvalues.push({ text: namevalue, margin: [7, 7, 7, 7] });
					}
					thumbnr++;
				} else {
					// add name only
					tempvalues.push({ text: namevalue, margin: [7, 7, 7, 7] });
				}


				tempvalues.push({ text: jQuery(this).find('.b2bking_offer_item_quantity').val(), margin: [7, 7, 7, 7] });
				tempvalues.push({ text: jQuery(this).find('.b2bking_offer_item_price').val(), margin: [7, 7, 7, 7] });
				tempvalues.push({ text: jQuery(this).find('.b2bking_item_subtotal').text(), margin: [7, 7, 7, 7] });
				bodyarray.push(tempvalues);
			});


			bodyarray.push(['','',{ text: b2bking.offer_total+': ', margin: [7, 7, 7, 7], bold: true },{ text: jQuery('#b2bking_offer_total_text_number').text(), margin: [7, 7, 7, 7], bold: true }]);

			let imgobj = {
						image: dataURL,
						width: 150,
						margin: [0, 0, 0, 30],
					};


			var contentarray =[
					{ text: b2bking.offer_details, fontSize: 14, bold: true, margin: [0, 20, 0, 20] },
					{
						style: 'tableExample',
						table: {
							headerRows: 1,
							widths: ['*', '*', '*', '*'],
							body: bodyarray,
						},
						layout: 'lightHorizontalLines'
					},
					{ text: b2bking.offer_go_to, link: b2bking.offers_endpoint_link, decoration: 'underline', fontSize: 13, bold: true, margin: [0, 20, 40, 8], alignment:'right' },
					{ text: customtexttitle, fontSize: 14, bold: true, margin: [0, 50, 0, 8] },
					{ text: customtext, fontSize: 12, bold: false, margin: [0, 8, 0, 8] },

					
				];

			if (logoimg.length !== 0){
				contentarray.unshift(imgobj);
			}


			var docDefinition = {
				content: contentarray
			};

			if(b2bking.pdf_download_lang === 'thai'){

				pdfMake.fonts = {
				  THSarabunNew: {
				    normal: 'THSarabunNew.ttf',
				    bold: 'THSarabunNew-Bold.ttf',
				    italics: 'THSarabunNew-Italic.ttf',
				    bolditalics: 'THSarabunNew-BoldItalic.ttf'
				  }
				};

				docDefinition = {
				  content: contentarray,
				  defaultStyle: {
				    font: 'THSarabunNew'
				  }
				}
			}


			pdfMake.createPdf(docDefinition).download('offer.pdf');

		});

		$('.b2bking_logged_out_special_group_container_save_settings_button').on('click', function(){
			var datavar = {
	            action: 'b2bking_logged_out_special_group_save_settings',
	            security: b2bking.security,
	        };

    		$("input:checkbox").each(function(){
    			let name = $(this).attr('name');
    			if ($(this).is(':checked')){
    				datavar[name] = 1;
    			} else {
    				datavar[name] = 0;
    			}
            });
	        
			$.post(ajaxurl, datavar, function(response){
				location.reload();
			});

		});

		/* Customers */
		//initialize admin customers table if function exists (we are in the Customers panel)
		if (typeof $('#b2bking_admin_customers_table').DataTable === "function") { 
			if (parseInt(b2bking.b2bking_customers_panel_ajax_setting) !== 1){
				$('#b2bking_admin_customers_table').DataTable({
		            "language": {
		                "url": b2bking.datatables_folder+b2bking.purchase_lists_language_option+'.json'
		            }
		        });
			} else {
	       		$('#b2bking_admin_customers_table').DataTable({
	       			"language": {
	       			    "url": b2bking.datatables_folder+b2bking.purchase_lists_language_option+'.json'
	       			},
	       			"processing": true,
	       			"serverSide": true,
	       			"info": false,
	       		    "ajax": {
	       		   		"url": ajaxurl,
	       		   		"type": "POST",
	       		   		"data":{
	       		   			action: 'b2bking_admin_customers_ajax',
	       		   			security: b2bking.security,
	       		   		}
	       		   	},

	            });
			}
		}

		/* Conversations */
		// On load conversation, scroll to conversation end
		// if conversation exists
		if ($('#b2bking_conversation_messages_container').length){
			$("#b2bking_conversation_messages_container").scrollTop($("#b2bking_conversation_messages_container")[0].scrollHeight);
		}

		/* Product Category Visibility */
		// On clicking the "Add user button in the Product Category User Visibility table"
		$("#b2bking_category_add_user").on("click",function(){
			// Get username
			let username = $("#b2bking_all_users_dropdown").children("option:selected").text();
			// Get content and check if username already exists
			let content = $("#b2bking_category_users_textarea").val();
			let usersarray = content.split(',');
			let exists = 0;

			$.each( usersarray, function( i, val ) {
				if (val.trim() === username){
					exists = 1;
				}
			});

			if (exists === 1){
				// Show "Username already in the list" for 3 seconds
				$("#b2bking_category_add_user").text(b2bking.username_already_list);
				setTimeout(function(){
					$("#b2bking_category_add_user").text(b2bking.add_user);
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
				$("#b2bking_category_users_textarea").val(content);
			}
		});

		/* Product Visibility */
		// On page load, update product visibility options
		updateProductVisibilityOptions();

		// On Product Visibility option change, update product visibility options 
		$('#b2bking_product_visibility_override').change(function() {
			updateProductVisibilityOptions();
		});

		// Checks the selected Product Visibility option and hides or shows Automatic / Manual visibility options
		function updateProductVisibilityOptions(){
			let selectedValue = $("#b2bking_product_visibility_override").children("option:selected").val();
			if(selectedValue === "manual") {
		      	$("#b2bking_metabox_product_categories_wrapper").css("display","none");
		      	$("#b2bking_product_visibility_override_options_wrapper").css("display","block");
		   	} else if (selectedValue === "default"){
				$("#b2bking_product_visibility_override_options_wrapper").css("display","none");
				$("#b2bking_metabox_product_categories_wrapper").css("display","block");
			}
		}


		/* Dynamic Rules */
		// On page load, before everything, set up conditions from hidden field to selectors
		setUpConditionsFromHidden();
		// update dynamic pricing rules
		updateDynamicRulesOptionsConditions();

		// Initialize Select2s
		$('.post-type-b2bking_rule #b2bking_rule_select_who').select2();
		$('.post-type-b2bking_rule #b2bking_rule_select_applies').select2();

		showHideMultipleAgentsSelector();
		$('#b2bking_rule_select_agents_who').change(showHideMultipleAgentsSelector);
		function showHideMultipleAgentsSelector(){
			let selectedValue = $('#b2bking_rule_select_agents_who').val();
			if (selectedValue === 'multiple_options'){
				$('#b2bking_select_multiple_agents_selector').css('display','block');
			} else {
				$('#b2bking_select_multiple_agents_selector').css('display','none');
			}
		}

		// Value Condition Error - show discount everywhere
		jQuery('#publish').on('click', function(e){
			
			if (jQuery('#b2bking_dynamic_rule_discount_show_everywhere_checkbox_input').is(':checked')){
			// check for value conditions

				let have_value_conditions = 'no';
				jQuery('.b2bking_rule_condition_container').each(function(){
					let value = jQuery(this).find('.b2bking_dynamic_rule_condition_number').val();
					if(value !== ''){
						// check if condition is value condition
						let cond = jQuery(this).find('.b2bking_dynamic_rule_condition_name').val();
						if (cond === 'cart_total_value'){
							have_value_conditions = 'yes';
						} 
						if (cond === 'category_product_value'){
							have_value_conditions = 'yes';
						} 
						if (cond === 'product_value'){
							have_value_conditions = 'yes';
						} 
					}
				});
				if (have_value_conditions === 'yes'){
					e.preventDefault();
					alert(b2bking.value_conditions_error);
				}
				// if any value conditions, show error
			}
		});
		

		// initialize multiple products / categories selector as Select2
		$('.b2bking_select_multiple_product_categories_selector_select, .b2bking_select_multiple_users_selector_select').select2({'width':'100%', 'theme':'classic'});
		// show hide multiple products categories selector
		showHideMultipleProductsCategoriesSelector();
		$('#b2bking_rule_select_what').change(showHideMultipleProductsCategoriesSelector);
		$('#b2bking_rule_select_applies').change(showHideMultipleProductsCategoriesSelector);
		function showHideMultipleProductsCategoriesSelector(){
			let selectedValue = $('#b2bking_rule_select_applies').val();
			let hiddenwhat = ['replace_prices_quote','set_currency_symbol','payment_method_minmax_order','payment_method_discount','rename_purchase_order'];
			let selectedWhat = $('#b2bking_rule_select_what').val();
			if ( (selectedValue === 'multiple_options' && selectedWhat !== 'tax_exemption_user') || (selectedValue === 'excluding_multiple_options' && selectedWhat !== 'tax_exemption_user')){
				$('#b2bking_select_multiple_product_categories_selector').css('display','block');
			} else {
				$('#b2bking_select_multiple_product_categories_selector').css('display','none');
			}

			if (hiddenwhat.includes(selectedWhat)){
				$('#b2bking_select_multiple_product_categories_selector').css('display','none');
			}
		}

		showHideMultipleUsersSelector();
		$('#b2bking_rule_select_who').change(showHideMultipleUsersSelector);
		function showHideMultipleUsersSelector(){
			let selectedValue = $('#b2bking_rule_select_who').val();
			if (selectedValue === 'multiple_options'){
				$('#b2bking_select_multiple_users_selector').css('display','block');
			} else {
				$('#b2bking_select_multiple_users_selector').css('display','none');
			}
		}

		function setUpConditionsFromHidden(){
			// get all conditions
			let conditions = $('#b2bking_rule_select_conditions').val();
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
						$('.b2bking_dynamic_rule_condition_name.b2bking_condition_identifier_'+i).val(conditionDetails[0]);
						$('.b2bking_dynamic_rule_condition_operator.b2bking_condition_identifier_'+i).val(conditionDetails[1]);
						$('.b2bking_dynamic_rule_condition_number.b2bking_condition_identifier_'+i).val(conditionDetails[2]);
						addNewCondition(i, 'programatically');
						i++;
					}
				});
			}
		}

		// On clicking "add condition" in Dynamic rule
		$('body').on('click', '.b2bking_dynamic_rule_condition_add_button', function(event) {
		    addNewCondition(1,'user');
		});

		function addNewCondition(buttonNumber = 1, type = 'user'){
			let currentNumber;
			let nextNumber;

			// If condition was added by user
			if (type === 'user'){
				// get its current number
				let classList = $('.b2bking_dynamic_rule_condition_add_button').attr('class').split(/\s+/);
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
			$('.b2bking_dynamic_rule_condition_add_button.b2bking_condition_identifier_'+currentNumber).after('<button type="button" class="b2bking_dynamic_rule_condition_delete_button b2bking_condition_identifier_'+currentNumber+'">'+b2bking.delete+'</button>');
			// add next condition
			$('#b2bking_condition_number_'+currentNumber).after('<div id="b2bking_condition_number_'+nextNumber+'" class="b2bking_rule_condition_container">'+
				'<select class="b2bking_dynamic_rule_condition_name b2bking_condition_identifier_'+nextNumber+'">'+
					'<option value="cart_total_quantity" selected="selected">'+b2bking.cart_total_quantity+'</option>'+
					'<option value="cart_total_value">'+b2bking.cart_total_value+'</option>'+
					'<option value="category_product_quantity">'+b2bking.category_product_quantity+'</option>'+
					'<option value="category_product_value">'+b2bking.category_product_value+'</option>'+
					'<option value="product_quantity">'+b2bking.product_quantity+'</option>'+
					'<option value="product_value">'+b2bking.product_value+'</option>'+
				'</select>'+
				'<select class="b2bking_dynamic_rule_condition_operator b2bking_condition_identifier_'+nextNumber+'">'+
					'<option value="greater">'+b2bking.greater+'</option>'+
					'<option value="equal">'+b2bking.equal+'</option>'+
					'<option value="smaller">'+b2bking.smaller+'</option>'+
				'</select>'+
				'<input type="number" step="0.00001" class="b2bking_dynamic_rule_condition_number b2bking_condition_identifier_'+nextNumber+'" placeholder="'+b2bking.enter_quantity_value+'">'+
				'<button type="button" class="b2bking_dynamic_rule_condition_add_button b2bking_condition_identifier_'+nextNumber+'">'+b2bking.add_condition+'</button>'+
			'</div>');

			// remove self 
			$('.b2bking_dynamic_rule_condition_add_button.b2bking_condition_identifier_'+currentNumber).remove();

			// update available options
			updateDynamicRulesOptionsConditions();
		}

		// On clicking "delete condition" in Dynamic rule
		$('body').on('click', '.b2bking_dynamic_rule_condition_delete_button', function () {
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
			$('#b2bking_condition_number_'+currentNumber).remove();

			// update conditions hidden field
			updateConditionsHiddenField();
		});

		// On Rule selector change, update dynamic rule conditions
		$('#b2bking_rule_select_what, #b2bking_rule_select_who, #b2bking_rule_select_applies, #b2bking_rule_select, #b2bking_rule_select_showtax, #b2bking_container_tax_shipping').change(function() {
			updateDynamicRulesOptionsConditions();
		});

		function updateDynamicRulesOptionsConditions(){
			$('#b2bking_rule_select_applies_replaced_container').css('display','none');
			// Hide one-time fee
			$('#b2bking_one_time').css('display','none');
			// Hide all condition options
			$('.b2bking_dynamic_rule_condition_name option').css('display','none');
			// Hide quantity/value
			$('#b2bking_container_quantity_value').css('display','none');
			// Hide currency
			$('#b2bking_container_currency').css('display','none');
			// Hide payment methods
			$('#b2bking_container_paymentmethods, #b2bking_container_paymentmethods_minmax, #b2bking_container_paymentmethods_percentamount').css('display','none');
			// Hide countries and requires
			$('#b2bking_container_countries, #b2bking_container_requires, #b2bking_container_showtax').css('display','none');
			// Hide tax name
			$('#b2bking_container_taxname, #b2bking_container_tax_shipping, #b2bking_container_tax_shipping_rate').css('display','none');
			// Hide discount checkbox
			$('.b2bking_dynamic_rule_minimum_all_checkbox_container, .b2bking_dynamic_rule_discount_show_everywhere_checkbox_container, .b2bking_discount_options_information_box, .b2bking_minimum_options_information_box').css('display','none');
			$('#b2bking_container_discountname').css('display','none');
			$('.b2bking_rule_label_discount, .b2bking_rule_label_minimum').css('display','none');

			// conditions box text
			$('#b2bking_rule_conditions_information_box_text').text(b2bking.conditions_apply_cumulatively);

			// Show all options
			$("#b2bking_container_howmuch").css('display','inline-block');
			$('#b2bking_container_applies').css('display','inline-block');
			// Show conditions + conditions info box
			$('#b2bking_rule_select_conditions_container').css('display','inline-block');
			$('.b2bking_rule_conditions_information_box').css('display','flex');

			let selectedWhat = $("#b2bking_rule_select_what").val();
			let selectedApplies = $("#b2bking_rule_select_applies").val();
			// Select Discount Amount or Percentage
			if (selectedWhat === 'discount_amount' || selectedWhat === 'discount_percentage'){
				// if select Cart: cart_total_quantity and cart_total_value
				if (selectedApplies === 'cart_total' || selectedApplies === 'excluding_multiple_options'){
					$('.b2bking_dynamic_rule_condition_name option[value=cart_total_quantity], .b2bking_dynamic_rule_condition_name option[value=cart_total_value]').css('display','block');
				} else if (selectedApplies.startsWith("category")){
				// if select Category also have: category_product_quantity and category_product_value
					$('.b2bking_dynamic_rule_condition_name option[value=cart_total_quantity], .b2bking_dynamic_rule_condition_name option[value=cart_total_value], .b2bking_dynamic_rule_condition_name option[value=category_product_quantity], .b2bking_dynamic_rule_condition_name option[value=category_product_value]').css('display','block');
				} else if (selectedApplies.startsWith("product")){
				// if select Product also have: product_quantity and product_value  
					$('.b2bking_dynamic_rule_condition_name option[value=cart_total_quantity], .b2bking_dynamic_rule_condition_name option[value=cart_total_value], .b2bking_dynamic_rule_condition_name option[value=product_quantity], .b2bking_dynamic_rule_condition_name option[value=product_value]').css('display','block');
				} else if (selectedApplies === 'multiple_options' || selectedApplies === 'excluding_multiple_options' || selectedApplies === 'replace_ids'){
					$('.b2bking_dynamic_rule_condition_name option').css('display','block');
					// conditions box text
					$('#b2bking_rule_conditions_information_box_text').text(b2bking.conditions_multiselect);
				}
				// Show discount everywhere checkbox
				$('.b2bking_dynamic_rule_discount_show_everywhere_checkbox_container, .b2bking_discount_options_information_box').css('display','flex');
				$('.b2bking_rule_label_discount').css('display','block');
				$('#b2bking_container_discountname').css('display','inline-block');
			} else if (selectedWhat === 'fixed_price'){
				if (selectedApplies === 'cart_total'){
					$('.b2bking_dynamic_rule_condition_name option[value=cart_total_quantity], .b2bking_dynamic_rule_condition_name option[value=cart_total_value]').css('display','block');
				} else if (selectedApplies.startsWith("category")){
					$('.b2bking_dynamic_rule_condition_name option[value=cart_total_quantity], .b2bking_dynamic_rule_condition_name option[value=category_product_quantity]').css('display','block');
				} else if (selectedApplies.startsWith("product")){
					$('.b2bking_dynamic_rule_condition_name option[value=cart_total_quantity], .b2bking_dynamic_rule_condition_name option[value=product_quantity]').css('display','block');
				} else if (selectedApplies === 'multiple_options' || selectedApplies === 'replace_ids'){
					$('.b2bking_dynamic_rule_condition_name option[value=cart_total_quantity], .b2bking_dynamic_rule_condition_name option[value=category_product_quantity], .b2bking_dynamic_rule_condition_name option[value=product_quantity]').css('display','block');
					$('#b2bking_rule_conditions_information_box_text').text(b2bking.conditions_multiselect);
				}
			} else if (selectedWhat === 'free_shipping'){
				// How much does not apply - hide
				$('#b2bking_container_howmuch').css('display','none');
				// if select Cart: cart_total_quantity and cart_total_value
				if (selectedApplies === 'cart_total'){
					$('.b2bking_dynamic_rule_condition_name option[value=cart_total_quantity], .b2bking_dynamic_rule_condition_name option[value=cart_total_value]').css('display','block');
				} else if (selectedApplies.startsWith("category")){
				// if select Category also have: category_product_quantity and category_product_value
					$('.b2bking_dynamic_rule_condition_name option[value=cart_total_quantity], .b2bking_dynamic_rule_condition_name option[value=cart_total_value], .b2bking_dynamic_rule_condition_name option[value=category_product_quantity], .b2bking_dynamic_rule_condition_name option[value=category_product_value]').css('display','block');
				} else if (selectedApplies.startsWith("product")){
				// if select Product also have: product_quantity and product_value 
					$('.b2bking_dynamic_rule_condition_name option[value=cart_total_quantity], .b2bking_dynamic_rule_condition_name option[value=cart_total_value], .b2bking_dynamic_rule_condition_name option[value=product_quantity], .b2bking_dynamic_rule_condition_name option[value=product_value]').css('display','block'); 
				} else if (selectedApplies === 'multiple_options' || selectedApplies === 'replace_ids'){
					$('.b2bking_dynamic_rule_condition_name option').css('display','block');
					$('#b2bking_rule_conditions_information_box_text').text(b2bking.conditions_multiselect);
				}
			} else if (selectedWhat === 'hidden_price'){
				// How much does not apply - hide
				$('#b2bking_container_howmuch').css('display','none');
				// hide Conditions input and available conditions text
				$('#b2bking_rule_select_conditions_container').css('display','none');
				$('.b2bking_rule_conditions_information_box').css('display','none');

			} else if (selectedWhat === 'required_multiple'){

				// Show discount everywhere checkbox
				$('.b2bking_dynamic_rule_minimum_all_checkbox_container, .b2bking_minimum_options_information_box').css('display','flex');
				$('.b2bking_rule_label_minimum').css('display','block');

				// if select Cart: cart_total_quantity and cart_total_value
				if (selectedApplies === 'cart_total'){
					$('.b2bking_dynamic_rule_condition_name option[value=cart_total_quantity], .b2bking_dynamic_rule_condition_name option[value=cart_total_value]').css('display','block');
				} else if (selectedApplies.startsWith("category")){
				// if select Category also have: category_product_quantity and category_product_value
					$('.b2bking_dynamic_rule_condition_name option[value=cart_total_quantity], .b2bking_dynamic_rule_condition_name option[value=cart_total_value], .b2bking_dynamic_rule_condition_name option[value=category_product_quantity], .b2bking_dynamic_rule_condition_name option[value=category_product_value]').css('display','block');
				} else if (selectedApplies.startsWith("product")){
				// if select Product also have: product_quantity and product_value  
					$('.b2bking_dynamic_rule_condition_name option[value=cart_total_quantity], .b2bking_dynamic_rule_condition_name option[value=cart_total_value], .b2bking_dynamic_rule_condition_name option[value=product_quantity], .b2bking_dynamic_rule_condition_name option[value=product_value]').css('display','block');
				} else if (selectedApplies === 'multiple_options' || selectedApplies === 'replace_ids'){
					$('.b2bking_dynamic_rule_condition_name option').css('display','block');
					$('#b2bking_rule_conditions_information_box_text').text(b2bking.conditions_multiselect);
				}

			} else if (selectedWhat === 'minimum_order' || selectedWhat === 'maximum_order' ) {
				// show Quantity/value
				$('#b2bking_container_quantity_value').css('display','inline-block');
				// hide Conditions input and available conditions text
				$('#b2bking_rule_select_conditions_container').css('display','none');
				$('.b2bking_rule_conditions_information_box').css('display','none');

				// Show discount everywhere checkbox
				$('.b2bking_dynamic_rule_minimum_all_checkbox_container, .b2bking_minimum_options_information_box').css('display','flex');
				$('.b2bking_rule_label_minimum').css('display','block');
			} else if (selectedWhat === 'tax_exemption' ) {
				// How much does not apply - hide
				$('#b2bking_container_howmuch').css('display','none');
				// show countries and requires
				$('#b2bking_container_countries, #b2bking_container_requires').css('display','inline-block');
				// hide Conditions input and available conditions text
				$('#b2bking_rule_select_conditions_container').css('display','none');
				$('.b2bking_rule_conditions_information_box').css('display','none');
			} else if (selectedWhat === 'tax_exemption_user' ) {
				// How much does not apply - hide
				$('#b2bking_container_howmuch').css('display','none');
				// Applies does not apply - hide
				$('#b2bking_container_applies').css('display','none');
				// show countries and requires
				$('#b2bking_container_countries, #b2bking_container_requires, #b2bking_container_showtax').css('display','inline-block');
				if ($('#b2bking_rule_select_showtax').val() === 'display_only'){
					$('#b2bking_container_tax_shipping').css('display','inline-block');
					if ($('#b2bking_rule_select_tax_shipping').val() === 'yes'){
						$('#b2bking_container_tax_shipping_rate').css('display', 'inline-block');
					}
				}
				// hide Conditions input and available conditions text
				$('#b2bking_rule_select_conditions_container').css('display','none');
				$('.b2bking_rule_conditions_information_box').css('display','none');
			} else if (selectedWhat === 'add_tax_amount' || selectedWhat === 'add_tax_percentage' ) {
				// show one time
				$('#b2bking_one_time').css('display','inline-block');
				// show tax name
				$('#b2bking_container_taxname').css('display','inline-block');
				if (selectedApplies === 'one_time' && selectedWhat === 'add_tax_percentage'){
					$('#b2bking_container_tax_shipping').css('display','inline-block');
				}
				// if select Cart: cart_total_quantity and cart_total_value
				if (selectedApplies === 'cart_total' || selectedApplies === 'one_time'){
					$('.b2bking_dynamic_rule_condition_name option[value=cart_total_quantity], .b2bking_dynamic_rule_condition_name option[value=cart_total_value]').css('display','block');
				} else if (selectedApplies.startsWith("category")){
				// if select Category also have: category_product_quantity and category_product_value
					$('.b2bking_dynamic_rule_condition_name option[value=cart_total_quantity], .b2bking_dynamic_rule_condition_name option[value=cart_total_value], .b2bking_dynamic_rule_condition_name option[value=category_product_quantity], .b2bking_dynamic_rule_condition_name option[value=category_product_value]').css('display','block');
				} else if (selectedApplies.startsWith("product")){
				// if select Product also have: product_quantity and product_value  
					$('.b2bking_dynamic_rule_condition_name option[value=cart_total_quantity], .b2bking_dynamic_rule_condition_name option[value=cart_total_value], .b2bking_dynamic_rule_condition_name option[value=product_quantity], .b2bking_dynamic_rule_condition_name option[value=product_value]').css('display','block');
				} else if (selectedApplies === 'multiple_options' || selectedApplies === 'replace_ids'){
					$('.b2bking_dynamic_rule_condition_name option').css('display','block');
					$('#b2bking_rule_conditions_information_box_text').text(b2bking.conditions_multiselect);
				}
			} else if (selectedWhat === 'replace_prices_quote'){
				// How much does not apply - hide
				$('#b2bking_container_howmuch, #b2bking_container_applies').css('display','none');
				// hide Conditions input and available conditions text
				$('#b2bking_rule_select_conditions_container').css('display','none');
				$('.b2bking_rule_conditions_information_box').css('display','none');
			} else if (selectedWhat === 'rename_purchase_order'){
				// How much does not apply - hide
				$('#b2bking_container_howmuch, #b2bking_container_applies').css('display','none');
				// hide Conditions input and available conditions text
				$('#b2bking_rule_select_conditions_container').css('display','none');
				$('.b2bking_rule_conditions_information_box').css('display','none');
				$('#b2bking_container_taxname').css('display','inline-block');
			} else if (selectedWhat === 'set_currency_symbol'){
				// How much does not apply - hide
				$('#b2bking_container_howmuch, #b2bking_container_applies').css('display','none');
				// hide Conditions input and available conditions text
				$('#b2bking_rule_select_conditions_container').css('display','none');
				$('.b2bking_rule_conditions_information_box').css('display','none');
				$('#b2bking_container_currency').css('display','inline-block');
			} else if (selectedWhat === 'payment_method_minmax_order'){
				// How much does not apply - hide
				$('#b2bking_container_applies').css('display','none');
				// hide Conditions input and available conditions text
				$('#b2bking_rule_select_conditions_container').css('display','none');
				$('.b2bking_rule_conditions_information_box').css('display','none');
				$('#b2bking_container_paymentmethods, #b2bking_container_paymentmethods_minmax').css('display','inline-block');
			}  else if (selectedWhat === 'payment_method_discount'){
				// How much does not apply - hide
				$('#b2bking_container_applies').css('display','none');
				// hide Conditions input and available conditions text
				$('#b2bking_rule_select_conditions_container').css('display','none');
				$('.b2bking_rule_conditions_information_box').css('display','none');
				$('#b2bking_container_paymentmethods, #b2bking_container_paymentmethods_percentamount').css('display','inline-block');
			}  else if (selectedWhat === 'bogo_discount'){
				$('.b2bking_dynamic_rule_condition_name option[value=cart_total_quantity], .b2bking_dynamic_rule_condition_name option[value=cart_total_value], .b2bking_dynamic_rule_condition_name option[value=category_product_quantity], .b2bking_dynamic_rule_condition_name option[value=category_product_value]').css('display','block');
				$('.b2bking_dynamic_rule_condition_name option[value=product_quantity], .b2bking_dynamic_rule_condition_name option[value=product_value]').css('display','block');

			}

			if (selectedApplies === 'replace_ids' && selectedWhat !== 'tax_exemption_user'){
				$('#b2bking_rule_select_applies_replaced_container').css('display','block');
			}

			// Check all conditions. If selected condition what is display none, change to Cart Total Quantity (available for all)
			$(".b2bking_dynamic_rule_condition_name").each(function (i) {
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
		$('body').on('input', '.b2bking_dynamic_rule_condition_number, .b2bking_dynamic_rule_condition_operator, .b2bking_dynamic_rule_condition_name', function () {
			updateConditionsHiddenField();
		});

		function updateConditionsHiddenField(){
			// Clear condtions field
			$('#b2bking_rule_select_conditions').val('');
			// For each condition, if not empty, add to field
			let conditions = '';

			$(".b2bking_dynamic_rule_condition_name").each(function (i) {
				// get its current number
				let currentNumber;
				let classList = $(this).attr('class').split(/\s+/);
				$.each(classList, function(index, item) {
				    if (item.includes('identifier')) {
				    	var itemArray = item.split("_");
				    	currentNumber = parseInt(itemArray[3]);
				    }
				});

				let numberField = $(".b2bking_dynamic_rule_condition_number.b2bking_condition_identifier_"+currentNumber).val();
				if (numberField === undefined){
					numberField = '';
				}

				if (numberField.trim() !== ''){
					conditions+=$(this).val()+';';
					conditions+=$(".b2bking_dynamic_rule_condition_operator.b2bking_condition_identifier_"+currentNumber).val()+';';
					conditions+=$(".b2bking_dynamic_rule_condition_number.b2bking_condition_identifier_"+currentNumber).val()+'|';
				}
			});
			// remove last character
			conditions = conditions.substring(0, conditions.length - 1);
			$('#b2bking_rule_select_conditions').val(conditions);
		}

		/* Offers */

		if (b2bking.current_post_type === 'b2bking_offer' || $('#b2bking_offer_access_metabox').length){
			// On load, retrieve offers
			var offerItemsCounter = 1;
			offerRetrieveHiddenField();
			offerCalculateTotals();
		}

		// When click "add item" add new offer item
		$('body').on('click', '.b2bking_offer_add_item_button', addNewOfferItem);
		
		// initialize offer select2
		$('.b2bking_offer_product_selector').select2();

		function addNewOfferItem(){
			// destroy select2
			$('.b2bking_offer_product_selector').select2();
			$('.b2bking_offer_product_selector').select2('destroy');

			let currentItem = offerItemsCounter;
			let nextItem = currentItem+1;
			offerItemsCounter++;
			$('#b2bking_offer_number_1').clone().attr('id', 'b2bking_offer_number_'+nextItem).insertAfter('#b2bking_offer_number_1');
			// clear values from clone
			$('#b2bking_offer_number_'+nextItem+' .b2bking_offer_text_input').val('');
			$('#b2bking_offer_number_'+nextItem+' .b2bking_offer_product_selector').val('').trigger('change');

			$('#b2bking_offer_number_'+nextItem+' .b2bking_item_subtotal').text(b2bking.currency_symbol+'0');
			// add delete button to new item
			$('<button type="button" class="secondary-button button b2bking_offer_delete_item_button">'+b2bking.delete+'</button>').insertAfter('#b2bking_offer_number_'+nextItem+' .b2bking_offer_add_item_button');
			
			//reinitialize select2
			$('.b2bking_offer_product_selector').select2();
		}



		// On click "delete"
		$('body').on('click', '.b2bking_offer_delete_item_button', function(){
			$(this).parent().parent().remove();
			offerCalculateTotals();
			offerSetHiddenField();
		});

		// On quantity or price change, calculate totals
		$('body').on('input', '.b2bking_offer_item_quantity, .b2bking_offer_item_name, .b2bking_offer_item_price', function(){
			offerCalculateTotals();
			offerSetHiddenField();
		});
		
		function offerCalculateTotals(){
			let total = 0;
			// foreach item calculate subtotal
			$('.b2bking_offer_item_quantity').each(function(){
				let quantity = $(this).val();
				let price = $(this).parent().parent().find('.b2bking_offer_item_price').val();
				if (quantity !== undefined && price !== undefined){
					// set subtotal
					total+=price*quantity;
					$(this).parent().parent().find('.b2bking_item_subtotal').text(b2bking.currency_symbol+Number((price*quantity).toFixed(4)));
				}
			});

			// finished, add up subtotals to get total
			$('#b2bking_offer_total_text_number').text(b2bking.currency_symbol+Number((total).toFixed(4)));
		}

		function offerSetHiddenField(){
			let field = '';
			// clear textarea
			$('#b2bking_admin_offer_textarea').val('');
			// go through all items and list them IF they have PRICE AND QUANTITY
			$('.b2bking_offer_item_quantity').each(function(){
				let quantity = $(this).val();
				let price = $(this).parent().parent().find('.b2bking_offer_item_price').val();
				if (quantity !== undefined && price !== undefined && quantity !== null && price !== null && quantity !== '' && price !== ''){
					// Add it to string
					let name = $(this).parent().parent().find('.b2bking_offer_item_name').val();
					if (name === undefined || name === ''){
						name = '(no title)';
					}
					field+= name+';'+quantity+';'+price+'|';
				}
			});

			// at the end, remove last character
			field = field.substring(0, field.length - 1);
			$('#b2bking_admin_offer_textarea').val(field);
		}

		function offerRetrieveHiddenField(){
			// get field;
			let field = $('#b2bking_admin_offer_textarea').val();
			let itemsArray = field.split('|');
			// foreach condition, add condition, add new item
			itemsArray.forEach(function(item){
				let itemDetails = item.split(';');
				if (itemDetails[0] !== undefined && itemDetails[0] !== ''){
					$('#b2bking_offer_number_'+offerItemsCounter+' .b2bking_offer_item_name').val(itemDetails[0]);
					$('#b2bking_offer_number_'+offerItemsCounter+' .b2bking_offer_item_quantity').val(itemDetails[1]);
					$('#b2bking_offer_number_'+offerItemsCounter+' .b2bking_offer_item_price').val(itemDetails[2]);
					addNewOfferItem();
				}
			});
			// at the end, remove the last Item added
			if (offerItemsCounter > 1){
				$('#b2bking_offer_number_'+offerItemsCounter).remove();
			}

		}

		/* USER SHIPPING AND PAYMENT METHODS PANEL */

		// On load, update 
		updateUserShippingPayment();
		// On change, update
		$('.b2bking_user_shipping_payment_methods_container_content_override_select').change(updateUserShippingPayment);

		function updateUserShippingPayment(){
			let selectedValue = $('.b2bking_user_shipping_payment_methods_container_content_override_select').val();
			if (selectedValue === 'default'){
				// hide shipping and payment methods
				$('.b2bking_user_payment_shipping_methods_container').css('display','none');
			} else if (selectedValue === 'manual'){
				// show shipping and payment methods
				$('.b2bking_user_payment_shipping_methods_container').css('display','flex');
			}
		}

		/* REGISTRATION FIELD */

		// On load, show hide user choices 
		showHideUserChoices();

		$('.b2bking_custom_field_settings_metabox_bottom_field_type_select').change(showHideUserChoices);

		function showHideUserChoices(){
			let selectedValue = $('.b2bking_custom_field_settings_metabox_bottom_field_type_select').val();
			if (selectedValue === 'select' || selectedValue === 'checkbox'){
				$('.b2bking_custom_field_settings_metabox_bottom_user_choices').css('display','block');
			} else {
				$('.b2bking_custom_field_settings_metabox_bottom_user_choices').css('display','none');
			}
		}

		/* USER REGISTRATION DATA - APPROVE REJECT */
		$('.b2bking_user_registration_user_data_container_element_approval_button_approve').on('click', function(){
			if (confirm(b2bking.are_you_sure_approve)){
				var datavar = {
		            action: 'b2bkingapproveuser',
		            security: b2bking.security,
		            chosen_group: $('.b2bking_user_registration_user_data_container_element_select_group').val(),
		            credit: $('#b2bking_approval_credit_user').val(),
		            salesagent: $('#salesking_assign_sales_agent').val(),
		            user: $('#b2bking_user_registration_data_id').val(),
		        };

				$.post(ajaxurl, datavar, function(response){
					location.reload();
				});
			}
		});

		$('.b2bking_user_registration_user_data_container_element_approval_button_reject').on('click', function(){
			if (confirm(b2bking.are_you_sure_reject)){
				var datavar = {
		            action: 'b2bkingrejectuser',
		            security: b2bking.security,
		            user: $('#b2bking_user_registration_data_id').val(),
		        };

				$.post(ajaxurl, datavar, function(response){
					window.location = b2bking.admin_url+'/users.php';
				});
			}
		});

		$('.b2bking_user_registration_user_data_container_element_approval_button_deactivate').on('click', function(){
			if (confirm(b2bking.are_you_sure_deactivate)){
				var datavar = {
		            action: 'b2bkingdeactivateuser',
		            security: b2bking.security,
		            user: $('#b2bking_user_registration_data_id').val(),
		        };

				$.post(ajaxurl, datavar, function(response){
					location.reload();
				});
			}
		});

		// Download registration files
		$('.b2bking_user_registration_user_data_container_element_download').on('click', function(){
			let attachment = $(this).val();
			if (parseInt(b2bking.download_go_to_file) === 1){
				var datavar = {
		            action: 'b2bkinghandledownloadrequest',
		            security: b2bking.security,
		            attachment: attachment,
		        };

				$.post(ajaxurl, datavar, function(response){

					let url = response;
					var a = document.createElement("a");
					a.href = url;
					let fileName = url.split("/").pop();
					a.download = fileName;
					document.body.appendChild(a);
					a.click();
					window.URL.revokeObjectURL(url);
					a.remove();

				});
			} else {
				window.location = ajaxurl + '?action=b2bkinghandledownloadrequest&attachment='+attachment+'&security=' + b2bking.security;
			}
		});
		
		updateAddToBilling();
		$('#b2bking_custom_field_billing_connection_metabox_select').change(updateAddToBilling);
		// Billing field connection, show add to billing only if default connection is none
		function updateAddToBilling(){
			let billingConnectionSelected = $('#b2bking_custom_field_billing_connection_metabox_select').val();
			if (billingConnectionSelected === 'none' || billingConnectionSelected === 'billing_vat'){
				$('.b2bking_add_to_billing_container').css('display', '');
			} else {
				$('.b2bking_add_to_billing_container').css('display', 'none');
			}

			// Show VAT container only if selected billing connection is VAT
			if (billingConnectionSelected === 'billing_vat'){
				$('.b2bking_VAT_container').css('display', 'flex');
			} else {
				$('.b2bking_VAT_container').css('display', 'none');
			}

			if (billingConnectionSelected === 'custom_mapping'){
				$('.b2bking_custom_mapping_container').css('display', 'flex');
			}  else {
				$('.b2bking_custom_mapping_container').css('display', 'none');
			}
		}

		// show hide Registration Role Automatic Approval - show only if automatic approval is selected
		showHideAutomaticApprovalGroup();
		$('.b2bking_custom_role_settings_metabox_container_element_select').change(showHideAutomaticApprovalGroup);
		function showHideAutomaticApprovalGroup(){
			let selectedValue = $('.b2bking_custom_role_settings_metabox_container_element_select').val();
			if (selectedValue === 'automatic'){
				$('.b2bking_automatic_approval_customer_group_container').css('display','block');
			} else {
				$('.b2bking_automatic_approval_customer_group_container').css('display','none');
			}
		}

		// show hide multiple roles selector
		showHideMultipleRolesSelector();
		$('.b2bking_custom_field_settings_metabox_top_column_registration_role_select').change(showHideMultipleRolesSelector);
		function showHideMultipleRolesSelector(){
			let selectedValue = $('.b2bking_custom_field_settings_metabox_top_column_registration_role_select').val();
			if (selectedValue === 'multipleroles'){
				$('#b2bking_select_multiple_roles_selector').css('display','block');
			} else {
				$('#b2bking_select_multiple_roles_selector').css('display','none');
			}
		}

		// Tools
		// On clicking download price list
		$('#b2bking_download_products_button').on('click', function() {
		    window.location = ajaxurl + '?action=b2bkingdownloadpricelist&security=' + b2bking.security;
	    });

	    // Download troubleshooting file
	    $('#b2bking_download_troubleshooting_button').on('click', function() {
		    window.location = ajaxurl + '?action=b2bkingdownloadtroubleshooting&security=' + b2bking.security;
	    });

	    // On clicking set all users to group
	    $('#b2bking_set_users_in_group').on('click', function(){
	    	if (confirm(b2bking.are_you_sure_set_users)){
				var datavar = {
		            action: 'b2bkingbulksetusers',
		            security: b2bking.security,
		            chosen_group: $('#b2bking_customergroup').val(),
		        };

				$.post(ajaxurl, datavar, function(response){
					alert('All users have been moved to your chosen group');
					location.reload();
				});
	    	}
	    });

        // On clicking set category in bulk
        $('#b2bking_set_category_in_bulk').on('click', function(){
        	if (confirm(b2bking.are_you_sure_set_categories)){
    			var datavar = {
    	            action: 'b2bkingbulksetcategory',
    	            security: b2bking.security,
    	            chosen_option: $('#b2bking_categorybulk').val(),
    	        };

    			$.post(ajaxurl, datavar, function(response){
    				alert(b2bking.categories_have_been_set);
    				location.reload();
    			});
        	}
        });

        // On clicking set accounts as subaccounts
        $('#b2bking_set_accounts_as_subaccounts').on('click', function(){
        	if (confirm(b2bking.are_you_sure_set_subaccounts)){
    			var datavar = {
    	            action: 'b2bkingbulksetsubaccounts',
    	            security: b2bking.security,
    	            option_first: $('#b2bking_set_user_subaccounts_first').val(),
    	            option_second: $('#b2bking_set_user_subaccounts_second').val(),
    	        };

    			$.post(ajaxurl, datavar, function(response){
    				alert(b2bking.subaccounts_have_been_set);
    				location.reload();
    			});
        	}
        });

            // On clicking set accounts as regular accounts
            $('#b2bking_set_subaccounts_regular_button').on('click', function(){
            	if (confirm(b2bking.are_you_sure_set_subaccounts_regular)){
        			var datavar = {
        	            action: 'b2bkingbulksetsubaccountsregular',
        	            security: b2bking.security,
        	            option_first: $('#b2bking_set_subaccounts_regular_input').val(),
        	        };

        			$.post(ajaxurl, datavar, function(response){
        				alert(b2bking.subaccounts_have_been_set);
        				location.reload();
        			});
            	}
            });

        // On clicking update b2bking user data (registration data)
        $('#b2bking_update_registration_data_button').on('click', function(){
	    	if (confirm(b2bking.are_you_sure_update_user)){

	    		var fields = $('#b2bking_admin_user_fields_string').val();
	    		var fieldsArray = fields.split(',');

				var datavar = {
		            action: 'b2bkingupdateuserdata',
		            security: b2bking.security,
		            userid: $('#b2bking_admin_user_id').val(),
		            field_strings: fields,
		        };

		        fieldsArray.forEach(myFunction);

		        function myFunction(item, index) {
		        	if (parseInt(item.length) !== 0){
		        		let value = $('input[name=b2bking_custom_field_'+item+']').val();
		        		if (value !== null){
		        			let key = 'field_'+item;
		        			datavar[key] = value;
		        		}
		        	}
		        }

				$.post(ajaxurl, datavar, function(response){
					if (response.startsWith('vatfailed')){
						alert(b2bking.user_has_been_updated_vat_failed);
					} else {
						alert(b2bking.user_has_been_updated);
					}

					location.reload();
					
				});
	    	}
        });

        // on clicking "add tier" in the product page
        $('.b2bking_product_add_tier').on('click', function(){
        	var groupid = $(this).parent().find('.b2bking_groupid').val();
        	$('<span class="wrap b2bking_product_wrap"><input name="b2bking_group_'+groupid+'_pricetiers_quantity[]" placeholder="'+b2bking.min_quantity_text+'" class="b2bking_tiered_pricing_element" type="number" step="any" min="0" /><input name="b2bking_group_'+groupid+'_pricetiers_price[]" placeholder="'+b2bking.final_price_text+'" class="b2bking_tiered_pricing_element" type="number" step="any" min="0"  /></span>').insertBefore($(this).parent());
        });

        // on clicking "add row" in the product page
        $('.b2bking_product_add_row').on('click', function(){
        	var groupid = $(this).parent().find('.b2bking_groupid').val();
        	$('<span class="wrap b2bking_customrows_wrap"><input name="b2bking_group_'+groupid+'_customrows_label[]" placeholder="'+b2bking.label_text+'" class="b2bking_customrow_element" type="text" /><input name="b2bking_group_'+groupid+'_customrows_text[]" placeholder="'+b2bking.text_text+'" class="b2bking_customrow_element" type="text" /></span>').insertBefore($(this).parent());
        });

        // on clicking "add tier" in the product variation page
        $('body').on('click', '.b2bking_product_add_tier_variation', function(event) {
        	var groupid = $(this).parent().find('.b2bking_groupid').val();
        	var variationid = $(this).parent().find('.b2bking_variationid').val();
            $('<span class="wrap b2bking_product_wrap_variation"><input name="b2bking_group_'+groupid+'_'+variationid+'_pricetiers_quantity[]" placeholder="'+b2bking.min_quantity_text+'" class="b2bking_tiered_pricing_element_variation" type="number" step="any" min="0" /><input name="b2bking_group_'+groupid+'_'+variationid+'_pricetiers_price[]" placeholder="'+b2bking.final_price_text+'" class="b2bking_tiered_pricing_element_variation" type="number" step="any" min="0"  /></span>').insertBefore($(this).parent());
        });

        $('#b2bking_b2b_pricing_variations').detach().insertAfter('option[value=delete_all]');

        // bulk edit variations
        $( '.wc-metaboxes-wrapper' ).on( 'click', 'a.do_variation_action', function(){
        	var do_variation_action = $( 'select.variation_actions' ).val();
        	if (do_variation_action.startsWith('b2bking')){
        		var value = prompt(woocommerce_admin_meta_boxes_variations.i18n_enter_a_value);
        		var values = do_variation_action.split('_');

        		var regularsale = values[1];
        		var productid = values[4];
        		var groupid = values[6];

				var datavar = {
		            action: 'b2bkingbulksetvariationprices',
		            security: b2bking.security,
		            price: value,
		            regular_sale: regularsale,
		            product_id: productid,
		            group_id: groupid,
		        };

				$.post(ajaxurl, datavar, function(response){
					// do nothing
				});
        	}
        });

        // print user registration data
        $('#b2bking_print_user_data').on('click', function(){
        	var printContents = document.getElementById('b2bking_registration_data_container').innerHTML;
			var originalContents = document.body.innerHTML;

			document.body.innerHTML = printContents;

			window.print();

			document.body.innerHTML = originalContents;
        });

 
	});

})(jQuery);