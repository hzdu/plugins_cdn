'use strict';

(function($) {
  var wpcas_timer = 0;
  var wpcas_auto_exclude = '#wpcas_search_keyword, #wpcsa_search_input, #woosc_search_input';

  if (wpcas_vars.auto_exclude !== '') {
    wpcas_auto_exclude += ', ' + wpcas_vars.auto_exclude;
  }

  // auto show
  if (wpcas_vars.auto_show !== 'no') {
    $(document).
        on('click touch',
            'input[type="search"]:not(' + wpcas_auto_exclude + ')',
            function() {
              var $this = $(this);

              if (wpcas_vars.auto_show === 'yes_inline') {
                var offset = $this.offset();
                var width = $this.outerWidth();
                var height = $this.outerHeight();

                $('#wpcas-area').
                    css('top', offset.top + height).css('left', offset.left).
                    css('width', width).css('max-width', width);
                wpcas_show('inline');
              } else {
                wpcas_toggle('popup');
              }

              if ($this.hasClass('wpcas-animated-placeholder') &&
                  ($this.val() === '') &&
                  (wpcas_vars.placeholder_clicking === 'keep')) {
                var placeholder = $this.attr('placeholder');

                $this.val(placeholder).trigger('change');
                $('#wpcas_search_keyword').val(placeholder).trigger('change');
                $('.wpcas-area').data('kw', placeholder);
                wpcas_ajax_search();
              }
            });

    $(document).
        on('keyup', 'input[type="search"]:not(' + wpcas_auto_exclude + ')',
            function() {
              if (wpcas_vars.auto_show === 'yes_inline') {
                var $this = $(this);
                var offset = $this.offset();
                var width = $this.outerWidth();
                var height = $this.outerHeight();

                $('#wpcas-area').
                    css('top', offset.top + height).css('left', offset.left).
                    css('width', width).css('max-width', width);
                wpcas_show('inline');
              } else {
                wpcas_toggle('popup');
              }

              var kw = $(this).val();

              if (kw !== '') {
                $('.wpcas-area').data('kw', kw);

                if (wpcas_timer != null) {
                  clearTimeout(wpcas_timer);
                }

                wpcas_timer = setTimeout(wpcas_ajax_search, 300);
                return false;
              }
            });

    if (wpcas_vars.animated_placeholder !== '' &&
        wpcas_vars.animated_placeholder !== '[]') {
      $(document).
          find('input[type="search"]:not(' + wpcas_auto_exclude + ')').
          addClass('wpcas-animated-placeholder').
          placeholderTypewriter(JSON.parse(wpcas_vars.animated_placeholder));

      $('#wpcas_search_keyword').
          addClass('wpcas-animated-placeholder').
          placeholderTypewriter(JSON.parse(wpcas_vars.animated_placeholder));
    }
  }

  $(document).on('click touch', '#wpcas_search_keyword', function() {
    var $this = $(this);

    if ($this.hasClass('wpcas-animated-placeholder') &&
        ($this.val() === '') &&
        (wpcas_vars.placeholder_clicking === 'keep')) {
      var placeholder = $this.attr('placeholder');

      $this.val(placeholder).trigger('change');
      $('#wpcas_search_keyword').val(placeholder).trigger('change');
      $('.wpcas-area').data('kw', placeholder);
      wpcas_ajax_search();
    }
  });

  $(document).on('click touch', function(e) {
    if (($(e.target).closest('.wpcas-area').length === 0) && ($(e.target).
                closest('input[type="search"]:not(#wpcas_search_keyword)').length ===
            0) && ($(e.target).closest(wpcas_vars.manual_show).length === 0) &&
        ($(e.target).closest('.wpcas-menu-item a').length === 0)) {
      wpcas_hide();
    }
  });

  // manual show
  if (wpcas_vars.manual_show !== '') {
    $(document).on('click touch', wpcas_vars.manual_show, function(e) {
      wpcas_toggle('popup');
      e.preventDefault();
    });
  }

  // search menu
  $(document).on('click touch', '.wpcas-menu-item a', function(e) {
    wpcas_toggle('popup');
    e.preventDefault();
  });

  $(document).on('click touch', '.wpcas-close', function() {
    wpcas_hide();
  });

  $(document).on('click touch', 'a[href="#wpcas"]', function(e) {
    var kw = $(this).text();

    if ($('.wpcas-area').hasClass('wpcas-area-show-inline')) {
      $('input[type="search"]:not(#wpcas_search_keyword)').
          val(kw).
          trigger('keyup');
    } else {
      $('#wpcas_search_keyword').val(kw).trigger('keyup');
    }

    e.preventDefault();
  });

  $(document).on('keyup', '#wpcas_search_keyword', function() {
    var kw = $('#wpcas_search_keyword').val();

    if (kw !== '') {
      $('.wpcas-area').data('kw', kw);

      if (wpcas_timer != null) {
        clearTimeout(wpcas_timer);
      }

      wpcas_timer = setTimeout(wpcas_ajax_search, 300);
      return false;
    }
  });

  $(document).on('change', '#wpcas_search_cats', function() {
    if (wpcas_timer != null) {
      clearTimeout(wpcas_timer);
    }

    wpcas_timer = setTimeout(wpcas_ajax_search, 300);
    return false;
  });

  $(document).on('wpcas_show', function() {
    setTimeout(function() {
      $('#wpcas_search_keyword').get(0).focus();
    }, 300);
  });

  function wpcas_ajax_search() {
    if ($('.wpcas-area').data('kw') != undefined &&
        $('.wpcas-area').data('kw') != '') {
      $('.wpcas-search-input-icon').addClass('wpcas-loading');
      $('.wpcas-search-result').addClass('wpcas-loading');
      // ajax search product
      wpcas_timer = null;

      var data = {
        action: 'wpcas_search',
        keyword: $('.wpcas-area').data('kw'),
        category: $('#wpcas_search_cats').length ?
            $('#wpcas_search_cats').val() :
            0,
        nonce: wpcas_vars.nonce,
      };

      $.post(wpcas_vars.ajax_url, data, function(response) {
        $('.wpcas-search-result').html(response).removeClass('wpcas-loading');
        $('.wpcas-search-input-icon').removeClass('wpcas-loading');
        wpcas_perfect_scrollbar();
        $(document.body).trigger('wpcas_loaded');
        $(document.body).trigger('wpcas_searched');
      });
    }
  }
})(jQuery);

function wpcas_perfect_scrollbar() {
  if (wpcas_vars.perfect_scrollbar === 'yes') {
    jQuery('.wpcas-search-result').
        perfectScrollbar({suppressScrollX: true, theme: 'wpc'});
  }
}

function wpcas_show(context = '') {
  if (context === 'popup') {
    jQuery('.wpcas-area').addClass('wpcas-position-' + wpcas_vars.position);
  } else {
    jQuery('.wpcas-area').
        removeClass(
            'wpcas-position-01 wpcas-position-02 wpcas-position-03 wpcas-position-04 wpcas-position-05');
  }

  jQuery('body').addClass('wpcas-body-show wpcas-body-show-' + context);
  jQuery('.wpcas-area').addClass('wpcas-area-show wpcas-area-show-' + context);

  wpcas_perfect_scrollbar();

  jQuery(document.body).trigger('wpcas_show_' + context);
  jQuery(document.body).trigger('wpcas_show');
}

function wpcas_hide(context = '') {
  jQuery('.wpcas-area').
      attr('style', '').
      removeClass(
          'wpcas-area-show wpcas-area-show-inline wpcas-area-show-popup');

  jQuery('body').
      removeClass(
          'wpcas-body-show wpcas-body-show-inline wpcas-body-show-popup');

  setTimeout(function() {
    jQuery('.wpcas-area').addClass('wpcas-position-' + wpcas_vars.position);
  }, 500);

  jQuery(document.body).trigger('wpcas_hide_' + context);
  jQuery(document.body).trigger('wpcas_hide');
}

function wpcas_toggle(context = '') {
  if (jQuery('body').hasClass('wpcas-body-show')) {
    wpcas_hide(context);
  } else {
    wpcas_show(context);
  }

  jQuery(document.body).trigger('wpcas_toggle_' + context);
  jQuery(document.body).trigger('wpcas_toggle');
}
