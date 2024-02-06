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
/******/ 	return __webpack_require__(__webpack_require__.s = 71);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

(function() { module.exports = window["wp"]["element"]; }());

/***/ }),
/* 1 */
/***/ (function(module, exports) {

(function() { module.exports = window["wp"]["i18n"]; }());

/***/ }),
/* 2 */,
/* 3 */
/***/ (function(module, exports) {

(function() { module.exports = window["wc"]["blocksCheckout"]; }());

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var arrayWithHoles = __webpack_require__(41);

var iterableToArrayLimit = __webpack_require__(42);

var unsupportedIterableToArray = __webpack_require__(34);

var nonIterableRest = __webpack_require__(43);

function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
}

module.exports = _slicedToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 5 */,
/* 6 */,
/* 7 */
/***/ (function(module, exports) {

function _extends() {
  module.exports = _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  return _extends.apply(this, arguments);
}

module.exports = _extends, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _woocommerce_settings__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(13);
/* harmony import */ var _woocommerce_settings__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_woocommerce_settings__WEBPACK_IMPORTED_MODULE_0__);
/**
 * External dependencies
 */

/**
 * Helper for fetching plugin settings.
 */

var getPluginSettings = function getPluginSettings() {
  var _getSetting = Object(_woocommerce_settings__WEBPACK_IMPORTED_MODULE_0__["getSetting"])('wc-gift-cards-blocks_data'),
      showBalanceCheckbox = _getSetting.show_balance_checkbox,
      showRemainingBalance = _getSetting.show_remaining_balance_per_gift_card,
      isUiDisabled = _getSetting.is_ui_disabled,
      isCartDisabled = _getSetting.is_cart_disabled,
      isRedeemingEnabled = _getSetting.is_redeeming_enabled,
      isCart = _getSetting.is_cart,
      isCheckout = _getSetting.is_checkout,
      accountOrdersLink = _getSetting.account_orders_link;

  return {
    isUiDisabled: isUiDisabled,
    isCartDisabled: isCartDisabled,
    isRedeemingEnabled: isRedeemingEnabled,
    isCart: isCart,
    isCheckout: isCheckout,
    showBalanceCheckbox: showBalanceCheckbox,
    showRemainingBalance: showRemainingBalance,
    accountOrdersLink: accountOrdersLink
  };
};

/* harmony default export */ __webpack_exports__["a"] = (getPluginSettings);

/***/ }),
/* 9 */,
/* 10 */,
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
  Copyright (c) 2018 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames() {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				if (arg.length) {
					var inner = classNames.apply(null, arg);
					if (inner) {
						classes.push(inner);
					}
				}
			} else if (argType === 'object') {
				if (arg.toString === Object.prototype.toString) {
					for (var key in arg) {
						if (hasOwn.call(arg, key) && arg[key]) {
							classes.push(key);
						}
					}
				} else {
					classes.push(arg.toString());
				}
			}
		}

		return classes.join(' ');
	}

	if ( true && module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else if (true) {
		// register as 'classnames', consistent with npm package name
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
			return classNames;
		}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}
}());


/***/ }),
/* 12 */
/***/ (function(module, exports) {

(function() { module.exports = window["wc"]["priceFormat"]; }());

/***/ }),
/* 13 */
/***/ (function(module, exports) {

(function() { module.exports = window["wc"]["wcSettings"]; }());

/***/ }),
/* 14 */
/***/ (function(module, exports) {

(function() { module.exports = window["wp"]["data"]; }());

/***/ }),
/* 15 */,
/* 16 */
/***/ (function(module, exports) {

(function() { module.exports = window["wp"]["compose"]; }());

/***/ }),
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

var objectWithoutPropertiesLoose = __webpack_require__(44);

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = objectWithoutPropertiesLoose(source, excluded);
  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

module.exports = _objectWithoutProperties, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 24 */,
/* 25 */
/***/ (function(module, exports) {

(function() { module.exports = window["wp"]["primitives"]; }());

/***/ }),
/* 26 */,
/* 27 */,
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXTERNAL MODULE: external ["wp","element"]
var external_wp_element_ = __webpack_require__(0);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/slicedToArray.js
var slicedToArray = __webpack_require__(4);
var slicedToArray_default = /*#__PURE__*/__webpack_require__.n(slicedToArray);

// EXTERNAL MODULE: external ["wp","i18n"]
var external_wp_i18n_ = __webpack_require__(1);

// EXTERNAL MODULE: ./node_modules/classnames/index.js
var classnames = __webpack_require__(11);
var classnames_default = /*#__PURE__*/__webpack_require__.n(classnames);

// EXTERNAL MODULE: external ["wc","blocksCheckout"]
var external_wc_blocksCheckout_ = __webpack_require__(3);

// EXTERNAL MODULE: external ["wc","priceFormat"]
var external_wc_priceFormat_ = __webpack_require__(12);

// EXTERNAL MODULE: ./resources/js/frontend/blocks/utils/get-plugin-settings.js
var get_plugin_settings = __webpack_require__(8);

// EXTERNAL MODULE: ./resources/js/frontend/blocks/components/balance-checkbox/style.scss
var style = __webpack_require__(53);

// CONCATENATED MODULE: ./resources/js/frontend/blocks/components/balance-checkbox/index.js



/**
 * External dependencies
 */





/**
 * Internal dependencies
 */



/**
 * Displays the account balance checkbox in the cart/checkout totals table.
 *
 * Moreover, it will display account related pending balances, if applicable.
 *
 * @param {Object} props
 * @param {Object} props.extensions The extension-added data on the WC Cart.
 * @return {JSX.Element} The account balance checkbox.
 */

var balance_checkbox_BalanceCheckbox = function BalanceCheckbox(_ref) {
  var extensions = _ref.extensions;
  var _extensions$woocommer = extensions['woocommerce-gift-cards'],
      isUsingBalance = _extensions$woocommer.is_using_balance,
      availableTotal = _extensions$woocommer.available_total,
      pendingTotal = _extensions$woocommer.pending_total;

  var _getPluginSettings = Object(get_plugin_settings["a" /* default */])(),
      accountOrdersLink = _getPluginSettings.accountOrdersLink;

  var _useState = Object(external_wp_element_["useState"])(isUsingBalance),
      _useState2 = slicedToArray_default()(_useState, 2),
      isChecked = _useState2[0],
      setIsChecked = _useState2[1];

  var _useState3 = Object(external_wp_element_["useState"])(false),
      _useState4 = slicedToArray_default()(_useState3, 2),
      isLoading = _useState4[0],
      setIsLoading = _useState4[1];

  var isDisabled = isLoading;
  /**
   * Function that handles checkbox changes.
   *
   * It sets the UI into loading mode, and asks for the server to setup the session.
   *
   * @param {boolean} value The checked state of the checkbox.
   */

  var _onChange = function onChange(value) {
    setIsLoading(true);
    Object(external_wc_blocksCheckout_["extensionCartUpdate"])({
      namespace: 'woocommerce-gift-cards',
      data: {
        action: 'set_balance_usage',
        value: value ? 'yes' : 'no'
      }
    }).then(function () {
      setIsChecked(function (v) {
        return !v;
      });
    }).finally(function () {
      setIsLoading(false);
    });
  }; // Cache sprintf.


  var checkboxLabel = Object(external_wp_element_["useMemo"])(function () {
    var label = Object(external_wp_i18n_["sprintf"])(
    /* translators: %S gift cards balance amount */
    Object(external_wp_i18n_["__"])('Use %s from your gift cards balance.', 'woocommerce-gift-cards'), '<strong>' + Object(external_wc_priceFormat_["formatPrice"])(availableTotal) + '</strong>');
    var pendingOrdersLink = '<a href="' + accountOrdersLink + '">' + // TODO: Add link.
    Object(external_wp_i18n_["__"])('pending orders', 'woocommerce-gift-cards') + '</a>';
    var pendingText = Object(external_wp_i18n_["sprintf"])(
    /* translators: %1$s pending balance, %2$s pending orders link html */
    Object(external_wp_i18n_["__"])('%1$s on hold in %2$s', 'woocommerce-gift-cards'), Object(external_wc_priceFormat_["formatPrice"])(pendingTotal), pendingOrdersLink);
    return Object(external_wp_element_["createElement"])(external_wp_element_["RawHTML"], {
      className: 'wc-gift-cards-checkbox-message'
    }, label, pendingTotal > 0 && '<div class="wc-block-components-totals-item__description">' + pendingText + '</div>');
  }, [availableTotal, pendingTotal, accountOrdersLink]); // Render Gift Cards Balance Checkbox.

  return Object(external_wp_element_["createElement"])(external_wc_blocksCheckout_["TotalsWrapper"], null, Object(external_wp_element_["createElement"])("div", {
    className: classnames_default()('wc-gc-balance-checkbox-container', {
      'wc-gc-balance-checkbox-container--disabled': isDisabled
    })
  }, Object(external_wp_element_["createElement"])(external_wc_blocksCheckout_["CheckboxControl"], {
    className: "wc-gc-balance-checkbox",
    id: "wc-gc-balance-checkbox",
    checked: isChecked,
    onChange: function onChange(value) {
      return _onChange(value);
    },
    disabled: isDisabled
  }, checkboxLabel)));
};

/* harmony default export */ var balance_checkbox = (balance_checkbox_BalanceCheckbox);
// EXTERNAL MODULE: external ["wp","data"]
var external_wp_data_ = __webpack_require__(14);

// EXTERNAL MODULE: external ["wp","compose"]
var external_wp_compose_ = __webpack_require__(16);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/extends.js
var helpers_extends = __webpack_require__(7);
var extends_default = /*#__PURE__*/__webpack_require__.n(helpers_extends);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/objectWithoutProperties.js
var objectWithoutProperties = __webpack_require__(23);
var objectWithoutProperties_default = /*#__PURE__*/__webpack_require__.n(objectWithoutProperties);

// CONCATENATED MODULE: ./resources/js/frontend/blocks/components/chip/chip.js


var _excluded = ["text", "screenReaderText", "element", "className", "radius", "children"];


/**
 * External dependencies
 */

/**
 * Component used to render a "chip" -- a list item containing some text.
 *
 * Each chip defaults to a list element but this can be customized by providing
 * a wrapperElement.
 *
 * @param {Object} props
 * @param {string} props.text
 * @param {string} props.screenReaderText
 * @param {string} props.element
 * @param {string} props.className
 * @param {string} props.radius
 * @param {Array} props.children
 */

var chip_Chip = function Chip(_ref) {
  var text = _ref.text,
      _ref$screenReaderText = _ref.screenReaderText,
      screenReaderText = _ref$screenReaderText === void 0 ? '' : _ref$screenReaderText,
      _ref$element = _ref.element,
      element = _ref$element === void 0 ? 'li' : _ref$element,
      _ref$className = _ref.className,
      className = _ref$className === void 0 ? '' : _ref$className,
      _ref$radius = _ref.radius,
      radius = _ref$radius === void 0 ? 'small' : _ref$radius,
      _ref$children = _ref.children,
      children = _ref$children === void 0 ? null : _ref$children,
      props = objectWithoutProperties_default()(_ref, _excluded);

  var Wrapper = element;
  var wrapperClassName = classnames_default()(className, 'wc-block-components-chip', 'wc-block-components-chip--radius-' + radius);
  var showScreenReaderText = Boolean(screenReaderText && screenReaderText !== text);
  return Object(external_wp_element_["createElement"])(Wrapper, extends_default()({
    className: wrapperClassName
  }, props), Object(external_wp_element_["createElement"])("span", {
    "aria-hidden": showScreenReaderText,
    className: "wc-block-components-chip__text"
  }, text), showScreenReaderText && Object(external_wp_element_["createElement"])("span", {
    className: "screen-reader-text"
  }, screenReaderText), children);
};

/* harmony default export */ var chip = (chip_Chip);
// EXTERNAL MODULE: ./node_modules/@wordpress/icons/build-module/icon/index.js
var icon = __webpack_require__(68);

// EXTERNAL MODULE: external ["wp","primitives"]
var external_wp_primitives_ = __webpack_require__(25);

// CONCATENATED MODULE: ./node_modules/@wordpress/icons/build-module/library/close-small.js


/**
 * WordPress dependencies
 */

const closeSmall = Object(external_wp_element_["createElement"])(external_wp_primitives_["SVG"], {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24"
}, Object(external_wp_element_["createElement"])(external_wp_primitives_["Path"], {
  d: "M12 13.06l3.712 3.713 1.061-1.06L13.061 12l3.712-3.712-1.06-1.06L12 10.938 8.288 7.227l-1.061 1.06L10.939 12l-3.712 3.712 1.06 1.061L12 13.061z"
}));
/* harmony default export */ var close_small = (closeSmall);
//# sourceMappingURL=close-small.js.map
// EXTERNAL MODULE: ./resources/js/frontend/blocks/components/chip/style.scss
var chip_style = __webpack_require__(54);

// CONCATENATED MODULE: ./resources/js/frontend/blocks/components/chip/removable-chip.js


var removable_chip_excluded = ["ariaLabel", "className", "disabled", "onRemove", "removeOnAnyClick", "text", "screenReaderText"];


/**
 * External dependencies
 */



/**
 * Internal dependencies
 */



/**
 * Component used to render a "chip" -- an item containing some text with
 * an X button to remove/dismiss each chip.
 *
 * @param {Object} props Incoming props for the component.
 * @param {string} props.ariaLabel Aria label content.
 * @param {string} props.className CSS class used.
 * @param {boolean} props.disabled Whether action is disabled or not.
 * @param {function():any} props.onRemove Function to call when remove event is fired.
 * @param {boolean} props.removeOnAnyClick Whether to expand click area for remove event.
 * @param {string} props.text The text for the chip.
 * @param {string} props.screenReaderText The screen reader text for the chip.
 * @param {Object} props.props Rest of props passed into component.
 */

var removable_chip_RemovableChip = function RemovableChip(_ref) {
  var _ref$ariaLabel = _ref.ariaLabel,
      ariaLabel = _ref$ariaLabel === void 0 ? '' : _ref$ariaLabel,
      _ref$className = _ref.className,
      className = _ref$className === void 0 ? '' : _ref$className,
      _ref$disabled = _ref.disabled,
      disabled = _ref$disabled === void 0 ? false : _ref$disabled,
      _ref$onRemove = _ref.onRemove,
      onRemove = _ref$onRemove === void 0 ? function () {
    return void 0;
  } : _ref$onRemove,
      _ref$removeOnAnyClick = _ref.removeOnAnyClick,
      removeOnAnyClick = _ref$removeOnAnyClick === void 0 ? false : _ref$removeOnAnyClick,
      text = _ref.text,
      _ref$screenReaderText = _ref.screenReaderText,
      screenReaderText = _ref$screenReaderText === void 0 ? '' : _ref$screenReaderText,
      props = objectWithoutProperties_default()(_ref, removable_chip_excluded);

  var RemoveElement = removeOnAnyClick ? 'span' : 'button';

  if (!ariaLabel) {
    var ariaLabelText = screenReaderText && typeof screenReaderText === 'string' ? screenReaderText : text;
    ariaLabel = typeof ariaLabelText !== 'string' ?
    /* translators: Remove chip. */
    Object(external_wp_i18n_["__"])('Remove', 'woocommerce-gift-cards') : Object(external_wp_i18n_["sprintf"])(
    /* translators: %s text of the chip to remove. */
    Object(external_wp_i18n_["__"])('Remove gift card "%s"', 'woocommerce-gift-cards'), ariaLabelText);
  }

  var clickableElementProps = {
    'aria-label': ariaLabel,
    disabled: disabled,
    onClick: onRemove,
    onKeyDown: function onKeyDown(e) {
      if (e.key === 'Backspace' || e.key === 'Delete') {
        onRemove();
      }
    }
  };
  var chipProps = removeOnAnyClick ? clickableElementProps : {};
  var removeProps = removeOnAnyClick ? {
    'aria-hidden': true
  } : clickableElementProps;
  return Object(external_wp_element_["createElement"])(chip, extends_default()({}, props, chipProps, {
    className: classnames_default()(className, 'is-removable', {
      'is-removing': disabled
    }),
    element: removeOnAnyClick ? 'button' : props.element,
    screenReaderText: screenReaderText,
    text: text
  }), Object(external_wp_element_["createElement"])(RemoveElement, extends_default()({
    className: "wc-block-components-chip__remove"
  }, removeProps), Object(external_wp_element_["createElement"])(icon["a" /* default */], {
    className: "wc-block-components-chip__remove-icon",
    icon: close_small,
    size: 16
  })));
};

/* harmony default export */ var removable_chip = (removable_chip_RemovableChip);
// CONCATENATED MODULE: ./resources/js/frontend/blocks/components/chip/index.js


// CONCATENATED MODULE: ./resources/js/frontend/blocks/components/applied-gift-cards-totals/applied-gift-card.js



/**
 * External dependencies
 */




/**
 * Internal dependencies
 */



/**
 * Displays an applied gift card in the card.
 *
 * @param {Object} props
 * @param {Object} props.giftcard The JS representation of the applied gift card.
 * @param {Function} props.handleRemove The function to handle the removal.
 * @return {JSX.Element} A panel used to display an applied gift card.
 */

var applied_gift_card_AppliedGiftCard = function AppliedGiftCard(_ref) {
  var giftcard = _ref.giftcard,
      handleRemove = _ref.handleRemove;
  var currency = Object(external_wc_priceFormat_["getCurrency"])();

  var _useState = Object(external_wp_element_["useState"])(false),
      _useState2 = slicedToArray_default()(_useState, 2),
      isDisabled = _useState2[0],
      setIsDisabled = _useState2[1];

  var id = giftcard.id,
      code = giftcard.code,
      amount = giftcard.amount,
      balance = giftcard.balance,
      pendingMessage = giftcard.pending_message;

  var _getPluginSettings = Object(get_plugin_settings["a" /* default */])(),
      showRemainingBalance = _getPluginSettings.showRemainingBalance;

  return Object(external_wp_element_["createElement"])(external_wc_blocksCheckout_["TotalsWrapper"], null, Object(external_wp_element_["createElement"])(external_wc_blocksCheckout_["TotalsItem"], {
    className: "wc-gift-cards-totals wc-block-components-totals-discount",
    currency: currency,
    label: Object(external_wp_i18n_["__"])('Gift Card:', 'woocommerce-gift-cards'),
    value: -1 * parseInt(amount, 10),
    description: Object(external_wp_element_["createElement"])(external_wp_element_["Fragment"], null, Object(external_wp_element_["createElement"])(removable_chip, {
      key: 'gifcard-' + code,
      className: "wc-gift-cards-totals-giftcard__code-list-item",
      text: code,
      element: "div",
      radius: "large",
      screenReaderText: Object(external_wp_i18n_["sprintf"])(
      /* translators: %s Gift card code. */
      Object(external_wp_i18n_["__"])('Gift Card: %s', 'woocommerce-gift-cards'), code),
      disabled: isDisabled,
      onRemove: function onRemove() {
        setIsDisabled(true);
        handleRemove(id);
      },
      ariaLabel: Object(external_wp_i18n_["sprintf"])(
      /* translators: %s gift card code. */
      Object(external_wp_i18n_["__"])('Remove gift card "%s"', 'woocommerce-gift-cards'), code)
    }), pendingMessage && Object(external_wp_element_["createElement"])(external_wp_element_["RawHTML"], null, pendingMessage), showRemainingBalance && Object(external_wp_element_["createElement"])("div", null, Object(external_wp_element_["createElement"])("strong", null, Object(external_wp_i18n_["__"])('Remaining Balance:', 'woocommerce-gift-cards')), Object(external_wp_element_["createElement"])("div", null, Object(external_wc_priceFormat_["formatPrice"])(balance - amount))))
  }));
};

/* harmony default export */ var applied_gift_card = (applied_gift_card_AppliedGiftCard);
// CONCATENATED MODULE: ./resources/js/frontend/blocks/components/applied-gift-cards-totals/index.js


/**
 * External dependencies
 */




/**
 * Internal dependencies
 */



/**
 * Inline Gift Cards.
 *
 * @param {Object} props
 * @param {Object} props.extensions The extension-added data on the WC Cart.
 * @param {Function} props.createNotice
 * @return {JSX.Element} A panel used to display the inline gift card form.
 */

var applied_gift_cards_totals_AppliedGiftCardTotals = function AppliedGiftCardTotals(_ref) {
  var extensions = _ref.extensions,
      createNotice = _ref.createNotice;
  var appliedGiftCards = extensions['woocommerce-gift-cards'].applied_giftcards;

  if (!appliedGiftCards.length) {
    return null;
  }

  var _getPluginSettings = Object(get_plugin_settings["a" /* default */])(),
      isCheckout = _getPluginSettings.isCheckout;
  /**
   * Function to handle the code removal.
   *
   * @param {number} giftcardId The giftcard ID to remove from session.
   */


  var handleRemove = function handleRemove(giftcardId) {
    Object(external_wc_blocksCheckout_["extensionCartUpdate"])({
      namespace: 'woocommerce-gift-cards',
      data: {
        action: 'remove_gift_card_from_session',
        wc_gc_remove_id: giftcardId
      }
    }).then(function () {
      var message = Object(external_wp_i18n_["__"])('Gift card code has been removed.', 'woocommerce-gift-cards');

      createNotice('default', message, {
        id: 'wc-gift-cards-removed-gift-card',
        type: 'snackbar',
        context: !isCheckout ? 'wc/cart' : 'wc/checkout'
      });
    }).catch(function () {// ...
    });
  };

  return appliedGiftCards.map(function (giftcard) {
    return Object(external_wp_element_["createElement"])(applied_gift_card, {
      key: 'giftcard-' + giftcard.id,
      giftcard: giftcard,
      handleRemove: handleRemove
    });
  });
};

/* harmony default export */ var applied_gift_cards_totals = (Object(external_wp_compose_["compose"])(Object(external_wp_data_["withDispatch"])(function (dispatch) {
  var _dispatch = dispatch('core/notices'),
      createNotice = _dispatch.createNotice;

  return {
    createNotice: createNotice
  };
}))(applied_gift_cards_totals_AppliedGiftCardTotals));
// CONCATENATED MODULE: ./resources/js/frontend/blocks/components/account-gift-cards-totals/index.js


/**
 * External dependencies
 */



/**
 * Internal dependencies
 */


/**
 * Component AccountGiftCardTotals
 *
 * Displays account-related gift cards in the cart/checkout totals table.
 *
 * @param {Object} props
 * @param {Object} props.extensions The extension-added data on the WC Cart.
 * @return {JSX.Element} A panel used to display the inline gift card form.
 */

var account_gift_cards_totals_AccountGiftCardTotals = function AccountGiftCardTotals(_ref) {
  var extensions = _ref.extensions;
  var _extensions$woocommer = extensions['woocommerce-gift-cards'],
      accountGiftCards = _extensions$woocommer.account_giftcards,
      accountBalance = _extensions$woocommer.balance,
      availableTotal = _extensions$woocommer.available_total;

  if (accountGiftCards.length === 0) {
    return null;
  }

  var currency = Object(external_wc_priceFormat_["getCurrency"])();
  var totalBalanceUsed = accountGiftCards.reduce(function (total, giftcard) {
    total = total + parseInt(giftcard.amount, 10);
    return total;
  }, 0);
  return Object(external_wp_element_["createElement"])(external_wp_element_["Fragment"], null, Object(external_wp_element_["createElement"])(external_wc_blocksCheckout_["TotalsWrapper"], null, Object(external_wp_element_["createElement"])(external_wc_blocksCheckout_["TotalsItem"], {
    className: "wc-gift-cards-totals wc-block-components-totals-discount",
    currency: currency,
    label: Object(external_wp_i18n_["__"])('Gift Cards Balance', 'woocommerce-gift-cards'),
    value: -1 * totalBalanceUsed,
    description: Object(external_wp_element_["createElement"])(external_wp_element_["Fragment"], null, Object(external_wp_element_["createElement"])("strong", null, Object(external_wp_i18n_["_n"])('Code:', 'Codes:', accountGiftCards.length, 'woocommerce-gift-cards')), Object(external_wp_element_["createElement"])("ul", {
      className: "wc-block-components-totals-discount__coupon-list"
    }, accountGiftCards.map(function (giftcard) {
      return Object(external_wp_element_["createElement"])(chip, {
        key: 'account-giftcard-' + giftcard.code,
        className: "wc-block-components-totals-discount__coupon-list-item",
        text: giftcard.code,
        radius: "large",
        screenReaderText: Object(external_wp_i18n_["sprintf"])(
        /* translators: %s Gift card code. */
        Object(external_wp_i18n_["__"])('Gift Card: %s', 'woocommerce-gift-cards'), giftcard.code)
      });
    })), Object(external_wp_element_["createElement"])("strong", null, Object(external_wp_i18n_["__"])('Remaining Balance:', 'woocommerce-gift-cards')), Object(external_wp_element_["createElement"])("div", null, Object(external_wc_priceFormat_["formatPrice"])(accountBalance - availableTotal)))
  })));
};

/* harmony default export */ var account_gift_cards_totals = (account_gift_cards_totals_AccountGiftCardTotals);
// CONCATENATED MODULE: ./resources/js/frontend/blocks/components/totals-item/index.js


/**
 * External dependencies
 */



/**
 * Displays the total before Gift Cards in the cart/checkout totals table.
 *
 * @param {Object} props
 * @param {Object} props.extensions The extension-added data on the WC Cart.
 * @return {JSX.Element} The account balance checkbox.
 */

var totals_item_TotalBeforeGiftCardsItem = function TotalBeforeGiftCardsItem(_ref) {
  var extensions = _ref.extensions;
  var notApplicable = !extensions || !extensions.hasOwnProperty('woocommerce-gift-cards') || !extensions['woocommerce-gift-cards'].hasOwnProperty('account_giftcards');

  if (notApplicable === true) {
    return null;
  }

  var _extensions$woocommer = extensions['woocommerce-gift-cards'],
      cartTotal = _extensions$woocommer.cart_total,
      appliedGiftCards = _extensions$woocommer.applied_giftcards,
      accountGiftCards = _extensions$woocommer.account_giftcards;

  if (!appliedGiftCards.length && !accountGiftCards.length) {
    return null;
  }

  var currency = Object(external_wc_priceFormat_["getCurrency"])();
  return Object(external_wp_element_["createElement"])(external_wc_blocksCheckout_["TotalsWrapper"], null, Object(external_wp_element_["createElement"])(external_wc_blocksCheckout_["TotalsItem"], {
    className: "wc-gift-cards-totals wc-block-components-totals-footer-item",
    currency: currency,
    label: Object(external_wp_i18n_["__"])('Total', 'woocommerce-gift-cards'),
    value: parseInt(cartTotal, 10),
    description: Object(external_wp_i18n_["__"])('(before gift cards)', 'woocommerce-gift-cards')
  }));
};

/* harmony default export */ var totals_item = (totals_item_TotalBeforeGiftCardsItem);
// CONCATENATED MODULE: ./resources/js/frontend/blocks/components/gift-cards-totals/index.js


/**
 * Internal dependencies
 */





/**
 * Displays gift card related totals table.
 *
 * @param {Object} props
 * @param {Object} props.cart The JS representation of the user's shopping cart.
 * @param {Object} props.extensions The extension-added data on the WC Cart.
 * @return {JSX.Element} The gift card totals.
 */

var gift_cards_totals_GiftCardsTotals = function GiftCardsTotals(props) {
  var notApplicable = !props.extensions || !props.extensions.hasOwnProperty('woocommerce-gift-cards') || !(props !== null && props !== void 0 && props.extensions['woocommerce-gift-cards'].hasOwnProperty('account_giftcards'));

  if (notApplicable === true) {
    return null;
  }

  var _props$extensions$woo = props.extensions['woocommerce-gift-cards'],
      accountBalance = _props$extensions$woo.balance,
      availableTotal = _props$extensions$woo.available_total;

  var _getPluginSettings = Object(get_plugin_settings["a" /* default */])(),
      isRedeemingEnabled = _getPluginSettings.isRedeemingEnabled,
      showBalanceCheckbox = _getPluginSettings.showBalanceCheckbox;

  var showAccountRelatedUI = accountBalance > 0 && isRedeemingEnabled && showBalanceCheckbox;
  return Object(external_wp_element_["createElement"])(external_wp_element_["Fragment"], null, Object(external_wp_element_["createElement"])(totals_item, props), Object(external_wp_element_["createElement"])(applied_gift_cards_totals, props), showAccountRelatedUI && availableTotal > 0 && Object(external_wp_element_["createElement"])(balance_checkbox, props), showAccountRelatedUI && Object(external_wp_element_["createElement"])(account_gift_cards_totals, props));
};

/* harmony default export */ var gift_cards_totals = __webpack_exports__["a"] = (gift_cards_totals_GiftCardsTotals);

/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/slicedToArray.js
var slicedToArray = __webpack_require__(4);
var slicedToArray_default = /*#__PURE__*/__webpack_require__.n(slicedToArray);

// EXTERNAL MODULE: external ["wp","element"]
var external_wp_element_ = __webpack_require__(0);

// EXTERNAL MODULE: external ["wp","i18n"]
var external_wp_i18n_ = __webpack_require__(1);

// EXTERNAL MODULE: external ["wc","blocksCheckout"]
var external_wc_blocksCheckout_ = __webpack_require__(3);

// EXTERNAL MODULE: external ["wp","data"]
var external_wp_data_ = __webpack_require__(14);

// EXTERNAL MODULE: external ["wp","compose"]
var external_wp_compose_ = __webpack_require__(16);

// EXTERNAL MODULE: ./node_modules/classnames/index.js
var classnames = __webpack_require__(11);
var classnames_default = /*#__PURE__*/__webpack_require__.n(classnames);

// CONCATENATED MODULE: ./resources/js/frontend/blocks/components/loading-mask/index.js


/**
 * External dependencies
 */

 // @todo Find a way to block buttons/form components when LoadingMask isLoading

var loading_mask_LoadingMask = function LoadingMask(_ref) {
  var children = _ref.children,
      className = _ref.className,
      screenReaderLabel = _ref.screenReaderLabel,
      _ref$isLoading = _ref.isLoading,
      isLoading = _ref$isLoading === void 0 ? true : _ref$isLoading;
  return Object(external_wp_element_["createElement"])("div", {
    className: classnames_default()(className, {
      'wc-block-components-loading-mask': isLoading
    })
  }, Object(external_wp_element_["createElement"])("div", {
    className: classnames_default()({
      'wc-block-components-loading-mask__children': isLoading
    }),
    "aria-hidden": isLoading
  }, children), isLoading && Object(external_wp_element_["createElement"])("span", {
    className: "screen-reader-text"
  }, screenReaderLabel || Object(external_wp_i18n_["__"])('Loading…', 'woocommerce-gift-cards')));
};

/* harmony default export */ var loading_mask = (loading_mask_LoadingMask);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/extends.js
var helpers_extends = __webpack_require__(7);
var extends_default = /*#__PURE__*/__webpack_require__.n(helpers_extends);

// EXTERNAL MODULE: ./resources/js/frontend/blocks/components/text-input/style.scss
var style = __webpack_require__(51);

// CONCATENATED MODULE: ./resources/js/frontend/blocks/components/text-input/index.js




/**
 * External dependencies
 */



/**
 * Internal dependencies
 */


/**
 * Displays a text input.
 *
 * @param {Object} props
 * @param {string} props.className
 * @param {number} props.id
 * @param {string} props.type
 * @param {string} props.ariaLabel
 * @param {string} props.ariaDescribedBy
 * @param {string} props.label
 * @param {string} props.screenReaderLabel
 * @param {boolean} props.disabled
 * @param {string} props.help
 * @param {boolean} props.autoCapitalize
 * @param {boolean} props.autoComplete
 * @param {string} props.value
 * @param {Function} props.onChange
 * @param {number} props.min
 * @param {number} props.max
 * @param {number} props.step
 * @param {boolean} props.hasError
 * @param {boolean} props.required
 * @param {boolean} props.focusOnMount
 * @param {boolean} props.onBlur
 * @return {JSX.Element} TextInput.
 */

var text_input_TextInput = function TextInput(_ref) {
  var className = _ref.className,
      id = _ref.id,
      _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'text' : _ref$type,
      ariaLabel = _ref.ariaLabel,
      ariaDescribedBy = _ref.ariaDescribedBy,
      label = _ref.label,
      screenReaderLabel = _ref.screenReaderLabel,
      disabled = _ref.disabled,
      help = _ref.help,
      _ref$autoCapitalize = _ref.autoCapitalize,
      autoCapitalize = _ref$autoCapitalize === void 0 ? 'off' : _ref$autoCapitalize,
      _ref$autoComplete = _ref.autoComplete,
      autoComplete = _ref$autoComplete === void 0 ? 'off' : _ref$autoComplete,
      _ref$value = _ref.value,
      value = _ref$value === void 0 ? '' : _ref$value,
      _onChange = _ref.onChange,
      min = _ref.min,
      max = _ref.max,
      step = _ref.step,
      _ref$hasError = _ref.hasError,
      hasError = _ref$hasError === void 0 ? false : _ref$hasError,
      _ref$required = _ref.required,
      required = _ref$required === void 0 ? false : _ref$required,
      _ref$focusOnMount = _ref.focusOnMount,
      focusOnMount = _ref$focusOnMount === void 0 ? false : _ref$focusOnMount,
      _ref$onBlur = _ref.onBlur,
      _onBlur = _ref$onBlur === void 0 ? function () {
    /* Do nothing */
  } : _ref$onBlur;

  var _useState = Object(external_wp_element_["useState"])(true),
      _useState2 = slicedToArray_default()(_useState, 2),
      isPristine = _useState2[0],
      setIsPristine = _useState2[1];

  var _useState3 = Object(external_wp_element_["useState"])(false),
      _useState4 = slicedToArray_default()(_useState3, 2),
      isActive = _useState4[0],
      setIsActive = _useState4[1];

  var inputRef = Object(external_wp_element_["useRef"])(null);
  /**
   * Focus on mount
   *
   * If the input is in pristine state, focus the element.
   */

  Object(external_wp_element_["useEffect"])(function () {
    if (isPristine && focusOnMount) {
      var _inputRef$current;

      (_inputRef$current = inputRef.current) === null || _inputRef$current === void 0 ? void 0 : _inputRef$current.focus();
    }

    setIsPristine(false);
  }, [focusOnMount, isPristine]);
  var numberAttributesFromProps = type === 'number' ? {
    step: step,
    min: min,
    max: max
  } : {};
  var numberProps = {};
  Object.keys(numberAttributesFromProps).forEach(function (key) {
    if (typeof numberAttributesFromProps[key] === 'undefined') {
      return;
    }

    numberProps[key] = numberAttributesFromProps[key];
  });
  return Object(external_wp_element_["createElement"])("div", {
    className: classnames_default()('wc-gift-cards-text-input', className, {
      'is-active': isActive || value,
      'has-error': hasError
    })
  }, Object(external_wp_element_["createElement"])("input", extends_default()({
    type: type,
    id: id,
    value: value,
    ref: inputRef,
    autoCapitalize: autoCapitalize,
    autoComplete: autoComplete,
    onChange: function onChange(event) {
      _onChange(event.target.value);
    },
    onFocus: function onFocus() {
      return setIsActive(true);
    },
    onBlur: function onBlur(event) {
      _onBlur(event.target.value);

      setIsActive(false);
    },
    "aria-label": ariaLabel || label,
    disabled: disabled,
    "aria-describedby": !!help && !ariaDescribedBy ? id + '__help' : ariaDescribedBy,
    required: required
  }, numberProps)), Object(external_wp_element_["createElement"])(external_wc_blocksCheckout_["Label"], {
    label: label,
    screenReaderLabel: screenReaderLabel || label,
    wrapperElement: "label",
    wrapperProps: {
      htmlFor: id
    },
    htmlFor: id
  }));
};

/* harmony default export */ var text_input = (text_input_TextInput);
// EXTERNAL MODULE: ./resources/js/frontend/blocks/utils/get-plugin-settings.js
var get_plugin_settings = __webpack_require__(8);

// EXTERNAL MODULE: ./resources/js/frontend/blocks/components/gift-cards-form/style.scss
var gift_cards_form_style = __webpack_require__(52);

// CONCATENATED MODULE: ./resources/js/frontend/blocks/components/gift-cards-form/index.js



/**
 * External dependencies
 */





/**
 * Internal dependencies
 */





/**
 * Inline form for applying gift card codes in the cart.
 *
 * @param {Object} props
 * @param {Object} props.extensions The extension-added data on the WC Cart.
 * @param {Function} props.createNotice
 * @return {JSX.Element} A panel used to display the inline gift card form.
 */

var gift_cards_form_GiftCardsForm = function GiftCardsForm(_ref) {
  var extensions = _ref.extensions,
      createNotice = _ref.createNotice;

  // Form state.
  var _useState = Object(external_wp_element_["useState"])(''),
      _useState2 = slicedToArray_default()(_useState, 2),
      giftCardCode = _useState2[0],
      setGiftCardCode = _useState2[1];

  var _useState3 = Object(external_wp_element_["useState"])(false),
      _useState4 = slicedToArray_default()(_useState3, 2),
      isProcessing = _useState4[0],
      setIsProcessing = _useState4[1]; // Error handling state.


  var _useState5 = Object(external_wp_element_["useState"])(false),
      _useState6 = slicedToArray_default()(_useState5, 2),
      showError = _useState6[0],
      setShowError = _useState6[1];

  var _useState7 = Object(external_wp_element_["useState"])(''),
      _useState8 = slicedToArray_default()(_useState7, 2),
      errorMessage = _useState8[0],
      setErrorMessage = _useState8[1];

  var notApplicable = !extensions || !extensions.hasOwnProperty('woocommerce-gift-cards') || !extensions['woocommerce-gift-cards'].hasOwnProperty('account_giftcards');

  if (notApplicable === true) {
    return null;
  }

  var _getPluginSettings = Object(get_plugin_settings["a" /* default */])(),
      isCheckout = _getPluginSettings.isCheckout;
  /**
   * Function applyGiftCardCode.
   *
   * Applies a given code to the current session using the extensionCartUpdate.
   *
   * @param {string} codeToApply
   */


  var applyGiftCardCode = function applyGiftCardCode(codeToApply) {
    codeToApply = codeToApply.trim();
    var codeRegex = /^([a-zA-Z0-9]{4}[\-]){3}[a-zA-Z0-9]{4}$/;

    if (!codeToApply.match(codeRegex)) {
      var message = Object(external_wp_i18n_["__"])('Please enter a gift card code that follows the format XXXX-XXXX-XXXX-XXXX, where X can be any letter or number.', 'woocommerce-gift-cards');

      setGiftCardCode('');
      setErrorMessage(message);
      setShowError(true);
      return;
    }

    setIsProcessing(true);
    setShowError(false);
    setErrorMessage('');
    Object(external_wc_blocksCheckout_["extensionCartUpdate"])({
      namespace: 'woocommerce-gift-cards',
      data: {
        action: 'apply_gift_card_to_session',
        wc_gc_cart_code: codeToApply
      }
    }).then(function () {
      var message = Object(external_wp_i18n_["__"])('Gift card code has been applied.', 'woocommerce-gift-cards');

      createNotice('default', message, {
        id: 'wc-gift-cards-form-notice',
        type: 'snackbar',
        context: !isCheckout ? 'wc/cart' : 'wc/checkout'
      });
    }).catch(function (err) {
      setShowError(true);

      if (err !== null && err !== void 0 && err.message && typeof err.message === 'string') {
        setErrorMessage(err.message);
        return;
      }

      setErrorMessage(Object(external_wp_i18n_["__"])('An unknown error occurred.', 'woocommerce-gift-cards'));
    }).finally(function () {
      setIsProcessing(false);
      setGiftCardCode('');
    });
  }; // Render Inline Gift Card Form Panel.


  return Object(external_wp_element_["createElement"])(external_wc_blocksCheckout_["Panel"], {
    className: "wc-gift-cards-apply-panel",
    hasBorder: false,
    initialOpen: false,
    title: Object(external_wp_i18n_["__"])('Have a gift card?', 'woocommerce-gift-cards')
  }, Object(external_wp_element_["createElement"])(loading_mask, {
    isLoading: isProcessing
  }, Object(external_wp_element_["createElement"])("form", {
    className: "wc-gift-cards-form"
  }, Object(external_wp_element_["createElement"])(text_input, {
    id: 'wc-gift-cards-form-input',
    label: Object(external_wp_i18n_["__"])('Enter code', 'woocommerce-gift-cards'),
    type: 'string',
    value: giftCardCode,
    disabled: isProcessing,
    ariaDescribedBy: '',
    onChange: function onChange(newGiftCardCode) {
      setGiftCardCode(newGiftCardCode);
    },
    focusOnMount: true,
    hasError: showError && giftCardCode === '',
    errorMessage: errorMessage
  }), Object(external_wp_element_["createElement"])(external_wc_blocksCheckout_["Button"], {
    className: 'wc-gift-cards-form__button',
    disabled: giftCardCode === null || giftCardCode === '' || isProcessing,
    showSpinner: isProcessing,
    onClick: function onClick(e) {
      e.preventDefault();
      applyGiftCardCode(giftCardCode);
    },
    type: "submit"
  }, Object(external_wp_i18n_["__"])('Apply', 'woocommerce-gift-cards')), showError && Object(external_wp_element_["createElement"])("div", {
    className: "wc-gift-cards-form__error"
  }, Object(external_wp_element_["createElement"])(external_wp_element_["RawHTML"], null, errorMessage)))));
};

/* harmony default export */ var gift_cards_form = __webpack_exports__["a"] = (Object(external_wp_compose_["compose"])(Object(external_wp_data_["withDispatch"])(function (dispatch) {
  var _dispatch = dispatch('core/notices'),
      createNotice = _dispatch.createNotice;

  return {
    createNotice: createNotice
  };
}))(gift_cards_form_GiftCardsForm));

/***/ }),
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */
/***/ (function(module, exports) {

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

module.exports = _arrayLikeToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

var arrayLikeToArray = __webpack_require__(33);

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
}

module.exports = _unsupportedIterableToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 35 */,
/* 36 */
/***/ (function(module) {

module.exports = JSON.parse("{\"name\":\"woocommerce/checkout-order-summary-gift-card-form-block\",\"version\":\"1.0.0\",\"title\":\"Gift Card Form\",\"description\":\"Shows the apply gift card form.\",\"category\":\"woocommerce\",\"supports\":{\"align\":false,\"html\":false,\"multiple\":false,\"reusable\":false},\"attributes\":{\"className\":{\"type\":\"string\",\"default\":\"\"},\"lock\":{\"type\":\"object\",\"default\":{\"remove\":true,\"move\":false}}},\"parent\":[\"woocommerce/checkout-order-summary-block\"],\"textdomain\":\"woocommerce-gift-cards\",\"apiVersion\":2}");

/***/ }),
/* 37 */
/***/ (function(module) {

module.exports = JSON.parse("{\"name\":\"woocommerce/checkout-order-summary-gift-card-totals-block\",\"version\":\"1.0.0\",\"title\":\"Gift Card Totals\",\"description\":\"Shows the gift card totals.\",\"category\":\"woocommerce\",\"supports\":{\"align\":false,\"html\":false,\"multiple\":false,\"reusable\":false},\"attributes\":{\"className\":{\"type\":\"string\",\"default\":\"\"},\"lock\":{\"type\":\"object\",\"default\":{\"remove\":true,\"move\":false}}},\"parent\":[\"woocommerce/checkout-order-summary-block\"],\"textdomain\":\"woocommerce-gift-cards\",\"apiVersion\":2}");

/***/ }),
/* 38 */
/***/ (function(module) {

module.exports = JSON.parse("{\"name\":\"woocommerce/cart-order-summary-gift-card-form-block\",\"version\":\"1.0.0\",\"title\":\"Gift Card Form\",\"description\":\"Shows the apply gift card form.\",\"category\":\"woocommerce\",\"supports\":{\"align\":false,\"html\":false,\"multiple\":false,\"reusable\":false},\"attributes\":{\"className\":{\"type\":\"string\",\"default\":\"\"},\"lock\":{\"type\":\"object\",\"default\":{\"remove\":true,\"move\":false}}},\"parent\":[\"woocommerce/cart-order-summary-block\"],\"textdomain\":\"woocommerce-gift-cards\",\"apiVersion\":2}");

/***/ }),
/* 39 */
/***/ (function(module) {

module.exports = JSON.parse("{\"name\":\"woocommerce/cart-order-summary-gift-card-totals-block\",\"version\":\"1.0.0\",\"title\":\"Gift Card Totals\",\"description\":\"Shows the gift card totals.\",\"category\":\"woocommerce\",\"supports\":{\"align\":false,\"html\":false,\"multiple\":false,\"reusable\":false},\"attributes\":{\"className\":{\"type\":\"string\",\"default\":\"\"},\"lock\":{\"type\":\"object\",\"default\":{\"remove\":true,\"move\":false}}},\"parent\":[\"woocommerce/cart-order-summary-block\"],\"textdomain\":\"woocommerce-gift-cards\",\"apiVersion\":2}");

/***/ }),
/* 40 */,
/* 41 */
/***/ (function(module, exports) {

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

module.exports = _arrayWithHoles, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 42 */
/***/ (function(module, exports) {

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

module.exports = _iterableToArrayLimit, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 43 */
/***/ (function(module, exports) {

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

module.exports = _nonIterableRest, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 44 */
/***/ (function(module, exports) {

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

module.exports = _objectWithoutPropertiesLoose, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 45 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _woocommerce_blocks_checkout__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _woocommerce_blocks_checkout__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_woocommerce_blocks_checkout__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_gift_cards_form__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(29);


/**
 * External dependencies
 */

/**
 * Internal dependencies
 */



var Block = function Block(props) {
  var className = props.className,
      extensions = props.extensions;
  return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_woocommerce_blocks_checkout__WEBPACK_IMPORTED_MODULE_1__["TotalsWrapper"], {
    className: className
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_components_gift_cards_form__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"], {
    extensions: extensions
  }));
};

/* harmony default export */ __webpack_exports__["a"] = (Block);

/***/ }),
/* 46 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _components_gift_cards_totals__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(28);


/**
 * Internal dependencies
 */


var Block = function Block(props) {
  var className = props.className;
  return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: className
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_components_gift_cards_totals__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"], props));
};

/* harmony default export */ __webpack_exports__["a"] = (Block);

/***/ }),
/* 47 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _woocommerce_blocks_checkout__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _woocommerce_blocks_checkout__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_woocommerce_blocks_checkout__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_gift_cards_form__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(29);


/**
 * External dependencies
 */

/**
 * Internal dependencies
 */



var Block = function Block(props) {
  var className = props.className,
      extensions = props.extensions;
  return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_woocommerce_blocks_checkout__WEBPACK_IMPORTED_MODULE_1__["TotalsWrapper"], {
    className: className
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_components_gift_cards_form__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"], {
    extensions: extensions
  }));
};

/* harmony default export */ __webpack_exports__["a"] = (Block);

/***/ }),
/* 48 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _components_gift_cards_totals__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(28);


/**
 * Internal dependencies
 */


var Block = function Block(props) {
  var className = props.className;
  return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: className
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_components_gift_cards_totals__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"], props));
};

/* harmony default export */ __webpack_exports__["a"] = (Block);

/***/ }),
/* 49 */,
/* 50 */,
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/**
 * WordPress dependencies
 */

/** @typedef {{icon: JSX.Element, size?: number} & import('@wordpress/primitives').SVGProps} IconProps */

/**
 * Return an SVG icon.
 *
 * @param {IconProps} props icon is the SVG component to render
 *                          size is a number specifiying the icon size in pixels
 *                          Other props will be passed to wrapped SVG component
 *
 * @return {JSX.Element}  Icon component
 */

function Icon(_ref) {
  let {
    icon,
    size = 24,
    ...props
  } = _ref;
  return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["cloneElement"])(icon, {
    width: size,
    height: size,
    ...props
  });
}

/* harmony default export */ __webpack_exports__["a"] = (Icon);
//# sourceMappingURL=index.js.map

/***/ }),
/* 69 */,
/* 70 */,
/* 71 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./resources/js/frontend/blocks/utils/get-plugin-settings.js
var get_plugin_settings = __webpack_require__(8);

// EXTERNAL MODULE: external ["wp","element"]
var external_wp_element_ = __webpack_require__(0);

// EXTERNAL MODULE: external ["wc","blocksCheckout"]
var external_wc_blocksCheckout_ = __webpack_require__(3);

// EXTERNAL MODULE: ./resources/js/frontend/blocks/inner-blocks/checkout-order-summary-gift-card-form/block.js
var block = __webpack_require__(45);

// EXTERNAL MODULE: ./resources/js/frontend/blocks/inner-blocks/checkout-order-summary-gift-card-form/block.json
var checkout_order_summary_gift_card_form_block = __webpack_require__(36);

// CONCATENATED MODULE: ./resources/js/frontend/blocks/inner-blocks/checkout-order-summary-gift-card-form/index.js


/**
 * External dependencies
 */

/**
 * Internal dependencies
 */



var checkout_order_summary_gift_card_form_registerInnerBlock = function registerInnerBlock() {
  // Register Block to render in FrontEnd.
  Object(external_wc_blocksCheckout_["registerCheckoutBlock"])({
    metadata: checkout_order_summary_gift_card_form_block,
    component: function component(props) {
      return Object(external_wp_element_["createElement"])(block["a" /* default */], props);
    }
  });
};
// EXTERNAL MODULE: ./resources/js/frontend/blocks/inner-blocks/checkout-order-summary-gift-card-totals/block.js
var checkout_order_summary_gift_card_totals_block = __webpack_require__(46);

// EXTERNAL MODULE: ./resources/js/frontend/blocks/inner-blocks/checkout-order-summary-gift-card-totals/block.json
var inner_blocks_checkout_order_summary_gift_card_totals_block = __webpack_require__(37);

// CONCATENATED MODULE: ./resources/js/frontend/blocks/inner-blocks/checkout-order-summary-gift-card-totals/index.js


/**
 * External dependencies
 */

/**
 * Internal dependencies
 */



var checkout_order_summary_gift_card_totals_registerInnerBlock = function registerInnerBlock() {
  // Register Block to render in FrontEnd.
  Object(external_wc_blocksCheckout_["registerCheckoutBlock"])({
    metadata: inner_blocks_checkout_order_summary_gift_card_totals_block,
    component: function component(props) {
      return Object(external_wp_element_["createElement"])(checkout_order_summary_gift_card_totals_block["a" /* default */], props);
    }
  });
};
// EXTERNAL MODULE: ./resources/js/frontend/blocks/inner-blocks/cart-order-summary-gift-card-form/block.js
var cart_order_summary_gift_card_form_block = __webpack_require__(47);

// EXTERNAL MODULE: ./resources/js/frontend/blocks/inner-blocks/cart-order-summary-gift-card-form/block.json
var inner_blocks_cart_order_summary_gift_card_form_block = __webpack_require__(38);

// CONCATENATED MODULE: ./resources/js/frontend/blocks/inner-blocks/cart-order-summary-gift-card-form/index.js


/**
 * External dependencies
 */

/**
 * Internal dependencies
 */



var cart_order_summary_gift_card_form_registerInnerBlock = function registerInnerBlock() {
  // Register Block to render in FrontEnd.
  Object(external_wc_blocksCheckout_["registerCheckoutBlock"])({
    metadata: inner_blocks_cart_order_summary_gift_card_form_block,
    component: function component(props) {
      return Object(external_wp_element_["createElement"])(cart_order_summary_gift_card_form_block["a" /* default */], props);
    }
  });
};
// EXTERNAL MODULE: ./resources/js/frontend/blocks/inner-blocks/cart-order-summary-gift-card-totals/block.js
var cart_order_summary_gift_card_totals_block = __webpack_require__(48);

// EXTERNAL MODULE: ./resources/js/frontend/blocks/inner-blocks/cart-order-summary-gift-card-totals/block.json
var inner_blocks_cart_order_summary_gift_card_totals_block = __webpack_require__(39);

// CONCATENATED MODULE: ./resources/js/frontend/blocks/inner-blocks/cart-order-summary-gift-card-totals/index.js


/**
 * External dependencies
 */

/**
 * Internal dependencies
 */



var cart_order_summary_gift_card_totals_registerInnerBlock = function registerInnerBlock() {
  // Register Block to render in FrontEnd.
  Object(external_wc_blocksCheckout_["registerCheckoutBlock"])({
    metadata: inner_blocks_cart_order_summary_gift_card_totals_block,
    component: function component(props) {
      return Object(external_wp_element_["createElement"])(cart_order_summary_gift_card_totals_block["a" /* default */], props);
    }
  });
};
// EXTERNAL MODULE: ./resources/js/frontend/blocks/sass/style.scss
var style = __webpack_require__(55);

// CONCATENATED MODULE: ./resources/js/frontend/blocks/index.js
/**
 * Internal dependencies
 */






/**
 * Gift Card Inner blocks registry controller.
 */

var blocks_registerInnerBlocks = function registerInnerBlocks() {
  var _getPluginSettings = Object(get_plugin_settings["a" /* default */])(),
      isCartDisabled = _getPluginSettings.isCartDisabled,
      isUiDisabled = _getPluginSettings.isUiDisabled;

  if (isUiDisabled) {
    return;
  }

  checkout_order_summary_gift_card_form_registerInnerBlock();
  checkout_order_summary_gift_card_totals_registerInnerBlock();

  if (!isCartDisabled) {
    cart_order_summary_gift_card_form_registerInnerBlock();
    cart_order_summary_gift_card_totals_registerInnerBlock();
  }
};
/**
 * Register.
 */


blocks_registerInnerBlocks();

/***/ })
/******/ ]);