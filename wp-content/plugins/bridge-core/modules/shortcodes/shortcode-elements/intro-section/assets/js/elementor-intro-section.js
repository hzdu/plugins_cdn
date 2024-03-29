(function($) {
    'use strict';

    var elementorIntroSection = {};
    qode.modules.elementorIntroSection = elementorIntroSection;

    elementorIntroSection.qodeInitElementorIntroSection = qodeInitElementorIntroSection;


    elementorIntroSection.qodeOnWindowLoad = qodeOnWindowLoad;

    $(window).on('load', qodeOnWindowLoad);

    /*
     ** All functions to be called on $(window).load() should be in this function
     */
    function qodeOnWindowLoad() {
        qodeInitElementorIntroSection();
    }

    function qodeInitElementorIntroSection(){
        $j(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_intro_section.default', function() {
                qode.modules.introSection.qodeIntroSection();
            } );
        });
    }

})(jQuery);
