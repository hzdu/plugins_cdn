(function($) {
    'use strict';


    $(window).on('load', qodeOnWindowLoad );

    /*
     ** All functions to be called on $(window).load() should be in this function
     */
    function qodeOnWindowLoad() {
        qodeElementorInitProductList();
    }

    /*
     ** Testimonials
     */
    function qodeElementorInitProductList(){
        $j(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_product_list.default', function() {
                qodeInitProductListMasonryShortcode();
            } );
        });
    }

})(jQuery);