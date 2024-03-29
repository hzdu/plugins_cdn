(function($) {
    'use strict';

    var elementorEllipticalSlider = {};
    qode.modules.elementorEllipticalSlider = elementorEllipticalSlider;

    elementorEllipticalSlider.qodeInitElementorEllipticalSlider = qodeInitElementorEllipticalSlider;


    elementorEllipticalSlider.qodeOnWindowLoad = qodeOnWindowLoad;

    $(window).on('load', qodeOnWindowLoad );

    /*
     ** All functions to be called on $(window).load() should be in this function
     */
    function qodeOnWindowLoad() {
        qodeInitElementorEllipticalSlider();
    }

    function qodeInitElementorEllipticalSlider(){
        $j(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_elliptical_slider.default', function() {
                qodeInitEllipticalSlider();
            } );
        });
    }

})(jQuery);