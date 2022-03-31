jQuery(function($) {

    function pwBogoConfigureBuyType() {
        if ($('#pw-bogo-buy-type').val() == 'quantity') {
            $('#pw-bogo-buy-currency').css('display', 'none');
            $('#pw-bogo-spend-aftertax-container').css('display', 'none');
        } else {
            $('#pw-bogo-buy-currency').css('display', 'inline-block');
            $('#pw-bogo-spend-aftertax-container').css('display', 'inline-block');
        }
    }

    function pwBogoShowHidePercentage() {
        if ($('#pw-bogo-type').val() == 'free') {
            $('.pw-bogo-percentage_field').css('display', 'none');
        } else {
            $('.pw-bogo-percentage_field').css('display', 'inline-block');
        }
    }

    pwBogoConfigureBuyType();
    pwBogoShowHidePercentage();

    $('#pw-bogo-buy-type').change(function() {
        pwBogoConfigureBuyType();
    });

    $('#pw-bogo-type').change(function() {
        pwBogoShowHidePercentage();
    });

    $('#pw-bogo-ignore-discounted-products').change(function() {
        if ($(this).is(':checked')) {
            $('#pw-discounted-products-container').hide();
        } else {
            $('#pw-discounted-products-container').show();
        }
    });

    $('form').submit(function(event) {
        var begin_date = new Date($("#pw-bogo-begin-date").val());
        var end_date = new Date($("#pw-bogo-end-date").val());
        if (begin_date > end_date || end_date < begin_date) {
            alert('Begin Date must be before the End Date.');
            event.preventDefault();
        }
    });

    $('.pw-bogo-social-link').click(function() {
        var logoImage = 'https://www.pimwick.com/wp-content/uploads/2017/02/logo.png';
        var title = 'PW WooCommerce BOGO';
        var url = 'https://pimwick.com/pw-bogo/';

        switch($(this).attr('data-site')) {
            case 'facebook':
                redirect = 'http://www.facebook.com/sharer/sharer.php?picture=' + logoImage + '&u=' + url + '&title=' + title;
            break;

            case 'twitter':
                redirect = 'http://twitter.com/intent/tweet?status=' + title + '+' + url;
            break;

            case 'google-plus':
                redirect = 'https://plus.google.com/share?url=' + url;
            break;

            case 'reddit':
                redirect = 'http://www.reddit.com/submit?url=' + url + '&title=' + title;
            break;

            case 'tumblr':
                redirect = 'http://www.tumblr.com/share?v=3&u=' + url + '&t=' + title;
            break;

            case 'pinterest':
                redirect = 'http://pinterest.com/pin/create/bookmarklet/?media=' + logoImage + '&url=' + url + '&is_video=false&description=' + title;
            break;
        }

        var win = window.open(redirect, '_blank');
        if (win) {
            win.focus();
        } else {
            window.location.href = redirect;
        }
    });

    return false;
});
