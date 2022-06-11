jQuery(document).ready(function ($) {
    'use strict';
    $(document).on('click', '.woo-orders-tracking-tracking-service-copy', function () {
        let $temp = $('<input>');
        $('body').append($temp);
        let $container = $(this).closest('.woo-orders-tracking-tracking-number-container');
        let tracking_number = $container.data('tracking_number');
        $temp.val(tracking_number).select();
        document.execCommand('copy');
        $temp.remove();
        villatheme_admin_show_message(vi_wot_admin_order_manager.message_copy, 'success', tracking_number, false, 2000);
    });
    $(document).on('click', '.woo-orders-tracking-tracking-service-refresh-bulk', function (e) {
        let $button = $(this);
        let $container = $button.closest('.woo-orders-tracking-tracking-service-refresh-bulk-container');
        if (!$container.hasClass('woo-orders-tracking-tracking-service-refresh-bulk-container-loading')) {
            let $refresh_buttons = $('.woo-orders-tracking-tracking-service-refresh');
            if ($refresh_buttons.length > 0) {
                let count = 0;
                $refresh_buttons.map(function () {
                    let $refresh_button_container = $(this).closest('.woo-orders-tracking-tracking-number-container');
                    if (!$refresh_button_container.hasClass('woo-orders-tracking-tracking-number-container-loading') && !$refresh_button_container.hasClass('woo-orders-tracking-tracking-number-container-delivered')) {
                        count++;
                        $(this).click();
                    }
                });
                if (count > 0) {
                    $('.villatheme-admin-show-message-message-item-close').click()
                    $container.addClass('woo-orders-tracking-tracking-service-refresh-bulk-container-loading');
                }
            }
        }
    });
    $(document).on('click', '.woo-orders-tracking-tracking-service-refresh', function (e) {
        let $button = $(this);
        let $container = $button.closest('.woo-orders-tracking-tracking-number-container');
        if ($container.hasClass('woo-orders-tracking-tracking-number-container-loading')) {
            return;
        }
        $.ajax({
            url: vi_wot_admin_order_manager.ajax_url,
            type: 'POST',
            dataType: 'JSON',
            data: {
                action: 'vi_wot_refresh_track_info',
                tracking_number: $container.data('tracking_number'),
                carrier_slug: $container.data('carrier_slug'),
                order_id: $container.data('order_id'),
                action_nonce: $('#_vi_wot_item_nonce').val(),
            },
            beforeSend: function () {
                $container.addClass('woo-orders-tracking-tracking-number-container-loading');
            },
            success: function (response) {
                if (response.status === 'success') {
                    $button.attr('title', response.button_title);
                    if (response.tracking_container_class) {
                        $container.attr('class', response.tracking_container_class);
                    }
                    if (response.tracking_status) {
                        $container.attr('data-tooltip', response.tracking_status);
                    } else {
                        $container[0].removeAttribute('data-tooltip');
                    }
                    villatheme_admin_show_message(response.message, response.status, response.message_content, false, 5000);
                } else {
                    villatheme_admin_show_message(response.message, response.status, response.message_content);
                }
            },
            error: function (err) {
                villatheme_admin_show_message('Error', 'error', err.responseText.replace(/<\/?[^>]+(>|$)/g, ""));
            },
            complete: function () {
                $container.removeClass('woo-orders-tracking-tracking-number-container-loading');
                let $bulk_refresh = $('.woo-orders-tracking-tracking-service-refresh-bulk-container');
                if ($bulk_refresh.hasClass('woo-orders-tracking-tracking-service-refresh-bulk-container-loading') && $('.woo-orders-tracking-tracking-number-container-loading').length === 0) {
                    $bulk_refresh.removeClass('woo-orders-tracking-tracking-service-refresh-bulk-container-loading');
                }
            }
        });
    });
    $(document).on('click', '.woo-orders-tracking-tracking-number-column-container', function (e) {
        e.stopPropagation();
    });
    $(document).on('click', '.woo-orders-tracking-paypal-active', function () {
        let $button = $(this);
        let $paypal_image = $button.find('.woo-orders-tracking-item-tracking-button-add-to-paypal');
        let $result_icon = $('<span class="woo-orders-tracking-paypal-result dashicons"></span>');
        $.ajax({
            url: vi_wot_admin_order_manager.ajax_url,
            type: 'POST',
            dataType: 'JSON',
            data: {
                action: 'vi_woo_orders_tracking_add_tracking_to_paypal',
                item_id: $button.data('item_id'),
                order_id: $button.data('order_id'),
                action_nonce: $('#_vi_wot_item_nonce').val(),
            },
            beforeSend: function () {
                $button.find('.woo-orders-tracking-paypal-result').remove();
                $button.removeClass('woo-orders-tracking-paypal-active').addClass('woo-orders-tracking-paypal-inactive');
                $paypal_image.attr('src', vi_wot_admin_order_manager.loading_image);
            },
            success: function (response) {
                if (response.status === 'success') {
                    $result_icon.addClass('dashicons-yes-alt').addClass('woo-orders-tracking-paypal-result-success');
                    $button.append($result_icon);
                    if (response.paypal_button_title) {
                        $paypal_image.attr('title', response.paypal_button_title);
                    }
                } else {
                    $result_icon.addClass('dashicons-no-alt').addClass('woo-orders-tracking-paypal-result-error');
                    $button.removeClass('woo-orders-tracking-paypal-inactive').addClass('woo-orders-tracking-paypal-active').append($result_icon);
                    $button.append($result_icon);
                }
                $result_icon.attr('title', response.message).fadeOut(10000);
            },
            error: function (err) {
                $result_icon.addClass('dashicons-no-alt').addClass('woo-orders-tracking-paypal-result-error');
                $button.removeClass('woo-orders-tracking-paypal-inactive').addClass('woo-orders-tracking-paypal-active').append($result_icon);
                $button.append($result_icon);
            },
            complete: function () {
                $paypal_image.attr('src', vi_wot_admin_order_manager.paypal_image)
            }
        });
    });
    /*Send tracking email*/
    $(document).on('click', '.woo-orders-tracking-send-tracking-email', function () {
        let $button = $(this);
        let $container = $button.closest('.woo-orders-tracking-send-tracking-email-container');
        if (!$button.hasClass('woo-orders-tracking-loading')) {
            let $result_icon = $('<span class="woo-orders-tracking-result-icon dashicons"></span>');
            $.ajax({
                url: vi_wot_admin_order_manager.ajax_url,
                type: 'POST',
                dataType: 'JSON',
                data: {
                    action: 'vi_woo_orders_tracking_send_tracking_email',
                    order_id: $button.data('order_id'),
                    action_nonce: $('#_vi_wot_item_nonce').val(),
                },
                beforeSend: function () {
                    $container.find('.woo-orders-tracking-result-icon').remove();
                    $button.addClass('woo-orders-tracking-loading');
                },
                success: function (response) {
                    let time_out = 0;
                    if (response.status === 'success') {
                        time_out = 3000;
                        $result_icon.addClass('dashicons-yes-alt').addClass('woo-orders-tracking-result-success');
                        $container.append($result_icon);
                    } else {
                        $result_icon.addClass('dashicons-no-alt').addClass('woo-orders-tracking-result-error');
                        $container.append($result_icon);
                    }
                    if (response.message) {
                        villatheme_admin_show_message(response.message, response.status, '', false, time_out);
                    }
                },
                error: function (err) {
                    $result_icon.addClass('dashicons-no-alt').addClass('woo-orders-tracking-result-error');
                    $container.append($result_icon);
                    villatheme_admin_show_message('Unknown error occurs', 'error', '', false);
                },
                complete: function () {
                    $button.removeClass('woo-orders-tracking-loading');
                }
            })
        }
    });
    $(document).on('click', '.woo-orders-tracking-order-tracking-info-overlay', function (e) {
        e.stopPropagation();
    });
    $(document).on('click', '.woo-orders-tracking-order-tracking-info-icon', function (e) {
        e.stopPropagation();
        let data = $(this).data();
        let $icon = $('.woo-orders-tracking-order-tracking-info-wrap-' + data['order_id']);
        if ($icon.hasClass('woo-orders-tracking-order-tracking-info-hidden')) {
            $(this).addClass('woo-orders-tracking-order-tracking-info-open');
            $icon.removeClass('woo-orders-tracking-order-tracking-info-hidden');
        } else {
            $(this).removeClass('woo-orders-tracking-order-tracking-info-open');
            $icon.addClass('woo-orders-tracking-order-tracking-info-hidden');
        }
    });

    $(document).on('click', '.woo-orders-tracking-order-tracking-info-wrap', function (e) {
        e.stopPropagation();
    });
});
