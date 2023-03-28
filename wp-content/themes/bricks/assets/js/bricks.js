function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e38) { throw _e38; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e39) { didErr = true; err = _e39; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var BricksIntersect = /*#__PURE__*/_createClass(function BricksIntersect() {
  var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  _classCallCheck(this, BricksIntersect);
  var t = e.element || !1,
    r = e.callback || !1,
    i = !e.hasOwnProperty("once") || e.once,
    o = !!e.hasOwnProperty("trigger") && e.trigger;
  if ("IntersectionObserver" in window) {
    var s = !0,
      a = new IntersectionObserver(function (e, a) {
        e.forEach(function (e) {
          if ("leaveView" === o ? !e.isIntersecting : e.isIntersecting) {
            if (s && "leaveView" === o) return void (s = !1);
            t && r && r(e.target), i && a.unobserve(e.target);
          }
        });
      }, {
        threshold: e.threshold || 0,
        root: e.root || null,
        rootMargin: (e === null || e === void 0 ? void 0 : e.rootMargin) || "0px"
      });
    t instanceof Element && a.observe(t);
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
      o = e === null || e === void 0 ? void 0 : e.classList.contains("bricks-isotope-sizer"),
      s = e === null || e === void 0 ? void 0 : e.classList.contains("brx-infinite-scroll");
    window.bricksData.queryLoopInstances[r] = {
      page: e.dataset.page,
      maxPages: e.dataset.maxPages,
      queryVars: i,
      observerMargin: t,
      infiniteScroll: s,
      isPostsElement: o
    };
    var a = o ? e.previousElementSibling : Array.from(document.querySelectorAll(".brxe-".concat(r, ":not(.brx-popup)"))).pop();
    o || e.remove(), a && s && (a.dataset.queryElementId = r, new BricksIntersect({
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
      o = (_window$bricksData$qu = window.bricksData.queryLoopInstances) === null || _window$bricksData$qu === void 0 ? void 0 : _window$bricksData$qu[i];
    if (!o || o !== null && o !== void 0 && o.isLoading) return;
    var s = parseInt(o.page || 1) + 1;
    var a = parseInt(o.maxPages || 1);
    if (s > a) return delete window.bricksData.queryLoopInstances[i], void t({
      page: s,
      maxPages: a
    });
    window.bricksData.queryLoopInstances[i].isLoading = 1;
    var n = {
      postId: window.bricksData.postId,
      queryElementId: i,
      queryVars: o.queryVars,
      page: s,
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
            _o = (_t2 === null || _t2 === void 0 ? void 0 : _t2.styles) || !1,
            _a = (_t2 === null || _t2 === void 0 ? void 0 : _t2.popups) || !1;
          _r && e.insertAdjacentHTML("afterend", _r), _a && document.body.insertAdjacentHTML("beforeend", _a), _o && document.body.insertAdjacentHTML("beforeend", _o), window.bricksData.queryLoopInstances[i].page = s;
        }
        window.bricksData.queryLoopInstances[i].isLoading = 0, t({
          page: s,
          maxPages: a
        }), bricksLazyLoad(), setTimeout(function () {
          bricksInteractions(), bricksAnimation(), o.isPostsElement ? (newQueryTrail = e.parentNode.querySelector(".bricks-isotope-sizer").previousElementSibling, bricksIsotope()) : newQueryTrail = Array.from(document.querySelectorAll(".brxe-".concat(i, ":not(.brx-popup)"))).pop(), o.infiniteScroll && (newQueryTrail.dataset.queryElementId = i, BricksIsInViewport(newQueryTrail) ? bricksQueryLoadPage(newQueryTrail) : new BricksIntersect({
            element: newQueryTrail,
            callback: function callback(e) {
              return bricksQueryLoadPage(e);
            },
            once: !0,
            rootMargin: o.observerMargin
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
        o = i === null || i === void 0 ? void 0 : (_i$dataset = i.dataset) === null || _i$dataset === void 0 ? void 0 : _i$dataset.queryElementId,
        s = document.querySelector(".brxe-".concat(o));
      if (!s) return;
      e.preventDefault();
      var a = new XMLHttpRequest();
      a.open("GET", r, !0), a.responseType = "document", a.onload = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
          var e = this.status;
          if (0 === e || e >= 200 && e < 400) {
            var _e2 = this.responseXML,
              _t3 = s.parentNode,
              _a2 = document.createElement("div");
            _a2.style.display = "none", s.insertAdjacentElement("beforebegin", _a2);
            _t3.querySelectorAll(".brxe-".concat(o, ":not(.brx-popup)")).forEach(function (e) {
              return e.remove();
            });
            _e2.querySelectorAll(".brxe-".concat(o, ":not(.brx-popup)")).forEach(function (e) {
              return _a2.insertAdjacentElement("beforebegin", e);
            }), _a2.remove();
            document.querySelectorAll(".brx-popup[data-popup-loop=\"".concat(o, "\"]")).forEach(function (e) {
              return e.remove();
            });
            _e2.querySelectorAll(".brx-popup[data-popup-loop=\"".concat(o, "\"]")).forEach(function (e) {
              return document.body.insertAdjacentElement("beforeend", e);
            });
            var n = _e2.querySelector(".brx-ajax-pagination[data-query-element-id=\"".concat(o, "\"]"));
            i.replaceWith(n), bricksLazyLoad(), bricksAnimation(), bricksInteractions(), bricksQueryPagination(), window.history.pushState({}, "", r);
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
    o = -1,
    s = e.hasAttribute("data-slide-up-after") ? e.getAttribute("data-slide-up-after") : 0;
  i && (t = i.getAttribute("data-bricks-logo"), r = i.getAttribute("data-bricks-logo-inverse"));
  var a = function a() {
    var a = window.pageYOffset;
    a > 0 ? (e.classList.add("scrolling"), i && r && (i.src = r, i.srcset = "")) : (e.classList.remove("scrolling"), i && r && (i.src = t)), s && (a > o && o >= 0 ? a > s && e.classList.add("slide-up") : e.classList.remove("slide-up")), o = a;
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
    o = "",
    s = "";
  function a() {
    var e = window.scrollY;
    r.forEach(function (t) {
      var r = document.getElementById(t),
        i = r.offsetTop,
        o = i + r.offsetHeight;
      e >= i - 1 && e < o - 1 ? document.querySelector(".bricks-one-page-".concat(t)).classList.add("active") : document.querySelector(".bricks-one-page-".concat(t)).classList.remove("active");
    });
  }
  t && (t.forEach(function (t) {
    i = t.getAttribute("id"), i && (r.push(i), s = document.createElement("li"), o = document.createElement("a"), o.classList.add("bricks-one-page-".concat(i)), o.setAttribute("href", "#".concat(i)), s.appendChild(o), e.appendChild(s));
  }), window.addEventListener("load", a), window.addEventListener("resize", a), document.addEventListener("scroll", a));
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
function bricksNavMenu() {
  bricksQuerySelectorAll(document, ".brxe-nav-menu").forEach(function (e) {
    document.addEventListener("click", function (t) {
      if (!e.contains(t.target)) {
        bricksQuerySelectorAll(e, '.bricks-menu-item[aria-expanded="true"]').forEach(function (e) {
          e.setAttribute("aria-expanded", !1);
        });
      }
    });
  }), bricksNavMenuMobile();
  var e = function e(_e3) {
    var t = _e3.closest(".bricks-menu-item");
    return !(!t || "true" != t.getAttribute("aria-haspopup")) && t;
  };
  document.addEventListener("keydown", function (t) {
    if (" " === t.key) {
      if (e(t.target)) {
        t.preventDefault();
        var _e4 = "true" === t.target.parentNode.getAttribute("aria-expanded");
        t.target.parentNode.setAttribute("aria-expanded", !_e4);
      }
    }
    "Tab" !== t.key || t.shiftKey || setTimeout(function () {
      bricksQuerySelectorAll(document, '.bricks-menu-item[aria-expanded="true"]').forEach(function (t) {
        if (!t.contains(document.activeElement)) {
          var r = e(t);
          r && r.setAttribute("aria-expanded", !1);
        }
      });
    }, 0);
  }), document.addEventListener("keyup", function (t) {
    if ("Escape" === t.key) {
      var r = t.target.closest(".sub-menu");
      if (r) {
        var _t4 = e(r);
        _t4 && (_t4.setAttribute("aria-expanded", !1), r.previousElementSibling && r.previousElementSibling.focus());
      }
    }
  });
}
function bricksNavMenuMobile() {
  bricksQuerySelectorAll(document, ".bricks-mobile-menu-toggle").forEach(function (e) {
    document.addEventListener("keyup", function (t) {
      if ("Escape" === t.key) {
        var _t5 = e.closest(".brxe-nav-menu.show-mobile-menu");
        _t5 && (_t5.classList.remove("show-mobile-menu"), e.focus());
      }
    }), e.addEventListener("click", function (t) {
      var r = e.closest(".brxe-nav-menu");
      if (r) {
        r.classList.toggle("show-mobile-menu"), bricksMobileMenuBodyNoScroll();
        var _t6 = e.parentNode.querySelector(".bricks-mobile-menu-wrapper"),
          i = _t6 ? _t6.querySelectorAll('a, button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select') : [];
        i.length && i[0].focus();
      }
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
      var o = bricksQuerySelectorAll(e, ".tab-pane");
      o.forEach(function (e, t) {
        0 === t && e.classList.add("brx-open");
      }), r.addEventListener("click", function () {
        t.forEach(function (e, t) {
          t === i ? r.classList.add("brx-open") : e.classList.remove("brx-open");
        }), o.forEach(function (e, t) {
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
    e.addEventListener("click", function (o) {
      o.preventDefault();
      var s = e.dataset.bricksLightboxImageUrl;
      if (s) {
        i = !0;
        var _e5 = document.createElement("img");
        _e5.src = s, r.appendChild(_e5);
      }
      var a = e.dataset.bricksLightboxVideoUrl;
      if (a) {
        i = !0;
        var _e6 = !1;
        if (-1 !== a.indexOf("youtube.com") && (_e6 = !0, a = a.replace("watch?v=", "embed/"), a += "?autoplay=1", a += "&rel=0"), -1 !== a.indexOf("vimeo.com") && (_e6 = !0, -1 === a.indexOf("player.vimeo.com/video") && (a = a.replace("vimeo.com", "player.vimeo.com/video")), a += "?autoplay=1"), _e6) {
          var _e7 = document.createElement("iframe");
          _e7.setAttribute("src", a), _e7.setAttribute("allow", "autoplay"), _e7.setAttribute("allowfullscreen", 1), r.appendChild(_e7);
        } else {
          var _e8 = document.createElement("video");
          _e8.setAttribute("src", a), _e8.setAttribute("autoplay", 1), _e8.setAttribute("controls", 1), _e8.setAttribute("playsinline", 1), r.appendChild(_e8);
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
    var o,
      s = e.getAttribute("data-background-video-ratio") || "16:9",
      a = parseInt(s.split(":")[0] || 16),
      n = parseInt(s.split(":")[1] || 9);
    if (-1 !== t.indexOf("youtube.com")) {
      i = !0;
      var _e9 = t.lastIndexOf("="),
        _r2 = t.slice(_e9 + 1);
      t += "?origin=".concat(window.location.origin), t += "&rel=0", t += "&autoplay=1", t += "&mute=1", t += "&widgetid=1", t += "&controls=0", t += "&showinfo=0", t += "&modestbranding=1", t += "&cc_load_policy=0", t += "&iv_load_policy=3", t += "&autohide=0", t += "&loop=1", t += "&playlist=".concat(_r2), t += "&enablejsapi=1", t = t.replace("watch?v=", "embed/");
    }
    -1 !== t.indexOf("vimeo.com") && (i = !0, t += "?background=1", t += "&byline=0", t += "&portrait=0", t += "&title=0", -1 === t.indexOf("player.vimeo.com/video") && (t = t.replace("vimeo.com", "player.vimeo.com/video"))), i ? (o = document.createElement("iframe"), o.setAttribute("width", 640), o.setAttribute("height", 360), o.setAttribute("src", t), o.setAttribute("allow", "autoplay"), o.setAttribute("allowfullscreen", 1), r && (o.style.transform = "translate(-50%, -50%) scale(".concat(r, ")")), e.removeChild(e.querySelector("video"))) : (o = e.querySelector("video"), r && (o.style.transform = "scale(".concat(r, ")"))), bricksIsFrontend ? e.classList.contains("bricks-lazy-video") && new BricksIntersect({
      element: e,
      callback: function callback(e) {
        e.classList.remove("bricks-lazy-video"), i ? e.appendChild(o) : o.src = t;
      }
    }) : i ? e.appendChild(o) : o.src = t, e.classList.add("loaded"), new ResizeObserver(function (t) {
      var _iterator = _createForOfIteratorHelper(t),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _r3 = _step.value;
          var _t7 = void 0;
          if (_r3.contentBoxSize) {
            _t7 = (Array.isArray(_r3.contentBoxSize) ? _r3.contentBoxSize[0] : _r3.contentBoxSize).inlineSize;
          } else _t7 = _r3.contentRect.width;
          var _i2 = e.clientHeight,
            _s = _t7 * n / a;
          _s < _i2 && (_s = _i2, _t7 = _i2 * a / n), o.style.width = "".concat(_t7, "px"), o.style.height = "".concat(_s, "px");
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
      o = parseInt((_t$dataset2 = t.dataset) === null || _t$dataset2 === void 0 ? void 0 : _t$dataset2.bricksLightboxIndex) || 0;
    (r === null || r === void 0 ? void 0 : r[i]) || (r[i] = []);
    var s = ((_t$dataset3 = t.dataset) === null || _t$dataset3 === void 0 ? void 0 : _t$dataset3.bricksLightboxSource) || ((_t$dataset4 = t.dataset) === null || _t$dataset4 === void 0 ? void 0 : _t$dataset4.src) || t.src;
    if (!s) return;
    var a = ((_t$dataset5 = t.dataset) === null || _t$dataset5 === void 0 ? void 0 : _t$dataset5.bricksLightboxWidth) || t.width,
      n = ((_t$dataset6 = t.dataset) === null || _t$dataset6 === void 0 ? void 0 : _t$dataset6.bricksLightboxHeight) || t.height;
    r[i][o] = {
      src: s,
      w: a,
      h: n
    }, t.addEventListener("click", function (t) {
      var _t$target$dataset;
      if (!t.target.classList.contains("bricks-lightbox")) return 1;
      t.stopPropagation();
      var i = (_t$target$dataset = t.target.dataset) === null || _t$target$dataset === void 0 ? void 0 : _t$target$dataset.bricksLightboxId,
        o = r === null || r === void 0 ? void 0 : r[i];
      if (!o) return;
      new PhotoSwipe(e, PhotoSwipeUI_Default, o, {
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
      o = e.hasAttribute("data-transition") ? isNaN(e.dataset.transition) ? 0 : e.dataset.transition : 200;
    t = t.filter(function (e) {
      return e.classList.contains("brxe-section") || e.classList.contains("brxe-container") || e.classList.contains("brxe-block") || e.classList.contains("brxe-div") || e.classList.contains("accordion-item");
    }), t.forEach(function (t, s) {
      var _e$dataset$scriptArgs;
      0 === s && (_e$dataset$scriptArgs = e.dataset.scriptArgs) !== null && _e$dataset$scriptArgs !== void 0 && _e$dataset$scriptArgs.includes("expandFirstItem") && t.classList.add("brx-open"), t.classList.contains("listening") || (t.classList.add("listening"), t.addEventListener("click", function (t) {
        t.stopPropagation();
        var s = t.target.closest(".accordion-title-wrapper");
        if (!s) return;
        var a = s.parentNode;
        if (!a) return;
        var n = a.querySelector(".accordion-content-wrapper");
        if (n) {
          var _e$dataset$scriptArgs2;
          if (!((_e$dataset$scriptArgs2 = e.dataset.scriptArgs) !== null && _e$dataset$scriptArgs2 !== void 0 && _e$dataset$scriptArgs2.includes("independentToggle"))) {
            var _t8 = e.querySelector(".brx-open");
            if (_t8) {
              var _e10 = _t8.querySelector(".accordion-content-wrapper");
              _e10 && _e10 !== n && (_t8.classList.remove("brx-open"), r(_e10, o));
            }
          }
          i(n, o), a.classList.toggle("brx-open");
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
  var e = function e(_e13, t, r) {
    var i = t.date.replace(" ", "T"),
      o = new Date(i).getTime() - new Date().getTime();
    if (o <= 0) {
      if (clearInterval(_e13.dataset.bricksCountdownId), "hide" === t.action) return void (_e13.innerHTML = "");
      if ("text" === t.action) return void (_e13.innerHTML = t.actionText);
    }
    r && (_e13.innerHTML = "", t.fields.forEach(function (t) {
      if (!t.format) return;
      var r = document.createElement("div");
      if (r.classList.add("field"), t.prefix) {
        var _e11 = document.createElement("span");
        _e11.classList.add("prefix"), _e11.innerHTML = t.prefix, r.appendChild(_e11);
      }
      var i = document.createElement("span");
      if (i.classList.add("format"), r.appendChild(i), t.suffix) {
        var _e12 = document.createElement("span");
        _e12.classList.add("suffix"), _e12.innerHTML = t.suffix, r.appendChild(_e12);
      }
      _e13.appendChild(r);
    }));
    var s = bricksQuerySelectorAll(_e13, ".field"),
      a = Math.floor(o / 864e5),
      n = Math.floor(o % 864e5 / 36e5),
      c = Math.floor(o % 36e5 / 6e4),
      l = Math.floor(o % 6e4 / 1e3);
    t.fields.forEach(function (e, t) {
      if (!e.format) return;
      var r = e.format.toLowerCase();
      r.includes("%d") ? (e.format.includes("%D") && a <= 9 && (a = "0".concat(a)), s[t].querySelector(".format").innerHTML = r.replace("%d", o <= 0 ? 0 : a)) : r.includes("%h") ? (e.format.includes("%H") && n <= 9 && (n = "0".concat(n)), s[t].querySelector(".format").innerHTML = r.replace("%h", o <= 0 ? 0 : n)) : r.includes("%m") ? (e.format.includes("%M") && c <= 9 && (c = "0".concat(c)), s[t].querySelector(".format").innerHTML = r.replace("%m", o <= 0 ? 0 : c)) : r.includes("%s") && (e.format.includes("%S") && l <= 9 && (l = "0".concat(l)), s[t].querySelector(".format").innerHTML = r.replace("%s", o <= 0 ? 0 : l));
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
      o = t.hasOwnProperty("countTo") ? parseInt(t.countTo) : 100,
      s = t.hasOwnProperty("duration") ? parseInt(t.duration) : 1e3;
    s < 500 && (s = 500);
    var a = s / (o - i),
      n = 1;
    a < 4 && (n = Math.ceil(4 / a), a = 4);
    var c = function c() {
      var e = r.innerText.replace(/\D/g, "");
      e = isNaN(e) ? i : parseInt(e);
      var s = e + n < o ? e + n : o;
      if (e >= o) return clearInterval(r.dataset.counterId), void delete r.dataset.counterId;
      r.innerText = t.thousands ? s.toLocaleString() : s;
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
          o = bricksQuerySelectorAll(e, "input[name=\"".concat(i, "\"]")),
          s = !1;
        o.forEach(function (e) {
          !0 === e.checked && (s = !0);
        }), s ? o.forEach(function (e) {
          e.required = !1;
        }) : o.forEach(function (e) {
          e.required = !0;
        });
      });
    }), bricksQuerySelectorAll(e, ".flatpickr").forEach(function (e) {
      var t = e.dataset.bricksDatepickerOptions;
      t && (t = JSON.parse(t), t.disableMobile = !0, flatpickr(e, t));
    });
    var r = {};
    bricksQuerySelectorAll(e, "input[type=file]").forEach(function (t) {
      var i = t.getAttribute("data-files-ref"),
        o = t.getAttribute("data-maxsize") || !1,
        s = t.getAttribute("data-limit") || !1;
      o = !!o && 1024 * parseInt(o) * 1024, t.addEventListener("change", function (a) {
        var n = a.target.files,
          c = n.length,
          l = t.getAttribute("name");
        if (!c) return;
        var d = e.querySelector(".file-result[data-files-ref=\"".concat(i, "\"]"));
        var _loop = function _loop() {
          var t = n[_e14],
            i = !1,
            a = d.cloneNode(!0);
          if (s && r.hasOwnProperty(l) && r[l].length >= s && (i = "limit"), o && t.size > o && (i = "size"), i) a.classList.add("danger"), a.innerHTML = a.getAttribute("data-error-".concat(i)).replace("%s", t.name), setTimeout(function () {
            a.remove();
          }, 5e3);else {
            r.hasOwnProperty(l) || (r[l] = []), r[l].push(t), a.classList.add("show");
            var _e15 = a.querySelector(".text"),
              _i3 = a.querySelector(".remove");
            _e15.innerHTML = t.name, _i3.setAttribute("data-name", t.name), _i3.setAttribute("data-field", l), _i3.addEventListener("click", function (e) {
              var t = e.target.getAttribute("data-name"),
                i = e.target.getAttribute("data-field"),
                o = r[i];
              for (var _e16 = 0; _e16 < o.length; _e16++) if (o[_e16].name === t) {
                r[l].splice(_e16, 1);
                break;
              }
              a.remove();
            });
          }
          d.parentNode.insertBefore(a, d.nextSibling);
        };
        for (var _e14 = 0; _e14 < c; _e14++) {
          _loop();
        }
      });
    }), e.addEventListener("submit", function (i) {
      if (i.preventDefault(), !bricksIsFrontend) return;
      var o = document.getElementById("recaptcha-".concat(t)),
        s = e.querySelector(".recaptcha-error");
      if (!o) return void bricksSubmitForm(t, e, r, null);
      var a = o.getAttribute("data-key");
      if (a) try {
        grecaptcha.ready(function () {
          try {
            grecaptcha.execute(a, {
              action: "bricks_form_submit"
            }).then(function (i) {
              s.classList.remove("show"), bricksSubmitForm(t, e, r, i);
            })["catch"](function (t) {
              s.classList.add("show"), e.querySelector(".alert").innerText = "Google reCaptcha ".concat(t);
            });
          } catch (t) {
            s.classList.add("show"), e.querySelector(".alert").innerText = "Google reCaptcha ".concat(t);
          }
        });
      } catch (t) {
        s.classList.add("show"), e.querySelector(".alert").innerText = "Google reCaptcha ".concat(t);
      } else s.classList.add("show");
    });
  });
}
function bricksSubmitForm(e, t, r, i) {
  var o = t.querySelector("button[type=submit]");
  o.classList.add("sending");
  var s = new FormData(t);
  s.append("action", "bricks_form_submit"), s.append("postId", window.bricksData.postId), s.append("formId", e), s.append("recaptchaToken", i || ""), s.append("nonce", window.bricksData.nonce), s.append("referrer", location.toString());
  var _loop2 = function _loop2(_e17) {
    r[_e17].forEach(function (t) {
      s.append("".concat(_e17, "[]"), t, t.name);
    });
  };
  for (var _e17 in r) {
    _loop2(_e17);
  }
  var a = window.bricksData.ajaxUrl,
    n = new XMLHttpRequest();
  n.open("POST", a, !0), n.onreadystatechange = function () {
    var _e$data, _e$data2, _e$data3, _e$data4, _e$data5, _e$data$message, _e$data6;
    var e = function (e) {
      try {
        return JSON.parse(e);
      } catch (e) {
        return null;
      }
    }(n.response);
    if (window.bricksData.debug && console.warn("bricks_form_submit", n, e), !e) return;
    !e.success || "mailchimp" !== ((_e$data = e.data) === null || _e$data === void 0 ? void 0 : _e$data.action) && "sendgrid" !== ((_e$data2 = e.data) === null || _e$data2 === void 0 ? void 0 : _e$data2.action) || (window.dataLayer = window.dataLayer || [], window.dataLayer.push({
      event: "bricksNewsletterSignup"
    })), e.success && (_e$data3 = e.data) !== null && _e$data3 !== void 0 && _e$data3.redirectTo && setTimeout(function () {
      window.location.href = e.data.redirectTo;
    }, parseInt((_e$data4 = e.data) === null || _e$data4 === void 0 ? void 0 : _e$data4.redirectTimeout) || 0), t.querySelector(".message") && t.querySelector(".message").remove();
    var i = document.createElement("div");
    i.classList.add("message");
    var s = document.createElement("div");
    if (s.classList.add("text"), (_e$data5 = e.data) !== null && _e$data5 !== void 0 && _e$data5.message) if ((_e$data$message = e.data.message) !== null && _e$data$message !== void 0 && _e$data$message.errors) {
      var _t9 = e.data.message.errors;
      Object.keys(_t9).forEach(function (e) {
        s.innerHTML += _t9[e][0] + "<br>";
      });
    } else s.innerHTML = e.data.message;
    if (i.appendChild(s), (_e$data6 = e.data) !== null && _e$data6 !== void 0 && _e$data6.info) {
      var _t10 = document.createElement("div"),
        _r4 = document.createElement("div");
      _r4.innerHTML = e.data.info.join("<br>"), i.appendChild(_t10), _t10.appendChild(_r4);
    } else i.classList.add(e.data.type);
    if (t.appendChild(i), o.classList.remove("sending"), e.success) {
      t.reset(), r = {};
      var _e18 = bricksQuerySelectorAll(t, ".file-result");
      null !== _e18 && _e18.forEach(function (e) {
        e.remove();
      });
    }
  }, n.send(s);
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
      o = e.parentNode.querySelector(".bricks-isotope-filters");
    o && o.addEventListener("click", function (e) {
      var t = e.target.getAttribute("data-filter"),
        r = o.querySelector("li.active");
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
        o = {};
      (t === null || t === void 0 ? void 0 : t.marker) && (o.icon = {
        url: t.marker
      }, (t === null || t === void 0 ? void 0 : t.markerHeight) && (t === null || t === void 0 ? void 0 : t.markerWidth) && (o.icon.scaledSize = new google.maps.Size(parseInt(t.markerWidth), parseInt(t.markerHeight))));
      var s = {};
      (t === null || t === void 0 ? void 0 : t.markerActive) && (s = {
        url: t.markerActive
      }, (t === null || t === void 0 ? void 0 : t.markerActiveHeight) && (t === null || t === void 0 ? void 0 : t.markerActiveWidth) && (s.scaledSize = new google.maps.Size(parseInt(t.markerActiveWidth), parseInt(t.markerActiveHeight))));
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
      for (var _e19 = 0; _e19 < r.length; _e19++) {
        var _t11 = r[_e19];
        if (_t11 !== null && _t11 !== void 0 && _t11.latitude && _t11 !== null && _t11 !== void 0 && _t11.longitude) b(_t11, {
          lat: parseFloat(_t11.latitude),
          lng: parseFloat(_t11.longitude)
        });else if (_t11 !== null && _t11 !== void 0 && _t11.address) {
          new google.maps.Geocoder().geocode({
            address: _t11.address
          }, p(_t11));
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
        o.map = u, o.position = t;
        var c = new google.maps.Marker(o);
        if (c.setMap(u), i.push(c), google.maps.event.addListener(c, "click", function () {
          !function (e) {
            var _s2, _m;
            (o === null || o === void 0 ? void 0 : o.icon) && i.forEach(function (e) {
              e.setIcon(o.icon);
            });
            a.forEach(function (e) {
              e.hide();
            }), ((_s2 = s) === null || _s2 === void 0 ? void 0 : _s2.url) && c.setIcon(s);
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
              var _e20 = {
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
              void 0 !== window.jQuery && (_e20.closeBoxURL = "", _e20.content += '<span class="close">×</span>');
              var _i4 = new InfoBox(_e20);
              _i4.open(u, c), a.push(_i4), u.panTo(_i4.getPosition()), google.maps.event.addListener(_i4, "domready", function (e) {
                void 0 !== window.jQuery && jQuery(".close").on("click", function () {
                  _i4.close(), o !== null && o !== void 0 && o.icon && c.setIcon(o.icon), r.length > 1 && (n.extend(t), u.fitBounds(n), u.panToBounds(n));
                });
              });
            }
          }(e);
        }), n.extend(t), u.fitBounds(n), u.panToBounds(n), 1 === r.length) {
          var _e21 = google.maps.event.addListener(u, "idle", function () {
            u.setZoom(l), google.maps.event.removeListener(_e21);
          });
        }
      }
      if (t !== null && t !== void 0 && t.type && u.setMapTypeId(t.type), t !== null && t !== void 0 && t.style) if ("custom" === t.style && t !== null && t !== void 0 && t.customStyle) {
        var _e22 = JSON.stringify(t.customStyle);
        u.setOptions({
          styles: JSON.parse(_e22)
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
          var _e23 = _i5.querySelector("li:nth-child(".concat(r + 1, ") .splide__pagination__page"));
          _e23 && _e23.setAttribute("aria-controls", t.id);
        }
      }
      if (!t.classList.contains("bricks-lazy-hidden")) {
        var _e24 = t.getAttribute("style") || "";
        t.dataset.style && (_e24 += t.dataset.style, t.setAttribute("style", _e24));
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
      o = window.bricksData.swiperInstances.hasOwnProperty(i) ? window.bricksData.swiperInstances[i] : void 0;
    o && o.destroy(), t.observer = !1, t.observeParents = !0, t.resizeObserver = !0, t.slidesToShow = t.hasOwnProperty("slidesToShow") ? t.slidesToShow : 1, t.slidesPerGroup = t.hasOwnProperty("slidesPerGroup") ? t.slidesPerGroup : 1, t.speed = t.hasOwnProperty("speed") ? parseInt(t.speed) : 300, t.effect = t.hasOwnProperty("effect") ? t.effect : "slide", t.spaceBetween = t.hasOwnProperty("spaceBetween") ? t.spaceBetween : 0, t.initialSlide = t.hasOwnProperty("initialSlide") ? t.initialSlide : 0, t.keyboard = {
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
    }, 1 == t.dynamicBullets && (delete t.dynamicBullets, t.pagination.dynamicBullets = !0)), o = new Swiper(e, t), window.bricksData.swiperInstances[i] = o;
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
        var _t12 = e.dataset.scriptId,
          r = e.querySelector(".bricks-plyr"),
          i = ((_window$bricksData = window.bricksData) === null || _window$bricksData === void 0 ? void 0 : (_window$bricksData$vi = _window$bricksData.videoInstances) === null || _window$bricksData$vi === void 0 ? void 0 : _window$bricksData$vi[_t12]) || void 0;
        i && i.destroy(), r && (i = new Plyr(r)), window.bricksData.videoInstances[_t12] = i;
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
      var _e25 = document.createElement("script");
      _e25.type = "text/javascript", _e25.id = "bricks-facebook-page-sdk", _e25.appendChild(document.createTextNode(i.responseText)), document.body.appendChild(_e25), FB.init({
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
  if (!bricksIsFrontend) return;
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
      var i = !1;
      if (t !== null && t !== void 0 && t.trigger) {
        var _window$bricksData2;
        if ("scroll" === t.trigger) {
          var _e26 = 0;
          if (t !== null && t !== void 0 && t.scrollOffset) if (_e26 = t === null || t === void 0 ? void 0 : t.scrollOffset.replace("px", ""), _e26.includes("%")) {
            _e26 = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight) / 100 * parseInt(_e26);
          } else _e26.includes("vh") && (_e26 = window.innerHeight / 100 * parseInt(_e26));
          t.scrollOffset = _e26;
        } else "mouseleaveWindow" === t.trigger && (t.trigger = "mouseleave", i = !0);
        if ("loadMore" === t.action) {
          var _window$bricksData$qu2;
          var _r5 = t === null || t === void 0 ? void 0 : t.loadMoreQuery;
          ((_window$bricksData$qu2 = window.bricksData.queryLoopInstances) === null || _window$bricksData$qu2 === void 0 ? void 0 : _window$bricksData$qu2[_r5]) || e.remove();
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
            var _r6 = (t === null || t === void 0 ? void 0 : t.delay) || 0;
            _r6 && _r6.includes("ms") ? _r6 = parseInt(_r6) : _r6 && _r6.includes("s") && (_r6 = 1e3 * parseFloat(_r6)), setTimeout(function () {
              bricksInteractionCallbackExecution(e, t);
            }, _r6);
            break;
          case "enterView":
          case "leaveView":
            new BricksIntersect({
              element: e,
              callback: function callback(e) {
                return bricksInteractionCallbackExecution(e, t);
              },
              once: t === null || t === void 0 ? void 0 : t.runOnce,
              trigger: t === null || t === void 0 ? void 0 : t.trigger
            });
        }
      }
    });
  }), Array.isArray((_window$bricksData3 = window.bricksData) === null || _window$bricksData3 === void 0 ? void 0 : _window$bricksData3.interactions) && -1 !== window.bricksData.interactions.findIndex(function (e) {
    return "scroll" === e.trigger;
  }) && document.addEventListener("scroll", bricksScrollInteractions);
}
function bricksPopups() {
  window.bricksPopupsData = {
    initialized: []
  }, document.addEventListener("bricks/popup/open", function (e) {
    var _e$detail;
    var t = ((_e$detail = e.detail) === null || _e$detail === void 0 ? void 0 : _e$detail.popupElement) || !1;
    t && (setTimeout(function () {
      var e = bricksGetFocusables(t);
      if (e.length) {
        var _t13 = e[0],
          r = e[e.length - 1];
        e[0].focus(), document.addEventListener("keydown", function (e) {
          "Tab" === e.key && (e.shiftKey ? document.activeElement === _t13 && (r.focus(), e.preventDefault()) : document.activeElement === r && (_t13.focus(), e.preventDefault()));
        }, {
          once: !0
        });
      }
    }, 100), bricksIsFrontend && !window.bricksPopupsData.initialized.includes(t) && (document.addEventListener("keyup", function (e) {
      "Escape" === e.key && bricksClosePopup(t);
    }), document.addEventListener("click", function (e) {
      e.target.classList.contains("brx-popup") && bricksClosePopup(t);
    }), window.bricksPopupsData.initialized.push(t)), bricksCounter());
  });
}
function bricksScrollInteractions(e) {
  clearTimeout(bricksScrollTimeout), bricksScrollTimeout = setTimeout(function () {
    var e = window.scrollY;
    window.bricksData.interactions.filter(function (e) {
      return "scroll" === e.trigger;
    }).forEach(function (t) {
      if (e >= t.scrollOffset && (bricksInteractionCallbackExecution(t.el, t), t !== null && t !== void 0 && t.runOnce)) {
        var _e27 = window.bricksData.interactions.findIndex(function (e) {
          return e.id === t.id;
        });
        -1 !== _e27 && window.bricksData.interactions.splice(_e27, 1);
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
        if (t !== null && t !== void 0 && t.templateId) {
          var _e$dataset4;
          var _r7 = ((_e$dataset4 = e.dataset) === null || _e$dataset4 === void 0 ? void 0 : _e$dataset4.interactionLoop) || !1;
          if (_r7) {
            var _e$dataset5;
            var o = ((_e$dataset5 = e.dataset) === null || _e$dataset5 === void 0 ? void 0 : _e$dataset5.interactionLoopIndex) || 0;
            i = bricksQuerySelectorAll(document, ".brx-popup[data-popup-id=\"".concat(t.templateId, "\"][data-popup-loop=\"").concat(_r7, "\"][data-popup-loop-index=\"").concat(o, "\"]"));
          } else i = bricksQuerySelectorAll(document, ".brx-popup[data-popup-id=\"".concat(t.templateId, "\"]"));
        }
        break;
      default:
        i = e;
    }
    if (i) switch (i = Array.isArray(i) ? i : [i], t === null || t === void 0 ? void 0 : t.action) {
      case "show":
      case "hide":
        i.forEach(function (e) {
          e !== null && e !== void 0 && e.classList.contains("brx-popup") ? "show" === t.action ? bricksOpenPopup(e) : "hide" === t.action && bricksClosePopup(e) : e.style.display = "hide" === t.action ? "none" : "block";
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
        var _o2 = t === null || t === void 0 ? void 0 : t.storageType,
          s = t === null || t === void 0 ? void 0 : t.actionAttributeKey,
          a = t.hasOwnProperty("actionAttributeValue") ? t.actionAttributeValue : 0;
        if (_o2 && s) if ("storageAdd" === t.action) bricksStorageSetItem(_o2, s, a);else if ("storageRemove" === t.action) bricksStorageRemoveItem(_o2, s);else if ("storageCount" === t.action) {
          var _e28 = bricksStorageGetItem(_o2, s);
          _e28 = _e28 ? parseInt(_e28) : 0, bricksStorageSetItem(_o2, s, _e28 + 1);
        }
        break;
      case "startAnimation":
        var n = t === null || t === void 0 ? void 0 : t.animationType;
        n && i.forEach(function (e) {
          var r = 1e3;
          t !== null && t !== void 0 && t.animationDuration && (e.style.animationDuration = t.animationDuration, t.animationDuration.includes("ms") ? r = parseInt(t.animationDuration) : t.animationDuration.includes("s") && (r = 1e3 * parseFloat(t.animationDuration))), t !== null && t !== void 0 && t.animationDelay && (e.style.animationDelay = t.animationDelay, t.animationDelay.includes("ms") ? r += parseInt(t.animationDelay) : t.animationDelay.includes("s") && (r += 1e3 * parseFloat(t.animationDelay))), e !== null && e !== void 0 && e.classList.contains("brx-popup") && (n.includes("Out") ? setTimeout(function () {
            bricksClosePopup(e);
          }, r) : bricksOpenPopup(e)), e.classList.add("brx-animated"), e.setAttribute("data-animation", n), bricksAnimation([e], r);
        });
        break;
      case "loadMore":
        var c = t === null || t === void 0 ? void 0 : t.loadMoreQuery,
          l = (_window$bricksData$qu3 = window.bricksData.queryLoopInstances) === null || _window$bricksData$qu3 === void 0 ? void 0 : _window$bricksData$qu3[c];
        if (!l) return;
        var d = l.isPostsElement ? (_document$querySelect = document.querySelector(".bricks-isotope-sizer[data-query-element-id=\"".concat(c, "\"]"))) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.previousElementSibling : Array.from(document.querySelectorAll(".brxe-".concat(c, ":not(.brx-popup)"))).pop();
        d && (e.classList.contains("is-loading") || (e.classList.add("is-loading"), d.dataset.queryElementId = c, bricksQueryLoadPage(d).then(function (t) {
          e.classList.remove("is-loading"), (t === null || t === void 0 ? void 0 : t.page) >= (t === null || t === void 0 ? void 0 : t.maxPages) && e.remove();
        })));
    }
  }
}
function bricksOpenPopup(e) {
  if (!bricksIsFrontend) return;
  var t;
  if (e && (e.nodeType === Node.ELEMENT_NODE ? t = e : e && (t = document.querySelector(".brx-popup[data-popup-id=\"".concat(e, "\"]")))), !t) return;
  var r = t.dataset.popupId;
  if (bricksPopupCheckLimit(t)) {
    t.classList.remove("hide"), t.dataset.popupBodyScroll || document.body.classList.add("no-scroll");
    var _e29 = new CustomEvent("bricks/popup/open", {
      detail: {
        popupId: r,
        popupElement: t
      }
    });
    document.dispatchEvent(_e29), bricksPopupCounter(t);
  }
}
function bricksClosePopup(e) {
  if (!bricksIsFrontend) return;
  var t;
  if (e && (e.nodeType === Node.ELEMENT_NODE ? t = e : e && (t = document.querySelector(".brx-popup[data-popup-id=\"".concat(e, "\"]")))), !t) return;
  var r = t.dataset.popupId;
  t.classList.add("hide"), t.dataset.popupBodyScroll || document.body.classList.remove("no-scroll");
  var i = new CustomEvent("bricks/popup/close", {
    detail: {
      popupId: r,
      popupElement: t
    }
  });
  document.dispatchEvent(i);
}
function bricksPopupCheckLimit(e) {
  var _e$dataset6, _e$dataset7;
  var t = e === null || e === void 0 ? void 0 : (_e$dataset6 = e.dataset) === null || _e$dataset6 === void 0 ? void 0 : _e$dataset6.popupLimits,
    r = e === null || e === void 0 ? void 0 : (_e$dataset7 = e.dataset) === null || _e$dataset7 === void 0 ? void 0 : _e$dataset7.popupId;
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
    var o = bricksStorageGetItem(e, "brx_popup_".concat(r, "_total"));
    o = o ? parseInt(o) : 0, i = i || o >= t;
  }), !i;
}
function bricksPopupCounter(e) {
  var _e$dataset8, _e$dataset9;
  var t = e === null || e === void 0 ? void 0 : (_e$dataset8 = e.dataset) === null || _e$dataset8 === void 0 ? void 0 : _e$dataset8.popupLimits,
    r = e === null || e === void 0 ? void 0 : (_e$dataset9 = e.dataset) === null || _e$dataset9 === void 0 ? void 0 : _e$dataset9.popupId;
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
  var i = function i(e) {
    return isNaN(e) ? 0 : parseFloat(e);
  };
  return e.interactionConditions.forEach(function (e) {
    var o = e === null || e === void 0 ? void 0 : e.conditionType,
      s = (e === null || e === void 0 ? void 0 : e.storageKey) || !1,
      a = !1;
    if (o && s) {
      var _t14 = (e === null || e === void 0 ? void 0 : e.storageCompare) || "exists",
        _r9 = e === null || e === void 0 ? void 0 : e.storageCompareValue,
        n = bricksStorageGetItem(o, s);
      switch (_t14) {
        case "exists":
          a = null !== n;
          break;
        case "notExists":
          a = null === n;
          break;
        case "==":
          a = n == _r9;
          break;
        case "!=":
          a = n != _r9;
          break;
        case ">=":
          a = i(n) >= i(_r9);
          break;
        case "<=":
          a = i(n) <= i(_r9);
          break;
        case ">":
          a = i(n) > i(_r9);
          break;
        case "<":
          a = i(n) < i(_r9);
      }
    } else a = !0;
    r = "and" === t ? r && a : r || a;
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
function bricksNavNested() {
  if (!bricksIsFrontend) return;
  var e = bricksQuerySelectorAll(document, ".brxe-nav-nested");
  if (!e.length) return;
  var t = new MutationObserver(function (e) {
    e.forEach(function (e) {
      if ("attributes" === e.type && "class" === e.attributeName) {
        var _t15 = e.target;
        if (_t15.classList.contains("brx-open")) {
          _t15.ariaHidden = !1;
          var _e30 = _t15.querySelector(".brx-nav-nested-items button.brxe-toggle");
          if (_e30) _e30.classList.add("is-active"), _e30.setAttribute("aria-expanded", !0), _e30.focus();else {
            var _e31 = bricksGetFocusables(_t15);
            _e31.length && _e31[0].focus();
          }
        } else {
          var _e32 = _t15.dataset.toggleScriptId,
            r = document.querySelector("button[data-script-id=\"".concat(_e32, "\"]"));
          r && (r.setAttribute("aria-expanded", !1), r.classList.remove("is-active"), r.focus()), _t15.ariaHidden = !0;
        }
      }
    });
  });
  e.forEach(function (e) {
    t.observe(e, {
      attributes: !0,
      attributeFilter: ["class"]
    });
  }), document.addEventListener("keyup", function (e) {
    "Escape" === e.key && bricksNavNestedClose();
  }), document.addEventListener("click", function (e) {
    e.target.closest(".brxe-nav-nested") || bricksNavNestedClose();
  });
}
function bricksOffcanvas() {
  if (!bricksIsFrontend) return;
  var e = bricksQuerySelectorAll(document, ".brxe-offcanvas");
  if (!e.length) return;
  var t = new MutationObserver(function (e) {
    e.forEach(function (e) {
      if ("attributes" === e.type && "class" === e.attributeName) {
        var _t16 = e.target;
        if (_t16.classList.contains("brx-open")) {
          if (_t16.ariaHidden = !1, "offset" === _t16.dataset.effect) {
            var _e33 = _t16.querySelector(".brx-offcanvas-inner");
            if (_e33) {
              var _r10 = window.getComputedStyle(_e33).getPropertyValue("transition");
              document.body.style.transition = _r10, _t16.classList.contains("top") ? (document.body.style.marginTop = "".concat(_e33.offsetHeight, "px"), document.body.style.overflowY = "hidden") : _t16.classList.contains("right") ? (document.body.style.marginLeft = "-".concat(_e33.offsetWidth, "px"), document.body.style.overflowX = "hidden") : _t16.classList.contains("bottom") ? (document.body.style.marginTop = "-".concat(_e33.offsetHeight, "px"), document.body.style.overflowY = "hidden") : _t16.classList.contains("left") && (document.body.style.marginLeft = "".concat(_e33.offsetWidth, "px"), document.body.style.overflowX = "hidden");
            }
          }
          _t16.dataset.noScroll && document.body.classList.add("no-scroll");
          var _e34 = bricksGetFocusables(_t16);
          _e34.length && _e34[0].focus();
          var r = _t16.querySelector(".brx-offcanvas-inner > button.brxe-toggle");
          r && (r.classList.add("is-active"), r.setAttribute("aria-expanded", !0));
        } else {
          var _e35 = _t16.dataset.toggleScriptId,
            _r11 = document.querySelector("button[data-script-id=\"".concat(_e35, "\"]"));
          _r11 && (_r11.setAttribute("aria-expanded", !1), _r11.classList.remove("is-active"), _r11.focus()), _t16.ariaHidden = !0, "offset" === _t16.dataset.effect && (document.body.style = null), document.body.classList.remove("no-scroll");
        }
      }
    });
  });
  e.forEach(function (e) {
    t.observe(e, {
      attributes: !0,
      attributeFilter: ["class"]
    });
    var r = e.querySelector(".brx-offcanvas-backdrop");
    r && r.addEventListener("click", function (e) {
      bricksOffcanvasClose();
    });
  }), document.addEventListener("keyup", function (e) {
    "Escape" === e.key && bricksOffcanvasClose();
  });
}
function bricksOffcanvasClose() {
  bricksQuerySelectorAll(document, ".brxe-offcanvas.brx-open").forEach(function (e) {
    e.classList.remove("brx-open");
  });
}
function bricksToggle() {
  if (!bricksIsFrontend) return;
  var e = bricksQuerySelectorAll(document, ".brxe-toggle");
  e.length && e.forEach(function (e) {
    e.addEventListener("click", function (t) {
      var _e$dataset10, _e$dataset11, _e$dataset12;
      t.preventDefault();
      var r = (_e$dataset10 = e.dataset) === null || _e$dataset10 === void 0 ? void 0 : _e$dataset10.selector,
        i = ((_e$dataset11 = e.dataset) === null || _e$dataset11 === void 0 ? void 0 : _e$dataset11.attribute) || "class",
        o = ((_e$dataset12 = e.dataset) === null || _e$dataset12 === void 0 ? void 0 : _e$dataset12.value) || "brx-open",
        s = !!r && document.querySelector(r);
      if (s || (s = e.closest(".brxe-nav-nested")), s || (s = document.querySelector(".brxe-offcanvas")), !s) return;
      e.dataset.scriptId && !s.dataset.toggleScriptId && (s.dataset.toggleScriptId = e.dataset.scriptId);
      var a = "true" === e.getAttribute("aria-expanded");
      e.setAttribute("aria-expanded", !a), e.classList.toggle("is-active"), "class" === i ? s.classList.toggle(o) : s.getAttribute(i) ? s.removeAttribute(i) : s.setAttribute(i, o);
      var n = bricksGetFocusables(s);
      n.length && n[0].focus();
    });
  });
}
function bricksNavNestedClose() {
  bricksQuerySelectorAll(document, ".brxe-nav-nested.brx-open").forEach(function (e) {
    e.classList.remove("brx-open");
  });
}
function bricksDropdownContent() {
  var e = bricksQuerySelectorAll(document, ".brxe-dropdown.full");
  e.length && e.forEach(function (e) {
    var t = e.getBoundingClientRect();
    if (t.left) {
      e.querySelector(".brx-dropdown-content").style.left = "-".concat(t.left, "px");
    }
  });
}
function bricksDropdown() {
  if (bricksDropdownContent(), !bricksIsFrontend) return;
  var e = bricksQuerySelectorAll(document, ".brx-dropdown-toggle [aria-expanded]");
  e.length && (e.forEach(function (e) {
    e.addEventListener("click", function () {
      bricksDropdownToggleContent(e);
    });
  }), document.addEventListener("keydown", function (t) {
    if (("Enter" === t.key || " " === t.key) && document.activeElement) {
      var _e36 = document.activeElement.hasAttribute("aria-expanded") && t.target.parentNode.classList.contains(".brx-dropdown-toggle");
      _e36 && bricksDropdownToggleContent(_e36);
    }
    if ("Escape" === t.key && e.forEach(function (e) {
      bricksDropdownToggleContent(e, "close");
    }), "Tab" === t.key) {
      var _e37 = document.activeElement.closest(".brxe-dropdown.open");
      if (_e37 && !document.activeElement.nextSibling && (!document.activeElement.hasAttribute("aria-expanded") || "false" === document.activeElement.getAttribute("aria-expanded"))) {
        var _t17 = _e37.querySelector(".brx-dropdown-toggle [aria-expanded]");
        _t17 && bricksDropdownToggleContent(_t17, "close");
      }
    }
  }), document.addEventListener("click", function (t) {
    t.target.closest(".brxe-dropdown") || bricksQuerySelectorAll(document, ".brxe-dropdown").forEach(function (t) {
      t.classList.remove("open"), e.forEach(function (e) {
        return e.setAttribute("aria-expanded", !1);
      });
    });
  }));
}
function bricksDropdownToggleContent(e) {
  var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "toggle";
  if (e) if ("toggle" === t) {
    var _t18 = e.closest(".brxe-dropdown");
    _t18 && _t18.classList.toggle("open");
    var r = "true" === e.getAttribute("aria-expanded");
    e.setAttribute("aria-expanded", !r);
  } else if ("close" === t) {
    bricksQuerySelectorAll(e.closest(".brxe-nav-nested"), ".brxe-dropdown").forEach(function (e) {
      e.classList.remove("open");
      var t = e.querySelector("[aria-expanded]");
      t && t.setAttribute("aria-expanded", !1);
    });
  }
}
function bricksGetFocusables(e) {
  var t = e.querySelectorAll('a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])');
  return Array.prototype.slice.call(t);
}
var bricksIsFrontend, bricksScrollTimeout;
document.addEventListener("DOMContentLoaded", function (e) {
  var t;
  bricksIsFrontend = document.body.classList.contains("bricks-is-frontend"), bricksStickyHeader(), bricksNavSubmenuPositioning(), bricksOnePageNavigation(), bricksPrettify(), bricksSkipLinks(), bricksAccordion(), bricksAnimatedTyping(), bricksAudio(), bricksCountdown(), bricksCounter(), bricksIsotope(), bricksPricingTables(), bricksSplide(), bricksSwiper(), bricksVideo(), bricksLightbox(), bricksFacebookSDK(), setTimeout(function () {
    bricksLazyLoad(), bricksAnimation(), bricksDropdown(), bricksNavNested(), bricksOffcanvas(), bricksToggle(), bricksPieChart(), bricksProgressBar(), bricksForm(), bricksInitQueryLoopInstances(), bricksQueryPagination(), bricksInteractions(), bricksPopups();
  }, 200), bricksSearchOverlay(), bricksNavMenu(), bricksAlertDismiss(), bricksTabs(), bricksVideoOverlayClickDetector(), bricksBackgroundVideoInit(), bricksPhotoswipe(), window.addEventListener("resize", function () {
    clearTimeout(t), bricksIsFrontend || (t = setTimeout(bricksSwiper, 250), t = setTimeout(bricksSplide, 250)), t = setTimeout(bricksDropdownContent, 250);
  });
});
