jQuery(document).ready( function ($) {
    'use strict';
    $('.customize-control.customize-control-vi_wot_shipment_icon .vi_wot_radio_button_img').buttonset();
    $('.customize-control.customize-control-vi_wot_shipment_icon .vi_wot_radio_button_img input:radio').on('change', function () {
        var setting = $(this).attr('data-customize-setting-link');
        var image = $(this).val();
        wp.customize(setting, function (obj) {
            obj.set(image);
        });
    });
});