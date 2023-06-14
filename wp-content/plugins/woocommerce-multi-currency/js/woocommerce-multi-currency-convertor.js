jQuery(document).ready(function ($) {
    'use strict';

    let {rates} = wmcConvertorParams;
    let resultDiv = $('.wmc-currency-convertor-result');

    $('.wmc-currency-convertor').on('change', '.wmc-currency-convertor-amount, .wmc-convertor-from-currency, .wmc-convertor-to-currency', function () {
        if (!rates) return;

        let amount = $('.wmc-currency-convertor-amount').val();
        let from = $('.wmc-convertor-from-currency').val();
        let to = $('.wmc-convertor-to-currency').val();

        if (amount === '') return;

        let fromRate = rates[from];
        let toRate = rates[to];
        let exchange = 1;

        if (fromRate) exchange = toRate / fromRate;

        let resultAmount = amount * exchange;

        resultDiv.text(`${amount} ${from} = ${resultAmount} ${to}`);
    });

    $('.wmc-currency-convertor-amount').trigger('change');
});