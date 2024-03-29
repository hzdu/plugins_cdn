(function($) {
    'use strict';

    var elementorInteractiveIconShowcase = {};
    qode.modules.elementorInteractiveIconShowcase = elementorInteractiveIconShowcase;

    elementorInteractiveIconShowcase.qodeInitElementorInteractiveIconShowcase = qodeInitElementorInteractiveIconShowcase;


    elementorInteractiveIconShowcase.qodeOnWindowLoad = qodeOnWindowLoad;

    $(window).on('load', qodeOnWindowLoad);

    /*
     ** All functions to be called on $(window).load() should be in this function
     */
    function qodeOnWindowLoad() {
        qodeInitElementorInteractiveIconShowcase();
    }

    function qodeInitElementorInteractiveIconShowcase(){
        $j(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_interactive_icon_showcase.default', function() {
                qodeInitInteractiveIconShowcase();
            } );
        });
    }

})(jQuery);
