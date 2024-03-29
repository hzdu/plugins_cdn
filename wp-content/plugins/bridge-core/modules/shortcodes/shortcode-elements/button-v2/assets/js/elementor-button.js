(function($) {
    'use strict';

    var elementorButtonV2 = {};
    qode.modules.elementorButtonV2 = elementorButtonV2;

    elementorButtonV2.qodeInitElementorButtonV2 = qodeInitElementorButtonV2;


    elementorButtonV2.qodeOnWindowLoad = qodeOnWindowLoad;

    $(window).on('load', qodeOnWindowLoad );

    /*
     ** All functions to be called on $(window).load() should be in this function
     */
    function qodeOnWindowLoad() {
        qodeInitElementorButtonV2();
    }

    function qodeInitElementorButtonV2(){
        $j(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_button_v2.default', function() {
                qodeV2Button().init();
            } );
        });
    }

})(jQuery);