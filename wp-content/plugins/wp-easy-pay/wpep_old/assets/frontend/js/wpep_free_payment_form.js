const paymentForm = new SqPaymentForm(
	{
		// Initialize the payment form elements

		// TODO: Replace with your sandbox application ID
		applicationId: wpep_local_vars.square_application_id,
		locationId: wpep_local_vars.square_location_id_in_use,
		inputClass: 'sq-input',
		autoBuild: false,
		// Customize the CSS for SqPaymentForm iframe elements
		inputStyles: [{
			fontSize: '16px',
			lineHeight: '24px',
			padding: '16px',
			placeholderColor: '#a0a0a0',
			backgroundColor: 'transparent',
		}],
		// Initialize the credit card placeholders
		cardNumber: {
			elementId: 'sq-card-number',
			placeholder: 'Card Number'
		},
		cvv: {
			elementId: 'sq-cvv',
			placeholder: 'CVV'
		},
		expirationDate: {
			elementId: 'sq-expiration-date',
			placeholder: 'MM/YY'
		},
		postalCode: {
			elementId: 'sq-postal-code',
			placeholder: 'Postal'
		},

		callbacks: {

			cardNonceResponseReceived: function (errors, nonce, cardData) {

				jQuery( '.wpep-alert' ).remove();

				if ('popup' == wpep_local_vars.wpep_free_form_display_type) {
					jQuery( '.otherpInput' ).hide();
					jQuery( '.btnGroup' ).hide();
					jQuery( ".popup-inner" ).append( jQuery( '<div />' ).attr( 'class', 'wpepLoader puppa' ).html( '<div class="initial-load-animation"><div class="payment-image icomoonLib"><span class="icon-pay"></span></div><div class="loading-bar"><div class="blue-bar"></div></div></div>' ) );
				}

				if ('on_page' == wpep_local_vars.wpep_free_form_display_type) {
					jQuery( "#theForm-1" ).append( jQuery( '<div />' ).attr( 'class', 'wpepLoader puppa' ).html( '<div class="initial-load-animation"><div class="payment-image icomoonLib"><span class="icon-pay"></span></div><div class="loading-bar"><div class="blue-bar"></div></div></div>' ) );
				}

				if (errors) {
					setTimeout(
						function () {
							jQuery( '.wpepLoader' ).remove();
							errors.forEach(
								function (error) {

									if (error.message) {
										jQuery( "#theForm-1 #creditCard" ).prepend( '<div class="wpep-alert wpep-alert-danger wpep-alert-dismissable"><a href="#" data-dismiss="alert" class="wpep-alert-close">×</a>' + error.message + '</div>' );
									}
								}
							);
						},
						1500
					);
				} else {

					if (wpep_local_vars.form_type == 'donation' && wpep_local_vars.user_defined_amount == 'on') {

						var first_name = jQuery( "#theForm-1 input[name='wpep-first-name-field']" ).val();
						var last_name  = jQuery( "#theForm-1 input[name='wpep-last-name-field']" ).val();
						var email      = jQuery( "#theForm-1 input[name='wpep-email-field']" ).val();
						var amount     = jQuery( '#wpep_user_defined_amount' ).val();

					} else {

						var first_name = jQuery( "#theForm-1 input[name='wpep-first-name-field']" ).val();
						var last_name  = jQuery( "#theForm-1 input[name='wpep-last-name-field']" ).val();
						var email      = jQuery( "#theForm-1 input[name='wpep-email-field']" ).val();
						var amount     = wpep_local_vars.form_user_defined_amount;

					}
					
		            
		            var amountByHundred = amount * 100;
					
					const verificationDetails = {
						intent: 'CHARGE',
						amount: parseInt(amountByHundred).toString(),
						currencyCode: wpep_local_vars.wpep_free_form_currency,
						billingContact: {
							givenName: first_name,
							familyName: last_name
						}
					};

					paymentForm.verifyBuyer(
						nonce,
						verificationDetails,
						function (err, verificationResult) {
							if (err == null) {

								var data = {
									'action': 'wpep_free_payment_request',
									'nonce': nonce,
									'first_name': first_name,
									'last_name': last_name,
									'email': email,
									'amount': amountByHundred,
									'verification_token': verificationResult.token,
									 'ajax_nonce':  wpep_local_vars.ajax_nonce,  
								};

								jQuery.post(
									wpep_local_vars.ajax_url,
									data,
									function (response) {
										// console.log(response);
										if ('success' == response) {

											var current = jQuery( 'form#theForm-1' );
											current.find( '.wizard-fieldset' ).removeClass( "show", "400" );
											current.find( '.wizard-fieldset:last-child' ).addClass( "show wpep-ptb-150", "400" );
											current.find( '.wizard-fieldset:last-child' ).siblings().remove();
											jQuery( 'html, body' ).animate(
												{
													scrollTop: jQuery( "#theForm-1" ).offset().top - 50
												},
												800
											);

											var counter = wpep_local_vars.wpep_redirection_in_secs;

											current.find( '#counter' ).text( counter );

											if (wpep_local_vars.wpep_payment_success_url != '' && "yes" == wpep_local_vars.wpep_redirection_on_success) {
												setInterval(
													function () {
														counter--;
														if (counter >= 0) {
															span           = document.getElementById( "counter" );
															span.innerHTML = counter;
														}

														if (counter === 0) {
															window.location.href = wpep_local_vars.wpep_payment_success_url;
															clearInterval( counter );
														}

													},
													1000
												);

											} else {

												setInterval(
													function () {
														counter--;
														if (counter >= 0) {
															span           = document.getElementById( "counter" );
															span.innerHTML = counter;
														}

														if (counter === 0) {
															location.reload();
															clearInterval( counter );
														}

													},
													1000
												);
											}

										} else {

											var json_response = JSON.parse( response );
											jQuery( "#theForm-1 #creditCard" ).prepend( '<div class="wpep-alert wpep-alert-danger wpep-alert-dismissable"><a href="#" data-dismiss="alert" class="wpep-alert-close">×</a>' + json_response.detail + '</div>' );
											jQuery( 'html, body' ).animate(
												{
													scrollTop: jQuery( "#theForm-1 #creditCard" ).offset().top
												},
												800
											);

										}

									}
								).done(
									function () {

										jQuery( '.wpepLoader' ).remove();

									}
								);

							}
						}
					);

				}

			}

		}
	}
);


function wpep_onGetCardNonce(event) {
	// Don't submit the form until SqPaymentForm returns with a nonce
	event.preventDefault();
	// Request a nonce from the SqPaymentForm object
	paymentForm.requestCardNonce();
}

paymentForm.build();

// focus on input field check empty or not
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


if ('off' == wpep_local_vars.user_defined_amount || '1' == wpep_local_vars.user_defined_amount) {

	jQuery( '.wpep-free-form-submit-btn' ).removeClass( 'wpep-disabled' );

	jQuery( '#showPayment' ).removeClass( 'shcusIn' );

	jQuery( '.wpep-free-form-submit-btn .display' ).text( wpep_local_vars.form_user_defined_amount + ' ' + wpep_local_vars.wpep_free_form_currency );

	jQuery( '.wpep-free-form-submit-btn .display' ).next( 'input[name="wpep-selected-amount"]' ).val( wpep_local_vars.form_user_defined_amount );

} else {

	jQuery( '.wpep-free-form-submit-btn' ).addClass( 'wpep-disabled' );

	jQuery( '#showPayment' ).addClass( 'shcusIn' );

	jQuery( '.wpep-free-form-submit-btn .display' ).text( '' );

	jQuery( '.wpep-free-form-submit-btn .display' ).next( 'input[name="wpep-selected-amount"]' ).val( '' );

}

jQuery( '#showPayment' ).on(
	'copy paste keyup click',
	'.customPayment',
	function () {

		var amount = jQuery( this ).val();

		if ('' == amount) {

			jQuery( '.wpep-free-form-submit-btn' ).addClass( 'wpep-disabled' );

			jQuery( '.wpep-free-form-submit-btn .display' ).text( '' );

			jQuery( '.wpep-free-form-submit-btn .display' ).next( 'input[name="wpep-selected-amount"]' ).val( '' );

		} else {

			jQuery( '.wpep-free-form-submit-btn' ).removeClass( 'wpep-disabled' );

			jQuery( '.wpep-free-form-submit-btn .display' ).text( amount + ' ' + wpep_local_vars.wpep_free_form_currency );

			jQuery( '.wpep-free-form-submit-btn .display' ).next( 'input[name="wpep-selected-amount"]' ).val( amount );

		}
	}
);

// click on form submit for single form type button mufaddal version
jQuery( document ).on(
	"click",
	".free_form_page .wpep-free-form-submit-btn",
	function () {

		var form_id = jQuery( this ).parents( 'form' ).data( 'id' );

		var current = jQuery( this );

		var result1 = jQuery( "#theForm-" + form_id + " .wizard-fieldset.show .fieldMainWrapper > div.wpep-required input" ).filter(
			function () {
				return jQuery.trim( jQuery( this ).val() ).length == 0
			}
		).length == 0;

		// client side validation
		var result2    = false;
		var emailCheck = false;
		var wpepError  = '';

		jQuery( "#theForm-" + form_id + " .wizard-fieldset.show .fieldMainWrapper > div.wpep-required" ).each(
			function () {

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

				if (current.find( 'input[type="email"]' ).length > 0) {

					if (current.find( 'input[type="email"]' ).val() == '' || current.find( 'input[type="email"]' ).val() == undefined || wpep_validateEmail( current.find( 'input[type="email"]' ).val() ) == false) {
						if (current.find( 'input[type="email"] ~ .wpepError' ).length == 0) {
							jQuery( wpepError ).insertAfter( current.find( 'input[type="email"]' ) );
						}
						emailCheck = false;
						// return false;
					} else {
						wpepError = '';
						current.find( '.wpepError' ).remove();
						emailCheck = true;
						// console.log('input value: '+ current.find('input[type="email"]').val());
					}
				}

			}
		);

		if (current.find( '.display' ).next( 'input[name="wpep-selected-amount"]' ).length > 0) {

			// console.log('I am here!');

			if (current.find( '.display' ).next( 'input[name="wpep-selected-amount"]' ).val() == '' || current.find( '.display' ).next( 'input[name="wpep-selected-amount"]' ).val() == undefined || result1 == false || result2 == false || emailCheck == false || wpepError != '') {

				return false;

			} else {

				wpep_onGetCardNonce( event, form_id );
			}
		}
	}
);

jQuery( document ).on(
	'click',
	'a[data-dismiss="alert"]',
	function (e) {

		e.preventDefault();

		var This = jQuery( this ).parent();

		This.fadeOut( '500' );

		This.remove();

	}
);

jQuery( window ).load(
	function () {

		jQuery( '.free_form_page' ).show();
		// jQuery('form').find('input[type="text"], input[type="email"], input[type="number"], input[type="date"]').attr('autocomplete', 'off');
	}
);

function wpep_validateEmail(email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test( String( email ).toLowerCase() );
}
