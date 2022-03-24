var fb;
var container;

function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime( d.getTime() + (exdays * 24 * 60 * 60 * 1000) );
	var expires     = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
	var name          = cname + "=";
	var decodedCookie = decodeURIComponent( document.cookie );
	var ca            = decodedCookie.split( ';' );
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt( 0 ) == ' ') {
			c = c.substring( 1 );
		}
		if (c.indexOf( name ) == 0) {
			return c.substring( name.length, c.length );
		}
	}
	return "";
}

function delete_cookie(cname) {
	document.cookie = cname + "= ; expires = Thu, 01 Jan 1970 00:00:00 GMT; path=/";
}

jQuery( document ).ready(
	function () {

		if (typeof (wpep_hide_elements) !== 'undefined' ) {

			if ( wpep_hide_elements.hide_publish_meta == 'true' ) {

				jQuery( '#misc-publishing-actions' ).hide();
				jQuery( '#minor-publishing-actions' ).hide();

			}
		}

		// check if popup checkbox is checked then show popup button label visible
		if (jQuery( '#formType1' ).is( ':checked' )) {
			jQuery( '#popupWrapper' ).show();
		} else {
			jQuery( '#popupWrapper' ).hide();
		}

		jQuery( '#formType1' ).click(
			function () {
				if (jQuery( this ).is( ':checked' )) {
					jQuery( '#popupWrapper' ).show();
				} else {
					jQuery( '#popupWrapper' ).hide();
				}
			}
		);

		jQuery( document ).on(
			"keydown",
			".selection > input",
			function (event) {
				if (event.shiftKey == true) {
					event.preventDefault();
				}

				if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105) || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 46 || event.keyCode == 190) {

				} else {
					event.preventDefault();
				}

				if (jQuery( this ).val().indexOf( '.' ) !== -1 && event.keyCode == 190) {
					event.preventDefault();
				}
			}
		);

		if (jQuery( '#paymentDrop' ).val() == 'payment_radio') {
			jQuery( '#amountInListInputs > .inputWrapper input[name="wpep_radio_amounts"]' ).attr( 'name', 'wpep_radio_amounts[]' );
			jQuery( '#amountInListInputs > .inputWrapper input[name="wpep_radio_amount_labels"]' ).attr( 'name', 'wpep_radio_amount_labels[]' );
			var obj     = wpep_form_setting_amounts.wpep_radio_amounts;
			var textobj = '';
			jQuery.each(
				obj,
				function (i, v) {

					if (i == 0) {
						textobj += '{"wpep_radio_amounts": "' + v.amount + '","wpep_radio_amount_labels":"' + v.label + '"}';
					} else {
						textobj += ', {"wpep_radio_amounts": "' + v.amount + '","wpep_radio_amount_labels":"' + v.label + '"}';
					}

				}
			);

			if (textobj == '') {
				jQuery( '#amountInList' ).multiInput(
					{
						json: true,
						input: jQuery(
							'<div class="inputElement">\n' +
							'<div class="multiinputField paymentSelectB"><div class="form-group selection not-empty wpep-form-full">\n' +
							'<input class="form-control" name="wpep_radio_amounts[]" placeholder="Price" type="text">\n' +
							'</div></div>\n' +
							'<div class="multiinputField"><div class="form-group">\n' +
							'<input class="form-control" name="wpep_radio_amount_labels[]" placeholder="Label" type="text">\n' +
							'</div></div>\n' +
							'</div>\n'
						),
					limit: 10
					}
				);
			} else {

				jQuery( '#amountInList' ).text( '[' + textobj + ']' );
				jQuery( '#amountInList' ).multiInput(
					{
						json: true,
						input: jQuery(
							'<div class="inputElement">\n' +
							'<div class="multiinputField paymentSelectB"><div class="form-group selection not-empty wpep-form-full">\n' +
							'<input class="form-control" name="wpep_radio_amounts" placeholder="Price" type="text">\n' +
							'</div></div>\n' +
							'<div class="multiinputField"><div class="form-group">\n' +
							'<input class="form-control" name="wpep_radio_amount_labels" placeholder="Label" type="text">\n' +
							'</div></div>\n' +
							'</div>\n'
						),
					limit: 10,
					onElementAdd: function (el, plugin) {
						// console.log('I am here');
						jQuery( '#amountInListInputs > .inputWrapper input[name="wpep_radio_amounts"]' ).attr( 'name', 'wpep_radio_amounts[]' );
						jQuery( '#amountInListInputs > .inputWrapper input[name="wpep_radio_amount_labels"]' ).attr( 'name', 'wpep_radio_amount_labels[]' );
						el.find( '.inputElement' ).prepend( '<span class="defaultPriceSelectedWrap"><input type="radio" class="PriceSelected" name="PriceSelected" default="' + plugin.elementCount + '" value="' + plugin.elementCount + '"></span>' );
						el.find( '.PriceSelected[default="' + wpep_form_setting_amounts.PriceSelected + '"]' ).attr( 'checked', true );
					},
					}
				);

			}
		}

		if (jQuery( '#paymentDrop' ).val() == 'payment_drop') {
			jQuery( '#amountInDropInputs > .inputWrapper input[name="wpep_dropdown_amounts"]' ).attr( 'name', 'wpep_dropdown_amounts[]' );
			jQuery( '#amountInDropInputs > .inputWrapper input[name="wpep_dropdown_amount_labels"]' ).attr( 'name', 'wpep_dropdown_amount_labels[]' );
			var obj     = wpep_form_setting_amounts.wpep_dropdown_amounts;
			var textobj = '';
			jQuery.each(
				obj,
				function (i, v) {
					if (i == 0) {
						textobj += '{"wpep_dropdown_amounts": "' + v.amount + '","wpep_dropdown_amount_labels":"' + v.label + '"}';
					} else {
						textobj += ', {"wpep_dropdown_amounts": "' + v.amount + '","wpep_dropdown_amount_labels":"' + v.label + '"}';
					}

				}
			);

			if (textobj == '') {
				jQuery( '#amountInDrop' ).multiInput(
					{
						json: true,
						input: jQuery(
							'<div class="inputElement">' +
							'<div class="multiinputField paymentSelectB"><div class="form-group selection not-empty wpep-form-full">\n' +
							'<input class="form-control" name="wpep_dropdown_amounts[]" placeholder="Price" type="text">\n' +
							'</div></div>' +
							'<div class="multiinputField"><div class="form-group">\n' +
							'<input class="form-control" name="wpep_dropdown_amount_labels[]" placeholder="Label" type="text">\n' +
							'</div></div>' +
							'</div>'
						),
					limit: 10
					}
				);

			} else {

				jQuery( '#amountInDrop' ).text( '[' + textobj + ']' );
				jQuery( '#amountInDrop' ).multiInput(
					{
						json: true,
						input: jQuery(
							'<div class="inputElement">\n' +
							'<div class="multiinputField paymentSelectB"><div class="form-group selection not-empty wpep-form-full">\n' +
							'<input class="form-control" name="wpep_dropdown_amounts" placeholder="Price" type="text">\n' +
							'</div></div>\n' +
							'<div class="multiinputField"><div class="form-group">\n' +
							'<input class="form-control" name="wpep_dropdown_amount_labels" placeholder="Label" type="text">\n' +
							'</div></div>\n' +
							'</div>\n'
						),
					limit: 10,
					onElementAdd: function (el, plugin) {
						jQuery( '#amountInDropInputs > .inputWrapper input[name="wpep_dropdown_amounts"]' ).attr( 'name', 'wpep_dropdown_amounts[]' );
						jQuery( '#amountInDropInputs > .inputWrapper input[name="wpep_dropdown_amount_labels"]' ).attr( 'name', 'wpep_dropdown_amount_labels[]' );
						el.find( '.inputElement' ).prepend( '<span class="defaultPriceSelectedWrap"><input type="radio" class="PriceSelected" name="PriceSelected" default="' + plugin.elementCount + '" value="' + plugin.elementCount + '"></span>' );
						el.find( '.PriceSelected[default="' + wpep_form_setting_amounts.PriceSelected + '"]' ).attr( 'checked', true );
					},
					}
				);

			}
		}

		if (jQuery( '#paymentDrop' ).val() == 'payment_tabular') {
			jQuery( '#payment_tabular' ).show();
			jQuery( '#quantity_box' ).hide();
		}

		// Build form page tabs
		jQuery( 'div.easypayblock ul#tabs-list li' ).click(
			function () {
				var id = jQuery( this ).data( 'id' );
				setCookie( 'wpep-setting-tab', id, 365 );
			}
		);

		// global settings
		if (getCookie( 'wpep-payment-mode' )) {
			jQuery( "#on-off" ).attr( 'checked', true );
		} else {
			jQuery( "#on-off" ).attr( 'checked', false );
		}

		jQuery( ".wp_easy_pay_page_wpep-settings #wpep_spmgt" ).addClass( 'testActive' );
		jQuery( "#on-off" ).click(
			function () {
				if (jQuery( this ).is( ":checked" )) {
					jQuery( ".wp_easy_pay_page_wpep-settings #wpep_spmgt" ).removeClass( 'testActive' );
					jQuery( ".wp_easy_pay_page_wpep-settings #wpep_spmgl" ).addClass( 'liveActive' );
					setCookie( 'wpep-payment-mode', 'live', 365 );

				} else {
					jQuery( ".wp_easy_pay_page_wpep-settings #wpep_spmgt" ).addClass( 'testActive' );
					jQuery( ".wp_easy_pay_page_wpep-settings #wpep_spmgl" ).removeClass( 'liveActive' );
					delete_cookie( 'wpep-payment-mode' );
				}

				jQuery( 'body.post-type-wp_easy_pay form.wpeasyPay-form' ).submit();
			}
		);

		if (jQuery( '#donation' ).is( ":checked" )) {

			jQuery( "#donation-dependedt" ).show();

		} else {

			jQuery( "#donation-dependedt" ).hide();

		}

		if (jQuery( '#on-off-single' ).is( ":checked" )) {

			jQuery( ".post-type-wp_easy_pay #wpep_spmst" ).removeClass( 'testActive' );
			jQuery( ".post-type-wp_easy_pay #wpep_spmsl" ).addClass( 'liveActive' );

		} else {

			jQuery( ".post-type-wp_easy_pay #wpep_spmst" ).addClass( 'testActive' );
			jQuery( ".post-type-wp_easy_pay #wpep_spmsl" ).removeClass( 'liveActive' );

		}

		if (jQuery( '#on-off' ).is( ":checked" )) {
			jQuery( ".wp_easy_pay_page_wpep-settings #wpep_spmgt" ).removeClass( 'testActive' );
			jQuery( ".wp_easy_pay_page_wpep-settings #wpep_spmgl" ).addClass( 'liveActive' );
		} else {
			jQuery( ".wp_easy_pay_page_wpep-settings #wpep_spmgt" ).addClass( 'testActive' );
			jQuery( ".wp_easy_pay_page_wpep-settings #wpep_spmgl" ).removeClass( 'liveActive' );
		}

		if (jQuery( '#chkGlobal' ).is( ":checked" )) {
			jQuery( "#globalSettings" ).show();
			jQuery( "#normalSettings" ).hide();
		} else {
			jQuery( "#globalSettings" ).hide();
			jQuery( "#normalSettings" ).show();
		}

		if (jQuery( '#checkbox1' ).is( ":checked" )) {

			jQuery( '#paymentLimit' ).show();

		}
		
		ClassicEditor.create( document.querySelector( '#user_email' ), {
	        toolbar: [
	            'heading', 'alignment', 'bold', 'italic', 'strikethrough', 'underline', 'link', 'code', 'numberedList', 'undo', 'redo'
	        ],
			heading: {
				options: [
					{ model: 'paragraph', view: 'p', title: 'Paragraph', class: 'ck-heading_paragraph' },
					{ model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
					{ model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
					{ model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' }
				]
			}
		} ).catch( error => {
            console.error( error );
        } );

		ClassicEditor.create( document.querySelector( '#admin_email' ), {
			toolbar: [
	            'heading', 'alignment', 'bold', 'italic', 'strikethrough', 'underline', 'link', 'code', 'numberedList', 'undo', 'redo'
	        ],
			heading: {
				options: [
					{ model: 'paragraph', view: 'p', title: 'Paragraph', class: 'ck-heading_paragraph' },
					{ model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
					{ model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
					{ model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' }
				]
			}
		} ).catch( error => {
            console.error( error );
        } );


		// global settings
		// jQuery(".post-type-wp_easy_pay #wpep_spmst").addClass('testActive');
		jQuery( "#on-off-single" ).click(
			function () {

				if (jQuery( this ).is( ":checked" )) {
					jQuery( ".post-type-wp_easy_pay #wpep_spmst" ).removeClass( 'testActive' );
					jQuery( ".post-type-wp_easy_pay #wpep_spmsl" ).addClass( 'liveActive' );
				} else {
					jQuery( ".post-type-wp_easy_pay #wpep_spmst" ).addClass( 'testActive' );
					jQuery( ".post-type-wp_easy_pay #wpep_spmsl" ).removeClass( 'liveActive' );
				}

				// every time we click on checkGlobal we will submit form post.
				jQuery( 'body.post-type-wp_easy_pay form#post' ).submit();
			}
		);

		jQuery( "#chkGlobal" ).click(
			function () {
				if (jQuery( this ).is( ":checked" )) {
					jQuery( "#globalSettings" ).show();
					jQuery( "#normalSettings" ).hide();
				} else {
					jQuery( "#globalSettings" ).hide();
					jQuery( "#normalSettings" ).show();
				}

				// every time we click on checkGlobal we will submit form post.
				jQuery( 'body.post-type-wp_easy_pay form#post' ).submit();
			}
		);

		// on document ready check if all payment block has some values or not.
		jQuery( ".selection input" ).each(
			function () {
				var val = jQuery( this ).val();
				if (val != '') {
					jQuery( this ).parent().removeClass( 'empty' );
					jQuery( this ).parent().addClass( 'not-empty' );
				} else {
					jQuery( this ).parent().removeClass( 'not-empty' );
					jQuery( this ).parent().addClass( 'empty' );
				}
			}
		);

		// rollback page
		var revertResult1 = 'false';
		var revertResult2 = 'false';
		jQuery( '#revert' ).on(
			'click',
			function () {
				// alert('test');
				if (jQuery( this ).is( ':checked' )) {
					revertResult1 = 'true';
				} else {
					revertResult1 = 'false';
				}

				if (revertResult1 == 'true' && revertResult2 == 'true') {
					jQuery( 'input[name="wpep_revert_back_submit"]' ).removeClass( 'wpep-disabled' );
				} else {
					jQuery( 'input[name="wpep_revert_back_submit"]' ).addClass( 'wpep-disabled' );
				}
			}
		);

		jQuery( "ul.rbr-reason-list li" ).click(
			function () {
				revertResult2 = 'true';
				if (jQuery( this ).find( "#rbr-8" ).is( ":checked" )) {
					jQuery( "#rbr-8-other" ).css( 'display', 'block' );
				} else {
					jQuery( "#rbr-8-other" ).css( 'display', 'none' );
				}

				if (revertResult1 == 'true' && revertResult2 == 'true') {
					jQuery( 'input[name="wpep_revert_back_submit"]' ).removeClass( 'wpep-disabled' );
				} else {
					jQuery( 'input[name="wpep_revert_back_submit"]' ).addClass( 'wpep-disabled' );
				}
			}
		);

		jQuery( ".otherpayment" ).click(
			function () {
				jQuery( "#showPayment" ).toggle();
			}
		);

		jQuery( '.toggle' ).click(
			function (e) {
				e.preventDefault();

				let $this = jQuery( this );

				if ($this.next().hasClass( 'show' )) {
					$this.next().removeClass( 'show' );
					$this.next().slideUp( 350 );
				} else {
					$this.parent().parent().find( 'li .inner' ).removeClass( 'show' );
					$this.parent().parent().find( 'li .inner' ).slideUp( 350 );
					$this.next().toggleClass( 'show' );
					$this.next().slideToggle( 350 );
				}
			}
		);

		jQuery( document ).on(
			'click',
			'.wpep_tags',
			function () {

				var $temp = jQuery( "<input>" );
				jQuery( "body" ).append( $temp );
				$temp.val( jQuery( this ).text() ).select();
				document.execCommand( "copy" );
				$temp.remove();

			}
		);

		jQuery( document ).one(
			'click',
			'body:not(.post-type-wpep_coupons) #publish',
			function (event) {
				event.preventDefault();
				wpep_set_json_to_hidden_field();
				if (wpep_set_json_to_hidden_field()) {
					jQuery( this ).trigger( 'click' );
				}
			}
		);

		jQuery( document ).on(
			'click',
			'.publish-disabled',
			function (event) {
				event.preventDefault();
				alert( 'Please fill all the labels' );
			}
		);

		jQuery( document ).on(
			'copy paste keyup change',
			'#build-wrap ul > li div.fld-label',
			function () {
				var checkLabels = jQuery( "#build-wrap ul > li div.fld-label" ).filter(
					function () {
						return jQuery.trim( jQuery( this ).text() ).length == 0
					}
				).length == 0;

				// console.log(checkLabels);

				if (checkLabels) {
					jQuery( 'input[name="save"]' ).attr( 'id', 'publish' );
					jQuery( 'input[name="save"]' ).removeClass( 'publish-disabled' );
				} else {
					jQuery( 'input[name="save"]' ).removeAttr( 'id' );
					jQuery( 'input[name="save"]' ).addClass( 'publish-disabled' );
				}

			}
		);

		// Amount Dropdown Type
		jQuery( '.drop-down-show-hide' ).hide();

		jQuery( "#checkbox1" ).click(
			function () {
				if (jQuery( this ).is( ":checked" )) {
					jQuery( "#paymentLimit" ).show();
				} else {
					jQuery( "#paymentLimit" ).hide();
				}
			}
		);

		// amount field active
		jQuery( '.paymentSelectB input' ).blur(
			function () {

				tmpval = jQuery( this ).val();
				if (tmpval == '') {
					jQuery( this ).parent().addClass( 'empty' );
					jQuery( this ).parent().removeClass( 'not-empty' );
				} else {
					jQuery( this ).parent().addClass( 'not-empty' );
					jQuery( this ).parent().removeClass( 'empty' );
				}

			}
		);

		var amount_type = jQuery( '#paymentDrop' ).val();
		if (amount_type == 'payment_radio') {
			jQuery( '#payment_radio' ).show();
			jQuery( '#quantity_box' ).show();
			jQuery( '#checkbox1' ).parent().hide();
			jQuery( '#checkbox1' ).hide();
		}

		if (amount_type == 'payment_drop') {
			jQuery( '#payment_drop' ).show();
			jQuery( '#quantity_box' ).show();
		}

		if (amount_type == 'payment_custom') {
			jQuery( '#payment_custom' ).show();
			jQuery( '#quantity_box' ).show();
		}

		if (amount_type == 'payment_tabular') {
			jQuery( '#payment_tabular' ).show();
			jQuery( '#quantity_box' ).hide();

			jQuery( '#checkbox1' ).parent().show();
			jQuery( '#checkbox1' ).show();
		}

		jQuery( document ).on(
			'click',
			'.add_new_additional_fees_field' ,
			function() {

				var wpep_new_fees_field = '<div class="multiInput"><div class="inputWrapperCus"><div class="cusblock1">' +
				'<label class="fees_label">'+
				'<input type="checkbox" class="wpep-fee-checker" value="yes" >'+
				'<input type="hidden" class="hdnFeeChk"  name="wpep_service_fees_check[]" value="no"  >'+
				'</label>'+
				'<input type="text" name="wpep_service_fees_name[]" value="" placeholder="Service Name" class="form-control tamountfield">' +

				'<select name="wpep_service_charge_type[]">' +
				'<option value="percentage"> Percentage </option>' +
				'<option value="static_price"> Static Price </option>' +
				'</select>' +

				'<input type="text" name="wpep_fees_value[]" value="" placeholder="Value" class="form-control tqtufield">' + '</div>' +
				'<input type="button" class="btnplus add_new_additional_fees_field">' +
				'<input type="button" class="btnminus remove_additional_fees_field">' +

				'</div>' +
				'</div>' +

				'</div>';

				jQuery( '#wpep_additional_charges' ).append( wpep_new_fees_field );

			}
		);

		jQuery( document ).on(
			'click',
			'.remove_additional_fees_field' ,
			function(){

				jQuery( this ).closest( '.multiInput' ).remove();

			}
		);

		jQuery(document).on(
			'click',
			'.wpep-fee-checker',
			function () {
				// debugger;
				if ( jQuery(this).is(':checked') ) {
					jQuery(this).siblings('input.hdnFeeChk').val('yes');
				} else {
					jQuery(this).siblings('input.hdnFeeChk').val('no');
				}
			}
		);

	}
);











jQuery(
	function ($) {

		container = document.getElementById( "build-wrap" );

		var fields = [

		{
			label: "Url",
			type: "text",
			subtype: "url",
			icon: "⛓"
		},
		{
			label: "Telephone",
			type: "text",
			subtype: "text",
			icon: "☏"
		}

		];

		var defaultFields = [

		{
			className: "form-control",
			label: "First Name",
			placeholder: "Enter your first name",
			name: "wpep-first-name-field",
			required: true,
			type: "text",
			disabledFieldButtons: ['remove', 'edit', 'copy']
		},
		{
			className: "form-control",
			label: "Last Name",
			placeholder: "Enter your last name",
			name: "wpep-last-name-field",
			required: true,
			type: "text",
			disabledFieldButtons: ['remove', 'edit', 'copy']
		},
		{
			className: "form-control",
			label: "Email",
			placeholder: "example@example.com",
			name: "wpep-email-field",
			required: true,
			type: "text",
			subtype: "email",
			disabledFieldButtons: ['remove', 'edit', 'copy']
		}

		];

		var field_add_remove_function = {

			onadd: function (fld) {

				wpep_set_transaction_notes_and_email_tags();

			},
			onremove: function (fld) {

				wpep_set_transaction_notes_and_email_tags();

			}

		};

		if (jQuery( '#wpep_form_builder_json' ).val() !== '' && jQuery( '#wpep_form_builder_json' ).val() !== undefined) {

			var saved_form_data = JSON.parse( jQuery( '#wpep_form_builder_json' ).val() );

			saved_form_data.forEach(
				function (value, key) {

					if (value.label == 'First Name') {

						saved_form_data[key].disabledFieldButtons = ['remove', 'edit', 'copy'];
					}

					if (value.label == 'Last Name') {

						saved_form_data[key].disabledFieldButtons = ['remove', 'edit', 'copy'];
					}

					if (value.label == 'Email') {

						saved_form_data[key].disabledFieldButtons = ['remove', 'edit', 'copy'];
					}

				}
			);

			saved_form_data = JSON.stringify( saved_form_data );

		}

		fb = $( container ).formBuilder(
			{

				disabledActionButtons: ['data', 'save', 'clear'],
				fields: fields,
				disableFields: ['autocomplete', 'button', 'checkbox', 'header', 'hidden', 'paragraph'],
				defaultFields: defaultFields,
				dataType: 'json',
				formData: saved_form_data,
				typeUserEvents: {
					text: field_add_remove_function,
					number: field_add_remove_function,
					date: field_add_remove_function,
					'radio-group': field_add_remove_function,
					'checkbox-group': field_add_remove_function,
					select: field_add_remove_function,
				},
				typeUserDisabledAttrs: {
					'radio-group': [ 'inline', 'access', 'other'],
					'checkbox-group': [ 'toggle', 'inline', 'access', 'other'],
					'date': [ 'placeholder', 'value', 'access'],
					'text': [ 'placeholder', 'value', 'access'],
					'number': [ 'placeholder', 'value', 'access', 'min', 'max', 'step'],
					'select': [ 'placeholder', 'access']
				},
				typeUserAttrs: {
					text: {
						hideLabel: {
							label: 'Show label',
							options: {
								'yes': 'Yes, I want to show label on my form',
								'no': 'No, I don\'t want to show label on my form'
							}
						}
					},
					number: {
						hideLabel: {
							label: 'Show label',
							options: {
								'yes': 'Yes, I want to show label on my form',
								'no': 'No, I don\'t want to show label on my form'
							}
						},
						min: {
							label: 'Min',
							value: 1,
						},
						max: {
							label: 'Max',
							value: 10,
						}
					},
					date: {
						hideLabel: {
							label: 'Show label',
							options: {
								'yes': 'Yes, I want to show label on my form',
								'no': 'No, I don\'t want to show label on my form'
							}
						}
					},
					'radio-group': {
						hideLabel: {
							label: 'Show label',
							options: {
								'yes': 'Yes, I want to show label on my form',
								'no': 'No, I don\'t want to show label on my form'
							}
						}
					},
					select: {
						hideLabel: {
							label: 'Show label',
							options: {
								'yes': 'Yes, I want to show label on my form',
								'no': 'No, I don\'t want to show label on my form'
							}
						}
					},
					'checkbox-group': {
						hideLabel: {
							label: 'Show label',
							options: {
								'yes': 'Yes, I want to show label on my form',
								'no': 'No, I don\'t want to show label on my form'
							}
						}
					}
				},
				onOpenFieldEdit: function (editPanel) {
					wpep_set_transaction_notes_and_email_tags();
				},
				onCloseFieldEdit: function (editPanel) {
					wpep_set_transaction_notes_and_email_tags();
				},

			}
		);
	}
);

function wpep_get_form_builder_data() {
	var form_json_data = fb.actions.getData( 'json', true );
	jQuery( '#wpep_form_builder_json' ).val( form_json_data );
}


function wpep_set_transaction_notes_and_email_tags() {

	setTimeout(
		function () {

			jQuery( '#wpep_extra_fields_email_tags' ).empty();

			var form_fields_object = JSON.parse( fb.actions.getData( 'json', true ) );

			form_fields_object.forEach(
				function (item, index) {
					var label = item.label;

					if (label !== undefined) {
						var shortcode = '[' + label.replace( / /g, "_" ).toLowerCase() + ']';
					}

					if (label !== 'First Name' && label !== 'Last Name' && label !== 'Email' && label !== undefined) {
						jQuery( '#wpep_extra_fields_email_tags' ).append( '<span>' + label + ': <small class = "wpep_tags" >' + shortcode + '</small> </span>' );
					}

				}
			);

			jQuery( '#wpep_extra_fields_notes_tags' ).empty();

			var form_fields_object = JSON.parse( fb.actions.getData( 'json', true ) );

			form_fields_object.forEach(
				function (item, index) {
					var label = item.label;
					if (label !== undefined) {
						var shortcode = '[' + label.replace( / /g, "_" ).toLowerCase() + ']';
					}

					if (label !== 'First Name' && label !== 'Last Name' && label !== 'Email' && label !== undefined) {
						jQuery( '#wpep_extra_fields_notes_tags' ).append( '<span>' + label + ': <small class = "wpep_tags" >' + shortcode + '</small> </span>' );
					}

				}
			);

		},
		1000
	);

}

function wpep_set_json_to_hidden_field() {
	var form_json_data = fb.actions.getData( 'json', true );
	jQuery( '#wpep_form_builder_json' ).val( form_json_data );
	return true;
}



jQuery( '#paymentDrop' ).change(
	function () {

		jQuery( '.drop-down-show-hide' ).hide();
		jQuery( '#' + this.value ).show();

		if ( 'payment_tabular' == this.value ) {
			jQuery( '#quantity_box' ).hide();

		} else {

			jQuery( '#quantity_box' ).show();
		}
		if ( 'payment_custom' == this.value ) {
			jQuery( '#checkbox1' ).parent().show();
			jQuery( '#checkbox1' ).show();
		} else {
			jQuery( '#checkbox1' ).parent().hide();
			jQuery( '#checkbox1' ).hide();
		}

		// amount in dropdown
		jQuery( '#amountInDrop' ).multiInput(
			{
				json: true,
				input: jQuery(
					'<div class="inputElement">\n' +
					'<div class="multiinputField paymentSelectB"><div class="form-group selection not-empty wpep-form-full">\n' +
					'<input class="form-control" name="wpep_dropdown_amounts[]" placeholder="Price" type="text">\n' +
					'</div></div>\n' +
					'<div class="multiinputField"><div class="form-group">\n' +
					'<input class="form-control" name="wpep_dropdown_amount_labels[]" placeholder="Label" type="text">\n' +
					'</div></div>\n' +
					'</div>\n'
				),
			limit: 10,
			onElementAdd: function (el, plugin) {
				console.log( plugin );
				console.log( el );
				el.find( '.inputElement' ).prepend( '<span class="defaultPriceSelectedWrap"><input type="radio" class="PriceSelected" name="PriceSelected" default="' + plugin.elementCount + '" value="' + plugin.elementCount + '"></span>' );
				el.find( '.PriceSelected[default="' + wpep_form_setting_amounts.PriceSelected + '"]' ).attr( 'checked', true );
			},
				onElementRemove: function (el, plugin) {
					// console.log(plugin.elementCount);
				}
			}
		);

		// amount in radio list
		jQuery( '#amountInList' ).multiInput(
			{
				json: true,
				input: jQuery(
					'<div class="inputElement">\n' +
					'<div class="multiinputField paymentSelectB"><div class="form-group selection not-empty wpep-form-full">\n' +
					'<input class="form-control" name="wpep_radio_amounts[]" placeholder="Price" type="text">\n' +
					'</div></div>\n' +
					'<div class="multiinputField"><div class="form-group">\n' +
					'<input class="form-control" name="wpep_radio_amount_labels[]" placeholder="Label" type="text">\n' +
					'</div></div>\n' +
					'</div>\n'
				),
			limit: 10,
			onElementAdd: function (el, plugin) {
				console.log( plugin );
				console.log( el );
				el.find( '.inputElement' ).prepend( '<span class="defaultPriceSelectedWrap"><input type="radio" class="PriceSelected" name="PriceSelected" default="' + plugin.elementCount + '" value="' + plugin.elementCount + '"></span>' );
				el.find( '.PriceSelected[default="' + wpep_form_setting_amounts.PriceSelected + '"]' ).attr( 'checked', true );
			},
				onElementRemove: function (el, plugin) {
					// console.log(plugin.elementCount);
				}
			}
		);
	}
);



jQuery( '.drop-payment-select-show-hide' ).hide();
var payment_type = jQuery( '#paymentTypeSel' ).val();


if (payment_type == 'subscription' || payment_type == 'donation_recurring') {

	jQuery( '.wpep-signup-heading' ).show();
	jQuery( '#wpep_signup_charges' ).show();
	jQuery( '#subscription' ).show();

} else {

	jQuery( '.wpep-signup-heading' ).hide();
	jQuery( '#wpep_signup_charges' ).hide();
	jQuery( '#subscription' ).hide();
	
}

if (payment_type == 'donation') {

	jQuery( '#donation-goal' ).show();
	jQuery( '#donation' ).show();

} else {
	jQuery( '#donation-goal' ).hide();
	jQuery( '#donation' ).hide();
}

jQuery( '#paymentTypeSel' ).change(
	function () {		
		if ( this.value == 'donation' ) {

			jQuery( '#donation-goal' ).show();
		
		} else {

			jQuery( '#donation-goal' ).hide();
		
		}

		if ( this.value == 'subscription' || this.value == 'donation_recurring') {

			jQuery( '.wpep-signup-heading' ).show();
			jQuery( '#wpep_signup_charges' ).show();
			jQuery( '#subscription' ).show();
			jQuery( '#enableCoupon' ).prop('checked', false);
			jQuery ( '#coupon_box' ).hide();

		} else {

			jQuery( '.wpep-signup-heading' ).hide();
			jQuery( '#wpep_signup_charges' ).hide();
			jQuery( '.drop-payment-select-show-hide' ).hide();
			jQuery( '#' + this.value ).show();
			jQuery ( '#coupon_box' ).show();

		}

	}
);

(function ($) {
	$.fn.inputFilter = function (inputFilter) {
		return this.on(
			"input keydown keyup mousedown mouseup select contextmenu drop",
			function () {
				if (inputFilter( this.value )) {
					this.oldValue          = this.value;
					this.oldSelectionStart = this.selectionStart;
					this.oldSelectionEnd   = this.selectionEnd;
				} else if (this.hasOwnProperty( "oldValue" )) {
					this.value = this.oldValue;
					this.setSelectionRange( this.oldSelectionStart, this.oldSelectionEnd );
				} else {
					this.value = "";
				}
			}
		);
	};
}(jQuery));

jQuery( window ).load(
	function () {
		// alert('test');
		jQuery( '#wpep-first-name-field-preview' ).parents( 'li' ).css( 'pointer-events', 'none' );
		jQuery( '#wpep-last-name-field-preview' ).parents( 'li' ).css( 'pointer-events', 'none' );
		jQuery( '#wpep-email-field-preview' ).parents( 'li' ).css( 'pointer-events', 'none' );

		jQuery( '#amountInListInputs > .inputWrapper input[name="wpep_radio_amounts"]' ).attr( 'name', 'wpep_radio_amounts[]' );
		jQuery( '#amountInListInputs > .inputWrapper input[name="wpep_radio_amount_labels"]' ).attr( 'name', 'wpep_radio_amount_labels[]' );

		jQuery( '#amountInDropInputs > .inputWrapper input[name="wpep_dropdown_amounts"]' ).attr( 'name', 'wpep_dropdown_amounts[]' );
		jQuery( '#amountInDropInputs > .inputWrapper input[name="wpep_dropdown_amount_labels"]' ).attr( 'name', 'wpep_dropdown_amount_labels[]' );
	}
);


if ( ! (jQuery( '#enableTermsCondition' ).is( ":checked" ))) {
	jQuery( "#enableTCWrap" ).hide();
} else {
	jQuery( "#enableTCWrap" ).show();
}

jQuery( "#enableTermsCondition" ).click(
	function () {
		if (jQuery( this ).is( ":checked" )) {
			jQuery( "#enableTCWrap" ).show();
		} else {
			jQuery( "#enableTCWrap" ).hide();
		}
	}
);



if ( ! (jQuery( '#enableRecaptcha' ).is( ":checked" ))) {
	jQuery( "#enableRecaptchaWrap" ).hide();
} else {
	jQuery( "#enableRecaptchaWrap" ).show();
}

jQuery( "#enableRecaptcha" ).click(
	function () {
		if (jQuery( this ).is( ":checked" )) {
			jQuery( "#enableRecaptchaWrap" ).show();
		} else {
			jQuery( "#enableRecaptchaWrap" ).hide();
		}
	}
);



// redirection selectbox

jQuery(
	function () {

		if ( ! (jQuery( '#allowRedirection' ).val() == 'Yes')) {
			jQuery( '.redirectionCheckInput' ).attr( 'disabled', 'disabled' );
		}

		jQuery( '#allowRedirection' ).change(
			function (e) {
				var selected_type = jQuery( this ).val();

				if (selected_type == 'Yes') {
					jQuery( '#redirectionCheck' ).removeAttr( 'disabled' );
				} else if (selected_type == 'No') {
					jQuery( '#redirectionCheck' ).attr( 'disabled', 'diasbled' );
				}
			}
		)
		jQuery( ".defaultPriceSelected" ).wrap( "<span class='defaultPriceSelectedWrap'></span>" );
	}
);

function wpep_add_repeator_field_product (product_id) {
	product_id         = product_id + 1;
	var site_url       = wpep_hide_elements.wpep_site_url;
	var repeator_field = '<div class="inputWrapperCus wpep_repeat_product_fields">' +
		'<div class="cusblock1">' +
		// '<input type="radio" name="wpep_default_field">' +
		'<div class="timgfield"><input type="file" name="wpep_tabular_products_image[]" data-proid="' + product_id + '" onchange="readURL(this);"><img id="image_div_' + product_id + '" src ="' + site_url + '/assets/backend/img/placeholder-image.png" width="66px"  /></div>' +
		'<input type="text" name="wpep_tabular_products_price[]" placeholder="Product Price" class="form-control tamountfield">' +
		'<input type="text" name="wpep_tabular_products_label[]" placeholder="Label" class="form-control tlabbelfield">' +
		'<input type="text" name="wpep_tabular_products_qty[]" placeholder="Quantity" class="form-control tqtufield">' +
		'</div>' +
		'<input type="button" class="btnplus" onclick="wpep_add_repeator_field_product(' + product_id + ');" value="">' +
		'<input type="button" class="btnminus" onclick="wpep_delete_repeator_field_product(this);" value="">' +
		'</div>';

	jQuery( "#payment_tabular" ).append( repeator_field );
}

function wpep_delete_repeator_field_product(instance) {
	instance.parentNode.remove();
}

jQuery( '#wpep_reset_donation_goal' ).on('click', function(e){
	e.preventDefault();
	var confirm = window.confirm("Are you sure? This action will reset your goal data for this form.");
	if ( confirm ) {
		var data = {
			action: 'wpep_reset_donation_goal',
			form_id: jQuery(this).data('id')
		};

		jQuery.post(ajaxurl, data, function (response) {
			if ( 'done' == response ) {
				alert( 'Your goal is reset' );
			}
		});
	}
});


function readURL(input) {

	if (input.files && input.files[0]) {

		var reader    = new FileReader();
		reader.onload = function (e) {

			var pro_id = input.dataset.proid;
			jQuery( '#image_div_' + pro_id ).attr( 'src', e.target.result );

		};
		reader.readAsDataURL( input.files[0] );
	}

}

function open_integration_form(evt, tabname) {
	var i, tabcontent, tablinks;
	tabcontent = document.getElementsByClassName("integration_tab_content");
	for (i = 0; i < tabcontent.length; i++) {
	  tabcontent[i].style.display = "none";
	}
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
	  tablinks[i].className = tablinks[i].className.replace(" active", "");
	}
	document.getElementById(tabname).style.display = "block";
	evt.currentTarget.className += " active";
  }