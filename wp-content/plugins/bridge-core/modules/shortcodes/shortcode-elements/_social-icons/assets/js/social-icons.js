(function($) {
    'use strict';


    $(window).on('load', qodeOnWindowLoad );

    /*
     ** All functions to be called on $(window).load() should be in this function
     */
    function qodeOnWindowLoad() {
	    qodeElementorInitSocialIcons();
    }

    /*
     ** Testimonials
     */
    function qodeElementorInitSocialIcons(){
        $j(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_social_icons.default', function() {
	            initSocialIconHover();
            } );
        });
    }

})(jQuery);