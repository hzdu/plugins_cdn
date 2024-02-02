jQuery(document).ready(function ($) {
    'use strict';
    let _s2w_nonce = s2w_import_shopify_to_woocommerce_import_params._s2w_nonce;
    $('.vi-ui.dropdown').dropdown({placeholder: 'Do not import', fullTextSearch: true, forceSelection: false});
    if (s2w_import_shopify_to_woocommerce_import_params.step === 'mapping') {
        $('input[name="s2w_import_shopify_to_woocommerce_import"]').on('click', function (e) {
            let required_fields = s2w_import_shopify_to_woocommerce_import_params.required_fields;
            let empty_required_fields = [], mapped_fields = [];
            if (s2w_import_shopify_to_woocommerce_import_params.import_inventory_by_csv) {
                required_fields = s2w_import_shopify_to_woocommerce_import_params.inventory_required_fields;
                $('.dropdown.s2w-map-to-field').map(function () {
                    let $current_select = $(this).find('>select');
                    if ($current_select.val()) {
                        mapped_fields.push($current_select.val());
                    }
                });
                for (let field in required_fields) {
                    if (required_fields.hasOwnProperty(field) && !mapped_fields.includes(field)) {
                        empty_required_fields.push(required_fields[field]);
                    }
                }
            } else {
                for (let field in required_fields) {
                    if (required_fields.hasOwnProperty(field) && !$('#s2w-' + field).val()) {
                        empty_required_fields.push(required_fields[field]);
                    }
                }
            }
            if (empty_required_fields.length > 0) {
                if (empty_required_fields.length === 1) {
                    alert(s2w_import_shopify_to_woocommerce_import_params.i18n_required_field.replace('{required_field}', empty_required_fields[0]))
                } else {
                    alert(s2w_import_shopify_to_woocommerce_import_params.i18n_required_fields.replace('{required_fields}', empty_required_fields.join()));
                }
                e.preventDefault();
                return false;
            } else if (Boolean($('#s2w-option2_name').val()) !== Boolean($('#s2w-option2_value').val())) {
                alert(s2w_import_shopify_to_woocommerce_import_params.i18n_option_2_mapping);
                e.preventDefault();
                return false;
            } else if (Boolean($('#s2w-option3_name').val()) !== Boolean($('#s2w-option3_value').val())) {
                alert(s2w_import_shopify_to_woocommerce_import_params.i18n_option_3_mapping);
                e.preventDefault();
                return false;
            }
        });
        $('#s2w-keep_slug').on('change', function () {
            let $if_product_exists_container = $('#s2w-csv_if_product_exists').closest('tr');
            if ($(this).prop('checked')) {
                $if_product_exists_container.fadeIn(200)
            } else {
                $if_product_exists_container.fadeOut(200)
            }
        }).trigger('change');
    }

    let $progress = $('.s2w-import-progress');
    let total = 0;
    let ftell = 0;
    let start = parseInt(s2w_import_shopify_to_woocommerce_import_params.custom_start) - 1;
    if (start === 0) {
        start = 1;
    }
    let products_per_request = parseInt(s2w_import_shopify_to_woocommerce_import_params.products_per_request),
        import_options = s2w_import_shopify_to_woocommerce_import_params.import_options,
        import_inventory_by_csv = s2w_import_shopify_to_woocommerce_import_params.import_inventory_by_csv,
        s2w_index = s2w_import_shopify_to_woocommerce_import_params.s2w_index;

    if (s2w_import_shopify_to_woocommerce_import_params.step === 'import') {
        $progress.progress('set label', s2w_import_shopify_to_woocommerce_import_params.i18n_progress_checking);
        $.ajax({
            url: s2w_import_shopify_to_woocommerce_import_params.url,
            type: 'POST',
            dataType: 'JSON',
            data: {
                action: 's2w_import_shopify_to_woocommerce_import',
                _s2w_nonce: _s2w_nonce,
                file_url: s2w_import_shopify_to_woocommerce_import_params.file_url,
                import_inventory_by_csv: import_inventory_by_csv,
                s2w_index: s2w_index,
                step: 'check',
            },
            success: function (response) {
                console.log(response);
                if (response.status === 'success') {
                    total = parseInt(response.total);
                    if (total > 0) {
                        if (total >= start) {
                            s2w_import();
                            $progress.progress('set percent', 0);
                            $progress.progress('set label', s2w_import_shopify_to_woocommerce_import_params.i18n_progress_importing);
                        } else {
                            $progress.progress('set error');
                            $progress.progress('set label', s2w_import_shopify_to_woocommerce_import_params.i18n_error_start_at_row.replace('{max_row}', total));
                        }
                    } else {
                        $progress.progress('set error');
                        $progress.progress('set label', s2w_import_shopify_to_woocommerce_import_params.i18n_error_no_data);
                    }
                } else {
                    $progress.progress('set error');
                    if (response.hasOwnProperty('message')) {
                        $progress.progress('set label', s2w_import_shopify_to_woocommerce_import_params.i18n_error_message.replace('{error}', response.message));
                    }
                }
            },
            error: function (err) {
                $progress.progress('set error');
                $progress.progress('set label', err.statusText);
            },
        });
    }

    function s2w_import() {
        $.ajax({
            url: s2w_import_shopify_to_woocommerce_import_params.url,
            type: 'POST',
            dataType: 'JSON',
            data: {
                action: 's2w_import_shopify_to_woocommerce_import',
                _s2w_nonce: _s2w_nonce,
                file_url: s2w_import_shopify_to_woocommerce_import_params.file_url,
                products_per_request: products_per_request,
                import_options: import_options,
                import_inventory_by_csv: import_inventory_by_csv,
                s2w_index: s2w_index,
                step: 'import',
                ftell: ftell,
                start: start,
                total: total,
            },
            success: function (response) {
                console.log(response);
                if (response.status === 'success') {
                    ftell = response.ftell;
                    start = response.start;
                    let percent = response.percent;
                    $progress.progress('set percent', percent);
                    s2w_import();
                } else if (response.status === 'finish') {
                    let message = s2w_import_shopify_to_woocommerce_import_params.i18n_completed;
                    $progress.progress('complete');
                    $progress.progress('set label', message);
                    if (!import_inventory_by_csv && import_options['download_images'] || import_options['download_description_images']) {
                        message += ' ' + s2w_import_shopify_to_woocommerce_import_params.i18n_import_image_notice;
                    }
                    alert(message);
                    $('.s2w-import-completed-message').removeClass('s2w-hidden');
                } else {
                    $progress.progress('set error');
                    $progress.progress('set label', response.message);
                    $('.s2w-import-completed-message').removeClass('s2w-hidden');
                }
            },
            error: function (err) {
                console.log(err);
                $progress.progress('set error');
                $progress.progress('set label', s2w_import_shopify_to_woocommerce_import_params.i18n_error);
                $('.s2w-import-completed-message').removeClass('s2w-hidden');
            },
        });
    }

    $('#s2w-download_images').on('change', function () {
        let $download_images_later = $('.s2w-download_images_later').closest('tr');
        if ($(this).prop('checked')) {
            $download_images_later.fadeIn(200);
        } else {
            $download_images_later.fadeOut(200);
        }
    }).trigger('change');
    $('.search-category').select2({
        closeOnSelect: false,
        placeholder: s2w_import_shopify_to_woocommerce_import_params.i18n_category_search_placeholder,
        ajax: {
            url: "admin-ajax.php?action=s2w_search_cate&_s2w_nonce=" + _s2w_nonce,
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
        minimumInputLength: 2
    });
});
