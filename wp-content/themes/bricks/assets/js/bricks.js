function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
/**
 * Scroll into view via IntersectionObserver
 *
 * Fallback for IE9+ included.
 */
var BricksIntersect = /*#__PURE__*/_createClass(function BricksIntersect() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  _classCallCheck(this, BricksIntersect);
  var element = options.element || false;
  var callback = options.callback || false;
  var runOnce = options.hasOwnProperty('once') ? options.once : true;
  var trigger = options.hasOwnProperty('trigger') ? options.trigger : false;

  // Create Intersection Observer
  if ('IntersectionObserver' in window) {
    var initialObserve = true;
    var observerInstance = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        // Check if element is intersecting based on trigger type
        var bricksIsIntersecting = trigger === 'leaveView' ? !entry.isIntersecting : entry.isIntersecting;
        if (bricksIsIntersecting) {
          // Skip initial observe if trigger is 'leaveView', as it will always be true if element is not visible
          if (initialObserve && trigger === 'leaveView') {
            initialObserve = false;
            return;
          }

          // Run callback function
          if (element && callback) {
            callback(entry.target);
          }

          // Run only once: Stop observing element
          if (runOnce) {
            observer.unobserve(entry.target);
          }
        }
      });
    }, {
      threshold: options.threshold || 0,
      root: options.root || null,
      rootMargin: (options === null || options === void 0 ? void 0 : options.rootMargin) || '0px'
    });

    // Start observer
    if (element instanceof Element) {
      observerInstance.observe(element);
    }
  }

  // Fallback: Internet Explorer 9+
  else {
    var active = false;
    var ieIntersectObserver = function ieIntersectObserver() {
      if (active === false) {
        active = true;
        if (element.getBoundingClientRect().top <= window.innerHeight && element.getBoundingClientRect().bottom >= 0 && window.getComputedStyle(element).display !== 'none') {
          // Run callback function
          if (element && callback) {
            callback(element);
          }
        }
        active = false;
      }
    };

    // Init IE intersect observer fallback function
    ieIntersectObserver();
    document.addEventListener('scroll', ieIntersectObserver);
    window.addEventListener('resize', ieIntersectObserver);
    window.addEventListener('orientationchange', ieIntersectObserver);
  }
});
/**
 * Check if element is in the viewport
 *
 * @since 1.5
 *
 * @param {Element} element
 * @returns {boolean}
 */
function BricksIsInViewport(element) {
  var rect = element.getBoundingClientRect();
  return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
}

/**
 * Convert foundNodeList to array (as IE does not support forEach loop on NodeList)
 *
 * @param {Element} parentNode Node to search within.
 * @param {array, string} selector CSS selector(s) to search for.
 *
 * @returns {array}
 */
function bricksQuerySelectorAll(parentNode, selector) {
  // Multiple selectors
  if (Array.isArray(selector)) {
    var nodes = [];
    selector.forEach(function (sel) {
      nodes = nodes.concat(Array.prototype.slice.apply(parentNode.querySelectorAll(sel)));
    });
    return nodes;
  }

  // One selector (string)
  return Array.prototype.slice.apply(parentNode.querySelectorAll(selector));
}

/**
 * Bricks Utilities functions
 *
 * @since 1.8
 */

var bricksUtils = {
  /**
   * Subscribe to multiple events
   * @param {*} object Example: document, window, element
   * @param {*} eventNames Array of event names
   * @param {*} callback
   */
  subscribeEvents: function subscribeEvents(object, eventNames, callback) {
    eventNames.forEach(function (eventName) {
      object.addEventListener(eventName, function (event) {
        callback(event);
      });
    });
  }
};

/**
 * BricksFunction class
 *
 * @since 1.8
 */
var BricksFunction = /*#__PURE__*/function () {
  // Store custom functions on class init

  // Store default settings

  // Store initialized elements

  function BricksFunction(options) {
    var _options$run,
      _options$eachElement,
      _options$listenerHand,
      _options$addEventList,
      _this = this;
    _classCallCheck(this, BricksFunction);
    _defineProperty(this, "_customRun", null);
    _defineProperty(this, "_customEachElement", null);
    _defineProperty(this, "_customListenerHandler", null);
    _defineProperty(this, "_customAddEventListeners", null);
    _defineProperty(this, "_settings", {});
    _defineProperty(this, "_initializedElements", new Set());
    // Default settings
    var defaultSettings = {
      parentNode: document,
      selector: '',
      subscribeEvents: ['bricks/ajax/pagination/completed', 'bricks/ajax/load_page/completed'],
      forceReinit: false,
      frontEndOnly: false,
      windowVariableCheck: [],
      additionalActions: []
    };

    // Merge options with default settings when init the class
    Object.assign(defaultSettings, options);

    // Set default settings as class properties
    this._settings = defaultSettings;

    // Assign custom functions if any (these functions are overrideable on class init)
    this._customRun = (_options$run = options === null || options === void 0 ? void 0 : options.run) !== null && _options$run !== void 0 ? _options$run : null;
    this._customEachElement = (_options$eachElement = options === null || options === void 0 ? void 0 : options.eachElement) !== null && _options$eachElement !== void 0 ? _options$eachElement : null;
    this._customListenerHandler = (_options$listenerHand = options === null || options === void 0 ? void 0 : options.listenerHandler) !== null && _options$listenerHand !== void 0 ? _options$listenerHand : null;
    this._customAddEventListeners = (_options$addEventList = options === null || options === void 0 ? void 0 : options.addEventListeners) !== null && _options$addEventList !== void 0 ? _options$addEventList : null;

    // Bind functions to class
    this.cleanUpInitElements = this.cleanUpInitElements.bind(this);
    this.run = this.run.bind(this);
    this.eachElement = this.eachElement.bind(this);
    this.listenerHandler = this.listenerHandler.bind(this);
    this.addEventListeners = this.addEventListeners.bind(this);
    document.addEventListener('DOMContentLoaded', function () {
      // Add event listeners (only add once)
      _this.addEventListeners();

      // Run additional actions: Not define as a function to avoid overriding (no functionCanRun check here)
      if (_this._settings.additionalActions.length) {
        var _iterator = _createForOfIteratorHelper(_this._settings.additionalActions),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var action = _step.value;
            // Check if action is a function
            if (typeof action === 'function') {
              action.call(_this);
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    });
  }

  /**
   * Helper: Based on window variable and frontEndOnly setting, check if function can run
   */
  _createClass(BricksFunction, [{
    key: "functionCanRun",
    value: function functionCanRun() {
      // Check: frontEndOnly is set and we are not in the front end
      if (this._settings.frontEndOnly) {
        // Can't use bricksIsFrontend here as this function is called before 'bricksIsFrontend' is set (and this is inside a class)
        if (!document.body.classList.contains('bricks-is-frontend')) {
          return false;
        }
      }

      // Check: Does required window variables exist
      if (this._settings.windowVariableCheck.length) {
        var _iterator2 = _createForOfIteratorHelper(this._settings.windowVariableCheck),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var variable = _step2.value;
            if (!window[variable]) {
              return false;
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
      return true;
    }

    /**
     * Helper: Clean up initialized elements set: Remove elements that are no longer in the DOM
     */
  }, {
    key: "cleanUpInitElements",
    value: function cleanUpInitElements() {
      // Remove elements from _initializedElements if they are no longer in the DOM
      var _iterator3 = _createForOfIteratorHelper(this._initializedElements),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var element = _step3.value;
          if (!element.isConnected) {
            this._initializedElements["delete"](element);
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }

    /**
     * Run logic on each element
     */
  }, {
    key: "eachElement",
    value: function eachElement(element) {
      // Execute custom _customEachElement function if defined in constructor
      if (this._customEachElement && typeof this._customEachElement === 'function') {
        this._customEachElement.call(this, element);
        return;
      }

      // Default customEachElement function: Do nothing
    }

    /**
     * Entry point:
     * Using functionCanRun as a guard, clean up initialized elements.
     * By default, find all elements based on parent node and selector, and run the eachElement function on each element.
     */
  }, {
    key: "run",
    value: function run(customSettings) {
      var _this2 = this;
      if (!this.functionCanRun()) {
        return;
      }

      // Must run cleanUpInitElements before custom run function
      this.cleanUpInitElements();

      // Execute custom run function if defined in constructor
      if (this._customRun && typeof this._customRun === 'function') {
        this._customRun.call(this, customSettings);
        return;
      }

      // Default run function

      // Clone settings (to avoid modifying them)
      var currentSettings = Object.assign({}, this._settings);

      // Set custom settings to current settings
      if (customSettings) {
        Object.keys(customSettings).forEach(function (key) {
          if (currentSettings.hasOwnProperty(key)) {
            currentSettings[key] = customSettings[key];
          }
        });
      }
      var elementInstances = bricksQuerySelectorAll(currentSettings.parentNode, currentSettings.selector);

      // Exit if no element found
      if (!elementInstances.length) {
        return;
      }
      elementInstances.forEach(function (element, index) {
        // Store the element in the _initializedElements set
        // forceReinit, ignore the set and run the eachElement function
        if (currentSettings.forceReinit) {
          // If forceReinit is a callback, run it
          var reinit = typeof currentSettings.forceReinit === 'function' ? currentSettings.forceReinit.call(_this2, element, index) : currentSettings.forceReinit;
          if (reinit) {
            _this2.eachElement(element, index);
            // Continue to next element
            return;
          }
        }

        // Check if the element is already initialized
        if (!_this2._initializedElements.has(element)) {
          // Add element to initialized elements set
          _this2._initializedElements.add(element);

          // Run eachElement function
          _this2.eachElement(element, index);
        } else {
          // Maybe the element inside the set is not the same as the current element, so we need to check
          // Get the element from the set
          var elementFromSet = Array.from(_this2._initializedElements).find(function (el) {
            return el === element;
          });

          // If it is not connected, remove it from the set and run the eachElement function
          if (!elementFromSet.isConnected) {
            _this2._initializedElements["delete"](elementFromSet);
            // Add element to initialized elements set
            _this2._initializedElements.add(element, index);
            _this2.eachElement(element, index);
          }
        }
      });
    }

    /**
     * Once subscribed to events, run the listenerHandler function
     * By default, we will change the parent node based on the event type, and execute the run function again
     */
  }, {
    key: "listenerHandler",
    value: function listenerHandler(event) {
      // Execute custom listenerHandler function if defined in constructor
      if (this._customListenerHandler && typeof this._customListenerHandler === 'function') {
        this._customListenerHandler.call(this, event);
        return;
      }

      // Default listenerHandler function
      if (event !== null && event !== void 0 && event.type) {
        switch (event.type) {
          // Can add more cases here if needed for different events
          // Maybe can change the parent node or selector based on the event type

          default:
            this.run();
            break;
        }
      }
    }

    /**
     * By default, subscribe to events defined in the settings, and set listenerHandler as the callback
     * Using functionCanRun as a guard
     */
  }, {
    key: "addEventListeners",
    value: function addEventListeners() {
      if (!this.functionCanRun()) {
        return;
      }

      // Execute custom addEventListeners function if defined in constructor
      if (this._customAddEventListeners && typeof this._customAddEventListeners === 'function') {
        this._customAddEventListeners.call(this);
        return;
      }

      // Default addEventListeners function
      if (this._settings.subscribeEvents.length) {
        bricksUtils.subscribeEvents(document, this._settings.subscribeEvents, this.listenerHandler);
      }
    }
  }]);
  return BricksFunction;
}();
/**
 * Frontend: Lazy load when target element enters viewport
 *
 * Video lazy load via bricksBackgroundVideoInit()
 *
 * https://developers.google.com/web/fundamentals/performance/lazy-loading-guidance/images-and-video/
 */
var bricksLazyLoadFn = new BricksFunction({
  parentNode: document,
  selector: '.bricks-lazy-hidden',
  eachElement: function eachElement(el) {
    // Lazy Load function
    var lazyLoad = function lazyLoad(el) {
      // Replace element attributes by setting 'src' with 'data-src'

      // Show base64 preloader SVG
      el.classList.add('wait');

      // Image
      if (el.dataset.src) {
        el.src = el.dataset.src;
        delete el.dataset.src;
      }

      // Image (data-sizes @since 1.5.1 due to W3 Validator error)
      if (el.dataset.sizes) {
        el.sizes = el.dataset.sizes;
        delete el.dataset.sizes;
      }
      if (el.dataset.srcset) {
        el.srcset = el.dataset.srcset;
        delete el.dataset.srcset;
      }

      // Background image (e.g. slider)
      if (el.dataset.style) {
        var style = el.getAttribute('style') || '';
        style += el.dataset.style;
        el.setAttribute('style', style);

        // Keep 'data-style' attribute for when splide.js re-initializes on window resize, etc. (@since 1.5)
        if (!el.classList.contains('splide__slide')) {
          delete el.dataset.style;
        }
      }
      el.classList.remove('bricks-lazy-hidden');
      el.classList.remove('wait');
      if (el.classList.contains('bricks-lazy-load-isotope')) {
        bricksIsotope();
      }
    };

    // Lazy load offet: 300px default (customisable via Bricks setting 'offsetLazyLoad')
    var rootMargin = window.bricksData.offsetLazyLoad || 300;
    new BricksIntersect({
      element: el,
      callback: function callback(el) {
        lazyLoad(el);
      },
      rootMargin: "".concat(rootMargin, "px")
    });
  },
  listenerHandler: function listenerHandler(event) {
    // No need to change parentNode, but need some delay to allow for new elements to be added to the DOM (e.g. swiper, carousel, testimonial, etc.)
    setTimeout(function () {
      bricksLazyLoadFn.run();
    }, 100);
  }
});
function bricksLazyLoad() {
  bricksLazyLoadFn.run();
}

/**
 * Animate.css element animation
 */
var bricksAnimationFn = new BricksFunction({
  parentNode: document,
  selector: '.brx-animated',
  removeAfterMs: 3000,
  // removeAfterMs not used anymore (@since 1.8)
  eachElement: function eachElement(el) {
    new BricksIntersect({
      element: el,
      callback: function callback(el) {
        var animation = el.dataset.animation;
        if (animation) {
          // Start animation
          el.classList.add("brx-animate-".concat(animation));

          // Remove attribute to prevent hiding element after "in" animations (see _animate.scss)
          el.removeAttribute('data-animation');

          // Remove animation class on 'animationend' event instead of setTimeout below (@since 1.8)
          el.addEventListener('animationend', function () {
            el.classList.remove("brx-animate-".concat(animation));

            // If this is .brx-popup-content, and animation includes 'Out', execute bricksClosePopup() after animation
            if (el.classList.contains('brx-popup-content') && animation.includes('Out')) {
              var popupNode = el.closest('.brx-popup');
              if (popupNode) {
                bricksClosePopup(popupNode);
              }
            }

            // animationId = data-interaction-id
            var animationId = el.dataset.interactionId;
            if (animationId) {
              // @since 1.8.4 - Trigger custom event for bricks/animation/end/{animationId}, provide element
              var bricksAnimationEvent = new CustomEvent("bricks/animation/end/".concat(animationId), {
                detail: {
                  el: el
                }
              });
              document.dispatchEvent(bricksAnimationEvent);
            }
          }, {
            once: true
          });
        }
      }
    });
  },
  run: function run(customSettings) {
    var self = bricksAnimationFn;

    // Use customSettings.elementsToAnimate if defined
    var elementsToAnimate = (customSettings === null || customSettings === void 0 ? void 0 : customSettings.elementsToAnimate) || bricksQuerySelectorAll(self._settings.parentNode, self._settings.selector);

    // Use customSettings.removeAfterMs if defined
    self.removeAfterMs = (customSettings === null || customSettings === void 0 ? void 0 : customSettings.removeAfterMs) || self.removeAfterMs;
    elementsToAnimate.forEach(function (el) {
      self.eachElement(el);
    });
  }
});
function bricksAnimation() {
  bricksAnimationFn.run();
}

/**
 * Populate the queries instances variable to be used for infinite scroll and load more
 *
 * @since 1.6
 */
var bricksInitQueryLoopInstancesFn = new BricksFunction({
  parentNode: document,
  selector: '.brx-query-trail',
  subscribeEvents: ['bricks/ajax/load_page/completed'],
  eachElement: function eachElement(el) {
    var _el$dataset;
    var observerMargin = ((_el$dataset = el.dataset) === null || _el$dataset === void 0 ? void 0 : _el$dataset.observerMargin) || '1px'; // 0px doesn't trigger properly every time
    var queryElementId = el.dataset.queryElementId;
    var queryVars = el.dataset.queryVars;
    var isPostsElement = el === null || el === void 0 ? void 0 : el.classList.contains('bricks-isotope-sizer');
    var isInfiniteScroll = el === null || el === void 0 ? void 0 : el.classList.contains('brx-infinite-scroll');
    window.bricksData.queryLoopInstances[queryElementId] = {
      page: el.dataset.page,
      maxPages: el.dataset.maxPages,
      queryVars: queryVars,
      observerMargin: observerMargin,
      infiniteScroll: isInfiniteScroll,
      isPostsElement: isPostsElement
    };

    // If posts element, the query trail is the isotope sizer; For the Query Loop the trail is the last loop element
    // @since 1.7.1 - exclude popup elements
    var queryTrail = isPostsElement ? el.previousElementSibling : Array.from(document.querySelectorAll(".brxe-".concat(queryElementId, ":not(.brx-popup)"))).pop();

    // Remove the trail in case it is not a Posts element
    if (!isPostsElement) {
      el.remove();
    }
    if (queryTrail && isInfiniteScroll) {
      queryTrail.dataset.queryElementId = queryElementId;
      new BricksIntersect({
        element: queryTrail,
        callback: function callback(el) {
          return bricksQueryLoadPage(el);
        },
        once: 1,
        rootMargin: observerMargin
      });
    }
  }
});
function bricksInitQueryLoopInstances() {
  bricksInitQueryLoopInstancesFn.run();
}

/**
 * Bricks query load page elements
 *
 * @since 1.5
 */
function bricksQueryLoadPage(el) {
  return new Promise(function (resolve, reject) {
    var _window$bricksData$qu;
    var queryElementId = el.dataset.queryElementId;
    var queryInfo = (_window$bricksData$qu = window.bricksData.queryLoopInstances) === null || _window$bricksData$qu === void 0 ? void 0 : _window$bricksData$qu[queryElementId];
    if (!queryInfo || queryInfo !== null && queryInfo !== void 0 && queryInfo.isLoading) {
      return;
    }
    var page = parseInt(queryInfo.page || 1) + 1;
    var maxPages = parseInt(queryInfo.maxPages || 1);
    if (page > maxPages) {
      delete window.bricksData.queryLoopInstances[queryElementId];
      resolve({
        page: page,
        maxPages: maxPages
      });
      return;
    }

    // Set isLoading flag
    window.bricksData.queryLoopInstances[queryElementId].isLoading = 1;
    var queryData = {
      postId: window.bricksData.postId,
      queryElementId: queryElementId,
      queryVars: queryInfo.queryVars,
      page: page,
      nonce: window.bricksData.nonce
    };
    var url = window.bricksData.restApiUrl.concat('load_query_page');
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.setRequestHeader('X-WP-Nonce', window.bricksData.wpRestNonce);

    // Successful response
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        var status = xhr.status;

        // Success
        if (status === 0 || status >= 200 && status < 400) {
          var res = JSON.parse(xhr.response);
          var html = (res === null || res === void 0 ? void 0 : res.html) || false;
          var styles = (res === null || res === void 0 ? void 0 : res.styles) || false;

          // Popups HTML (@since 1.7.1)
          var popups = (res === null || res === void 0 ? void 0 : res.popups) || false;
          if (html) {
            el.insertAdjacentHTML('afterend', html);
          }
          if (popups) {
            // Add popups HTML at the end of the body (@since 1.7.1)
            document.body.insertAdjacentHTML('beforeend', popups);
          }
          if (styles) {
            // Add the page styles at the end of body
            document.body.insertAdjacentHTML('beforeend', styles);
          }

          // Update Page on query info
          window.bricksData.queryLoopInstances[queryElementId].page = page;
        }

        // Reset isLoading flag
        window.bricksData.queryLoopInstances[queryElementId].isLoading = 0;
        resolve({
          page: page,
          maxPages: maxPages
        });
        setTimeout(function () {
          // Set the new query trail (Posts element)
          if (queryInfo.isPostsElement) {
            newQueryTrail = el.parentNode.querySelector('.bricks-isotope-sizer').previousElementSibling;
          }

          // Query Loop, @since 1.7.1 - exclude popup elements from the query trail
          else {
            newQueryTrail = Array.from(document.querySelectorAll(".brxe-".concat(queryElementId, ":not(.brx-popup)"))).pop();
          }

          // Emit event
          document.dispatchEvent(new CustomEvent('bricks/ajax/load_page/completed', {
            detail: {
              queryTrailElement: newQueryTrail,
              queryId: queryElementId
            }
          }));

          // Is infinite scroll?
          if (queryInfo.infiniteScroll) {
            newQueryTrail.dataset.queryElementId = queryElementId;

            // Check if the query trail is still visible, if yes, triggers the next page
            if (BricksIsInViewport(newQueryTrail)) {
              bricksQueryLoadPage(newQueryTrail);
            }

            // Add a new observer
            else {
              new BricksIntersect({
                element: newQueryTrail,
                callback: function callback(el) {
                  return bricksQueryLoadPage(el);
                },
                once: true,
                rootMargin: queryInfo.observerMargin
              });
            }
          }
        }, 250);
      }
    };
    xhr.send(JSON.stringify(queryData));
  });
}

/**
 * Bricks query pagination elements (AJAX)
 *
 * @since 1.5
 */
var bricksQueryPaginationFn = new BricksFunction({
  parentNode: document,
  selector: '.brx-ajax-pagination a',
  subscribeEvents: ['bricks/ajax/pagination/completed'],
  eachElement: function eachElement(el) {
    var _el$dataset2;
    if (!((_el$dataset2 = el.dataset) !== null && _el$dataset2 !== void 0 && _el$dataset2.ajaxPagination)) {
      el.dataset.ajaxPagination = 1;
      el.addEventListener('click', function (e) {
        var _targetPaginationEl$d;
        var targetEl = e.currentTarget;
        var href = targetEl.getAttribute('href');
        var targetPaginationEl = targetEl.closest('.brx-ajax-pagination');
        var queryId = targetPaginationEl === null || targetPaginationEl === void 0 ? void 0 : (_targetPaginationEl$d = targetPaginationEl.dataset) === null || _targetPaginationEl$d === void 0 ? void 0 : _targetPaginationEl$d.queryElementId;

        // Check if there is any element
        var firstLoopElement = document.querySelector(".brxe-".concat(queryId));
        if (!firstLoopElement) {
          return;
        }
        e.preventDefault();
        var xhr = new XMLHttpRequest();
        xhr.open('GET', href, true);
        xhr.responseType = 'document';
        xhr.onload = function () {
          if (this.readyState === XMLHttpRequest.DONE) {
            var status = this.status;

            // Success
            if (status === 0 || status >= 200 && status < 400) {
              var response = this.responseXML;
              var loopWrapper = firstLoopElement.parentNode;

              // Add a marker in the DOM so we know where to add the new looped elements
              var listPlaceholder = document.createElement('div');
              listPlaceholder.style.display = 'none';

              // Insert the list placeholder before the first loop element
              firstLoopElement.insertAdjacentElement('beforebegin', listPlaceholder);

              // Remove old page elements, @since 1.7.1 - exclude popup elements
              var oldLoopNodes = loopWrapper.querySelectorAll(".brxe-".concat(queryId, ":not(.brx-popup)"));
              oldLoopNodes.forEach(function (el) {
                return el.remove();
              });

              // Add new page elements, @since 1.7.1 - exclude popup elements
              var newLoopNodes = response.querySelectorAll(".brxe-".concat(queryId, ":not(.brx-popup)"));
              newLoopNodes.forEach(function (el) {
                return listPlaceholder.insertAdjacentElement('beforebegin', el);
              });

              // Remove marker
              listPlaceholder.remove();

              // @since 1.7.1 - Remove old query looping popup elements
              var oldLoopPopupNodes = document.querySelectorAll(".brx-popup[data-popup-loop=\"".concat(queryId, "\"]"));
              oldLoopPopupNodes.forEach(function (el) {
                return el.remove();
              });

              // @since 1.7.1 - Add new query looping popup elements before body end
              var newLoopPopupNodes = response.querySelectorAll(".brx-popup[data-popup-loop=\"".concat(queryId, "\"]"));
              newLoopPopupNodes.forEach(function (el) {
                return document.body.insertAdjacentElement('beforeend', el);
              });

              // Replace #bricks-frontend-inline-inline-css - support looping dynamic styles (@since 1.8)
              var newInlineStyle = response.querySelector('#bricks-frontend-inline-inline-css');
              var oldInlineStyle = document.querySelector('#bricks-frontend-inline-inline-css');
              if (oldInlineStyle && newInlineStyle) {
                oldInlineStyle.replaceWith(newInlineStyle);
              }

              // Replace #bricks-dynamic-data-inline-css - support looping dynamic styles (@since 1.8)
              // Use for AJAX pagination
              var newDynamicStyle = response.querySelector('#bricks-dynamic-data-inline-css');
              var oldDynamicStyle = document.querySelector('#bricks-dynamic-data-inline-css');
              if (oldDynamicStyle && newDynamicStyle) {
                oldDynamicStyle.replaceWith(newDynamicStyle);
              }

              // Replace the pagination element
              var sourcePagination = response.querySelector(".brx-ajax-pagination[data-query-element-id=\"".concat(queryId, "\"]"));
              targetPaginationEl.replaceWith(sourcePagination);

              // @since 1.8 - Emit event
              document.dispatchEvent(new CustomEvent('bricks/ajax/pagination/completed', {
                detail: {
                  queryId: queryId
                }
              }));

              // Update the history
              window.history.pushState({}, '', href);
            }
          }
        };

        // targetQueryTrailEl.classList.add('is-loading')

        xhr.send();
      });
    }
  }
});
function bricksQueryPagination() {
  bricksQueryPaginationFn.run();
}
function bricksStickyHeader() {
  var stickHeaderEl = document.querySelector('#brx-header.sticky');
  if (!stickHeaderEl) {
    return;
  }
  var logo = document.querySelector('.bricks-site-logo');
  var logoDefault;
  var logoInverse;
  var lastScrolled = -1; // -1 to make sure that the first time bricksStickyHeaderOnScroll() runs it doesn't slide up
  var headerSlideUpAfter = stickHeaderEl.hasAttribute('data-slide-up-after') ? stickHeaderEl.getAttribute('data-slide-up-after') : 0;
  if (logo) {
    logoDefault = logo.getAttribute('data-bricks-logo');
    logoInverse = logo.getAttribute('data-bricks-logo-inverse');
  }
  var bricksStickyHeaderOnScroll = function bricksStickyHeaderOnScroll() {
    var scrolled = window.pageYOffset;
    if (scrolled > 0) {
      stickHeaderEl.classList.add('scrolling');
      if (logo && logoInverse && logo.src !== logoInverse) {
        logo.src = logoInverse;
        logo.srcset = '';
      }
    } else {
      stickHeaderEl.classList.remove('scrolling');
      if (logo && logoDefault && logo.src !== logoDefault) {
        logo.src = logoDefault;
      }
    }

    // Slide up
    if (headerSlideUpAfter) {
      if (scrolled > lastScrolled && lastScrolled >= 0) {
        // Scolling down
        if (scrolled > headerSlideUpAfter) {
          stickHeaderEl.classList.add('slide-up');
        }
      } else {
        // Scrolling up
        stickHeaderEl.classList.remove('slide-up');
      }
    }
    lastScrolled = scrolled;
  };

  // Set sticky header logo inverse & slide up
  window.addEventListener('scroll', bricksStickyHeaderOnScroll);

  // Run it once on page load to set the .scrolling class if page is aready scrolled down
  bricksStickyHeaderOnScroll();
}

/**
 * Frontend: One Page Navigation (in builder via dynamic Vue component)
 */
function bricksOnePageNavigation() {
  var onePageNavigationWrapper = document.getElementById('bricks-one-page-navigation');
  if (!bricksIsFrontend || !onePageNavigationWrapper) {
    return;
  }
  var rootElements = bricksQuerySelectorAll(document, '#brx-content > *');
  var elementIds = [];
  var elementId = '';
  var onePageLink = '';
  var onePageItem = '';
  if (!rootElements) {
    return;
  }
  rootElements.forEach(function (element) {
    elementId = element.getAttribute('id');
    if (!elementId) {
      return;
    }
    elementIds.push(elementId);
    onePageItem = document.createElement('li');
    onePageLink = document.createElement('a');
    onePageLink.classList.add("bricks-one-page-".concat(elementId));
    onePageLink.setAttribute('href', "#".concat(elementId));
    onePageItem.appendChild(onePageLink);
    onePageNavigationWrapper.appendChild(onePageItem);
  });
  function onePageScroll() {
    var scrolled = window.scrollY;
    elementIds.forEach(function (elementId) {
      var element = document.getElementById(elementId);
      var elementTop = element.offsetTop;
      var elementBottom = elementTop + element.offsetHeight;
      if (scrolled >= elementTop - 1 && scrolled < elementBottom - 1) {
        document.querySelector(".bricks-one-page-".concat(elementId)).classList.add('active');
      } else {
        document.querySelector(".bricks-one-page-".concat(elementId)).classList.remove('active');
      }
    });
  }

  // Add load, resize, scroll event listeners
  window.addEventListener('load', onePageScroll);
  window.addEventListener('resize', onePageScroll);
  document.addEventListener('scroll', onePageScroll);
}

/**
 * Search element: Toggle overlay search
 */
function bricksSearchToggle() {
  var searchElements = bricksQuerySelectorAll(document, '.brxe-search');
  searchElements.forEach(function (searchElement) {
    var toggle = searchElement.querySelector('.toggle');
    var overlay = searchElement.querySelector('.bricks-search-overlay');
    if (!toggle || !overlay) {
      return;
    }
    var searchInputOrIcon = overlay.previousElementSibling;
    document.addEventListener('keyup', function (e) {
      if (e.key === 'Escape') {
        // Close search overlay on ESC key if visible (offsetParent not working on fixed positioned node)
        var overlayStyles = window.getComputedStyle(overlay);
        if (overlayStyles.visibility === 'visible') {
          overlay.classList.remove('show');
          searchInputOrIcon.focus();
          searchInputOrIcon.setAttribute('aria-expanded', false);
        }
      }
    });
    toggle.addEventListener('click', function () {
      overlay.classList.toggle('show');
      toggle.setAttribute('aria-expanded', toggle.getAttribute('aria-expanded') === 'false');
      setTimeout(function () {
        searchElement.querySelector('input[type=search]').focus();
      }, 200);
    });
    overlay.querySelector('.close').addEventListener('click', function () {
      overlay.classList.remove('show');
      searchInputOrIcon.focus();
      searchInputOrIcon.setAttribute('aria-expanded', false);
    });
  });
}

/**
 * Dismiss alert element
 */
var bricksAlertDismissFn = new BricksFunction({
  parentNode: document,
  selector: '.brxe-alert svg',
  subscribeEvents: ['bricks/ajax/pagination/completed', 'bricks/ajax/load_page/completed'],
  eachElement: function eachElement(dismissable) {
    dismissable.addEventListener('click', function () {
      var alertEl = dismissable.closest('.brxe-alert');
      alertEl.remove();
    });
  }
});
function bricksAlertDismiss() {
  bricksAlertDismissFn.run();
}

/**
 * Element: Tabs
 */
var bricksTabsFn = new BricksFunction({
  parentNode: document,
  selector: '.brxe-tabs, .brxe-tabs-nested',
  subscribeEvents: ['bricks/ajax/pagination/completed', 'bricks/ajax/load_page/completed'],
  eachElement: function eachElement(tabElement) {
    var titles = bricksQuerySelectorAll(tabElement, '.tab-title');
    titles.forEach(function (title, index) {
      // Set first title to open
      if (index === 0) {
        title.classList.add('brx-open');
      }
      var panes = bricksQuerySelectorAll(tabElement, '.tab-pane');

      // Set first content to open
      panes.forEach(function (content, index) {
        if (index === 0) {
          content.classList.add('brx-open');
        }
      });

      // Create tab title click listener
      title.addEventListener('click', function () {
        titles.forEach(function (t, i) {
          // Add .brx-open to tab title
          if (i === index) {
            title.classList.add('brx-open');
          }

          // Remove .brx-open from other title
          else {
            t.classList.remove('brx-open');
          }
        });
        panes.forEach(function (pane, i) {
          // Add .brx-open to tab content
          if (i === index) {
            pane.classList.add('brx-open');
          }

          // Remove .brx-open from other conten
          else {
            pane.classList.remove('brx-open');
          }
        });
      });
    });
  }
});
function bricksTabs() {
  bricksTabsFn.run();
}

/**
 * Element - Video: Play video on overlay, icon click or thumbnail preview click
 */
var bricksVideoOverlayClickDetectorFn = new BricksFunction({
  parentNode: document,
  selector: '.bricks-video-overlay, .bricks-video-overlay-icon, .bricks-video-preview-image',
  subscribeEvents: ['bricks/ajax/pagination/completed', 'bricks/ajax/load_page/completed'],
  frontEndOnly: true,
  eachElement: function eachElement(overlay) {
    overlay.addEventListener('click', function (e) {
      var videoWrapper = e.target.closest('.brxe-video');
      if (!videoWrapper) {
        return;
      }

      // STEP: Convert thumbnail preview into iframe

      // Get thumbnail preview element
      var thumbnailPreviewElement = videoWrapper.querySelector('.bricks-video-preview-image');
      if (thumbnailPreviewElement) {
        // Convert thumbnail preview into iframe together with all attributes (youtube/vimeo)
        var _iframeElement = document.createElement('iframe');
        var attributes = _toConsumableArray(thumbnailPreviewElement.attributes);
        attributes.forEach(function (attr) {
          // Skip the class attribute and style attribute
          if (attr.name === 'class' || attr.name === 'style') {
            return;
          }

          // Change the data-src attribute to src
          if (attr.name === 'data-iframe-src') {
            _iframeElement.setAttribute('src', attr.value);
            return;
          }

          // Add all other attributes to the iframe element
          _iframeElement.setAttribute(attr.name, attr.value);
        });
        thumbnailPreviewElement.replaceWith(_iframeElement);
      }

      // STEP: Start iframe/video

      // Get iframe element (video type: YouTube, Vimeo)
      var iframeElement = videoWrapper.querySelector('iframe');
      if (iframeElement && iframeElement.getAttribute('src')) {
        iframeElement.src += '&autoplay=1';
      }

      // Get <video> element (video type: media, file URL)
      var videoElement = videoWrapper.querySelector('video');
      if (videoElement) {
        videoElement.play();
      }
    });
  }
});
function bricksVideoOverlayClickDetector() {
  bricksVideoOverlayClickDetectorFn.run();
}

/**
 * Background video (supported: YouTube and file URLs)
 */
var bricksBackgroundVideoInitFn = new BricksFunction({
  parentNode: document,
  selector: '.bricks-background-video-wrapper',
  subscribeEvents: ['bricks/ajax/pagination/completed', 'bricks/ajax/load_page/completed'],
  forceReinit: function forceReinit(element, index) {
    // Builder: Force reinit as the URL parameter is not yet set (@since 1.8)
    return !bricksIsFrontend;
  },
  eachElement: function eachElement(videoWrapper) {
    if (videoWrapper.classList.contains('loaded') || videoWrapper.querySelector('iframe')) {
      return;
    }
    var videoUrl = videoWrapper.getAttribute('data-background-video-url');
    var videoScale = videoWrapper.getAttribute('data-background-video-scale');
    var startTime = videoWrapper.getAttribute('data-background-video-start');
    var endTime = videoWrapper.getAttribute('data-background-video-end');
    var videoLoop = videoWrapper.getAttribute('data-background-video-loop');
    var playOnMobile = videoWrapper.getAttribute('data-background-video-play-on-mobile');
    var mobileBreakpoint = parseInt(videoWrapper.getAttribute('data-background-video-mobile-breakpoint'));

    /**
     * Disable video on mobile if playOnMobile is not set
     *
     * Mobile breakpoint: Mobile portrait (478px)
     *
     * NOTE: Provide setting for mobile breakpoint?
     *
     * @since 1.8.4
     */
    if (!playOnMobile && window.innerWidth < mobileBreakpoint) {
      return;
    }
    if (!videoUrl) {
      return;
    }
    var isIframe = false; // YouTube and Vimeo iframe embed
    var videoId;
    var videoAspectRatio = videoWrapper.getAttribute('data-background-video-ratio') || '16:9';
    var videoAspectRatioX = parseInt(videoAspectRatio.split(':')[0] || 16);
    var videoAspectRatioY = parseInt(videoAspectRatio.split(':')[1] || 9);

    /**
     * YouTube embed
     * NOTE: Error "Failed to execute 'postMessage' on 'DOMWindow'" when origin is not HTTPS
     * Adding 'host' or 'origin' do not fix this error.
     */
    if (videoUrl.indexOf('youtube.com') !== -1) {
      isIframe = true;
      if (videoUrl.indexOf('watch?v=') !== -1) {
        var videoIdIndex = videoUrl.lastIndexOf('=');
        videoId = videoUrl.slice(videoIdIndex + 1);
      } else if (videoUrl.indexOf('embed/') !== -1) {
        var _videoIdIndex = videoUrl.lastIndexOf('/');
        videoId = videoUrl.slice(_videoIdIndex + 1);
      }

      // Transform YouTube video URL into valid embed URL
      videoUrl = videoUrl.replace('watch?v=', 'embed/');
    }

    /**
     * Vimeo embed
     *
     * https://help.vimeo.com/hc/en-us/articles/360001494447-Using-Player-Parameters
     */

    if (videoUrl.indexOf('vimeo.com') !== -1) {
      isIframe = true;
      videoUrl += '?background=1';
      videoUrl += '&byline=0';
      videoUrl += '&portrait=0';
      videoUrl += '&title=0';

      // Transform Vimeo video URL into valid embed URL
      if (videoUrl.indexOf('player.vimeo.com/video') === -1) {
        videoUrl = videoUrl.replace('vimeo.com', 'player.vimeo.com/video');
      }
    }
    var videoElement;
    if (isIframe) {
      // Check if YouTube API script is already added
      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        // Create script tag for YouTube IFrame API
        var tag = document.createElement('script');

        // Set source to YouTube IFrame API URL
        tag.src = 'https://www.youtube.com/iframe_api';

        // Find the first script tag on your page
        var firstScriptTag = document.getElementsByTagName('script')[0];

        // Insert new script tag before the first script tag
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }
      videoElement = document.createElement('div');

      // Remove <video> element (present in the DOM due to Chrome compatibility)
      videoWrapper.removeChild(videoWrapper.querySelector('video'));

      // Append videoElement to the videoWrapper before initializing the player
      videoWrapper.appendChild(videoElement);

      // Wait for YouTube IFrame Player API to load
      var playerCheckInterval = setInterval(function () {
        if (window.YT && YT.Player) {
          clearInterval(playerCheckInterval);
          var player = new YT.Player(videoElement, {
            width: '640',
            height: '360',
            videoId: videoId,
            playerVars: {
              autoplay: 1,
              controls: 0,
              start: startTime || undefined,
              end: endTime || undefined,
              mute: 1,
              rel: 0,
              showinfo: 0,
              modestbranding: 1,
              cc_load_policy: 0,
              iv_load_policy: 3,
              autohide: 0,
              loop: startTime || endTime ? 0 : videoLoop,
              // Disable native loop if startTime or endTime is set
              playlist: videoId
            },
            events: {
              onReady: function onReady(event) {
                // If videoLoop is enabled and startTime or endTime is set
                if (videoLoop && (startTime || endTime)) {
                  setInterval(function () {
                    // If the player is not buffering or unstarted
                    if ([YT.PlayerState.BUFFERING, YT.PlayerState.UNSTARTED].indexOf(player.getPlayerState()) === -1) {
                      // Prepare the flag to determine if the video needs to be restarted
                      var shouldRestart = false;
                      if (endTime) {
                        // If the current time is past the end time
                        shouldRestart = player.getCurrentTime() >= endTime;
                      }

                      // If the video needs to be restarted, seek to the start time
                      if (shouldRestart) {
                        player.seekTo(startTime || 0, true);
                      }
                    }
                  }, 100);
                }
              },
              onStateChange: function onStateChange(event) {
                if (videoLoop && !endTime && startTime) {
                  if (event.data === YT.PlayerState.ENDED) {
                    player.seekTo(startTime || 0, true);
                  }
                }
              }
            }
          });
        }
      }, 100);
    } else {
      // Get the video element (present in the DOM due to Chrome compatibility)
      videoElement = videoWrapper.querySelector('video');
    }
    if (videoScale) {
      videoElement.style.transform = "translate(-50%, -50%) scale(".concat(videoScale, ")");
    }

    // Frontend: Lazy load video
    if (bricksIsFrontend) {
      if (videoWrapper.classList.contains('bricks-lazy-video')) {
        new BricksIntersect({
          element: videoWrapper,
          callback: function callback(el) {
            el.classList.remove('bricks-lazy-video');
            if (isIframe) {
              el.appendChild(videoElement);
            } else {
              videoElement.src = videoUrl;
            }
          }
        });
      }
    } else {
      if (isIframe) {
        videoWrapper.appendChild(videoElement);
      } else {
        videoElement.src = videoUrl;
      }
    }
    videoWrapper.classList.add('loaded');
    var resizeObserver = new ResizeObserver(function (entries) {
      var _iterator4 = _createForOfIteratorHelper(entries),
        _step4;
      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var entry = _step4.value;
          var videoWidth = void 0;
          if (entry.contentBoxSize) {
            // Firefox implements `contentBoxSize` as a single content rect, rather than an array
            var contentBoxSize = Array.isArray(entry.contentBoxSize) ? entry.contentBoxSize[0] : entry.contentBoxSize;
            videoWidth = contentBoxSize.inlineSize;
          } else {
            videoWidth = entry.contentRect.width;
          }
          var elementHeight = videoWrapper.clientHeight;
          var videoHeight = videoWidth * videoAspectRatioY / videoAspectRatioX;
          if (videoHeight < elementHeight) {
            videoHeight = elementHeight;
            videoWidth = elementHeight * videoAspectRatioX / videoAspectRatioY;
          }
          videoElement.style.width = "".concat(videoWidth, "px");
          videoElement.style.height = "".concat(videoHeight, "px");
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
    });
    resizeObserver.observe(videoWrapper);
  }
});
function bricksBackgroundVideoInit() {
  bricksBackgroundVideoInitFn.run();
}

/**
 * Photoswipe 5 lightbox
 *
 * For accessibility reasons the <a> is required by default: https://photoswipe.com/getting-started/#required-html-markup
 * If you want to use different markup there is a domItemData filter: https://photoswipe.com/data-sources/#custom-html-markup
 *
 * @since 1.8
 */
var bricksPhotoswipeFn = new BricksFunction({
  parentNode: document,
  selector: '.bricks-lightbox',
  windowVariableCheck: ['PhotoSwipeLightbox'],
  eachElement: function eachElement(lightboxElement) {
    var gallery = lightboxElement;
    var children = lightboxElement.tagName === 'A' ? '' : 'a';
    var lightboxId = lightboxElement.getAttribute('data-pswp-id');

    // Can be set to 'none' to avoid jumpy animation between different aspect ratios (@since 1.8.4)
    var animationType = lightboxElement.getAttribute('data-animation-type') || 'zoom';

    // Get all lightbox elements with the same ID (@since 1.7.2)
    if (lightboxId) {
      children = bricksQuerySelectorAll(document, "[data-pswp-id=\"".concat(lightboxId, "\"]"));
    }

    // https://photoswipe.com/styling/
    var closeSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';
    var options = {
      mainClass: 'brx',
      // To distinguish from Photoswipe 4 (used on single product page by Woo core)
      gallery: gallery,
      counter: !gallery.classList.contains('brxe-carousel'),
      // Hide wrong carousel count for carousel loop (due to swiperJS-generated slide duplicates)
      children: children,
      pswpModule: PhotoSwipe5,
      closeSVG: closeSVG,
      showHideAnimationType: animationType
    };
    var lightbox = new PhotoSwipeLightbox(options);

    /**
     * Lightbox video (not supported in Photoswipe natively)
     *
     * Supported units: px, %, vw, vh
     *
     * Generate HTML for YouTube, Vimeo, and <video> embeds.
     *
     * https://photoswipe.com/data-sources/
     */
    lightbox.on('itemData', function (e) {
      var photoswipeInitialised = document.querySelector('.pswp__container');
      var videoUrl = lightboxElement.getAttribute('data-pswp-video-url');
      var width = lightboxElement.getAttribute('data-pswp-width');
      var height = lightboxElement.getAttribute('data-pswp-height');

      // width in '%' or 'vh'
      if (width && (width.includes('%') || width.includes('vw'))) {
        width = window.innerWidth * (parseInt(width) / 100);
      }

      // height in '%' or 'vw'
      if (height && (height.includes('%') || height.includes('vh'))) {
        height = window.innerHeight * (parseInt(height) / 100);
      }

      // Default width: 1280px
      if (!width) {
        width = 1280;
      }

      // Auto-height (16:9)
      if (!height || height == 720) {
        height = Math.round(width / 16 * 9);
      }
      if (!photoswipeInitialised && videoUrl) {
        var html = bricksGetLightboxVideoNode(videoUrl);
        e.itemData = {
          html: html.outerHTML,
          // Convert DOM node to HTML string
          width: width,
          height: height
        };
      }
    });

    // Content added to the DOM: Autoplay <video> after lightbox is opened
    lightbox.on('contentAppend', function (_ref) {
      var content = _ref.content;
      if (content.element) {
        var photoswipeVideo = content.element.querySelector('video');
        if (photoswipeVideo) {
          photoswipeVideo.play();
        }
      }
    });

    // Fix 'loop' type carousel element requires double clicks on last slide (due to swiperJS-generated slide duplicates)
    if (gallery.classList.contains('brxe-carousel')) {
      var _bricksData$swiperIns, _bricksData$swiperIns2;
      var swiperId = gallery.getAttribute('data-script-id');

      // Correct the number of items as swiperJS duplicates slides with 'loop' setting enabled
      if ((_bricksData$swiperIns = bricksData.swiperInstances) !== null && _bricksData$swiperIns !== void 0 && (_bricksData$swiperIns2 = _bricksData$swiperIns[swiperId]) !== null && _bricksData$swiperIns2 !== void 0 && _bricksData$swiperIns2.loopedSlides) {
        // https://photoswipe.com/filters/#numitems
        lightbox.addFilter('numItems', function (numItems, dataSource) {
          // Lightbox has no children: Return original numItems
          if (dataSource.gallery) {
            var duplicateSlides = 0;
            if (dataSource.gallery.classList.contains('brxe-carousel')) {
              // Carousel
              duplicateSlides = dataSource.gallery.querySelectorAll('.swiper-slide-duplicate').length;
            }
            // Something wrong if duplicateSlides more than original numItems, so return original numItems
            numItems = numItems > duplicateSlides ? numItems - duplicateSlides : numItems;
          }
          return numItems;
        });

        // Modify 'clickedIndex' as 'numItems' has been modified
        lightbox.addFilter('clickedIndex', function (clickedIndex, e) {
          var currentSlide = e.target.closest('.swiper-slide');
          if (currentSlide) {
            // Store all slides in an array
            var tempArr = bricksData.swiperInstances[swiperId].slides.map(function (slide, index) {
              return {
                slide: slide,
                index: index
              };
            }).filter(Boolean);
            if (tempArr.length) {
              // Current clicked swiper slide index from data-swiper-slide-index attribute
              var currentSwiperSlideIndex = parseInt(currentSlide.dataset.swiperSlideIndex);

              // Find first result whehre data-swiper-slide-index is equal to currentSlideIndex as numItems changed
              var simulateSlide = tempArr.filter(function (x) {
                return x.slide.dataset.swiperSlideIndex == currentSwiperSlideIndex;
              });
              if (simulateSlide.length) {
                // Get the index of the first result
                clickedIndex = simulateSlide[0].index;
              }
            }
          }
          return clickedIndex;
        });
      }
    }
    lightbox.init();
  }
});
function bricksPhotoswipe() {
  bricksPhotoswipeFn.run();
}

/**
 * Return iframe or video DOM node for lightbox video
 *
 * @param {string} videoUrl
 *
 * @returns iframe or video DOM node
 *
 * @since 1.7.2
 */
function bricksGetLightboxVideoNode(videoUrl) {
  if (videoUrl) {
    hasContent = true;
    var isIframe = false; // For YouTube and Vimeo embeds

    if (videoUrl.indexOf('youtube.com') !== -1) {
      isIframe = true;

      // Transform YouTube video URL into valid embed URL
      videoUrl = videoUrl.replace('watch?v=', 'embed/');
      videoUrl += '?autoplay=1';
      videoUrl += '&rel=0';
    }
    if (videoUrl.indexOf('vimeo.com') !== -1) {
      isIframe = true;

      // Transform Vimeo video URL into valid embed URL
      if (videoUrl.indexOf('player.vimeo.com/video') === -1) {
        videoUrl = videoUrl.replace('vimeo.com', 'player.vimeo.com/video');
      }
      videoUrl += '?autoplay=1';
    }
    if (isIframe) {
      // Create <iframe> for YouTube/Vimeo video
      var iframeElement = document.createElement('iframe');
      iframeElement.setAttribute('src', videoUrl);
      iframeElement.setAttribute('allow', 'autoplay');
      iframeElement.setAttribute('allowfullscreen', 1);
      return iframeElement;
    }

    // Create <video> element (trigger autoplay in Photoswipe)
    var videoElement = document.createElement('video');
    videoElement.setAttribute('src', videoUrl);
    videoElement.setAttribute('controls', 1);
    videoElement.setAttribute('playsinline', 1);
    return videoElement;
  }
}

/**
 * Element: Accordion
 */
var bricksAccordionFn = new BricksFunction({
  parentNode: document,
  selector: '.brxe-accordion, .brxe-accordion-nested',
  eachElement: function eachElement(accordion) {
    var slideUp = function slideUp(target) {
      var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 200;
      target.style.transitionProperty = 'height, margin, padding';
      target.style.transitionDuration = "".concat(duration, "ms");
      target.style.height = "".concat(target.offsetHeight, "px");
      target.offsetHeight;
      target.style.overflow = 'hidden';
      target.style.height = 0;
      target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
      target.style.marginBottom = 0;
      window.setTimeout(function () {
        target.style.display = 'none';
        target.style.removeProperty('height');
        target.style.removeProperty('padding-top');
        target.style.removeProperty('padding-bottom');
        target.style.removeProperty('margin-top');
        target.style.removeProperty('margin-bottom');
        target.style.removeProperty('overflow');
        target.style.removeProperty('transition-duration');
        target.style.removeProperty('transition-property');
      }, duration);
    };
    var slideDown = function slideDown(target) {
      var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 200;
      target.style.removeProperty('display');
      var display = window.getComputedStyle(target).display;
      if (display === 'none') {
        display = 'block';
      }
      target.style.display = display;
      var height = target.offsetHeight;
      target.style.overflow = 'hidden';
      target.style.height = 0;
      target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
      target.style.marginBottom = 0;
      target.offsetHeight;
      target.style.transitionProperty = 'height, margin, padding';
      target.style.transitionDuration = "".concat(duration, "ms");
      target.style.height = "".concat(height, "px");
      target.style.removeProperty('padding-top');
      target.style.removeProperty('padding-bottom');
      target.style.removeProperty('margin-top');
      target.style.removeProperty('margin-bottom');
      window.setTimeout(function () {
        target.style.removeProperty('height');
        target.style.removeProperty('overflow');
        target.style.removeProperty('transition-duration');
        target.style.removeProperty('transition-property');
      }, duration);
    };
    var slideToggle = function slideToggle(target) {
      var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 200;
      if (window.getComputedStyle(target).display === 'none') {
        return slideDown(target, duration);
      } else {
        return slideUp(target, duration);
      }
    };
    var items = Array.from(accordion.children);
    var duration = accordion.hasAttribute('data-transition') ? isNaN(accordion.dataset.transition) ? 0 : accordion.dataset.transition : 200;

    // Only recognise nestables as accordion items
    items = items.filter(function (item) {
      return item.classList.contains('brxe-section') || item.classList.contains('brxe-container') || item.classList.contains('brxe-block') || item.classList.contains('brxe-div') || item.classList.contains('accordion-item');
    });
    items.forEach(function (item, index) {
      var _accordion$dataset$sc;
      // Expand first item: Check data-script-args
      if (index === 0 && (_accordion$dataset$sc = accordion.dataset.scriptArgs) !== null && _accordion$dataset$sc !== void 0 && _accordion$dataset$sc.includes('expandFirstItem')) {
        item.classList.add('brx-open');
      }
      if (item.classList.contains('listening')) {
        return;
      }

      // Ensure click event listener is only added once
      item.classList.add('listening');

      /**
       * Init title click listener
       *
       * Listen on accordion item also allows to re-run script in builder without having to setup any custom destroy()
       */
      item.addEventListener('click', function (e) {
        var _accordion$dataset$sc2;
        var title = e.target.closest('.accordion-title-wrapper');
        if (!title) {
          return;
        }
        var item = title.parentNode;
        if (!item) {
          return;
        }
        var content = item.querySelector('.accordion-content-wrapper');
        if (!content) {
          return;
        }
        e.stopPropagation();

        // No independent toggle: slideUp .open item (if it's currently not open)
        if (!((_accordion$dataset$sc2 = accordion.dataset.scriptArgs) !== null && _accordion$dataset$sc2 !== void 0 && _accordion$dataset$sc2.includes('independentToggle'))) {
          var openItem = accordion.querySelector('.brx-open');
          if (openItem) {
            var openContent = openItem.querySelector('.accordion-content-wrapper');
            if (openContent && openContent !== content) {
              openItem.classList.remove('brx-open');
              slideUp(openContent, duration);
            }
          }
        }

        // slideToggle target accordion content
        slideToggle(content, duration);
        item.classList.toggle('brx-open');
      });
    });
  }
});
function bricksAccordion() {
  bricksAccordionFn.run();
}

/**
 * Element: Animated Typing
 */
var bricksAnimatedTypingFn = new BricksFunction({
  parentNode: document,
  selector: '.brxe-animated-typing',
  windowVariableCheck: ['Typed'],
  eachElement: function eachElement(element) {
    var scriptId = element.dataset.scriptId;
    var scriptArgs;
    try {
      scriptArgs = JSON.parse(element.dataset.scriptArgs);
    } catch (e) {
      return false;
    }
    var typedElement = element.querySelector('.typed');
    if (!typedElement) {
      return;
    }
    if (window.bricksData.animatedTypingInstances[scriptId]) {
      window.bricksData.animatedTypingInstances[scriptId].destroy();
    }
    if (!scriptArgs.hasOwnProperty('strings') || !scriptArgs.strings) {
      return;
    }
    if (Array.isArray(scriptArgs.strings) && !scriptArgs.strings.toString()) {
      return;
    }
    window.bricksData.animatedTypingInstances[scriptId] = new Typed(typedElement, scriptArgs);
  }
});
function bricksAnimatedTyping() {
  bricksAnimatedTypingFn.run();
}

/**
 * Element: Audio
 */
var bricksAudioFn = new BricksFunction({
  parentNode: document,
  selector: '.brxe-audio',
  windowVariableCheck: ['MediaElementPlayer'],
  eachElement: function eachElement(element) {
    var audioElement = element.querySelector('audio');
    if (audioElement) {
      var mediaElementPlayer = new MediaElementPlayer(audioElement);
    }
  }
});
function bricksAudio() {
  bricksAudioFn.run();
}

/**
 * Element: Countdown
 */
var bricksCountdownFn = new BricksFunction({
  parentNode: document,
  selector: '.brxe-countdown',
  eachElement: function eachElement(element) {
    // Countdown logic
    countdown = function countdown(element, settings, init) {
      // STEP: Get timezone from settings
      var timezoneSign = settings.timezone[3] === '+' ? 1 : -1;
      var timezoneHours = parseInt(settings.timezone.substring(4, 6));
      var timezoneMinutes = parseInt(settings.timezone.substring(7, 9));

      // Convert hours and minutes to minutes
      var countdownCreatorTimezone = timezoneSign * (timezoneHours * 60 + timezoneMinutes);

      // Convert timezone to milliseconds
      var countdownCreatorTimezoneMs = countdownCreatorTimezone * 60000;

      // Get timezone offset of visitor in minutes
      var viewerOffsetMinutes = new Date().getTimezoneOffset();

      // Convert to millisecond and flip the sign here because getTimezoneOffset() returns the offset with an opposite sign
      var viewerOffsetMs = -viewerOffsetMinutes * 60000;
      var date = settings.date.replace(' ', 'T'); // Replace needed for iOS Safari (NaN)

      // Get time of the target date in milliseconds
      var targetDate = new Date(date).getTime();

      // STEP: Adjust the target date for the visitors' timezone offset and the timezone setting offset
      var targetDateAdjusted = targetDate + viewerOffsetMs - countdownCreatorTimezoneMs;

      // Get current date and time in UTC milliseconds
      var now = new Date().getTime();

      // Calculate the difference in milliseconds
      var diff = targetDateAdjusted - now;

      // Countdown date reached
      if (diff <= 0) {
        // Stop countdown
        clearInterval(element.dataset.bricksCountdownId);
        if (settings.action === 'hide') {
          element.innerHTML = '';
          return;
        } else if (settings.action === 'text') {
          element.innerHTML = settings.actionText;
          return;
        }
      }

      // Add HTML nodes for each field (spans: .prefix, .format, .suffix)
      if (init) {
        // Builder: Remove HTML from previous instance
        element.innerHTML = '';
        settings.fields.forEach(function (field) {
          if (!field.format) {
            return;
          }
          var fieldNode = document.createElement('div');
          fieldNode.classList.add('field');
          if (field.prefix) {
            var prefixNode = document.createElement('span');
            prefixNode.classList.add('prefix');
            prefixNode.innerHTML = field.prefix;
            fieldNode.appendChild(prefixNode);
          }
          var formatNode = document.createElement('span');
          formatNode.classList.add('format');
          fieldNode.appendChild(formatNode);
          if (field.suffix) {
            var suffixNode = document.createElement('span');
            suffixNode.classList.add('suffix');
            suffixNode.innerHTML = field.suffix;
            fieldNode.appendChild(suffixNode);
          }
          element.appendChild(fieldNode);
        });
      }
      var fieldNodes = bricksQuerySelectorAll(element, '.field');
      var days = Math.floor(diff / (1000 * 60 * 60 * 24));
      var hours = Math.floor(diff % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
      var minutes = Math.floor(diff % (1000 * 60 * 60) / (1000 * 60));
      var seconds = Math.floor(diff % (1000 * 60) / 1000);
      settings.fields.forEach(function (field, index) {
        if (!field.format) {
          return;
        }
        var format = field.format.toLowerCase();

        // Add leading zero if format is uppercase & one digit (e.g. %D and value less than 10)

        // DAYS
        if (format.includes('%d')) {
          if (field.format.includes('%D')) {
            days <= 9 ? days = "0".concat(days) : days;
          }
          fieldNodes[index].querySelector('.format').innerHTML = format.replace('%d', diff <= 0 ? 0 : days);
        }

        // HOURS
        else if (format.includes('%h')) {
          if (field.format.includes('%H')) {
            hours <= 9 ? hours = "0".concat(hours) : hours;
          }
          fieldNodes[index].querySelector('.format').innerHTML = format.replace('%h', diff <= 0 ? 0 : hours);
        }

        // MINUTES
        else if (format.includes('%m')) {
          if (field.format.includes('%M')) {
            minutes <= 9 ? minutes = "0".concat(minutes) : minutes;
          }
          fieldNodes[index].querySelector('.format').innerHTML = format.replace('%m', diff <= 0 ? 0 : minutes);
        }

        // SECONDS
        else if (format.includes('%s')) {
          if (field.format.includes('%S')) {
            seconds <= 9 ? seconds = "0".concat(seconds) : seconds;
          }
          fieldNodes[index].querySelector('.format').innerHTML = format.replace('%s', diff <= 0 ? 0 : seconds);
        }
      });
    };
    var settings = element.dataset.bricksCountdownOptions;
    try {
      settings = JSON.parse(settings);
    } catch (e) {
      return false;
    }
    if (settings.hasOwnProperty('date') && settings.hasOwnProperty('fields')) {
      // Get existing countdownId
      var countdownId = element.dataset.bricksCountdownId;

      // Destroy existing instance by clearing the interval
      if (countdownId) {
        clearInterval(countdownId);
      }

      // Init countdown
      countdown(element, settings, true);

      // Call countdown every second (= 1000ms)
      countdownId = setInterval(countdown, 1000, element, settings, false);
      element.dataset.bricksCountdownId = countdownId;
    }
  }
});
function bricksCountdown() {
  bricksCountdownFn.run();
}

/**
 * Element: Counter
 * With custom run function, because we need to forceReinit only for counter inside popup
 */
var bricksCounterFn = new BricksFunction({
  parentNode: document,
  selector: '.brxe-counter',
  subscribeEvents: ['bricks/popup/open', 'bricks/ajax/pagination/completed', 'bricks/ajax/load_page/completed'],
  forceReinit: function forceReinit(element, index) {
    // Force reinit if counter is inside popup
    return element.closest('.brx-popup');
  },
  eachElement: function eachElement(element) {
    var settings = element.dataset.bricksCounterOptions;
    try {
      settings = JSON.parse(settings);
    } catch (e) {
      return false;
    }
    var countNode = element.querySelector('.count');
    var countFrom = settings.hasOwnProperty('countFrom') ? parseInt(settings.countFrom) : 0;
    var countTo = settings.hasOwnProperty('countTo') ? parseInt(settings.countTo) : 100;
    var durationInMs = settings.hasOwnProperty('duration') ? parseInt(settings.duration) : 1000;

    // Min. duration: 500ms
    if (durationInMs < 500) {
      durationInMs = 500;
    }
    var diff = countTo - countFrom;
    var timeout = durationInMs / diff;
    var incrementBy = 1;

    // Min. timeout: 4ms
    if (timeout < 4) {
      incrementBy = Math.ceil(4 / timeout);
      timeout = 4;
    }

    // Vanilla JS countUp function
    var countUp = function countUp() {
      // Get current count (locale string back to number)
      var count = countNode.innerText.replace(/\D/g, '');
      count = isNaN(count) ? countFrom : parseInt(count);

      // Calculate new count: Make sure we don't run over max. count
      var newCount = count + incrementBy < countTo ? count + incrementBy : countTo;

      // countTo reached yet: Stop interval
      if (count >= countTo) {
        clearInterval(countNode.dataset.counterId);
        delete countNode.dataset.counterId;
        return;
      }
      countNode.innerText = settings.thousands ? newCount.toLocaleString() : newCount;
    };
    var callback = function callback() {
      // Reset count
      countNode.innerText = countFrom;

      // Interval not yet running: Start interval
      if (countNode.dataset.counterId == undefined) {
        countNode.dataset.counterId = setInterval(countUp, timeout);
      }
    };

    // Run countUp() when popup is open (has no .hide class)
    var popup = countNode.closest('.brx-popup');
    if (popup) {
      if (!popup.classList.contains('hide')) {
        callback();
      }
    }

    // Run countUp() when element enters viewport
    else {
      new BricksIntersect({
        element: element,
        callback: callback
      });
    }
  },
  listenerHandler: function listenerHandler(event) {
    var _event$details;
    if (event !== null && event !== void 0 && event.type) {
      switch (event.type) {
        case 'bricks/popup/open':
          // Change parentNode to the opened popup
          var settings = {
            parentNode: (_event$details = event.details) !== null && _event$details !== void 0 && _event$details.popupElement ? event.details.popupElement : document
          };
          bricksCounterFn.run(settings);
          break;
        default:
          bricksCounterFn.run();
          break;
      }
    }
  }
});
function bricksCounter() {
  bricksCounterFn.run();
}

/**
 * Element: Form
 *
 * Init recaptcha explicit on Google reCAPTCHA callback.
 */
var bricksFormFn = new BricksFunction({
  parentNode: document,
  selector: '.brxe-form',
  eachElement: function eachElement(form) {
    var elementId = form.getAttribute('data-element-id');

    // Validate required checkboxes
    var checkboxes = bricksQuerySelectorAll(form, 'input[type="checkbox"]');
    checkboxes.forEach(function (checkbox) {
      if (checkbox.required) {
        checkbox.addEventListener('click', function (event) {
          var cbName = checkbox.getAttribute('name');
          var group = bricksQuerySelectorAll(form, "input[name=\"".concat(cbName, "\"]"));
          var atLeastOneChecked = false;
          group.forEach(function (item) {
            if (item.checked === true) {
              atLeastOneChecked = true;
            }
          });
          if (atLeastOneChecked) {
            group.forEach(function (item) {
              item.required = false;
            });
          } else {
            group.forEach(function (item) {
              item.required = true;
            });
          }
        });
      }
    });

    // Init datepicker
    var flatpickrElements = bricksQuerySelectorAll(form, '.flatpickr');
    flatpickrElements.forEach(function (flatpickrElement) {
      var flatpickrOptions = flatpickrElement.dataset.bricksDatepickerOptions;
      if (flatpickrOptions) {
        flatpickrOptions = JSON.parse(flatpickrOptions);

        // Disable native mobile date input as it looks different from all other fields
        // @since 1.7 (https://flatpickr.js.org/mobile-support/)
        flatpickrOptions.disableMobile = true;
        flatpickrOptions.onReady = function (a, b, fp) {
          var ariaLabel = fp.altInput.previousElementSibling ? fp.altInput.previousElementSibling.getAttribute('aria-label') : 'Date';
          fp.altInput.setAttribute('aria-label', ariaLabel || 'Date');
        };
        flatpickr(flatpickrElement, flatpickrOptions);
      }
    });

    // Init file input, to validate files on user selection
    var files = {};
    var fileInputInstances = bricksQuerySelectorAll(form, 'input[type=file]');
    fileInputInstances.forEach(function (input) {
      var inputRef = input.getAttribute('data-files-ref');
      var maxSize = input.getAttribute('data-maxsize') || false;
      var maxLength = input.getAttribute('data-limit') || false;
      maxSize = maxSize ? parseInt(maxSize) * 1024 * 1024 : false;
      input.addEventListener('change', function (e) {
        var fileList = e.target.files;
        var fileListLength = fileList.length;
        var inputName = input.getAttribute('name');
        if (!fileListLength) {
          return;
        }
        var fileResultEl = form.querySelector(".file-result[data-files-ref=\"".concat(inputRef, "\"]"));
        var _loop = function _loop() {
          var file = fileList[i];
          var error = false;

          // Populate upload HTML
          var resultEl = fileResultEl.cloneNode(true);

          // Erorro: Max. number of files exceeded
          if (maxLength && files.hasOwnProperty(inputName) && files[inputName].length >= maxLength) {
            error = 'limit';
          }

          // Error: File exceeds size limit
          if (maxSize && file.size > maxSize) {
            error = 'size';
          }
          if (error) {
            resultEl.classList.add('danger');
            resultEl.innerHTML = resultEl.getAttribute("data-error-".concat(error)).replace('%s', file.name);
            setTimeout(function () {
              resultEl.remove();
            }, 5000);
          }

          // Add file
          else {
            if (!files.hasOwnProperty(inputName)) {
              files[inputName] = [];
            }
            files[inputName].push(file);
            resultEl.classList.add('show');
            var resultText = resultEl.querySelector('.text');
            var resultRemove = resultEl.querySelector('.remove');
            resultText.innerHTML = file.name;
            resultRemove.setAttribute('data-name', file.name);
            resultRemove.setAttribute('data-field', inputName);

            // Remove file listener
            resultRemove.addEventListener('click', function (e) {
              var fileName = e.target.getAttribute('data-name');
              var fieldName = e.target.getAttribute('data-field');
              var fieldFiles = files[fieldName];
              for (var k = 0; k < fieldFiles.length; k++) {
                if (fieldFiles[k].name === fileName) {
                  files[inputName].splice(k, 1);
                  break;
                }
              }
              resultEl.remove();
            });
          }

          // Add result
          fileResultEl.parentNode.insertBefore(resultEl, fileResultEl.nextSibling);
        };
        for (var i = 0; i < fileListLength; i++) {
          _loop();
        }
      });
    });

    // Form submit
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!bricksIsFrontend) {
        return;
      }

      // Recaptcha
      var recaptchaElement = document.getElementById("recaptcha-".concat(elementId));
      var recaptchaErrorEl = form.querySelector('.recaptcha-error');
      if (!recaptchaElement) {
        bricksSubmitForm(elementId, form, files, null);
        return;
      }
      var recaptchaSiteKey = recaptchaElement.getAttribute('data-key');
      if (!recaptchaSiteKey) {
        recaptchaErrorEl.classList.add('show');
        return;
      }
      try {
        grecaptcha.ready(function () {
          try {
            grecaptcha.execute(recaptchaSiteKey, {
              action: 'bricks_form_submit'
            }).then(function (token) {
              recaptchaErrorEl.classList.remove('show');
              bricksSubmitForm(elementId, form, files, token);
            })["catch"](function (error) {
              recaptchaErrorEl.classList.add('show');
              form.querySelector('.alert').innerText = "Google reCaptcha ".concat(error);
            });
          } catch (error) {
            recaptchaErrorEl.classList.add('show');
            form.querySelector('.alert').innerText = "Google reCaptcha ".concat(error);
          }
        });
      } catch (error) {
        recaptchaErrorEl.classList.add('show');
        form.querySelector('.alert').innerText = "Google reCaptcha ".concat(error);
      }
    });
  }
});
function bricksForm() {
  bricksFormFn.run();
}
function bricksSubmitForm(elementId, form, files, recaptchaToken) {
  var submitButton = form.querySelector('button[type=submit]');
  submitButton.classList.add('sending');
  var formData = new FormData(form);
  formData.append('action', 'bricks_form_submit'); // Do not remove this
  formData.append('postId', window.bricksData.postId);
  formData.append('formId', elementId);
  formData.append('recaptchaToken', recaptchaToken || '');
  formData.append('nonce', window.bricksData.nonce);
  formData.append('referrer', location.toString());

  // Append files
  var _loop2 = function _loop2(inputName) {
    files[inputName].forEach(function (file) {
      formData.append("".concat(inputName, "[]"), file, file.name);
    });
  };
  for (var inputName in files) {
    _loop2(inputName);
  }
  var url = window.bricksData.ajaxUrl;
  var xhr = new XMLHttpRequest();
  xhr.open('POST', url, true);

  // Successful response
  xhr.onreadystatechange = function () {
    var _res$data, _res$data2, _res$data3, _res$data5, _res$data6;
    var getResponse = function getResponse(data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        return null;
      }
    };
    var res = getResponse(xhr.response);
    if (window.bricksData.debug) {
      console.warn('bricks_form_submit', xhr, res);
    }
    if (!res) {
      return;
    }

    // Google Tag Manager: Newsletter signup (action: 'mailchimp' or 'sendgrid')
    if (res.success && (((_res$data = res.data) === null || _res$data === void 0 ? void 0 : _res$data.action) === 'mailchimp' || ((_res$data2 = res.data) === null || _res$data2 === void 0 ? void 0 : _res$data2.action) === 'sendgrid')) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'bricksNewsletterSignup'
      });
    }

    // Check: Redirect after successful form submit
    if (res.success && (_res$data3 = res.data) !== null && _res$data3 !== void 0 && _res$data3.redirectTo) {
      var _res$data4;
      setTimeout(function () {
        window.location.href = res.data.redirectTo;
      }, parseInt((_res$data4 = res.data) === null || _res$data4 === void 0 ? void 0 : _res$data4.redirectTimeout) || 0);
    }

    // Generate form submit message HTML
    if (form.querySelector('.message')) {
      form.querySelector('.message').remove();
    }
    var messageEl = document.createElement('div');
    messageEl.classList.add('message');
    var messageText = document.createElement('div');
    messageText.classList.add('text');

    // Show form response message
    if ((_res$data5 = res.data) !== null && _res$data5 !== void 0 && _res$data5.message) {
      var _res$data$message;
      if ((_res$data$message = res.data.message) !== null && _res$data$message !== void 0 && _res$data$message.errors) {
        // User login/registration errors
        var errors = res.data.message.errors;
        var errorKeys = Object.keys(errors);
        errorKeys.forEach(function (errorKey) {
          messageText.innerHTML += errors[errorKey][0] + '<br>';
        });
      } else {
        messageText.innerHTML = res.data.message;
      }
    }
    messageEl.appendChild(messageText);
    if ((_res$data6 = res.data) !== null && _res$data6 !== void 0 && _res$data6.info) {
      var submitInfoInner = document.createElement('div');
      var submitInfoText = document.createElement('div');
      submitInfoText.innerHTML = res.data.info.join('<br>');
      messageEl.appendChild(submitInfoInner);
      submitInfoInner.appendChild(submitInfoText);
    } else {
      messageEl.classList.add(res.data.type);
    }
    form.appendChild(messageEl);
    submitButton.classList.remove('sending');

    // Clear form data
    if (res.success) {
      form.reset();
      files = {};
      var fileResults = bricksQuerySelectorAll(form, '.file-result');
      if (fileResults !== null) {
        fileResults.forEach(function (resultEl) {
          resultEl.remove();
        });
      }
    }
  };
  xhr.send(formData);
}

/**
 * IsotopeJS (Image Gallery & Posts)
 */
var bricksIsotopeFn = new BricksFunction({
  parentNode: document,
  selector: '.bricks-layout-wrapper.isotope',
  forceReinit: true,
  windowVariableCheck: ['Isotope'],
  eachElement: function eachElement(el) {
    var options = {
      itemSelector: '.bricks-layout-item',
      percentPosition: true
    };
    var layout = el.getAttribute('data-layout');
    if (layout === 'grid') {
      options.layoutMode = 'fitRows';
      options.fitRows = {
        gutter: '.bricks-gutter-sizer'
      };
    } else if (layout === 'masonry' || layout === 'metro') {
      options.masonry = {
        columnWidth: '.bricks-isotope-sizer',
        gutter: '.bricks-gutter-sizer'
      };
    }
    var isotopeInstance = new Isotope(el, options);

    // Isotope filtering (https://isotope.metafizzy.co/filtering.html)
    // TODO Make it work on grid & list layout as well (those don't have .isotope class)
    var filters = el.parentNode.querySelector('.bricks-isotope-filters');
    if (filters) {
      filters.addEventListener('click', function (e) {
        var filterValue = e.target.getAttribute('data-filter');
        var activeFilter = filters.querySelector('li.active');
        if (!filterValue || !bricksIsFrontend) {
          return;
        }
        if (activeFilter) {
          activeFilter.classList.remove('active');
        }
        e.target.classList.add('active');

        // Example: https://codepen.io/desandro/pen/BgcCD
        isotopeInstance.arrange({
          filter: filterValue
        });
      });
    }
  }
});
function bricksIsotope() {
  bricksIsotopeFn.run();
}

/**
 * Element: Map
 *
 * Init maps explicit on Google Maps callback.
 */
var bricksMapFn = new BricksFunction({
  parentNode: document,
  selector: '.brxe-map',
  eachElement: function eachElement(mapEl, index) {
    /**
     * Set 1000ms timeout to request next map (to avoid hitting query limits)
     *
     * https://developers.google.com/maps/premium/previous-licenses/articles/usage-limits)
     */
    setTimeout(function () {
      var settings = function () {
        var mapOptions = mapEl.dataset.bricksMapOptions;
        if (!mapOptions) {
          return false;
        }
        try {
          return JSON.parse(mapOptions);
        } catch (e) {
          return false;
        }
      }(mapEl);
      if (!settings) {
        return;
      }
      var addresses = Array.isArray(settings === null || settings === void 0 ? void 0 : settings.addresses) ? settings.addresses : [{
        address: 'Berlin, Germany'
      }];
      var markers = [];
      var markerDefault = {};

      // Custom marker
      if (settings !== null && settings !== void 0 && settings.marker) {
        markerDefault.icon = {
          url: settings.marker
        };
        if (settings !== null && settings !== void 0 && settings.markerHeight && settings !== null && settings !== void 0 && settings.markerWidth) {
          markerDefault.icon.scaledSize = new google.maps.Size(parseInt(settings.markerWidth), parseInt(settings.markerHeight));
        }
      }

      // Custom marker active
      var markerActive = {};
      if (settings !== null && settings !== void 0 && settings.markerActive) {
        markerActive = {
          url: settings.markerActive
        };
        if (settings !== null && settings !== void 0 && settings.markerActiveHeight && settings !== null && settings !== void 0 && settings.markerActiveWidth) {
          markerActive.scaledSize = new google.maps.Size(parseInt(settings.markerActiveWidth), parseInt(settings.markerActiveHeight));
        }
      }
      var infoBoxes = [];
      var bounds = new google.maps.LatLngBounds();

      // 'gestureHandling' combines 'scrollwheel' and 'draggable' (which are deprecated)
      var gestureHandling = 'auto';
      if (!settings.draggable) {
        gestureHandling = 'none';
      } else if (settings.scrollwheel && settings.draggable) {
        gestureHandling = 'cooperative';
      } else if (!settings.scrollwheel && settings.draggable) {
        gestureHandling = 'greedy';
      }
      if (settings.disableDefaultUI) {
        settings.fullscreenControl = false;
        settings.mapTypeControl = false;
        settings.streetViewControl = false;
        settings.zoomControl = false;
      }

      // https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions
      var zoom = settings.zoom ? parseInt(settings.zoom) : 12;
      var mapOptions = {
        zoom: zoom,
        // scrollwheel: settings.scrollwheel,
        // draggable: settings.draggable,
        gestureHandling: gestureHandling,
        fullscreenControl: settings.fullscreenControl,
        mapTypeControl: settings.mapTypeControl,
        streetViewControl: settings.streetViewControl,
        zoomControl: settings.zoomControl,
        disableDefaultUI: settings.disableDefaultUI
      };
      if (settings.zoomControl) {
        if (settings !== null && settings !== void 0 && settings.maxZoom) {
          mapOptions.maxZoom = parseInt(settings.maxZoom);
        }
        if (settings !== null && settings !== void 0 && settings.minZoom) {
          mapOptions.minZoom = parseInt(settings.minZoom);
        }
      }
      var map = new google.maps.Map(mapEl, mapOptions);

      // Loop through all addresses to set markers, infoBoxes, bounds etc.
      for (var i = 0; i < addresses.length; i++) {
        var addressObj = addresses[i];

        // Render marker with Latitude/Longitude
        if (addressObj !== null && addressObj !== void 0 && addressObj.latitude && addressObj !== null && addressObj !== void 0 && addressObj.longitude) {
          renderMapMarker(addressObj, {
            lat: parseFloat(addressObj.latitude),
            lng: parseFloat(addressObj.longitude)
          });
        }
        // Run Geocoding function to convert address into coordinates (use closure to pass additional variables)
        else if (addressObj !== null && addressObj !== void 0 && addressObj.address) {
          var geocoder = new google.maps.Geocoder();
          geocoder.geocode({
            address: addressObj.address
          }, geocodeCallback(addressObj));
        }
      }
      function geocodeCallback(addressObj) {
        var geocodeCallback = function geocodeCallback(results, status) {
          // Skip geocode response on error
          if (status !== 'OK') {
            console.warn('Geocode error:', status);
            return;
          }
          var position = results[0].geometry.location;
          renderMapMarker(addressObj, position);
        };
        return geocodeCallback;
      }
      function renderMapMarker(addressObj, position) {
        markerDefault.map = map;
        markerDefault.position = position;
        var marker = new google.maps.Marker(markerDefault);
        marker.setMap(map);
        markers.push(marker);
        google.maps.event.addListener(marker, 'click', function () {
          onMarkerClick(addressObj);
        });
        function onMarkerClick(addressObj) {
          var _markerActive;
          // First close all markers and infoBoxes
          if (markerDefault !== null && markerDefault !== void 0 && markerDefault.icon) {
            markers.forEach(function (marker) {
              marker.setIcon(markerDefault.icon);
            });
          }
          infoBoxes.forEach(function (infoBox) {
            infoBox.hide();
          });

          // Set custom active marker on marker click
          if ((_markerActive = markerActive) !== null && _markerActive !== void 0 && _markerActive.url) {
            marker.setIcon(markerActive);
          }

          // Open infoBox (better styleable than infoWindow) on marker click
          // http://htmlpreview.github.io/?http://github.com/googlemaps/v3-utility-library/blob/master/infobox/docs/reference.html
          var infoboxContent = '';
          var infoTitle = (addressObj === null || addressObj === void 0 ? void 0 : addressObj.infoTitle) || false;
          var infoSubtitle = (addressObj === null || addressObj === void 0 ? void 0 : addressObj.infoSubtitle) || false;
          var infoOpeningHours = (addressObj === null || addressObj === void 0 ? void 0 : addressObj.infoOpeningHours) || false;
          var infoImages = (addressObj === null || addressObj === void 0 ? void 0 : addressObj.infoImages) || {};
          if (!Array.isArray(infoImages)) {
            var _infoImages;
            infoImages = Array.isArray((_infoImages = infoImages) === null || _infoImages === void 0 ? void 0 : _infoImages.images) ? infoImages.images : [];
          }
          if (infoTitle) {
            infoboxContent += "<h3 class=\"title\">".concat(infoTitle, "</h3>");
          }
          if (infoSubtitle) {
            infoboxContent += "<p class=\"subtitle\">".concat(infoSubtitle, "</p>");
          }
          if (infoOpeningHours) {
            infoboxContent += '<ul class="content">';
            infoOpeningHours = infoOpeningHours.split('\n');
            if (infoOpeningHours.length) {
              infoOpeningHours.forEach(function (infoOpeningHour) {
                infoboxContent += "<li>".concat(infoOpeningHour, "</li>");
              });
            }
            infoboxContent += '</ul>';
          }
          if (infoImages.length) {
            infoboxContent += '<ul class="images bricks-lightbox">';
            infoImages.forEach(function (image) {
              infoboxContent += '<li>';
              if (image.thumbnail && image.src) {
                infoboxContent += "<a\n\t\t\t\t\t\t\t\t\tdata-pswp-src=\"".concat(image.src, "\"\n\t\t\t\t\t\t\t\t\tdata-pswp-width=\"").concat((image === null || image === void 0 ? void 0 : image.width) || 376, "\"\n\t\t\t\t\t\t\t\t\tdata-pswp-height=\"").concat((image === null || image === void 0 ? void 0 : image.height) || 376, "\"\n\t\t\t\t\t\t\t\t\tdata-pswp-id=\"").concat(addressObj.id, "\">");
                infoboxContent += "<img src=\"".concat(image.thumbnail, "\"/>");
                infoboxContent += '</a>';
              }
              infoboxContent += '</li>';
            });
            infoboxContent += '</ul>';
          }
          if (infoboxContent) {
            var infoBoxWidth = parseInt(addressObj === null || addressObj === void 0 ? void 0 : addressObj.infoWidth) || 300;
            var infoBoxOptions = {
              // minWidth: infoBoxWidth,
              // maxWidth: infoBoxWidth,
              content: infoboxContent,
              disableAutoPan: true,
              pixelOffset: new google.maps.Size(0, 0),
              alignBottom: false,
              infoBoxClearance: new google.maps.Size(20, 20),
              enableEventPropagation: false,
              zIndex: 1001,
              boxStyle: {
                opacity: 1,
                zIndex: 999,
                top: 0,
                left: 0,
                width: "".concat(infoBoxWidth, "px")
              }
            };
            if (typeof window.jQuery != 'undefined') {
              infoBoxOptions.closeBoxURL = '';
              infoBoxOptions.content += '<span class="close">×</span>';
            }
            var infoBox = new InfoBox(infoBoxOptions);
            infoBox.open(map, marker);
            infoBoxes.push(infoBox);

            // Center infoBox on map (small timeout required to allow infoBox to render)
            setTimeout(function () {
              var infoBoxHeight = infoBox.div_.offsetHeight;
              var projectedPosition = map.getProjection().fromLatLngToPoint(marker.getPosition());
              var infoBoxCenter = map.getProjection().fromPointToLatLng(new google.maps.Point(projectedPosition.x, projectedPosition.y - infoBoxHeight * getLongitudePerPixel() / 2));
              map.panTo(infoBoxCenter);
            }, 100);
            google.maps.event.addListener(infoBox, 'domready', function (e) {
              if (infoImages.length) {
                bricksPhotoswipe();
              }

              // Close infoBox icon listener
              if (typeof window.jQuery != 'undefined') {
                jQuery('.close').on('click', function () {
                  infoBox.close();
                  if (markerDefault !== null && markerDefault !== void 0 && markerDefault.icon) {
                    marker.setIcon(markerDefault.icon);
                  }
                  if (addresses.length > 1) {
                    bounds.extend(position);
                    map.fitBounds(bounds);
                    map.panToBounds(bounds);
                  }
                });
              }
            });
          }
        }

        // Get longitude per pixel based on current Zoom (for infoBox centering)
        function getLongitudePerPixel() {
          var latLng = map.getCenter();
          var zoom = map.getZoom();
          var pixelDistance = 1;
          var point1 = map.getProjection().fromLatLngToPoint(new google.maps.LatLng(latLng.lat() - pixelDistance / Math.pow(2, zoom), latLng.lng() - pixelDistance / Math.pow(2, zoom)));
          var point2 = map.getProjection().fromLatLngToPoint(new google.maps.LatLng(latLng.lat() + pixelDistance / Math.pow(2, zoom), latLng.lng() + pixelDistance / Math.pow(2, zoom)));
          return Math.abs(point2.x - point1.x);
        }
        bounds.extend(position);
        map.fitBounds(bounds);
        map.panToBounds(bounds);

        // var mapPosition = marker.getPosition()
        // map.setCenter(mapPosition)

        // Set zoom once map is idle: As fitBounds overrules zoom (since 1.5.1)
        if (addresses.length === 1) {
          var mapIdleListener = google.maps.event.addListener(map, 'idle', function () {
            map.setZoom(zoom);
            google.maps.event.removeListener(mapIdleListener);
          });
        }
      }

      // Set map type
      if (settings !== null && settings !== void 0 && settings.type) {
        map.setMapTypeId(settings.type);
      }

      // Set map style
      if (settings !== null && settings !== void 0 && settings.style) {
        // Custom map style
        if (settings.style === 'custom' && settings !== null && settings !== void 0 && settings.customStyle) {
          var mapStyle = JSON.stringify(settings.customStyle);
          map.setOptions({
            styles: JSON.parse(mapStyle)
          });
        }

        // Predefined map style
        else if (window.bricksData && window.bricksData.mapStyles[settings.style]) {
          map.setOptions({
            styles: JSON.parse(window.bricksData.mapStyles[settings.style].style)
          });
        }
      }
    }, index * 1000);
  }
});
function bricksMap() {
  bricksMapFn.run();
}

/**
 * Element: Pie Chart
 */
var bricksPieChartFn = new BricksFunction({
  parentNode: document,
  selector: '.brxe-pie-chart',
  windowVariableCheck: ['EasyPieChart'],
  eachElement: function eachElement(element) {
    new BricksIntersect({
      element: element,
      callback: function callback(el) {
        // HTMLCollection of canvas (grab first one)
        var canvas = el.getElementsByTagName('canvas');

        // Remove canvas first, before EasyPieChart init
        if (canvas.length) {
          canvas[0].remove();
        }
        new EasyPieChart(el, {
          size: el.dataset.size && el.dataset.size > 0 ? el.dataset.size : 160,
          lineWidth: el.dataset.lineWidth,
          barColor: el.dataset.barColor,
          trackColor: el.dataset.trackColor,
          lineCap: el.dataset.lineCap,
          scaleColor: el.dataset.scaleColor,
          scaleLength: el.dataset.scaleLength,
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

/**
 * Element: Pricing Tables (Pricing toggle)
 */
var bricksPricingTablesFn = new BricksFunction({
  parentNode: document,
  selector: '.brxe-pricing-tables',
  eachElement: function eachElement(element) {
    var tabs = bricksQuerySelectorAll(element, '.tab');
    var pricingTables = bricksQuerySelectorAll(element, '.pricing-table');
    tabs.forEach(function (tab) {
      if (tab.classList.contains('listening')) {
        return;
      }
      tab.classList.add('listening');
      tab.addEventListener('click', function () {
        // Return if selected tab is .active
        if (tab.classList.contains('active')) {
          return;
        }

        // Toggle pricing table .active
        pricingTables.forEach(function (pricingTable) {
          pricingTable.classList.toggle('active');
        });

        // Toggle .active tab
        tabs.forEach(function (tab) {
          tab.classList.remove('active');
        });
        tab.classList.add('active');
      });
    });
  }
});
function bricksPricingTables() {
  bricksPricingTablesFn.run();
}

/**
 * Element: Progress Bar (animate fill-up bar)
 */
var bricksProgressBarFn = new BricksFunction({
  parentNode: document,
  selector: '.brxe-progress-bar .bar span',
  eachElement: function eachElement(bar) {
    new BricksIntersect({
      element: bar,
      callback: function callback() {
        if (bar.dataset.width) {
          setTimeout(function () {
            bar.style.width = bar.dataset.width;
          }, 'slow');
        }
      },
      threshold: 1
    });
  }
});
function bricksProgressBar() {
  bricksProgressBarFn.run();
}

/**
 * SplideJS: For all nestable elements
 *
 * @since 1.5
 */
var bricksSplideFn = new BricksFunction({
  parentNode: document,
  selector: '.brxe-slider-nested.splide',
  windowVariableCheck: ['Splide'],
  forceReinit: function forceReinit(element, index) {
    // Allow Force reinit inside Builder (@since 1.8.2)
    return !bricksIsFrontend;
  },
  eachElement: function eachElement(splideElement) {
    // Add .splide__slide to individual slide (perfect for in/builder)
    var slides = bricksQuerySelectorAll(splideElement, ['.splide__list > .brxe-container', '.splide__list > .brxe-block', '.splide__list > .brxe-div']);
    slides.forEach(function (slide) {
      slide.classList.add('splide__slide');
      slide.dataset.id = slide.id;
    });
    var scriptId = splideElement.dataset.scriptId;

    // Destroy existing splideJS instance
    if (window.bricksData.splideInstances.hasOwnProperty(scriptId)) {
      window.bricksData.splideInstances[scriptId].destroy();
    }

    // Init & mount splideJS
    var splideInstance = new Splide(splideElement);

    // https://splidejs.com/guides/apis/#go
    splideInstance.mount();

    // Store splideJS instance in bricksData to destroy and re-init
    window.bricksData.splideInstances[scriptId] = splideInstance;

    // NOTE: To ensure Bricks element ID is used (important also for builder), and not the randomly by splide generated ID (see: slide.js:mount())
    // Improvement: Tweak CSS selector for 'bricksSplide' elements to use #parent.id > .{slide-class}
    slides.forEach(function (slide, index) {
      if (slide.dataset.id) {
        slide.id = slide.dataset.id;

        // Set 'aria-controls' value to slide.id
        var pagination = splideElement.querySelector('.splide__pagination');
        if (pagination) {
          var paginationButton = pagination.querySelector("li:nth-child(".concat(index + 1, ") .splide__pagination__page"));
          if (paginationButton) {
            paginationButton.setAttribute('aria-controls', slide.id);
          }
        }
      }

      // Get & set background-image added via lazy load through 'data-style' attribute inside query loop (@since 1.5)
      if (!slide.classList.contains('bricks-lazy-hidden')) {
        var style = slide.getAttribute('style') || '';
        if (slide.dataset.style) {
          style += slide.dataset.style;
          slide.setAttribute('style', style);
        }
      }
    });
  }
});
function bricksSplide() {
  bricksSplideFn.run();
}

/**
 * SwiperJS touch slider: Carousel, Slider, Testimonials
 */
var bricksSwiperFn = new BricksFunction({
  parentNode: document,
  selector: '.bricks-swiper-container',
  windowVariableCheck: ['Swiper'],
  forceReinit: function forceReinit(element, index) {
    // Allow Force reinit inside Builder (@since 1.8.2)
    return !bricksIsFrontend;
  },
  eachElement: function eachElement(swiperElement) {
    var scriptArgs;
    try {
      scriptArgs = JSON.parse(swiperElement.dataset.scriptArgs);
    } catch (e) {
      console.warn('bricksSwiper: Error parsing JSON of data-script-args', swiperElement);
      scriptArgs = {};
    }
    var element = swiperElement.classList.contains('[class*=brxe-]') ? swiperElement : swiperElement.closest('[class*=brxe-]');
    if (!element) {
      return;
    }

    // @since 1.5: Nestable elements: Add .swiper-slide to individual slide (perfect for in/builder)
    var slides = bricksQuerySelectorAll(swiperElement, ['.splide__list > .brxe-container', '.splide__list > .brxe-block', '.splide__list > .brxe-div']);
    slides.forEach(function (slide) {
      return slide.classList.add('swiper-slide');
    });
    var scriptId = element.dataset.scriptId;
    var swiperInstance = window.bricksData.swiperInstances.hasOwnProperty(scriptId) ? window.bricksData.swiperInstances[scriptId] : undefined;
    if (swiperInstance) {
      swiperInstance.destroy();
    }
    scriptArgs.observer = false; // Not working and not necessary (= set to false)
    scriptArgs.observeParents = true;
    scriptArgs.resizeObserver = true;

    // Defaults
    scriptArgs.slidesToShow = scriptArgs.hasOwnProperty('slidesToShow') ? scriptArgs.slidesToShow : 1;
    scriptArgs.slidesPerGroup = scriptArgs.hasOwnProperty('slidesPerGroup') ? scriptArgs.slidesPerGroup : 1;
    scriptArgs.speed = scriptArgs.hasOwnProperty('speed') ? parseInt(scriptArgs.speed) : 300;
    scriptArgs.effect = scriptArgs.hasOwnProperty('effect') ? scriptArgs.effect : 'slide';
    scriptArgs.spaceBetween = scriptArgs.hasOwnProperty('spaceBetween') ? scriptArgs.spaceBetween : 0;
    scriptArgs.initialSlide = scriptArgs.hasOwnProperty('initialSlide') ? scriptArgs.initialSlide : 0;

    // Enable keyboard control when in viewport (only on frontend as it messes with contenteditable in builder)
    scriptArgs.keyboard = {
      enabled: bricksIsFrontend,
      onlyInViewport: true
    };

    // Disabled & hide navigation buttons when there are not enough slides for sliding
    scriptArgs.watchOverflow = true;

    // Effect: Flip
    if (scriptArgs.hasOwnProperty('effect') && scriptArgs.effect === 'flip') {
      scriptArgs.flipEffect = {
        slideShadows: false
      };
    }

    // Set crossFade to true to avoid seeing content behind or underneath slide (https://swiperjs.com/swiper-api#fade-effect)
    if (scriptArgs.hasOwnProperty('effect') && scriptArgs.effect === 'fade') {
      scriptArgs.fadeEffect = {
        crossFade: true
      };
    }

    // Arrows
    if (scriptArgs.navigation) {
      scriptArgs.navigation = {
        prevEl: element.querySelector('.bricks-swiper-button-prev'),
        nextEl: element.querySelector('.bricks-swiper-button-next')
      };
    }

    // Dots
    if (scriptArgs.pagination) {
      scriptArgs.pagination = {
        el: element.querySelector('.swiper-pagination'),
        type: 'bullets',
        clickable: true
      };
      if (scriptArgs.dynamicBullets == true) {
        delete scriptArgs.dynamicBullets;
        scriptArgs.pagination.dynamicBullets = true;
        // scriptArgs.pagination.dynamicMainBullets = 1
      }
    }

    swiperInstance = new Swiper(swiperElement, scriptArgs);

    // Store swiper instance in bricksData to destroy and re-init
    window.bricksData.swiperInstances[scriptId] = swiperInstance;
  }
});
function bricksSwiper() {
  bricksSwiperFn.run();
}

/**
 * Element: Video (YouTube, Vimeo, File URL)
 */
var bricksVideoFn = new BricksFunction({
  parentNode: document,
  selector: '.brxe-video',
  eachElement: function eachElement(element) {
    // Remove overlay & icon
    if (bricksIsFrontend) {
      element.addEventListener('click', function () {
        var videoOverlay = element.querySelector('.bricks-video-overlay');
        var videoOverlayIcon = element.querySelector('.bricks-video-overlay-icon');
        if (videoOverlay) {
          videoOverlay.remove();
        }
        if (videoOverlayIcon) {
          videoOverlayIcon.remove();
        }
      });
    }

    // 'video' HTML (videoType: media, file, meta)
    var videoElement = element.querySelector('video');
    if (!videoElement) {
      return;
    }

    // Init custom HTML5 <video> player (https://plyr.io)
    if (window.hasOwnProperty('Plyr')) {
      var _window$bricksData, _window$bricksData$vi;
      var elementId = element.dataset.scriptId;
      var video = element.querySelector('.bricks-plyr');
      var player = ((_window$bricksData = window.bricksData) === null || _window$bricksData === void 0 ? void 0 : (_window$bricksData$vi = _window$bricksData.videoInstances) === null || _window$bricksData$vi === void 0 ? void 0 : _window$bricksData$vi[elementId]) || undefined;
      if (player) {
        player.destroy();
      }
      if (video) {
        // 'autoplay' only runs if video is 'muted'
        player = new Plyr(video);
      }
      window.bricksData.videoInstances[elementId] = player;
    }

    // Necessary for autoplaying in iOS (https://webkit.org/blog/6784/new-video-policies-for-ios/)
    videoElement.setAttribute('playsinline', true);
  }
});
function bricksVideo() {
  bricksVideoFn.run();
}

/**
 * Load Facebook SDK & render Facebook widgets
 *
 * https://developers.facebook.com/docs/javascript/reference/FB.init/v3.3
 *
 * @since 1.4 Use XMLHttpRequest instead of jquery.ajax()
 */

function bricksFacebookSDK() {
  // Return: Page has no Facebook Page element
  var facebookPageElement = document.querySelector('.brxe-facebook-page');
  if (!facebookPageElement) {
    return;
  }
  var locale = window.bricksData.hasOwnProperty('locale') ? window.bricksData.locale : 'en_US';
  var facebookAppId = window.bricksData.hasOwnProperty('facebookAppId') ? window.bricksData.facebookAppId : null;
  var facebookSdkUrl = "https://connect.facebook.net/".concat(locale, "/sdk.js");
  var xhr = new XMLHttpRequest();
  xhr.open('GET', facebookSdkUrl);

  // Successful response: Create & add FB script to DOM and run function to generate Facebook Page HTML
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var fbScript = document.createElement('script');
      fbScript.type = 'text/javascript';
      fbScript.id = 'bricks-facebook-page-sdk';
      fbScript.appendChild(document.createTextNode(xhr.responseText));
      document.body.appendChild(fbScript);
      FB.init({
        appId: facebookAppId,
        version: 'v3.3',
        xfbml: true // render
      });
    }
  };

  xhr.send();
}

/**
 * Prettify <pre> and <code> HTML tags
 *
 * https://github.com/googlearchive/code-prettify
 */
var bricksPrettifyFn = new BricksFunction({
  parentNode: document,
  selector: '.prettyprint.prettyprinted',
  run: function run() {
    if (!window.hasOwnProperty('PR')) {
      return;
    }
    PR.prettyPrint();

    // Builder: Re-init prettify
    var prettyprinted = bricksQuerySelectorAll(document, '.prettyprint.prettyprinted');
    if (!bricksIsFrontend && prettyprinted.length) {
      prettyprinted.forEach(function (prettyprint) {
        prettyprint.classList.remove('prettyprinted');
        PR.prettyPrint();
      });
    }
  }
});
function bricksPrettify() {
  bricksPrettifyFn.run();
}

/**
 * Improve a11y keyboard navigation by making sure after skipping to the content, the next tab hit continues down the content
 *
 * https://axesslab.com/skip-links/
 */
function bricksSkipLinks() {
  var skipLinks = bricksQuerySelectorAll(document, '.skip-link');
  if (!skipLinks) {
    return;
  }
  skipLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var toElement = document.getElementById(link.href.split('#')[1]);
      if (toElement) {
        toElement.setAttribute('tabindex', '-1');
        toElement.addEventListener('blur', function () {
          toElement.removeAttribute('tabindex');
        }, {
          once: true
        });
        toElement.focus();
      }
    });
  });
}

/**
 * Bind element interactions to elements (frontend only)
 *
 * @since 1.6
 */
var bricksInteractionsFn = new BricksFunction({
  parentNode: document,
  selector: '[data-interactions]',
  frontEndOnly: true,
  eachElement: function eachElement(sourceEl) {
    var _sourceEl$dataset;
    var interactions = [];
    try {
      interactions = JSON.parse(sourceEl.dataset.interactions);
    } catch (e) {
      console.info('error:bricksInteractions', e);
      return false;
    }
    var interactionGroupId = ((_sourceEl$dataset = sourceEl.dataset) === null || _sourceEl$dataset === void 0 ? void 0 : _sourceEl$dataset.interactionId) || false;
    if (!interactions || !interactionGroupId) {
      return;
    }
    interactions.forEach(function (interaction) {
      var _window$bricksData2;
      var bindToDocument = false;
      if (!(interaction !== null && interaction !== void 0 && interaction.trigger)) {
        return;
      }

      // trigger: 'click', 'mouseover', 'scroll', etc.
      if (interaction.trigger === 'scroll') {
        var scrollOffset = 0;
        if (interaction !== null && interaction !== void 0 && interaction.scrollOffset) {
          scrollOffset = interaction === null || interaction === void 0 ? void 0 : interaction.scrollOffset.replace('px', '');
          if (scrollOffset.includes('%')) {
            var documentHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight);
            scrollOffset = documentHeight / 100 * parseInt(scrollOffset);
          } else if (scrollOffset.includes('vh')) {
            scrollOffset = window.innerHeight / 100 * parseInt(scrollOffset);
          }
        }
        interaction.scrollOffset = scrollOffset;
      } else if (interaction.trigger === 'mouseleaveWindow') {
        interaction.trigger = 'mouseleave';
        bindToDocument = true;
      }

      // 'loadMore': Check if query trail exist. If not: remove the "Load More" element
      if (interaction.action === 'loadMore') {
        var _window$bricksData$qu2;
        var queryId = interaction === null || interaction === void 0 ? void 0 : interaction.loadMoreQuery;
        if (!((_window$bricksData$qu2 = window.bricksData.queryLoopInstances) !== null && _window$bricksData$qu2 !== void 0 && _window$bricksData$qu2[queryId])) {
          // Hide the element (@since 1.8.2), previously it was removed
          sourceEl.style.display = 'none';
        }
      }

      // Return: No more sourceEl
      if (!sourceEl) {
        return;
      }

      // STEP: store the source element
      interaction.el = sourceEl;

      // STEP: Interaction group Id
      interaction.groupId = bindToDocument ? 'document' : interactionGroupId;

      // STEP: Store interaction
      if (!((_window$bricksData2 = window.bricksData) !== null && _window$bricksData2 !== void 0 && _window$bricksData2.interactions)) {
        window.bricksData.interactions = [];
      }
      window.bricksData.interactions.push(interaction);

      // STEP: Create interaction event listeners
      switch (interaction.trigger) {
        case 'click':
        case 'mouseover':
        case 'mouseenter':
        case 'mouseleave':
        case 'focus':
        case 'blur':
          var attachEl = bindToDocument ? document.documentElement : sourceEl;
          attachEl.addEventListener(interaction.trigger, bricksInteractionCallback, {
            once: interaction === null || interaction === void 0 ? void 0 : interaction.runOnce
          });
          break;

        // @since 1.8.4
        case 'animationEnd':
          var targetAnimationId = (interaction === null || interaction === void 0 ? void 0 : interaction.animationId) || false;

          // Target animation not set: Find last previous animation interaction (action is 'startAnimation'), and must be in the same interaction group
          if (!targetAnimationId) {
            var previousInteraction = window.bricksData.interactions.filter(function (_int) {
              return _int.groupId === interactionGroupId && _int.action === 'startAnimation' && _int.id !== interaction.id;
            });
            if (previousInteraction.length) {
              targetAnimationId = previousInteraction[previousInteraction.length - 1].id;
            }
          }

          // @since 1.8.4 - Listen to `bricks/animation/end/${animationId}`
          if (targetAnimationId && targetAnimationId !== interaction.id) {
            document.addEventListener("bricks/animation/end/".concat(targetAnimationId), function (evt) {
              bricksInteractionCallbackExecution(sourceEl, interaction);
            }, {
              once: interaction === null || interaction === void 0 ? void 0 : interaction.runOnce
            });
          }
          break;
        case 'contentLoaded':
          var delay = (interaction === null || interaction === void 0 ? void 0 : interaction.delay) || 0;
          if (delay && delay.includes('ms')) {
            delay = parseInt(delay);
          } else if (delay && delay.includes('s')) {
            delay = parseFloat(delay) * 1000;
          }
          setTimeout(function () {
            bricksInteractionCallbackExecution(sourceEl, interaction);
          }, delay);
          break;
        case 'enterView':
          new BricksIntersect({
            element: sourceEl,
            callback: function callback(sourceEl) {
              return bricksInteractionCallbackExecution(sourceEl, interaction);
            },
            once: interaction === null || interaction === void 0 ? void 0 : interaction.runOnce,
            trigger: interaction === null || interaction === void 0 ? void 0 : interaction.trigger
          });
          break;

        /**
         * Don't use rootMargin
         *
         * Because if element has enterView & leaveView interactions, the leaveView will be ignored when scrolling up
         *
         * @see #38ve0he
         *
         * @since 1.6.2
         */
        case 'leaveView':
          new BricksIntersect({
            element: sourceEl,
            callback: function callback(sourceEl) {
              return bricksInteractionCallbackExecution(sourceEl, interaction);
            },
            once: interaction === null || interaction === void 0 ? void 0 : interaction.runOnce,
            trigger: interaction === null || interaction === void 0 ? void 0 : interaction.trigger
          });
          break;

        /**
         * Show/Hide popup trigger
         * @since 1.8.2
         */
        case 'showPopup':
        case 'hidePopup':
          var listenEvent = interaction.trigger === 'showPopup' ? 'bricks/popup/open' : 'bricks/popup/close';
          document.addEventListener(listenEvent, function (event) {
            var _event$detail;
            var popupElement = ((_event$detail = event.detail) === null || _event$detail === void 0 ? void 0 : _event$detail.popupElement) || false;

            // Only run if this popup is the sourceEl
            if (!popupElement || popupElement !== sourceEl) {
              return;
            }

            // STEP: Handle runOnce - As we are listening to a specific popup event, we cannot set once: true on addEventListener

            // Get interaction from window.bricksData.interactions
            var interactionIndex = window.bricksData.interactions.findIndex(function (interactionPool) {
              return interactionPool === interaction;
            });

            // If interactionIndex is not found, return
            if (interactionIndex === -1) {
              return;
            }

            // Remove interaction from window.bricksData.interactions after running the callback
            if (interaction !== null && interaction !== void 0 && interaction.runOnce) {
              window.bricksData.interactions.splice(interactionIndex, 1);
            }

            // STEP: Execute callback
            bricksInteractionCallbackExecution(sourceEl, interaction);
          });
          break;
      }
    });
  }
});
function bricksInteractions() {
  bricksInteractionsFn.run();
}

/**
 * Popups
 *
 * @since 1.6
 */
function bricksPopups() {
  /**
   * Store popup elements that are already listening to close event (click popup overlay or ESC key)
   *
   * To prevent multiple initialization for the same popup
   *
   * Not used anymore as the event registered but not removed, we should remove the event listener when popup is closed (@since 1.8.4)
   */
  // window.bricksPopupsData = {
  // 	initialized: []
  // }

  /**
   * Popup Focus Trap
   *
   * @since 1.8.4
   */
  var popupFocusTrap = function popupFocusTrap(event, popupElement) {
    if (event.key === 'Tab') {
      event.preventDefault();
      var focusableElements = bricksGetFocusables(popupElement);
      if (!focusableElements.length) {
        return;
      }
      var focusedIndex = focusableElements.indexOf(document.activeElement);
      var nextIndex = event.shiftKey ? focusedIndex - 1 : focusedIndex + 1;
      var nextElement = focusableElements[nextIndex];
      if (nextElement) {
        nextElement.focus();
      } else {
        focusableElements[0].focus();
      }
    }
  };
  var escClosePopup = function escClosePopup(event, popupElement) {
    if (event.key === 'Escape') {
      bricksClosePopup(popupElement);
    }
  };
  var backdropClosePopup = function backdropClosePopup(event, popupElement) {
    if (event.target.classList.contains('brx-popup-backdrop')) {
      bricksClosePopup(popupElement);
    }
  };

  /**
   * Listen to document bricks/popup/open event
   *
   * event.detail.popupElement: Popup element
   * event.detail.popupId: Popup id
   *
   * @since 1.7.1
   */
  document.addEventListener('bricks/popup/open', function (event) {
    var _event$detail2;
    // STEP: Get popup element
    var popupElement = ((_event$detail2 = event.detail) === null || _event$detail2 === void 0 ? void 0 : _event$detail2.popupElement) || false;
    if (!popupElement) {
      return;
    }
    if (bricksIsFrontend) {
      var _popupElement$dataset, _popupElement$dataset2, _popupElement$dataset3;
      // STEP: Autofocus on first focusable element inside popup (@since 1.8.4)
      if (!((_popupElement$dataset = popupElement.dataset) !== null && _popupElement$dataset !== void 0 && _popupElement$dataset.popupDisableAutoFocus)) {
        var focusableElements = bricksGetFocusables(popupElement);
        if (focusableElements.length) {
          focusableElements[0].focus();
        }
      }

      // STEP: Scroll to top of popup content (@since 1.8.4)
      if ((_popupElement$dataset2 = popupElement.dataset) !== null && _popupElement$dataset2 !== void 0 && _popupElement$dataset2.popupScrollToTop) {
        var _popupElement$querySe;
        (_popupElement$querySe = popupElement.querySelector('.brx-popup-content')) === null || _popupElement$querySe === void 0 ? void 0 : _popupElement$querySe.scrollTo(0, 0);
      }

      // STEP: Add focus trap - Not allowing to tab outside popup
      var focusTrapEventHandler = function focusTrapEventHandler(event) {
        return popupFocusTrap(event, popupElement);
      };
      document.addEventListener('keydown', focusTrapEventHandler);

      // Remove the focus trap event listener when popup is closed
      document.addEventListener('bricks/popup/close', function () {
        document.removeEventListener('keydown', focusTrapEventHandler);
      });

      // STEP: Add close event listeners for popup
      var popupCloseOn = ((_popupElement$dataset3 = popupElement.dataset) === null || _popupElement$dataset3 === void 0 ? void 0 : _popupElement$dataset3.popupCloseOn) || 'backdrop-esc';
      if (popupCloseOn.includes('esc')) {
        // STEP: Listen for ESC key pressed to close popup
        var escEventHandler = function escEventHandler(event) {
          return escClosePopup(event, popupElement);
        };
        document.addEventListener('keyup', escEventHandler);

        // Remove the ESC event listener when popup is closed
        document.addEventListener('bricks/popup/close', function () {
          document.removeEventListener('keyup', escEventHandler);
        });
      }
      if (popupCloseOn.includes('backdrop')) {
        // STEP: Listen for click outside popup to close popup
        var backdropEventHandler = function backdropEventHandler(event) {
          return backdropClosePopup(event, popupElement);
        };
        document.addEventListener('click', backdropEventHandler);

        // Remove the backdrop event listener when popup is closed
        document.addEventListener('bricks/popup/close', function () {
          document.removeEventListener('click', backdropEventHandler);
        });
      }
    }
  });
}

/**
 * Scroll interaction listener (debounce: 100ms)
 *
 * @since 1.6
 */
function bricksScrollInteractions() {
  clearTimeout(bricksScrollTimeout);
  bricksScrollTimeout = setTimeout(function () {
    var _window$bricksData3;
    // Get scroll interactions anew on every scroll (new interactions could have been added via AJAX pagination or infinite scroll)
    var interactions = Array.isArray((_window$bricksData3 = window.bricksData) === null || _window$bricksData3 === void 0 ? void 0 : _window$bricksData3.interactions) ? window.bricksData.interactions : [];
    var scrolled = window.scrollY;
    var runOnceIndexToRemove = [];
    interactions.forEach(function (interaction, index) {
      // Skip non-scroll interactions
      if ((interaction === null || interaction === void 0 ? void 0 : interaction.trigger) !== 'scroll') {
        return;
      }
      if (scrolled >= interaction.scrollOffset) {
        bricksInteractionCallbackExecution(interaction.el, interaction);
        if (interaction !== null && interaction !== void 0 && interaction.runOnce) {
          runOnceIndexToRemove.push(index);
        }
      }
    });

    // Remove interaction from window.bricksData.interactions after looping over all interactions (@since 1.8.1)
    runOnceIndexToRemove.forEach(function (indexToRemove) {
      window.bricksData.interactions.splice(indexToRemove, 1);
    });
  }, 100);
}

/**
 * Interactions callback
 *
 * @since 1.6
 */
function bricksInteractionCallback(event) {
  var _event$currentTarget, _event$currentTarget$;
  // Possible improvement: Add "Don't add e.preventDefault() to clikc interaction"
  if ((event === null || event === void 0 ? void 0 : event.type) === 'click') {
    var _event$target$getAttr;
    // Return: Don't run interaction when clicking on an anchor link (except for # itself)
    if (event.target.tagName === 'A' && event.target.getAttribute('href') !== '#' && (_event$target$getAttr = event.target.getAttribute('href')) !== null && _event$target$getAttr !== void 0 && _event$target$getAttr.startsWith('#')) {
      return;
    }
    event.preventDefault();
  }
  var interactionGroupId = (event === null || event === void 0 ? void 0 : (_event$currentTarget = event.currentTarget) === null || _event$currentTarget === void 0 ? void 0 : (_event$currentTarget$ = _event$currentTarget.dataset) === null || _event$currentTarget$ === void 0 ? void 0 : _event$currentTarget$.interactionId) || 'document';
  window.bricksData.interactions.filter(function (interaction) {
    return interaction.groupId === interactionGroupId;
  }).forEach(function (interaction) {
    if ((interaction === null || interaction === void 0 ? void 0 : interaction.trigger) === event.type) {
      bricksInteractionCallbackExecution(interaction.el, interaction);
    }
  });
}

/**
 * Interaction action execution
 *
 * @since 1.6
 */
function bricksInteractionCallbackExecution(sourceEl, config) {
  var _window$bricksData$qu3, _document$querySelect;
  var targetMode = (config === null || config === void 0 ? void 0 : config.target) || 'self';
  var target;

  // Return: Interaction condition not fulfilled
  if (!bricksInteractionCheckConditions(config)) {
    return;
  }
  switch (targetMode) {
    case 'custom':
      if (config !== null && config !== void 0 && config.targetSelector) {
        target = bricksQuerySelectorAll(document, config.targetSelector);
      }
      break;
    case 'popup':
      if (config !== null && config !== void 0 && config.templateId) {
        var _sourceEl$dataset2;
        // Target looping popup by matching data-interaction-loop-id with data-popup-loop-id (@since 1.8.4)
        var uniqueId = ((_sourceEl$dataset2 = sourceEl.dataset) === null || _sourceEl$dataset2 === void 0 ? void 0 : _sourceEl$dataset2.interactionLoopId) || false;
        if (uniqueId) {
          target = bricksQuerySelectorAll(document, ".brx-popup[data-popup-loop-id=\"".concat(uniqueId, "\"]"));
        }

        // If no popup found, try to find popup by data-popup-id
        if (!target || !target.length) {
          target = bricksQuerySelectorAll(document, ".brx-popup[data-popup-id=\"".concat(config.templateId, "\"]"));
        }
      }
      break;
    default:
      target = sourceEl;
    // = self
  }

  if (!target) {
    return;
  }
  target = Array.isArray(target) ? target : [target];
  switch (config === null || config === void 0 ? void 0 : config.action) {
    case 'show':
    case 'hide':
      target.forEach(function (el) {
        // Popup
        if (el !== null && el !== void 0 && el.classList.contains('brx-popup')) {
          if (config.action === 'show') {
            bricksOpenPopup(el);
          } else if (config.action === 'hide') {
            bricksClosePopup(el);
          }
        }

        // Regular element
        else {
          // Hide
          if (config.action === 'hide') {
            el.style.display = 'none';
          }

          // Show (remove display: none & only set display: block as a fallback)
          else {
            if (el.style.display === 'none') {
              el.style.display = null;
            } else {
              el.style.display = 'block';
            }
          }
        }
      });
      break;
    case 'setAttribute':
    case 'removeAttribute':
    case 'toggleAttribute':
      var attributeKey = config === null || config === void 0 ? void 0 : config.actionAttributeKey;
      if (attributeKey) {
        target.forEach(function (el) {
          var attributeValue = (config === null || config === void 0 ? void 0 : config.actionAttributeValue) || '';

          // Attribute 'class'
          if (attributeKey === 'class') {
            var classNames = attributeValue ? attributeValue.split(' ') : [];
            classNames.forEach(function (className) {
              if (config.action === 'setAttribute') {
                el.classList.add(className);
              } else if (config.action === 'removeAttribute') {
                el.classList.remove(className);
              } else {
                el.classList.toggle(className);
              }
            });
          }

          // All other attributes
          else {
            if (config.action === 'setAttribute') {
              el.setAttribute(attributeKey, attributeValue);
            } else if (config.action === 'removeAttribute') {
              el.removeAttribute(attributeKey);
            } else {
              // Toggle attribute
              if (el.hasAttribute(attributeKey)) {
                el.removeAttribute(attributeKey);
              } else {
                el.setAttribute(attributeKey, attributeValue);
              }
            }
          }
        });
      }
      break;
    case 'storageAdd':
    case 'storageRemove':
    case 'storageCount':
      var storageType = config === null || config === void 0 ? void 0 : config.storageType;
      var storageKey = config === null || config === void 0 ? void 0 : config.actionAttributeKey;
      var storageValue = config.hasOwnProperty('actionAttributeValue') ? config.actionAttributeValue : 0;
      if (storageType && storageKey) {
        if (config.action === 'storageAdd') {
          bricksStorageSetItem(storageType, storageKey, storageValue);
        } else if (config.action === 'storageRemove') {
          bricksStorageRemoveItem(storageType, storageKey);
        } else if (config.action === 'storageCount') {
          var counter = bricksStorageGetItem(storageType, storageKey);
          counter = counter ? parseInt(counter) : 0;
          bricksStorageSetItem(storageType, storageKey, counter + 1);
        }
      }
      break;
    case 'startAnimation':
      var animationType = config === null || config === void 0 ? void 0 : config.animationType;
      if (animationType) {
        target.forEach(function (el) {
          var _el;
          // Default animation duration: 1s
          var removeAnimationAfterMs = 1000;
          var isPopup = (_el = el) === null || _el === void 0 ? void 0 : _el.classList.contains('brx-popup');

          // Apply animation to popup content (@since 1.8)
          if (isPopup) {
            el = el.querySelector('.brx-popup-content');
          }

          // Get custom animation-duration
          if (config !== null && config !== void 0 && config.animationDuration) {
            el.style.animationDuration = config.animationDuration;
            if (config.animationDuration.includes('ms')) {
              removeAnimationAfterMs = parseInt(config.animationDuration);
            } else if (config.animationDuration.includes('s')) {
              removeAnimationAfterMs = parseFloat(config.animationDuration) * 1000;
            }
          }

          // Get custom animation-delay
          if (config !== null && config !== void 0 && config.animationDelay) {
            el.style.animationDelay = config.animationDelay;
            if (config.animationDelay.includes('ms')) {
              removeAnimationAfterMs += parseInt(config.animationDelay);
            } else if (config.animationDelay.includes('s')) {
              removeAnimationAfterMs += parseFloat(config.animationDelay) * 1000;
            }
          }

          // Animate popup (@since 1.7 - Popup use removeAnimationAfterMs for setTimeout duration)
          if (isPopup) {
            var popupNode = el.parentNode; // el = .brx-popup-content
            // Avoid recursive error (@since 1.8.4)
            if (popupNode !== sourceEl) {
              // Animate: open popup (if animationType includes 'In')
              if (animationType.includes('In')) {
                bricksOpenPopup(popupNode, removeAnimationAfterMs);
              }
            }
          }
          el.classList.add('brx-animated');
          el.setAttribute('data-animation', animationType);
          el.setAttribute('data-interaction-id', config.id || '');

          // Remove animation class after animation duration + delay to run again
          bricksAnimationFn.run({
            elementsToAnimate: [el],
            removeAfterMs: removeAnimationAfterMs
          });
        });
      }
      break;
    case 'loadMore':
      var queryId = config === null || config === void 0 ? void 0 : config.loadMoreQuery;
      var queryConfig = (_window$bricksData$qu3 = window.bricksData.queryLoopInstances) === null || _window$bricksData$qu3 === void 0 ? void 0 : _window$bricksData$qu3[queryId];
      if (!queryConfig) {
        return;
      }

      // @since 1.7.1 - exclude popup from query trail
      var queryTrail = queryConfig.isPostsElement ? (_document$querySelect = document.querySelector(".bricks-isotope-sizer[data-query-element-id=\"".concat(queryId, "\"]"))) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.previousElementSibling : Array.from(document.querySelectorAll(".brxe-".concat(queryId, ":not(.brx-popup)"))).pop();
      if (queryTrail) {
        if (!sourceEl.classList.contains('is-loading')) {
          // Add "is-loading" class to the source element so we could style some spinner animation
          sourceEl.classList.add('is-loading');

          // Add the query ID to the trail so that the load page could fetch the query config
          queryTrail.dataset.queryElementId = queryId;
          bricksQueryLoadPage(queryTrail).then(function (data) {
            sourceEl.classList.remove('is-loading');

            // Remove the load more "button"
            if ((data === null || data === void 0 ? void 0 : data.page) >= (data === null || data === void 0 ? void 0 : data.maxPages)) {
              // Hide the element (@since 1.8.2), previously it was removed
              sourceEl.style.display = 'none';
            }
          });
        }
      }
      break;
  }
}

/**
 * Open Bricks popup (frontend only)
 *
 * @param {obj} object Popup element node or popup ID
 *
 * @since 1.7.1
 */
function bricksOpenPopup(object) {
  var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  if (!bricksIsFrontend) {
    return;
  }
  var popupElement;

  // Check: Popup is element node OR popup ID
  if (object) {
    if (object.nodeType === Node.ELEMENT_NODE) {
      popupElement = object;
    }

    // Check: object is the popup ID
    else if (object) {
      popupElement = document.querySelector(".brx-popup[data-popup-id=\"".concat(object, "\"]"));
    }
  }

  // Fallback: Get first popup on the page
  // else {popupElement = document.querySelector(`.brx-popup[data-popup-id]`)}

  if (!popupElement) {
    return;
  }
  var popupId = popupElement.dataset.popupId;

  // Check if the popup show limits are met
  if (bricksPopupCheckLimit(popupElement)) {
    // Show popup
    popupElement.classList.remove('hide');

    // @since 1.7.1 - Add "no-scroll" class to the body if 'data-popup-body-scroll' is not set
    if (!popupElement.dataset.popupBodyScroll) {
      document.body.classList.add('no-scroll');
    }

    // Set popup height to viewport height (@since 1.8.2)
    bricksSetVh();

    // @since 1.7.1 - Trigger custom event for the "bricks/popup/open" trigger, Provide the popup ID and the popup element
    var showPopupEvent = new CustomEvent('bricks/popup/open', {
      detail: {
        popupId: popupId,
        popupElement: popupElement
      }
    });
    document.dispatchEvent(showPopupEvent);

    // Run counter after timeout animation finishes (delay + duration)
    setTimeout(function () {
      bricksCounter();
    }, timeout);

    // Store the number of times this popup was shown
    bricksPopupCounter(popupElement);
  }
}

/**
 * Close Bricks popup (frontend only)
 *
 * @param object Popup element node or popup ID
 *
 * @since 1.7.1
 */
function bricksClosePopup(object) {
  if (!bricksIsFrontend) {
    return;
  }
  var popupElement;

  // Check: Popup is element node OR popup ID
  if (object) {
    if (object.nodeType === Node.ELEMENT_NODE) {
      popupElement = object;
    }

    // Check: object is the popup ID
    else if (object) {
      popupElement = document.querySelector(".brx-popup[data-popup-id=\"".concat(object, "\"]"));
    }
  }

  // Fallback: Get first popup on the page
  // else {popupElement = document.querySelector(`.brx-popup[data-popup-id]`)}

  if (!popupElement) {
    return;
  }
  var popupId = popupElement.dataset.popupId;
  popupElement.classList.add('hide');

  // @since 1.7.1 - Remove "no-scroll" class to the body if 'data-popup-body-scroll' is not set
  if (!popupElement.dataset.popupBodyScroll) {
    document.body.classList.remove('no-scroll');
  }

  // @since 1.7.1 - Trigger custom event for the "bricks/popup/close" trigger, Provide the popup ID and the popup element
  var hidePopupEvent = new CustomEvent('bricks/popup/close', {
    detail: {
      popupId: popupId,
      popupElement: popupElement
    }
  });
  document.dispatchEvent(hidePopupEvent);
}

/**
 * Popups: Check show up limits
 *
 * true:  ok
 * false: limit overflow
 *
 * NOTE: Limits are stored in "brx_popup_${popupId}_total"
 *
 * @since 1.6
 */
function bricksPopupCheckLimit(element) {
  var _element$dataset, _element$dataset2;
  var limits = element === null || element === void 0 ? void 0 : (_element$dataset = element.dataset) === null || _element$dataset === void 0 ? void 0 : _element$dataset.popupLimits;
  var popupId = element === null || element === void 0 ? void 0 : (_element$dataset2 = element.dataset) === null || _element$dataset2 === void 0 ? void 0 : _element$dataset2.popupId;
  if (!limits) {
    return true;
  }
  try {
    limits = JSON.parse(limits);
  } catch (e) {
    console.info('error:bricksPopupCheckLimit', e);
    return true;
  }
  var overflow = false;
  Object.entries(limits).forEach(function (_ref2) {
    var _ref3 = _slicedToArray(_ref2, 2),
      key = _ref3[0],
      value = _ref3[1];
    var counter = bricksStorageGetItem(key, "brx_popup_".concat(popupId, "_total"));
    counter = counter ? parseInt(counter) : 0;
    overflow = overflow || counter >= value;
  });
  return !overflow;
}

/**
 * Popups: Store how many times popup was displayed
 *
 * NOTE: limits are stored in "brx_popup_${popupId}_total"
 *
 * @since 1.6
 */
function bricksPopupCounter(element) {
  var _element$dataset3, _element$dataset4;
  var limits = element === null || element === void 0 ? void 0 : (_element$dataset3 = element.dataset) === null || _element$dataset3 === void 0 ? void 0 : _element$dataset3.popupLimits;
  var popupId = element === null || element === void 0 ? void 0 : (_element$dataset4 = element.dataset) === null || _element$dataset4 === void 0 ? void 0 : _element$dataset4.popupId;
  if (!limits) {
    return;
  }
  try {
    limits = JSON.parse(limits);
  } catch (e) {
    console.info('error:bricksPopupCounter', e);
    return true;
  }
  Object.entries(limits).forEach(function (_ref4) {
    var _ref5 = _slicedToArray(_ref4, 2),
      key = _ref5[0],
      value = _ref5[1];
    var counter = bricksStorageGetItem(key, "brx_popup_".concat(popupId, "_total"));
    counter = counter ? parseInt(counter) : 0;
    bricksStorageSetItem(key, "brx_popup_".concat(popupId, "_total"), counter + 1);
  });
}

/**
 * Check interactions conditions
 *
 * @since 1.6
 */
function bricksInteractionCheckConditions(config) {
  // STEP: No conditions
  if (!Array.isArray(config === null || config === void 0 ? void 0 : config.interactionConditions)) {
    return true;
  }
  var relation = (config === null || config === void 0 ? void 0 : config.interactionConditionsRelation) || 'and';

  // Start with true if relation is 'and', false otherwise ('or')
  var runInteraction = relation === 'and';

  /**
   * Convert storage value to number to be used in >=, <=, >, < conditions
   *
   * @see #862j9fr6y
   *
   * @since 1.7.1
   */
  var convertToNumber = function convertToNumber(value) {
    return !isNaN(value) ? parseFloat(value) : 0;
  };

  // STEP: Check the interaction conditions
  config.interactionConditions.forEach(function (condition) {
    var conditionType = condition === null || condition === void 0 ? void 0 : condition.conditionType;
    var storageKey = (condition === null || condition === void 0 ? void 0 : condition.storageKey) || false;
    var runCondition = false;
    if (conditionType && storageKey) {
      var storageCompare = (condition === null || condition === void 0 ? void 0 : condition.storageCompare) || 'exists';
      var storageCompareValue = condition === null || condition === void 0 ? void 0 : condition.storageCompareValue;
      var storageValue = bricksStorageGetItem(conditionType, storageKey);
      switch (storageCompare) {
        case 'exists':
          runCondition = storageValue !== null;
          break;
        case 'notExists':
          runCondition = storageValue === null;
          break;
        case '==':
          runCondition = storageValue == storageCompareValue;
          break;
        case '!=':
          runCondition = storageValue != storageCompareValue;
          break;
        case '>=':
          runCondition = convertToNumber(storageValue) >= convertToNumber(storageCompareValue);
          break;
        case '<=':
          runCondition = convertToNumber(storageValue) <= convertToNumber(storageCompareValue);
          break;
        case '>':
          runCondition = convertToNumber(storageValue) > convertToNumber(storageCompareValue);
          break;
        case '<':
          runCondition = convertToNumber(storageValue) < convertToNumber(storageCompareValue);
          break;
      }
    } else {
      runCondition = true;
    }
    runInteraction = relation === 'and' ? runInteraction && runCondition : runInteraction || runCondition;
  });
  return runInteraction;
}

/**
 * Storage helper function to get value stored under a specific key
 *
 * @since 1.6
 */
function bricksStorageGetItem(type, key) {
  if (!key) {
    return;
  }
  var value;
  try {
    switch (type) {
      // Per page load
      case 'windowStorage':
        value = window.hasOwnProperty(key) ? window[key] : null;
        break;

      // Per session
      case 'sessionStorage':
        value = sessionStorage.getItem(key);
        break;

      // Across sessions
      case 'localStorage':
        value = localStorage.getItem(key);
        break;
    }
  } catch (e) {
    console.info('error:bricksStorageGetItem', e);
  }
  return value;
}

/**
 * Storage helper function to set value for a specific storage key
 *
 * @since 1.6
 */
function bricksStorageSetItem(type, key, value) {
  if (!key) {
    return;
  }
  try {
    switch (type) {
      case 'windowStorage':
        window[key] = value;
        break;
      case 'sessionStorage':
        sessionStorage.setItem(key, value);
        break;
      case 'localStorage':
        localStorage.setItem(key, value);
        break;
    }
  } catch (e) {
    console.info('error:bricksStorageSetItem', e);
  }
}

/**
 * Storage helper function to remove a specific storage key
 *
 * @since 1.6
 */
function bricksStorageRemoveItem(type, key) {
  if (!key) {
    return;
  }
  try {
    switch (type) {
      case 'windowStorage':
        delete window[key];
        break;
      case 'sessionStorage':
        sessionStorage.removeItem(key);
        break;
      case 'localStorage':
        localStorage.removeItem(key);
        break;
    }
  } catch (e) {
    console.info('error:bricksStorageRemoveItem', e);
  }
}

/**
 * Nav nested
 *
 * Mobile menu toggle
 *
 * Listeners:
 * - press ESC key to close .brx-nav-nested-items & auto-focus on mobile menu toggle
 * - press ENTER or SPACE to open .brxe-nav-nested-inner
 *
 * NOTE: Mobile menu toggle via .brx-toggle-div listener
 *
 * @since 1.8
 */
function bricksNavNested() {
  // Return: Builder has its own logic for showing the brx-nav-nested-items while editing
  if (!bricksIsFrontend) {
    return;
  }
  var navNestedObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        var navNested = mutation.target;

        // STEP: Open navNested
        if (navNested.classList.contains('brx-open')) {
          // Set popup height to viewport height (@since 1.8.2)
          bricksSetVh(); // Nav nested mobile menu uses 'top' & 'bottom' 0 instead of 100vh, though

          // Add class to body to prevent scrolling
          document.body.classList.add('no-scroll');

          // Close toggle inside navNested is open
          var toggleInside = navNested.querySelector('.brx-nav-nested-items button.brxe-toggle');
          if (toggleInside) {
            setTimeout(function () {
              toggleInside.classList.add('is-active');
              toggleInside.setAttribute('aria-expanded', true);
              toggleInside.focus();
            }, 10);
          }

          // Auto-focus on first focusable element inside .brx-nav-nested
          else {
            var focusableElements = bricksGetFocusables(navNested);
            if (focusableElements.length) {
              focusableElements[0].focus();
            }
          }
        }

        // STEP: Close nav nested
        else {
          // Remove class to body to prevent scrolling
          document.body.classList.remove('no-scroll');

          // Focus on toggle element that opened the nav nested ([data-toggle-script-id])
          var toggleScriptId = navNested.dataset.toggleScriptId;
          var toggleNode = document.querySelector("button[data-script-id=\"".concat(toggleScriptId, "\"]"));
          if (toggleNode) {
            toggleNode.setAttribute('aria-expanded', false);
            toggleNode.classList.remove('is-active');
            toggleNode.focus();
          }
        }
      }
    });
  });
  var navNestedElements = bricksQuerySelectorAll(document, '.brxe-nav-nested');
  if (!navNestedElements.length) {
    return;
  }

  // STEP: Observe class list changes on .brxe-nav-nested
  navNestedElements.forEach(function (navNested) {
    navNestedObserver.observe(navNested, {
      attributes: true,
      attributeFilter: ['class']
    });
  });

  // STEP: ESC key pressed: Close mobile menu
  document.addEventListener('keyup', function (e) {
    if (e.key === 'Escape') {
      bricksNavNestedClose();
    }
  });

  // STEP: Click outside of .brxe-nav-nested && not on a toggle: Close mobile menu
  document.addEventListener('click', function (e) {
    var navNested = e.target.closest('.brxe-nav-nested');
    var clickOnToggle = e.target.closest('.brxe-toggle');
    if (!navNested && !clickOnToggle) {
      bricksNavNestedClose();
    }
  });
}

/**
 * Nav nested: Close mobile menu
 */
function bricksNavNestedClose() {
  var navNestedOpen = bricksQuerySelectorAll(document, '.brxe-nav-nested.brx-open');
  navNestedOpen.forEach(function (navNested) {
    navNested.classList.add('brx-closing');

    // Close .brx-open after 200ms to prevent mobile menu styles from unsetting while mobile menu fades out
    setTimeout(function () {
      navNested.classList.remove('brx-closing');
      navNested.classList.remove('brx-open');
    }, 200);
  });
}

/**
 * Offcanvas element
 *
 * - Show by adding .show (click on toggle)
 * - Close by removeing .show (backdrop click/ESC key press)
 *
 * @since 1.8
 */
function bricksOffcanvas() {
  if (!bricksIsFrontend) {
    return;
  }
  var offcanvasElements = bricksQuerySelectorAll(document, '.brxe-offcanvas');
  if (!offcanvasElements.length) {
    return;
  }
  var offcanvasObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        var offcanvas = mutation.target;
        var inner = offcanvas.querySelector('.brx-offcanvas-inner');
        var transitionDuration = inner ? transitionDuration = parseFloat(window.getComputedStyle(inner).getPropertyValue('transition-duration')) * 1000 : 200;

        // STEP: Open offcanvas
        if (offcanvas.classList.contains('brx-open')) {
          // Set popup height to viewport height (@since 1.8.2)
          bricksSetVh();

          // Offset body by height/width of offcanvas
          if (offcanvas.dataset.effect === 'offset') {
            if (inner) {
              // Get CSS transition value of .brx-offcanvas-inner
              var direction = offcanvas.getAttribute('data-direction');
              var transition = window.getComputedStyle(inner).getPropertyValue('transition');
              document.body.style.margin = '0';
              document.body.style.transition = transition.replace('transform', 'margin');

              // Offset body by height/width of offcanvas

              // Horizontal (top/bottom)
              if (direction === 'top') {
                document.body.style.marginTop = "".concat(inner.offsetHeight, "px");
              } else if (direction === 'bottom') {
                document.body.style.marginTop = "-".concat(inner.offsetHeight, "px");
              }

              // Vertical (left/right)
              else if (direction === 'left') {
                document.body.style.marginLeft = "".concat(inner.offsetWidth, "px");
                document.body.style.overflowX = 'hidden';
              } else if (direction === 'right') {
                document.body.style.marginLeft = "-".concat(inner.offsetWidth, "px");
                document.body.style.overflowX = 'hidden';
              }
            }
          }

          // Disable body scroll
          if (offcanvas.dataset.noScroll) {
            document.body.classList.add('no-scroll');
          }

          // Auto-focus on first focusable element inside .brx-offcanvas
          var focusableElements = bricksGetFocusables(offcanvas);
          if (focusableElements.length) {
            focusableElements[0].focus();
          }

          // Toggle inside offcanvas is open
          var offcanvasToggle = offcanvas.querySelector('.brx-offcanvas-inner > button.brxe-toggle');
          if (offcanvasToggle) {
            offcanvasToggle.classList.add('is-active');
            offcanvasToggle.setAttribute('aria-expanded', true);
          }
        }

        // STEP: Close offcanvas
        else {
          // Keep offcanvas visible until closing transition is finished (don't use class to prevent infinite MutationObserver loop)
          offcanvas.style.visibility = 'visible';

          // Focus on toggle element that opened the offcanvas ([data-toggle-script-id])
          var toggleScriptId = offcanvas.dataset.toggleScriptId;
          var toggleNode = document.querySelector("button[data-script-id=\"".concat(toggleScriptId, "\"]"));
          if (toggleNode) {
            toggleNode.setAttribute('aria-expanded', false);
            toggleNode.classList.remove('is-active');
            toggleNode.focus();
          }
          if (offcanvas.dataset.effect === 'offset') {
            if (document.body.style.marginTop) {
              document.body.style.margin = '0';
            }
            setTimeout(function () {
              document.body.style.margin = null;
              document.body.style.overflow = null;
              document.body.style.transition = null;
            }, transitionDuration);
          }
          setTimeout(function () {
            // Set visibility back to hidden by removing the inline style
            offcanvas.style.visibility = null;

            // Re-enable body scroll
            if (offcanvas.dataset.noScroll) {
              document.body.classList.remove('no-scroll');
              bricksSubmenuPosition();
            }
          }, transitionDuration);
        }
      }
    });
  });
  offcanvasElements.forEach(function (offcanvas) {
    // STEP: Observe class list changes on .brxe-offcanvas
    offcanvasObserver.observe(offcanvas, {
      attributes: true,
      attributeFilter: ['class']
    });

    // STEP: Close offcanvas when clicking on backdrop
    var backdrop = offcanvas.querySelector('.brx-offcanvas-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', function (e) {
        bricksOffcanvasClose();
      });
    }
  });

  // STEP: ESC key pressed: Close offcanvas & focus on offcanvas toggle button
  document.addEventListener('keyup', function (e) {
    if (e.key === 'Escape') {
      bricksOffcanvasClose();
    }
  });
}

/**
 * Close all open offcanvas elements
 *
 * @since 1.8
 */
function bricksOffcanvasClose() {
  var openOffcanvasElements = bricksQuerySelectorAll(document, '.brxe-offcanvas.brx-open');
  openOffcanvasElements.forEach(function (openOffcanvas) {
    openOffcanvas.classList.remove('brx-open');
  });
}

/**
 * Toggle mobile menu open inside "Div" inside .brx-nav-nested-items
 *
 * Set diplay on div according to toggle display (initially and on window resize).
 *
 * @since 1.8
 */
function bricksToggleDisplay() {
  var toggleElements = bricksQuerySelectorAll(document, '.brxe-toggle');
  if (!toggleElements.length) {
    return;
  }
  toggleElements.forEach(function (toggle) {
    // Mobile menu close toggle inside 'div' inside .brx-nav-nested-items: Hide div
    if (toggle.closest('.brx-nav-nested-items') && !toggle.parentNode.classList.contains('brx-nav-nested-items') && !toggle.parentNode.classList.contains('brx-toggle-div')) {
      // Hide parent div if toggle is hidden
      var toggleStyles = window.getComputedStyle(toggle);
      if (toggleStyles.display === 'none') {
        toggle.parentNode.style.display = 'none';
      } else {
        toggle.parentNode.style.display = null;
      }
    }
  });
}

/**
 * Toggle element
 *
 * Default toggles:
 *
 * - Nav nested mobile menu (.brxe-nav-nested)
 * - Offcanvas element (.brxe-offcanvas)
 *
 * @since 1.8
 */
function bricksToggle() {
  if (!bricksIsFrontend) {
    return;
  }
  var toggleElements = bricksQuerySelectorAll(document, '.brxe-toggle');
  if (!toggleElements.length) {
    return;
  }
  bricksToggleDisplay();
  toggleElements.forEach(function (toggle) {
    toggle.addEventListener('click', function (e) {
      var _toggle$dataset, _toggle$dataset2, _toggle$dataset3;
      e.preventDefault();

      // Toggle selector, attribute, and value
      var toggleSelector = ((_toggle$dataset = toggle.dataset) === null || _toggle$dataset === void 0 ? void 0 : _toggle$dataset.selector) || '.brxe-offcanvas';
      var toggleAttribute = ((_toggle$dataset2 = toggle.dataset) === null || _toggle$dataset2 === void 0 ? void 0 : _toggle$dataset2.attribute) || 'class';
      var toggleValue = ((_toggle$dataset3 = toggle.dataset) === null || _toggle$dataset3 === void 0 ? void 0 : _toggle$dataset3.value) || 'brx-open';
      var toggleElement = toggleSelector ? document.querySelector(toggleSelector) : false;

      // Element: nav-nested
      if (!toggleElement) {
        toggleElement = toggle.closest('.brxe-nav-nested');
      }

      // Element: offcanvas
      if (!toggleElement) {
        toggleElement = toggle.closest('.brxe-offcanvas');
      }
      if (!toggleElement) {
        return;
      }

      // Re-calculcate mega menu position & width to prevent scrollbars
      if (document.querySelector('.brx-has-megamenu')) {
        // If not close toggle inside offcanvas with offset effect
        if (!e.target.closest('[data-effect="offset"]')) {
          bricksSubmenuPosition(0);
        }
      }

      // STEP: Set data-toggle-script-id as selector to focus back to toggle when closing via ESC key
      if (toggle.dataset.scriptId && !toggleElement.dataset.toggleScriptId) {
        toggleElement.dataset.toggleScriptId = toggle.dataset.scriptId;
      }

      // STEP: Toggle 'aria-expanded' & .is-active on the toggle
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !expanded);
      toggle.classList.toggle('is-active');

      // STEP: Toggle class OR other attribute
      if (toggleAttribute === 'class') {
        // Close .brx-open after 200ms to prevent mobile menu styles from unsetting while mobile menu fades out
        if (toggle.closest('.brxe-nav-nested') && toggleValue === 'brx-open' && toggleElement.classList.contains('brx-open')) {
          toggleElement.classList.add('brx-closing');
          setTimeout(function () {
            toggleElement.classList.remove('brx-closing');
            toggleElement.classList.remove('brx-open');
          }, 200);
        } else {
          toggleElement.classList.toggle(toggleValue);
        }
      } else {
        if (toggleElement.getAttribute(toggleAttribute)) {
          toggleElement.removeAttribute(toggleAttribute);
        } else {
          toggleElement.setAttribute(toggleAttribute, toggleValue);
        }
      }

      // STEP: Focus on first focusable element inside target
      var focusableElements = bricksGetFocusables(toggleElement);
      if (focusableElements.length) {
        focusableElements[0].focus();
      }
    });
  });
}

/**
 * Toggle sub menu: Nav menu, Dropdown
 *
 * Toggle:
 * - click on dropdown toggle
 * - press ENTER key
 * - press SPACE key
 *
 * Hide:
 * - click outside dropdown
 * - click on another dropdown toggle
 * - press ESC key
 * - press TAB key to tab out of dropdown
 *
 * Not added:
 * - press ARROR UP/DOWN key to navigate dropdown items (prevents page scroll)
 *
 * @since 1.8
 */
function bricksSubmenuToggle(toggle) {
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'toggle';
  // Menu item: Parent of .brx-submenu-toggle (@since 1.8 to allow usage of non 'li' HTML tag on dropdown element)
  var menuItem = toggle.parentNode.classList.contains('brx-submenu-toggle') ? toggle.parentNode.parentNode : false;

  // Return: No menu item found
  if (!menuItem) {
    return;
  }

  // STEP: Multilevel menu
  var multilevel = toggle.closest('.brx-has-multilevel');
  if (multilevel) {
    // Hide currently active parent menu item (if it's not a megamenu)
    var activeMenuItem = menuItem.parentNode.closest('.active');
    if (activeMenuItem && !activeMenuItem.classList.contains('brx-has-megamenu')) {
      activeMenuItem.classList.remove('active');
    }

    // Focus on first focusable element in submenu (small timoute required)
    setTimeout(function () {
      var submenu = menuItem.querySelector('ul') || menuItem.querySelector('.brx-dropdown-content');
      if (submenu) {
        var focusables = bricksGetFocusables(submenu);
        if (focusables.length) {
          focusables[0].focus();
        }
      }
    }, 100);
  }

  // add, remove, toggle .open class (& add/remove .active class)
  if (action === 'add') {
    menuItem.classList.add('open');
    menuItem.classList.add('active');
  } else if (action === 'remove') {
    menuItem.classList.remove('open');
    menuItem.classList.remove('active');
  } else {
    menuItem.classList.toggle('open');
  }

  // Set 'aria-expanded'
  toggle.setAttribute('aria-expanded', menuItem.classList.contains('open'));

  // Re-position submenu on every toggle
  // bricksSubmenuPosition(100)
}

/**
 *
 * Sub menu event listeners (Nav menu, Dropdown)
 *
 * mouseenter: Open submenu
 * mouseleave: Close submenu
 * Escape key pressed: Close all open sub menus outside non-active element
 * Click outside submenu: Close all open sub menus
 *
 * @since 1.8
 */
function bricksSubmenuListeners() {
  // STEP: Toggle submenu on mouseenter & mouseleave (desktop menu only)
  var submenuItems = bricksQuerySelectorAll(document, '.bricks-nav-menu .menu-item-has-children');

  // Include Dropdown elements
  var dropdownMenuItems = bricksQuerySelectorAll(document, '.brxe-dropdown');
  submenuItems = submenuItems.concat(dropdownMenuItems);
  submenuItems.forEach(function (submenuItem) {
    // Skip mouse listeners: Static, Multilevel, active menu item
    var skipMouseListeners = submenuItem.closest('[data-static]') || submenuItem.closest('.brx-has-multilevel') || submenuItem.classList.contains('active');
    if (skipMouseListeners) {
      return;
    }

    // Open submenu on mouseenter
    submenuItem.addEventListener('mouseenter', function (e) {
      // Return: Mobile menu (Nav menu, Nav nested)
      if (submenuItem.closest('.show-mobile-menu') || submenuItem.closest('.brxe-nav-nested.brx-open')) {
        return;
      }

      // Return: Toggle on "click"
      if (submenuItem.getAttribute('data-toggle') === 'click') {
        return;
      }
      var toggle = e.target.querySelector('[aria-expanded="false"]');
      if (toggle) {
        bricksSubmenuToggle(toggle);
      }
    });

    // Close submenu on mouseleave
    submenuItem.addEventListener('mouseleave', function (e) {
      // Skip mobile menu (Nav menu, Nav nested)
      if (submenuItem.closest('.show-mobile-menu') || submenuItem.closest('.brxe-nav-nested.brx-open')) {
        return;
      }

      // Return: Toggle on "click"
      if (submenuItem.getAttribute('data-toggle') === 'click') {
        return;
      }
      var toggle = e.target.querySelector('[aria-expanded="true"]');
      if (toggle) {
        // Return: If submenu is .active (opened manually via toggle click)
        var menuItem = toggle.closest('.menu-item');
        if (!menuItem) {
          menuItem = toggle.closest('.brxe-dropdown');
        }
        if (menuItem && menuItem.classList.contains('active')) {
          return;
        }
        bricksSubmenuToggle(toggle);
      }
    });
  });
  document.addEventListener('keyup', function (e) {
    if (e.key === 'Escape') {
      // STEP: Hide closest submenu & focus on parent
      var openSubmenu = e.target.closest('.open');
      var multilevel = e.target.closest('.brx-has-multilevel');
      if (openSubmenu && !multilevel) {
        var toggle = openSubmenu.querySelector('.brx-submenu-toggle button[aria-expanded]');
        if (toggle) {
          bricksSubmenuToggle(toggle, 'remove');

          // Focus on parent
          if (toggle) {
            toggle.focus();
          }
        }
      }

      // STEP: Close all open submenus (multilevel)
      else {
        var openSubmenuToggles = bricksQuerySelectorAll(document, '.brx-submenu-toggle > button[aria-expanded="true"]');
        openSubmenuToggles.forEach(function (toggle) {
          if (toggle) {
            bricksSubmenuToggle(toggle, 'remove');
          }
        });
      }
    }

    // STEP: Tabbed out of menu item: Close menu item (if it does not contain the active element)
    else if (e.key === 'Tab' && !e.shiftKey) {
      setTimeout(function () {
        var openToggles = bricksQuerySelectorAll(document, '[aria-expanded="true"]');

        // NOTE: Can't listen to tabbing out of window (in case there is no focusable element after the last open submenu on the page)
        openToggles.forEach(function (toggle) {
          var menuItem = toggle.closest('.menu-item');
          if (!menuItem) {
            menuItem = toggle.closest('.brxe-dropdown');
          }
          if (menuItem && !menuItem.contains(document.activeElement) || document.activeElement.tagName === 'BODY') {
            bricksSubmenuToggle(toggle);
          }
        });
      }, 0);
    }
  });
  document.addEventListener('click', function (e) {
    var linkUrl = e.target.nodeName === 'A' && e.target.hasAttribute('href') ? e.target.getAttribute('href') : '';
    if (linkUrl) {
      // Return: Link URL does not contain hash (#)
      if (!linkUrl.includes('#')) {
        return;
      }

      // Prevent default on anchor link (#)
      if (linkUrl === '#') {
        e.preventDefault();
      }

      // Click on section anchor link (e.g. #section)
      else {
        // Inside offcanvas: Close offcanvas
        var offcanvas = e.target.closest('.brxe-offcanvas');
        if (offcanvas) {
          bricksOffcanvasClose();
        }

        // Inside mobile menu: Close mobile menu (@since 1.8.4)
        else {
          var isMobileMenu = e.target.closest('.brxe-nav-nested.brx-open');
          if (isMobileMenu) {
            bricksNavNestedClose();

            // Scroll to anchor link (after 200ms when mobile menu is closed)
            var element = document.querySelector(linkUrl);
            if (element) {
              setTimeout(function () {
                element.scrollIntoView();
              }, 200);
            }
          }
        }
      }
    }

    // STEP: Toggle submenu button click (default) OR entire .brx-submenu-toggle on click (if 'toggleOn' set to: click, or both)
    var submenuToggle = e.target.closest('.brx-submenu-toggle');
    if (submenuToggle) {
      var toggleOn = 'hover';
      var toggleOnNode = submenuToggle.closest('[data-toggle]');
      if (toggleOnNode) {
        toggleOn = toggleOnNode.getAttribute('data-toggle');
      }

      // Nav menu: Toggle on entire .brx-submenu-toggle click
      if (submenuToggle.closest('.brxe-nav-menu.show-mobile-menu')) {
        toggleOn = 'click';
      }

      // Nav nested: Toggle on entire .brx-submenu-toggle click
      if (submenuToggle.closest('.brxe-nav-nested.brx-open')) {
        toggleOn = 'click';
      }
      var toggleButton = toggleOn === 'hover' ? e.target.closest('[aria-expanded]') : submenuToggle.querySelector('button[aria-expanded]');

      /**
       * Return: Toggle on set to "hover"
       *
       * @sinc 1.8.4: Remove e.screenX = 0 && e.screenY = 0 check as not working in Safari
       */
      var isKeyboardEvent = e.detail === 0;
      if (!isKeyboardEvent && toggleOn !== 'click' && toggleOn !== 'both') {
        toggleButton = null;
      }
      if (toggleButton) {
        bricksSubmenuToggle(toggleButton);

        // Set .open & active & aria-expanded in case toggle was already .open on mouseenter
        var menuItem = submenuToggle.parentNode;
        menuItem.classList.toggle('active');
        setTimeout(function () {
          if (menuItem.classList.contains('active')) {
            menuItem.classList.add('open');
          }
          toggleButton.setAttribute('aria-expanded', menuItem.classList.contains('open'));
        }, 0);
      }
    }

    // STEP: Click outside submenu: Close open sub menus
    var openSubmenuButtons = bricksQuerySelectorAll(document, '.brx-submenu-toggle > button[aria-expanded="true"]');
    openSubmenuButtons.forEach(function (toggleButton) {
      var menuItem = toggleButton.closest('li');
      if (!menuItem) {
        menuItem = toggleButton.closest('.brxe-dropdown');
      }
      if (!menuItem || menuItem.contains(e.target)) {
        return;
      }
      bricksSubmenuToggle(toggleButton);
      menuItem.classList.remove('active');
    });
  });
}

/**
 * Submenu position (re-run on window resize)
 *
 * Mega menu: Nav menu (Bricks template) & Dropdown.
 * Re-position submenu in case of viewport overflow.
 *
 * @param {number} timeout Timeout in ms before calculating submenu position.
 *
 * @since 1.8
 */
function bricksSubmenuPosition() {
  var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  setTimeout(function () {
    var docWidth = document.body.clientWidth; // document width without scrollbar
    var submenuToggles = bricksQuerySelectorAll(document, '.brx-submenu-toggle');
    submenuToggles.forEach(function (submenuToggle) {
      var menuItem = submenuToggle.parentNode;
      var submenu = menuItem.querySelector('.brx-megamenu') || menuItem.querySelector('.brx-dropdown-content') || menuItem.querySelector('ul');

      // Submenu has aria-current="page" menu item: Add .aria-current to toplevel .brx-submenu-toggle
      if (submenu.querySelector('[aria-current="page"]')) {
        submenuToggle.classList.add('aria-current');
      }

      // Skip: Static submenu (e.g. Dropdown inside Offcanvas)
      if (menuItem.hasAttribute('data-static')) {
        return;
      }

      // Skip: Submenu not found
      if (!submenu) {
        return;
      }

      // STEP: Mega menu
      var hasMegamenu = menuItem.classList.contains('brx-has-megamenu');
      if (hasMegamenu) {
        var offsetLeft = menuItem.offsetLeft + 1; // + 1px to prevent horizontal scrollbar (@since 1.8)
        if (offsetLeft) {
          submenu.style.left = "-".concat(offsetLeft, "px");
        }

        // Set 'left' & 'min-width' of custom selector
        var megaMenuWidthNode = menuItem.dataset.megaMenu ? document.querySelector(menuItem.dataset.megaMenu) : false;
        if (megaMenuWidthNode) {
          var megaMenuWidthNodeRect = megaMenuWidthNode.getBoundingClientRect();
          submenu.style.left = "-".concat(offsetLeft - megaMenuWidthNodeRect.left, "px");
          submenu.style.minWidth = "".concat(megaMenuWidthNodeRect.width, "px");
        }

        // Default: Cover entire body width
        else {
          submenu.style.minWidth = "".concat(document.body.clientWidth, "px");
        }
      }

      // STEP: Default submenu
      else {
        // Remove overflow class to reapply logic on window resize
        if (submenu.classList.contains('brx-multilevel-overflow-right')) {
          submenu.classList.remove('brx-multilevel-overflow-right');
        }
        if (submenu.classList.contains('brx-submenu-overflow-right')) {
          submenu.classList.remove('brx-submenu-overflow-right');
        }
        if (submenu.classList.contains('brx-sub-submenu-overflow-right')) {
          submenu.classList.remove('brx-sub-submenu-overflow-right');
        }

        // STEP: Re-position in case of viewport overflow
        var submenuRect = submenu.getBoundingClientRect();
        var submenuWidth = submenuRect.width;
        var submenuRight = submenuRect.right;
        var submenuLeft = Math.ceil(submenuRect.left);

        // STEP: Submenu wider than viewport: Set submenu to viewport width
        if (submenuWidth > docWidth) {
          submenu.style.left = "-".concat(submenuLeft, "px");
          submenu.style.minWidth = "".concat(docWidth, "px");
        }

        // STEP: Dropdown content overflows viewport to the right: Re-position to prevent horizontal scrollbar
        else if (submenuRight > docWidth) {
          var multilevel = submenu.closest('.brx-has-multilevel');
          var isToplevel = !menuItem.parentNode.closest('.menu-item') && !menuItem.parentNode.closest('.brxe-dropdown');

          // Top level of multilevel menu: Position all menus to the right
          if (multilevel) {
            submenu.classList.add('brx-multilevel-overflow-right');
          }

          // Default submenu
          else {
            if (isToplevel) {
              submenu.classList.add('brx-submenu-overflow-right');
            } else {
              submenu.classList.add('brx-sub-submenu-overflow-right');
            }
          }
        }

        // STEP: Dropdown content overflows viewport on the left (RTL)
        else if (submenuLeft < 0) {
          submenu.style.left = '100%';
          submenu.style.right = 'auto';
        }
      }
    });
  }, timeout);
}

/**
 * Multi level menu item: "Nav menu" OR "Dropdown" element
 *
 * Add 'back' text to multilevel submenus & click listeners.
 *
 * @since 1.8
 */
function bricksMultilevelMenu() {
  // STEP: Nav nested: Multilevel enabled
  var navNestedElements = bricksQuerySelectorAll(document, '.brxe-nav-nested.multilevel');
  navNestedElements.forEach(function (navNested) {
    var backText = navNested.getAttribute('data-back-text');
    var dropdowns = navNested.querySelectorAll('.brxe-dropdown');
    dropdowns.forEach(function (dropdown) {
      dropdown.classList.add('brx-has-multilevel');
      dropdown.setAttribute('data-toggle', 'click');
      dropdown.setAttribute('data-back-text', backText);
    });
  });

  // STEP: Create "back" HTML & listeners
  var multilevelItems = bricksQuerySelectorAll(document, '.brx-has-multilevel');
  multilevelItems.forEach(function (menuItem) {
    var backText = menuItem.getAttribute('data-back-text') || 'Back';
    var submenus = bricksQuerySelectorAll(menuItem, 'ul');
    submenus.forEach(function (submenu, index) {
      // Return on top level menu item
      if (index === 0) {
        return;
      }

      // Add back list item as first submenu node: li > a.brx-multilevel-back
      var backLink = document.createElement('a');
      backLink.classList.add('brx-multilevel-back');
      backLink.setAttribute('href', '#');
      backLink.innerText = backText;
      var backListItem = document.createElement('li');
      backListItem.classList.add('menu-item');
      backListItem.appendChild(backLink);
      submenu.insertBefore(backListItem, submenu.firstChild);

      // Listener to click on back link
      backLink.addEventListener('click', function (e) {
        e.preventDefault();

        // Hide current submenu
        var activeMenuItem = e.target.closest('.active');
        if (activeMenuItem) {
          activeMenuItem.classList.remove('open');
          activeMenuItem.classList.remove('active');

          // Set: aria-label="false"
          var submenuToggle = activeMenuItem.querySelector('.brx-submenu-toggle > button');
          if (submenuToggle) {
            submenuToggle.setAttribute('aria-expanded', false);
          }

          // Set parent menu item to active
          var parentMenuItem = activeMenuItem.parentNode.closest('.open');
          if (parentMenuItem) {
            parentMenuItem.classList.add('active');
            var parentSubmenu = parentMenuItem.querySelector('ul');
            if (parentSubmenu) {
              // Focus on first focusable element in parent menu item
              var focusables = bricksGetFocusables(parentSubmenu);
              if (focusables.length) {
                focusables[0].focus();
              }
            }
          }
        }
      });
    });
  });
}

/**
 * Nav menu: Open/close mobile menu
 *
 * Open/close: Click on mobile menu hamburger
 * Close: Click on mobile menu overlay OR press ESC key
 */
function bricksNavMenuMobile() {
  var toggles = bricksQuerySelectorAll(document, '.bricks-mobile-menu-toggle');
  if (!toggles.length) {
    return;
  }

  // STEP: Observe mobile menu toggle via MutationObserver (.show-mobile-menu class)
  var navMenuObserver = new MutationObserver(function (mutations) {
    // Set popup height to viewport height (@since 1.8.2)
    bricksSetVh();
    mutations.forEach(function (mutation) {
      // Add/remove .no-scroll body class
      if (mutation.target.classList.contains('show-mobile-menu')) {
        document.body.classList.add('no-scroll');
      } else {
        document.body.classList.remove('no-scroll');
      }
    });
  });

  // STEP: Observe class list changes on .brxe-nav-nested
  toggles.forEach(function (toggle) {
    var navMenu = toggle.closest('.brxe-nav-menu');
    navMenuObserver.observe(navMenu, {
      attributes: true,
      attributeFilter: ['class']
    });
  });

  // STEP: Toggle mobile menu (click on hamburger)
  document.addEventListener('click', function (e) {
    mobileMenuToggle = e.target.closest('.bricks-mobile-menu-toggle');
    if (mobileMenuToggle) {
      // Toggle mobile menu
      var navMenu = mobileMenuToggle.closest('.brxe-nav-menu');
      navMenu.classList.toggle('show-mobile-menu');

      // Toggle aria-expanded
      var expanded = navMenu.classList.contains('show-mobile-menu');
      mobileMenuToggle.setAttribute('aria-expanded', expanded);

      // Auto-focus first focusable element in mobile menu
      if (expanded) {
        setTimeout(function () {
          var navMenuMobile = navMenu.querySelector('.bricks-mobile-menu-wrapper');
          var focusableElements = bricksGetFocusables(navMenuMobile);
          if (focusableElements.length) {
            focusableElements[0].focus();
          }
        }, 10);
      }
    }
  });

  // STEP: Close mobile menu: Click on mobile menu overlay OR section anchor link was clicked (e.g. #section)
  document.addEventListener('click', function (e) {
    var navMenu = e.target.closest('.brxe-nav-menu');
    if (!navMenu) {
      return;
    }

    // Click on overlay: Close mobile menu
    if (e.target.classList.contains('bricks-mobile-menu-overlay')) {
      navMenu.classList.remove('show-mobile-menu');

      // Toggle aria-expanded
      navMenu.querySelector('.bricks-mobile-menu-toggle').setAttribute('aria-expanded', false);
    }

    // Click on anchor link: Close mobile menu
    else if (e.target.closest('.bricks-mobile-menu-wrapper')) {
      var navLinkUrl = e.target.tagName === 'A' ? e.target.getAttribute('href') : '';

      // Close section link click (e.g.: #portfolio)
      if (navLinkUrl.length > 1 && navLinkUrl.includes('#')) {
        navMenu.classList.remove('show-mobile-menu');

        // Toggle aria-expanded
        navMenu.querySelector('.bricks-mobile-menu-toggle').setAttribute('aria-expanded', false);
      }
    }
  });

  // STEP: ESC key pressed: Close mobile menu & focus on mobile menu toggle button
  document.addEventListener('keyup', function (e) {
    if (e.key === 'Escape') {
      var openMobileMenu = document.querySelector('.brxe-nav-menu.show-mobile-menu');
      if (openMobileMenu) {
        openMobileMenu.classList.remove('show-mobile-menu');
        var toggle = openMobileMenu.querySelector('bricks-mobile-menu-toggle');
        if (toggle) {
          toggle.setAttribute('aria-expanded', false);
          setTimeout(function () {
            toggle.focus();
          }, 10);
        }
      }
    }
  });
}

/**
 * Helper function to get all focusable elements to auto-focus on (accessibility)
 *
 * @since 1.8
 */
function bricksGetFocusables(node) {
  var focusableElements = node.querySelectorAll('a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])');

  // Filter out elements with display: none
  return Array.prototype.filter.call(focusableElements, function (element) {
    return window.getComputedStyle(element).display !== 'none';
  });
}

/**
 * Pause audio/video when popup is closed
 *
 * bricksPauseMediaFn.run() pauses all audio & video.
 *
 * @since 1.8
 */
var bricksPauseMediaFn = new BricksFunction({
  parentNode: document,
  selector: 'video, audio, iframe[src*="youtube"], iframe[src*="vimeo"]',
  subscribeEvents: ['bricks/popup/close'],
  forceReinit: true,
  eachElement: function eachElement(element) {
    // STEP: Pause video or audio
    if ((element.tagName === 'VIDEO' || element.tagName === 'AUDIO') && element.pause && typeof element.pause === 'function') {
      element.pause();
      // Continue next element
      return;
    }

    // STEP: Pause YouTube or Vimeo video
    if (element.tagName === 'IFRAME') {
      var src = element.getAttribute('src');
      var isYoutube = src.includes('youtube');
      var isVimeo = src.includes('vimeo');
      var command = isYoutube ? {
        event: 'command',
        func: 'pauseVideo',
        args: ''
      } : {
        method: 'pause'
      };
      if (isVimeo || isYoutube) {
        // Note that if the youtube video is not enableJSAPI, we can't pause it
        element.contentWindow.postMessage(JSON.stringify(command), '*');
        // Continue next element
        return;
      }
    }
  },
  listenerHandler: function listenerHandler(event) {
    var _event$detail3;
    if (event !== null && event !== void 0 && event.type) {
      switch (event.type) {
        case 'bricks/popup/close':
          var popupElement = event === null || event === void 0 ? void 0 : (_event$detail3 = event.detail) === null || _event$detail3 === void 0 ? void 0 : _event$detail3.popupElement;
          if (popupElement) {
            bricksPauseMediaFn.run({
              parentNode: popupElement
            });
          }
          break;
      }
    }
  }
});

/**
 * Set viewport height CSS variable: --bricks-vh
 *
 * Used in popup to cover viewport correctly on mobile devices.
 *
 * @since 1.8.2
 */
function bricksSetVh() {
  var vh = window.innerHeight * 0.01;

  // Set var on documentElement (<html>)
  document.documentElement.style.setProperty('--bricks-vh', "".concat(vh, "px"));
}

/**
 * Enqueue custom scripts
 */
var bricksIsFrontend;
var bricksScrollTimeout;
var bricksTimeouts = {};
document.addEventListener('DOMContentLoaded', function (event) {
  bricksIsFrontend = document.body.classList.contains('bricks-is-frontend');

  // Nav menu & Dropdown (@since 1.8)
  bricksMultilevelMenu();
  bricksNavMenuMobile();
  bricksStickyHeader();
  bricksOnePageNavigation();
  bricksSkipLinks();
  bricksFacebookSDK();
  bricksSearchToggle();
  bricksPopups();
  bricksSwiper(); // Sequence matters: before bricksSplide()
  bricksSplide(); // Sequence matters: after bricksSwiper()

  // Run after bricksSwiper() & bricksSplide() as those need to generate required duplicate nodes first
  bricksPhotoswipe();
  bricksPrettify();
  bricksAccordion();
  bricksAnimatedTyping();
  bricksAudio();
  bricksCountdown();
  bricksCounter();
  bricksIsotope();
  bricksPricingTables();
  bricksVideo();
  bricksLazyLoad();
  bricksAnimation();
  bricksPieChart();
  bricksProgressBar();
  bricksForm();
  bricksInitQueryLoopInstances();
  bricksQueryPagination();
  bricksInteractions();
  bricksAlertDismiss();
  bricksTabs();
  bricksVideoOverlayClickDetector();
  bricksBackgroundVideoInit();
  bricksNavNested();
  bricksOffcanvas();
  bricksToggle();

  // After bricksNavNested() ran (added .brx-has-multilevel)
  bricksSubmenuListeners();
  bricksSubmenuPosition(250);

  /**
   * Debounce
   *
   * Use timeout object to allow for individual clearTimeout() calls.
   *
   * @since 1.8
   */
  window.addEventListener('resize', function () {
    Object.keys(bricksTimeouts).forEach(function (key) {
      clearTimeout(bricksTimeouts[key]);
    });

    // Frontend: 1vh calculation based on window.innerHeight (for mobile devices)
    if (bricksIsFrontend) {
      bricksTimeouts.bricksVh = setTimeout(bricksSetVh, 250);
    }

    // Builder: Re-init swiperJS on window resize for switching between breakpoints, etc.
    else {
      bricksTimeouts.bricksSwiper = setTimeout(bricksSwiper, 250);
      bricksTimeouts.bricksSplide = setTimeout(bricksSplide, 250);
    }

    // Re-calculate left position on window resize with debounce (@since 1.8)
    bricksTimeouts.bricksSubmenuPosition = setTimeout(bricksSubmenuPosition, 250);

    // Set mobile menu open toggle parent div display according to toggle display
    bricksTimeouts.bricksToggleDisplay = setTimeout(bricksToggleDisplay, 100);
  });

  /**
   * Separate event registration from bricksInteractionsFn
   *
   * 100ms timeout to ensure bricksInteractionsFn has been initialized & set window.bricksData.interactions
   *
   * @since 1.8
   */
  setTimeout(function () {
    var _window$bricksData4;
    var interactions = Array.isArray((_window$bricksData4 = window.bricksData) === null || _window$bricksData4 === void 0 ? void 0 : _window$bricksData4.interactions) ? window.bricksData.interactions : [];

    // Scroll interaction(s) found: Listen to scroll event
    if (interactions.find(function (interaction) {
      return (interaction === null || interaction === void 0 ? void 0 : interaction.trigger) === 'scroll';
    })) {
      document.addEventListener('scroll', bricksScrollInteractions);
    }
  }, 100);
});
