/* global user_registration_woocommerce_params */
(function ($) {
  var UR_Woocommerce_Admin = {
    init: function () {
      // WooCommerce Setting page start.

      // Check all checkbox.
      $(document).on(
        "change",
        ".user_registration_woocommerce_form_fields_wrapper .urwc-select-all",
        function () {
          var $this = $(this),
            $parent_table = $this.closest(
              ".user_registration_woocommerce_form_fields_wrapper table"
            ),
            $table_body = $parent_table.find("tbody");

          if ($this.is(":checked")) {
            $table_body
              .find('tr td:first-child input[type="checkbox"]')
              .prop("checked", true);
            $parent_table.find(".urwc-select-all").prop("checked", true);
          } else {
            $table_body
              .find('tr td:first-child input[type="checkbox"]')
              .prop("checked", false);
            $parent_table.find(".urwc-select-all").prop("checked", false);
          }
        }
      );

      $(document).on(
        "change",
        "#user_registration_woocommerce_settings_form",
        function () {
          var $this = $(this),
            $sync_checkout = $(
              "#user_registration_woocommrece_settings_sync_checkout"
            ),
            $sync_registration = $(
              "#user_registration_woocommrece_settings_replace_login_registration"
            );
          if ($this.val() === "0") {
            $sync_checkout.closest("tr").hide();
            $sync_registration.closest("tr").hide();
          } else {
            $sync_checkout.closest("tr").show();
            $sync_registration.closest("tr").show();
          }
          $sync_checkout.trigger("change");
        }
      );

      $(document).on(
        "change",
        "#user_registration_woocommrece_settings_sync_checkout",
        function () {
          var $this = $(this),
            $form = $("#user_registration_woocommerce_settings_form"),
            $table_wrapper = $this
              .closest("div.user-registration")
              .find("div.user_registration_woocommerce_form_fields_wrapper"),
            data = {
              action:
                "user_registration_woocommerce_setting_form_field_listing",
              security:
                user_registration_woocommerce_params.user_registration_woocommerce_form_field_listing,
              form_id: $form.val(),
              option_key: $this.data("field_option_key"),
            };

          if ($this.is(":checked") && "0" !== $form.val()) {
            $.ajax({
              url: user_registration_woocommerce_params.ajax_url,
              data: data,
              type: "POST",
              beforeSend: function () {
                $form.attr("disabled", "disabled");
                $this.attr("disabled", "disabled");
              },
              success: function (response) {
                if (typeof response.data.table === "undefined") {
                  $table_wrapper.html("");
                } else {
                  $table_wrapper.html(response.data.table);
                }
              },
              complete: function () {
                $form.prop("disabled", false);
                $this.prop("disabled", false);
              },
            });
          } else {
            $table_wrapper.html("");
          }
        }
      );
      // WooCommerce Setting page end.
    },
  };

  $(document).ready(function () {
    UR_Woocommerce_Admin.init();
  });
})(jQuery);
