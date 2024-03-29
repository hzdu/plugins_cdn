(function($) {
    'use strict';

    var elementorCardsSlider = {};
    qode.modules.elementorCardsSlider = elementorCardsSlider;

    elementorCardsSlider.qodeInitElementorCardsSlider = qodeInitElementorCardsSlider;


    elementorCardsSlider.qodeOnWindowLoad = qodeOnWindowLoad;

    $(window).on('load', qodeOnWindowLoad );

    /*
     ** All functions to be called on $(window).load() should be in this function
     */
    function qodeOnWindowLoad() {
        qodeInitElementorCardsSlider();
    }

    /*
     **
     */
    function qodeInitElementorCardsSlider(){
        $j(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_cards_slider.default', function() {
                qodeCardsSlider().init();
            } );
        });
    }

})(jQuery);