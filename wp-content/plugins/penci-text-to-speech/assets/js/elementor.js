(function ($) {
    $(window).on('elementor/frontend/init', function () {
        if (window.elementorFrontend) {

            elementorFrontend.hooks.addAction('frontend/element_ready/pc-tts-elementor.default', function ($scope) {
                window.wp.mediaelement.initialize();
            });
        }
    });
})(jQuery);