jQuery(document).ready(function ($) {
    'use strict';
    $('.vi-ui.dropdown').dropdown();
    $('#vi-wad-product-source').on('change', function () {
        if ($(this).val() === 'ali2woo') {
            $('#vi-wad-product-source-meta').closest('.vi-ui.input').fadeOut(200);
        } else {
            $('#vi-wad-product-source-meta').closest('.vi-ui.input').fadeIn(200);
        }
    }).trigger('change');

    $('.vi-wad-button-migrate').on('click', function () {
        let $button = $(this),
            $container = $button.closest('.vi-ui.segment'),
            $step_3 = $container.find('.vi-wad-migrate-product-step-content-3'),
            $progress = $step_3.find('.vi-wad-migrate-progress');
        $container.find('.step').removeClass('active');
        $container.find('.step.vi-wad-migrate-product-step-3').removeClass('disabled').addClass('active');
        $container.find('.vi-wad-migrate-product-step-content').addClass('vi-wad-hidden');
        $step_3.removeClass('vi-wad-hidden');
        $progress.progress('set percent', 1);
        migrate_products(1, 1, $progress);
    });

    function migrate_products(page, max_page, $progress) {
        $.ajax({
            url: vi_wad_params_admin_migrate_products.url,
            type: 'POST',
            dataType: 'JSON',
            data: {
                action: 'vi_wad_migrate_products',
                step: 'migrate',
                _vi_wad_ajax_nonce: vi_wad_params_admin_migrate_products._vi_wad_ajax_nonce,
                product_source: $('#vi-wad-product-source').val(),
                product_source_meta: $('#vi-wad-product-source-meta').val(),
                product_categories: $('select[name="vi_wad_product_categories"]').val(),
                exclude_categories: $('select[name="vi_wad_exclude_categories"]').val(),
                page: page,
                max_page: max_page,
            },
            success: function (response) {
                if (response.status === 'success') {
                    $progress.progress('set percent', parseInt(response.percent));
                    if (page < parseInt(response.page)) {
                        migrate_products(response.page, response.max_page, $progress);
                    } else {
                        $progress.progress('set label', response.message ? response.message : 'Completed').progress('complete');
                        if (response.message) {
                            villatheme_admin_show_message(response.message, 'success', '', false, 5000);
                        }
                    }
                } else {
                    $progress.progress('set label', response.message ? response.message : vi_wad_params_admin_migrate_products.i18n_error).progress('set error');
                }
            },
            error: function (err) {
                $progress.progress('set label', vi_wad_params_admin_migrate_products.i18n_error).progress('set error');
            },
            complete: function () {

            }
        })
    }

    let migrate_max_page = 1;
    $('.vi-wad-button-back').on('click', function () {
        let $button = $(this),
            $container = $button.closest('.vi-ui.segment'),
            $step_1 = $container.find('.vi-wad-migrate-product-step-content-1');
        $container.find('.step').removeClass('active').addClass('disabled');
        $container.find('.step.vi-wad-migrate-product-step-1').removeClass('disabled').addClass('active');
        $container.find('.vi-wad-migrate-product-step-content').addClass('vi-wad-hidden');
        $step_1.removeClass('vi-wad-hidden');
    });
    $('.vi-wad-button-scan').on('click', function () {
        let $button = $(this),
            $container = $button.closest('.vi-ui.segment'),
            $step_2 = $container.find('.vi-wad-migrate-product-step-content-2'),
            $button_migrate = $container.find('.vi-wad-button-migrate'),
            product_source = $('#vi-wad-product-source').val(),
            product_source_meta = $('#vi-wad-product-source-meta').val();
        if (product_source === 'other' && !product_source_meta) {
            villatheme_admin_show_message(vi_wad_params_admin_migrate_products.i18n_error_product_source, 'error', '', false, 5000);
            return;
        }
        $button.addClass('loading');
        $button_migrate.addClass('disabled');
        $.ajax({
            url: vi_wad_params_admin_migrate_products.url,
            type: 'POST',
            dataType: 'JSON',
            data: {
                action: 'vi_wad_migrate_products',
                step: 'scan',
                _vi_wad_ajax_nonce: vi_wad_params_admin_migrate_products._vi_wad_ajax_nonce,
                product_source: product_source,
                product_source_meta: product_source_meta,
                product_categories: $('select[name="vi_wad_product_categories"]').val(),
                exclude_categories: $('select[name="vi_wad_exclude_categories"]').val(),
            },
            success: function (response) {
                if (response.status === 'success') {
                    $container.find('.step').removeClass('active');
                    $container.find('.step.vi-wad-migrate-product-step-2').removeClass('disabled').addClass('active');
                    $container.find('.vi-wad-migrate-product-step-content').addClass('vi-wad-hidden');
                    $step_2.removeClass('vi-wad-hidden');
                    $step_2.find('.vi-wad-migrate-availability').html(response.availability);
                    $step_2.find('.vi-wad-migrate-in-progress').html(response.in_progress);
                    $step_2.find('.vi-wad-migrate-migrated').html(response.migrated);
                    if (response.availability > 0) {
                        migrate_max_page = response.max_page;
                        $button_migrate.removeClass('disabled');
                    }
                } else {
                    villatheme_admin_show_message(response.message, 'error', '', false);
                }
            },
            error: function (err) {
                villatheme_admin_show_message(vi_wad_params_admin_migrate_products.i18n_error, 'error', '', false);
            },
            complete: function () {
                $button.removeClass('loading');
            }
        })
    });
    $('.search-category').select2({
        closeOnSelect: false,
        placeholder: "Please enter category name to search",
        ajax: {
            url: "admin-ajax.php?action=wad_search_cate&_vi_wad_ajax_nonce=" + vi_wad_params_admin_migrate_products._vi_wad_ajax_nonce,
            dataType: 'json',
            type: "GET",
            quietMillis: 50,
            delay: 250,
            data: function (params) {
                return {
                    keyword: params.term
                };
            },
            processResults: function (data) {
                return {
                    results: data
                };
            },
            cache: true
        },
        escapeMarkup: function (markup) {
            return markup;
        }, // let our custom formatter work
        minimumInputLength: 1
    });
});
