(function($) {
    'use strict';


    $(window).on('load', qodeOnWindowLoad );

    /*
     ** All functions to be called on $(window).load() should be in this function
     */
    function qodeOnWindowLoad() {
        qodeElementorInitProductListPinterest();
    }

    /*
     ** Testimonials
     */
    function qodeElementorInitProductListPinterest(){
        $j(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_product_list_masonry.default', function() {
                qodeInitProductListMasonryPinterestShortcode();
            } );
        });
    }

})(jQuery);