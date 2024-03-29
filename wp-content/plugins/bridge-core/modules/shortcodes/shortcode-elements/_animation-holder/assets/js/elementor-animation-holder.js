(function($) {
    'use strict';

    var elementorAnimationHolder = {};
    qode.modules.elementorAnimationHolder = elementorAnimationHolder;

    elementorAnimationHolder.qodeInitElementorAnimationHolder = qodeInitElementorAnimationHolder;


    elementorAnimationHolder.qodeOnWindowLoad = qodeOnWindowLoad;

    $(window).on('load', qodeOnWindowLoad);

    /*
     ** All functions to be called on $(window).load() should be in this function
     */
    function qodeOnWindowLoad() {
        qodeInitElementorAnimationHolder();
    }

    function qodeInitElementorAnimationHolder(){
        $j(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_animation_holder.default', function() {
                initElementsAnimation();
            } );
        });
    }

})(jQuery);