(function ($) {
    wfch.hooks.doAction('wfch_before_init');

    $(document.body).on('added_to_cart', function (e, data) {
        if (typeof data === 'object') {
            if (wfch.tools.hp(data, 'wfch_redirect')) {
                if (wfch.hooks.applyFilters('wfch_reload_page_added_to_cart', false, data)) {
                    window.location = data.wfch_redirect;
                }
            }
        }
    });

    $(document.body).on('wc_fragments_refreshed', function () {
        if (wfch.hooks.applyFilters('wfch_reload_wc_fragments_refreshed', false)) {
            let reload = $('.wfch_reload');
            if (reload.length > 0) {
                let action = reload.data('action');
                if ('yes' === action) {
                    window.location.href = reload.data('url');
                }
            }
        }
    });

})(jQuery);