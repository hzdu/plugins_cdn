jQuery(document).ready(function ($) {
    //change button type
    var type = $('.wpep_button_type:checked').val();
    if (type == 'simple') {
        $('.wpep-donation').hide();
    } else {
        $('.wpep-donation').show();
    }

    $('.wpep_button_type').click(function () {
        var type = $(this).val();
        if (type == 'simple') {
            $('.wpep-donation').hide();
        } else {
            $('.wpep-donation').show();
        }
    });

    //donation user set amount
    if ($('.donation_user_amount').is(':checked')) {
        $('.wpep-amount').hide();
    } else {
        $('.wpep-amount').show();
    }

    $('.donation_user_amount').click(function () {
        if ($(this).is(':checked')) {
            $('.wpep-amount').hide();
        } else {
            $('.wpep-amount').show();
        }
    });
});