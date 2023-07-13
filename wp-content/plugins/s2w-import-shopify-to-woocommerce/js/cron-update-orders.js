jQuery(document).ready(function ($) {
    'use strict';
    $('.vi-ui.dropdown').dropdown();
    $('input[name="s2w_save_cron_update_orders"]').on('click', function (e) {
        if (!$('#s2w-cron_update_orders_options').val()) {
            alert('Please select at least one option to update');
            e.preventDefault();
        }
        if (!$('#s2w-cron_update_orders_status').val()) {
            alert('Please select order status you want to update');
            e.preventDefault();
        }
    });
});
