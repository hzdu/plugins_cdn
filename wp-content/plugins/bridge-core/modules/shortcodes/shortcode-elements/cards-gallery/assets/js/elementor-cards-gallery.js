(function($) {
    'use strict';

    var elementorCardsGallery = {};
    qode.modules.elementorCardsGallery = elementorCardsGallery;

    elementorCardsGallery.qodeInitElementorCardsGallery = qodeInitElementorCardsGallery;


    elementorCardsGallery.qodeOnWindowLoad = qodeOnWindowLoad;

    $(window).on('load', qodeOnWindowLoad );

    /*
     ** All functions to be called on $(window).load() should be in this function
     */
    function qodeOnWindowLoad() {
        qodeInitElementorCardsGallery();
    }

    function qodeInitElementorCardsGallery(){
        $j(window).on('elementor/frontend/init', function () {
            qodeCardsGallery();
            elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_cards_gallery.default', function() {
                qodeCardsGallery();
            } );
        });
    }

})(jQuery);