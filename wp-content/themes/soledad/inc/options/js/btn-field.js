(function ($) {
  "use strict";

  "use strict";
  $('[data-type="render_separate_css"]').on("click", function (e) {
    var $this = $(this),
      $nonce = $this.data("nonce"),
      $ajaxurl = $this.data("adminjax");
    e.preventDefault();

    $this.removeClass("success").addClass("loading");

    $.ajax({
      type: "post",
      dataType: "json",
      url: $ajaxurl,
      data: {
        action: "penci_render_separate_css_file",
        _nonce: $nonce,
      },
      success: function () {
        $this.removeClass("loading").addClass("success");
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("The following error occured: " + textStatus, errorThrown);
      },
    });
  });

  $('[data-type="penci_speed_delete_cache"]').on("click", function (event) {
    var $this = $(this),
      $nonce = $this.data("nonce"),
      $ajaxurl = $this.data("adminjax"),
      $parent = $this.closest(".customize-control");
    event.preventDefault();
    $(this).addClass("loading");
    $.ajax({
      type: "post",
      dataType: "json",
      url: $ajaxurl,
      data: {
        action: "penci_speed_delete_cache",
        _nonce: $nonce,
      },
      success: function () {
        $this.removeClass("loading").addClass("success");
        $parent.find(".description span.count").html(0);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("The following error occured: " + textStatus, errorThrown);
      },
    });
  });
})(jQuery);
