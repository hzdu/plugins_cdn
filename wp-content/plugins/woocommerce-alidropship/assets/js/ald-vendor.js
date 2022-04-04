jQuery(document).ready(function ($) {
    'use strict';
    window.onbeforeunload = function (event) {
        $('.woocommerce-alidropship-vendor-overlay').removeClass('vi-wad-hidden');
    }
});