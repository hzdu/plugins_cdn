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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/capture.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/capture.js":
/*!************************!*\
  !*** ./src/capture.js ***!
  \************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _logos__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./logos */ "./src/logos.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils */ "./src/utils.js");






/* global TVO_Data */

Object(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__["registerBlockType"])('thrive/ovation-capture', {
  title: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__["__"])('Capture Testimonial', 'thrive-ovation'),
  icon: _logos__WEBPACK_IMPORTED_MODULE_3__["captureLogo"],
  description: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__["__"])('Add testimonials to your content!', 'thrive-ovation'),
  category: 'thrive',
  attributes: {
    selectedBlock: {
      type: 'number',
      default: 0
    },
    previewImage: {
      type: 'boolean',
      default: false
    }
  },
  example: {
    attributes: {
      previewImage: true
    }
  },
  edit: Object(_wordpress_data__WEBPACK_IMPORTED_MODULE_2__["withSelect"])(function (select) {
    var query = {
      per_page: -1
    };
    return {
      posts: select('core').getEntityRecords('postType', 'tvo_capture', query)
    };
  })(function (props) {
    if (props !== null && props !== void 0 && props.attributes.previewImage) {
      return [wp.element.createElement('img', {
        src: TVO_Data.capture_preview
      })];
    }
    if (props.attributes.selectedBlock) {
      return Object(_utils__WEBPACK_IMPORTED_MODULE_4__["renderSidebar"])(props, 'Edit Testimonial capture form');
    }
    return Object(_utils__WEBPACK_IMPORTED_MODULE_4__["renderBlock"])(props, 'Capture Testimonial', 'Setup your testimonial capture form', _logos__WEBPACK_IMPORTED_MODULE_3__["captureLogo"], 'tvo_capture');
  }),
  save: function save() {
    return null;
  }
});

/***/ }),

/***/ "./src/logos.js":
/*!**********************!*\
  !*** ./src/logos.js ***!
  \**********************/
/*! exports provided: displayLogo, captureLogo */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "displayLogo", function() { return displayLogo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "captureLogo", function() { return captureLogo; });
var createElement = wp.element.createElement;
function displayLogo() {
  return createElement('svg', {
    viewBox: '0 0 41 32',
    id: 'tvo-display-logo'
  }, createElement('path', {
    fill: '#333333',
    d: 'M37.806 0h-34.323c-0.035-0.001-0.075-0.002-0.116-0.002-1.856 0-3.362 1.502-3.368 3.356v19.614c0 0.004-0 0.008-0 0.013 0 1.917 1.554 3.471 3.471 3.471 0.005 0 0.009 0 0.014-0h16.386v3.484h-7.484c-0.004-0-0.008-0-0.013-0-0.563 0-1.019 0.456-1.019 1.019 0 0.005 0 0.009 0 0.014v-0.001c-0.002 0.024-0.003 0.052-0.003 0.081 0 0.527 0.428 0.955 0.955 0.955 0.028 0 0.057-0.001 0.084-0.004l-0.004 0h16.903c0.004 0 0.008 0 0.013 0 0.563 0 1.019-0.456 1.019-1.019 0-0.005-0-0.009-0-0.014v0.001c-0.012-0.575-0.481-1.037-1.058-1.037-0.036 0-0.072 0.002-0.108 0.005l0.004-0h-7.484v-3.613h16.129c0.004 0 0.008 0 0.013 0 1.917 0 3.471-1.554 3.471-3.471 0-0.005 0-0.009-0-0.014v0.001-19.484c-0.006-1.855-1.512-3.357-3.368-3.357-0.041 0-0.082 0.001-0.122 0.002l0.006-0zM39.355 22.968c-0.014 0.849-0.699 1.534-1.547 1.548l-0.001 0h-34.323c-0.849-0.014-1.534-0.699-1.548-1.547l-0-0.001v-19.613c0.014-0.849 0.699-1.534 1.547-1.548l0.001-0h34.452c0.849 0.014 1.534 0.699 1.548 1.547l0 0.001v19.613h-0.129z'
  }), createElement('path', {
    fill: '#333333',
    d: 'M33.677 16.129h-26.065c-0.004 0-0.008 0-0.013 0-0.563 0-1.019-0.456-1.019-1.019 0-0.005 0-0.009 0-0.014v0.001c-0.002-0.024-0.003-0.052-0.003-0.081 0-0.527 0.428-0.955 0.955-0.955 0.028 0 0.057 0.001 0.084 0.004l-0.004-0h26.194c0.004-0 0.008-0 0.013-0 0.563 0 1.019 0.456 1.019 1.019 0 0.005-0 0.009-0 0.014v-0.001c-0.012 0.575-0.481 1.037-1.058 1.037-0.036 0-0.072-0.002-0.108-0.005l0.004 0z'
  }), createElement('path', {
    fill: '#333333',
    d: 'M16.645 12v-2.968l1.29-3.097h1.677l-1.032 2.839h1.419v3.097h-3.355v0.129z'
  }), createElement('path', {
    fill: '#333333',
    d: 'M21.161 12v-2.968l1.29-3.097h1.677l-0.903 2.839h1.419v3.097h-3.484v0.129z'
  }), createElement('path', {
    fill: '#333333',
    d: 'M33.677 20h-26.065c-0.004 0-0.008 0-0.013 0-0.563 0-1.019-0.456-1.019-1.019 0-0.005 0-0.009 0-0.014v0.001c-0.002-0.024-0.003-0.052-0.003-0.081 0-0.527 0.428-0.955 0.955-0.955 0.028 0 0.057 0.001 0.084 0.004l-0.004-0h26.194c0.004-0 0.008-0 0.013-0 0.563 0 1.019 0.456 1.019 1.019 0 0.005-0 0.009-0 0.014v-0.001c-0.012 0.575-0.481 1.037-1.058 1.037-0.036 0-0.072-0.002-0.108-0.005l0.004 0z'
  }));
}
function captureLogo() {
  return createElement('svg', {
    viewBox: '0 0 21 19',
    id: 'tvo-capture-logo'
  }, createElement('path', {
    fill: '#59A31D',
    d: 'M6.952 5.236c.057.06.108.122.152.187.043.066.08.14.108.224.028.083.043.177.043.282 0 .128-.025.248-.073.362-.048.113-.115.213-.2.298-.086.086-.186.154-.302.204-.116.05-.243.076-.378.076-.136 0-.26-.029-.374-.085-.115-.057-.212-.133-.292-.227-.082-.094-.144-.204-.188-.328-.044-.126-.065-.256-.065-.392 0-.294.048-.563.147-.809.099-.244.227-.463.384-.656.158-.193.333-.362.526-.51.193-.145.38-.267.565-.363.061-.036.108-.032.14.01.033.041.02.094-.041.16-.092.092-.176.202-.25.329-.074.127-.13.256-.167.387-.038.132-.051.258-.04.378.011.12.055.22.135.298l.17.175m-2.233 0c.057.06.107.122.151.187.043.066.08.14.108.224.029.083.043.177.043.282 0 .128-.024.248-.072.362-.049.113-.116.213-.2.298-.086.086-.187.154-.303.204-.116.05-.242.076-.378.076s-.26-.029-.374-.085c-.114-.057-.212-.133-.292-.227-.082-.094-.144-.204-.188-.328-.043-.126-.065-.256-.065-.392 0-.294.049-.563.147-.809.098-.244.227-.463.384-.656.159-.193.333-.362.527-.51.192-.145.38-.267.564-.363.061-.036.108-.032.141.01.033.041.02.094-.042.16-.093.092-.176.202-.25.329-.074.127-.13.256-.168.387-.037.132-.05.258-.039.378.01.12.055.22.135.298l.17.175',
    transform: 'translate(-65 -782) translate(45 167) translate(20 615)'
  }), createElement('path', {
    fill: '#424242',
    transform: 'translate(-65 -782) translate(45 167) translate(20 615) translate(0 .286)',
    d: 'M17.438 7.047l-.206.207-3.725 3.72-.716.716-2.76 2.76L6.3 10.66l-.391-.379-3.233-3.238c-.582-.577-.9-1.346-.9-2.17 0-.822.318-1.596.904-2.178.577-.58 1.346-.898 2.169-.898s1.592.318 2.174.903l3.028 3.028 1.256-1.252 1.78-1.776c.582-.581 1.355-.903 2.178-.903.819 0 1.592.322 2.174.903.578.577.9 1.351.9 2.174 0 .818-.322 1.592-.9 2.173m1.252-5.604C17.778.527 16.557.021 15.264.021c-1.301 0-2.513.506-3.43 1.422l-1.78 1.776-1.776-1.776C7.362.527 6.145.021 4.848.021c-1.297 0-2.513.506-3.43 1.422C.501 2.356 0 3.577 0 4.873 0 6.168.5 7.388 1.418 8.3l8.524 8.53c.121-.3.278-.6.461-.877l.004-.01.005-.003.326-.465c.086-.112.466-.555.627-.685.022-.018.058-.048.09-.084.057-.059.129-.134.214-.198.013-.008.026-.017.035-.026.036-.031.068-.062.099-.09l.053-.04c.032-.027.068-.053.104-.084l.308-.23c.317-.227.671-.442 1.047-.63.165-.084.335-.16.496-.228l4.88-4.88c.916-.912 1.421-2.132 1.421-3.425 0-1.297-.505-2.518-1.422-3.43'
  }), createElement('path', {
    fill: '#59A31D',
    transform: 'translate(-65 -782) translate(45 167) translate(20 615) translate(10.462 13.21)',
    d: 'M8.924.128c-.646 0-1.997.244-2.53.35-.505.1-1.167.24-1.659.433-.378.148-.737.293-1.102.475-.338.17-.669.367-.975.59l-.302.223c-.054.039-.092.076-.146.117-.05.04-.095.086-.142.121-.106.08-.194.197-.295.276-.1.079-.444.469-.532.588l-.323.455c-.31.472-.554 1.036-.644 1.595-.033.205-.031.312-.054.472l-.004.023v.247c.022.3.103.647.103.676h.023c.018-.212.34-.967.42-1.125l.198-.372c.12-.2.249-.397.388-.583.093-.125.19-.251.3-.363.025-.026.025-.031.047-.057.113-.137.263-.262.387-.39l.419-.358.051-.039.738-.52c.222-.13.435-.277.66-.403.202-.113.51-.275.707-.355l.531-.236c.276-.108.554-.237.836-.33l.575-.202.29-.097c.087-.029.208-.083.3-.09l-.634.292c-.217.088-.61.294-.838.409l-.61.327c-.192.113-.396.226-.583.351l-.562.388-.083.066-.046.034-.123.106c-.021.018-.023.016-.045.035l-.04.04-.53.555-.59.815-.236.394c-.021.035-.034.063-.053.096-.117.202-.223.414-.319.63l-.046.113c.158.037 1.032.028 1.243-.002l.391-.043c.641-.069 1.38-.247 1.943-.527l.08-.033c.022-.01.047-.023.069-.035.029-.015.041-.025.072-.042l.141-.076c.095-.051.18-.11.267-.167.101-.068.209-.145.3-.226.132-.119.273-.244.384-.382.017-.022.032-.032.049-.054.18-.223.326-.466.486-.703.233-.35.45-.706.64-1.085.408-.818.522-.92 1.034-1.56.02-.026.022-.031.047-.057L9.27.646c.113-.1.258-.201.4-.253.126-.047.19-.07.364-.07-.121-.18-.638-.194-.971-.195h-.139zm-1.701 1.11c-.013.01.019.01-.035.01.013-.01-.02-.01.035-.01z'
  }));
}

/***/ }),

/***/ "./src/thrive-logo.js":
/*!****************************!*\
  !*** ./src/thrive-logo.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var createElement = wp.element.createElement;
/* harmony default export */ __webpack_exports__["default"] = (function () {
  return createElement('svg', {
    width: 26,
    height: 18,
    viewBox: '0 0 26 18',
    id: 'thrive-logo'
  }, createElement('g', {
    transform: 'translate(-398.000000, -80.000000)',
    fill: '#58a245'
  }, createElement('path', {
    d: 'M424,80.4527444 C423.538615,80.4604108 423.362362,80.5211525 423.033016,80.6505972 C422.655847,80.7915415 422.266647,81.0516103 421.972793,81.3084356 L421.251841,81.9936963 C421.183866,82.060925 421.184167,82.0733092 421.133637,82.1387687 C419.790687,83.7979606 419.489313,84.0633369 418.434203,86.1651175 C417.943342,87.1452408 417.380897,88.0619686 416.773637,88.9654276 C416.355864,89.5811007 415.974484,90.2026711 415.501369,90.7791275 C415.454749,90.8389846 415.421965,90.8658171 415.375345,90.9188923 C415.084498,91.2789196 414.709134,91.6032684 414.361441,91.913169 C414.128643,92.1222266 413.8393,92.3224383 413.572514,92.5017148 C413.342724,92.6473769 413.122258,92.808077 412.8663,92.9416498 L412.490334,93.1421563 C412.409126,93.1890395 412.383861,93.2155771 412.302051,93.2542041 C412.241896,93.2810366 412.180539,93.3152407 412.120685,93.3423681 C412.047597,93.3753927 411.980224,93.3957382 411.904129,93.4299422 C410.412898,94.1747652 408.445544,94.6604039 406.741667,94.8623848 L405.692572,94.9897654 C405.387589,95.0348794 404.553547,95.0749807 403.78778,95.0876598 C403.148938,95.0982748 402.559123,95.0873649 402.369336,95.0534557 L402.485735,94.7597726 C402.732669,94.2048412 403.010282,93.6619991 403.31286,93.1380283 C403.365796,93.0542873 403.39076,92.9823408 403.451215,92.8906385 L404.065393,91.8780804 L405.602341,89.773646 L407.000633,88.3308833 C407.040335,88.2916666 407.060186,88.265129 407.101091,88.2247328 C407.160944,88.1725421 407.168163,88.1793239 407.222302,88.1330305 L407.549242,87.8549751 C407.596162,87.8228351 407.615713,87.8030793 407.670152,87.7691701 C407.757076,87.702826 407.795274,87.6639041 407.8834,87.59756 L409.371623,86.5814635 C409.869402,86.2553455 410.406582,85.9572394 410.917594,85.6623768 L412.529134,84.7999037 C413.134289,84.4994387 414.176165,83.9589555 414.748836,83.715399 L416.431358,82.9410899 C416.188033,82.9670378 415.871921,83.105918 415.642431,83.1867104 C415.371435,83.2769384 415.136231,83.3580256 414.865235,83.4461895 L413.335806,83.9893264 C412.587484,84.2429082 411.84638,84.5784619 411.120315,84.8689015 L409.711797,85.4951897 C409.187851,85.7104394 408.36614,86.1344518 407.836179,86.432263 C407.238845,86.7604451 406.675798,87.1455357 406.090495,87.4911146 L404.141187,88.8507261 C404.094267,88.8861096 404.047046,88.9170702 404.000125,88.9521588 L402.897192,89.8821554 C402.569951,90.2177091 402.183158,90.5408785 401.87637,90.8955982 C401.822832,90.9613526 401.823133,90.9749162 401.756361,91.0406706 C401.470026,91.3319948 401.219181,91.6581129 400.971946,91.9803977 C400.608613,92.4654467 400.271146,92.9693669 399.96135,93.4853764 L399.448533,94.4466285 C399.245211,94.8520646 398.410567,96.7946194 398.372369,97.3324487 L398.310409,97.3333333 C398.308906,97.263156 398.077311,96.3803374 398.01084,95.6190022 L398,94.9882911 C397.999711,94.9705993 398.005125,94.9499589 398.004524,94.9251905 C398.058061,94.5150366 398.047835,94.2440579 398.133856,93.7236254 C398.3456,92.2897086 398.970906,90.8419332 399.784797,89.6223815 L400.619742,88.4441105 C400.852239,88.1359791 401.756361,87.1296131 402.025252,86.9255682 C402.286022,86.7200489 402.518519,86.4119175 402.79914,86.204924 C402.920051,86.1149909 403.040059,85.9876102 403.174203,85.8876518 C403.313762,85.7832705 403.414521,85.6839018 403.555282,85.5836485 L404.352931,85.0004103 C405.163213,84.417172 406.03425,83.8988036 406.936568,83.4488433 C407.89874,82.972935 408.855197,82.5825369 409.857972,82.1886005 C411.165732,81.676719 412.92856,81.2910388 414.275119,81.0150474 C415.694766,80.7119286 419.291405,80.0381676 421.02175,80.0095659 L421.393505,80.0033738 C422.290108,79.9883358 423.673662,80.005143 424,80.4527444'
  })));
});

/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/*! exports provided: renderSidebar, renderBlock, renderFrame, renderButtons, renderCapture, renderFilter, renderDisplay, renderGoTOButton, renderSelect */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "renderSidebar", function() { return renderSidebar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "renderBlock", function() { return renderBlock; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "renderFrame", function() { return renderFrame; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "renderButtons", function() { return renderButtons; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "renderCapture", function() { return renderCapture; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "renderFilter", function() { return renderFilter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "renderDisplay", function() { return renderDisplay; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "renderGoTOButton", function() { return renderGoTOButton; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "renderSelect", function() { return renderSelect; });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _thrive_logo__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./thrive-logo */ "./src/thrive-logo.js");





var createElement = wp.element.createElement,
  tveOuterHeight = function tveOuterHeight(el) {
    if (!el) {
      return 0;
    }
    var height = el.offsetHeight;
    var style = getComputedStyle(el);
    height += parseInt(style.marginTop) + parseInt(style.marginBottom);
    return height;
  },
  generateRandomString = function generateRandomString() {
    var radix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 16;
    return (new Date().getTime() + Math.floor(Math.random() * 100000)).toString(radix);
  },
  getNonCachedLink = function getNonCachedLink(link) {
    return "".concat(link).concat(link.split('?')[1] ? '&' : '?', "tvo=").concat(generateRandomString());
  };
wp.domReady(function () {
  wp.blocks.updateCategory('thrive', {
    icon: _thrive_logo__WEBPACK_IMPORTED_MODULE_4__["default"]
  });
});

/**
 * Once an block is update try to update the preview in gutenberg too
 */
window.addEventListener('storage', function (storageEvent) {
  if (storageEvent.key && storageEvent.key.includes('tvo_block')) {
    var id = storageEvent.key.split('-')[1],
      iframes = document.getElementsByClassName("tvo-block-".concat(id));

    /**
     * in case of duplicate / copy-paste
     */
    Array.prototype.forEach.call(iframes, function (iframe) {
      iframe.setAttribute('src', getNonCachedLink(iframe.getAttribute('src')));
    });
    localStorage.removeItem(storageEvent.key);
  }
}, false);

/**
 * Render the sidebar & iframe once you added a block
 * @param props
 * @param label
 * @returns {(*)[]}
 */
function renderSidebar(props, label) {
  var previewLink = props.attributes.previewLink || '',
    editLink = props.attributes.editLink || '';
  if (!previewLink) {
    var posts = props.posts ? props.posts : props[props.attributes.type];
    var selectedPost = posts ? posts.find(function (post) {
      return Number(post.id) === Number(props.attributes.selectedBlock);
    }) : 0;
    if (selectedPost) {
      previewLink = selectedPost.link;
      editLink = selectedPost.edit_url;
    }
  }
  if (previewLink) {
    previewLink += "".concat(previewLink.split('?')[1] ? '&' : '?', "tve_block_preview=1");
  }
  return [createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__["InspectorControls"], null, createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__["PanelBody"], {
    title: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__["__"])('Block settings', 'thrive-cb'),
    initialOpen: true
  }, createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__["PanelRow"], {}, createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__["PanelRow"], {}, createElement('a', {
    class: 'tvo-sidebar-edit-button',
    href: editLink,
    target: '_blank'
  }, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__["__"])(label, 'thrive-ovation')))))), createElement('iframe', {
    src: "".concat(previewLink),
    id: "tvo-block-".concat(props.attributes.selectedBlock),
    class: "".concat(props.attributes.className, " tvo-block-preview tvo-block-").concat(props.attributes.selectedBlock),
    scrolling: 'no',
    onLoad: function onLoad() {
      var iframes = document.getElementsByClassName("tvo-block-".concat(props.attributes.selectedBlock));

      /**
       * in case of duplicate / copy-paste
       */
      Array.prototype.forEach.call(iframes, function (iframe) {
        var iframeDocument = iframe.contentDocument,
          setHeight = function setHeight() {
            var height = tveOuterHeight(iframeDocument.body);
            iframe.style.setProperty('height', "".concat(height, "px"));
            iframe.parentNode.style.setProperty('height', "".concat(height, "px"));
          };
        iframe.style.setProperty('pointer-events', 'none');
        setHeight();
        /**
         * in case there is content loaded via ajax calls
         */
        setTimeout(function () {
          setHeight();
        }, 3000);
        if (iframe.contentWindow.TVE_Dash) {
          iframe.contentWindow.TVE_Dash.forceImageLoad(iframeDocument);
        }
      });
    }
  })];
}

/**
 * Render the add block view
 * @param props
 * @param title
 * @param description
 * @param logo
 * @param postType
 * @returns {any}
 */
function renderBlock(props, title, description, logo, postType) {
  return createElement('div', {
    class: 'tvo-new-block-container'
  }, logo(), createElement('div', {
    class: 'tvo-block-title'
  }, createElement('h2', {}, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__["__"])(title, 'thrive-ovation'))), createElement('div', {
    class: 'tvo-new-block-description'
  }, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__["__"])(description, 'thrive-ovation')), createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__["Button"], {
    className: 'tvo-create-block-button',
    type: 'button',
    onClick: function onClick() {
      _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_3___default()({
        path: "/wp/v2/".concat(postType),
        method: 'POST',
        data: {
          status: 'publish'
        }
      }).then(function (data) {
        props.setAttributes({
          selectedBlock: parseInt(data.id),
          previewLink: data.link,
          editLink: data.edit_url
        });
        window.open(data.edit_url, '_blank');
      }).catch(function (data) {});
    }
  }, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__["__"])('Setup', 'thrive-ovation')));
}
function renderFrame(props, title, description, logo) {
  return createElement('div', {
    class: 'tvo-new-block-container'
  }, logo(), createElement('div', {
    class: 'tvo-block-title'
  }, createElement('h2', {}, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__["__"])(title, 'thrive-ovation'))), createElement('div', {
    class: 'tvo-new-block-description'
  }, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__["__"])(description, 'thrive-ovation')), renderButtons(props), createElement('div', {
    class: 'tvo-block-content-container'
  }, renderCapture(props), renderDisplay(props)), renderGoTOButton());
}
function renderButtons(props) {
  return createElement('div', {
    class: 'tvo-block-buttons-container'
  }, createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__["Button"], {
    className: 'tvo-split-block-button',
    type: 'button',
    onClick: function onClick() {
      document.querySelector('.tvo-block-capture-container').classList.remove('tvo-hide');
      document.querySelector('.tvo-block-buttons-container').classList.add('tvo-hide');
      props.attributes.type = 'capture';
    }
  }, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__["__"])('Capture', 'thrive-ovation')), createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__["Button"], {
    className: 'tvo-split-block-button',
    type: 'button',
    onClick: function onClick() {
      document.querySelector('.tvo-block-display-container').classList.remove('tvo-hide');
      document.querySelector('.tvo-block-buttons-container').classList.add('tvo-hide');
      props.attributes.type = 'display';
    }
  }, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__["__"])('Display', 'thrive-ovation')));
}
function renderCapture(props) {
  if (!props.capture) {
    return false;
  }
  var defaultLabel = '-- Select a Capture form --';
  if (props.attributes.searchBlockSel) {
    defaultLabel = "-- ".concat(props.capture.length, " forms found --");
  }
  var options = [{
    value: 0,
    label: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__["__"])(defaultLabel, 'thrive-ovation')
  }];
  props.capture.forEach(function (post) {
    options.push({
      value: post.id,
      label: post.title.raw
    });
  });
  var hideClass = props.attributes.type === 'capture' ? '' : ' tvo-hide';
  return createElement('div', {
    class: "tvo-block-capture-container".concat(hideClass)
  }, createElement('div', {
    class: 'tvo-block-container-center'
  }, renderFilter(props), createElement('div', {
    class: 'tvo-capture-select-content'
  }, renderSelect(options, props, ''))));
}
var isBlurOverSearch = false;
function renderFilter(props) {
  return createElement('div', {
    class: 'tvo-block-search-container'
  }, createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__["TextControl"], {
    placeholder: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__["__"])('Filter block list', 'thrive-cb'),
    isPressEnterToChange: true,
    onChange: function onChange(content) {
      var data = {
        searchText: content
      };
      props.setAttributes(data);
    },
    onFocus: function onFocus(event) {
      isBlurOverSearch = false;
      var container = event.target.closest('.tvo-block-search-container');
      container.getElementsByClassName('tvo-block-clear-button')[0].classList.add('tvo-hide');
      container.getElementsByClassName('tvo-block-search-button')[0].classList.remove('tvo-hide', 'opacity');
    },
    onBlur: function onBlur(event) {
      isBlurOverSearch = event.relatedTarget && event.relatedTarget.classList.contains('tvo-block-search-button');
      if (!isBlurOverSearch) {
        var container = event.target.closest('.tvo-block-search-container'),
          clearEl = container.getElementsByClassName('tvo-block-clear-button')[0],
          searchEl = container.getElementsByClassName('tvo-block-search-button')[0];
        clearEl.classList.toggle('tvo-hide', !props.attributes.searchText.length);
        searchEl.classList.toggle('tvo-hide', props.attributes.searchText.length);
        searchEl.classList.add('opacity');
      }
    },
    onKeyDown: function onKeyDown(event) {
      /**
       * On enter press trigger the search
       */
      if (event.which === 13) {
        props.setAttributes({
          searchText: event.target.value,
          searchBlockSel: event.target.value
        });
      }
    },
    className: 'tvo-block-search-input',
    value: props.attributes.searchText
  }), createElement('a', {
    href: 'javascript:void(0)',
    class: "tvo-block-search-button  ".concat(props.attributes.searchText ? 'tvo-hide' : 'opacity'),
    onClick: function onClick() {
      props.setAttributes({
        searchBlockSel: props.attributes.searchText
      });
    }
  }, createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__["Icon"], {
    icon: 'search'
  })), createElement('a', {
    href: 'javascript:void(0)',
    className: "tvo-block-clear-button ".concat(props.attributes.searchText ? '' : 'tvo-hide', " "),
    onClick: function onClick() {
      props.setAttributes({
        searchText: '',
        searchBlockSel: ''
      });
    }
  }, createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__["Icon"], {
    icon: 'no-alt'
  })));
}
function renderDisplay(props) {
  if (!props.display) {
    return false;
  }
  var defaultLabel = '-- Select a display testimonial --';
  if (props.attributes.searchBlockSel) {
    defaultLabel = "-- ".concat(props.display.length, " items found --");
  }
  var options = [{
    value: 0,
    label: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__["__"])(defaultLabel, 'thrive-ovation')
  }];
  props.display.forEach(function (post) {
    options.push({
      value: post.id,
      label: post.title.raw
    });
  });
  var hideClass = props.attributes.type === 'display' ? '' : ' tvo-hide';
  return createElement('div', {
    class: "tvo-block-display-container".concat(hideClass)
  }, createElement('div', {
    class: 'tvo-block-container-center'
  }, renderFilter(props), createElement('div', {
    class: 'tvo-display-select-content'
  }, renderSelect(options, props, ''))));
}
function renderGoTOButton() {
  return createElement('div', {
    class: 'tvo-go-dash'
  }, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__["__"])('Go to the ', 'thrive-ovation'), createElement('a', {
    href: TVO_Data.dashboard_url,
    target: '_blank'
  }, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__["__"])('Thrive Ovation Dashboard', 'thrive-ovation')));
}
function renderSelect(opts, props, label) {
  return createElement('div', {
    class: 'tvo-block-select-wrapper'
  }, createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__["SelectControl"], {
    label: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__["__"])(label, 'thrive-ovation'),
    options: opts,
    onChange: function onChange(value) {
      props.setAttributes({
        selectedBlock: parseInt(value),
        type: props.attributes.type
      });
    },
    value: props.attributes.selectedBlock
  }));
}

/***/ }),

/***/ "@wordpress/api-fetch":
/*!**********************************!*\
  !*** external ["wp","apiFetch"] ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function() { module.exports = window["wp"]["apiFetch"]; }());

/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function() { module.exports = window["wp"]["blockEditor"]; }());

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function() { module.exports = window["wp"]["blocks"]; }());

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function() { module.exports = window["wp"]["components"]; }());

/***/ }),

/***/ "@wordpress/data":
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function() { module.exports = window["wp"]["data"]; }());

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
//# sourceMappingURL=capture.js.map