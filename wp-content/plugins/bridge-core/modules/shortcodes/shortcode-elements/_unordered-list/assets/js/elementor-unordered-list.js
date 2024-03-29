(function($) {
    'use strict';


    $(window).on('load', qodeOnWindowLoad );

    /*
     ** All functions to be called on $(window).load() should be in this function
     */
    function qodeOnWindowLoad() {
	    qodeInitUnorderedListAnimation();
    }

    /*
     ** Init Unordered List shortcode
     */
    function qodeInitUnorderedListAnimation(){
        $j(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_unordered_list.default', function() {
	            initListAnimation();
            } );
        });
    }

})(jQuery);