jQuery(function ($) {
    'use strict';
    $(document).on('click', '.penci_access_btn', function () {
        window.location.href = $(this).data('setting');
    });
});
