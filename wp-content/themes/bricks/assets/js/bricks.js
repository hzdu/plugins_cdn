function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e29) { throw _e29; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e30) { didErr = true; err = _e30; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var BricksIntersect = /*#__PURE__*/_createClass(function BricksIntersect() {
  var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  _classCallCheck(this, BricksIntersect);
  var t = e.element || !1,
    r = e.callback || !1,
    i = !e.hasOwnProperty("once") || e.once;
  if ("IntersectionObserver" in window) {
    var s = new IntersectionObserver(function (e, s) {
      e.forEach(function (e) {
        e.isIntersecting && (t && r && r(e.target), i && s.unobserve(e.target));
      });
    }, {
      threshold: e.threshold || 0,
      root: e.root || null,
      rootMargin: (e === null || e === void 0 ? void 0 : e.rootMargin) || "0px"
    });
    t instanceof Element && s.observe(t);
  } else {
    var _e = !1,
      _i = function _i() {
        !1 === _e && (_e = !0, t.getBoundingClientRect().top <= window.innerHeight && t.getBoundingClientRect().bottom >= 0 && "none" !== window.getComputedStyle(t).display && t && r && r(t), _e = !1);
      };
    _i(), document.addEventListener("scroll", _i), window.addEventListener("resize", _i), window.addEventListener("orientationchange", _i);
  }
});
function bricksLazyLoad() {
  var e = bricksQuerySelectorAll(document, ".bricks-lazy-hidden");
  var t = window.bricksData.offsetLazyLoad || 300;
  e.forEach(function (e) {
    new BricksIntersect({
      element: e,
      callback: function callback(e) {
        (function (e) {
          if (e.classList.add("wait"), e.dataset.src && (e.src = e.dataset.src, delete e.dataset.src, e.style = ""), e.dataset.sizes && (e.sizes = e.dataset.sizes, delete e.dataset.sizes), e.dataset.srcset && (e.srcset = e.dataset.srcset, delete e.dataset.srcset), e.dataset.style) {
            var _t = e.getAttribute("style") || "";
            _t += e.dataset.style, e.setAttribute("style", _t), e.classList.contains("splide__slide") || delete e.dataset.style;
          }
          e.classList.remove("bricks-lazy-hidden"), e.classList.remove("wait"), e.classList.contains("bricks-lazy-load-isotope") && bricksIsotope();
        })(e);
      },
      rootMargin: "".concat(t, "px")
    });
  });
}
function BricksIsInViewport(e) {
  var t = e.getBoundingClientRect();
  return t.top >= 0 && t.left >= 0 && t.bottom <= (window.innerHeight || document.documentElement.clientHeight) && t.right <= (window.innerWidth || document.documentElement.clientWidth);
}
function bricksQuerySelectorAll(e, t) {
  if (Array.isArray(t)) {
    var r = [];
    return t.forEach(function (t) {
      r = r.concat(Array.prototype.slice.apply(e.querySelectorAll(t)));
    }), r;
  }
  return Array.prototype.slice.apply(e.querySelectorAll(t));
}
function bricksAnimation(e, t) {
  (e = e || bricksQuerySelectorAll(document, ".brx-animated")).forEach(function (e) {
    new BricksIntersect({
      element: e,
      callback: function callback(e) {
        var r = e.dataset.animation;
        r && (e.classList.add("brx-animate-".concat(r)), e.removeAttribute("data-animation"), setTimeout(function () {
          e.classList.remove("brx-animate-".concat(r));
        }, bricksIsFrontend ? t : 3e3));
      }
    });
  });
}
function bricksInitQueryLoopInstances() {
  bricksQuerySelectorAll(document, ".brx-query-trail").forEach(function (e) {
    var _e$dataset;
    var t = ((_e$dataset = e.dataset) === null || _e$dataset === void 0 ? void 0 : _e$dataset.observerMargin) || "1px",
      r = e.dataset.queryElementId,
      i = e.dataset.queryVars,
      s = e === null || e === void 0 ? void 0 : e.classList.contains("bricks-isotope-sizer"),
      o = e === null || e === void 0 ? void 0 : e.classList.contains("brx-infinite-scroll");
    window.bricksData.queryLoopInstances[r] = {
      page: e.dataset.page,
      maxPages: e.dataset.maxPages,
      queryVars: i,
      observerMargin: t,
      infiniteScroll: o,
      isPostsElement: s
    };
    var a = s ? e.previousElementSibling : Array.from(document.querySelectorAll(".brxe-".concat(r))).pop();
    s || e.remove(), a && o && (a.dataset.queryElementId = r, new BricksIntersect({
      element: a,
      callback: function callback(e) {
        return bricksQueryLoadPage(e);
      },
      once: 1,
      rootMargin: t
    }));
  });
}
function bricksQueryLoadPage(e) {
  return new Promise(function (t, r) {
    var _window$bricksData$qu;
    var i = e.dataset.queryElementId,
      s = (_window$bricksData$qu = window.bricksData.queryLoopInstances) === null || _window$bricksData$qu === void 0 ? void 0 : _window$bricksData$qu[i];
    if (!s || s !== null && s !== void 0 && s.isLoading) return;
    var o = parseInt(s.page || 1) + 1;
    var a = parseInt(s.maxPages || 1);
    if (o > a) return delete window.bricksData.queryLoopInstances[i], void t({
      page: o,
      maxPages: a
    });
    window.bricksData.queryLoopInstances[i].isLoading = 1;
    var n = {
      postId: window.bricksData.postId,
      queryElementId: i,
      queryVars: s.queryVars,
      page: o,
      nonce: window.bricksData.nonce
    };
    var c = window.bricksData.restApiUrl.concat("load_query_page");
    var l = new XMLHttpRequest();
    l.open("POST", c, !0), l.setRequestHeader("Content-Type", "application/json; charset=UTF-8"), l.setRequestHeader("X-WP-Nonce", window.bricksData.wpRestNonce), l.onreadystatechange = function () {
      if (l.readyState === XMLHttpRequest.DONE) {
        var r = l.status;
        if (0 === r || r >= 200 && r < 400) {
          var _t2 = JSON.parse(l.response);
          var _r = (_t2 === null || _t2 === void 0 ? void 0 : _t2.html) || !1,
            _s = (_t2 === null || _t2 === void 0 ? void 0 : _t2.styles) || !1;
          _r && e.insertAdjacentHTML("afterend", _r), _s && document.body.insertAdjacentHTML("beforeend", _s), window.bricksData.queryLoopInstances[i].page = o;
        }
        window.bricksData.queryLoopInstances[i].isLoading = 0, t({
          page: o,
          maxPages: a
        }), bricksLazyLoad(), setTimeout(function () {
          bricksInteractions(), bricksPopups(), bricksAnimation(), s.isPostsElement ? (newQueryTrail = e.parentNode.querySelector(".bricks-isotope-sizer").previousElementSibling, bricksIsotope()) : newQueryTrail = Array.from(document.querySelectorAll(".brxe-".concat(i))).pop(), s.infiniteScroll && (newQueryTrail.dataset.queryElementId = i, BricksIsInViewport(newQueryTrail) ? bricksQueryLoadPage(newQueryTrail) : new BricksIntersect({
            element: newQueryTrail,
            callback: function callback(e) {
              return bricksQueryLoadPage(e);
            },
            once: !0,
            rootMargin: s.observerMargin
          }));
        }, 250);
      }
    }, l.send(JSON.stringify(n));
  });
}
function bricksQueryPagination() {
  bricksQuerySelectorAll(document, ".brx-ajax-pagination a").forEach(function (e) {
    var _e$dataset2;
    ((_e$dataset2 = e.dataset) === null || _e$dataset2 === void 0 ? void 0 : _e$dataset2.ajaxPagination) || (e.dataset.ajaxPagination = 1, e.addEventListener("click", function (e) {
      var _i$dataset;
      var t = e.currentTarget,
        r = t.getAttribute("href"),
        i = t.closest(".brx-ajax-pagination"),
        s = i === null || i === void 0 ? void 0 : (_i$dataset = i.dataset) === null || _i$dataset === void 0 ? void 0 : _i$dataset.queryElementId,
        o = document.querySelector(".brxe-".concat(s));
      if (!o) return;
      e.preventDefault();
      var a = new XMLHttpRequest();
      a.open("GET", r, !0), a.responseType = "document", a.onload = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
          var e = this.status;
          if (0 === e || e >= 200 && e < 400) {
            var _e2 = this.responseXML,
              _t3 = o.parentNode,
              _a = document.createElement("div");
            _a.style.display = "none", o.insertAdjacentElement("beforebegin", _a);
            _t3.querySelectorAll(".brxe-".concat(s)).forEach(function (e) {
              return e.remove();
            });
            _e2.querySelectorAll(".brxe-".concat(s)).forEach(function (e) {
              return _a.insertAdjacentElement("beforebegin", e);
            }), _a.remove();
            var n = _e2.querySelector(".brx-ajax-pagination[data-query-element-id=\"".concat(s, "\"]"));
            i.replaceWith(n), bricksLazyLoad(), bricksAnimation(), bricksQueryPagination(), window.history.pushState({}, "", r);
          }
        }
      }, a.send();
    }));
  });
}
function bricksStickyHeader() {
  var e = document.querySelector("#brx-header.sticky");
  if (!e) return;
  var t,
    r,
    i = document.querySelector(".bricks-site-logo"),
    s = -1,
    o = e.hasAttribute("data-slide-up-after") ? e.getAttribute("data-slide-up-after") : 0;
  i && (t = i.getAttribute("data-bricks-logo"), r = i.getAttribute("data-bricks-logo-inverse"));
  var a = function a() {
    var a = window.pageYOffset;
    a > 0 ? (e.classList.add("scrolling"), i && r && (i.src = r, i.srcset = "")) : (e.classList.remove("scrolling"), i && r && (i.src = t)), o && (a > s && s >= 0 ? a > o && e.classList.add("slide-up") : e.classList.remove("slide-up")), s = a;
  };
  window.addEventListener("scroll", a), a();
}
function bricksNavSubmenuPositioning() {
  var e = document.querySelector(".bricks-nav-menu");
  e && bricksQuerySelectorAll(e, ".sub-menu").forEach(function (e) {
    var t = e.getBoundingClientRect();
    t.width + t.right >= (window.innerWidth || document.documentElement.clientWidth) && e.classList.add("overflows-viewport");
  });
}
function bricksOnePageNavigation() {
  var e = document.getElementById("bricks-one-page-navigation");
  if (!bricksIsFrontend || !e) return;
  var t = bricksQuerySelectorAll(document, "#brx-content > *"),
    r = [],
    i = "",
    s = "",
    o = "";
  function a() {
    var e = window.scrollY;
    r.forEach(function (t) {
      var r = document.getElementById(t),
        i = r.offsetTop,
        s = i + r.offsetHeight;
      e >= i - 1 && e < s - 1 ? document.querySelector(".bricks-one-page-".concat(t)).classList.add("active") : document.querySelector(".bricks-one-page-".concat(t)).classList.remove("active");
    });
  }
  t && (t.forEach(function (t) {
    i = t.getAttribute("id"), i && (r.push(i), o = document.createElement("li"), s = document.createElement("a"), s.classList.add("bricks-one-page-".concat(i)), s.setAttribute("href", "#".concat(i)), o.appendChild(s), e.appendChild(o));
  }), window.addEventListener("load", a), window.addEventListener("resize", a), document.addEventListener("scroll", a));
}
function bricksSmoothScroll() {
  bricksQuerySelectorAll(document, 'a[href^="#"]:not([href="#"])').forEach(function (e) {
    e.addEventListener("click", function (t) {
      t.preventDefault();
      var r = e.href.split("#")[1];
      document.getElementById(r) && document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth"
      });
    });
  });
}
function bricksSearchOverlay() {
  var e = bricksQuerySelectorAll(document, ".brxe-search");
  e && e.forEach(function (e) {
    var t = e.querySelector(".overlay-trigger");
    if (!t) return;
    var r = e.querySelector(".bricks-search-overlay");
    r && (document.addEventListener("keyup", function (e) {
      "Escape" === e.key && r.classList.remove("show");
    }), t.addEventListener("click", function (t) {
      r.classList.toggle("show"), setTimeout(function () {
        e.querySelector("input[type=search]").focus();
      }, 200);
    }), r.querySelector(".close").addEventListener("click", function (e) {
      r.classList.toggle("show");
    }));
  });
}
function bricksHandleA11yMenu(e) {
  var t,
    r,
    i = bricksQuerySelectorAll(e, '[role="menubar"] > li > a'),
    s = bricksQuerySelectorAll(e, '[role="menubar"] [aria-haspopup="true"] .sub-menu li a'),
    o = 9,
    a = 13,
    n = 32,
    c = function c(e) {
      return (e = t + e) == i.length || e < 0 || (t = e, i[e].focus(), !1);
    },
    l = function l(e, t) {
      r += t;
      var i = e.querySelectorAll("li > a"),
        s = !1;
      return r >= i.length ? (s = c(1), d(), s) : r < 0 ? (s = c(-1), d(), s) : (i[r].focus(), !1);
    },
    d = function d() {
      i.forEach(function (e, t) {
        e.parentNode.setAttribute("aria-expanded", "false");
      });
    };
  i.forEach(function (e, i) {
    e.parentNode.setAttribute("data-top-index", i), e.addEventListener("mousedown", function () {
      e.setAttribute("data-mouse-focus", "true");
    }), e.addEventListener("focus", function () {
      var r = "true" === e.getAttribute("data-mouse-focus");
      e.removeAttribute("data-mouse-focus"), r || (d(), t = parseInt(e.parentNode.getAttribute("data-top-index")));
    }), e.addEventListener("keydown", function (t) {
      var i = !1;
      switch (t.keyCode) {
        case n:
          r = -1, "true" === e.parentNode.getAttribute("aria-haspopup") && ("true" === e.parentNode.getAttribute("aria-expanded") ? e.parentNode.setAttribute("aria-expanded", "false") : (e.parentNode.setAttribute("aria-expanded", "true"), bricksQuerySelectorAll(e.parentNode, ".sub-menu li").forEach(function (e, t) {
            e.setAttribute("aria-expanded", "true");
          }))), i = !0;
          break;
        case o:
          var _s2 = !1;
          if ("true" !== e.parentNode.getAttribute("aria-expanded") || t.shiftKey) _s2 = t.shiftKey ? c(-1) : c(1);else {
            var _e3 = this.parentNode.querySelector("ul");
            _s2 = l(_e3, 1);
          }
          if (_s2) return !0;
          i = !0;
      }
      i && t.preventDefault();
    });
  }), s.forEach(function (e, t) {
    e.setAttribute("tabindex", "-1"), e.addEventListener("keydown", function (e) {
      var t = !1;
      switch (e.keyCode) {
        case o:
          var _r2 = !1;
          if (_r2 = e.shiftKey ? l(this.parentNode.parentNode, -1) : l(this.parentNode.parentNode, 1), _r2) return !0;
          t = !0;
          break;
        case a:
          return !0;
      }
      return t && (e.preventDefault(), e.stopPropagation()), !1;
    });
  });
}
function bricksNavMenuA11y() {
  bricksQuerySelectorAll(document, ".bricks-nav-menu-wrapper").forEach(function (e) {
    bricksHandleA11yMenu(e);
  });
}
function bricksMobileMenuToggles() {
  bricksQuerySelectorAll(document, ".bricks-mobile-menu-toggle").forEach(function (e) {
    var t = e.closest(".brxe-nav-menu");
    bricksHandleA11yMenu(t.querySelector(".bricks-mobile-menu-wrapper")), e.addEventListener("click", function (e) {
      t.classList.toggle("show-mobile-menu"), bricksMobileMenuBodyNoScroll();
    }, !1);
  }), document.addEventListener("click", function (e) {
    var t = e.target.closest(".brxe-nav-menu");
    if (t && e.target.classList.contains("bricks-mobile-menu-overlay")) return t.classList.remove("show-mobile-menu"), void bricksMobileMenuBodyNoScroll();
    if ("A" === e.target.tagName && e.target.parentNode.classList.contains("menu-item-has-children") && "false" == e.target.parentNode.getAttribute("aria-expanded") && document.querySelector(".show-mobile-menu")) return e.preventDefault(), e.stopPropagation(), void e.target.parentNode.setAttribute("aria-expanded", !0);
    if (e.target.closest(".bricks-mobile-menu-wrapper")) {
      var r = "A" === e.target.tagName ? e.target : e.target.querySelector("a");
      t && r && -1 !== r.getAttribute("href").indexOf("#") && t.classList.remove("show-mobile-menu"), bricksMobileMenuBodyNoScroll();
    }
  }), bricksQuerySelectorAll(document, ".bricks-mobile-submenu-toggle").forEach(function (e) {
    e.addEventListener("click", function (e) {
      var t = e.target.closest("li.menu-item-has-children"),
        r = t.getAttribute("aria-expanded");
      t.setAttribute("aria-expanded", "false" === r ? "true" : "false");
    });
  });
}
function bricksMobileMenuBodyNoScroll() {
  document.querySelector(".show-mobile-menu") ? document.body.classList.add("no-scroll") : document.body.classList.remove("no-scroll");
}
function bricksAlertDismiss() {
  alertDismissables = bricksQuerySelectorAll(document, ".brxe-alert svg"), alertDismissables.forEach(function (e) {
    e.addEventListener("click", function () {
      e.closest(".brxe-alert").remove();
    });
  });
}
function bricksTabs() {
  var e = bricksQuerySelectorAll(document, ".brxe-tabs"),
    t = bricksQuerySelectorAll(document, ".brxe-tabs-nested");
  t.length && (e = e.concat(t)), e.forEach(function (e) {
    var t = bricksQuerySelectorAll(e, ".tab-title");
    t.forEach(function (r, i) {
      0 === i && r.classList.add("brx-open");
      var s = bricksQuerySelectorAll(e, ".tab-pane");
      s.forEach(function (e, t) {
        0 === t && e.classList.add("brx-open");
      }), r.addEventListener("click", function () {
        t.forEach(function (e, t) {
          t === i ? r.classList.add("brx-open") : e.classList.remove("brx-open");
        }), s.forEach(function (e, t) {
          t === i ? e.classList.add("brx-open") : e.classList.remove("brx-open");
        });
      });
    });
  });
}
function bricksLightbox() {
  var e = bricksQuerySelectorAll(document, '[data-link="lightbox"]');
  if (!e.length) return;
  var t = document.getElementById("bricks-lightbox"),
    r = !!t && t.querySelector(".inner"),
    i = !!t && t.querySelector(".close");
  t || (t = document.createElement("div"), t.id = "bricks-lightbox", document.body.appendChild(t), r || (r = document.createElement("div"), r.classList.add("inner"), t.appendChild(r)), i || (i = document.createElement("div"), i.classList.add("close"), i.innerText = "×", t.appendChild(i))), t.addEventListener("click", function (e) {
    ("bricks-lightbox" === e.target.id || e.target.classList.contains("inner") || e.target.classList.contains("close")) && (t.classList.remove("show"), r.innerHTML = "");
  }), document.onkeydown = function (e) {
    "Escape" === e.key && (t.classList.remove("show"), r.innerHTML = "");
  }, e.forEach(function (e) {
    var i = !1;
    e.addEventListener("click", function (s) {
      s.preventDefault();
      var o = e.dataset.bricksLightboxImageUrl;
      if (o) {
        i = !0;
        var _e4 = document.createElement("img");
        _e4.src = o, r.appendChild(_e4);
      }
      var a = e.dataset.bricksLightboxVideoUrl;
      if (a) {
        i = !0;
        var _e5 = !1;
        if (-1 !== a.indexOf("youtube.com") && (_e5 = !0, a = a.replace("watch?v=", "embed/"), a += "?autoplay=1", a += "&rel=0"), -1 !== a.indexOf("vimeo.com") && (_e5 = !0, -1 === a.indexOf("player.vimeo.com/video") && (a = a.replace("vimeo.com", "player.vimeo.com/video")), a += "?autoplay=1"), _e5) {
          var _e6 = document.createElement("iframe");
          _e6.setAttribute("src", a), _e6.setAttribute("allow", "autoplay"), _e6.setAttribute("allowfullscreen", 1), r.appendChild(_e6);
        } else {
          var _e7 = document.createElement("video");
          _e7.setAttribute("src", a), _e7.setAttribute("autoplay", 1), _e7.setAttribute("controls", 1), _e7.setAttribute("playsinline", 1), r.appendChild(_e7);
        }
      }
      i && t.classList.add("show");
    });
  });
}
function bricksVideoOverlayClickDetector() {
  if (!bricksIsFrontend) return;
  var e = bricksQuerySelectorAll(document, ".bricks-video-overlay"),
    t = bricksQuerySelectorAll(document, ".bricks-video-overlay-icon");
  bricksVideoOverlayElements = e.concat(t), bricksVideoOverlayElements.length && bricksVideoOverlayElements.forEach(function (e) {
    e.addEventListener("click", function (e) {
      var t = e.target.closest(".brxe-video");
      if (!t) return;
      var r = t.querySelector("iframe");
      r && r.getAttribute("src") && (r.src += "&autoplay=1");
      var i = t.querySelector("video");
      i && i.play();
    });
  });
}
function bricksBackgroundVideoInit() {
  var e = bricksQuerySelectorAll(document, ".bricks-background-video-wrapper");
  e && e.forEach(function (e) {
    if (e.classList.contains("loaded") || e.querySelector("iframe")) return;
    var t = e.getAttribute("data-background-video-url"),
      r = e.getAttribute("data-background-video-scale"),
      i = !1;
    if (!t) return;
    var s,
      o = e.getAttribute("data-background-video-ratio") || "16:9",
      a = parseInt(o.split(":")[0] || 16),
      n = parseInt(o.split(":")[1] || 9);
    if (-1 !== t.indexOf("youtube.com")) {
      i = !0;
      var _e8 = t.lastIndexOf("="),
        _r3 = t.slice(_e8 + 1);
      t += "?origin=".concat(window.location.origin), t += "&rel=0", t += "&autoplay=1", t += "&mute=1", t += "&widgetid=1", t += "&controls=0", t += "&showinfo=0", t += "&modestbranding=1", t += "&cc_load_policy=0", t += "&iv_load_policy=3", t += "&autohide=0", t += "&loop=1", t += "&playlist=".concat(_r3), t += "&enablejsapi=1", t = t.replace("watch?v=", "embed/");
    }
    -1 !== t.indexOf("vimeo.com") && (i = !0, t += "?background=1", t += "&byline=0", t += "&portrait=0", t += "&title=0", -1 === t.indexOf("player.vimeo.com/video") && (t = t.replace("vimeo.com", "player.vimeo.com/video"))), i ? (s = document.createElement("iframe"), s.setAttribute("width", 640), s.setAttribute("height", 360), s.setAttribute("src", t), s.setAttribute("allow", "autoplay"), s.setAttribute("allowfullscreen", 1), r && (s.style.transform = "scale(".concat(r, ")")), e.removeChild(e.querySelector("video"))) : (s = e.querySelector("video"), r && (s.style.transform = "scale(".concat(r, ")"))), bricksIsFrontend ? e.classList.contains("bricks-lazy-video") && new BricksIntersect({
      element: e,
      callback: function callback(e) {
        e.classList.remove("bricks-lazy-video"), i ? e.appendChild(s) : s.src = t;
      }
    }) : i ? e.appendChild(s) : s.src = t, e.classList.add("loaded"), new ResizeObserver(function (t) {
      var _iterator = _createForOfIteratorHelper(t),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _r4 = _step.value;
          var _t4 = void 0;
          if (_r4.contentBoxSize) {
            _t4 = (Array.isArray(_r4.contentBoxSize) ? _r4.contentBoxSize[0] : _r4.contentBoxSize).inlineSize;
          } else _t4 = _r4.contentRect.width;
          var _i2 = e.clientHeight,
            _o = _t4 * n / a;
          _o < _i2 && (_o = _i2, _t4 = _i2 * a / n), s.style.width = "".concat(_t4, "px"), s.style.height = "".concat(_o, "px");
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }).observe(e);
  });
}
function bricksPhotoswipe() {
  var e = document.querySelector(".pswp");
  if (!e) return;
  var t = bricksQuerySelectorAll(document, ".bricks-lightbox");
  if (!t) return;
  var r = {};
  t.forEach(function (t) {
    var _t$dataset, _t$dataset2, _t$dataset3, _t$dataset4, _t$dataset5, _t$dataset6;
    if (t.classList.contains("pswp-init") || t.parentNode.classList.contains("swiper-slide-duplicate")) return;
    var i = (_t$dataset = t.dataset) === null || _t$dataset === void 0 ? void 0 : _t$dataset.bricksLightboxId,
      s = parseInt((_t$dataset2 = t.dataset) === null || _t$dataset2 === void 0 ? void 0 : _t$dataset2.bricksLightboxIndex) || 0;
    (r === null || r === void 0 ? void 0 : r[i]) || (r[i] = []);
    var o = ((_t$dataset3 = t.dataset) === null || _t$dataset3 === void 0 ? void 0 : _t$dataset3.bricksLightboxSource) || ((_t$dataset4 = t.dataset) === null || _t$dataset4 === void 0 ? void 0 : _t$dataset4.src) || t.src;
    if (!o) return;
    var a = ((_t$dataset5 = t.dataset) === null || _t$dataset5 === void 0 ? void 0 : _t$dataset5.bricksLightboxWidth) || t.width,
      n = ((_t$dataset6 = t.dataset) === null || _t$dataset6 === void 0 ? void 0 : _t$dataset6.bricksLightboxHeight) || t.height;
    r[i][s] = {
      src: o,
      w: a,
      h: n
    }, t.addEventListener("click", function (t) {
      var _t$target$dataset;
      if (!t.target.classList.contains("bricks-lightbox")) return 1;
      t.stopPropagation();
      var i = (_t$target$dataset = t.target.dataset) === null || _t$target$dataset === void 0 ? void 0 : _t$target$dataset.bricksLightboxId,
        s = r === null || r === void 0 ? void 0 : r[i];
      if (!s) return;
      new PhotoSwipe(e, PhotoSwipeUI_Default, s, {
        bgOpacity: .9,
        showHideOpacity: !0,
        index: parseInt(t.target.dataset.bricksLightboxIndex) || 0
      }).init();
    }), t.classList.add("pswp-init");
  });
}
function bricksAccordion() {
  var e = bricksQuerySelectorAll(document, ".brxe-accordion"),
    t = bricksQuerySelectorAll(document, ".brxe-accordion-nested");
  if (t.length && (e = e.concat(t)), !e.length) return;
  var r = function r(e) {
      var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 200;
      e.style.transitionProperty = "height, margin, padding", e.style.transitionDuration = "".concat(t, "ms"), e.style.height = "".concat(e.offsetHeight, "px"), e.offsetHeight, e.style.overflow = "hidden", e.style.height = 0, e.style.paddingTop = 0, e.style.paddingBottom = 0, e.style.marginTop = 0, e.style.marginBottom = 0, window.setTimeout(function () {
        e.style.display = "none", e.style.removeProperty("height"), e.style.removeProperty("padding-top"), e.style.removeProperty("padding-bottom"), e.style.removeProperty("margin-top"), e.style.removeProperty("margin-bottom"), e.style.removeProperty("overflow"), e.style.removeProperty("transition-duration"), e.style.removeProperty("transition-property");
      }, t);
    },
    i = function i(e) {
      var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 200;
      return "none" === window.getComputedStyle(e).display ? function (e) {
        var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 200;
        e.style.removeProperty("display");
        var r = window.getComputedStyle(e).display;
        "none" === r && (r = "block"), e.style.display = r;
        var i = e.offsetHeight;
        e.style.overflow = "hidden", e.style.height = 0, e.style.paddingTop = 0, e.style.paddingBottom = 0, e.style.marginTop = 0, e.style.marginBottom = 0, e.offsetHeight, e.style.transitionProperty = "height, margin, padding", e.style.transitionDuration = "".concat(t, "ms"), e.style.height = "".concat(i, "px"), e.style.removeProperty("padding-top"), e.style.removeProperty("padding-bottom"), e.style.removeProperty("margin-top"), e.style.removeProperty("margin-bottom"), window.setTimeout(function () {
          e.style.removeProperty("height"), e.style.removeProperty("overflow"), e.style.removeProperty("transition-duration"), e.style.removeProperty("transition-property");
        }, t);
      }(e, t) : r(e, t);
    };
  e.forEach(function (e) {
    var t = Array.from(e.children),
      s = e.hasAttribute("data-transition") ? isNaN(e.dataset.transition) ? 0 : e.dataset.transition : 200;
    t = t.filter(function (e) {
      return e.classList.contains("brxe-section") || e.classList.contains("brxe-container") || e.classList.contains("brxe-block") || e.classList.contains("brxe-div") || e.classList.contains("accordion-item");
    }), t.forEach(function (t, o) {
      var _e$dataset$scriptArgs;
      0 === o && (_e$dataset$scriptArgs = e.dataset.scriptArgs) !== null && _e$dataset$scriptArgs !== void 0 && _e$dataset$scriptArgs.includes("expandFirstItem") && t.classList.add("brx-open"), t.classList.contains("listening") || (t.classList.add("listening"), t.addEventListener("click", function (t) {
        t.stopPropagation();
        var o = t.target.closest(".accordion-title-wrapper");
        if (!o) return;
        var a = o.parentNode;
        if (!a) return;
        var n = a.querySelector(".accordion-content-wrapper");
        if (n) {
          var _e$dataset$scriptArgs2;
          if (!((_e$dataset$scriptArgs2 = e.dataset.scriptArgs) !== null && _e$dataset$scriptArgs2 !== void 0 && _e$dataset$scriptArgs2.includes("independentToggle"))) {
            var _t5 = e.querySelector(".brx-open");
            if (_t5) {
              var _e9 = _t5.querySelector(".accordion-content-wrapper");
              _e9 && _e9 !== n && (_t5.classList.remove("brx-open"), r(_e9, s));
            }
          }
          i(n, s), a.classList.toggle("brx-open");
        }
      }));
    });
  });
}
function bricksAnimatedTyping() {
  bricksQuerySelectorAll(document, ".brxe-animated-typing").forEach(function (e) {
    var t,
      r = e.dataset.scriptId;
    try {
      t = JSON.parse(e.dataset.scriptArgs);
    } catch (e) {
      return !1;
    }
    var i = e.querySelector(".typed");
    i && (window.bricksData.animatedTypingInstances[r] && window.bricksData.animatedTypingInstances[r].destroy(), t.hasOwnProperty("strings") && t.strings && (Array.isArray(t.strings) && !t.strings.toString() || (window.bricksData.animatedTypingInstances[r] = new Typed(i, t))));
  });
}
function bricksAudio() {
  bricksQuerySelectorAll(document, ".brxe-audio").forEach(function (e) {
    var t = e.querySelector("audio");
    if (t) {
      new MediaElementPlayer(t);
    }
  });
}
function bricksCountdown() {
  var e = function e(_e12, t, r) {
    var i = t.date.replace(" ", "T"),
      s = new Date(i).getTime() - new Date().getTime();
    if (s <= 0) {
      if (clearInterval(_e12.dataset.bricksCountdownId), "hide" === t.action) return void (_e12.innerHTML = "");
      if ("text" === t.action) return void (_e12.innerHTML = t.actionText);
    }
    r && (_e12.innerHTML = "", t.fields.forEach(function (t) {
      if (!t.format) return;
      var r = document.createElement("div");
      if (r.classList.add("field"), t.prefix) {
        var _e10 = document.createElement("span");
        _e10.classList.add("prefix"), _e10.innerHTML = t.prefix, r.appendChild(_e10);
      }
      var i = document.createElement("span");
      if (i.classList.add("format"), r.appendChild(i), t.suffix) {
        var _e11 = document.createElement("span");
        _e11.classList.add("suffix"), _e11.innerHTML = t.suffix, r.appendChild(_e11);
      }
      _e12.appendChild(r);
    }));
    var o = bricksQuerySelectorAll(_e12, ".field"),
      a = Math.floor(s / 864e5),
      n = Math.floor(s % 864e5 / 36e5),
      c = Math.floor(s % 36e5 / 6e4),
      l = Math.floor(s % 6e4 / 1e3);
    t.fields.forEach(function (e, t) {
      if (!e.format) return;
      var r = e.format.toLowerCase();
      r.includes("%d") ? (e.format.includes("%D") && a <= 9 && (a = "0".concat(a)), o[t].querySelector(".format").innerHTML = r.replace("%d", s <= 0 ? 0 : a)) : r.includes("%h") ? (e.format.includes("%H") && n <= 9 && (n = "0".concat(n)), o[t].querySelector(".format").innerHTML = r.replace("%h", s <= 0 ? 0 : n)) : r.includes("%m") ? (e.format.includes("%M") && c <= 9 && (c = "0".concat(c)), o[t].querySelector(".format").innerHTML = r.replace("%m", s <= 0 ? 0 : c)) : r.includes("%s") && (e.format.includes("%S") && l <= 9 && (l = "0".concat(l)), o[t].querySelector(".format").innerHTML = r.replace("%s", s <= 0 ? 0 : l));
    });
  };
  bricksQuerySelectorAll(document, ".brxe-countdown").forEach(function (t) {
    var r = t.dataset.bricksCountdownOptions;
    try {
      r = JSON.parse(r);
    } catch (e) {
      return !1;
    }
    if (r.hasOwnProperty("date") && r.hasOwnProperty("fields")) {
      var i = t.dataset.bricksCountdownId;
      i && clearInterval(i), e(t, r, !0), i = setInterval(e, 1e3, t, r, !1), t.dataset.bricksCountdownId = i;
    }
  });
}
function bricksCounter() {
  bricksQuerySelectorAll(document, ".brxe-counter").forEach(function (e) {
    var t = e.dataset.bricksCounterOptions;
    try {
      t = JSON.parse(t);
    } catch (e) {
      return !1;
    }
    var r = e.querySelector(".count"),
      i = t.hasOwnProperty("countFrom") ? parseInt(t.countFrom) : 0,
      s = t.hasOwnProperty("countTo") ? parseInt(t.countTo) : 100,
      o = t.hasOwnProperty("duration") ? parseInt(t.duration) : 1e3;
    o < 500 && (o = 500);
    var a = o / (s - i),
      n = 1;
    a < 4 && (n = Math.ceil(4 / a), a = 4);
    var c = function c() {
      var e = r.innerText.replace(/\D/g, "");
      e = isNaN(e) ? i : parseInt(e);
      var o = e + n < s ? e + n : s;
      if (e >= s) return clearInterval(r.dataset.counterId), void delete r.dataset.counterId;
      r.innerText = t.thousands ? o.toLocaleString() : o;
    };
    new BricksIntersect({
      element: e,
      callback: function callback() {
        r.innerText = i, r.dataset.counterId || (r.dataset.counterId = setInterval(c, a));
      }
    });
  });
}
function bricksForm() {
  bricksQuerySelectorAll(document, ".brxe-form").forEach(function (e) {
    var t = e.getAttribute("data-element-id");
    bricksQuerySelectorAll(e, 'input[type="checkbox"]').forEach(function (t) {
      t.required && t.addEventListener("click", function (r) {
        var i = t.getAttribute("name"),
          s = bricksQuerySelectorAll(e, "input[name=\"".concat(i, "\"]")),
          o = !1;
        s.forEach(function (e) {
          !0 === e.checked && (o = !0);
        }), o ? s.forEach(function (e) {
          e.required = !1;
        }) : s.forEach(function (e) {
          e.required = !0;
        });
      });
    }), bricksQuerySelectorAll(e, ".flatpickr").forEach(function (e) {
      var t = e.dataset.bricksDatepickerOptions;
      t && (t = JSON.parse(t), flatpickr(e, t));
    });
    var r = {};
    bricksQuerySelectorAll(e, "input[type=file]").forEach(function (t) {
      var i = t.getAttribute("data-files-ref"),
        s = t.getAttribute("data-maxsize") || !1,
        o = t.getAttribute("data-limit") || !1;
      s = !!s && 1024 * parseInt(s) * 1024, t.addEventListener("change", function (a) {
        var n = a.target.files,
          c = n.length,
          l = t.getAttribute("name");
        if (!c) return;
        var d = e.querySelector(".file-result[data-files-ref=\"".concat(i, "\"]"));
        var _loop = function _loop(_e13) {
          var t = n[_e13],
            i = !1,
            a = d.cloneNode(!0);
          if (o && r.hasOwnProperty(l) && r[l].length >= o && (i = "limit"), s && t.size > s && (i = "size"), i) a.classList.add("danger"), a.innerHTML = a.getAttribute("data-error-".concat(i)).replace("%s", t.name), setTimeout(function () {
            a.remove();
          }, 5e3);else {
            r.hasOwnProperty(l) || (r[l] = []), r[l].push(t), a.classList.add("show");
            var _e14 = a.querySelector(".text"),
              _i3 = a.querySelector(".remove");
            _e14.innerHTML = t.name, _i3.setAttribute("data-name", t.name), _i3.setAttribute("data-field", l), _i3.addEventListener("click", function (e) {
              var t = e.target.getAttribute("data-name"),
                i = e.target.getAttribute("data-field"),
                s = r[i];
              for (var _e15 = 0; _e15 < s.length; _e15++) {
                if (s[_e15].name === t) {
                  r[l].splice(_e15, 1);
                  break;
                }
              }
              a.remove();
            });
          }
          d.parentNode.insertBefore(a, d.nextSibling);
        };
        for (var _e13 = 0; _e13 < c; _e13++) {
          _loop(_e13);
        }
      });
    }), e.addEventListener("submit", function (i) {
      if (i.preventDefault(), !bricksIsFrontend) return;
      var s = document.getElementById("recaptcha-".concat(t)),
        o = e.querySelector(".recaptcha-error");
      if (!s) return void bricksSubmitForm(t, e, r, null);
      var a = s.getAttribute("data-key");
      if (a) try {
        grecaptcha.ready(function () {
          try {
            grecaptcha.execute(a, {
              action: "bricks_form_submit"
            }).then(function (i) {
              o.classList.remove("show"), bricksSubmitForm(t, e, r, i);
            })["catch"](function (t) {
              o.classList.add("show"), e.querySelector(".alert").innerText = "Google reCaptcha ".concat(t);
            });
          } catch (t) {
            o.classList.add("show"), e.querySelector(".alert").innerText = "Google reCaptcha ".concat(t);
          }
        });
      } catch (t) {
        o.classList.add("show"), e.querySelector(".alert").innerText = "Google reCaptcha ".concat(t);
      } else o.classList.add("show");
    });
  });
}
function bricksSubmitForm(e, t, r, i) {
  var s = t.querySelector("button[type=submit]");
  s.classList.add("sending");
  var o = new FormData(t);
  o.append("action", "bricks_form_submit"), o.append("postId", window.bricksData.postId), o.append("formId", e), o.append("recaptchaToken", i || ""), o.append("nonce", window.bricksData.nonce), o.append("referrer", location.toString());
  var _loop2 = function _loop2(_e16) {
    r[_e16].forEach(function (t) {
      o.append("".concat(_e16, "[]"), t, t.name);
    });
  };
  for (var _e16 in r) {
    _loop2(_e16);
  }
  var a = window.bricksData.ajaxUrl,
    n = new XMLHttpRequest();
  n.open("POST", a, !0), n.onreadystatechange = function () {
    var e = function (e) {
      try {
        return JSON.parse(e);
      } catch (e) {
        return null;
      }
    }(n.response);
    if (window.bricksData.debug && console.warn("bricks_form_submit", n, e), !e) return;
    e.success && e.data.hasOwnProperty("action") && ("mailchimp" === e.data.action || "sendgrid" === e.data.action) && (window.dataLayer = window.dataLayer || [], window.dataLayer.push({
      event: "bricksNewsletterSignup"
    })), e.success && e.data.hasOwnProperty("redirectTo") && (e.data.hasOwnProperty("redirectTimeout") ? setTimeout(function () {
      window.location.href = e.data.redirectTo;
    }, parseInt(e.data.redirectTimeout)) : window.location.href = e.data.redirectTo), t.querySelector(".message") && t.querySelector(".message").remove();
    var i = document.createElement("div");
    i.classList.add("message");
    var o = document.createElement("div");
    if (o.classList.add("text"), e.data.hasOwnProperty("message")) if (e.data.message.hasOwnProperty("errors")) {
      var _t6 = e.data.message.errors;
      Object.keys(_t6).forEach(function (e) {
        o.innerHTML += _t6[e][0] + "<br>";
      });
    } else o.innerHTML = e.data.message;
    if (i.appendChild(o), e.data.hasOwnProperty("info")) {
      var _t7 = document.createElement("div"),
        _r5 = document.createElement("div");
      _r5.innerHTML = e.data.info.join("<br>"), i.appendChild(_t7), _t7.appendChild(_r5);
    } else i.classList.add(e.data.type);
    if (t.appendChild(i), s.classList.remove("sending"), e.success) {
      t.reset(), r = {};
      var _e17 = bricksQuerySelectorAll(t, ".file-result");
      null !== _e17 && _e17.forEach(function (e) {
        e.remove();
      });
    }
  }, n.send(o);
}
function bricksIsotope() {
  bricksQuerySelectorAll(document, ".bricks-layout-wrapper.isotope").forEach(function (e) {
    var t = {
        itemSelector: ".bricks-layout-item",
        percentPosition: !0
      },
      r = e.getAttribute("data-layout");
    "grid" === r ? (t.layoutMode = "fitRows", t.fitRows = {
      gutter: ".bricks-gutter-sizer"
    }) : "masonry" !== r && "metro" !== r || (t.masonry = {
      columnWidth: ".bricks-isotope-sizer",
      gutter: ".bricks-gutter-sizer"
    });
    var i = new Isotope(e, t),
      s = e.parentNode.querySelector(".bricks-isotope-filters");
    s && s.addEventListener("click", function (e) {
      var t = e.target.getAttribute("data-filter"),
        r = s.querySelector("li.active");
      t && bricksIsFrontend && (r && r.classList.remove("active"), e.target.classList.add("active"), i.arrange({
        filter: t
      }));
    });
  });
}
function bricksMap() {
  bricksQuerySelectorAll(document, ".brxe-map").forEach(function (e, t) {
    setTimeout(function () {
      var t = function () {
        var t = e.dataset.bricksMapOptions;
        if (!t) return !1;
        try {
          return JSON.parse(t);
        } catch (e) {
          return !1;
        }
      }();
      if (!t) return;
      var r = Array.isArray(t === null || t === void 0 ? void 0 : t.addresses) ? t.addresses : [{
          address: "Berlin, Germany"
        }],
        i = [],
        s = {};
      (t === null || t === void 0 ? void 0 : t.marker) && (s.icon = {
        url: t.marker
      }, (t === null || t === void 0 ? void 0 : t.markerHeight) && (t === null || t === void 0 ? void 0 : t.markerWidth) && (s.icon.scaledSize = new google.maps.Size(parseInt(t.markerWidth), parseInt(t.markerHeight))));
      var o = {};
      (t === null || t === void 0 ? void 0 : t.markerActive) && (o = {
        url: t.markerActive
      }, (t === null || t === void 0 ? void 0 : t.markerActiveHeight) && (t === null || t === void 0 ? void 0 : t.markerActiveWidth) && (o.scaledSize = new google.maps.Size(parseInt(t.markerActiveWidth), parseInt(t.markerActiveHeight))));
      var a = [],
        n = new google.maps.LatLngBounds(),
        c = "auto";
      t.draggable ? t.scrollwheel && t.draggable ? c = "cooperative" : !t.scrollwheel && t.draggable && (c = "greedy") : c = "none", t.disableDefaultUI && (t.fullscreenControl = !1, t.mapTypeControl = !1, t.streetViewControl = !1, t.zoomControl = !1);
      var l = t.zoom ? parseInt(t.zoom) : 12,
        d = {
          zoom: l,
          gestureHandling: c,
          fullscreenControl: t.fullscreenControl,
          mapTypeControl: t.mapTypeControl,
          streetViewControl: t.streetViewControl,
          zoomControl: t.zoomControl,
          disableDefaultUI: t.disableDefaultUI
        };
      t.zoomControl && (t !== null && t !== void 0 && t.maxZoom && (d.maxZoom = parseInt(t.maxZoom)), (t === null || t === void 0 ? void 0 : t.minZoom) && (d.minZoom = parseInt(t.minZoom)));
      var u = new google.maps.Map(e, d);
      for (var _e18 = 0; _e18 < r.length; _e18++) {
        var _t8 = r[_e18];
        if (_t8 !== null && _t8 !== void 0 && _t8.latitude && _t8 !== null && _t8 !== void 0 && _t8.longitude) b(_t8, {
          lat: parseFloat(_t8.latitude),
          lng: parseFloat(_t8.longitude)
        });else if (_t8 !== null && _t8 !== void 0 && _t8.address) {
          new google.maps.Geocoder().geocode({
            address: _t8.address
          }, p(_t8));
        }
      }
      function p(e) {
        return function (t, r) {
          if ("OK" !== r) return void console.warn("Geocode error:", r);
          var i = t[0].geometry.location;
          b(e, i);
        };
      }
      function b(e, t) {
        s.map = u, s.position = t;
        var c = new google.maps.Marker(s);
        if (c.setMap(u), i.push(c), google.maps.event.addListener(c, "click", function () {
          !function (e) {
            var _o2, _m;
            (s === null || s === void 0 ? void 0 : s.icon) && i.forEach(function (e) {
              e.setIcon(s.icon);
            });
            a.forEach(function (e) {
              e.hide();
            }), ((_o2 = o) === null || _o2 === void 0 ? void 0 : _o2.url) && c.setIcon(o);
            var l = "",
              d = (e === null || e === void 0 ? void 0 : e.infoTitle) || !1,
              p = (e === null || e === void 0 ? void 0 : e.infoSubtitle) || !1,
              b = (e === null || e === void 0 ? void 0 : e.infoOpeningHours) || !1,
              m = (e === null || e === void 0 ? void 0 : e.infoImages) || {};
            Array.isArray(m) || (m = Array.isArray((_m = m) === null || _m === void 0 ? void 0 : _m.images) ? m.images : []);
            d && (l += "<h3 class=\"title\">".concat(d, "</h3>"));
            p && (l += "<p class=\"subtitle\">".concat(p, "</p>"));
            b && (l += '<ul class="content">', b = b.split("\n"), b.length && b.forEach(function (e) {
              l += "<li>".concat(e, "</li>");
            }), l += "</ul>");
            m.length && (l += '<ul class="images">', m.forEach(function (t, r) {
              l += "<li>", t.url && (l += "<img\n\t\t\t\t\t\t\t\t\tsrc=\"".concat(t.url, "\"\n\t\t\t\t\t\t\t\t\tclass=\"bricks-lightbox\"\n\t\t\t\t\t\t\t\t\tdata-bricks-lightbox-source=\"").concat(t.full, "\"\n\t\t\t\t\t\t\t\t\tdata-bricks-lightbox-height=\"376\"\n\t\t\t\t\t\t\t\t\tdata-bricks-lightbox-width=\"376\"\n\t\t\t\t\t\t\t\t\tdata-bricks-lightbox-index=\"").concat(r, "\"\n\t\t\t\t\t\t\t\t\tdata-bricks-lightbox-id=\"").concat(e.id, "\"\n\t\t\t\t\t\t\t\t/>")), l += "</li>";
            }), l += "</ul>");
            if (l) {
              var _e19 = {
                content: l,
                disableAutoPan: !1,
                pixelOffset: new google.maps.Size(0, 0),
                alignBottom: !1,
                infoBoxClearance: new google.maps.Size(20, 20),
                enableEventPropagation: !1,
                zIndex: 1001,
                boxStyle: {
                  opacity: 1,
                  zIndex: 999,
                  top: 0,
                  left: 0
                }
              };
              void 0 !== window.jQuery && (_e19.closeBoxURL = "", _e19.content += '<span class="close">×</span>');
              var _i4 = new InfoBox(_e19);
              _i4.open(u, c), a.push(_i4), u.panTo(_i4.getPosition()), google.maps.event.addListener(_i4, "domready", function (e) {
                void 0 !== window.jQuery && jQuery(".close").on("click", function () {
                  _i4.close(), s !== null && s !== void 0 && s.icon && c.setIcon(s.icon), r.length > 1 && (n.extend(t), u.fitBounds(n), u.panToBounds(n));
                });
              });
            }
          }(e);
        }), n.extend(t), u.fitBounds(n), u.panToBounds(n), 1 === r.length) {
          var _e20 = google.maps.event.addListener(u, "idle", function () {
            u.setZoom(l), google.maps.event.removeListener(_e20);
          });
        }
      }
      if (t !== null && t !== void 0 && t.type && u.setMapTypeId(t.type), t !== null && t !== void 0 && t.style) if ("custom" === t.style && t !== null && t !== void 0 && t.customStyle) {
        var _e21 = JSON.stringify(t.customStyle);
        u.setOptions({
          styles: JSON.parse(_e21)
        });
      } else window.bricksData && window.bricksData.mapStyles[t.style] && u.setOptions({
        styles: JSON.parse(window.bricksData.mapStyles[t.style].style)
      });
    }, 1e3 * t);
  });
}
function bricksPieChart() {
  bricksQuerySelectorAll(document, ".brxe-pie-chart").forEach(function (e) {
    new BricksIntersect({
      element: e,
      callback: function callback(e) {
        var t = e.getElementsByTagName("canvas");
        t.length && t[0].remove(), new EasyPieChart(e, {
          size: e.dataset.size && e.dataset.size > 0 ? e.dataset.size : 160,
          lineWidth: e.dataset.lineWidth,
          barColor: e.dataset.barColor,
          trackColor: e.dataset.trackColor,
          lineCap: e.dataset.lineCap,
          scaleColor: e.dataset.scaleColor,
          scaleLength: e.dataset.scaleLength,
          rotate: 0
        });
      },
      threshold: 1
    });
  });
}
function bricksPricingTables() {
  bricksQuerySelectorAll(document, ".brxe-pricing-tables").forEach(function (e, t) {
    var r = bricksQuerySelectorAll(e, ".tab"),
      i = bricksQuerySelectorAll(e, ".pricing-table");
    r.forEach(function (e) {
      e.classList.contains("listening") || (e.classList.add("listening"), e.addEventListener("click", function () {
        e.classList.contains("active") || (i.forEach(function (e) {
          e.classList.toggle("active");
        }), r.forEach(function (e) {
          e.classList.remove("active");
        }), e.classList.add("active"));
      }));
    });
  });
}
function bricksProgressBar() {
  bricksQuerySelectorAll(document, ".brxe-progress-bar span").forEach(function (e) {
    new BricksIntersect({
      element: e,
      callback: function callback() {
        e.dataset.width && setTimeout(function () {
          e.style.width = e.dataset.width;
        }, "slow");
      },
      threshold: 1
    });
  });
}
function bricksSplide() {
  bricksQuerySelectorAll(document, ".brxe-slider-nested.splide").forEach(function (e) {
    var t = bricksQuerySelectorAll(e, [".splide__list > .brxe-container", ".splide__list > .brxe-block", ".splide__list > .brxe-div"]);
    t.forEach(function (e) {
      e.classList.add("splide__slide"), e.dataset.id = e.id;
    });
    var r = e.dataset.scriptId;
    window.bricksData.splideInstances.hasOwnProperty(r) && window.bricksData.splideInstances[r].destroy();
    var i = new Splide(e);
    i.mount(), window.bricksData.splideInstances[r] = i, t.forEach(function (t, r) {
      if (t.dataset.id) {
        t.id = t.dataset.id;
        var _i5 = e.querySelector(".splide__pagination");
        if (_i5) {
          var _e22 = _i5.querySelector("li:nth-child(".concat(r + 1, ") .splide__pagination__page"));
          _e22 && _e22.setAttribute("aria-controls", t.id);
        }
      }
      if (!t.classList.contains("bricks-lazy-hidden")) {
        var _e23 = t.getAttribute("style") || "";
        t.dataset.style && (_e23 += t.dataset.style, t.setAttribute("style", _e23));
      }
    });
  });
}
function bricksSwiper() {
  bricksQuerySelectorAll(document, ".bricks-swiper-container").forEach(function (e) {
    var t;
    try {
      t = JSON.parse(e.dataset.scriptArgs);
    } catch (r) {
      console.warn("bricksSwiper: Error parsing JSON of data-script-args", e), t = {};
    }
    var r = e.classList.contains("[class*=brxe-]") ? e : e.closest("[class*=brxe-]");
    if (!r) return;
    bricksQuerySelectorAll(e, [".splide__list > .brxe-container", ".splide__list > .brxe-block", ".splide__list > .brxe-div"]).forEach(function (e) {
      return e.classList.add("swiper-slide");
    });
    var i = r.dataset.scriptId,
      s = window.bricksData.swiperInstances.hasOwnProperty(i) ? window.bricksData.swiperInstances[i] : void 0;
    s && s.destroy(), t.observer = !1, t.observeParents = !0, t.resizeObserver = !0, t.slidesToShow = t.hasOwnProperty("slidesToShow") ? t.slidesToShow : 1, t.slidesPerGroup = t.hasOwnProperty("slidesPerGroup") ? t.slidesPerGroup : 1, t.speed = t.hasOwnProperty("speed") ? parseInt(t.speed) : 300, t.effect = t.hasOwnProperty("effect") ? t.effect : "slide", t.spaceBetween = t.hasOwnProperty("spaceBetween") ? t.spaceBetween : 0, t.initialSlide = t.hasOwnProperty("initialSlide") ? t.initialSlide : 0, t.keyboard = {
      enabled: bricksIsFrontend,
      onlyInViewport: !0
    }, t.watchOverflow = !0, t.hasOwnProperty("effect") && "flip" === t.effect && (t.flipEffect = {
      slideShadows: !1
    }), t.hasOwnProperty("effect") && "fade" === t.effect && (t.fadeEffect = {
      crossFade: !0
    }), t.navigation && (t.navigation = {
      prevEl: r.querySelector(".bricks-swiper-button-prev"),
      nextEl: r.querySelector(".bricks-swiper-button-next")
    }), t.pagination && (t.pagination = {
      el: r.querySelector(".swiper-pagination"),
      type: "bullets",
      clickable: !0
    }, 1 == t.dynamicBullets && (delete t.dynamicBullets, t.pagination.dynamicBullets = !0)), s = new Swiper(e, t), window.bricksData.swiperInstances[i] = s;
  });
}
function bricksVideo() {
  bricksQuerySelectorAll(document, ".brxe-video").forEach(function (e) {
    bricksIsFrontend && e.addEventListener("click", function () {
      var t = e.querySelector(".bricks-video-overlay"),
        r = e.querySelector(".bricks-video-overlay-icon");
      t && t.remove(), r && r.remove();
    });
    var t = e.querySelector("video");
    if (t) {
      if (window.hasOwnProperty("Plyr")) {
        var _window$bricksData, _window$bricksData$vi;
        var _t9 = e.dataset.scriptId,
          r = e.querySelector(".bricks-plyr"),
          i = ((_window$bricksData = window.bricksData) === null || _window$bricksData === void 0 ? void 0 : (_window$bricksData$vi = _window$bricksData.videoInstances) === null || _window$bricksData$vi === void 0 ? void 0 : _window$bricksData$vi[_t9]) || void 0;
        i && i.destroy(), r && (i = new Plyr(r)), window.bricksData.videoInstances[_t9] = i;
      }
      t.setAttribute("playsinline", !0);
    }
  });
}
function bricksFacebookSDK() {
  if (!document.querySelector(".brxe-facebook-page")) return;
  var e = window.bricksData.hasOwnProperty("locale") ? window.bricksData.locale : "en_US",
    t = window.bricksData.hasOwnProperty("facebookAppId") ? window.bricksData.facebookAppId : null,
    r = "https://connect.facebook.net/".concat(e, "/sdk.js"),
    i = new XMLHttpRequest();
  i.open("GET", r), i.onreadystatechange = function () {
    if (4 == this.readyState && 200 == this.status) {
      var _e24 = document.createElement("script");
      _e24.type = "text/javascript", _e24.id = "bricks-facebook-page-sdk", _e24.appendChild(document.createTextNode(i.responseText)), document.body.appendChild(_e24), FB.init({
        appId: t,
        version: "v3.3",
        xfbml: !0
      });
    }
  }, i.send();
}
function bricksPrettify() {
  if (!window.hasOwnProperty("PR")) return;
  PR.prettyPrint();
  var e = bricksQuerySelectorAll(document, ".prettyprint.prettyprinted");
  !bricksIsFrontend && e.length && e.forEach(function (e) {
    e.classList.remove("prettyprinted"), PR.prettyPrint();
  });
}
function bricksSkipLinks() {
  var e = bricksQuerySelectorAll(document, ".skip-link");
  e && e.forEach(function (e) {
    e.addEventListener("click", function (t) {
      t.preventDefault();
      var r = document.getElementById(e.href.split("#")[1]);
      r && (r.setAttribute("tabindex", "-1"), r.addEventListener("blur", function () {
        r.removeAttribute("tabindex");
      }, {
        once: !0
      }), r.focus());
    });
  });
}
function bricksInteractions() {
  var _window$bricksData3;
  bricksQuerySelectorAll(document, "[data-interactions]").forEach(function (e) {
    var _e$dataset3;
    var t = [];
    try {
      t = JSON.parse(e.dataset.interactions);
    } catch (e) {
      return console.info("error:bricksInteractions", e), !1;
    }
    var r = ((_e$dataset3 = e.dataset) === null || _e$dataset3 === void 0 ? void 0 : _e$dataset3.interactionId) || !1;
    t && r && t.forEach(function (t) {
      var _window$bricksData2;
      var i = !1;
      if (t !== null && t !== void 0 && t.trigger) {
        if ("scroll" === t.trigger ? t.scrollOffset = parseInt((t === null || t === void 0 ? void 0 : t.scrollOffset) || 0) : "mouseleaveWindow" === t.trigger && (t.trigger = "mouseleave", i = !0), "loadMore" === t.action) {
          var _window$bricksData$qu2;
          var _r6 = t === null || t === void 0 ? void 0 : t.loadMoreQuery;
          ((_window$bricksData$qu2 = window.bricksData.queryLoopInstances) === null || _window$bricksData$qu2 === void 0 ? void 0 : _window$bricksData$qu2[_r6]) || e.remove();
        }
        if (e) switch (t.el = e, t.groupId = i ? "document" : r, (_window$bricksData2 = window.bricksData) !== null && _window$bricksData2 !== void 0 && _window$bricksData2.interactions || (window.bricksData.interactions = []), window.bricksData.interactions.push(t), t.trigger) {
          case "click":
          case "mouseover":
          case "mouseenter":
          case "mouseleave":
          case "focus":
          case "blur":
          case "showPopup":
            (i ? document.documentElement : e).addEventListener(t.trigger, bricksInteractionCallback, {
              once: t === null || t === void 0 ? void 0 : t.runOnce
            });
            break;
          case "contentLoaded":
            var _r7 = (t === null || t === void 0 ? void 0 : t.delay) || 0;
            _r7 && _r7.includes("ms") ? _r7 = parseInt(_r7) : _r7 && _r7.includes("s") && (_r7 = 1e3 * parseFloat(_r7)), setTimeout(function () {
              bricksInteractionCallbackExecution(e, t);
            }, _r7);
            break;
          case "enterView":
            new BricksIntersect({
              element: e,
              callback: function callback(e) {
                return bricksInteractionCallbackExecution(e, t);
              },
              once: t === null || t === void 0 ? void 0 : t.runOnce
            });
            break;
          case "leaveView":
            new BricksIntersect({
              element: e,
              callback: function callback(e) {
                return bricksInteractionCallbackExecution(e, t);
              },
              rootMargin: "0px 0px -100% 0px",
              once: t === null || t === void 0 ? void 0 : t.runOnce
            });
        }
      }
    });
  }), Array.isArray((_window$bricksData3 = window.bricksData) === null || _window$bricksData3 === void 0 ? void 0 : _window$bricksData3.interactions) && -1 !== window.bricksData.interactions.findIndex(function (e) {
    return "scroll" === e.trigger;
  }) && document.addEventListener("scroll", bricksScrollInteractions);
}
function bricksPopups() {
  var e = bricksQuerySelectorAll(document, ".brx-popup");
  if (!e.length) return;
  e.forEach(function (e) {
    e.addEventListener("showPopup", function () {
      e.classList.contains("listening") || (e.classList.add("listening"), setTimeout(function () {
        var t = e.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (t.length) {
          var _e25 = t[0],
            r = t[t.length - 1];
          t[0].focus(), document.addEventListener("keydown", function (t) {
            "Tab" === t.key && (t.shiftKey ? document.activeElement === _e25 && (r.focus(), t.preventDefault()) : document.activeElement === r && (_e25.focus(), t.preventDefault()));
          });
        }
      }, 100)), bricksCounter();
    });
  });
  var t = function t() {
    bricksIsFrontend && e.forEach(function (e) {
      e.classList.add("hide"), document.body.classList.remove("no-scroll");
    });
  };
  document.addEventListener("keyup", function (e) {
    "Escape" === e.key && t();
  }), document.addEventListener("click", function (e) {
    e.target.classList.contains("brx-popup") && t();
  });
}
function bricksScrollInteractions(e) {
  clearTimeout(bricksScrollTimeout), bricksScrollTimeout = setTimeout(function () {
    var e = window.scrollY;
    window.bricksData.interactions.filter(function (e) {
      return "scroll" === e.trigger;
    }).forEach(function (t) {
      if (e >= t.scrollOffset && (bricksInteractionCallbackExecution(t.el, t), t !== null && t !== void 0 && t.runOnce)) {
        var _e26 = window.bricksData.interactions.findIndex(function (e) {
          return e.id === t.id;
        });
        -1 !== _e26 && window.bricksData.interactions.splice(_e26, 1);
      }
    });
  }, 50);
}
function bricksInteractionCallback(e) {
  var _e$currentTarget, _e$currentTarget$data;
  "click" === (e === null || e === void 0 ? void 0 : e.type) && e.preventDefault();
  var t = (e === null || e === void 0 ? void 0 : (_e$currentTarget = e.currentTarget) === null || _e$currentTarget === void 0 ? void 0 : (_e$currentTarget$data = _e$currentTarget.dataset) === null || _e$currentTarget$data === void 0 ? void 0 : _e$currentTarget$data.interactionId) || "document";
  window.bricksData.interactions.filter(function (e) {
    return e.groupId === t;
  }).forEach(function (t) {
    (t === null || t === void 0 ? void 0 : t.trigger) === e.type && bricksInteractionCallbackExecution(t.el, t);
  });
}
function bricksInteractionCallbackExecution(e, t) {
  var _window$bricksData$qu3, _document$querySelect;
  var r = (t === null || t === void 0 ? void 0 : t.target) || "self";
  var i;
  if (bricksInteractionCheckConditions(t)) {
    switch (r) {
      case "custom":
        (t === null || t === void 0 ? void 0 : t.targetSelector) && (i = bricksQuerySelectorAll(document, t.targetSelector));
        break;
      case "popup":
        (t === null || t === void 0 ? void 0 : t.templateId) && (i = bricksQuerySelectorAll(document, ".brxe-popup-".concat(t.templateId)), i.length > 1 && (i = e.closest(".brxe-popup-".concat(t.templateId)) || e.parentNode.querySelector(".brxe-popup-".concat(t.templateId))));
        break;
      default:
        i = e;
    }
    if (i) switch (i = Array.isArray(i) ? i : [i], t === null || t === void 0 ? void 0 : t.action) {
      case "show":
      case "hide":
        i.forEach(function (e) {
          if (e !== null && e !== void 0 && e.classList.contains("brx-popup")) {
            if ("show" === t.action) {
              if (bricksPopupCheckLimit(e)) {
                e.classList.remove("hide"), document.body.classList.add("no-scroll");
                var _t10 = new CustomEvent("showPopup");
                e.dispatchEvent(_t10), bricksPopupCounter(e);
              }
            } else if ("hide" === t.action) {
              e.classList.add("hide"), document.body.classList.remove("no-scroll");
              var _t11 = new CustomEvent("hidePopup");
              e.dispatchEvent(_t11);
            }
          } else e.style.display = "hide" === t.action ? "none" : "block";
        });
        break;
      case "setAttribute":
      case "removeAttribute":
      case "toggleAttribute":
        var _r8 = t === null || t === void 0 ? void 0 : t.actionAttributeKey;
        _r8 && i.forEach(function (e) {
          var i = (t === null || t === void 0 ? void 0 : t.actionAttributeValue) || "";
          if ("class" === _r8) {
            (i ? i.split(" ") : []).forEach(function (r) {
              "setAttribute" === t.action ? e.classList.add(r) : "removeAttribute" === t.action ? e.classList.remove(r) : e.classList.toggle(r);
            });
          } else "setAttribute" === t.action ? e.setAttribute(_r8, i) : "removeAttribute" === t.action || e.hasAttribute(_r8) ? e.removeAttribute(_r8) : e.setAttribute(_r8, i);
        });
        break;
      case "storageAdd":
      case "storageRemove":
      case "storageCount":
        var s = t === null || t === void 0 ? void 0 : t.storageType,
          o = t === null || t === void 0 ? void 0 : t.actionAttributeKey,
          a = t.hasOwnProperty("actionAttributeValue") ? t.actionAttributeValue : 0;
        if (s && o) if ("storageAdd" === t.action) bricksStorageSetItem(s, o, a);else if ("storageRemove" === t.action) bricksStorageRemoveItem(s, o);else if ("storageCount" === t.action) {
          var _e27 = bricksStorageGetItem(s, o);
          _e27 = _e27 ? parseInt(_e27) : 0, bricksStorageSetItem(s, o, _e27 + 1);
        }
        break;
      case "startAnimation":
        var n = t === null || t === void 0 ? void 0 : t.animationType;
        n && i.forEach(function (e) {
          if (e !== null && e !== void 0 && e.classList.contains("brx-popup")) if (n.includes("Out")) setTimeout(function () {
            e.classList.add("hide"), document.body.classList.remove("no-scroll");
            var t = new CustomEvent("hidePopup");
            e.dispatchEvent(t);
          }, 1e3);else if (bricksPopupCheckLimit(e)) {
            if (e.classList.remove("hide"), document.body.classList.add("no-scroll"), "showPopup" !== (t === null || t === void 0 ? void 0 : t.trigger)) {
              var _t12 = new CustomEvent("showPopup");
              e.dispatchEvent(_t12);
            }
            bricksPopupCounter(e);
          }
          var r = 1e3;
          t !== null && t !== void 0 && t.animationDuration && (e.style.animationDuration = t.animationDuration, t.animationDuration.includes("ms") ? r = parseInt(t.animationDuration) : t.animationDuration.includes("s") && (r = 1e3 * parseFloat(t.animationDuration))), t !== null && t !== void 0 && t.animationDelay && (e.style.animationDelay = t.animationDelay, t.animationDelay.includes("ms") ? r += parseInt(t.animationDelay) : t.animationDelay.includes("s") && (r += 1e3 * parseFloat(t.animationDelay))), e.classList.add("brx-animated"), e.setAttribute("data-animation", n), bricksAnimation([e], r);
        });
        break;
      case "loadMore":
        var c = t === null || t === void 0 ? void 0 : t.loadMoreQuery,
          l = (_window$bricksData$qu3 = window.bricksData.queryLoopInstances) === null || _window$bricksData$qu3 === void 0 ? void 0 : _window$bricksData$qu3[c];
        if (!l) return;
        var d = l.isPostsElement ? (_document$querySelect = document.querySelector(".bricks-isotope-sizer[data-query-element-id=\"".concat(c, "\"]"))) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.previousElementSibling : Array.from(document.querySelectorAll(".brxe-".concat(c))).pop();
        d && (e.classList.contains("is-loading") || (e.classList.add("is-loading"), d.dataset.queryElementId = c, bricksQueryLoadPage(d).then(function (t) {
          e.classList.remove("is-loading"), (t === null || t === void 0 ? void 0 : t.page) >= (t === null || t === void 0 ? void 0 : t.maxPages) && e.remove();
        })));
    }
  }
}
function bricksPopupCheckLimit(e) {
  var _e$dataset4, _e$dataset5;
  var t = e === null || e === void 0 ? void 0 : (_e$dataset4 = e.dataset) === null || _e$dataset4 === void 0 ? void 0 : _e$dataset4.popupLimits,
    r = e === null || e === void 0 ? void 0 : (_e$dataset5 = e.dataset) === null || _e$dataset5 === void 0 ? void 0 : _e$dataset5.popupId;
  if (!t) return !0;
  try {
    t = JSON.parse(t);
  } catch (e) {
    return console.info("error:bricksPopupCheckLimit", e), !0;
  }
  var i = !1;
  return Object.entries(t).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
      e = _ref2[0],
      t = _ref2[1];
    var s = bricksStorageGetItem(e, "brx_popup_".concat(r, "_total"));
    s = s ? parseInt(s) : 0, i = i || s >= t;
  }), !i;
}
function bricksPopupCounter(e) {
  var _e$dataset6, _e$dataset7;
  var t = e === null || e === void 0 ? void 0 : (_e$dataset6 = e.dataset) === null || _e$dataset6 === void 0 ? void 0 : _e$dataset6.popupLimits,
    r = e === null || e === void 0 ? void 0 : (_e$dataset7 = e.dataset) === null || _e$dataset7 === void 0 ? void 0 : _e$dataset7.popupId;
  if (t) {
    try {
      t = JSON.parse(t);
    } catch (e) {
      return console.info("error:bricksPopupCounter", e), !0;
    }
    Object.entries(t).forEach(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
        e = _ref4[0],
        t = _ref4[1];
      var i = bricksStorageGetItem(e, "brx_popup_".concat(r, "_total"));
      i = i ? parseInt(i) : 0, bricksStorageSetItem(e, "brx_popup_".concat(r, "_total"), i + 1);
    });
  }
}
function bricksInteractionCheckConditions(e) {
  if (!Array.isArray(e === null || e === void 0 ? void 0 : e.interactionConditions)) return !0;
  var t = (e === null || e === void 0 ? void 0 : e.interactionConditionsRelation) || "and",
    r = "and" === t;
  return e.interactionConditions.forEach(function (e) {
    var i = e === null || e === void 0 ? void 0 : e.conditionType,
      s = (e === null || e === void 0 ? void 0 : e.storageKey) || !1,
      o = !1;
    if (i && s) {
      var _t13 = (e === null || e === void 0 ? void 0 : e.storageCompare) || "exists",
        _r9 = e === null || e === void 0 ? void 0 : e.storageCompareValue,
        a = bricksStorageGetItem(i, s);
      switch (_t13) {
        case "exists":
          o = null !== a;
          break;
        case "notExists":
          o = null === a;
          break;
        case "==":
          o = a == _r9;
          break;
        case "!=":
          o = a != _r9;
          break;
        case ">=":
          o = a >= _r9;
          break;
        case "<=":
          o = a <= _r9;
          break;
        case ">":
          o = a > _r9;
          break;
        case "<":
          o = a < _r9;
      }
    } else o = !0;
    r = "and" === t ? r && o : r || o;
  }), r;
}
function bricksStorageGetItem(e, t) {
  if (!t) return;
  var r;
  try {
    switch (e) {
      case "windowStorage":
        r = window.hasOwnProperty(t) ? window[t] : null;
        break;
      case "sessionStorage":
        r = sessionStorage.getItem(t);
        break;
      case "localStorage":
        r = localStorage.getItem(t);
    }
  } catch (e) {
    console.info("error:bricksStorageGetItem", e);
  }
  return r;
}
function bricksStorageSetItem(e, t, r) {
  if (t) try {
    switch (e) {
      case "windowStorage":
        window[t] = r;
        break;
      case "sessionStorage":
        sessionStorage.setItem(t, r);
        break;
      case "localStorage":
        localStorage.setItem(t, r);
    }
  } catch (e) {
    console.info("error:bricksStorageSetItem", e);
  }
}
function bricksStorageRemoveItem(e, t) {
  if (t) try {
    switch (e) {
      case "windowStorage":
        delete window[t];
        break;
      case "sessionStorage":
        sessionStorage.removeItem(t);
        break;
      case "localStorage":
        localStorage.removeItem(t);
    }
  } catch (e) {
    console.info("error:bricksStorageRemoveItem", e);
  }
}
var bricksIsFrontend, bricksScrollTimeout;
document.addEventListener("DOMContentLoaded", function (e) {
  if (bricksIsFrontend = document.body.classList.contains("bricks-is-frontend"), bricksStickyHeader(), bricksNavSubmenuPositioning(), bricksOnePageNavigation(), bricksPrettify(), bricksSkipLinks(), bricksAccordion(), bricksAnimatedTyping(), bricksAudio(), bricksCountdown(), bricksCounter(), bricksIsotope(), bricksPricingTables(), bricksSplide(), bricksSwiper(), bricksVideo(), bricksLightbox(), bricksFacebookSDK(), setTimeout(function () {
    bricksLazyLoad(), bricksAnimation(), bricksPieChart(), bricksProgressBar(), bricksForm(), bricksSmoothScroll(), bricksInitQueryLoopInstances(), bricksQueryPagination(), bricksInteractions(), bricksPopups();
  }, 200), bricksSearchOverlay(), bricksMobileMenuToggles(), bricksNavMenuA11y(), bricksAlertDismiss(), bricksTabs(), bricksVideoOverlayClickDetector(), bricksBackgroundVideoInit(), bricksPhotoswipe(), !bricksIsFrontend) {
    var _e28;
    window.addEventListener("resize", function () {
      clearTimeout(_e28), _e28 = setTimeout(bricksSwiper, 250), _e28 = setTimeout(bricksSplide, 250);
    });
  }
});
