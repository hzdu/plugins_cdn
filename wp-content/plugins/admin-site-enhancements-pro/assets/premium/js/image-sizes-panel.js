(function( $ ) {
   'use strict';

   $(document).ready( function() {
    
    tippy('.copy-url-button', {
      content: 'URL copied!',
      placement: 'right',
      arrow: true,
      theme: 'light',
      trigger: 'click',
      onShow(instance) {
        setTimeout(() => {
          instance.hide();
        }, 1000);
      }
    });

    var clipboard = new ClipboardJS('.copy-url-button');

    clipboard.on('success', function(e) {
      // console.log(e);
    });

    clipboard.on('error', function(e) {
      // console.log(e);
    });

   }); // END OF $(document).ready()

})( jQuery );