jQuery(document).ready(function ($) {
    'use strict';
    $('.vi-ui.dropdown').dropdown();
    $('input[name="s2w_save_cron_update_products"]').on('click', function (e) {
        if (!$('#s2w-cron_update_products_options').val()) {
            alert('Please select at least one option to update');
            e.preventDefault();
        }
        if (!$('#s2w-cron_update_products_status').val()) {
            alert('Please select product status you want to update');
            e.preventDefault();
        }
    });
    /**
     * Show/hide additional description for barcode
     */
    $('select[name="s2w_cron_update_products_options[]"]').on('change', function (e) {
        let options = $(this).val();
        if (options.indexOf('barcode') > -1) {
            $('.s2w-barcode-description').fadeIn(200);
        } else {
            $('.s2w-barcode-description').fadeOut(200);
        }
    }).trigger('change');
    $('.search-category').select2({
        closeOnSelect: false,
        placeholder: "Please fill in your category title",
        ajax: {
            url: "admin-ajax.php?action=s2w_search_cate&_s2w_nonce=" + s2w_params_admin_cron_update_products._s2w_nonce,
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
