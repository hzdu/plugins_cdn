(function($) {
    'use strict';

    var elementorImageGallery = {};
    qode.modules.elementorImageGallery = elementorImageGallery;

    elementorImageGallery.qodeInitElementorAdvancedImageGalleryMasonry = qodeInitElementorAdvancedImageGalleryMasonry;


    elementorImageGallery.qodeOnWindowLoad = qodeOnWindowLoad;

    $(window).on('load', qodeOnWindowLoad );

    /*
     ** All functions to be called on $(window).load() should be in this function
     */
    function qodeOnWindowLoad() {
        qodeInitElementorAdvancedImageGalleryMasonry();
    }

    function qodeInitElementorAdvancedImageGalleryMasonry(){
        $j(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_advanced_image_gallery.default', function() {
                qode.modules.owlSlider.qodeOwlSlider();
                qode.modules.imageGallery.qodeInitAdvancedImageGalleryMasonry();
            } );
        });
    }

})(jQuery);