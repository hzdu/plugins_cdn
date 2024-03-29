(function($) {
    'use strict';

    var elementorInfoCardWithIcon = {};
    qode.modules.elementorInfoCardWithIcon = elementorInfoCardWithIcon;

    elementorInfoCardWithIcon.qodeInitElementorInfoCardWithIcon = qodeInitElementorInfoCardWithIcon;


    elementorInfoCardWithIcon.qodeOnWindowLoad = qodeOnWindowLoad;

    $(window).on('load', qodeOnWindowLoad);

    /*
     ** All functions to be called on $(window).load() should be in this function
     */
    function qodeOnWindowLoad() {
        qodeInitElementorInfoCardWithIcon();
    }

    function qodeInitElementorInfoCardWithIcon(){
        $j(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_info_card_with_icon.default', function() {
                qodeIcon().init();
            } );
        });
    }

})(jQuery);