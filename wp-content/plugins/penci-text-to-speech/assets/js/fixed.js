(function ($) {
    "use strict";

    var body = $('body'),
        tts = $('.penci-texttospeech-box'),
        admb = $('#wpadminbar'),
        tts_h = tts.height();

    if (tts.hasClass('style-4') || tts.hasClass('style-6')) {
        tts_h = 40;
    }

    if (/chrom(e|ium)/.test(navigator.userAgent.toLowerCase()) && tts.hasClass('style-6')) {
        tts_h = 54;
    }

    if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent) && tts.hasClass('style-6')) {
        tts_h = 31;
    }

    if (tts.hasClass('bottom-fixed')) {
        body.addClass('penci-tts-bottom-fixed');
        body.css('padding-bottom', tts_h);
    }

    if (tts.hasClass('top-fixed')) {
        body.addClass('penci-tts-top-fixed');
        body.css('padding-top', tts_h + 'px');
        body.css('--penci-tts-h', tts_h + 'px');
    }

    $(window).scroll(function (event) {
        var scroll = $(window).scrollTop();
        if (scroll > 0) {
            body.addClass('pc-scrtop');
        } else {
            body.removeClass('pc-scrtop');
        }
    });
})(jQuery);