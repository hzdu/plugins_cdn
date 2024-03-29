(function($) {
    'use strict';

    var elementorOldTab = {};
    qode.modules.elementorOldTab = elementorOldTab;

    elementorOldTab.qodeInitElementorOldTab = qodeInitElementorOldTab;


    elementorOldTab.qodeOnWindowLoad = qodeOnWindowLoad;

    $(window).on('load', qodeOnWindowLoad );

    /*
     ** All functions to be called on $(window).load() should be in this function
     */
    function qodeOnWindowLoad() {
        qodeInitElementorOldTab();
    }

    function qodeInitElementorOldTab(){
        $j(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_old_tab.default', function() {
                initTabs();
            } );
        });
    }

})(jQuery);