jQuery(document).ready(function () {
  if (0 === jQuery('#monsterinsights-metabox-page-insights').length) {
    return;
  }

  jQuery('#monsterinsights_show_page_insights').click(function (event) {
    event.preventDefault();

    get_page_insights_ajax(function () {
      jQuery('#monsterinsights-page-insights-content').slideDown('slow');
      jQuery('#monsterinsights_show_page_insights').fadeOut('slow');
    });
  });

  jQuery('#monsterinsights_hide_page_insights').click(function (event) {
    event.preventDefault();
    jQuery('#monsterinsights-page-insights-content').slideUp('slow', function () {
      jQuery('#monsterinsights_show_page_insights').fadeIn('slow');
    });
  });

  jQuery('.monsterinsights-page-insights__tabs-tab').click(function (event) {
    event.preventDefault();
    let tab_target = jQuery(this).data('tab');

    jQuery('.monsterinsights-page-insights__tabs-tab.active').removeClass('active');
    jQuery(this).addClass('active');

    jQuery('.monsterinsights-page-insights-tabs-content__tab.active').removeClass('active');
    jQuery('#' + tab_target).addClass('active');

    get_page_insights_ajax();
  });

  jQuery('#monsterinsights-metabox-skip-tracking input[name=_mi_skip_tracking]').change(function (event) {
    let page_insights = jQuery('#monsterinsights-metabox-page-insights');
    if (0 === page_insights.length) {
      return;
    }

    if (this.checked) {
      page_insights.fadeOut('slow');
    } else {
      page_insights.fadeIn('slow');
    }
  });

  function get_page_insights_ajax(callback) {
    var post_id = jQuery('#post_ID').val();
    if (!post_id) {
      return;
    }

    if (jQuery('#monsterinsights-metabox-page-insights[data-skip-requests]').length) {
      if (callback) {
        callback();
      }
      return;
    }

    var active_tab = jQuery('#monsterinsights-page-insights-content .monsterinsights-page-insights__tabs-tab.active');
    if (active_tab[0].hasAttribute('monsterinsights-loaded')) {
      if (callback) {
        callback();
      }
      return;
    }

    var interval = active_tab.data('interval');

    var show_btn_text = jQuery('#monsterinsights_show_page_insights').text();
    jQuery('#monsterinsights_show_page_insights').text(monsterinsights_page_insights_admin.loading_txt);

    jQuery('#' + active_tab.data('tab') + ' [data-monsterinsights-metric]').text('---');

    jQuery.ajax({
      url: ajaxurl,
      data: {
        action: 'monsterinsights_pageinsights_meta_report',
        security: monsterinsights_page_insights_admin.admin_nonce,
        isnetwork: monsterinsights_page_insights_admin.isnetwork,
        report: 'pageinsights',
        interval: interval,
        post_id: post_id,
      }
    }).done(function (response) {
      jQuery('#monsterinsights_show_page_insights').text(show_btn_text);

      if (response.success && response.data) {
        for (const [index, element] of Object.entries(response.data)) {
          jQuery('#' + active_tab.data('tab') + ' [data-monsterinsights-metric="' + index + '"]').text(element.value);
        }
        active_tab.attr('monsterinsights-loaded', '1');

        if (callback) {
          callback();
        }
      } else {
        var text = response.data.message ? response.data.message : monsterinsights_page_insights_admin.error_default;
        jQuery('#monsterinsights-metabox-page-insights').html(text);
      }
    }).error(function (XMLHttpRequest, textStatus, errorThrown) {
      console.log(XMLHttpRequest);

      var error_details_text = '' === XMLHttpRequest.responseText ? monsterinsights_page_insights_admin.error_default : XMLHttpRequest.status + ' - ' + XMLHttpRequest.responseText;
      jQuery(overlay_content).html(error_details_text);
    });
  }

});
