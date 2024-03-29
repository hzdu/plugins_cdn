(function($) {
    'use strict';

    var elementorWorkflow = {};
    qode.modules.elementorWorkflow = elementorWorkflow;

    elementorWorkflow.qodeInitElementorWorkflow = qodeInitElementorWorkflow;


    elementorWorkflow.qodeOnWindowLoad = qodeOnWindowLoad;

    $(window).on('load', qodeOnWindowLoad);

    /*
     ** All functions to be called on $(window).load() should be in this function
     */
    function qodeOnWindowLoad() {
        qodeInitElementorWorkflow();
    }

    function qodeInitElementorWorkflow(){
        $j(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_workflow.default', function() {
                qodeWorkflow();
            } );
        });
    }

})(jQuery);