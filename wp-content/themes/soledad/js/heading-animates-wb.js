(function ($) {
    "use strict";
    var PENCI = PENCI || {};
    PENCI.HeadingAnimateText = function () {
        $('.penci-animated-headline').each(function (e) {
            var wrapper = $(this),
                dynamic = $(this).find('.dynamic-wrapper');

            if ("rotating" == wrapper.data("style")) {
                const e = wrapper.data("rotate"), t = dynamic.find(".dynamic-text");
                if (t.length > 0) {
                    const n = t.first();
                    ["typing", "swirl", "blinds", "wave"].includes(e) ? animateText(n, getNextText(n)) : showText(n, getNextText(n))
                }
            }


            function animateText(e, t) {
                dynamic.removeClass("typing-delete"), e.addClass("show-text"), dynamic.removeClass("cursor-blink"), animateLetter(e.find(".dynamic-text-letter").first(), e, t)
            }

            function animateLetter(e, t, n) {
                var s = $(this), i = wrapper.data("letter-speed");
                e.addClass("show-letter"), setTimeout((function () {
                    e.is(":last-child") ? hideText(t, n) : animateLetter(e.next(), t, n)
                }), i)
            }

            function getNextText(e) {
                return e.is(":last-child") ? dynamic.find(".dynamic-text").first() : e.next()
            }

            function hideText(e, t) {
                const n = $(this), s = wrapper.data("rotate"), i = wrapper.data("delay");
                dynamic.addClass("cursor-blink"), setTimeout((function () {
                    if ("typing" == s) {
                        const s = wrapper.data("delay-delete");
                        dynamic.addClass("typing-delete"), setTimeout((function () {
                            e.removeClass("show-text"), e.find(".dynamic-text-letter").removeClass("show-letter"), animateText(t, getNextText(t))
                        }), s)
                    } else e.removeClass("show-text"), e.find(".dynamic-text-letter").removeClass("show-letter"), animateText(t, getNextText(t))
                }), i)
            }

            function showText(e, t) {
                const n = $(this), s = wrapper.data("delay"), i = wrapper.data("rotate");
                if (e.addClass("show-text"), "clip" == i) {
                    const i = wrapper.data("clip-duration");
                    dynamic.width(e.width() + 10), dynamic.animate({width: 0}, i / 2, (function () {
                        e.removeClass("show-text"), t.addClass("show-text"), dynamic.animate({width: t.width() + 10}, i / 2, (function () {
                            setTimeout((function () {
                                e.removeClass("show-text"), showText(t, getNextText(t))
                            }), s)
                        }))
                    }))
                } else dynamic.width(e.width()), setTimeout((function () {
                    e.removeClass("show-text"), showText(t, getNextText(t))
                }), s)
            }
        });

    }
    $(document).ready(function () {
        PENCI.HeadingAnimateText();
    });
})(jQuery);