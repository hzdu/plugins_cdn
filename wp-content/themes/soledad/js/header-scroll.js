(function($) {
  'use strict';
  var PENCI = PENCI || {};
  /* Single Post Scroll
 ---------------------------------------------------------------*/
  PENCI.singlepoststyle = function() {
    if (!$('body').hasClass('single')) {
      return;
    }
    
    if (!$('body').find('.pencihd-iscroll-bar').length) {
      $('body').prepend('<span class="pencihd-iscroll-bar"></span>');
    }
    
    $('.pencihd-iscroll-bar').css({
      position: 'fixed',
      left: 0,
      width: 0,
      height: parseInt(ajax_var_more.reading_bar_h),
      backgroundColor: 'var(--pcaccent-cl)',
      zIndex: 999999999999,
    });
    
    if (ajax_var_more.reading_bar_pos === 'header') {
      $('.pencihd-iscroll-bar').css({
        top: 0,
      });
    } else {
      $('.pencihd-iscroll-bar').css({
        bottom: 0,
      });
    }
    
    if ($('body').hasClass('rtl')) {
      $('.pencihd-iscroll-bar').css({
        left: 'auto',
        right: 0,
      });
    }
  };
  PENCI.singlepostscrollin = function() {
    
    $('article.post').bind('inview', function (event, visible, topOrBottomOrBoth) {
      if (visible == true) {
        var t = $(this),
            total = 0,
            h = 0,
            entry_content = t.find('.entry-content'),
            e_top = entry_content.offset().top,
            header_h = $('.penci-header-wrap').outerHeight(),
            bottom = e_top + header_h,
            stop = 0;
  
        t.addClass('inview');
  
        setTimeout(function() {
          h = entry_content.get(0).getBoundingClientRect().height;
          bottom = bottom + h;
        }, 100);
  
        $(window).scroll(function(e) {
          stop = $(window).scrollTop() + header_h;
    
          if (stop > e_top && stop < bottom) {
            total = ((stop - e_top) / (bottom - e_top)) * 100;
            $('.pencihd-iscroll-bar').css('width', total + '%');
          } else {
            $('.pencihd-iscroll-bar').css('width', '0%');
          }
        });
      } else {
        $(this).removeClass('inview');
      }
    });
    
  };
  
  $(document).ready(function() {
    PENCI.singlepostscrollin();
    PENCI.singlepoststyle();
    $('body').on('single_loaded_more', function() {
      PENCI.singlepostscrollin();
    });
  });
})(jQuery); // EOF