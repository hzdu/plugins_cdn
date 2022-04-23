; (function ($) {
    $(window).on("elementor/frontend/init", function () {
        elementorFrontend.hooks.addAction("frontend/element_ready/upk-holux-tabs.default", function (scope) {
            scope.find('.ultimate-post-kit-holux-tabs-wrap').each(function () {
                var element = $(this)[0];
                if (element) {
                    var settings = $(this).data('settings');
                    var tabs = $(this).find('.post-tab-option');
                    var tabs_header = $(this).find('.upk-holux-tabs-header-tabs')
                    var item = $(this).find('.upk-holux-tabs');
                    tabs.on('click', function (e) {
                        var data = $(this).data('settings');
                        tabs_header.find('li').removeClass('upk-holux-tabs-active');
                        $(this).parent().addClass('upk-holux-tabs-active');
                        e.preventDefault();
                        $.ajax({
                            url: UltimatePostKitConfig.ajaxurl,
                            data: {
                                action: "upk_holux_tabs",
                                settings: settings,
                                data: data,
                            },
                            type: "POST",
                            dataType: "HTML",
                            success: function (response) {
                                item.html(response)
                            },
                            error: function (response) {
                                console.log(response);
                            },
                        });
                    })
                }
            });
        });
    });
})(jQuery);
