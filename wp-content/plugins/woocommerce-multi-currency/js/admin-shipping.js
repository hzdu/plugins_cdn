jQuery(document).ready(function ($) {
    'use strict';
    $(document.body).on('change', '#woocommerce_free_shipping_requires', function () {
        wcFreeShippingShowHideMinAmountField(this);
    }).trigger('change');

    $(document.body).on('wc_backbone_modal_loaded', function (evt, target) {
        if ('wc-modal-shipping-method-settings' === target) {
            wcFreeShippingShowHideMinAmountField($('#wc-backbone-modal-dialog #woocommerce_free_shipping_requires', evt.currentTarget));
        }
    });

    /**
     * Show/hide fixed min_amount based on the free shipping requires option
     *
     * @param ele
     */
    function wcFreeShippingShowHideMinAmountField(ele) {
        let $requires = $(ele);
        let $form = $requires.closest('form');
        if ('coupon' === $requires.val() || '' === $requires.val()) {
            for (let i in woocommerce_multi_currency_admin_shipping.currencies) {
                $form.find(`#woocommerce_free_shipping_min_amount_${woocommerce_multi_currency_admin_shipping.currencies[i]}`, $form).closest('tr').hide();
            }
        } else {
            for (let i in woocommerce_multi_currency_admin_shipping.currencies) {
                $form.find(`#woocommerce_free_shipping_min_amount_${woocommerce_multi_currency_admin_shipping.currencies[i]}`).closest('tr').show();
            }
        }
    }
});