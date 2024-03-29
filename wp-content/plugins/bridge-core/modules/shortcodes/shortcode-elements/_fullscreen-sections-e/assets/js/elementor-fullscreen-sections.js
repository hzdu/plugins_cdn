(function($) {
    'use strict';

    var elementorFullscreenSections = {};
    qode.modules.elementorFullscreenSections = elementorFullscreenSections;

    elementorFullscreenSections.qodeInitElementorFullscreenSections = qodeInitElementorFullscreenSections;


    elementorFullscreenSections.qodeOnWindowLoad = qodeOnWindowLoad;

    $(window).on('load', qodeOnWindowLoad);

    /*
     ** All functions to be called on $(window).load() should be in this function
     */
    function qodeOnWindowLoad() {
        qodeInitElementorFullscreenSections();
    }

    function qodeInitElementorFullscreenSections(){
        $j(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_fullscreen_sections.default', function() {
                initFullScreenTemplate();
            } );
        });
    }

})(jQuery);