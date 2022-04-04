jQuery(document).ready(function ($) {
    'use strict';
    let _vi_wad_ajax_nonce = vi_wad_admin_settings_params._vi_wad_ajax_nonce;
    $('.vi-wad-placeholder-value').on('click', function () {
        $(this).select();
    });
    $('.vi-wad-placeholder-value-copy').on('click', function () {
        let $container = $(this).closest('.vi-wad-placeholder-value-container');
        $container.find('.vi-wad-placeholder-value').select();
        document.execCommand('copy');
    });

    let max_decimals = parseInt(vi_wad_admin_settings_params.decimals);
    $('.vi-ui.tabular.menu .item').vi_tab({
        history: true,
        historyType: 'hash'
    });
    $('.vi-ui.checkbox').checkbox();
    $('select.vi-ui.dropdown').dropdown({placeholder: ''});
    $('.vi-ui.accordion').vi_accordion('refresh');
    /*Button save*/
    $('.vi-wad-save-settings').on('click', function (e) {
        let rule_error = 0, format_error = 0;
        $('.vi-wad-price-rule-row').map(function () {
            rule_error += validate_price_rules($(this));
        });
        if (rule_error > 0) {
            alert('You have error(s) in your rules');
            return false;
        }
        $('.vi-wad-format-price-rules-container>tr').map(function () {
            format_error += validate_price_format($(this));
        });
        if (format_error > 0) {
            alert('You have error(s) in your rules');
            return false;
        }
    });

    function contain_only_digit(val) {
        return /^\d+$/.test(val);
    }

    function contain_only_digit_and_x(val) {
        return /^[\d|x]+$/i.test(val);
    }

    function validate_price_rules($row) {
        $row.find('.vi-wad-error').removeClass('vi-wad-error');
        let rule_error = 0;
        let $sale_price = $row.find('.vi-wad-plus-sale-value');
        let $price = $row.find('.vi-wad-plus-value');
        let $price_from = $row.find('.vi-wad-price-from');
        let $price_to = $row.find('.vi-wad-price-to');
        if (parseFloat($sale_price.val()) > -1 && parseFloat($sale_price.val()) > parseFloat($price.val())) {
            rule_error++;
            $sale_price.closest('.vi-ui.labeled').addClass('vi-wad-error');
            $price.closest('.vi-ui.labeled').addClass('vi-wad-error');
        }
        if ($price_to.val() !== '' && parseFloat($price_from.val()) > parseFloat($price_to.val())) {
            rule_error++;
            $price_from.closest('.vi-ui.labeled').addClass('vi-wad-error');
            $price_to.closest('.vi-ui.labeled').addClass('vi-wad-error');
        }
        return rule_error;
    }

    function validate_price_format($row) {
        $row.find('.vi-wad-error').removeClass('vi-wad-error');
        $row.find('.vi-wad-error-message').html('');
        let format_error = 0;
        let $price_range_from = $row.find('.vi-wad-format-price-rules-from'),
            price_range_from = $price_range_from.val(),
            $price_range_to = $row.find('.vi-wad-format-price-rules-to'),
            price_range_to = $price_range_to.val(),
            $part_range_from = $row.find('.vi-wad-format-price-rules-value-from'),
            part_range_from = $part_range_from.val(),
            $part_range_to = $row.find('.vi-wad-format-price-rules-value-to'),
            part_range_to = $part_range_to.val(),
            $new_value = $row.find('.vi-wad-format-price-rules-value'),
            new_value = $new_value.val(),
            $part = $row.find('select[name="wad_format_price_rules[part][]"]');

        if (parseFloat(price_range_from) > parseFloat(price_range_to)) {
            format_error++;
            $price_range_from.closest('.vi-ui.labeled').addClass('vi-wad-error');
            $price_range_to.closest('.vi-ui.labeled').addClass('vi-wad-error');
            $price_range_from.closest('.vi-wad-error-message-parent').find('.vi-wad-error-message').html(vi_wad_admin_settings_params.i18n_error_min_max);
            $price_range_to.closest('.vi-wad-error-message-parent').find('.vi-wad-error-message').html(vi_wad_admin_settings_params.i18n_error_max_min);
        }
        if ($part.val() === 'integer') {
            let part_range_max = Math.min(parseInt(price_range_from).toString().length, parseInt(price_range_to).toString().length) - 1;
            if (parseFloat(part_range_from) > parseFloat(part_range_to)) {
                format_error++;
                $part_range_from.closest('.vi-ui.labeled').addClass('vi-wad-error');
                $part_range_to.closest('.vi-ui.labeled').addClass('vi-wad-error');
                $part_range_from.closest('.vi-wad-error-message-parent').find('.vi-wad-error-message').html(vi_wad_admin_settings_params.i18n_error_min_max);
                $part_range_to.closest('.vi-wad-error-message-parent').find('.vi-wad-error-message').html(vi_wad_admin_settings_params.i18n_error_max_min);
            }
            if (price_range_from === '' || parseInt(price_range_from).toString().length < 2) {
                format_error++;
                $price_range_from.closest('.vi-ui.labeled').addClass('vi-wad-error');
                $price_range_from.closest('.vi-wad-error-message-parent').find('.vi-wad-error-message').html(vi_wad_admin_settings_params.i18n_error_min_digits);
            }
            if (price_range_to === '' || parseInt(price_range_to).toString().length < 2) {
                format_error++;
                $price_range_to.closest('.vi-ui.labeled').addClass('vi-wad-error');
                $price_range_to.closest('.vi-wad-error-message-parent').find('.vi-wad-error-message').html(vi_wad_admin_settings_params.i18n_error_min_digits);
            }

            if ((parseInt(part_range_from) !== 0 || parseInt(part_range_to) !== 0) && part_range_max > 0) {
                if (part_range_from.length > part_range_max) {
                    format_error++;
                    $part_range_from.closest('.vi-ui.labeled').addClass('vi-wad-error');
                    $part_range_from.closest('.vi-wad-error-message-parent').find('.vi-wad-error-message').html(part_range_max === 1 ? vi_wad_admin_settings_params.i18n_error_max_digit.replace('{value}', part_range_max) : vi_wad_admin_settings_params.i18n_error_max_digits.replace('{value}', part_range_max));
                }
                if (part_range_to.length > part_range_max) {
                    format_error++;
                    $part_range_to.closest('.vi-ui.labeled').addClass('vi-wad-error');
                    $part_range_to.closest('.vi-wad-error-message-parent').find('.vi-wad-error-message').html(part_range_max === 1 ? vi_wad_admin_settings_params.i18n_error_max_digit.replace('{value}', part_range_max) : vi_wad_admin_settings_params.i18n_error_max_digits.replace('{value}', part_range_max));
                }
            }
            if ((part_range_from === '' && part_range_to === '' && new_value.length > part_range_max && part_range_max > 0)) {
                format_error++;
                $new_value.closest('.vi-ui.labeled').addClass('vi-wad-error');
                $new_value.closest('.vi-wad-error-message-parent').find('.vi-wad-error-message').html(part_range_max === 1 ? vi_wad_admin_settings_params.i18n_error_max_digit.replace('{value}', part_range_max) : vi_wad_admin_settings_params.i18n_error_max_digits.replace('{value}', part_range_max));
            }
            let new_min = Math.min(part_range_max, Math.max(part_range_from.length, part_range_to.length));
            if (((part_range_from !== '' || part_range_to !== '') && new_value.length > new_min && part_range_max > 0)) {
                format_error++;
                $new_value.closest('.vi-ui.labeled').addClass('vi-wad-error');
                $new_value.closest('.vi-wad-error-message-parent').find('.vi-wad-error-message').html(new_min === 1 ? vi_wad_admin_settings_params.i18n_error_max_digit.replace('{value}', new_min) : vi_wad_admin_settings_params.i18n_error_max_digits.replace('{value}', new_min));
            }
            if (!contain_only_digit(new_value)) {
                format_error++;
                $new_value.closest('.vi-ui.labeled').addClass('vi-wad-error');
                $new_value.closest('.vi-wad-error-message-parent').find('.vi-wad-error-message').html(vi_wad_admin_settings_params.i18n_error_digit_only);
            }
        } else if (max_decimals > 0) {
            if (parseFloat(`.${part_range_from}`) > parseFloat(`.${part_range_to}`)) {
                format_error++;
                $part_range_from.closest('.vi-ui.labeled').addClass('vi-wad-error');
                $part_range_to.closest('.vi-ui.labeled').addClass('vi-wad-error');
                $part_range_from.closest('.vi-wad-error-message-parent').find('.vi-wad-error-message').html(vi_wad_admin_settings_params.i18n_error_min_max);
                $part_range_to.closest('.vi-wad-error-message-parent').find('.vi-wad-error-message').html(vi_wad_admin_settings_params.i18n_error_max_min);
            }
            if (new_value.length > max_decimals) {
                format_error++;
                $new_value.closest('.vi-ui.labeled').addClass('vi-wad-error');
                $new_value.closest('.vi-wad-error-message-parent').find('.vi-wad-error-message').html(vi_wad_admin_settings_params.i18n_error_max_decimals);
            }
            if (!contain_only_digit_and_x(new_value)) {
                format_error++;
                $new_value.closest('.vi-ui.labeled').addClass('vi-wad-error');
                $new_value.closest('.vi-wad-error-message-parent').find('.vi-wad-error-message').html(vi_wad_admin_settings_params.i18n_error_digit_and_x_only);
            }
        }
        return format_error;
    }

    $(".search-product").select2({
        closeOnSelect: false,
        placeholder: "Please enter product title to search",
        ajax: {
            url: "admin-ajax.php?action=wad_search_product&_vi_wad_ajax_nonce=" + _vi_wad_ajax_nonce,
            dataType: 'json',
            type: "GET",
            quietMillis: 50,
            delay: 250,
            data: function (params) {
                return {
                    keyword: params.term,
                    p_id: $(this).closest('td').data('id')
                };
            },
            processResults: function (data) {
                return {
                    results: data
                };
            }
        },
        escapeMarkup: function (markup) {
            return markup;
        }, // let our custom formatter work
        minimumInputLength: 1
    });
    /*Search categories*/
    $('.search-category').select2({
        closeOnSelect: false,
        placeholder: "Please enter category name to search",
        ajax: {
            url: "admin-ajax.php?action=wad_search_cate&_vi_wad_ajax_nonce=" + _vi_wad_ajax_nonce,
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
    /*Search tags*/
    $('.search-tags').select2({
        closeOnSelect: false,
        placeholder: "Please enter tag to search",
        ajax: {
            url: "admin-ajax.php?action=wad_search_tags&_vi_wad_ajax_nonce=" + _vi_wad_ajax_nonce,
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

    /*Add row*/
    $('.vi-wad-price-rule-add').on('click', function () {
        let $rows = $('.vi-wad-price-rule-row'),
            $lastRow = $rows.last(),
            $newRow = $lastRow.clone();
        $newRow.find('.vi-wad-price-from').val('');
        $newRow.find('.vi-wad-price-to').val('');
        $newRow.find('.vi-wad-plus-value-type').dropdown();
        $('.vi-wad-price-rule-container').append($newRow);
    });

    /*remove row*/
    $(document).on('click', '.vi-wad-price-rule-remove', function () {
        let $button = $(this), $rows = $('.vi-wad-price-rule-row'),
            $row = $button.closest('.vi-wad-price-rule-row');
        if ($rows.length > 1) {
            if (confirm('Do you want to remove this row?')) {
                $row.fadeOut(300);
                setTimeout(function () {
                    $row.remove();
                }, 300)
            }
        }
    });
    $(document).on('change', 'select[name="wad_plus_value_type[]"]', function () {
        change_price_label($(this));
    });
    $(document).on('change', 'select[name="wad_price_default[plus_value_type]"]', function () {
        change_price_label($(this));
    });

    function change_price_label($select) {
        let $current = $select.closest('tr');
        switch ($select.val()) {
            case 'fixed':
                $current.find('.vi-wad-value-label-left').html('+');
                $current.find('.vi-wad-value-label-right').html('$');
                break;
            case 'percent':
                $current.find('.vi-wad-value-label-left').html('+');
                $current.find('.vi-wad-value-label-right').html('%');
                break;
            case 'multiply':
                $current.find('.vi-wad-value-label-left').html('x');
                $current.find('.vi-wad-value-label-right').html('');
                break;
            default:
                $current.find('.vi-wad-value-label-left').html('=');
                $current.find('.vi-wad-value-label-right').html('$');
        }
    }

    // $('.vi-ui.button.primary').on('click', function () {
    //     if (!$('#vi-wad-import-currency-rate').val()) {
    //         alert('Please enter Import products currency exchange rate');
    //         return false;
    //     }
    // });

    $('.vi-wad-generate-secretkey').on('click', function () {
        var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split(""), b = [];
        for (let i = 0; i < 32; i++) {
            var j = (Math.random() * (a.length - 1)).toFixed(0);
            b[i] = a[j];
        }

        $('.vi-wad-secret-key').val(b.join(""));
    });

    $('.vi-wad-copy-secretkey').on('click', function () {
        let $container = $(this).closest('td');
        $container.find('.vi-wad-secret-key').select();
        $container.find('.vi-wad-copy-secretkey-success').remove();
        document.execCommand('copy');
        let $result_icon = $('<span class="vi-wad-copy-secretkey-success dashicons dashicons-yes" title="Copied to Clipboard"></span>');
        $container.append($result_icon);
        $result_icon.fadeOut(10000);
        setTimeout(function () {
            $result_icon.remove();
        }, 10000);
    });

//String replace

    $('.add-string-replace-rule').on('click', function () {
        let clone = `<tr class="clone-source">
                        <td>
                            <input type="text" name="wad_string_replace[from_string][]">
                        </td>
                         <td>
                            <div class="vi-wad-string-replace-sensitive-container">
                            <input type="checkbox" value="1" class="vi-wad-string-replace-sensitive">                            
                            <input type="hidden" class="vi-wad-string-replace-sensitive-value" value="" name="wad_string_replace[sensitive][]">
                            </div>
                        </td>
                        <td>
                            <input type="text" name="wad_string_replace[to_string][]"  placeholder="Leave blank to delete matches">
                        </td>
                        <td>
                            <button type="button" class="vi-ui button negative tiny delete-string-replace-rule">
                                <i class="dashicons dashicons-trash "></i>
                            </button>
                        </td>
                    </tr>`;

        $('.string-replace tbody').append(clone);
    });

    $('body').on('change', '.vi-wad-string-replace-sensitive', function () {
        let $container = $(this).closest('.vi-wad-string-replace-sensitive-container');
        let $sensitive_value = $container.find('.vi-wad-string-replace-sensitive-value');
        let sensitive_value = $(this).prop('checked') ? 1 : '';
        $sensitive_value.val(sensitive_value);
    });
    $('body').on('click', '.delete-string-replace-rule', function () {
        if (confirm('Remove this item?')) {
            $(this).closest('.clone-source').remove();
        }
    });
    /*String replace*/
    $('.add-string-replace-rule-url').on('click', function () {
        let clone = `<tr class="clone-source">
                        <td>
                            <input type="text" value="" name="vi-wad-carrier_url_replaces[from_string][]">
                        </td>
                        <td>
                            <input type="text" placeholder="URL of a replacement carrier" value="" name="vi-wad-carrier_url_replaces[to_string][]">
                        </td>
                        <td>
                            <button type="button" class="vi-ui button negative tiny delete-string-replace-rule">
                                <i class="dashicons dashicons-trash"></i>
                            </button>
                        </td>
                    </tr>`;

        $('.string-replace-url tbody').append(clone);
    });
    $('.add-string-replace-rule-name').on('click', function () {
        let clone = `<tr class="clone-source">
                        <td>
                            <input type="text" value="" name="vi-wad-carrier_name_replaces[from_string][]">
                        </td>
                         <td>
                            <div class="vi-wad-string-replace-sensitive-container">
                                <input type="checkbox" value="1" class="vi-wad-string-replace-sensitive">
                                <input type="hidden" class="vi-wad-string-replace-sensitive-value" value="" name="vi-wad-carrier_name_replaces[sensitive][]">
                            </div>
                        </td>
                        <td>
                            <input type="text" placeholder="Leave blank to delete matches" value="" name="vi-wad-carrier_name_replaces[to_string][]">
                        </td>                                       
                        <td>
                            <button type="button" class="vi-ui button negative tiny delete-string-replace-rule">
                                <i class="dashicons dashicons-trash"></i>
                            </button>
                        </td>
                    </tr>`;

        $('.string-replace-name tbody').append(clone);
    });
    /*Format price rules*/
    $(document).on('click', '.vi-wad-format-price-rules-duplicate', function () {
        let $row = $(this).closest('tr'), $new_row = $row.clone();
        $new_row.find('.vi-ui.dropdown').dropdown('set selected', $row.find('select[name="wad_format_price_rules[part][]"]').val());
        $new_row.insertAfter($row);
        recalculate_index();
    });
    $(document).on('click', '.vi-wad-format-price-rules-remove', function () {
        let $row = $(this).closest('tr');
        if (confirm('Do you really want to remove this row?')) {
            if ($('.vi-wad-format-price-rules-container>tr').length === 1) {
                $row.find('input[name="wad_format_price_rules[from][]"]').val(0);
                $row.find('input[name="wad_format_price_rules[to][]"]').val(0);
                $row.find('input[name="wad_format_price_rules[value_from][]"]').val(0);
                $row.find('input[name="wad_format_price_rules[value_to][]"]').val(0);
                $row.find('input[name="wad_format_price_rules[value][]"]').val(0);
                $row.find('select[name="wad_format_price_rules[part][]"]').val('fraction').trigger('change');
            } else {
                $row.fadeOut(300);
                setTimeout(function () {
                    $row.remove();
                    recalculate_index();
                }, 300)
            }
        }
    });
    $('.vi-wad-format-price-rules-table').on('change', 'select[name="wad_format_price_rules[part][]"]', function () {
        let $row = $(this).closest('tr'), $label = $row.find('.vi-wad-format-price-rules-label'),
            label_class = $label.attr('class');
        if ($(this).val() === 'integer') {
            $label.attr('class', label_class.replace(' left ', ' right '))
        } else {
            $label.attr('class', label_class.replace(' right ', ' left '))
        }
    }).on('change', 'select[name="wad_format_price_rules[part][]"],input[name="wad_format_price_rules[from][]"],input[name="wad_format_price_rules[to][]"],input[name="wad_format_price_rules[value_from][]"],input[name="wad_format_price_rules[value_to][]"],input[name="wad_format_price_rules[value][]"]', function () {
        validate_price_format($(this).closest('tr'));
    });
    $('.vi-wad-format-price-rules-test-button').on('click', function () {
        let $button = $(this);
        if (!$button.hasClass('loading')) {
            let format_error = 0, format_price_rules = [], $result = $('.vi-wad-format-price-rules-test-result');
            $('.vi-wad-format-price-rules-container>tr').map(function () {
                let error_count = validate_price_format($(this));
                if (error_count > 0) {
                    format_error += error_count;
                } else {
                    format_price_rules.push({
                        from: $(this).find('input[name="wad_format_price_rules[from][]"]').val(),
                        to: $(this).find('input[name="wad_format_price_rules[to][]"]').val(),
                        part: $(this).find('select[name="wad_format_price_rules[part][]"]').val(),
                        value_from: $(this).find('input[name="wad_format_price_rules[value_from][]"]').val(),
                        value_to: $(this).find('input[name="wad_format_price_rules[value_to][]"]').val(),
                        value: $(this).find('input[name="wad_format_price_rules[value][]"]').val(),
                    });
                }
            });
            if (format_error === 0) {
                $button.addClass('loading');
                $result.html('');
                $.ajax({
                    url: vi_wad_admin_settings_params.url,
                    type: 'GET',
                    dataType: 'JSON',
                    data: {
                        action: 'wad_format_price_rules_test',
                        _vi_wad_ajax_nonce: _vi_wad_ajax_nonce,
                        format_price_rules_test: $('.vi-wad-format-price-rules-test').val(),
                        format_price_rules: format_price_rules,
                    },
                    success: function (response) {
                        $result.html(response.result);
                    },
                    error: function (err) {
                        $result.html(err.statusText);
                    },
                    complete: function () {
                        $button.removeClass('loading');
                    }
                })
            } else {
                alert('Please review your rules before continuing.')
            }
        }
    });
    $('.vi-wad-format-price-rules-container.ui-sortable').sortable({
        stop: function (event, ui) {
            recalculate_index();
        }
    });
    $('.vi-wad-price-rule-container.ui-sortable').sortable();
    /*Add shipping cost after price rules*/
    $('#vi-wad-show-shipping-option').on('change', function () {
        let $dependency = $('#vi-wad-shipping-cost-after-price-rules').closest('tr');
        if ($(this).prop('checked')) {
            $dependency.fadeIn(200);
        } else {
            $dependency.fadeOut(200);
        }
    }).trigger('change');
    $('#vi-wad-use-external-image').on('change', function () {
        let $dependency = $('#vi-wad-download-description-images').closest('tr');
        if (!$(this).prop('checked')) {
            $dependency.fadeIn(200);
        } else {
            $dependency.fadeOut(200);
        }
    }).trigger('change');

    function recalculate_index() {
        let count = 1;
        $('.vi-wad-format-price-rules-number').map(function () {
            $(this).html(count);
            count++;
        })
    }

    function roundResult(number) {
        let temp = Math.pow(10, max_decimals);
        return Math.round(number * temp) / temp;
    }

    $(document).on('click', '.vi-wad-save-settings, .vi-wad-check-key', function () {
        let $test_price = $('.vi-wad-format-price-rules-test');
        let test_price = $test_price.val();
        $test_price.val(roundResult(test_price));
    });
    $('.woocommerce-alidropship form').on('submit', function () {
        let $replacement = $(terms_list_table.$('input.vi-wad-product-attribute-replacement'));
        if ($replacement.length > 0) {
            let mapping_origin = {};
            let mapping_replacement = {};
            $replacement.map(function () {
                let $current = $(this), current = $current.val().trim();
                if (current) {
                    let $row = $current.closest('tr');
                    let slug = $row.data('attribute_slug');
                    if (!mapping_origin.hasOwnProperty(slug)) {
                        mapping_origin[slug] = [];
                        mapping_replacement[slug] = [];
                    }
                    mapping_origin[slug].push($row.find('.vi-wad-product-attribute-original-term').html());
                    mapping_replacement[slug].push(current);
                }
            });
            $('input[name="wad_attributes_mapping_origin"]').val(JSON.stringify(mapping_origin));
            $('input[name="wad_attributes_mapping_replacement"]').val(JSON.stringify(mapping_replacement));
        }
        $('.vi-wad-save-settings').addClass('loading');
        $('.vi-wad-check-key').addClass('loading');
    });
    /*Search Attributes*/
    // let current_search = '';
    // $('.vi-wad-product-attribute-search').on('keyup', function () {
    //     let $search = $(this), search = $search.val().trim().toLowerCase();
    //     if (search) {
    //         if (search !== current_search) {
    //             current_search = search;
    //             $('.vi-wad-product-attribute-original-term').map(function () {
    //                 let $term = $(this), term = $term.html(), $row = $term.closest('tr');
    //                 if (term.indexOf(search) > -1) {
    //                     $row.removeClass('vi-wad-hidden');
    //                 } else {
    //                     $row.addClass('vi-wad-hidden');
    //                 }
    //             })
    //         }
    //     } else {
    //         $('.vi-wad-attributes-mapping').find('tr').removeClass('vi-wad-hidden');
    //     }
    // });
    /*Only load Product Attributes tab if viewed*/
    let loading_attributes_list = false, $progress = $('.vi-wad-attributes-mapping-progress');
    $progress.progress('set percent', 1).progress('set label', 'Please wait while attributes are being loaded');
    $('.vi-wad-tab-item[data-tab="attributes"]').on('click', function () {
        if (!$(this).hasClass('vi-wad-tab-item-attributes-loaded') && !loading_attributes_list) {
            loading_attributes_list = true;
            get_attributes_mapping_html(1, '{}');
        }
    });
    let url = window.location.href;
    if (url.indexOf('#/attributes') > -1) {
        loading_attributes_list = true;
        get_attributes_mapping_html(1, '{}');
    }
    let $mapping_table = $('#vi-wad-attributes-mapping-table'), terms_list_table = $mapping_table.DataTable({
        aLengthMenu: [
            [25, 50, 100, 200, 500],
            [25, 50, 100, 200, 500]
        ],
    });

    function get_attributes_mapping_html(page, attributes_list) {
        $.ajax({
            url: vi_wad_admin_settings_params.url,
            type: 'POST',
            dataType: 'JSON',
            data: {
                action: 'wad_get_product_attributes_mapping',
                _vi_wad_ajax_nonce: _vi_wad_ajax_nonce,
                page: page,
                attributes_list: attributes_list,
            },
            success: function (response) {
                if (response.status === 'success') {
                    $progress.progress('set percent', parseInt(response.percent));
                    if (page < parseInt(response.page)) {
                        get_attributes_mapping_html(response.page, response.attributes_list);
                    } else {
                        // $('.vi-wad-attributes-mapping').html(response.attributes_list_html);
                        $('.vi-wad-tab-item[data-tab="attributes"]').addClass('vi-wad-tab-item-attributes-loaded');
                        loading_attributes_list = false;
                        $('.vi-wad-attributes-tab .vi-wad-overlay').addClass('vi-wad-hidden');
                        let $attributes_list = $('.vi-wad-attributes-mapping'),
                            attributes_list = JSON.parse(response.attributes_list),
                            attributes_mapping_origin = JSON.parse(response.attributes_mapping_origin),
                            attributes_mapping_replacement = JSON.parse(response.attributes_mapping_replacement);
                        for (let attribute_slug in attributes_list) {
                            if (attributes_list.hasOwnProperty(attribute_slug) && attributes_list[`${attribute_slug}`].length > 0) {
                                let attribute_values = attributes_list[attribute_slug];
                                for (let i in attribute_values) {
                                    let replacement = '';
                                    if (attributes_mapping_origin && attributes_mapping_origin.hasOwnProperty(attribute_slug) && attributes_mapping_origin[attribute_slug]) {
                                        let replacement_i = attributes_mapping_origin[attribute_slug].indexOf(attribute_values[i]);
                                        if (replacement_i > -1) {
                                            replacement = attributes_mapping_replacement[attribute_slug][replacement_i];
                                        }
                                    }
                                    terms_list_table.row.add($(`<tr data-attribute_slug="${attribute_slug}">
                                        <td class="vi-wad-product-attribute-slug">${attribute_slug}</td>
                                    <td class="vi-wad-product-attribute-original-term">${attribute_values[i]}</td>
                                    <td><input type="text"
                                class="vi-wad-product-attribute-replacement"
                                    value="${replacement}">
                                        </td>
                                        </tr>`));
                                }
                            }
                        }
                        terms_list_table.draw();
                        $('.vi-wad-attributes-mapping-table-container').find('.ui.dropdown').addClass('vi-ui');
                        if (vi_wad_admin_settings_params.attributes_mapping_per_page) {
                            $('select[name="vi-wad-attributes-mapping-table_length"]').val(vi_wad_admin_settings_params.attributes_mapping_per_page).trigger('change');
                        }
                    }
                }
            },
            error: function (err) {
                $progress.progress('set label', 'An error occurred. Please try again later').progress('set error');
            },
            complete: function () {

            }
        })
    }

    /*Update rate*/
    $('.vi-wad-import-currency-rate-button').on('click', function () {
        let $button = $(this), $container = $button.closest('div.labeled'),
            $exchange_rate_api = $('select[name="wad_exchange_rate_api"]'),
            $exchange_rate = $container.find('.vi-wad-import-currency-rate'),
            exchange_rate_api = $exchange_rate_api.val();
        if (!$button.hasClass('loading')) {
            if (!exchange_rate_api) {
                alert('Please select an Exchange rate API to continue');
                $exchange_rate_api.click();
            } else {
                $button.addClass('loading');
                $.ajax({
                    url: vi_wad_admin_settings_params.url,
                    type: 'GET',
                    dataType: 'JSON',
                    data: {
                        action: 'wad_get_exchange_rate',
                        _vi_wad_ajax_nonce: _vi_wad_ajax_nonce,
                        api: exchange_rate_api,
                        decimals: $('select[name="wad_exchange_rate_decimals"]').val(),
                    },
                    success: function (response) {
                        if (response.status === 'success') {
                            $exchange_rate.val(response.data).trigger('change');
                        } else {
                            alert(response.message);
                        }
                    },
                    error: function (err) {
                        alert(err.statusText);
                    },
                    complete: function () {
                        $button.removeClass('loading');
                    }
                })
            }
        }
    });
    $('.vi-wad-exchange-rate-auto').on('change', function () {
        if ($(this).prop('checked')) {
            $('.vi-wad-exchange-rate-options').removeClass('vi-wad-hidden');
        } else {
            $('.vi-wad-exchange-rate-options').addClass('vi-wad-hidden');
        }
    });
    $('.vi-wad-update-product-auto').on('change', function () {
        if ($(this).prop('checked')) {
            $('.vi-wad-update-product-options').removeClass('vi-wad-hidden');
        } else {
            $('.vi-wad-update-product-options').addClass('vi-wad-hidden');
        }
    });
    $('.vi-wad-update-order-auto').on('change', function () {
        if ($(this).prop('checked')) {
            $('.vi-wad-update-order-options').removeClass('vi-wad-hidden');
        } else {
            $('.vi-wad-update-order-options').addClass('vi-wad-hidden');
        }
    });
    /**
     * Start Get download key
     */
    $('.villatheme-get-key-button').one('click', function (e) {
        let v_button = $(this);
        v_button.addClass('loading');
        let data = v_button.data();
        let item_id = data.id;
        let app_url = data.href;
        let main_domain = window.location.hostname;
        main_domain = main_domain.toLowerCase();
        let popup_frame;
        e.preventDefault();
        let download_url = v_button.attr('data-download');
        popup_frame = window.open(app_url, "myWindow", "width=380,height=600");
        window.addEventListener('message', function (event) {
            /*Callback when data send from child popup*/
            let obj = $.parseJSON(event.data);
            let update_key = '';
            let message = obj.message;
            let support_until = '';
            let check_key = '';
            if (obj['data'].length > 0) {
                for (let i = 0; i < obj['data'].length; i++) {
                    if (obj['data'][i].id == item_id && (obj['data'][i].domain == main_domain || obj['data'][i].domain == '' || obj['data'][i].domain == null)) {
                        if (update_key == '') {
                            update_key = obj['data'][i].download_key;
                            support_until = obj['data'][i].support_until;
                        } else if (support_until < obj['data'][i].support_until) {
                            update_key = obj['data'][i].download_key;
                            support_until = obj['data'][i].support_until;
                        }
                        if (obj['data'][i].domain == main_domain) {
                            update_key = obj['data'][i].download_key;
                            break;
                        }
                    }
                }
                if (update_key) {
                    check_key = 1;
                    $('.villatheme-autoupdate-key-field').val(update_key).trigger('change');
                }
            }
            v_button.removeClass('loading');
            if (check_key) {
                $('<p><strong>' + message + '</strong></p>').insertAfter(".villatheme-autoupdate-key-field");
                $(v_button).closest('form').submit();
            } else {
                $('<p><strong> Your key is not found. Please contact support@villatheme.com </strong></p>').insertAfter(".villatheme-autoupdate-key-field");
            }
        });
    });
    /**
     * End get download key
     */
    $('.vi-wad-get-access-token').on('click', function (e) {
        let $button = $(this);
        let $success_message = $('.vi-wad-get-access-token-message');
        let $auto_update_key = $('.villatheme-autoupdate-key-field');
        let auto_update_key = $auto_update_key.val();
        if (!auto_update_key) {
            alert('Auto update key is required');
        } else {
            $button.addClass('loading').unbind('click');
            $success_message.addClass('vi-wad-hidden');
            let data = $button.data();
            let app_url = `https://oauth.aliexpress.com/authorize?response_type=code&client_id=${vi_wad_admin_settings_params.client_id}&view=web&sp=ae&redirect_uri=https://villatheme.com/aliexpress&state=${auto_update_key}`;
            let main_domain = window.location.hostname;
            main_domain = main_domain.toLowerCase();
            e.preventDefault();
            window.open(app_url, "myWindow", "width=868,height=686");
            window.addEventListener('message', function (event) {
                /*Callback when data send from child popup*/
                let obj = $.parseJSON(event.data);
                if (obj.hasOwnProperty('code') && obj.code == 200) {
                    let access_token = obj.msg;
                    if (access_token) {
                        $.ajax({
                            url: vi_wad_admin_settings_params.url,
                            type: 'POST',
                            dataType: 'JSON',
                            data: {
                                action: 'wad_save_access_token',
                                _vi_wad_ajax_nonce: _vi_wad_ajax_nonce,
                                access_token: access_token,
                            },
                            success: function (response) {
                                if (response.status === 'success') {
                                    $('.vi-wad-access-token-table').find('tbody').html(response.data);
                                    $success_message.removeClass('vi-wad-hidden');
                                    $('.vi-wad-update-product-message').remove();
                                    $('.vi-wad-update-order-message').remove();
                                } else {
                                    alert(response.message);
                                }
                            },
                            error: function (err) {
                                alert('Can not save access token');
                            },
                            complete: function () {
                                $button.removeClass('loading');
                            }
                        })
                    } else {
                        $button.removeClass('loading');
                        alert('Can not get access token');
                    }
                } else {
                    $button.removeClass('loading');
                    alert(obj.msg);
                }
            });
        }
    });
    $('.vi-wad-get-key').on('click', function () {
        $('.vi-wad-tab-item[data-tab="update"]').click();
        $('.villatheme-get-key-button').click();
    });
    /**
     * Remove access token
     */
    $(document).on('click', '.vi-wad-remove-access-token', function () {
        let $button = $(this), $row = $button.closest('tr');
        if (!$button.hasClass('loading')) {
            if (confirm('This access token will be removed, do you want to continue?')) {
                $button.addClass('loading');
                $.ajax({
                    url: vi_wad_admin_settings_params.url,
                    type: 'POST',
                    dataType: 'JSON',
                    data: {
                        action: 'wad_remove_access_token',
                        _vi_wad_ajax_nonce: _vi_wad_ajax_nonce,
                        access_token: $row.find('input[name="wad_access_token"]').val(),
                    },
                    success: function (response) {
                        if (response.status === 'success') {
                            $row.fadeOut(200);
                            setTimeout(function () {
                                $row.remove();
                            }, 200);
                        } else {
                            alert(response.message);
                        }
                    },
                    error: function (err) {
                        alert('Error');
                    },
                    complete: function () {
                        $button.removeClass('loading');
                    }
                })
            }
        }
    });
    $('.villatheme-autoupdate-key-field').on('change', function () {
        let $get_token = $('.vi-wad-get-access-token');
        let $get_key = $('.vi-wad-get-key-shortcut');
        if ($(this).val()) {
            $get_key.addClass('vi-wad-hidden');
            $get_token.removeClass('disabled');
        } else {
            $get_token.addClass('disabled');
            $get_key.removeClass('vi-wad-hidden');
        }
    });

    function check_price_rules() {
        let $message = $('.vi-wad-price-rule-message');
        $message.html('');
        let range_error = 0;
        let overlap_error = 0;
        let ranges = [];
        let $rows = $('.vi-wad-price-rule-row');
        let count = 0;
        let rule_error = 0;
        $rows.map(function () {
            let $row = $(this);
            $row.find('.vi-wad-error').removeClass('vi-wad-error');
            let $sale_price = $row.find('.vi-wad-plus-sale-value');
            let $price = $row.find('.vi-wad-plus-value');
            if (parseFloat($sale_price.val()) > -1 && parseFloat($sale_price.val()) > parseFloat($price.val())) {
                rule_error++;
                $sale_price.closest('.vi-ui.labeled').addClass('vi-wad-error');
                $price.closest('.vi-ui.labeled').addClass('vi-wad-error');
            }

            let $price_from = $row.find('.vi-wad-price-from');
            let price_from = $price_from.val();
            if (price_from === '') {
                price_from = 0;
            } else {
                price_from = parseFloat(price_from);
            }
            let $price_to = $row.find('.vi-wad-price-to');
            let price_to = $price_to.val();
            if (price_to === '') {
                price_to = 0;
            } else {
                price_to = parseFloat(price_to);
            }

            if (count < $rows.length - 1) {
                if (price_from > price_to) {
                    $price_from.addClass('vi-wad-error');
                    $price_to.addClass('vi-wad-error');
                    range_error++;
                } else {
                    ranges.forEach(function (value, key) {
                        if ((value.min === price_from && value.max === price_to) || (price_from < value.min && value.min < price_to)) {
                            $price_from.addClass('vi-wad-error');
                            $price_to.addClass('vi-wad-error');
                            overlap_error++;
                        } else if ((value.min < price_from && price_from < value.max) || (price_from < value.max && value.max < price_to)) {
                            $price_from.addClass('vi-wad-error');
                            overlap_error++;
                        } else if (value.min < price_to && price_to < value.max) {
                            $price_to.addClass('vi-wad-error');
                            overlap_error++;
                        }
                    });
                    ranges.push({min: price_from, max: price_to});
                }
            } else {
                if ($price_to.val() !== '') {
                    if (price_from > price_to) {
                        $price_from.addClass('vi-wad-error');
                        $price_to.addClass('vi-wad-error');
                        range_error++;
                    } else {
                        ranges.forEach(function (value, key) {
                            if ((value.min === price_from && value.max === price_to) || (price_from < value.min && value.min < price_to)) {
                                $price_from.addClass('vi-wad-error');
                                $price_to.addClass('vi-wad-error');
                                overlap_error++;
                            } else if ((value.min < price_from && price_from < value.max) || (price_from < value.max && value.max < price_to)) {
                                $price_from.addClass('vi-wad-error');
                                overlap_error++;
                            } else if (value.min < price_to && price_to < value.max) {
                                $price_to.addClass('vi-wad-error');
                                overlap_error++;
                            }
                        });
                    }
                } else {
                    ranges.forEach(function (value, key) {
                        if (price_from < value.max) {
                            $price_from.addClass('vi-wad-error');
                            overlap_error++;
                        }

                    });
                }
            }
            count++;
        });
        let message = '';
        if (range_error > 0) {
            message += `<li>${vi_wad_admin_settings_params.i18n_error_price_rule_range}</li>`;
        }
        if (overlap_error > 0) {
            message += `<li>${vi_wad_admin_settings_params.i18n_error_price_rule_overlap}</li>`;
        }
        if (message) {
            $message.html(`<div class="vi-ui yellow message"><ul class="list">${message}</ul></div>`);
        }
        console.log(range_error)
        console.log(overlap_error)
        return (range_error + overlap_error + rule_error);
    }

    $('.vi-wad-ali-shipping-not-available-remove').on('change', function () {
        if ($(this).prop('checked')) {
            $('.vi-wad-ali-shipping-not-available-remove-dependency').fadeOut(200);
        } else {
            $('.vi-wad-ali-shipping-not-available-remove-dependency').fadeIn(200);
        }
    }).trigger('change');
    /*Search shipping company*/
    let current_search_company = '';
    $('.vi-wad-shipping-company-search').on('keyup', function () {
        let $search = $(this), search = $search.val().trim().toLowerCase();
        if (search) {
            if (search !== current_search_company) {
                current_search_company = search;
                $('.vi-wad-shipping-company-mask-origin').map(function () {
                    let $term = $(this), term = $term.html().trim().toLowerCase(), $row = $term.closest('tr');
                    if (term.indexOf(search) > -1) {
                        $row.removeClass('vi-wad-hidden');
                    } else {
                        $row.addClass('vi-wad-hidden');
                    }
                })
            }
        } else {
            $('.vi-wad-shipping-company-mask').find('tr').removeClass('vi-wad-hidden');
        }
    });
    let loading_company_mask = false, $progress_company_mask = $('.vi-wad-shipping-company-mask-progress');
    $progress_company_mask.progress('set percent', 1).progress('set label', 'Please wait while shipping companies are being loaded');
    $('.vi-wad-tab-item[data-tab="shipping"]').on('click', function () {
        if (!$(this).hasClass('vi-wad-tab-item-shipping-company-mask-loaded') && !loading_company_mask) {
            loading_company_mask = true;
            get_shipping_company_mask(1, 1);
        }
    });
    if (url.indexOf('#/shipping') > -1) {
        loading_company_mask = true;
        get_shipping_company_mask(1, 1);
    }

    function get_shipping_company_mask(page, max_page) {
        $.ajax({
            url: vi_wad_admin_settings_params.url,
            type: 'POST',
            dataType: 'JSON',
            data: {
                action: 'wad_get_shipping_company_mask',
                _vi_wad_ajax_nonce: _vi_wad_ajax_nonce,
                page: page,
                max_page: max_page,
            },
            success: function (response) {
                if (response.status === 'success') {
                    $progress_company_mask.progress('set percent', parseInt(response.percent));
                    if (page < parseInt(response.page)) {
                        get_shipping_company_mask(response.page, response.max_page);
                    } else if (response.shipping_company_mask) {
                        $('.vi-wad-shipping-company-mask').html(response.shipping_company_mask);
                        $('.vi-wad-tab-item[data-tab="shipping"]').addClass('vi-wad-tab-item-shipping-company-mask-loaded');
                        loading_company_mask = false;
                        $('.vi-wad-tab-content[data-tab="shipping"] .vi-wad-overlay').addClass('vi-wad-hidden');
                    }
                }
            },
            error: function (err) {
                $progress_company_mask.progress('set label', 'An error occurred. Please try again later').progress('set error');
            },
            complete: function () {

            }
        })
    }

    $('.vi-wad-override-keep-product').on('change', function () {
        let $override_find_in_orders = $('.vi-wad-override-find-in-orders').closest('tr');
        if ($(this).prop('checked')) {
            $override_find_in_orders.fadeOut(200);
        } else {
            $override_find_in_orders.fadeIn(200);
        }
    }).trigger('change');

    $('.vi-wad-show-product-video-tab').on('change', function () {
        let $video_full_tab = $('.vi-wad-product-video-full-tab').closest('tr');
        let $video_tab_priority = $('.vi-wad-product-video-tab-priority').closest('tr');
        if ($(this).prop('checked')) {
            $video_full_tab.fadeIn(200);
            $video_tab_priority.fadeIn(200);
        } else {
            $video_full_tab.fadeOut(200);
            $video_tab_priority.fadeOut(200);
        }
    }).trigger('change');
});