function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e45) { throw _e45; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e46) { didErr = true; err = _e46; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
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
    s = !e.hasOwnProperty("once") || e.once,
    i = !!e.hasOwnProperty("trigger") && e.trigger;
  if ("IntersectionObserver" in window) {
    var n = !0,
      o = new IntersectionObserver(function (e, o) {
        e.forEach(function (e) {
          if ("leaveView" === i ? !e.isIntersecting : e.isIntersecting) {
            if (n && "leaveView" === i) return void (n = !1);
            t && r && r(e.target), s && o.unobserve(e.target);
          }
        });
      }, {
        threshold: e.threshold || 0,
        root: e.root || null,
        rootMargin: (e === null || e === void 0 ? void 0 : e.rootMargin) || "0px"
      });
    t instanceof Element && o.observe(t);
  } else {
    var _e = !1,
      _s = function _s() {
        !1 === _e && (_e = !0, t.getBoundingClientRect().top <= window.innerHeight && t.getBoundingClientRect().bottom >= 0 && "none" !== window.getComputedStyle(t).display && t && r && r(t), _e = !1);
      };
    _s(), document.addEventListener("scroll", _s), window.addEventListener("resize", _s), window.addEventListener("orientationchange", _s);
  }
});
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
var bricksUtils = {
  subscribeEvents: function subscribeEvents(e, t, r) {
    t.forEach(function (t) {
      e.addEventListener(t, function (e) {
        r(e);
      });
    });
  }
};
var BricksFunction = /*#__PURE__*/function () {
  function BricksFunction(e) {
    var _e$run,
      _e$eachElement,
      _e$listenerHandler,
      _e$addEventListeners,
      _this = this;
    _classCallCheck(this, BricksFunction);
    _defineProperty(this, "_customRun", null);
    _defineProperty(this, "_customEachElement", null);
    _defineProperty(this, "_customListenerHandler", null);
    _defineProperty(this, "_customAddEventListeners", null);
    _defineProperty(this, "_settings", {});
    _defineProperty(this, "_initializedElements", new Set());
    var t = {
      parentNode: document,
      selector: "",
      subscribeEvents: ["bricks/ajax/pagination/completed", "bricks/ajax/load_page/completed"],
      forceReinit: !1,
      frontEndOnly: !1,
      windowVariableCheck: [],
      additionalActions: []
    };
    Object.assign(t, e), this._settings = t, this._customRun = (_e$run = e === null || e === void 0 ? void 0 : e.run) !== null && _e$run !== void 0 ? _e$run : null, this._customEachElement = (_e$eachElement = e === null || e === void 0 ? void 0 : e.eachElement) !== null && _e$eachElement !== void 0 ? _e$eachElement : null, this._customListenerHandler = (_e$listenerHandler = e === null || e === void 0 ? void 0 : e.listenerHandler) !== null && _e$listenerHandler !== void 0 ? _e$listenerHandler : null, this._customAddEventListeners = (_e$addEventListeners = e === null || e === void 0 ? void 0 : e.addEventListeners) !== null && _e$addEventListeners !== void 0 ? _e$addEventListeners : null, this.cleanUpInitElements = this.cleanUpInitElements.bind(this), this.run = this.run.bind(this), this.eachElement = this.eachElement.bind(this), this.listenerHandler = this.listenerHandler.bind(this), this.addEventListeners = this.addEventListeners.bind(this), document.addEventListener("DOMContentLoaded", function () {
      if (_this.addEventListeners(), _this._settings.additionalActions.length) {
        var _iterator = _createForOfIteratorHelper(_this._settings.additionalActions),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var _e2 = _step.value;
            "function" == typeof _e2 && _e2.call(_this);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    });
  }
  _createClass(BricksFunction, [{
    key: "functionCanRun",
    value: function functionCanRun() {
      if (this._settings.frontEndOnly && !document.body.classList.contains("bricks-is-frontend")) return !1;
      if (this._settings.windowVariableCheck.length) {
        var _iterator2 = _createForOfIteratorHelper(this._settings.windowVariableCheck),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var e = _step2.value;
            if (!window[e]) return !1;
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
      return !0;
    }
  }, {
    key: "cleanUpInitElements",
    value: function cleanUpInitElements() {
      var _iterator3 = _createForOfIteratorHelper(this._initializedElements),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var e = _step3.value;
          e.isConnected || this._initializedElements["delete"](e);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
  }, {
    key: "eachElement",
    value: function eachElement(e) {
      this._customEachElement && "function" == typeof this._customEachElement && this._customEachElement.call(this, e);
    }
  }, {
    key: "run",
    value: function run(e) {
      var _this2 = this;
      if (!this.functionCanRun()) return;
      if (this.cleanUpInitElements(), this._customRun && "function" == typeof this._customRun) return void this._customRun.call(this, e);
      var t = Object.assign({}, this._settings);
      e && Object.keys(e).forEach(function (r) {
        t.hasOwnProperty(r) && (t[r] = e[r]);
      });
      var r = bricksQuerySelectorAll(t.parentNode, t.selector);
      r.length && r.forEach(function (e, r) {
        if (t.forceReinit) {
          if ("function" == typeof t.forceReinit ? t.forceReinit.call(_this2, e, r) : t.forceReinit) return void _this2.eachElement(e, r);
        }
        if (_this2._initializedElements.has(e)) {
          var _t = Array.from(_this2._initializedElements).find(function (t) {
            return t === e;
          });
          _t.isConnected || (_this2._initializedElements["delete"](_t), _this2._initializedElements.add(e, r), _this2.eachElement(e, r));
        } else _this2._initializedElements.add(e), _this2.eachElement(e, r);
      });
    }
  }, {
    key: "listenerHandler",
    value: function listenerHandler(e) {
      this._customListenerHandler && "function" == typeof this._customListenerHandler ? this._customListenerHandler.call(this, e) : (e === null || e === void 0 ? void 0 : e.type) && (e.type, this.run());
    }
  }, {
    key: "addEventListeners",
    value: function addEventListeners() {
      this.functionCanRun() && (this._customAddEventListeners && "function" == typeof this._customAddEventListeners ? this._customAddEventListeners.call(this) : this._settings.subscribeEvents.length && bricksUtils.subscribeEvents(document, this._settings.subscribeEvents, this.listenerHandler));
    }
  }]);
  return BricksFunction;
}();
var bricksLazyLoadFn = new BricksFunction({
  parentNode: document,
  selector: ".bricks-lazy-hidden",
  eachElement: function eachElement(e) {
    var t = window.bricksData.offsetLazyLoad || 300;
    new BricksIntersect({
      element: e,
      callback: function callback(e) {
        (function (e) {
          if (e.classList.add("wait"), e.dataset.src && (e.src = e.dataset.src, delete e.dataset.src), e.dataset.sizes && (e.sizes = e.dataset.sizes, delete e.dataset.sizes), e.dataset.srcset && (e.srcset = e.dataset.srcset, delete e.dataset.srcset), e.dataset.style) {
            var _t2 = e.getAttribute("style") || "";
            _t2 += e.dataset.style, e.setAttribute("style", _t2), e.classList.contains("splide__slide") || delete e.dataset.style;
          }
          e.classList.remove("bricks-lazy-hidden"), e.classList.remove("wait"), e.classList.contains("bricks-lazy-load-isotope") && bricksIsotope();
        })(e);
      },
      rootMargin: "".concat(t, "px")
    });
  },
  listenerHandler: function listenerHandler(e) {
    setTimeout(function () {
      bricksLazyLoadFn.run();
    }, 100);
  }
});
function bricksLazyLoad() {
  bricksLazyLoadFn.run();
}
var bricksAnimationFn = new BricksFunction({
  parentNode: document,
  selector: ".brx-animated",
  removeAfterMs: 3e3,
  eachElement: function eachElement(e) {
    new BricksIntersect({
      element: e,
      callback: function callback(e) {
        var t = e.dataset.animation;
        t && (e.classList.add("brx-animate-".concat(t)), e.removeAttribute("data-animation"), e.addEventListener("animationend", function () {
          if (e.classList.remove("brx-animate-".concat(t)), e.classList.contains("brx-popup-content") && t.includes("Out")) {
            var _t3 = e.closest(".brx-popup");
            _t3 && bricksClosePopup(_t3);
          }
        }, {
          once: !0
        }));
      }
    });
  },
  run: function run(e) {
    var t = bricksAnimationFn,
      r = (e === null || e === void 0 ? void 0 : e.elementsToAnimate) || bricksQuerySelectorAll(t._settings.parentNode, t._settings.selector);
    t.removeAfterMs = (e === null || e === void 0 ? void 0 : e.removeAfterMs) || t.removeAfterMs, r.forEach(function (e) {
      t.eachElement(e);
    });
  }
});
function bricksAnimation() {
  bricksAnimationFn.run();
}
var bricksInitQueryLoopInstancesFn = new BricksFunction({
  parentNode: document,
  selector: ".brx-query-trail",
  subscribeEvents: ["bricks/ajax/load_page/completed"],
  eachElement: function eachElement(e) {
    var _e$dataset;
    var t = ((_e$dataset = e.dataset) === null || _e$dataset === void 0 ? void 0 : _e$dataset.observerMargin) || "1px",
      r = e.dataset.queryElementId,
      s = e.dataset.queryVars,
      i = e === null || e === void 0 ? void 0 : e.classList.contains("bricks-isotope-sizer"),
      n = e === null || e === void 0 ? void 0 : e.classList.contains("brx-infinite-scroll");
    window.bricksData.queryLoopInstances[r] = {
      page: e.dataset.page,
      maxPages: e.dataset.maxPages,
      queryVars: s,
      observerMargin: t,
      infiniteScroll: n,
      isPostsElement: i
    };
    var o = i ? e.previousElementSibling : Array.from(document.querySelectorAll(".brxe-".concat(r, ":not(.brx-popup)"))).pop();
    i || e.remove(), o && n && (o.dataset.queryElementId = r, new BricksIntersect({
      element: o,
      callback: function callback(e) {
        return bricksQueryLoadPage(e);
      },
      once: 1,
      rootMargin: t
    }));
  }
});
function bricksInitQueryLoopInstances() {
  bricksInitQueryLoopInstancesFn.run();
}
function bricksQueryLoadPage(e) {
  return new Promise(function (t, r) {
    var _window$bricksData$qu;
    var s = e.dataset.queryElementId,
      i = (_window$bricksData$qu = window.bricksData.queryLoopInstances) === null || _window$bricksData$qu === void 0 ? void 0 : _window$bricksData$qu[s];
    if (!i || i !== null && i !== void 0 && i.isLoading) return;
    var n = parseInt(i.page || 1) + 1;
    var o = parseInt(i.maxPages || 1);
    if (n > o) return delete window.bricksData.queryLoopInstances[s], void t({
      page: n,
      maxPages: o
    });
    window.bricksData.queryLoopInstances[s].isLoading = 1;
    var a = {
      postId: window.bricksData.postId,
      queryElementId: s,
      queryVars: i.queryVars,
      page: n,
      nonce: window.bricksData.nonce
    };
    var c = window.bricksData.restApiUrl.concat("load_query_page");
    var l = new XMLHttpRequest();
    l.open("POST", c, !0), l.setRequestHeader("Content-Type", "application/json; charset=UTF-8"), l.setRequestHeader("X-WP-Nonce", window.bricksData.wpRestNonce), l.onreadystatechange = function () {
      if (l.readyState === XMLHttpRequest.DONE) {
        var r = l.status;
        if (0 === r || r >= 200 && r < 400) {
          var _t4 = JSON.parse(l.response);
          var _r = (_t4 === null || _t4 === void 0 ? void 0 : _t4.html) || !1,
            _i = (_t4 === null || _t4 === void 0 ? void 0 : _t4.styles) || !1,
            _o = (_t4 === null || _t4 === void 0 ? void 0 : _t4.popups) || !1;
          _r && e.insertAdjacentHTML("afterend", _r), _o && document.body.insertAdjacentHTML("beforeend", _o), _i && document.body.insertAdjacentHTML("beforeend", _i), window.bricksData.queryLoopInstances[s].page = n;
        }
        window.bricksData.queryLoopInstances[s].isLoading = 0, t({
          page: n,
          maxPages: o
        }), setTimeout(function () {
          i.isPostsElement ? newQueryTrail = e.parentNode.querySelector(".bricks-isotope-sizer").previousElementSibling : newQueryTrail = Array.from(document.querySelectorAll(".brxe-".concat(s, ":not(.brx-popup)"))).pop(), document.dispatchEvent(new CustomEvent("bricks/ajax/load_page/completed", {
            detail: {
              queryTrailElement: newQueryTrail,
              queryId: s
            }
          })), i.infiniteScroll && (newQueryTrail.dataset.queryElementId = s, BricksIsInViewport(newQueryTrail) ? bricksQueryLoadPage(newQueryTrail) : new BricksIntersect({
            element: newQueryTrail,
            callback: function callback(e) {
              return bricksQueryLoadPage(e);
            },
            once: !0,
            rootMargin: i.observerMargin
          }));
        }, 250);
      }
    }, l.send(JSON.stringify(a));
  });
}
var bricksQueryPaginationFn = new BricksFunction({
  parentNode: document,
  selector: ".brx-ajax-pagination a",
  subscribeEvents: ["bricks/ajax/pagination/completed"],
  eachElement: function eachElement(e) {
    var _e$dataset2;
    ((_e$dataset2 = e.dataset) === null || _e$dataset2 === void 0 ? void 0 : _e$dataset2.ajaxPagination) || (e.dataset.ajaxPagination = 1, e.addEventListener("click", function (e) {
      var _s$dataset;
      var t = e.currentTarget,
        r = t.getAttribute("href"),
        s = t.closest(".brx-ajax-pagination"),
        i = s === null || s === void 0 ? void 0 : (_s$dataset = s.dataset) === null || _s$dataset === void 0 ? void 0 : _s$dataset.queryElementId,
        n = document.querySelector(".brxe-".concat(i));
      if (!n) return;
      e.preventDefault();
      var o = new XMLHttpRequest();
      o.open("GET", r, !0), o.responseType = "document", o.onload = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
          var e = this.status;
          if (0 === e || e >= 200 && e < 400) {
            var _e3 = this.responseXML,
              _t5 = n.parentNode,
              _o2 = document.createElement("div");
            _o2.style.display = "none", n.insertAdjacentElement("beforebegin", _o2);
            _t5.querySelectorAll(".brxe-".concat(i, ":not(.brx-popup)")).forEach(function (e) {
              return e.remove();
            });
            _e3.querySelectorAll(".brxe-".concat(i, ":not(.brx-popup)")).forEach(function (e) {
              return _o2.insertAdjacentElement("beforebegin", e);
            }), _o2.remove();
            document.querySelectorAll(".brx-popup[data-popup-loop=\"".concat(i, "\"]")).forEach(function (e) {
              return e.remove();
            });
            _e3.querySelectorAll(".brx-popup[data-popup-loop=\"".concat(i, "\"]")).forEach(function (e) {
              return document.body.insertAdjacentElement("beforeend", e);
            });
            var a = _e3.querySelector("#bricks-frontend-inline-inline-css"),
              c = document.querySelector("#bricks-frontend-inline-inline-css");
            c && a && c.replaceWith(a);
            var l = _e3.querySelector("#bricks-dynamic-data-inline-css"),
              d = document.querySelector("#bricks-dynamic-data-inline-css");
            d && l && d.replaceWith(l);
            var u = _e3.querySelector("#bricks-template-style-inline-css"),
              p = document.querySelector("#bricks-template-style-inline-css");
            p && u && p.replaceWith(u);
            var b = _e3.querySelector(".brx-ajax-pagination[data-query-element-id=\"".concat(i, "\"]"));
            s.replaceWith(b), document.dispatchEvent(new CustomEvent("bricks/ajax/pagination/completed", {
              detail: {
                queryId: i
              }
            })), window.history.pushState({}, "", r);
          }
        }
      }, o.send();
    }));
  }
});
function bricksQueryPagination() {
  bricksQueryPaginationFn.run();
}
function bricksStickyHeader() {
  var e = document.querySelector("#brx-header.sticky");
  if (!e) return;
  var t,
    r,
    s = document.querySelector(".bricks-site-logo"),
    i = -1,
    n = e.hasAttribute("data-slide-up-after") ? e.getAttribute("data-slide-up-after") : 0;
  s && (t = s.getAttribute("data-bricks-logo"), r = s.getAttribute("data-bricks-logo-inverse"));
  var o = function o() {
    var o = window.pageYOffset;
    o > 0 ? (e.classList.add("scrolling"), s && r && (s.src = r, s.srcset = "")) : (e.classList.remove("scrolling"), s && r && (s.src = t)), n && (o > i && i >= 0 ? o > n && e.classList.add("slide-up") : e.classList.remove("slide-up")), i = o;
  };
  window.addEventListener("scroll", o), o();
}
function bricksOnePageNavigation() {
  var e = document.getElementById("bricks-one-page-navigation");
  if (!bricksIsFrontend || !e) return;
  var t = bricksQuerySelectorAll(document, "#brx-content > *"),
    r = [],
    s = "",
    i = "",
    n = "";
  function o() {
    var e = window.scrollY;
    r.forEach(function (t) {
      var r = document.getElementById(t),
        s = r.offsetTop,
        i = s + r.offsetHeight;
      e >= s - 1 && e < i - 1 ? document.querySelector(".bricks-one-page-".concat(t)).classList.add("active") : document.querySelector(".bricks-one-page-".concat(t)).classList.remove("active");
    });
  }
  t && (t.forEach(function (t) {
    s = t.getAttribute("id"), s && (r.push(s), n = document.createElement("li"), i = document.createElement("a"), i.classList.add("bricks-one-page-".concat(s)), i.setAttribute("href", "#".concat(s)), n.appendChild(i), e.appendChild(n));
  }), window.addEventListener("load", o), window.addEventListener("resize", o), document.addEventListener("scroll", o));
}
function bricksSearchOverlay() {
  var e = bricksQuerySelectorAll(document, ".brxe-search");
  e && e.forEach(function (e) {
    var t = e.querySelector(".overlay-trigger");
    if (!t) return;
    var r = e.querySelector(".bricks-search-overlay");
    if (!r) return;
    var s = r.previousElementSibling;
    document.addEventListener("keyup", function (e) {
      if ("Escape" === e.key) {
        "visible" === window.getComputedStyle(r).visibility && (r.classList.remove("show"), s.focus());
      }
    }), t.addEventListener("click", function (t) {
      r.classList.toggle("show"), setTimeout(function () {
        e.querySelector("input[type=search]").focus();
      }, 200);
    }), r.querySelector(".close").addEventListener("click", function (e) {
      r.classList.toggle("show"), s.focus();
    });
  });
}
var bricksAlertDismissFn = new BricksFunction({
  parentNode: document,
  selector: ".brxe-alert svg",
  subscribeEvents: ["bricks/ajax/pagination/completed", "bricks/ajax/load_page/completed"],
  eachElement: function eachElement(e) {
    e.addEventListener("click", function () {
      e.closest(".brxe-alert").remove();
    });
  }
});
function bricksAlertDismiss() {
  bricksAlertDismissFn.run();
}
var bricksTabsFn = new BricksFunction({
  parentNode: document,
  selector: ".brxe-tabs, .brxe-tabs-nested",
  subscribeEvents: ["bricks/ajax/pagination/completed", "bricks/ajax/load_page/completed"],
  eachElement: function eachElement(e) {
    var t = bricksQuerySelectorAll(e, ".tab-title");
    t.forEach(function (r, s) {
      0 === s && r.classList.add("brx-open");
      var i = bricksQuerySelectorAll(e, ".tab-pane");
      i.forEach(function (e, t) {
        0 === t && e.classList.add("brx-open");
      }), r.addEventListener("click", function () {
        t.forEach(function (e, t) {
          t === s ? r.classList.add("brx-open") : e.classList.remove("brx-open");
        }), i.forEach(function (e, t) {
          t === s ? e.classList.add("brx-open") : e.classList.remove("brx-open");
        });
      });
    });
  }
});
function bricksTabs() {
  bricksTabsFn.run();
}
var bricksVideoOverlayClickDetectorFn = new BricksFunction({
  parentNode: document,
  selector: ".bricks-video-overlay, .bricks-video-overlay-icon, .bricks-video-preview-image",
  subscribeEvents: ["bricks/ajax/pagination/completed", "bricks/ajax/load_page/completed"],
  frontEndOnly: !0,
  eachElement: function eachElement(e) {
    e.addEventListener("click", function (e) {
      var t = e.target.closest(".brxe-video");
      if (!t) return;
      var r = t.querySelector(".bricks-video-preview-image");
      if (r) {
        var _e4 = document.createElement("iframe");
        _toConsumableArray(r.attributes).forEach(function (t) {
          "class" !== t.name && "style" !== t.name && ("data-iframe-src" !== t.name ? _e4.setAttribute(t.name, t.value) : _e4.setAttribute("src", t.value));
        }), r.replaceWith(_e4);
      }
      var s = t.querySelector("iframe");
      s && s.getAttribute("src") && (s.src += "&autoplay=1");
      var i = t.querySelector("video");
      i && i.play();
    });
  }
});
function bricksVideoOverlayClickDetector() {
  bricksVideoOverlayClickDetectorFn.run();
}
var bricksBackgroundVideoInitFn = new BricksFunction({
  parentNode: document,
  selector: ".bricks-background-video-wrapper",
  subscribeEvents: ["bricks/ajax/pagination/completed", "bricks/ajax/load_page/completed"],
  forceReinit: function forceReinit(e, t) {
    return !bricksIsFrontend;
  },
  eachElement: function eachElement(e) {
    if (e.classList.contains("loaded") || e.querySelector("iframe")) return;
    var t = e.getAttribute("data-background-video-url"),
      r = e.getAttribute("data-background-video-scale"),
      s = !1;
    if (!t) return;
    var i,
      n = e.getAttribute("data-background-video-ratio") || "16:9",
      o = parseInt(n.split(":")[0] || 16),
      a = parseInt(n.split(":")[1] || 9);
    if (-1 !== t.indexOf("youtube.com")) {
      s = !0;
      var _e5 = t.lastIndexOf("="),
        _r2 = t.slice(_e5 + 1);
      t += "?origin=".concat(window.location.origin), t += "&rel=0", t += "&autoplay=1", t += "&mute=1", t += "&widgetid=1", t += "&controls=0", t += "&showinfo=0", t += "&modestbranding=1", t += "&cc_load_policy=0", t += "&iv_load_policy=3", t += "&autohide=0", t += "&loop=1", t += "&playlist=".concat(_r2), t += "&enablejsapi=1", t = t.replace("watch?v=", "embed/");
    }
    -1 !== t.indexOf("vimeo.com") && (s = !0, t += "?background=1", t += "&byline=0", t += "&portrait=0", t += "&title=0", -1 === t.indexOf("player.vimeo.com/video") && (t = t.replace("vimeo.com", "player.vimeo.com/video"))), s ? (i = document.createElement("iframe"), i.setAttribute("width", 640), i.setAttribute("height", 360), i.setAttribute("src", t), i.setAttribute("allow", "autoplay"), i.setAttribute("allowfullscreen", 1), e.removeChild(e.querySelector("video"))) : i = e.querySelector("video"), r && (i.style.transform = "translate(-50%, -50%) scale(".concat(r, ")")), bricksIsFrontend ? e.classList.contains("bricks-lazy-video") && new BricksIntersect({
      element: e,
      callback: function callback(e) {
        e.classList.remove("bricks-lazy-video"), s ? e.appendChild(i) : i.src = t;
      }
    }) : s ? e.appendChild(i) : i.src = t, e.classList.add("loaded"), new ResizeObserver(function (t) {
      var _iterator4 = _createForOfIteratorHelper(t),
        _step4;
      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var _r3 = _step4.value;
          var _t6 = void 0;
          if (_r3.contentBoxSize) {
            _t6 = (Array.isArray(_r3.contentBoxSize) ? _r3.contentBoxSize[0] : _r3.contentBoxSize).inlineSize;
          } else _t6 = _r3.contentRect.width;
          var _s2 = e.clientHeight,
            _n = _t6 * a / o;
          _n < _s2 && (_n = _s2, _t6 = _s2 * o / a), i.style.width = "".concat(_t6, "px"), i.style.height = "".concat(_n, "px");
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
    }).observe(e);
  }
});
function bricksBackgroundVideoInit() {
  bricksBackgroundVideoInitFn.run();
}
var bricksPhotoswipeFn = new BricksFunction({
  parentNode: document,
  selector: ".bricks-lightbox",
  windowVariableCheck: ["PhotoSwipeLightbox"],
  eachElement: function eachElement(e) {
    var t = e,
      r = "A" === e.tagName ? "" : "a",
      s = e.getAttribute("data-pswp-id");
    s && (r = bricksQuerySelectorAll(document, "[data-pswp-id=\"".concat(s, "\"]")));
    var i = {
      mainClass: "brx",
      gallery: t,
      counter: !t.classList.contains("brxe-carousel"),
      children: r,
      pswpModule: PhotoSwipe5,
      closeSVG: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>'
    };
    var n = new PhotoSwipeLightbox(i);
    if (n.on("itemData", function (t) {
      var r = document.querySelector(".pswp__container"),
        s = e.getAttribute("data-pswp-video-url"),
        i = e.getAttribute("data-pswp-width"),
        n = e.getAttribute("data-pswp-height");
      if (i && (i.includes("%") || i.includes("vw")) && (i = window.innerWidth * (parseInt(i) / 100)), n && (n.includes("%") || n.includes("vh")) && (n = window.innerHeight * (parseInt(n) / 100)), i || (i = 1280), n && 720 != n || (n = Math.round(i / 16 * 9)), !r && s) {
        var _e6 = bricksGetLightboxVideoNode(s);
        t.itemData = {
          html: _e6.outerHTML,
          width: i,
          height: n
        };
      }
    }), n.on("contentAppend", function (_ref) {
      var e = _ref.content;
      if (e.element) {
        var _t7 = e.element.querySelector("video");
        _t7 && _t7.play();
      }
    }), t.classList.contains("brxe-carousel")) {
      var _bricksData$swiperIns, _bricksData$swiperIns2;
      var _e7 = t.getAttribute("data-script-id");
      ((_bricksData$swiperIns = bricksData.swiperInstances) === null || _bricksData$swiperIns === void 0 ? void 0 : (_bricksData$swiperIns2 = _bricksData$swiperIns[_e7]) === null || _bricksData$swiperIns2 === void 0 ? void 0 : _bricksData$swiperIns2.loopedSlides) && (n.addFilter("numItems", function (e, t) {
        if (t.gallery) {
          var _r4 = 0;
          t.gallery.classList.contains("brxe-carousel") && (_r4 = t.gallery.querySelectorAll(".swiper-slide-duplicate").length), e = e > _r4 ? e - _r4 : e;
        }
        return e;
      }), n.addFilter("clickedIndex", function (t, r) {
        var s = r.target.closest(".swiper-slide");
        if (s) {
          var _r5 = bricksData.swiperInstances[_e7].slides.map(function (e, t) {
            return {
              slide: e,
              index: t
            };
          }).filter(Boolean);
          if (_r5.length) {
            var _e8 = parseInt(s.dataset.swiperSlideIndex),
              _i2 = _r5.filter(function (t) {
                return t.slide.dataset.swiperSlideIndex == _e8;
              });
            _i2.length && (t = _i2[0].index);
          }
        }
        return t;
      }));
    }
    n.init();
  }
});
function bricksPhotoswipe() {
  bricksPhotoswipeFn.run();
}
function bricksGetLightboxVideoNode(e) {
  if (e) {
    hasContent = !0;
    var t = !1;
    if (-1 !== e.indexOf("youtube.com") && (t = !0, e = e.replace("watch?v=", "embed/"), e += "?autoplay=1", e += "&rel=0"), -1 !== e.indexOf("vimeo.com") && (t = !0, -1 === e.indexOf("player.vimeo.com/video") && (e = e.replace("vimeo.com", "player.vimeo.com/video")), e += "?autoplay=1"), t) {
      var _t8 = document.createElement("iframe");
      return _t8.setAttribute("src", e), _t8.setAttribute("allow", "autoplay"), _t8.setAttribute("allowfullscreen", 1), _t8;
    }
    var r = document.createElement("video");
    return r.setAttribute("src", e), r.setAttribute("controls", 1), r.setAttribute("playsinline", 1), r;
  }
}
var bricksAccordionFn = new BricksFunction({
  parentNode: document,
  selector: ".brxe-accordion, .brxe-accordion-nested",
  eachElement: function eachElement(e) {
    var t = function t(e) {
        var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 200;
        e.style.transitionProperty = "height, margin, padding", e.style.transitionDuration = "".concat(t, "ms"), e.style.height = "".concat(e.offsetHeight, "px"), e.offsetHeight, e.style.overflow = "hidden", e.style.height = 0, e.style.paddingTop = 0, e.style.paddingBottom = 0, e.style.marginTop = 0, e.style.marginBottom = 0, window.setTimeout(function () {
          e.style.display = "none", e.style.removeProperty("height"), e.style.removeProperty("padding-top"), e.style.removeProperty("padding-bottom"), e.style.removeProperty("margin-top"), e.style.removeProperty("margin-bottom"), e.style.removeProperty("overflow"), e.style.removeProperty("transition-duration"), e.style.removeProperty("transition-property");
        }, t);
      },
      r = function r(e) {
        var r = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 200;
        return "none" === window.getComputedStyle(e).display ? function (e) {
          var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 200;
          e.style.removeProperty("display");
          var r = window.getComputedStyle(e).display;
          "none" === r && (r = "block"), e.style.display = r;
          var s = e.offsetHeight;
          e.style.overflow = "hidden", e.style.height = 0, e.style.paddingTop = 0, e.style.paddingBottom = 0, e.style.marginTop = 0, e.style.marginBottom = 0, e.offsetHeight, e.style.transitionProperty = "height, margin, padding", e.style.transitionDuration = "".concat(t, "ms"), e.style.height = "".concat(s, "px"), e.style.removeProperty("padding-top"), e.style.removeProperty("padding-bottom"), e.style.removeProperty("margin-top"), e.style.removeProperty("margin-bottom"), window.setTimeout(function () {
            e.style.removeProperty("height"), e.style.removeProperty("overflow"), e.style.removeProperty("transition-duration"), e.style.removeProperty("transition-property");
          }, t);
        }(e, r) : t(e, r);
      },
      s = Array.from(e.children),
      i = e.hasAttribute("data-transition") ? isNaN(e.dataset.transition) ? 0 : e.dataset.transition : 200;
    s = s.filter(function (e) {
      return e.classList.contains("brxe-section") || e.classList.contains("brxe-container") || e.classList.contains("brxe-block") || e.classList.contains("brxe-div") || e.classList.contains("accordion-item");
    }), s.forEach(function (s, n) {
      var _e$dataset$scriptArgs;
      0 === n && (_e$dataset$scriptArgs = e.dataset.scriptArgs) !== null && _e$dataset$scriptArgs !== void 0 && _e$dataset$scriptArgs.includes("expandFirstItem") && s.classList.add("brx-open"), s.classList.contains("listening") || (s.classList.add("listening"), s.addEventListener("click", function (s) {
        s.stopPropagation();
        var n = s.target.closest(".accordion-title-wrapper");
        if (!n) return;
        var o = n.parentNode;
        if (!o) return;
        var a = o.querySelector(".accordion-content-wrapper");
        if (a) {
          var _e$dataset$scriptArgs2;
          if (!((_e$dataset$scriptArgs2 = e.dataset.scriptArgs) !== null && _e$dataset$scriptArgs2 !== void 0 && _e$dataset$scriptArgs2.includes("independentToggle"))) {
            var _r6 = e.querySelector(".brx-open");
            if (_r6) {
              var _e9 = _r6.querySelector(".accordion-content-wrapper");
              _e9 && _e9 !== a && (_r6.classList.remove("brx-open"), t(_e9, i));
            }
          }
          r(a, i), o.classList.toggle("brx-open");
        }
      }));
    });
  }
});
function bricksAccordion() {
  bricksAccordionFn.run();
}
var bricksAnimatedTypingFn = new BricksFunction({
  parentNode: document,
  selector: ".brxe-animated-typing",
  windowVariableCheck: ["Typed"],
  eachElement: function eachElement(e) {
    var t,
      r = e.dataset.scriptId;
    try {
      t = JSON.parse(e.dataset.scriptArgs);
    } catch (e) {
      return !1;
    }
    var s = e.querySelector(".typed");
    s && (window.bricksData.animatedTypingInstances[r] && window.bricksData.animatedTypingInstances[r].destroy(), t.hasOwnProperty("strings") && t.strings && (Array.isArray(t.strings) && !t.strings.toString() || (window.bricksData.animatedTypingInstances[r] = new Typed(s, t))));
  }
});
function bricksAnimatedTyping() {
  bricksAnimatedTypingFn.run();
}
var bricksAudioFn = new BricksFunction({
  parentNode: document,
  selector: ".brxe-audio",
  windowVariableCheck: ["MediaElementPlayer"],
  eachElement: function eachElement(e) {
    var t = e.querySelector("audio");
    if (t) {
      new MediaElementPlayer(t);
    }
  }
});
function bricksAudio() {
  bricksAudioFn.run();
}
var bricksCountdownFn = new BricksFunction({
  parentNode: document,
  selector: ".brxe-countdown",
  eachElement: function eachElement(e) {
    countdown = function countdown(e, t, r) {
      var s = t.date.replace(" ", "T"),
        i = new Date(s).getTime() - new Date().getTime();
      if (i <= 0) {
        if (clearInterval(e.dataset.bricksCountdownId), "hide" === t.action) return void (e.innerHTML = "");
        if ("text" === t.action) return void (e.innerHTML = t.actionText);
      }
      r && (e.innerHTML = "", t.fields.forEach(function (t) {
        if (!t.format) return;
        var r = document.createElement("div");
        if (r.classList.add("field"), t.prefix) {
          var _e10 = document.createElement("span");
          _e10.classList.add("prefix"), _e10.innerHTML = t.prefix, r.appendChild(_e10);
        }
        var s = document.createElement("span");
        if (s.classList.add("format"), r.appendChild(s), t.suffix) {
          var _e11 = document.createElement("span");
          _e11.classList.add("suffix"), _e11.innerHTML = t.suffix, r.appendChild(_e11);
        }
        e.appendChild(r);
      }));
      var n = bricksQuerySelectorAll(e, ".field"),
        o = Math.floor(i / 864e5),
        a = Math.floor(i % 864e5 / 36e5),
        c = Math.floor(i % 36e5 / 6e4),
        l = Math.floor(i % 6e4 / 1e3);
      t.fields.forEach(function (e, t) {
        if (!e.format) return;
        var r = e.format.toLowerCase();
        r.includes("%d") ? (e.format.includes("%D") && o <= 9 && (o = "0".concat(o)), n[t].querySelector(".format").innerHTML = r.replace("%d", i <= 0 ? 0 : o)) : r.includes("%h") ? (e.format.includes("%H") && a <= 9 && (a = "0".concat(a)), n[t].querySelector(".format").innerHTML = r.replace("%h", i <= 0 ? 0 : a)) : r.includes("%m") ? (e.format.includes("%M") && c <= 9 && (c = "0".concat(c)), n[t].querySelector(".format").innerHTML = r.replace("%m", i <= 0 ? 0 : c)) : r.includes("%s") && (e.format.includes("%S") && l <= 9 && (l = "0".concat(l)), n[t].querySelector(".format").innerHTML = r.replace("%s", i <= 0 ? 0 : l));
      });
    };
    var t = e.dataset.bricksCountdownOptions;
    try {
      t = JSON.parse(t);
    } catch (e) {
      return !1;
    }
    if (t.hasOwnProperty("date") && t.hasOwnProperty("fields")) {
      var r = e.dataset.bricksCountdownId;
      r && clearInterval(r), countdown(e, t, !0), r = setInterval(countdown, 1e3, e, t, !1), e.dataset.bricksCountdownId = r;
    }
  }
});
function bricksCountdown() {
  bricksCountdownFn.run();
}
var bricksCounterFn = new BricksFunction({
  parentNode: document,
  selector: ".brxe-counter",
  subscribeEvents: ["bricks/popup/open", "bricks/ajax/pagination/completed", "bricks/ajax/load_page/completed"],
  forceReinit: function forceReinit(e, t) {
    return e.closest(".brx-popup");
  },
  eachElement: function eachElement(e) {
    var t = e.dataset.bricksCounterOptions;
    try {
      t = JSON.parse(t);
    } catch (e) {
      return !1;
    }
    var r = e.querySelector(".count"),
      s = t.hasOwnProperty("countFrom") ? parseInt(t.countFrom) : 0,
      i = t.hasOwnProperty("countTo") ? parseInt(t.countTo) : 100,
      n = t.hasOwnProperty("duration") ? parseInt(t.duration) : 1e3;
    n < 500 && (n = 500);
    var o = n / (i - s),
      a = 1;
    o < 4 && (a = Math.ceil(4 / o), o = 4);
    var c = function c() {
        var e = r.innerText.replace(/\D/g, "");
        e = isNaN(e) ? s : parseInt(e);
        var n = e + a < i ? e + a : i;
        if (e >= i) return clearInterval(r.dataset.counterId), void delete r.dataset.counterId;
        r.innerText = t.thousands ? n.toLocaleString() : n;
      },
      l = function l() {
        r.innerText = s, null == r.dataset.counterId && (r.dataset.counterId = setInterval(c, o));
      },
      d = r.closest(".brx-popup");
    d ? d.classList.contains("hide") || l() : new BricksIntersect({
      element: e,
      callback: l
    });
  },
  listenerHandler: function listenerHandler(e) {
    if (e !== null && e !== void 0 && e.type) if ("bricks/popup/open" === e.type) {
      var _e$details;
      var t = {
        parentNode: (_e$details = e.details) !== null && _e$details !== void 0 && _e$details.popupElement ? e.details.popupElement : document
      };
      bricksCounterFn.run(t);
    } else bricksCounterFn.run();
  }
});
function bricksCounter() {
  bricksCounterFn.run();
}
var bricksFormFn = new BricksFunction({
  parentNode: document,
  selector: ".brxe-form",
  eachElement: function eachElement(e) {
    var t = e.getAttribute("data-element-id");
    bricksQuerySelectorAll(e, 'input[type="checkbox"]').forEach(function (t) {
      t.required && t.addEventListener("click", function (r) {
        var s = t.getAttribute("name"),
          i = bricksQuerySelectorAll(e, "input[name=\"".concat(s, "\"]")),
          n = !1;
        i.forEach(function (e) {
          !0 === e.checked && (n = !0);
        }), n ? i.forEach(function (e) {
          e.required = !1;
        }) : i.forEach(function (e) {
          e.required = !0;
        });
      });
    }), bricksQuerySelectorAll(e, ".flatpickr").forEach(function (e) {
      var t = e.dataset.bricksDatepickerOptions;
      t && (t = JSON.parse(t), t.disableMobile = !0, flatpickr(e, t));
    });
    var r = {};
    bricksQuerySelectorAll(e, "input[type=file]").forEach(function (t) {
      var s = t.getAttribute("data-files-ref"),
        i = t.getAttribute("data-maxsize") || !1,
        n = t.getAttribute("data-limit") || !1;
      i = !!i && 1024 * parseInt(i) * 1024, t.addEventListener("change", function (o) {
        var a = o.target.files,
          c = a.length,
          l = t.getAttribute("name");
        if (!c) return;
        var d = e.querySelector(".file-result[data-files-ref=\"".concat(s, "\"]"));
        var _loop = function _loop() {
          var t = a[_e12],
            s = !1,
            o = d.cloneNode(!0);
          if (n && r.hasOwnProperty(l) && r[l].length >= n && (s = "limit"), i && t.size > i && (s = "size"), s) o.classList.add("danger"), o.innerHTML = o.getAttribute("data-error-".concat(s)).replace("%s", t.name), setTimeout(function () {
            o.remove();
          }, 5e3);else {
            r.hasOwnProperty(l) || (r[l] = []), r[l].push(t), o.classList.add("show");
            var _e13 = o.querySelector(".text"),
              _s3 = o.querySelector(".remove");
            _e13.innerHTML = t.name, _s3.setAttribute("data-name", t.name), _s3.setAttribute("data-field", l), _s3.addEventListener("click", function (e) {
              var t = e.target.getAttribute("data-name"),
                s = e.target.getAttribute("data-field"),
                i = r[s];
              for (var _e14 = 0; _e14 < i.length; _e14++) if (i[_e14].name === t) {
                r[l].splice(_e14, 1);
                break;
              }
              o.remove();
            });
          }
          d.parentNode.insertBefore(o, d.nextSibling);
        };
        for (var _e12 = 0; _e12 < c; _e12++) {
          _loop();
        }
      });
    }), e.addEventListener("submit", function (s) {
      if (s.preventDefault(), !bricksIsFrontend) return;
      var i = document.getElementById("recaptcha-".concat(t)),
        n = e.querySelector(".recaptcha-error");
      if (!i) return void bricksSubmitForm(t, e, r, null);
      var o = i.getAttribute("data-key");
      if (o) try {
        grecaptcha.ready(function () {
          try {
            grecaptcha.execute(o, {
              action: "bricks_form_submit"
            }).then(function (s) {
              n.classList.remove("show"), bricksSubmitForm(t, e, r, s);
            })["catch"](function (t) {
              n.classList.add("show"), e.querySelector(".alert").innerText = "Google reCaptcha ".concat(t);
            });
          } catch (t) {
            n.classList.add("show"), e.querySelector(".alert").innerText = "Google reCaptcha ".concat(t);
          }
        });
      } catch (t) {
        n.classList.add("show"), e.querySelector(".alert").innerText = "Google reCaptcha ".concat(t);
      } else n.classList.add("show");
    });
  }
});
function bricksForm() {
  bricksFormFn.run();
}
function bricksSubmitForm(e, t, r, s) {
  var i = t.querySelector("button[type=submit]");
  i.classList.add("sending");
  var n = new FormData(t);
  n.append("action", "bricks_form_submit"), n.append("postId", window.bricksData.postId), n.append("formId", e), n.append("recaptchaToken", s || ""), n.append("nonce", window.bricksData.nonce), n.append("referrer", location.toString());
  var _loop2 = function _loop2(_e15) {
    r[_e15].forEach(function (t) {
      n.append("".concat(_e15, "[]"), t, t.name);
    });
  };
  for (var _e15 in r) {
    _loop2(_e15);
  }
  var o = window.bricksData.ajaxUrl,
    a = new XMLHttpRequest();
  a.open("POST", o, !0), a.onreadystatechange = function () {
    var _e$data, _e$data2, _e$data3, _e$data4, _e$data5, _e$data$message, _e$data6;
    var e = function (e) {
      try {
        return JSON.parse(e);
      } catch (e) {
        return null;
      }
    }(a.response);
    if (window.bricksData.debug && console.warn("bricks_form_submit", a, e), !e) return;
    !e.success || "mailchimp" !== ((_e$data = e.data) === null || _e$data === void 0 ? void 0 : _e$data.action) && "sendgrid" !== ((_e$data2 = e.data) === null || _e$data2 === void 0 ? void 0 : _e$data2.action) || (window.dataLayer = window.dataLayer || [], window.dataLayer.push({
      event: "bricksNewsletterSignup"
    })), e.success && (_e$data3 = e.data) !== null && _e$data3 !== void 0 && _e$data3.redirectTo && setTimeout(function () {
      window.location.href = e.data.redirectTo;
    }, parseInt((_e$data4 = e.data) === null || _e$data4 === void 0 ? void 0 : _e$data4.redirectTimeout) || 0), t.querySelector(".message") && t.querySelector(".message").remove();
    var s = document.createElement("div");
    s.classList.add("message");
    var n = document.createElement("div");
    if (n.classList.add("text"), (_e$data5 = e.data) !== null && _e$data5 !== void 0 && _e$data5.message) if ((_e$data$message = e.data.message) !== null && _e$data$message !== void 0 && _e$data$message.errors) {
      var _t9 = e.data.message.errors;
      Object.keys(_t9).forEach(function (e) {
        n.innerHTML += _t9[e][0] + "<br>";
      });
    } else n.innerHTML = e.data.message;
    if (s.appendChild(n), (_e$data6 = e.data) !== null && _e$data6 !== void 0 && _e$data6.info) {
      var _t10 = document.createElement("div"),
        _r7 = document.createElement("div");
      _r7.innerHTML = e.data.info.join("<br>"), s.appendChild(_t10), _t10.appendChild(_r7);
    } else s.classList.add(e.data.type);
    if (t.appendChild(s), i.classList.remove("sending"), e.success) {
      t.reset(), r = {};
      var _e16 = bricksQuerySelectorAll(t, ".file-result");
      null !== _e16 && _e16.forEach(function (e) {
        e.remove();
      });
    }
  }, a.send(n);
}
var bricksIsotopeFn = new BricksFunction({
  parentNode: document,
  selector: ".bricks-layout-wrapper.isotope",
  forceReinit: !0,
  windowVariableCheck: ["Isotope"],
  eachElement: function eachElement(e) {
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
    var s = new Isotope(e, t),
      i = e.parentNode.querySelector(".bricks-isotope-filters");
    i && i.addEventListener("click", function (e) {
      var t = e.target.getAttribute("data-filter"),
        r = i.querySelector("li.active");
      t && bricksIsFrontend && (r && r.classList.remove("active"), e.target.classList.add("active"), s.arrange({
        filter: t
      }));
    });
  }
});
function bricksIsotope() {
  bricksIsotopeFn.run();
}
var bricksMapFn = new BricksFunction({
  parentNode: document,
  selector: ".brxe-map",
  eachElement: function eachElement(e, t) {
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
        s = [],
        i = {};
      (t === null || t === void 0 ? void 0 : t.marker) && (i.icon = {
        url: t.marker
      }, (t === null || t === void 0 ? void 0 : t.markerHeight) && (t === null || t === void 0 ? void 0 : t.markerWidth) && (i.icon.scaledSize = new google.maps.Size(parseInt(t.markerWidth), parseInt(t.markerHeight))));
      var n = {};
      (t === null || t === void 0 ? void 0 : t.markerActive) && (n = {
        url: t.markerActive
      }, (t === null || t === void 0 ? void 0 : t.markerActiveHeight) && (t === null || t === void 0 ? void 0 : t.markerActiveWidth) && (n.scaledSize = new google.maps.Size(parseInt(t.markerActiveWidth), parseInt(t.markerActiveHeight))));
      var o = [],
        a = new google.maps.LatLngBounds(),
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
      for (var _e17 = 0; _e17 < r.length; _e17++) {
        var _t11 = r[_e17];
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
          var s = t[0].geometry.location;
          b(e, s);
        };
      }
      function b(e, t) {
        i.map = u, i.position = t;
        var c = new google.maps.Marker(i);
        if (c.setMap(u), s.push(c), google.maps.event.addListener(c, "click", function () {
          !function (e) {
            var _n2, _m;
            (i === null || i === void 0 ? void 0 : i.icon) && s.forEach(function (e) {
              e.setIcon(i.icon);
            });
            o.forEach(function (e) {
              e.hide();
            }), ((_n2 = n) === null || _n2 === void 0 ? void 0 : _n2.url) && c.setIcon(n);
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
            m.length && (l += '<ul class="images bricks-lightbox">', m.forEach(function (t) {
              l += "<li>", t.thumbnail && t.src && (l += "<a\n\t\t\t\t\t\t\t\t\tdata-pswp-src=\"".concat(t.src, "\"\n\t\t\t\t\t\t\t\t\tdata-pswp-width=\"").concat((t === null || t === void 0 ? void 0 : t.width) || 376, "\"\n\t\t\t\t\t\t\t\t\tdata-pswp-height=\"").concat((t === null || t === void 0 ? void 0 : t.height) || 376, "\"\n\t\t\t\t\t\t\t\t\tdata-pswp-id=\"").concat(e.id, "\">"), l += "<img src=\"".concat(t.thumbnail, "\"/>"), l += "</a>"), l += "</li>";
            }), l += "</ul>");
            if (l) {
              var _s4 = parseInt(e === null || e === void 0 ? void 0 : e.infoWidth) || 300,
                _n3 = {
                  content: l,
                  disableAutoPan: !0,
                  pixelOffset: new google.maps.Size(0, 0),
                  alignBottom: !1,
                  infoBoxClearance: new google.maps.Size(20, 20),
                  enableEventPropagation: !1,
                  zIndex: 1001,
                  boxStyle: {
                    opacity: 1,
                    zIndex: 999,
                    top: 0,
                    left: 0,
                    width: "".concat(_s4, "px")
                  }
                };
              void 0 !== window.jQuery && (_n3.closeBoxURL = "", _n3.content += '<span class="close">×</span>');
              var _d = new InfoBox(_n3);
              _d.open(u, c), o.push(_d), setTimeout(function () {
                var e = _d.div_.offsetHeight,
                  t = u.getProjection().fromLatLngToPoint(c.getPosition()),
                  r = u.getProjection().fromPointToLatLng(new google.maps.Point(t.x, t.y - e * function () {
                    var e = u.getCenter(),
                      t = u.getZoom(),
                      r = 1,
                      s = u.getProjection().fromLatLngToPoint(new google.maps.LatLng(e.lat() - r / Math.pow(2, t), e.lng() - r / Math.pow(2, t))),
                      i = u.getProjection().fromLatLngToPoint(new google.maps.LatLng(e.lat() + r / Math.pow(2, t), e.lng() + r / Math.pow(2, t)));
                    return Math.abs(i.x - s.x);
                  }() / 2));
                u.panTo(r);
              }, 100), google.maps.event.addListener(_d, "domready", function (e) {
                m.length && bricksPhotoswipe(), void 0 !== window.jQuery && jQuery(".close").on("click", function () {
                  _d.close(), i !== null && i !== void 0 && i.icon && c.setIcon(i.icon), r.length > 1 && (a.extend(t), u.fitBounds(a), u.panToBounds(a));
                });
              });
            }
          }(e);
        }), a.extend(t), u.fitBounds(a), u.panToBounds(a), 1 === r.length) {
          var _e18 = google.maps.event.addListener(u, "idle", function () {
            u.setZoom(l), google.maps.event.removeListener(_e18);
          });
        }
      }
      if (t !== null && t !== void 0 && t.type && u.setMapTypeId(t.type), t !== null && t !== void 0 && t.style) if ("custom" === t.style && t !== null && t !== void 0 && t.customStyle) {
        var _e19 = JSON.stringify(t.customStyle);
        u.setOptions({
          styles: JSON.parse(_e19)
        });
      } else window.bricksData && window.bricksData.mapStyles[t.style] && u.setOptions({
        styles: JSON.parse(window.bricksData.mapStyles[t.style].style)
      });
    }, 1e3 * t);
  }
});
function bricksMap() {
  bricksMapFn.run();
}
var bricksPieChartFn = new BricksFunction({
  parentNode: document,
  selector: ".brxe-pie-chart",
  windowVariableCheck: ["EasyPieChart"],
  eachElement: function eachElement(e) {
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
  }
});
function bricksPieChart() {
  bricksPieChartFn.run();
}
var bricksPricingTablesFn = new BricksFunction({
  parentNode: document,
  selector: ".brxe-pricing-tables",
  eachElement: function eachElement(e) {
    var t = bricksQuerySelectorAll(e, ".tab"),
      r = bricksQuerySelectorAll(e, ".pricing-table");
    t.forEach(function (e) {
      e.classList.contains("listening") || (e.classList.add("listening"), e.addEventListener("click", function () {
        e.classList.contains("active") || (r.forEach(function (e) {
          e.classList.toggle("active");
        }), t.forEach(function (e) {
          e.classList.remove("active");
        }), e.classList.add("active"));
      }));
    });
  }
});
function bricksPricingTables() {
  bricksPricingTablesFn.run();
}
var bricksProgressBarFn = new BricksFunction({
  parentNode: document,
  selector: ".brxe-progress-bar .bar span",
  eachElement: function eachElement(e) {
    new BricksIntersect({
      element: e,
      callback: function callback() {
        e.dataset.width && setTimeout(function () {
          e.style.width = e.dataset.width;
        }, "slow");
      },
      threshold: 1
    });
  }
});
function bricksProgressBar() {
  bricksProgressBarFn.run();
}
var bricksSplideFn = new BricksFunction({
  parentNode: document,
  selector: ".brxe-slider-nested.splide",
  windowVariableCheck: ["Splide"],
  eachElement: function eachElement(e) {
    var t = bricksQuerySelectorAll(e, [".splide__list > .brxe-container", ".splide__list > .brxe-block", ".splide__list > .brxe-div"]);
    t.forEach(function (e) {
      e.classList.add("splide__slide"), e.dataset.id = e.id;
    });
    var r = e.dataset.scriptId;
    window.bricksData.splideInstances.hasOwnProperty(r) && window.bricksData.splideInstances[r].destroy();
    var s = new Splide(e);
    s.mount(), window.bricksData.splideInstances[r] = s, t.forEach(function (t, r) {
      if (t.dataset.id) {
        t.id = t.dataset.id;
        var _s5 = e.querySelector(".splide__pagination");
        if (_s5) {
          var _e20 = _s5.querySelector("li:nth-child(".concat(r + 1, ") .splide__pagination__page"));
          _e20 && _e20.setAttribute("aria-controls", t.id);
        }
      }
      if (!t.classList.contains("bricks-lazy-hidden")) {
        var _e21 = t.getAttribute("style") || "";
        t.dataset.style && (_e21 += t.dataset.style, t.setAttribute("style", _e21));
      }
    });
  }
});
function bricksSplide() {
  bricksSplideFn.run();
}
var bricksSwiperFn = new BricksFunction({
  parentNode: document,
  selector: ".bricks-swiper-container",
  windowVariableCheck: ["Swiper"],
  eachElement: function eachElement(e) {
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
    var s = r.dataset.scriptId,
      i = window.bricksData.swiperInstances.hasOwnProperty(s) ? window.bricksData.swiperInstances[s] : void 0;
    i && i.destroy(), t.observer = !1, t.observeParents = !0, t.resizeObserver = !0, t.slidesToShow = t.hasOwnProperty("slidesToShow") ? t.slidesToShow : 1, t.slidesPerGroup = t.hasOwnProperty("slidesPerGroup") ? t.slidesPerGroup : 1, t.speed = t.hasOwnProperty("speed") ? parseInt(t.speed) : 300, t.effect = t.hasOwnProperty("effect") ? t.effect : "slide", t.spaceBetween = t.hasOwnProperty("spaceBetween") ? t.spaceBetween : 0, t.initialSlide = t.hasOwnProperty("initialSlide") ? t.initialSlide : 0, t.keyboard = {
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
    }, 1 == t.dynamicBullets && (delete t.dynamicBullets, t.pagination.dynamicBullets = !0)), i = new Swiper(e, t), window.bricksData.swiperInstances[s] = i;
  }
});
function bricksSwiper() {
  bricksSwiperFn.run();
}
var bricksVideoFn = new BricksFunction({
  parentNode: document,
  selector: ".brxe-video",
  eachElement: function eachElement(e) {
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
          s = ((_window$bricksData = window.bricksData) === null || _window$bricksData === void 0 ? void 0 : (_window$bricksData$vi = _window$bricksData.videoInstances) === null || _window$bricksData$vi === void 0 ? void 0 : _window$bricksData$vi[_t12]) || void 0;
        s && s.destroy(), r && (s = new Plyr(r)), window.bricksData.videoInstances[_t12] = s;
      }
      t.setAttribute("playsinline", !0);
    }
  }
});
function bricksVideo() {
  bricksVideoFn.run();
}
function bricksFacebookSDK() {
  if (!document.querySelector(".brxe-facebook-page")) return;
  var e = window.bricksData.hasOwnProperty("locale") ? window.bricksData.locale : "en_US",
    t = window.bricksData.hasOwnProperty("facebookAppId") ? window.bricksData.facebookAppId : null,
    r = "https://connect.facebook.net/".concat(e, "/sdk.js"),
    s = new XMLHttpRequest();
  s.open("GET", r), s.onreadystatechange = function () {
    if (4 == this.readyState && 200 == this.status) {
      var _e22 = document.createElement("script");
      _e22.type = "text/javascript", _e22.id = "bricks-facebook-page-sdk", _e22.appendChild(document.createTextNode(s.responseText)), document.body.appendChild(_e22), FB.init({
        appId: t,
        version: "v3.3",
        xfbml: !0
      });
    }
  }, s.send();
}
var bricksPrettifyFn = new BricksFunction({
  parentNode: document,
  selector: ".prettyprint.prettyprinted",
  run: function run() {
    if (!window.hasOwnProperty("PR")) return;
    PR.prettyPrint();
    var e = bricksQuerySelectorAll(document, ".prettyprint.prettyprinted");
    !bricksIsFrontend && e.length && e.forEach(function (e) {
      e.classList.remove("prettyprinted"), PR.prettyPrint();
    });
  }
});
function bricksPrettify() {
  bricksPrettifyFn.run();
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
var bricksInteractionsFn = new BricksFunction({
  parentNode: document,
  selector: "[data-interactions]",
  frontEndOnly: !0,
  eachElement: function eachElement(e) {
    var _e$dataset3;
    var t = [];
    try {
      t = JSON.parse(e.dataset.interactions);
    } catch (e) {
      return console.info("error:bricksInteractions", e), !1;
    }
    var r = ((_e$dataset3 = e.dataset) === null || _e$dataset3 === void 0 ? void 0 : _e$dataset3.interactionId) || !1;
    t && r && t.forEach(function (t) {
      var s = !1;
      if (t !== null && t !== void 0 && t.trigger) {
        var _window$bricksData2;
        if ("scroll" === t.trigger) {
          var _e23 = 0;
          if (t !== null && t !== void 0 && t.scrollOffset) if (_e23 = t === null || t === void 0 ? void 0 : t.scrollOffset.replace("px", ""), _e23.includes("%")) {
            _e23 = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight) / 100 * parseInt(_e23);
          } else _e23.includes("vh") && (_e23 = window.innerHeight / 100 * parseInt(_e23));
          t.scrollOffset = _e23;
        } else "mouseleaveWindow" === t.trigger && (t.trigger = "mouseleave", s = !0);
        if ("loadMore" === t.action) {
          var _window$bricksData$qu2;
          var _r8 = t === null || t === void 0 ? void 0 : t.loadMoreQuery;
          ((_window$bricksData$qu2 = window.bricksData.queryLoopInstances) === null || _window$bricksData$qu2 === void 0 ? void 0 : _window$bricksData$qu2[_r8]) || e.remove();
        }
        if (e) switch (t.el = e, t.groupId = s ? "document" : r, (_window$bricksData2 = window.bricksData) !== null && _window$bricksData2 !== void 0 && _window$bricksData2.interactions || (window.bricksData.interactions = []), window.bricksData.interactions.push(t), t.trigger) {
          case "click":
          case "mouseover":
          case "mouseenter":
          case "mouseleave":
          case "focus":
          case "blur":
          case "showPopup":
            (s ? document.documentElement : e).addEventListener(t.trigger, bricksInteractionCallback, {
              once: t === null || t === void 0 ? void 0 : t.runOnce
            });
            break;
          case "contentLoaded":
            var _r9 = (t === null || t === void 0 ? void 0 : t.delay) || 0;
            _r9 && _r9.includes("ms") ? _r9 = parseInt(_r9) : _r9 && _r9.includes("s") && (_r9 = 1e3 * parseFloat(_r9)), setTimeout(function () {
              bricksInteractionCallbackExecution(e, t);
            }, _r9);
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
  }
});
function bricksInteractions() {
  bricksInteractionsFn.run();
}
function bricksPopups() {
  window.bricksPopupsData = {
    initialized: []
  }, document.addEventListener("bricks/popup/open", function (e) {
    var _e$detail;
    var t = ((_e$detail = e.detail) === null || _e$detail === void 0 ? void 0 : _e$detail.popupElement) || !1;
    if (t && (setTimeout(function () {
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
    }, 100), bricksIsFrontend && !window.bricksPopupsData.initialized.includes(t))) {
      var _t$dataset;
      var _e24 = ((_t$dataset = t.dataset) === null || _t$dataset === void 0 ? void 0 : _t$dataset.popupCloseOn) || "backdrop-esc";
      _e24.includes("esc") && document.addEventListener("keyup", function (e) {
        "Escape" === e.key && bricksClosePopup(t);
      }), _e24.includes("backdrop") && document.addEventListener("click", function (e) {
        e.target.classList.contains("brx-popup-backdrop") && bricksClosePopup(t);
      }), window.bricksPopupsData.initialized.push(t);
    }
  });
}
function bricksScrollInteractions() {
  clearTimeout(bricksScrollTimeout), bricksScrollTimeout = setTimeout(function () {
    var _window$bricksData3;
    var e = Array.isArray((_window$bricksData3 = window.bricksData) === null || _window$bricksData3 === void 0 ? void 0 : _window$bricksData3.interactions) ? window.bricksData.interactions : [],
      t = window.scrollY,
      r = [];
    e.forEach(function (e, s) {
      "scroll" === (e === null || e === void 0 ? void 0 : e.trigger) && t >= e.scrollOffset && (bricksInteractionCallbackExecution(e.el, e), (e === null || e === void 0 ? void 0 : e.runOnce) && r.push(s));
    }), r.forEach(function (e) {
      window.bricksData.interactions.splice(e, 1);
    });
  }, 100);
}
function bricksInteractionCallback(e) {
  var _e$currentTarget, _e$currentTarget$data;
  if ("click" === (e === null || e === void 0 ? void 0 : e.type)) {
    var _e$target$getAttribut;
    if ("A" === e.target.tagName && "#" !== e.target.getAttribute("href") && (_e$target$getAttribut = e.target.getAttribute("href")) !== null && _e$target$getAttribut !== void 0 && _e$target$getAttribut.startsWith("#")) return;
    e.preventDefault();
  }
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
  var s;
  if (bricksInteractionCheckConditions(t)) {
    switch (r) {
      case "custom":
        (t === null || t === void 0 ? void 0 : t.targetSelector) && (s = bricksQuerySelectorAll(document, t.targetSelector));
        break;
      case "popup":
        if (t !== null && t !== void 0 && t.templateId) {
          var _e$dataset4;
          var _r10 = ((_e$dataset4 = e.dataset) === null || _e$dataset4 === void 0 ? void 0 : _e$dataset4.interactionLoop) || !1;
          if (_r10) {
            var _e$dataset5;
            var i = ((_e$dataset5 = e.dataset) === null || _e$dataset5 === void 0 ? void 0 : _e$dataset5.interactionLoopIndex) || 0;
            s = bricksQuerySelectorAll(document, ".brx-popup[data-popup-id=\"".concat(t.templateId, "\"][data-popup-loop=\"").concat(_r10, "\"][data-popup-loop-index=\"").concat(i, "\"]"));
          }
          s && s.length || (s = bricksQuerySelectorAll(document, ".brx-popup[data-popup-id=\"".concat(t.templateId, "\"]")));
        }
        break;
      default:
        s = e;
    }
    if (s) switch (s = Array.isArray(s) ? s : [s], t === null || t === void 0 ? void 0 : t.action) {
      case "show":
      case "hide":
        s.forEach(function (e) {
          e !== null && e !== void 0 && e.classList.contains("brx-popup") ? "show" === t.action ? bricksOpenPopup(e) : "hide" === t.action && bricksClosePopup(e) : e.style.display = "hide" === t.action ? "none" : "block";
        });
        break;
      case "setAttribute":
      case "removeAttribute":
      case "toggleAttribute":
        var _r11 = t === null || t === void 0 ? void 0 : t.actionAttributeKey;
        _r11 && s.forEach(function (e) {
          var s = (t === null || t === void 0 ? void 0 : t.actionAttributeValue) || "";
          if ("class" === _r11) {
            (s ? s.split(" ") : []).forEach(function (r) {
              "setAttribute" === t.action ? e.classList.add(r) : "removeAttribute" === t.action ? e.classList.remove(r) : e.classList.toggle(r);
            });
          } else "setAttribute" === t.action ? e.setAttribute(_r11, s) : "removeAttribute" === t.action || e.hasAttribute(_r11) ? e.removeAttribute(_r11) : e.setAttribute(_r11, s);
        });
        break;
      case "storageAdd":
      case "storageRemove":
      case "storageCount":
        var _i3 = t === null || t === void 0 ? void 0 : t.storageType,
          n = t === null || t === void 0 ? void 0 : t.actionAttributeKey,
          o = t.hasOwnProperty("actionAttributeValue") ? t.actionAttributeValue : 0;
        if (_i3 && n) if ("storageAdd" === t.action) bricksStorageSetItem(_i3, n, o);else if ("storageRemove" === t.action) bricksStorageRemoveItem(_i3, n);else if ("storageCount" === t.action) {
          var _e25 = bricksStorageGetItem(_i3, n);
          _e25 = _e25 ? parseInt(_e25) : 0, bricksStorageSetItem(_i3, n, _e25 + 1);
        }
        break;
      case "startAnimation":
        var a = t === null || t === void 0 ? void 0 : t.animationType;
        a && s.forEach(function (e) {
          var _e26;
          var r = 1e3,
            s = (_e26 = e) === null || _e26 === void 0 ? void 0 : _e26.classList.contains("brx-popup");
          if (s && (e = e.querySelector(".brx-popup-content")), t !== null && t !== void 0 && t.animationDuration && (e.style.animationDuration = t.animationDuration, t.animationDuration.includes("ms") ? r = parseInt(t.animationDuration) : t.animationDuration.includes("s") && (r = 1e3 * parseFloat(t.animationDuration))), t !== null && t !== void 0 && t.animationDelay && (e.style.animationDelay = t.animationDelay, t.animationDelay.includes("ms") ? r += parseInt(t.animationDelay) : t.animationDelay.includes("s") && (r += 1e3 * parseFloat(t.animationDelay))), s) {
            var _t14 = e.parentNode;
            a.includes("Out") || bricksOpenPopup(_t14, r);
          }
          e.classList.add("brx-animated"), e.setAttribute("data-animation", a), bricksAnimationFn.run({
            elementsToAnimate: [e],
            removeAfterMs: r
          });
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
  var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  if (!bricksIsFrontend) return;
  var r;
  if (e && (e.nodeType === Node.ELEMENT_NODE ? r = e : e && (r = document.querySelector(".brx-popup[data-popup-id=\"".concat(e, "\"]")))), !r) return;
  var s = r.dataset.popupId;
  if (bricksPopupCheckLimit(r)) {
    r.classList.remove("hide"), r.dataset.popupBodyScroll || document.body.classList.add("no-scroll");
    var _e27 = new CustomEvent("bricks/popup/open", {
      detail: {
        popupId: s,
        popupElement: r
      }
    });
    document.dispatchEvent(_e27), setTimeout(function () {
      bricksCounter();
    }, t), bricksPopupCounter(r);
  }
}
function bricksClosePopup(e) {
  if (!bricksIsFrontend) return;
  var t;
  if (e && (e.nodeType === Node.ELEMENT_NODE ? t = e : e && (t = document.querySelector(".brx-popup[data-popup-id=\"".concat(e, "\"]")))), !t) return;
  var r = t.dataset.popupId;
  t.classList.add("hide"), t.dataset.popupBodyScroll || document.body.classList.remove("no-scroll");
  var s = new CustomEvent("bricks/popup/close", {
    detail: {
      popupId: r,
      popupElement: t
    }
  });
  document.dispatchEvent(s);
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
  var s = !1;
  return Object.entries(t).forEach(function (_ref2) {
    var _ref3 = _slicedToArray(_ref2, 2),
      e = _ref3[0],
      t = _ref3[1];
    var i = bricksStorageGetItem(e, "brx_popup_".concat(r, "_total"));
    i = i ? parseInt(i) : 0, s = s || i >= t;
  }), !s;
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
    Object.entries(t).forEach(function (_ref4) {
      var _ref5 = _slicedToArray(_ref4, 2),
        e = _ref5[0],
        t = _ref5[1];
      var s = bricksStorageGetItem(e, "brx_popup_".concat(r, "_total"));
      s = s ? parseInt(s) : 0, bricksStorageSetItem(e, "brx_popup_".concat(r, "_total"), s + 1);
    });
  }
}
function bricksInteractionCheckConditions(e) {
  if (!Array.isArray(e === null || e === void 0 ? void 0 : e.interactionConditions)) return !0;
  var t = (e === null || e === void 0 ? void 0 : e.interactionConditionsRelation) || "and",
    r = "and" === t;
  var s = function s(e) {
    return isNaN(e) ? 0 : parseFloat(e);
  };
  return e.interactionConditions.forEach(function (e) {
    var i = e === null || e === void 0 ? void 0 : e.conditionType,
      n = (e === null || e === void 0 ? void 0 : e.storageKey) || !1,
      o = !1;
    if (i && n) {
      var _t15 = (e === null || e === void 0 ? void 0 : e.storageCompare) || "exists",
        _r12 = e === null || e === void 0 ? void 0 : e.storageCompareValue,
        a = bricksStorageGetItem(i, n);
      switch (_t15) {
        case "exists":
          o = null !== a;
          break;
        case "notExists":
          o = null === a;
          break;
        case "==":
          o = a == _r12;
          break;
        case "!=":
          o = a != _r12;
          break;
        case ">=":
          o = s(a) >= s(_r12);
          break;
        case "<=":
          o = s(a) <= s(_r12);
          break;
        case ">":
          o = s(a) > s(_r12);
          break;
        case "<":
          o = s(a) < s(_r12);
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
function bricksNavNested() {
  if (!bricksIsFrontend) return;
  var e = new MutationObserver(function (e) {
      e.forEach(function (e) {
        if ("attributes" === e.type && "class" === e.attributeName) {
          var _t16 = e.target;
          if (_t16.classList.contains("brx-open")) {
            document.body.classList.add("no-scroll");
            var _e28 = _t16.querySelector(".brx-nav-nested-items button.brxe-toggle");
            if (_e28) setTimeout(function () {
              _e28.classList.add("is-active"), _e28.setAttribute("aria-expanded", !0), _e28.focus();
            }, 10);else {
              var _e29 = bricksGetFocusables(_t16);
              _e29.length && _e29[0].focus();
            }
          } else {
            document.body.classList.remove("no-scroll");
            var _e30 = _t16.dataset.toggleScriptId,
              r = document.querySelector("button[data-script-id=\"".concat(_e30, "\"]"));
            r && (r.setAttribute("aria-expanded", !1), r.classList.remove("is-active"), r.focus());
          }
        }
      });
    }),
    t = bricksQuerySelectorAll(document, ".brxe-nav-nested");
  t.length && (t.forEach(function (t) {
    e.observe(t, {
      attributes: !0,
      attributeFilter: ["class"]
    });
  }), document.addEventListener("keyup", function (e) {
    "Escape" === e.key && bricksNavNestedClose();
  }), document.addEventListener("click", function (e) {
    var t = e.target.closest(".brxe-nav-nested"),
      r = e.target.closest(".brxe-toggle");
    t || r || bricksNavNestedClose();
  }));
}
function bricksNavNestedClose() {
  bricksQuerySelectorAll(document, ".brxe-nav-nested.brx-open").forEach(function (e) {
    e.classList.add("brx-closing"), setTimeout(function () {
      e.classList.remove("brx-closing"), e.classList.remove("brx-open");
    }, 200);
  });
}
function bricksOffcanvas() {
  if (!bricksIsFrontend) return;
  var e = bricksQuerySelectorAll(document, ".brxe-offcanvas");
  if (!e.length) return;
  var t = new MutationObserver(function (e) {
    e.forEach(function (e) {
      if ("attributes" === e.type && "class" === e.attributeName) {
        var _t17 = e.target,
          r = _t17.querySelector(".brx-offcanvas-inner"),
          s = r ? s = 1e3 * parseFloat(window.getComputedStyle(r).getPropertyValue("transition-duration")) : 200;
        if (_t17.classList.contains("brx-open")) {
          if ("offset" === _t17.dataset.effect && r) {
            var _e31 = _t17.getAttribute("data-direction"),
              _s6 = window.getComputedStyle(r).getPropertyValue("transition");
            document.body.style.margin = "0", document.body.style.transition = _s6.replace("transform", "margin"), "top" === _e31 ? document.body.style.marginTop = "".concat(r.offsetHeight, "px") : "bottom" === _e31 ? document.body.style.marginTop = "-".concat(r.offsetHeight, "px") : "left" === _e31 ? (document.body.style.marginLeft = "".concat(r.offsetWidth, "px"), document.body.style.overflowX = "hidden") : "right" === _e31 && (document.body.style.marginLeft = "-".concat(r.offsetWidth, "px"), document.body.style.overflowX = "hidden");
          }
          _t17.dataset.noScroll && document.body.classList.add("no-scroll");
          var _e32 = bricksGetFocusables(_t17);
          _e32.length && _e32[0].focus();
          var _s7 = _t17.querySelector(".brx-offcanvas-inner > button.brxe-toggle");
          _s7 && (_s7.classList.add("is-active"), _s7.setAttribute("aria-expanded", !0));
        } else {
          _t17.style.visibility = "visible";
          var _e33 = _t17.dataset.toggleScriptId,
            _r13 = document.querySelector("button[data-script-id=\"".concat(_e33, "\"]"));
          _r13 && (_r13.setAttribute("aria-expanded", !1), _r13.classList.remove("is-active"), _r13.focus()), "offset" === _t17.dataset.effect && (document.body.style.marginTop && (document.body.style.margin = "0"), setTimeout(function () {
            document.body.style.margin = null, document.body.style.overflow = null, document.body.style.transition = null;
          }, s)), setTimeout(function () {
            _t17.style.visibility = null, _t17.dataset.noScroll && (document.body.classList.remove("no-scroll"), bricksSubmenuPosition());
          }, s);
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
function bricksToggleDisplay() {
  var e = bricksQuerySelectorAll(document, ".brxe-toggle");
  e.length && e.forEach(function (e) {
    if (e.closest(".brx-nav-nested-items") && !e.parentNode.classList.contains("brx-nav-nested-items") && !e.parentNode.classList.contains("brx-toggle-div")) {
      "none" === window.getComputedStyle(e).display ? e.parentNode.style.display = "none" : e.parentNode.style.display = null;
    }
  });
}
function bricksToggle() {
  if (!bricksIsFrontend) return;
  var e = bricksQuerySelectorAll(document, ".brxe-toggle");
  e.length && (bricksToggleDisplay(), e.forEach(function (e) {
    e.addEventListener("click", function (t) {
      var _e$dataset10, _e$dataset11, _e$dataset12;
      t.preventDefault();
      var r = ((_e$dataset10 = e.dataset) === null || _e$dataset10 === void 0 ? void 0 : _e$dataset10.selector) || ".brxe-offcanvas",
        s = ((_e$dataset11 = e.dataset) === null || _e$dataset11 === void 0 ? void 0 : _e$dataset11.attribute) || "class",
        i = ((_e$dataset12 = e.dataset) === null || _e$dataset12 === void 0 ? void 0 : _e$dataset12.value) || "brx-open",
        n = !!r && document.querySelector(r);
      if (n || (n = e.closest(".brxe-nav-nested")), n || (n = e.closest(".brxe-offcanvas")), !n) return;
      document.querySelector(".brx-has-megamenu") && (t.target.closest('[data-effect="offset"]') || bricksSubmenuPosition(0)), e.dataset.scriptId && !n.dataset.toggleScriptId && (n.dataset.toggleScriptId = e.dataset.scriptId);
      var o = "true" === e.getAttribute("aria-expanded");
      e.setAttribute("aria-expanded", !o), e.classList.toggle("is-active"), "class" === s ? e.closest(".brxe-nav-nested") && "brx-open" === i && n.classList.contains("brx-open") ? (n.classList.add("brx-closing"), setTimeout(function () {
        n.classList.remove("brx-closing"), n.classList.remove("brx-open");
      }, 200)) : n.classList.toggle(i) : n.getAttribute(s) ? n.removeAttribute(s) : n.setAttribute(s, i);
      var a = bricksGetFocusables(n);
      a.length && a[0].focus();
    });
  }));
}
function bricksSubmenuToggle(e) {
  var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "toggle";
  var r = !!e.parentNode.classList.contains("brx-submenu-toggle") && e.parentNode.parentNode;
  if (r) {
    if (e.closest(".brx-has-multilevel")) {
      var _e34 = r.parentNode.closest(".active");
      _e34 && !_e34.classList.contains("brx-has-megamenu") && _e34.classList.remove("active"), setTimeout(function () {
        var e = r.querySelector("ul") || r.querySelector(".brx-dropdown-content");
        if (e) {
          var _t18 = bricksGetFocusables(e);
          _t18.length && _t18[0].focus();
        }
      }, 100);
    }
    "add" === t ? (r.classList.add("open"), r.classList.add("active")) : "remove" === t ? (r.classList.remove("open"), r.classList.remove("active")) : r.classList.toggle("open"), e.setAttribute("aria-expanded", r.classList.contains("open"));
  }
}
function bricksSubmenuListeners() {
  var e = bricksQuerySelectorAll(document, ".bricks-nav-menu .menu-item-has-children"),
    t = bricksQuerySelectorAll(document, ".brxe-dropdown");
  e = e.concat(t), e.forEach(function (e) {
    e.closest("[data-static]") || e.closest(".brx-has-multilevel") || e.classList.contains("active") || (e.addEventListener("mouseenter", function (t) {
      if (e.closest(".show-mobile-menu") || e.closest(".brxe-nav-nested.brx-open")) return;
      if ("click" === e.getAttribute("data-toggle")) return;
      var r = t.target.querySelector('[aria-expanded="false"]');
      r && bricksSubmenuToggle(r);
    }), e.addEventListener("mouseleave", function (t) {
      if (e.closest(".show-mobile-menu") || e.closest(".brxe-nav-nested.brx-open")) return;
      if ("click" === e.getAttribute("data-toggle")) return;
      var r = t.target.querySelector('[aria-expanded="true"]');
      if (r) {
        var _e35 = r.closest(".menu-item");
        if (_e35 || (_e35 = r.closest(".brxe-dropdown")), _e35 && _e35.classList.contains("active")) return;
        bricksSubmenuToggle(r);
      }
    }));
  }), document.addEventListener("keyup", function (e) {
    if ("Escape" === e.key) {
      var _t19 = e.target.closest(".open"),
        r = e.target.closest(".brx-has-multilevel");
      if (_t19 && !r) {
        var _e36 = _t19.querySelector(".brx-submenu-toggle button[aria-expanded]");
        _e36 && (bricksSubmenuToggle(_e36, "remove"), _e36 && _e36.focus());
      } else {
        bricksQuerySelectorAll(document, '.brx-submenu-toggle > button[aria-expanded="true"]').forEach(function (e) {
          e && bricksSubmenuToggle(e, "remove");
        });
      }
    } else "Tab" !== e.key || e.shiftKey || setTimeout(function () {
      bricksQuerySelectorAll(document, '[aria-expanded="true"]').forEach(function (e) {
        var t = e.closest(".menu-item");
        t || (t = e.closest(".brxe-dropdown")), (t && !t.contains(document.activeElement) || "BODY" === document.activeElement.tagName) && bricksSubmenuToggle(e);
      });
    }, 0);
  }), document.addEventListener("click", function (e) {
    var t = "A" === e.target.nodeName && e.target.hasAttribute("href") ? e.target.getAttribute("href") : "";
    if (t) {
      if (!t.startsWith("#")) return;
      if ("#" === t) e.preventDefault();else {
        e.target.closest(".brxe-offcanvas") && bricksOffcanvasClose();
      }
    }
    var r = e.target.closest(".brx-submenu-toggle");
    if (r) {
      var _t20 = "hover",
        s = r.closest("[data-toggle]");
      s && (_t20 = s.getAttribute("data-toggle")), r.closest(".brxe-nav-menu.show-mobile-menu") && (_t20 = "click"), r.closest(".brxe-nav-nested.brx-open") && (_t20 = "click");
      var i = "hover" === _t20 ? e.target.closest("[aria-expanded]") : r.querySelector("button[aria-expanded]");
      if (0 === e.detail && 0 === e.screenX && 0 === e.screenY || "click" === _t20 || "both" === _t20 || (i = null), i) {
        bricksSubmenuToggle(i);
        var _e37 = r.parentNode;
        _e37.classList.toggle("active"), setTimeout(function () {
          _e37.classList.contains("active") && _e37.classList.add("open"), i.setAttribute("aria-expanded", _e37.classList.contains("open"));
        }, 0);
      }
    }
    bricksQuerySelectorAll(document, '.brx-submenu-toggle > button[aria-expanded="true"]').forEach(function (t) {
      var r = t.closest("li");
      r || (r = t.closest(".brxe-dropdown")), r && !r.contains(e.target) && (bricksSubmenuToggle(t), r.classList.remove("active"));
    });
  });
}
function bricksSubmenuPosition() {
  var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  setTimeout(function () {
    var e = document.body.clientWidth;
    bricksQuerySelectorAll(document, ".brx-submenu-toggle").forEach(function (t) {
      var r = t.parentNode,
        s = r.querySelector(".brx-megamenu") || r.querySelector(".brx-dropdown-content") || r.querySelector("ul");
      if (s.querySelector('[aria-current="page"]') && t.classList.add("aria-current"), !r.hasAttribute("data-static") && s) if (r.classList.contains("brx-has-megamenu")) {
        var _e38 = r.offsetLeft + 1;
        _e38 && (s.style.left = "-".concat(_e38, "px"));
        var _t21 = !!r.dataset.megaMenu && document.querySelector(r.dataset.megaMenu);
        if (_t21) {
          var _r14 = _t21.getBoundingClientRect();
          s.style.left = "-".concat(_e38 - _r14.left, "px"), s.style.minWidth = "".concat(_r14.width, "px");
        } else s.style.minWidth = "".concat(document.body.clientWidth, "px");
      } else {
        s.classList.contains("brx-multilevel-overflow-right") && s.classList.remove("brx-multilevel-overflow-right"), s.classList.contains("brx-submenu-overflow-right") && s.classList.remove("brx-submenu-overflow-right"), s.classList.contains("brx-sub-submenu-overflow-right") && s.classList.remove("brx-sub-submenu-overflow-right");
        var _t22 = s.getBoundingClientRect(),
          i = _t22.width,
          n = _t22.right,
          o = Math.ceil(_t22.left);
        if (i > e) s.style.left = "-".concat(o, "px"), s.style.minWidth = "".concat(e, "px");else if (n > e) {
          var _e39 = s.closest(".brx-has-multilevel"),
            _t23 = !r.parentNode.closest(".menu-item");
          _e39 ? s.classList.add("brx-multilevel-overflow-right") : _t23 ? s.classList.add("brx-submenu-overflow-right") : s.classList.add("brx-sub-submenu-overflow-right");
        } else o < 0 && (s.style.left = "100% !important");
      }
    });
  }, e);
}
function bricksMultilevelMenu() {
  bricksQuerySelectorAll(document, ".brxe-nav-nested.multilevel").forEach(function (e) {
    var t = e.getAttribute("data-back-text");
    e.querySelectorAll(".brxe-dropdown").forEach(function (e) {
      e.classList.add("brx-has-multilevel"), e.setAttribute("data-toggle", "click"), e.setAttribute("data-back-text", t);
    });
  }), bricksQuerySelectorAll(document, ".brx-has-multilevel").forEach(function (e) {
    var t = e.getAttribute("data-back-text") || "Back";
    bricksQuerySelectorAll(e, "ul").forEach(function (e, r) {
      if (0 === r) return;
      var s = document.createElement("a");
      s.classList.add("brx-multilevel-back"), s.setAttribute("href", "#"), s.innerText = t;
      var i = document.createElement("li");
      i.classList.add("menu-item"), i.appendChild(s), e.insertBefore(i, e.firstChild), s.addEventListener("click", function (e) {
        e.preventDefault();
        var t = e.target.closest(".active");
        if (t) {
          t.classList.remove("open"), t.classList.remove("active");
          var _e40 = t.querySelector(".brx-submenu-toggle > button");
          _e40 && _e40.setAttribute("aria-expanded", !1);
          var _r15 = t.parentNode.closest(".open");
          if (_r15) {
            _r15.classList.add("active");
            var _e41 = _r15.querySelector("ul");
            if (_e41) {
              var _t24 = bricksGetFocusables(_e41);
              _t24.length && _t24[0].focus();
            }
          }
        }
      });
    });
  });
}
function bricksNavMenuMobile() {
  var e = bricksQuerySelectorAll(document, ".bricks-mobile-menu-toggle");
  if (!e.length) return;
  var t = new MutationObserver(function (e) {
    e.forEach(function (e) {
      e.target.classList.contains("show-mobile-menu") ? document.body.classList.add("no-scroll") : document.body.classList.remove("no-scroll");
    });
  });
  e.forEach(function (e) {
    var r = e.closest(".brxe-nav-menu");
    t.observe(r, {
      attributes: !0,
      attributeFilter: ["class"]
    });
  }), document.addEventListener("click", function (e) {
    if (mobileMenuToggle = e.target.closest(".bricks-mobile-menu-toggle"), mobileMenuToggle) {
      var _e42 = mobileMenuToggle.closest(".brxe-nav-menu");
      _e42.classList.toggle("show-mobile-menu");
      var _t25 = _e42.classList.contains("show-mobile-menu");
      mobileMenuToggle.setAttribute("aria-expanded", _t25), _t25 && setTimeout(function () {
        var t = bricksGetFocusables(_e42.querySelector(".bricks-mobile-menu-wrapper"));
        t.length && t[0].focus();
      }, 10);
    }
  }), document.addEventListener("click", function (e) {
    var t = e.target.closest(".brxe-nav-menu");
    if (t) if (e.target.classList.contains("bricks-mobile-menu-overlay")) t.classList.remove("show-mobile-menu"), t.querySelector(".bricks-mobile-menu-toggle").setAttribute("aria-expanded", !1);else if (e.target.closest(".bricks-mobile-menu-wrapper")) {
      var _e43 = "A" === document.activeElement.tagName ? document.activeElement.getAttribute("href") : "";
      _e43.startsWith("#") && _e43.length > 1 && (t.classList.remove("show-mobile-menu"), t.querySelector(".bricks-mobile-menu-toggle").setAttribute("aria-expanded", !1));
    }
  }), document.addEventListener("keyup", function (e) {
    if ("Escape" === e.key) {
      var _e44 = document.querySelector(".brxe-nav-menu.show-mobile-menu");
      if (_e44) {
        _e44.classList.remove("show-mobile-menu");
        var _t26 = _e44.querySelector("bricks-mobile-menu-toggle");
        _t26 && (_t26.setAttribute("aria-expanded", !1), setTimeout(function () {
          _t26.focus();
        }, 10));
      }
    }
  });
}
function bricksGetFocusables(e) {
  var t = e.querySelectorAll('a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])');
  return Array.prototype.filter.call(t, function (e) {
    return "none" !== window.getComputedStyle(e).display;
  });
}
var bricksPauseMediaFn = new BricksFunction({
  parentNode: document,
  selector: 'video, audio, iframe[src*="youtube"], iframe[src*="vimeo"]',
  subscribeEvents: ["bricks/popup/close"],
  forceReinit: !0,
  eachElement: function eachElement(e) {
    if ("VIDEO" !== e.tagName && "AUDIO" !== e.tagName || !e.pause || "function" != typeof e.pause) {
      if ("IFRAME" === e.tagName) {
        var t = e.getAttribute("src"),
          r = t.includes("youtube"),
          s = r ? {
            event: "command",
            func: "pauseVideo",
            args: ""
          } : {
            method: "pause"
          };
        if (t.includes("vimeo") || r) return void e.contentWindow.postMessage(JSON.stringify(s), "*");
      }
    } else e.pause();
  },
  listenerHandler: function listenerHandler(e) {
    if (e !== null && e !== void 0 && e.type && "bricks/popup/close" === e.type) {
      var _e$detail2;
      var t = e === null || e === void 0 ? void 0 : (_e$detail2 = e.detail) === null || _e$detail2 === void 0 ? void 0 : _e$detail2.popupElement;
      t && bricksPauseMediaFn.run({
        parentNode: t
      });
    }
  }
});
var bricksIsFrontend,
  bricksScrollTimeout,
  bricksTimeouts = {};
document.addEventListener("DOMContentLoaded", function (e) {
  bricksIsFrontend = document.body.classList.contains("bricks-is-frontend"), bricksMultilevelMenu(), bricksNavMenuMobile(), bricksStickyHeader(), bricksOnePageNavigation(), bricksSkipLinks(), bricksFacebookSDK(), bricksSearchOverlay(), bricksPopups(), bricksSwiper(), bricksSplide(), bricksPhotoswipe(), bricksPrettify(), bricksAccordion(), bricksAnimatedTyping(), bricksAudio(), bricksCountdown(), bricksCounter(), bricksIsotope(), bricksPricingTables(), bricksVideo(), bricksLazyLoad(), bricksAnimation(), bricksPieChart(), bricksProgressBar(), bricksForm(), bricksInitQueryLoopInstances(), bricksQueryPagination(), bricksInteractions(), bricksAlertDismiss(), bricksTabs(), bricksVideoOverlayClickDetector(), bricksBackgroundVideoInit(), bricksNavNested(), bricksOffcanvas(), bricksToggle(), bricksSubmenuListeners(), bricksSubmenuPosition(250), window.addEventListener("resize", function () {
    Object.keys(bricksTimeouts).forEach(function (e) {
      clearTimeout(bricksTimeouts[e]);
    }), bricksIsFrontend || (bricksTimeouts.bricksSwiper = setTimeout(bricksSwiper, 250), bricksTimeouts.bricksSplide = setTimeout(bricksSplide, 250)), bricksTimeouts.bricksSubmenuPosition = setTimeout(bricksSubmenuPosition, 250), bricksTimeouts.bricksToggleDisplay = setTimeout(bricksToggleDisplay, 100);
  }), setTimeout(function () {
    var _window$bricksData4;
    (Array.isArray((_window$bricksData4 = window.bricksData) === null || _window$bricksData4 === void 0 ? void 0 : _window$bricksData4.interactions) ? window.bricksData.interactions : []).find(function (e) {
      return "scroll" === (e === null || e === void 0 ? void 0 : e.trigger);
    }) && document.addEventListener("scroll", bricksScrollInteractions);
  }, 100);
});
