(function ($) {
    "use strict";
    var PENCI = PENCI || {};
    PENCI.darkmode = function () {

        var logos = $('.penci-limg'),
            autoby = penci_dark.auto_by,
            darktheme = penci_dark.darktheme,
            hr = (new Date()).getHours(),
            lc = 'pclight-mode',
            dc = 'pcdark-mode';

        if (darktheme !== '') {
            lc = 'pclight-mode pcdm-enable';
        } else {
            dc = 'pcdark-mode pcdm-enable';
        }

        if (autoby === 'os' && !darktheme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {

            $('body')
                .removeClass('pclight-mode')
                .addClass(dc);
            document.cookie = "penci_mode=dark; path=/";
            logos.each(function (){
                var logo_dark = $(this).attr('data-darklogo');
                if ( logo_dark !== null){
                    $(this).attr('src', logo_dark);
                }
            });

        } else if (autoby === 'os' && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            $('body')
                .removeClass('pcdark-mode')
                .removeClass('pcdm-enable')
                .addClass(lc);
            document.cookie = "penci_mode=light; path=/";
            logos.each(function (){
                var logo_light = $(this).attr('data-lightlogo');
                if ( logo_light !== null){
                    $(this).attr('src', logo_light);
                }
            });
        }

        if (autoby === 'time' && hr > 18) {
            $('body')
                .removeClass('pclight-mode')
                .addClass(dc);
            document.cookie = "penci_mode=dark; path=/";
            logos.each(function (){
                var logo_dark = $(this).attr('data-darklogo');
                if ( logo_dark !== null){
                    $(this).attr('src', logo_dark);
                }
            });
        } else if (autoby === 'time') {
            $('body').removeClass('pcdark-mode')
                .removeClass('pcdm-enable')
                .addClass(lc);
            document.cookie = "penci_mode=light; path=/";
            logos.each(function (){
                var logo_light = $(this).attr('data-lightlogo');
                if ( logo_light !== null){
                    $(this).attr('src', logo_light);
                }
            });
        }

        $('.pc_dm_mode').each(function () {

            $(this).find('.pc_dark_mode_toggle').attr("checked", !!$('body').hasClass('pcdark-mode'));

            $(this).find('.slider').on('click', function () {

                $('body').addClass('pcdm-loading');

                var t = $(this).closest('.pc_dm_mode'),
                    c = t.find('.pc_dark_mode_toggle');

                c.attr("checked", !c.attr("checked"));
                t.toggleClass('active');
                if (c.attr("checked")) {
                    $('body')
                        .removeClass('pclight-mode')
                        .addClass(dc);
                    document.cookie = "penci_mode=dark; path=/";
                    logos.each(function (){
                        var logo_dark = $(this).attr('data-darklogo');
                        if ( logo_dark !== null){
                            $(this).attr('src', logo_dark);
                        }
                    });
                } else {
                    $('body')
                        .removeClass('pcdark-mode')
                        .removeClass('pcdm-enable')
                        .addClass(lc);
                    document.cookie = "penci_mode=light; path=/";
                    logos.each(function (){
                        var logo_light = $(this).attr('data-lightlogo');
                        if ( logo_light !== null){
                            $(this).attr('src', logo_light);
                        }
                    });
                }

                setTimeout(function () {
                    $('body').removeClass('pcdm-loading');
                }, 400);
            });
        });
    };

    $(document).ready(function () {
        PENCI.darkmode();
    });
})(jQuery);
