(function($) {
    'use strict';


    $(window).on('load', qodeOnWindowLoad );

    /*
     ** All functions to be called on $(window).load() should be in this function
     */
    function qodeOnWindowLoad() {
	    qodeInitTestimonialsCarousel();
    }

    /*
     ** TestimonialsCarousel
     */
    function qodeInitTestimonialsCarousel(){
        $j(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_testimonials_carousel.default', function() {
	            initTestimonialsCarousel();
            } );
        });
    }

})(jQuery);