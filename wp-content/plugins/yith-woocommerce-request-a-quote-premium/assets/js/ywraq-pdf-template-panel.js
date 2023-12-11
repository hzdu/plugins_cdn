/**
 * Javascript functions to administrator pane
 *
 * @package YITH\RequestAQuote
 * @since   1.0.0
 * @version 1.0.0
 * @author  YITH <plugins@yithemes.com>
 */
jQuery(function($) {
  'use strict';
  var blockParams = {
    message: null,
    overlayCSS: {background: '#fff', opacity: 0.7},
    ignoreIfBlocked: true,
  };
  /** PDF Templates List **/
  var setDefaultTemplate = function() {
    $(document).find('.default-badge').closest('tr').addClass('is-default');
  };

  // Set the default template.
  $(document).on('click', '.set-default-badge', function() {
    var $t = $(this),
        postID = $t.data('post'),
        nonce = $t.data('nonce');
    $('.table-view-list').block(blockParams);
    $.post(document.location.href,
        {post_id: postID, request: 'set_default_template', security: nonce}).
        done(function(data) {
          if (data !== '') {
            var c = $('<div></div>').html(data),
                table = c.find('.table-view-list');
            $('.table-view-list').html(table.html());
            $('.table-view-list').unblock();
            setDefaultTemplate();
          }
        });
  });

  setDefaultTemplate();

  /** PDF Templates Editor **/
  if ($('#ywraq_pdf_template_title').length) {
    $(document).
        on('click', '.components-toggle-group-control-option', function(e) {
          window.onbeforeunload = null;
          e.preventDefault();
          return true;
        });

    $(document).
        on('click',
            'button.component-item, .components-item-group, .components-color-palette__custom-color',
            function(e) {
              window.onbeforeunload = null;
              e.preventDefault();
            });

  }

  $(document).
      on('click', '.block-editor-post-preview__button-toggle', function(e) {
        e.preventDefault();
        $.ajax({
          type: 'POST',
          url: yith_ywraq_admin.ajaxurl,
          data: {
            'action': 'ywraq_template_pdf_preview',
            'pdf_template_preview': $('#post_ID').val(),
            'preview_product' : ywraq_pdf_template.preview_products
          },
          success: function(response) {
            if (response && response.pdf) {
              window.open(
                  response.pdf, '_blank');
            }
          },
        });
      });

});

wp.domReady(() => {
  if (wp.blocks) {
    wp.blocks.unregisterBlockStyle('core/image', 'default');
    wp.blocks.unregisterBlockStyle('core/image', 'rounded');
    wp.blocks.unregisterBlockStyle('core/separator', 'wide');
    wp.blocks.unregisterBlockStyle('core/separator', 'dots');
  }
});