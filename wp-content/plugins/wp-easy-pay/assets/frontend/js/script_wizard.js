jQuery( document ).ready(
	function () {
		// click on next button

		jQuery( 'input[type="checkbox"]' ).click(
			function(){

				// alert(jQuery(this).is(':checked'));
			}
		);
		jQuery( '.form-wizard-next-btn' ).click(
			function () {

				var form_id           = jQuery( this ).parents( 'form' ).data( 'id' );
				var parentFieldset    = jQuery( this ).parents( '.wizard-fieldset' );
				var currentActiveStep = jQuery( this ).parents( '.form-wizard' ).find( '.form-wizard-steps .active' );
				var next              = jQuery( this );
				var nextWizardStep    = true;
				parentFieldset.find( '.wizard-required' ).each(
					function () {
						var thisValue = jQuery( this ).val();

						if (thisValue == "") {
							jQuery( this ).siblings( ".wizard-form-error" ).slideDown();
							nextWizardStep = false;
						} else {
							jQuery( this ).siblings( ".wizard-form-error" ).slideUp();
						}
					}
				);

				/*var result1 = jQuery( "#theForm-" + form_id + " .wizard-fieldset.show .fieldMainWrapper div.wpep-required input" ).filter(
					function () {
						return jQuery.trim( jQuery( this ).val() ).length == 0
					}
				).length == 0;*/

				// console.log('result 1 is '+ result1);

				// client side validation
				var result2    = false;
				var emailCheck = false;
				var wpepError  = '';

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

						if (current.find( 'select' ).length > 0) {

							if (current.find( 'select' ).val() == '' || current.find( 'select' ).val() == undefined) {
								// console.log('input is empty ');
								if (current.find( 'select ~ .wpepError' ).length == 0) {
									jQuery( wpepError ).insertAfter( current.find( 'select' ) );
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
									// return false;
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
								// return false;
							} else {
								wpepError = '';
								current.find( '.wpepError' ).remove();
								emailCheck = true;
								// console.log('input value: '+ current.find('input[type="email"]').val());
							}
						}

						if (current.find( 'input[type="date"]' ).length > 0) {

							if (current.find( 'input[type="date"]' ).val() == '' || current.find( 'input[type="date"]' ).val() == undefined) {
								// console.log('input is empty ');
								if (current.find( 'input[type="date"] ~ .wpepError' ).length == 0) {
									jQuery( wpepError ).insertAfter( current.find( 'input[type="date"]' ) );
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

						if (current.find( 'input[type="url"]' ).length > 0) {

							if (current.find( 'input[type="url"]' ).val() == '' || current.find( 'input[type="url"]' ).val() == undefined) {
								// console.log('input is empty ');
								if (current.find( 'input[type="url"] ~ .wpepError' ).length == 0) {
									jQuery( wpepError ).insertAfter( current.find( 'input[type="url"]' ) );
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

					}
				);

				// console.log('result 2 is '+ result2);

				var finalCheck = jQuery( "#theForm-" + form_id + " .wizard-fieldset.show .fieldMainWrapper div.wpep-required" ).find( "span.wpepError" ).length;

				// alert(finalCheck);

				if ( /*result1 &&*/ result2 && wpepError == '' && finalCheck == 0 && emailCheck == true) {
					if (nextWizardStep) {
						next.parents( '.wizard-fieldset' ).removeClass( "show", "400" );
						currentActiveStep.removeClass( 'active' ).addClass( 'activated' ).next().addClass( 'active', "400" );
						next.parents( '.wizard-fieldset' ).next( '.wizard-fieldset' ).addClass( "show", "400" );
						jQuery( document ).find( '.wizard-fieldset' ).each(
							function () {
								if (jQuery( this ).hasClass( 'show' )) {
									var formAtrr = jQuery( this ).attr( 'data-tab-content' );
									jQuery( document ).find( '.form-wizard-steps .form-wizard-step-item' ).each(
										function () {
											if (jQuery( this ).attr( 'data-attr' ) == formAtrr) {
												jQuery( this ).addClass( 'active' );
												var innerWidth = jQuery( this ).innerWidth();
												var position   = jQuery( this ).position();
												jQuery( document ).find( '.form-wizard-step-move' ).css( { "left": position.left, "width": innerWidth } );
											} else {
												jQuery( this ).removeClass( 'active' );
											}
										}
									);
								}
							}
						);
					}
				}
			}
		);
		// click on previous button
		jQuery( '.form-wizard-previous-btn' ).click(
			function () {
				var counter = parseInt( jQuery( ".wizard-counter" ).text() );;
				var prev              = jQuery( this );
				var currentActiveStep = jQuery( this ).parents( '.form-wizard' ).find( '.form-wizard-steps .active' );
				prev.parents( '.wizard-fieldset' ).removeClass( "show", "400" );
				prev.parents( '.wizard-fieldset' ).prev( '.wizard-fieldset' ).addClass( "show", "400" );
				currentActiveStep.removeClass( 'active' ).prev().removeClass( 'activated' ).addClass( 'active', "400" );
				jQuery( document ).find( '.wizard-fieldset' ).each(
					function () {
						if (jQuery( this ).hasClass( 'show' )) {
							var formAtrr = jQuery( this ).attr( 'data-tab-content' );
							jQuery( document ).find( '.form-wizard-steps .form-wizard-step-item' ).each(
								function () {
									if (jQuery( this ).attr( 'data-attr' ) == formAtrr) {
										jQuery( this ).addClass( 'active' );
										var innerWidth = jQuery( this ).innerWidth();
										var position   = jQuery( this ).position();
										jQuery( document ).find( '.form-wizard-step-move' ).css( { "left": position.left, "width": innerWidth } );
									} else {
										jQuery( this ).removeClass( 'active' );
									}
								}
							);
						}
					}
				);
			}
		);

		// click on form submit for wizard form type button mufaddal version
		jQuery( document ).on(
			"click",
			".form-wizard .wpep-wizard-form-submit-btn",
			function () {
				var form_id           = jQuery( this ).parents( 'form' ).data( 'id' );
				var current           = jQuery( this );
				var result3           = false;
				var next              = jQuery( this );
				var currentActiveStep = jQuery( this ).parents( '.form-wizard' ).find( '.form-wizard-steps .active' );
				var termCond          = false;
				var wpepError         = '';

				if (current.find( '.display' ).next( 'input[name="wpep-selected-amount"]' ).length > 0) {
					// console.log('I am here!');
					if (current.find( '.display' ).next( 'input[name="wpep-selected-amount"]' ).val() == '' || current.find( '.display' ).next( 'input[name="wpep-selected-amount"]' ).val() == undefined) {
						// console.log('input is empty ');
						result3 = false;
						return false;
					} else {
						result3 = true;
						// console.log('input value: '+ current.find('.display').next('input[name="wpep-selected-amount"]').val());
					}
				}

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

				var selected_payment_tab = current.parents( 'form' ).find( 'ul.wpep_tabs li.tab-link.current' ).data( 'tab' );

				// console.log('result 3 is '+ result3);

				// if payment type is credit card
				if (selected_payment_tab == 'creditCard' && result3 == true && termCond == true && wpepError == '') {

					onGetCardNonce( event, form_id );

				} else if (selected_payment_tab == 'googlePay' && result3 == true && termCond == true && wpepError == '') { // if payment type is google pay

					onGetCardNonce( event, form_id );

				} else {
					return false;
				}

			}
		);

	}
);

/*email filter function*/
function validateEmail(email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test( String( email ).toLowerCase() );
}
