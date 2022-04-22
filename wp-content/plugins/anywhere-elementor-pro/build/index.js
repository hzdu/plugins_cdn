/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "isEditMode", function() { return /* binding */ isEditMode; });
__webpack_require__.d(__webpack_exports__, "SwiperBase", function() { return /* binding */ SwiperBase; });

// CONCATENATED MODULE: ./node_modules/@wordpress/hooks/build-module/validateNamespace.js
/**
 * Validate a namespace string.
 *
 * @param  {string} namespace The namespace to validate - should take the form
 *                            `vendor/plugin/function`.
 *
 * @return {boolean}             Whether the namespace is valid.
 */
function validateNamespace(namespace) {
  if ('string' !== typeof namespace || '' === namespace) {
    // eslint-disable-next-line no-console
    console.error('The namespace must be a non-empty string.');
    return false;
  }

  if (!/^[a-zA-Z][a-zA-Z0-9_.\-\/]*$/.test(namespace)) {
    // eslint-disable-next-line no-console
    console.error('The namespace can only contain numbers, letters, dashes, periods, underscores and slashes.');
    return false;
  }

  return true;
}

/* harmony default export */ var build_module_validateNamespace = (validateNamespace);
//# sourceMappingURL=validateNamespace.js.map
// CONCATENATED MODULE: ./node_modules/@wordpress/hooks/build-module/validateHookName.js
/**
 * Validate a hookName string.
 *
 * @param  {string} hookName The hook name to validate. Should be a non empty string containing
 *                           only numbers, letters, dashes, periods and underscores. Also,
 *                           the hook name cannot begin with `__`.
 *
 * @return {boolean}            Whether the hook name is valid.
 */
function validateHookName(hookName) {
  if ('string' !== typeof hookName || '' === hookName) {
    // eslint-disable-next-line no-console
    console.error('The hook name must be a non-empty string.');
    return false;
  }

  if (/^__/.test(hookName)) {
    // eslint-disable-next-line no-console
    console.error('The hook name cannot begin with `__`.');
    return false;
  }

  if (!/^[a-zA-Z][a-zA-Z0-9_.-]*$/.test(hookName)) {
    // eslint-disable-next-line no-console
    console.error('The hook name can only contain numbers, letters, dashes, periods and underscores.');
    return false;
  }

  return true;
}

/* harmony default export */ var build_module_validateHookName = (validateHookName);
//# sourceMappingURL=validateHookName.js.map
// CONCATENATED MODULE: ./node_modules/@wordpress/hooks/build-module/createAddHook.js
/**
 * Internal dependencies
 */



/**
 * Returns a function which, when invoked, will add a hook.
 *
 * @param  {Object}   hooks Stored hooks, keyed by hook name.
 *
 * @return {Function}       Function that adds a new hook.
 */

function createAddHook(hooks) {
  /**
   * Adds the hook to the appropriate hooks container.
   *
   * @param {string}   hookName  Name of hook to add
   * @param {string}   namespace The unique namespace identifying the callback in the form `vendor/plugin/function`.
   * @param {Function} callback  Function to call when the hook is run
   * @param {?number}  priority  Priority of this hook (default=10)
   */
  return function addHook(hookName, namespace, callback) {
    var priority = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10;

    if (!build_module_validateHookName(hookName)) {
      return;
    }

    if (!build_module_validateNamespace(namespace)) {
      return;
    }

    if ('function' !== typeof callback) {
      // eslint-disable-next-line no-console
      console.error('The hook callback must be a function.');
      return;
    } // Validate numeric priority


    if ('number' !== typeof priority) {
      // eslint-disable-next-line no-console
      console.error('If specified, the hook priority must be a number.');
      return;
    }

    var handler = {
      callback: callback,
      priority: priority,
      namespace: namespace
    };

    if (hooks[hookName]) {
      // Find the correct insert index of the new hook.
      var handlers = hooks[hookName].handlers;
      var i;

      for (i = handlers.length; i > 0; i--) {
        if (priority >= handlers[i - 1].priority) {
          break;
        }
      }

      if (i === handlers.length) {
        // If append, operate via direct assignment.
        handlers[i] = handler;
      } else {
        // Otherwise, insert before index via splice.
        handlers.splice(i, 0, handler);
      } // We may also be currently executing this hook.  If the callback
      // we're adding would come after the current callback, there's no
      // problem; otherwise we need to increase the execution index of
      // any other runs by 1 to account for the added element.


      (hooks.__current || []).forEach(function (hookInfo) {
        if (hookInfo.name === hookName && hookInfo.currentIndex >= i) {
          hookInfo.currentIndex++;
        }
      });
    } else {
      // This is the first hook of its type.
      hooks[hookName] = {
        handlers: [handler],
        runs: 0
      };
    }

    if (hookName !== 'hookAdded') {
      doAction('hookAdded', hookName, namespace, callback, priority);
    }
  };
}

/* harmony default export */ var build_module_createAddHook = (createAddHook);
//# sourceMappingURL=createAddHook.js.map
// CONCATENATED MODULE: ./node_modules/@wordpress/hooks/build-module/createRemoveHook.js
/**
 * Internal dependencies
 */



/**
 * Returns a function which, when invoked, will remove a specified hook or all
 * hooks by the given name.
 *
 * @param  {Object}   hooks      Stored hooks, keyed by hook name.
 * @param  {boolean}     removeAll  Whether to remove all callbacks for a hookName, without regard to namespace. Used to create `removeAll*` functions.
 *
 * @return {Function}            Function that removes hooks.
 */

function createRemoveHook(hooks, removeAll) {
  /**
   * Removes the specified callback (or all callbacks) from the hook with a
   * given hookName and namespace.
   *
   * @param {string}    hookName  The name of the hook to modify.
   * @param {string}    namespace The unique namespace identifying the callback in the form `vendor/plugin/function`.
   *
   * @return {number}             The number of callbacks removed.
   */
  return function removeHook(hookName, namespace) {
    if (!build_module_validateHookName(hookName)) {
      return;
    }

    if (!removeAll && !build_module_validateNamespace(namespace)) {
      return;
    } // Bail if no hooks exist by this name


    if (!hooks[hookName]) {
      return 0;
    }

    var handlersRemoved = 0;

    if (removeAll) {
      handlersRemoved = hooks[hookName].handlers.length;
      hooks[hookName] = {
        runs: hooks[hookName].runs,
        handlers: []
      };
    } else {
      // Try to find the specified callback to remove.
      var handlers = hooks[hookName].handlers;

      var _loop = function _loop(i) {
        if (handlers[i].namespace === namespace) {
          handlers.splice(i, 1);
          handlersRemoved++; // This callback may also be part of a hook that is
          // currently executing.  If the callback we're removing
          // comes after the current callback, there's no problem;
          // otherwise we need to decrease the execution index of any
          // other runs by 1 to account for the removed element.

          (hooks.__current || []).forEach(function (hookInfo) {
            if (hookInfo.name === hookName && hookInfo.currentIndex >= i) {
              hookInfo.currentIndex--;
            }
          });
        }
      };

      for (var i = handlers.length - 1; i >= 0; i--) {
        _loop(i);
      }
    }

    if (hookName !== 'hookRemoved') {
      doAction('hookRemoved', hookName, namespace);
    }

    return handlersRemoved;
  };
}

/* harmony default export */ var build_module_createRemoveHook = (createRemoveHook);
//# sourceMappingURL=createRemoveHook.js.map
// CONCATENATED MODULE: ./node_modules/@wordpress/hooks/build-module/createHasHook.js
/**
 * Returns a function which, when invoked, will return whether any handlers are
 * attached to a particular hook.
 *
 * @param  {Object}   hooks Stored hooks, keyed by hook name.
 *
 * @return {Function}       Function that returns whether any handlers are
 *                          attached to a particular hook and optional namespace.
 */
function createHasHook(hooks) {
  /**
   * Returns whether any handlers are attached for the given hookName and optional namespace.
   *
   * @param {string}  hookName  The name of the hook to check for.
   * @param {?string} namespace Optional. The unique namespace identifying the callback
   *                                      in the form `vendor/plugin/function`.
   *
   * @return {boolean} Whether there are handlers that are attached to the given hook.
   */
  return function hasHook(hookName, namespace) {
    // Use the namespace if provided.
    if ('undefined' !== typeof namespace) {
      return hookName in hooks && hooks[hookName].handlers.some(function (hook) {
        return hook.namespace === namespace;
      });
    }

    return hookName in hooks;
  };
}

/* harmony default export */ var build_module_createHasHook = (createHasHook);
//# sourceMappingURL=createHasHook.js.map
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/iterableToArray.js
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js




function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
// CONCATENATED MODULE: ./node_modules/@wordpress/hooks/build-module/createRunHook.js


/**
 * Returns a function which, when invoked, will execute all callbacks
 * registered to a hook of the specified type, optionally returning the final
 * value of the call chain.
 *
 * @param  {Object}   hooks          Stored hooks, keyed by hook name.
 * @param  {?boolean}    returnFirstArg Whether each hook callback is expected to
 *                                   return its first argument.
 *
 * @return {Function}                Function that runs hook callbacks.
 */
function createRunHook(hooks, returnFirstArg) {
  /**
   * Runs all callbacks for the specified hook.
   *
   * @param  {string} hookName The name of the hook to run.
   * @param  {...*}   args     Arguments to pass to the hook callbacks.
   *
   * @return {*}               Return value of runner, if applicable.
   */
  return function runHooks(hookName) {
    if (!hooks[hookName]) {
      hooks[hookName] = {
        handlers: [],
        runs: 0
      };
    }

    hooks[hookName].runs++;
    var handlers = hooks[hookName].handlers; // The following code is stripped from production builds.

    if (false) {}

    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    if (!handlers || !handlers.length) {
      return returnFirstArg ? args[0] : undefined;
    }

    var hookInfo = {
      name: hookName,
      currentIndex: 0
    };

    hooks.__current.push(hookInfo);

    while (hookInfo.currentIndex < handlers.length) {
      var handler = handlers[hookInfo.currentIndex];
      var result = handler.callback.apply(null, args);

      if (returnFirstArg) {
        args[0] = result;
      }

      hookInfo.currentIndex++;
    }

    hooks.__current.pop();

    if (returnFirstArg) {
      return args[0];
    }
  };
}

/* harmony default export */ var build_module_createRunHook = (createRunHook);
//# sourceMappingURL=createRunHook.js.map
// CONCATENATED MODULE: ./node_modules/@wordpress/hooks/build-module/createCurrentHook.js
/**
 * Returns a function which, when invoked, will return the name of the
 * currently running hook, or `null` if no hook of the given type is currently
 * running.
 *
 * @param  {Object}   hooks          Stored hooks, keyed by hook name.
 *
 * @return {Function}                Function that returns the current hook.
 */
function createCurrentHook(hooks) {
  /**
   * Returns the name of the currently running hook, or `null` if no hook of
   * the given type is currently running.
   *
   * @return {?string}             The name of the currently running hook, or
   *                               `null` if no hook is currently running.
   */
  return function currentHook() {
    if (!hooks.__current || !hooks.__current.length) {
      return null;
    }

    return hooks.__current[hooks.__current.length - 1].name;
  };
}

/* harmony default export */ var build_module_createCurrentHook = (createCurrentHook);
//# sourceMappingURL=createCurrentHook.js.map
// CONCATENATED MODULE: ./node_modules/@wordpress/hooks/build-module/createDoingHook.js
/**
 * Returns a function which, when invoked, will return whether a hook is
 * currently being executed.
 *
 * @param  {Object}   hooks Stored hooks, keyed by hook name.
 *
 * @return {Function}       Function that returns whether a hook is currently
 *                          being executed.
 */
function createDoingHook(hooks) {
  /**
   * Returns whether a hook is currently being executed.
   *
   * @param  {?string} hookName The name of the hook to check for.  If
   *                            omitted, will check for any hook being executed.
   *
   * @return {boolean}             Whether the hook is being executed.
   */
  return function doingHook(hookName) {
    // If the hookName was not passed, check for any current hook.
    if ('undefined' === typeof hookName) {
      return 'undefined' !== typeof hooks.__current[0];
    } // Return the __current hook.


    return hooks.__current[0] ? hookName === hooks.__current[0].name : false;
  };
}

/* harmony default export */ var build_module_createDoingHook = (createDoingHook);
//# sourceMappingURL=createDoingHook.js.map
// CONCATENATED MODULE: ./node_modules/@wordpress/hooks/build-module/createDidHook.js
/**
 * Internal dependencies
 */

/**
 * Returns a function which, when invoked, will return the number of times a
 * hook has been called.
 *
 * @param  {Object}   hooks Stored hooks, keyed by hook name.
 *
 * @return {Function}       Function that returns a hook's call count.
 */

function createDidHook(hooks) {
  /**
   * Returns the number of times an action has been fired.
   *
   * @param  {string} hookName The hook name to check.
   *
   * @return {number}          The number of times the hook has run.
   */
  return function didHook(hookName) {
    if (!build_module_validateHookName(hookName)) {
      return;
    }

    return hooks[hookName] && hooks[hookName].runs ? hooks[hookName].runs : 0;
  };
}

/* harmony default export */ var build_module_createDidHook = (createDidHook);
//# sourceMappingURL=createDidHook.js.map
// CONCATENATED MODULE: ./node_modules/@wordpress/hooks/build-module/createHooks.js
/**
 * Internal dependencies
 */







/**
 * Returns an instance of the hooks object.
 *
 * @return {Object} Object that contains all hooks.
 */

function createHooks() {
  var actions = Object.create(null);
  var filters = Object.create(null);
  actions.__current = [];
  filters.__current = [];
  return {
    addAction: build_module_createAddHook(actions),
    addFilter: build_module_createAddHook(filters),
    removeAction: build_module_createRemoveHook(actions),
    removeFilter: build_module_createRemoveHook(filters),
    hasAction: build_module_createHasHook(actions),
    hasFilter: build_module_createHasHook(filters),
    removeAllActions: build_module_createRemoveHook(actions, true),
    removeAllFilters: build_module_createRemoveHook(filters, true),
    doAction: build_module_createRunHook(actions),
    applyFilters: build_module_createRunHook(filters, true),
    currentAction: build_module_createCurrentHook(actions),
    currentFilter: build_module_createCurrentHook(filters),
    doingAction: build_module_createDoingHook(actions),
    doingFilter: build_module_createDoingHook(filters),
    didAction: build_module_createDidHook(actions),
    didFilter: build_module_createDidHook(filters),
    actions: actions,
    filters: filters
  };
}

/* harmony default export */ var build_module_createHooks = (createHooks);
//# sourceMappingURL=createHooks.js.map
// CONCATENATED MODULE: ./node_modules/@wordpress/hooks/build-module/index.js
/**
 * Internal dependencies
 */


var _createHooks = build_module_createHooks(),
    addAction = _createHooks.addAction,
    addFilter = _createHooks.addFilter,
    removeAction = _createHooks.removeAction,
    removeFilter = _createHooks.removeFilter,
    hasAction = _createHooks.hasAction,
    hasFilter = _createHooks.hasFilter,
    removeAllActions = _createHooks.removeAllActions,
    removeAllFilters = _createHooks.removeAllFilters,
    doAction = _createHooks.doAction,
    applyFilters = _createHooks.applyFilters,
    currentAction = _createHooks.currentAction,
    currentFilter = _createHooks.currentFilter,
    doingAction = _createHooks.doingAction,
    doingFilter = _createHooks.doingFilter,
    didAction = _createHooks.didAction,
    didFilter = _createHooks.didFilter,
    build_module_actions = _createHooks.actions,
    build_module_filters = _createHooks.filters;


//# sourceMappingURL=index.js.map
// CONCATENATED MODULE: ./src/js/base.js


window.aep = {
    hooks : build_module_createHooks()
}

const isEditMode = () => {
    return false;
}

class SwiperBase{

    constructor(data, wid, scope = null) {

        let swiper = [];
        let swiperContainer = '.elementor-element-' + wid + ' .ae-swiper-container';
        if (scope !== null) {
            wid = scope.data('id');
           // console.log(wid);
            const slideId = scope.find('.swiper-container').data('ae-slider-id');
            swiperContainer = '.elementor-element-' + wid + ' .ae-swiper-container[data-ae-slider-id="' + slideId + '"]'
        }
        const wclass = '.elementor-element-' + wid;
       
        if (typeof data === "undefined") {
            return false;
        }

        // Special Case Only For AE-Woo-Gallery
        if(data.hasOwnProperty('widget')){
            if(data.widget == 'ae-woo-gallery' ){
                if (data.navigation != 'no') {
                    swiper['navigation'] = {
                        nextEl: '.ae-swiper-button-next',
                        prevEl: '.ae-swiper-button-prev',
                    }
                }
                swiper['pagination']= {
                    el: '.ae-swiper-pagination',
                    type: 'bullets',
                    clickable: true,
                }
                swiper['init'] = false;
            }
        }else{
            swiper = {
                direction: data.direction,
                speed: data.speed,
                autoHeight: data.autoHeight,
                autoplay: data.autoplay,
                effect: data.effect,
                loop: data.loop,
                //zoom: data.zoom,
                slidesPerView: data.slidesPerView.default,
                slidesPerGroup: data.slidesPerGroup.default,
                spaceBetween: data.spaceBetween.default,
                wrapperClass: 'ae-swiper-wrapper',
                slideClass: 'ae-swiper-slide',
                observer: true,
                observeParents: true,
            }
    
            if (data.loop) {
                if (document.querySelectorAll(wclass + ' .ae-swiper-slide').length < data.slidesPerView.tablet) {
                    swiper['loop'] = false;
                }
            }
    
            // BreakPoints
            const bp = aepro.breakpoints;
    
            let breakpoints = {};
            breakpoints[bp.lg - 1] = {
                spaceBetween: data.spaceBetween.tablet,
                slidesPerView: data.slidesPerView.tablet,
                slidesPerGroup: data.slidesPerGroup.tablet,
            };
            breakpoints[bp.md - 1] = {
                spaceBetween: data.spaceBetween.mobile,
                slidesPerView: data.slidesPerView.mobile,
                slidesPerGroup: data.slidesPerGroup.mobile,
            };
    
            swiper['breakpoints'] = breakpoints;
    
            swiper['keyboard'] = (data.keyboard === 'yes') ? { enabled: true, onlyInViewport: true } : false;
    
            if (data.navigation === 'yes') {
                swiper['navigation'] = {
                    nextEl: wclass + ' .ae-swiper-button-next',
                    prevEl: wclass + ' .ae-swiper-button-prev',
                }
            }
    
            if (data.ptype !== '') {
                swiper['pagination'] = {
                    el: wclass + ' .ae-swiper-pagination',
                    type: data.ptype,
                    clickable: data.clickable
                }
            }
            if (data.scrollbar == 'yes') {
    
                swiper['scrollbar'] = {
                    el: wclass + ' .ae-swiper-scrollbar',
                    hide: true
                };
            }
            swiper['init'] = false;
        }
        

        if ('undefined' === typeof Swiper) {
            const asyncSwiper = elementorFrontend.utils.swiper;
            new asyncSwiper( jQuery( swiperContainer ), swiper).then((newSwiperInstance) => {
                const mswiper = newSwiperInstance;
                this.after_swiper_load_func(mswiper);
                const pause_on_hover = data.pause_on_hover;
                if (pause_on_hover == 'yes') {
                    this.pause_on_hover_func(mswiper, pause_on_hover, wid);
                }

                elementorFrontend.hooks.doAction( `aepro/trigger/swiper/widget/${wid}`, mswiper);
            });
        } else {
            
            const mswiper = new Swiper('.elementor-element-' + wid + ' .ae-swiper-container', swiper);
            //if ('undefined' !== typeof mswiper.$wrapperEl) {
                this.after_swiper_load_func(mswiper);
                const pause_on_hover = data.pause_on_hover;
                if (pause_on_hover == 'yes') {
                    this.pause_on_hover_func(mswiper, pause_on_hover, wid);
                }
           //}

            elementorFrontend.hooks.doAction( `aepro/trigger/swiper/widget/${wid}`, mswiper);
        }
        
        jQuery('.elementor-element-' + wid + ' .ae-swiper-container').css('visibility', 'visible');
        

        // TODO:: Swiper post initialize actions

        // TODO:: Swiper sticky section fix
    }
    after_swiper_load_func(mswiper) {
        if (mswiper.length > 0) {

                mswiper.forEach(function (slider) {

                    slider.on('slideChangeTransitionStart', function () {

                        // set dynamic background
                        slider.$wrapperEl.find('.ae-featured-bg-yes').each(function () {
                            if (jQuery(this).css('background-image') == 'none') {
                                let img = jQuery(this).attr('data-ae-bg');
                                jQuery(this).css('background-image', 'url(' + img + ')');
                            }
                        });
                        slider.$wrapperEl.find('.ae-bg-color-yes').each(function () {
                            let color = jQuery(this).attr('data-ae-bg-color');
                            let blank_color = 'rgba(0, 0, 0, 0)';
                            if (jQuery(this).css('background-color') === blank_color) {
                                jQuery(this).css('background-color', color);
                            }
                        });

                        // reveal animated widgets
                        slider.$wrapperEl.find('.swiper-slide-duplicate').find('.elementor-invisible').each(function () {
                            // get settings
                            elementorFrontend.elementsHandler.runReadyTrigger(jQuery(this));
                        });

                        slider.$wrapperEl.find('.swiper-slide').find('.animated').each(function () {
                            // get settings
                             elementorFrontend.elementsHandler.runReadyTrigger(jQuery(this));
                        });

                        slider.$wrapperEl.find('.swiper-slide-duplicate').find('.has_ae_slider').each(function () {
                            if (jQuery(this).find('.vegas-container')) {
                                // get settings
                                elementorFrontend.elementsHandler.runReadyTrigger(jQuery(this));
                            }
                        });
                   
                    });

                    slider.on('click', function () {

                        const clickedSlide = mswiper.clickedSlide;
                        if (typeof clickedSlide === 'undefined') {
                            return;
                        }

                        const wrapper = clickedSlide.querySelector('.ae-link-yes');

                        if (wrapper === null || wrapper.length == 0) {
                            return;
                        } else {
                            const url = jQuery(wrapper).data('ae-url');
                            if (url !== undefined) {
                                if (jQuery(wrapper).data('ae-url') && jQuery(wrapper).hasClass('ae-new-window-yes')) {
                                    window.open(jQuery(wrapper).data('ae-url'));
                                } else {
                                    location.href = jQuery(wrapper).data('ae-url');
                                }
                            }
                        }
                    });

                    slider.init();
                });

            } else {

                mswiper.on('slideChangeTransitionStart', function () {
                    // set dynamic background
                    mswiper.$wrapperEl.find('.ae-featured-bg-yes').each(function () {
                        
                        if (jQuery(this).css('background-image') == 'none') {
                            let img = jQuery(this).attr('data-ae-bg');
                            jQuery(this).css('background-image', 'url(' + img + ')');
                        }
                    });

                    mswiper.$wrapperEl.find('.ae-bg-color-yes').each(function () {
                        let color = jQuery(this).attr('data-ae-bg-color');
                            let blank_color = 'rgba(0, 0, 0, 0)';
                            if (jQuery(this).css('background-color') === blank_color) {
                                jQuery(this).css('background-color', color);
                            }
                    });
                    // reveal animated widgets
                    mswiper.$wrapperEl.find('.swiper-slide-duplicate').find('.elementor-invisible').each(function () {
                        // get settings
                         elementorFrontend.elementsHandler.runReadyTrigger(jQuery(this));
                    });

                    mswiper.$wrapperEl.find('.swiper-slide').find('.animated').each(function () {
                        // get settings
                         elementorFrontend.elementsHandler.runReadyTrigger(jQuery(this));
                    });

                        mswiper.$wrapperEl.find('.swiper-slide-duplicate').find('.has_ae_slider').each(function () {
                            if (jQuery(this).find('.vegas-container')) {
                                // get settings
                                elementorFrontend.elementsHandler.runReadyTrigger(jQuery(this));
                            }
                        });
                    
                });
                

                mswiper.on('click', function () {

                    const clickedSlide = mswiper.clickedSlide;
                    if (typeof clickedSlide === 'undefined') {
                        return;
                    }

                    const wrapper = clickedSlide.querySelector('.ae-link-yes');

                    if (wrapper === null || wrapper.length == 0) {
                        return;
                    } else {
                        const url = jQuery(wrapper).data('ae-url');
                        if (url !== undefined) {
                            if (jQuery(wrapper).data('ae-url') && jQuery(wrapper).hasClass('ae-new-window-yes')) {
                                window.open(jQuery(wrapper).data('ae-url'));
                            } else {
                                location.href = jQuery(wrapper).data('ae-url');
                            }
                        }
                    }
                });

                mswiper.init();

            }
    }

    pause_on_hover_func(mswiper, pause_on_hover, wid) {
        jQuery('.elementor-element-' + wid + ' .ae-swiper-container').hover(function () {
            mswiper.autoplay.stop();
        }, function () {
            mswiper.autoplay.start();
        });
    }
}

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


const BgSliderHandler = ( $scope , $ ) => {
    
    let wid = $scope.data('id');
    let ae_slider_id = $scope.data('ae_slider');
    let slider_images;
    let aepro_slides = [];
    let aepro_slides_json = [];
    let aepro_transition;
    let aepro_animation;
    let aepro_custom_overlay;
    let aepro_overlay;
    let aepro_cover;
    let aepro_delay;
    let aepro_timer;
    let slider_wrapper;
    if ($scope.children('.aepro-section-bs').children('.aepro-section-bs-inner').hasClass('edit-mode')) {
        slider_wrapper = $scope.children('.aepro-section-bs').children('.aepro-section-bs-inner');
        slider_images = slider_wrapper.data('aepro-bg-slider');
        aepro_transition = slider_wrapper.data('aepro-bg-slider-transition');
        aepro_animation = slider_wrapper.data('aepro-bg-slider-animation');
        aepro_custom_overlay = slider_wrapper.data('aepro-bg-custom-overlay');
        aepro_cover = slider_wrapper.data('aepro-bg-slider-cover');
        aepro_delay = slider_wrapper.data('aepro-bs-slider-delay');
        aepro_timer = slider_wrapper.data('aepro-bs-slider-timer');

        if(aepro_custom_overlay == 'yes'){
            aepro_overlay = aepro.plugin_url + '/includes/assets/lib/vegas/overlays/' + slider_wrapper.data('aepro-bg-slider-overlay');
        }else{
            if(slider_wrapper.data('aepro-bg-slider-overlay')){
                aepro_overlay = aepro.plugin_url + '/includes/assets/lib/vegas/overlays/' + slider_wrapper.data('aepro-bg-slider-overlay');
            }else{
                aepro_overlay = aepro.plugin_url + '/includes/assets/lib/vegas/overlays/' + slider_wrapper.data('aepro-bg-slider-overlay');
            }
        }

        if(typeof slider_images != 'undefined'){
            aepro_slides = slider_images.split(",");

            jQuery.each(aepro_slides,function(key,value){
                var slide = [];
                slide.src = value;
                aepro_slides_json.push(slide);
            });

            slider_wrapper.vegas({
                slides: aepro_slides_json,
                transition:aepro_transition,
                animation: aepro_animation,
                overlay: aepro_overlay,
                cover: aepro_cover,
                delay: aepro_delay,
                timer: aepro_timer,
                init: function(){
                    if(aepro_custom_overlay == 'yes') {
                        var ob_vegas_overlay = slider_wrapper.children('.vegas-overlay');
                        ob_vegas_overlay.css('background-image', '');
                    }
                }
            });

        }
    } else {
        if (ae_slider_id) {
            slider_wrapper = jQuery(".elementor-element-" + wid + "[data-ae_slider='" + ae_slider_id + "']").children('.aepro-section-bs').children('.aepro-section-bs-inner');
            aepro_slides = slider_wrapper.data('aepro-bg-slider');
            if (aepro_slides) {
                slider_images = aepro_slides.slides;
                aepro_transition = aepro_slides.transition;
                aepro_animation = aepro_slides.animation;
                aepro_overlay = aepro_slides.overlay;
                aepro_custom_overlay = aepro_slides.overlay;
                aepro_cover = aepro_slides.cover;
                aepro_delay = aepro_slides.delay;
                aepro_timer = aepro_slides.timer;
                if (typeof slider_images != 'undefined') {
            

                    slider_wrapper.vegas({
                        slides: slider_images,
                        transition: aepro_transition,
                        animation: aepro_animation,
                        overlay: aepro_overlay,
                        cover: aepro_cover,
                        delay: aepro_delay,
                        timer: aepro_timer,
                        init: function () {
                            if (aepro_custom_overlay == 'yes') {
                                var ob_vegas_overlay = slider_wrapper.children('.vegas-overlay');
                                ob_vegas_overlay.css('background-image', aepro_overlay);
                            }
                        }
                    });

                }
            }
        }
    }
};

const DynamicBgHandler = function ($scope, $) {
    var scope_id = $scope.data('id');
    const dynamicBackground = $scope.find('.dynamic-background').data('dynamic_bg');
    if ($scope.hasClass("elementor-element-edit-mode")) {
        var data = {
            post_id : aepro.queried_page.ID,
            action: 'ae_repeater_data',
            nonce: aepro.aep_nonce
        }
   
        if (dynamicBackground) {
            if (dynamicBackground.acf_field_type == 'repeater') {
                //For Repeater Background Image
                if (dynamicBackground.show_featured_bg == 'yes' && dynamicBackground.bg_source == 'custom_field') {
            
                    let fieldName = dynamicBackground.cf_field_key;
                    let imageSize = dynamicBackground.image_size;

                    data['fieldType'] = 'image';
                    data['image_size'] = imageSize;
                    data['fieldName'] = fieldName;
                    jQuery.ajax({
                        url: aepro.ajaxurl,
                        dataType: 'json',
                        data: data,
                        
                        method: 'POST',
                        success: function (res) {
                            if (res.data) {
                                if (res.data['field_type'] == 'image')
                                    $scope.css('background-image', 'url(' + res.data['value'][0] + ')');
                            }
                            
                        }
                    });
                }

                //For Repeater Background Color
                if (dynamicBackground.enable_bg_color == 'yes' && dynamicBackground.bg_color_source == 'custom_field') {
                    let fieldName = dynamicBackground.cf_color_field_key;

                    data['fieldType'] = 'color';
                    data['fieldName'] = fieldName;
                    jQuery.ajax({
                        url: aepro.ajaxurl,
                        dataType: 'json',
                        data: data,
                    
                        method: 'POST',
                        success: function (res) {
                            if (res.data) {
                                if (res.data['field_type'] == 'color')
                                    $scope.css('background-color', res.data['value']);
                            }
                        }
                    });
                }
            }

            //For Flexible Background Color
            if (dynamicBackground.acf_field_type == 'flexible_content') {
                if (dynamicBackground.show_featured_bg == 'yes' && dynamicBackground.bg_source == 'custom_field') {
                    if (dynamicBackground.bg_flexible_field == 'yes') {
                        let flexibleField = dynamicBackground.cf_field_key;
                        let fieldName = dynamicBackground.flex_sub_field;
                        let imageSize = dynamicBackground.image_size;
                        data['flexible_field'] = flexibleField;

                        data['fieldType'] = 'image';
                        data['image_size'] = imageSize;
                        data['fieldName'] = fieldName;
                        jQuery.ajax({
                            url: aepro.ajaxurl,
                            dataType: 'json',
                            data: data,
                        
                            method: 'POST',
                            success: function (res) {
                                if (res.data) {
                                    if (res.data['field_type'] == 'image')
                                        $scope.css('background-image', 'url(' + res.data['value'][0] + ')');
                                }
                            
                            }
                        });
                    }
                }
            
                //For Flexible Background Color
                if (dynamicBackground.enable_bg_color == 'yes' && dynamicBackground.bg_color_source == 'custom_field') {
                    if (dynamicBackground.bg_color_flexible_field == 'yes') {
                        let flexibleField = dynamicBackground.cf_color_field_key;
                        let fieldName = dynamicBackground.flex_color_sub_field;
                        data['flexible_field'] = flexibleField;

                        data['fieldType'] = 'color';
                        data['fieldName'] = fieldName;
                        jQuery.ajax({
                            url: aepro.ajaxurl,
                            dataType: 'json',
                            data: data,
                        
                            method: 'POST',
                            success: function (res) {
                                if (res.data) {
                                    if (res.data['field_type'] == 'color')
                                        $scope.css('background-color', res.data['value']);
                                }
                            
                            }
                        });
                    }
                }
            }
        }
        
    }   
     
    

    //Dynamic Background Image
    if ( $scope.data( 'ae-bg' ) ){
        $scope.css('background-image','url(' + $scope.data( 'ae-bg' ) + ')');
    }

    //Dynamic Background Color
    if ($scope.data('ae-bg-color')) {
        $scope.css('background-color', $scope.data( 'ae-bg-color' ));
    }

    // TODO:: Add BGSLIDER
    BgSliderHandler( $scope , $);

    if(elementorFrontend.isEditMode()){
        return;
    }

    if($scope.parents('.ae-carousel-yes').length > 0){
        return;
    }

    if($scope.parents('.facetwp-template ').length > 0 ) {
        return;
    }


    if ( $scope.data( 'ae-url' ) && $scope.hasClass('ae-link-yes') ){
        $scope.on('click', function (e) {
            if ( $scope.data( 'ae-url' ) && $scope.hasClass('ae-new-window-yes') ) {
                window.open($scope.data('ae-url'));
            }else{
                location.href = $scope.data('ae-url');
            }
        })
    }
};

/* harmony default export */ __webpack_exports__["default"] = (DynamicBgHandler);

( function( $ ) {

    $(window).on( 'elementor/frontend/init', function() {
        elementorFrontend.hooks.addAction('frontend/element_ready/global', DynamicBgHandler);
    });
})(jQuery);

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const createHTMLMapMarker = ({ OverlayView = google.maps.OverlayView, ...args}) => {
  class HTMLMapMarker extends OverlayView {
    constructor() {
      super();
      this.position = args.position;
      this.html = args.html;
      this.markerIndex = args.markerIndex;
      this.setMap(args.map);
    }

    createDiv() {
      this.div = document.createElement("div");
      this.div.classList.add('ae-map-marker-icon-wrapper');
      this.div.style.position = "absolute";
      if (this.html) {
        this.div.innerHTML = this.html;
      }
      google.maps.event.addDomListener(this.div, "click", event => {
        google.maps.event.trigger(this, "click");
      });
    }

    appendDivToOverlay() {
      const panes = this.getPanes();
      panes.overlayImage.appendChild(this.div);
    }

    getPopup() {
      return document.querySelector('#infowindow-' + this.markerIndex);
    }

    positionDiv() {
      const point = this.getProjection().fromLatLngToDivPixel(this.position);
      //let offset = 50;
      if (point) {
        //this.div.style.left = `${point.x - 12}px`;
        //this.div.style.top = `${point.y - offset}px`;
        this.div.style.left = `${point.x}px`;
        this.div.style.top = `${point.y}px`;
      }
    }

    draw() {
      if (!this.div) {
        this.createDiv();
        this.appendDivToOverlay();
      }
      this.positionDiv();
    }

    remove() {
      if (this.div) {
        this.div.parentNode.removeChild(this.div);
        this.div = null;
      }
    }

    getPosition() {
      return this.position;
    }

    getDraggable() {
      return false;
    }
  }

  return new HTMLMapMarker();
};

/* harmony default export */ __webpack_exports__["default"] = (createHTMLMapMarker);


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const customOverlay =  ({ OverlayView = google.maps.OverlayView, ...args}) => {
  class CustomOverlay extends OverlayView {
    constructor() {
      super();
      this.position = args.position;
      this.html = args.html;
      this.markerIndex = args.markerIndex;
      this.setMap(args.map);
    }

    createDiv() {
      this.div = document.createElement("div");
      this.div.classList.add('ae-map-infowindow-wrapper');
      this.div.style.position = "absolute";
      if (this.html) {
        this.div.innerHTML = this.html;
      }
    }

    appendDivToOverlay() {
      const panes = this.getPanes();
      panes.overlayImage.appendChild(this.div);
    }

    positionDiv() {
      const point = this.getProjection().fromLatLngToDivPixel(this.position);
      //let offset = 50;
      if (point) {
        //this.div.style.left = `${point.x - 12}px`;
        //this.div.style.top = `${point.y - offset}px`;
        this.div.style.left = `${point.x}px`;
        this.div.style.top = `${point.y}px`;
      }
    }

    draw() {
      if (!this.div) {
        this.createDiv();
        this.appendDivToOverlay();
      }
      this.positionDiv();
    }

    remove() {
      if (this.div) {
        this.div.parentNode.removeChild(this.div);
        this.div = null;
      }
    }

    getPosition() {
      return this.position;
    }

    getDraggable() {
      return false;
    }
  }

  return new CustomOverlay();
};

/* harmony default export */ __webpack_exports__["default"] = (customOverlay);


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(0);
__webpack_require__(5);
__webpack_require__(6);
__webpack_require__(7);
__webpack_require__(8);
__webpack_require__(9);
__webpack_require__(10);
__webpack_require__(11);
__webpack_require__(12);
__webpack_require__(13);
__webpack_require__(14);
__webpack_require__(15);
__webpack_require__(16);
__webpack_require__(17);
__webpack_require__(18);
__webpack_require__(3);
__webpack_require__(19);
__webpack_require__(1);
__webpack_require__(20);
__webpack_require__(2);
__webpack_require__(21);
__webpack_require__(22);
__webpack_require__(23);
__webpack_require__(24);
__webpack_require__(25);
__webpack_require__(26);
__webpack_require__(27);
__webpack_require__(28);
__webpack_require__(29);
__webpack_require__(30);
__webpack_require__(31);
__webpack_require__(32);
__webpack_require__(33);
__webpack_require__(34);
module.exports = __webpack_require__(35);


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var _dynamic_bg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1);


(function($){
    const AcfFlexibleCarousel = ( $scope , $ ) => {
        // Carousel
        if($scope.find('.ae-swiper-outer-wrapper').hasClass('ae-carousel-yes')) {
            const wid = $scope.data('id');
            const outer_wrapper = $scope.find('.ae-swiper-outer-wrapper');
            const swiper_settings = outer_wrapper.data('swiper-settings');
            new _base__WEBPACK_IMPORTED_MODULE_0__["SwiperBase"]( swiper_settings, wid );
        }

        if(elementorFrontend.isEditMode()){
            
            $scope.find('.elementor-section').each(function(){
                elementorFrontend.elementsHandler.runReadyTrigger(jQuery(this));
            });

            $scope.find('.elementor-column').each(function(){
                elementorFrontend.elementsHandler.runReadyTrigger(jQuery(this));
            });
        }   
    }
    $(window).on( 'elementor/frontend/init', function() {
        elementorFrontend.hooks.addAction('frontend/element_ready/ae-acf-flexible-content.carousel', AcfFlexibleCarousel);
    });
})( jQuery );

/***/ }),
/* 6 */
/***/ (function(module, exports) {

(function($){
    const AcfFlexibleGrid = ( $scope , $ ) => {
        const grid = $scope.find('.ae-acf-fc-collection');
        // Masonry Layout
        if($scope.find('.ae-acf-fc-outer-wrapper').hasClass('ae-acf-fc-masonry-yes')){
             const $grid_obj = grid.masonry({
                 horizontalOrder: true
             });
             $grid_obj.imagesLoaded().progress(function(){
                 $grid_obj.masonry('layout');
             });

         }
         if(elementorFrontend.isEditMode()){
            
            $scope.find('.elementor-section').each(function(){
                elementorFrontend.elementsHandler.runReadyTrigger(jQuery(this));
            });

            $scope.find('.elementor-column').each(function(){
                elementorFrontend.elementsHandler.runReadyTrigger(jQuery(this));
            });
        }
    }
    $(window).on( 'elementor/frontend/init', function() {
        elementorFrontend.hooks.addAction('frontend/element_ready/ae-acf-flexible-content.grid', AcfFlexibleGrid);
    });
})( jQuery );

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


( function( $ ) {

    var ACFGalleryCarousel = function ( $scope , $ ) {
        const outer_wrapper =  $scope.find('.ae-swiper-outer-wrapper');
        const wid = $scope.data('id');
        const swiper_settings = outer_wrapper.data('swiper-settings');

        new _base__WEBPACK_IMPORTED_MODULE_0__["SwiperBase"]( swiper_settings, wid, $scope);
    };

    $(window).on( 'elementor/frontend/init', function() {
        elementorFrontend.hooks.addAction( 'frontend/element_ready/ae-acf-gallery.carousel', 	 ACFGalleryCarousel );
    });

})( jQuery );



/***/ }),
/* 8 */
/***/ (function(module, exports) {

(function($){
    const ACFGalleryGrid = ( $scope , $ ) => {
        var $wrapper = $scope.find('.ae-grid-wrapper');
        if($scope.find('.ae-grid-wrapper').hasClass('ae-masonry-yes')){
            var grid = $scope.find('.ae-grid');
            var $grid_obj = grid.masonry({
            });

            $grid_obj.imagesLoaded().progress(function(){
                $grid_obj.masonry('layout');
            });
        }
        if(!$wrapper.hasClass('ae-hover-direction-effect')) {
            $scope.find('.ae-grid-item').hover(function(){
                $(this).find('.ae-grid-overlay').addClass('animated');
            });
         }
        if($wrapper.hasClass('ae-hover-direction-effect')){
            const  overlay_speed = parseInt($wrapper.attr('data-overlay-speed'));
            $scope.find('.ae-grid-item').hover(function () {
                $(this).find('.ae-grid-overlay').addClass('aep-overlay');
            });
            
            $wrapper.find('.ae-grid-item' ).hoverdir({
                speed: overlay_speed,
                hoverElem : '.ae-grid-overlay'
            });
        };
    };

    $(window).on( 'elementor/frontend/init', function() {
       
        elementorFrontend.hooks.addAction('frontend/element_ready/ae-acf-gallery.grid', ACFGalleryGrid);
    });
})(jQuery);



/***/ }),
/* 9 */
/***/ (function(module, exports) {

(function($){
    const ACFGalleryJustified = ( $scope , $ ) => {
        var $wrapper = $scope.find('.ae-jg-wrapper');
        if(!$wrapper.hasClass('justified-gallery')){
            return;
        }
        if($scope.find('.justified-gallery')){
            const grid_wrap = $scope.find('.justified-gallery');
            const jg_settings = grid_wrap.data('jg-settings');
            const rowHeight = (jg_settings.row_height.size === '') ? 200 :jg_settings.row_height.size;
            const gap = (jg_settings.gap.size === '') ? 10 :jg_settings.gap.size;
            const max_row = (jg_settings.max_row === '') ? 0 :jg_settings.max_row;
            const last_row = jg_settings.last_row;
            
            $(grid_wrap).justifiedGallery({
                rowHeight: rowHeight, 
                margins: gap,
                lastRow: last_row,
                maxRowsCount : max_row,
                cssAnimation: true,
                captions : false,
            });
            if(!$wrapper.hasClass('ae-hover-direction-effect')) {
                $scope.find('.ae-jg-item-inner').hover(function(){
                    $(this).find('.ae-grid-overlay').addClass('animated');
                });
             }
             if($wrapper.hasClass('ae-hover-direction-effect')){
                const  overlay_speed = parseInt($wrapper.attr('data-overlay-speed'));
                $scope.find('.ae-jg-item-inner').hover(function () {
                    $(this).find('.ae-grid-overlay').addClass('aep-overlay');
                });
                
                $wrapper.find('.ae-jg-item-inner').hoverdir({
                        speed: overlay_speed,
                        hoverElem : '.ae-grid-overlay'
                });
                
            };
        }
    }; 

    $(window).on( 'elementor/frontend/init', function() {
        elementorFrontend.hooks.addAction('frontend/element_ready/ae-acf-gallery.justified', ACFGalleryJustified);
    });
})(jQuery);

/***/ }),
/* 10 */
/***/ (function(module, exports) {

(function($){
    const ACFGallerySmartGrid = ( $scope , $ ) => {
        var $wrapper = $scope.find('.ae-acf-gallery-layout-smart-grid');
        console.log($wrapper);
        if ($scope.find('.ae-acf-gallery-layout-smart-grid')) {
            let grid_wrapper = $scope.find('.ae-grid-wrapper');
            let ae_grid = grid_wrapper.find('.ae-grid');
            let ae_grid_smart = grid_wrapper.find('.ae-grid-smart');
            if (($('body').data('elementor-device-mode') == 'tablet' || $('body').hasClass('elementor-device-tablet'))
                || ($('body').data('elementor-device-mode') == 'mobile' || $('body').hasClass('elementor-device-mobile'))) {
                $(ae_grid_smart).prepend(ae_grid.html());
                ae_grid.hide();
            }
        }

        if(!$wrapper.hasClass('ae-hover-direction-effect')) {
            $scope.find('.ae-grid-item').hover(function(){
                $(this).find('.ae-grid-overlay').addClass('animated');
            });
         }
        if($wrapper.hasClass('ae-hover-direction-effect')){
            console.log("Enter");
            const  overlay_speed = parseInt($wrapper.attr('data-overlay-speed'));
            $scope.find('.ae-grid-item-inner').hover(function () {
                $(this).find('.ae-grid-overlay').addClass('aep-overlay');
            });
            
            $wrapper.find('.ae-grid-item-inner' ).hoverdir({
                    speed: overlay_speed,
                    hoverElem : '.ae-grid-overlay'
            });
           
        };
    };


    $(window).on( 'elementor/frontend/init', function() {
        elementorFrontend.hooks.addAction('frontend/element_ready/ae-acf-gallery.smart_grid', ACFGallerySmartGrid);
    });
})(jQuery);



/***/ }),
/* 11 */
/***/ (function(module, exports) {

(function($){

    const ACFRepeaterAccordionHandler = ($scope, $) => {
        const tid = $scope.find('.ae-accordion').data('tab-id');
        const title = $scope.find('[data-tab-id="' + tid + '"] > .ae-accordion-item > .elementor-tab-title.ae-tab-title');
        const speed = $scope.find('.ae-accordion[data-tab-id="' + tid + '"]').data('transition-speed');
        const expand_button = $scope.find('[data-tab-id="' + tid + '"] .ae-accordion-toggle-button.expand');
        const collapse_button = $scope.find('[data-tab-id="' + tid + '"] .ae-accordion-toggle-button.collapse');
        let acc_status = 'start';
        (title).on('click', function (e) {
            e.preventDefault();
            collapse_button.removeClass('active');
            expand_button.removeClass('active');
            acc_status = 'start';
            const $this = $(this);
            if ($this.hasClass("ae-active")) {
                $this.removeClass("ae-active");
                $this.next().slideUp(speed);
            } else {
                $this
                    .parent()
                    .parent()
                    .find(".elementor-tab-title.ae-tab-title")
                    .removeClass("ae-active");
                $this
                    .parent()
                    .parent()
                    .find(".ae-tab-content.ae-acf-repeater-accordion")
                    .slideUp(speed);
                $this.toggleClass("ae-active");
                $this.next().css({ opacity: '0' });
                $this.next().slideDown(speed, 'linear', function () {
                    $this.next().css({ opacity: '1'});
                    /* $this.next().find('.elementor-section').each(function () {
                        elementorFrontend.elementsHandler.runReadyTrigger(jQuery(this));
                    });

                    $this.next().find('.elementor-column').each(function(){
                        elementorFrontend.elementsHandler.runReadyTrigger(jQuery(this));
                    });
                    
                    $this.next().find('.elementor-widget').each(function(){
                        elementorFrontend.elementsHandler.runReadyTrigger(jQuery(this));
                    }); */
                });
            }
            if ('undefined' !== typeof $this.data('hashtag')) {
                window.location.hash = $this.data('hashtag');
            }

            // setTimeout(function () {
                /* Initialise ACF Gallery on Ajax */
               /*  $this.siblings('.ae-tab-content').find('.elementor-widget-ae-acf-gallery').each(function () {
                    elementorFrontend.elementsHandler.runReadyTrigger(jQuery(this));
                });
                 
                $this.siblings('.ae-tab-content').find('[data-widget_type="ae-post-blocks-adv.carousel"]').each(function () {
                    elementorFrontend.elementsHandler.runReadyTrigger(jQuery(this));
                }); */
                 
                
             //}, 50);
        });
        (expand_button).on('click',function(e){
            e.preventDefault();
            const $this = $(this);
            var role = $(this).data('role');
            if(acc_status == role){
                return;
            }else{
                acc_status = role;
                collapse_button.removeClass('active');
                $this.toggleClass('active');
                title.each(function(index,element){
                    $(element).addClass('ae-active');
                    var content = $(element).next();
                    content.slideDown(speed);
                    content.addClass('ae-active');
                });
            }
        });
        (collapse_button).on('click',function(e){
            e.preventDefault();
            const $this = $(this);
            var role = $(this).data('role');
            if(acc_status == role){
                return;
            } else {
                acc_status = role;
                expand_button.removeClass('active');
                $this.toggleClass('active');
                title.each(function (index, element) {
                    $(element).removeClass('ae-active'); 
                    var content = $(element).next();
                    content.slideUp(speed);
                    //content.removeClass('ae-active');
                });
            }
        });

        let $hashtag = window.location.hash.substring(1);
        if ($hashtag) {
            let $tab = title.filter('[data-hashtag="' + $hashtag + '"]');
            if ($tab.length > 0) {
                if (!$tab.hasClass('ae-active')) {
                    jQuery($tab).trigger('click');
                }
                let $tab_offset = parseInt(jQuery($tab).offset().top);
                jQuery('html, body').animate({
                    scrollTop: $tab_offset - 100
                }, 1000);
            }
        }
    };

    $(window).on( 'elementor/frontend/init', function() {
        elementorFrontend.hooks.addAction( 'frontend/element_ready/ae-acf-repeater.accordion',  ACFRepeaterAccordionHandler );
    });

})(jQuery);

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var _dynamic_bg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1);



( function( $ ) {

    const ACFRepeaterDefaultHandler = ($scope, $) => {

        const grid = $scope.find('.ae-acf-repeater-wrapper');

        // Masonry Layout
        if ($scope.find('.ae-acf-repeater-widget-wrapper').hasClass('ae-masonry-yes')) {
            const $grid_obj = grid.masonry({
                horizontalOrder: true
            });
            $grid_obj.imagesLoaded().progress(function () {
                $grid_obj.masonry('layout');
            });
        }

        // Carousel
        if ($scope.find('.ae-acf-repeater-widget-wrapper').hasClass('ae-carousel-yes')) {
            const wid = $scope.data('id');
            const outer_wrapper = $scope.find('.ae-swiper-outer-wrapper');
            const swiper_settings = outer_wrapper.data('swiper-settings');
            new _base__WEBPACK_IMPORTED_MODULE_0__["SwiperBase"](swiper_settings, wid, $scope);
        }

        //Refresh Dynamic BG in Edit Mode
        if (_base__WEBPACK_IMPORTED_MODULE_0__["isEditMode"]) {
            const sections = $scope.find('.elementor-section');
            $.each(sections, function (key, $section) {
                Object(_dynamic_bg__WEBPACK_IMPORTED_MODULE_1__["default"])($($section), $);
            });

            const columns = $scope.find('.elementor-column');
            $.each(columns, function (key, $column) {
                Object(_dynamic_bg__WEBPACK_IMPORTED_MODULE_1__["default"])($($column), $);
            });
        }

    }

    $(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/ae-acf-repeater.default', ACFRepeaterDefaultHandler);
    });
})(jQuery);

/***/ }),
/* 13 */
/***/ (function(module, exports) {

(function($){

    const ACFRepeaterTabsHandler = ( $scope, $ ) => {

        const tid = $scope.find('.ae-acf-repeater-tabs').data('tab-id');
        var defaultActiveTab = $scope.find('.ae-acf-repeater-tabs').data('active-tab'),
            $tabsTitles,
            $tabs,
            $active,
            $content,
            $counter = 0;

        if ( ! defaultActiveTab ) {
            defaultActiveTab = 1;
        }
        if ($('body').data('elementor-device-mode') == 'mobile') {
            $tabsTitles = $scope.find('[data-tab-id="' + tid + '"] > .ae-acf-repeater-tabs-content-wrapper > .ae-acf-repeater-tab-mobile-title');    
        } else {
            $tabsTitles = $scope.find('[data-tab-id="' + tid + '"] > .ae-acf-repeater-tabs-wrapper > .ae-acf-repeater-tab-desktop-title');
        }
        
        $tabs = $scope.find('[data-tab-id="' + tid + '"] > .ae-acf-repeater-tabs-content-wrapper > .ae-acf-repeater-tab-content');

        $counter = 1;

        const activateTab = ( tabIndex ) => {
            if ( $active ) {
                $active.removeClass( 'active' );
                $content.hide();
            }

            $active = $tabsTitles.filter( '[data-tab="' + tabIndex + '"]' );
            $active.addClass( 'active' );

            $content = $tabs.filter( '[data-tab="' + tabIndex + '"]' );
            $content.show();

           

            
            if ('undefined' !== typeof $active.data('hashtag')) {
                window.location.hash = $active.data('hashtag');
            }
        };

        activateTab( defaultActiveTab );
        $tabsTitles.on( 'click', function() {
            activateTab( this.dataset.tab );

        });

        let $hashtag = window.location.hash.substring(1);
        if ($hashtag) {
            let $tab = $tabsTitles.filter('[data-hashtag="' + $hashtag + '"]');
            if ($tab.length > 0) {
                if (!$tab.hasClass('ae-active')) {
                    activateTab($tab.data('tab'));
                }
                jQuery('html, body').animate({
                    scrollTop: parseInt(jQuery($tab).offset().top) - 100
                }, 1000);
            }
        }

    };

    $(window).on( 'elementor/frontend/init', function() {
        elementorFrontend.hooks.addAction( 'frontend/element_ready/ae-acf-repeater.tabs',   ACFRepeaterTabsHandler );
    });
})(jQuery);

/***/ }),
/* 14 */
/***/ (function(module, exports) {

const FoldToUnfold = ($scope, $) => {

    if($scope.find('.ae-acf-wrapper').hasClass('ae-acf-unfold-yes')) {
        const acfcontent = $scope.find('.ae-acf-wrapper');
        const acfcontentinner = $scope.find('.ae-acf-content-wrapper');
        const acfcontentunfold = acfcontent.find('.ae-acf-unfold');
        const acfcontentunfoldlink = acfcontentunfold.find('.ae-acf-unfold-link');
        const acfcontentunfoldlinktext = acfcontentunfold.find('.ae-acf-unfold-button-text');
        const acfcontentunfoldlinkicon = acfcontentunfold.find('.ae-acf-unfold-button-icon');
        let totalHeight = 0;
        totalHeight = acfcontentinner.outerHeight();
        if(totalHeight){
            totalHeight += acfcontentunfold.outerHeight();
        }
        if((acfcontentinner.outerHeight() <= acfcontentunfold.data('unfold-max-height')) && acfcontentunfold.data('auto-hide-unfold') == 'yes' ){
            acfcontentunfold.css({ 'display': 'none'});
        }else {
            acfcontentunfoldlink.on('click', function () {
                if (acfcontentunfold.hasClass('fold')) {
                    acfcontent.css({
                        'height': acfcontent.outerHeight(),
                        'max-height': 9999
                    }).animate({'height': totalHeight}, {'duration': acfcontentunfold.data('animation-speed')});
                    acfcontentunfold.toggleClass('fold');
                    acfcontentunfoldlinktext.html(acfcontentunfold.data('fold-text'));
                    acfcontentunfoldlinkicon.html('<i class="' + acfcontentunfold.data('fold-icon') + '"></i>');
                } else {
                    acfcontent.css({'max-height': totalHeight}).animate({'max-height': acfcontentunfold.data('unfold-max-height')}, {'duration': acfcontentunfold.data('animation-speed')});
                    acfcontentunfold.toggleClass('fold');
                    acfcontentunfoldlinktext.html(acfcontentunfold.data('unfold-text'))
                    acfcontentunfoldlinkicon.html('<i class="' + acfcontentunfold.data('unfold-icon') + '"></i>');
                }

            });
        }

    }
};

(function($){

    $(window).on( 'elementor/frontend/init', function() {
        elementorFrontend.hooks.addAction( 'frontend/element_ready/ae-acf.wysiwyg', FoldToUnfold );
        elementorFrontend.hooks.addAction( 'frontend/element_ready/ae-acf.text-area',   FoldToUnfold );
    });

})(jQuery);

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


(function($){
    const AeTaxonomyBlocksAccordionHandler = ( $scope , $ ) => {
        const wid = $scope.data('id');
        const outer_wrapper = $scope.find('.ae-taxonomy-widget-wrapper');
        const expand_button = $scope.find('.ae-accordion-toggle-button.expand');
        const collapse_button = $scope.find('.ae-accordion-toggle-button.collapse');
        const items = $scope.find(".ae-accordion-item");
        const swiper_settings = outer_wrapper.data('swiper-settings');
        let title_nav = '';
        // if($(outer_wrapper).hasClass('ae-swiper-nav-align-title')){
        //     const next_button = $scope.find('.ae-term-blocks-title .ae-swiper-button-next');
        //     const prev_button = $scope.find('.ae-term-blocks-title .ae-swiper-button-prev');
        //     console.log('next button -> ', next_button);
        //     console.log('prev button -> ', prev_button);
        //     next_button.on('click', function(e){
        //         e.preventDefault();
        //         const $this = $(this);
        //         const curr_item = $this.closest('.ae-accordion-item');
        //         const el = $(curr_item).find('.ae-swiper-container');
        //         console.log(el);
        //     })
        // }
        
        let acc_status = 'start';
        let toggle = '';
        
        if ($scope.hasClass('ae-tb-layout-carousel')) {
            $.each(items,function(i,item){
                let tid = $(item).data('item-id');
                new _base__WEBPACK_IMPORTED_MODULE_0__["SwiperBase"](swiper_settings, tid);
            })
            
        }
        if(outer_wrapper.hasClass('ae-toggle-yes')){
            toggle = true;
        }

        if(elementorFrontend.isEditMode()){
            
            $scope.find('.elementor-section').each(function(){
                elementorFrontend.elementsHandler.runReadyTrigger(jQuery(this));
            });

            $scope.find('.elementor-column').each(function(){
                elementorFrontend.elementsHandler.runReadyTrigger(jQuery(this));
            });
        }

            
    };

    $(window).on( 'elementor/frontend/init', function() {
        elementorFrontend.hooks.addAction('frontend/element_ready/ae-taxonomy-blocks.term_post_loop', AeTaxonomyBlocksAccordionHandler);
    });
})(jQuery);

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


(function($){
    const AeTaxonomyBlocks = ( $scope , $ ) => {
        
        if ($scope.find('.ae-taxonomy-widget-wrapper').hasClass('ae-carousel-yes')) {
            
            const wid = $scope.data('id');
            const outer_wrapper = $scope.find('.ae-swiper-outer-wrapper');
            const swiper_settings = outer_wrapper.data('swiper-settings');
            new _base__WEBPACK_IMPORTED_MODULE_0__["SwiperBase"](swiper_settings, wid);
        }
            
    };

    $(window).on( 'elementor/frontend/init', function() {
        elementorFrontend.hooks.addAction('frontend/element_ready/ae-taxonomy-blocks.card', AeTaxonomyBlocks);
        elementorFrontend.hooks.addAction('frontend/element_ready/ae-taxonomy-blocks.classic', AeTaxonomyBlocks);
    });
})(jQuery);

/***/ }),
/* 17 */
/***/ (function(module, exports) {

(function($){

    const CFGoogleMap = ( $scope , $) => {

        if($scope.find('.ae-cf-gmap').length) {
            
            const add_marker = ($marker, map) => {
                // var
                const latlng = new google.maps.LatLng($marker.attr('data-lat'), $marker.attr('data-lng'));

                // create marker
                var marker = new google.maps.Marker({
                    position: latlng,
                    map: map,
                });

                // add to array
                map.markers.push(marker);

                // if marker contains HTML, add it to an infoWindow

                if ($marker.html()) {
                    // create info window
                    var infowindow = new google.maps.InfoWindow({
                        content: $marker.html()
                    });

                    // show info window when marker is clicked
                    google.maps.event.addListener(marker, 'click', function () {
                        infowindow.open(map, marker);
                    });
                }
            }

            const new_map = ($el) => {
                const zoom = $scope.find('.ae-cf-gmap').data('zoom');
                const $markers = $el.find('.marker');
                const styles = $scope.find('.ae-cf-gmap').data('styles');
                
                // vars
                const args = {
                    zoom: zoom,
                    center: new google.maps.LatLng(0, 0),
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    styles: styles
                };

                // create map
                const map = new google.maps.Map($el[0], args);

                // add a markers reference
                map.markers = [];

                // add markers
                console.log({$markers});
                $markers.each(function () {
                    add_marker(jQuery(this), map);
                });

                // center map
                center_map(map, zoom);

                // return
                return map;
            }

            

            const center_map = (map, zoom) => {

                // vars
                var bounds = new google.maps.LatLngBounds();
                // loop through all markers and create bounds
                jQuery.each(map.markers, function (i, marker) {
                    var latlng = new google.maps.LatLng(marker.position.lat(), marker.position.lng());
                    bounds.extend(latlng);
                });

                // only 1 marker?
                if (map.markers.length == 1) {
                    // set center of map
                    map.setCenter(bounds.getCenter());
                    map.setZoom(zoom);
                }
                else {
                    // fit to bounds
                    map.fitBounds(bounds);
                }
            }

            map = new_map($scope.find('.ae-cf-gmap'));
        }

        

    };

    $(window).on( 'elementor/frontend/init', function() {
        elementorFrontend.hooks.addAction( 'frontend/element_ready/ae-cf-google-map.default', 	CFGoogleMap );
    });
})(jQuery);

/***/ }),
/* 18 */
/***/ (function(module, exports) {

(function($){

    const CustomFieldHandler = function ( $scope , $ ) {

        if(elementorFrontend.isEditMode()){
            return;
        }

        if($scope.find('.ae-cf-wrapper').hasClass('hide')){
            $scope.find('.ae-cf-wrapper').closest('.elementor-widget-ae-custom-field').hide();
        }
    };

    $(window).on( 'elementor/frontend/init', function() {
        elementorFrontend.hooks.addAction( 'frontend/element_ready/ae-custom-field.default', CustomFieldHandler );
    });

})(jQuery);

/***/ }),
/* 19 */
/***/ (function(module, exports) {

(function ($) {
    'use strict';

    function Hoverdir(element, options) {
        this.$el = $(element);
        // set options
        this.options = $.extend(true, {}, this.defaults, options);
        // initialize visibility to false for show and hide method
        this.isVisible = false;
        // get the hover for this element
        this.$hoverElem = this.$el.find(this.options.hoverElem);
        // transition properties
        this.transitionProp = 'all ' + this.options.speed + 'ms ' + this.options.easing;
        // support for CSS transitions
        this.support = this._supportsTransitions();
        // load the events
        this._loadEvents();
    }

    Hoverdir.prototype = {
        defaults: {
            speed: 300,
            easing: 'ease',
            hoverDelay: 0,
            inverse: false,
            hoverElem: 'div'
        },
        constructor: Hoverdir,
        /**
         * Detect if CSS transitions are supported
         *
         * @return {Boolean}
         */
        _supportsTransitions: function () {
            if (typeof Modernizr !== 'undefined') {
                return Modernizr.csstransitions;
            } else {
                var b = document.body || document.documentElement,
                    s = b.style,
                    p = 'transition';

                if (typeof s[p] === 'string') {
                    return true;
                }

                // Tests for vendor specific prop
                var v = ['Moz', 'webkit', 'Webkit', 'Khtml', 'O', 'ms'];
                p = p.charAt(0).toUpperCase() + p.substr(1);

                for (var i = 0; i < v.length; i++) {
                    if (typeof s[v[i] + p] === 'string') {
                        return true;
                    }
                }

                return false;
            }
        },
        /**
         * Bind the events to the element
         */
        _loadEvents: function () {
            this.$el.on('mouseenter.hoverdir mouseleave.hoverdir', $.proxy(function (event) {
                this.direction = this._getDir({x: event.pageX, y: event.pageY});

                if (event.type === 'mouseenter') {
                    this._showHover();
                }
                else {
                    this._hideHover();
                }
            }, this));
        },
        /**
         * Show the hover of the element
         */
        _showHover: function () {
            var styleCSS = this._getStyle(this.direction);

            if (this.support) {
                this.$hoverElem.css('transition', '');
            }

            this.$hoverElem.hide().css(styleCSS.from);
            clearTimeout(this.tmhover);

            this.tmhover = setTimeout($.proxy(function () {
                this.$hoverElem.show(0, $.proxy(function () {
                    if (this.support) {
                        this.$hoverElem.css('transition', this.transitionProp);
                    }
                    this._applyAnimation(styleCSS.to);

                }, this));
            }, this), this.options.hoverDelay);

            this.isVisible = true;
        },
        /**
         * Hide the hover to the element
         */
        _hideHover: function () {
            var styleCSS = this._getStyle(this.direction);
            if (this.support) {
                this.$hoverElem.css('transition', this.transitionProp);
            }
            clearTimeout(this.tmhover);
            this._applyAnimation(styleCSS.from);
            this.isVisible = false;
        },
        /**
         * get the direction when the event is triggered
         * credits : http://stackoverflow.com/a/3647634
         *
         * @param {Object} coordinates
         * @returns {Interger}
         */
        _getDir: function (coordinates) {
            // the width and height of the current div
            var w = this.$el.width(),
                h = this.$el.height(),
                // calculate the x and y to get an angle to the center of the div from that x and y.
                // gets the x value relative to the center of the DIV and "normalize" it
                x = (coordinates.x - this.$el.offset().left - (w / 2)) * (w > h ? (h / w) : 1),
                y = (coordinates.y - this.$el.offset().top - (h / 2)) * (h > w ? (w / h) : 1),
                // the angle and the direction from where the mouse came in/went out clockwise (TRBL=0123);
                // first calculate the angle of the point,
                // add 180 deg to get rid of the negative values
                // divide by 90 to get the quadrant
                // add 3 and do a modulo by 4 to shift the quadrants to a proper clockwise TRBL (top/right/bottom/left) **/
                direction = Math.round((((Math.atan2(y, x) * (180 / Math.PI)) + 180) / 90) + 3) % 4;
            return direction;
        },
        /**
         * get the style when the event is triggered
         *
         * @param {(Interger|String)} direction
         * @returns {Object}
         */
        _getStyle: function (direction) {
            var fromStyle, toStyle,
                slideFromTop = {'left': '0', 'top': '-100%'},
            slideFromBottom = {'left': '0', 'top': '100%'},
            slideFromLeft = {'left': '-100%', 'top': '0'},
            slideFromRight = {'left': '100%', 'top': '0'},
            slideTop = {'top': '0'},
            slideLeft = {'left': '0'};

            switch (direction) {
                case 0:
                case 'top':
                    // from top
                    fromStyle = !this.options.inverse ? slideFromTop : slideFromBottom;
                    toStyle = slideTop;
                    break;
                case 1:
                case 'right':
                    // from right
                    fromStyle = !this.options.inverse ? slideFromRight : slideFromLeft;
                    toStyle = slideLeft;
                    break;
                case 2:
                case 'bottom':
                    // from bottom
                    fromStyle = !this.options.inverse ? slideFromBottom : slideFromTop;
                    toStyle = slideTop;
                    break;
                case 3:
                case 'left':
                    // from left
                    fromStyle = !this.options.inverse ? slideFromLeft : slideFromRight;
                    toStyle = slideLeft;
                    break;
            }

            return {from: fromStyle, to: toStyle};
        },
        /**
         * Apply a transition or fallback to jquery animate based on Modernizr.csstransitions support
         *
         * @param {Object} styleCSS
         */
        _applyAnimation: function (styleCSS) {
            $.fn.applyStyle = this.support ? $.fn.css : $.fn.animate;
            this.$hoverElem.stop().applyStyle(styleCSS, $.extend(true, [], {duration: this.options.speed}));
        },
        /**
         * Show $hoverElem from the direction in argument
         *
         * @param {String} [direction=top] direction
         */
        show: function (direction) {
            this.$el.off('mouseenter.hoverdir mouseleave.hoverdir');
            if (!this.isVisible) {
                this.direction = direction || 'top';
                this._showHover();
            }
        },
        /**
         * Hide $hoverElem from the direction in argument
         *
         * @param {String} [direction=bottom] direction
         */
        hide: function (direction) {
            this.rebuild();
            if (this.isVisible) {
                this.direction = direction || 'bottom';
                this._hideHover();
            }
        },
        setOptions: function (options) {
            this.options = $.extend(true, {}, this.defaults, this.options, options);
        },
        /**
         * Unbinds the plugin.
         */
        destroy: function () {
            this.$el.off('mouseenter.hoverdir mouseleave.hoverdir');
            this.$el.data('hoverdir', null);
        },
        /**
         * Bind the plugin.
         */
        rebuild: function (options) {
            if (typeof options === 'object') {
                this.setOptions(options);
            }
            this._loadEvents();
        }
    };

    $.fn.hoverdir = function (option, parameter) {
        return this.each(function () {
            var data = $(this).data('hoverdir');
            var options = typeof option === 'object' && option;

            // Initialize hoverdir.
            if (!data) {
                data = new Hoverdir(this, options);
                $(this).data('hoverdir', data);
            }

            // Call hoverdir method.
            if (typeof option === 'string') {
                data[option](parameter);

                if (option === 'destroy') {
                    $(this).data('hoverdir', false);
                }
            }
        });
    };

    $.fn.hoverdir.Constructor = Hoverdir;
})(jQuery);

/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _html_map_marker_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _custom_overlay_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(0);



(function ($) {

    const DynamicMap = ($scope, $) => {
        
        if ($scope.find('.ae-dynamic-map-wrapper').length) {
            const wid = $scope.data('id');
            const wclass = '.elementor-element-' + wid;
            let settings = {};
            let map;
            let activeInfoWindow;

            // Carousel
            if($scope.find('.ae-swiper-outer-wrapper').hasClass('ae-carousel-yes')) {
                const wid = $scope.data('id');
                const outer_wrapper = $scope.find('.ae-swiper-outer-wrapper');
                const swiper_settings = outer_wrapper.data('swiper-settings');
                new _base__WEBPACK_IMPORTED_MODULE_2__["SwiperBase"](swiper_settings, wid);
            }

            //Map options
            if (typeof document.querySelector(wclass + ' .ae-dynamic-map-wrapper').dataset.map_options !== 'undefined') {
                settings = JSON.parse(document.querySelector(wclass + ' .ae-dynamic-map-wrapper').dataset.map_options);
            }

            //Listing marker interaction
            const marker_item = document.querySelectorAll(wclass + ' .ae-map-listing .ae-marker-item');
            if (settings['listing_marker_sync']) {
                marker_item.forEach(node => {
                    node.addEventListener('click', function (el) {
                        el.preventDefault();
                        marker_item.forEach(node => {
                            node.classList.remove('ae-marker-active');
                        });
                        el.currentTarget.classList.add('ae-marker-active');

                        var id = el.currentTarget.dataset.id;
                        var clicked_marker = map.markers[id];
                        if (settings['marker_click_action'] != 'post_link') {
                            google.maps.event.trigger(map.markers[id], 'click');
                        }

                        var divHeightOfTheMap = document.querySelector(wclass + ' .ae-map-render').clientHeight;
                        var offSetFromBottom = 100;
                        var offSetFromLeft = 0;
                        map.setCenter(clicked_marker.getPosition());
                        map.panBy(offSetFromLeft, -(divHeightOfTheMap / 2 - offSetFromBottom));

                        if (document.querySelector(wclass + ' .ae-responsive-btn')) {
                            if (document.querySelector(wclass + ' .ae-listing-responsive-mode-yes.' + document.querySelector('body').dataset.elementorDeviceMode)) {
                                let map_listing = document.querySelector(wclass + ' .ae-map-listing');
                                let map_render = document.querySelector(wclass + ' .ae-map-render');
                                let responsive_btn = document.querySelector(wclass + ' .ae-responsive-btn');
                                let responsive_btn_a = document.querySelector(wclass + ' .ae-responsive-btn a');

                                responsive_mode(responsive_btn_a, map_render, map_listing, responsive_btn);
                            }
                        }
                    });
                });
            }

            //Google Map
            if (document.querySelector(wclass + ' .ae-dynamic-map-wrapper').dataset.map_type === 'google_map') {
                // create marker
                const add_marker = ($marker_div, map) => {
                    const $marker = $marker_div.data('marker');
                    const latlng = new google.maps.LatLng($marker.lat, $marker.lng);
                    let icon = '<div class="ae-map-marker" id="temp"><img src="/wp-content/plugins/anywhere-elementor-pro/includes/assets/images/map-icon.png" /></div>';
                    if (settings['marker_type'] === 'default') {
                        var marker = Object(_html_map_marker_js__WEBPACK_IMPORTED_MODULE_0__["default"])({
                            position: latlng,
                            map: map,
                            html: icon,
                            markerIndex: $marker.marker_index
                        });
                    } else {
                        if (settings['marker']['icon']) {
                            icon = settings['marker']['icon'];
                        }
                        if (settings['marker']['icon'] && settings['marker']['type'] === 'image') {
                            var marker = Object(_html_map_marker_js__WEBPACK_IMPORTED_MODULE_0__["default"])({
                                position: latlng,
                                map: map,
                                html: icon,
                                markerIndex: $marker.marker_index
                            });
                        } else if (settings['marker']['icon'] && (settings['marker']['type'] === 'icon' || settings['marker']['type'] === 'svg')) {
                            var marker = Object(_html_map_marker_js__WEBPACK_IMPORTED_MODULE_0__["default"])({
                                position: latlng,
                                map: map,
                                html: icon,
                                markerIndex: $marker.marker_index
                            });
                        } else if (settings['marker_type'] === 'dynamic' && settings['marker']['type'] === 'image') {
                            if ($marker.marker) {
                                icon = $marker.marker;
                            }
                             var marker = Object(_html_map_marker_js__WEBPACK_IMPORTED_MODULE_0__["default"])({
                                position: latlng,
                                map: map,
                                html: icon,
                                markerIndex: $marker.marker_index
                            });
                            
                        }
                    }

                    // add to array
                    map.markers.push(marker);

                    // if marker contains HTML, add it to an infoWindow
                    if ($marker_div.html()) {
                        // create info window

                        // show info window when marker is clicked
                        google.maps.event.addListener(marker, 'click', function (i) {
                           
                            if (settings['marker_click_action'] == 'info_window') {
                                const popup = document.querySelector(wclass + ' #infowindow_id_' + marker.markerIndex);
                                if (activeInfoWindow) {
                                    activeInfoWindow.style.display = 'none';
                                }
                                activeInfoWindow = popup;
                                
                                popup.style.display = 'block';
                                popup.style.bottom = marker.div.offsetHeight + 15 + 'px';

                                var divHeightOfTheMap = document.querySelector(wclass + ' .ae-map-render').clientHeight;
                                var offSetFromBottom = 100;
                                var offSetFromLeft = 0;
                                
                                map.setCenter(marker.getPosition());
                                //map.setCenter(new google.maps.LatLng(marker.getPosition().lat(), map.getCenter().lng()));
                                map.panBy(offSetFromLeft, -(divHeightOfTheMap / 2 - offSetFromBottom));

                                $scope.find('.elementor-section').each(function () {
                                    elementorFrontend.elementsHandler.runReadyTrigger(jQuery(this));
                                });

                                $scope.find('.elementor-column').each(function () {
                                    elementorFrontend.elementsHandler.runReadyTrigger(jQuery(this));
                                });
                                
                                $scope.find('.elementor-widget').each(function () {
                                    elementorFrontend.elementsHandler.runReadyTrigger(jQuery(this));
                                });

                                let iw_close_btn = document.querySelector(wclass + ' #infowindow_id_' + marker.markerIndex + ' .ae-infowindow-close-btn');
                                iw_close_btn.addEventListener('click', function () {
                                    popup.style.display = 'none';
                                });
                                console.log(iw_close_btn);
                            }

                            if (settings['marker_click_action'] == 'post_link') {
                                if ($marker.open_in_new_window == 'yes') {
                                    window.open($marker.post_link);
                                } else {
                                    window.location.href = $marker.post_link;
                                }
                            } else {

                                //Listing marker interaction
                                if (settings['listing_marker_sync']) {
                                    marker_item.forEach(node => {
                                        node.classList.remove('ae-marker-active');
                                    });

                                    if (document.querySelector(wclass + ' .ae-swiper-container')) {
                                        let $mswiper = document.querySelector(wclass + ' .ae-swiper-container').swiper;
                                        if (marker_item[marker.markerIndex]) {
                                            $mswiper.slideTo(marker.markerIndex);
                                            marker_item[marker.markerIndex].classList.add('ae-marker-active');
                                        }
                                    } else {
                                        if (marker_item[marker.markerIndex]) {
                                            marker_item[marker.markerIndex].classList.add('ae-marker-active');
                                            let scrollDiv = marker_item[marker.markerIndex].offsetTop;
                                            document.querySelector(wclass + ' .ae-map-listing').scrollTo({ top: scrollDiv, behavior: 'smooth' });
                                        }
                                    }
                                }
                            }

                        });
                    }
                }

                const add_infowindow = ($marker_div, map) => {
                    const $marker = $marker_div.data('marker');
                    const latlng = new google.maps.LatLng($marker.lat, $marker.lng);
                    const CustomOverlay = Object(_custom_overlay_js__WEBPACK_IMPORTED_MODULE_1__["default"])({
                                position: latlng,
                                map: map,
                                html: '<div class="ae-map-infowindow" id="infowindow_id_' + $marker.marker_index + '"><div class="infowindow">' + $marker_div.html() + '</div><button class="ae-infowindow-close-btn" title="Close" type="button" class="gm-ui-hover-effect"><img src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20d%3D%22M19%206.41L17.59%205%2012%2010.59%206.41%205%205%206.41%2010.59%2012%205%2017.59%206.41%2019%2012%2013.41%2017.59%2019%2019%2017.59%2013.41%2012z%22/%3E%3Cpath%20d%3D%22M0%200h24v24H0z%22%20fill%3D%22none%22/%3E%3C/svg%3E" alt=""></button></div>',
                                markerIndex: $marker.marker_index
                            })
                }

                const map_options = [
                    'backgroundColor',
                    'clickableIcons',
                    'disableDefaultUI',
                    'disableDoubleClickZoom',
                    'mapTypeId',
                    'zoom',
                    'mapTypeControl',
                    'streetViewControl',
                    'zoomControl',
                    'fullscreenControl',
                    'gestureHandling',
                    'scrollwheel',
                    'styles'
                ];

                const new_map = ($el) => {
                    const $markers = $el.find('.marker');
                    const styles = $scope.find('.ae-map-render').data('map-style');
                    const args = {};

                    map_options.forEach(option => {
                        if (typeof settings[option] != "undefined") {
                            args[option] = settings[option];
                        }
                    
                    });

                    // create map
                    const map = new google.maps.Map($el[0], args);

                    // add a markers reference
                    map.markers = [];

                    // add markers
                    $markers.each(function () {
                        add_marker(jQuery(this), map);
                        add_infowindow(jQuery(this), map);
                    });

                    // center map
                    center_map(map, settings['zoom']);

                    // return
                    return map;
                }        

                const center_map = (map, zoom) => {

                    // vars
                    var bounds = new google.maps.LatLngBounds();
                    // loop through all markers and create bounds
                    jQuery.each(map.markers, function (i, marker) {
                        var latlng = new google.maps.LatLng(marker.position.lat(), marker.position.lng());
                        bounds.extend(latlng);
                    });

                    // only 1 marker?
                    if (map.markers.length == 1) {
                        // set center of map
                        map.setCenter(bounds.getCenter());
                        map.setZoom(zoom);
                    }
                    else {
                        //map.setCenter(bounds.getCenter());
                        map.setCenter(map.markers[0].getPosition());
                        map.setZoom(zoom);
                        // fit to bounds
                        if (settings['auto_center'] == 'yes') {
                            map.fitBounds(bounds);
                        }
                    }
                }

                if ($scope.find('.ae-map-render').length) {
                    map = new_map($scope.find('.ae-map-render'));
                }

            }
           
            if (document.querySelector(wclass + ' .ae-responsive-btn')) {
                if (document.querySelector(wclass + ' .ae-listing-responsive-mode-yes.' + document.querySelector('body').dataset.elementorDeviceMode)) {

                    let map_wrapper = document.querySelector(wclass + ' .ae-dynamic-map-wrapper');

                    let map_render = document.querySelector(wclass + ' .ae-map-render');
                    let map_listing = document.querySelector(wclass + ' .ae-map-listing')
                    let responsive_btn = document.querySelector(wclass + ' .ae-responsive-btn');
                    let responsive_btn_a = document.querySelector(wclass + ' .ae-responsive-btn a');

                    let map_render_height = map_render.offsetHeight;
                    let responsive_btn_height = responsive_btn.offsetHeight;
                    let map_wrapper_height = map_render_height + responsive_btn_height;
                    map_listing.style.setProperty('height', map_render_height + 'px');

                    responsive_btn_a.addEventListener("click", function (e) {
                        e.preventDefault();
                        responsive_mode(this, map_render, map_listing, responsive_btn);
                    });
                }
            }

            const responsive_mode = ($this, map_render, map_listing, responsive_btn) => {
                if (responsive_btn.classList.contains('hide-list')) {
                    map_listing.style.setProperty('z-index', '10');
                    map_listing.style.setProperty('opacity', '1');
                    map_render.style.setProperty('opacity', '0');
                    responsive_btn.classList.remove('hide-list');
                    $this.innerHTML = $this.dataset.close_list_text;
                } else {
                    map_listing.style.setProperty('z-index', '1');
                    map_listing.style.setProperty('opacity', '0');
                    map_render.style.setProperty('opacity', '1');
                    responsive_btn.classList.add('hide-list');
                    $this.innerHTML = $this.dataset.show_list_text;
                }
            }
        }

        

    };

    $(window).on( 'elementor/frontend/init', function() {
        elementorFrontend.hooks.addAction( 'frontend/element_ready/ae-dynamic-map.default', DynamicMap );
    });
})(jQuery);

/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


( function( $ ) {

    var PodsGallery = function ( $scope , $ ) {
        var $wrapper = $scope.find('.ae-grid-wrapper');
        if($scope.hasClass('ae-pods-gallery-carousel')) {
            const outer_wrapper = $scope.find('.ae-swiper-outer-wrapper');
            const wid = $scope.data('id');
            const swiper_settings = outer_wrapper.data('swiper-settings');

            new _base__WEBPACK_IMPORTED_MODULE_0__["SwiperBase"](swiper_settings, wid);
        }

        if($scope.hasClass('ae-pods-gallery-grid')) {
            if ($scope.find('.ae-grid-wrapper').hasClass('ae-masonry-yes')) {
                var grid = $scope.find('.ae-grid');
                var $grid_obj = grid.masonry({

                });

                $grid_obj.imagesLoaded().progress(function () {
                    $grid_obj.masonry('layout');
                });
            }

            if(!$wrapper.hasClass('ae-hover-direction-effect')) {
                $scope.find('.ae-grid-item').hover(function(){
                    $(this).find('.ae-grid-overlay').addClass('animated');
                });
            }
            if($wrapper.hasClass('ae-hover-direction-effect')){
                const  overlay_speed = parseInt($wrapper.attr('data-overlay-speed'));
                $scope.find('.ae-grid-item').hover(function () {
                    $(this).find('.ae-grid-overlay').addClass('aep-overlay');
                });
                $wrapper.find('.ae-grid-item' ).hoverdir({
                        speed: overlay_speed,
                        hoverElem : '.ae-grid-overlay'
                });
            };
        }
    };

    $(window).on( 'elementor/frontend/init', function() {
        elementorFrontend.hooks.addAction( 'frontend/element_ready/ae-pods.file_gallery', PodsGallery );
    });

})( jQuery );

/***/ }),
/* 22 */
/***/ (function(module, exports) {

(function($){

    const PortfolioHandler = ( $scope , $ ) => {
        if($scope.find('.ae-post-widget-wrapper').hasClass('ae-masonry-yes')){
            var grid = $scope.find('.ae-post-list-wrapper');
            var $grid_obj = grid.masonry();

            $grid_obj.imagesLoaded().progress(function(){
                $grid_obj.masonry('layout');
            });
        }

        $scope.find('article.ae-post-list-item').css('opacity', '1');
    };

    $(window).on( 'elementor/frontend/init', function() {
        elementorFrontend.hooks.addAction( 'frontend/element_ready/ae-portfolio.default', PortfolioHandler );
    });

})(jQuery);

/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var _dynamic_bg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1);



( function( $ ) {

    const PostBlocksAdvHandler = ($scope, $) => {

        const grid = $scope.find('.ae-post-list-wrapper');

        // Carousel
        if($scope.find('.ae-swiper-outer-wrapper').hasClass('ae-carousel-yes')) {
            const wid = $scope.data('id');
            const outer_wrapper = $scope.find('.ae-swiper-outer-wrapper');
            const swiper_settings = outer_wrapper.data('swiper-settings');
            new _base__WEBPACK_IMPORTED_MODULE_0__["SwiperBase"]( swiper_settings, wid );
        }

        if(elementorFrontend.isEditMode()){
            
            $scope.find('.elementor-section').each(function(){
                elementorFrontend.elementsHandler.runReadyTrigger(jQuery(this));
            });

            $scope.find('.elementor-column').each(function(){
                elementorFrontend.elementsHandler.runReadyTrigger(jQuery(this));
            });
        }


    }

    $(window).on( 'elementor/frontend/init', function() {
        elementorFrontend.hooks.addAction( 'frontend/element_ready/ae-post-blocks-adv.carousel', 	PostBlocksAdvHandler );
    });


})(jQuery);

/***/ }),
/* 24 */
/***/ (function(module, exports) {

(function($){

    const PostBlockAdvAccordionHandler = ( $scope , $ ) => {
        const title = $scope.find('.ae-tab-title');
        const accordion_content = $scope.find('.ae-tab-content');
        const expand_button = $scope.find('.ae-accordion-toggle-button.expand');
        const collapse_button = $scope.find('.ae-accordion-toggle-button.collapse');
        const speed = $scope.find('.ae-accordion').data('transition-speed');
        let acc_status = 'start';
        (title).on('click',function (e) {
            e.preventDefault();
            collapse_button.removeClass('active');
            expand_button.removeClass('active');
            acc_status = 'start';
            const $this = $(this);
            if ($this.hasClass("ae-active")) {
                $this.removeClass("ae-active");
                $this.next().slideUp(speed);
            } else {
                $this
                    .parent()
                    .parent()
                    .find(".ae-tab-title")
                    .removeClass("ae-active");
                $this
                    .parent()
                    .parent()
                    .find(".ae-tab-content")
                    .slideUp(speed);
                $this.toggleClass("ae-active");
                $this.next().slideToggle(speed);
            }

            if ('undefined' !== typeof $this.data('hashtag')) {
                window.location.hash = $this.data('hashtag');
            }

            setTimeout(function () {
                /* Initialise ACF Gallery on Ajax */
                $this.siblings('.ae-tab-content').find('.elementor-widget-ae-acf-gallery').each(function () {
                    elementorFrontend.elementsHandler.runReadyTrigger(jQuery(this));
                });
            }, 100);
        });
        (expand_button).on('click', function (e) {
            e.preventDefault();
            const $this = $(this);
            var role = $(this).data('role');
            if(acc_status == role){
                return;
            }else{
                acc_status = role;
                collapse_button.removeClass('active');
                $this.toggleClass('active');
                title.each(function(index,element){
                    $(element).addClass('ae-active');
                    var content = $(element).next();
                    content.slideDown(speed);
                    content.addClass('ae-active');
                });
            }
        });
        (collapse_button).on('click',function(e){
            e.preventDefault();
            const $this = $(this);
            var role = $(this).data('role');
            if(acc_status == role){
                return;
            } else {
                acc_status = role;
                expand_button.removeClass('active');
                $this.toggleClass('active');
                title.each(function (index, element) {
                    $(element).removeClass('ae-active'); 
                    var content = $(element).next();
                    content.slideUp(speed);
                    //content.removeClass('elementor-active');
                     
                });
            }
        });
        let $hashtag = window.location.hash.substring(1);
        if ($hashtag) {
            let $tab = title.filter('[data-hashtag="' + $hashtag + '"]');
            if ($tab.length > 0) {
                if (!$tab.hasClass('ae-active')) {
                    jQuery($tab).trigger('click');
                }
                let $tab_offset = parseInt(jQuery($tab).offset().top);
                jQuery('html, body').animate({
                    scrollTop: $tab_offset - 100
                }, 1000);

            }
        }

        if(elementorFrontend.isEditMode()){
            
            $scope.find('.elementor-section').each(function(){
                elementorFrontend.elementsHandler.runReadyTrigger(jQuery(this));
            });

            $scope.find('.elementor-column').each(function(){
                elementorFrontend.elementsHandler.runReadyTrigger(jQuery(this));
            });
        }
    };

    $(window).on( 'elementor/frontend/init', function() {
        elementorFrontend.hooks.addAction( 'frontend/element_ready/ae-post-blocks-adv.accordion',  PostBlockAdvAccordionHandler );
    });

})(jQuery);

/***/ }),
/* 25 */
/***/ (function(module, exports) {

(function ($) {
    
    const safariResize = ($scope) => {
        // Targetting collapsed images in pjax loading box (safari bug)
        let imgLoad = imagesLoaded($scope.find('.ae-element-post-image > .ae_thumb_wrapper img'));
        imgLoad.on('progress', function (instance, image) {
            if (image.isLoaded && image.img.height == 0) {
                var naturalH = image.img.naturalHeight,
                    naturalW = image.img.naturalWidth;
                if (image.img.parentElement.clientWidth < naturalW) {
                    var ratio = naturalH / naturalW;
                    naturalW = image.img.parentElement.clientWidth;
                    naturalH = naturalW * ratio;
                }
                image.img.setAttribute("style", "width: " + naturalW + "px; height: " + naturalH + "px; display:none;");
                $(image.img).fadeIn();
            }
        });
    };

    const _ias =  ( $scope , $, grid ) => {

        const wid = $scope.data('id');
        const wclass = '.elementor-element-' + wid;


        const ias = grid;
        let msnry = '';
        if($scope.find('.ae-outer-wrapper').hasClass('ae-masonry-yes')) {
            msnry = grid.data('masonry');
        }
        const $ias_obj = ias.infiniteScroll({
            path: '.next',
            append: wclass + ' .ae-post-item-' + wid,
            status: wclass + ' .scroller-status',
            hideNav: wclass + ' .ae-pagination-wrapper',
            outlayer: msnry,
            button: wclass + ' .view-more-button',
            history: $scope.find('.ae-outer-wrapper').data('ias-history'),
        });

        ias.on('append.infiniteScroll', function(event, response, path, items) {

            $scope.find('.ae-post-collection').find('.ae-cf-wrapper').each(function() {
                if ($(this).hasClass('hide')) {
                    $(this).closest('.elementor-widget-ae-custom-field').hide();
                }
            });

            /* EAE Modal Popup Widget compatibility on IAS ajax */

            if($scope.find('.eae-popup-link').length){

                const $close_btn = $scope.find('.eae-popup-wrapper').data('close-btn');

                const $magnific = $scope.find('.eae-popup-link').eaePopup({
                    type: 'inline',

                    mainClass: 'eae-popup eae-popup-' + $scope.find('.eae-popup-link').data('id') + ' eae-wrap-' + $scope.find('.eae-popup-link').data('ctrl-id'),

                    closeBtnInside: $scope.find('.eae-popup-wrapper').data('close-in-out'),

                    closeMarkup: '<i class="eae-close ' + $close_btn + '"> </i>',
                });

            }
            /* EAE Modal Popup Widget compatibility on IAS ajax */

            if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1)  {
                safariResize($scope);
            } else if (navigator.userAgent.indexOf('iPad') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
                safariResize($scope);
            }

            if (navigator.userAgent.indexOf('Safari') != -1 || navigator.userAgent.indexOf('iPad') != -1 || navigator.userAgent.indexOf('iPhone') != -1 && navigator.userAgent.indexOf('Chrome') == -1){
                var ias_image = $scope.find('.ae-post-list-wrapper').find('.wp-post-image');
                ias_image.each(function (index, ias_image) {
                    ias_image.outerHTML = ias_image.outerHTML;
                });
            }

            let appendedPostItem = document.querySelectorAll('.ae-post-item');

            appendedPostItem.forEach(function (el) {
                el.classList.remove("appended");
            });
            items.forEach(function (el) {
                el.classList.add("appended");
            });
            /* Initialise ACF Gallery on Ajax */
           /*  $scope.find('.ae-post-item.appended .elementor-widget-ae-acf-gallery').each(function () {
                elementorFrontend.elementsHandler.runReadyTrigger($(this));
            }); */

            $scope.find('.ae-post-item.appended .elementor-section').each(function(){
                elementorFrontend.elementsHandler.runReadyTrigger(jQuery(this));
            });

            $scope.find('.ae-post-item.appended .elementor-column').each(function(){
                elementorFrontend.elementsHandler.runReadyTrigger(jQuery(this));
            });
            
            $scope.find('.ae-post-item.appended .elementor-widget').each(function(){
                elementorFrontend.elementsHandler.runReadyTrigger(jQuery(this));
            });
        });

        if($scope.find('.ae-outer-wrapper').hasClass('ae-ias-load-with-button-yes')) {
            var $viewMoreButton = $('.view-more-button');

            // get Infinite Scroll instance
            var infScroll = ias.data('infiniteScroll');

            ias.on('load.infiniteScroll', onPageLoad);
            var loadCount = $scope.find('.ae-outer-wrapper').data('load-offset-page');
            function onPageLoad() {
                if (infScroll.loadCount == loadCount) {
                    // after 2nd page loaded
                    // disable loading on scroll
                    ias.infiniteScroll('option', {
                        loadOnScroll: false,
                    });
                    // show button
                    $viewMoreButton.show();
                    // remove event listener
                    ias.off('load.infiniteScroll', onPageLoad);
                }
            }

            if (loadCount == 0) {
                ias.infiniteScroll('option', {
                    loadOnScroll: false,
                });
                // show button
                $viewMoreButton.show();
                // remove event listener
                var $scroller_status = $scope.find('.scroller-status');
                $scroller_status.hide();
                //ias.off('load.infiniteScroll', onPageLoad);
            }
        }

        ias.on( 'last.infiniteScroll', function( event, response, path ) {
            // parse JSON
            $scope.find('.load-more-wrapper').hide();
            // do something with JSON...
        });
    };

    const PostBlocksAdvHandler = ($scope, $) => {

        const grid = $scope.find('.ae-post-collection');
        // Masonry Layout
        if($scope.find('.ae-outer-wrapper').hasClass('ae-masonry-yes')){
             const $grid_obj = grid.masonry({
                 horizontalOrder: true
             });
             $grid_obj.imagesLoaded().progress(function(){
                 $grid_obj.masonry('layout');
             });

         }


        // Infinite Scroll
        const ias_grid = $scope.find('.ae-outer-wrapper > .ae-post-collection');
        if ($scope.find('.ae-outer-wrapper').hasClass('ae-ias-yes')) {
            if ($scope.find('.ae-pagination-wrapper .page-numbers').length) {
                _ias($scope, $, ias_grid)
            }else{
                $scope.find('.scroller-status').hide();
                $scope.find('.load-more-wrapper').hide();
            }
        }

        /* Filter Dropdown item selected */
        var device_mode = jQuery('body').data('elementor-device-mode');

        //Elementor Editor
        if (elementorFrontend.isEditMode()) {
            device_mode = elementor.channels.deviceMode.request('currentMode');
            var filter = $scope.find('.aep-filter-bar.' + device_mode);
            $scope.find('.aep-filter-bar').hide();
            filter.show();
            elementor.channels.deviceMode.on('change', function(){
                device_mode = elementor.channels.deviceMode.request('currentMode');
                filter = $scope.find('.aep-filter-bar.' + device_mode);
                $scope.find('.aep-filter-bar').hide();
                filter.show();
            });
        }

        var filter_dropdown = $scope.find('.' + device_mode + ' .ae-dropdown');
        if (filter_dropdown.find('.ae-menu .filter-items.active').length) {
            var cur_term = filter_dropdown.find('.filter-items.active a').html();
            filter_dropdown.find('.dropdown-filter-text').html(cur_term);
            filter_dropdown.addClass('active');
        } else {
            var default_filter_text = filter_dropdown.find('.dropdown-filter-text').html();
            filter_dropdown.find('.dropdown-filter-text').html(default_filter_text);
        }

        if(elementorFrontend.isEditMode()){
            
            $scope.find('.elementor-section').each(function(){
                elementorFrontend.elementsHandler.runReadyTrigger(jQuery(this));
            });

            $scope.find('.elementor-column').each(function(){
                elementorFrontend.elementsHandler.runReadyTrigger(jQuery(this));
            });
        }

        let $hashtag = window.location.hash.substring(1);
        if ($hashtag) {
            let device = jQuery('body').data('elementor-device-mode');
            let filter_dropdown = $scope.find('.' + device + ' .filter-items');
            let $tab = filter_dropdown.filter('[data-hashtag="' + $hashtag + '"]');
            if ($tab.length > 0) {
                if (!$tab.hasClass('ae-active')) {
                    jQuery($tab).find('a').trigger('click');
                }
                let $tab_offset = parseInt(jQuery($tab).offset().top);
                jQuery('html, body').animate({
                    scrollTop: $tab_offset - 100
                }, 1000);

            }
        }

    }

    $(window).on( 'elementor/frontend/init', function() {
        elementorFrontend.hooks.addAction( 'frontend/element_ready/ae-post-blocks-adv.grid', 	PostBlocksAdvHandler );
    });




    $(document).on('click', '.facetwp-template.elementor-widget-ae-post-blocks-adv .ae-pagination-wrapper a', function(e) {
        e.preventDefault();
        var $this = jQuery(this);
        var wrapper = jQuery(this).closest('.ae-outer-wrapper');
        var ae_post_overlay = wrapper.siblings('.ae-post-overlay');
        ae_post_overlay.show();
        var matches = $this.attr('href').match(/\/page\/(\d+)/);
        if (null !== matches) {
            FWP.paged = parseInt(matches[1]);
            FWP.soft_refresh = true;
            FWP.refresh();
        } else {
            FWP.paged = 1;
            FWP.soft_refresh = true;
            FWP.refresh();
        }

    });

    if(jQuery('.ae-outer-wrapper').parents('.facetwp-template ').length > 0 ) {
        var facetWP_flag = false;
        $(document).on('facetwp-refresh', function() {
            var wrapper = jQuery('.ae-outer-wrapper');
            var ae_post_overlay = wrapper.siblings('.ae-post-overlay');
            ae_post_overlay.show();
        });
        $(document).on('facetwp-loaded', function () {
            var wrapper = jQuery('.ae-outer-wrapper');
            var ae_post_overlay = wrapper.siblings('.ae-post-overlay');
            if(wrapper.data('item-reveal-animation') == 'yes') {
                ae_post_overlay.show();
                wrapper.removeClass('transit-in');
                wrapper.addClass('transit-out');
                setTimeout(function () {
                    wrapper.find('.ae-featured-bg-yes').each(function () {
                        img = jQuery(this).attr('data-ae-bg');
                        jQuery(this).css('background-image', 'url(' + img + ')');
                    });

                    if (wrapper.find('.ae-link-yes').data('ae-url')) {
                        wrapper.find('.ae-link-yes').on('click', function (e) {
                            if (jQuery(this).data('ae-url') && jQuery(this).hasClass('ae-new-window-yes')) {
                                window.open(jQuery(this).data('ae-url'));
                            } else {
                                location.href = jQuery(this).data('ae-url');
                            }
                        });
                    }

                    // hide black custom field widget wrapper
                    wrapper.find('.ae-cf-wrapper.hide').each(function () {
                        jQuery(this).closest('.elementor-widget-ae-custom-field').hide();
                    });

                    // reinitialize masonry
                    if (wrapper.hasClass('ae-masonry-yes')) {
                        var grid = wrapper.find('.ae-post-collection');
                        var $grid_obj = grid.masonry({
                            horizontalOrder: true
                        });

                        $grid_obj.imagesLoaded().progress(function () {
                            $grid_obj.masonry('layout');
                        });
                    }

                    wrapper.find('.elementor-invisible').each(function () {
                        // get settings
                        settings = jQuery(this).data('settings');
                        animation = settings.animation || settings._animation;

                        jQuery(this).removeClass('elementor-invisible').removeClass(animation).addClass(animation);

                    });

                    wrapper.find('article.ae-post-item').css('opacity', '1');
                    ae_post_overlay.hide();

                    var disable_scroll_on_ajax_load = wrapper.data('disable_scroll_on_ajax_load');
                    if (disable_scroll_on_ajax_load == 'no') {
                        if (facetWP_flag) {
                            var pagination_scroll_top_offset = wrapper.data('pagination_scroll_top_offset');
                            jQuery('html,body').animate({
                                    scrollTop: wrapper.offset().top - pagination_scroll_top_offset
                                },
                                'slow');
                        }
                    }

                    if (wrapper.find('.eae-popup-link').length) {

                        $close_btn = wrapper.find('.eae-popup-wrapper').data('close-btn');

                        $magnific = wrapper.find('.eae-popup-link').eaePopup({
                            type: 'inline',

                            mainClass: 'eae-popup eae-popup-' + wrapper.find('.eae-popup-link').data('id') + ' eae-wrap-' + wrapper.find('.eae-popup-link').data('ctrl-id'),

                            closeBtnInside: wrapper.find('.eae-popup-wrapper').data('close-in-out'),

                            closeMarkup: '<i class="eae-close ' + $close_btn + '"> </i>',
                        });

                    }
                    facetWP_flag = true;
                }, wrapper.data('overlay-animation-speed'));
                setTimeout(function () {
                    ae_post_overlay.hide();
                    wrapper.removeClass('transit-out');
                    wrapper.addClass('transit-in');
                }, wrapper.data('overlay-animation-speed'));
            }else{
                ae_post_overlay.show();
                wrapper.find('.ae-featured-bg-yes').each(function () {
                    img = jQuery(this).attr('data-ae-bg');
                    jQuery(this).css('background-image', 'url(' + img + ')');
                });

                if (wrapper.find('.ae-link-yes').data('ae-url')) {
                    wrapper.find('.ae-link-yes').on('click', function (e) {
                        if (jQuery(this).data('ae-url') && jQuery(this).hasClass('ae-new-window-yes')) {
                            window.open(jQuery(this).data('ae-url'));
                        } else {
                            location.href = jQuery(this).data('ae-url');
                        }
                    });
                }

                // hide black custom field widget wrapper
                wrapper.find('.ae-cf-wrapper.hide').each(function () {
                    jQuery(this).closest('.elementor-widget-ae-custom-field').hide();
                });

                // reinitialize masonry
                if (wrapper.hasClass('ae-masonry-yes')) {
                    var grid = wrapper.find('.ae-post-collection');
                    var $grid_obj = grid.masonry({
                        horizontalOrder: true
                    });

                    $grid_obj.imagesLoaded().progress(function () {
                        $grid_obj.masonry('layout');
                    });
                }

                wrapper.find('.elementor-invisible').each(function () {
                    // get settings
                    settings = jQuery(this).data('settings');
                    animation = settings.animation || settings._animation;

                    jQuery(this).removeClass('elementor-invisible').removeClass(animation).addClass(animation);

                });

                wrapper.find('article.ae-post-item').css('opacity', '1');

                var disable_scroll_on_ajax_load = wrapper.data('disable_scroll_on_ajax_load');
                if (disable_scroll_on_ajax_load == 'no') {
                    if (facetWP_flag) {
                        var pagination_scroll_top_offset = wrapper.data('pagination_scroll_top_offset');
                        jQuery('html,body').animate({
                                scrollTop: wrapper.offset().top - pagination_scroll_top_offset
                            },
                            'slow');
                    }
                }

                if (wrapper.find('.eae-popup-link').length) {

                    $close_btn = wrapper.find('.eae-popup-wrapper').data('close-btn');

                    $magnific = wrapper.find('.eae-popup-link').eaePopup({
                        type: 'inline',

                        mainClass: 'eae-popup eae-popup-' + wrapper.find('.eae-popup-link').data('id') + ' eae-wrap-' + wrapper.find('.eae-popup-link').data('ctrl-id'),

                        closeBtnInside: wrapper.find('.eae-popup-wrapper').data('close-in-out'),

                        closeMarkup: '<i class="eae-close ' + $close_btn + '"> </i>',
                    });

                }
                facetWP_flag = true;
                ae_post_overlay.hide();
            }
        });
    }

    //Search and Filter Pro
    if ($('.searchandfilter').length > 0) {
        $(document).on("sf:ajaxfinish", ".searchandfilter", function () {
            var wrapper = jQuery('.ae-outer-wrapper');

            // hide black custom field widget wrapper
            wrapper.find('.ae-cf-wrapper.hide').each(function () {
                jQuery(this).closest('.elementor-widget-ae-custom-field').hide();
            });

            // reinitialize masonry
            if (wrapper.hasClass('ae-masonry-yes')) {
                var grid = wrapper.find('.ae-post-collection');
                var $grid_obj = grid.masonry({
                    horizontalOrder: true
                });

                $grid_obj.imagesLoaded().progress(function () {
                    $grid_obj.masonry('layout');
                });
            }

            /* EAE Modal Popup Widget compatibility on post block ajax */

            if (wrapper.find('.eae-popup-link').length) {

                $close_btn = wrapper.find('.eae-popup-wrapper').data('close-btn');

                $magnific = wrapper.find('.eae-popup-link').eaePopup({
                    type: 'inline',

                    mainClass: 'eae-popup eae-popup-' + wrapper.find('.eae-popup-link').data('id') + ' eae-wrap-' + wrapper.find('.eae-popup-link').data('ctrl-id'),

                    closeBtnInside: wrapper.find('.eae-popup-wrapper').data('close-in-out'),

                    closeMarkup: '<i class="eae-close ' + $close_btn + '"> </i>',
                });

            }
            /* EAE Modal Popup Widget compatibility on post block ajax */

            wrapper.find('.elementor-section').each(function(){
                elementorFrontend.elementsHandler.runReadyTrigger(jQuery(this));
            });

            wrapper.find('.elementor-column').each(function(){
                elementorFrontend.elementsHandler.runReadyTrigger(jQuery(this));
            });
            
            wrapper.find('.elementor-widget').each(function(){
                elementorFrontend.elementsHandler.runReadyTrigger(jQuery(this));
            });
        });
    }

})(jQuery);

/***/ }),
/* 26 */
/***/ (function(module, exports) {

(function($){

    const PostBlocksAdvTabsHandler = ( $scope, $ ) => {

        var defaultActiveTab = $scope.find( '.ae-post-blocks-adv-tabs' ).data( 'active-tab' ),
            $tabsTitles = $scope.find( '.ae-post-blocks-adv-tab-title' ),
            $tabs = $scope.find( '.ae-post-blocks-adv-tab-content' ),
            $active,
            $content;

        if ( ! defaultActiveTab ) {
            defaultActiveTab = 1;
        }

        const activateTab = ( tabIndex ) => {
            if ( $active ) {
                $active.removeClass( 'active' );
                $content.hide();
            }

            $active = $tabsTitles.filter( '[data-tab="' + tabIndex + '"]' );
            $active.addClass( 'active' );

            $content = $tabs.filter( '[data-tab="' + tabIndex + '"]' );
            $content.show();
        };

        activateTab( defaultActiveTab );
        $tabsTitles.on( 'click', function() {
            activateTab( this.dataset.tab );

            /* Initialise ACF Gallery on Ajax */
            $tabs.find('.elementor-widget-ae-acf-gallery').each(function () {
                elementorFrontend.elementsHandler.runReadyTrigger(jQuery(this));
            });
        });

        if(elementorFrontend.isEditMode()){
            
            $scope.find('.elementor-section').each(function(){
                elementorFrontend.elementsHandler.runReadyTrigger(jQuery(this));
            });

            $scope.find('.elementor-column').each(function(){
                elementorFrontend.elementsHandler.runReadyTrigger(jQuery(this));
            });
        }
    };

    $(window).on( 'elementor/frontend/init', function() {
        elementorFrontend.hooks.addAction( 'frontend/element_ready/ae-post-blocks-adv.tabs',   PostBlocksAdvTabsHandler );
    });
})(jQuery);

/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var _dynamic_bg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1);



( function( $ ) {

    const safariResize = ($scope) => {
        // Targetting collapsed images in pjax loading box (safari bug)
        let imgLoad = imagesLoaded( $scope.find('.ae-element-post-image > .ae_thumb_wrapper img') );
        imgLoad.on( 'progress', function( instance, image ) {
            if(image.isLoaded && image.img.height == 0){
                var naturalH = image.img.naturalHeight,
                    naturalW = image.img.naturalWidth;
                if( image.img.parentElement.clientWidth < naturalW ){
                    var ratio = naturalH / naturalW;
                    naturalW = image.img.parentElement.clientWidth;
                    naturalH = naturalW * ratio;
                }
                image.img.setAttribute("style","width: "+naturalW+"px; height: "+naturalH+"px; display:none;");
                $(image.img).fadeIn();
            }
        });
    }

    const _ias =  ( $scope , $, grid ) => {

        const wid = $scope.data('id');
        const wclass = '.elementor-element-' + wid;


        const ias = grid;
        let msnry = '';
        if($scope.find('.ae-post-widget-wrapper').hasClass('ae-masonry-yes')) {
            msnry = grid.data('masonry');
        }
        const $ias_obj = ias.infiniteScroll({
            path: '.next',
            append: wclass + ' .ae-post-list-item-' + wid,
            status: wclass + ' .scroller-status',
            hideNav: wclass + ' .ae-pagination-wrapper',
            outlayer: msnry,
            button: wclass + ' .view-more-button',
            history: $scope.find('.ae-post-widget-wrapper').data('ias-history'),
        });

        ias.on('append.infiniteScroll', function(event, response, path, items) {

            $scope.find('.ae-post-list-wrapper').find('.ae-cf-wrapper').each(function() {
                if ($(this).hasClass('hide')) {
                    $(this).closest('.elementor-widget-ae-custom-field').hide();
                }
            });

            /* EAE Modal Popup Widget compatibility on IAS ajax */

            if($scope.find('.eae-popup-link').length){

                const $close_btn = $scope.find('.eae-popup-wrapper').data('close-btn');

                const $magnific = $scope.find('.eae-popup-link').eaePopup({
                    type: 'inline',

                    mainClass: 'eae-popup eae-popup-' + $scope.find('.eae-popup-link').data('id') + ' eae-wrap-' + $scope.find('.eae-popup-link').data('ctrl-id'),

                    closeBtnInside: $scope.find('.eae-popup-wrapper').data('close-in-out'),

                    closeMarkup: '<i class="eae-close ' + $close_btn + '"> </i>',
                });

            }
            /* EAE Modal Popup Widget compatibility on IAS ajax */

            if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1)  {
                safariResize($scope);
            } else if (navigator.userAgent.indexOf('iPad') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
                safariResize($scope);
            }

            if (navigator.userAgent.indexOf('Safari') != -1 || navigator.userAgent.indexOf('iPad') != -1 || navigator.userAgent.indexOf('iPhone') != -1 && navigator.userAgent.indexOf('Chrome') == -1){
                var ias_image = $scope.find('.ae-post-list-wrapper').find('.wp-post-image');
                ias_image.each(function (index, ias_image) {
                    ias_image.outerHTML = ias_image.outerHTML;
                });
            }

            let appendedPostItem = document.querySelectorAll('.ae-post-list-item');

            appendedPostItem.forEach(function (el) {
                el.classList.remove("appended");
            });
            items.forEach(function (el) {
                el.classList.add("appended");
            });
            /* Initialise ACF Gallery on Ajax */
           /*  $scope.find('.ae-post-list-item.appended .elementor-widget-ae-acf-gallery').each(function () {
                elementorFrontend.elementsHandler.runReadyTrigger($(this));
            }); */

            $scope.find('.ae-post-list-item.appended .elementor-section').each(function(){
                elementorFrontend.elementsHandler.runReadyTrigger(jQuery(this));
            });

            $scope.find('.ae-post-list-item.appended .elementor-column').each(function(){
                elementorFrontend.elementsHandler.runReadyTrigger(jQuery(this));
            });
            
            $scope.find('.ae-post-list-item.appended .elementor-widget').each(function(){
                elementorFrontend.elementsHandler.runReadyTrigger(jQuery(this));
            });

        });

        if($scope.find('.ae-post-widget-wrapper').hasClass('ae-ias-load-with-button-yes')) {
            var $viewMoreButton = $('.view-more-button');

            // get Infinite Scroll instance
            var infScroll = ias.data('infiniteScroll');

            ias.on('load.infiniteScroll', onPageLoad);
            var loadCount = $scope.find('.ae-post-widget-wrapper').data('load-offset-page') - 1;
            function onPageLoad() {
                if (infScroll.loadCount == loadCount) {
                    // after 2nd page loaded
                    // disable loading on scroll
                    ias.infiniteScroll('option', {
                        loadOnScroll: false,
                    });
                    // show button
                    $viewMoreButton.show();
                    // remove event listener
                    ias.off('load.infiniteScroll', onPageLoad);
                }
            }
        }

        ias.on( 'last.infiniteScroll', function( event, response, path ) {
            // parse JSON
            $scope.find('.load-more-wrapper').hide();
            // do something with JSON...
        });
    };

    const PostBlocksHandler = ($scope, $) => {

        const grid = $scope.find('.ae-post-list-wrapper');

        // Masonry Layout
        if($scope.find('.ae-post-widget-wrapper').hasClass('ae-masonry-yes')){
            const $grid_obj = grid.masonry({
                horizontalOrder: true
            });
            $grid_obj.imagesLoaded().progress(function(){
                $grid_obj.masonry('layout');
            });
        }

        // Infinite Scroll
        if ($scope.find('.ae-post-widget-wrapper').hasClass('ae-ias-yes')) {
            if ($scope.find('.ae-pagination-wrapper .page-numbers').length) {
                //_ias($scope, $, grid);
                _ias($scope, $, $scope.find('.ae-post-widget-wrapper > .ae-post-list-wrapper'));
            }else{
                $scope.find('.scroller-status').hide();
                $scope.find('.load-more-wrapper').hide();
            }
        }

        // Carousel
        if($scope.find('.ae-post-widget-wrapper').hasClass('ae-carousel-yes')) {
            const wid = $scope.data('id');
            const outer_wrapper = $scope.find('.ae-swiper-outer-wrapper');
            const swiper_settings = outer_wrapper.data('swiper-settings');
            new _base__WEBPACK_IMPORTED_MODULE_0__["SwiperBase"]( swiper_settings, wid );
        }

        if(elementorFrontend.isEditMode()){
            
            $scope.find('.elementor-section').each(function(){
                elementorFrontend.elementsHandler.runReadyTrigger(jQuery(this));
            });

            $scope.find('.elementor-column').each(function(){
                elementorFrontend.elementsHandler.runReadyTrigger(jQuery(this));
            });
        }

    }

    $(window).on( 'elementor/frontend/init', function() {
        elementorFrontend.hooks.addAction( 'frontend/element_ready/ae-post-blocks.default', 	PostBlocksHandler );
    });


})(jQuery);

/***/ }),
/* 28 */
/***/ (function(module, exports) {

(function($){

    var ContentUnfold = function ( $scope, $ ) {

        if($scope.find('.ae-element-post-content').hasClass('ae-post-content-unfold-yes')) {
            const postcontent = $scope.find('.ae-element-post-content');
            const postcontentinner = $scope.find('.ae-element-post-content-inner');
            const postcontentunfold = postcontent.find('.ae-post-content-unfold');
            const postcontentunfoldlink = postcontentunfold.find('.ae-post-content-unfold-link');
            let totalHeight = 0;
            totalHeight = postcontentinner.outerHeight();
            if(totalHeight){
                totalHeight += postcontentunfold.outerHeight();
            }
            if((postcontentinner.outerHeight() <= postcontentunfold.data('unfold-max-height')) && postcontentunfold.data('auto-hide-unfold') == 'yes' ){
                postcontentunfold.css({ 'display': 'none'});
            }else{
                postcontentunfoldlink.on( 'click', function() {
                    if(postcontentunfold.hasClass('fold')){
                        postcontent.css({ 'height': postcontent.outerHeight(), 'max-height': 9999 }).animate({ 'height': totalHeight }, {'duration': postcontentunfold.data('animation-speed')});
                        postcontentunfold.toggleClass('fold');
                        postcontentunfoldlink.html(postcontentunfold.data('fold-text'));
                    }else{
                        postcontent.css({ 'max-height': totalHeight }).animate({ 'max-height' : postcontentunfold.data('unfold-max-height') }, {'duration': postcontentunfold.data('animation-speed')});
                        postcontentunfold.toggleClass('fold');
                        postcontentunfoldlink.html(postcontentunfold.data('unfold-text'))
                    }

                });
            }
        }
    };

    $(window).on( 'elementor/frontend/init', function() {
        elementorFrontend.hooks.addAction( 'frontend/element_ready/ae-post-content.default',    ContentUnfold );
    });

})(jQuery);

/***/ }),
/* 29 */
/***/ (function(module, exports) {

(function($){

    const PostImageHandler = ($scope , $ ) => {

        if($scope.find('.ae_thumb_wrapper').hasClass('ae_image_ratio_yes')) {

            const imageParent = $scope.find('.ae-post-image');
            const image = $scope.find('.ae-post-image img');

            const imageParentRatio = imageParent.outerHeight() / imageParent.outerWidth();
            const imageRatio = image.height() / image.width();

            if(imageRatio < imageParentRatio){
                imageParent.addClass( 'ae-post-image-fit' );
            }else{
                imageParent.removeClass( 'ae-post-image-fit' );
            }
        }
    };

    $(window).on( 'elementor/frontend/init', function() {
        elementorFrontend.hooks.addAction( 'frontend/element_ready/ae-post-image.default',  PostImageHandler );
    });

})(jQuery);

/***/ }),
/* 30 */
/***/ (function(module, exports) {

(function ($) {
    
    var TriggerHandler = function (widget_target, $) {
        const $scope = $(widget_target);
        const settings = $scope.data('settings');
        
        if (typeof settings === "undefined") {
            return false;
        }

        let trigger_targets = settings.trigger_target.split(',');
        
        jQuery.each(trigger_targets, function (i, trigger_target) {
            //For Swiper: Carousels/Sliders
            let trigger_toggle = false;
            let wrapper = $scope.find('.ae-triggers');
            let button = $scope.find('.ae-trigger');
            Array.from(wrapper).forEach((el) => {
                const trigger_data = JSON.parse(el.dataset.trigger_settings);
                if (trigger_data.trigger_type == 'carousel') {
                    let $mswiper = document.querySelector('.elementor-element-' + trigger_target + ' .ae-swiper-container').swiper;
                    if ('undefined' === typeof $mswiper) {
                        return;
                    }
                    trigger_toggle = $mswiper.autoplay.running;
                    if (trigger_data.trigger_action == 'play_pause') {
                        if (trigger_toggle) {
                            trigger_toggle = false;
                            el.classList.add('active');
                            if ('undefined' !== typeof trigger_data.selected_icon_secondary) {
                                el.querySelector('.ae-trigger-icon i').classList.removeMany(trigger_data.selected_icon.value);
                                el.querySelector('.ae-trigger-icon i').classList.addMany(trigger_data.selected_icon_secondary.value);
                            }
                            if ('undefined' !== typeof trigger_data.secondary_text) {
                                el.setAttribute('title', trigger_data.secondary_text);
                                el.querySelector('.ae-trigger-text').innerHTML = trigger_data.secondary_text;
                            }
                        } else if (trigger_data.trigger_action == 'play_pause') {
                            el.classList.add('active');
                        } else if(trigger_data.trigger_action == 'pause_slide'){
                            el.classList.add('active');
                        }
                    }
                }
            });

            $scope.find('.ae-trigger').on('click', function (e) {

                e.preventDefault();
                const $this = $(this);
                const trigger_data = $this.parent('.ae-triggers').data('trigger_settings');
                if (trigger_data.trigger_type == 'carousel') {
                    $scope.find('.ae-triggers').removeClass('active');
                    $this.parent('.ae-triggers').addClass('active');
                    let $mswiper = document.querySelector('.elementor-element-' + trigger_target + ' .ae-swiper-container').swiper;
                    switch (trigger_data.trigger_action) {
                        case 'next_slide':
                            $mswiper.slideNext();
                            break;
                        case 'prev_slide':
                            $mswiper.slidePrev();
                            break;
                        case 'first_slide':
                            if ($mswiper.params.loop == 'yes') {
                                $mswiper.slideTo(3);
                            } else {
                                $mswiper.slideTo(0);
                            }
                            break;
                        case 'last_slide':
                            var totalSlides = $('.elementor-element-' + trigger_target + ' .ae-swiper-container .swiper-slide:not(.swiper-slide-duplicate)').length;
                            $mswiper.slideTo(totalSlides);
                            break;
                        case 'play_slide':
                            $mswiper.autoplay.start();
                            break;
                        case 'pause_slide':
                            $mswiper.autoplay.stop();
                            break;
                        case 'play_pause':
                            if (trigger_toggle) {
                                $mswiper.autoplay.stop();
                                trigger_toggle = false;
                                if ('undefined' !== typeof trigger_data.selected_icon_secondary) {
                                    $this.find('.ae-trigger-icon i').removeClass(trigger_data.selected_icon_secondary.value);
                                    $this.find('.ae-trigger-icon i').addClass(trigger_data.selected_icon.value);
                                }
                                if ('undefined' !== typeof trigger_data.text) {
                                    $this.attr('title', trigger_data.text);
                                    $this.find('.ae-trigger-text').html(trigger_data.text);
                                }
                            } else {
                                $mswiper.autoplay.start();
                                trigger_toggle = true;
                                if ('undefined' !== typeof trigger_data.selected_icon) {
                                    $this.find('.ae-trigger-icon i').removeClass(trigger_data.selected_icon.value);
                                    $this.find('.ae-trigger-icon i').addClass(trigger_data.selected_icon_secondary.value);
                                }
                                if ('undefined' !== typeof trigger_data.secondary_text) {
                                    $this.attr('title', trigger_data.secondary_text);
                                    $this.find('.ae-trigger-text').html(trigger_data.secondary_text);
                                }
                            }
                            break;
                        // code block
                    }
                }
            });


            //For Accordions
            const accordion = $('.elementor-element-' + trigger_target);
            const accordion_setting = accordion.data('settings');
            const widget_type = accordion.data('widget_type');
            let active_class = 'ae-active';
            if (widget_type === 'ae-acf-repeater.accordion') {
                active_class = 'elementor-active';
            }

            jQuery.each($scope.find('.ae-triggers'), function (i, item) {
                const trigger = jQuery(item);
                const trigger_data = trigger.data('trigger_settings');
                if (trigger_data.trigger_type == 'accordion') {
                    if (accordion_setting.accordion_accordion_state == 'all_open') {
                        if (trigger_data.trigger_action == 'expand') {
                            trigger.addClass('active');
                            trigger_toggle = true;
                        }
                    }
                    if (accordion_setting.accordion_accordion_state == 'all_closed') {
                        if (trigger_data.trigger_action == 'collapse') {
                            trigger.addClass('active');
                            trigger_toggle = false;
                        }
                    }
                    if ('undefined' !== typeof trigger_data.selected_icon_secondary) {
                        item.querySelector('.ae-trigger-icon i').classList.removeMany(trigger_data.selected_icon.value);
                        item.querySelector('.ae-trigger-icon i').classList.addMany(trigger_data.selected_icon_secondary.value);
                    }
                    if ('undefined' !== typeof trigger_data.secondary_text) {
                        item.setAttribute('title', trigger_data.secondary_text);
                        item.querySelector('.ae-trigger-text').innerHTML = trigger_data.secondary_text;
                    }
                }
            });

            $scope.find('.ae-trigger').on('click', function (e) {
                e.preventDefault();
                const $this = $(this);
                const trigger_data = $this.parent('.ae-triggers').data('trigger_settings');
                if (trigger_data.trigger_type == 'accordion') {
                    $scope.find('.ae-triggers').removeClass('active');
                    $this.parent('.ae-triggers').addClass('active');
                    const el_target = $('.elementor-element-' + trigger_target);
                    const title = $('.elementor-element-' + trigger_target + ' .ae-tab-title');
                    var content = $('.elementor-element-' + trigger_target + ' .ae-tab-content');
                    const speed = $scope.find('.ae-accordion').data('transition-speed');
                    switch (trigger_data.trigger_action) {
                        case 'expand_collapse':
                            if (trigger_toggle) {
                                title.each(function (index, element) {
                                    $(element).removeClass(active_class);
                                    var content = $(element).next();
                                    content.slideUp(speed);
                                });
                                trigger_toggle = false;
                                if ('undefined' !== typeof trigger_data.selected_icon_secondary) {
                                    $this.find('.ae-trigger-icon i').removeClass(trigger_data.selected_icon_secondary.value);
                                    $this.find('.ae-trigger-icon i').addClass(trigger_data.selected_icon.value);
                                }
                                if ('undefined' !== typeof trigger_data.text) {
                                    $this.attr('title', trigger_data.text);
                                    $this.find('.ae-trigger-text').html(trigger_data.text);
                                }
                            } else {
                                title.each(function (index, element) {
                                    $(element).addClass(active_class);
                                    var content = $(element).next();
                                    content.slideDown(speed);
                                    content.addClass(active_class);
                                });
                                trigger_toggle = true;
                                if ('undefined' !== typeof trigger_data.selected_icon) {
                                    $this.find('.ae-trigger-icon i').removeClass(trigger_data.selected_icon.value);
                                    $this.find('.ae-trigger-icon i').addClass(trigger_data.selected_icon_secondary.value);
                                }
                                if ('undefined' !== typeof trigger_data.secondary_text) {
                                    $this.attr('title', trigger_data.secondary_text);
                                    $this.find('.ae-trigger-text').html(trigger_data.secondary_text);
                                }
                            }
                            break;
                        case 'expand':
                            title.each(function (index, element) {
                                $(element).addClass(active_class);
                                var content = $(element).next();
                                content.slideDown(speed);
                                content.addClass(active_class);
                            });
                            break;
                        case 'collapse':
                            title.each(function (index, element) {
                                $(element).removeClass(active_class);
                                var content = $(element).next();
                                content.slideUp(speed);
                            });
                            break;
                        case 'next':
                            var tab = 0;
                            var current_title = title.parent().find('.ae-tab-title.' + active_class);
                            if (!current_title.length) {
                                tab = tab + 1;
                            } else {
                                tab = current_title.data('tab') + 1;
                            }
                            var next_title = el_target.find('.ae-tab-title[data-tab="' + tab + '"');

                            if (next_title.length) {
                                next_title.addClass(active_class);
                                next_title.next().slideDown(speed);
                                current_title.removeClass(active_class);
                                current_title.next().slideUp(speed);
                            }

                            break;
                        case 'prev':
                            var tab = 0;
                            var current_title = title.parent().find('.ae-tab-title.' + active_class);
                            if (!current_title.length) {
                                tab = title.length;
                            } else {
                                tab = current_title.data('tab') - 1;
                            }
                            var next_title = el_target.find('.ae-tab-title[data-tab="' + tab + '"');
                            if (next_title.length) {
                                next_title.addClass(active_class);
                                next_title.next().slideDown(speed);
                                current_title.removeClass(active_class);
                                current_title.next().slideUp(speed);
                            }
                        
                            break;
                        default:
                        // code block
                    }
                }
            });
        });
    };
    

    DOMTokenList.prototype.addMany = function(classes) {
        var array = classes.split(' ');
        for (var i = 0, length = array.length; i < length; i++) {
        this.add(array[i]);
        }
    }

    DOMTokenList.prototype.removeMany = function(classes) {
        var array = classes.split(' ');
        for (var i = 0, length = array.length; i < length; i++) {
        this.remove(array[i]);
        }
    }

    $(window).on('load', function () {
        const widget_triggers = $('.elementor-widget-ae-trigger');
        $.each(widget_triggers, function (i, widget_trigger) {
            TriggerHandler(widget_trigger, $);
        });
    });

})( jQuery );


/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


( function( $ ) {

    var WooProductCarousel = function ( $scope , $ ) {
        const outer_wrapper =  $scope.find('.ae-swiper-outer-wrapper');
        const wid = $scope.data('id');
        const swiper_settings = outer_wrapper.data('swiper-settings');

        new _base__WEBPACK_IMPORTED_MODULE_0__["SwiperBase"]( swiper_settings, wid);
    };

    $(window).on( 'elementor/frontend/init', function() {
        elementorFrontend.hooks.addAction( 'frontend/element_ready/ae-woo-products.carousel', 	 WooProductCarousel );
    });

})( jQuery );


/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);

(function($){

var WooProductImgeGallery = function ( $scope, $ ) {

    if($scope.parents('.elementor-editor-active').length){
        jQuery( '.woocommerce-product-gallery' ).each( function() {
            jQuery( this ).wc_product_gallery();
            wc_single_product_params.zoom_enabled = 0;
        } );
    }

    let outer_wrapper =  $scope.find('.ae-swiper-outer-wrapper');
    if(outer_wrapper.length){
        const wid = $scope.data('id');
        const swiper_settings = outer_wrapper.data('swiper-settings');
        new _base__WEBPACK_IMPORTED_MODULE_0__["SwiperBase"]( swiper_settings, wid, $scope);
    }

};
    $(window).on( 'elementor/frontend/init', function() {
        elementorFrontend.hooks.addAction('frontend/element_ready/ae-woo-gallery.default', WooProductImgeGallery);
    });

})(jQuery);

/***/ }),
/* 33 */
/***/ (function(module, exports) {

(function($){
    const WooProductsGrid = ( $scope , $ ) => {

        if($scope.hasClass('ae-masonry-yes')){
            const grid = $scope.find('.ae-grid');
            const $grid_obj = grid.masonry({

            });

            $grid_obj.imagesLoaded().progress(function(){
                $grid_obj.masonry('layout');
            });

            $(window).resize(function(){
                // Todo:: Overlap on render mode
                //$grid_obj.masonry('layout');
            });
        }

        $scope.find('.ae-grid-item-inner').hover(function(){
            $(this).find('.ae-grid-overlay').addClass('animated');
        });
    };

    $(window).on( 'elementor/frontend/init', function() {
        elementorFrontend.hooks.addAction( 'frontend/element_ready/ae-woo-products.grid',   WooProductsGrid );
    });

})(jQuery);

/***/ }),
/* 34 */
/***/ (function(module, exports) {

(function($){

    const WooRatingHandler = ( $scope, $ ) => {
        const ratinglink = $scope.find('.woocommerce-review-link');
        const tabsTitles = $( '.ae-woo-tab-title' );
        const tabs = $( '.ae-woo-tab-content' );

        ratinglink.on('click', function () {
            if(tabsTitles.length) {
                tabsTitles.removeClass('active');
                tabs.hide();
                tabsTitles.filter('[data-hashtag="reviews"]').addClass('active');
                tabs.filter('[data-hashtag="reviews"]').show();
            }
        })
    };

    $(window).on( 'elementor/frontend/init', function() {
        elementorFrontend.hooks.addAction( 'frontend/element_ready/ae-woo-rating.default',  WooRatingHandler );
    });

})

/***/ }),
/* 35 */
/***/ (function(module, exports) {

(function($){

    const WooTabsHandler = ( $scope, $ ) => {

        var defaultActiveTab = $scope.find( '.ae-woo-tabs' ).data( 'active-tab' ),
            $tabsTitles = $scope.find( '.ae-woo-tab-title' ),
            $tabs = $scope.find( '.ae-woo-tab-content' ),
            $active,
            $content;

        if ( ! defaultActiveTab ) {
            defaultActiveTab = 1;
        }

        const activateTab = ( tabIndex ) => {
            if ( $active ) {
                $active.removeClass( 'active' );
                $content.hide();
            }

            $active = $tabsTitles.filter( '[data-tab="' + tabIndex + '"]' );
            $active.addClass( 'active' );

            $content = $tabs.filter( '[data-tab="' + tabIndex + '"]' );
            $content.show();
        };

        activateTab( defaultActiveTab );
        $tabsTitles.on( 'click', function() {
            activateTab( this.dataset.tab );
        });

        let $reviewtaglink = window.location.hash.substring(1);
        if($reviewtaglink === 'reviews'){
            let $reviewtab = $tabsTitles.filter('[data-hashtag="reviews"]' );
            activateTab( $reviewtab.data('tab') );
        }
    };

    $(window).on( 'elementor/frontend/init', function() {
        elementorFrontend.hooks.addAction( 'frontend/element_ready/ae-woo-tabs.default', WooTabsHandler );
    });

})(jQuery);

/***/ })
/******/ ]);