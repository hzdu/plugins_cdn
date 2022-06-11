jQuery(document).ready(function ($) {
    'use strict';
    window.addEventListener('load', function () {
        if (vi_wot_frontend_form_search.recaptcha_check) {
            if (vi_wot_frontend_form_search.recaptcha_version == 2) {
                wot_reCaptchaV2Onload();
            } else {
                wot_reCaptchaV3Onload();
            }
        }
    });
    $(document).on('click', '.vi-woocommerce-orders-tracking-form-search-tracking-number-btnclick', function () {
        if (vi_wot_frontend_form_search.is_preview) {
            return false;
        }
        let $form = $(this).closest('.vi-woocommerce-orders-tracking-form-search');
        let $message = $form.find('.vi-woocommerce-orders-tracking-form-message');
        let $recaptcha = $form.find('.vi-woocommerce-orders-tracking-g-validate-response');
        $message.addClass('vi-woocommerce-orders-tracking-hidden');
        $form.find('.vi-woocommerce-orders-tracking-form-error').removeClass('vi-woocommerce-orders-tracking-form-error');
        let $tracking_number = $form.find('.vi-woocommerce-orders-tracking-form-search-tracking-number');
        let tracking_number = $tracking_number.val();
        let $order_email = $form.find('.vi-woocommerce-orders-tracking-form-order-email-input');
        let order_email = $order_email.val();
        let $order_id = $form.find('.vi-woocommerce-orders-tracking-form-order-id-input');
        let order_id = $order_id.val();
        let error = false;
        if (vi_wot_frontend_form_search.recaptcha_check && !$recaptcha.val()) {
            $form.find('.vi-woocommerce-orders-tracking-recaptcha').addClass('vi-woocommerce-orders-tracking-form-error');
            error = true;
        }

        if (vi_wot_frontend_form_search.tracking_form_require_tracking_number == 1 && !tracking_number) {
            $tracking_number.parent().addClass('vi-woocommerce-orders-tracking-form-error');
            error = true;
        }
        if (vi_wot_frontend_form_search.tracking_form_require_email == 1) {
            if (!order_email || !isValidEmailAddress(order_email)) {
                $order_email.parent().addClass('vi-woocommerce-orders-tracking-form-error');
                error = true;
            }
        }
        if (vi_wot_frontend_form_search.tracking_form_require_order_id == 1) {
            if (!order_id) {
                $order_id.parent().addClass('vi-woocommerce-orders-tracking-form-error');
                error = true;
            }
        }
        if (error) {
            $('.vi-woocommerce-orders-tracking-message-empty-nonce').addClass('vi-woocommerce-orders-tracking-hidden');
            $message.removeClass('vi-woocommerce-orders-tracking-hidden');
            return false;
        } else {
            if (!tracking_number && !order_id && !order_email) {
                alert(vi_wot_frontend_form_search.error_empty_text);
                return false;
            } else {
                $form.find('.g-recaptcha-response').attr('name', '');
            }
        }
    });

    function isValidEmailAddress(emailAddress) {
        let pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
        return pattern.test(emailAddress);
    }

    function wot_validateRecaptcha(response) {
        $('.vi-woocommerce-orders-tracking-g-validate-response').val(response);
        if (response) {
            $('.vi-woocommerce-orders-tracking-recaptcha').removeClass('vi-woocommerce-orders-tracking-form-error');
        }
    }

    function wot_reCaptchaV3Onload() {
        grecaptcha.ready(function () {
            grecaptcha.execute(vi_wot_frontend_form_search.recaptcha_site_key, {action: 'homepage'}).then(function (token) {
                wot_validateRecaptcha(token);
            })
        });
    }

    function wot_reCaptchaV2Onload() {
        $('.vi-woocommerce-orders-tracking-recaptcha').each(function (index, ele) {
            let $current = $('.vi-woocommerce-orders-tracking-recaptcha').eq(index).closest('.vi-woocommerce-orders-tracking-recaptcha-field');
            grecaptcha.render(ele, {
                'sitekey': vi_wot_frontend_form_search.recaptcha_site_key,
                'callback': function (response) {
                    $current.find('.vi-woocommerce-orders-tracking-g-validate-response').val(response);
                    if (response) {
                        $current.find('.vi-woocommerce-orders-tracking-recaptcha').removeClass('vi-woocommerce-orders-tracking-form-error');
                    }
                },
                'expired-callback': function () {
                    $current.find('.vi-woocommerce-orders-tracking-g-validate-response').val(null);
                },
                'theme': vi_wot_frontend_form_search.recaptcha_theme,
                'isolated': false
            });
        })
    }
});