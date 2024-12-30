(function ($) {
  "use strict";

  $(document).on("keyup", ".cfs-spacings-field", function () {
    var $parent = $(this).closest(".csf-fieldset"),
      $save_field = $parent.find(".cfs-spacings-saved-field"),
      $input_fields = $parent.find(".cfs-spacings-field"),
      saved_string = "";

    $input_fields.each(function () {
      var $field = $(this);
      var field_value = $.isNumeric($field.val())
        ? parseInt($field.val(), 10)
        : "-";
      if ($.isNumeric(field_value) || "-" === field_value) {
        saved_string += field_value + ", ";
      }
    });

    $save_field.val(saved_string.replace(/,\s*$/, "")).trigger("change");
  });

  $(document).on("click", ".csf-field-import button", function (e) {
    e.preventDefault();
    var t = $(this),
      wrapper = t.closest(".csf-field-import"),
      nonce = t.data("nonce"),
      ajaxurl = t.data("ajaxurl"),
      data = wrapper.find("textarea").val();

    if (!data.length) {
      alert("Please insert the import content");
      return;
    }

    t.addClass("loading");
    t.html("Importing ...");

    $.ajax({
      type: "post",
      url: ajaxurl,
      data: {
        action: "penci_options_import_data",
        data: data,
        _nonce: nonce,
      },
      success: function (response) {
        t.removeClass("loading");
        t.html("Import Successfully. Redirecting ...");
        window.onbeforeunload = null;
        location.reload();
      },
    });
  });

  var $default_data = {
    soledad_theme_options: {},
    csf_transient: { section: $(".csf-section-id").val() },
    csf_options_noncesoledad_theme_options: $(
      "#csf_options_noncesoledad_theme_options"
    ).val(),
    _wp_http_referer: $('input[name="_wp_http_referer"]').val(),
  };
  localStorage.removeItem("_mod_soledad");
  $("#csf-form").on("change", ":input", function (e) {
    var t = $(this),
      $name = t.attr("name");

      $(document).find(".csf-save").removeAttr("disabled");
    $name = $name.replace("soledad_theme_options[", "").replace("]", "");
    $default_data.soledad_theme_options[$name] = t.val();
    localStorage.setItem("_mod_soledad", JSON.stringify($default_data));
  });
})(jQuery);