(function($) {
  'use strict';
  var PENCI = PENCI || {};
  /* Single Post Scroll
 ---------------------------------------------------------------*/
  PENCI.singlepostscrollin_share = function() {
    
    $('.penci-single-block').bind('inview', function (event, visible, topOrBottomOrBoth) {
      var t = $(this);
      if (visible == true) {
        t.addClass('inview');
      } else {
        t.removeClass('inview');
      }
    });
    
  };
  
  $(document).ready(function() {
    PENCI.singlepostscrollin_share();
    $('body').on('single_loaded_more', function() {
      PENCI.singlepostscrollin_share();
    });
  });
})(jQuery); // EOF