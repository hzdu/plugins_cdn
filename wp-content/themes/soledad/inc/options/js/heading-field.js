(function ($) {
  ("use strict");

  $(document).on("click", ".csf-field-heading", function (e) {
    e.preventDefault();
    var collapsedClass = "option-collapsed",
      flag = true;

    var recursive_control = function (element, flag) {
      var $next = $(element).next();

      if ($next.length === 0) return;

      if (!$next.hasClass("csf-field-heading")) {
        if (flag) {
          $next.addClass(collapsedClass);
        } else {
          $next.removeClass(collapsedClass);
        }

        recursive_control($next, flag);
      }
    };

    if ($(this).hasClass("collapsed")) {
      $(this).removeClass("collapsed");
      flag = false;
    } else {
      $(this).addClass("collapsed");
      flag = true;
    }

    recursive_control(this, flag);
  });

  $(document).on("click", ".csf-reset-all", function (e) {
    e.preventDefault();
    var t = $(this),
      n = $("#csf_options_noncesoledad_theme_options").val(),
      c = t.attr("data-confirm");
    if (confirm(c)) {
      $.ajax({
        type: "POST",
        url: _wpUtilSettings.ajax.url,
        data: {
          nonce: n,
          action: "penci_reset_all_options",
        },
        dataType: "html",
        success: function (response) {
          $(".csf-form-success")
            .html("Resetting complete. Redirecting...")
            .show();
          location.reload();
        },
      });
    }
  });

  $(document).on("click", ".csf-reset-section", function (e) {
    e.preventDefault();
    var t = $(this),
      sid = $(".csf-section-id").val(),
      n = $("#csf_options_noncesoledad_theme_options").val(),
      c = t.attr("data-confirm");
    if (confirm(c)) {
      $.ajax({
        type: "POST",
        url: _wpUtilSettings.ajax.url,
        data: {
          nonce: n,
          section: sid,
          action: "penci_reset_section",
        },
        dataType: "html",
        success: function (response) {
          $(".csf-form-success")
            .html("Resetting complete. Redirecting...")
            .show();
          location.reload();
        },
      });
    }
  });
  $(".csf-nav-options, .csf-sections").theiaStickySidebar({
    // Settings
    additionalMarginTop: 130,
    containerSelector: ".csf-wrapper",
  });

  $(document).on("click", ".csf-tab-item a", function () {
     $(".csf-nav-options, .csf-sections").theiaStickySidebar({
       // Settings
       additionalMarginTop: 130,
       containerSelector: ".csf-wrapper",
     });
  });
})(jQuery);



