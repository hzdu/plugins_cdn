/**
 * Script for customizer controls.
 */
(function ($, api) {
  api.bind("ready", function () {
    api.previewer.bind("ready", function (message) {
      var $iframe = $("#customize-preview iframe").contents();
      $iframe.find(".soledad-customizer-edit-link").on("click", function (e) {
        if ($(this).hasClass("custom-link")) {
          e.preventDefault();
          var link = $(this).attr("data-href");
          window.open(link, "_blank");
        } else {
          var t = api.section($(this).attr("data-section"));
          t.focus();
        }
      });
    });
  });
})(jQuery, wp.customize);
