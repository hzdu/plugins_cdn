(function ($) {
  jQuery(document).ready(function () {
    /**
     * Ajax install WooCommerce
     * @author M Hemel Hasan
     * @since 3.0
     */
    $(document).on("click", ".tf-install", function (e) {
      e.preventDefault();

      var current = $(this);
      var plugin_slug = current.attr("data-plugin-slug");

      current.addClass("updating-message").text("Installing...");

      var data = {
        action: "ins_pro_ajax_install_plugin",
        _ajax_nonce: ins_pro_params.ins_pro_nonce,
        slug: plugin_slug,
      };

      jQuery
        .post(ins_pro_params.ajax_url, data, function (response) {
          //console.log(response);
          //console.log(response.data.activateUrl);
          current.removeClass("updating-message");
          current.addClass("updated-message").text("Installed!");
          current.attr("href", response.data.activateUrl);
        })
        .fail(function () {
          current.removeClass("updating-message").text("Failed!");
        })
        .always(function () {
          current
            .removeClass("install-now updated-message")
            .addClass("activate-now button-primary")
            .text("Activating...");
          current.unbind(e);
          current[0].click();
        });
    });

    /**
     * License Activator
     * @author M Hemel Hasan
     * @since 3.0
     */
    $(document).on("click", ".tf-license-activate #submit", function (e) {
      e.preventDefault();

      var current = $(this);

      var license_key = $("input[name='tf_settings[license-key]']").val();
      var license_email = $("input[name='tf_settings[license-email]']").val();

      var data = {
        action: "tf_act_license",
        license_key: license_key,
        license_email: license_email,
      };

      jQuery
        .post(ins_params_pro.ajax_url, data, function (response) {
          // console.log(response);
          //console.log(response.data.activateUrl);
        })
        .success(function (response) {
          // console.log(response);
          // location.reload();
        });
    });

  });
})(jQuery);
