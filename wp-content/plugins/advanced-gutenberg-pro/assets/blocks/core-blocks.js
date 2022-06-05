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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/assets/blocks/0-adv-components/fonts.jsx":
/*!******************************************************!*\
  !*** ./src/assets/blocks/0-adv-components/fonts.jsx ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AdvFontControl = AdvFontControl;
function AdvFontControl(props) {
    var _wp$components = wp.components,
        PanelBody = _wp$components.PanelBody,
        SelectControl = _wp$components.SelectControl;
    var Fragment = wp.element.Fragment;
    var __ = wp.i18n.__;
    var familyValue = props.familyValue,
        familyOnChange = props.familyOnChange,
        variationValue = props.variationValue,
        variationOnChange = props.variationOnChange,
        transformValue = props.transformValue,
        transformOnChange = props.transformOnChange;


    var TEXT_TRANSFORM = [{ label: 'Default', value: '' }, { label: 'Capitalize', value: 'capitalize' }, { label: 'Uppercase', value: 'uppercase' }, { label: 'Lowercase', value: 'lowercase' }];

    var DEFAULT_FONT = [{ label: 'Default', value: '' }];

    var GOOGLE_FONTS = typeof advgbFonts !== 'undefined' && advgbFonts.google_fonts_names ? advgbFonts.google_fonts_names.map(function (name) {
        return { label: name, value: name };
    }) : {};

    var ALL_FONTS = DEFAULT_FONT.concat(GOOGLE_FONTS);

    return React.createElement(
        Fragment,
        null,
        React.createElement(SelectControl, {
            label: __('Font Family', 'advanced-gutenberg'),
            value: familyValue,
            options: ALL_FONTS,
            onChange: familyOnChange
        }),
        React.createElement(SelectControl, {
            label: __('Font Weight + Style', 'advanced-gutenberg'),
            value: variationValue,
            options: advgb_googleFontVariationsList(familyValue),
            onChange: variationOnChange
        }),
        typeof transformValue !== 'undefined' && React.createElement(SelectControl, {
            label: __('Text Transform', 'advanced-gutenberg'),
            value: transformValue,
            options: TEXT_TRANSFORM,
            onChange: transformOnChange
        })
    );
}

function advgb_googleFontVariationsList(fontFamily) {
    if (typeof fontFamily !== 'undefined' && fontFamily.length > 0 && typeof advgbFonts !== 'undefined' && advgbFonts.google_fonts) {
        var DEFAULT_OPTION = [{ label: 'Default', value: '' }];

        var obj = advgbFonts.google_fonts.find(function (value) {
            return value.f === fontFamily;
        });
        var VARIATIONS = obj !== 'undefined' && obj.v.length > 0 ? obj.v.map(function (name) {
            return { label: advgb_formatFontVariation(name), value: name };
        }) : {};

        return DEFAULT_OPTION.concat(VARIATIONS);
    }
}

// Return fontVariation formatted. e.g. 600italic -> 600 (italic)
function advgb_formatFontVariation(fontVariation) {
    if (fontVariation.length > 6 && fontVariation.indexOf('italic') !== -1) {
        return fontVariation.split('italic', 1)[0] + ' + italic';
    } else {
        return '' + fontVariation;
    }
}

function advgb_buildGoogleFontId(fontFamily, fontVariation) {
    return 'advgb_google_font_' + fontFamily.replace(/\s/g, '_').toLowerCase() + (fontVariation.length > 0 ? '_' + fontVariation : '');
}

function advgb_buildGoogleFontUrl(fontFamily, fontVariation) {
    var GOOGLE_FONT_BASE = 'https://fonts.googleapis.com/css2?family=';

    if (fontVariation.length > 0) {
        var GOOGLE_FONT_VARIATION = void 0;
        // Extract font-weight and font-style from variation. e.g. 400italic -> 400
        if (fontVariation.indexOf('italic') !== -1) {
            var v = fontVariation.split('italic', 1);
            if (v[0] !== 'undefined' && v[0].length > 0) {
                GOOGLE_FONT_VARIATION = ':ital,wght@1,' + v[0];
            } else {
                GOOGLE_FONT_VARIATION = ':ital@1';
            }
        } else {
            GOOGLE_FONT_VARIATION = ':wght@' + fontVariation;
        }
        return GOOGLE_FONT_BASE + fontFamily.replace(/\s/g, '+') + GOOGLE_FONT_VARIATION;
    }
    return GOOGLE_FONT_BASE + fontFamily.replace(/\s/g, '+');
}

function advgb_createLinkTag(fontFamily, fontVariation) {
    if (typeof fontFamily !== 'undefined' && fontFamily.length > 0 && !document.getElementById(advgb_buildGoogleFontId(fontFamily, fontVariation))) {
        var link_tag = document.createElement('link');
        link_tag.media = 'all';
        link_tag.rel = 'stylesheet';
        link_tag.id = advgb_buildGoogleFontId(fontFamily, fontVariation);
        link_tag.href = advgb_buildGoogleFontUrl(fontFamily, fontVariation);
        document.head.appendChild(link_tag);
    }
}

// Load Google stylesheet based on selected fontFamily
function AdvLoadGoogleStylesheet(_ref) {
    var fontFamily = _ref.fontFamily,
        fontVariation = _ref.fontVariation;

    var fontVariation_ = typeof fontVariation !== 'undefined' && fontVariation.length > 0 ? fontVariation : '';
    return [advgb_createLinkTag(fontFamily, fontVariation_), null];
}

// Define font-family, font-weight, font-style and text-transform properties
function AdvSetGoogleFontStyle(_ref2) {
    var fontFamily = _ref2.fontFamily,
        fontVariation = _ref2.fontVariation,
        textTransform = _ref2.textTransform,
        cssSelector = _ref2.cssSelector;

    var STYLE = '';

    // font-family
    if (typeof fontFamily !== 'undefined' && fontFamily.length > 0) {
        STYLE += 'font-family: "' + fontFamily + '" !important;';
    }

    // font-weight and font-style
    if (typeof fontVariation !== 'undefined' && fontVariation.length > 0) {
        if (fontVariation.indexOf('italic') !== -1 && fontVariation.length > 6) {
            STYLE += 'font-weight:' + fontVariation.split('italic', 1)[0] + '; font-style:italic;';
        } else {
            STYLE += 'font-weight:' + fontVariation + ';';
        }
    }

    // text-transform
    if (typeof textTransform !== 'undefined' && textTransform.length > 0) {
        STYLE += 'text-transform:' + textTransform + ';';
    }

    if (typeof STYLE !== 'undefined' && STYLE.length > 0) {
        return cssSelector + ' {\n            ' + STYLE + '\n        }';
    } else {
        return null;
    }
}

exports.AdvLoadGoogleStylesheet = AdvLoadGoogleStylesheet;
exports.AdvSetGoogleFontStyle = AdvSetGoogleFontStyle;

/***/ }),

/***/ "./src/assets/blocks/core-blocks/0-class.jsx":
/*!***************************************************!*\
  !*** ./src/assets/blocks/core-blocks/0-class.jsx ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

(function (wpHooks, wpBlocks, wpCompose) {
    var addFilter = wpHooks.addFilter;
    var hasBlockSupport = wpBlocks.hasBlockSupport;
    var createHigherOrderComponent = wpCompose.createHigherOrderComponent;


    var SUPPORTED_BLOCKS = ['core/paragraph', 'core/heading'];

    // Register class attribute
    addFilter('blocks.registerBlockType', 'advgb/registerCoreBlocksCustomClass', function (settings) {
        if (SUPPORTED_BLOCKS.includes(settings.name) && typeof settings.attributes.advgbClass === 'undefined') {
            settings.attributes = _extends(settings.attributes, {
                advgbClass: {
                    type: 'string',
                    default: ''
                }
            });
        }

        return settings;
    });

    // Apply custom class in front-end
    addFilter('blocks.getSaveContent.extraProps', 'advgb/loadFrontendCoreBlocks', function (props, blockType, attributes) {
        if (hasBlockSupport(blockType, 'fontFamily', true) && attributes.fontFamily) {
            if (typeof props.className === 'undefined') {
                props.className = attributes.advgbClass;
            } else {
                props.className += ' ' + attributes.advgbClass;
                props.className = props.className.trim();
            }
        }
        return props;
    });

    // Apply class on save
    var coreBlockClass = createHigherOrderComponent(function (BlockListBlock) {
        return function (props) {
            if ((!SUPPORTED_BLOCKS.includes(props.name) || !hasBlockSupport(props.name, 'fontFamily', true)) && typeof props.attributes.advgbClass === 'undefined') {
                return React.createElement(BlockListBlock, props);
            }
            return React.createElement(BlockListBlock, _extends({}, props, { className: props.attributes.advgbClass }));
        };
    }, 'coreBlockClass');
    addFilter('editor.BlockListBlock', 'advgb/setCoreBlockClass', coreBlockClass);
})(wp.hooks, wp.blocks, wp.compose);

/***/ }),

/***/ "./src/assets/blocks/core-blocks/font.jsx":
/*!************************************************!*\
  !*** ./src/assets/blocks/core-blocks/font.jsx ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _fonts = __webpack_require__(/*! ../0-adv-components/fonts.jsx */ "./src/assets/blocks/0-adv-components/fonts.jsx");

(function (wpI18n, wpHooks, wpBlockEditor, wpComponents, wpElement) {
    wpBlockEditor = wp.blockEditor || wp.editor;
    var addFilter = wpHooks.addFilter;
    var __ = wpI18n.__;
    var _wpBlockEditor = wpBlockEditor,
        InspectorControls = _wpBlockEditor.InspectorControls;
    var PanelBody = wpComponents.PanelBody,
        SelectControl = wpComponents.SelectControl,
        ToggleControl = wpComponents.ToggleControl;
    var Fragment = wpElement.Fragment;


    var SUPPORTED_BLOCKS = ['core/paragraph', 'core/heading'];

    // Register font attributes
    addFilter('blocks.registerBlockType', 'advgb/registerCoreBlocksFontClass', function (settings) {
        if (SUPPORTED_BLOCKS.includes(settings.name)) {
            settings.attributes = _extends(settings.attributes, {
                fontFamily: {
                    type: 'string'
                },
                fontVariation: {
                    type: 'string'
                },
                styleForce: {
                    type: 'boolean',
                    default: false
                }
            });
        }

        return settings;
    });

    // Add sidebar settings
    addFilter('editor.BlockEdit', 'advgb/coreBlocks', function (BlockEdit) {
        return function (props) {
            return React.createElement(
                Fragment,
                null,
                React.createElement(BlockEdit, _extends({ key: 'block-edit-fonts' }, props)),
                props.isSelected && SUPPORTED_BLOCKS.includes(props.name) && React.createElement(
                    InspectorControls,
                    null,
                    React.createElement(
                        PanelBody,
                        { title: __('Font Settings', 'advanced-gutenberg'), initialOpen: true, className: 'advgb-pro-icon' },
                        React.createElement(_fonts.AdvFontControl, {
                            familyValue: props.attributes.fontFamily,
                            familyOnChange: function familyOnChange(value) {
                                return props.setAttributes({ fontFamily: value, fontVariation: '', advgbClass: advgb_blockCustomClass() });
                            },
                            variationValue: props.attributes.fontVariation,
                            variationOnChange: function variationOnChange(value) {
                                return props.setAttributes({ fontVariation: value, advgbClass: advgb_blockCustomClass() });
                            }
                        }),
                        props.attributes.fontFamily && React.createElement(ToggleControl, {
                            label: __('Force styling', 'advanced-gutenberg'),
                            help: __('This adds !important to CSS in frontend to avoid your font being overridden', 'advanced-gutenberg'),
                            checked: props.attributes.styleForce,
                            onChange: function onChange() {
                                return props.setAttributes({ styleForce: !props.attributes.styleForce });
                            }
                        })
                    )
                ),
                SUPPORTED_BLOCKS.includes(props.name) && props.attributes.advgbClass && React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'style',
                        null,
                        /* CSS */React.createElement(_fonts.AdvSetGoogleFontStyle, {
                            fontFamily: props.attributes.fontFamily,
                            fontVariation: props.attributes.fontVariation,
                            cssSelector: '#block-' + props.clientId
                        })
                    ),
                    React.createElement(_fonts.AdvLoadGoogleStylesheet, {
                        fontFamily: props.attributes.fontFamily,
                        fontVariation: props.attributes.fontVariation
                    })
                )
            );
        };
    });
})(wp.i18n, wp.hooks, wp.blockEditor, wp.components, wp.element);

/***/ }),

/***/ 0:
/*!**************************************************************************************************!*\
  !*** multi ./src/assets/blocks/core-blocks/0-class.jsx ./src/assets/blocks/core-blocks/font.jsx ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./src/assets/blocks/core-blocks/0-class.jsx */"./src/assets/blocks/core-blocks/0-class.jsx");
module.exports = __webpack_require__(/*! ./src/assets/blocks/core-blocks/font.jsx */"./src/assets/blocks/core-blocks/font.jsx");


/***/ })

/******/ });
//# sourceMappingURL=core-blocks.js.map