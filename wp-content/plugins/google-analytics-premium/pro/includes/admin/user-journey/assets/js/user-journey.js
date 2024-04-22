'use strict';

jQuery(function ($) {

  $(document).on('click', '#monsterinsights-activate-user-journey', function (event) {

    event.preventDefault();

    var button = $(this);
    var redirect_url = $(this).data('admin-url');

    $.ajax({
      type: "post",
      dataType: "json",
      url: monsterinsights_user_journey.ajax_url,
      data: {
        action: "monsterinsights_activate_addon",
        plugin: 'monsterinsights-user-journey/monsterinsights-user-journey.php',
        nonce: monsterinsights_user_journey.activate_addon_nonce,
        isnetwork: monsterinsights_user_journey.is_network,
      },
      success: function (response) {
        if (response && true === response) {
          window.location = redirect_url;
        } else {
          alert(response.error);
          return false;
        }
      }
    });
  });
});
