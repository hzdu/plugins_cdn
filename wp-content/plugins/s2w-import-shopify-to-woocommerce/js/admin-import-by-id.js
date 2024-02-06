jQuery(document).ready(function ($) {
    'use strict';
    let active = false;
    $('.vi-ui.dropdown').dropdown();
    $('.s2w-button-import').on('click', function () {
        if (active) {
            return;
        }
        let $button = $(this);
        let $item_id = $('#s2w-shopify-item-id');
        let item_id = $item_id.val();
        if (item_id) {
            active = true;
            $button.addClass('loading');
            $.ajax({
                url: s2w_params_admin_import_by_id.url,
                type: 'POST',
                dataType: 'JSON',
                data: {
                    action: 's2w_import_shopify_to_woocommerce_by_id',
                    item_id: item_id,
                    import_type: $('#s2w-import-item-type').val(),
                    _s2w_nonce: s2w_params_admin_import_by_id._s2w_nonce,
                },
                success: function (response) {
                    $('.s2w-import-message').append('<p>' + response.message.toString() + '</p>')
                },
                error: function (err) {

                },
                complete: function () {
                    active = false;
                    $button.removeClass('loading');
                }
            })
        } else {
            alert(s2w_params_admin_import_by_id.i18n_empty_alert);
            $item_id.focus();
        }
    })
});
