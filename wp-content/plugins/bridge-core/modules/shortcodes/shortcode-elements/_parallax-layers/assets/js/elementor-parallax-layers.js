(function($) {
    'use strict';

    var elementorParallaxLayers = {};
    qode.modules.elementorParallaxLayers = elementorParallaxLayers;

    elementorParallaxLayers.qodeInitElementorParallaxLayers = qodeInitElementorParallaxLayers;


    elementorParallaxLayers.qodeOnWindowLoad = qodeOnWindowLoad;

    $(window).on('load', qodeOnWindowLoad );

    /*
     ** All functions to be called on $(window).load() should be in this function
     */
    function qodeOnWindowLoad() {
        qodeInitElementorParallaxLayers();
    }

    function qodeInitElementorParallaxLayers(){
        $j(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_parallax_layers.default', function() {
                parallaxLayers();
            } );
        });
    }

})(jQuery);