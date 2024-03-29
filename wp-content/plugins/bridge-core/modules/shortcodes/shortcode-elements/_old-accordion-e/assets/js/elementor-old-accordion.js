(function($) {
    'use strict';

    var elementorOldAccordion = {};
    qode.modules.elementorOldAccordion = elementorOldAccordion;

    elementorOldAccordion.qodeInitElementorOldAccordion = qodeInitElementorOldAccordion;


    elementorOldAccordion.qodeOnWindowLoad = qodeOnWindowLoad;

    $(window).on('load', qodeOnWindowLoad );

    /*
     ** All functions to be called on $(window).load() should be in this function
     */
    function qodeOnWindowLoad() {
        qodeInitElementorOldAccordion();
    }

    function qodeInitElementorOldAccordion(){
        $j(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_old_accordion.default', function() {
                initAccordion()
            } );
        });
    }

})(jQuery);