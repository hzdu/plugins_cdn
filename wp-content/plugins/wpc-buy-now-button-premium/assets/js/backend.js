'use strict';

(function($) {
  $(function() {
    wpcbn_settings();
    $('#wpcbn_settings_cats').selectWoo();
  });

  $(document).on('change', '.wpcbn_redirect', function() {
    wpcbn_settings();
  });

  function wpcbn_settings() {
    var redirect = $('.wpcbn_redirect').find(':selected').val();

    $('.wpcbn_hide_if_redirect').hide();
    $('.wpcbn_show_if_redirect_' + redirect).show();
  }
})(jQuery);