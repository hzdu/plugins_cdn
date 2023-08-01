jQuery(document).ready(function ($) {
    'use strict';
    let order_ids = [], _s2w_nonce = s2w_params_admin_update_orders._s2w_nonce;

    function get_selected_ids() {
        order_ids = [];
        $('.s2w-shopify-order-id').map(function () {
            let current_tr = $(this).closest('tr');
            if (current_tr.find('input[name="post[]"]').prop('checked')) {
                order_ids.push($(this).data('order_id'));
            }
        });
    }

    $('#s2w-update-order-options-domain').on('change',function(){
        let this_checked = $(this).prop('checked');
        if(this_checked){
            $('.s2w-update-order-options-content-body-row:not(".s2w-update-compa-w2s")')
                .addClass('s2w_disabled')
                .find('input')
                .prop( "checked", false )
                .prop('disabled',true);
        }else{
            $('.s2w-update-order-options-content-body-row:not(".s2w-update-compa-w2s")')
                .removeClass('s2w_disabled')
                .find('input')
                .prop('disabled',false);
        }
    });

    let update_order_options = s2w_params_admin_update_orders.update_order_options;
    let update_order_options_show = s2w_params_admin_update_orders.update_order_options_show;
    let button_update_single = $('.s2w-update-order-options-button-update-single');
    $('body').on('click', '.s2w-shopify-order-id', function (e) {
        e.stopPropagation();
        let button = $(this);
        let current_tr = button.closest('tr');
        let current_td = button.closest('td');
        if (button.hasClass('s2w-loading')) {
            return;
        }
        let order_id = button.data('order_id');
        if (update_order_options_show) {
            button_update_single.data('update_order_id', order_id).removeClass('s2w-hidden');
            s2w_update_order_options_show();
        } else {
            if (update_order_options.length == 0) {
                alert('Please select at least one option to update.');
                return;
            }
            button.addClass('s2w-loading');
            let $status = current_td.find('.s2w-update-from-shopify-history-status');
            $.ajax({
                url: s2w_params_admin_update_orders.url,
                type: 'POST',
                dataType: 'JSON',
                data: {
                    action: 's2w_update_orders',
                    order_id: order_id,
                    _s2w_nonce: _s2w_nonce,
                },
                success: function (res) {
                    button.removeClass('s2w-loading');
                    current_td.find('.s2w-update-from-shopify-history-time').html(res.time);
                    if (res.status === 'success') {
                        $status.removeClass('s2w-update-from-shopify-history-status-error');
                        $status.attr('title', '');
                    } else {
                        $status.attr('title', res.message);
                    }
                    $status.addClass('s2w-update-from-shopify-history-status-' + res.status).html(res.status);
                    current_td.find('.s2w-update-from-shopify-history-fields').html(res.fields);
                    if (res.hasOwnProperty('order_status') && res.order_status) {
                        current_tr.find('.column-order_status').html(res.order_status);
                    }
                    if (res.hasOwnProperty('order_date') && res.order_date) {
                        current_tr.find('.column-order_date').html(res.order_date);
                    }
                },
                error: function (err) {
                    console.log(err);
                    button.removeClass('s2w-loading');
                    current_td.find('.s2w-update-from-shopify-history-time').html('now');
                    $status.attr('title', '');
                    $status.removeClass('s2w-update-from-shopify-history-status-success').addClass('s2w-update-from-shopify-history-status-error').html('Error: ' + err.statusText);
                }
            })
        }
    });

    button_update_single.on('click', function () {
        let order_id = button_update_single.data('update_order_id');
        let button = $('.s2w-shopify-order-id[data-order_id="' + order_id + '"]');
        let current_tr = button.closest('tr');
        let current_td = button.closest('td');
        s2w_get_selected_options();
        if (update_order_options.length == 0) {
            alert('Please select at least one option to update.');
            return;
        }
        s2w_update_order_options_hide();
        button.addClass('s2w-loading');
        $.ajax({
            url: s2w_params_admin_update_orders.url,
            type: 'POST',
            dataType: 'JSON',
            data: {
                action: 's2w_update_orders',
                order_id: order_id,
                update_order_options: update_order_options,
                update_order_options_show: update_order_options_show,
                _s2w_nonce: _s2w_nonce,
            },
            success: function (res) {
                button.removeClass('s2w-loading');
                current_td.find('.s2w-update-from-shopify-history-time').html(res.time);
                current_td.find('.s2w-update-from-shopify-history-status').removeClass('s2w-update-from-shopify-history-status-error').addClass('s2w-update-from-shopify-history-status-' + res.status).html(res.status);
                current_td.find('.s2w-update-from-shopify-history-fields').html(res.fields);
                if (res.hasOwnProperty('order_status') && res.order_status) {
                    current_tr.find('.column-order_status').html(res.order_status);
                }
                if (res.hasOwnProperty('order_date') && res.order_date) {
                    current_tr.find('.column-order_date').html(res.order_date);
                }
            },
            error: function (err) {
                console.log(err);
                button.removeClass('s2w-loading');
                current_td.find('.s2w-update-from-shopify-history-time').html('now');
                current_td.find('.s2w-update-from-shopify-history-status').removeClass('s2w-update-from-shopify-history-status-success').addClass('s2w-update-from-shopify-history-status-error').html('Error: ' + err.statusText);
            }
        })
    });
    $('.s2w-update-order-options-button-update').on('click', function () {
        if (order_ids.length == 0) {
            alert('Please select orders you want to update.');
            return;
        }
        let button = $(this);
        if (!s2w_is_validate()) {
            return;
        }
        s2w_get_selected_options();
        if (update_order_options.length == 0) {
            alert('Please select at least one option to update.');
            return;
        }
        button.addClass('s2w-loading');
        $('.s2w-saving-overlay').show();
        $.ajax({
            url: s2w_params_admin_update_orders.url,
            type: 'POST',
            dataType: 'JSON',
            data: {
                action: 's2w_update_order_options_save',
                update_order_options: update_order_options,
                update_order_options_show: update_order_options_show,
                _s2w_nonce: _s2w_nonce,
            },
            success: function (response) {
                for (let i in order_ids) {
                    $('.s2w-shopify-order-id[data-order_id="' + order_ids[i] + '"]').addClass('s2w-loading');
                }

                let order_id = order_ids.shift();
                s2w_update(order_id);
            },
            error: function (err) {
                console.log(err);
                alert('Error saving');
                button.removeClass('s2w-loading');
            },
            complete: function () {
                $('.s2w-saving-overlay').hide();
                s2w_update_order_options_hide();
            }
        });
    });
    $('.s2w-update-order-options-button-save').on('click', function () {
        let button = $(this);
        if (!s2w_is_validate()) {
            return;
        }
        s2w_get_selected_options();
        if (update_order_options.length == 0) {
            alert('Please select at least one option to update.');
            return;
        }
        button.addClass('s2w-loading');
        $('.s2w-saving-overlay').show();

        $.ajax({
            url: s2w_params_admin_update_orders.url,
            type: 'POST',
            dataType: 'JSON',
            data: {
                action: 's2w_update_order_options_save',
                update_order_options: update_order_options,
                update_order_options_show: update_order_options_show,
                _s2w_nonce: _s2w_nonce,
            },
            success: function (response) {

            },
            error: function (err) {
                console.log(err);
                alert('Error saving');
            },
            complete: function () {
                $('.s2w-saving-overlay').hide();
                button.removeClass('s2w-loading');
                s2w_update_order_options_hide();
            }
        });
    });
    $('.s2w-shopify-update-order').on('click', function () {
        get_selected_ids();
        $('.s2w-selected-number').html(order_ids.length);
        s2w_update_order_options_show();
        $('.s2w-update-order-options-button-update').removeClass('s2w-hidden');
        $('.s2w-update-order-options-button-save').removeClass('s2w-hidden');
    });

    function s2w_get_selected_options() {
        update_order_options = [];
        $('.s2w-update-order-options-option').map(function () {
            if ($(this).prop('checked')) {
                update_order_options.push($(this).data('order_option'));
            }
        });
        update_order_options_show = '';
        if ($('.s2w-update-order-options-show').prop('checked')) {
            update_order_options_show = 1;
        }
    }

    function s2w_set_selected_options() {
        $('.s2w-update-order-options-option').map(function () {
            if (update_order_options.indexOf($(this).data('order_option')) !== -1) {
                $(this).prop('checked', true);
            } else {
                $(this).prop('checked', false);
            }
        });
        if (update_order_options_show == 1) {
            $('.s2w-update-order-options-show').prop('checked', true);
        } else {
            $('.s2w-update-order-options-show').prop('checked', false);
        }
    }

    function s2w_update(order_id) {
        let button = $('.s2w-shopify-order-id[data-order_id="' + order_id + '"]');
        let current_tr = button.closest('tr');
        let current_td = button.closest('td');
        $.ajax({
            url: s2w_params_admin_update_orders.url,
            type: 'POST',
            dataType: 'JSON',
            data: {
                action: 's2w_update_orders',
                order_id: order_id,
                _s2w_nonce: _s2w_nonce,
            },
            success: function (res) {
                current_td.find('.s2w-update-from-shopify-history-time').html(res.time);
                current_td.find('.s2w-update-from-shopify-history-status').removeClass('s2w-update-from-shopify-history-status-error').addClass('s2w-update-from-shopify-history-status-' + res.status).html(res.status);
                current_td.find('.s2w-update-from-shopify-history-fields').html(res.fields);
                if (res.hasOwnProperty('order_status') && res.order_status) {
                    current_tr.find('.column-order_status').html(res.order_status);
                }
                if (res.hasOwnProperty('order_date') && res.order_date) {
                    current_tr.find('.column-order_date').html(res.order_date);
                }
            },
            error: function (err) {
                console.log(err);
                current_td.find('.s2w-update-from-shopify-history-time').html('now');
                current_td.find('.s2w-update-from-shopify-history-status').removeClass('s2w-update-from-shopify-history-status-success').addClass('s2w-update-from-shopify-history-status-error').html('Error: ' + err.statusText);
            },
            complete: function () {
                button.removeClass('s2w-loading');
                if (order_ids.length > 0) {
                    let order_id = order_ids.shift();
                    s2w_update(order_id);
                } else {
                    $('.s2w-update-order-options-button-update').removeClass('s2w-loading');
                    alert('Update completed.')
                }
            }
        })
    }

    $('.s2w-update-order-options-button-cancel').on('click', function () {
        s2w_update_order_options_hide();
    });
    $('.s2w-update-order-options-close').on('click', function () {
        s2w_update_order_options_hide();
    });
    $('.s2w-overlay').on('click', function () {
        s2w_update_order_options_hide();
    });

    function s2w_is_validate() {
        let validate = true;
        if ($('.s2w-update-order-options-button-save').hasClass('s2w-loading') || $('.s2w-update-order-options-button-update').hasClass('s2w-loading') || $('.s2w-shopify-order-id').hasClass('s2w-loading')) {
            validate = false;
        }
        return validate;
    }

    function s2w_update_order_options_hide() {
        s2w_set_selected_options();
        $('.s2w-button-edit').removeClass('s2w-button-editing');
        $('.s2w-update-order-options-container').addClass('s2w-hidden');
        $('.s2w-update-order-options-content-footer').find('.button-primary').addClass('s2w-hidden');
        s2w_enable_scroll();
    }

    function s2w_update_order_options_show() {
        $('.s2w-update-order-options-container').removeClass('s2w-hidden');
        s2w_disable_scroll();
    }
});
