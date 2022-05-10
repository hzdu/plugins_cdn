jQuery(document).ready(function ($) {
    'use strict';
    $('.vi-ui.accordion').vi_accordion();
    jQuery('.vi-ui.tabular.menu .item').vi_tab({
        history: true,
        historyType: 'hash'
    });

    /*Init JS input*/
    jQuery('.vi-ui.checkbox').checkbox();
    jQuery('select.vi-ui.dropdown').not('.vi-wmc-checkout-by-payment-method,.vi-wmc-bot-currency').dropdown();
    jQuery('.vi-wmc-checkout-by-payment-method,.vi-wmc-bot-currency').dropdown({placeholder: ''});
    jQuery('.select2').select2();
    /*Select all and Remove all countries in Currency by country*/
    jQuery('.wmc-select-all-countries').on('click', function () {
        var selectedItems = [];
        var allOptions = jQuery(this).closest('tr').find('select');
        allOptions.find('option').each(function () {
            jQuery(this).attr('selected', true);
        });
        allOptions.trigger("change");
    });

    jQuery('.wmc-remove-all-countries').on('click', function () {
        if (confirm("Would you want to remove all countries?")) {
            var selectedItems = [];
            var allOptions = jQuery(this).closest('tr').find('select');
            allOptions.find('option').each(function () {
                jQuery(this).removeAttr('selected', true);
            });
            allOptions.trigger("change");
        }
    });

    /*Save Submit button*/
    jQuery('.woocommerce-multi-currency form').on('submit', function () {
        let $currencies = jQuery('.wmc-currency-options .wmc-currency-data'), hidden = 0, currencies = [],
            duplicated = [],
            custom_symbols = [],
            duplicated_symbol = [];
        $currencies.map(function () {
            if (jQuery(this).find('select[name="woo_multi_currency_params[currency_hidden][]"]').val() === '1') {
                hidden++;
            }
        });
        if (hidden === $currencies.length) {
            alert('You cannot set all currencies as hidden');
            return false;
        }
        jQuery('.wmc-currency-option-select').map(function () {
            let currency = jQuery(this).val();
            if (currency) {
                if (currencies.indexOf(currency) > -1) {
                    if (duplicated.indexOf(currency) < 0) {
                        duplicated.push(currency);
                    }
                } else {
                    currencies.push(currency);
                }
            }
        });
        if (duplicated.length > 0) {
            alert('You have duplicated currencies: ' + duplicated.join(', '));
            return false;
        }
        jQuery('.wmc-currency-custom-symbol').map(function () {
            let custom_symbol = jQuery(this).val();
            if (custom_symbol) {
                if (custom_symbols.indexOf(custom_symbol) > -1) {
                    if (duplicated_symbol.indexOf(custom_symbol) < 0) {
                        duplicated_symbol.push(custom_symbol);
                    }
                } else {
                    custom_symbols.push(custom_symbol);
                }
            }
        });

        if (duplicated_symbol.length > 0) {
            if (!confirm(`Some currencies have the same custom symbol(${duplicated_symbol.join(', ')}), do you want to continue?`)) {
                return false;
            }
        }
        jQuery(this).find('.wmc-save-settings-container .button').addClass('loading');
    });
    jQuery('.select2-multiple').select2({
        width: '100%' // need to override the changed default
    });
    /*Color picker*/
    jQuery('.color-picker').iris({
        change: function (event, ui) {
            jQuery(this).parent().find('.color-picker').css({backgroundColor: ui.color.toString()});
            var ele = jQuery(this).data('ele');
            if (ele == 'highlight') {
                jQuery('#message-purchased').find('a').css({'color': ui.color.toString()});
            } else if (ele == 'textcolor') {
                jQuery('#message-purchased').css({'color': ui.color.toString()});
            } else {
                jQuery('#message-purchased').css({backgroundColor: ui.color.toString()});
            }
        },
        hide: true,
        border: true
    }).click(function () {
        jQuery('.iris-picker').hide();
        jQuery(this).closest('td').find('.iris-picker').show();
    });

    jQuery('body').click(function () {
        jQuery('.iris-picker').hide();
    });
    jQuery('.color-picker').click(function (event) {
        event.stopPropagation();
    });
    /*Update all rates*/
    jQuery('.wmc-update-rates').on('click', function () {
        var original_currency = jQuery('.wmc-currency-data input[name="woo_multi_currency_params[currency_default]"]:checked').val();
        var other_currencies = [];
        jQuery('.wmc-currency-options').find('input[name="woo_multi_currency_params[currency_default]"]').each(function () {
            if (original_currency != jQuery(this).val()) {
                other_currencies.push(jQuery(this).val());
            }
        });
        jQuery(this).addClass('loading');
        exchange_rate(original_currency, other_currencies);
    });

    /*Process Currency Options*/
    remove_currency();

    function insert_currency() {
        jQuery('.vi-ui.checkbox').unbind();
        jQuery('.vi-ui.checkbox').checkbox();

        jQuery('.wmc-add-currency').unbind();
        jQuery('.wmc-add-currency').on('click', function () {
            jQuery('.wmc-currency-data').last().find('select.select2').select2('destroy');
            var new_row = jQuery('.wmc-currency-data').last().clone();
            jQuery('.wmc-currency-data').last().find('select.select2').select2();
            new_row.find('input[name="woo_multi_currency_params[currency_default]"]').attr('checked', false);
            new_row.find('input[name="woo_multi_currency_params[currency_custom][]"]').val('');
            jQuery(new_row).appendTo('.wmc-currency-options tbody');
            remove_currency();
            jQuery('.wmc-currency-data').last().find('select.select2').select2().change();

        });

        jQuery('select[name="woo_multi_currency_params[currency][]"]').on('change', function () {
            let $currency = $(this), currency = $currency.val(), $tr = $currency.closest('tr'),
                currency_symbol = $currency.find(':selected').data('currency_symbol');
            $tr.find('input[name="woo_multi_currency_params[currency_default]"]').val(currency);
            let $position = $tr.find('select[name="woo_multi_currency_params[currency_pos][]"]'),
                old_currency_symbol = $position.data('currency_symbol');
            $position.find('option').map(function () {
                let $option = $(this), option = $option.html();
                $option.html(option.replace(old_currency_symbol, currency_symbol));
            });
            $position.data('currency_symbol', currency_symbol);
            $tr.attr('class', 'wmc-currency-data ' + currency + '-currency');
        });

        jQuery('.wmc-currency-options tbody').sortable();

        /*Change currency default*/
        jQuery('input[name="woo_multi_currency_params[currency_default]"]').unbind('change');
        jQuery('input[name="woo_multi_currency_params[currency_default]"]').on('change', function () {
            jQuery('.wmc-currency-options').find('input[name="woo_multi_currency_params[currency_rate][]"]').removeAttr('readonly');
            jQuery('.wmc-currency-options').find('input[name="woo_multi_currency_params[currency_rate_fee][]"]').removeAttr('readonly');
            jQuery(this).closest('tr').find('input[name="woo_multi_currency_params[currency_rate][]"]').val(1).attr('readonly', true);
            jQuery(this).closest('tr').find('input[name="woo_multi_currency_params[currency_rate_fee][]"]').val(0).attr('readonly', true);
            var original_currency = jQuery(this).val();
            var other_currencies = [];
            jQuery('.wmc-currency-options').find('input[name="woo_multi_currency_params[currency_default]"]').each(function () {
                if (original_currency != jQuery(this).val()) {
                    other_currencies.push(jQuery(this).val());
                }
            });
            exchange_rate(original_currency, other_currencies);
        });

        /*Update single rate*/
        jQuery('.wmc-update-rate').on('click', function () {

            var original_currency = jQuery('.wmc-currency-data input[name="woo_multi_currency_params[currency_default]"]:checked').val();
            var other_currencies = jQuery(this).closest('tr').find('input[name="woo_multi_currency_params[currency_default]"]').val();

            if (original_currency != other_currencies) {
                jQuery(this).addClass('loading');
                exchange_rate(original_currency, other_currencies);
            }
        });

    }

    function remove_currency() {
        jQuery('.wmc-remove-currency').unbind();
        insert_currency();
        jQuery('.wmc-remove-currency').on('click', function () {
            if (confirm("Would you want to remove this currency?")) {
                if (jQuery('.wmc-currency-options tbody tr').length > 1) {
                    var tr = jQuery(this).closest('tr').remove();
                }
            } else {

            }
        });
    }

    function exchange_rate(original_currency, other_currencies) {
        if (original_currency && other_currencies) {
            var str_data = 'original_price=' + original_currency + '&other_currencies=' + other_currencies + '&_ajax_nonce=' + wmcParams._ajax_nonce;

            jQuery.ajax({
                type: 'POST',
                data: 'action=woomulticurrency_exchange&' + str_data,
                url: ajaxurl,
                success: function (obj) {
                    jQuery.each(obj, function (currency, rate) {
                        if (jQuery('tr.' + currency + '-currency').length > 0) {
                            jQuery('tr.' + currency + '-currency').find('input[name="woo_multi_currency_params[currency_rate][]"]').val(rate);
                        }
                        jQuery('.woocommerce-multi-currency').find('.loading').removeClass('loading');
                    });
                },
                error: function (html) {
                }
            })
        } else {
            return false;
        }
    }

    /*Checkout currency*/
    jQuery('input[name="woo_multi_currency_params[checkout_currency]"]').on('change', function () {
        jQuery('select[name="woo_multi_currency_params[checkout_currency_args][]"]').removeAttr('disabled');
        jQuery(this).closest('tr').find('select[name="woo_multi_currency_params[checkout_currency_args][]"]').attr('disabled', 'disabled').find('option').removeAttr('selected').last().attr('selected', true);
    });
    /*
     * Start Get download key
     */
    jQuery('.villatheme-get-key-button').one('click', function (e) {
        let v_button = jQuery(this);
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
            let obj = jQuery.parseJSON(event.data);
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
                    jQuery('.villatheme-autoupdate-key-field').val(update_key);
                }
            }
            v_button.removeClass('loading');
            if (check_key) {
                jQuery('<p><strong>' + message + '</strong></p>').insertAfter(".villatheme-autoupdate-key-field");
                jQuery(v_button).closest('form').submit();
            } else {
                jQuery('<p><strong> Your key is not found. Please contact support@villatheme.com </strong></p>').insertAfter(".villatheme-autoupdate-key-field");
            }
        });
    });
    /**
     * End get download key
     */

    jQuery('.wmc-status-to-yes').on('click', function () {
        let listSelect = jQuery('select[name="woo_multi_currency_params[checkout_currency_args][]"]');
        for (let i = 0; i < listSelect.length; i++) {
            let value = listSelect[i][1].value;
            jQuery(listSelect[i]).val(value).trigger('change');
        }
    });

    jQuery('.wmc-status-to-no').on('click', function () {
        let listSelect = jQuery('select[name="woo_multi_currency_params[checkout_currency_args][]"]');
        for (let i = 0; i < listSelect.length; i++) {
            jQuery(listSelect[i]).val(0).trigger('change');
        }
    });

    //Price rule
    $('body').on('click', '.wmc-remove-price-rule', function () {
        if (confirm('Do you really want to remove this rule?')) {
            $(this).closest('tr').remove();
        }
    });

    $('.wmc-add-price-rule').on('click', function () {
        let currencyOpt = '';
        for (let i = 0; i < wmcParams.currencies.length; i++) {
            currencyOpt += `<option value="${wmcParams.currencies[i]}">${wmcParams.currencies[i]}</option>`;
        }
        let row = $('.wmc-price-rule-rows tr').last(),
            index = row.data('index') !== undefined ? row.data('index') + 1 : 0;
        let rowHtml = `<tr data-index="${index}">
                    <td>
                        <input type="text" required name="woo_multi_currency_params[beauty_price_from][]" class="wmc-beauty-from">
                    </td>
                    <td>
                        <input type="text" required name="woo_multi_currency_params[beauty_price_to][]" class="wmc-beauty-to">
                    </td>
                    <td>
                        <input type="text" name="woo_multi_currency_params[beauty_price_value][]" class="wmc-beauty-value">
                    </td>
                    <td>
                       <select name="woo_multi_currency_params[beauty_price_part][]" class="wmc-beauty-part">
                            <option value="integer">${wmcParams.i18n_integer}</option>
                            <option value="fraction">${wmcParams.i18n_fraction}</option>
                        </select>
                    </td>
                    <td>
                        <input type="hidden" name="woo_multi_currency_params[beauty_price_round_up][]" value="" class="wmc-beauty-round-up">
                        <input type="checkbox" class="wmc-beauty-round-up-check">
                    </td>
                    <td>
                       <input type="hidden" name="woo_multi_currency_params[beauty_price_currencies][${index}][]">
                       <select multiple class="wmc-select-2" name="woo_multi_currency_params[beauty_price_currencies][${index}][]" >
                           ${currencyOpt}
                       </select>
                    </td>
                    <td>
                        <div class="vi-ui small icon red button wmc-remove-price-rule"><i class="trash icon"></i></div>
                    </td>
                </tr>`;

        row.after(rowHtml);
        $('.wmc-select-2').select2();
    });

    $('.wmc-select-2').select2();

    $('body').on('change', '.wmc-beauty-from, .wmc-beauty-to, .wmc-beauty-value, .wmc-beauty-part', function () {
        let row = $(this).closest('tr');
        let inFrac = row.find('.wmc-beauty-part').val(),
            fromEl = row.find('.wmc-beauty-from'),
            toEl = row.find('.wmc-beauty-to'),
            valueEl = row.find('.wmc-beauty-value'),
            messageBox = $('.wmc-beauty-price-message'),
            errClass = 'wmc-border-red';

        messageBox.removeClass('message').text('');
        fromEl.removeClass(errClass);
        toEl.removeClass(errClass);
        valueEl.removeClass(errClass);
        valueEl.attr('required', false);

        if (inFrac === 'fraction') {
            let message = '';
            if (fromEl.val() > 1) {
                fromEl.addClass(errClass);
                message = 'Please enter value smaller than 1';
            }
            if (toEl.val() > 1) {
                toEl.addClass(errClass);
                message = 'Please enter value equal or smaller than 1';
            }
            if (valueEl.val() >= 1) {
                valueEl.addClass(errClass);
                message = 'Please enter value smaller than 1';
            }

            if (message) {
                messageBox.addClass('message').text(message);
            }
        } else if (inFrac === 'integer') {
            valueEl.attr('required', true);
            let fromLen = fromEl.val().length, toLen = toEl.val().length, valueLen = valueEl.val().length;
            if (fromLen !== toLen || fromLen !== valueLen || toLen !== valueLen) {
                fromEl.addClass(errClass);
                toEl.addClass(errClass);
                valueEl.addClass(errClass);
                messageBox.addClass('message').text('Please enter value with the same length');
            }
        }
    });

    $('body').on('keypress', 'input[type=text]', function (e) {
        if (e.keyCode === 13 || e.keyCode === 10) {
            e.preventDefault();
            e.stopImmediatePropagation();
        }
    });


    const positionSticky = function (val) {
        switch (val) {
            case 'top-left':
                $('.wmc-distance.top, .wmc-distance.left, .wmc-distance-row').show();
                $('.wmc-distance.bottom, .wmc-distance.right').hide();
                break;
            case 'top-right':
                $('.wmc-distance.top, .wmc-distance.right, .wmc-distance-row').show();
                $('.wmc-distance.bottom, .wmc-distance.left').hide();
                break;
            case 'bottom-right':
                $('.wmc-distance.bottom, .wmc-distance.right, .wmc-distance-row').show();
                $('.wmc-distance.top, .wmc-distance.left').hide();
                break;
            case 'bottom-left':
                $('.wmc-distance.bottom, .wmc-distance.left, .wmc-distance-row').show();
                $('.wmc-distance.top, .wmc-distance.right').hide();
                break;
            default:
                $('.wmc-distance-row').hide();
        }
    };

    positionSticky($('.wmc-position-to-sticky').val());

    $('.wmc-position-to-sticky').on('change', function () {
        positionSticky($(this).val());
    });

    $('select[name="woo_multi_currency_params[auto_detect]"]').on('change', function () {
        if ($(this).val() === '2') {
            $('.wmc-order-preview-row').show();
        } else {
            $('.wmc-order-preview-row').hide();
        }
    });

    $(document).on('click', '.wmc-beauty-round-up-check', function () {
        let $check = $(this), $round_up = $check.closest('td').find('.wmc-beauty-round-up');
        if ($check.prop('checked')) {
            $round_up.val('1');
        } else {
            $round_up.val('');
        }
    });
    $('input[name="woo_multi_currency_params[enable_switch_currency_by_js]"]').on('change', function () {
        if ($(this).prop('checked')) {
            $('.wmc-switch-currency-by-js-dependency').fadeIn(200);
        } else {
            $('.wmc-switch-currency-by-js-dependency').fadeOut(200);
        }
    }).trigger('change');
    $('select[name="woo_multi_currency_params[billing_shipping_currency]"]').on('change', function () {
        let $sync_currency = $('input[name="woo_multi_currency_params[sync_checkout_currency]"]').closest('tr');
        if ($(this).val()==='0') {
            $sync_currency.fadeOut(200);
        } else {
            $sync_currency.fadeIn(200);
        }
    }).trigger('change');
    if ($('.vi-wmc-orders-missing-currency-info-message').length > 0) {
        $.ajax({
            type: 'GET',
            data: {
                action: 'wmc_fix_orders_missing_currency_info',
                check_orders: 1,
                _ajax_nonce: wmcParams._ajax_nonce,
            },
            url: ajaxurl,
            success: function (response) {
                if (parseInt(response.result) > 0) {
                    $('.vi-wmc-orders-missing-currency-info-message').fadeIn(200);
                } else {
                    $('.vi-wmc-orders-missing-currency-info-message').remove();
                }
            },
            error: function () {
            }
        })
    }
    let $progress = $('.vi-wmc-progress'), total;
    $('.vi-wmc-orders-missing-currency-info-fix').on('click', function () {
        let $button = $(this);
        if (!$button.hasClass('loading')) {
            total = 0;
            $button.addClass('loading');
            $progress.fadeIn(100);
            $progress.progress('set percent', 0);
            fix_orders($button);
        }
    });

    function fix_orders($button) {
        $.ajax({
            type: 'POST',
            data: {
                action: 'wmc_fix_orders_missing_currency_info',
                fix_orders: 1,
                total: total,
                _ajax_nonce: wmcParams._ajax_nonce,
            },
            url: ajaxurl,
            success: function (response) {
                if (parseInt(response.result) > 1) {
                    if (!total) {
                        total = parseInt(response.result);
                    }
                    $progress.progress('set percent', 100 * (total - response.result + 1) / total);
                    fix_orders($button);
                } else {
                    $progress.progress('complete');
                    $button.removeClass('loading');
                    $('.vi-wmc-orders-missing-currency-info-message').fadeOut(200);
                }
            },
            error: function () {
                $progress.progress('set error');
                $button.removeClass('loading');
                alert('Error');
            }
        })
    }
});
