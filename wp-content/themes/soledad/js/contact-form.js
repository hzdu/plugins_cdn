/**
 * Start contact form widget script
 */

(function ($, elementor) {

    'use strict';

    var PenciContactForm = function ($scope, $) {

        var $contactForm = $scope.find('.pencif-contact-form .without-recaptcha');

        if (!$contactForm.length) {
            return;
        }

        $contactForm.submit(function (e) {
            sendContactForm($contactForm);
            return false;
        });

        return false;

    };

    function sendContactForm($contactForm) {

        $.ajax({
            url: $contactForm.attr('action'),
            type: 'POST',
            data: $contactForm.serialize(),
            beforeSend: function () {
                $contactForm.addClass('loading');
            },
            success: function (data) {
                var redirectURL = $(data).data('redirect'),
                    isExternal = $(data).data('external'),
                    resetStatus = $(data).data('resetstatus');

                
                    $contactForm.append(data);

               
                if (redirectURL) {
                    if (redirectURL != 'no') {
                        window.open(redirectURL, isExternal);
                    }
                }

                if (resetStatus) {
                    if (resetStatus !== 'no') {
                        $contactForm[0].reset();
                    }
                }

                $contactForm.removeClass('loading');
            }
        });
        return false;
    }

    // google invisible captcha
    function PenciCFormCheckGIC() {

        return new Promise(function (resolve, reject) {

            if (grecaptcha === undefined) {
                reject();
            }

            var response = grecaptcha.getResponse();

            if (!response) {
                reject();
            }

            var $contactForm = $('textarea.g-recaptcha-response').filter(function () {
                return $(this).val() === response;
            }).closest('form.pencif-contact-form');

            var contactFormAction = $contactForm.attr('action');

            if (contactFormAction && contactFormAction !== '') {
                sendContactForm($contactForm);
            }

            grecaptcha.reset();

        }); //end promise

    }

    //Contact form recaptcha callback, if needed
    window.PenciCFormCheckGICF = PenciCFormCheckGIC;

    jQuery(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/penci-contact-form.default', PenciContactForm);
    });


}(jQuery, window.elementorFrontend));

/**
 * End contact form widget script
 */