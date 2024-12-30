(function ($) {
    'use strict'

    try {
        var stripe = Stripe(pencipw_stripe_vars.key);
    } catch (error) {
        console.log(error);
        return;
    }

    var stripe_card,
        iban;

    $(document).on('ready', function (e, data) {
        window.penci_paywall_stripe = window.penci_paywall_stripe || {}

        window.penci_paywall_stripe = {
            init: function (container) {
                if ('yes' === pencipw_stripe_vars.is_checkout) {
                    $(document.body).on('updated_checkout', function () {
                        window.penci_paywall_stripe.mountElement();
                    });
                } else if ($('form#add_payment_method').length) {
                    window.penci_paywall_stripe.mountElement();
                }

                // checkout page
                if ($('form.woocommerce-checkout').length) {
                    this.form = $('form.woocommerce-checkout');
                    this.form.on('checkout_place_order', window.penci_paywall_stripe.onSubmit);
                    this.form.on('click', 'input[name="pencipw-stripe-payment-source"]', window.penci_paywall_stripe.onSaveCardChange);
                }

                // add paywall method page
                if ($('form#add_payment_method').length) {
                    this.form = $('form#add_payment_method');
                    this.form.on('submit', window.penci_paywall_stripe.onSubmit);
                }

                // stripe error message
                $(document).on('stripeError', this.onError)

                // 3D Secure Flow
                window.addEventListener('hashchange', window.penci_paywall_stripe.onHashChange);
            },

            mountElement: function (container) {
                var elements = stripe.elements();

                // Credit Card Element
                var style = {
                    base: {
                        color: '#32325d',
                        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                        fontSmoothing: 'antialiased',
                        fontSize: '16px',
                        '::placeholder': {
                            color: '#aab7c4',
                        },
                    },
                    invalid: {
                        color: '#fa755a',
                        iconColor: '#fa755a',
                    },
                };

                stripe_card = elements.create('card', {hidePostalCode: true, style: style});
                if ($('#card-element').length) {
                    stripe_card.mount('#card-element');
                    if (!window.penci_paywall_stripe.isSaveCard()) {
                        $('#card-element').css('display', 'block');
                        $('.pencipw-save-payment-method').css('display', 'block');
                    }
                }
                stripe_card.addEventListener('change', function () {
                    window.penci_paywall_stripe.onCardChange();
                });

                // SEPA Debit Element
                var style = {
                    base: {
                        color: '#32325d',
                        fontSize: '16px',
                        '::placeholder': {
                            color: '#aab7c4'
                        },
                        ':-webkit-autofill': {
                            color: '#32325d',
                        },
                    },
                    invalid: {
                        color: '#fa755a',
                        iconColor: '#fa755a',
                        ':-webkit-autofill': {
                            color: '#fa755a',
                        },
                    },
                };

                var options = {
                    style: style,
                    supportedCountries: ['SEPA'],
                    placeholderCountry: pencipw_stripe_vars.country,
                };

                iban = elements.create('iban', options);
                if ($('#iban-element').length) {
                    iban.mount('#iban-element');
                    if (!window.penci_paywall_stripe.isSaveCard()) {
                        $('#iban-element').css('display', 'block');
                        $('.pencipw-save-payment-method').css('display', 'block');
                    }
                }
                iban.addEventListener('change', function () {
                    window.penci_paywall_stripe.onCardChange();
                });
            },

            onSubmit: function (container) {
                if (!$('#payment_method_stripepaywall, #payment_method_stripepaywall_sepa').is(':checked')) {
                    return true;
                }

                if (0 < $('input.stripe-source').length) {
                    return true;
                }

                if (window.penci_paywall_stripe.isSaveCard()) {
                    window.penci_paywall_stripe.useSavedSource($('input[name="pencipw-stripe-payment-source"]:checked').val());
                } else {
                    window.penci_paywall_stripe.createSource();
                }

                return false;
            },

            isSaveCard: function () {
                return (
                    $('input[name="pencipw-stripe-payment-source"]').is(':checked')
                    && 'new' !== $('input[name="pencipw-stripe-payment-source"]:checked').val()
                ) || (
                    $('input[name="pencipw-stripe-sepa-payment-source"]').is(':checked')
                    && 'new' !== $('input[name="pencipw-stripe-sepa-payment-source"]:checked').val()
                );
            },

            createSource: function (container) {
                var owner = {name: '', address: {}, email: '', phone: ''},
                    first_name = $('#billing_first_name').val() || pencipw_stripe_vars.billing_first_name,
                    last_name = $('#billing_last_name').val() || pencipw_stripe_vars.billing_last_name,
                    details = {};

                owner.name = first_name + ' ' + last_name;
                owner.email = $('#billing_email').val() || pencipw_stripe_vars.billing_email;
                owner.phone = $('#billing_phone').val() || pencipw_stripe_vars.billing_phone;

                owner.address.city = $('#billing_city').val() || pencipw_stripe_vars.billing_city;
                owner.address.country = $('#billing_country').val() || pencipw_stripe_vars.billing_country;
                owner.address.line1 = $('#billing_address_1').val() || pencipw_stripe_vars.billing_address_1;
                owner.address.line2 = $('#billing_address_2').val() || pencipw_stripe_vars.billing_address_2;
                owner.address.postal_code = $('#billing_postcode').val() || pencipw_stripe_vars.billing_postcode;
                owner.address.state = $('#billing_state').val() || pencipw_stripe_vars.billing_state;

                details.owner = owner;

                if (pencipw_stripe_vars.statement_descriptor !== '')
                    details.statement_descriptor = pencipw_stripe_vars.statement_descriptor;

                if ($('#payment_method_stripepaywall').is(':checked')) {
                    details.type = 'card';
                    stripe.createSource(stripe_card, details).then(window.penci_paywall_stripe.sourceResponse);
                }

                if ($('#payment_method_stripepaywall_sepa').is(':checked')) {
                    details.type = 'sepa_debit';
                    details.currency = pencipw_stripe_vars.currency;
                    details.mandate = {notification_method: pencipw_stripe_vars.sepa_mandate_notification};

                    stripe.createSource(iban, details).then(window.penci_paywall_stripe.sourceResponse);
                }
            },

            sourceResponse: function (response) {
                if (response.error) {
                    return $(document.body).trigger('stripeError', response);
                }

                window.penci_paywall_stripe.reset();

                window.penci_paywall_stripe.form.append(
                    $('<input type="hidden" />')
                        .addClass('stripe-source')
                        .attr('name', 'stripe_source')
                        .val(response.source.id)
                );

                if ($('form#add_payment_method').length) {
                    $(window.penci_paywall_stripe.form).off('submit', window.penci_paywall_stripe.onSubmit);
                }

                window.penci_paywall_stripe.form.submit();
            },

            useSavedSource: function (source) {
                window.penci_paywall_stripe.reset();

                window.penci_paywall_stripe.form.append(
                    $('<input type="hidden" />')
                        .addClass('stripe-source')
                        .attr('name', 'stripe_source')
                        .val(source)
                );

                window.penci_paywall_stripe.form.submit();
            },

            reset: function () {
                $('.stripe-error-message, .stripe-error-message, .stripe-source').remove();
            },

            onHashChange: function () {
                if (!$('#payment_method_stripepaywall, #payment_method_stripepaywall_sepa').is(':checked')) {
                    return true;
                }

                var partials = window.location.hash.match(/^#?pencipw-stripe-confirm-(pi|si)-([^:]+):(.+)$/);

                if (!partials || 4 > partials.length) {
                    return;
                }

                var type = partials[1];
                var intentClientSecret = partials[2];
                var redirectURL = decodeURIComponent(partials[3]);

                // Cleanup the URL
                window.location.hash = '';

                window.penci_paywall_stripe.openIntentModal(intentClientSecret, redirectURL, false, 'si' === type);
            },

            openIntentModal: function (intentClientSecret, redirectURL, alwaysRedirect, isSetupIntent) {
                stripe[isSetupIntent ? 'handleCardSetup' : 'handleCardPayment'](intentClientSecret)
                    .then(function (response) {
                        if (response.error) {
                            throw response.error;
                        }

                        var intent = response[isSetupIntent ? 'setupIntent' : 'paymentIntent'];
                        if ('requires_capture' !== intent.status && 'succeeded' !== intent.status) {
                            return;
                        }

                        window.location = redirectURL;
                    })
                    .catch(function (error) {
                        if (alwaysRedirect) {
                            return window.location = redirectURL;
                        }

                        $(document.body).trigger('stripeError', {error: error});
                        window.penci_paywall_stripe.form && window.penci_paywall_stripe.form.removeClass('processing');
                    });
            },

            onCardChange: function () {
                window.penci_paywall_stripe.reset();
            },

            onSaveCardChange: function () {
                window.penci_paywall_stripe.reset();

                if (window.penci_paywall_stripe.isSaveCard()) {
                    $('#card-element').css('display', 'none');
                    $('#iban-element').css('display', 'none');
                    $('.pencipw-save-payment-method').css('display', 'none');
                } else {
                    $('#card-element').css('display', 'block');
                    $('#iban-element').css('display', 'block');
                    $('.pencipw-save-payment-method').css('display', 'block');
                }
            },

            onError: function (e, result) {
                var message = pencipw_stripe_vars[result.error.code] ? pencipw_stripe_vars[result.error.code] : pencipw_stripe_vars.default_card_error;

                if ($('#payment_method_stripepaywall').is(':checked')) {
                    $('#card-errors').append('<div class="stripe-error-message"><i class="fa fa-times-circle"></i>' + message + '</div>');
                    $('html, body').animate({
                        scrollTop: ($('#card-errors').offset().top - 200)
                    }, 200);
                }

                if ($('#payment_method_stripepaywall_sepa').is(':checked')) {
                    $('#iban-errors').append('<div class="stripe-error-message"><i class="fa fa-times-circle"></i>' + message + '</div>');
                    $('html, body').animate({
                        scrollTop: ($('#iban-errors').offset().top - 200)
                    }, 200);
                }

                window.penci_paywall_stripe.form && window.penci_paywall_stripe.form.unblock();

            },

        }

        penci_paywall_stripe.init()
    })

})(jQuery)