(function ($) {
    "use strict";
    var PENCI = PENCI || {};
    PENCI.pay_writer = function () {
        $(document).on('click', '.pencipwt-donation-submit', function (e) {
            e.preventDefault();
            var formID = $(this).attr('data-id');
            $('body').find('#' + formID).submit();
        });
    };

    $(document).ready(function () {
        PENCI.pay_writer();
    });
})(jQuery);