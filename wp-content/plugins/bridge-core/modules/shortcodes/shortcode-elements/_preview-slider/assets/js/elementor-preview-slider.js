(function($) {
    'use strict';

    var elementorPreviewSlider = {};
    qode.modules.elementorPreviewSlider = elementorPreviewSlider;

    elementorPreviewSlider.qodeInitElementorPreviewSlider = qodeInitElementorPreviewSlider;


    elementorPreviewSlider.qodeOnWindowLoad = qodeOnWindowLoad;

    $(window).on('load', qodeOnWindowLoad );

    /*
     ** All functions to be called on $(window).load() should be in this function
     */
    function qodeOnWindowLoad() {
        qodeInitElementorPreviewSlider();
    }

    function qodeInitElementorPreviewSlider(){
        $j(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_preview_slider.default', function() {
                initPreviewSlider();
            } );
        });
    }

})(jQuery);