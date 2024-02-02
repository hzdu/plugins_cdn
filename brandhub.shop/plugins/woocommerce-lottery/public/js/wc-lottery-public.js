jQuery(document).ready(function($) {

    $(".lottery-time-countdown").each(function(index) {

        var time = $(this).data('time');
        var format = $(this).data('format');

        if (format == '') {
            format = 'yowdHMS';
        }
        var etext = '';
        if ($(this).hasClass('future')) {
           etext = '<div class="started">' + wc_lottery_data.started + '</div>';
        } else {
           etext = '<div class="over">' + wc_lottery_data.finished + '</div>';

        }
        if (wc_lottery_data.compact_counter == 'yes') {
            compact = true;
        } else {
            compact = false;
        }

        $(this).wc_lotery_countdown({
            until: $.wc_lotery_countdown.UTCDate(-(new Date().getTimezoneOffset()), new Date(time * 1000)),
            format: format,
            expiryText: etext,
            compact: compact,
            onExpiry: wcl_closeLottery,
        });

    });

    $('form.cart input[name ="quantity"]:not(#qty_dip)').on('change', function() {
        qty = $(this).val();
        priceelement = $(this).closest('form').find('.atct-price');

        price = priceelement.data('price');
        id = priceelement.data('id');
        newprice = qty * price;
        newprice = number_format(newprice, wc_lottery_data.price_decimals, wc_lottery_data.price_decimal_separator, wc_lottery_data.price_thousand_separator);
        if ( wc_lottery_data.currency_pos == 'left_space') {
            newprice = ' ' + newprice ;
        } else if( wc_lottery_data.currency_pos == 'right_space') {
            newprice = newprice + ' ' ;
        }
        oldtext = $(priceelement).children('.woocommerce-Price-amount').clone().children().remove().end().html();
        if( oldtext ){
            newtext = $(priceelement).children('.woocommerce-Price-amount').html().replace(oldtext, newprice);
        	$(priceelement).children('.woocommerce-Price-amount').html(newtext);
        }


    });



});

function wcl_closeLottery (){
    var lotteryid = jQuery(this).data('lotteryid');
    jQuery( document.body).trigger('wcl-close-lottery',[lotteryid]);
    var request =  jQuery.ajax({
        type : "post",
        url : wc_lottery_data.ajax_url,
        cache : false,
        data : {action: "lottery_counter_ended", post_id : lotteryid, page_id: wc_lottery_data.page_id, url: window.location.toString(), security: wc_lottery_data.ajax_nonce },
        success: function(response) {

        },
        error: function(){

        },
    });
}

number_format = function(number, decimals, dec_point, thousands_sep) {
    number = number.toFixed(decimals);

    var nstr = number.toString();
    nstr += '';
    x = nstr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? dec_point + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    if( thousands_sep ) {
        while (rgx.test(x1))
            x1 = x1.replace(rgx, '$1' + thousands_sep + '$2');
    }

    return x1 + x2;
}