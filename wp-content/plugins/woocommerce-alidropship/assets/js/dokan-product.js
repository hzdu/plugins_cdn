jQuery(document).ready(function ($) {
    'use strict';
    // $(document).on('change', '#product_type', function () {
    //     let $simple_attributes = $('.vi-wad-original-attributes-simple');
    //     if ($(this).val() === 'variable') {
    //         $simple_attributes.fadeOut(200)
    //     } else {
    //         $simple_attributes.fadeIn(200)
    //     }
    // }).trigger('change');
    $('.ald-video-shortcode').on('click', function () {
        $(this).select();
        document.execCommand('copy');
        alert(vi_wad_vendor_product_params.i18n_video_shortcode_copied);
    });
    $('.vi-wad-view-original-product-button').remove();
});