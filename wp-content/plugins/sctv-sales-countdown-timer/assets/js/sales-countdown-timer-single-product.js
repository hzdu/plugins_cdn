
jQuery(document).ready(function ($) {
    'use strict';
    if (typeof woo_sctr_single_product_countdown === 'undefined') {
        return false;
    }

    if (woo_sctr_single_product_countdown.sticky_type && $('.woo-sctr-single-product-container').length) {
        let atc_button, date_enable,
            countdown_container = $('.woo-sctr-single-product-container');
        if (woo_sctr_single_product_countdown.atc_button) {
            atc_button = '<div class="woo-sctr-add-to-cart-button-wrap">' + woo_sctr_single_product_countdown.atc_button + '</div>';
        }
        let sticky_class = woo_sctr_single_product_countdown.sticky_type === 'sticky_top' ? 'woo-sctr-sticky-top' : 'woo-sctr-sticky-bottom';
        let countdown_offset_top = parseInt(countdown_container.offset()['top']) + parseInt(countdown_container.find('.woo-sctr-countdown-timer-layout').height());
        window.onscroll = function () {
            // let currentScrollPos = window.pageYOffset;
            let currentScrollPos = jQuery('html').prop('scrollTop') || jQuery('body').prop('scrollTop');
            if (currentScrollPos > countdown_offset_top) {
                countdown_container.find('.woo-sctr-shortcode-countdown-timer-wrap').addClass(sticky_class);
                countdown_container.find('.woo-sctr-countdown-timer-layout').addClass('woo-sctr-countdown-timer-layout-same-line');
                if (atc_button && countdown_container.find('.woo-sctr-add-to-cart-button-wrap').length === 0) {
                    countdown_container.find('.woo-sctr-countdown-timer-layout').append(atc_button);
                }
            } else {
                countdown_container.find('.woo-sctr-shortcode-countdown-timer-wrap ').removeClass(sticky_class);
                countdown_container.find('.woo-sctr-countdown-timer-layout').removeClass('woo-sctr-countdown-timer-layout-same-line');
                countdown_container.find('.woo-sctr-add-to-cart-button-wrap').remove();
            }
        }
    }
});