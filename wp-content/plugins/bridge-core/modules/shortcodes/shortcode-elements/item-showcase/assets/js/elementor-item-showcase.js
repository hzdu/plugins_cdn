(function($) {
    'use strict';

    var elementorItemShowcase = {};
    qode.modules.elementorItemShowcase = elementorItemShowcase;

    elementorItemShowcase.qodeInitElementorItemShowcase = qodeInitElementorItemShowcase;


    elementorItemShowcase.qodeOnWindowLoad = qodeOnWindowLoad;

    $(window).on('load', qodeOnWindowLoad);

    /*
     ** All functions to be called on $(window).load() should be in this function
     */
    function qodeOnWindowLoad() {
        qodeInitElementorItemShowcase();
    }

    function qodeInitElementorItemShowcase(){
        $j(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_item_showcase.default', function() {
                qodeLazyImages();
                initItemShowcase();
            } );
        });
    }

})(jQuery);
