(function($) {
    'use strict';

    var elementorExpandingImages = {};
    qode.modules.elementorExpandingImages = elementorExpandingImages;

    elementorExpandingImages.qodeInitElementorExpandingImages = qodeInitElementorExpandingImages;


    elementorExpandingImages.qodeOnWindowLoad = qodeOnWindowLoad;

    $(window).on('load', qodeOnWindowLoad);

    /*
     ** All functions to be called on $(window).load() should be in this function
     */
    function qodeOnWindowLoad() {
        qodeInitElementorExpandingImages();
    }

    function qodeInitElementorExpandingImages(){
        $j(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_expanding_images.default', function() {
                initExpandingImages();
            } );
        });
    }

})(jQuery);