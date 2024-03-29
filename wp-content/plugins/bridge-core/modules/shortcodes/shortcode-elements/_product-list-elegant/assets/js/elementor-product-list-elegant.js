(function($) {
    'use strict';

    var elementorProductListElegant = {};
    qode.modules.elementorProductListElegant = elementorProductListElegant;

    elementorProductListElegant.qodeInitElementorProductListElegant = qodeInitElementorProductListElegant;


    elementorProductListElegant.qodeOnWindowLoad = qodeOnWindowLoad;

    $(window).on('load', qodeOnWindowLoad );

    /*
     ** All functions to be called on $(window).load() should be in this function
     */
    function qodeOnWindowLoad() {
        qodeInitElementorProductListElegant();
    }

    function qodeInitElementorProductListElegant(){
        $j(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_product_list_elegant.default', function() {
                initEnlargeButton();
            } );
        });
    }

})(jQuery);