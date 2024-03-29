(function($) {
    'use strict';

    var elementorSlidingImageHolder = {};
    qode.modules.elementorSlidingImageHolder = elementorSlidingImageHolder;

    elementorSlidingImageHolder.qodeInitElementorSlidingImageHolder = qodeInitElementorSlidingImageHolder;


    elementorSlidingImageHolder.qodeOnWindowLoad = qodeOnWindowLoad;

    $(window).on('load', qodeOnWindowLoad);

    /*
     ** All functions to be called on $(window).load() should be in this function
     */
    function qodeOnWindowLoad() {
        qodeInitElementorSlidingImageHolder();
    }

    function qodeInitElementorSlidingImageHolder(){
        $j(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_sliding_image_holder.default', function() {
                qodeSlidingImageHolder();
            } );
        });
    }

})(jQuery);