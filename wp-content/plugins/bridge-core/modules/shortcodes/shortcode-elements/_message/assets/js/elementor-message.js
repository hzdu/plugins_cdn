(function($) {
    'use strict';

    var elementorMessage = {};
    qode.modules.elementorMessage = elementorMessage;

    elementorMessage.qodeInitElementorMessage = qodeInitElementorMessage;


    elementorMessage.qodeOnWindowLoad = qodeOnWindowLoad;

    $(window).on('load', qodeOnWindowLoad );

    /*
     ** All functions to be called on $(window).load() should be in this function
     */
    function qodeOnWindowLoad() {
        qodeInitElementorMessage();
    }

    function qodeInitElementorMessage(){
        $j(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_message.default', function() {
                initMessages();
                initMessageHeight();
            } );
        });
    }

})(jQuery);