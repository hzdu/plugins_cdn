jQuery(document).ready(function ($) {
    'use strict';
    /*Export*/
    let $export_progress = $('.wmc-progress-export');
    $('.wmc-export-csv').on('click', function () {
        let filename = 'wmc-export-' + new Date().getTime() + '.csv';
        $export_progress.progress('set active');
        exportCSV(1, filename);
    });

    function exportCSV(step, filename) {
        $.ajax({
            type: 'POST',
            url: wmc_bulk_fixed_price_params.ajaxURL,
            data: {
                action: 'wmc_bulk_fixed_price_export',
                step: step,
                filename: filename,
                security: wmc_bulk_fixed_price_params.exim_nonce
            },
            dataType: 'json',
            success: function (res) {
                if (res.success) {
                    $export_progress.progress('set percent', res.data.percentage);
                    if ('done' === res.data.step) {
                        window.location = res.data.url;
                    } else {
                        exportCSV(parseInt(res.data.step, 10), filename);
                    }
                }
            },
            error: function (res) {
                console.log(res);
            }
        });
    }

    /*Import*/
    let $import_progress = $('.wmc-progress-import');
    $('.wmc-import-csv').on('click', function () {
        let $formData = $('#wmc-import-csv');
        let formData = new FormData($formData[0]);
        let $csv_file = $formData.find('input[type=file]');
        if ($csv_file.length > 0 && $csv_file[0].files.length > 0) {
            formData.append('csv_file', $('input[type=file]')[0].files[0]);
            formData.append('action', 'wmc_bulk_fixed_price');
            formData.append('pos', '0');
            formData.append('row', '0');
            formData.append('security', wmc_bulk_fixed_price_params.exim_nonce);
            $import_progress.progress('set active');
            importCSV(formData);
        } else {
            alert('Please select a CSV file.')
        }
    });

    function importCSV(formData) {
        $.ajax({
            type: 'POST',
            url: wmc_bulk_fixed_price_params.ajaxURL,
            data: formData,
            dataType: 'json',
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.success) {
                    if (!res.data.finish) {
                        formData.append('pos', res.data.pos);
                        formData.append('row', res.data.row);
                        importCSV(formData);
                    }
                    $import_progress.progress('set percent', res.data.percentage);
                }
            },
            error: function (res) {
                console.log(res);
            }
        });
    }
});
