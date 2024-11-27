"use strict";
jQuery(document).ready(function () {
  let waAllow = window.displayWADokan.whatsappId;
  jQuery(".single-product .wa__widget_container#wa").remove();
  jQuery(".dokan-store .wa__widget_container#wa").remove();
  jQuery(".nta-woo-products-button .nta_wa_button").each(function (index) {
    if (jQuery(this).attr("data-id") != waAllow) {
      jQuery(this).parent().remove();
    }
  });
  jQuery(".nta-woo-products-button").css("display", "block");
});
