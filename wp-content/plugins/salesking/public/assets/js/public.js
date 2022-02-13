/**
*
* JavaScript file that handles public side JS
*
*/
(function($){

	"use strict";

	$( document ).ready(function() {

		// Move body to stay below top switched used bar
		setTimeout(function(){
			if ($('#salesking_agent_switched_bar').css('height') !== undefined){
				let heightpx = jQuery('#salesking_agent_switched_bar').css('height');
				jQuery('body').css('padding-top', heightpx);
			}
		}, 100);
		
		

		// On clicking "Mark as read" for announcements
		$('#salesking_mark_announcement_read').on('click', function(){
			// Run ajax request
			var datavar = {
	            action: 'saleskingmarkread',
	            security: salesking_display_settings.security,
	            announcementid: $('#salesking_mark_announcement_read').val(),
	        };

			$.post(salesking_display_settings.ajaxurl, datavar, function(response){
				window.location = salesking_display_settings.announcementsurl;
			});
		});

		// On clicking "Mark all as read" for announcements
		$('#salesking_mark_all_announcement_read').on('click', function(){
			// Run ajax request
			var datavar = {
	            action: 'saleskingmarkallread',
	            security: salesking_display_settings.security,
	            announcementsid: $('#salesking_mark_all_announcement_read').val(),
	        };

			$.post(salesking_display_settings.ajaxurl, datavar, function(response){
				window.location = salesking_display_settings.announcementsurl;
			});
		});

		// On clicking "Mark as read" for conversations
		$('#salesking_mark_conversation_read').on('click', function(){
			// Run ajax request
			var datavar = {
	            action: 'saleskingmarkreadmessage',
	            security: salesking_display_settings.security,
	            messageid: $('#salesking_mark_conversation_read').val(),
	        };

			$.post(salesking_display_settings.ajaxurl, datavar, function(response){
				location.reload();
			});
		});

		// On clicking "Mark as closed" for conversations
		$('#salesking_mark_conversation_closed').on('click', function(){
			// Run ajax request
			var datavar = {
	            action: 'saleskingmarkclosedmessage',
	            security: salesking_display_settings.security,
	            messageid: $('#salesking_mark_conversation_closed').val(),
	        };

			$.post(salesking_display_settings.ajaxurl, datavar, function(response){
				location.reload();
			});
		});



		// On click Send in existing conversation
		$('#salesking_dashboard_reply_message').on('click', function(){

			// Run ajax request
			var datavar = {
	            action: 'saleskingreplymessage',
	            security: salesking_display_settings.security,
	            messagecontent: $('#salesking_dashboard_reply_message_content').val(),
	            messageid: $(this).val(),
	        };

			$.post(salesking_display_settings.ajaxurl, datavar, function(response){
				location.reload();
			});
		});

		// On clicking send (compose message)
		$('#salesking_compose_send_message').on('click', function(){

			// Run ajax request
			var datavar = {
	            action: 'saleskingcomposemessage',
	            security: salesking_display_settings.security,
	            messagecontent: $('#salesking_compose_send_message_content').val(),
	            recipient: $('#salesking_dashboard_recipient').val(),
	            title: $('#salesking_compose_send_message_title').val(),
	        };

			$.post(salesking_display_settings.ajaxurl, datavar, function(response){
				window.location = response;
			});
		});

		var buttonclass = 'btn btn-sm btn-gray';

		// Initiate customers frontend table
		var oTable = $('#salesking_dashboard_customers_table').DataTable({
			"language": {
			    "url": salesking_display_settings.datatables_folder+salesking_display_settings.tables_language_option+'.json'
			},
			oLanguage: {
                sSearch: ""
            },
            dom: 'Bfrtip',
            buttons: {
                buttons: [
                    { extend: 'csvHtml5', className: buttonclass, text: '↓ CSV', exportOptions: { columns: ":visible" } },
                    { extend: 'pdfHtml5', className: buttonclass, text: '↓ PDF', exportOptions: { columns: ":visible" } },
                    { extend: 'print', className: buttonclass, text: salesking_display_settings.print, exportOptions: { columns: ":visible" } },
                    { extend: 'colvis', className: buttonclass, text: salesking_display_settings.edit_columns },
                ]
            }
		});

		$('#salesking_customers_search').keyup(function(){
		      oTable.search($(this).val()).draw() ;
		});

		// Teams table
		var aoTable = $('#salesking_dashboard_teams_table').DataTable({
			"language": {
			    "url": salesking_display_settings.datatables_folder+salesking_display_settings.tables_language_option+'.json'
			},
			oLanguage: {
                sSearch: ""
            },
            dom: 'Bfrtip',
            buttons: {
                buttons: [
                    { extend: 'csvHtml5', className: buttonclass, text: '↓ CSV', exportOptions: { columns: ":visible" } },
                    { extend: 'pdfHtml5', className: buttonclass, text: '↓ PDF', exportOptions: { columns: ":visible" } },
                    { extend: 'print', className: buttonclass, text: salesking_display_settings.print, exportOptions: { columns: ":visible" } },
                    { extend: 'colvis', className: buttonclass, text: salesking_display_settings.edit_columns },
                ]
            }
		});

		$('#salesking_teams_search').keyup(function(){
		      aoTable.search($(this).val()).draw() ;
		});


		// Orders datatable
	    $('#salesking_dashboard_orders_table tfoot tr:eq(0) th').each( function (i) {
	        var title = $(this).text();
	        $(this).html( '<input type="text" class="salesking_search_column" placeholder="'+salesking_display_settings.searchtext+title+'..." />' );
	 
	        $( 'input', this ).on( 'keyup change', function () {
	            if ( abbtable.column(i).search() !== this.value ) {
	                abbtable
	                    .column(i)
	                    .search( this.value )
	                    .draw();
	            }
	        } );
	    } );

		 
		var abbtable = $('#salesking_dashboard_orders_table').DataTable({
			"language": {
			    "url": salesking_display_settings.datatables_folder+salesking_display_settings.tables_language_option+'.json'
			},
			oLanguage: {
                sSearch: ""
            },
            dom: 'Bfrtip',
            order: [[ 0, "desc" ]],
            buttons: {
                buttons: [
                    { extend: 'csvHtml5', className: buttonclass, text: '↓ CSV', exportOptions: { columns: ":visible" } },
                    { extend: 'pdfHtml5', className: buttonclass, text: '↓ PDF', exportOptions: { columns: ":visible" } },
                    { extend: 'print', className: buttonclass, text: salesking_display_settings.print, exportOptions: { columns: ":visible" } },
                    { extend: 'colvis', className: buttonclass, text: salesking_display_settings.edit_columns },
                ]
            }

		});

		$('#salesking_orders_search').keyup(function(){
		      abbtable.search($(this).val()).draw() ;
		});

		// Earnings datatable
	    $('#salesking_dashboard_earnings_table tfoot tr:eq(0) th').each( function (i) {
	        var title = $(this).text();
	        $(this).html( '<input type="text" class="salesking_search_column" placeholder="'+salesking_display_settings.searchtext+title+'..." />' );
	 
	        $( 'input', this ).on( 'keyup change', function () {
	            if ( table.column(i).search() !== this.value ) {
	                table
	                    .column(i)
	                    .search( this.value )
	                    .draw();
	            }
	        } );
	    } );

		 
		var table = $('#salesking_dashboard_earnings_table').DataTable({
			"language": {
			    "url": salesking_display_settings.datatables_folder+salesking_display_settings.tables_language_option+'.json'
			},
			oLanguage: {
                sSearch: ""
            },
            dom: 'Bfrtip',
            order: [[ 0, "desc" ]],
            buttons: {
                buttons: [
                    { extend: 'csvHtml5', className: buttonclass, text: '↓ CSV', exportOptions: { columns: ":visible" } },
                    { extend: 'pdfHtml5', className: buttonclass, text: '↓ PDF', exportOptions: { columns: ":visible" } },
                    { extend: 'print', className: buttonclass, text: salesking_display_settings.print, exportOptions: { columns: ":visible" } },
                    { extend: 'colvis', className: buttonclass, text: salesking_display_settings.edit_columns },
                ]
            }
		});


		$('#salesking_earnings_search').keyup(function(){
		      table.search($(this).val()).draw() ;
		});

		// Subagents arnings datatable
	    $('#salesking_dashboard_subagents_earnings_table tfoot tr:eq(0) th').each( function (i) {
	        var title = $(this).text();
	        $(this).html( '<input type="text" class="salesking_search_column" placeholder="'+salesking_display_settings.searchtext+title+'..." />' );
	 
	        $( 'input', this ).on( 'keyup change', function () {
	            if ( actable.column(i).search() !== this.value ) {
	                actable
	                    .column(i)
	                    .search( this.value )
	                    .draw();
	            }
	        } );
	    } );

		 
		var actable = $('#salesking_dashboard_subagents_earnings_table').DataTable({
			"language": {
			    "url": salesking_display_settings.datatables_folder+salesking_display_settings.tables_language_option+'.json'
			},
			oLanguage: {
                sSearch: ""
            },
            dom: 'Bfrtip',
            order: [[ 0, "desc" ]],
            buttons: {
                buttons: [
                    { extend: 'csvHtml5', className: buttonclass, text: '↓ CSV', exportOptions: { columns: ":visible" } },
                    { extend: 'pdfHtml5', className: buttonclass, text: '↓ PDF', exportOptions: { columns: ":visible" } },
                    { extend: 'print', className: buttonclass, text: salesking_display_settings.print, exportOptions: { columns: ":visible" } },
                    { extend: 'colvis', className: buttonclass, text: salesking_display_settings.edit_columns },
                ]
            }
		});


		$('#salesking_subagents_earnings_search').keyup(function(){
		      actable.search($(this).val()).draw() ;
		});



		// On clicking Save coupon
		$('#salesking_dashboard_save_coupon').on('click', function(e){

			// check that coupon is valid
			if ($('#salesking_coupon_submit_form')[0].checkValidity()){
				// Run ajax request
				var datavar = {
		            action: 'saleskingsavecoupon',
		            security: salesking_display_settings.security,
		            couponcode: $('#salesking_coupon_code_input').val(),
		            expirydate: $('#salesking_expiry_date_input').val(),
		            minspend: $('#salesking_minimum_spend_input').val(),
		            maxspend: $('#salesking_maximum_spend_input').val(),
		            discount: $('#salesking_discount_input').val(),
		            limit: $('#salesking_limit_input').val(),	
		            exclude: $('#salesking_exclude_sales_items').prop('checked'),	
		        };

				$.post(salesking_display_settings.ajaxurl, datavar, function(response){
					location.reload();
				});
			}
			
		});


		$('.salesking_delete_coupon').on('click', function(){
			// Run ajax request
			if (confirm(salesking_display_settings.sure_delete_coupon)){
				var datavar = {
		            action: 'saleskingdeletecoupon',
		            security: salesking_display_settings.security,
		            couponpostid: $(this).val(),
		        };
		        $.post(salesking_display_settings.ajaxurl, datavar, function(response){
		        	location.reload();
		        });
		    }
		});

		$('#salesking_registration_link_button').on('click', function(){
			var copyText = document.getElementById("salesking_registration_link");
			copyText.select();
			copyText.setSelectionRange(0, 99999); /* For mobile devices */

			/* Copy the text inside the text field */
			document.execCommand("copy");
			$('#salesking_registration_link_button').text(salesking_display_settings.copied);
			setTimeout(function(){
				$('#salesking_registration_link_button').text(salesking_display_settings.copy);
			}, 900);
		});

		$('#salesking_shopping_link_button').on('click', function(){
			var copyText = document.getElementById("salesking_shopping_link");
			copyText.select();
			copyText.setSelectionRange(0, 99999); /* For mobile devices */

			/* Copy the text inside the text field */
			document.execCommand("copy");
			$('#salesking_shopping_link_button').text(salesking_display_settings.copied);
			setTimeout(function(){
				$('#salesking_shopping_link_button').text(salesking_display_settings.copy);
			}, 900);
		});


		$('#salesking_generator_link_button').on('click', function(){

			var link = $('#salesking_generator_link').val();
			// add affiliate
			var affiliate = $('#salesking_shopping_link').val();
			affiliate = '?'+affiliate.split('?')[1];
			link = link+affiliate;

			$('#salesking_generator_link').val(link);

			var copyText = document.getElementById("salesking_generator_link");
			copyText.select();
			copyText.setSelectionRange(0, 99999); /* For mobile devices */

			/* Copy the text inside the text field */
			document.execCommand("copy");

			$('#salesking_generator_link_button').text(salesking_display_settings.ready);
			$('#salesking_generator_link_button').prop('disabled', true);
			$('#salesking_generator_link').prop('readonly', true);
			$('.tooltip-inner').text(salesking_display_settings.link_copied);
			setTimeout(function(){
				$('.tooltip-inner').remove();
			}, 600);
		});

		$('#salesking_create_cart_button').on('click', function(){

			var cartname = $('#salesking_create_cart_name').val();

			// Run ajax request
			if (confirm(salesking_display_settings.sure_create_cart)){
				var datavar = {
		            action: 'saleskingcreatecart',
		            security: salesking_display_settings.security,
		            name: cartname,
		        };

		        $.post(salesking_display_settings.ajaxurl, datavar, function(response){
		        	location.reload();
		        });
		    }
		});

		$('.salesking_copy_cart_link').on('click', function(){

			var text = $(this).val();

			// Create a "hidden" input
			var aux = document.createElement("input");
			aux.setAttribute("value", text);
			document.body.appendChild(aux);
			aux.select();
			document.execCommand("copy");
			document.body.removeChild(aux);

		});

		$('.salesking_delete_cart_link').on('click', function(){
			var cartname = $(this).val();
			// Run ajax request
			if (confirm(salesking_display_settings.sure_delete_cart)){
				var datavar = {
		            action: 'saleskingdeletecart',
		            security: salesking_display_settings.security,
		            name: cartname,
		        };

		        $.post(salesking_display_settings.ajaxurl, datavar, function(response){
		        	location.reload();
		        });
		    }
		});

		$('#salesking_add_customer').on('click', function(){	

			if ($('#salesking_add_customer_form')[0].checkValidity()){

				if (confirm(salesking_display_settings.sure_add_customer)){
					var datavar = {
			            action: 'saleskingaddcustomer',
			            security: salesking_display_settings.security,
			            firstname: $('#first-name').val(),
			            lastname: $('#last-name').val(),
			            companyname: $('#company-name').val(),
			            country: $('#billing_country').val(),
			            streetaddress: $('#street-address').val(),
			            towncity: $('#town-city').val(),
			            county: $('#county').val(),
			            postcodezip: $('#postcode-zip').val(),
			            phoneno: $('#phone-no').val(),
			            username: $('#username').val(),
			            emailaddress: $('#email-address').val(),
			            password: $('#password').val(),
			        };

			        // add custom fields
			        let custom_fields = $('#salesking_b2bking_custom_fields').val();
			        if (custom_fields !== undefined){
				        let fields_array = custom_fields.split(',');

				        $.each(fields_array, function (index, i) {
				        	datavar[i] = jQuery('#salesking_field_'+i).val();
				        });
				    } else {
				    	custom_fields = '';
				    }

			        datavar.customfields = custom_fields;

			        $.post(salesking_display_settings.ajaxurl, datavar, function(response){
			        	if (response.startsWith('error')){
			        		alert(salesking_display_settings.customer_created_error+' '+response);
			        		console.log(response);
			        	} else {
			        		alert(salesking_display_settings.customer_created);
			        		location.reload();
			        	}
			        });
			    }
			}

		});

		// add subagent
		$('#salesking_add_subagent').on('click', function(){	

			if ($('#salesking_add_subagent_form')[0].checkValidity()){

				if (confirm(salesking_display_settings.sure_add_subagent)){
					var datavar = {
			            action: 'saleskingaddsubagent',
			            security: salesking_display_settings.security,
			            firstname: $('#first-name').val(),
			            lastname: $('#last-name').val(),
			            phoneno: $('#phone-no').val(),
			            username: $('#username').val(),
			            emailaddress: $('#email-address').val(),
			            password: $('#password').val(),

			        };

			        $.post(salesking_display_settings.ajaxurl, datavar, function(response){
			        	if (response.startsWith('error')){
			        		alert(salesking_display_settings.subagent_created_error+' '+response);
			        		console.log(response);
			        	} else {
			        		alert(salesking_display_settings.subagent_created);
			        		location.reload();
			        	}
			        	
			        });
			    }
			}

		});

		// when clicking shop as customer
		$('body').on('click', '.salesking_shop_as_customer', function(){
			var customerid = $(this).val();
			var datavar = {
	            action: 'saleskingshopascustomer',
	            security: salesking_display_settings.security,
	            customer: customerid,
	        };

	        $.post(salesking_display_settings.ajaxurl, datavar, function(response){
	        	window.location = salesking_display_settings.shopurl;
	        });
		});

		// when clicking EDIT shop as customer
		$('body').on('click', '.salesking_shop_as_customer_edit', function(){
			var customerid = $(this).val();
			var datavar = {
	            action: 'saleskingshopascustomer',
	            security: salesking_display_settings.security,
	            customer: customerid,
	        };

	        $.post(salesking_display_settings.ajaxurl, datavar, function(response){
	        	window.location = salesking_display_settings.accounturl;
	        });
		});

		$('#salesking_return_agent').on('click', function(){
			var agentid = $(this).val();
			var agentregistered = $('#salesking_return_agent_registered').val();

			var datavar = {
	            action: 'saleskingswitchtoagent',
	            security: salesking_display_settings.security,
	            agent: agentid,
	            agentdate: agentregistered,
	        };

	        $.post(salesking_display_settings.ajaxurl, datavar, function(response){
	        	window.location = salesking_display_settings.customersurl;
	        });
		});

		/* Payouts */
		showhidepaymentmethods();

		$('input[type=radio][name="saleskingpayoutMethod"]').change(function() {
			showhidepaymentmethods();
		});

		function showhidepaymentmethods(){
			// first hide all methods

			$('.salesking_paypal_info, .salesking_bank_info, .salesking_custom_info').css('display', 'none');
			// Show which payment method the user chose
			let selectedValue = $('input[type=radio][name="saleskingpayoutMethod"]:checked').val();
			if (selectedValue === "paypal") {
				// show paypal
				$('.salesking_paypal_info').css('display', 'block');
			} else if (selectedValue === "bank"){
				$('.salesking_bank_info').css('display', 'block');
			} else if (selectedValue === "custom"){
				$('.salesking_custom_info').css('display', 'block');
			}
		}

		// save payout info
		$('#salesking_save_payout').on('click', function(){	
			if (confirm(salesking_display_settings.sure_save_info)){
				var datavar = {
		            action: 'saleskingsaveinfo',
		            security: salesking_display_settings.security,
		            chosenmethod: $('input[type=radio][name="saleskingpayoutMethod"]:checked').val(),
		            paypal: $('#paypal-email').val(),
		            custom: $('#custom-method').val(),
		            fullname: $('#full-name').val(),
		            billingaddress1: $('#billing-address-1').val(),
		            billingaddress2: $('#billing-address-2').val(),
		            city: $('#city').val(),
		            state: $('#state').val(),
		            postcode: $('#postcode').val(),
		            country: $('#country').val(),
		            bankholdername: $('#bank-account-holder-name').val(),
		            bankaccountnumber: $('#bank-account-number').val(),
		            branchcity: $('#bank-branch-city').val(),
		            branchcountry: $('#bank-branch-country').val(),
		            intermediarycode: $('#intermediary-bank-bank-code').val(),
		            intermediaryname: $('#intermediary-bank-name').val(),
		            intermediarycity: $('#intermediary-bank-city').val(),
		            intermediarycountry: $('#intermediary-bank-country').val(),
		        };


		        $.post(salesking_display_settings.ajaxurl, datavar, function(response){
		        	location.reload();
		        });
		    }
		});

		// save user profile settings
		$('#salesking_save_settings').on('click', function(){	
			var datavar = {
	            action: 'salesking_save_profile_settings',
	            security: salesking_display_settings.security,
	            announcementsemails: $('#new-announcements').is(":checked"),
	            messagesemails: $('#new-messages').is(":checked"),
	            userid: $(this).val(),
	        };


	        $.post(salesking_display_settings.ajaxurl, datavar, function(response){
	        	location.reload();
	        });

		});

		$('#salesking_update_profile').on('click', function(){	
			var datavar = {
	            action: 'salesking_save_profile_info',
	            security: salesking_display_settings.security,
	            firstname: $('#first-name').val(),
	            lastname: $('#last-name').val(),
	            displayname: $('#display-name').val(),
	            emailad: $('#email').val(),
	        };

	        $.post(salesking_display_settings.ajaxurl, datavar, function(response){
	        	location.reload();
	        });

		});

		

	});

})(jQuery);
