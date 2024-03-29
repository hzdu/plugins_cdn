(function($) {
    'use strict';

    var elementorIcon = {};
    qode.modules.elementorIcon = elementorIcon;

    elementorIcon.qodeInitElementorIcon = qodeInitElementorIcon;


    elementorIcon.qodeOnWindowLoad = qodeOnWindowLoad;

    $(window).on('load', qodeOnWindowLoad );

    /*
     ** All functions to be called on $(window).load() should be in this function
     */
    function qodeOnWindowLoad() {
        qodeInitElementorIcon();
    }

    function qodeInitElementorIcon(){
        $j(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_icon.default', function() {
                initIconShortcodeHover();
                initIconWithTextAnimation();
            } );
        });
    }

})(jQuery);