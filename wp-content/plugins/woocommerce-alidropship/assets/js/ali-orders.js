'use strict';
jQuery(document).ready(function ($) {
    let queue = [],_vi_wad_ajax_nonce = vi_wad_ali_orders._vi_wad_ajax_nonce;
    let is_importing = false;
    /*Set paged to 1 before submitting*/
    let is_current_page_focus = false;
    $('.tablenav-pages').find('.current-page').on('focus', function (e) {
        is_current_page_focus = true;
    }).on('blur', function (e) {
        is_current_page_focus = false;
    });
    $('.search-box').find('input[type="submit"]').on('click', function () {
        let $form = $(this).closest('form');
        if (!is_current_page_focus) {
            $form.find('.current-page').val(1);
        }
    });
    $('select.vi-ui.dropdown').dropdown();

    $('.vi-wad-order-check-all').on('change', function (e) {
        let $order_container = $(this).closest('.vi-wad-order-container');
        let checked = $(this).prop('checked');
        $order_container.find('.vi-wad-order-item-check').map(function () {
            if (!$(this).prop('disabled')) {
                $(this).prop('checked', checked);
            }
        });
        calculate_checked_orders();
    });
    $('.vi-wad-order-item-check').on('change', function (e) {
        let $order_container = $(this).closest('.vi-wad-order-container');
        let $check_all = $order_container.find('.vi-wad-order-check-all');
        if ($(this).prop('checked')) {
            $check_all.prop('checked', 'checked');
        } else {
            let checked = 0;
            $order_container.find('.vi-wad-order-item-check').map(function () {
                if ($(this).prop('checked')) {
                    checked++;
                }
            });
            if (checked > 0) {
                $check_all.prop('checked', 'checked');
            } else {
                $check_all.prop('checked', false);
            }
        }
        calculate_checked_orders();
    });
    $('.vi-wad-ali-tracking-number').on('click', function (e) {
        if (!$(this).attr('href')) {
            e.preventDefault();
            return false;
        }
    });
    $('.vi-wad-ali-order-id').on('click', function (e) {
        let $ali_order_id = $(this);
        let $item_container = $ali_order_id.closest('.vi-wad-item-ali-order-details');
        let $button_edit = $item_container.find('.vi-wad-item-actions-edit');
        if (!$(this).attr('href') || $button_edit.hasClass('vi-wad-hidden')) {
            e.preventDefault();
            return false;
        }
    });
    $('.vi-wad-button-bulk-select-all-orders').on('change', function (e) {
        let $button = $(this);
        let checked = $button.prop('checked');
        $button.prop('checked', checked);
        $('.vi-wad-order-check-all').map(function () {
            if (!$(this).prop('disabled')) {
                $(this).prop('checked', checked).trigger('change');
            }
        });
    });
    if (vi_wad_ali_orders.check_all == 1) {
        $('.vi-wad-button-bulk-select-all-orders').eq(0).prop('checked', true).trigger('change');
    }
    $('.vi-wad-item-actions-edit').on('click', function () {
        let $button = $(this);
        $button.addClass('vi-wad-hidden');
        let $item_container = $button.closest('.vi-wad-item-ali-order-details');
        $item_container.addClass('vi-wad-ali-order-id-editing');
        let $ali_order_id = $item_container.find('.vi-wad-ali-order-id');
        let $ali_order_id_input = $ali_order_id.find('.vi-wad-ali-order-id-input');
        $ali_order_id_input.prop('readonly', false).focus();
        $item_container.find('.vi-wad-item-actions-save').removeClass('vi-wad-hidden');
        $item_container.find('.vi-wad-item-actions-cancel').removeClass('vi-wad-hidden');
    });
    $('.vi-wad-item-actions-cancel').on('click', function () {
        let $button = $(this);
        $button.addClass('vi-wad-hidden');
        let $item_container = $button.closest('.vi-wad-item-ali-order-details');
        $item_container.removeClass('vi-wad-ali-order-id-editing');
        let $ali_order_id = $item_container.find('.vi-wad-ali-order-id');
        let $ali_order_id_input = $ali_order_id.find('.vi-wad-ali-order-id-input');
        $ali_order_id_input.prop('readonly', true).val($ali_order_id.data('old_ali_order_id'));
        $item_container.find('.vi-wad-item-actions-edit').removeClass('vi-wad-hidden');
        $item_container.find('.vi-wad-item-actions-save').addClass('vi-wad-hidden');
    });
    $('.vi-wad-item-actions-save').on('click', function () {
        let $button = $(this);
        let $order_container = $button.closest('.vi-wad-order-container');
        let $order_item = $button.closest('.vi-wad-order-item');
        let $td = $button.closest('td');
        let $ali_order_container = $button.closest('.vi-wad-item-ali-order-container');
        let $orders_tracking_container = $td.find('.woo-orders-tracking-container');
        let $item_container = $button.closest('.vi-wad-item-ali-order-details');
        let item_id = $item_container.data('product_item_id');
        let $overlay = $ali_order_container.find('.vi-wad-item-ali-order-value-overlay');
        let $ali_order_id = $item_container.find('.vi-wad-ali-order-id');
        let $ali_order_id_input = $ali_order_id.find('.vi-wad-ali-order-id-input');
        let $tracking_number = $ali_order_container.find('.vi-wad-ali-tracking-number');
        let $tracking_number_input = $ali_order_container.find('.vi-wad-ali-tracking-number-input');
        let $get_tracking = $ali_order_container.find('.vi-wad-item-actions-get-tracking');
        let ali_order_id = $ali_order_id_input.val();
        let old_ali_order_id = $ali_order_id.data('old_ali_order_id');
        if (ali_order_id == old_ali_order_id) {
            $('.vi-wad-item-actions-cancel').click();
        } else {
            $overlay.removeClass('vi-wad-hidden');
            $.ajax({
                url: vi_wad_ali_orders.url,
                type: 'POST',
                dataType: 'JSON',
                data: {
                    action: 'vi_wad_manually_update_ali_order_id',
                    _vi_wad_ajax_nonce: _vi_wad_ajax_nonce,
                    order_id: $order_container.data('order_id'),
                    item_id: item_id,
                    ali_order_id: ali_order_id,
                    return_shipping: $order_item.find('select[name="vi_wad_shipping_info_company"]').length > 0 ? 0 : 1,
                },
                success: function (response) {
                    if (response.status === 'success') {
                        $button.addClass('vi-wad-hidden');
                        $ali_order_id_input.prop('readonly', true);
                        $item_container.find('.vi-wad-item-actions-edit').removeClass('vi-wad-hidden');
                        $item_container.find('.vi-wad-item-actions-cancel').addClass('vi-wad-hidden');
                        $overlay.addClass('vi-wad-hidden');
                        $tracking_number_input.val('');
                        let href = '';
                        if (ali_order_id) {
                            $tracking_number.attr('href', 'http://track.aliexpress.com/logisticsdetail.htm?tradeId=ali_order_id');
                            $get_tracking.removeClass('vi-wad-hidden');
                            href = 'https://trade.aliexpress.com/order_detail.htm?orderId=' + ali_order_id;
                            $order_item.find('.vi-wad-order-item-check').prop('checked', false).trigger('change');
                            $order_item.find('.vi-wad-order-item-check').prop('disabled', true);
                            $order_item.addClass('vi-wad-order-item-can-not-be-ordered');
                            handle_order_check_button($order_container);
                        } else {
                            if ($order_item.find('select[name="vi_wad_shipping_info_company"]').length > 0) {
                                $order_item.find('.vi-wad-order-item-check').prop('disabled', false);
                                $order_container.find('.vi-wad-order-check-all').prop('disabled', false);
                            } else if (response.hasOwnProperty('shipping_company_html') && response.shipping_company_html) {
                                $order_item.find('.vi-wad-order-item-check').prop('disabled', false);
                                $order_item.find('.vi-wad-order-item-shipping').html(response.shipping_company_html);
                                $order_item.find('select[name="vi_wad_shipping_info_company"]').dropdown().val(response.shipping_company_selected).trigger('change');
                                $order_container.find('.vi-wad-order-check-all').prop('disabled', false);
                            }
                            $order_item.removeClass('vi-wad-order-item-can-not-be-ordered');
                            $tracking_number.attr('href', '');
                            $get_tracking.addClass('vi-wad-invisibility');
                        }
                        $ali_order_id.data('old_ali_order_id', ali_order_id).attr('href', href);
                        $item_container.removeClass('vi-wad-ali-order-id-editing');
                    } else {
                        alert(response.message);
                    }
                    $overlay.addClass('vi-wad-hidden');
                },
                error: function (err) {
                    console.log(err);
                    $overlay.addClass('vi-wad-hidden');
                },
            });
        }
    });

    function handle_order_check_button($order_container) {
        let active_items = 0;
        $order_container.find('.vi-wad-order-item-check').map(function () {
            if (!$(this).prop('disabled')) {
                active_items++;
            }
        });
        if (active_items === 0) {
            $order_container.find('.vi-wad-order-check-all').prop('disabled', true);
        }
    }

    $(document).on('change', 'select[name="vi_wad_shipping_info_company"]', function (e) {
        let $shipping_company = $(this);
        let $order_item = $shipping_company.closest('.vi-wad-order-item');
        let $selected = $shipping_company.find('option[value="' + $shipping_company.val() + '"]');
        $order_item.find('.vi-wad-shipping-info-company-name span').html($selected.data('company'));
        $order_item.find('.vi-wad-order-item-shipping-cost').html($selected.data('shipping_amount_html'));
        $order_item.find('.vi-wad-order-item-shipping-time').html($selected.data('delivery_time'));
        $.ajax({
            url: vi_wad_ali_orders.url,
            type: 'POST',
            dataType: 'JSON',
            data: {
                action: 'vi_wad_save_selected_shipping_company',
                _vi_wad_ajax_nonce: _vi_wad_ajax_nonce,
                order_id: $shipping_company.closest('.vi-wad-order-container').data('order_id'),
                item_id: $order_item.data('order_item_id'),
                company: $shipping_company.val(),
                company_name: $selected.data('company'),
                delivery_time: $selected.data('delivery_time'),
                shipping_cost: $selected.data('shipping_amount'),
            },
            success: function (response) {
            },
            error: function (err) {
                console.log(err);
            },
            complete: function () {
            }
        });
    });
    let select_shipping_trigger = true;
    $(document).on('change', 'select[name="vi_wad_confirm_order_shipping"]', function (e) {
        let $order_item = $(this).closest('tr');
        let order_item_id = $order_item.data('order_item_id');
        if (select_shipping_trigger) {
            $(`.vi-wad-order-item[data-order_item_id="${order_item_id}"]`).find('select[name="vi_wad_shipping_info_company"]').val($(this).val()).trigger('change');
        }
        let $selected = $(this).find('option[value="' + $(this).val() + '"]');
        $order_item.find('.vi-wad-confirm-orders-shipping-company span').html($selected.data('company'));
        $order_item.find('.vi-wad-confirm-orders-col-order-item[data-column_name="shipping_cost"]').html($selected.data('shipping_amount_html'));
        $order_item.find('.vi-wad-confirm-orders-col-order-item[data-column_name="shipping_time"]').html($selected.data('delivery_time'));
        calculate_cost_after_changing_shipping_company();
    });

    function calculate_checked_orders() {
        let count = 0;
        $('.vi-wad-order-check-all').map(function () {
            if ($(this).prop('checked')) {
                count++;
            }
        });
        $('.vi-wad-button-bulk-place-order-count').html(count);
        if (count > 0) {
            $('.vi-wad-button-bulk-place-order').removeClass('disabled');
        } else {
            $('.vi-wad-button-bulk-place-order').addClass('disabled');
        }
    }

    $('.vi-wad-confirm-orders-button-place').on('click', function () {
        let $button = $(this);
        if (is_importing) {
            return false;
        }
        $button.addClass('loading');
        let orders = [];
        $('.vi-wad-confirm-orders-check').map(function () {
            if ($(this).prop('checked')) {
                let $order_container = $(this).closest('tbody');
                let order_id = $order_container.data('order_id');
                let order_currency = $order_container.data('order_currency');
                let order_data = {order_id: order_id, order_currency: order_currency, order_items: []};
                $order_container.find('tr').map(function () {
                    let $order_item = $(this);
                    let order_item = {
                        order_item_id: $order_item.data('order_item_id'),
                        shipping_company: $order_item.find('select[name="vi_wad_confirm_order_shipping"]').val(),
                    };
                    order_data['order_items'].push(order_item);
                });
                orders.push(order_data);
                $order_container.find('.vi-wad-confirm-orders-result').addClass('vi-wad-loading').html('');
            }
        });

        if (orders.length > 0) {
            is_importing = true;
            $('.vi-wad-confirm-orders-container').addClass('vi-wad-confirm-orders-loading');
            if(vi_wad_ali_orders.batch_request_enable){
                vi_wad_place_order_batch(orders);
            }else{
                $.ajax({
                    url: vi_wad_ali_orders.url,
                    type: 'POST',
                    dataType: 'JSON',
                    data: {
                        action: 'vi_wad_place_ali_orders',
                        _vi_wad_ajax_nonce: _vi_wad_ajax_nonce,
                        step: 'get_signature',
                        orders: orders,
                        batch_request_enable: vi_wad_ali_orders.batch_request_enable,
                    },
                    success: function (response) {
                        if (response.errors.length > 0) {
                            response.errors.forEach(function (item_v, item_k) {
                                let $order_container = $('.vi-wad-confirm-orders-content-body').find(`tbody[data-order_id="${item_v['order_id']}"]`);
                                if (item_v['order_item_id']) {
                                    $order_container = $order_container.find(`tr[data-order_item_id="${item_v['order_item_id']}"]`)
                                }
                                $order_container.find('.vi-wad-confirm-orders-result').removeClass('vi-wad-loading').html(`<div class="vi-wad-confirm-orders-result-error">${item_v['message']}</div>`)
                            })
                        }
                        if (response.status === 'success') {
                            orders = response.details;
                            vi_wad_place_order(orders)
                        } else {
                            is_importing = false;
                            $('.vi-wad-confirm-orders-result').removeClass('vi-wad-loading');
                            $('.vi-wad-confirm-orders-button-place').removeClass('loading');
                            $('.vi-wad-confirm-orders-container').removeClass('vi-wad-confirm-orders-loading').addClass('vi-wad-confirm-orders-loaded');
                            orders.forEach(function (item_v, item_k) {
                                let $order_container = $('.vi-wad-confirm-orders-content-body').find(`tbody[data-order_id="${item_v['order_id']}"]`);
                                $order_container.find('.vi-wad-confirm-orders-result').map(function () {
                                    if (!$(this).html()) {
                                        $(this).removeClass('vi-wad-loading').html(`<div class="vi-wad-confirm-orders-result-error">${response['message']}</div>`)
                                    }
                                })
                            })
                        }
                    },
                    error: function (err) {
                        console.log(err);
                        is_importing = false;
                        $('.vi-wad-confirm-orders-result').removeClass('vi-wad-loading');
                        $('.vi-wad-confirm-orders-button-place').removeClass('loading');
                        $('.vi-wad-confirm-orders-container').removeClass('vi-wad-confirm-orders-loading').addClass('vi-wad-confirm-orders-loaded');
                    },
                    complete: function () {

                    }
                });
            }
        }
    });
    let success_count = 0;

    function vi_wad_place_order_batch(orders) {
        let now_orders = orders.splice(0, 20);
        $.ajax({
            url: vi_wad_ali_orders.url,
            type: 'POST',
            dataType: 'JSON',
            data: {
                action: 'vi_wad_place_ali_orders',
                _vi_wad_ajax_nonce: _vi_wad_ajax_nonce,
                step: 'get_signature',
                orders: now_orders,
                batch_request_enable: vi_wad_ali_orders.batch_request_enable,
            },
            success: function (response) {
                if (response.errors.length > 0) {
                    response.errors.forEach(function (item_v, item_k) {
                        let $order_container = $('.vi-wad-confirm-orders-content-body').find(`tbody[data-order_id="${item_v['order_id']}"]`);
                        if (item_v['order_item_id']) {
                            $order_container = $order_container.find(`tr[data-order_item_id="${item_v['order_item_id']}"]`)
                        }
                        $order_container.find('.vi-wad-confirm-orders-result').removeClass('vi-wad-loading').html(`<div class="vi-wad-confirm-orders-result-error">${item_v['message']}</div>`)
                    })
                }
                if (response.status === 'success') {
                    let details = response.details;
                    for (let i = 0; i < details.length; i++) {
                        let $order_container = $('.vi-wad-confirm-orders-content-body').find(`tbody[data-order_id="${details[i]['order_id']}"]`);
                        let $status_col = $order_container.find('.vi-wad-confirm-orders-result');
                        if (details[i]['order_item_id']) {
                            let $order_item = $order_container.find(`tr[data-order_item_id="${details[i]['order_item_id']}"]`);
                            if (details[i].status === 'success') {
                                success_count++;
                                $order_item.find('.vi-wad-confirm-orders-result').html(`<div class="vi-wad-confirm-orders-result-success"><i class="vi-ui icon check green"></i><a href="${details[i]['ali_order_detail_url']}"></a></div>`);
                                let $bg_order_item = $(`.vi-wad-order-item[data-order_item_id="${details[i]['order_item_id']}"]`);
                                $bg_order_item.addClass('vi-wad-order-item-can-not-be-ordered');
                                $bg_order_item.find('.vi-wad-order-item-check').prop('checked', false).trigger('change').prop('disabled', true);
                                let $ali_order_id = $bg_order_item.find('.vi-wad-ali-order-id');
                                $ali_order_id.attr('href', details[i]['ali_order_detail_url']).data('old_ali_order_id', details[i]['ali_order_id']);
                                $ali_order_id.find('.vi-wad-ali-order-id-input').val(details[i]['ali_order_id']);
                                let $ali_tracking_number = $bg_order_item.find('.vi-wad-ali-tracking-number');
                                $ali_tracking_number.attr('href', details[i]['ali_tracking_url']);
                                $bg_order_item.find('.vi-wad-item-actions').removeClass('vi-wad-invisible');
                                $bg_order_item.find('.vi-wad-item-actions a').attr('href', details[i]['ali_get_tracking']);
                            } else {
                                $order_item.find('.vi-wad-confirm-orders-result').removeClass('vi-wad-loading').html(`<div class="vi-wad-confirm-orders-result-error">${details[i]['message']}</div>`);
                            }
                        } else {
                            $status_col.html(details[i]['message']);
                        }
                        handle_order_check_button($(`.vi-wad-order-container[data-order_id="${details[i]['order_id']}"]`));
                    }
                } else {
                    now_orders.forEach(function (item_v, item_k) {
                        let $order_container = $('.vi-wad-confirm-orders-content-body').find(`tbody[data-order_id="${item_v['order_id']}"]`);
                        $order_container.find('.vi-wad-confirm-orders-result').map(function () {
                            if (!$(this).html()) {
                                $(this).removeClass('vi-wad-loading').html(`<div class="vi-wad-confirm-orders-result-error">${response['message']}</div>`)
                            }
                        })
                    })
                }
            },
            error: function (err) {
                console.log(err);
            },
            complete: function () {
                if (orders.length > 0) {
                    vi_wad_place_order_batch(orders)
                } else {
                    is_importing = false;
                    $('.vi-wad-confirm-orders-result').removeClass('vi-wad-loading');
                    $('.vi-wad-confirm-orders-button-place').removeClass('loading');
                    $('.vi-wad-confirm-orders-container').removeClass('vi-wad-confirm-orders-loading').addClass('vi-wad-confirm-orders-loaded');
                    if (success_count > 0) {
                        $('.vi-wad-confirm-orders-container').addClass('vi-wad-confirm-orders-success');
                    }
                }
            }
        });
    }

    function vi_wad_place_order(orders) {
        let order = orders.shift();
        let $order_container = $('.vi-wad-confirm-orders-content-body').find(`tbody[data-order_id="${order['order_id']}"]`);
        let $status_col = $order_container.find('.vi-wad-confirm-orders-result');
        $.ajax({
            url: vi_wad_ali_orders.url,
            type: 'POST',
            dataType: 'JSON',
            data: {
                action: 'vi_wad_place_ali_orders',
                _vi_wad_ajax_nonce: _vi_wad_ajax_nonce,
                step: 'place_order',
                order_id: order['order_id'],
                order_item_ids: order['order_item_ids'],
                order_data: order['data'],
            },
            success: function (response) {
                if (response.status === 'success') {
                    let details = response.details;
                    let success_count = 0;
                    for (let i = 0; i < details.length; i++) {
                        if (details[i]['order_item_id']) {
                            let $order_item = $order_container.find(`tr[data-order_item_id="${details[i]['order_item_id']}"]`);
                            if (details[i].status === 'success') {
                                success_count++;
                                $order_item.find('.vi-wad-confirm-orders-result').html(`<div class="vi-wad-confirm-orders-result-success"><i class="vi-ui icon check green"></i><a href="${details[i]['ali_order_detail_url']}"></a></div>`);
                                let $bg_order_item = $(`.vi-wad-order-item[data-order_item_id="${details[i]['order_item_id']}"]`);
                                $bg_order_item.addClass('vi-wad-order-item-can-not-be-ordered');
                                $bg_order_item.find('.vi-wad-order-item-check').prop('checked', false).trigger('change').prop('disabled', true);
                                let $ali_order_id = $bg_order_item.find('.vi-wad-ali-order-id');
                                $ali_order_id.attr('href', details[i]['ali_order_detail_url']).data('old_ali_order_id', details[i]['ali_order_id']);
                                $ali_order_id.find('.vi-wad-ali-order-id-input').val(details[i]['ali_order_id']);
                                let $ali_tracking_number = $bg_order_item.find('.vi-wad-ali-tracking-number');
                                $ali_tracking_number.attr('href', details[i]['ali_tracking_url']);
                                $bg_order_item.find('.vi-wad-item-actions').removeClass('vi-wad-invisible');
                                $bg_order_item.find('.vi-wad-item-actions a').attr('href', details[i]['ali_get_tracking']);
                            } else {
                                $order_item.find('.vi-wad-confirm-orders-result').html(`<div class="vi-wad-confirm-orders-result-error">${details[i]['message']}</div>`);
                            }
                        } else {
                            $status_col.html(details[i]['message']);
                        }
                    }
                    if (success_count > 0) {
                        $('.vi-wad-confirm-orders-container').addClass('vi-wad-confirm-orders-success');
                    }
                    handle_order_check_button($(`.vi-wad-order-container[data-order_id="${order['order_id']}"]`));
                } else {
                    $status_col.html(`<div class="vi-wad-confirm-orders-result-error">${response.message}</div>`);
                }
            },
            error: function (err) {
                console.log(err);
            },
            complete: function () {
                $status_col.removeClass('vi-wad-loading');
                if (orders.length > 0) {
                    vi_wad_place_order(orders);
                } else {
                    is_importing = false;
                    $('.vi-wad-confirm-orders-button-place').removeClass('loading');
                    $('.vi-wad-confirm-orders-container').removeClass('vi-wad-confirm-orders-loading').addClass('vi-wad-confirm-orders-loaded');
                }
            }
        });
    }

    $(document).on('click', '.vi-wad-confirm-orders-check', function () {
        let $container = $(this).closest('.vi-wad-confirm-orders-container');
        if (is_importing || $container.hasClass('vi-wad-confirm-orders-loading') || $container.hasClass('vi-wad-confirm-orders-loaded')) {
            return false;
        }
    });
    $(document).on('change', '.vi-wad-confirm-orders-check', function () {
        let $button = $(this);
        calculate_checked_place_orders();
        if (!$button.prop('checked') && $('.vi-wad-confirm-orders-check').length > 1) {
            let $order_container = $button.closest('tbody');
            $order_container.fadeOut(200);
            setTimeout(function () {
                $order_container.remove();
                vi_wad_fix_popup_overflow();
            }, 300);
        }
    });

    function calculate_checked_place_orders() {
        let count = 0;
        let total_income = 0;
        let product_cost = 0;
        let total_shipping = 0;
        let total_cost = 0;
        $('.vi-wad-confirm-orders-check').map(function () {
            if ($(this).prop('checked')) {
                count++;
                $(this).closest('tbody').find('tr').map(function () {
                    total_income += parseFloat($(this).data('sub_total'));
                    product_cost += (parseInt($(this).data('quantity')) * parseFloat($(this).data('cost')));
                    let $select = $(this).find('select[name="vi_wad_confirm_order_shipping"]');
                    let shipping_company = $select.val();
                    let $selected = $(this).find('option[value="' + shipping_company + '"]');
                    total_shipping += parseFloat($selected.data('shipping_amount'));
                })
            }
            total_cost = product_cost + total_shipping;
        });
        // $('.vi-wad-confirm-orders-total-income-amount').html(roundResult(total_income));
        $('.vi-wad-confirm-orders-total-product-cost-amount').html(roundResult(product_cost));
        $('.vi-wad-confirm-orders-total-shipping-amount').html(roundResult(total_shipping));
        $('.vi-wad-confirm-orders-total-cost-amount').html(roundResult(total_cost));
        $('.vi-wad-confirm-orders-count').html(count);
        if (count > 0) {
            $('.vi-wad-confirm-orders-button-place').removeClass('disabled');
        } else {
            $('.vi-wad-confirm-orders-button-place').addClass('disabled');
        }
    }

    function calculate_cost_after_changing_shipping_company() {
        let total_shipping = 0;
        let total_cost = 0;
        $('.vi-wad-confirm-orders-check').map(function () {
            if ($(this).prop('checked')) {
                $(this).closest('tbody').find('tr').map(function () {
                    let $select = $(this).find('select[name="vi_wad_confirm_order_shipping"]');
                    let shipping_company = $select.val();
                    let $selected = $(this).find('option[value="' + shipping_company + '"]');
                    total_shipping += parseFloat($selected.data('shipping_amount'));
                })
            }
            total_cost = parseFloat($('.vi-wad-confirm-orders-total-product-cost-amount').html()) + total_shipping;
        });
        $('.vi-wad-confirm-orders-total-shipping-amount').html(roundResult(total_shipping));
        $('.vi-wad-confirm-orders-total-cost-amount').html(roundResult(total_cost));
    }

    function build_confirm_orders_table(orders) {
        $('.vi-wad-confirm-orders-content-body').html(`<table class="vi-ui celled table"><thead>
    <tr>
        <th width="1%"></th>
        <th width="1%">${vi_wad_ali_orders.i18n_order_id}</th>
        <th width="1%">${vi_wad_ali_orders.i18n_item}</th>
        <th width="150px">${vi_wad_ali_orders.i18n_cost}</th>
        <th width="1%">${vi_wad_ali_orders.i18n_qty}</th>
        <th width="200px">${vi_wad_ali_orders.i18n_ship_to}</th>
        <th width="300px">${vi_wad_ali_orders.i18n_shipping_company}</th>
        <th width="1%">${vi_wad_ali_orders.i18n_shipping_cost}</th>
        <th width="100px">${vi_wad_ali_orders.i18n_delivery_time}</th>
        <th class="vi-wad-confirm-orders-col-head-status">${vi_wad_ali_orders.i18n_status}</th>
    </tr>
</thead>${build_orders_list(orders)}<tfoot><tr><th colspan="3"><strong>${vi_wad_ali_orders.i18n_total}</strong></th><th colspan="2" class="vi-wad-confirm-orders-total-product-cost">$<span class="vi-wad-confirm-orders-total-product-cost-amount"></span></th><th colspan="2"></th><th class="vi-wad-confirm-orders-total-shipping">$<span class="vi-wad-confirm-orders-total-shipping-amount"></span></th><th class="vi-wad-confirm-orders-total-cost" colspan="2"><strong>${vi_wad_ali_orders.i18n_total_cost}: </strong>$<span class="vi-wad-confirm-orders-total-cost-amount"></span></th></tr></tfoot></table>`).find('.vi-ui.dropdown').dropdown();
        select_shipping_trigger = false;
        $('select[name="vi_wad_confirm_order_shipping"]').map(function () {
            let $shipping_company = $(this).closest('.vi-wad-confirm-orders-shipping-info-company-wrap').find('.vi-wad-confirm-orders-shipping-company');
            if ($shipping_company.length > 0) {
                let shipping_company_selected = $shipping_company.data('shipping_company_selected');
                if (shipping_company_selected) {
                    $(this).val(shipping_company_selected).trigger('change');
                }
            }
        });
        select_shipping_trigger = true;
    }

    function build_orders_list(orders) {
        let orders_list = '';
        for (let i = 0; i < orders.length; i++) {
            let order_items = orders[i]['order_items'];
            orders_list += `<tbody data-order_id="${orders[i]['order_id']}">
    <tr data-order_item_id="${order_items[0]['order_item_id']}" data-cost="${order_items[0]['cost']}" data-sub_total="${order_items[0]['sub_total']}" data-quantity="${order_items[0]['quantity']}">
        <td class="vi-wad-confirm-orders-col-order-item" data-column_name="checked" rowspan="${orders[i]['order_items'].length}"><input type="checkbox" class="vi-wad-confirm-orders-check" checked></td>
        <td class="vi-wad-confirm-orders-col-order-item" data-column_name="order_id" rowspan="${orders[i]['order_items'].length}">${orders[i]['order_id']}</td>
        <td class="vi-wad-confirm-orders-col-order-item" data-column_name="image">${order_items[0]['image']}</td>
        <td class="vi-wad-confirm-orders-col-order-item" data-column_name="cost">${order_items[0]['cost_html']}</td>
        <td class="vi-wad-confirm-orders-col-order-item" data-column_name="quantity"><span>x</span> ${order_items[0]['quantity']}</td>
        <td class="vi-wad-confirm-orders-col-order-item" data-column_name="ship_to">${order_items[0]['ship_to']}</td>
        <td class="vi-wad-confirm-orders-col-order-item" data-column_name="shipping_company"><div class="vi-wad-confirm-orders-shipping-info-company-wrap"><div class="vi-wad-confirm-orders-shipping-company" data-shipping_company_selected="${order_items[0]['shipping_company_selected']}">${order_items[0]['shipping_company_name']}</div><select name="vi_wad_confirm_order_shipping" class="vi-ui fluid dropdown vi-wad-confirm-orders-shipping">${order_items[0]['shipping_company']}</select></div></td>
        <td class="vi-wad-confirm-orders-col-order-item" data-column_name="shipping_cost">${order_items[0]['shipping_cost_html']}</td>
        <td class="vi-wad-confirm-orders-col-order-item" data-column_name="shipping_time">${order_items[0]['shipping_time']}</td>
        <td class="vi-wad-confirm-orders-col-order-item" data-column_name="status"><div class="vi-wad-confirm-orders-result"></div></td>
    </tr>`;
            if (order_items.length > 1) {
                for (let j = 1; j < order_items.length; j++) {
                    orders_list += `<tr data-order_item_id="${order_items[j]['order_item_id']}" data-cost="${order_items[j]['cost']}" data-sub_total="${order_items[j]['sub_total']}"  data-quantity="${order_items[j]['quantity']}">
        <td class="vi-wad-confirm-orders-col-order-item" data-column_name="image" style="border-left: 1px solid rgba(34,36,38,.1);">${order_items[j]['image']}</td>
        <td class="vi-wad-confirm-orders-col-order-item" data-column_name="cost">${order_items[j]['cost_html']}</td>
        <td class="vi-wad-confirm-orders-col-order-item" data-column_name="quantity"><span>x</span> ${order_items[j]['quantity']}</td>
        <td class="vi-wad-confirm-orders-col-order-item" data-column_name="ship_to">${order_items[j]['ship_to']}</td>
        <td class="vi-wad-confirm-orders-col-order-item" data-column_name="shipping_company"><div class="vi-wad-confirm-orders-shipping-info-company-wrap"><div class="vi-wad-confirm-orders-shipping-company" data-shipping_company_selected="${order_items[j]['shipping_company_selected']}">${order_items[j]['shipping_company_name']}</div><select name="vi_wad_confirm_order_shipping" class="vi-ui fluid dropdown vi-wad-confirm-orders-shipping">${order_items[j]['shipping_company']}</select></div></td>
        <td class="vi-wad-confirm-orders-col-order-item" data-column_name="shipping_cost">${order_items[j]['shipping_cost_html']}</td>
        <td class="vi-wad-confirm-orders-col-order-item" data-column_name="shipping_time">${order_items[j]['shipping_time']}</td>
        <td class="vi-wad-confirm-orders-col-order-item" data-column_name="status"><div class="vi-wad-confirm-orders-result"></div></td>
    </tr>`;
                }
            }
            orders_list += `</tbody>`;
        }
        return orders_list;
    }

    $('.vi-wad-button-bulk-place-order').on('click', function () {
        let $button = $(this);
        $button.addClass('loading');
        let orders = [];
        $('.vi-wad-order-check-all').map(function () {
            if ($(this).prop('checked')) {
                let $order_container = $(this).closest('.vi-wad-order-container');
                let ship_to = $order_container.find('.vi-wad-order-ship-to').html();
                let order_id = $order_container.data('order_id');
                let order_data = {order_id: order_id, order_items: []};
                $order_container.find('.vi-wad-order-item-check').map(function () {
                    if ($(this).prop('checked')) {
                        let $order_item = $(this).closest('.vi-wad-order-item');
                        let order_item = $order_item.data();
                        let $shipping_company = $order_item.find('select[name="vi_wad_shipping_info_company"]');
                        order_item['image'] = $order_item.find('.vi-wad-order-item-image').html();
                        order_item['cost_html'] = $order_item.find('.vi-wad-order-item-cost').html();
                        order_item['ship_to'] = ship_to;
                        order_item['shipping_company_name'] = $order_item.find('.vi-wad-shipping-info-company-name').html();
                        order_item['shipping_company'] = $shipping_company.html();
                        order_item['shipping_company_selected'] = $shipping_company.val();
                        order_item['shipping_cost_html'] = $order_item.find('.vi-wad-order-item-shipping-cost').html();
                        order_item['shipping_time'] = $order_item.find('.vi-wad-order-item-shipping-time').html();
                        order_data['order_items'].push(order_item);
                    }
                });
                orders.push(order_data);
            }
        });
        build_confirm_orders_table(orders);
        calculate_checked_place_orders();
        vi_wad_confirm_orders_show();
    });
    $('.vi-wad-overlay').on('click', function () {
        let $container = $(this).closest('.vi-wad-confirm-orders-container');
        if (!$container.hasClass('vi-wad-confirm-orders-loading')) {
            vi_wad_confirm_orders_hide();
        }
        /*Close after placing orders*/
        if ($container.hasClass('vi-wad-confirm-orders-loaded')) {
            $container.removeClass('vi-wad-confirm-orders-loaded');
            $container.removeClass('vi-wad-confirm-orders-success');
            $('.vi-wad-button-bulk-select-all-orders').eq(0).prop('checked', false).trigger('change')
        }
    });
    $('.vi-wad-confirm-orders-close').on('click', function () {
        $('.vi-wad-overlay').click();
    });
    $('.vi-wad-confirm-orders-button-ok').on('click', function () {
        $('.vi-wad-overlay').click();
    });
    $('.vi-wad-confirm-orders-button-cancel').on('click', function () {
        $('.vi-wad-overlay').click();
    });

    function vi_wad_confirm_orders_hide() {
        $('.vi-wad-confirm-orders').removeClass('vi-wad-confirm-orders-editing');
        $('.vi-wad-confirm-orders-container').addClass('vi-wad-hidden');
        vi_wad_enable_scroll();
        $('.vi-wad-confirm-orders-content').removeClass('vi-wad-overflow-visible');
        $('.vi-wad-confirm-orders-content-body').removeClass('vi-wad-overflow-visible').html('');
        $('.vi-wad-button-bulk-place-order').removeClass('loading');
    }

    /*Make table not scroll when selecting shipping*/
    function vi_wad_fix_popup_overflow() {
        let $container = $('.vi-wad-confirm-orders-content');
        let body_height = parseInt($('body').css('height'));
        let height = parseInt($container.css('height'));
        if ((height / body_height) < 0.9) {
            $container.addClass('vi-wad-overflow-visible');
            $('.vi-wad-confirm-orders-content-body').addClass('vi-wad-overflow-visible');
        }
    }

    function vi_wad_confirm_orders_show() {
        $('.vi-wad-confirm-orders-container').removeClass('vi-wad-hidden');
        vi_wad_disable_scroll();
        vi_wad_fix_popup_overflow();
    }

    function vi_wad_enable_scroll() {
        let scrollTop = parseInt($('html').css('top'));
        $('html').removeClass('vi_wad-noscroll');
        $('html,body').scrollTop(-scrollTop);
    }

    function vi_wad_disable_scroll() {
        if ($(document).height() > $(window).height()) {
            let scrollTop = ($('html').scrollTop()) ? $('html').scrollTop() : $('body').scrollTop(); // Works for Chrome, Firefox, IE...
            $('html').addClass('vi_wad-noscroll').css('top', -scrollTop);
        }
    }

    function roundResult(number) {
        let decNum = 2,
            temp = Math.pow(10, decNum);
        return Math.round(number * temp) / temp;
    }
});
