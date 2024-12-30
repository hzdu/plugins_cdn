(function ($) {
    "use strict";
    var PENCI = PENCI || {};
    PENCI.webstories = function () {
        $(document).on('click', '.pc-story-link', function (e) {

            e.preventDefault();

            var $this = $(this),
                $ul = $this.closest('.pc-wstories').find('.pc-wstories-list'),
                id = $this.attr('data-id'),
                url = $this.attr('data-url'),
                pos = parseInt($this.attr('data-count')),
                total = parseInt($ul.attr('data-total')),
                n, nid, nurl, nc, p, pid, purl, pc,
                seen = Cookies.get('pc_webstories_seen'),
                wrapper = $this.closest('.pc-wstories').find('.pc-wstories-popup-wrapper'),
                wrapperCT = $this.closest('.pc-wstories').find('.pc-wstories-popup-content');

            if ($this.hasClass('disable')) {
                return false;
            }

            $(wrapper).find('.current').html(pos);
            $(wrapper).find('.total').html(total);

            if (pos < total) {
                n = $ul.find('.pc-webstory-item.item-' + (pos + 1));
                nid = n.attr('data-id');
                nurl = n.attr('data-url');
                nc = n.attr('data-count');
            }

            if (pos > 1) {
                p = $ul.find('.pc-webstory-item.item-' + (pos - 1));
                pid = p.attr('data-id');
                purl = p.attr('data-url');
                pc = p.attr('data-count');
            }

            $.ajax({
                type: "GET",
                dataType: "html",
                url: url,
                beforeSend: function () {
                    wrapper.addClass('loading');
                    $('body').addClass('pc-webstories-show');
                },
                success: function () {
                    wrapperCT.empty().append('<iframe src="' + url + '"/>');
                },
                complete: function () {
                    wrapper.removeClass('loading').addClass('show');
                    $ul.find('.pc-webstory-item.item-' + pos).removeClass('new').addClass('seen');

                    var $next = wrapper.find('.pc-ws-btn.next'),
                        $previous = wrapper.find('.pc-ws-btn.previous');

                    if (nid && nurl) {
                        $next.attr('data-id', nid)
                            .attr('data-url', nurl)
                            .attr('data-count', nc)
                            .removeClass('disable');
                    } else {
                        $next.addClass('disable')
                            .removeAttr('data-id data-url data-count');
                    }

                    if (pid && purl) {
                        $previous.attr('data-id', pid)
                            .attr('data-url', purl)
                            .attr('data-count', pc)
                            .removeClass('disable');
                    } else {
                        $previous.addClass('disable')
                            .removeAttr('data-id data-url data-count');
                    }

                    if (seen === undefined) {
                        Cookies.set('pc_webstories_seen', id);
                    } else {
                        Cookies.set('pc_webstories_seen', seen + '|' + id);
                    }
                }
            });
            return false;
        });

        $(document).on('click', '.pc-wstories-popup-wrapper .close', function (e) {

            e.preventDefault();
            var wrapperCT = $(this).closest('.pc-wstories').find('.pc-wstories-popup-content'),
                wrapper = $(this).closest('.pc-wstories').find('.pc-wstories-popup-wrapper');

            wrapper.removeClass('show');
            $('body').removeClass('pc-webstories-show');
            wrapperCT.empty();
        });


        var onerow_lists = $('.pc-wstories-list.one-row');
        onerow_lists.each(function (){
            const slider = $(this);
            let isDown = false;
            let startX;
            let scrollLeft;
            var soffset = slider.offset();

            slider.on('mousedown', function (e) {
                isDown = true;
                startX = e.pageX - soffset.left;
                scrollLeft = slider.scrollLeft();
            });
            slider.on('mouseleave', function () {
                isDown = false;
            });
            slider.on('mouseup', function () {
                isDown = false;
            });
            slider.on('mousemove', function (e) {
                if(!isDown) return;
                e.preventDefault();
                const x = e.pageX - soffset.left;
                const walk = (x - startX) * 2; //scroll-fast
                slider.scrollLeft(scrollLeft - walk);
            });
        });
    };

    $(document).ready(function () {
        PENCI.webstories();
    });
})(jQuery);
