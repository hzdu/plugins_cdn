(function($) {
    'use strict';

    var elementorHorizontalMarquee = {};
    qode.modules.elementorHorizontalMarquee = elementorHorizontalMarquee;

    elementorHorizontalMarquee.qodeInitElementorHorizontalMarquee = qodeInitElementorHorizontalMarquee;


    elementorHorizontalMarquee.qodeOnWindowLoad = qodeOnWindowLoad;

    $(window).on('load', qodeOnWindowLoad );

    /*
     ** All functions to be called on $(window).load() should be in this function
     */
    function qodeOnWindowLoad() {
        qodeInitElementorHorizontalMarquee();
    }

    function qodeInitElementorHorizontalMarquee(){
        $j(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_horizontal_marquee.default', function() {
                initHorizontalMarquee();
                qodeHorizontalMarqueeLoop();
            } );
        });
    }

})(jQuery);