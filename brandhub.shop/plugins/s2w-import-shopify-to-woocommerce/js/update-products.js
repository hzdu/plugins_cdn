jQuery(document).ready(function ($) {
    'use strict';
    let product_ids = [], _s2w_nonce = s2w_params_admin_update_products._s2w_nonce;

    function get_selected_ids() {
        product_ids = [];
        $('.s2w-shopify-product-id').map(function () {
            let current_tr = $(this).closest('tr');
            if (current_tr.find('input[name="post[]"]').prop('checked')) {
                product_ids.push($(this).data('product_id'));
            }
        });
    }

    $('#s2w-update-product-options-domain').on('change',function(){
        let this_checked = $(this).prop('checked');
        if(this_checked){
            $('.s2w-update-product-options-content-body-row:not(".s2w-update-compa-w2s")')
                .addClass('s2w_disabled')
                .find('input')
                .prop( "checked", false )
                .prop('disabled',true);
        }else{
            $('.s2w-update-product-options-content-body-row:not(".s2w-update-compa-w2s")').removeClass('s2w_disabled').find('input').prop('disabled',false);
        }
    });

    let update_product_options = s2w_params_admin_update_products.update_product_options;
    let update_product_options_show = s2w_params_admin_update_products.update_product_options_show;
    let button_update_single = $('.s2w-update-product-options-button-update-single');
    let $button_get_metafields = $('.s2w-update-product-options-button-get-metafields');
    $('body').on('click', '.s2w-shopify-product-id', function () {
        let button = $(this);
        let current_tr = button.closest('tr');
        let current_td = button.closest('td');
        if (button.hasClass('s2w-loading')) {
            return;
        }
        let product_id = button.data('product_id');
        if (update_product_options_show) {
            button_update_single.data('update_product_id', product_id).removeClass('s2w-hidden');
            $button_get_metafields.data('update_product_id', product_id).removeClass('s2w-hidden');
            s2w_update_product_options_show();
        } else {
            if (update_product_options.length == 0) {
                alert('Please select at least one option to update.');
                return;
            }
            button.addClass('s2w-loading');
            let $status = current_td.find('.s2w-update-from-shopify-history-status');
            $.ajax({
                url: s2w_params_admin_update_products.url,
                type: 'POST',
                dataType: 'JSON',
                data: {
                    action: 's2w_update_products',
                    _s2w_nonce: _s2w_nonce,
                    product_id: product_id
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
                    if (res.hasOwnProperty('images') && res.images) {
                        current_tr.find('.column-thumb').find('a').html(res.images);
                    }
                    if (res.hasOwnProperty('price') && res.price) {
                        current_tr.find('.column-price').html(res.price);
                    }
                    if (res.hasOwnProperty('title') && res.title) {
                        current_tr.find('.column-name').find('.row-title').html(res.title);
                    }
                    if (res.hasOwnProperty('post_date') && res.post_date) {
                        current_tr.find('.column-date').html(res.post_date);
                    }
                    if (res.hasOwnProperty('tags')) {
                        current_tr.find('.column-product_tag').html(res.tags);
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
        let product_id = button_update_single.data('update_product_id');
        let button = $('.s2w-shopify-product-id[data-product_id="' + product_id + '"]');
        let current_tr = button.closest('tr');
        let current_td = button.closest('td');
        s2w_get_selected_options();
        if (update_product_options.length == 0) {
            alert('Please select at least one option to update.');
            return;
        }
        s2w_update_product_options_hide();
        button.addClass('s2w-loading');

        $.ajax({
            url: s2w_params_admin_update_products.url,
            type: 'POST',
            dataType: 'JSON',
            data: {
                action: 's2w_update_products',
                product_id: product_id,
                update_product_options: update_product_options,
                update_product_options_show: update_product_options_show,
                update_product_metafields: s2w_get_metafields(),
                _s2w_nonce: _s2w_nonce,
            },
            success: function (res) {
                button.removeClass('s2w-loading');
                current_td.find('.s2w-update-from-shopify-history-time').html(res.time);
                current_td.find('.s2w-update-from-shopify-history-status').removeClass('s2w-update-from-shopify-history-status-error').addClass('s2w-update-from-shopify-history-status-' + res.status).html(res.status);
                current_td.find('.s2w-update-from-shopify-history-fields').html(res.fields);
                if (res.hasOwnProperty('images') && res.images) {
                    current_tr.find('.column-thumb').find('a').html(res.images);
                }
                if (res.hasOwnProperty('price') && res.price) {
                    current_tr.find('.column-price').html(res.price);
                }
                if (res.hasOwnProperty('title') && res.title) {
                    current_tr.find('.column-name').find('.row-title').html(res.title);
                }
                if (res.hasOwnProperty('post_date') && res.post_date) {
                    current_tr.find('.column-date').html(res.post_date);
                }
                if (res.hasOwnProperty('tags')) {
                    current_tr.find('.column-product_tag').html(res.tags);
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
    $button_get_metafields.on('click', function () {
        let product_id = button_update_single.data('update_product_id');
        $button_get_metafields.addClass('s2w-loading');
        $.ajax({
            url: s2w_params_admin_update_products.url,
            type: 'POST',
            dataType: 'JSON',
            data: {
                action: 's2w_get_product_metafields',
                product_id: product_id,
                _s2w_nonce: _s2w_nonce,
            },
            success: function (res) {
                $button_get_metafields.removeClass('s2w-loading');
                if (res.status === 'success') {
                    let $metafields_container = $('.s2w-product-metafields-mapping').find('tbody');
                    for (let i = 0; i < res.data.length; i++) {
                        if ($(`.s2w-update_product_metafields_from[value="${res.data[i].key}"]`).length === 0) {
                            let $new_metafield = $metafields_container.find('tr').eq(0).clone();
                            $new_metafield.find('.s2w-update_product_metafields_from').attr('value', res.data[i].key);
                            $new_metafield.find('.s2w-update_product_metafields_to').attr('value', '');
                            $metafields_container.append($new_metafield);
                        }
                    }

                }
            },
            error: function (err) {
                console.log(err);
                $button_get_metafields.removeClass('s2w-loading');
            }
        })
    });
    $('.s2w-update-product-options-button-update').on('click', function () {
        if (product_ids.length == 0) {
            alert('Please select products you want to update.');
            return;
        }
        let button = $(this);
        if (!s2w_is_validate()) {
            return;
        }
        s2w_get_selected_options();
        if (update_product_options.length == 0) {
            alert('Please select at least one option to update.');
            return;
        }
        button.addClass('s2w-loading');
        $('.s2w-saving-overlay').show();
        $.ajax({
            url: s2w_params_admin_update_products.url,
            type: 'POST',
            dataType: 'JSON',
            data: {
                action: 's2w_update_product_options_save',
                _s2w_nonce: _s2w_nonce,
                update_product_options: update_product_options,
                update_product_options_show: update_product_options_show,
                update_product_metafields: s2w_get_metafields(),
            },
            success: function (response) {
                for (let i in product_ids) {
                    $('.s2w-shopify-product-id[data-product_id="' + product_ids[i] + '"]').addClass('s2w-loading');
                }
                let product_id = product_ids.shift();
                s2w_update(product_id);
            },
            error: function (err) {
                console.log(err);
                alert('Error saving');
                button.removeClass('s2w-loading');
            },
            complete: function () {
                $('.s2w-saving-overlay').hide();
                s2w_update_product_options_hide();
            }
        });
    });
    $('.s2w-update-product-options-button-save').on('click', function () {
        let button = $(this);
        if (!s2w_is_validate()) {
            return;
        }
        s2w_get_selected_options();
        if (update_product_options.length == 0) {
            alert('Please select at least one option to update.');
            return;
        }
        button.addClass('s2w-loading');
        $('.s2w-saving-overlay').show();

        $.ajax({
            url: s2w_params_admin_update_products.url,
            type: 'POST',
            dataType: 'JSON',
            data: {
                action: 's2w_update_product_options_save',
                _s2w_nonce: _s2w_nonce,
                update_product_options: update_product_options,
                update_product_options_show: update_product_options_show,
                update_product_metafields: s2w_get_metafields(),
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
                s2w_update_product_options_hide();
            }
        });
    });
    $('.s2w-shopify-update-product').on('click', function () {
        get_selected_ids();
        $('.s2w-selected-number').html(product_ids.length);
        s2w_update_product_options_show();
        $('.s2w-update-product-options-button-update').removeClass('s2w-hidden');
        $('.s2w-update-product-options-button-save').removeClass('s2w-hidden');
    });

    function s2w_get_selected_options() {
        update_product_options = [];
        $('.s2w-update-product-options-option').map(function () {
            if ($(this).prop('checked')) {
                update_product_options.push($(this).data('product_option'));
            }
        });
        update_product_options_show = '';
        if ($('.s2w-update-product-options-show').prop('checked')) {
            update_product_options_show = 1;
        }
    }

    function s2w_set_selected_options() {
        $('.s2w-update-product-options-option').map(function () {
            if (update_product_options.indexOf($(this).data('product_option')) !== -1) {
                $(this).prop('checked', true).trigger('change');
            } else {
                $(this).prop('checked', false).trigger('change');
            }
        });
        if (update_product_options_show == 1) {
            $('.s2w-update-product-options-show').prop('checked', true);
        } else {
            $('.s2w-update-product-options-show').prop('checked', false);
        }
    }

    function s2w_update(product_id) {
        let button = $('.s2w-shopify-product-id[data-product_id="' + product_id + '"]');
        let current_tr = button.closest('tr');
        let current_td = button.closest('td');
        $.ajax({
            url: s2w_params_admin_update_products.url,
            type: 'POST',
            dataType: 'JSON',
            data: {
                action: 's2w_update_products',
                product_id: product_id,
                _s2w_nonce: _s2w_nonce,
            },
            success: function (res) {
                current_td.find('.s2w-update-from-shopify-history-time').html(res.time);
                current_td.find('.s2w-update-from-shopify-history-status').removeClass('s2w-update-from-shopify-history-status-error').addClass('s2w-update-from-shopify-history-status-' + res.status).html(res.status);
                current_td.find('.s2w-update-from-shopify-history-fields').html(res.fields);
                if (res.hasOwnProperty('images') && res.images) {
                    current_tr.find('.column-thumb').find('a').html(res.images);
                }
                if (res.hasOwnProperty('price') && res.price) {
                    current_tr.find('.column-price').html(res.price);
                }
                if (res.hasOwnProperty('title') && res.title) {
                    current_tr.find('.column-name').find('.row-title').html(res.title);
                }
                if (res.hasOwnProperty('post_date') && res.post_date) {
                    current_tr.find('.column-date').html(res.post_date);
                }
                if (res.hasOwnProperty('tags')) {
                    current_tr.find('.column-product_tag').html(res.tags);
                }
            },
            error: function (err) {
                console.log(err);
                current_td.find('.s2w-update-from-shopify-history-time').html('now');
                current_td.find('.s2w-update-from-shopify-history-status').removeClass('s2w-update-from-shopify-history-status-success').addClass('s2w-update-from-shopify-history-status-error').html('Error: ' + err.statusText);
            },
            complete: function () {
                button.removeClass('s2w-loading');
                if (product_ids.length > 0) {
                    let product_id = product_ids.shift();
                    s2w_update(product_id);
                } else {
                    $('.s2w-update-product-options-button-update').removeClass('s2w-loading');
                    alert('Update completed.')
                }
            }
        })
    }

    $('.s2w-update-product-options-button-cancel').on('click', function () {
        s2w_update_product_options_hide();
    });
    $('.s2w-update-product-options-close').on('click', function () {
        s2w_update_product_options_hide();
    });
    $('.s2w-overlay').on('click', function () {
        s2w_update_product_options_hide();
    });
    /*Metafields*/
    $('#s2w-update-product-options-metafields').on('change', function () {
        if ($(this).prop('checked')) {
            $('.s2w-product-metafields-mapping').removeClass('s2w-hidden');
        } else {
            $('.s2w-product-metafields-mapping').addClass('s2w-hidden');
        }
    }).trigger('change');
    $(document).on('click', '.s2w-product-metafields-duplicate', function () {
        let $button = $(this), $row = $button.closest('tr'),
            $new_row = $row.clone();
        $new_row.insertAfter($row)
    });
    $(document).on('click', '.s2w-product-metafields-remove', function () {
        let $button = $(this), $container = $button.closest('tbody'), $rows = $container.find('tr'),
            $row = $button.closest('tr');
        if ($rows.length > 1) {
            if (confirm('Do you want to remove this row?')) {
                $row.fadeOut(300);
                setTimeout(function () {
                    $row.remove();
                }, 300)
            }
        } else {
            $row.find('.s2w-update_product_metafields_from').val('');
            $row.find('.s2w-update_product_metafields_to').val('');
        }
    });

    function s2w_is_validate() {
        let validate = true;
        if ($('.s2w-update-product-options-button-save').hasClass('s2w-loading') || $('.s2w-update-product-options-button-update').hasClass('s2w-loading') || $('.s2w-shopify-product-id').hasClass('s2w-loading')) {
            validate = false;
        }
        return validate;
    }

    function s2w_update_product_options_hide() {
        s2w_set_selected_options();
        $('.s2w-button-edit').removeClass('s2w-button-editing');
        $('.s2w-update-product-options-container').addClass('s2w-hidden');
        $button_get_metafields.addClass('s2w-hidden');
        $('.s2w-update-product-options-content-footer').find('.button-primary').addClass('s2w-hidden');
        s2w_enable_scroll();
    }

    function s2w_update_product_options_show() {
        $('.s2w-update-product-options-container').removeClass('s2w-hidden');
        s2w_disable_scroll();
    }

    function s2w_get_metafields() {
        let update_product_metafields = {from: [], to: []};
        $('.s2w-update_product_metafields_from').map(function () {
            let $from = $(this), from = $from.val().toString(), $tr = $from.closest('tr'),
                $to = $tr.find('.s2w-update_product_metafields_to'),
                meta_key = $to.val().toString();
            if (meta_key && meta_key.indexOf('s2w') === 0 || meta_key.indexOf('_s2w') === 0) {
                $to.val('');
                meta_key = '';
            }
            if (!from && !meta_key) {
                if ($('.s2w-update_product_metafields_to').length > 1) {
                    $tr.remove();
                }
            } else {
                update_product_metafields['from'].push(from);
                update_product_metafields['to'].push(meta_key);
            }
        });
        return update_product_metafields;
    }
});
