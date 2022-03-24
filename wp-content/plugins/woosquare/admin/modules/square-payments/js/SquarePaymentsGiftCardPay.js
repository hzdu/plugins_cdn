(function ( $ ) {
	'use strict';

	var paymentForm;
	
	// create namespace to avoid any possible conflicts
	$.WooSquare_Gift_Card_Pay_payments = {
		init: function() {
			// Checkout page
			$( document.body ).on( 'updated_checkout', function() {
				$.WooSquare_Gift_Card_Pay_payments.loadForm();	
			});

			// Pay order form page
			if ( $( 'form#order_review' ).length ) {
				$.WooSquare_Gift_Card_Pay_payments.loadForm();
			}

			var custom_element = square_params.custom_form_trigger_element;

			// custom click trigger for 3rd party forms that initially hides the payment form
			// such as multistep checkout plugins
			if ( custom_element.length ) {
				$( document.body ).on( 'click', custom_element, function() {
					$.WooSquare_Gift_Card_Pay_payments.loadForm();		
				});
			}
			
			
			 jQuery('form.checkout').on('change',"input[name=payment_method]" ,function(){
				 $.WooSquare_Gift_Card_Pay_payments.loadForm();	
			 });
    

			// work around for iFrame not loading if elements being replaced is hidden
			$( document.body ).on( 'click', '#WooSquare_Gift_Card_Pay_payments', function() {
				$( '.payment_box.WooSquare_Gift_Card_Pay_payments' ).css( { 'display': 'block', 'visibility': 'visible', 'height': 'auto' } );	
			});
		},
		loadForm: function() {
	
			
			if ( $( '#payment_method_square_gift_card_pay' ).length ) {
				// work around for iFrame not loading if elements being replaced is hidden
				if ( ! $( '#payment_method_square_gift_card_pay' ).is( ':checked' ) ) {
					$( '.payment_box.payment_method_square_gift_card_pay' ).css( { 'display': 'block', 'visibility': 'hidden', 'height': '0' } );
				}

			//	console.log($.type( paymentForm ));
                // destroy the form and rebuild on each init
				if ( 'object' === $.type( paymentForm ) ) {
					paymentForm.destroy();
				}
					
				// Create and initialize a payment form object
					  
                var paymentForm = new SqPaymentForm({
                env: squaregiftcardpay_params.environment,
                applicationId: squaregiftcardpay_params.application_id,
                //locationId: squaregiftcardpay_params.lid,
                inputClass: 'sq-input',
                // Initialize Google Pay placeholder ID
                giftCard: {
                    elementId: 'sq-gift-card'
                },
				inputStyles: [
					{
					  color: "black"
					},
					{
					  mediaMaxWidth: "600px",
					  fontSize: "26px"
					},
					{
					  mediaMinWidth: "601px",
					  fontSize: "26px"
					}
				  ],
                callbacks: {
						cardNonceResponseReceived: function(errors, nonce, cardData, billingContact, shippingContact) {
						    
						
						    $( 'input.square-nonce' ).remove();
							if ( errors ) {
							   // console.log(errors);
								var html = '';

								html += '<ul class="woocommerce_error woocommerce-error">';

								// handle errors
								$( errors ).each( function( index, error ) { 
									html += '<li>' + error.message + '</li>';
								});

						 	html += '</ul>';
							
                             
								// append it to DOM
								if($( '.payment_method_square_gift_card_pay fieldset .woocommerce_error' ).length === 0 ){
								    	$( '.payment_method_square_gift_card_pay fieldset' ).eq(0).prepend( html );
								var $form = $( 'form.woocommerce-checkout, form#order_review' );
								}
							
							//	$form.append( '<input type="hidden" class="square_submit_error" name="square_submit_error" value="' + html + '" />' );
								
							} else if (nonce) {
							  //  console.log(nonce);
                    				var noncedatatype = typeof nonce;
                    			
							    if(nonce || typeof nonce !== 'undefined'){
    								var $form = $( 'form.woocommerce-checkout, form#order_review' );
    								// inject nonce to a hidden field to be submitted
    								$form.append( '<input type="hidden" class="errors" name="errors" value="' + errors + '" />' );
    								$form.append( '<input type="hidden" class="noncedatatype" name="noncedatatype" value="' + noncedatatype + '" />' );
    								$form.append( '<input type="hidden" class="cardData" name="cardData" value="' + cardData + '" />' );
    								$form.append( '<input type="hidden" class="square-nonce" name="square_nonce" value="' + nonce + '" />' );
									
    								$form.submit();
						        }
							}
						},

						paymentFormLoaded: function() {
						//	paymentForm.setPostalCode( $( '#billing_postcode' ).val() );
						},

						unsupportedBrowserDetected: function() {
							var html = '';

							html += '<ul class="woocommerce_error woocommerce-error">';
							html += '<li>' + squaregpay_params.unsupported_browser + '</li>';
							html += '</ul>';

							// append it to DOM
							$( '.payment_method_square_gift_card_pay fieldset' ).eq(0).prepend( html );
						},
                    	/*
                         * callback function: createPaymentRequest
                         * Triggered when: a digital wallet payment button is clicked.
                         */
                        createPaymentRequest: function () {
                          var paymentRequestJson = {
                            requestShippingAddress: true,
                            requestBillingInfo: true,
                            currencyCode: "USD",
                            countryCode: "US",
                            total: {
                              label: squaregpay_params.merchant_name,
                              amount: squaregpay_params.order_total,
                              pending: false
                            },
                          };
                    
                          return paymentRequestJson;
                        },
                        methodsSupported: function (methods) {
							
							var googlePayBtn = document.getElementById('sq-gift-card');    
							if (methods.googlePay === true) {
								googlePayBtn.style.display = 'inline-block';
							}
                        }
					},
					
                 
                });
				paymentForm.build();
				
				
			
				
				
				// when checkout form is submitted on checkout page
				 
				  
				
					$( document ).on( 'click', '#place_order', function( event ) {
					    
					 
					// remove any error messages first
					$( '.payment_method_square .woocommerce-error' ).remove();

					if ( $( '#payment_method_square_gift_card_pay' ).is( ':checked' ) && $( 'input.square-nonce' ).size() === 0  ) {
					 
					    event.preventDefault();
						paymentForm.requestCardNonce();

						return false;
					}

					return true;
				});
	
				$("#sq-gift-card").click(function(event){
					event.preventDefault();
				});

				$( document.body ).on( 'checkout_error', function() {
					//$( 'input.square-nonce' ).remove();
				});

				// work around for iFrame not loading if elements being replaced is hidden
				setTimeout( function() {
					if ( ! $( '#payment_method_square_gift_card_pay' ).is( ':checked' ) ) {
						$( '.payment_box.payment_method_square_gift_card_pay' ).css( { 'display': 'none', 'visibility': 'visible', 'height': 'auto' } );
					}
				}, 1000 );
			}
		}
	}; // close namespace

	 $.WooSquare_Gift_Card_Pay_payments.init();
	 
	  
	 
	 
}( jQuery ) );


 