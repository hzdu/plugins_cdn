(function ($) {
    "use strict";
    var PENCI = PENCI || {};
    PENCI.elButtonPopup = function () {
        $('.pc-popup-btn').each(function () {
            var $class = $(this).data('position');
            $(this).magnificPopup({
                type: 'inline',
                removalDelay: 500, //delay removal by X to allow out-animation
                tClose: true,
                tLoading: true,
                callbacks: {
                    beforeOpen: function () {
                        this.st.mainClass = 'mfp-ani-wrap penci-promo-popup-wrapper ' + $class;
                    },
                }
            });
        });
    };

    $(document).ready(function () {
        PENCI.elButtonPopup();
    });
    $(window).on('elementor/frontend/init', function () {
        if (window.elementorFrontend) {

            elementorFrontend.hooks.addAction('frontend/element_ready/penci-button-popup.default', function ($scope) {
                PENCI.elButtonPopup();
            });
        }
    });
})(jQuery);
