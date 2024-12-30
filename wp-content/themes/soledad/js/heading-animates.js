!function (e) {
    var t = {};

    function n(s) {
        if (t[s]) return t[s].exports;
        var i = t[s] = {i: s, l: !1, exports: {}};
        return e[s].call(i.exports, i, i.exports, n), i.l = !0, i.exports
    }

    n.m = e, n.c = t, n.d = function (e, t, s) {
        n.o(e, t) || Object.defineProperty(e, t, {enumerable: !0, get: s})
    }, n.r = function (e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {value: "Module"}), Object.defineProperty(e, "__esModule", {value: !0})
    }, n.t = function (e, t) {
        if (1 & t && (e = n(e)), 8 & t) return e;
        if (4 & t && "object" == typeof e && e && e.__esModule) return e;
        var s = Object.create(null);
        if (n.r(s), Object.defineProperty(s, "default", {
            enumerable: !0,
            value: e
        }), 2 & t && "string" != typeof e) for (var i in e) n.d(s, i, function (t) {
            return e[t]
        }.bind(null, i));
        return s
    }, n.n = function (e) {
        var t = e && e.__esModule ? function () {
            return e.default
        } : function () {
            return e
        };
        return n.d(t, "a", t), t
    }, n.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }, n.p = "", n(n.s = 0)
}([function (e, t) {
    class n extends elementorModules.frontend.handlers.Base {
        getDefaultSettings() {
            return {selectors: {wrapper: ".penci-animated-headline", dynamic: ".dynamic-wrapper"}}
        }

        getDefaultElements() {
            const e = this.getSettings("selectors");
            return {$wrapper: this.$element.find(e.wrapper), $dynamic: this.$element.find(e.dynamic)}
        }

        bindEvents() {
            this.onRenderElement()
        }

        onRenderElement() {
            if ("rotating" == this.elements.$wrapper.data("style")) {
                const e = this.elements.$wrapper.data("rotate"), t = this.elements.$dynamic.find(".dynamic-text");
                if (t.length > 0) {
                    const n = t.first();
                    ["typing", "swirl", "blinds", "wave"].includes(e) ? this.animateText(n, this.getNextText(n)) : this.showText(n, this.getNextText(n))
                }
            }
        }

        animateText(e, t) {
            this.elements.$dynamic.removeClass("typing-delete"), e.addClass("show-text"), this.elements.$dynamic.removeClass("cursor-blink"), this.animateLetter(e.find(".dynamic-text-letter").first(), e, t)
        }

        animateLetter(e, t, n) {
            const s = this, i = this.elements.$wrapper.data("letter-speed");
            e.addClass("show-letter"), setTimeout((function () {
                e.is(":last-child") ? s.hideText(t, n) : s.animateLetter(e.next(), t, n)
            }), i)
        }

        getNextText(e) {
            return e.is(":last-child") ? this.elements.$dynamic.find(".dynamic-text").first() : e.next()
        }

        hideText(e, t) {
            const n = this, s = n.elements.$wrapper.data("rotate"), i = n.elements.$wrapper.data("delay");
            this.elements.$dynamic.addClass("cursor-blink"), setTimeout((function () {
                if ("typing" == s) {
                    const s = n.elements.$wrapper.data("delay-delete");
                    n.elements.$dynamic.addClass("typing-delete"), setTimeout((function () {
                        e.removeClass("show-text"), e.find(".dynamic-text-letter").removeClass("show-letter"), n.animateText(t, n.getNextText(t))
                    }), s)
                } else e.removeClass("show-text"), e.find(".dynamic-text-letter").removeClass("show-letter"), n.animateText(t, n.getNextText(t))
            }), i)
        }

        showText(e, t) {
            const n = this, s = n.elements.$wrapper.data("delay"), i = n.elements.$wrapper.data("rotate");
            if (e.addClass("show-text"), "clip" == i) {
                const i = n.elements.$wrapper.data("clip-duration");
                n.elements.$dynamic.width(e.width() + 10), n.elements.$dynamic.animate({width: 0}, i / 2, (function () {
                    e.removeClass("show-text"), t.addClass("show-text"), n.elements.$dynamic.animate({width: t.width() + 10}, i / 2, (function () {
                        setTimeout((function () {
                            e.removeClass("show-text"), n.showText(t, n.getNextText(t))
                        }), s)
                    }))
                }))
            } else n.elements.$dynamic.width(e.width()), setTimeout((function () {
                e.removeClass("show-text"), n.showText(t, n.getNextText(t))
            }), s)
        }
    }

    jQuery(window).on("elementor/frontend/init", (() => {
        elementorFrontend.hooks.addAction("frontend/element_ready/penci-animated-headline.default", (e => {
            elementorFrontend.elementsHandler.addHandler(n, {$element: e})
        }))
    }))
}]);