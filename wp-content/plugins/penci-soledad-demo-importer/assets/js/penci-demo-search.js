jQuery(document).ready(function ($) {
    "use strict";
    $(document).on('keyup', '#penci-demo-search', function (e) {
        e.preventDefault();
        var value = $(this).val().toLowerCase();
        $('.demos-container > form').each(function () {
            var title = $(this).find('.demo-title').text().toLowerCase();
            if (title.search(value) > -1) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });
});
