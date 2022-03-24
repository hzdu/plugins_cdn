jQuery( document ).ready(
	function () {

		jQuery( ".selectedPlan input[type='radio']" ).change(
			function () {

				var radioValue = jQuery( this ).val();
				if (radioValue) {
					var form_id = jQuery( this ).parents( 'form' ).data( 'id' );
					
					if ( jQuery(`#theForm-${form_id} input[name="wpep-discount"]`).length > 0 ) { 
						jQuery(`#theForm-${form_id} input[name="wpep-discount"]`).remove();
					}
				
					if ( jQuery(`#theForm-${form_id} .wpep-alert-coupon`).length > 0 ) {
						jQuery(`#theForm-${form_id} .wpep-alert-coupon`).remove();
					}

					jQuery( 'form[data-id="' + form_id + '"] .display' ).text( radioValue );
					jQuery( 'form[data-id="' + form_id + '"] .display' ).next().next( 'input[name="one_unit_cost"]' ).val( radioValue ).trigger('change');
					jQuery( 'form[data-id="' + form_id + '"] .display' ).next( 'input[name="wpep-selected-amount"]' ).val( radioValue ).trigger('change');
					//jQuery( '#one_unit_cost' ).val( radioValue.trim() );
					jQuery( '#wpep_quantity_' + form_id ).val( 1 );
					jQuery( 'form[data-id="' + form_id + '"] .wpep-single-form-submit-btn' ).removeClass( 'wpep-disabled' );
					jQuery( 'form[data-id="' + form_id + '"] .wpep-wizard-form-submit-btn' ).removeClass( 'wpep-disabled' );
				}
			}
		);

		jQuery( 'body' ).on(
			'DOMSubtreeModified',
			'.paynowDrop',
			function(){

				$selected_value = jQuery( '.selection' ).data( 'value' );
				var form_id     = jQuery( this ).parents( 'form' ).data( 'id' );

				if ( jQuery(`#theForm-${form_id} input[name="wpep-discount"]`).length > 0 ) { 
					jQuery(`#theForm-${form_id} input[name="wpep-discount"]`).remove();
				}
			
				if ( jQuery(`#theForm-${form_id} .wpep-alert-coupon`).length > 0 ) {
					jQuery(`#theForm-${form_id} .wpep-alert-coupon`).remove();
				}
				jQuery( 'form[data-id="' + form_id + '"] .display' ).text( $selected_value );
				jQuery( 'form[data-id="' + form_id + '"] .display' ).next().next( 'input[name="one_unit_cost"]' ).val( $selected_value ).trigger('change');
				jQuery( 'form[data-id="' + form_id + '"] .display' ).next( 'input[name="wpep-selected-amount"]' ).val( $selected_value ).trigger('change');
				jQuery( 'form[data-id="' + form_id + '"] .wpep-single-form-submit-btn' ).removeClass( 'wpep-disabled' );
				jQuery( 'form[data-id="' + form_id + '"] .wpep-wizard-form-submit-btn' ).removeClass( 'wpep-disabled' );

				if (jQuery( '.paynowDrop option:selected' ).text() == "Other") {
					jQuery( 'form[data-id="' + form_id + '"] .showPayment' ).addClass( 'shcusIn' );
					jQuery( 'form[data-id="' + form_id + '"] .showPayment input' ).val( '' );
				} else {
					jQuery( 'form[data-id="' + form_id + '"] .showPayment' ).removeClass( 'shcusIn' );
					jQuery( 'form[data-id="' + form_id + '"] .showPayment input' ).val( '' );
				}

			}
		);

		jQuery( '.wpep-single-form-submit-btn' ).click(
			function () {

				var form_id = jQuery( this ).parents( 'form' ).data( 'id' );

				var result1 = jQuery( "#theForm-" + form_id + " .wizard-fieldset.show .fieldMainWrapper div.wpep-required input" ).filter(
					function () {
						return jQuery.trim( jQuery( this ).val() ).length == 0
					}
				).length == 0;

				// client side validation
				var result2    = false;
				var emailCheck = false;
				var wpepError  = '';
				var termCond   = false;

				jQuery( "#theForm-" + form_id + " .wizard-fieldset.show .fieldMainWrapper div.wpep-required" ).each(
					function(){
						// console.log('test');
						var current = jQuery( this );

						wpepError = jQuery( '<span />' ).attr( 'class', 'wpepError' ).html( 'Required Field' );

						if (current.find( 'input[type="text"]' ).length > 0) {

							if (current.find( 'input[type="text"]' ).val() == '' || current.find( 'input[type="text"]' ).val() == undefined) {
								// console.log('input is empty ');
								if (current.find( 'input[type="text"] ~ .wpepError' ).length == 0) {
									jQuery( wpepError ).insertAfter( current.find( 'input[type="text"]' ) );
								}
								result2 = false;
								// return false;
							} else {
								wpepError = '';
								current.find( '.wpepError' ).remove();
								result2 = true;
								// console.log('input value: '+ current.find('input').not(':input[type="email"]').val());
							}
						}

						if (current.find( 'textarea' ).length > 0) {

							if (current.find( 'textarea' ).val() == '' || current.find( 'textarea' ).val() == undefined) {
								// console.log('input is empty ');
								if (current.find( 'textarea ~ .wpepError' ).length == 0) {
									jQuery( wpepError ).insertAfter( current.find( 'textarea' ) );
								}
								result2 = false;
								// return false;
							} else {
								wpepError = '';
								current.find( '.wpepError' ).remove();
								result2 = true;
								// console.log('input value: '+ current.find('input').not(':input[type="email"]').val());
							}
						}

						if (current.find( 'select' ).length > 0) {
							if (current.find( 'select' ).val() == '' || current.find( 'select' ).val() == undefined) {
								if (current.find( 'select ~ .wpepError' ).length == 0) {
									jQuery( wpepError ).insertAfter( current.find( 'select' ) );
								}
								result2 = false;
							} else {
								wpepError = '';
								current.find( '.wpepError' ).remove();
								result2 = true;
							}
						}

						if (current.find( 'input[type="tel"]' ).length > 0) {

							if (current.find( 'input[type="tel"]' ).val() == '' || current.find( 'input[type="tel"]' ).val() == undefined) {
								// console.log('input is empty ');
								if (current.find( 'input[type="tel"] ~ .wpepError' ).length == 0) {
									jQuery( wpepError ).insertAfter( current.find( 'input[type="tel"]' ) );
								}
								result2 = false;
								// return false;
							} else {
								wpepError = '';
								current.find( '.wpepError' ).remove();
								result2 = true;
								// console.log('input value: '+ current.find('input').not(':input[type="email"]').val());
							}
						}

						if (current.find( 'input[type="password"]' ).length > 0) {

							if (current.find( 'input[type="password"]' ).val() == '' || current.find( 'input[type="password"]' ).val() == undefined) {
								// console.log('input is empty ');
								if (current.find( 'input[type="password"] ~ .wpepError' ).length == 0) {
									jQuery( wpepError ).insertAfter( current.find( 'input[type="password"]' ) );
								}
								result2 = false;
								// return false;
							} else {
								wpepError = '';
								current.find( '.wpepError' ).remove();
								result2 = true;
							}
						}

						if (current.find( 'input[type="color"]' ).length > 0) {

							if (current.find( 'input[type="color"]' ).val() == '' || current.find( 'input[type="color"]' ).val() == undefined) {
								// console.log('input is empty ');
								if (current.find( 'input[type="color"] ~ .wpepError' ).length == 0) {
									jQuery( wpepError ).insertAfter( current.find( 'input[type="color"]' ) );
								}
								result2 = false;
								// return false;
							} else {
								wpepError = '';
								current.find( '.wpepError' ).remove();
								result2 = true;
							}
						}

						if (jQuery( '#theForm-' + form_id ).find( 'input[type="checkbox"]' ).length > 0) {

							// for checkbox input we need name because we can select atleast one at a time in group checkbox.
							var checkboxName = current.find( 'input[type="checkbox"]' ).attr( 'name' );

							if (checkboxName != undefined) {
								if ( ! (jQuery( '#theForm-' + form_id ).find( 'input[name="' + checkboxName + '"]' ).is( ':checked' )) ) {
									if (jQuery( '#theForm-' + form_id ).find( 'input[name="' + checkboxName + '"] ~ .wpepError' ).length == 0) {
										jQuery( wpepError ).insertAfter( current.find( 'input[name="' + checkboxName + '"]' ) );
									}
									result2 = false;
									// return false;
								} else {
									wpepError = '';
									jQuery( '#theForm-' + form_id ).find( 'input[name="' + checkboxName + '"] ~ .wpepError' ).remove();
									result2 = true;
								}
							}
						}

						if (jQuery( '#theForm-' + form_id ).find( 'input[type="radio"]' ).length > 0) {

							// for radio input we need name because we can select only one at a time.
							var radioName = current.find( 'input[type="radio"]' ).attr( 'name' );

							if (radioName != undefined) {
								if ( ! (jQuery( '#theForm-' + form_id ).find( 'input[name="' + radioName + '"]' ).is( ':checked' )) ) {
									if (jQuery( '#theForm-' + form_id ).find( 'input[name="' + radioName + '"] ~ .wpepError' ).length == 0) {
										jQuery( wpepError ).insertAfter( current.find( 'input[name="' + radioName + '"]' ) );
									}
									result2 = false;
								} else {
									wpepError = '';
									jQuery( '#theForm-' + form_id ).find( 'input[name="' + radioName + '"] ~ .wpepError' ).remove();
									result2 = true;
								}
							}
						}

						if (current.find( 'input[type="email"]' ).length > 0) {

							if (current.find( 'input[type="email"]' ).val() == '' || current.find( 'input[type="email"]' ).val() == undefined || validateEmail( current.find( 'input[type="email"]' ).val() ) == false ) {
								if (current.find( 'input[type="email"] ~ .wpepError' ).length == 0) {
									jQuery( wpepError ).insertAfter( current.find( 'input[type="email"]' ) );
								}
								emailCheck = false;

							} else {
								wpepError = '';
								current.find( '.wpepError' ).remove();
								emailCheck = true;

							}
						}

						if (current.find( 'input[type="date"]' ).length > 0) {

							if (current.find( 'input[type="date"]' ).val() == '' || current.find( 'input[type="date"]' ).val() == undefined) {
								if (current.find( 'input[type="date"] ~ .wpepError' ).length == 0) {
									jQuery( wpepError ).insertAfter( current.find( 'input[type="date"]' ) );
								}
								result2 = false;

							} else {
								wpepError = '';
								current.find( '.wpepError' ).remove();
								result2 = true;

							}
						}

						if (jQuery( '#theForm-' + form_id ).find( 'input[type="file"]' ).length) {

							if (jQuery( '#theForm-' + form_id ).find( 'input[type="file"]' ).val() !== '') {

								var file = jQuery( '#theForm-' + form_id ).find( 'input[type="file"]' ).val();
								var ext  = file.split( '.' ).pop();

								if ( 'exe' == ext || 'dll' == ext || 'deb' == ext ) {

									if ( jQuery( '#theForm-' + form_id ).find( 'input[type="file"] ~ .wpepError' ).length == 0 ) {

										alert( 'That file looks suspecious! Please upload another with supported extension.' );
										result2 = false;

									}
								}

							}

						}

						if (current.find( 'input[type="url"]' ).length > 0) {

							if (current.find( 'input[type="url"]' ).val() == '' || current.find( 'input[type="url"]' ).val() == undefined) {
								if (current.find( 'input[type="url"] ~ .wpepError' ).length == 0) {
									jQuery( wpepError ).insertAfter( current.find( 'input[type="url"]' ) );
								}
								result2 = false;
							} else {
								wpepError = '';
								current.find( '.wpepError' ).remove();
								result2 = true;
							}
						}

					}
				);

				var termContainer = jQuery( "#theForm-" + form_id + " #termsCondition-" + form_id ).is( ':checked' );

				if (termContainer == false) {
					if (jQuery( "#theForm-" + form_id + " div.termsCondition.wpep-required" ).find( '.wpepError' ).length == 0) {
						wpepError = jQuery( '<span />' ).attr( 'class', 'wpepError' ).html( 'Required Field' );
						jQuery( "#theForm-" + form_id + " div.termsCondition.wpep-required" ).append( jQuery( wpepError ) );
					}
					termCond = false;
				} else {
					wpepError = '';
					jQuery( "#theForm-" + form_id + " div.termsCondition.wpep-required" ).find( '.wpepError' ).remove();
					termCond = true;
				}

				var current           = jQuery( this );
				var result3           = false;
				var next              = jQuery( this );
				var currentActiveStep = jQuery( this ).parents( '.form-wizard' ).find( '.form-wizard-steps .active' );

				if (current.find( '.display' ).next( 'input[name="wpep-selected-amount"]' ).length > 0) {

					if (current.find( '.display' ).next( 'input[name="wpep-selected-amount"]' ).val() == '' || current.find( '.display' ).next( 'input[name="wpep-selected-amount"]' ).val() == undefined) {
						result3 = false;
						return false;
					} else {
						result3 = true;
						// console.log('input value: '+ current.find('.display').next('input[name="wpep-selected-amount"]').val());
					}
				}

				var selected_payment_tab = current.parents( 'form' ).find( 'ul.wpep_tabs li.tab-link.current' ).data( 'tab' );

				var finalCheck = jQuery( "#theForm-" + form_id + " .wizard-fieldset.show .fieldMainWrapper div.wpep-required" ).find( "span.wpepError" ).length;

				// if payment type is credit card
				if (selected_payment_tab == 'creditCard' && result1 == true && result2 == true && result3 == true && emailCheck == true && wpepError == '' && termCond == true && finalCheck == 0) {

					onGetCardNonce( event, form_id );

				} else if (selected_payment_tab == 'googlePay' && result1 == true && result2 == true && result3 == true && emailCheck == true && wpepError == '' && termCond == true && finalCheck == 0) { // if payment type is google pay

					onGetCardNonce( event, form_id );

				} else {
					return false;
				}

			}
		);

		jQuery( '.paynow' ).click(
			function () {

				var form_id = jQuery( this ).parents( 'form' ).data( 'id' );
				
				if ( jQuery(`#theForm-${form_id} input[name="wpep-discount"]`).length > 0 ) { 
					jQuery(`#theForm-${form_id} input[name="wpep-discount"]`).remove();
				}

				if ( jQuery(`#theForm-${form_id} .wpep-alert-coupon`).length > 0 ) {
					jQuery(`#theForm-${form_id} .wpep-alert-coupon`).remove();
				}

				jQuery( 'form[data-id="' + form_id + '"] .display' ).text( jQuery( this ).text() );
				jQuery( 'form[data-id="' + form_id + '"] .display' ).next().next( 'input[name="one_unit_cost"]' ).val( jQuery( this ).text() ).trigger('change');
				jQuery( 'form[data-id="' + form_id + '"] .display' ).next( 'input[name="wpep-selected-amount"]' ).val( jQuery( this ).text() ).trigger('change');
				//jQuery( '#one_unit_cost' ).val( jQuery( this ).text().trim() );
				jQuery( '#wpep_quantity_' + form_id ).val( 1 );
				jQuery( 'form[data-id="' + form_id + '"] .wpep-single-form-submit-btn' ).removeClass( 'wpep-disabled' );
				jQuery( 'form[data-id="' + form_id + '"] .wpep-wizard-form-submit-btn' ).removeClass( 'wpep-disabled' );

				jQuery( 'form[data-id="' + form_id + '"] .showPayment' ).removeClass( 'shcusIn' );
				jQuery( 'form[data-id="' + form_id + '"] .customPayment' ).text( jQuery( this ).val() );

				// jQuery('#wpep_amount_'+form_id).val(jQuery(this).text().replace('$',''));
			}
		);


		function prepare_display_amount(currencyType, currency, val) {

			if (currencyType == 'symbol') {

				if (currency == 'USD') {
					currency = '$' + val;
				}

				if (currency == 'CAD') {
					currency = 'C$' + val;
				}

				if (currency == 'AUD') {
					currency = 'A$' + val;
				}

				if (currency == 'JPY') {
					currency = '¥' + val;
				}

				if (currency == 'GBP') {
					currency = '£' + val;
				}

			} else {

				currency = val + ' ' + currency;

			}

			return currency;

		}

		jQuery( '.otherPayment' ).on(
			'change',
			function (e) {

				var form_id      = jQuery( this ).parents( 'form' ).data( 'id' );
				var currency     = jQuery( this ).parents( 'form' ).data( 'currency' );
				var currencyType = jQuery( this ).parents( 'form' ).data( 'currency-type' );
				var max          = parseFloat( jQuery( this ).attr( 'max' ) );
				var min          = parseFloat( jQuery( this ).attr( 'min' ) );
				var val          = jQuery( this ).val();
				jQuery( '#one_unit_cost' ).val( val );
				jQuery( '#wpep_quantity_' + form_id ).val( 1 );

				if ( jQuery(`#theForm-${form_id} input[name="wpep-discount"]`).length > 0 ) { 
					jQuery(`#theForm-${form_id} input[name="wpep-discount"]`).remove();
				}
			
				if ( jQuery(`#theForm-${form_id} .wpep-alert-coupon`).length > 0 ) {
					jQuery(`#theForm-${form_id} .wpep-alert-coupon`).remove();
				}

		

				if (val != '' && val >= min && val <= max) {

					currency = prepare_display_amount(currencyType, currency, val);
				
					jQuery( this ).val( val );
					jQuery( 'form[data-id="' + form_id + '"] .display' ).text( currency );
					jQuery( 'form[data-id="' + form_id + '"] .display' ).next( 'input[name="wpep-selected-amount"]' ).val( jQuery( this ).val() ).trigger('change');
					jQuery( 'form[data-id="' + form_id + '"] .wpep-single-form-submit-btn' ).removeClass( 'wpep-disabled' );
					jQuery( 'form[data-id="' + form_id + '"] .wpep-wizard-form-submit-btn' ).removeClass( 'wpep-disabled' );

				} else {

					currency = prepare_display_amount(currencyType, currency);
					
					jQuery( this ).val( '' );
					jQuery( 'form[data-id="' + form_id + '"] .display' ).text( '' );
					jQuery( 'form[data-id="' + form_id + '"] .display' ).next( 'input[name="wpep-selected-amount"]' ).val( '' ).trigger('change');
					jQuery( 'form[data-id="' + form_id + '"] .wpep-single-form-submit-btn' ).addClass( 'wpep-disabled' );
					jQuery( 'form[data-id="' + form_id + '"] .wpep-wizard-form-submit-btn' ).addClass( 'wpep-disabled' );
				}

			}
		);

		jQuery( '.minus-btn' ).on(
			'click',
			function (e) {
				e.preventDefault();
				var $this  = $( this );
				var $input = $this.closest( 'div' ).find( 'input' );
				var value  = parseFloat( $input.val() );

				if (value > 1) {
					value = value - 1;
				} else {
					value = 0;
				}

				$input.val( value );

			}
		);

		jQuery( '.plus-btn' ).on(
			'click',
			function (e) {
				e.preventDefault();
				var $this  = $( this );
				var $input = $this.closest( 'div' ).find( 'input' );
				var value  = parseFloat( $input.val() );

				if (value < 100) {
					value = value + 1;
				} else {
					value = 100;
				}

				$input.val( value );
			}
		);

		jQuery( '.like-btn' ).on(
			'click',
			function () {
				$( this ).toggleClass( 'is-active' );
			}
		);

		jQuery( "#btn-download" ).click(
			function () {
				$( this ).toggleClass( "downloaded" );
			}
		);

		jQuery( 'ul.wpep_tabs li' ).click(
			function () {
				var tab_id = jQuery( this ).attr( 'data-tab' );

				jQuery( 'ul.wpep_tabs li' ).removeClass( 'current' );
				jQuery( '.tab-content' ).removeClass( 'current' );

				jQuery( this ).addClass( 'current' );
				jQuery( "#" + tab_id ).addClass( 'current' );
			}
		);

		function validateEmail(email) {
			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test( String( email ).toLowerCase() );
		}

		jQuery( ".cardsBlock01 input[name$='savecards']" ).click(
			function () {
				var test = jQuery( this ).val();

				jQuery( "div.desc" ).hide();
				jQuery( "#cardContan" + test ).show();
			}
		);

		jQuery( ".custom-select" ).each(
			function() {

				var classes     = jQuery( this ).attr( "class" ),
				id              = jQuery( this ).attr( "id" ),
				name            = jQuery( this ).attr( "name" );
				var placeholder = 'Please Select';

				if (jQuery( this ).attr( "placeholder" ) !== undefined) {
					placeholder = jQuery( this ).attr( "placeholder" );
				}

				var template = '<div class="' + classes + '">';
				template    +=
				'<span class="custom-select-trigger">' +
				placeholder +
				"</span>";
				template    += '<div class="custom-options">';
				jQuery( this )
				.find( "option" )
				.each(
					function() {
						template +=
						'<span class="custom-option ' +
						jQuery( this ).attr( "class" ) +
						'" data-value="' +
						jQuery( this ).attr( "value" ) +
						'">' +
						jQuery( this ).html() +
						"</span>";
					}
				);
				template += "</div></div>";

				jQuery( this ).wrap( '<div class="custom-select-wrapper"></div>' );
				jQuery( this ).hide();
				jQuery( this ).after( template );

			}
		);

		jQuery( ".custom-option:first-of-type" ).hover(
			function() {
				jQuery( this )
					.parents( ".custom-options" )
					.addClass( "option-hover" );
			},
			function() {
				jQuery( this )
					.parents( ".custom-options" )
					.removeClass( "option-hover" );
			}
		);
		jQuery( ".custom-select-trigger" ).on(
			"click",
			function() {
				jQuery( "html" ).one(
					"click",
					function() {
						jQuery( ".custom-select" ).removeClass( "opened" );
					}
				);
				jQuery( this )
				.parents( ".custom-select" )
				.toggleClass( "opened" );
				event.stopPropagation();
			}
		);
		jQuery( ".custom-option" ).on(
			"click",
			function() {
				jQuery( this )
				.parents( ".custom-select-wrapper" )
				.find( "select" )
				.val( jQuery( this ).data( "value" ) );
				jQuery( this )
				.parents( ".custom-options" )
				.find( ".custom-option" )
				.removeClass( "selection" );
				jQuery( this ).addClass( "selection" );
				jQuery( this )
				.parents( ".custom-select" )
				.removeClass( "opened" );
				jQuery( this )
				.parents( ".custom-select" )
				.find( ".custom-select-trigger" )
				.text( jQuery( this ).text() );
			}
		);

		jQuery( ".file-upload-wrapper" ).on(
			"change",
			".file-upload-field",
			function () {
				jQuery( this ).parent( ".file-upload-wrapper" ).attr( "data-text", jQuery( this ).val().replace( /.*(\/|\\)/, '' ) );
			}
		);

		jQuery( ".form-control" ).on(
			'focus',
			function () {
				var tmpThis = jQuery( this ).val();
				if (tmpThis == '') {
					jQuery( this ).parent().addClass( "focus-input" );
				} else if (tmpThis != '') {
					jQuery( this ).parent().addClass( "focus-input" );
				}
			}
		).on(
			'blur',
			function () {
				var tmpThis = jQuery( this ).val();
				if (tmpThis == '') {
					jQuery( this ).parent().removeClass( "focus-input" );
					jQuery( this ).siblings( '.wizard-form-error' ).slideDown( "3000" );
				} else if (tmpThis != '') {
					jQuery( this ).parent().addClass( "focus-input" );
					jQuery( this ).siblings( '.wizard-form-error' ).slideUp( "3000" );
				}
			}
		);

		jQuery( ".otherpayment" ).click(
			function () {
				var form_id = jQuery( this ).parents( 'form' ).data( 'id' );
				jQuery( 'form[data-id="' + form_id + '"] .showPayment' ).addClass( 'shcusIn' );
				jQuery( 'form[data-id="' + form_id + '"] .display' ).empty();
				jQuery( 'form[data-id="' + form_id + '"] .wpep-single-form-submit-btn' ).addClass( 'wpep-disabled' );
				jQuery( 'form[data-id="' + form_id + '"] .wpep-wizard-form-submit-btn' ).addClass( 'wpep-disabled' );
				jQuery( 'form[data-id="' + form_id + '"] .showPayment input' ).val( '' );
			}
		);

	}
);
