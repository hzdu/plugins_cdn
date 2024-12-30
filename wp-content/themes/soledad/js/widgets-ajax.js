(function ($) {
    "use strict";
    var PENCI = PENCI || {};
    PENCI.ajaxwidgets = function () {
        $(document).on('click', '.widget .penci-wgajx-btn', function (e) {
            e.preventDefault();
            var t = $(this),
                wrapper = t.closest('.widget').find('ul'),
                navwrapper = t.closest('.penci-pagination'),
                settings = wrapper.attr('data-settings'),
                mes = wrapper.attr('data-mes'),
                action = wrapper.data('action'),
                id = parseInt(wrapper.data('id')),
                max = parseInt(wrapper.data('max')),
                nav = t.hasClass('pcajx-btn'),
                paged = parseInt(wrapper.attr('data-paged')),
                type = wrapper.attr('data-type'),
                get_paged = paged + 1;

            if (t.hasClass('disable')) {
                return;
            }

            if (t.hasClass('pc-tabsajax-btn')) {
                wrapper = t.closest('.tab-content-wrapper').find('ul');
                settings = wrapper.attr('data-settings');
                type = wrapper.attr('data-type');
                mes = wrapper.attr('data-mes');
                paged = parseInt(wrapper.attr('data-paged'));
                max = parseInt(wrapper.data('max'));
                action = wrapper.data('action');
                get_paged = paged + 1;
            }

            if (nav && t.hasClass('prev')) {
                get_paged = paged - 1;
            }

            t.addClass('loading-posts');
            wrapper.closest(".widget").addClass('ajx-loading');

            $.ajax({
                type: "POST",
                dataType: "html",
                url: penci_widgets_ajax.url,
                data: {
                    action: action,
                    settings: settings,
                    id: id ? id : '',
                    type: type ? type : '',
                    paged: get_paged,
                    nonce: penci_widgets_ajax.nonce,
                },
                success: function (data) {

                    if (data) {

                        if (nav && get_paged >= max) {
                            navwrapper.find('.pcajx-btn.next').addClass('disable');
                        } else {
                            navwrapper.find('.pcajx-btn.next').removeClass('disable');
                        }

                        if (nav && get_paged > 1) {
                            navwrapper.find('.pcajx-btn.prev').removeClass('disable');
                        } else {
                            navwrapper.find('.pcajx-btn.prev').addClass('disable');
                        }

                        var datajs = $(data);

                        if (nav) {
                            wrapper.empty();
                        }

                        wrapper.append(datajs.html());

                        wrapper.attr('data-paged', get_paged);

                    } else {

                        t.find(".ajax-more-text").text(mes);
                        t.find("i").remove();
                        setTimeout(function () {
                            t.closest('.penci-pagination').remove();
                        }, 1200);
                    }
                    t.removeClass('loading-posts');
                    wrapper.closest(".widget").removeClass('ajx-loading');
                }
            });
        });
    };

    $(document).ready(function () {
        PENCI.ajaxwidgets();
    });
})(jQuery);