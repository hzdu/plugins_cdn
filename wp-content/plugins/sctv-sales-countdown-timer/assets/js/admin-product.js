jQuery(document).ready(function () {
    'use strict';
    jQuery('#woocommerce-product-data').on('click', '.sale_schedule', function () {
        var $wrap = jQuery(this).parent().parent().parent();
        jQuery(this).hide();
        $wrap.find('.cancel_sale_schedule').show();
        $wrap.find('.sale_price_dates_field').show();
        return false;
    });
    jQuery('#woocommerce-product-data').on('click', '.cancel_sale_schedule', function () {
        var $wrap = jQuery(this).parent().parent().parent();
        jQuery(this).hide();
        $wrap.find('.sale_schedule').show();
        $wrap.find('.sale_price_dates_field').hide();
        $wrap.find('.sale_price_dates_field').find('input').val('');
        return false;
    });
    jQuery('#woocommerce-product-data').on('click', '._woo_ctr_progress_bar_initial', function () {
        let goal = jQuery(this).closest('.woo-sctr-countdown-timer-admin-product').find('._woo_ctr_progress_bar_goal').val();
        if (!goal) {
            jQuery(this).closest('.woo-sctr-countdown-timer-admin-product').find('._woo_ctr_progress_bar_goal').focus();
            return false;
        }
    });
    jQuery('#woocommerce-product-data').on('change', '._woo_ctr_progress_bar_initial', function () {
        let goal = parseInt(jQuery(this).closest('.woo-sctr-countdown-timer-admin-product').find('._woo_ctr_progress_bar_goal').val()),
            init = parseInt(jQuery(this).val());
        if (init > goal) {
            jQuery(this).val('');
        }
    });
    sctv_settings_init();
    jQuery('#woocommerce-product-data').on('woocommerce_variations_loaded', function (event) {
        sctv_settings_init();
        //select variation display default
        jQuery('#woocommerce-product-data').on('click', '._woo_ctr_display_enable', function () {
            if (jQuery(this).prop('checked')) {
                jQuery('._woo_ctr_display_enable').prop('checked', false);
                jQuery(this).prop('checked', true);
            }
        });
    });

    function sctv_settings_init() {
        jQuery('.sale_price_dates_field').each(function () {
            var $these_sale_dates = jQuery(this);
            var sale_schedule_set = false;
            var $wrap = $these_sale_dates.parent().parent();

            $these_sale_dates.find('input[type="text"]').each(function () {
                if ('' !== jQuery(this).val()) {
                    sale_schedule_set = true;
                }
            });
            if (sale_schedule_set) {
                $wrap.find('.sale_schedule').hide();
                $wrap.find('.sale_price_dates_field').show();
            } else {
                $wrap.find('.sale_schedule').show();
                $wrap.find('.sale_price_dates_field').hide();
            }
        });
        jQuery('.sale_price_dates_field').each(function () {
            jQuery(this).find('input[type="text"]').datepicker({
                defaultDate: '',
                dateFormat: 'yy-mm-dd',
                numberOfMonths: 1,
                showButtonPanel: true,
                onSelect: function () {
                    date_picker_select(jQuery(this));
                }
            });
            // jQuery(this).find('input[type="text"]').each(function () {
            //     date_picker_select(jQuery(this));
            // });
        });
    }

    // Date picker fields.
    function date_picker_select(datepicker) {
        var option = jQuery(datepicker).next().next().is('.hasDatepicker') ? 'minDate' : 'maxDate', otherDateField,
            date;
        otherDateField = 'minDate' === option ? jQuery(datepicker).next().next() : jQuery(datepicker).prev().prev();
        date = jQuery(datepicker).datepicker('getDate');
        if (!date) {
            option = 'minDate';
            date = new Date();
        }
        jQuery(otherDateField).datepicker('option', option, date);
        jQuery(datepicker).trigger('change');
    }
});