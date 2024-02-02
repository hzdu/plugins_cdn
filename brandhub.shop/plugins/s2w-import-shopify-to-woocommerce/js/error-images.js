jQuery(document).ready(function ($) {
    'use strict';
    let $button_download = $('.s2w-action-download');
    let $button_download_all = $('.s2w-action-download-all');
    let $button_delete = $('.s2w-action-delete');
    let $button_delete_all = $('.s2w-action-delete-all');
    let queue = [], _s2w_nonce = s2w_params_admin_error_images._s2w_nonce;
    $button_download_all.on('click', function () {
        if (!$button_download_all.hasClass('loading')) {
            $('.s2w-action-download').not('.loading').map(function () {
                queue.push($(this));
            });
            if (queue.length > 0) {
                queue.shift().click();
                $button_download_all.addClass('loading');
            }
        }
    });
    $button_delete_all.on('click', function () {
        if (!$button_delete_all.hasClass('loading') && confirm(s2w_params_admin_error_images.i18n_confirm_delete_all)) {
            let delete_ids = [];
            $('.s2w-action-delete').map(function () {
                let $button = $(this);
                let item_id = $button.data('item_id');
                if (!$button.hasClass('loading')) {
                    delete_ids.push(item_id);
                }
            });
            if (delete_ids.length) {
                $button_delete_all.addClass('loading');
                $.ajax({
                    url: s2w_params_admin_error_images.url,
                    type: 'POST',
                    dataType: 'JSON',
                    data: {
                        action: 's2w_delete_error_product_images',
                        item_id: delete_ids.join(','),
                        _s2w_nonce: _s2w_nonce,
                    },
                    success: function (response) {
                        if (response.status === 'success') {
                            if (response.success) {
                                for (let i = 0; i < response.success.length; i++) {
                                    $(`.s2w-action-delete[data-item_id="${response.success[i]}"]`).closest('tr').fadeOut(300);
                                }
                                setTimeout(function () {
                                    for (let i = 0; i < response.success.length; i++) {
                                        $(`.s2w-action-delete[data-item_id="${response.success[i]}"]`).closest('tr').remove();
                                    }
                                    maybe_reload_page();
                                }, 300)
                            }
                        }
                    },
                    error: function (err) {
                        console.log(err);
                    },
                    complete: function () {
                        $button_delete_all.removeClass('loading');
                    }
                })
            }
        }
    });
    $button_delete.on('click', function () {
        let $button = $(this);
        let $row = $button.closest('tr');
        let item_id = $button.data('item_id');
        if ($button.hasClass('loading')) {
            return;
        }
        if (confirm(s2w_params_admin_error_images.i18n_confirm_delete)) {
            $button.addClass('loading');
            $.ajax({
                url: s2w_params_admin_error_images.url,
                type: 'POST',
                dataType: 'JSON',
                data: {
                    action: 's2w_delete_error_product_images',
                    item_id: item_id,
                    _s2w_nonce: _s2w_nonce,
                },
                success: function (response) {
                    $button.removeClass('loading');
                    if (response.status === 'success') {
                        $row.fadeOut(300);
                        setTimeout(function () {
                            $row.remove();
                            maybe_reload_page();
                        }, 300)
                    }
                },
                error: function (err) {
                    console.log(err);
                    $button.removeClass('loading');
                }
            })
        }
    });
    $button_download.on('click', function () {
        let $button = $(this);
        let $row = $button.closest('tr');
        let item_id = $button.data('item_id');
        if ($button.hasClass('loading')) {
            return;
        }
        $button.addClass('loading');
        $.ajax({
            url: s2w_params_admin_error_images.url,
            type: 'POST',
            dataType: 'JSON',
            data: {
                action: 's2w_download_error_product_images',
                item_id: item_id,
                _s2w_nonce: _s2w_nonce,
            },
            success: function (response) {
                $button.removeClass('loading');
                if (response.status === 'success') {
                    $row.fadeOut(300);
                    setTimeout(function () {
                        $row.remove();
                        maybe_reload_page();
                    }, 300)
                }
            },
            error: function (err) {
                console.log(err);
                $button.removeClass('loading');
            },
            complete: function () {
                if (queue.length > 0) {
                    queue.shift().click();
                } else if ($button_download_all.hasClass('loading')) {
                    $button_download_all.removeClass('loading')
                }
            }
        })
    });
    $('.s2w-action-empty-error-images').on('click', function (e) {
        if (!confirm(s2w_params_admin_error_images.i18n_confirm_empty_list)) {
            e.preventDefault();
            return false;
        }
    });

    function maybe_reload_page() {
        if ($('.s2w-action-download').length === 0) {
            document.location.href = document.location.href;
        }
    }
});
