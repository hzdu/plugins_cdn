(function($) {
    'use strict';

    var elementorHorizontalTimeline = {};
    qode.modules.elementorHorizontalTimeline = elementorHorizontalTimeline;

    elementorHorizontalTimeline.qodeInitElementorHorizontalTimeline = qodeInitElementorHorizontalTimeline;


    elementorHorizontalTimeline.qodeOnWindowLoad = qodeOnWindowLoad;

    $(window).on('load', qodeOnWindowLoad);

    /*
     ** All functions to be called on $(window).load() should be in this function
     */
    function qodeOnWindowLoad() {
        qodeInitElementorHorizontalTimeline();
    }

    function qodeInitElementorHorizontalTimeline(){
        $j(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_horizontal_timeline.default', function() {
                qode.modules.timeline.qodeInitHorizontalTimeline();
            } );
        });
    }

})(jQuery);