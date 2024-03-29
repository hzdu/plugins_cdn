(function($) {
    'use strict';

    var elementorPricingCalculator = {};
    qode.modules.elementorPricingCalculator = elementorPricingCalculator;

    elementorPricingCalculator.qodeInitElementorPricingCalculator = qodeInitElementorPricingCalculator;


    elementorPricingCalculator.qodeOnWindowLoad = qodeOnWindowLoad;

    $(window).on('load', qodeOnWindowLoad);

    /*
     ** All functions to be called on $(window).load() should be in this function
     */
    function qodeOnWindowLoad() {
        qodeInitElementorPricingCalculator();
    }

    function qodeInitElementorPricingCalculator(){
        $j(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_pricing_calculator.default', function() {
                qodeInitPricingCalculator();
            } );
        });
    }

})(jQuery);
