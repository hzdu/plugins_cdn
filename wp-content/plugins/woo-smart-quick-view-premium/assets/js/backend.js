'use strict';

(function($) {
  $(function() {
    woosq_view_type();
    woosq_button_icon();

    $('.woosq_icon_picker').fontIconPicker();

    $('.woosq-summary').sortable({
      handle: '.label',
    });

    $('#woosq_settings_cats').selectWoo();
  });

  $(document).on('change', 'select.woosq_view', function() {
    woosq_view_type();
  });

  $(document).on('change', 'select.woosq_button_icon', function() {
    woosq_button_icon();
  });

  function woosq_view_type() {
    var type = $('select.woosq_view').val();

    $('.woosq_view_type').hide();
    $('.woosq_view_type_' + type).show();
  }

  function woosq_button_icon() {
    var button_icon = $('select.woosq_button_icon').val();

    if (button_icon !== 'no') {
      $('.woosq-show-if-button-icon').show();
    } else {
      $('.woosq-show-if-button-icon').hide();
    }
  }
})(jQuery);