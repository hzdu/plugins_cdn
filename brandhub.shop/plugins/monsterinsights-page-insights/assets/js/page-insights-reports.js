function MonsterInsights_Posts_Reports() {

  var self = this,
    $ = window.jQuery,
    posts_table = document.querySelector('.wp-list-table'),
    page_body = document.querySelector('body'),
    reports_overlay = document.querySelector('.monsterinsights-reports-overlay'),
    $reports_overlay = $(reports_overlay),
    overlay_title = reports_overlay.querySelector('.monsterinsights-reports-overlay-title-text'),
    overlay_content = reports_overlay.querySelector('.monsterinsights-reports-overlay-content'),
    close_button = reports_overlay.querySelector('.monsterinsights-close-overlay'),
    report_interval = reports_overlay.querySelector('#monsterinsights-report-interval'),
    load_element = overlay_content.innerHTML,
    $error_template = $(document.getElementById('monsterinsights-pageinsights-error-template')).html();

  this.state = {
    type: 'users',
    interval: '30days',
    post_id: ''
  };

  this.init = function () {

    if (null === posts_table) {
      // If page is modified by a plugin prevent init.
      return false;
    }

    self.add_events();
    self.check_empty_column();
  };

  this.set = function (property, value) {
    if ('undefined' === typeof this.state[property]) {
      console.log('Unknown property to set');
      return;
    }

    // No need to push if value hasn't changed.
    if ('string' === typeof value && this.state[property] === value) {
      return false;
    }

    if ('object' === typeof value && JSON.stringify(this.state[property]) === JSON.stringify(value)) {
      return false;
    }

    this.state[property] = value;
  };

  this.get = function (property) {
    if ('undefined' === typeof this.state[property]) {
      console.log('Unknown property to get: ' + property);
      return false;
    }
    var value = this.state[property];
    if ('object' === typeof value) {
      value = $.extend(true, {}, value);
    }

    return value;
  };

  this.add_events = function () {

    posts_table.addEventListener('click', function (event) {
      var el = event.target;
      if (el.classList && el.classList.contains('monsterinsights-reports-loader')) {
        event.preventDefault();
        self.open_reports_overlay(el);
      }
    });

    close_button.addEventListener('click', function (event) {
      event.preventDefault();
      self.close_overlay();
    });

    $reports_overlay.on('click.monsterinsights', function (event) {
      if (event.target === reports_overlay) {
        self.close_overlay();
      }
    });

    report_interval.addEventListener('change', function (event) {
      self.set('interval', event.target.value);
      self.grab_report_content();
    });
  };

  this.open_reports_overlay = function (el) {
    if (el.dataset.post_id) {

      this.set('post_id', el.dataset.post_id);

      // Start loading report.
      overlay_title.innerText = '"' + el.dataset.title + '"';

      self.show_overlay();
      self.grab_report_content();

    }
  };

  this.show_overlay = function () {
    page_body.classList.add('monsterinsights-reports-overlay-visible');
    report_interval.focus();
    self.add_close_handlers();
  };

  this.close_overlay = function () {
    page_body.classList.remove('monsterinsights-reports-overlay-visible');
    self.remove_close_handlers();

    var element = document.querySelector('.monsterinsights-reports-loader[data-post_id="' + this.get('post_id') + '"]');
    element.focus();
  };

  // Register events with custom namespace to handle closing the overlay without interfering with other functionality.
  this.add_close_handlers = function () {
    $(document).on('keyup.monsterinsights', function (e) {
      if (27 === e.keyCode) {
        self.close_overlay();
      }
    });
  };

  // Remove events added when the overlay was opened.
  this.remove_close_handlers = function () {
    $(document).off('keyup.monsterinsights');
  };

  this.grab_report_content = function () {

    var self = this;
    overlay_content.innerHTML = load_element;

    $.ajax({
      url: ajaxurl,
      data: {
        action: 'monsterinsights_pageinsights_refresh_report',
        security: monsterinsights_page_insights_admin.admin_nonce,
        isnetwork: monsterinsights_page_insights_admin.isnetwork,
        report: 'pageinsights',
        interval: self.get('interval'),
        post_id: self.get('post_id')
      }
    }).done(function (response) {
      if (response.success && response.data.html) {
        overlay_content.innerHTML = response.data.html;
      } else if (response.success && response.data.more) {
        overlay_content.innerHTML = response.data.more + load_element;
        self.start_more_polling();
      } else {
        var text = response.data.message ? response.data.message : monsterinsights_page_insights_admin.error_default;
        $(overlay_content).html(self.error_markup(monsterinsights_page_insights_admin.error_text, text, false));
      }
    }).error(function (XMLHttpRequest, textStatus, errorThrown) {
      console.log(XMLHttpRequest);

      var error_details_text = '' === XMLHttpRequest.responseText ? monsterinsights_page_insights_admin.error_default : XMLHttpRequest.status + ' - ' + XMLHttpRequest.responseText;
      $(overlay_content).html(self.error_markup(monsterinsights_page_insights_admin.error_text, error_details_text, false));
    });
  };

  this.error_markup = function (title, text, footer) {
    var error_template = $($error_template);

    error_template.find('.monsterinsights-pageinsights-error-title').html(title);
    error_template.find('.monsterinsights-pageinsights-error-content').html(text);

    if (footer) {
      error_template.find('.monsterinsights-pageinsights-error-footer').html(footer).addClass('visible');
    }

    return error_template;
  };

  this.check_empty_column = function () {
    // Checks if the insights column is empty ( author can't view data for any of the posts in the list ) and removes the column.
    var column_data = $('.monsterinsights_reports.column-monsterinsights_reports');
    var delete_column = true;
    column_data.each(function () {
      if ($(this).html().length > 0) {
        delete_column = false;
      }
    });

    if (delete_column) {
      $('.column-monsterinsights_reports').remove();
    }
  };

  this.start_more_polling = function () {
    $.ajax({
      url: ajaxurl,
      data: {
        action: 'monsterinsights_pageinsights_check_background_progress',
        security: monsterinsights_page_insights_admin.admin_nonce,
      }
    }).done(function (response) {
      if (response.success) {
        if (response.data.done) {
          self.grab_report_content();
        } else {
          setTimeout(function () {
            self.start_more_polling();
          }, 3000);
        }
      } else {
        var text = response.data.message ? response.data.message : monsterinsights_page_insights_admin.error_default;
        $(overlay_content).html(self.error_markup(monsterinsights_page_insights_admin.error_text, text, false));
      }
    }).error(function (XMLHttpRequest, textStatus, errorThrown) {
      console.log(XMLHttpRequest);

      var error_details_text = '' === XMLHttpRequest.responseText ? monsterinsights_page_insights_admin.error_default : XMLHttpRequest.status + ' - ' + XMLHttpRequest.responseText;
      $(overlay_content).html(self.error_markup(monsterinsights_page_insights_admin.error_text, error_details_text, false));
    });
  };

  self.init();

}

new MonsterInsights_Posts_Reports();
