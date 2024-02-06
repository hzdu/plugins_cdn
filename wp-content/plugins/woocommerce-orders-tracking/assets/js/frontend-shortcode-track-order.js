jQuery(document).ready(function ($) {
    'use strict';
    $(document).on('click', '.woo-orders-tracking-multiple-carriers-select-link', function () {
        let $button = $(this);
        let $container = $button.closest('.woo-orders-tracking-shortcode-timeline-container');
        let $overlay = $container.find('.woo-orders-tracking-cainiao-originCp-selector-overlay');
        $.ajax({
            url: vi_wot_shortcode_timeline.ajax_url,
            type: 'GET',
            dataType: 'JSON',
            data: {
                action: 'vi_woo_orders_tracking_ajax_shortcode_timeline',
                tracking_id: $button.data('tracking_id'),
                woo_orders_tracking_nonce: $button.data('woo_orders_tracking_nonce'),
            },
            beforeSend: function () {
                $overlay.removeClass('woo-orders-tracking-hidden');
            },
            success: function (response) {
                if (response.status === 'success') {
                    $container.html(response.data)
                } else {
                    $overlay.addClass('woo-orders-tracking-hidden');
                    alert('An error occurs. Please try again later.');
                }
            },
            error: function (err) {
                $overlay.addClass('woo-orders-tracking-hidden');
                alert('An error occurs. Please try again later.');
            },
        });
    });
    $(document).on('click', '.woo-orders-tracking-cainiao-originCp-option', function () {
        let $button = $(this);
        let $container = $button.closest('.woo-orders-tracking-shortcode-timeline-container');
        $container.find('.woo-orders-tracking-cainiao-originCp-option').removeClass('woo-orders-tracking-cainiao-originCp-option-active');
        if (!$button.hasClass('.woo-orders-tracking-cainiao-originCp-option')) {
            $button.addClass('woo-orders-tracking-cainiao-originCp-option-active');
        }
    });
    $(document).on('click', '.woo-orders-tracking-cainiao-originCp-submit', function () {
        let $button = $(this);
        let $container = $button.closest('.woo-orders-tracking-shortcode-timeline-container');
        let $form = $container.find('.woo-orders-tracking-cainiao-originCp-selector');
        let $overlay = $container.find('.woo-orders-tracking-cainiao-originCp-selector-overlay');
        let $selected = $container.find('.woo-orders-tracking-cainiao-originCp-option-active');
        if ($selected.length > 0) {
            $.ajax({
                url: vi_wot_shortcode_timeline.ajax_url,
                type: 'GET',
                dataType: 'JSON',
                data: {
                    action: 'vi_woo_orders_tracking_cainiao_submit_carrier',
                    woo_orders_tracking_nonce: $('.vi-woocommerce-orders-tracking-form-search').find('input[name="woo_orders_tracking_nonce"]').val(),
                    origincp: $selected.data('origincp'),
                    tracking_code: $container.data('tracking_code'),
                    tracking_from_db: $form.data('tracking_from_db'),
                    carrier_name: $form.data('carrier_name'),
                    display_name: $form.data('display_name'),
                },
                beforeSend: function () {
                    $overlay.removeClass('woo-orders-tracking-hidden');
                },
                success: function (response) {
                    if (response.status === 'success') {
                        $container.html(response.data)
                    } else {
                        $overlay.addClass('woo-orders-tracking-hidden');
                        alert('An error occurs. Please try again later.');
                    }
                },
                error: function (err) {
                    $overlay.addClass('woo-orders-tracking-hidden');
                    alert('An error occurs. Please try again later.');
                },
            });
        } else {
            alert('Please select a carrier!!!');
        }
    })
});