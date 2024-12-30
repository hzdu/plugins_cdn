(function ($) {

    'use strict';

    $(document).on('ready', function (e, data) {
        $('.pencipw-gp-button').magnificPopup({
            disableOn: 700,
            type: 'iframe',
            removalDelay: 160,
            preloader: false,
            mainClass: 'mfp-zoom-out mfp-ani-wrap penci-promo-popup-wrapper',
            fixedContentPos: false
        });
    });
})(jQuery)