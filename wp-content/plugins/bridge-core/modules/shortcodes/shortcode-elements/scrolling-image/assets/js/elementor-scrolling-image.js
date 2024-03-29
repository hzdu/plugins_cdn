(function($) {
    'use strict';

    var elementorScrollingImage = {};
    qode.modules.elementorScrollingImage = elementorScrollingImage;

    elementorScrollingImage.qodeInitElementorScrollingImage = qodeInitElementorScrollingImage;


    elementorScrollingImage.qodeOnWindowLoad = qodeOnWindowLoad;

    $(window).on('load', qodeOnWindowLoad);

    /*
     ** All functions to be called on $(window).load() should be in this function
     */
    function qodeOnWindowLoad() {
        qodeInitElementorScrollingImage();
    }

    function qodeInitElementorScrollingImage(){
        $j(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_scrolling_image.default', function() {
                qodeScrollingImage();
            } );
        });
    }

})(jQuery);