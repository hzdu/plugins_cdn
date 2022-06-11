jQuery(document).ready(function ($) {
    'use strict';
    $('.vi-ui.dropdown').dropdown({placeholder: ''});
    $('.vi-ui.checkbox').checkbox();
    $(document).on('click', '.woo-orders-tracking-webhooks-url-copy', function () {
        let $temp = $('<input>');
        $('body').append($temp);
        let $container = $(this).closest('.woo-orders-tracking-webhooks-url-container');
        let webhook_url = $container.find('.woo-orders-tracking-webhooks-url').val();
        $temp.val(webhook_url).select();
        document.execCommand('copy');
        $temp.remove();
        $container.find('.check').show().fadeOut(10000);
    });
    $('#woo-orders-tracking-webhooks_password').on('change', function () {
        let $webhook_url = $('.woo-orders-tracking-webhooks-url');
        let url = new URL($webhook_url.val());
        url.searchParams.set('secret_key', $(this).val());
        $webhook_url.val(url.href)
    })
});