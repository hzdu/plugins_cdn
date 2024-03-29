(function($) {
    'use strict';

    var elementorIconText = {};
    qode.modules.elementorIconText = elementorIconText;

    elementorIconText.qodeInitElementorIconText = qodeInitElementorIconText;


    elementorIconText.qodeOnWindowLoad = qodeOnWindowLoad;

    $(window).on('load', qodeOnWindowLoad );

    /*
     ** All functions to be called on $(window).load() should be in this function
     */
    function qodeOnWindowLoad() {
        qodeInitElementorIconText();
    }

    function qodeInitElementorIconText(){
        $j(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_icon_text.default', function() {
                initIconWithTextHover();
                initIconShortcodeHover();
                initIconWithTextAnimation();
            } );
        });
    }

})(jQuery);