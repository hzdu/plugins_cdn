(function($) {
    'use strict';

    var elementorContentMenu = {};
    qode.modules.elementorContentMenu = elementorContentMenu;

    elementorContentMenu.qodeInitElementorContentMenu = qodeInitElementorContentMenu;


    elementorContentMenu.qodeOnWindowLoad = qodeOnWindowLoad;

    $(window).on('load', qodeOnWindowLoad );

    /*
     ** All functions to be called on $(window).load() should be in this function
     */
    function qodeOnWindowLoad() {
        qodeInitElementorContentMenu();
    }

    function qodeInitElementorContentMenu(){
        $j(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_content_menu.default', function() {
                createContentMenu();
                createSelectContentMenu();
                contentMenuPosition();
                contentMenuCheckLastSection();
                contentMenuScrollTo();
            } );
        });
    }

})(jQuery);