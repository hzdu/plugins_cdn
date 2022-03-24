/**
 * Give Manual Donations Admin JS
 *
 * @package:     Give_Manual_Donations
 * @subpackage:  Assets/JS
 * @copyright:   Copyright (c) 2017, GiveWP
 * @license:     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 */

/* globals give_md_vars, Give, give_vars */
var give_md_vars;

// This object key will contain form setting which return from server when choose a donation form.
give_md_vars.selectedFormSettings = {};

jQuery( document ).ready( function( $ ) {

	var form = $( '#give_md_create_payment' );
	var existing_donor_fields = $( 'tr.existing-donor-tr' );
	var new_donor_fields = $( 'tr.new-donor' );
	var new_donor_btn = $( '.give-payment-new-donor' );
	var new_donor_cancel_btn = $( '.give-payment-new-donor-cancel' );
	var notice_wrap = $( '#give-forms-table-notice-wrap' );
	var donor_type = $( '#give-donor-type' );
	var user_drop_down = $( '.give-manual-from-user select' );
	var user_email = $( 'tr.new-donor #give-md-email' );
	var currency_options = $( 'select[name="give-cs-currency-options"]' );
	var transaction_table = $( '.give-transaction-form-table' );
	var isCurrencySwitcherEnabled = false;

	// Show/hide buttons
	new_donor_btn.on( 'click', function() {
		donor_type.val( 'new' );
		existing_donor_fields.hide();
		new_donor_fields.show();
		user_drop_down_value_change();
		reset_user_drop_down();
	});

	new_donor_cancel_btn.on( 'click', function() {
		donor_type.val( 'existing' );
		existing_donor_fields.show();
		new_donor_fields.hide();
	});

	/**
	 * Reset the User Drop Down
	 */
	function reset_user_drop_down() {
		user_email.on( 'keyup', function() {
			var email_user = user_drop_down.attr( 'email' );
			var email = user_email.val();

			if ( email_user !== email ) {
				user_drop_down.val( '0' ).trigger( 'chosen:updated' );
			}
		});
	}

	/**
	 * On change of User get the first name and last name and Email.
	 */
	function user_drop_down_value_change() {
		user_drop_down.on( 'change', function() {

			// AJAX validate & submit
			$.ajax({
				type: 'POST',
				url: ajaxurl,
				async: false,
				data: {
					action: 'give_manual_user_details',
					user_id: user_drop_down.val()
				},
				dataType: 'json',
				success: function( response ) {

					// Success happened
					if ( true === response.success ) {

						// Add Email
						if ( 'undefined' !== typeof (
							response.data.email
						) ) {
							user_email.val( response.data.email );
							user_drop_down.attr( 'email', response.data.email );
						}

						// Add Email
						if ( 'undefined' !== typeof (
							response.data.first_name
						) ) {
							$( 'tr.new-donor #give-md-first' ).val( response.data.first_name );
						}

						// Add Email
						if ( 'undefined' !== typeof (
							response.data.last_name
						) ) {
							$( 'tr.new-donor #give-md-last' ).val( response.data.last_name );
						}
					}
				}
			}).fail( function( data ) {
				if ( window.console && window.console.log ) {
					console.log( data );
				}
			});
		});
	}

	/**
	 * Form Submit
	 */
	form.on( 'submit', function( e ) {

		// disable the manual donation button
		form.find( '.give_manual_donation_submit' ).attr( 'disabled', 'disabled' );

		var validation_error = give_md_validation();

		// Check if validation error or not
		if ( ! validation_error ) {

			// Remove disable from manual donation button
			form.find( '.give_manual_donation_submit' ).removeAttr( 'disabled' );

		} else {

			// Display loader when form is processing
			$( '#give_md_create_payment .manual-donation-submit .spinner' ).css( 'visibility', 'visible' );

		}

		return validation_error;
	});

	/**
	 * Validation
	 *
	 * @returns {boolean}
	 */
	function give_md_validation() {

		// Empty any errors if present
		$( '.give_md_errors' ).empty();
		var passed = false;

		// AJAX validate & submit
		$.ajax({
			type: 'POST',
			url: ajaxurl,
			async: false,
			data: {
				action: 'give_md_validate_submission',
				fields: form.serialize()
			},
			dataType: 'json',
			success: function( response ) {

				// Error happened
				if ( 'success' !== response ) {

					// Loop through errors and output
					$.each( response.error_messages, function( key, value ) {

						// Show errors
						$( '.give_md_errors' ).append( '<div class="error"><p>' + value + '</p></div>' );
					});

					// Scrolling to top
					$( 'html, body' ).scrollTop( 0 );

					// Not Passed validation
					passed = false;
				} // End if().
				else {

					// Pass it as true
					passed = true;
				}

			}
		}).fail( function( data ) {

			passed = false;

			if ( window.console && window.console.log ) {
				console.log( data );
			}
		});

		return passed;

	}

	/**
	 * Recurring Messages
	 *
	 * Outputs appropriate notification messages for admin according the the type of recurring enabled donation form.
	 *
	 * @param response
	 */
	function give_md_recurring_messages( response ) {

		notice_wrap.find( '.confirm-subscription-notices' ).remove();

		// Add Subscription Information
		if ( response.recurring_enabled && 'yes_donor' === response.recurring_type ) {
			notice_wrap.append( '<div class="notice notice-warning confirm-subscription-notices"><p><input type="checkbox" id="confirm-subscription" name="confirm_subscription" value="1" /> <label for="confirm-subscription">' + response.subscription_text + '</label></p></div>' );
		} else if ( response.recurring_enabled && 'yes_admin' === response.recurring_type ) {
			notice_wrap.append( '<div class="notice notice-success confirm-subscription-notices"><p>' + response.subscription_text + '</p></div><input type="hidden" id="confirm-subscription" name="confirm_subscription" value="1" />' );
		}
	}

	/**
	 * Goal Completed Messages.
	 *
	 * Outputs appropriate notification messages for admin.
	 *
	 * @param response
	 */
	function give_md_goal_messages( response, form ) {

		// Add Goal Information
		if ( 'undefined' !== typeof ( response.goal_completed_text ) && '' !== response.goal_completed_text ) {
			notice_wrap.append( '<div class="notice notice-warning"><p>' + response.goal_completed_text + '</p></div>' );

			form.find( '.give_manual_donation_submit' ).attr( 'disabled', 'disabled' );
		}
	}

	/**
	 * Form Dropdown Change
	 */
	form.on( 'change', '.md-forms', function() {

		var selected_form = $( 'option:selected', this ).val();
		var notice_wrap = $( '#give-forms-table-notice-wrap' );

		// Ensure a form is selected
		if ( 0 !== parseInt( selected_form ) ) {

			notice_wrap.empty();
			var give_md_nonce = $( '#give_create_manual_payment_nonce' ).val();

			$.ajax({
				type: 'POST',
				url: ajaxurl,
				data: {
					action: 'give_md_check_form_setup',
					form_id: selected_form,
					nonce: give_md_nonce,
					data: form.serialize()
				},
				dataType: 'json',
				success: function( response ) {
					isCurrencySwitcherEnabled = false;
					give_md_vars.selectedFormSettings = response;

					form.find( '.give_manual_donation_submit' ).removeAttr( 'disabled' );

					// Add Donation Level Dropdown if Applicable
					if ( 'undefined' !== typeof response.levels ) {
						$( '.form-price-option-wrap' ).html( response.levels );
						$( '.give-md-amount' ).val( Give.fn.formatCurrency( response.amount, getCurrencyformattingSetting() ) );
					} else {
						$( '.form-price-option-wrap' ).html( 'n/a' );
					}

					// Add and show/hide FFM fields
					var ffm_fields_row = $( '.ffm-fields-row' );
					var ffm_fields = $( '.give-ffm-fields' );

					if ( response.ffm_fields ) {
						ffm_fields_row.show();
						ffm_fields.html( response.ffm_fields );
					} else {
						ffm_fields_row.hide();
						ffm_fields.empty();
					}

					if ( response.custom_amount ) {
						$( '.give-md-amount' ).removeAttr( 'readonly' );
					} else {
						$( '.give-md-amount' ).attr( 'readonly', true );
					}

					// Adds field for donor title prefixes.
					let prefixes_row    = $( '.give-donor-prefixes-row' );
					    let prefixes_select = $( '#give_title_prefixes' );
					    let prefixes_level = $( 'label', prefixes_select.parent().prev() );

					if ( true === response.prefix.enabled && 0 < Object.keys( response.title_prefixes ).length ) {
						prefixes_select.html( response.title_prefixes );
						prefixes_select.prop( 'disabled', false );
						prefixes_select.val( '' ).trigger( 'chosen:updated' );
					} else {
						prefixes_select.prop( 'disabled', true );
						prefixes_select.val( '' ).trigger( 'chosen:updated' );
					}

					// Do not send field as required because we are validating values via ajax.
					// @see https://github.com/impress-org/give-manual-donations/issues/144
					if ( true === response.prefix.required ) {
						prefixes_level.find( 'span' ).remove();
						prefixes_level.append( '<span>*</span>' );
					} else {
						prefixes_level.find( 'span' ).remove();
					}

					// Show/hide donor comment textarea.
					let comment_row = $( '.give-donor-comment-row' );

					if ( true === response.comments_enabled ) {
						comment_row.css( 'display', 'table-row' );
					} else {
						comment_row.css( 'display', 'none' );
					}

					// Show/Hide anonymous donation.
					let anonymous_donation = $( '.give-donor-anonymous-donation-row' );

					if ( true === response.anonymous_enabled ) {
						anonymous_donation.css( 'display', 'table-row' );
					} else {
						anonymous_donation.css( 'display', 'none' );
					}

					// Show/hide company field.
					let company_row = $( '.give-donor-company-row' );

					if ( true === response.company.enabled ) {
						company_row.css( 'display', 'table-row' );
					} else {
						company_row.css( 'display', 'none' );
					}

					if ( true === response.company.required ) {
						company_row.find( '#give-company-name' ).prop( 'required', true );
					} else {
						company_row.find( '#give-company-name' ).prop( 'required', false );
					}

					// Add Donation Amount.
					$( 'input[name="forms[amount]"]' ).val( Give.fn.formatCurrency( response.amount, baseCurrencyformattingSetting() ) );

					// Currency Switcher support.
					currency_options.html( '<option>' + give_md_vars.select_currency + '</option>' );
					currency_options.prop( 'disabled', true );

					// Remove fields every time form is changed.
					$( 'input[name="give-cs-base-amount"]' ).remove();
					$( 'input[name="give-cs-exchange-rate"]' ).remove();
					$( 'input[name="give-cs-process-cs"]' ).remove();

					// Adds a hidden field which tells whether to process Currency Switcher data.
					if ( 0 === $( 'input[name="give-cs-process-cs"]' ).length ) {
						form.append( '<input name="give-cs-process-cs" type="hidden" value="false" />' );
					}

					if ( response.hasOwnProperty( 'give_cs' ) && response.give_cs.enabled && ! $.isEmptyObject( response.give_cs.exchange_rates ) ) {
						isCurrencySwitcherEnabled = true;
						$( '.give-cs-for-md' ).show();

						// Add exchange rates to the form.
						form.attr( 'data-give-cs-exchange-rates', JSON.stringify( response.give_cs.exchange_rates ) );
						form.attr( 'data-give-cs-symbols-and-codes', JSON.stringify( response.give_cs.symbols_and_codes ) );
						transaction_table.find( 'th' ).eq( 2 ).html( give_md_vars.donation_amount + ' (' + response.give_cs.symbols_and_codes[ 'base_currency' ] + ')' );

						// Remove the disable attribute.
						if ( 0 !== response.give_cs.currency_options.length ) {
							currency_options.prop( 'disabled', false );

							// Populate the above select field.
							currency_options.html( response.give_cs.currency_options );
						}

						// Adds a 'data-base-amount' attribute which stores base amount for calculations.
						$( '.give-md-amount' ).attr( 'data-base-amount', response.amount );

						// Hidden field which stores default exchange rate as '1'.
						form.append( '<input name="give-cs-exchange-rate" type="hidden" value="1" />' );

						// Hidden field which stores base amount to update the '_give_cs_base_amount' meta field.
						form.append( '<input name="give-cs-base-amount" type="hidden" value="' + response.amount + '" />' );

						// Sets true to process data for Currency Switcher.
						$( 'input[name="give-cs-process-cs"]' ).val( 'true' );

						adminCanEditAmount();
					} else {

						// Sets false to disable processing data for Currency Switcher.
						$( 'input[name="give-cs-process-cs"]' ).val( 'false' );

						// Hide Currency Switcher column.
						$( '.give-cs-for-md' ).hide();
					}

					$.event.trigger({ type: 'give_md_check_form_setup', response: response, form: form });

					give_md_recurring_messages( response );
					give_md_goal_messages( response, form );
				}
			}).fail( function( data ) {
				if ( window.console && window.console.log ) {
					console.log( data );
				}
			});
		} else {
			$( '.form-price-option-wrap' ).html( 'n/a' );
			notice_wrap.empty();
			currency_options.html( '<option>' + give_md_vars.select_currency + '</option>' );
			currency_options.prop( 'disabled', true );
		}// End if().
	});

	/**
	 * Price Variation Change
	 */
	form.on( 'change', '.give-md-price-select', function() {

		var price_id = $( 'option:selected', this ).val(),
			give_md_nonce = $( '#give_create_manual_payment_nonce' ).val(),
			form_id = $( 'select[name="forms[id]"]' ).val(),
			selectedCurrency  = $('select[name="give-cs-currency-options"] option:selected', form).val();

		// Do not send ajax request when admin user select none option.
		if ( -1 === price_id ) {
			$( 'input[name="forms[amount]"]' ).val( '' );
			return;
		}

		$.ajax({
			type: 'POST',
			url: ajaxurl,
			data: {
				action: 'give_md_variation_change',
				form_id: form_id,
				price_id: price_id,
				data: form.serialize(),
				nonce: give_md_nonce
			},
			dataType: 'json',
			success: function( response ) {

				// Resets to the first option if donation level is changed.
				if ( isCurrencySwitcherEnabled ) {
					$( 'select[name="give-cs-currency-options"]' ).prop( 'selectedIndex', 0 ).change();
				}

				var formatArgs = getCurrencyformattingSetting();
				var unformattedAmt = Give.fn.unFormatCurrency( response.amount, formatArgs.decimal );

				$( 'input[name="forms[amount]"]' ).val( response.amount );

				// Updates base amount for future calculations when donation level is updated.
				$( 'input[name="forms[amount]"]' ).attr( 'data-base-amount', unformattedAmt );

				// Updates base amount when donation level is updated.
				$( 'input[name="give-cs-base-amount"]' ).val( unformattedAmt );

				if ( price_id === 'custom' ) {
					$( 'input[name="forms[amount]"]' ).select();
				}

				$.event.trigger({ type: 'give_md_variation_change', response: response, form: form });

				give_md_recurring_messages( response );
			}
		}).fail( function( data ) {
			if ( window.console && window.console.log ) {
				console.log( data );
			}
			notice_wrap.empty();
		});

	});

	/**
	 * Amount change
	 * focusout event handler
	 */
	form.on('focusout', '.give-md-amount', function () {

		// Exit.
		if (!isCurrencySwitcherEnabled) {
			return;
		}

		var formatArgs        = getCurrencyformattingSetting(),
			selectedCurrency  = $('select[name="give-cs-currency-options"] option:selected', form).val(),
			amount            = $(this).val(),
			unformattedAmount;

		amount            = amount && Math.ceil( Give.fn.unFormatCurrency( amount, formatArgs.decimal ) ) ? amount : (give_md_vars.selectedFormSettings.amount ? give_md_vars.selectedFormSettings.amount : 1);
		unformattedAmount = Give.fn.unFormatCurrency(amount, formatArgs.decimal);

		// Switch Currency must set to base currency.
		if (give_md_vars.base_currency !== selectedCurrency) {
			return;
		}

		$('input[name="give-cs-base-amount"]').val(unformattedAmount);
		$(this)
			.val(Give.fn.formatCurrency(amount, formatArgs))
			.attr('data-base-amount', unformattedAmount);
	});

	/**
	 * Calculates donation amount after Currency is switched.
	 */
	form.on( 'change', 'select[name="give-cs-currency-options"]', function() {

		// Exit.
		if ( ! isCurrencySwitcherEnabled ) {
			return;
		}

		var exchangeRates    = JSON.parse( form.attr( 'data-give-cs-exchange-rates' ) );
		var selectedValue    = $( this ).find( 'option:selected' ).val();
		var $amountField     = $( '.give-md-amount' );
		var symbolsAndCodes  = JSON.parse( form.attr( 'data-give-cs-symbols-and-codes' ) );
		var finalAmt         = $amountField.attr( 'data-base-amount' );
		var formatArgs       = getCurrencyformattingSetting();

		adminCanEditAmount();

		if ( symbolsAndCodes.hasOwnProperty( selectedValue ) ) {
			transaction_table.find( 'th' ).eq( 2 ).html( give_md_vars.donation_amount + ' (' + symbolsAndCodes[ selectedValue ] + ')' );
		} else {
			transaction_table.find( 'th' ).eq( 2 ).html( give_md_vars.donation_amount + ' (' + symbolsAndCodes[ 'base_currency' ] + ')' );
		}

		if ( ! exchangeRates.hasOwnProperty( selectedValue ) ) {

			// Update the Donation Amount field.
			$amountField.prop( 'value', Give.fn.formatCurrency( finalAmt, formatArgs ) );

			// Update the 'give-cs-exchange-rate' hidden field.
			$( 'input[name="give-cs-exchange-rate"]' ).val( 1 );

		} else {

			// Update the Donation Amount field.
			$amountField.prop(
				'value',
				Give.fn.formatCurrency( parseFloat( finalAmt ) * parseFloat( exchangeRates[ selectedValue ].exchange_rate ), formatArgs )
			);

			// Update the 'give-cs-exchange-rate' hidden field.
			$( 'input[name="give-cs-exchange-rate"]' ).val( exchangeRates[ selectedValue ].exchange_rate );
		}
	});

	/**
	 * Handle amount edit permissions
	 */
	function adminCanEditAmount() {
		var $donationLevelField = $('select[name="forms[price_id]"]', form ),
			multiTypeForm = $donationLevelField.length,
			selectedPriceID  = $( 'option:selected', $donationLevelField ).val();

		$('.give-md-amount', form )
			.prop( 'readonly', ! (  ( multiTypeForm ? 'custom' === selectedPriceID : give_md_vars.selectedFormSettings.custom_amount ) ) );

		if ( 'custom' === selectedPriceID ) {
			$('.give-md-amount', form ).focus()
		}
	}

	/**
	 * Get currency setting
	 * @return {{currency: (jQuery|*)}}
	 */
	function getCurrencyformattingSetting() {
		var exchangeRates    = 'undefined' !== typeof form.attr( 'data-give-cs-exchange-rates' ) ?
			JSON.parse( form.attr( 'data-give-cs-exchange-rates' ) ) :
			{};
		var $currencyField   = $( 'select[name="give-cs-currency-options"] option:selected', form );
		var selectedValue    = $currencyField.length ? $currencyField.val() : '';
		var formatArgs       = { currency: selectedValue };


		if ( ! exchangeRates.hasOwnProperty( selectedValue ) ) {
			formatArgs.decimal   = give_vars.decimal_separator;
			formatArgs.thousand  = give_vars.thousands_separator;
			formatArgs.precision = give_vars.currency_decimals;
		} else {
			formatArgs.decimal   = exchangeRates[selectedValue].formatSetting.setting.decimal_separator;
			formatArgs.thousand  = exchangeRates[selectedValue].formatSetting.setting.thousands_separator;
			formatArgs.precision = exchangeRates[selectedValue].formatSetting.setting.number_decimals;

			if (
				exchangeRates[ selectedValue ].hasOwnProperty( 'set_manually' ) &&
				parseInt( exchangeRates[ selectedValue ].set_manually )
			) {
				formatArgs.precision = exchangeRates[ selectedValue ].number_decimal;
			}
		}

		return formatArgs;
	}

	/**
	 * Get base currency setting
	 * @return {object}
	 */
	function baseCurrencyformattingSetting() {
		return {
			currency: give_md_vars.base_currency,
			decimal: give_vars.decimal_separator,
			thousand: give_vars.thousands_separator,
			precision: give_vars.currency_decimals,
		};
	}

	/**
	 * Convert date to time.
	 *
	 * @param gmt_offset
	 * @returns {string}
	 */
	function convertDateToTimepicker( gmt_offset ) {
		var sign = '+';
		if ( 0 > gmt_offset ) {
			sign = '-';
			gmt_offset *= -1;
		}
		var hours = '0' + Math.floor( gmt_offset ).toString();
		var minutes = '0' + ( Math.round( gmt_offset % 1 * 60 ) ).toString();
		return sign + hours.substr( hours.length - 2 ) + minutes.substr( minutes.length - 2 );
	}

	/**
	 * Initialize the Datepicker
	 */
	var datepicker_el = $( '.give_md_datepicker' );
	if ( 0 < datepicker_el.length ) {

		var date_format = give_md_vars.date_format;
		var timezone = convertDateToTimepicker( give_md_vars.timezone_offset );

		datepicker_el.datetimepicker({
			changeMonth: true,
			changeYear: true,
			yearRange: '2000:2050',
			dateFormat: date_format,
			defaultDate: new Date(),
			timeInput: true,
			timeFormat: 'HH:mm',
			showHour: true,
			showMinute: true,
			timezone: timezone,
			onClose: function( selectedDate, inst ) {
				var time = selectedDate.split( ' ' ).pop();
				var yr = inst.selectedYear;
				var month = 9 > inst.selectedMonth ? '0' + ( inst.selectedMonth + 1 ) : ( inst.selectedMonth + 1 );
				var day = 10 > inst.selectedDay ? '0' + inst.selectedDay : inst.selectedDay;
				var currentDate = yr + '-' + month + '-' + day + ' ' + time;

				$( '#give_md_create_payment .donation_date' ).val( currentDate );
			}
		});
	}

	/**
	 * Update state/province fields per country selection
	 */
	function give_md_update_billing_state_field() {

		var $this = $( this );
		var $form = $this.parents( 'form' );

		if ( 'card_state' !== $this.attr( 'id' ) ) {

			// If the country field has changed, we need to update the state/province field
			var postData = {
				action: 'give_get_states',
				country: $this.val(),
				field_name: 'card_state'
			};

			$.ajax({
				type: 'POST',
				data: postData,
				url: ajaxurl,
				xhrFields: {
					withCredentials: true
				},
				success: function( response ) {

					var html = '';
					var states_label = response.states_label;

					$form.find( '.give-md-state' ).removeClass( 'give-hidden' );

					if ( typeof ( response.states_found ) !== undefined && true === response.states_found ) {
						html = response.data;
					} else {
						html = '<input type="text" id="card_state"  name="card_state" class="cart-state give-input required" placeholder="' + states_label + '" value="' + response.default_state + '"/>';
					}

					// Update the label.
					$form.find( 'input[name="card_state"], select[name="card_state"]' ).closest( 'p' ).find( 'label' ).text( states_label );

					$form.find( 'input[name="card_state"], select[name="card_state"]' ).replaceWith( html );

					if ( typeof ( response.show_field ) !== undefined && false === response.show_field ) {
						$form.find( '.give-md-state' ).addClass( 'give-hidden' );
					}
				}
			}).fail( function( data ) {
				alert( give_vars.error_message );
			});
		}// End if().

		return false;
	}

	$( 'body' ).on( 'change', '#billing_country', give_md_update_billing_state_field );

});
