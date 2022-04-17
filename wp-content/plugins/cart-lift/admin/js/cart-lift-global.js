(function( $ ) {
    'use strict';

    /**
     * all of the code for your admin-facing javascript source
     * should reside in this file.
     *
     * note: it has been assumed you will write jquery code here, so the
     * $ function reference has been prepared for usage within the scope
     * of this function.
     *
     * this enables you to define handlers, for when the dom is ready:
     *
     * $(function() {
     *
     * });
     *
     * when the window is loaded:
     *
     * $( window ).load(function() {
     *
     * });
     *
     * ...and/or other possibilities.
     *
     * ideally, it is not considered best practise to attach more than a
     * single dom-ready or window-load handler for a particular page.
     * although scripts in the wordpress core, plugins and themes may be
     * practising this, we should strive to set a better example in our own work.
     */

    function hide_notice(event) {
        event.preventDefault();
        var $payload = {};

        wpAjaxHelperRequest( 'hide-paddle-notice', $payload )
            .success( function( response ) {
                $(".cl-paddle-notice").remove();
            })
            .error( function( response ) {

            });

    }
    $(document).on('click', '.cl-paddle-notice .notice-dismiss', hide_notice);

})( jQuery );