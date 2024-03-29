(function($) {
    'use strict';

    var elementorAccordion = {};
    qode.modules.elementorAccordion = elementorAccordion;

    elementorAccordion.qodeInitElementorAccordion = qodeInitElementorAccordion;


    elementorAccordion.qodeOnWindowLoad = qodeOnWindowLoad;

    $(window).on('load', qodeOnWindowLoad );

    /*
     ** All functions to be called on $(window).load() should be in this function
     */
    function qodeOnWindowLoad() {
        qodeInitElementorAccordion();
    }

    function qodeInitElementorAccordion(){
        $j(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_accordion.default', function() {
                qodeInitAccordions();
            } );
        });
    }

})(jQuery);