jQuery(document).ready(function ($) {
    $('body').on('click', function (e) {
        if ($(e.target).closest('.wvr-actions').length === 0) {
            $('.wvr-add-review-control-panel').removeClass('wvr-open');
        }
    });

    $('.wvr-open-add-review-control-panel').on('click', function () {
        $('.wvr-add-review-control-panel').toggleClass('wvr-open');
    });

    $('.submit-add-reviews').on('click', function (e) {
        var check = $("input[type='checkbox'][name='post[]']").is(':checked');
        if (!check) {
            alert("You have to select at least one product");
            e.preventDefault();
        }
    });
});