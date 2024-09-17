'use strict';

(function($) {
  $(document).on('click touch', '#wpc_add_update_key', function(e) {
    e.preventDefault();

    var $this = $(this);
    var key = $('#wpc_update_key').val();
    var site = $('#wpc_update_site').val();
    var email = $('#wpc_update_email').val();

    if (key.length > 10) {
      $this.val('Verifying...');
      $('.wpclever_update_keys_form').addClass('wpclever_update_keys_disabled');

      var data = {
        action: 'wpc_check_update_key',
        key: key,
        site: site,
        email: email,
      };

      $.post(ajaxurl, data, function(response) {
        location.reload();
      });
    } else {
      $('#wpc_update_key').focus();
    }
  });

  $(document).on('click touch', '.wpc_remove_key', function(e) {
    e.preventDefault();

    var $this = $(this);
    var r = confirm('Are you sure?');

    if (r == true) {
      $this.html('removing...');

      var data = {
        action: 'wpc_remove_key',
        key: $this.attr('data-key'),
      };

      $.post(ajaxurl, data, function(response) {
        location.reload();
      });
    }
  });

  $(document).on('click touch', '.wpc-notice .notice-dismiss', function(e) {
    e.preventDefault();

    var $this = $(this).closest('.wpc-notice');
    var key = $this.attr('data-dismissible');

    if (key !== '') {
      $this.css('opacity', '0.5');

      var data = {
        action: 'wpc_dismiss_notice',
        key: key,
      };

      $.post(ajaxurl, data, function(response) {
        $this.slideUp();
      });
    }
  });
})(jQuery);