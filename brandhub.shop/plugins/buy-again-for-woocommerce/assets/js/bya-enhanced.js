/* global bya_enhanced_select_params */

jQuery(function ($) {
    'use strict';

    try {
        $(document.body).on('bya-enhanced-init', function () {
            if ($('select.bya_select2').length) {
                //Select2 with customization
                $('select.bya_select2').each(function () {
                    var select2_args = {
                        allowClear: $(this).data('allow_clear') ? true : false,
                        placeholder: $(this).data('placeholder'),
                        minimumResultsForSearch: 10,
                    };
                    $(this).select2(select2_args);
                });
            }
            if ($('select.bya_select2_search').length) {
                //Multiple select with ajax search
                $('select.bya_select2_search').each(function () {
                    var select2_args = {
                        allowClear: $(this).data('allow_clear') ? true : false,
                        placeholder: $(this).data('placeholder'),
                        minimumInputLength: $(this).data('minimum_input_length') ? $(this).data('minimum_input_length') : 3,
                        escapeMarkup: function (m) {
                            return m;
                        },
                        ajax: {
                            url: bya_enhanced_select_params.ajaxurl,
                            dataType: 'json',
                            delay: 250,
                            data: function (params) {
                                return {
                                    term: params.term,
                                    action: $(this).data('action') ? $(this).data('action') : 'bya_json_search_user',
                                    exclude_global_variable: $(this).data('exclude-global-variable') ? $(this).data('exclude-global-variable') : 'no',
                                    bya_security: $(this).data('nonce') ? $(this).data('nonce') : bya_enhanced_select_params.search_nonce,
                                };
                            },
                            processResults: function (data) {
                                var terms = [];
                                if (data) {
                                    $.each(data, function (id, term) {
                                        terms.push({
                                            id: id,
                                            text: term
                                        });
                                    });
                                }
                                return {
                                    results: terms
                                };
                            },
                            cache: true
                        }
                    };

                    $(this).select2(select2_args);
                });
            }

            if ($('.bya_datepicker').length) {
                $('.bya_datepicker').on('change', function () {
                    if ($(this).val() === '') {
                        $(this).next(".bya_alter_datepicker_value").val('');
                    }
                });

                $('.bya_datepicker').each(function () {
                    var datepicker_args = {
                        altField: $(this).next(".bya_alter_datepicker_value"),
                        altFormat: 'yy-mm-dd',
                        changeMonth: true,
                        changeYear: true,
                    };
    
                    if ($(this).hasClass("bya_time_filter_field")) {
                        datepicker_args["dateFormat"] = 'yy-mm-dd';
                    }
                    
                    $(this).datepicker(datepicker_args);
                });
            }

        });

        $(document.body).trigger('bya-enhanced-init');
    } catch (err) {
        window.console.log(err);
    }

});