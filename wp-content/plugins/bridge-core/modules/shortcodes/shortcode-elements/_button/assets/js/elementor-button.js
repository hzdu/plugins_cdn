(function($) {
    'use strict';

    var elementorButton = {};
    qode.modules.elementorButton = elementorButton;

    elementorButton.qodeInitElementorButton = qodeInitElementorButton;


    elementorButton.qodeOnWindowLoad = qodeOnWindowLoad;

    $(window).on('load', qodeOnWindowLoad);

    /*
     ** All functions to be called on $(window).load() should be in this function
     */
    function qodeOnWindowLoad() {
        qodeInitElementorButton();
    }

    function qodeInitElementorButton(){
        $j(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_button.default', function() {
                initButtonHover();
                initEnlargeButton();
            } );
        });
    }

})(jQuery);