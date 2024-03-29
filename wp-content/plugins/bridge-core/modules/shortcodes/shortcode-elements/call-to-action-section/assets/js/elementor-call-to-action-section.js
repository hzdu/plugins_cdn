(function($) {
    'use strict';

    var elementorCallToActionSection = {};
    qode.modules.elementorCallToActionSection = elementorCallToActionSection;

    elementorCallToActionSection.qodeInitElementorCallToActionSection = qodeInitElementorCallToActionSection;


    elementorCallToActionSection.qodeOnWindowLoad = qodeOnWindowLoad;

    $(window).on('load', qodeOnWindowLoad );

    /*
     ** All functions to be called on $(window).load() should be in this function
     */
    function qodeOnWindowLoad() {
        qodeInitElementorCallToActionSection();
    }

    function qodeInitElementorCallToActionSection(){
        $j(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_call_to_action_section.default', function() {
                qodeCTASection().init();
            } );
        });
    }

})(jQuery);