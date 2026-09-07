'use strict';

(function($) {
  $(function() {
    // Load essential kit plugins
    if ($('.wpclever_essential_kit_wrapper').length) {
      $.ajax({
        url: ajaxurl,
        method: 'POST',
        data: {
          action: 'wpc_get_essential_kit',
          security: wpc_kit_vars.nonce,
        },
        dataType: 'html',
        beforeSend: function() {
          $('.wpclever_essential_kit_wrapper').addClass('wpclever_essential_kit_loading');
        },
        complete: function() {
          $('.wpclever_essential_kit_wrapper').removeClass('wpclever_essential_kit_loading');
        },
        success: function(response) {
          $('.wpclever_essential_kit_wrapper').html(response);
        },
      });
    }

    // Sort plugins
    $('body').on('click', '.wpclever_kit_order_a', function(e) {
      e.preventDefault();

      var order = $(this).data('o');
      var $wrapper = $('.wpclever_essential_kit_wrapper');
      var $items = $wrapper.children('.wpc-plugin-card');

      $items.sort(function(a, b) {
        var aVal = parseInt($(a).data(order)) || 0;
        var bVal = parseInt($(b).data(order)) || 0;
        return bVal - aVal;
      });

      $wrapper.append($items);
    });

    // Open search
    $('body').on('click', '.wpclever_kit_search_btn', function(e) {
      e.preventDefault();
      $('.wpclever_kit_order').hide();
      $('.wpclever_kit_search').show().find('.wpclever_kit_search_input').val('').focus();
      // Reset filter
      $('.wpclever_essential_kit_wrapper .wpc-plugin-card').show();
    });

    // Close search
    $('body').on('click', '.wpclever_kit_search_close', function(e) {
      e.preventDefault();
      $('.wpclever_kit_search').hide();
      $('.wpclever_kit_order').show();
      // Reset filter
      $('.wpclever_essential_kit_wrapper .wpc-plugin-card').show();
    });

    // Live filter
    $('body').on('input', '.wpclever_kit_search_input', function() {
      var keyword = $(this).val().toLowerCase();
      $('.wpclever_essential_kit_wrapper .wpc-plugin-card').each(function() {
        var name = $(this).find('.name h3').text().toLowerCase();
        var desc = $(this).find('.desc').text().toLowerCase();
        $(this).toggle(name.indexOf(keyword) !== -1 || desc.indexOf(keyword) !== -1);
      });
    });
  });

  // Install handler
  $('body').on('click', '.install-now', function(e) {
    var _this = $(this);
    var _href = _this.attr('href');

    _this.addClass('updating-message').html('Installing...');

    $.get(_href, function(data) {
      location.reload();
    });

    e.preventDefault();
  });
})(jQuery);
