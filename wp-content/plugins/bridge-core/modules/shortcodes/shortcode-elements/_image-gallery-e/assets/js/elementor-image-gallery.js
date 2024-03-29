(function($) {
    'use strict';

    var elementorImageGallery = {};
    qode.modules.elementorImageGallery = elementorImageGallery;

    elementorImageGallery.qodeInitElementorImageGallery = qodeInitElementorImageGallery;


    elementorImageGallery.qodeOnWindowLoad = qodeOnWindowLoad;

    $(window).on('load', qodeOnWindowLoad );

    /*
     ** All functions to be called on $(window).load() should be in this function
     */
    function qodeOnWindowLoad() {
        qodeInitElementorImageGallery();
    }

    function qodeInitElementorImageGallery(){
        $j(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_image_gallery.default', function() {
                initFlexSlider();
            } );
        });
    }

})(jQuery);