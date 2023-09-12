"use strict";

;
(function ($) {
  $(function () {
    // Close modal
    var rafflepressModalClose = function rafflepressModalClose() {
      if ($('#rafflepress-modal-select-giveaway').length) {
        $('#rafflepress-modal-select-giveaway').get(0).selectedIndex = 0;
        $('#rafflepress-modal-checkbox-title, #rafflepress-modal-checkbox-description').prop('checked', false);
      }
      $('#rafflepress-modal-backdrop, #rafflepress-modal-wrap').css('display', 'none');
      $(document.body).removeClass('modal-open');
    };
    // Open modal when media button is clicked
    $(document).on('click', '.rafflepress-insert-giveaway-button', function (event) {
      event.preventDefault();
      $('#rafflepress-modal-backdrop, #rafflepress-modal-wrap').css('display', 'block');
      $(document.body).addClass('modal-open');
    });
    // Close modal on close or cancel links
    $(document).on('click', '#rafflepress-modal-close, #rafflepress-modal-cancel a', function (event) {
      event.preventDefault();
      rafflepressModalClose();
    });
    // Insert shortcode into TinyMCE
    $(document).on('click', '#rafflepress-modal-submit', function (event) {
      event.preventDefault();
      var shortcode;
      shortcode = '[rafflepress id="' + $('#rafflepress-modal-select-giveaway').val() + '"';
      if ($('#rafflepress-modal-checkbox-title').is(':checked')) {
        shortcode = shortcode + ' title="true"';
      }
      if ($('#rafflepress-modal-checkbox-description').is(':checked')) {
        shortcode = shortcode + ' description="true"';
      }
      shortcode = shortcode + ']';
      wp.media.editor.insert(shortcode);
      rafflepressModalClose();
    });
  });
})(jQuery);