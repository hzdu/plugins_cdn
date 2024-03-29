(function($) {
    'use strict';

    var elementorContentSlider = {};
    qode.modules.elementorContentSlider = elementorContentSlider;

    elementorContentSlider.qodeInitElementorContentSlider = qodeInitElementorContentSlider;


    elementorContentSlider.qodeOnWindowLoad = qodeOnWindowLoad;

    $(window).on('load', qodeOnWindowLoad);

    /*
     ** All functions to be called on $(window).load() should be in this function
     */
    function qodeOnWindowLoad() {
        qodeInitElementorContentSlider();
    }

    function qodeInitElementorContentSlider(){
        $j(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_content_slider.default', function() {
                initContentSlider();
            } );
        });
    }

})(jQuery);