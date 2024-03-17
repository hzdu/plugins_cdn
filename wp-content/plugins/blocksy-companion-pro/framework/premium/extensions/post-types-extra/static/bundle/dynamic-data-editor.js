/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./framework/premium/extensions/post-types-extra/features/dynamic-data/blocks/dynamic-data/js/Dimensions.js":
/*!******************************************************************************************************************!*\
  !*** ./framework/premium/extensions/post-types-extra/features/dynamic-data/blocks/dynamic-data/js/Dimensions.js ***!
  \******************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var ct_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ct-i18n */ "ct-i18n");
/* harmony import */ var ct_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(ct_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__);
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * WordPress dependencies
 */




var DEFAULT_SIZE = 'full';

var DimensionControls = function DimensionControls(_ref) {
  var clientId = _ref.clientId,
      _ref$attributes = _ref.attributes,
      aspectRatio = _ref$attributes.aspectRatio,
      width = _ref$attributes.width,
      height = _ref$attributes.height,
      sizeSlug = _ref$attributes.sizeSlug,
      setAttributes = _ref.setAttributes,
      _ref$imageSizeOptions = _ref.imageSizeOptions,
      imageSizeOptions = _ref$imageSizeOptions === void 0 ? [] : _ref$imageSizeOptions;
  var defaultUnits = ['px', '%', 'vw', 'em', 'rem'];
  var units = (0,_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalUseCustomUnits)({
    availableUnits: (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.useSetting)('spacing.units') || defaultUnits
  });

  var onDimensionChange = function onDimensionChange(dimension, nextValue) {
    var parsedValue = parseFloat(nextValue);
    /**
     * If we have no value set and we change the unit,
     * we don't want to set the attribute, as it would
     * end up having the unit as value without any number.
     */

    if (isNaN(parsedValue) && nextValue) return;
    setAttributes(_defineProperty({}, dimension, parsedValue < 0 ? '0' : nextValue));
  };

  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalToolsPanel, {
    label: (0,ct_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Image Settings', 'blocksy-companion'),
    resetAll: function resetAll() {
      setAttributes({
        aspectRatio: 'auto',
        width: undefined,
        height: undefined,
        sizeSlug: undefined
      });
    }
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalToolsPanelItem, {
    hasValue: function hasValue() {
      return !!aspectRatio;
    },
    label: (0,ct_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Aspect Ratio', 'blocksy-companion'),
    onDeselect: function onDeselect() {
      return setAttributes({
        aspectRatio: undefined
      });
    },
    resetAllFilter: function resetAllFilter() {
      return {
        aspectRatio: 'auto'
      };
    },
    isShownByDefault: true,
    key: clientId
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
    __nextHasNoMarginBottom: true,
    label: (0,ct_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Aspect Ratio', 'blocksy-companion'),
    value: aspectRatio,
    options: [// These should use the same values as AspectRatioDropdown in @wordpress/block-editor
    {
      label: (0,ct_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Original', 'blocksy-companion'),
      value: 'auto'
    }, {
      label: (0,ct_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Square', 'blocksy-companion'),
      value: '1'
    }, {
      label: (0,ct_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('16:9', 'blocksy-companion'),
      value: '16/9'
    }, {
      label: (0,ct_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('4:3', 'blocksy-companion'),
      value: '4/3'
    }, {
      label: (0,ct_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('3:2', 'blocksy-companion'),
      value: '3/2'
    }, {
      label: (0,ct_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('9:16', 'blocksy-companion'),
      value: '9/16'
    }, {
      label: (0,ct_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('3:4', 'blocksy-companion'),
      value: '3/4'
    }, {
      label: (0,ct_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('2:3', 'blocksy-companion'),
      value: '2/3'
    }],
    onChange: function onChange(nextAspectRatio) {
      return setAttributes({
        aspectRatio: nextAspectRatio
      });
    }
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalToolsPanelItem, {
    style: {
      'grid-column': 'span 1 / auto'
    },
    hasValue: function hasValue() {
      return !!width;
    },
    label: (0,ct_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Width', 'blocksy-companion'),
    onDeselect: function onDeselect() {
      return setAttributes({
        width: undefined
      });
    },
    resetAllFilter: function resetAllFilter() {
      return {
        width: undefined
      };
    },
    isShownByDefault: true,
    key: clientId
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalUnitControl, {
    label: (0,ct_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Width', 'blocksy-companion'),
    labelPosition: "top",
    value: width || '',
    min: 0,
    onChange: function onChange(nextWidth) {
      return onDimensionChange('width', nextWidth);
    },
    units: units
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalToolsPanelItem, {
    style: {
      'grid-column': 'span 1 / auto'
    },
    hasValue: function hasValue() {
      return !!height;
    },
    label: (0,ct_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Height', 'blocksy-companion'),
    onDeselect: function onDeselect() {
      return setAttributes({
        height: undefined
      });
    },
    resetAllFilter: function resetAllFilter() {
      return {
        height: undefined
      };
    },
    isShownByDefault: true,
    key: clientId
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalUnitControl, {
    label: (0,ct_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Height', 'blocksy-companion'),
    labelPosition: "top",
    value: height || '',
    min: 0,
    onChange: function onChange(nextHeight) {
      return onDimensionChange('height', nextHeight);
    },
    units: units
  })), !!imageSizeOptions.length && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalToolsPanelItem, {
    hasValue: function hasValue() {
      return !!sizeSlug;
    },
    label: (0,ct_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Resolution', 'blocksy-companion'),
    onDeselect: function onDeselect() {
      return setAttributes({
        sizeSlug: undefined
      });
    },
    resetAllFilter: function resetAllFilter() {
      return {
        sizeSlug: undefined
      };
    },
    isShownByDefault: false,
    key: clientId
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
    __nextHasNoMarginBottom: true,
    label: (0,ct_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Resolution', 'blocksy-companion'),
    value: sizeSlug || DEFAULT_SIZE,
    options: imageSizeOptions,
    onChange: function onChange(nextSizeSlug) {
      return setAttributes({
        sizeSlug: nextSizeSlug
      });
    },
    help: (0,ct_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Select the size of the source image.', 'blocksy-companion')
  })));
};

/* harmony default export */ __webpack_exports__["default"] = (DimensionControls);

/***/ }),

/***/ "./framework/premium/extensions/post-types-extra/features/dynamic-data/blocks/dynamic-data/js/Edit.js":
/*!************************************************************************************************************!*\
  !*** ./framework/premium/extensions/post-types-extra/features/dynamic-data/blocks/dynamic-data/js/Edit.js ***!
  \************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var ct_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ct-i18n */ "ct-i18n");
/* harmony import */ var ct_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(ct_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _Preview__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Preview */ "./framework/premium/extensions/post-types-extra/features/dynamic-data/blocks/dynamic-data/js/Preview.js");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var blocksy_options__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! blocksy-options */ "blocksy-options");
/* harmony import */ var blocksy_options__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(blocksy_options__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _components_TagNameDropdown__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/TagNameDropdown */ "./framework/premium/extensions/post-types-extra/features/dynamic-data/blocks/dynamic-data/js/components/TagNameDropdown.js");
/* harmony import */ var _Dimensions__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Dimensions */ "./framework/premium/extensions/post-types-extra/features/dynamic-data/blocks/dynamic-data/js/Dimensions.js");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }










var options = (0,blocksy_options__WEBPACK_IMPORTED_MODULE_5__.getOptionsForBlock)('dynamic-data');

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

var Edit = function Edit(_ref) {
  var _Object$values$find, _Object$values$find$o, _Object$values$find$o2, _taxonomyChoises$;

  var clientId = _ref.clientId,
      attributes = _ref.attributes,
      _ref$attributes = _ref.attributes,
      align = _ref$attributes.align,
      tagName = _ref$attributes.tagName,
      imageAlign = _ref$attributes.imageAlign,
      setAttributes = _ref.setAttributes,
      context = _ref.context,
      props = _objectWithoutProperties(_ref, ["clientId", "attributes", "attributes", "setAttributes", "context"]);

  var _useState = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null),
      _useState2 = _slicedToArray(_useState, 2),
      fieldsDescriptor = _useState2[0],
      setFieldsDescriptor = _useState2[1];

  var postId = context.postId,
      postType = context.postType;
  var valueToRender = '';

  if (attributes.field && fieldsDescriptor) {
    var _allFields = fieldsDescriptor.fields.reduce(function (acc, provider) {
      return [].concat(_toConsumableArray(acc), _toConsumableArray(provider.fields));
    }, []);

    var maybeFieldDescriptor = _allFields.find(function (_ref2) {
      var key = _ref2.key;
      return key === attributes.field;
    });

    if (maybeFieldDescriptor) {
      valueToRender = maybeFieldDescriptor.result;
    }
  }

  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    fetch("".concat(wp.ajax.settings.url, "?action=blocksy_ext_post_types_extra_retrieve_dynamic_data_descriptor"), {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        post_id: postId
      })
    }).then(function (res) {
      return res.json();
    }).then(function (_ref3) {
      var success = _ref3.success,
          data = _ref3.data;

      if (!success) {
        return;
      }

      setFieldsDescriptor(data);
    });
  }, [postId]);
  var allFields = fieldsDescriptor && fieldsDescriptor.fields ? fieldsDescriptor.fields.reduce(function (result, provider) {
    return [].concat(_toConsumableArray(result), _toConsumableArray(provider.fields));
  }, []) : [];
  var taxonomyChoises = (_Object$values$find = Object.values(options).find(function (_ref4) {
    var condition = _ref4.condition;
    return (condition === null || condition === void 0 ? void 0 : condition.field) === 'wp:terms';
  })) === null || _Object$values$find === void 0 ? void 0 : (_Object$values$find$o = _Object$values$find.options) === null || _Object$values$find$o === void 0 ? void 0 : (_Object$values$find$o2 = _Object$values$find$o.taxonomy) === null || _Object$values$find$o2 === void 0 ? void 0 : _Object$values$find$o2.choices;

  if (Array.isArray(taxonomyChoises) && !taxonomyChoises.length) {
    allFields = allFields.filter(function (_ref5) {
      var key = _ref5.key;
      return key !== 'wp:terms';
    });
  }

  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(React.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.BlockControls, {
    group: "block"
  }, valueToRender.type !== 'image' ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(React.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.AlignmentControl, {
    value: align,
    onChange: function onChange(newAlign) {
      return setAttributes({
        align: newAlign
      });
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_TagNameDropdown__WEBPACK_IMPORTED_MODULE_6__["default"], {
    tagName: tagName,
    onChange: function onChange(tagName) {
      return setAttributes({
        tagName: tagName
      });
    }
  })) : (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.BlockAlignmentControl, {
    value: imageAlign,
    onChange: function onChange(newImageAlign) {
      return setAttributes({
        imageAlign: newImageAlign
      });
    }
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Preview__WEBPACK_IMPORTED_MODULE_3__["default"], _extends({}, attributes, {
    taxonomy: attributes.taxonomy || (taxonomyChoises === null || taxonomyChoises === void 0 ? void 0 : (_taxonomyChoises$ = taxonomyChoises[0]) === null || _taxonomyChoises$ === void 0 ? void 0 : _taxonomyChoises$.key) || 'category',
    postId: postId,
    postType: postType,
    fieldsDescriptor: fieldsDescriptor
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.PanelBody, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(blocksy_options__WEBPACK_IMPORTED_MODULE_5__.OptionsPanel, {
    purpose: "gutenberg",
    onChange: function onChange(optionId, optionValue) {
      setAttributes(_defineProperty({}, optionId, optionValue));
    },
    options: _objectSpread({
      field: {
        type: 'ct-select',
        label: (0,ct_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Content Source', 'blocksy-companion'),
        value: '',
        defaultToFirstItem: false,
        choices: allFields,
        purpose: 'default'
      }
    }, valueToRender.type === 'image' ? {} : options),
    value: attributes,
    hasRevertButton: false
  })), valueToRender.type === 'image' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(React.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Dimensions__WEBPACK_IMPORTED_MODULE_7__["default"], {
    clientId: clientId,
    attributes: attributes,
    setAttributes: setAttributes,
    imageSizeOptions: fieldsDescriptor ? Object.keys(fieldsDescriptor.image_sizes).filter(function (size) {
      return !parseFloat(size);
    }).map(function (size) {
      return {
        value: size,
        label: capitalizeFirstLetter(size).split('_').join(' ')
      };
    }) : []
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.PanelBody, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.TextareaControl, {
    label: (0,ct_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Alternative Text', 'blocksy-companion'),
    value: attributes.alt_text || '',
    onChange: function onChange(value) {
      setAttributes({
        alt_text: value
      });
    },
    help: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(React.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ExternalLink, {
      href: "https://www.w3.org/WAI/tutorials/images/decision-tree"
    }, (0,ct_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Describe the purpose of the image.')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("br", null), (0,ct_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Leave empty if decorative.')),
    __nextHasNoMarginBottom: true
  })))));
};

/* harmony default export */ __webpack_exports__["default"] = (Edit);

/***/ }),

/***/ "./framework/premium/extensions/post-types-extra/features/dynamic-data/blocks/dynamic-data/js/Preview.js":
/*!***************************************************************************************************************!*\
  !*** ./framework/premium/extensions/post-types-extra/features/dynamic-data/blocks/dynamic-data/js/Preview.js ***!
  \***************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var ct_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ct-i18n */ "ct-i18n");
/* harmony import */ var ct_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(ct_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _preview_parts_TitlePreview__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./preview-parts/TitlePreview */ "./framework/premium/extensions/post-types-extra/features/dynamic-data/blocks/dynamic-data/js/preview-parts/TitlePreview.js");
/* harmony import */ var _preview_parts_ExcerptPreview__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./preview-parts/ExcerptPreview */ "./framework/premium/extensions/post-types-extra/features/dynamic-data/blocks/dynamic-data/js/preview-parts/ExcerptPreview.js");
/* harmony import */ var _preview_parts_DatePreview__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./preview-parts/DatePreview */ "./framework/premium/extensions/post-types-extra/features/dynamic-data/blocks/dynamic-data/js/preview-parts/DatePreview.js");
/* harmony import */ var _preview_parts_CommentsPreview__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./preview-parts/CommentsPreview */ "./framework/premium/extensions/post-types-extra/features/dynamic-data/blocks/dynamic-data/js/preview-parts/CommentsPreview.js");
/* harmony import */ var _preview_parts_TaxonomyPreview__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./preview-parts/TaxonomyPreview */ "./framework/premium/extensions/post-types-extra/features/dynamic-data/blocks/dynamic-data/js/preview-parts/TaxonomyPreview.js");
/* harmony import */ var _preview_parts_AuthorPreview__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./preview-parts/AuthorPreview */ "./framework/premium/extensions/post-types-extra/features/dynamic-data/blocks/dynamic-data/js/preview-parts/AuthorPreview.js");
/* harmony import */ var _preview_parts_ImagePreview__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./preview-parts/ImagePreview */ "./framework/premium/extensions/post-types-extra/features/dynamic-data/blocks/dynamic-data/js/preview-parts/ImagePreview.js");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }













var Preview = function Preview(_ref) {
  var _classnames;

  var fieldsDescriptor = _ref.fieldsDescriptor,
      postId = _ref.postId,
      postType = _ref.postType,
      TagName = _ref.tagName,
      align = _ref.align,
      imageAlign = _ref.imageAlign,
      field = _ref.field,
      aspectRatio = _ref.aspectRatio,
      width = _ref.width,
      height = _ref.height,
      before = _ref.before,
      after = _ref.after,
      fallback = _ref.fallback,
      has_title_link = _ref.has_title_link,
      excerpt_length = _ref.excerpt_length,
      default_format = _ref.default_format,
      date_type = _ref.date_type,
      date_format = _ref.date_format,
      custom_date_format = _ref.custom_date_format,
      has_comments_link = _ref.has_comments_link,
      zero_text = _ref.zero_text,
      single_text = _ref.single_text,
      multiple_text = _ref.multiple_text,
      has_terms_link = _ref.has_terms_link,
      taxonomy = _ref.taxonomy,
      separator = _ref.separator,
      author_field = _ref.author_field,
      has_author_link = _ref.has_author_link,
      rest = _objectWithoutProperties(_ref, ["fieldsDescriptor", "postId", "postType", "tagName", "align", "imageAlign", "field", "aspectRatio", "width", "height", "before", "after", "fallback", "has_title_link", "excerpt_length", "default_format", "date_type", "date_format", "custom_date_format", "has_comments_link", "zero_text", "single_text", "multiple_text", "has_terms_link", "taxonomy", "separator", "author_field", "has_author_link"]);

  var valueToRender = '';

  var _useState = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]),
      _useState2 = _slicedToArray(_useState, 2),
      comments = _useState2[0],
      setComments = _useState2[1];

  var fetchAttributes = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            fetch("".concat((window.ct_localizations || window.ct_customizer_localizations).rest_url, "wp/v2/comments/?post=").concat(postId)).then(function (res) {
              return res.json();
            }).then(function (data) {
              setComments(data);
            });

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })), [postId]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    fetchAttributes();
  }, [fetchAttributes]);

  if (field && fieldsDescriptor) {
    var allFields = fieldsDescriptor.fields.reduce(function (acc, provider) {
      return [].concat(_toConsumableArray(acc), _toConsumableArray(provider.fields));
    }, []);
    var maybeFieldDescriptor = allFields.find(function (_ref3) {
      var key = _ref3.key;
      return key === field;
    });

    if (maybeFieldDescriptor) {
      valueToRender = maybeFieldDescriptor.result;
    }
  }

  var blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)({
    className: classnames__WEBPACK_IMPORTED_MODULE_3___default()('ct-dynamic-data', (_classnames = {
      'wp-block-image': valueToRender.type === 'image'
    }, _defineProperty(_classnames, "has-text-align-".concat(align), valueToRender.type !== 'image' && align), _defineProperty(_classnames, "align".concat(imageAlign), valueToRender.type === 'image' && imageAlign), _classnames)),
    style: _objectSpread({}, valueToRender.type === 'image' ? {
      aspectRatio: aspectRatio,
      width: width,
      height: height
    } : {})
  });
  var isFallback = false;

  if (valueToRender.type === 'image') {
    var _valueToRender;

    valueToRender = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_preview_parts_ImagePreview__WEBPACK_IMPORTED_MODULE_10__["default"], {
      value: ((_valueToRender = valueToRender) === null || _valueToRender === void 0 ? void 0 : _valueToRender.value) || valueToRender,
      blockProps: blockProps,
      aspectRatio: aspectRatio,
      height: height
    });
  }

  if (!valueToRender && !isFallback) {
    isFallback = true;
    valueToRender = fallback || '';
  }

  if (!isFallback && valueToRender && typeof valueToRender === 'string') {
    valueToRender = before + valueToRender + after;
  }

  if (field.includes('wp:')) {
    var Component = null;

    if (field === 'wp:title') {
      Component = (0,_preview_parts_TitlePreview__WEBPACK_IMPORTED_MODULE_4__["default"])({
        has_title_link: has_title_link
      });
    }

    if (field === 'wp:excerpt') {
      Component = (0,_preview_parts_ExcerptPreview__WEBPACK_IMPORTED_MODULE_5__["default"])({
        excerpt_length: excerpt_length
      });
    }

    if (field === 'wp:date') {
      Component = (0,_preview_parts_DatePreview__WEBPACK_IMPORTED_MODULE_6__["default"])({
        postId: postId,
        default_format: default_format,
        date_type: date_type,
        date_format: date_format,
        custom_date_format: custom_date_format
      });
    }

    if (field === 'wp:comments') {
      Component = (0,_preview_parts_CommentsPreview__WEBPACK_IMPORTED_MODULE_7__["default"])({
        has_comments_link: has_comments_link,
        zero_text: zero_text,
        single_text: single_text,
        multiple_text: multiple_text,
        comments: comments
      });
    }

    if (field === 'wp:terms') {
      Component = (0,_preview_parts_TaxonomyPreview__WEBPACK_IMPORTED_MODULE_8__["default"])({
        postId: postId,
        has_terms_link: has_terms_link,
        taxonomy: taxonomy,
        separator: separator
      });
    }

    if (field === 'wp:author') {
      Component = (0,_preview_parts_AuthorPreview__WEBPACK_IMPORTED_MODULE_9__["default"])({
        postId: postId,
        has_author_link: has_author_link,
        author_field: author_field
      });
    }

    if (field === 'wp:author') {
      Component = (0,_preview_parts_AuthorPreview__WEBPACK_IMPORTED_MODULE_9__["default"])({
        postId: postId,
        has_author_link: has_author_link,
        author_field: author_field
      });
    }

    if (Component) {
      valueToRender = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(TagName, blockProps, before, Component, after);
    }
  }

  if (typeof valueToRender !== 'string') {
    return valueToRender;
  }

  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(TagName, blockProps, valueToRender);
};

/* harmony default export */ __webpack_exports__["default"] = (Preview);

/***/ }),

/***/ "./framework/premium/extensions/post-types-extra/features/dynamic-data/blocks/dynamic-data/js/components/TagNameDropdown.js":
/*!**********************************************************************************************************************************!*\
  !*** ./framework/premium/extensions/post-types-extra/features/dynamic-data/blocks/dynamic-data/js/components/TagNameDropdown.js ***!
  \**********************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ HeadingLevelDropdown; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var ct_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ct-i18n */ "ct-i18n");
/* harmony import */ var ct_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(ct_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _TagNameIcon__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./TagNameIcon */ "./framework/premium/extensions/post-types-extra/features/dynamic-data/blocks/dynamic-data/js/components/TagNameIcon.js");




function HeadingLevelDropdown(_ref) {
  var tagName = _ref.tagName,
      onChange = _ref.onChange;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToolbarDropdownMenu, {
    popoverProps: {
      className: 'block-library-heading-level-dropdown'
    },
    icon: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_TagNameIcon__WEBPACK_IMPORTED_MODULE_3__["default"], {
      level: tagName
    }),
    label: (0,ct_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Change heading level'),
    controls: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div'].map(function (targetTagName) {
      {
        var isActive = targetTagName === tagName;
        return {
          icon: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_TagNameIcon__WEBPACK_IMPORTED_MODULE_3__["default"], {
            level: targetTagName,
            isPressed: isActive
          }),
          label: targetTagName,
          title: {
            h1: (0,ct_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Heading 1', 'blocksy-companion'),
            h2: (0,ct_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Heading 2', 'blocksy-companion'),
            h3: (0,ct_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Heading 3', 'blocksy-companion'),
            h4: (0,ct_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Heading 4', 'blocksy-companion'),
            h5: (0,ct_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Heading 5', 'blocksy-companion'),
            h6: (0,ct_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Heading 6', 'blocksy-companion'),
            p: (0,ct_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Paragraph', 'blocksy-companion'),
            span: (0,ct_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Span', 'blocksy-companion'),
            div: (0,ct_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Div', 'blocksy-companion')
          }[targetTagName],
          isActive: isActive,
          onClick: function onClick() {
            onChange(targetTagName);
          },
          role: 'menuitemradio'
        };
      }
    })
  });
}

/***/ }),

/***/ "./framework/premium/extensions/post-types-extra/features/dynamic-data/blocks/dynamic-data/js/components/TagNameIcon.js":
/*!******************************************************************************************************************************!*\
  !*** ./framework/premium/extensions/post-types-extra/features/dynamic-data/blocks/dynamic-data/js/components/TagNameIcon.js ***!
  \******************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ TagNameIcon; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);

/**
 * WordPress dependencies
 */


/** @typedef {import('@wordpress/element').WPComponent} WPComponent */

/**
 * HeadingLevelIcon props.
 *
 * @typedef WPHeadingLevelIconProps
 *
 * @property {number}   level     The heading level to show an icon for.
 * @property {?boolean} isPressed Whether or not the icon should appear pressed; default: false.
 */

/**
 * Heading level icon.
 *
 * @param {WPHeadingLevelIconProps} props Component props.
 *
 * @return {?WPComponent} The icon.
 */

function TagNameIcon(_ref) {
  var level = _ref.level,
      _ref$isPressed = _ref.isPressed,
      isPressed = _ref$isPressed === void 0 ? false : _ref$isPressed;
  var levelToPath = {
    h1: 'M9 5h2v10H9v-4H5v4H3V5h2v4h4V5zm6.6 0c-.6.9-1.5 1.7-2.6 2v1h2v7h2V5h-1.4z',
    h2: 'M7 5h2v10H7v-4H3v4H1V5h2v4h4V5zm8 8c.5-.4.6-.6 1.1-1.1.4-.4.8-.8 1.2-1.3.3-.4.6-.8.9-1.3.2-.4.3-.8.3-1.3 0-.4-.1-.9-.3-1.3-.2-.4-.4-.7-.8-1-.3-.3-.7-.5-1.2-.6-.5-.2-1-.2-1.5-.2-.4 0-.7 0-1.1.1-.3.1-.7.2-1 .3-.3.1-.6.3-.9.5-.3.2-.6.4-.8.7l1.2 1.2c.3-.3.6-.5 1-.7.4-.2.7-.3 1.2-.3s.9.1 1.3.4c.3.3.5.7.5 1.1 0 .4-.1.8-.4 1.1-.3.5-.6.9-1 1.2-.4.4-1 .9-1.6 1.4-.6.5-1.4 1.1-2.2 1.6V15h8v-2H15z',
    h3: 'M12.1 12.2c.4.3.8.5 1.2.7.4.2.9.3 1.4.3.5 0 1-.1 1.4-.3.3-.1.5-.5.5-.8 0-.2 0-.4-.1-.6-.1-.2-.3-.3-.5-.4-.3-.1-.7-.2-1-.3-.5-.1-1-.1-1.5-.1V9.1c.7.1 1.5-.1 2.2-.4.4-.2.6-.5.6-.9 0-.3-.1-.6-.4-.8-.3-.2-.7-.3-1.1-.3-.4 0-.8.1-1.1.3-.4.2-.7.4-1.1.6l-1.2-1.4c.5-.4 1.1-.7 1.6-.9.5-.2 1.2-.3 1.8-.3.5 0 1 .1 1.6.2.4.1.8.3 1.2.5.3.2.6.5.8.8.2.3.3.7.3 1.1 0 .5-.2.9-.5 1.3-.4.4-.9.7-1.5.9v.1c.6.1 1.2.4 1.6.8.4.4.7.9.7 1.5 0 .4-.1.8-.3 1.2-.2.4-.5.7-.9.9-.4.3-.9.4-1.3.5-.5.1-1 .2-1.6.2-.8 0-1.6-.1-2.3-.4-.6-.2-1.1-.6-1.6-1l1.1-1.4zM7 9H3V5H1v10h2v-4h4v4h2V5H7v4z',
    h4: 'M9 15H7v-4H3v4H1V5h2v4h4V5h2v10zm10-2h-1v2h-2v-2h-5v-2l4-6h3v6h1v2zm-3-2V7l-2.8 4H16z',
    h5: 'M12.1 12.2c.4.3.7.5 1.1.7.4.2.9.3 1.3.3.5 0 1-.1 1.4-.4.4-.3.6-.7.6-1.1 0-.4-.2-.9-.6-1.1-.4-.3-.9-.4-1.4-.4H14c-.1 0-.3 0-.4.1l-.4.1-.5.2-1-.6.3-5h6.4v1.9h-4.3L14 8.8c.2-.1.5-.1.7-.2.2 0 .5-.1.7-.1.5 0 .9.1 1.4.2.4.1.8.3 1.1.6.3.2.6.6.8.9.2.4.3.9.3 1.4 0 .5-.1 1-.3 1.4-.2.4-.5.8-.9 1.1-.4.3-.8.5-1.3.7-.5.2-1 .3-1.5.3-.8 0-1.6-.1-2.3-.4-.6-.2-1.1-.6-1.6-1-.1-.1 1-1.5 1-1.5zM9 15H7v-4H3v4H1V5h2v4h4V5h2v10z',
    h6: 'M9 15H7v-4H3v4H1V5h2v4h4V5h2v10zm8.6-7.5c-.2-.2-.5-.4-.8-.5-.6-.2-1.3-.2-1.9 0-.3.1-.6.3-.8.5l-.6.9c-.2.5-.2.9-.2 1.4.4-.3.8-.6 1.2-.8.4-.2.8-.3 1.3-.3.4 0 .8 0 1.2.2.4.1.7.3 1 .6.3.3.5.6.7.9.2.4.3.8.3 1.3s-.1.9-.3 1.4c-.2.4-.5.7-.8 1-.4.3-.8.5-1.2.6-1 .3-2 .3-3 0-.5-.2-1-.5-1.4-.9-.4-.4-.8-.9-1-1.5-.2-.6-.3-1.3-.3-2.1s.1-1.6.4-2.3c.2-.6.6-1.2 1-1.6.4-.4.9-.7 1.4-.9.6-.3 1.1-.4 1.7-.4.7 0 1.4.1 2 .3.5.2 1 .5 1.4.8 0 .1-1.3 1.4-1.3 1.4zm-2.4 5.8c.2 0 .4 0 .6-.1.2 0 .4-.1.5-.2.1-.1.3-.3.4-.5.1-.2.1-.5.1-.7 0-.4-.1-.8-.4-1.1-.3-.2-.7-.3-1.1-.3-.3 0-.7.1-1 .2-.4.2-.7.4-1 .7 0 .3.1.7.3 1 .1.2.3.4.4.6.2.1.3.3.5.3.2.1.5.2.7.1z',
    p: 'M6.2 15V5h3.2c1.2 0 2 .1 2.4.2.6.2 1 .5 1.4 1 .4.5.6 1.1.6 1.9 0 .6-.1 1.1-.3 1.6-.2.4-.5.8-.9 1-.3.2-.7.4-1 .5-.5.1-1.2.1-2.1.1H8.2V15h-2zm2-8.3v2.8h1.1c.8 0 1.3 0 1.6-.2.3-.1.5-.3.6-.5.2-.2.2-.5.2-.8 0-.4-.1-.7-.3-.9-.2-.2-.5-.4-.8-.4-.2 0-.7-.1-1.5-.1.1.1-.9.1-.9.1z',
    span: 'M8.2 12c.2 1 .9 1.4 2 1.4s1.6-.4 1.6-1.2c0-.8-.5-1.1-2.1-1.5-2.7-.6-3.3-1.5-3.3-2.9C6.4 6.2 7.6 5 9.9 5c2.6 0 3.6 1.4 3.7 2.8h-2.1c-.1-.6-.4-1.2-1.7-1.2-.9 0-1.4.4-1.4 1 0 .7.4.9 2 1.3 2.9.7 3.6 1.7 3.6 3.1 0 1.8-1.3 3-3.9 3-2.5 0-3.8-1.2-4-3h2.1z',
    div: 'M5.8 5h3.7c.8 0 1.5.1 1.9.2.6.2 1.1.5 1.5.9.4.4.7 1 1 1.6.2.6.3 1.4.3 2.4 0 .8-.1 1.5-.3 2.1-.3.7-.6 1.3-1.1 1.8-.3.3-.8.6-1.4.8-.4.1-1 .2-1.8.2H5.8V5zm2 1.7v6.6h1.5c.6 0 1 0 1.2-.1.3-.1.6-.2.8-.4.2-.2.4-.5.5-1 .1-.4.2-1.1.2-1.8 0-.8-.1-1.4-.2-1.8-.1-.4-.3-.7-.6-1-.2-.2-.6-.4-.9-.5-.3-.1-.8-.1-1.6-.1l-.9.1z'
  };

  if (!levelToPath.hasOwnProperty(level)) {
    return null;
  }

  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SVG, {
    width: "24",
    height: "24",
    viewBox: "0 0 20 20",
    xmlns: "http://www.w3.org/2000/svg",
    isPressed: isPressed
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Path, {
    d: levelToPath[level]
  }));
}

/***/ }),

/***/ "./framework/premium/extensions/post-types-extra/features/dynamic-data/blocks/dynamic-data/js/index.js":
/*!*************************************************************************************************************!*\
  !*** ./framework/premium/extensions/post-types-extra/features/dynamic-data/blocks/dynamic-data/js/index.js ***!
  \*************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "defaultAttributes": function() { return /* binding */ defaultAttributes; },
/* harmony export */   "options": function() { return /* binding */ options; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var ct_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ct-i18n */ "ct-i18n");
/* harmony import */ var ct_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(ct_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _Edit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Edit */ "./framework/premium/extensions/post-types-extra/features/dynamic-data/blocks/dynamic-data/js/Edit.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./block.json */ "./framework/premium/extensions/post-types-extra/features/dynamic-data/blocks/dynamic-data/js/block.json");
/* harmony import */ var blocksy_options__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! blocksy-options */ "blocksy-options");
/* harmony import */ var blocksy_options__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(blocksy_options__WEBPACK_IMPORTED_MODULE_5__);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }







var options = (0,blocksy_options__WEBPACK_IMPORTED_MODULE_5__.getOptionsForBlock)('dynamic-data');
var defaultAttributes = (0,blocksy_options__WEBPACK_IMPORTED_MODULE_5__.getAttributesFromOptions)(options);
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__.registerBlockType)('blocksy/dynamic-data', _objectSpread(_objectSpread({}, _block_json__WEBPACK_IMPORTED_MODULE_4__), {}, {
  title: (0,ct_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Dynamic Data', 'blocksy-companion'),
  description: (0,ct_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Insert the dynamic data anywhere you might want.', 'blocksy-companion'),
  attributes: _objectSpread(_objectSpread({}, _block_json__WEBPACK_IMPORTED_MODULE_4__.attributes), defaultAttributes),
  icon: {
    src: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
      d: "M17.9 10.5c-.1-.3-.4-.4-.7-.4h-3.7V4.6c0-.4-.2-.7-.6-.8h-.2c-.3 0-.5.1-.7.4l-5.7 8.6c-.2.3-.2.6 0 .8 0 .2.3.4.6.4h3.7v5.5c0 .4.2.7.6.8h.2c.3 0 .5-.1.7-.4l5.7-8.6c.2-.2.2-.6.1-.8zm-5.9 7v-4.4c0-.3-.3-.6-.6-.6H7.9l4.1-6v4.4c0 .3.3.6.6.6h3.5l-4.1 6z"
    }))
  },
  edit: function edit(props) {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Edit__WEBPACK_IMPORTED_MODULE_3__["default"], props);
  },
  save: function save() {
    return null;
  }
}));

/***/ }),

/***/ "./framework/premium/extensions/post-types-extra/features/dynamic-data/blocks/dynamic-data/js/preview-parts/AuthorPreview.js":
/*!***********************************************************************************************************************************!*\
  !*** ./framework/premium/extensions/post-types-extra/features/dynamic-data/blocks/dynamic-data/js/preview-parts/AuthorPreview.js ***!
  \***********************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var ct_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ct-i18n */ "ct-i18n");
/* harmony import */ var ct_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(ct_i18n__WEBPACK_IMPORTED_MODULE_2__);




var AuthorPreview = function AuthorPreview(_ref) {
  var postId = _ref.postId,
      has_author_link = _ref.has_author_link,
      author_field = _ref.author_field;

  var getAuthorFiledValue = function getAuthorFiledValue(author) {
    switch (author_field) {
      case 'email':
        return (author === null || author === void 0 ? void 0 : author.email) || '';

      case 'nicename':
        return (author === null || author === void 0 ? void 0 : author.nickname) || '';

      case 'display_name':
        return (author === null || author === void 0 ? void 0 : author.nickname) || '';

      case 'first_name':
        return (author === null || author === void 0 ? void 0 : author.first_name) || '';

      case 'last_name':
        return (author === null || author === void 0 ? void 0 : author.last_name) || '';

      case 'description':
        return (author === null || author === void 0 ? void 0 : author.description) || '';

      default:
        break;
    }
  };

  var GetAuthor = function GetAuthor(_ref2) {
    var author = _ref2.author,
        post = _ref2.post;

    if (has_author_link === 'yes') {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
        href: "#",
        rel: "noopener noreferrer"
      }, getAuthorFiledValue(author));
    }

    return getAuthorFiledValue(author);
  };

  var selectAuthor = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.withSelect)(function (select) {
    var post = select('core').getEntityRecord('postType', select('core/editor').getCurrentPostType(), postId);
    var authorId = post === null || post === void 0 ? void 0 : post.author;
    var author = select('core').getUser(authorId);
    return {
      author: author
    };
  });
  var PostTaxonomy = selectAuthor(GetAuthor);
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(PostTaxonomy, null);
};

/* harmony default export */ __webpack_exports__["default"] = (AuthorPreview);

/***/ }),

/***/ "./framework/premium/extensions/post-types-extra/features/dynamic-data/blocks/dynamic-data/js/preview-parts/CommentsPreview.js":
/*!*************************************************************************************************************************************!*\
  !*** ./framework/premium/extensions/post-types-extra/features/dynamic-data/blocks/dynamic-data/js/preview-parts/CommentsPreview.js ***!
  \*************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var ct_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ct-i18n */ "ct-i18n");
/* harmony import */ var ct_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(ct_i18n__WEBPACK_IMPORTED_MODULE_1__);



var CommentsPreview = function CommentsPreview(_ref) {
  var has_comments_link = _ref.has_comments_link,
      zero_text = _ref.zero_text,
      single_text = _ref.single_text,
      multiple_text = _ref.multiple_text,
      comments = _ref.comments;
  var comments_num = comments.length || 0;
  var commentsText = comments_num === 0 ? zero_text : comments_num === 1 ? single_text : multiple_text;

  if (has_comments_link === 'yes') {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
      href: "#",
      rel: "noopener noreferrer"
    }, commentsText.replace('%', comments_num));
  }

  return commentsText.replace('%', comments_num);
};

/* harmony default export */ __webpack_exports__["default"] = (CommentsPreview);

/***/ }),

/***/ "./framework/premium/extensions/post-types-extra/features/dynamic-data/blocks/dynamic-data/js/preview-parts/DatePreview.js":
/*!*********************************************************************************************************************************!*\
  !*** ./framework/premium/extensions/post-types-extra/features/dynamic-data/blocks/dynamic-data/js/preview-parts/DatePreview.js ***!
  \*********************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_date__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/date */ "@wordpress/date");
/* harmony import */ var _wordpress_date__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_date__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var ct_i18n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ct-i18n */ "ct-i18n");
/* harmony import */ var ct_i18n__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(ct_i18n__WEBPACK_IMPORTED_MODULE_3__);





var DatePreview = function DatePreview(_ref) {
  var postId = _ref.postId,
      default_format = _ref.default_format,
      date_type = _ref.date_type,
      date_format = _ref.date_format,
      custom_date_format = _ref.custom_date_format;
  var dateFormat = default_format === 'yes' ? (0,_wordpress_date__WEBPACK_IMPORTED_MODULE_1__.getSettings)().formats.date : date_format !== 'custom' ? date_format : custom_date_format;

  var GetDate = function GetDate(props) {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, (0,_wordpress_date__WEBPACK_IMPORTED_MODULE_1__.format)(dateFormat, date_type === 'published' ? props.post.date : props.post.modified));
  };

  var selectDate = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.withSelect)(function (select) {
    return {
      post: select('core').getEntityRecord('postType', select('core/editor').getCurrentPostType(), postId)
    };
  });
  var PostDate = selectDate(GetDate);
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(PostDate, null);
};

/* harmony default export */ __webpack_exports__["default"] = (DatePreview);

/***/ }),

/***/ "./framework/premium/extensions/post-types-extra/features/dynamic-data/blocks/dynamic-data/js/preview-parts/ExcerptPreview.js":
/*!************************************************************************************************************************************!*\
  !*** ./framework/premium/extensions/post-types-extra/features/dynamic-data/blocks/dynamic-data/js/preview-parts/ExcerptPreview.js ***!
  \************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var ct_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ct-i18n */ "ct-i18n");
/* harmony import */ var ct_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(ct_i18n__WEBPACK_IMPORTED_MODULE_2__);




var ExcerptPreview = function ExcerptPreview(_ref) {
  var excerpt_length = _ref.excerpt_length;

  var strippedRenderedExcerpt = function strippedRenderedExcerpt(content) {
    if (!content) return '';
    var document = new window.DOMParser().parseFromString(content, 'text/html');
    return document.body.textContent || document.body.innerText || '';
  };

  var GetExcerpt = function GetExcerpt(_ref2) {
    var excerpt = _ref2.excerpt,
        content = _ref2.content;
    var excerptContent = "".concat(excerpt || strippedRenderedExcerpt(content));
    var excerptParts = excerptContent.split(' ');
    var maybeMore = excerptParts.length > excerpt_length ? '...' : '';
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.RawHTML, null, excerptParts.slice(0, excerpt_length).join(' '), maybeMore);
  };

  var selectExcerpt = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.withSelect)(function (select) {
    var _select, _select2;

    return {
      excerpt: ((_select = select('core/editor')) === null || _select === void 0 ? void 0 : _select.getEditedPostAttribute('excerpt')) || '',
      content: ((_select2 = select('core/editor')) === null || _select2 === void 0 ? void 0 : _select2.getEditedPostAttribute('content')) || ''
    };
  });
  var PostExcerpt = selectExcerpt(GetExcerpt);
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(PostExcerpt, null);
};

/* harmony default export */ __webpack_exports__["default"] = (ExcerptPreview);

/***/ }),

/***/ "./framework/premium/extensions/post-types-extra/features/dynamic-data/blocks/dynamic-data/js/preview-parts/ImagePreview.js":
/*!**********************************************************************************************************************************!*\
  !*** ./framework/premium/extensions/post-types-extra/features/dynamic-data/blocks/dynamic-data/js/preview-parts/ImagePreview.js ***!
  \**********************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }



var ImagePreview = function ImagePreview(_ref) {
  var value = _ref.value,
      blockProps = _ref.blockProps,
      aspectRatio = _ref.aspectRatio,
      height = _ref.height;
  var maybeUrl = '';

  if (typeof value === 'string') {
    maybeUrl = value;
  } else if (_typeof(value) === 'object') {
    maybeUrl = value.url;
  } else if (typeof value === 'number') {
    if (wp.data) {
      var maybeImage = wp.data.select('core').getMedia(value);

      if (maybeImage) {
        maybeUrl = maybeImage.source_url;
      }
    }
  }

  if (!maybeUrl) {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("figure", blockProps, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "ct-dynamic-data-placeholder"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 60 60",
      preserveAspectRatio: "none",
      class: "components-placeholder__illustration",
      "aria-hidden": "true",
      focusable: "false",
      style: {
        'min-height': '200px',
        height: !!aspectRatio && '100%',
        width: !!aspectRatio && '100%'
      }
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
      "vector-effect": "non-scaling-stroke",
      d: "M60 60 0 0"
    }))));
  }

  var imageProps = {
    style: blockProps.style
  };
  delete blockProps.style;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("figure", blockProps, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    style: _objectSpread(_objectSpread({}, imageProps.style), {}, {
      objectFit: 'cover'
    }),
    src: maybeUrl
  }));
};

/* harmony default export */ __webpack_exports__["default"] = (ImagePreview);

/***/ }),

/***/ "./framework/premium/extensions/post-types-extra/features/dynamic-data/blocks/dynamic-data/js/preview-parts/TaxonomyPreview.js":
/*!*************************************************************************************************************************************!*\
  !*** ./framework/premium/extensions/post-types-extra/features/dynamic-data/blocks/dynamic-data/js/preview-parts/TaxonomyPreview.js ***!
  \*************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var ct_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ct-i18n */ "ct-i18n");
/* harmony import */ var ct_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(ct_i18n__WEBPACK_IMPORTED_MODULE_2__);




var TaxonomyPreview = function TaxonomyPreview(_ref) {
  var postId = _ref.postId,
      has_terms_link = _ref.has_terms_link,
      req_taxonomy = _ref.taxonomy,
      separator = _ref.separator;

  var GetTaxonomy = function GetTaxonomy(_ref2) {
    var terms = _ref2.terms;

    if (!req_taxonomy) {
      return (0,ct_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('No Terms', 'blocksy-companion');
    }

    if (has_terms_link === 'yes') {
      return terms.length ? terms.map(function (t, index) {
        return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(React.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
          href: "#",
          rel: "noopener noreferrer"
        }, t.name), index !== terms.length - 1 ? separator : '');
      }) : (0,ct_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('No Terms', 'blocksy');
    }

    return terms.length ? terms.map(function (t) {
      return t.name;
    }).join(separator) : (0,ct_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('No Terms', 'blocksy');
  };

  var selectTaxonomy = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.withSelect)(function (select) {
    return {
      terms: select('core').getEntityRecords('taxonomy', req_taxonomy, {
        per_page: -1,
        post: postId
      }) || []
    };
  });
  var PostTaxonomy = selectTaxonomy(GetTaxonomy);
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(PostTaxonomy, null);
};

/* harmony default export */ __webpack_exports__["default"] = (TaxonomyPreview);

/***/ }),

/***/ "./framework/premium/extensions/post-types-extra/features/dynamic-data/blocks/dynamic-data/js/preview-parts/TitlePreview.js":
/*!**********************************************************************************************************************************!*\
  !*** ./framework/premium/extensions/post-types-extra/features/dynamic-data/blocks/dynamic-data/js/preview-parts/TitlePreview.js ***!
  \**********************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var ct_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ct-i18n */ "ct-i18n");
/* harmony import */ var ct_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(ct_i18n__WEBPACK_IMPORTED_MODULE_2__);




var TitlePreview = function TitlePreview(_ref) {
  var has_title_link = _ref.has_title_link;

  var GetTitle = function GetTitle(_ref2) {
    var title = _ref2.title;

    if (has_title_link === 'yes') {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
        href: "#",
        rel: "noopener noreferrer"
      }, title || (0,ct_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Page', 'blocksy'));
    }

    return title || (0,ct_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Page', 'blocksy');
  };

  var selectTitle = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.withSelect)(function (select) {
    var _select;

    return {
      title: ((_select = select('core/editor')) === null || _select === void 0 ? void 0 : _select.getEditedPostAttribute('title')) || ''
    };
  });
  var PostTitle = selectTitle(GetTitle);
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(PostTitle, null);
};

/* harmony default export */ __webpack_exports__["default"] = (TitlePreview);

/***/ }),

/***/ "./node_modules/classnames/index.js":
/*!******************************************!*\
  !*** ./node_modules/classnames/index.js ***!
  \******************************************/
/***/ (function(module, exports) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
  Copyright (c) 2017 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg) && arg.length) {
				var inner = classNames.apply(null, arg);
				if (inner) {
					classes.push(inner);
				}
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
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

/***/ "blocksy-options":
/*!****************************************!*\
  !*** external "window.blocksyOptions" ***!
  \****************************************/
/***/ (function(module) {

"use strict";
module.exports = window.blocksyOptions;

/***/ }),

/***/ "@wordpress/block-editor":
/*!****************************************!*\
  !*** external "window.wp.blockEditor" ***!
  \****************************************/
/***/ (function(module) {

"use strict";
module.exports = window.wp.blockEditor;

/***/ }),

/***/ "@wordpress/blocks":
/*!***********************************!*\
  !*** external "window.wp.blocks" ***!
  \***********************************/
/***/ (function(module) {

"use strict";
module.exports = window.wp.blocks;

/***/ }),

/***/ "@wordpress/components":
/*!***************************************!*\
  !*** external "window.wp.components" ***!
  \***************************************/
/***/ (function(module) {

"use strict";
module.exports = window.wp.components;

/***/ }),

/***/ "@wordpress/data":
/*!*********************************!*\
  !*** external "window.wp.data" ***!
  \*********************************/
/***/ (function(module) {

"use strict";
module.exports = window.wp.data;

/***/ }),

/***/ "@wordpress/date":
/*!*********************************!*\
  !*** external "window.wp.date" ***!
  \*********************************/
/***/ (function(module) {

"use strict";
module.exports = window.wp.date;

/***/ }),

/***/ "@wordpress/element":
/*!************************************!*\
  !*** external "window.wp.element" ***!
  \************************************/
/***/ (function(module) {

"use strict";
module.exports = window.wp.element;

/***/ }),

/***/ "ct-i18n":
/*!*********************************!*\
  !*** external "window.wp.i18n" ***!
  \*********************************/
/***/ (function(module) {

"use strict";
module.exports = window.wp.i18n;

/***/ }),

/***/ "./framework/premium/extensions/post-types-extra/features/dynamic-data/blocks/dynamic-data/js/block.json":
/*!***************************************************************************************************************!*\
  !*** ./framework/premium/extensions/post-types-extra/features/dynamic-data/blocks/dynamic-data/js/block.json ***!
  \***************************************************************************************************************/
/***/ (function(module) {

"use strict";
module.exports = JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"blocksy/dynamic-data","category":"blocksy-blocks","attributes":{"tagName":{"type":"string","default":"div"},"field":{"type":"string","default":""},"before":{"type":"string","default":""},"after":{"type":"string","default":""},"fallback":{"type":"string","default":"Custom field fallback"},"align":{"type":"string"},"imageAlign":{"type":"string"},"aspectRatio":{"type":"string","default":"auto"},"width":{"type":"string"},"height":{"type":"string"},"sizeSlug":{"type":"string"},"alt_text":{"type":"string","default":""}},"supports":{"className":false,"spacing":{"margin":true,"padding":true,"__experimentalDefaultControls":{"margin":false,"padding":false}},"__experimentalBorder":{"color":true,"radius":true,"width":true,"__experimentalDefaultControls":{"color":true,"radius":true,"width":true}},"color":{"gradients":true,"link":true,"__experimentalDefaultControls":{"text":true,"background":true,"link":true}},"typography":{"fontSize":true,"lineHeight":true,"__experimentalFontFamily":true,"__experimentalTextDecoration":true,"__experimentalFontStyle":true,"__experimentalFontWeight":true,"__experimentalLetterSpacing":true,"__experimentalTextTransform":true,"__experimentalDefaultControls":{"fontSize":true}}},"usesContext":["postId","postType","queryId"]}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
/*!****************************************************************************************!*\
  !*** ./framework/premium/extensions/post-types-extra/static/js/dynamic-data-editor.js ***!
  \****************************************************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _features_dynamic_data_blocks_dynamic_data_js_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../features/dynamic-data/blocks/dynamic-data/js/index */ "./framework/premium/extensions/post-types-extra/features/dynamic-data/blocks/dynamic-data/js/index.js");

}();
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RCIsInNvdXJjZXMiOlsid2VicGFjazovL2Jsb2Nrc3ktY29tcGFuaW9uLy4vZnJhbWV3b3JrL3ByZW1pdW0vZXh0ZW5zaW9ucy9wb3N0LXR5cGVzLWV4dHJhL2ZlYXR1cmVzL2R5bmFtaWMtZGF0YS9ibG9ja3MvZHluYW1pYy1kYXRhL2pzL0RpbWVuc2lvbnMuanMiLCJ3ZWJwYWNrOi8vYmxvY2tzeS1jb21wYW5pb24vLi9mcmFtZXdvcmsvcHJlbWl1bS9leHRlbnNpb25zL3Bvc3QtdHlwZXMtZXh0cmEvZmVhdHVyZXMvZHluYW1pYy1kYXRhL2Jsb2Nrcy9keW5hbWljLWRhdGEvanMvRWRpdC5qcyIsIndlYnBhY2s6Ly9ibG9ja3N5LWNvbXBhbmlvbi8uL2ZyYW1ld29yay9wcmVtaXVtL2V4dGVuc2lvbnMvcG9zdC10eXBlcy1leHRyYS9mZWF0dXJlcy9keW5hbWljLWRhdGEvYmxvY2tzL2R5bmFtaWMtZGF0YS9qcy9QcmV2aWV3LmpzIiwid2VicGFjazovL2Jsb2Nrc3ktY29tcGFuaW9uLy4vZnJhbWV3b3JrL3ByZW1pdW0vZXh0ZW5zaW9ucy9wb3N0LXR5cGVzLWV4dHJhL2ZlYXR1cmVzL2R5bmFtaWMtZGF0YS9ibG9ja3MvZHluYW1pYy1kYXRhL2pzL2NvbXBvbmVudHMvVGFnTmFtZURyb3Bkb3duLmpzIiwid2VicGFjazovL2Jsb2Nrc3ktY29tcGFuaW9uLy4vZnJhbWV3b3JrL3ByZW1pdW0vZXh0ZW5zaW9ucy9wb3N0LXR5cGVzLWV4dHJhL2ZlYXR1cmVzL2R5bmFtaWMtZGF0YS9ibG9ja3MvZHluYW1pYy1kYXRhL2pzL2NvbXBvbmVudHMvVGFnTmFtZUljb24uanMiLCJ3ZWJwYWNrOi8vYmxvY2tzeS1jb21wYW5pb24vLi9mcmFtZXdvcmsvcHJlbWl1bS9leHRlbnNpb25zL3Bvc3QtdHlwZXMtZXh0cmEvZmVhdHVyZXMvZHluYW1pYy1kYXRhL2Jsb2Nrcy9keW5hbWljLWRhdGEvanMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vYmxvY2tzeS1jb21wYW5pb24vLi9mcmFtZXdvcmsvcHJlbWl1bS9leHRlbnNpb25zL3Bvc3QtdHlwZXMtZXh0cmEvZmVhdHVyZXMvZHluYW1pYy1kYXRhL2Jsb2Nrcy9keW5hbWljLWRhdGEvanMvcHJldmlldy1wYXJ0cy9BdXRob3JQcmV2aWV3LmpzIiwid2VicGFjazovL2Jsb2Nrc3ktY29tcGFuaW9uLy4vZnJhbWV3b3JrL3ByZW1pdW0vZXh0ZW5zaW9ucy9wb3N0LXR5cGVzLWV4dHJhL2ZlYXR1cmVzL2R5bmFtaWMtZGF0YS9ibG9ja3MvZHluYW1pYy1kYXRhL2pzL3ByZXZpZXctcGFydHMvQ29tbWVudHNQcmV2aWV3LmpzIiwid2VicGFjazovL2Jsb2Nrc3ktY29tcGFuaW9uLy4vZnJhbWV3b3JrL3ByZW1pdW0vZXh0ZW5zaW9ucy9wb3N0LXR5cGVzLWV4dHJhL2ZlYXR1cmVzL2R5bmFtaWMtZGF0YS9ibG9ja3MvZHluYW1pYy1kYXRhL2pzL3ByZXZpZXctcGFydHMvRGF0ZVByZXZpZXcuanMiLCJ3ZWJwYWNrOi8vYmxvY2tzeS1jb21wYW5pb24vLi9mcmFtZXdvcmsvcHJlbWl1bS9leHRlbnNpb25zL3Bvc3QtdHlwZXMtZXh0cmEvZmVhdHVyZXMvZHluYW1pYy1kYXRhL2Jsb2Nrcy9keW5hbWljLWRhdGEvanMvcHJldmlldy1wYXJ0cy9FeGNlcnB0UHJldmlldy5qcyIsIndlYnBhY2s6Ly9ibG9ja3N5LWNvbXBhbmlvbi8uL2ZyYW1ld29yay9wcmVtaXVtL2V4dGVuc2lvbnMvcG9zdC10eXBlcy1leHRyYS9mZWF0dXJlcy9keW5hbWljLWRhdGEvYmxvY2tzL2R5bmFtaWMtZGF0YS9qcy9wcmV2aWV3LXBhcnRzL0ltYWdlUHJldmlldy5qcyIsIndlYnBhY2s6Ly9ibG9ja3N5LWNvbXBhbmlvbi8uL2ZyYW1ld29yay9wcmVtaXVtL2V4dGVuc2lvbnMvcG9zdC10eXBlcy1leHRyYS9mZWF0dXJlcy9keW5hbWljLWRhdGEvYmxvY2tzL2R5bmFtaWMtZGF0YS9qcy9wcmV2aWV3LXBhcnRzL1RheG9ub215UHJldmlldy5qcyIsIndlYnBhY2s6Ly9ibG9ja3N5LWNvbXBhbmlvbi8uL2ZyYW1ld29yay9wcmVtaXVtL2V4dGVuc2lvbnMvcG9zdC10eXBlcy1leHRyYS9mZWF0dXJlcy9keW5hbWljLWRhdGEvYmxvY2tzL2R5bmFtaWMtZGF0YS9qcy9wcmV2aWV3LXBhcnRzL1RpdGxlUHJldmlldy5qcyIsIndlYnBhY2s6Ly9ibG9ja3N5LWNvbXBhbmlvbi8uL25vZGVfbW9kdWxlcy9jbGFzc25hbWVzL2luZGV4LmpzIiwid2VicGFjazovL2Jsb2Nrc3ktY29tcGFuaW9uL2V4dGVybmFsIHZhciBcIndpbmRvdy5ibG9ja3N5T3B0aW9uc1wiIiwid2VicGFjazovL2Jsb2Nrc3ktY29tcGFuaW9uL2V4dGVybmFsIHZhciBcIndpbmRvdy53cC5ibG9ja0VkaXRvclwiIiwid2VicGFjazovL2Jsb2Nrc3ktY29tcGFuaW9uL2V4dGVybmFsIHZhciBcIndpbmRvdy53cC5ibG9ja3NcIiIsIndlYnBhY2s6Ly9ibG9ja3N5LWNvbXBhbmlvbi9leHRlcm5hbCB2YXIgXCJ3aW5kb3cud3AuY29tcG9uZW50c1wiIiwid2VicGFjazovL2Jsb2Nrc3ktY29tcGFuaW9uL2V4dGVybmFsIHZhciBcIndpbmRvdy53cC5kYXRhXCIiLCJ3ZWJwYWNrOi8vYmxvY2tzeS1jb21wYW5pb24vZXh0ZXJuYWwgdmFyIFwid2luZG93LndwLmRhdGVcIiIsIndlYnBhY2s6Ly9ibG9ja3N5LWNvbXBhbmlvbi9leHRlcm5hbCB2YXIgXCJ3aW5kb3cud3AuZWxlbWVudFwiIiwid2VicGFjazovL2Jsb2Nrc3ktY29tcGFuaW9uL2V4dGVybmFsIHZhciBcIndpbmRvdy53cC5pMThuXCIiLCJ3ZWJwYWNrOi8vYmxvY2tzeS1jb21wYW5pb24vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmxvY2tzeS1jb21wYW5pb24vd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vYmxvY2tzeS1jb21wYW5pb24vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2Jsb2Nrc3ktY29tcGFuaW9uL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmxvY2tzeS1jb21wYW5pb24vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFdvcmRQcmVzcyBkZXBlbmRlbmNpZXNcbiAqL1xuaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gJ0B3b3JkcHJlc3MvZWxlbWVudCdcbmltcG9ydCB7IF9fIH0gZnJvbSAnY3QtaTE4bidcbmltcG9ydCB7XG5cdFNlbGVjdENvbnRyb2wsXG5cdF9fZXhwZXJpbWVudGFsVW5pdENvbnRyb2wgYXMgVW5pdENvbnRyb2wsXG5cdF9fZXhwZXJpbWVudGFsVG9vbHNQYW5lbCBhcyBUb29sc1BhbmVsLFxuXHRfX2V4cGVyaW1lbnRhbFVzZUN1c3RvbVVuaXRzIGFzIHVzZUN1c3RvbVVuaXRzLFxuXHRfX2V4cGVyaW1lbnRhbFRvb2xzUGFuZWxJdGVtIGFzIFRvb2xzUGFuZWxJdGVtLFxufSBmcm9tICdAd29yZHByZXNzL2NvbXBvbmVudHMnXG5pbXBvcnQgeyB1c2VTZXR0aW5nIH0gZnJvbSAnQHdvcmRwcmVzcy9ibG9jay1lZGl0b3InXG5cbmNvbnN0IERFRkFVTFRfU0laRSA9ICdmdWxsJ1xuXG5jb25zdCBEaW1lbnNpb25Db250cm9scyA9ICh7XG5cdGNsaWVudElkLFxuXHRhdHRyaWJ1dGVzOiB7IGFzcGVjdFJhdGlvLCB3aWR0aCwgaGVpZ2h0LCBzaXplU2x1ZyB9LFxuXHRzZXRBdHRyaWJ1dGVzLFxuXHRpbWFnZVNpemVPcHRpb25zID0gW10sXG59KSA9PiB7XG5cdGNvbnN0IGRlZmF1bHRVbml0cyA9IFsncHgnLCAnJScsICd2dycsICdlbScsICdyZW0nXVxuXHRjb25zdCB1bml0cyA9IHVzZUN1c3RvbVVuaXRzKHtcblx0XHRhdmFpbGFibGVVbml0czogdXNlU2V0dGluZygnc3BhY2luZy51bml0cycpIHx8IGRlZmF1bHRVbml0cyxcblx0fSlcblx0Y29uc3Qgb25EaW1lbnNpb25DaGFuZ2UgPSAoZGltZW5zaW9uLCBuZXh0VmFsdWUpID0+IHtcblx0XHRjb25zdCBwYXJzZWRWYWx1ZSA9IHBhcnNlRmxvYXQobmV4dFZhbHVlKVxuXHRcdC8qKlxuXHRcdCAqIElmIHdlIGhhdmUgbm8gdmFsdWUgc2V0IGFuZCB3ZSBjaGFuZ2UgdGhlIHVuaXQsXG5cdFx0ICogd2UgZG9uJ3Qgd2FudCB0byBzZXQgdGhlIGF0dHJpYnV0ZSwgYXMgaXQgd291bGRcblx0XHQgKiBlbmQgdXAgaGF2aW5nIHRoZSB1bml0IGFzIHZhbHVlIHdpdGhvdXQgYW55IG51bWJlci5cblx0XHQgKi9cblx0XHRpZiAoaXNOYU4ocGFyc2VkVmFsdWUpICYmIG5leHRWYWx1ZSkgcmV0dXJuXG5cdFx0c2V0QXR0cmlidXRlcyh7XG5cdFx0XHRbZGltZW5zaW9uXTogcGFyc2VkVmFsdWUgPCAwID8gJzAnIDogbmV4dFZhbHVlLFxuXHRcdH0pXG5cdH1cblx0cmV0dXJuIChcblx0XHQ8VG9vbHNQYW5lbFxuXHRcdFx0bGFiZWw9e19fKCdJbWFnZSBTZXR0aW5ncycsICdibG9ja3N5LWNvbXBhbmlvbicpfVxuXHRcdFx0cmVzZXRBbGw9eygpID0+IHtcblx0XHRcdFx0c2V0QXR0cmlidXRlcyh7XG5cdFx0XHRcdFx0YXNwZWN0UmF0aW86ICdhdXRvJyxcblx0XHRcdFx0XHR3aWR0aDogdW5kZWZpbmVkLFxuXHRcdFx0XHRcdGhlaWdodDogdW5kZWZpbmVkLFxuXHRcdFx0XHRcdHNpemVTbHVnOiB1bmRlZmluZWQsXG5cdFx0XHRcdH0pXG5cdFx0XHR9fT5cblx0XHRcdDxUb29sc1BhbmVsSXRlbVxuXHRcdFx0XHRoYXNWYWx1ZT17KCkgPT4gISFhc3BlY3RSYXRpb31cblx0XHRcdFx0bGFiZWw9e19fKCdBc3BlY3QgUmF0aW8nLCAnYmxvY2tzeS1jb21wYW5pb24nKX1cblx0XHRcdFx0b25EZXNlbGVjdD17KCkgPT4gc2V0QXR0cmlidXRlcyh7IGFzcGVjdFJhdGlvOiB1bmRlZmluZWQgfSl9XG5cdFx0XHRcdHJlc2V0QWxsRmlsdGVyPXsoKSA9PiAoe1xuXHRcdFx0XHRcdGFzcGVjdFJhdGlvOiAnYXV0bycsXG5cdFx0XHRcdH0pfVxuXHRcdFx0XHRpc1Nob3duQnlEZWZhdWx0XG5cdFx0XHRcdGtleT17Y2xpZW50SWR9PlxuXHRcdFx0XHQ8U2VsZWN0Q29udHJvbFxuXHRcdFx0XHRcdF9fbmV4dEhhc05vTWFyZ2luQm90dG9tXG5cdFx0XHRcdFx0bGFiZWw9e19fKCdBc3BlY3QgUmF0aW8nLCAnYmxvY2tzeS1jb21wYW5pb24nKX1cblx0XHRcdFx0XHR2YWx1ZT17YXNwZWN0UmF0aW99XG5cdFx0XHRcdFx0b3B0aW9ucz17W1xuXHRcdFx0XHRcdFx0Ly8gVGhlc2Ugc2hvdWxkIHVzZSB0aGUgc2FtZSB2YWx1ZXMgYXMgQXNwZWN0UmF0aW9Ecm9wZG93biBpbiBAd29yZHByZXNzL2Jsb2NrLWVkaXRvclxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRsYWJlbDogX18oJ09yaWdpbmFsJywgJ2Jsb2Nrc3ktY29tcGFuaW9uJyksXG5cdFx0XHRcdFx0XHRcdHZhbHVlOiAnYXV0bycsXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRsYWJlbDogX18oJ1NxdWFyZScsICdibG9ja3N5LWNvbXBhbmlvbicpLFxuXHRcdFx0XHRcdFx0XHR2YWx1ZTogJzEnLFxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0bGFiZWw6IF9fKCcxNjo5JywgJ2Jsb2Nrc3ktY29tcGFuaW9uJyksXG5cdFx0XHRcdFx0XHRcdHZhbHVlOiAnMTYvOScsXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRsYWJlbDogX18oJzQ6MycsICdibG9ja3N5LWNvbXBhbmlvbicpLFxuXHRcdFx0XHRcdFx0XHR2YWx1ZTogJzQvMycsXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRsYWJlbDogX18oJzM6MicsICdibG9ja3N5LWNvbXBhbmlvbicpLFxuXHRcdFx0XHRcdFx0XHR2YWx1ZTogJzMvMicsXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRsYWJlbDogX18oJzk6MTYnLCAnYmxvY2tzeS1jb21wYW5pb24nKSxcblx0XHRcdFx0XHRcdFx0dmFsdWU6ICc5LzE2Jyxcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGxhYmVsOiBfXygnMzo0JywgJ2Jsb2Nrc3ktY29tcGFuaW9uJyksXG5cdFx0XHRcdFx0XHRcdHZhbHVlOiAnMy80Jyxcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGxhYmVsOiBfXygnMjozJywgJ2Jsb2Nrc3ktY29tcGFuaW9uJyksXG5cdFx0XHRcdFx0XHRcdHZhbHVlOiAnMi8zJyxcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XX1cblx0XHRcdFx0XHRvbkNoYW5nZT17KG5leHRBc3BlY3RSYXRpbykgPT5cblx0XHRcdFx0XHRcdHNldEF0dHJpYnV0ZXMoeyBhc3BlY3RSYXRpbzogbmV4dEFzcGVjdFJhdGlvIH0pXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQvPlxuXHRcdFx0PC9Ub29sc1BhbmVsSXRlbT5cblx0XHRcdDxUb29sc1BhbmVsSXRlbVxuXHRcdFx0XHRzdHlsZT17e1xuXHRcdFx0XHRcdCdncmlkLWNvbHVtbic6ICdzcGFuIDEgLyBhdXRvJyxcblx0XHRcdFx0fX1cblx0XHRcdFx0aGFzVmFsdWU9eygpID0+ICEhd2lkdGh9XG5cdFx0XHRcdGxhYmVsPXtfXygnV2lkdGgnLCAnYmxvY2tzeS1jb21wYW5pb24nKX1cblx0XHRcdFx0b25EZXNlbGVjdD17KCkgPT4gc2V0QXR0cmlidXRlcyh7IHdpZHRoOiB1bmRlZmluZWQgfSl9XG5cdFx0XHRcdHJlc2V0QWxsRmlsdGVyPXsoKSA9PiAoe1xuXHRcdFx0XHRcdHdpZHRoOiB1bmRlZmluZWQsXG5cdFx0XHRcdH0pfVxuXHRcdFx0XHRpc1Nob3duQnlEZWZhdWx0XG5cdFx0XHRcdGtleT17Y2xpZW50SWR9PlxuXHRcdFx0XHQ8VW5pdENvbnRyb2xcblx0XHRcdFx0XHRsYWJlbD17X18oJ1dpZHRoJywgJ2Jsb2Nrc3ktY29tcGFuaW9uJyl9XG5cdFx0XHRcdFx0bGFiZWxQb3NpdGlvbj1cInRvcFwiXG5cdFx0XHRcdFx0dmFsdWU9e3dpZHRoIHx8ICcnfVxuXHRcdFx0XHRcdG1pbj17MH1cblx0XHRcdFx0XHRvbkNoYW5nZT17KG5leHRXaWR0aCkgPT5cblx0XHRcdFx0XHRcdG9uRGltZW5zaW9uQ2hhbmdlKCd3aWR0aCcsIG5leHRXaWR0aClcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dW5pdHM9e3VuaXRzfVxuXHRcdFx0XHQvPlxuXHRcdFx0PC9Ub29sc1BhbmVsSXRlbT5cblx0XHRcdDxUb29sc1BhbmVsSXRlbVxuXHRcdFx0XHRzdHlsZT17e1xuXHRcdFx0XHRcdCdncmlkLWNvbHVtbic6ICdzcGFuIDEgLyBhdXRvJyxcblx0XHRcdFx0fX1cblx0XHRcdFx0aGFzVmFsdWU9eygpID0+ICEhaGVpZ2h0fVxuXHRcdFx0XHRsYWJlbD17X18oJ0hlaWdodCcsICdibG9ja3N5LWNvbXBhbmlvbicpfVxuXHRcdFx0XHRvbkRlc2VsZWN0PXsoKSA9PiBzZXRBdHRyaWJ1dGVzKHsgaGVpZ2h0OiB1bmRlZmluZWQgfSl9XG5cdFx0XHRcdHJlc2V0QWxsRmlsdGVyPXsoKSA9PiAoe1xuXHRcdFx0XHRcdGhlaWdodDogdW5kZWZpbmVkLFxuXHRcdFx0XHR9KX1cblx0XHRcdFx0aXNTaG93bkJ5RGVmYXVsdFxuXHRcdFx0XHRrZXk9e2NsaWVudElkfT5cblx0XHRcdFx0PFVuaXRDb250cm9sXG5cdFx0XHRcdFx0bGFiZWw9e19fKCdIZWlnaHQnLCAnYmxvY2tzeS1jb21wYW5pb24nKX1cblx0XHRcdFx0XHRsYWJlbFBvc2l0aW9uPVwidG9wXCJcblx0XHRcdFx0XHR2YWx1ZT17aGVpZ2h0IHx8ICcnfVxuXHRcdFx0XHRcdG1pbj17MH1cblx0XHRcdFx0XHRvbkNoYW5nZT17KG5leHRIZWlnaHQpID0+XG5cdFx0XHRcdFx0XHRvbkRpbWVuc2lvbkNoYW5nZSgnaGVpZ2h0JywgbmV4dEhlaWdodClcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dW5pdHM9e3VuaXRzfVxuXHRcdFx0XHQvPlxuXHRcdFx0PC9Ub29sc1BhbmVsSXRlbT5cblx0XHRcdHshIWltYWdlU2l6ZU9wdGlvbnMubGVuZ3RoICYmIChcblx0XHRcdFx0PFRvb2xzUGFuZWxJdGVtXG5cdFx0XHRcdFx0aGFzVmFsdWU9eygpID0+ICEhc2l6ZVNsdWd9XG5cdFx0XHRcdFx0bGFiZWw9e19fKCdSZXNvbHV0aW9uJywgJ2Jsb2Nrc3ktY29tcGFuaW9uJyl9XG5cdFx0XHRcdFx0b25EZXNlbGVjdD17KCkgPT4gc2V0QXR0cmlidXRlcyh7IHNpemVTbHVnOiB1bmRlZmluZWQgfSl9XG5cdFx0XHRcdFx0cmVzZXRBbGxGaWx0ZXI9eygpID0+ICh7XG5cdFx0XHRcdFx0XHRzaXplU2x1ZzogdW5kZWZpbmVkLFxuXHRcdFx0XHRcdH0pfVxuXHRcdFx0XHRcdGlzU2hvd25CeURlZmF1bHQ9e2ZhbHNlfVxuXHRcdFx0XHRcdGtleT17Y2xpZW50SWR9PlxuXHRcdFx0XHRcdDxTZWxlY3RDb250cm9sXG5cdFx0XHRcdFx0XHRfX25leHRIYXNOb01hcmdpbkJvdHRvbVxuXHRcdFx0XHRcdFx0bGFiZWw9e19fKCdSZXNvbHV0aW9uJywgJ2Jsb2Nrc3ktY29tcGFuaW9uJyl9XG5cdFx0XHRcdFx0XHR2YWx1ZT17c2l6ZVNsdWcgfHwgREVGQVVMVF9TSVpFfVxuXHRcdFx0XHRcdFx0b3B0aW9ucz17aW1hZ2VTaXplT3B0aW9uc31cblx0XHRcdFx0XHRcdG9uQ2hhbmdlPXsobmV4dFNpemVTbHVnKSA9PlxuXHRcdFx0XHRcdFx0XHRzZXRBdHRyaWJ1dGVzKHsgc2l6ZVNsdWc6IG5leHRTaXplU2x1ZyB9KVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aGVscD17X18oXG5cdFx0XHRcdFx0XHRcdCdTZWxlY3QgdGhlIHNpemUgb2YgdGhlIHNvdXJjZSBpbWFnZS4nLFxuXHRcdFx0XHRcdFx0XHQnYmxvY2tzeS1jb21wYW5pb24nXG5cdFx0XHRcdFx0XHQpfVxuXHRcdFx0XHRcdC8+XG5cdFx0XHRcdDwvVG9vbHNQYW5lbEl0ZW0+XG5cdFx0XHQpfVxuXHRcdDwvVG9vbHNQYW5lbD5cblx0KVxufVxuXG5leHBvcnQgZGVmYXVsdCBEaW1lbnNpb25Db250cm9sc1xuIiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCwgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gJ0B3b3JkcHJlc3MvZWxlbWVudCdcbmltcG9ydCB7IF9fIH0gZnJvbSAnY3QtaTE4bidcblxuaW1wb3J0IHtcblx0SW5zcGVjdG9yQ29udHJvbHMsXG5cdEJsb2NrQ29udHJvbHMsXG5cdEJsb2NrQWxpZ25tZW50Q29udHJvbCxcblx0QWxpZ25tZW50Q29udHJvbCxcbn0gZnJvbSAnQHdvcmRwcmVzcy9ibG9jay1lZGl0b3InXG5pbXBvcnQgUHJldmlldyBmcm9tICcuL1ByZXZpZXcnXG5pbXBvcnQgeyBQYW5lbEJvZHksIFRleHRhcmVhQ29udHJvbCwgRXh0ZXJuYWxMaW5rIH0gZnJvbSAnQHdvcmRwcmVzcy9jb21wb25lbnRzJ1xuaW1wb3J0IHsgT3B0aW9uc1BhbmVsIH0gZnJvbSAnYmxvY2tzeS1vcHRpb25zJ1xuaW1wb3J0IFRhZ05hbWVEcm9wZG93biBmcm9tICcuL2NvbXBvbmVudHMvVGFnTmFtZURyb3Bkb3duJ1xuaW1wb3J0IERpbWVuc2lvbkNvbnRyb2xzIGZyb20gJy4vRGltZW5zaW9ucydcblxuaW1wb3J0IHsgZ2V0T3B0aW9uc0ZvckJsb2NrIH0gZnJvbSAnYmxvY2tzeS1vcHRpb25zJ1xuXG5jb25zdCBvcHRpb25zID0gZ2V0T3B0aW9uc0ZvckJsb2NrKCdkeW5hbWljLWRhdGEnKVxuXG5mdW5jdGlvbiBjYXBpdGFsaXplRmlyc3RMZXR0ZXIoc3RyaW5nKSB7XG5cdHJldHVybiBzdHJpbmcuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHJpbmcuc2xpY2UoMSlcbn1cblxuY29uc3QgRWRpdCA9ICh7XG5cdGNsaWVudElkLFxuXG5cdGF0dHJpYnV0ZXMsXG5cdGF0dHJpYnV0ZXM6IHsgYWxpZ24sIHRhZ05hbWUsIGltYWdlQWxpZ24gfSxcblx0c2V0QXR0cmlidXRlcyxcblxuXHRjb250ZXh0LFxuXG5cdC4uLnByb3BzXG59KSA9PiB7XG5cdGNvbnN0IFtmaWVsZHNEZXNjcmlwdG9yLCBzZXRGaWVsZHNEZXNjcmlwdG9yXSA9IHVzZVN0YXRlKG51bGwpXG5cblx0Y29uc3QgeyBwb3N0SWQsIHBvc3RUeXBlIH0gPSBjb250ZXh0XG5cblx0bGV0IHZhbHVlVG9SZW5kZXIgPSAnJ1xuXG5cdGlmIChhdHRyaWJ1dGVzLmZpZWxkICYmIGZpZWxkc0Rlc2NyaXB0b3IpIHtcblx0XHRjb25zdCBhbGxGaWVsZHMgPSBmaWVsZHNEZXNjcmlwdG9yLmZpZWxkcy5yZWR1Y2UoXG5cdFx0XHQoYWNjLCBwcm92aWRlcikgPT4gWy4uLmFjYywgLi4ucHJvdmlkZXIuZmllbGRzXSxcblx0XHRcdFtdXG5cdFx0KVxuXG5cdFx0Y29uc3QgbWF5YmVGaWVsZERlc2NyaXB0b3IgPSBhbGxGaWVsZHMuZmluZChcblx0XHRcdCh7IGtleSB9KSA9PiBrZXkgPT09IGF0dHJpYnV0ZXMuZmllbGRcblx0XHQpXG5cblx0XHRpZiAobWF5YmVGaWVsZERlc2NyaXB0b3IpIHtcblx0XHRcdHZhbHVlVG9SZW5kZXIgPSBtYXliZUZpZWxkRGVzY3JpcHRvci5yZXN1bHRcblx0XHR9XG5cdH1cblxuXHR1c2VFZmZlY3QoKCkgPT4ge1xuXHRcdGZldGNoKFxuXHRcdFx0YCR7d3AuYWpheC5zZXR0aW5ncy51cmx9P2FjdGlvbj1ibG9ja3N5X2V4dF9wb3N0X3R5cGVzX2V4dHJhX3JldHJpZXZlX2R5bmFtaWNfZGF0YV9kZXNjcmlwdG9yYCxcblx0XHRcdHtcblx0XHRcdFx0aGVhZGVyczoge1xuXHRcdFx0XHRcdEFjY2VwdDogJ2FwcGxpY2F0aW9uL2pzb24nLFxuXHRcdFx0XHRcdCdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG1ldGhvZDogJ1BPU1QnLFxuXHRcdFx0XHRib2R5OiBKU09OLnN0cmluZ2lmeSh7XG5cdFx0XHRcdFx0cG9zdF9pZDogcG9zdElkLFxuXHRcdFx0XHR9KSxcblx0XHRcdH1cblx0XHQpXG5cdFx0XHQudGhlbigocmVzKSA9PiByZXMuanNvbigpKVxuXHRcdFx0LnRoZW4oKHsgc3VjY2VzcywgZGF0YSB9KSA9PiB7XG5cdFx0XHRcdGlmICghc3VjY2Vzcykge1xuXHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHR9XG5cblx0XHRcdFx0c2V0RmllbGRzRGVzY3JpcHRvcihkYXRhKVxuXHRcdFx0fSlcblx0fSwgW3Bvc3RJZF0pXG5cblx0bGV0IGFsbEZpZWxkcyA9XG5cdFx0ZmllbGRzRGVzY3JpcHRvciAmJiBmaWVsZHNEZXNjcmlwdG9yLmZpZWxkc1xuXHRcdFx0PyBmaWVsZHNEZXNjcmlwdG9yLmZpZWxkcy5yZWR1Y2UoXG5cdFx0XHRcdFx0KHJlc3VsdCwgcHJvdmlkZXIpID0+IFsuLi5yZXN1bHQsIC4uLnByb3ZpZGVyLmZpZWxkc10sXG5cblx0XHRcdFx0XHRbXVxuXHRcdFx0ICApXG5cdFx0XHQ6IFtdXG5cblx0Y29uc3QgdGF4b25vbXlDaG9pc2VzID0gT2JqZWN0LnZhbHVlcyhvcHRpb25zKS5maW5kKFxuXHRcdCh7IGNvbmRpdGlvbiB9KSA9PiBjb25kaXRpb24/LmZpZWxkID09PSAnd3A6dGVybXMnXG5cdCk/Lm9wdGlvbnM/LnRheG9ub215Py5jaG9pY2VzXG5cblx0aWYgKEFycmF5LmlzQXJyYXkodGF4b25vbXlDaG9pc2VzKSAmJiAhdGF4b25vbXlDaG9pc2VzLmxlbmd0aCkge1xuXHRcdGFsbEZpZWxkcyA9IGFsbEZpZWxkcy5maWx0ZXIoKHsga2V5IH0pID0+IGtleSAhPT0gJ3dwOnRlcm1zJylcblx0fVxuXG5cdHJldHVybiAoXG5cdFx0PD5cblx0XHRcdDxCbG9ja0NvbnRyb2xzIGdyb3VwPVwiYmxvY2tcIj5cblx0XHRcdFx0e3ZhbHVlVG9SZW5kZXIudHlwZSAhPT0gJ2ltYWdlJyA/IChcblx0XHRcdFx0XHQ8PlxuXHRcdFx0XHRcdFx0PEFsaWdubWVudENvbnRyb2xcblx0XHRcdFx0XHRcdFx0dmFsdWU9e2FsaWdufVxuXHRcdFx0XHRcdFx0XHRvbkNoYW5nZT17KG5ld0FsaWduKSA9PlxuXHRcdFx0XHRcdFx0XHRcdHNldEF0dHJpYnV0ZXMoe1xuXHRcdFx0XHRcdFx0XHRcdFx0YWxpZ246IG5ld0FsaWduLFxuXHRcdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdC8+XG5cdFx0XHRcdFx0XHQ8VGFnTmFtZURyb3Bkb3duXG5cdFx0XHRcdFx0XHRcdHRhZ05hbWU9e3RhZ05hbWV9XG5cdFx0XHRcdFx0XHRcdG9uQ2hhbmdlPXsodGFnTmFtZSkgPT4gc2V0QXR0cmlidXRlcyh7IHRhZ05hbWUgfSl9XG5cdFx0XHRcdFx0XHQvPlxuXHRcdFx0XHRcdDwvPlxuXHRcdFx0XHQpIDogKFxuXHRcdFx0XHRcdDxCbG9ja0FsaWdubWVudENvbnRyb2xcblx0XHRcdFx0XHRcdHZhbHVlPXtpbWFnZUFsaWdufVxuXHRcdFx0XHRcdFx0b25DaGFuZ2U9eyhuZXdJbWFnZUFsaWduKSA9PlxuXHRcdFx0XHRcdFx0XHRzZXRBdHRyaWJ1dGVzKHtcblx0XHRcdFx0XHRcdFx0XHRpbWFnZUFsaWduOiBuZXdJbWFnZUFsaWduLFxuXHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC8+XG5cdFx0XHRcdCl9XG5cdFx0XHQ8L0Jsb2NrQ29udHJvbHM+XG5cblx0XHRcdDxQcmV2aWV3XG5cdFx0XHRcdHsuLi5hdHRyaWJ1dGVzfVxuXHRcdFx0XHR0YXhvbm9teT17XG5cdFx0XHRcdFx0YXR0cmlidXRlcy50YXhvbm9teSB8fFxuXHRcdFx0XHRcdHRheG9ub215Q2hvaXNlcz8uWzBdPy5rZXkgfHxcblx0XHRcdFx0XHQnY2F0ZWdvcnknXG5cdFx0XHRcdH1cblx0XHRcdFx0cG9zdElkPXtwb3N0SWR9XG5cdFx0XHRcdHBvc3RUeXBlPXtwb3N0VHlwZX1cblx0XHRcdFx0ZmllbGRzRGVzY3JpcHRvcj17ZmllbGRzRGVzY3JpcHRvcn1cblx0XHRcdC8+XG5cblx0XHRcdDxJbnNwZWN0b3JDb250cm9scz5cblx0XHRcdFx0PFBhbmVsQm9keT5cblx0XHRcdFx0XHQ8T3B0aW9uc1BhbmVsXG5cdFx0XHRcdFx0XHRwdXJwb3NlPVwiZ3V0ZW5iZXJnXCJcblx0XHRcdFx0XHRcdG9uQ2hhbmdlPXsob3B0aW9uSWQsIG9wdGlvblZhbHVlKSA9PiB7XG5cdFx0XHRcdFx0XHRcdHNldEF0dHJpYnV0ZXMoe1xuXHRcdFx0XHRcdFx0XHRcdFtvcHRpb25JZF06IG9wdGlvblZhbHVlLFxuXHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0fX1cblx0XHRcdFx0XHRcdG9wdGlvbnM9e3tcblx0XHRcdFx0XHRcdFx0ZmllbGQ6IHtcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiAnY3Qtc2VsZWN0Jyxcblx0XHRcdFx0XHRcdFx0XHRsYWJlbDogX18oXG5cdFx0XHRcdFx0XHRcdFx0XHQnQ29udGVudCBTb3VyY2UnLFxuXHRcdFx0XHRcdFx0XHRcdFx0J2Jsb2Nrc3ktY29tcGFuaW9uJ1xuXHRcdFx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRcdFx0dmFsdWU6ICcnLFxuXHRcdFx0XHRcdFx0XHRcdGRlZmF1bHRUb0ZpcnN0SXRlbTogZmFsc2UsXG5cdFx0XHRcdFx0XHRcdFx0Y2hvaWNlczogYWxsRmllbGRzLFxuXHRcdFx0XHRcdFx0XHRcdHB1cnBvc2U6ICdkZWZhdWx0Jyxcblx0XHRcdFx0XHRcdFx0fSxcblxuXHRcdFx0XHRcdFx0XHQuLi4odmFsdWVUb1JlbmRlci50eXBlID09PSAnaW1hZ2UnID8ge30gOiBvcHRpb25zKSxcblx0XHRcdFx0XHRcdH19XG5cdFx0XHRcdFx0XHR2YWx1ZT17YXR0cmlidXRlc31cblx0XHRcdFx0XHRcdGhhc1JldmVydEJ1dHRvbj17ZmFsc2V9XG5cdFx0XHRcdFx0Lz5cblx0XHRcdFx0PC9QYW5lbEJvZHk+XG5cblx0XHRcdFx0e3ZhbHVlVG9SZW5kZXIudHlwZSA9PT0gJ2ltYWdlJyAmJiAoXG5cdFx0XHRcdFx0PD5cblx0XHRcdFx0XHRcdDxEaW1lbnNpb25Db250cm9sc1xuXHRcdFx0XHRcdFx0XHRjbGllbnRJZD17Y2xpZW50SWR9XG5cdFx0XHRcdFx0XHRcdGF0dHJpYnV0ZXM9e2F0dHJpYnV0ZXN9XG5cdFx0XHRcdFx0XHRcdHNldEF0dHJpYnV0ZXM9e3NldEF0dHJpYnV0ZXN9XG5cdFx0XHRcdFx0XHRcdGltYWdlU2l6ZU9wdGlvbnM9e1xuXHRcdFx0XHRcdFx0XHRcdGZpZWxkc0Rlc2NyaXB0b3Jcblx0XHRcdFx0XHRcdFx0XHRcdD8gT2JqZWN0LmtleXMoZmllbGRzRGVzY3JpcHRvci5pbWFnZV9zaXplcylcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQuZmlsdGVyKChzaXplKSA9PiAhcGFyc2VGbG9hdChzaXplKSlcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQubWFwKChzaXplKSA9PiAoe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dmFsdWU6IHNpemUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsYWJlbDogY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzaXplXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC5zcGxpdCgnXycpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC5qb2luKCcgJyksXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSkpXG5cdFx0XHRcdFx0XHRcdFx0XHQ6IFtdXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdC8+XG5cdFx0XHRcdFx0XHQ8UGFuZWxCb2R5PlxuXHRcdFx0XHRcdFx0XHQ8VGV4dGFyZWFDb250cm9sXG5cdFx0XHRcdFx0XHRcdFx0bGFiZWw9e19fKFxuXHRcdFx0XHRcdFx0XHRcdFx0J0FsdGVybmF0aXZlIFRleHQnLFxuXHRcdFx0XHRcdFx0XHRcdFx0J2Jsb2Nrc3ktY29tcGFuaW9uJ1xuXHRcdFx0XHRcdFx0XHRcdCl9XG5cdFx0XHRcdFx0XHRcdFx0dmFsdWU9e2F0dHJpYnV0ZXMuYWx0X3RleHQgfHwgJyd9XG5cdFx0XHRcdFx0XHRcdFx0b25DaGFuZ2U9eyh2YWx1ZSkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0c2V0QXR0cmlidXRlcyh7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFsdF90ZXh0OiB2YWx1ZSxcblx0XHRcdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRcdFx0fX1cblx0XHRcdFx0XHRcdFx0XHRoZWxwPXtcblx0XHRcdFx0XHRcdFx0XHRcdDw+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDxFeHRlcm5hbExpbmsgaHJlZj1cImh0dHBzOi8vd3d3LnczLm9yZy9XQUkvdHV0b3JpYWxzL2ltYWdlcy9kZWNpc2lvbi10cmVlXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0e19fKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0J0Rlc2NyaWJlIHRoZSBwdXJwb3NlIG9mIHRoZSBpbWFnZS4nXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0KX1cblx0XHRcdFx0XHRcdFx0XHRcdFx0PC9FeHRlcm5hbExpbms+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDxiciAvPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHR7X18oJ0xlYXZlIGVtcHR5IGlmIGRlY29yYXRpdmUuJyl9XG5cdFx0XHRcdFx0XHRcdFx0XHQ8Lz5cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0X19uZXh0SGFzTm9NYXJnaW5Cb3R0b21cblx0XHRcdFx0XHRcdFx0Lz5cblx0XHRcdFx0XHRcdDwvUGFuZWxCb2R5PlxuXHRcdFx0XHRcdDwvPlxuXHRcdFx0XHQpfVxuXHRcdFx0PC9JbnNwZWN0b3JDb250cm9scz5cblx0XHQ8Lz5cblx0KVxufVxuXG5leHBvcnQgZGVmYXVsdCBFZGl0XG4iLCJpbXBvcnQge1xuXHRjcmVhdGVFbGVtZW50LFxuXHR1c2VDYWxsYmFjayxcblx0dXNlU3RhdGUsXG5cdHVzZUVmZmVjdCxcbn0gZnJvbSAnQHdvcmRwcmVzcy9lbGVtZW50J1xuXG5pbXBvcnQgeyBfXyB9IGZyb20gJ2N0LWkxOG4nXG5pbXBvcnQgeyB1c2VCbG9ja1Byb3BzIH0gZnJvbSAnQHdvcmRwcmVzcy9ibG9jay1lZGl0b3InXG5pbXBvcnQgY2xhc3NuYW1lcyBmcm9tICdjbGFzc25hbWVzJ1xuaW1wb3J0IFRpdGxlUHJldmlldyBmcm9tICcuL3ByZXZpZXctcGFydHMvVGl0bGVQcmV2aWV3J1xuaW1wb3J0IEV4Y2VycHRQcmV2aWV3IGZyb20gJy4vcHJldmlldy1wYXJ0cy9FeGNlcnB0UHJldmlldydcbmltcG9ydCBEYXRlUHJldmlldyBmcm9tICcuL3ByZXZpZXctcGFydHMvRGF0ZVByZXZpZXcnXG5pbXBvcnQgQ29tbWVudHNQcmV2aWV3IGZyb20gJy4vcHJldmlldy1wYXJ0cy9Db21tZW50c1ByZXZpZXcnXG5pbXBvcnQgVGF4b25vbXlQcmV2aWV3IGZyb20gJy4vcHJldmlldy1wYXJ0cy9UYXhvbm9teVByZXZpZXcnXG5pbXBvcnQgQXV0aG9yUHJldmlldyBmcm9tICcuL3ByZXZpZXctcGFydHMvQXV0aG9yUHJldmlldydcbmltcG9ydCBJbWFnZVByZXZpZXcgZnJvbSAnLi9wcmV2aWV3LXBhcnRzL0ltYWdlUHJldmlldydcblxuY29uc3QgUHJldmlldyA9ICh7XG5cdGZpZWxkc0Rlc2NyaXB0b3IsXG5cblx0cG9zdElkLFxuXHRwb3N0VHlwZSxcblxuXHR0YWdOYW1lOiBUYWdOYW1lLFxuXHRhbGlnbixcblx0aW1hZ2VBbGlnbixcblx0ZmllbGQsXG5cblx0YXNwZWN0UmF0aW8sXG5cdHdpZHRoLFxuXHRoZWlnaHQsXG5cblx0YmVmb3JlLFxuXHRhZnRlcixcblx0ZmFsbGJhY2ssXG5cblx0Ly8gd3A6dGl0bGVcblx0aGFzX3RpdGxlX2xpbmssXG5cblx0ZXhjZXJwdF9sZW5ndGgsXG5cblx0ZGVmYXVsdF9mb3JtYXQsXG5cdGRhdGVfdHlwZSxcblx0ZGF0ZV9mb3JtYXQsXG5cdGN1c3RvbV9kYXRlX2Zvcm1hdCxcblxuXHQvLyB3cDpjb21tZW50c1xuXHRoYXNfY29tbWVudHNfbGluayxcblx0emVyb190ZXh0LFxuXHRzaW5nbGVfdGV4dCxcblx0bXVsdGlwbGVfdGV4dCxcblxuXHQvLyB3cDp0ZXJtc1xuXHRoYXNfdGVybXNfbGluayxcblx0dGF4b25vbXksXG5cdHNlcGFyYXRvcixcblxuXHQvLyB3cDphdXRob3Jcblx0YXV0aG9yX2ZpZWxkLFxuXHRoYXNfYXV0aG9yX2xpbmssXG5cblx0Li4ucmVzdFxufSkgPT4ge1xuXHRsZXQgdmFsdWVUb1JlbmRlciA9ICcnXG5cblx0Y29uc3QgW2NvbW1lbnRzLCBzZXRDb21tZW50c10gPSB1c2VTdGF0ZShbXSlcblxuXHRjb25zdCBmZXRjaEF0dHJpYnV0ZXMgPSB1c2VDYWxsYmFjayhhc3luYyAoKSA9PiB7XG5cdFx0ZmV0Y2goXG5cdFx0XHRgJHtcblx0XHRcdFx0KHdpbmRvdy5jdF9sb2NhbGl6YXRpb25zIHx8IHdpbmRvdy5jdF9jdXN0b21pemVyX2xvY2FsaXphdGlvbnMpXG5cdFx0XHRcdFx0LnJlc3RfdXJsXG5cdFx0XHR9d3AvdjIvY29tbWVudHMvP3Bvc3Q9JHtwb3N0SWR9YFxuXHRcdClcblx0XHRcdC50aGVuKChyZXMpID0+IHJlcy5qc29uKCkpXG5cdFx0XHQudGhlbigoZGF0YSkgPT4ge1xuXHRcdFx0XHRzZXRDb21tZW50cyhkYXRhKVxuXHRcdFx0fSlcblx0fSwgW3Bvc3RJZF0pXG5cblx0dXNlRWZmZWN0KCgpID0+IHtcblx0XHRmZXRjaEF0dHJpYnV0ZXMoKVxuXHR9LCBbZmV0Y2hBdHRyaWJ1dGVzXSlcblxuXHRpZiAoZmllbGQgJiYgZmllbGRzRGVzY3JpcHRvcikge1xuXHRcdGNvbnN0IGFsbEZpZWxkcyA9IGZpZWxkc0Rlc2NyaXB0b3IuZmllbGRzLnJlZHVjZShcblx0XHRcdChhY2MsIHByb3ZpZGVyKSA9PiBbLi4uYWNjLCAuLi5wcm92aWRlci5maWVsZHNdLFxuXHRcdFx0W11cblx0XHQpXG5cblx0XHRjb25zdCBtYXliZUZpZWxkRGVzY3JpcHRvciA9IGFsbEZpZWxkcy5maW5kKCh7IGtleSB9KSA9PiBrZXkgPT09IGZpZWxkKVxuXG5cdFx0aWYgKG1heWJlRmllbGREZXNjcmlwdG9yKSB7XG5cdFx0XHR2YWx1ZVRvUmVuZGVyID0gbWF5YmVGaWVsZERlc2NyaXB0b3IucmVzdWx0XG5cdFx0fVxuXHR9XG5cblx0Y29uc3QgYmxvY2tQcm9wcyA9IHVzZUJsb2NrUHJvcHMoe1xuXHRcdGNsYXNzTmFtZTogY2xhc3NuYW1lcygnY3QtZHluYW1pYy1kYXRhJywge1xuXHRcdFx0J3dwLWJsb2NrLWltYWdlJzogdmFsdWVUb1JlbmRlci50eXBlID09PSAnaW1hZ2UnLFxuXHRcdFx0W2BoYXMtdGV4dC1hbGlnbi0ke2FsaWdufWBdOlxuXHRcdFx0XHR2YWx1ZVRvUmVuZGVyLnR5cGUgIT09ICdpbWFnZScgJiYgYWxpZ24sXG5cdFx0XHRbYGFsaWduJHtpbWFnZUFsaWdufWBdOlxuXHRcdFx0XHR2YWx1ZVRvUmVuZGVyLnR5cGUgPT09ICdpbWFnZScgJiYgaW1hZ2VBbGlnbixcblx0XHR9KSxcblxuXHRcdHN0eWxlOiB7XG5cdFx0XHQuLi4odmFsdWVUb1JlbmRlci50eXBlID09PSAnaW1hZ2UnXG5cdFx0XHRcdD8ge1xuXHRcdFx0XHRcdFx0YXNwZWN0UmF0aW8sXG5cdFx0XHRcdFx0XHR3aWR0aCxcblx0XHRcdFx0XHRcdGhlaWdodCxcblx0XHRcdFx0ICB9XG5cdFx0XHRcdDoge30pLFxuXHRcdH0sXG5cdH0pXG5cblx0bGV0IGlzRmFsbGJhY2sgPSBmYWxzZVxuXG5cdGlmICh2YWx1ZVRvUmVuZGVyLnR5cGUgPT09ICdpbWFnZScpIHtcblx0XHR2YWx1ZVRvUmVuZGVyID0gKFxuXHRcdFx0PEltYWdlUHJldmlld1xuXHRcdFx0XHR2YWx1ZT17dmFsdWVUb1JlbmRlcj8udmFsdWUgfHwgdmFsdWVUb1JlbmRlcn1cblx0XHRcdFx0YmxvY2tQcm9wcz17YmxvY2tQcm9wc31cblx0XHRcdFx0YXNwZWN0UmF0aW89e2FzcGVjdFJhdGlvfVxuXHRcdFx0XHRoZWlnaHQ9e2hlaWdodH1cblx0XHRcdC8+XG5cdFx0KVxuXHR9XG5cblx0aWYgKCF2YWx1ZVRvUmVuZGVyICYmICFpc0ZhbGxiYWNrKSB7XG5cdFx0aXNGYWxsYmFjayA9IHRydWVcblx0XHR2YWx1ZVRvUmVuZGVyID0gZmFsbGJhY2sgfHwgJydcblx0fVxuXG5cdGlmICghaXNGYWxsYmFjayAmJiB2YWx1ZVRvUmVuZGVyICYmIHR5cGVvZiB2YWx1ZVRvUmVuZGVyID09PSAnc3RyaW5nJykge1xuXHRcdHZhbHVlVG9SZW5kZXIgPSBiZWZvcmUgKyB2YWx1ZVRvUmVuZGVyICsgYWZ0ZXJcblx0fVxuXG5cdGlmIChmaWVsZC5pbmNsdWRlcygnd3A6JykpIHtcblx0XHRsZXQgQ29tcG9uZW50ID0gbnVsbFxuXG5cdFx0aWYgKGZpZWxkID09PSAnd3A6dGl0bGUnKSB7XG5cdFx0XHRDb21wb25lbnQgPSBUaXRsZVByZXZpZXcoeyBoYXNfdGl0bGVfbGluayB9KVxuXHRcdH1cblxuXHRcdGlmIChmaWVsZCA9PT0gJ3dwOmV4Y2VycHQnKSB7XG5cdFx0XHRDb21wb25lbnQgPSBFeGNlcnB0UHJldmlldyh7IGV4Y2VycHRfbGVuZ3RoIH0pXG5cdFx0fVxuXG5cdFx0aWYgKGZpZWxkID09PSAnd3A6ZGF0ZScpIHtcblx0XHRcdENvbXBvbmVudCA9IERhdGVQcmV2aWV3KHtcblx0XHRcdFx0cG9zdElkLFxuXHRcdFx0XHRkZWZhdWx0X2Zvcm1hdCxcblx0XHRcdFx0ZGF0ZV90eXBlLFxuXHRcdFx0XHRkYXRlX2Zvcm1hdCxcblx0XHRcdFx0Y3VzdG9tX2RhdGVfZm9ybWF0LFxuXHRcdFx0fSlcblx0XHR9XG5cblx0XHRpZiAoZmllbGQgPT09ICd3cDpjb21tZW50cycpIHtcblx0XHRcdENvbXBvbmVudCA9IENvbW1lbnRzUHJldmlldyh7XG5cdFx0XHRcdGhhc19jb21tZW50c19saW5rLFxuXHRcdFx0XHR6ZXJvX3RleHQsXG5cdFx0XHRcdHNpbmdsZV90ZXh0LFxuXHRcdFx0XHRtdWx0aXBsZV90ZXh0LFxuXHRcdFx0XHRjb21tZW50cyxcblx0XHRcdH0pXG5cdFx0fVxuXG5cdFx0aWYgKGZpZWxkID09PSAnd3A6dGVybXMnKSB7XG5cdFx0XHRDb21wb25lbnQgPSBUYXhvbm9teVByZXZpZXcoe1xuXHRcdFx0XHRwb3N0SWQsXG5cdFx0XHRcdGhhc190ZXJtc19saW5rLFxuXHRcdFx0XHR0YXhvbm9teSxcblx0XHRcdFx0c2VwYXJhdG9yLFxuXHRcdFx0fSlcblx0XHR9XG5cblx0XHRpZiAoZmllbGQgPT09ICd3cDphdXRob3InKSB7XG5cdFx0XHRDb21wb25lbnQgPSBBdXRob3JQcmV2aWV3KHtcblx0XHRcdFx0cG9zdElkLFxuXHRcdFx0XHRoYXNfYXV0aG9yX2xpbmssXG5cdFx0XHRcdGF1dGhvcl9maWVsZCxcblx0XHRcdH0pXG5cdFx0fVxuXG5cdFx0aWYgKGZpZWxkID09PSAnd3A6YXV0aG9yJykge1xuXHRcdFx0Q29tcG9uZW50ID0gQXV0aG9yUHJldmlldyh7XG5cdFx0XHRcdHBvc3RJZCxcblx0XHRcdFx0aGFzX2F1dGhvcl9saW5rLFxuXHRcdFx0XHRhdXRob3JfZmllbGQsXG5cdFx0XHR9KVxuXHRcdH1cblxuXHRcdGlmIChDb21wb25lbnQpIHtcblx0XHRcdHZhbHVlVG9SZW5kZXIgPSAoXG5cdFx0XHRcdDxUYWdOYW1lIHsuLi5ibG9ja1Byb3BzfT5cblx0XHRcdFx0XHR7YmVmb3JlfVxuXHRcdFx0XHRcdHtDb21wb25lbnR9XG5cdFx0XHRcdFx0e2FmdGVyfVxuXHRcdFx0XHQ8L1RhZ05hbWU+XG5cdFx0XHQpXG5cdFx0fVxuXHR9XG5cblx0aWYgKHR5cGVvZiB2YWx1ZVRvUmVuZGVyICE9PSAnc3RyaW5nJykge1xuXHRcdHJldHVybiB2YWx1ZVRvUmVuZGVyXG5cdH1cblxuXHRyZXR1cm4gPFRhZ05hbWUgey4uLmJsb2NrUHJvcHN9Pnt2YWx1ZVRvUmVuZGVyfTwvVGFnTmFtZT5cbn1cblxuZXhwb3J0IGRlZmF1bHQgUHJldmlld1xuIiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gJ0B3b3JkcHJlc3MvZWxlbWVudCdcbmltcG9ydCB7IFRvb2xiYXJEcm9wZG93bk1lbnUgfSBmcm9tICdAd29yZHByZXNzL2NvbXBvbmVudHMnXG5pbXBvcnQgeyBfXywgc3ByaW50ZiB9IGZyb20gJ2N0LWkxOG4nXG5cbmltcG9ydCBUYWdOYW1lSWNvbiBmcm9tICcuL1RhZ05hbWVJY29uJ1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBIZWFkaW5nTGV2ZWxEcm9wZG93bih7IHRhZ05hbWUsIG9uQ2hhbmdlIH0pIHtcblx0cmV0dXJuIChcblx0XHQ8VG9vbGJhckRyb3Bkb3duTWVudVxuXHRcdFx0cG9wb3ZlclByb3BzPXt7XG5cdFx0XHRcdGNsYXNzTmFtZTogJ2Jsb2NrLWxpYnJhcnktaGVhZGluZy1sZXZlbC1kcm9wZG93bicsXG5cdFx0XHR9fVxuXHRcdFx0aWNvbj17PFRhZ05hbWVJY29uIGxldmVsPXt0YWdOYW1lfSAvPn1cblx0XHRcdGxhYmVsPXtfXygnQ2hhbmdlIGhlYWRpbmcgbGV2ZWwnKX1cblx0XHRcdGNvbnRyb2xzPXtbXG5cdFx0XHRcdCdoMScsXG5cdFx0XHRcdCdoMicsXG5cdFx0XHRcdCdoMycsXG5cdFx0XHRcdCdoNCcsXG5cdFx0XHRcdCdoNScsXG5cdFx0XHRcdCdoNicsXG5cdFx0XHRcdCdwJyxcblx0XHRcdFx0J3NwYW4nLFxuXHRcdFx0XHQnZGl2Jyxcblx0XHRcdF0ubWFwKCh0YXJnZXRUYWdOYW1lKSA9PiB7XG5cdFx0XHRcdHtcblx0XHRcdFx0XHRjb25zdCBpc0FjdGl2ZSA9IHRhcmdldFRhZ05hbWUgPT09IHRhZ05hbWVcblxuXHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHRpY29uOiAoXG5cdFx0XHRcdFx0XHRcdDxUYWdOYW1lSWNvblxuXHRcdFx0XHRcdFx0XHRcdGxldmVsPXt0YXJnZXRUYWdOYW1lfVxuXHRcdFx0XHRcdFx0XHRcdGlzUHJlc3NlZD17aXNBY3RpdmV9XG5cdFx0XHRcdFx0XHRcdC8+XG5cdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0bGFiZWw6IHRhcmdldFRhZ05hbWUsXG5cdFx0XHRcdFx0XHR0aXRsZToge1xuXHRcdFx0XHRcdFx0XHRoMTogX18oJ0hlYWRpbmcgMScsICdibG9ja3N5LWNvbXBhbmlvbicpLFxuXHRcdFx0XHRcdFx0XHRoMjogX18oJ0hlYWRpbmcgMicsICdibG9ja3N5LWNvbXBhbmlvbicpLFxuXHRcdFx0XHRcdFx0XHRoMzogX18oJ0hlYWRpbmcgMycsICdibG9ja3N5LWNvbXBhbmlvbicpLFxuXHRcdFx0XHRcdFx0XHRoNDogX18oJ0hlYWRpbmcgNCcsICdibG9ja3N5LWNvbXBhbmlvbicpLFxuXHRcdFx0XHRcdFx0XHRoNTogX18oJ0hlYWRpbmcgNScsICdibG9ja3N5LWNvbXBhbmlvbicpLFxuXHRcdFx0XHRcdFx0XHRoNjogX18oJ0hlYWRpbmcgNicsICdibG9ja3N5LWNvbXBhbmlvbicpLFxuXHRcdFx0XHRcdFx0XHRwOiBfXygnUGFyYWdyYXBoJywgJ2Jsb2Nrc3ktY29tcGFuaW9uJyksXG5cdFx0XHRcdFx0XHRcdHNwYW46IF9fKCdTcGFuJywgJ2Jsb2Nrc3ktY29tcGFuaW9uJyksXG5cdFx0XHRcdFx0XHRcdGRpdjogX18oJ0RpdicsICdibG9ja3N5LWNvbXBhbmlvbicpLFxuXHRcdFx0XHRcdFx0fVt0YXJnZXRUYWdOYW1lXSxcblx0XHRcdFx0XHRcdGlzQWN0aXZlLFxuXHRcdFx0XHRcdFx0b25DbGljaygpIHtcblx0XHRcdFx0XHRcdFx0b25DaGFuZ2UodGFyZ2V0VGFnTmFtZSlcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRyb2xlOiAnbWVudWl0ZW1yYWRpbycsXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KX1cblx0XHQvPlxuXHQpXG59XG4iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50LCB1c2VSZWYgfSBmcm9tICdAd29yZHByZXNzL2VsZW1lbnQnXG4vKipcbiAqIFdvcmRQcmVzcyBkZXBlbmRlbmNpZXNcbiAqL1xuaW1wb3J0IHsgUGF0aCwgU1ZHIH0gZnJvbSAnQHdvcmRwcmVzcy9jb21wb25lbnRzJ1xuXG4vKiogQHR5cGVkZWYge2ltcG9ydCgnQHdvcmRwcmVzcy9lbGVtZW50JykuV1BDb21wb25lbnR9IFdQQ29tcG9uZW50ICovXG5cbi8qKlxuICogSGVhZGluZ0xldmVsSWNvbiBwcm9wcy5cbiAqXG4gKiBAdHlwZWRlZiBXUEhlYWRpbmdMZXZlbEljb25Qcm9wc1xuICpcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSAgIGxldmVsICAgICBUaGUgaGVhZGluZyBsZXZlbCB0byBzaG93IGFuIGljb24gZm9yLlxuICogQHByb3BlcnR5IHs/Ym9vbGVhbn0gaXNQcmVzc2VkIFdoZXRoZXIgb3Igbm90IHRoZSBpY29uIHNob3VsZCBhcHBlYXIgcHJlc3NlZDsgZGVmYXVsdDogZmFsc2UuXG4gKi9cblxuLyoqXG4gKiBIZWFkaW5nIGxldmVsIGljb24uXG4gKlxuICogQHBhcmFtIHtXUEhlYWRpbmdMZXZlbEljb25Qcm9wc30gcHJvcHMgQ29tcG9uZW50IHByb3BzLlxuICpcbiAqIEByZXR1cm4gez9XUENvbXBvbmVudH0gVGhlIGljb24uXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFRhZ05hbWVJY29uKHsgbGV2ZWwsIGlzUHJlc3NlZCA9IGZhbHNlIH0pIHtcblx0Y29uc3QgbGV2ZWxUb1BhdGggPSB7XG5cdFx0aDE6ICdNOSA1aDJ2MTBIOXYtNEg1djRIM1Y1aDJ2NGg0VjV6bTYuNiAwYy0uNi45LTEuNSAxLjctMi42IDJ2MWgydjdoMlY1aC0xLjR6Jyxcblx0XHRoMjogJ003IDVoMnYxMEg3di00SDN2NEgxVjVoMnY0aDRWNXptOCA4Yy41LS40LjYtLjYgMS4xLTEuMS40LS40LjgtLjggMS4yLTEuMy4zLS40LjYtLjguOS0xLjMuMi0uNC4zLS44LjMtMS4zIDAtLjQtLjEtLjktLjMtMS4zLS4yLS40LS40LS43LS44LTEtLjMtLjMtLjctLjUtMS4yLS42LS41LS4yLTEtLjItMS41LS4yLS40IDAtLjcgMC0xLjEuMS0uMy4xLS43LjItMSAuMy0uMy4xLS42LjMtLjkuNS0uMy4yLS42LjQtLjguN2wxLjIgMS4yYy4zLS4zLjYtLjUgMS0uNy40LS4yLjctLjMgMS4yLS4zcy45LjEgMS4zLjRjLjMuMy41LjcuNSAxLjEgMCAuNC0uMS44LS40IDEuMS0uMy41LS42LjktMSAxLjItLjQuNC0xIC45LTEuNiAxLjQtLjYuNS0xLjQgMS4xLTIuMiAxLjZWMTVoOHYtMkgxNXonLFxuXHRcdGgzOiAnTTEyLjEgMTIuMmMuNC4zLjguNSAxLjIuNy40LjIuOS4zIDEuNC4zLjUgMCAxLS4xIDEuNC0uMy4zLS4xLjUtLjUuNS0uOCAwLS4yIDAtLjQtLjEtLjYtLjEtLjItLjMtLjMtLjUtLjQtLjMtLjEtLjctLjItMS0uMy0uNS0uMS0xLS4xLTEuNS0uMVY5LjFjLjcuMSAxLjUtLjEgMi4yLS40LjQtLjIuNi0uNS42LS45IDAtLjMtLjEtLjYtLjQtLjgtLjMtLjItLjctLjMtMS4xLS4zLS40IDAtLjguMS0xLjEuMy0uNC4yLS43LjQtMS4xLjZsLTEuMi0xLjRjLjUtLjQgMS4xLS43IDEuNi0uOS41LS4yIDEuMi0uMyAxLjgtLjMuNSAwIDEgLjEgMS42LjIuNC4xLjguMyAxLjIuNS4zLjIuNi41LjguOC4yLjMuMy43LjMgMS4xIDAgLjUtLjIuOS0uNSAxLjMtLjQuNC0uOS43LTEuNS45di4xYy42LjEgMS4yLjQgMS42LjguNC40LjcuOS43IDEuNSAwIC40LS4xLjgtLjMgMS4yLS4yLjQtLjUuNy0uOS45LS40LjMtLjkuNC0xLjMuNS0uNS4xLTEgLjItMS42LjItLjggMC0xLjYtLjEtMi4zLS40LS42LS4yLTEuMS0uNi0xLjYtMWwxLjEtMS40ek03IDlIM1Y1SDF2MTBoMnYtNGg0djRoMlY1SDd2NHonLFxuXHRcdGg0OiAnTTkgMTVIN3YtNEgzdjRIMVY1aDJ2NGg0VjVoMnYxMHptMTAtMmgtMXYyaC0ydi0yaC01di0ybDQtNmgzdjZoMXYyem0tMy0yVjdsLTIuOCA0SDE2eicsXG5cdFx0aDU6ICdNMTIuMSAxMi4yYy40LjMuNy41IDEuMS43LjQuMi45LjMgMS4zLjMuNSAwIDEtLjEgMS40LS40LjQtLjMuNi0uNy42LTEuMSAwLS40LS4yLS45LS42LTEuMS0uNC0uMy0uOS0uNC0xLjQtLjRIMTRjLS4xIDAtLjMgMC0uNC4xbC0uNC4xLS41LjItMS0uNi4zLTVoNi40djEuOWgtNC4zTDE0IDguOGMuMi0uMS41LS4xLjctLjIuMiAwIC41LS4xLjctLjEuNSAwIC45LjEgMS40LjIuNC4xLjguMyAxLjEuNi4zLjIuNi42LjguOS4yLjQuMy45LjMgMS40IDAgLjUtLjEgMS0uMyAxLjQtLjIuNC0uNS44LS45IDEuMS0uNC4zLS44LjUtMS4zLjctLjUuMi0xIC4zLTEuNS4zLS44IDAtMS42LS4xLTIuMy0uNC0uNi0uMi0xLjEtLjYtMS42LTEtLjEtLjEgMS0xLjUgMS0xLjV6TTkgMTVIN3YtNEgzdjRIMVY1aDJ2NGg0VjVoMnYxMHonLFxuXHRcdGg2OiAnTTkgMTVIN3YtNEgzdjRIMVY1aDJ2NGg0VjVoMnYxMHptOC42LTcuNWMtLjItLjItLjUtLjQtLjgtLjUtLjYtLjItMS4zLS4yLTEuOSAwLS4zLjEtLjYuMy0uOC41bC0uNi45Yy0uMi41LS4yLjktLjIgMS40LjQtLjMuOC0uNiAxLjItLjguNC0uMi44LS4zIDEuMy0uMy40IDAgLjggMCAxLjIuMi40LjEuNy4zIDEgLjYuMy4zLjUuNi43LjkuMi40LjMuOC4zIDEuM3MtLjEuOS0uMyAxLjRjLS4yLjQtLjUuNy0uOCAxLS40LjMtLjguNS0xLjIuNi0xIC4zLTIgLjMtMyAwLS41LS4yLTEtLjUtMS40LS45LS40LS40LS44LS45LTEtMS41LS4yLS42LS4zLTEuMy0uMy0yLjFzLjEtMS42LjQtMi4zYy4yLS42LjYtMS4yIDEtMS42LjQtLjQuOS0uNyAxLjQtLjkuNi0uMyAxLjEtLjQgMS43LS40LjcgMCAxLjQuMSAyIC4zLjUuMiAxIC41IDEuNC44IDAgLjEtMS4zIDEuNC0xLjMgMS40em0tMi40IDUuOGMuMiAwIC40IDAgLjYtLjEuMiAwIC40LS4xLjUtLjIuMS0uMS4zLS4zLjQtLjUuMS0uMi4xLS41LjEtLjcgMC0uNC0uMS0uOC0uNC0xLjEtLjMtLjItLjctLjMtMS4xLS4zLS4zIDAtLjcuMS0xIC4yLS40LjItLjcuNC0xIC43IDAgLjMuMS43LjMgMSAuMS4yLjMuNC40LjYuMi4xLjMuMy41LjMuMi4xLjUuMi43LjF6Jyxcblx0XHRwOiAnTTYuMiAxNVY1aDMuMmMxLjIgMCAyIC4xIDIuNC4yLjYuMiAxIC41IDEuNCAxIC40LjUuNiAxLjEuNiAxLjkgMCAuNi0uMSAxLjEtLjMgMS42LS4yLjQtLjUuOC0uOSAxLS4zLjItLjcuNC0xIC41LS41LjEtMS4yLjEtMi4xLjFIOC4yVjE1aC0yem0yLTguM3YyLjhoMS4xYy44IDAgMS4zIDAgMS42LS4yLjMtLjEuNS0uMy42LS41LjItLjIuMi0uNS4yLS44IDAtLjQtLjEtLjctLjMtLjktLjItLjItLjUtLjQtLjgtLjQtLjIgMC0uNy0uMS0xLjUtLjEuMS4xLS45LjEtLjkuMXonLFxuXHRcdHNwYW46ICdNOC4yIDEyYy4yIDEgLjkgMS40IDIgMS40czEuNi0uNCAxLjYtMS4yYzAtLjgtLjUtMS4xLTIuMS0xLjUtMi43LS42LTMuMy0xLjUtMy4zLTIuOUM2LjQgNi4yIDcuNiA1IDkuOSA1YzIuNiAwIDMuNiAxLjQgMy43IDIuOGgtMi4xYy0uMS0uNi0uNC0xLjItMS43LTEuMi0uOSAwLTEuNC40LTEuNCAxIDAgLjcuNC45IDIgMS4zIDIuOS43IDMuNiAxLjcgMy42IDMuMSAwIDEuOC0xLjMgMy0zLjkgMy0yLjUgMC0zLjgtMS4yLTQtM2gyLjF6Jyxcblx0XHRkaXY6ICdNNS44IDVoMy43Yy44IDAgMS41LjEgMS45LjIuNi4yIDEuMS41IDEuNS45LjQuNC43IDEgMSAxLjYuMi42LjMgMS40LjMgMi40IDAgLjgtLjEgMS41LS4zIDIuMS0uMy43LS42IDEuMy0xLjEgMS44LS4zLjMtLjguNi0xLjQuOC0uNC4xLTEgLjItMS44LjJINS44VjV6bTIgMS43djYuNmgxLjVjLjYgMCAxIDAgMS4yLS4xLjMtLjEuNi0uMi44LS40LjItLjIuNC0uNS41LTEgLjEtLjQuMi0xLjEuMi0xLjggMC0uOC0uMS0xLjQtLjItMS44LS4xLS40LS4zLS43LS42LTEtLjItLjItLjYtLjQtLjktLjUtLjMtLjEtLjgtLjEtMS42LS4xbC0uOS4xeicsXG5cdH1cblxuXHRpZiAoIWxldmVsVG9QYXRoLmhhc093blByb3BlcnR5KGxldmVsKSkge1xuXHRcdHJldHVybiBudWxsXG5cdH1cblxuXHRyZXR1cm4gKFxuXHRcdDxTVkdcblx0XHRcdHdpZHRoPVwiMjRcIlxuXHRcdFx0aGVpZ2h0PVwiMjRcIlxuXHRcdFx0dmlld0JveD1cIjAgMCAyMCAyMFwiXG5cdFx0XHR4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcblx0XHRcdGlzUHJlc3NlZD17aXNQcmVzc2VkfT5cblx0XHRcdDxQYXRoIGQ9e2xldmVsVG9QYXRoW2xldmVsXX0gLz5cblx0XHQ8L1NWRz5cblx0KVxufSIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQsIHVzZU1lbW8gfSBmcm9tICdAd29yZHByZXNzL2VsZW1lbnQnXG5cbmltcG9ydCB7IF9fIH0gZnJvbSAnY3QtaTE4bidcbmltcG9ydCB7IHJlZ2lzdGVyQmxvY2tUeXBlIH0gZnJvbSAnQHdvcmRwcmVzcy9ibG9ja3MnXG5pbXBvcnQgRWRpdCBmcm9tICcuL0VkaXQnXG5cbmltcG9ydCBtZXRhZGF0YSBmcm9tICcuL2Jsb2NrLmpzb24nXG5cbmltcG9ydCB7IGdldEF0dHJpYnV0ZXNGcm9tT3B0aW9ucywgZ2V0T3B0aW9uc0ZvckJsb2NrIH0gZnJvbSAnYmxvY2tzeS1vcHRpb25zJ1xuXG5leHBvcnQgY29uc3Qgb3B0aW9ucyA9IGdldE9wdGlvbnNGb3JCbG9jaygnZHluYW1pYy1kYXRhJylcbmV4cG9ydCBjb25zdCBkZWZhdWx0QXR0cmlidXRlcyA9IGdldEF0dHJpYnV0ZXNGcm9tT3B0aW9ucyhvcHRpb25zKVxuXG5yZWdpc3RlckJsb2NrVHlwZSgnYmxvY2tzeS9keW5hbWljLWRhdGEnLCB7XG5cdC4uLm1ldGFkYXRhLFxuXHR0aXRsZTogX18oJ0R5bmFtaWMgRGF0YScsICdibG9ja3N5LWNvbXBhbmlvbicpLFxuXHRkZXNjcmlwdGlvbjogX18oXG5cdFx0J0luc2VydCB0aGUgZHluYW1pYyBkYXRhIGFueXdoZXJlIHlvdSBtaWdodCB3YW50LicsXG5cdFx0J2Jsb2Nrc3ktY29tcGFuaW9uJ1xuXHQpLFxuXHRhdHRyaWJ1dGVzOiB7XG5cdFx0Li4ubWV0YWRhdGEuYXR0cmlidXRlcyxcblx0XHQuLi5kZWZhdWx0QXR0cmlidXRlcyxcblx0fSxcblx0aWNvbjoge1xuXHRcdHNyYzogKFxuXHRcdFx0PHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPlxuXHRcdFx0XHQ8cGF0aCBkPVwiTTE3LjkgMTAuNWMtLjEtLjMtLjQtLjQtLjctLjRoLTMuN1Y0LjZjMC0uNC0uMi0uNy0uNi0uOGgtLjJjLS4zIDAtLjUuMS0uNy40bC01LjcgOC42Yy0uMi4zLS4yLjYgMCAuOCAwIC4yLjMuNC42LjRoMy43djUuNWMwIC40LjIuNy42LjhoLjJjLjMgMCAuNS0uMS43LS40bDUuNy04LjZjLjItLjIuMi0uNi4xLS44em0tNS45IDd2LTQuNGMwLS4zLS4zLS42LS42LS42SDcuOWw0LjEtNnY0LjRjMCAuMy4zLjYuNi42aDMuNWwtNC4xIDZ6XCIgLz5cblx0XHRcdDwvc3ZnPlxuXHRcdCksXG5cdH0sXG5cdGVkaXQ6IChwcm9wcykgPT4gPEVkaXQgey4uLnByb3BzfSAvPixcblx0c2F2ZTogKCkgPT4gbnVsbCxcbn0pXG4iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSAnQHdvcmRwcmVzcy9lbGVtZW50J1xuaW1wb3J0IHsgd2l0aFNlbGVjdCB9IGZyb20gJ0B3b3JkcHJlc3MvZGF0YSdcblxuaW1wb3J0IHsgX18gfSBmcm9tICdjdC1pMThuJ1xuXG5jb25zdCBBdXRob3JQcmV2aWV3ID0gKHsgcG9zdElkLCBoYXNfYXV0aG9yX2xpbmssIGF1dGhvcl9maWVsZCB9KSA9PiB7XG5cdGNvbnN0IGdldEF1dGhvckZpbGVkVmFsdWUgPSAoYXV0aG9yKSA9PiB7XG5cdFx0c3dpdGNoIChhdXRob3JfZmllbGQpIHtcblx0XHRcdGNhc2UgJ2VtYWlsJzpcblx0XHRcdFx0cmV0dXJuIGF1dGhvcj8uZW1haWwgfHwgJydcblx0XHRcdGNhc2UgJ25pY2VuYW1lJzpcblx0XHRcdFx0cmV0dXJuIGF1dGhvcj8ubmlja25hbWUgfHwgJydcblx0XHRcdGNhc2UgJ2Rpc3BsYXlfbmFtZSc6XG5cdFx0XHRcdHJldHVybiBhdXRob3I/Lm5pY2tuYW1lIHx8ICcnXG5cdFx0XHRjYXNlICdmaXJzdF9uYW1lJzpcblx0XHRcdFx0cmV0dXJuIGF1dGhvcj8uZmlyc3RfbmFtZSB8fCAnJ1xuXHRcdFx0Y2FzZSAnbGFzdF9uYW1lJzpcblx0XHRcdFx0cmV0dXJuIGF1dGhvcj8ubGFzdF9uYW1lIHx8ICcnXG5cdFx0XHRjYXNlICdkZXNjcmlwdGlvbic6XG5cdFx0XHRcdHJldHVybiBhdXRob3I/LmRlc2NyaXB0aW9uIHx8ICcnXG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRicmVha1xuXHRcdH1cblx0fVxuXHRjb25zdCBHZXRBdXRob3IgPSAoeyBhdXRob3IsIHBvc3QgfSkgPT4ge1xuXHRcdGlmIChoYXNfYXV0aG9yX2xpbmsgPT09ICd5ZXMnKSB7XG5cdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHQ8YSBocmVmPVwiI1wiIHJlbD1cIm5vb3BlbmVyIG5vcmVmZXJyZXJcIj5cblx0XHRcdFx0XHR7Z2V0QXV0aG9yRmlsZWRWYWx1ZShhdXRob3IpfVxuXHRcdFx0XHQ8L2E+XG5cdFx0XHQpXG5cdFx0fVxuXG5cdFx0cmV0dXJuIGdldEF1dGhvckZpbGVkVmFsdWUoYXV0aG9yKVxuXHR9XG5cblx0Y29uc3Qgc2VsZWN0QXV0aG9yID0gd2l0aFNlbGVjdCgoc2VsZWN0KSA9PiB7XG5cdFx0Y29uc3QgcG9zdCA9IHNlbGVjdCgnY29yZScpLmdldEVudGl0eVJlY29yZChcblx0XHRcdCdwb3N0VHlwZScsXG5cdFx0XHRzZWxlY3QoJ2NvcmUvZWRpdG9yJykuZ2V0Q3VycmVudFBvc3RUeXBlKCksXG5cdFx0XHRwb3N0SWRcblx0XHQpXG5cblx0XHRjb25zdCBhdXRob3JJZCA9IHBvc3Q/LmF1dGhvclxuXHRcdGNvbnN0IGF1dGhvciA9IHNlbGVjdCgnY29yZScpLmdldFVzZXIoYXV0aG9ySWQpXG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0YXV0aG9yLFxuXHRcdH1cblx0fSlcblxuXHRjb25zdCBQb3N0VGF4b25vbXkgPSBzZWxlY3RBdXRob3IoR2V0QXV0aG9yKVxuXG5cdHJldHVybiA8UG9zdFRheG9ub215IC8+XG59XG5cbmV4cG9ydCBkZWZhdWx0IEF1dGhvclByZXZpZXdcbiIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tICdAd29yZHByZXNzL2VsZW1lbnQnXG5cbmltcG9ydCB7IF9fIH0gZnJvbSAnY3QtaTE4bidcblxuY29uc3QgQ29tbWVudHNQcmV2aWV3ID0gKHtcblx0aGFzX2NvbW1lbnRzX2xpbmssXG5cdHplcm9fdGV4dCxcblx0c2luZ2xlX3RleHQsXG5cdG11bHRpcGxlX3RleHQsXG5cdGNvbW1lbnRzLFxufSkgPT4ge1xuXHRjb25zdCBjb21tZW50c19udW0gPSBjb21tZW50cy5sZW5ndGggfHwgMFxuXG5cdGNvbnN0IGNvbW1lbnRzVGV4dCA9XG5cdFx0Y29tbWVudHNfbnVtID09PSAwXG5cdFx0XHQ/IHplcm9fdGV4dFxuXHRcdFx0OiBjb21tZW50c19udW0gPT09IDFcblx0XHRcdD8gc2luZ2xlX3RleHRcblx0XHRcdDogbXVsdGlwbGVfdGV4dFxuXG5cdGlmIChoYXNfY29tbWVudHNfbGluayA9PT0gJ3llcycpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0PGEgaHJlZj1cIiNcIiByZWw9XCJub29wZW5lciBub3JlZmVycmVyXCI+XG5cdFx0XHRcdHtjb21tZW50c1RleHQucmVwbGFjZSgnJScsIGNvbW1lbnRzX251bSl9XG5cdFx0XHQ8L2E+XG5cdFx0KVxuXHR9XG5cblx0cmV0dXJuIGNvbW1lbnRzVGV4dC5yZXBsYWNlKCclJywgY29tbWVudHNfbnVtKVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21tZW50c1ByZXZpZXdcbiIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tICdAd29yZHByZXNzL2VsZW1lbnQnXG5pbXBvcnQgeyBmb3JtYXQsIGdldFNldHRpbmdzIH0gZnJvbSAnQHdvcmRwcmVzcy9kYXRlJ1xuaW1wb3J0IHsgd2l0aFNlbGVjdCB9IGZyb20gJ0B3b3JkcHJlc3MvZGF0YSdcblxuaW1wb3J0IHsgX18gfSBmcm9tICdjdC1pMThuJ1xuXG5jb25zdCBEYXRlUHJldmlldyA9ICh7XG5cdHBvc3RJZCxcblx0ZGVmYXVsdF9mb3JtYXQsXG5cdGRhdGVfdHlwZSxcblx0ZGF0ZV9mb3JtYXQsXG5cdGN1c3RvbV9kYXRlX2Zvcm1hdCxcbn0pID0+IHtcblx0Y29uc3QgZGF0ZUZvcm1hdCA9XG5cdFx0ZGVmYXVsdF9mb3JtYXQgPT09ICd5ZXMnXG5cdFx0XHQ/IGdldFNldHRpbmdzKCkuZm9ybWF0cy5kYXRlXG5cdFx0XHQ6IGRhdGVfZm9ybWF0ICE9PSAnY3VzdG9tJ1xuXHRcdFx0PyBkYXRlX2Zvcm1hdFxuXHRcdFx0OiBjdXN0b21fZGF0ZV9mb3JtYXRcblxuXHRjb25zdCBHZXREYXRlID0gKHByb3BzKSA9PiAoXG5cdFx0PHNwYW4+XG5cdFx0XHR7Zm9ybWF0KFxuXHRcdFx0XHRkYXRlRm9ybWF0LFxuXHRcdFx0XHRkYXRlX3R5cGUgPT09ICdwdWJsaXNoZWQnXG5cdFx0XHRcdFx0PyBwcm9wcy5wb3N0LmRhdGVcblx0XHRcdFx0XHQ6IHByb3BzLnBvc3QubW9kaWZpZWRcblx0XHRcdCl9XG5cdFx0PC9zcGFuPlxuXHQpXG5cblx0Y29uc3Qgc2VsZWN0RGF0ZSA9IHdpdGhTZWxlY3QoKHNlbGVjdCkgPT4gKHtcblx0XHRwb3N0OiBzZWxlY3QoJ2NvcmUnKS5nZXRFbnRpdHlSZWNvcmQoXG5cdFx0XHQncG9zdFR5cGUnLFxuXHRcdFx0c2VsZWN0KCdjb3JlL2VkaXRvcicpLmdldEN1cnJlbnRQb3N0VHlwZSgpLFxuXHRcdFx0cG9zdElkXG5cdFx0KSxcblx0fSkpXG5cblx0Y29uc3QgUG9zdERhdGUgPSBzZWxlY3REYXRlKEdldERhdGUpXG5cblx0cmV0dXJuIDxQb3N0RGF0ZSAvPlxufVxuXG5leHBvcnQgZGVmYXVsdCBEYXRlUHJldmlld1xuIiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCwgUmF3SFRNTCB9IGZyb20gJ0B3b3JkcHJlc3MvZWxlbWVudCdcbmltcG9ydCB7IHdpdGhTZWxlY3QgfSBmcm9tICdAd29yZHByZXNzL2RhdGEnXG5pbXBvcnQgeyBfXyB9IGZyb20gJ2N0LWkxOG4nXG5cbmNvbnN0IEV4Y2VycHRQcmV2aWV3ID0gKHsgZXhjZXJwdF9sZW5ndGggfSkgPT4ge1xuXHRjb25zdCBzdHJpcHBlZFJlbmRlcmVkRXhjZXJwdCA9IChjb250ZW50KSA9PiB7XG5cdFx0aWYgKCFjb250ZW50KSByZXR1cm4gJydcblx0XHRjb25zdCBkb2N1bWVudCA9IG5ldyB3aW5kb3cuRE9NUGFyc2VyKCkucGFyc2VGcm9tU3RyaW5nKFxuXHRcdFx0Y29udGVudCxcblx0XHRcdCd0ZXh0L2h0bWwnXG5cdFx0KVxuXHRcdHJldHVybiBkb2N1bWVudC5ib2R5LnRleHRDb250ZW50IHx8IGRvY3VtZW50LmJvZHkuaW5uZXJUZXh0IHx8ICcnXG5cdH1cblxuXHRjb25zdCBHZXRFeGNlcnB0ID0gKHsgZXhjZXJwdCwgY29udGVudCB9KSA9PiB7XG5cdFx0Y29uc3QgZXhjZXJwdENvbnRlbnQgPSBgJHtleGNlcnB0IHx8IHN0cmlwcGVkUmVuZGVyZWRFeGNlcnB0KGNvbnRlbnQpfWBcblx0XHRjb25zdCBleGNlcnB0UGFydHMgPSBleGNlcnB0Q29udGVudC5zcGxpdCgnICcpXG5cdFx0Y29uc3QgbWF5YmVNb3JlID0gZXhjZXJwdFBhcnRzLmxlbmd0aCA+IGV4Y2VycHRfbGVuZ3RoID8gJy4uLicgOiAnJ1xuXG5cdFx0cmV0dXJuIChcblx0XHRcdDxSYXdIVE1MPlxuXHRcdFx0XHR7ZXhjZXJwdFBhcnRzLnNsaWNlKDAsIGV4Y2VycHRfbGVuZ3RoKS5qb2luKCcgJyl9XG5cdFx0XHRcdHttYXliZU1vcmV9XG5cdFx0XHQ8L1Jhd0hUTUw+XG5cdFx0KVxuXHR9XG5cblx0Y29uc3Qgc2VsZWN0RXhjZXJwdCA9IHdpdGhTZWxlY3QoKHNlbGVjdCkgPT4gKHtcblx0XHRleGNlcnB0OiBzZWxlY3QoJ2NvcmUvZWRpdG9yJyk/LmdldEVkaXRlZFBvc3RBdHRyaWJ1dGUoJ2V4Y2VycHQnKSB8fCAnJyxcblx0XHRjb250ZW50OiBzZWxlY3QoJ2NvcmUvZWRpdG9yJyk/LmdldEVkaXRlZFBvc3RBdHRyaWJ1dGUoJ2NvbnRlbnQnKSB8fCAnJyxcblx0fSkpXG5cblx0Y29uc3QgUG9zdEV4Y2VycHQgPSBzZWxlY3RFeGNlcnB0KEdldEV4Y2VycHQpXG5cblx0cmV0dXJuIDxQb3N0RXhjZXJwdCAvPlxufVxuXG5leHBvcnQgZGVmYXVsdCBFeGNlcnB0UHJldmlld1xuIiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gJ0B3b3JkcHJlc3MvZWxlbWVudCdcblxuY29uc3QgSW1hZ2VQcmV2aWV3ID0gKHsgdmFsdWUsIGJsb2NrUHJvcHMsIGFzcGVjdFJhdGlvLCBoZWlnaHQgfSkgPT4ge1xuXHRsZXQgbWF5YmVVcmwgPSAnJ1xuXG5cdGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG5cdFx0bWF5YmVVcmwgPSB2YWx1ZVxuXHR9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcblx0XHRtYXliZVVybCA9IHZhbHVlLnVybFxuXHR9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHtcblx0XHRpZiAod3AuZGF0YSkge1xuXHRcdFx0Y29uc3QgbWF5YmVJbWFnZSA9IHdwLmRhdGEuc2VsZWN0KCdjb3JlJykuZ2V0TWVkaWEodmFsdWUpXG5cblx0XHRcdGlmIChtYXliZUltYWdlKSB7XG5cdFx0XHRcdG1heWJlVXJsID0gbWF5YmVJbWFnZS5zb3VyY2VfdXJsXG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0aWYgKCFtYXliZVVybCkge1xuXHRcdHJldHVybiAoXG5cdFx0XHQ8ZmlndXJlIHsuLi5ibG9ja1Byb3BzfT5cblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJjdC1keW5hbWljLWRhdGEtcGxhY2Vob2xkZXJcIj5cblx0XHRcdFx0XHQ8c3ZnXG5cdFx0XHRcdFx0XHRmaWxsPVwibm9uZVwiXG5cdFx0XHRcdFx0XHR4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcblx0XHRcdFx0XHRcdHZpZXdCb3g9XCIwIDAgNjAgNjBcIlxuXHRcdFx0XHRcdFx0cHJlc2VydmVBc3BlY3RSYXRpbz1cIm5vbmVcIlxuXHRcdFx0XHRcdFx0Y2xhc3M9XCJjb21wb25lbnRzLXBsYWNlaG9sZGVyX19pbGx1c3RyYXRpb25cIlxuXHRcdFx0XHRcdFx0YXJpYS1oaWRkZW49XCJ0cnVlXCJcblx0XHRcdFx0XHRcdGZvY3VzYWJsZT1cImZhbHNlXCJcblx0XHRcdFx0XHRcdHN0eWxlPXt7XG5cdFx0XHRcdFx0XHRcdCdtaW4taGVpZ2h0JzogJzIwMHB4Jyxcblx0XHRcdFx0XHRcdFx0aGVpZ2h0OiAhIWFzcGVjdFJhdGlvICYmICcxMDAlJyxcblx0XHRcdFx0XHRcdFx0d2lkdGg6ICEhYXNwZWN0UmF0aW8gJiYgJzEwMCUnLFxuXHRcdFx0XHRcdFx0fX0+XG5cdFx0XHRcdFx0XHQ8cGF0aFxuXHRcdFx0XHRcdFx0XHR2ZWN0b3ItZWZmZWN0PVwibm9uLXNjYWxpbmctc3Ryb2tlXCJcblx0XHRcdFx0XHRcdFx0ZD1cIk02MCA2MCAwIDBcIj48L3BhdGg+XG5cdFx0XHRcdFx0PC9zdmc+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0PC9maWd1cmU+XG5cdFx0KVxuXHR9XG5cblx0Y29uc3QgaW1hZ2VQcm9wcyA9IHtcblx0XHRzdHlsZTogYmxvY2tQcm9wcy5zdHlsZSxcblx0fVxuXG5cdGRlbGV0ZSBibG9ja1Byb3BzLnN0eWxlXG5cblx0cmV0dXJuIChcblx0XHQ8ZmlndXJlIHsuLi5ibG9ja1Byb3BzfT5cblx0XHRcdDxpbWdcblx0XHRcdFx0c3R5bGU9e3tcblx0XHRcdFx0XHQuLi5pbWFnZVByb3BzLnN0eWxlLFxuXHRcdFx0XHRcdG9iamVjdEZpdDogJ2NvdmVyJyxcblx0XHRcdFx0fX1cblx0XHRcdFx0c3JjPXttYXliZVVybH1cblx0XHRcdC8+XG5cdFx0PC9maWd1cmU+XG5cdClcbn1cblxuZXhwb3J0IGRlZmF1bHQgSW1hZ2VQcmV2aWV3XG4iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSAnQHdvcmRwcmVzcy9lbGVtZW50J1xuaW1wb3J0IHsgd2l0aFNlbGVjdCB9IGZyb20gJ0B3b3JkcHJlc3MvZGF0YSdcblxuaW1wb3J0IHsgX18gfSBmcm9tICdjdC1pMThuJ1xuXG5jb25zdCBUYXhvbm9teVByZXZpZXcgPSAoe1xuXHRwb3N0SWQsXG5cdGhhc190ZXJtc19saW5rLFxuXHR0YXhvbm9teTogcmVxX3RheG9ub215LFxuXHRzZXBhcmF0b3IsXG59KSA9PiB7XG5cdGNvbnN0IEdldFRheG9ub215ID0gKHsgdGVybXMgfSkgPT4ge1xuXHRcdGlmICghcmVxX3RheG9ub215KSB7XG5cdFx0XHRyZXR1cm4gX18oJ05vIFRlcm1zJywgJ2Jsb2Nrc3ktY29tcGFuaW9uJylcblx0XHR9XG5cblx0XHRpZiAoaGFzX3Rlcm1zX2xpbmsgPT09ICd5ZXMnKSB7XG5cdFx0XHRyZXR1cm4gdGVybXMubGVuZ3RoXG5cdFx0XHRcdD8gdGVybXMubWFwKCh0LCBpbmRleCkgPT4gKFxuXHRcdFx0XHRcdFx0PD5cblx0XHRcdFx0XHRcdFx0PGEgaHJlZj1cIiNcIiByZWw9XCJub29wZW5lciBub3JlZmVycmVyXCI+XG5cdFx0XHRcdFx0XHRcdFx0e3QubmFtZX1cblx0XHRcdFx0XHRcdFx0PC9hPlxuXHRcdFx0XHRcdFx0XHR7aW5kZXggIT09IHRlcm1zLmxlbmd0aCAtIDEgPyBzZXBhcmF0b3IgOiAnJ31cblx0XHRcdFx0XHRcdDwvPlxuXHRcdFx0XHQgICkpXG5cdFx0XHRcdDogX18oJ05vIFRlcm1zJywgJ2Jsb2Nrc3knKVxuXHRcdH1cblxuXHRcdHJldHVybiB0ZXJtcy5sZW5ndGhcblx0XHRcdD8gdGVybXMubWFwKCh0KSA9PiB0Lm5hbWUpLmpvaW4oc2VwYXJhdG9yKVxuXHRcdFx0OiBfXygnTm8gVGVybXMnLCAnYmxvY2tzeScpXG5cdH1cblxuXHRjb25zdCBzZWxlY3RUYXhvbm9teSA9IHdpdGhTZWxlY3QoKHNlbGVjdCkgPT4ge1xuXHRcdHJldHVybiB7XG5cdFx0XHR0ZXJtczpcblx0XHRcdFx0c2VsZWN0KCdjb3JlJykuZ2V0RW50aXR5UmVjb3JkcygndGF4b25vbXknLCByZXFfdGF4b25vbXksIHtcblx0XHRcdFx0XHRwZXJfcGFnZTogLTEsXG5cdFx0XHRcdFx0cG9zdDogcG9zdElkLFxuXHRcdFx0XHR9KSB8fCBbXSxcblx0XHR9XG5cdH0pXG5cblx0Y29uc3QgUG9zdFRheG9ub215ID0gc2VsZWN0VGF4b25vbXkoR2V0VGF4b25vbXkpXG5cblx0cmV0dXJuIDxQb3N0VGF4b25vbXkgLz5cbn1cblxuZXhwb3J0IGRlZmF1bHQgVGF4b25vbXlQcmV2aWV3XG4iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSAnQHdvcmRwcmVzcy9lbGVtZW50J1xuaW1wb3J0IHsgd2l0aFNlbGVjdCB9IGZyb20gJ0B3b3JkcHJlc3MvZGF0YSdcblxuaW1wb3J0IHsgX18gfSBmcm9tICdjdC1pMThuJ1xuXG5jb25zdCBUaXRsZVByZXZpZXcgPSAoeyBoYXNfdGl0bGVfbGluayB9KSA9PiB7XG5cdGNvbnN0IEdldFRpdGxlID0gKHsgdGl0bGUgfSkgPT4ge1xuXHRcdGlmIChoYXNfdGl0bGVfbGluayA9PT0gJ3llcycpIHtcblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdDxhIGhyZWY9XCIjXCIgcmVsPVwibm9vcGVuZXIgbm9yZWZlcnJlclwiPlxuXHRcdFx0XHRcdHt0aXRsZSB8fCBfXygnUGFnZScsICdibG9ja3N5Jyl9XG5cdFx0XHRcdDwvYT5cblx0XHRcdClcblx0XHR9XG5cblx0XHRyZXR1cm4gdGl0bGUgfHwgX18oJ1BhZ2UnLCAnYmxvY2tzeScpXG5cdH1cblxuXHRjb25zdCBzZWxlY3RUaXRsZSA9IHdpdGhTZWxlY3QoKHNlbGVjdCkgPT4gKHtcblx0XHR0aXRsZTogc2VsZWN0KCdjb3JlL2VkaXRvcicpPy5nZXRFZGl0ZWRQb3N0QXR0cmlidXRlKCd0aXRsZScpIHx8ICcnLFxuXHR9KSlcblxuXHRjb25zdCBQb3N0VGl0bGUgPSBzZWxlY3RUaXRsZShHZXRUaXRsZSlcblxuXHRyZXR1cm4gPFBvc3RUaXRsZSAvPlxufVxuXG5leHBvcnQgZGVmYXVsdCBUaXRsZVByZXZpZXdcbiIsIi8qIVxuICBDb3B5cmlnaHQgKGMpIDIwMTcgSmVkIFdhdHNvbi5cbiAgTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlIChNSVQpLCBzZWVcbiAgaHR0cDovL2plZHdhdHNvbi5naXRodWIuaW8vY2xhc3NuYW1lc1xuKi9cbi8qIGdsb2JhbCBkZWZpbmUgKi9cblxuKGZ1bmN0aW9uICgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBoYXNPd24gPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuXHRmdW5jdGlvbiBjbGFzc05hbWVzICgpIHtcblx0XHR2YXIgY2xhc3NlcyA9IFtdO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBhcmcgPSBhcmd1bWVudHNbaV07XG5cdFx0XHRpZiAoIWFyZykgY29udGludWU7XG5cblx0XHRcdHZhciBhcmdUeXBlID0gdHlwZW9mIGFyZztcblxuXHRcdFx0aWYgKGFyZ1R5cGUgPT09ICdzdHJpbmcnIHx8IGFyZ1R5cGUgPT09ICdudW1iZXInKSB7XG5cdFx0XHRcdGNsYXNzZXMucHVzaChhcmcpO1xuXHRcdFx0fSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGFyZykgJiYgYXJnLmxlbmd0aCkge1xuXHRcdFx0XHR2YXIgaW5uZXIgPSBjbGFzc05hbWVzLmFwcGx5KG51bGwsIGFyZyk7XG5cdFx0XHRcdGlmIChpbm5lcikge1xuXHRcdFx0XHRcdGNsYXNzZXMucHVzaChpbm5lcik7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAoYXJnVHlwZSA9PT0gJ29iamVjdCcpIHtcblx0XHRcdFx0Zm9yICh2YXIga2V5IGluIGFyZykge1xuXHRcdFx0XHRcdGlmIChoYXNPd24uY2FsbChhcmcsIGtleSkgJiYgYXJnW2tleV0pIHtcblx0XHRcdFx0XHRcdGNsYXNzZXMucHVzaChrZXkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBjbGFzc2VzLmpvaW4oJyAnKTtcblx0fVxuXG5cdGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuXHRcdGNsYXNzTmFtZXMuZGVmYXVsdCA9IGNsYXNzTmFtZXM7XG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBjbGFzc05hbWVzO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGRlZmluZS5hbWQgPT09ICdvYmplY3QnICYmIGRlZmluZS5hbWQpIHtcblx0XHQvLyByZWdpc3RlciBhcyAnY2xhc3NuYW1lcycsIGNvbnNpc3RlbnQgd2l0aCBucG0gcGFja2FnZSBuYW1lXG5cdFx0ZGVmaW5lKCdjbGFzc25hbWVzJywgW10sIGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBjbGFzc05hbWVzO1xuXHRcdH0pO1xuXHR9IGVsc2Uge1xuXHRcdHdpbmRvdy5jbGFzc05hbWVzID0gY2xhc3NOYW1lcztcblx0fVxufSgpKTtcbiIsIm1vZHVsZS5leHBvcnRzID0gd2luZG93LmJsb2Nrc3lPcHRpb25zOyIsIm1vZHVsZS5leHBvcnRzID0gd2luZG93LndwLmJsb2NrRWRpdG9yOyIsIm1vZHVsZS5leHBvcnRzID0gd2luZG93LndwLmJsb2NrczsiLCJtb2R1bGUuZXhwb3J0cyA9IHdpbmRvdy53cC5jb21wb25lbnRzOyIsIm1vZHVsZS5leHBvcnRzID0gd2luZG93LndwLmRhdGE7IiwibW9kdWxlLmV4cG9ydHMgPSB3aW5kb3cud3AuZGF0ZTsiLCJtb2R1bGUuZXhwb3J0cyA9IHdpbmRvdy53cC5lbGVtZW50OyIsIm1vZHVsZS5leHBvcnRzID0gd2luZG93LndwLmkxOG47IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0ZnVuY3Rpb24oKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG5cdFx0ZnVuY3Rpb24oKSB7IHJldHVybiBtb2R1bGU7IH07XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBkZWZpbml0aW9uKSB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iaiwgcHJvcCkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7IH0iLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyJdLCJuYW1lcyI6WyJjcmVhdGVFbGVtZW50IiwiX18iLCJTZWxlY3RDb250cm9sIiwiX19leHBlcmltZW50YWxVbml0Q29udHJvbCIsIlVuaXRDb250cm9sIiwiX19leHBlcmltZW50YWxUb29sc1BhbmVsIiwiVG9vbHNQYW5lbCIsIl9fZXhwZXJpbWVudGFsVXNlQ3VzdG9tVW5pdHMiLCJ1c2VDdXN0b21Vbml0cyIsIl9fZXhwZXJpbWVudGFsVG9vbHNQYW5lbEl0ZW0iLCJUb29sc1BhbmVsSXRlbSIsInVzZVNldHRpbmciLCJERUZBVUxUX1NJWkUiLCJEaW1lbnNpb25Db250cm9scyIsImNsaWVudElkIiwiYXR0cmlidXRlcyIsImFzcGVjdFJhdGlvIiwid2lkdGgiLCJoZWlnaHQiLCJzaXplU2x1ZyIsInNldEF0dHJpYnV0ZXMiLCJpbWFnZVNpemVPcHRpb25zIiwiZGVmYXVsdFVuaXRzIiwidW5pdHMiLCJhdmFpbGFibGVVbml0cyIsIm9uRGltZW5zaW9uQ2hhbmdlIiwiZGltZW5zaW9uIiwibmV4dFZhbHVlIiwicGFyc2VkVmFsdWUiLCJwYXJzZUZsb2F0IiwiaXNOYU4iLCJ1bmRlZmluZWQiLCJsYWJlbCIsInZhbHVlIiwibmV4dEFzcGVjdFJhdGlvIiwibmV4dFdpZHRoIiwibmV4dEhlaWdodCIsImxlbmd0aCIsIm5leHRTaXplU2x1ZyIsInVzZVN0YXRlIiwidXNlRWZmZWN0IiwiSW5zcGVjdG9yQ29udHJvbHMiLCJCbG9ja0NvbnRyb2xzIiwiQmxvY2tBbGlnbm1lbnRDb250cm9sIiwiQWxpZ25tZW50Q29udHJvbCIsIlByZXZpZXciLCJQYW5lbEJvZHkiLCJUZXh0YXJlYUNvbnRyb2wiLCJFeHRlcm5hbExpbmsiLCJPcHRpb25zUGFuZWwiLCJUYWdOYW1lRHJvcGRvd24iLCJnZXRPcHRpb25zRm9yQmxvY2siLCJvcHRpb25zIiwiY2FwaXRhbGl6ZUZpcnN0TGV0dGVyIiwic3RyaW5nIiwiY2hhckF0IiwidG9VcHBlckNhc2UiLCJzbGljZSIsIkVkaXQiLCJhbGlnbiIsInRhZ05hbWUiLCJpbWFnZUFsaWduIiwiY29udGV4dCIsInByb3BzIiwiZmllbGRzRGVzY3JpcHRvciIsInNldEZpZWxkc0Rlc2NyaXB0b3IiLCJwb3N0SWQiLCJwb3N0VHlwZSIsInZhbHVlVG9SZW5kZXIiLCJmaWVsZCIsImFsbEZpZWxkcyIsImZpZWxkcyIsInJlZHVjZSIsImFjYyIsInByb3ZpZGVyIiwibWF5YmVGaWVsZERlc2NyaXB0b3IiLCJmaW5kIiwia2V5IiwicmVzdWx0IiwiZmV0Y2giLCJ3cCIsImFqYXgiLCJzZXR0aW5ncyIsInVybCIsImhlYWRlcnMiLCJBY2NlcHQiLCJtZXRob2QiLCJib2R5IiwiSlNPTiIsInN0cmluZ2lmeSIsInBvc3RfaWQiLCJ0aGVuIiwicmVzIiwianNvbiIsInN1Y2Nlc3MiLCJkYXRhIiwidGF4b25vbXlDaG9pc2VzIiwiT2JqZWN0IiwidmFsdWVzIiwiY29uZGl0aW9uIiwidGF4b25vbXkiLCJjaG9pY2VzIiwiQXJyYXkiLCJpc0FycmF5IiwiZmlsdGVyIiwidHlwZSIsIm5ld0FsaWduIiwibmV3SW1hZ2VBbGlnbiIsIm9wdGlvbklkIiwib3B0aW9uVmFsdWUiLCJkZWZhdWx0VG9GaXJzdEl0ZW0iLCJwdXJwb3NlIiwia2V5cyIsImltYWdlX3NpemVzIiwic2l6ZSIsIm1hcCIsInNwbGl0Iiwiam9pbiIsImFsdF90ZXh0IiwidXNlQ2FsbGJhY2siLCJ1c2VCbG9ja1Byb3BzIiwiY2xhc3NuYW1lcyIsIlRpdGxlUHJldmlldyIsIkV4Y2VycHRQcmV2aWV3IiwiRGF0ZVByZXZpZXciLCJDb21tZW50c1ByZXZpZXciLCJUYXhvbm9teVByZXZpZXciLCJBdXRob3JQcmV2aWV3IiwiSW1hZ2VQcmV2aWV3IiwiVGFnTmFtZSIsImJlZm9yZSIsImFmdGVyIiwiZmFsbGJhY2siLCJoYXNfdGl0bGVfbGluayIsImV4Y2VycHRfbGVuZ3RoIiwiZGVmYXVsdF9mb3JtYXQiLCJkYXRlX3R5cGUiLCJkYXRlX2Zvcm1hdCIsImN1c3RvbV9kYXRlX2Zvcm1hdCIsImhhc19jb21tZW50c19saW5rIiwiemVyb190ZXh0Iiwic2luZ2xlX3RleHQiLCJtdWx0aXBsZV90ZXh0IiwiaGFzX3Rlcm1zX2xpbmsiLCJzZXBhcmF0b3IiLCJhdXRob3JfZmllbGQiLCJoYXNfYXV0aG9yX2xpbmsiLCJyZXN0IiwiY29tbWVudHMiLCJzZXRDb21tZW50cyIsImZldGNoQXR0cmlidXRlcyIsIndpbmRvdyIsImN0X2xvY2FsaXphdGlvbnMiLCJjdF9jdXN0b21pemVyX2xvY2FsaXphdGlvbnMiLCJyZXN0X3VybCIsImJsb2NrUHJvcHMiLCJjbGFzc05hbWUiLCJzdHlsZSIsImlzRmFsbGJhY2siLCJpbmNsdWRlcyIsIkNvbXBvbmVudCIsIlRvb2xiYXJEcm9wZG93bk1lbnUiLCJzcHJpbnRmIiwiVGFnTmFtZUljb24iLCJIZWFkaW5nTGV2ZWxEcm9wZG93biIsIm9uQ2hhbmdlIiwidGFyZ2V0VGFnTmFtZSIsImlzQWN0aXZlIiwiaWNvbiIsInRpdGxlIiwiaDEiLCJoMiIsImgzIiwiaDQiLCJoNSIsImg2IiwicCIsInNwYW4iLCJkaXYiLCJvbkNsaWNrIiwicm9sZSIsInVzZVJlZiIsIlBhdGgiLCJTVkciLCJsZXZlbCIsImlzUHJlc3NlZCIsImxldmVsVG9QYXRoIiwiaGFzT3duUHJvcGVydHkiLCJ1c2VNZW1vIiwicmVnaXN0ZXJCbG9ja1R5cGUiLCJtZXRhZGF0YSIsImdldEF0dHJpYnV0ZXNGcm9tT3B0aW9ucyIsImRlZmF1bHRBdHRyaWJ1dGVzIiwiZGVzY3JpcHRpb24iLCJzcmMiLCJlZGl0Iiwic2F2ZSIsIndpdGhTZWxlY3QiLCJnZXRBdXRob3JGaWxlZFZhbHVlIiwiYXV0aG9yIiwiZW1haWwiLCJuaWNrbmFtZSIsImZpcnN0X25hbWUiLCJsYXN0X25hbWUiLCJHZXRBdXRob3IiLCJwb3N0Iiwic2VsZWN0QXV0aG9yIiwic2VsZWN0IiwiZ2V0RW50aXR5UmVjb3JkIiwiZ2V0Q3VycmVudFBvc3RUeXBlIiwiYXV0aG9ySWQiLCJnZXRVc2VyIiwiUG9zdFRheG9ub215IiwiY29tbWVudHNfbnVtIiwiY29tbWVudHNUZXh0IiwicmVwbGFjZSIsImZvcm1hdCIsImdldFNldHRpbmdzIiwiZGF0ZUZvcm1hdCIsImZvcm1hdHMiLCJkYXRlIiwiR2V0RGF0ZSIsIm1vZGlmaWVkIiwic2VsZWN0RGF0ZSIsIlBvc3REYXRlIiwiUmF3SFRNTCIsInN0cmlwcGVkUmVuZGVyZWRFeGNlcnB0IiwiY29udGVudCIsImRvY3VtZW50IiwiRE9NUGFyc2VyIiwicGFyc2VGcm9tU3RyaW5nIiwidGV4dENvbnRlbnQiLCJpbm5lclRleHQiLCJHZXRFeGNlcnB0IiwiZXhjZXJwdCIsImV4Y2VycHRDb250ZW50IiwiZXhjZXJwdFBhcnRzIiwibWF5YmVNb3JlIiwic2VsZWN0RXhjZXJwdCIsImdldEVkaXRlZFBvc3RBdHRyaWJ1dGUiLCJQb3N0RXhjZXJwdCIsIm1heWJlVXJsIiwibWF5YmVJbWFnZSIsImdldE1lZGlhIiwic291cmNlX3VybCIsImltYWdlUHJvcHMiLCJvYmplY3RGaXQiLCJyZXFfdGF4b25vbXkiLCJHZXRUYXhvbm9teSIsInRlcm1zIiwidCIsImluZGV4IiwibmFtZSIsInNlbGVjdFRheG9ub215IiwiZ2V0RW50aXR5UmVjb3JkcyIsInBlcl9wYWdlIiwiR2V0VGl0bGUiLCJzZWxlY3RUaXRsZSIsIlBvc3RUaXRsZSJdLCJzb3VyY2VSb290IjoiIn0=