!function (e, $) {
    $(document).on('click', '.penci-builder-button.customize .button', function (e) {
        var href = $(this).data('href');
        e.preventDefault();
        $(window).off('beforeunload');
        window.location.href = href;
    });
}(wp, jQuery);
