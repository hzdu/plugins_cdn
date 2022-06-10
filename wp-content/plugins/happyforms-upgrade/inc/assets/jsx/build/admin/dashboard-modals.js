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
/******/ 	return __webpack_require__(__webpack_require__.s = "./build/inc/assets/jsx/src/admin/dashboard-modals.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./build/core/assets/jsx/src/admin/dashboard-modals.js":
/*!*************************************************************!*\
  !*** ./build/core/assets/jsx/src/admin/dashboard-modals.js ***!
  \*************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__);





/**
 *
 * Modal handler class
 *
 */

/* harmony default export */ __webpack_exports__["default"] = (function ($, settings) {
  const {
    render
  } = wp.element;
  /**
   *
   * Modal wrapper
   *
   */

  const ModalProvider = props => {
    return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["SlotFillProvider"], null, props.modal, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["Popover"].Slot, null));
  };

  return class DashboardModals {
    constructor() {
      _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(this, "area", null);

      this.area = document.getElementById('happyforms-modals-area');
    }

    openModal(modal) {
      render(Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])(ModalProvider, {
        modal: modal
      }), this.area);
    }

    closeModal(modal) {
      render(Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["Fragment"], null), this.area);
      $.post(ajaxurl, {
        action: settings.actionModalDismiss,
        id: modal
      });
    }

  };
});

/***/ }),

/***/ "./build/inc/assets/jsx/src/admin/dashboard-modals.js":
/*!************************************************************!*\
  !*** ./build/inc/assets/jsx/src/admin/dashboard-modals.js ***!
  \************************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _happyforms_core_jsx_src_admin_dashboard_modals__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @happyforms/core/jsx/src/admin/dashboard-modals */ "./build/core/assets/jsx/src/admin/dashboard-modals.js");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__);






(function ($, settings) {
  /**
   *
   * Subscription modal
   *
   */
  const SubscribeModal = props => {
    const imageURL = `${settings.pluginURL}/inc/assets/svg/register.svg`;
    const initialState = {
      email: '',
      registrationKey: '',
      step: 'request_key',
      notice: null,
      disabled: false
    };

    const reducer = (state, newState) => {
      return { ...state,
        ...newState
      };
    };

    const [state, dispatch] = Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["useReducer"])(reducer, initialState);

    const requestKey = () => {
      dispatch({
        notice: null,
        disabled: true
      });

      if ('' === state.email.trim() || state.email.indexOf('@') < 0) {
        dispatch({
          disabled: false,
          notice: {
            status: 'error',
            message: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__["__"])('Please enter an email address.', 'happyforms')
          },
          step: 'request_key'
        });
        return;
      }

      $.post(ajaxurl, {
        action: settings.subscribeModalActionRequestKey,
        _wpnonce: settings.subscribeModalNonceRequestKey,
        product_plan: settings.subscribeModalProductPlan,
        email: state.email
      }, function (response) {
        dispatch({
          disabled: false,
          notice: {
            status: response.success ? 'success' : 'error',
            message: response.data
          },
          step: response.success ? 'register_key' : 'request_key'
        });
      });
    };

    const registerKey = () => {
      dispatch({
        notice: null,
        disabled: true
      });
      $.post(ajaxurl, {
        action: settings.subscribeModalActionAuthorize,
        _wpnonce: settings.subscribeModalNonceAuthorize,
        product_plan: settings.subscribeModalProductPlan,
        license_key: state.registrationKey
      }, function (response) {
        if (response.success) {
          return props.onRequestCloseAndRemoveBadge();
        }

        dispatch({
          disabled: false,
          notice: {
            status: response.success ? 'success' : 'error',
            message: response.data
          }
        });
      });
    };

    const getNotice = () => {
      if (!state.notice) {
        return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["Fragment"], null);
      } else {
        return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["Notice"], {
          status: state.notice.status,
          isDismissible: false
        }, state.notice.message);
      }
    };

    const getStep = () => {
      switch (state.step) {
        case 'request_key':
          return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["Fragment"], null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
            className: "happyforms-modal__body"
          }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("label", null, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__["__"])('Email address', 'happyforms')), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("input", {
            type: "email",
            value: state.email,
            onChange: e => {
              dispatch({
                email: e.target.value
              });
            },
            disabled: state.disabled,
            autoFocus: true
          })), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
            className: "happyforms-modal__footer"
          }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["BaseControl"], {
            help: Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["Fragment"], null, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__["__"])('Know your registration key?', 'happyforms'), " ", Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["Button"], {
              isLink: true,
              onClick: () => dispatch({
                notice: null,
                step: 'register_key',
                email: ''
              }),
              text: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__["__"])('Jump ahead', 'happyforms')
            }))
          }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
            className: "happyforms-modal__footer-button-group"
          }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["Button"], {
            isPrimary: true,
            onClick: requestKey,
            text: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__["__"])('Send Registration Key', 'happyforms'),
            disabled: state.disabled,
            className: "button-hero",
            key: "button-request-key"
          })))));

        case 'register_key':
          return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["Fragment"], null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
            className: "happyforms-modal__body"
          }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("label", null, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__["__"])('Registration key', 'happyforms')), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
            className: "hf-pwd"
          }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("input", {
            type: "password",
            className: "happyforms-credentials-input",
            value: state.registrationKey,
            onChange: e => {
              dispatch({
                registrationKey: e.target.value
              });
            },
            disabled: state.disabled,
            autoFocus: true
          }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("button", {
            type: "button",
            className: "button button-secondary hf-hide-pw hide-if-no-js",
            "data-toggle": "0",
            "aria-label": Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__["__"])('Show credentials', 'happyforms')
          }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("span", {
            className: "dashicons dashicons-visibility",
            "aria-hidden": "true"
          })))), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
            className: "happyforms-modal__footer"
          }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["BaseControl"], {
            help: state.email !== '' && Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["Fragment"], null, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__["__"])('Still no email?', 'happyforms'), " ", Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["Button"], {
              isLink: true,
              onClick: requestKey,
              text: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__["__"])('Resend', 'happyforms')
            }))
          }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
            className: "happyforms-modal__footer-button-group"
          }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["Button"], {
            isSecondary: true,
            onClick: () => dispatch({
              disabled: false,
              notice: null,
              step: 'request_key'
            }),
            text: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__["__"])('Cancel', 'happyforms'),
            disabled: state.disabled,
            key: "button-cancel"
          }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["Button"], {
            isPrimary: true,
            onClick: registerKey,
            text: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__["__"])('Register', 'happyforms'),
            disabled: state.disabled,
            key: "button-register-key"
          })))));
      }
    };

    return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["Guide"], {
      onFinish: props.onRequestCloseAndRedirect,
      className: "happyforms-modal happyforms-modal--subscribe",
      pages: [{
        image: Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("picture", null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("img", {
          src: imageURL
        })),
        content: Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["Fragment"], null, getNotice(), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
          className: "happyforms-modal__header"
        }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("h1", null, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__["__"])('You\'re unregistered', 'happyforms')), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("p", null, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__["__"])('Add your email address connected with your account and we\'ll send you a registration key. If your membership has expired or your free trial has ended', 'happyforms'), ", ", Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["ExternalLink"], {
          href: "https://happyforms.memberful.com/account/subscriptions"
        }, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__["__"])('renew immediately to continue', 'happyforms')))), getStep())
      }]
    });
  };

  const DashboardModalsBaseClass = Object(_happyforms_core_jsx_src_admin_dashboard_modals__WEBPACK_IMPORTED_MODULE_1__["default"])($, settings);

  class DashboardModalsClass extends DashboardModalsBaseClass {
    openSubscribeModal() {
      var modal = Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(SubscribeModal, {
        onRequestCloseAndRedirect: this.closeSubscribeModalAndRedirect.bind(this),
        onRequestClose: this.closeModal.bind(this, 'subscribe'),
        onRequestCloseAndRemoveBadge: this.closeSubscribeModalAndRemoveBadge.bind(this)
      });
      this.openModal(modal);
    }

    closeSubscribeModalAndRedirect() {
      window.location.href = settings.dashboardURL;
    }

    closeSubscribeModalAndRemoveBadge() {
      $('.happyforms-unregistered-badge').hide();
      this.closeModal('subscribe');
    }

  }

  ;
  var happyForms = window.happyForms || {};
  window.happyForms = happyForms;
  happyForms.modals = new DashboardModalsClass();
})(jQuery, _happyFormsDashboardModalsSettings);

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/defineProperty.js":
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/defineProperty.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

module.exports = _defineProperty, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function() { module.exports = window["wp"]["components"]; }());

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function() { module.exports = window["wp"]["element"]; }());

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function() { module.exports = window["wp"]["i18n"]; }());

/***/ })

/******/ });
//# sourceMappingURL=dashboard-modals.js.map