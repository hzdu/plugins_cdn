(function($) {
    'use strict';

    var elementorMasonryGallery = {};
    qode.modules.elementorMasonryGallery = elementorMasonryGallery;

    elementorMasonryGallery.qodeInitElementorMasonryGallery = qodeInitElementorMasonryGallery;


    elementorMasonryGallery.qodeOnWindowLoad = qodeOnWindowLoad;

    $(window).on('load', qodeOnWindowLoad );

    /*
     ** All functions to be called on $(window).load() should be in this function
     */
    function qodeOnWindowLoad() {
        qodeInitElementorMasonryGallery();
    }

    function qodeInitElementorMasonryGallery(){
        $j(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_masonry_gallery.default', function() {
                initMasonryGallery();
            } );
        });
    }

})(jQuery);