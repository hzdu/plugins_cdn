jQuery(document).ready(function () {
    'use strict';
    jQuery('._woo_ctr_select_change_setting').on('change', function () {
        if (jQuery(this).val()) {
            jQuery('.sctv_bulk_edit_setting').show();
        } else {
            jQuery('.sctv_bulk_edit_setting').hide();
        }
    });
    jQuery('._woo_ctr_progress_bar_initial').unbind().on('click',function () {
        let goal = jQuery('._woo_ctr_progress_bar_goal').val();
        if (!goal) {
            jQuery('._woo_ctr_progress_bar_goal').focus();
            return false;
        }
    }).on('change',function () {
        let goal = parseInt(jQuery('._woo_ctr_progress_bar_goal').val()),
            init = parseInt(jQuery(this).val());
        if (init > goal) {
            jQuery(this).val(goal);
        }
    });
    jQuery('.sctv_bulk_edit_date_field').each(function () {
        jQuery(this).find('input[type="text"]').datepicker({
            defaultDate: '',
            dateFormat: 'yy-mm-dd',
            numberOfMonths: 1,
            showButtonPanel: true,
            onSelect: function () {
                date_picker_select(jQuery(this));
            }
        });
        jQuery(this).find('input[type="text"]').each(function () {
            date_picker_select(jQuery(this));
        });
    });

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