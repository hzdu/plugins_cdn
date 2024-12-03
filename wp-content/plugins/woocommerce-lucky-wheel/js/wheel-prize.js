jQuery(document).ready(function ($) {
    'use strict';
    $(".suggested-product-search").select2({
        placeholder: "Please fill in your product title",
        ajax: {
            url: "admin-ajax.php?action=wlwl_search_suggested_product",
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
    $(".category-search").select2({
        placeholder: "Please enter category title",
        ajax: {
            url: "admin-ajax.php?action=wlwl_search_cate",
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
    $(".product-search").select2({
        closeOnSelect: false,
        placeholder: "Please fill in your product title",
        ajax: {
            url: "admin-ajax.php?action=wlwl_search_product",
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
    $(".coupon-search").select2({
        placeholder: "Type coupon code here",
        ajax: {
            url: "admin-ajax.php?action=wlwl_search_coupon",
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
    $('input[name="wlwl_custom_winning_message"]').on('change', function () {
        if ($(this).prop('checked')) {
            $('.wlwl-custom-winning-message-container').removeClass('wlwl-hidden');
        } else {
            $('.wlwl-custom-winning-message-container').addClass('wlwl-hidden');
        }
    });
    $('input[name="wlwl_custom_button_apply_coupon_redirect"]').on('change', function () {
        if ($(this).prop('checked')) {
            $('.wlwl-custom-button-apply-coupon-redirect-container').removeClass('wlwl-hidden');
        } else {
            $('.wlwl-custom-button-apply-coupon-redirect-container').addClass('wlwl-hidden');
        }
    });
});
