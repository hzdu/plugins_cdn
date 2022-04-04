jQuery(document).ready(function ($) {
    'use strict';
    $(document).on('change', '.vi-wad-cart-item-shipping-container .vi-wad-item-shipping-select', function () {
        /*Update checkout*/
        $(document.body).trigger('update_checkout');
        /*Update cart*/
        let $update_cart = $('[name="update_cart"]');
        if ($update_cart.length > 0) {
            if ($update_cart.prop('disabled')) {
                $update_cart.prop('disabled', false);
            }
            $update_cart.trigger('click');
        }
    });
    let $item_shipping, $footer = $('.vi-wad-item-shipping-select-popup-holder'), company = '';
    $(document).on('click', '.vi-wad-item-shipping-select-popup', function () {
        let $button = $(this);
        $item_shipping = $button.closest('.vi-wad-item-shipping');
        let $modal = $item_shipping.find('.vi-wad-item-shipping-select-popup-modal');
        company = get_shipping_company($modal);
        $modal.removeClass('vi-wad-hidden');
        $footer.append($modal);
        vi_wad_disable_scroll();
    });
    $(document).on('click', '.vi-wad-item-shipping-select-popup-overlay,.vi-wad-item-shipping-select-popup-close', function () {
        let $button = $(this),
            $modal = $button.closest('.vi-wad-item-shipping-select-popup-modal');
        $modal.addClass('vi-wad-hidden');
        $item_shipping.append($modal);
        let new_company = get_shipping_company($modal);
        if (new_company !== company) {
            $modal.find(`.vi-wad-item-shipping-select`).prop('checked', false);
            $modal.find(`.vi-wad-item-shipping-select[value=${company}]`).prop('checked', true);
        }
        vi_wad_enable_scroll();
    });
    $(document).on('click', '.vi-wad-item-shipping-select-popup-confirm', function () {
        let $button = $(this),
            $modal = $button.closest('.vi-wad-item-shipping-select-popup-modal');
        $modal.addClass('vi-wad-hidden');
        $item_shipping.append($modal);
        let new_company = get_shipping_company($modal);
        if (new_company !== company) {
            company = new_company;
            $modal.find(`.vi-wad-item-shipping-select`).prop('checked', false);
            $modal.find(`.vi-wad-item-shipping-select[value=${company}]`).prop('checked', true).trigger('change');
            $item_shipping.find('.vi-wad-item-shipping-select-popup-selected').html($item_shipping.find(`.vi-wad-item-shipping-select[value="${company}"]`).data('shipping_amount_html'));
        }
        vi_wad_enable_scroll();
    });

    function get_shipping_company($modal) {
        let $shipping_select = $modal.find('.vi-wad-item-shipping-select'), shipping_company = '';
        for (let i = 0; i < $shipping_select.length; i++) {
            if ($shipping_select.eq(i).prop('checked')) {
                shipping_company = $shipping_select.eq(i).val();
                break;
            }
        }
        return shipping_company;
    }

    function vi_wad_enable_scroll() {
        let scrollTop = parseInt($('html').css('top'));
        $('html').removeClass('vi_wad-noscroll');
        $('html,body').scrollTop(-scrollTop);
    }

    function vi_wad_disable_scroll() {
        if ($(document).height() > $(window).height()) {
            let scrollTop = ($('html').scrollTop()) ? $('html').scrollTop() : $('body').scrollTop(); // Works for Chrome, Firefox, IE...
            $('html').addClass('vi_wad-noscroll').css('top', -scrollTop);
        }
    }
});