(function($) {
    'use strict';

    var elementorAdvancedTabs = {};
    qode.modules.elementorAdvancedTabs = elementorAdvancedTabs;

    elementorAdvancedTabs.qodeInitElementorAdvancedTabs = qodeInitElementorAdvancedTabs;


    elementorAdvancedTabs.qodeOnWindowLoad = qodeOnWindowLoad;

    $(window).on('load', qodeOnWindowLoad );

    /*
     ** All functions to be called on $(window).load() should be in this function
     */
    function qodeOnWindowLoad() {
        qodeInitElementorAdvancedTabs();
    }

    function qodeInitElementorAdvancedTabs(){
        $j(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_tabs.default', function() {
                qodeInitAdvancedTabs();
                qodeInitAdvancedTabsIcons();
            } );
        });
    }

})(jQuery);