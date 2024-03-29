(function($) {
    'use strict';

    var elementorGlobal = {};
    qode.modules.elementorGlobal = elementorGlobal;

    elementorGlobal.qodeInitElementorGlobal = qodeInitElementorGlobal;

    elementorGlobal.qodeOnWindowLoad = qodeOnWindowLoad;

    $(window).on('load', qodeOnWindowLoad);

    /*
     ** All functions to be called on $(window).load() should be in this function
     */
    function qodeOnWindowLoad() {
        qodeInitElementorGlobal();
    }

    function qodeInitElementorGlobal(){
        $j(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/global', function() {
                initParallax();
                initElementorParallaxFX();
                initFullScreenTemplate();
                if( 'object' === typeof qode.modules.stickyWidget ) {
                    qode.modules.stickyWidget.qodeInitStickyWidget();
                }
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