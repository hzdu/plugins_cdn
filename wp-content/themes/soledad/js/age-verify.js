/* global soledad_settings */
(function ($) {
    "use strict";
    var PENCI = PENCI || {};
    PENCI.ageVerify = function () {
        if (Cookies.get('penci_age_verify') === 'confirmed') {
            return;
        }

        $.magnificPopup.open({
            items: {
                src: '.penci-age-verify'
            },
            type: 'inline',
            closeOnBgClick: false,
            closeBtnInside: false,
            showCloseBtn: false,
            enableEscapeKey: false,
            removalDelay: 500,
            tClose: true,
            tLoading: false,
            callbacks: {
                beforeOpen: function () {
                    this.st.mainClass = 'mfp-ani-wrap penci-promo-popup-wrapper';
                }
            }
        });

        $('.penci-age-verify-allowed').on('click', function () {
            Cookies.set('penci_age_verify', 'confirmed', {
                expires: parseInt(penci_age_settings.age_verify_expires),
                path: '/'
            });

            $.magnificPopup.close();
        });

        $('.penci-age-verify-forbidden').on('click', function () {
            $('.penci-age-verify').addClass('penci-forbidden');
        });
    };

    $(document).ready(function () {
        PENCI.ageVerify();
    });
})(jQuery);
