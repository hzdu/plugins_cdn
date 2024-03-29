(function($) {
    'use strict';

    var elementorAction = {};
    qode.modules.elementorAction = elementorAction;

    elementorAction.qodeInitElementorAction = qodeInitElementorAction;


    elementorAction.qodeOnWindowLoad = qodeOnWindowLoad;

    $(window).on('load', qodeOnWindowLoad);

    /*
     ** All functions to be called on $(window).load() should be in this function
     */
    function qodeOnWindowLoad() {
        qodeInitElementorAction();
    }

    function qodeInitElementorAction(){
        $j(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_action.default', function() {
                initButtonHover();
            } );
        });

        $j(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/global', function() {
                initParallax();
                initElementorParallaxFX();
                initFullScreenTemplate();
            } );
        });
    }

    function initElementorParallaxFX(){
        var parallaxSection = $('.parallax_section_holder');

        if( parallaxSection.length ){
            parallaxSection.each(function(){
                var parallaxElement = $(this),
                    parallaxSpeedHolder = parallaxElement.find('.qode-parallax-helper-holder'),
                    parallaxSpeed = 1;

                if( parallaxSpeedHolder.length && typeof parallaxSpeedHolder.data('speed') !== 'undefined' && parallaxSpeedHolder.data('speed') !== '' ){
                    parallaxSpeed = parallaxSpeedHolder.data('speed');
                }

                parallaxElement.parallax("50%", parallaxSpeed * 0.4);
            })
        }
    }

})(jQuery);