(function($) {
    'use strict';

    var elementorImageHover = {};
    qode.modules.elementorImageHover = elementorImageHover;

    elementorImageHover.qodeInitElementorImageHover = qodeInitElementorImageHover;


    elementorImageHover.qodeOnWindowLoad = qodeOnWindowLoad;

    $(window).on('load', qodeOnWindowLoad );

    /*
     ** All functions to be called on $(window).load() should be in this function
     */
    function qodeOnWindowLoad() {
        qodeInitElementorImageHover();
    }

    function qodeInitElementorImageHover(){
        $j(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_image_hover.default', function() {
                initImageHover();
            } );
        });
    }

})(jQuery);