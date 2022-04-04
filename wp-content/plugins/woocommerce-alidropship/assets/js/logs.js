jQuery(document).ready(function ($) {
    'use strict';
    $('.vi-wad-delete-log').on('click', function () {
        if (!confirm('This can not be undone, do you want to continue?')) {
            return false;
        }
    });
    $('select[name="log_of"]').on('change', function () {
        let $log_of = $(this),
            log_of = $log_of.val(),
            $log_file = $log_of.closest('form').find('select[name="log_file"]');
        if (log_of) {
            let total_files = 0, selected = '';
            $log_file.find('option').map(function () {
                let $option = $(this), option = $option.attr('value');
                if (option && option.indexOf(`ald-${log_of}`) === 0) {
                    total_files++;
                    $option.show();
                    if (!selected || $option.attr('selected')) {
                        selected = option;
                    }
                } else {
                    $option.hide();
                }
            });
            if (total_files > 0) {
                $log_file.find('option[value=""]').hide();
            } else {
                $log_file.find('option[value=""]').show();
            }
            $log_file.val(selected);
        } else {
            $log_file.find('option').show();
            $log_file.find('option[value=""]').hide();
            if (!$log_file.val()) {
                $log_file.val($log_file.find('option').eq(1).attr('value'));
            }
        }
    }).trigger('change');
    $('.vi-wad-logs-form').on('submit', function () {
        if (!$('select[name="log_file"]').val()) {
            alert('Please select a log file.');
            return false;
        }
    })
});