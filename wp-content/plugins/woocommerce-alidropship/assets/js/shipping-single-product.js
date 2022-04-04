jQuery(document).ready(function ($) {
    'use strict';
    let variation_id = '', current_variation_id = '', quantity, reload_shipping, rerun = true;
    $(document).on('change', 'form.cart input[name="quantity"]', function () {
        rerun = false;
        let $quantity = $(this), $form = $quantity.closest('form.cart');
        reload_shipping_selection($quantity, $form);
    });
    // $('.single_variation_wrap').on('show_variation', function (event, variation) {
    //     console.log(rerun)
    //     if (rerun) {
    //         let $form = $(this).closest('form'),
    //             $quantity = $form.find('input[name="quantity"]');
    //         reload_shipping_selection($quantity, $form)
    //     }
    // });

    function reload_shipping_selection($quantity, $form) {
        let product_id = $form.find('[name="add-to-cart"]').val(), $variation_id = $form.find('[name="variation_id"]'),
            $shipping = $form.find('.vi-wad-single-product-shipping-wrap');
        if ($shipping.length === 0 || !product_id) {
            return;
        }
        if ($shipping.hasClass('vi-wad-single-product-shipping-need-select-variation')) {
            if (variation_id === '0') {
                return;
            }
        }
        if ((variation_id === '0' || ($variation_id.length > 0 && variation_id === $variation_id.val().toString())) && $shipping.hasClass('vi-wad-single-product-shipping-not-available')) {
            if (quantity === $quantity.val()) {
                return;
            }
        }
        if ($shipping.hasClass('vi-wad-single-product-shipping-not-refresh')) {
            if (quantity === undefined) {
                quantity = $quantity.val();
                return;
            }
            if (quantity === $quantity.val()) {
                return;
            }
        }
        if (reload_shipping !== undefined) {
            reload_shipping.abort();
        }
        let $overlay = $shipping.find('.vi-wad-single-product-shipping-overlay'), data = {
            action: 'vi_wad_reload_shipping_single_product',
            language: vi_wad_shipping.language,
            product_id: product_id,
            quantity: $quantity.val(),
            variation_id: $variation_id.length > 0 ? $variation_id.val().toString() : '',
        };
        $overlay.removeClass('vi-wad-hidden');
        reload_shipping = $.ajax({
            url: vi_wad_shipping.url,
            type: 'POST',
            dataType: 'JSON',
            data: data,
            success: function (response) {
                if (data.variation_id !== '0') {
                    variation_id = data.variation_id;
                }
                quantity = data.quantity;
                if (response.status === 'success') {
                    $shipping.replaceWith($(response.shipping_html));
                } else {
                    alert(response.message);
                }
            },
            error: function (err) {
                console.log(err);
            },
            complete: function (err) {
                $overlay.addClass('vi-wad-hidden');
                reload_shipping = undefined;
                rerun = true;
            },
        });
    }
});