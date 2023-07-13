jQuery(document).ready(function ($) {
    'use strict';
    $('.vi-ui.accordion')
        .vi_accordion('refresh');
    $('.vi-ui.checkbox').checkbox();
    $('.vi-ui.dropdown').dropdown({placeholder: ''});
    /**
     * Dependent options
     */
    $('#s2w-download_images').on('change', function () {
        let $dependency = $('#s2w-use_external_image').closest('tr');
        if ($(this).prop('checked')) {
            $dependency.fadeIn(200);
        } else {
            $dependency.fadeOut(200);
        }
    }).trigger('change');
    /*Show API key and secret if access token is empty and vice versa*/
    $('#s2w-access_token').on('change', function (e) {
        toggle_private_apps_fields($(this));
    }).trigger('change');
    $('#s2w-access_token').on('keyup', function (e) {
        toggle_private_apps_fields($(this));
    });

    /**
     * @param $access_token
     */
    function toggle_private_apps_fields($access_token) {
        if ($access_token.val()) {
            $('#s2w-api_key').closest('tr').fadeOut(200);
            $('#s2w-api_secret').closest('tr').fadeOut(200);
        } else {
            $('#s2w-api_key').closest('tr').fadeIn(200);
            $('#s2w-api_secret').closest('tr').fadeIn(200);
        }
    }

    /*Only show product type meta if value of #s2w-product_type_as is "meta"*/
    $('#s2w-product_type_as').on('change', function (e) {
        let $product_type_as = $(this),
            $product_type_meta = $('#s2w-product_type_meta').closest('.vi-ui.input');
        if ($product_type_as.val() === 'meta') {
            $product_type_meta.fadeIn(200);
        } else {
            $product_type_meta.fadeOut(200);
        }
    }).trigger('change');
    /*Only show product vendor meta if value of s2w-product_vendor_as is "meta"*/
    $('#s2w-product_vendor_as').on('change', function (e) {
        let $product_vendor_as = $(this),
            $product_vendor_meta = $('#s2w-product_vendor_meta').closest('.vi-ui.input');
        if ($product_vendor_as.val() === 'meta') {
            $product_vendor_meta.fadeIn(200);
        } else {
            $product_vendor_meta.fadeOut(200);
        }
    }).trigger('change');
    /**
     * Save products options from popup
     */
    $('.s2w-save-products-options').on('click', function (e) {
        let $button = $(this);
        $button.addClass('loading');
        let $saving_overlay = $('.s2w-import-products-options-saving-overlay');
        $saving_overlay.removeClass('s2w-hidden');
        s2w_get_form_data();
        let data = Object.assign({}, settings);
        data.action = 's2w_save_settings_products_options';
        $.ajax({
            url: s2w_params_admin.url,
            type: 'POST',
            dataType: 'JSON',
            data: data,
            success: function (response) {
                total_products = parseInt(response.total_products);
                total_pages = response.total_pages;
                current_import_id = response.current_import_id;
                current_import_product = parseInt(response.current_import_product);
                current_import_page = response.current_import_page;
                $button.removeClass('loading');
                $saving_overlay.addClass('s2w-hidden');
                s2w_options_close('products');
            },
            error: function (err) {
                $button.removeClass('loading');
                $saving_overlay.addClass('s2w-hidden');
                s2w_options_close('products');
            }
        })
    });
    /**
     * Save customers options from popup
     */
    $('.s2w-save-customers-options').on('click', function (e) {
        let $button = $(this);
        $button.addClass('loading');
        let $saving_overlay = $('.s2w-import-customers-options-saving-overlay');
        $saving_overlay.removeClass('s2w-hidden');
        s2w_get_form_data();
        let data = Object.assign({}, settings);
        data.action = 's2w_save_settings_customers_options';
        $.ajax({
            url: s2w_params_admin.url,
            type: 'POST',
            dataType: 'JSON',
            data: data,
            success: function (response) {
                total_customers = parseInt(response.total_customers);
                customers_total_pages = response.customers_total_pages;
                customers_current_import_id = response.customers_current_import_id;
                current_import_order = parseInt(response.current_import_order);
                customers_current_import_page = response.customers_current_import_page;
                $button.removeClass('loading');
                $saving_overlay.addClass('s2w-hidden');
                s2w_options_close('customers');
            },
            error: function (err) {
                $button.removeClass('loading');
                $saving_overlay.addClass('s2w-hidden');
                s2w_options_close('customers');
            }
        })
    });
    /**
     * Handle close button
     */
    $('.s2w-import-options-close').on('click', function (e) {
        let option_name = $(this).data('option_name');
        s2w_options_close(option_name);
        switch (option_name) {
            case'products':
                s2w_products_options_cancel(option_name);
                break;
            case 'orders':
                s2w_orders_options_cancel();
                break;
            case 'coupons':
                s2w_coupons_options_cancel();
                break;
            case 'customers':
                s2w_customers_options_cancel();
                break;
        }
    });
    /**
     * Close popup when clicking on overlay
     */
    $('.s2w-import-options-overlay').on('click', function (e) {
        $(this).closest('.s2w-import-options-modal').find('.s2w-import-options-close').click();
    });
    /**
     * Handle shortcut to import options
     */
    $('.s2w-import-options-shortcut').on('click', function (e) {
        let option_name = $(this).data('option_name');
        if (!$('.s2w-accordion').find('.content').eq(0).hasClass('active')) {
            e.preventDefault();
            $(`.s2w-import-${option_name}-options-modal`).removeClass('s2w-hidden');
            s2w_disable_scroll();
            $(`.s2w-import-${option_name}-options-main`).append($(`.s2w-import-${option_name}-options-content`));
        } else {
            let $accordion = $(`.title[data-option_name="${option_name}"]`);
            if (!$accordion.hasClass('active')) {
                setTimeout(function () {
                    $accordion.vi_accordion('open');
                }, 100)
            }
        }
    });

    /**
     * Restore fields values and setting variable if closing product options popup without clicking the Save button
     */
    function s2w_products_options_cancel() {
        $('#s2w-product_status').val(settings.product_status);
        $('#s2w-variable_sku').val(settings.variable_sku);
        $('#s2w-download_images').prop('checked', (settings.download_images == 1)).trigger('change');
        $('#s2w-disable_background_process').prop('checked', (settings.disable_background_process == 1));
        $('#s2w-download_description_images').prop('checked', (settings.download_description_images == 1));
        $('#s2w-keep_slug').prop('checked', (settings.keep_slug == 1));
        $('#s2w-global_attributes').prop('checked', (settings.global_attributes == 1));
        $('#s2w-products_per_request').val(settings.products_per_request);
        $('#s2w-product_import_sequence').val(settings.product_import_sequence);

        $('#s2w-product_since_id').val(settings.product_since_id);
        $('#s2w-product_product_type').val(settings.product_product_type);
        $('#s2w-product_vendor').val(settings.product_vendor);
        $('#s2w-product_type_as').val(settings.product_type_as);
        $('#s2w-product_type_meta').val(settings.product_type_meta);
        $('#s2w-product_vendor_as').val(settings.product_vendor_as);
        $('#s2w-product_vendor_meta').val(settings.product_vendor_meta);
        $('#s2w-product_barcode_meta').val(settings.product_barcode_meta);
        $('#s2w-product_collection_id').val(settings.product_collection_id);
        $('#s2w-product_created_at_min').val(settings.product_created_at_min);
        $('#s2w-product_created_at_max').val(settings.product_created_at_max);
        $('#s2w-product_published_at_min').val(settings.product_published_at_min);
        $('#s2w-product_published_at_max').val(settings.product_published_at_max);
        if (settings.product_categories) {
            $('#s2w-product_categories').val(settings.product_categories).trigger('change');
        } else {
            $('#s2w-product_categories').val(null).trigger('change');
        }
        $('.s2w-product_status_mapping').map(function () {
            let $select = $(this).find('select').eq(0);
            $select.dropdown('set selected', settings.product_status_mapping[$select.data('from_status')]);
        });
    }

    /**
     * Import order options
     */
    $('.s2w-save-orders-options').on('click', function (e) {
        let $button = $(this);
        $button.addClass('loading');
        let $saving_overlay = $('.s2w-import-orders-options-saving-overlay');
        $saving_overlay.removeClass('s2w-hidden');
        s2w_get_form_data();
        let data = Object.assign({}, settings);
        data.action = 's2w_save_settings_orders_options';
        $.ajax({
            url: s2w_params_admin.url,
            type: 'POST',
            dataType: 'JSON',
            data: data,
            success: function (response) {
                total_orders = parseInt(response.total_orders);
                orders_total_pages = response.orders_total_pages;
                orders_current_import_id = response.orders_current_import_id;
                current_import_order = parseInt(response.current_import_order);
                orders_current_import_page = response.orders_current_import_page;
                $button.removeClass('loading');
                $saving_overlay.addClass('s2w-hidden');
                s2w_options_close('orders');
            },
            error: function (err) {
                $button.removeClass('loading');
                $saving_overlay.addClass('s2w-hidden');
                s2w_options_close('orders');
            }
        })
    });

    /**
     * Fill data back when closing the popup without saving changes
     */
    function s2w_orders_options_cancel() {
        $('#s2w-orders_per_request').val(settings.orders_per_request);
        $('#s2w-order_import_sequence').val(settings.order_import_sequence);
        $('#s2w-order_since_id').val(settings.order_since_id);
        $('#s2w-order_processed_at_min').val(settings.order_processed_at_min);
        $('#s2w-order_financial_status').val(settings.order_financial_status);
        $('#s2w-order_fulfillment_status').val(settings.order_fulfillment_status);
        $('#s2w-order_processed_at_max').val(settings.order_processed_at_max);
        $('.s2w-order_status_mapping').map(function () {
            let $select = $(this).find('select').eq(0);
            $select.dropdown('set selected', settings.order_status_mapping[$select.data('from_status')]);
        });
    }

    /**
     * Save coupons options
     */
    $('.s2w-save-coupons-options').on('click', function (e) {
        let $button = $(this);
        $button.addClass('loading');
        let $saving_overlay = $('.s2w-import-coupons-options-saving-overlay');
        $saving_overlay.removeClass('s2w-hidden');
        s2w_get_form_data();
        let data = Object.assign({}, settings);
        data.action = 's2w_save_settings_coupons_options';
        $.ajax({
            url: s2w_params_admin.url,
            type: 'POST',
            dataType: 'JSON',
            data: data,
            success: function (response) {
                total_coupons = parseInt(response.total_coupons);
                coupons_total_pages = response.coupons_total_pages;
                coupons_current_import_id = response.coupons_current_import_id;
                current_import_coupon = parseInt(response.current_import_coupon);
                coupons_current_import_page = response.coupons_current_import_page;
                $button.removeClass('loading');
                $saving_overlay.addClass('s2w-hidden');
                s2w_options_close('coupons');
            },
            error: function (err) {
                $button.removeClass('loading');
                $saving_overlay.addClass('s2w-hidden');
                s2w_options_close('coupons');
            }
        })
    });

    /**
     * Fill data back when closing the popup without saving changes
     */
    function s2w_coupons_options_cancel() {
        $('#s2w-coupons_per_request').val(settings.coupons_per_request);
        $('#s2w-coupon_starts_at_min').val(settings.coupon_starts_at_min);
        $('#s2w-coupon_starts_at_max').val(settings.coupon_starts_at_max);
        $('#s2w-coupon_ends_at_min').val(settings.coupon_ends_at_min);
        $('#s2w-coupon_ends_at_max').val(settings.coupon_ends_at_max);
        $('#s2w-coupon_zero_times_used').prop('checked', (settings.coupon_zero_times_used == 1));
    }

    /**
     * Fill data back when closing the popup without saving changes
     */
    function s2w_customers_options_cancel() {
        $('#s2w-customers_per_request').val(settings.customers_per_request);
        $('#s2w-customers_role').val(settings.customers_role);
        $('#s2w-customers_with_purchases_only').prop('checked', (settings.customers_with_purchases_only == 1));
        $('#s2w-update_existing_customers').prop('checked', (settings.update_existing_customers == 1));
    }

    /**
     * Close the opening import options popup when esc key is pressed
     */
    $(document).on('keydown', function (e) {
        let $container = $('.s2w-import-options-modal');
        if (e.keyCode === 27) {
            for (let i = 0; i < $container.length; i++) {
                if (!$container.eq(i).hasClass('s2w-hidden')) {
                    $container.eq(i).find('.s2w-import-options-close').click();
                    break;
                }
            }
        }
    });

    /**
     * Start Get download key
     */
    jQuery('.villatheme-get-key-button').one('click', function (e) {
        let v_button = jQuery(this);
        v_button.addClass('loading');
        let item_id = v_button.data('id');
        let app_url = v_button.data('href');
        let main_domain = window.location.hostname;
        main_domain = main_domain.toLowerCase();
        let popup_frame;
        e.preventDefault();
        let download_url = v_button.attr('data-download');
        popup_frame = window.open(app_url, "myWindow", "width=380,height=600");
        window.addEventListener('message', function (event) {
            /*Callback when data send from child popup*/
            let obj = JSON.parse(event.data);
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
    /*End get download key*/
    /**
     * Bulk enabling elements
     */
    $('.s2w-import-element-enable-bulk').on('change', function () {
        $('.s2w-import-element-enable').prop('checked', $(this).prop('checked'));
    });
    /**
     * Adjust domain when changing
     */
    $('#s2w-domain').on('change', function () {
        let domain = $(this).val();
        domain = domain.replace(/https:\/\//g, '');
        domain = domain.replace(/\//g, '');

        $(this).val(domain);
    });
    /**
     * Adjust variable sku field when changing
     */
    $('#s2w-variable_sku').on('change', function () {
        let variable_sku = $(this).val();
        variable_sku = variable_sku.replace(/\s/g, '');

        $(this).val(variable_sku);
    });
    let selected_elements = [];
    let progress_bars = {};

    /**
     * Elements enabled to import
     */
    function get_selected_elements() {
        selected_elements = [];
        progress_bars = [];
        $('.s2w-import-element-enable').map(function () {
            if ($(this).prop('checked')) {
                let element_name = $(this).data('element_name');
                selected_elements.push(element_name);
                progress_bars[element_name] = $('#s2w-' + element_name.replace('_', '-') + '-progress');
            }
        });
    }

    /**
     *
     * @param element
     */
    function s2w_import_element_call(element) {
        switch (element) {
            case 'store_settings':
                s2w_import_store_settings();
                break;
            case 'shipping_zones':
                s2w_import_shipping_zones();
                break;
            case 'taxes':
                s2w_import_taxes();
                break;
            case 'pages':
                s2w_import_spages();
                break;
            case 'blogs':
                s2w_import_blogs();
                break;
            case 'coupons':
                s2w_import_coupons();
                break;
            case 'customers':
                s2w_import_customers();
                break;
            case 'products':
                s2w_import_products();
                break;
            case 'product_categories':
                s2w_import_product_categories();
                break;
            case 'orders':
                s2w_import_orders();
                break;
        }
    }

    /**
     * Get an element from queue to import
     */
    function s2w_import_element() {
        if (selected_elements.length) {
            let element = selected_elements.shift();
            progress_bars[element].progress('set label', s2w_params_admin.message_importing);
            progress_bars[element].progress('set percent', 0);
            progress_bars[element].progress('set active');
            s2w_import_element_call(element);
        } else {
            s2w_unlock_buttons();
            import_active = false;
            $('.s2w-sync').removeClass('loading');
            setTimeout(function () {
                alert(s2w_params_admin.i18n_import_completed);
            }, 400);
        }
    }

    let total_orders = parseInt(s2w_params_admin.total_orders),
        orders_total_pages = s2w_params_admin.orders_total_pages,
        orders_current_import_id = s2w_params_admin.orders_current_import_id,
        current_import_order = parseInt(s2w_params_admin.current_import_order),
        orders_current_import_page = s2w_params_admin.orders_current_import_page;

    let total_customers = parseInt(s2w_params_admin.total_customers),
        customers_total_pages = s2w_params_admin.customers_total_pages,
        customers_current_import_id = s2w_params_admin.customers_current_import_id,
        current_import_customer = parseInt(s2w_params_admin.current_import_customer),
        customers_current_import_page = s2w_params_admin.customers_current_import_page;
    let total_spages = parseInt(s2w_params_admin.total_spages),
        spages_total_pages = s2w_params_admin.spages_total_pages,
        spages_current_import_id = s2w_params_admin.spages_current_import_id,
        current_import_spage = parseInt(s2w_params_admin.current_import_spage),
        spages_current_import_page = s2w_params_admin.spages_current_import_page;
    let total_coupons = parseInt(s2w_params_admin.total_coupons),
        coupons_total_pages = s2w_params_admin.coupons_total_pages,
        coupons_current_import_id = s2w_params_admin.coupons_current_import_id,
        current_import_coupon = parseInt(s2w_params_admin.current_import_coupon),
        coupons_current_import_page = s2w_params_admin.coupons_current_import_page;

    let total_products = parseInt(s2w_params_admin.total_products),
        total_pages = s2w_params_admin.total_pages,
        current_import_id = s2w_params_admin.current_import_id,
        current_import_product = parseInt(s2w_params_admin.current_import_product),
        current_import_page = s2w_params_admin.current_import_page,

        imported_elements = s2w_params_admin.imported_elements,
        elements_titles = s2w_params_admin.elements_titles;
    let settings = s2w_params_admin.settings;
    s2w_get_form_data();
    ajax_search_select2();
    let save_active = false,
        products_import_complete = false,
        orders_import_complete = false,
        customers_import_complete = false,
        spages_import_complete = false,
        coupons_import_complete = false,
        error_log = '',
        import_active = false;
    let warning,
        warning_empty_store = s2w_params_admin.warning_empty_store,
        warning_empty_access_token = s2w_params_admin.warning_empty_access_token,
        warning_empty_api_key = s2w_params_admin.warning_empty_api_key,
        warning_empty_api_secret = s2w_params_admin.warning_empty_api_secret;

    /**
     * Update settings variable from fields
     */
    function s2w_get_form_data() {
        for (let i in settings) {
            if (settings.hasOwnProperty(i)) {
                let $option = $(`#s2w-${i}`);
                if ($option.length > 0) {
                    if ($option.attr('type') === 'checkbox') {
                        settings[i] = $option.prop('checked') ? 1 : 0;
                    } else {
                        if ($option.val() !== null) {
                            settings[i] = $option.val();
                        } else {
                            settings[i] = '';
                        }
                    }
                }
            }
        }
        $('.s2w-order_status_mapping').map(function () {
            let $select = $(this).find('select').eq(0);
            settings['order_status_mapping'][$select.data('from_status')] = $select.val();
        });
        $('.s2w-capabilities').map(function () {
            let $select = $(this).find('select').eq(0);
            settings['capabilities'][$select.data('capability_key')] = $select.val();
        });
        $('.s2w-product_status_mapping').map(function () {
            let $select = $(this).find('select').eq(0);
            settings['product_status_mapping'][$select.data('from_status')] = $select.val();
        });
        let order_tag_to_status = {from: [], to: [], priority: []};
        $('.s2w-order_tag_to_status_from').map(function () {
            let $from = $(this), $row = $from.closest('tr');
            order_tag_to_status['from'].push($from.val());
            order_tag_to_status['to'].push($row.find('select[name="s2w_order_tag_to_status[to][]"]').val());
            order_tag_to_status['priority'].push($row.find('.s2w-order_tag_to_status_priority').val());
        });
        settings['order_tag_to_status'] = order_tag_to_status;
        settings['_s2w_nonce'] = $('#_s2w_nonce').val();
        settings['auto_update_key'] = $('#auto-update-key').val();
    }

    /**
     * Validate data before saving
     * @returns {boolean}
     */
    function s2w_validate_data() {
        warning = '';
        let validate = true;
        if (s2w_params_admin.validate_api) {
            if (!$('#s2w-domain').val()) {
                validate = false;
                warning += warning_empty_store;
            }
            if (!$('#s2w-access_token').val()) {
                if (!$('#s2w-api_key').val() && !$('#s2w-api_secret').val()) {
                    validate = false;
                    warning += warning_empty_access_token;
                } else {
                    if (!$('#s2w-api_key').val()) {
                        validate = false;
                        warning += warning_empty_api_key;
                    }
                    if (!$('#s2w-api_secret').val()) {
                        validate = false;
                        warning += warning_empty_api_secret;
                    }
                }
            }
        }
        return validate;
    }

    /**
     * Confirm before deleting cache/import history
     */
    $('.s2w-delete-history').on('click', function () {
        if (!confirm(s2w_params_admin.i18n_delete_history_warning)) {
            return false;
        }
    });
    /**
     * Save settings button
     */
    $('.s2w-save').on('click', function () {
        if (!s2w_validate_data()) {
            alert(warning);
            return;
        }
        if (import_active || save_active) {
            return;
        }
        save_active = true;
        s2w_get_form_data();
        let $button = $(this);
        let data = Object.assign({}, settings);
        data.action = 's2w_save_settings';
        data.step = 'save';

        $button.addClass('loading');
        $.ajax({
            url: s2w_params_admin.url,
            type: 'POST',
            dataType: 'JSON',
            data: data,
            success: function (response) {
                total_products = parseInt(response.total_products);
                total_pages = response.total_pages;
                current_import_id = response.current_import_id;
                current_import_product = parseInt(response.current_import_product);
                current_import_page = response.current_import_page;

                total_orders = parseInt(response.total_orders);
                orders_total_pages = response.orders_total_pages;
                orders_current_import_id = response.orders_current_import_id;
                current_import_order = parseInt(response.current_import_order);
                orders_current_import_page = response.orders_current_import_page;

                total_customers = parseInt(response.total_customers);
                customers_total_pages = response.customers_total_pages;
                customers_current_import_id = response.customers_current_import_id;
                current_import_customer = parseInt(response.current_import_customer);
                customers_current_import_page = response.customers_current_import_page;

                total_coupons = parseInt(response.total_coupons);
                coupons_total_pages = response.coupons_total_pages;
                coupons_current_import_id = response.coupons_current_import_id;
                current_import_coupon = parseInt(response.current_import_coupon);
                coupons_current_import_page = response.coupons_current_import_page;

                imported_elements = response.imported_elements;
                save_active = false;
                $button.removeClass('loading');
                if (response.api_error) {
                    alert(response.api_error);
                    $('.s2w-import-container').hide();
                    $('.s2w-error-warning').show();
                } else if (response.validate) {
                    $('.s2w-import-element-enable').map(function () {
                        let element = $(this).data('element_name');

                        if (imported_elements[element] == 1) {
                            $(this).prop('checked', false);
                            $('.s2w-import-' + element.replace(/_/g, '-') + '-check-icon').addClass('green').removeClass('grey');
                        } else {
                            $(this).prop('checked', true);
                            $('.s2w-import-' + element.replace(/_/g, '-') + '-check-icon').addClass('grey').removeClass('green');
                        }
                    });
                    $('.s2w-import-container').show();
                    $('.s2w-error-warning').hide();
                    $('.s2w-accordion>.title').removeClass('active');
                    $('.s2w-accordion>.content').removeClass('active');
                }
            },
            error: function (err) {
                save_active = false;
                $button.removeClass('loading');
            }
        })
    });
    /**
     * Main import button
     */
    $('.s2w-sync').on('click', function () {
        if (!s2w_validate_data()) {
            alert(warning);
            return;
        }
        get_selected_elements();
        if (selected_elements.length == 0) {
            alert(s2w_params_admin.i18n_required_data);
            return;
        } else {
            let imported = [];
            for (let i in selected_elements) {
                let element = selected_elements[i];
                if (imported_elements[element] == 1) {
                    imported.push(elements_titles[element]);
                }
            }
            if (imported.length > 0) {
                if (!confirm(s2w_params_admin.i18n_reimport_warning.replace('{imported_elements}', imported.join(', ')))) {
                    return;
                }
            }
        }
        let $button = $(this);
        if (import_active || save_active) {
            return;
        }
        $('.s2w-import-progress').css({'visibility': 'hidden'});
        for (let element in progress_bars) {
            progress_bars[element].css({'visibility': 'visible'});
            progress_bars[element].progress('set label', s2w_params_admin.message_waiting).progress('set percent', 0);
        }
        import_active = true;
        $button.addClass('loading');
        s2w_lock_buttons();
        s2w_jump_to_import();
        s2w_import_element();
    });

    /**
     * Ajax handle for importing products
     */
    function s2w_import_products() {
        $.ajax({
            url: s2w_params_admin.url,
            type: 'POST',
            dataType: 'JSON',
            data: {
                action: 's2w_import_shopify_to_woocommerce',
                _s2w_nonce: settings['_s2w_nonce'],
                step: 'products',
                total_products: total_products,
                total_pages: total_pages,
                current_import_id: current_import_id,
                current_import_page: current_import_page,
                current_import_product: current_import_product,
                error_log: error_log,
            },
            success: function (response) {
                if (response.status === 'retry') {
                    total_products = parseInt(response.total_products);
                    total_pages = parseInt(response.total_pages);
                    current_import_id = response.current_import_id;
                    current_import_page = parseInt(response.current_import_page);
                    current_import_product = parseInt(response.current_import_product);
                    s2w_import_products();
                } else {
                    error_log = '';
                    progress_bars['products'].progress('set label', response.message.toString());
                    if (response.status === 'error') {
                        if (response.code === 'no_data' || parseInt(response.code) >= 400) {
                            products_import_complete = true;
                            progress_bars['products'].progress('set error');
                            s2w_import_element();
                        } else {
                            maybe_retry('products');
                        }
                    } else {
                        current_import_id = response.current_import_id;
                        current_import_page = parseInt(response.current_import_page);
                        current_import_product = parseInt(response.current_import_product);
                        let imported_products = parseInt(response.imported_products);
                        let percent = Math.ceil(imported_products * 100 / total_products);
                        if (percent > 100) {
                            percent = 100;
                        }
                        progress_bars['products'].progress('set percent', percent);
                        if (response.logs) {
                            $('.s2w-logs').append(response.logs).scrollTop($('.s2w-logs')[0].scrollHeight);
                        }
                        if (response.status === 'success') {
                            if (current_import_page <= total_pages) {
                                s2w_import_products();
                            } else {
                                products_import_complete = true;
                            }
                        } else {
                            products_import_complete = true;
                        }
                        if (products_import_complete) {
                            s2w_mark_imported('products');
                            progress_bars['products'].progress('complete');
                            s2w_import_element();
                        }
                    }
                }
            },
            error: function (err) {
                error_log = 'error ' + err.status + ' : ' + err.statusText;
                progress_bars['products'].progress('set error');
                if (!products_import_complete) {
                    selected_elements.unshift('products');
                }
                setTimeout(function () {
                    s2w_import_element();
                }, 3000);
            }
        })
    }

    let retry_count_interval, retry_timeout, $retry_ele;

    /**
     * Maybe retry when there's an error
     *
     * @param element
     * @param retry_countdown
     */
    function maybe_retry(element, retry_countdown = 10) {
        $retry_ele = $(`.s2w-import-error-actions[data-option_name="${element}"]`);
        let $retry_countdown = $retry_ele.find('.s2w-import-error-retry-count');
        $retry_countdown.html(retry_countdown + 's');
        $retry_ele.removeClass('s2w-hidden');
        retry_count_interval = setInterval(function () {
            retry_countdown--;
            $retry_countdown.html(retry_countdown + 's');
        }, 1000);
        retry_timeout = setTimeout(function () {
            progress_bars[element].progress('set label', s2w_params_admin.message_importing);
            progress_bars[element].progress('set percent', 0);
            progress_bars[element].progress('set active');
            s2w_import_element_call(element);
            clearInterval(retry_count_interval);
            $retry_ele.addClass('s2w-hidden');
        }, retry_countdown * 1000)
    }

    /**
     * Cancel retry to import the next element from queue
     */
    $(document).on('click', '.s2w-import-error-actions-cancel', function () {
        if ($retry_ele) {
            progress_bars[$retry_ele.data('option_name')].progress('remove active');
            if (retry_count_interval) {
                clearInterval(retry_count_interval)
            }
            if (retry_timeout) {
                clearTimeout(retry_timeout)
            }
            $retry_ele.addClass('s2w-hidden');
            setTimeout(function () {
                s2w_import_element();
            }, 100)
        }
    });
    let categories_current_page = 0;
    let total_categories = 0;

    /**
     * Import categories
     */
    function s2w_import_product_categories() {
        $.ajax({
            url: s2w_params_admin.url,
            type: 'POST',
            dataType: 'JSON',
            data: {
                action: 's2w_import_shopify_to_woocommerce',
                _s2w_nonce: settings['_s2w_nonce'],
                step: 'product_categories',
                categories_current_page: categories_current_page,
                total_categories: total_categories,
            },
            success: function (response) {
                if (response.status === 'retry') {
                    categories_current_page = parseInt(response.categories_current_page);
                    total_categories = parseInt(response.total_categories);
                    s2w_import_product_categories();
                } else {
                    if (response.hasOwnProperty('message') && response.message) {
                        progress_bars['product_categories'].progress('set label', response.message.toString());
                    }
                    if (response.status === 'success') {
                        categories_current_page = parseInt(response.categories_current_page);
                        total_categories = parseInt(response.total_categories);
                        let percent = categories_current_page * 100 / total_categories;
                        progress_bars['product_categories'].progress('set percent', percent);
                        s2w_import_product_categories();
                    } else if (response.status === 'error') {
                        progress_bars['product_categories'].progress('set error');
                        maybe_retry('product_categories', 5);
                    } else {
                        categories_current_page = parseInt(response.categories_current_page);
                        total_categories = parseInt(response.total_categories);
                        progress_bars['product_categories'].progress('complete');
                        s2w_mark_imported('product_categories');
                        s2w_import_element();
                    }
                }
            },
            error: function (err) {
                progress_bars['product_categories'].progress('set error');
                setTimeout(function () {
                    s2w_import_element();
                }, 3000)
            },
        });

    }

    let blogs_current_page = 0;
    let total_blogs = 0;

    /**
     * Import blogs
     */
    function s2w_import_blogs() {
        $.ajax({
            url: s2w_params_admin.url,
            type: 'POST',
            dataType: 'JSON',
            data: {
                action: 's2w_import_shopify_to_woocommerce',
                _s2w_nonce: settings['_s2w_nonce'],
                step: 'blogs',
                blogs_current_page: blogs_current_page,
                total_blogs: total_blogs,
            },
            success: function (response) {
                if (response.status === 'retry') {
                    blogs_current_page = parseInt(response.blogs_current_page);
                    total_blogs = parseInt(response.total_blogs);
                    s2w_import_blogs();
                } else {
                    if (response.hasOwnProperty('message') && response.message) {
                        progress_bars['blogs'].progress('set label', response.message.toString());
                    }
                    if (response.status === 'success') {
                        blogs_current_page = parseInt(response.blogs_current_page);
                        total_blogs = parseInt(response.total_blogs);
                        let percent = blogs_current_page * 100 / total_blogs;
                        progress_bars['blogs'].progress('set percent', percent);
                        s2w_import_blogs();
                    } else if (response.status === 'error') {
                        if (response.code === 'no_data' || parseInt(response.code) >= 400) {
                            progress_bars['blogs'].progress('set error');
                            s2w_import_element();
                        } else {
                            maybe_retry('blogs', 5);
                        }
                    } else {
                        blogs_current_page = parseInt(response.blogs_current_page);
                        total_blogs = parseInt(response.total_blogs);
                        progress_bars['blogs'].progress('complete');
                        s2w_mark_imported('blogs');
                        s2w_import_element();
                    }
                    if (response.hasOwnProperty('logs') && response.logs) {
                        $('.s2w-logs').append(response.logs).scrollTop($('.s2w-logs')[0].scrollHeight);
                    }
                }
            },
            error: function (err) {
                progress_bars['blogs'].progress('set error');
                setTimeout(function () {
                    s2w_import_element();
                }, 5000)
            },
        });

    }

    /**
     * Import orders
     */
    function s2w_import_orders() {
        $.ajax({
            url: s2w_params_admin.url,
            type: 'POST',
            dataType: 'JSON',
            data: {
                action: 's2w_import_shopify_to_woocommerce',
                _s2w_nonce: settings['_s2w_nonce'],
                step: 'orders',
                total_orders: total_orders,
                orders_total_pages: orders_total_pages,
                orders_current_import_id: orders_current_import_id,
                orders_current_import_page: orders_current_import_page,
                current_import_order: current_import_order,
                error_log: error_log,
            },
            success: function (response) {
                if (response.status === 'retry') {
                    total_orders = parseInt(response.total_orders);
                    orders_total_pages = parseInt(response.orders_total_pages);
                    orders_current_import_id = response.orders_current_import_id;
                    orders_current_import_page = parseInt(response.orders_current_import_page);
                    current_import_order = parseInt(response.current_import_order);
                    s2w_import_orders();
                } else {
                    error_log = '';
                    progress_bars['orders'].progress('set label', response.message.toString());
                    if (response.status === 'error') {
                        if (response.code === 'no_data' || parseInt(response.code) >= 400) {
                            orders_import_complete = true;
                            progress_bars['orders'].progress('set error');
                            s2w_import_element();
                        } else {
                            maybe_retry('orders');
                        }
                    } else {
                        orders_current_import_id = response.orders_current_import_id;
                        orders_current_import_page = parseInt(response.orders_current_import_page);
                        current_import_order = parseInt(response.current_import_order);
                        let imported_orders = parseInt(response.imported_orders);
                        let percent = Math.ceil(imported_orders * 100 / total_orders);
                        if (percent > 100) {
                            percent = 100;
                        }
                        progress_bars['orders'].progress('set percent', percent);
                        if (response.logs) {
                            $('.s2w-logs').append(response.logs).scrollTop($('.s2w-logs')[0].scrollHeight);
                        }
                        if (response.status === 'success') {
                            if (orders_current_import_page <= orders_total_pages) {
                                s2w_import_orders();
                            } else {
                                orders_import_complete = true;
                            }
                        } else {
                            orders_import_complete = true;
                        }
                        if (orders_import_complete) {
                            progress_bars['orders'].progress('complete');
                            s2w_mark_imported('orders');
                            s2w_import_element();
                        }
                    }
                }
            },
            error: function (err) {
                error_log = 'error ' + err.status + ' : ' + err.statusText;
                progress_bars['orders'].progress('set error');
                if (!orders_import_complete) {
                    selected_elements.unshift('orders');
                }
                setTimeout(function () {
                    s2w_import_element();
                }, 9000)
            }
        })
    }

    /**
     * Import customers
     */
    function s2w_import_customers() {
        $.ajax({
            url: s2w_params_admin.url,
            type: 'POST',
            dataType: 'JSON',
            data: {
                action: 's2w_import_shopify_to_woocommerce',
                _s2w_nonce: settings['_s2w_nonce'],
                step: 'customers',
                total_customers: total_customers,
                customers_total_pages: customers_total_pages,
                customers_current_import_id: customers_current_import_id,
                customers_current_import_page: customers_current_import_page,
                current_import_customer: current_import_customer,
                error_log: error_log,
            },
            success: function (response) {
                if (response.status === 'retry') {
                    total_customers = parseInt(response.total_customers);
                    customers_total_pages = parseInt(response.customers_total_pages);
                    customers_current_import_id = response.customers_current_import_id;
                    customers_current_import_page = parseInt(response.customers_current_import_page);
                    current_import_customer = parseInt(response.current_import_customer);
                    s2w_import_customers();
                } else {
                    progress_bars['customers'].progress('set label', response.message.toString());
                    error_log = '';
                    if (response.status === 'error') {
                        if (response.code === 'no_data' || parseInt(response.code) >= 400) {
                            customers_import_complete = true;
                            progress_bars['customers'].progress('set error');
                            s2w_import_element();
                        } else {
                            maybe_retry('customers', 5);
                        }
                    } else {
                        customers_current_import_id = response.customers_current_import_id;
                        customers_current_import_page = parseInt(response.customers_current_import_page);
                        current_import_customer = parseInt(response.current_import_customer);
                        let imported_customers = parseInt(response.imported_customers);
                        let percent = Math.ceil(imported_customers * 100 / total_customers);
                        if (percent > 100) {
                            percent = 100;
                        }
                        progress_bars['customers'].progress('set percent', percent);
                        if (response.logs) {
                            $('.s2w-logs').append(response.logs).scrollTop($('.s2w-logs')[0].scrollHeight);
                        }
                        if (response.status === 'success') {
                            if (customers_current_import_page <= customers_total_pages) {
                                s2w_import_customers();
                            } else {
                                customers_import_complete = true;
                            }
                        } else {
                            customers_import_complete = true;
                        }
                        if (customers_import_complete) {
                            progress_bars['customers'].progress('complete');
                            s2w_mark_imported('customers');
                            s2w_import_element();
                        }
                    }
                }
            },
            error: function (err) {
                error_log = 'error ' + err.status + ' : ' + err.statusText;
                progress_bars['customers'].progress('set error');
                if (!customers_import_complete) {
                    selected_elements.unshift('customers');
                }
                setTimeout(function () {
                    s2w_import_element();
                }, 3000)
            }
        })
    }

    /**
     * Import pages
     */
    function s2w_import_spages() {
        $.ajax({
            url: s2w_params_admin.url,
            type: 'POST',
            dataType: 'JSON',
            data: {
                action: 's2w_import_shopify_to_woocommerce',
                _s2w_nonce: settings['_s2w_nonce'],
                step: 'pages',
                total_spages: total_spages,
                spages_total_pages: spages_total_pages,
                spages_current_import_id: spages_current_import_id,
                spages_current_import_page: spages_current_import_page,
                current_import_spage: current_import_spage,
                error_log: error_log,
            },
            success: function (response) {
                if (response.status === 'retry') {
                    total_spages = parseInt(response.total_spages);
                    spages_total_pages = parseInt(response.spages_total_pages);
                    spages_current_import_id = response.spages_current_import_id;
                    spages_current_import_page = parseInt(response.spages_current_import_page);
                    current_import_spage = parseInt(response.current_import_spage);
                    s2w_import_spages();
                } else {
                    progress_bars['pages'].progress('set label', response.message.toString());
                    error_log = '';
                    if (response.status === 'error') {
                        if (response.code === 'no_data' || parseInt(response.code) >= 400) {
                            spages_import_complete = true;
                            progress_bars['pages'].progress('set error');
                            s2w_import_element();
                        } else {
                            maybe_retry('pages', 5);
                        }
                    } else {
                        spages_current_import_id = response.spages_current_import_id;
                        spages_current_import_page = parseInt(response.spages_current_import_page);
                        current_import_spage = parseInt(response.current_import_spage);
                        let imported_spages = parseInt(response.imported_spages);
                        let percent = Math.ceil(imported_spages * 100 / total_spages);
                        if (percent > 100) {
                            percent = 100;
                        }
                        progress_bars['pages'].progress('set percent', percent);
                        if (response.logs) {
                            $('.s2w-logs').append(response.logs).scrollTop($('.s2w-logs')[0].scrollHeight);
                        }
                        if (response.status === 'success') {
                            if (spages_current_import_page <= spages_total_pages) {
                                s2w_import_spages();
                            } else {
                                spages_import_complete = true;
                            }
                        } else {
                            spages_import_complete = true;
                        }
                        if (spages_import_complete) {
                            progress_bars['pages'].progress('complete');
                            s2w_mark_imported('pages');
                            s2w_import_element();
                        }
                    }
                }
            },
            error: function (err) {
                error_log = 'error ' + err.status + ' : ' + err.statusText;
                progress_bars['pages'].progress('set error');
                if (!spages_import_complete) {
                    selected_elements.unshift('pages');
                }
                setTimeout(function () {
                    s2w_import_element();
                }, 3000)
            }
        })
    }

    /**
     * Import coupons
     */
    function s2w_import_coupons() {
        $.ajax({
            url: s2w_params_admin.url,
            type: 'POST',
            dataType: 'JSON',
            data: {
                action: 's2w_import_shopify_to_woocommerce',
                _s2w_nonce: settings['_s2w_nonce'],
                step: 'coupons',
                total_coupons: total_coupons,
                coupons_total_pages: coupons_total_pages,
                coupons_current_import_id: coupons_current_import_id,
                coupons_current_import_page: coupons_current_import_page,
                current_import_coupon: current_import_coupon,
                error_log: error_log,
            },
            success: function (response) {
                if (response.status === 'retry') {
                    total_coupons = parseInt(response.total_coupons);
                    coupons_total_pages = parseInt(response.coupons_total_pages);
                    coupons_current_import_id = response.coupons_current_import_id;
                    coupons_current_import_page = parseInt(response.coupons_current_import_page);
                    current_import_coupon = parseInt(response.current_import_coupon);
                    s2w_import_coupons();
                } else {
                    progress_bars['coupons'].progress('set label', response.message.toString());
                    error_log = '';
                    if (response.status === 'error') {
                        if (response.code === 'no_data' || parseInt(response.code) >= 400) {
                            coupons_import_complete = true;
                            progress_bars['coupons'].progress('set error');
                            s2w_import_element();
                        } else {
                            maybe_retry('coupons');
                        }
                    } else {
                        coupons_current_import_id = response.coupons_current_import_id;
                        coupons_current_import_page = parseInt(response.coupons_current_import_page);
                        current_import_coupon = parseInt(response.current_import_coupon);
                        let imported_coupons = parseInt(response.imported_coupons);
                        let percent = Math.ceil(imported_coupons * 100 / total_coupons);
                        if (percent > 100) {
                            percent = 100;
                        }
                        progress_bars['coupons'].progress('set percent', percent);
                        if (response.logs) {
                            $('.s2w-logs').append(response.logs).scrollTop($('.s2w-logs')[0].scrollHeight);
                        }
                        if (response.status === 'success') {
                            if (coupons_current_import_page <= coupons_total_pages) {
                                s2w_import_coupons();
                            } else {
                                coupons_import_complete = true;
                            }
                        } else {
                            coupons_import_complete = true;
                        }
                        if (coupons_import_complete) {
                            progress_bars['coupons'].progress('complete');
                            s2w_mark_imported('coupons');
                            s2w_import_element();
                        }
                    }
                }
            },
            error: function (err) {
                error_log = 'error ' + err.status + ' : ' + err.statusText;
                progress_bars['coupons'].progress('set error');
                if (!coupons_import_complete) {
                    selected_elements.unshift('coupons');
                }
                setTimeout(function () {
                    s2w_import_element();
                }, 3000)
            }
        })
    }

    /**
     * Import store settings
     */
    function s2w_import_store_settings() {
        $.ajax({
            url: s2w_params_admin.url,
            type: 'POST',
            dataType: 'JSON',
            data: {
                action: 's2w_import_shopify_to_woocommerce',
                _s2w_nonce: settings['_s2w_nonce'],
                step: 'store_settings',
                error_log: error_log,
            },
            success: function (response) {
                error_log = '';
                progress_bars['store_settings'].progress('set label', response.message.toString());
                if (response.status !== 'error') {
                    s2w_mark_imported('store_settings');
                    progress_bars['store_settings'].progress('complete');
                } else {
                    progress_bars['store_settings'].progress('set error');
                }
            },
            error: function (err) {
                error_log = 'error ' + err.status + ' : ' + err.statusText;
                progress_bars['store_settings'].progress('set label', error_log);
                progress_bars['store_settings'].progress('set error');
            },
            complete: function () {
                s2w_import_element();
            }
        })
    }

    /**
     * Import shipping zones
     */
    function s2w_import_shipping_zones() {
        $.ajax({
            url: s2w_params_admin.url,
            type: 'POST',
            dataType: 'JSON',
            data: {
                action: 's2w_import_shopify_to_woocommerce',
                _s2w_nonce: settings['_s2w_nonce'],
                step: 'shipping_zones',
                error_log: error_log,
            },
            success: function (response) {
                error_log = '';
                progress_bars['shipping_zones'].progress('set label', response.message.toString());
                if (response.status !== 'error') {
                    progress_bars['shipping_zones'].progress('complete');
                    s2w_mark_imported('shipping_zones');
                } else {
                    progress_bars['shipping_zones'].progress('set error');
                }
            },
            error: function (err) {
                error_log = 'error ' + err.status + ' : ' + err.statusText;
                progress_bars['shipping_zones'].progress('set label', error_log);
                progress_bars['shipping_zones'].progress('set error');
            },
            complete: function () {
                s2w_import_element();
            }
        })
    }

    /**
     * Import taxes
     */
    function s2w_import_taxes() {
        $.ajax({
            url: s2w_params_admin.url,
            type: 'POST',
            dataType: 'JSON',
            data: {
                action: 's2w_import_shopify_to_woocommerce',
                _s2w_nonce: settings['_s2w_nonce'],
                step: 'taxes',
                error_log: error_log,
            },
            success: function (response) {
                error_log = '';
                progress_bars['taxes'].progress('set label', response.message.toString());
                if (response.status !== 'error') {
                    progress_bars['taxes'].progress('complete');
                    s2w_mark_imported('taxes');
                } else {
                    progress_bars['taxes'].progress('set error');
                }
            },
            error: function (err) {
                error_log = 'error ' + err.status + ' : ' + err.statusText;
                progress_bars['taxes'].progress('set label', error_log);
                progress_bars['taxes'].progress('set error');
            },
            complete: function () {
                s2w_import_element();
            }
        })
    }

    /**
     * Lock import button when Import is running
     */
    function s2w_lock_buttons() {
        $('.s2w-import-element-enable').prop('readonly', true);
    }

    /**
     * Unlock import button after import stops
     */
    function s2w_unlock_buttons() {
        $('.s2w-import-element-enable').prop('readonly', false);
    }

    /**
     * Mark an element as imported after import completed
     *
     * @param name
     */
    function s2w_mark_imported(name) {
        imported_elements[name] = 1;
        $('.s2w-import-' + name.replace(/_/g, '-') + '-check-icon').removeClass('grey').addClass('green');
    }

    /**
     * Jump to import screen after clicking the Import button
     */
    function s2w_jump_to_import() {
        $('html').prop('scrollTop', $('.s2w-import-container').prop('offsetTop'))
    }

    /**
     * Close import options
     *
     * @param option_name
     */
    function s2w_options_close(option_name) {
        $(`.s2w-import-${option_name}-options-modal`).addClass('s2w-hidden');
        s2w_enable_scroll();
        $(`#s2w-import-${option_name}-options`).append($(`.s2w-import-${option_name}-options-content`));
    }

    /**
     * Ajax search categories or users
     */
    function ajax_search_select2() {
        $('.search-category').select2({
            closeOnSelect: false,
            placeholder: s2w_params_admin.i18n_category_search_placeholder,
            ajax: {
                url: "admin-ajax.php?action=s2w_search_cate&_s2w_nonce=" + settings['_s2w_nonce'],
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
            },
            minimumInputLength: 2
        });
        $('.search-user').select2({
            closeOnSelect: true,
            placeholder: s2w_params_admin.i18n_user_search_placeholder,
            allowClear: true,
            ajax: {
                url: "admin-ajax.php?action=s2w_search_user&_s2w_nonce=" + settings['_s2w_nonce'],
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
            },
            minimumInputLength: 2
        });
    }
});
