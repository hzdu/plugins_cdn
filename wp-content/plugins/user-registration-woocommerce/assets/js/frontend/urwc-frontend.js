/* global wc_country_select_params */
(function ($) {
  var UR_Woocommerce_Frontend = {
    init: function () {
      this.handle_state_country();
      this.handle_separate_shipping();
      this.handle_checkout_page();
      this.handle_billing_phone();

      $(".user-registration-form-login-toggle")
        .parent()
        .find("form.user-registration-form-login")
        .hide();
    },
    handle_separate_shipping: function () {
      $(".field-separate_shipping").each(function () {
        var $this = $(this);
        var form_selector = $this.closest("form.register");

        if ($this.find("#separate_shipping").length) {
          var shipping_fields = [
            "shipping_country",
            "shipping_first_name",
            "shipping_last_name",
            "shipping_company",
            "shipping_address_1",
            "shipping_address_2",
            "shipping_city",
            "shipping_state",
            "shipping_postcode",
          ];

          if ($this.find("#separate_shipping").prop("checked")) {
            $.each(shipping_fields, function (index, item) {
              form_selector
                .find("#" + item + "")
                .parent()
                .parent()
                .show();
              form_selector.find(".field-shipping_address_title").show();
            });
          } else {
            $.each(shipping_fields, function (index, item) {
              form_selector
                .find("#" + item + "")
                .parent()
                .parent()
                .hide();
              form_selector.find(".field-shipping_address_title").hide();
            });
          }

          $this.find("#separate_shipping").on("change", function () {
            if ($(this).prop("checked")) {
              $.each(shipping_fields, function (index, item) {
                form_selector
                  .find("#" + item + "")
                  .parent()
                  .parent()
                  .show();
                form_selector.find(".field-shipping_address_title").show();
              });
            } else {
              $.each(shipping_fields, function (index, item) {
                form_selector
                  .find("#" + item + "")
                  .parent()
                  .parent()
                  .hide();
                form_selector.find(".field-shipping_address_title").hide();
              });
            }
          });
        }
      });
    },
    handle_state_country: function () {
      // Update shipping address country/state.
      UR_Woocommerce_Frontend.update_country_states({
        country_field_class: "field-shipping_country",
        state_field_class: "field-shipping_state",
        state_input_id: "shipping_state",
        state_label: "State / Country",
      });
      // Update billing address country/state.
      UR_Woocommerce_Frontend.update_country_states({
        country_field_class: "field-billing_country",
        state_field_class: "field-billing_state",
        state_input_id: "billing_state",
        state_label: "State / Country",
      });

      $(document.body).on("change", "#billing_country", function () {
        // Update billing address country/state.
        UR_Woocommerce_Frontend.update_country_states({
          country_field_class: "field-billing_country",
          state_field_class: "field-billing_state",
          state_input_id: "billing_state",
          state_label: "State / Country",
        });
      });
      $(document.body).on("change", "#shipping_country", function () {
        // Update shipping address country/state.
        UR_Woocommerce_Frontend.update_country_states({
          country_field_class: "field-shipping_country",
          state_field_class: "field-shipping_state",
          state_input_id: "shipping_state",
          state_label: "State / Country",
        });
      });
    },
    handle_checkout_page: function () {
      var date_selector = $('.woocommerce  input[type="date"]');

      if (date_selector.length) {
        date_selector
          .addClass("flatpickr-field")
          .attr("type", "text")
          .flatpickr({
            disableMobile: true,
          });
      }

      if ($('input[type="checkbox"]#createaccount').length) {
        var $ur_fields = $("form.woocommerce-checkout").find(
          ".user-registration"
        );
        if (!$('input[type="checkbox"]#createaccount').is(":checked")) {
          $ur_fields.hide();
        }

        $('input[type="checkbox"]#createaccount').on("change", function () {
          if ($(this).is(":checked")) {
            $ur_fields.slideDown(1000);
          } else {
            $ur_fields.hide();
          }
        });
      }
    },
    /**
     * Update/Sync a state field with its relative country field.
     *
     * @param {JSON} options List of required params in `options`:
     * - country_field_class : Classname of country field.
     * - state_field_class   : Classname of state field.
     * - state_input_id      : ID of state field's input element.
     * - state_label         : Label for state field.
     *
     * @returns {Boolean} Whether successfully updated or not.
     */
    update_country_states: function (options) {
      /* State/Country select boxes */
      var states = JSON.parse(
        wc_country_select_params.countries.replace(/&quot;/g, '"')
      );
      if (
        options.country_field_class &&
        options.state_label &&
        options.state_field_class &&
        options.state_input_id
      ) {
        var $country_field = $("." + options.country_field_class),
          $state_field = $("." + options.state_field_class),
          selected_state = $state_field.find("select").val(),
          selected_country = $country_field.find("select").val(),
          current_states = states[selected_country];

        if ($state_field.find("input").length > 0) {
          var placeholder = $state_field.find("input").attr("placeholder");
        } else if ($state_field.find("select").length > 0) {
          var placeholder = $state_field.find("select").data("placeholder");
        }
        var required_attr = $state_field
          .find(".form-row")
          .is(".validate-required")
          ? 'required="required"'
          : "";
        var select_state_html =
          '<select id = "' +
          options.state_input_id +
          '" class="select ur-frontend-field" name="' +
          options.state_input_id +
          '" ' +
          required_attr +
          'data-placeholder= "' +
          placeholder +
          '"></select>';
        var input_state_html =
          '<span class="input-wrapper"><input data-id="' +
          options.state_input_id +
          '" type="text" class="input-text ur-frontend-field ur-state-country without_icon" name="' +
          options.state_input_id +
          '" id="' +
          options.state_input_id +
          '" data-label="' +
          options.state_label +
          '" ' +
          required_attr +
          ' placeholder = "' +
          placeholder +
          '"></span>';

        $state_field
          .find("select,input,span:not('.ur-portal-tooltip')")
          .remove();

        if (current_states && !Array.isArray(current_states)) {
          $state_field.find(".form-row").append(select_state_html);

          $.each(current_states, function (key, val) {
            $state_field
              .find("select")
              .append("<option value =" + key + ">" + val + "</option>");
          });
        } else {
          if ($("#ur-form-field-icon").val() === "1") {
            $state_field.find(".form-row").append(input_state_html);
            $state_field
              .find(".ur-state-country")
              .after('<span class="ur-icon ur-icon-state"></span>');
            $state_field.find(".ur-state-country").removeClass("without_icon");
          } else {
            $state_field.find(".form-row").append(input_state_html);
          }
        }

        if (
          $state_field.find('select option[value="' + selected_state + '"]')
            .length
        ) {
          $state_field.val(selected_state);
        }

        return true;
      }
      return false;
    },
    //Validate billing phone field
    handle_billing_phone: function () {
      $("#billing_phone").on("input", function () {
        var $this = $(this);
        var inputValue = $this.val();
        inputValue = inputValue.replace(/[^\+0-9]/g, "");
        var firstOccurence = inputValue.slice(1);
        inputValue = inputValue
          .charAt(0)
          .concat(firstOccurence.replaceAll("+", ""));
        $this.val(inputValue);
      });
    },
  };

  $(document).ready(function () {
    UR_Woocommerce_Frontend.init();
  });
})(jQuery);
