'use strict';

jQuery(function ($) {

  $(document).on('click', '#monsterinsights-entry-user-journey .parameter-toggle', function (event) {

    event.preventDefault();
    $(this).closest('td').find('.parameters').toggle();
  });

  /**
   * Ajax Pagination for User Journey Metabox results.
   *
   * @since 1.0.2
   */
  $(document).on('click', '.monsterinsights-user-journey-page', function (event) {
    event.preventDefault();

    let page = $(this).data('page');
    let id = $(this).data('id');
    let provider = $(this).data('provider');
    const ajax_url = monsterinsights_uj.ajax_url;
    const admin_nonce = monsterinsights_uj.admin_ajax_none;

    let result_div = $('#monsterinsights-user-journey-ajax-result');

    let data = {
      action: 'monsterinsights_paginate_user_journey',
      page: page,
      id: id,
      provider: provider,
      nonce: admin_nonce,
    };

    $.post(
      ajax_url,
      data
    ).done(function (data) {
      result_div.html(data);
    });
  });
});
