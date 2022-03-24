var wpep_paymentForm = {};

if (jQuery( 'form.wpep_payment_form' ).length > 0) {

	jQuery( 'form.wpep_payment_form' ).each(
		function () {

			var current_form_id = jQuery( this ).data( 'id' );
			var currency        = jQuery( this ).data( 'currency' );
			calculate( current_form_id, currency );

			jQuery('.qty').keyup(function(){
				calculate( current_form_id, currency )
			});

			if (wpep_local_vars.logged_in_user_email != '') {

				jQuery( 'form[data-id="' + current_form_id + '"] input[name="wpep-email-field"]' ).val( wpep_local_vars.logged_in_user_email );
				jQuery( 'form[data-id="' + current_form_id + '"] input[name="wpep-email-field"]' ).parent( 'div.wpep-required' ).addClass( 'focus-input' );

			}

			if (wpep_local_vars.first_name != '') {

				jQuery( 'form[data-id="' + current_form_id + '"] input[name="wpep-first-name-field"]' ).val( wpep_local_vars.first_name );
				jQuery( 'form[data-id="' + current_form_id + '"] input[name="wpep-first-name-field"]' ).parent( 'div.wpep-required' ).addClass( 'focus-input' );

			}

			if (wpep_local_vars.last_name != '') {

				jQuery( 'form[data-id="' + current_form_id + '"] input[name="wpep-last-name-field"]' ).val( wpep_local_vars.last_name );
				jQuery( 'form[data-id="' + current_form_id + '"] input[name="wpep-last-name-field"]' ).parent( 'div.wpep-required' ).addClass( 'focus-input' );

			}
			wpep_paymentForm[current_form_id] = new SqPaymentForm(
				{

					applicationId: wpep_local_vars.square_application_id,
					locationId: wpep_local_vars.square_location_id_in_use,
					googlePay: {
						elementId: 'sq-google-pay'
					},
					applePay: {
						elementId: 'sq-apple-pay'
					},
					masterpass: {
						elementId: 'sq-src'
					},
					inputClass: 'sq-input',
					autoBuild: false,
					inputStyles: [{
						fontSize: '16px',
						lineHeight: '24px',
						padding: '16px',
						placeholderColor: '#a0a0a0',
						backgroundColor: 'transparent',
					}],
					cardNumber: {
						elementId: 'sq-card-number-' + current_form_id,
						placeholder: 'Card Number'
					},
					cvv: {
						elementId: 'sq-cvv-' + current_form_id,
						placeholder: 'CVV'
					},
					expirationDate: {
						elementId: 'sq-expiration-date-' + current_form_id,
						placeholder: 'MM/YY'
					},
					postalCode: {
						elementId: 'sq-postal-code-' + current_form_id,
						placeholder: jQuery( this ).data( 'postal' )
					},
					callbacks: {
						cardNonceResponseReceived: function (errors, nonce, cardData) {
							wpep_pay_from_nonce( errors, nonce, cardData, current_form_id );
						},
						methodsSupported: function (methods, unsupportedReason) {
							var googlePayBtn = document.getElementById( 'sq-google-pay' );
							if (methods.googlePay === true) {
								googlePayBtn.style.display = 'inline-block';
							} else {
								// console.log(unsupportedReason);
							}


							var applePayBtn = document.getElementById('sq-apple-pay');

							if (methods.applePay === true) {
							  	applePayBtn.style.display = 'inline-block';
							} else {
							//   console.log(unsupportedReason);
							}

							const srcBtn = document.getElementById('sq-src');

							// Only show the button if src is enabled
							if (methods.masterpass === true) {
							  srcBtn.style.display = 'inline-block';
							  srcBtn.style.backgroundImage   =`url(${wpep_paymentForm[current_form_id].masterpassImageUrl()})`

							} else {
							//   console.log(unsupportedReason);
							}

						},
						createPaymentRequest: function () {

							var first_name = jQuery( "#theForm-" + current_form_id + " input[name='wpep-first-name-field']" ).val();
							var last_name  = jQuery( "#theForm-" + current_form_id + " input[name='wpep-last-name-field']" ).val();
							var email      = jQuery( "#theForm-" + current_form_id + " input[name='wpep-email-field']" ).val();

							var currencies = ['CAD', 'USD', 'EUR', 'JPY', 'AUD', 'GBP'];
							var currency_symbols = ['C$', 'A$', '¥', '£', '€', '$'];
							var amount = jQuery( '#amount_display_' + current_form_id ).text().match( /\d+/g ).map( Number );


							if (amount[1] !== undefined) {
								amount = amount[0] + '.' + amount[1];
							} else {
								amount = amount[0];
							}

							return {
								requestShippingAddress: false,
								requestBillingInfo: false,
								shippingContact: {
									familyName: last_name,
									givenName: first_name,
									email: email
								},
								total: {
									label: first_name + ' ' + last_name,
									amount: amount.toString(),
									pending: false
								},
								lineItems: [
								{
									label: "Subtotal",
									amount: amount.toString(),
									pending: false
								},
								]
							}
						}

					}

				}
			);

			wpep_paymentForm[current_form_id].build();
		}
	);

}

function onGetCardNonce(event, current_form_id) {
	event.preventDefault();

	$payment_nature = wpep_check_payment_nature( current_form_id );

	if ($payment_nature === 'nonce') {
		wpep_paymentForm[current_form_id].requestCardNonce();
	}

}


function wpep_check_payment_nature(current_form_id) {

		wpep_send_captcha_verification( current_form_id );

	if (jQuery( 'input[name="card_on_file"]' ).is( ':checked' )) {

		var card_on_file = jQuery( 'input[name="card_on_file"]' ).val();
		wpep_pay_from_nonce( errors = false, nonce = false, cardData = false, current_form_id, card_on_file );

	} else {

		return 'nonce';
	}
}

function wpep_send_captcha_verification(current_form_id) {

	var recaptcha_response = jQuery( 'form[data-id="' + current_form_id + '"] .g-recaptcha-response' ).val();
	var data               = {
		'action': 'wpep_recaptcha_verification',
		'recaptcha_response': recaptcha_response
	};

	jQuery.post(
		wpep_local_vars.ajax_url,
		data,
		function (response) {

		}
	).done( function () {} );

}

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


setTimeout(
	function () {

		// console.clear();
	},
	3000
);

// loading for payment
setInterval(
	function () {

		setTimeout(
			function () {
				jQuery( '.initial-load-animation' ).addClass( 'fade-load' );
			},
			5000
		);

		setTimeout(
			function () {
				jQuery( '.initial-load-animation' ).removeClass( 'fade-load' );
			},
			7500
		);

	},
	7500
);


function wpep_delete_cof(customer_id, card_on_file, current_form_id, delete_id) {
	var data = {
		'action': 'wpep_delete_cof',
		'customer_id': customer_id,
		'card_on_file': card_on_file,
		'current_form_id': current_form_id
	};

	jQuery.post(
		wpep_local_vars.ajax_url,
		data,
		function (response) {

			if ('success' == response) {

				jQuery( '#' + delete_id ).closest( "li" ).remove();
			}

		}
	).done(
		function () {

		}
	);

}

function wpep_pay_from_nonce(errors = false, nonce = false, cardData = false, current_form_id = false, card_on_file = false) {

	jQuery( '.wpep-alert' ).remove();
	if (jQuery( "#theForm-" + current_form_id ).find( 'div' ).hasClass( 'wpep-popup' )) {
		jQuery( "#theForm-" + current_form_id ).find( 'div.wpep-content' ).append( jQuery( '<div />' ).attr( 'class', 'wpepLoader' ).html( '<div class="initial-load-animation"><div class="payment-image icomoonLib"><span class="icon-pay"></span></div><div class="loading-bar"><div class="blue-bar"></div></div></div>' ) );
	} else {
		jQuery( "#theForm-" + current_form_id ).append( jQuery( '<div />' ).attr( 'class', 'wpepLoader' ).html( '<div class="initial-load-animation"><div class="payment-image icomoonLib"><span class="icon-pay"></span></div><div class="loading-bar"><div class="blue-bar"></div></div></div>' ) );
	}

	if (errors) {

		setTimeout(
			function () {

				jQuery( '.wpepLoader' ).remove();
				errors.forEach(
					function (error) {

						if (error.message) {
							jQuery( "#theForm-" + current_form_id + " .paymentsBlocks" ).prepend( '<div class="wpep-alert wpep-alert-danger wpep-alert-dismissable"><a href="#" data-dismiss="alert" class="wpep-alert-close">×</a>' + error.message + '</div>' );
						}
					}
				);

			},
			1500
		);

	} else {

		// debugger;

		var first_name = jQuery( "#theForm-" + current_form_id + " input[name='wpep-first-name-field']" ).val();
		var last_name  = jQuery( "#theForm-" + current_form_id + " input[name='wpep-last-name-field']" ).val();
		var email      = jQuery( "#theForm-" + current_form_id + " input[name='wpep-email-field']" ).val();
		// debugger;
		var currencies = ['CAD', 'USD', 'EUR', 'JPY', 'AUD', 'GBP'];
		var currency_symbols = ['C$', 'A$', '¥', '£', '€', '$'];
		var amount = jQuery( '#amount_display_' + current_form_id ).text();
		amount = amount.replace(/,/g, '');
		amount     = amount.match( /\d+/g ).map( Number );
		// var amount     = jQuery( '#amount_display_' + current_form_id ).text();

		// currencies.forEach(function(item, index){
			
		// 	amount = amount.trim();
		// 	amount = amount.replace(currency_symbols[index], "");
		// 	amount = amount.replace(item, "");

		// });

		if (jQuery( '#theForm-' + current_form_id ).find( 'input[name="wpep-signup-amount"]' ).length > 0 && jQuery( "#theForm-" + current_form_id + " input[name='wpep-signup-amount']" ).val().length !=0 ) {
			var signup_amount = jQuery( "#theForm-" + current_form_id + " input[name='wpep-signup-amount']" ).val();
		} else {
			var signup_amount = 0;
		}
		if (amount[1] !== undefined) {
			amount = amount[0] + '.' + amount[1];
		} else {
			amount = amount[0];
		}
		var payment_type = jQuery( '#wpep_payment_form_type_' + current_form_id ).val();

		var form_values      = [];
		var selectedCheckbox = [];
		var checkLabel       = '';

		if (jQuery( '#theForm-' + current_form_id ).find( 'input[type="checkbox"]' ).length > 0) {

			var checkboxName = jQuery( '#theForm-' + current_form_id + ' input[type="checkbox"]' ).attr( 'name' );
			if (checkboxName != undefined) {
				jQuery( 'form[data-id="' + current_form_id + '"] input[name="' + checkboxName + '"]' ).each(
					function () {
						checkLabel = jQuery( this ).data( 'main-label' );
						if (jQuery( this ).is( ':checked' )) {
							selectedCheckbox.push( jQuery( this ).val() );
						}
					}
				);
			}

		}

		form_values.push(
			{
				label: checkLabel,
				value: selectedCheckbox.join( ", " )
			}
		);

		var product_label = [];
		jQuery( '.product_label' ).each(
			function(key, value) {
				var item_display = jQuery( this ).closest( '.wpItem' ).css( 'display' ) == 'none' ? 'no' : 'yes';

				if ('yes' == item_display) {
					product_label.push( jQuery( value ).text() );
				}
			}
		);

		var product_price = [];
		jQuery( '.price' ).each(
			function(key, value) {

				var item_display = jQuery( this ).closest( '.wpItem' ).css( 'display' ) == 'none' ? 'no' : 'yes';

				if ('yes' == item_display) {
					product_price.push( jQuery( value ).val() );
				}
			}
		);

		var product_qty = [];
		jQuery( '.qty' ).each(
			function(key, value) {

				var item_display = jQuery( this ).closest( '.wpItem' ).css( 'display' ) == 'none' ? 'no' : 'yes';

				if ('yes' == item_display) {
					if ('' !== jQuery( value ).val()) {
						product_qty.push( jQuery( value ).val() );
					}
				}
			}
		);

		var product_cost = [];
		jQuery( '.price' ).each(
			function(key, value) {

				var item_display = jQuery( this ).closest( '.wpItem' ).css( 'display' ) == 'none' ? 'no' : 'yes';

				if ('yes' == item_display) {
					product_cost.push( jQuery( value ).val() );
				}
			}
		);

		var products_data = {};
		jQuery.each(
			product_label ,
			function(key, value) {

				var tmp_product_data      = {};
				tmp_product_data.label    = product_label[key];
				tmp_product_data.quantity = product_qty[key];
				tmp_product_data.price    = product_price[key];
				tmp_product_data.cost     = product_cost[key];

				products_data[key] = tmp_product_data;

			}
		);

		products_data = JSON.stringify( products_data );

		if (jQuery( '#theForm-' + current_form_id ).find( 'input[type="radio"]' ).length > 0) {
			var radioName = jQuery( '#theForm-' + current_form_id + ' input[type="radio"]' ).attr( 'name' );
			if (radioName != undefined) {
				jQuery( 'form[data-id="' + current_form_id + '"] input[name="' + radioName + '"]' ).each(
					function () {

						if (jQuery( this ).is( ':checked' )) {
							form_values.push(
								{
									label: jQuery( this ).data( 'main-label' ),
									value: jQuery( this ).val()
								}
							);
						}

					}
				);
			}
		}

		form_values.push(
			{
				label: 'Products Data',
				value: products_data
			}
		);

		jQuery( 'form[data-id="' + current_form_id + '"] input[type="date"]' ).each(
			function () {

				if (jQuery( this ).data( 'label' ) !== '' && typeof jQuery( this ).data( 'label' ) !== 'undefined') {
					form_values.push(
						{
							label: jQuery( this ).data( 'label' ),
							value: jQuery( this ).val()
						}
					);
				}

			}
		);

		jQuery( 'form[data-id="' + current_form_id + '"] input[type="number"]' ).each(
			function () {
				if (jQuery( this ).data( 'label' ) !== '' && typeof jQuery( this ).data( 'label' ) !== 'undefined') {
					form_values.push(
						{
							label: jQuery( this ).data( 'label' ),
							value: jQuery( this ).val()
						}
					);
				}

			}
		);

		jQuery( 'form[data-id="' + current_form_id + '"] select' ).each(
			function () {

				var selMulti = jQuery.map(
					jQuery( 'form[data-id="' + current_form_id + '"] select option:selected' ),
					function (el, i) {
						return jQuery( el ).text();
					}
				);

				if (jQuery( this ).data( 'label' ) !== '' && typeof jQuery( this ).data( 'label' ) !== 'undefined') {
					form_values.push(
						{
							label: jQuery( this ).data( 'label' ),
							value: selMulti.join( ", " )
						}
					);
				}

			}
		);

		jQuery( 'form[data-id="' + current_form_id + '"] input[type="text"]' ).each(
			function () {

				if (jQuery( this ).data( 'label' ) !== '' && typeof jQuery( this ).data( 'label' ) !== 'undefined') {
					form_values.push(
						{
							label: jQuery( this ).data( 'label' ),
							value: jQuery( this ).val()
						}
					);
				}
			}
		);

		jQuery( 'form[data-id="' + current_form_id + '"] textarea' ).each(
			function () {

				if (jQuery( this ).data( 'label' ) !== '' && typeof jQuery( this ).data( 'label' ) !== 'undefined') {
					form_values.push(
						{
							label: jQuery( this ).data( 'label' ),
							value: jQuery( this ).val()
						}
					);
				}

			}
		);

		jQuery( 'form[data-id="' + current_form_id + '"] input[type="email"]' ).each(
			function () {

				if (jQuery( this ).data( 'label' ) !== '' && typeof jQuery( this ).data( 'label' ) !== 'undefined') {
					form_values.push(
						{
							label: jQuery( this ).data( 'label' ),
							value: jQuery( this ).val()
						}
					);
				}

			}
		);

		jQuery( 'form[data-id="' + current_form_id + '"] input[type="tel"]' ).each(
			function () {
				if (jQuery( this ).data( 'label' ) !== '' && typeof jQuery( this ).data( 'label' ) !== 'undefined') {
					form_values.push(
						{
							label: jQuery( this ).data( 'label' ),
							value: jQuery( this ).val()
						}
					);
				}

			}
		);

		jQuery( 'form[data-id="' + current_form_id + '"] input[type="password"]' ).each(
			function () {

				if (jQuery( this ).data( 'label' ) !== '' && typeof jQuery( this ).data( 'label' ) !== 'undefined') {
					form_values.push(
						{
							label: jQuery( this ).data( 'label' ),
							value: jQuery( this ).val()
						}
					);
				}

			}
		);

		jQuery( 'form[data-id="' + current_form_id + '"] input[type="color"]' ).each(
			function () {

				if (jQuery( this ).data( 'label' ) !== '' && typeof jQuery( this ).data( 'label' ) !== 'undefined') {

					form_values.push(
						{
							label: jQuery( this ).data( 'label' ),
							value: jQuery( this ).val()
						}
					);
				}

			}
		);

		form_values.push(
			{
				label: 'total_amount',
				value: jQuery( '#amount_display_' + current_form_id ).text()
			}
		);

		var quantity_id = '#wpep_quantity_' + current_form_id;
		form_values.push(
			{
				label: 'quantity',
				value: jQuery( quantity_id ).val()
			}
		);

		var recaptcha_response = jQuery( 'form[data-id="' + current_form_id + '"] .g-recaptcha-response' ).val();

		var saved_card = jQuery( '#saveCardLater' ).is( ':checked' );

		var payment_intent = 'null';
		if ('subscription' == payment_type) {
			payment_intent = 'STORE';
		}

		if ('single' == payment_type) {
			payment_intent = 'CHARGE';
		}

		if (true == saved_card) {
			payment_intent = 'STORE';
		}

		var currency_code = jQuery( '#wpep_form_currency' ).val();

		if ('$' == currency_code) {
			currency_code = 'USD';
		}

		if ('C$' == currency_code) {
			currency_code = 'CAD';
		}

		if ('A$' == currency_code) {
			currency_code = 'AUD';
		}

		if ('£' == currency_code) {
			currency_code = 'GBP';
		}

		if ('¥' == currency_code) {
			currency_code = 'JPY';
		}

		var verificationAmount = amount * 100;

		const verificationDetails = {
			intent: payment_intent,
			amount: verificationAmount.toString(),
			currencyCode: currency_code,
			billingContact: {
				givenName: first_name,
				familyName: last_name
			}
		};

		var buyer_verification_token = null;

		// check if discount applied or not
		if ( jQuery(`#theForm-${current_form_id} input[name="wpep-discount"]`).length > 0 ) { 
			var discount = jQuery(`#theForm-${current_form_id} input[name="wpep-discount"]`).val();
		} else {
			var discount = 0;
		}

		if (card_on_file !== false) {

			if ( undefined !== jQuery( '#wpep_file_upload_field' )[0] ) {

				var files = jQuery( '#wpep_file_upload_field' )[0].files[0];
			}

			if (undefined !== files) {

				var fd = new FormData();
				fd.append( 'file',files );
				fd.append( 'file_upload','true' );
				fd.append( 'action','wpep_file_upload' );

				jQuery.ajax(
					{
						url: wpep_local_vars.ajax_url,
						type: 'post',
						data: fd,
						contentType: false,
						processData: false,
						success: function(response){
							if (response != 0) {
								var parsed_response = JSON.parse( response );
								wpep_file_upload_url( parsed_response.uploaded_file_url );
							} else {
								alert( 'file not uploaded' );
							}
						}
					}
				);

			}

			function wpep_file_upload_url(url) {

				form_values.push(
					{
						label: 'Uploaded URL',
						value: url
					}
				);

			}

			var square_customer_id = jQuery( '#wpep_square_customer_id' ).val();

			var data = {
				'action': 'wpep_payment_request',
				'card_on_file': card_on_file,
				'recaptcha_response': recaptcha_response,
				'square_customer_id': square_customer_id,
				'first_name': first_name,
				'last_name': last_name,
				'email': email,
				'amount': amount,
				'signup_amount': signup_amount,
				'discount': discount,
				'payment_type': payment_type,
				'current_form_id': current_form_id,
				'form_values': form_values,
				'card_data': cardData
			};

			jQuery.post(
				wpep_local_vars.ajax_url,
				data,
				function (response) {

					response = JSON.parse( response );
					if ('success' == response.status) {

						if (undefined !== files) {
							wpep_file_upload( response.transaction_report_id );
						}
						var form_id           = current_form_id;
						var current           = jQuery( 'form[data-id="' + form_id + '"]' );
						var next              = jQuery( 'form[data-id="' + form_id + '"]' );
						var currentActiveStep = current.find( '.form-wizard-steps .active' );
						next.find( '.wizard-fieldset' ).removeClass( "show", "400" );
						currentActiveStep.removeClass( 'active' ).addClass( 'activated' ).next().addClass( 'active', "400" );
						next.find( '.wizard-fieldset.orderCompleted' ).addClass( "show wpep-ptb-150", "400" );
						next.find( '.wpep-popup' ).addClass( 'completed' );
						next.find( '.wizard-fieldset.orderCompleted' ).siblings().remove();
						// remove form desc on thankyou page
						current.find( '.wpep-form-desc' ).remove();

						jQuery( 'html, body' ).animate(
							{
								scrollTop: jQuery( "#theForm-" + form_id ).offset().top - 50
							},
							800,
							function () {
								window.location.hash = '#';
							}
						);

						if (current.data( 'redirection' ) == 'Yes') {
							var counter = parseInt( current.data( 'delay' ) );

							current.find( '#counter' ).text( counter );

							if (current.data( 'redirectionurl' ) != '') {

								setInterval(
									function () {
										counter--;
										if (counter >= 0) {
											span           = document.getElementById( "counter-" + form_id );
											span.innerHTML = counter;
										}

										if (counter === 0) {
											window.location.href = current.data( 'redirectionurl' );
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
											span           = document.getElementById( "counter-" + form_id );
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
							current.find( 'small.counterText' ).remove();
						}

					} else {
						var json_response = JSON.parse( response );
						jQuery( "#theForm-" + current_form_id + " .paymentsBlocks" ).prepend( '<div class="wpep-alert wpep-alert-danger wpep-alert-dismissable"><a href="#" data-dismiss="alert" class="wpep-alert-close">×</a>' + json_response.detail + '</div>' );
						jQuery( 'html, body' ).animate(
							{
								scrollTop: jQuery( "#theForm-" + current_form_id + " .paymentsBlocks" ).offset().top
							},
							800,
							function () {
								window.location.hash = '#';
							}
						);

					}

				}
			).done(
				function () {
					jQuery( '.wpepLoader' ).remove();
				}
			);

		} else {

			wpep_paymentForm[current_form_id].verifyBuyer(
				nonce,
				verificationDetails,
				function(err, verificationResult) {
					if (err == null) {
						var verification_token = verificationResult.token;
						var data               = {

							'action': 'wpep_payment_request',
							'nonce': nonce,
							'recaptcha_response': recaptcha_response,
							'first_name': first_name,
							'last_name': last_name,
							'email': email,
							'amount': amount * 100,
							'signup_amount': signup_amount,
							'amount': amount,
							'discount': discount,
							'payment_type': payment_type,
							'current_form_id': current_form_id,
							'form_values': form_values,
							'save_card': jQuery( '#saveCardLater' ).is( ':checked' ),
							'buyer_verification': verification_token,
							'card_data': cardData

						};

						jQuery.post(
							wpep_local_vars.ajax_url,
							data,
							function (response) {

								response = JSON.parse( response );
								if ('success' == response.status) {

									wpep_file_upload( response.transaction_report_id );

									var form_id           = current_form_id;
									var current           = jQuery( 'form[data-id="' + form_id + '"]' );
									var next              = jQuery( 'form[data-id="' + form_id + '"]' );
									var currentActiveStep = current.find( '.form-wizard-steps .active' );
									next.find( '.wizard-fieldset' ).removeClass( "show", "400" );
									currentActiveStep.removeClass( 'active' ).addClass( 'activated' ).next().addClass( 'active', "400" );
									next.find( '.wizard-fieldset.orderCompleted' ).addClass( "show wpep-ptb-150", "400" );
									next.find( '.wpep-popup' ).addClass( 'completed' );
									next.find( '.wizard-fieldset.orderCompleted' ).siblings().remove();
									// remove form desc on thankyou page
									current.find( '.wpep-form-desc' ).remove();

									jQuery( 'html, body' ).animate(
										{
											scrollTop: jQuery( "#theForm-" + form_id ).offset().top - 50
										},
										800,
										function () {
											window.location.hash = '#';
										}
									);

									if (current.data( 'redirection' ) == 'Yes') {
										var counter = parseInt( current.data( 'delay' ) );

										current.find( '#counter' ).text( counter );

										if (current.data( 'redirectionurl' ) != '') {

											setInterval(
												function () {
													counter--;
													if (counter >= 0) {
														span           = document.getElementById( "counter-" + form_id );
														span.innerHTML = counter;
													}

													if (counter === 0) {
														window.location.href = current.data( 'redirectionurl' );
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
														span           = document.getElementById( "counter-" + form_id );
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
										current.find( 'small.counterText' ).remove();
									}

								} else {

									var json_response = JSON.parse( JSON.stringify( response ) );

									jQuery( "#theForm-" + current_form_id + " .paymentsBlocks" ).prepend( '<div class="wpep-alert wpep-alert-danger wpep-alert-dismissable"><a href="#" class="wpep-dismiss-coupon wpep-alert-close">×</a>The payment could not be completed. Please contact support for more information.</div>' );
									jQuery( 'html, body' ).animate(
										{
											scrollTop: jQuery( "#theForm-" + current_form_id + " .paymentsBlocks" ).offset().top
										},
										800,
										function () {
											window.location.hash = '#';
										}
									);

								}

							}
						).done(
							function () {
								jQuery( '.wpepLoader' ).remove();
							}
						);

					} else {
						console.log( err );
					}

				}
			);

		}

	}

}

function wpep_increaseValue(current_form_id) {

	if ( jQuery(`#theForm-${current_form_id} input[name="wpep-discount"]`).length > 0 ) { 
		jQuery(`#theForm-${current_form_id} input[name="wpep-discount"]`).remove();
	}

	if ( jQuery(`#theForm-${current_form_id} .wpep-alert-coupon`).length > 0 ) {
		jQuery(`#theForm-${current_form_id} .wpep-alert-coupon`).remove();
	}

	var quantity_id = 'wpep_quantity_' + current_form_id;
	var value       = parseInt( document.getElementById( quantity_id ).value, 10 );

	value = isNaN( value ) ? 0 : value;
	value++;
	document.getElementById( quantity_id ).value = value;

	wpep_update_amount_with_quantity( current_form_id, value );

}

function wpep_decreaseValue(current_form_id) {

	if ( jQuery(`#theForm-${current_form_id} input[name="wpep-discount"]`).length > 0 ) { 
		jQuery(`#theForm-${current_form_id} input[name="wpep-discount"]`).remove();
	}

	if ( jQuery(`#theForm-${current_form_id} .wpep-alert-coupon`).length > 0 ) {
		jQuery(`#theForm-${current_form_id} .wpep-alert-coupon`).remove();
	}
	
	var quantity_id = 'wpep_quantity_' + current_form_id;
	var value       = parseInt( document.getElementById( quantity_id ).value, 10 );

	if (1 !== value) {
		value             = isNaN( value ) ? 0 : value;
		value < 1 ? value = 1 : '';
		value--;
		document.getElementById( quantity_id ).value = value;
		wpep_update_amount_with_quantity( current_form_id, value );
	}

}

function wpep_update_amount_with_quantity(current_form_id, value) {

	var amount_field_id           = "amount_display_" + current_form_id;
	var amount_with_currency      = document.getElementById( amount_field_id ).innerHTML.trim();
	var amount_and_currency_split = amount_with_currency.split( " " );
	var currency                  = amount_and_currency_split[1];
	var one_unit_cost             = jQuery( '#one_unit_cost' ).val();
	one_unit_cost                 = one_unit_cost.split( " " )[0];
	var new_amount                = one_unit_cost * value;

	document.getElementById( amount_field_id ).innerHTML = new_amount + ' ' + currency;
	jQuery( 'form[data-id="' + current_form_id + '"] .display' ).next( 'input[name="wpep-selected-amount"]' ).val( new_amount + ' ' + currency ).trigger('change');

}

function wpep_file_upload(transaction_report_id) {

	if (undefined !== jQuery( '#wpep_file_upload_field' )[0]) {
		var files = jQuery( '#wpep_file_upload_field' )[0].files[0];
	}

	if (undefined !== files) {

		var fd = new FormData();
		fd.append( 'file',files );
		fd.append( 'file_upload','true' );
		fd.append( 'action','wpep_file_upload' );
		fd.append( 'transaction_report_id',transaction_report_id );

		jQuery.ajax(
			{
				url: wpep_local_vars.ajax_url,
				type: 'post',
				data: fd,
				contentType: false,
				processData: false,
				success: function(response){
					if (response != 0) {
						var parsed_response = JSON.parse( response );
						console.log( parsed_response.uploaded_file_url );
					} else {
						alert( 'file not uploaded' );
					}
				}
			}
		);
	}

}

function calculate(form_id, currency) {

	var currency_codes = ['CAD', 'GBP', 'AUD', 'JPY', 'EUR', 'USD'];
	var currency_symbol = ['C$', '£', 'A$', '¥', '€', '$'];
	if (wpep_local_vars.currencySymbolType == 'symbol') {
		
		jQuery.each( currency_codes, function( i, val ) {
			if( currency == val ) {
				currency = currency_symbol[i];
			}
	});

	}

	if (wpep_local_vars.currencySymbolType == 'code') {

		jQuery.each( currency_symbol, function( i, val ) {
				if( currency == val ) {
					currency = currency_codes[i];
				}
		});
	}

	var item_display = 'yes';

	if ( jQuery( 'form[data-id="' + form_id + '"] .wpItem' ).length ) {

		jQuery( ".wpItem" ).each(
			function () {

				var priceVal = jQuery( this ).find( 'input.price' ).val();
				var qtyVal   = jQuery( this ).find( "input.qty" ).val();
				var costVal  = (priceVal * qtyVal);
				jQuery( this ).find( 'input.cost' ).val( (costVal).toFixed( 2 ) );

			}
		);

		var subtotalVal = 0;
		jQuery( '.cost' ).each(
			function () {

				item_display = jQuery( this ).closest( '.wpItem' ).css( 'display' ) == 'none' ? 'no' : 'yes';
				if ('yes' == item_display) {
					subtotalVal += parseFloat( jQuery( this ).val() );
				}

			}
		);

		jQuery( '.subtotal' ).val( (subtotalVal).toFixed( 2 ) );

		var total = parseFloat( subtotalVal );

		total     = (total).toFixed( 2 );

		jQuery( 'form[data-id="' + form_id + '"] .display' ).text( total + ' ' + currency );

		var layout = jQuery('#wpep_amount_layout').val();
		if (layout !== 'tabular_layout') {
			jQuery( 'form[data-id="' + form_id + '"] .display' ).next( 'input[name="wpep-selected-amount"]' ).val( currency ).trigger('change');
		}
		jQuery( 'form[data-id="' + form_id + '"] .wpep-single-form-submit-btn' ).removeClass( 'wpep-disabled' );
		jQuery( 'form[data-id="' + form_id + '"] .wpep-wizard-form-submit-btn' ).removeClass( 'wpep-disabled' );

	}
}

jQuery( document ).ready(
	function() {

		jQuery( '.wizard-section' ).css( 'visibility', 'visible' );
		jQuery( '.parent-loader' ).remove();

		jQuery( "form div.qty" ).append( '<div class="outer-button"><div class="inc btnqty"><i class="fa fa-plus"></i></div><div class="dec btnqty"><i class="fa fa-minus"></i></div></div>' );
		jQuery( ".btnqty" ).click(
			'click',
			function () {

				var form_id  = jQuery( this ).parents( 'form' ).data( 'id' );

				if ( jQuery(`#theForm-${form_id} input[name="wpep-discount"]`).length > 0 ) { 
					jQuery(`#theForm-${form_id} input[name="wpep-discount"]`).remove();
				}
			
				if ( jQuery(`#theForm-${form_id} .wpep-alert-coupon`).length > 0 ) {
					jQuery(`#theForm-${form_id} .wpep-alert-coupon`).remove();
				}

				var currency = jQuery( this ).parents( 'form' ).data( 'currency' );

				var $button = jQuery( this );
				var oldQty  = $button.parent().parent().find( "input" ).val();

				if ($button.html() == '<i class="fa fa-plus"></i>') {
					var newQty = parseFloat( oldQty ) + 1;
				} else {
					// Don't allow decrementing less than zero
					if (oldQty > 0) {
						var newQty = parseFloat( oldQty ) - 1;
					} else {
						newQty = 0;
					}
				}

				$button.parent().parent().find( "input" ).val( newQty );

				calculate( form_id, currency );

			}
		);

		jQuery( '.wpep_delete_tabular_product' ).click(
			function() {

				var form_id  = jQuery( this ).parents( 'form' ).data( 'id' );
				
				if ( jQuery(`#theForm-${form_id} input[name="wpep-discount"]`).length > 0 ) { 
					jQuery(`#theForm-${form_id} input[name="wpep-discount"]`).remove();
				}
			
				if ( jQuery(`#theForm-${form_id} .wpep-alert-coupon`).length > 0 ) {
					jQuery(`#theForm-${form_id} .wpep-alert-coupon`).remove();
				}

				var currency = jQuery( this ).parents( 'form' ).data( 'currency' );

				jQuery( this ).closest( '.wpItem' ).hide();
				calculate( form_id, currency );

			}
		);

		if ( '' !== wpep_local_vars.recaptcha_site_key && 'undefined' !== wpep_local_vars.recaptcha_site_key) {
			try {
				grecaptcha.ready(
					function() {
						grecaptcha.execute( wpep_local_vars.recaptcha_site_key, {action: 'homepage'} ).then(
							function(token) {
								jQuery( '.g-recaptcha-response' ).val( token );
							}
						);
					}
				);
			} catch (e) {
				console.log( e );
			}

		}

		jQuery( "input[type=number]" ).keydown(
			function (evt) {
				var charCode = (evt.which) ? evt.which : evt.keyCode
				if (charCode > 31 && (charCode < 48 || charCode > 57))
					return false;
				return true;
			}
		);

		jQuery( '.wpep-popup-btn' ).on(
			'click',
			function (e) {

				e.preventDefault();
				var height = window.innerHeight - 350;
				var id     = jQuery( this ).data( 'btn-id' );
				jQuery( '#wpep_popup-' + id ).css( 'height', height );
				jQuery( '#wpep_popup-' + id ).show();

			}
		);

		jQuery( '.wpep-close' ).on(
			'click',
			function (e) {

				e.preventDefault();				
				jQuery( this ).parents( '.wpep-overlay' ).hide();

			}
		);
		
		const filterNum = (str) => {
			const numericalChar = new Set([ ".",",","0","1","2","3","4","5","6","7","8","9" ]);
			str = str.split("").filter(char => numericalChar.has(char)).join("");
			return str;
		}

		jQuery( 'input[name="wpep-selected-amount"]' ).on('change paste keyup', function() {			
						
			var form_id = jQuery(this).parents('form.wpep_payment_form').data('id');
			var discount = 0.00;
			var signup_total = 0.00;
			//var amount = parseFloat(jQuery('#theForm-' + form_id).find('#amount_display_' + form_id).text());
			var amount = parseFloat( filterNum( jQuery(this).val() ) );
			if ( jQuery(`#theForm-${form_id}`).find('input[name="wpep-signup-amount"]').length > 0 ) {
				var signup_total = parseFloat(jQuery(`#theForm-${form_id}`).find('input[name="wpep-signup-amount"]').val());
			}
			//var gross_total = parseFloat(jQuery(`#theForm-${form_id}`).find('input[name="gross_total"]').val());
			var total_amount = amount + signup_total;
			var unit_cost = 0;
			if ( jQuery( '#one_unit_cost' ).length > 0 ) {
				var one_unit_cost = jQuery( '#one_unit_cost' ).val();
				unit_cost = parseFloat(one_unit_cost.split( " " )[0]).toFixed(2);
			}
			jQuery(`#theForm-${form_id}`).find('.wpep-fee-subtotal .fee_value').text( unit_cost + ' ' + wpep_local_vars.wpep_square_currency_new );
			jQuery(`#theForm-${form_id}`).find('.wpep-fee-total .fee_value').text( parseFloat( total_amount ).toFixed(2) + ' ' + wpep_local_vars.wpep_square_currency_new );
			jQuery(`#amount_display_${form_id}`).siblings('input[name="wpep-selected-amount"]').val(parseFloat( total_amount ).toFixed(2));
			jQuery(`#amount_display_${form_id}`).text(parseFloat( total_amount ).toFixed(2) + ' ' + wpep_local_vars.wpep_square_currency_new);
			if ( jQuery(`#theForm-${form_id}`).find('input[name="gross_total"]').length > 0 ) {
				jQuery(`#theForm-${form_id}`).find('input[name="gross_total"]').val(total_amount);
			}
			if ( jQuery(`#theForm-${form_id}`).find('input[name="wpep-discount"]').length > 0 ) {
				discount = parseFloat(jQuery(`#theForm-${form_id}`).find('input[name="wpep-discount"]').val());
			}


			var extra_fee = jQuery(this).parents('form.wpep_payment_form').find('.is_extra_fee').val();
			if ( extra_fee == 1 ) {
				var data = {
					'action': 'wpep_calculate_fee_data',
					'dataType': 'html',
					'current_form_id': form_id,
					'total_amount': amount,
					'discount': discount,
					'currency': wpep_local_vars.wpep_square_currency_new,
				};
				
			
				jQuery.post(
					wpep_local_vars.ajax_url,
					data,
					function (response) {
						jQuery(`#wpep-payment-details-${form_id}`).html(response);
						var get_total = jQuery(`#wpep-payment-details-${form_id}`).find('.wpep-fee-total span.fee_value').text();
						jQuery(`#amount_display_${form_id}`).text(get_total);
						jQuery(`#amount_display_${form_id}`).siblings('input[name="wpep-selected-amount"]').val(get_total);						
					}
				);
			}

		});

		jQuery( '.cp-apply' ).on('click', function(e){
			e.preventDefault();

			var form_id = jQuery(this).parents('form.wpep_payment_form').data('id');
			var discount = 'no';
			if ( jQuery(`#theForm-${form_id} input[name="wpep-discount"]`).length > 0 ) { 
				discount = 'yes';	
			}

			var data = {
				'action': 'wpep_apply_coupon',
				'current_form_id': form_id,
				'coupon_code': jQuery(this).siblings('input[name="wpep-coupon"]').val(),
				'total_amount': jQuery('#theForm-' + form_id).find('input[name="gross_total"]').val(),
				'discounted': discount,
				'currency': jQuery('#theForm-' + form_id).find('input[name="wpep_currency"]').val(),
				'cp_submit': jQuery(this).val()
			};
		
			jQuery.post(
				wpep_local_vars.ajax_url,
				data,
				function (response) {
					var response = jQuery.parseJSON(response); // create an object with the key of the array

					if ( response.status == 'success') {

						var discountPrice = parseFloat(response.discount).toFixed(2); 
						var totalPrice = parseFloat(response.total).toFixed(2); 

						if ( jQuery(`#theForm-${form_id} input[name="wpep-discount"]`).length <= 0 ) {

							if ( jQuery(`#theForm-${form_id} .wpep-alert-coupon`).length > 0 ) {
								jQuery(`#theForm-${form_id} .wpep-alert-coupon`).remove();
							}
							
							jQuery(`#theForm-${form_id}`).append(`<input type="hidden" name="wpep-discount" value="${discountPrice}" />`);
							jQuery(`#wpep-coupons-${form_id}`).prepend(`<div class="wpep-alert-coupon wpep-alert wpep-alert-success wpep-alert-dismissable"><a href="#" class="wpep-dismiss-coupon wpep-alert-close">×</a>${response.message_success}</div>`);
							jQuery(`#theForm-${form_id}`).find('input[name="wpep-selected-amount"]').val(`${totalPrice} ${response.currency}`).trigger('change');
							jQuery(`#theForm-${form_id}`).find(`small#amount_display_${form_id}`).text(`${totalPrice} ${response.currency}`);
						} else {
							jQuery(`#wpep-coupons-${form_id}`).prepend(`<div class="wpep-alert-coupon wpep-alert wpep-alert-danger wpep-alert-dismissable"><a href="#" class="wpep-dismiss-coupon wpep-alert-close">×</a>Coupon already applied!</div>`);
						}
						
					}

					if (response.status == 'failed') {

						if ( jQuery(`#theForm-${form_id} .wpep-alert-coupon`).length > 0 ) {
							jQuery(`#theForm-${form_id} .wpep-alert-coupon`).remove();
						}

						jQuery(`#wpep-coupons-${form_id}`).prepend(`<div class="wpep-alert-coupon wpep-alert wpep-alert-danger wpep-alert-dismissable"><a href="#" class="wpep-dismiss-coupon wpep-alert-close">×</a>${response.message_failed}</div>`);
						
					}
		
				}
			).done(
				function () {
		
				}
			);
		});

		jQuery( document ).on( 'click', '.wpep-dismiss-coupon', function(e) {
			e.preventDefault();
			jQuery( '.wpep-alert-coupon' ).remove();
		});

	}
);
