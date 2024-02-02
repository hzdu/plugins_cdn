jQuery(document).ready(function ($) {
    'use strict';
    $('.vi-ui.dropdown').dropdown({placeholder:''});
    $(document).on('click', '.s2w-webhooks-url-copy', function () {
        let $temp = $('<input>');
        $('body').append($temp);
        let $container = $(this).closest('.s2w-webhooks-url-container');
        let webhook_url = $container.find('.s2w-webhooks-url').val();
        $temp.val(webhook_url).select();
        document.execCommand('copy');
        $temp.remove();
        $container.find('.check').show().fadeOut(10000);
    });
    /**
     * Show/hide additional description for barcode
     */
    $('select[name="s2w_webhooks_products_options[]"]').on('change', function (e) {
        let options = $(this).val();
        if (options.indexOf('barcode') > -1) {
            $('.s2w-barcode-description').fadeIn(200);
        } else {
            $('.s2w-barcode-description').fadeOut(200);
        }
    }).trigger('change');
});
