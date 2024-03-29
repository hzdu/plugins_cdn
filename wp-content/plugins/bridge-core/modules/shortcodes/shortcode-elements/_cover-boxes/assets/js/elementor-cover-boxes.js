(function($) {
    'use strict';

    var elementorCoverBoxes = {};
    qode.modules.elementorCoverBoxes = elementorCoverBoxes;

    elementorCoverBoxes.qodeInitElementorCoverBoxes = qodeInitElementorCoverBoxes;


    elementorCoverBoxes.qodeOnWindowLoad = qodeOnWindowLoad;

    $(window).on('load', qodeOnWindowLoad);

    /*
     ** All functions to be called on $(window).load() should be in this function
     */
    function qodeOnWindowLoad() {
        qodeInitElementorCoverBoxes();
    }

    function qodeInitElementorCoverBoxes(){
        $j(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_cover_boxes.default', function() {
                initCoverBoxes();
            } );
        });
    }

})(jQuery);