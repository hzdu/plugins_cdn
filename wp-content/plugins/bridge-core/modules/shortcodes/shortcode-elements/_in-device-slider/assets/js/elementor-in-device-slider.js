(function($) {
    'use strict';

    var elementorInDeviceSlider = {};
    qode.modules.elementorInDeviceSlider = elementorInDeviceSlider;

    elementorInDeviceSlider.qodeInitElementorInDeviceSlider = qodeInitElementorInDeviceSlider;


    elementorInDeviceSlider.qodeOnWindowLoad = qodeOnWindowLoad;

    $(window).on('load', qodeOnWindowLoad );

    /*
     ** All functions to be called on $(window).load() should be in this function
     */
    function qodeOnWindowLoad() {
        qodeInitElementorInDeviceSlider();
    }

    function qodeInitElementorInDeviceSlider(){
        $j(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_in_device_slider.default', function() {
                initInDeviceSlider();
            } );
        });
    }

})(jQuery);