jQuery(document).ready(function ($) {
    'use strict';
    $('.vi-ui.accordion').vi_accordion('refresh');

    $('.ui-sortable').sortable({
        placeholder: 'wot-place-holder',
    });
    $('.vi-ui.dropdown').dropdown({fullTextSearch: true, forceSelection: false});
    $('.woo-orders-tracking-export-datepicker').datepicker({dateFormat: 'yy-mm-dd'});
    $('#woo-orders-tracking-export-filename').on('change', function () {
        let file_name = $(this).val();
        file_name = file_name.replace(/\//g, '');
        file_name = file_name.replace(/\s/g, '');

        $(this).val(file_name);
    });
    $(document).on('click', '.woo-orders-tracking-export-order-button-reset-settings', function () {
        if (confirm(vi_wot_admin_export.reset_filter_message)) {
            $('#woo-orders-tracking-export-filename').val('orders-%y-%m-%d_%h-%i-%s.csv');
            $('#woo-orders-tracking-export-filter-order-date').val('date_created').trigger('change');
            $('#woo-orders-tracking-export-filter-order-date-range-from').val(null);
            $('#woo-orders-tracking-export-filter-order-date-range-to').val(null);
            $('#woo-orders-tracking-export-filter-order-status').dropdown('set exactly', []);
            $('#woo-orders-tracking-export-filter-order-billing-address-data').val(null).trigger('change');
            $('#woo-orders-tracking-export-filter-order-shipping-address-data').val(null).trigger('change');
            $('#woo-orders-tracking-export-filter-order-payment-method').dropdown('set exactly', []);
            $('#woo-orders-tracking-export-filter-order-shipping-method').dropdown('set exactly', []);
        }
    });

    /**
     * Set condition for billing address
     */
    if ($('#woo-orders-tracking-export-filter-order-billing-address').val() === '_billing_country') {

        $('.woo-orders-tracking-export-filter-order-billing-country-wrap').removeClass('woo-orders-tracking-export-hidden').addClass('woo-orders-tracking-export-show');
        $('.woo-orders-tracking-export-filter-order-billing-city-wrap').removeClass('woo-orders-tracking-export-show').addClass('woo-orders-tracking-export-hidden');
    } else {
        $('.woo-orders-tracking-export-filter-order-billing-city-wrap').removeClass('woo-orders-tracking-export-hidden').addClass('woo-orders-tracking-export-show');
        $('.woo-orders-tracking-export-filter-order-billing-country-wrap').removeClass('woo-orders-tracking-export-show').addClass('woo-orders-tracking-export-hidden');
    }
    $('#woo-orders-tracking-export-filter-order-billing-address').on('change', function () {
        if ($('#woo-orders-tracking-export-filter-order-billing-address').val() === '_billing_country') {

            $('.woo-orders-tracking-export-filter-order-billing-country-wrap').removeClass('woo-orders-tracking-export-hidden').addClass('woo-orders-tracking-export-show');
            $('.woo-orders-tracking-export-filter-order-billing-city-wrap').removeClass('woo-orders-tracking-export-show').addClass('woo-orders-tracking-export-hidden');
        } else {
            $('.woo-orders-tracking-export-filter-order-billing-city-wrap').removeClass('woo-orders-tracking-export-hidden').addClass('woo-orders-tracking-export-show');
            $('.woo-orders-tracking-export-filter-order-billing-country-wrap').removeClass('woo-orders-tracking-export-show').addClass('woo-orders-tracking-export-hidden');
        }

    });
    $(".woo-orders-tracking-export-filter-order-billing-city,.woo-orders-tracking-export-filter-order-billing-country").select2({
        placeholder: "Please fill in your order address",
    });

    $('#woo-orders-tracking-export-filter-order-billing-address-data').select2();

    $('.woo-orders-tracking-export-filter-order-billing-list').find('input.select2-search__field').prop('readonly', 'readonly');

    $('.woo-orders-tracking-export-filter-order-billing-addition').on('click', function () {
        let billing_address_id = $('#woo-orders-tracking-export-filter-order-billing-address').val();
        let $billing_country_id = $('#woo-orders-tracking-export-filter-order-billing-country');
        let billing_country_id = $billing_country_id.val();
        if (!billing_country_id) {
            $billing_country_id.focus();
        }
        let billing_city = $('#woo-orders-tracking-export-filter-order-billing-city').val();
        let billing_address_data = $('#woo-orders-tracking-export-filter-order-billing-address-data').val() || [];
        let billing_country_name = $('#woo-orders-tracking-export-filter-order-billing-country option[value="' + billing_country_id + '"]').text();
        let append_id = '', append_text = '';
        if (billing_address_id === '_billing_country') {
            if (!billing_country_id) {
                return false;
            }
            append_id = billing_address_id + $('#woo-orders-tracking-export-filter-order-billing-condition').val() + billing_country_id;
            append_text = 'Country ' + $('#woo-orders-tracking-export-filter-order-billing-condition').val() + ' ' + billing_country_name;

        } else if (billing_address_id === '_billing_city') {
            if (!billing_city) {
                return false;
            }
            append_id = billing_address_id + $('#woo-orders-tracking-export-filter-order-billing-condition').val() + billing_city;
            append_text = 'City ' + $('#woo-orders-tracking-export-filter-order-billing-condition').val() + ' ' + billing_city;

        }

        if ($('#woo-orders-tracking-export-filter-order-billing-address-data option[value="' + append_id + '"').length > 0) {
            if ($.inArray(append_id, billing_address_data) === -1) {
                billing_address_data.push(append_id);
            }
            $('#woo-orders-tracking-export-filter-order-billing-address-data').val(billing_address_data).trigger('change');
            return false;
        }
        $('#woo-orders-tracking-export-filter-order-billing-address-data').append('<option value="' + append_id + '"  >' + append_text + ' </option>');

        billing_address_data.push(append_id);
        $('#woo-orders-tracking-export-filter-order-billing-address-data').val(billing_address_data).trigger('change');
    });

    /*
    set condition for shipping address
     */
    if ($('#woo-orders-tracking-export-filter-order-shipping-address').val() === '_shipping_country') {

        $('.woo-orders-tracking-export-filter-order-shipping-country-wrap').removeClass('woo-orders-tracking-export-hidden').addClass('woo-orders-tracking-export-show');
        $('.woo-orders-tracking-export-filter-order-shipping-city-wrap').removeClass('woo-orders-tracking-export-show').addClass('woo-orders-tracking-export-hidden');
    } else {
        $('.woo-orders-tracking-export-filter-order-shipping-city-wrap').removeClass('woo-orders-tracking-export-hidden').addClass('woo-orders-tracking-export-show');
        $('.woo-orders-tracking-export-filter-order-shipping-country-wrap').removeClass('woo-orders-tracking-export-show').addClass('woo-orders-tracking-export-hidden');
    }
    $('#woo-orders-tracking-export-filter-order-shipping-address').on('change', function () {
        if ($('#woo-orders-tracking-export-filter-order-shipping-address').val() === '_shipping_country') {

            $('.woo-orders-tracking-export-filter-order-shipping-country-wrap').removeClass('woo-orders-tracking-export-hidden').addClass('woo-orders-tracking-export-show');
            $('.woo-orders-tracking-export-filter-order-shipping-city-wrap').removeClass('woo-orders-tracking-export-show').addClass('woo-orders-tracking-export-hidden');
        } else {
            $('.woo-orders-tracking-export-filter-order-shipping-city-wrap').removeClass('woo-orders-tracking-export-hidden').addClass('woo-orders-tracking-export-show');
            $('.woo-orders-tracking-export-filter-order-shipping-country-wrap').removeClass('woo-orders-tracking-export-show').addClass('woo-orders-tracking-export-hidden');
        }

    });
    $(".woo-orders-tracking-export-filter-order-shipping-city,.woo-orders-tracking-export-filter-order-shipping-country").select2({
        placeholder: "Please fill in your order address",
    });
    $('#woo-orders-tracking-export-filter-order-shipping-address-data').select2();
    $('.woo-orders-tracking-export-filter-order-shipping-list').find('input.select2-search__field').prop('readonly', 'readonly');
    $('.woo-orders-tracking-export-filter-order-shipping-addition').on('click', function () {
        let shipping_address_id = $('#woo-orders-tracking-export-filter-order-shipping-address').val();
        let $shipping_country_id = $('#woo-orders-tracking-export-filter-order-shipping-country');
        let shipping_country_id = $shipping_country_id.val();
        if (!shipping_country_id) {
            $shipping_country_id.focus();
            return;
        }
        let shipping_city = $('#woo-orders-tracking-export-filter-order-shipping-city').val();
        let shipping_address_data = $('#woo-orders-tracking-export-filter-order-shipping-address-data').val() || [];
        let shipping_country_name = $('#woo-orders-tracking-export-filter-order-shipping-country option[value="' + shipping_country_id + '"]').text();
        let append_id = '', append_text = '';
        if (shipping_address_id === '_shipping_country') {
            if (!shipping_country_id) {
                return false;
            }
            append_id = shipping_address_id + $('#woo-orders-tracking-export-filter-order-shipping-condition').val() + shipping_country_id;
            append_text = 'Country ' + $('#woo-orders-tracking-export-filter-order-shipping-condition').val() + ' ' + shipping_country_name;

        } else {
            if (!shipping_city) {
                return false;
            }
            append_id = shipping_address_id + $('#woo-orders-tracking-export-filter-order-shipping-condition').val() + shipping_city;
            append_text = 'City ' + $('#woo-orders-tracking-export-filter-order-shipping-condition').val() + ' ' + shipping_city;

        }

        if ($('#woo-orders-tracking-export-filter-order-shipping-address-data option[value="' + append_id + '"').length > 0) {
            if ($.inArray(append_id, shipping_address_data) === -1) {
                shipping_address_data.push(append_id);
            }
            $('#woo-orders-tracking-export-filter-order-shipping-address-data').val(shipping_address_data).trigger('change');
            return false;
        }
        $('#woo-orders-tracking-export-filter-order-shipping-address-data').append('<option value="' + append_id + '"  >' + append_text + ' </option>');

        shipping_address_data.push(append_id);
        $('#woo-orders-tracking-export-filter-order-shipping-address-data').val(shipping_address_data).trigger('change');
    });

    //set file name
    $('#woo-orders-tracking-export-filename').on('keyup', function () {
        let text = $(this).val().replace(/(\\|]|{|}|\/|\*|\<|\>)/g, '');
        setTimeout(function () {
            $('#woo-orders-tracking-export-filename').val(text);
        }, 10);
    });
    //set date range to export
    $('#woo-orders-tracking-export-filter-order-date-range-to').on('change', function () {
        if ($('#woo-orders-tracking-export-filter-order-date-range-from').val()) {
            let date_from = new Date($('#woo-orders-tracking-export-filter-order-date-range-from').val());
            let date_to = new Date($('#woo-orders-tracking-export-filter-order-date-range-to').val());
            if (date_from.getTime() > date_to.getTime()) {
                alert(vi_wot_admin_export.date_range_error);
                $(this).val(null);
            }
        }
    });
    $('#woo-orders-tracking-export-filter-order-date-range-from').on('change', function () {
        let date_from = new Date($(this).val());
        let date_now = new Date($.now());
        let date_to = new Date($('#woo-orders-tracking-export-filter-order-date-range-to').val());
        if (date_from.getTime() > date_now.getTime()) {
            alert(vi_wot_admin_export.date_from_error);
            $(this).val(null);
        }
        if (date_from.getTime() > date_to.getTime()) {
            alert(vi_wot_admin_export.date_range_error);
            $(this).val(null);
        }
    });

    function rearrange_fields() {
        let fields = [];
        /*rearrange fields order to be the same as input*/
        $('.woo-orders-tracking-export-select-fields').find('a.ui.label').map(function () {
            fields.push($(this).data('value'));
        });
        return fields;
    }

    /**
     * Export orders preview
     */
    $('.woo-orders-tracking-export-order-button-preview').on('click', function () {
        let $button = $(this);
        let export_settings = $('#vi_wot_export').serializeJSON();
        export_settings['woo-orders-tracking-export']['set-fields'] = rearrange_fields();
        let data = {
            action: 'vi_wot_export_preview',
            export_settings: JSON.stringify(export_settings),
        };
        $button.addClass('loading');
        $.ajax({
            url: vi_wot_admin_export.ajax_url,
            type: 'post',
            dataType: 'json',
            data: data,
            cache: false,
            beforeSend: function () {
                $('.woo-orders-tracking-export-preview').removeClass('segment').html(null);
            },
            error: function (err) {
            },
            success: function (response) {
                if (response.status === 'error') {
                    alert(response.message);
                }
                if (response.status === 'success') {
                    $('.woo-orders-tracking-export-preview').addClass('segment').html(response.preview);
                }
            },
            complete: function () {
                $button.removeClass('loading');
            }
        });
    });
    /**
     * Save filters
     */
    $('.woo-orders-tracking-export-order-button-save-settings').on('click', function () {
        let $button = $(this);
        let export_settings = $('#vi_wot_export').serializeJSON();
        export_settings['woo-orders-tracking-export']['set-fields'] = rearrange_fields();
        if (!$button.hasClass('loading')) {
            $.ajax({
                url: vi_wot_admin_export.ajax_url,
                type: 'post',
                dataType: 'json',
                data: {
                    action: 'vi_wot_save_filter_settings',
                    export_settings: JSON.stringify(export_settings),
                },
                beforeSend: function () {
                    $button.addClass('loading');
                },
                error: function (err) {
                },
                success: function (response) {
                    villatheme_admin_show_message(response.message, response.status, '', false, 3000);
                },
                complete: function () {
                    $button.removeClass('loading');
                }
            });
        }
    });
    /**
     * Make export fields sortable
     */
    $('.woo-orders-tracking-export-select-fields').sortable({
        containment: 'parent',
        items: 'a.ui.label',
        forcePlaceholderSize: true,
    });
    /**
     * Keep fields order before exporting
     */
    $('#vi_wot_export').on('submit', function () {
        $('input[name="woo-orders-tracking-export[set-fields]"]').val(JSON.stringify(rearrange_fields()));
    });
});