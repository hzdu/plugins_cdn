"use strict";
jQuery(document).ready(function () {
  //Validate form with JQuery----------
  jQuery.validator.addMethod(
    "domain",
    function (value, element) {
      return (
        this.optional(element) ||
        /^https:\/\/chat.whatsapp.com/.test(value) ||
        /^(\+)?\d+$/.test(value)
      );
    },
    "Please enter a valid phone number or group link"
  );
  jQuery.validator.setDefaults({
    //debug: true,
    errorClass: "wa-validate-error",
    success: "valid",
  });
  jQuery("#whatsapp-setting-form").validate({
    rules: {
      dokan_whatsapp_number: {
        required: true,
        domain: true,
      },
      dokan_whatsapp_button_label: {
        required: true,
      },
    },
  });
  //Validate-----------------

  jQuery(".nta-wa-switch-control label").click(function () {
    if (jQuery(this).prev().is(":checkbox")) {
      jQuery(this).prev().prop("checked", !jQuery(this).prev().prop("checked"));
      if (jQuery(this).prev().prop("checked")) {
        jQuery(this).prev().attr("checked", "checked");
      }
    }
    if (jQuery(this).hasClass("green")) {
      jQuery(this).removeClass("green");
    } else {
      jQuery(this).addClass("green");
    }
  });

  jQuery("#dokan_update_whatsapp_settings").click(function (event) {
    event.preventDefault();
    jQuery("#whatsapp-setting-form").valid();
    var waNumber = jQuery("#dokan_whatsapp_number").val();
    var waBtnLabel = jQuery("#dokan_whatsapp_button_label").val();
    var waButtonPosition = jQuery("#dokan-whatsapp-position-select").val();
    var waDisplayFloatWidget = jQuery("#dokan_whatsapp_floating_widget").prop(
      "checked"
    );
    if (jQuery("#whatsapp-setting-form").valid()) {
      jQuery(this).addClass("disabled");
      jQuery(".dokan-wa-loading-icon").addClass(
        "dashicons dashicons-update wa-update-loading"
      );
      jQuery.ajax({
        url: window.settingWADokan.adminAjax,
        type: "POST",
        data: {
          action: "dokan_save_wa_setting",
          waNumber: waNumber,
          waBtnLabel: waBtnLabel,
          waButtonPosition: waButtonPosition,
          waDisplayFloatWidget: waDisplayFloatWidget,
          dokan_wa_setting_nonce: window.settingWADokan.nonce,
        },
        success: function (response) {
          jQuery("#dokan_update_whatsapp_settings").removeClass("disabled");
          jQuery(".dokan-wa-loading-icon").removeClass(
            "dashicons dashicons-update wa-update-loading"
          );
          jQuery(".dokan-ajax-response").html(
            '<div class="dokan-alert dokan-alert-success"><p>' +
              window.settingWADokan.successMessage +
              "</p></div>"
          );
        },
        error: function (response) {
          jQuery("#dokan_update_whatsapp_settings").removeClass("disabled");
          jQuery(".dokan-wa-loading-icon").removeClass(
            "dashicons dashicons-update wa-update-loading"
          );
          jQuery(".dokan-ajax-response").html(
            '<div class="dokan-alert dokan-alert-danger"><p>' +
              window.settingWADokan.errorMessage +
              "</p></div>"
          );
        },
      });
    }
  });
});
