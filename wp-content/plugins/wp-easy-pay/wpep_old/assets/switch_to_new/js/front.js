jQuery(document).ready(function(jQuery) {

    var paymentForm = new SqPaymentForm({
        applicationId: wpep_script.application_id,
        locationId: wpep_script.location_id,
        inputClass: 'wpep-input',
        inputStyles: jQuery.parseJSON(wpep_script.payment_form_input_styles),
        cardNumber: {
            elementId: 'wpep-card-number',
            placeholder: wpep_script.placeholder_card_number
        },
        cvv: {
            elementId: 'wpep-cvv',
            placeholder: wpep_script.placeholder_card_cvv
        },
        expirationDate: {
            elementId: 'wpep-expiration-date',
            placeholder: wpep_script.placeholder_card_expiration
        },
        postalCode: {
            elementId: 'wpep-postal-code',
            placeholder: wpep_script.placeholder_card_postal_code
        },
        callbacks: {
            cardNonceResponseReceived: function(errors, nonce, cardData) {

                var amount = parseFloat(jQuery('.wpep-field.amount .wpep-amount').val());
                var verificationToken = 0;

                const verificationDetails = {
                    intent: 'CHARGE',
                    amount: amount.toString(),
                    currencyCode: 'USD',
                    billingContact: {
                    }
                };

                paymentForm.verifyBuyer(
                    nonce,
                    verificationDetails,
                    function(err,result) {
                        if (err == null) {
                            if (errors) {
                                var html = '<ul>';
                                // handle errors
                                jQuery(errors).each(function(index, error) {
                                    html += '<li class="wpep-error">' + error.message + '</li>';
                                });

                                html += '</ul>';

                                // append it to DOM
                                jQuery('.wpep_container .messages').html(html);
                                jQuery('.wpep-button-submit').removeAttr('disabled');
                                jQuery('.wpep-loader').hide();
                            } else {
                                
                                var data = {
                                    action: 'wpep_submit_payment',
                                    nonce: nonce,
                                    buyerVerify: result.token,
                                    amount: amount
                                };
                                jQuery.ajax({
                                    url: wpep_script.ajaxurl,
                                    data: data,
                                    type: 'post',
                                    success: function(msg) {
                                        msg = jQuery.parseJSON(msg);

                                        if (msg.status == 'error') {
                                            var error = '<ul><li class="wpep-error">' + msg.message + '</li></ul>';
                                            jQuery('.wpep_container .messages').html(error);
                                        } else {
                                            var error = '<div class="payment_success_ok"></div><ul><li class="wpep-success">' + msg.message + '</li></ul>';
                                            jQuery('.wpep_container .messages').html(error);

                                            jQuery('.wpep-field').hide();
                                            paymentForm.destroy();
                                            if (msg.redirect) {
                                                window.location.href = msg.redirect;
                                            }
                                        }
                                    },
                                    complete: function() {
                                        jQuery('.wpep-button-submit').removeAttr('disabled');
                                        jQuery('.wpep-loader').hide();
                                    }
                                });
                            }
                        }
                    });


            },
            paymentFormLoaded: function() {

            },
            unsupportedBrowserDetected: function() {

            }
        }
    });

    paymentForm.build();


    jQuery('.wpep-button-submit').click(function() {
        jQuery('.wpep_container .messages').html("");
        //check amount
        var amount = parseInt(jQuery('.wpep-field.amount .wpep-amount').val());
        if (amount < 1) {
            var error = '<ul><li class="wpep-error">' + wpep_script.amount_error_message + '</li></ul>';
            jQuery('.wpep_container .messages').html(error);
        } else {
            jQuery(this).attr('disabled', 'disabled');
            jQuery('.wpep_square_nonce').remove();
            jQuery('.wpep-loader').show();
            paymentForm.requestCardNonce();
        }
    });

});