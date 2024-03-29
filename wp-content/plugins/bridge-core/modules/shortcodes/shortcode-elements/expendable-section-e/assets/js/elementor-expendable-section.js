(function($) {
    'use strict';

    var elementorExpendableSection = {};
    qode.modules.elementorExpendableSection = elementorExpendableSection;

    elementorExpendableSection.qodeInitElementorExpendableSection = qodeInitElementorExpendableSection;


    elementorExpendableSection.qodeOnWindowLoad = qodeOnWindowLoad;

    $(window).on('load', qodeOnWindowLoad);

    /*
     ** All functions to be called on $(window).load() should be in this function
     */
    function qodeOnWindowLoad() {
        qodeInitElementorExpendableSection();
    }

    function qodeInitElementorExpendableSection(){
        $j(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_expendable_section.default', function() {
                initMoreFacts();
            } );
        });
    }

})(jQuery);