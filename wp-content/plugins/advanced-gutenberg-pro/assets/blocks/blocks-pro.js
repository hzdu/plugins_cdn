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

/***/ "../PublishPress-Blocks/src/assets/blocks/0-adv-components/components.jsx":
/*!********************************************************************************!*\
  !*** ../PublishPress-Blocks/src/assets/blocks/0-adv-components/components.jsx ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AdvColorControl = AdvColorControl;
function AdvColorControl(props) {
    var _wp$components = wp.components,
        ColorIndicator = _wp$components.ColorIndicator,
        BaseControl = _wp$components.BaseControl;

    var _ref = wp.blockEditor || wp.editor,
        ColorPalette = _ref.ColorPalette;

    var BaseLabel = BaseControl.VisualLabel ? BaseControl.VisualLabel : "span";

    var label = props.label,
        value = props.value,
        onChange = props.onChange;

    return React.createElement(
        BaseControl,
        {
            className: "editor-color-palette-control block-editor-color-palette-control"
        },
        React.createElement(
            BaseLabel,
            { className: "components-base-control__label" },
            label,
            value && React.createElement(ColorIndicator, { colorValue: value })
        ),
        React.createElement(ColorPalette, {
            className: "editor-color-palette-control__color-palette block-editor-color-palette-control__color-palette",
            value: value,
            onChange: onChange
        })
    );
}

/***/ }),

/***/ "./src/assets/blocks/advimage/pro.jsx":
/*!********************************************!*\
  !*** ./src/assets/blocks/advimage/pro.jsx ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


(function (wpI18n, wpHooks, wpBlockEditor, wpComponents, wpElement) {
    wpBlockEditor = wp.blockEditor || wp.editor;
    var addFilter = wpHooks.addFilter;
    var __ = wpI18n.__;
    var _wpBlockEditor = wpBlockEditor,
        InspectorControls = _wpBlockEditor.InspectorControls;
    var PanelBody = wpComponents.PanelBody,
        SelectControl = wpComponents.SelectControl;
    var Fragment = wpElement.Fragment;


    var htmlTags = [{ label: 'h1', value: 'h1' }, { label: 'h2', value: 'h2' }, { label: 'h3', value: 'h3' }, { label: 'h4', value: 'h4' }, { label: 'h5', value: 'h5' }, { label: 'h6', value: 'h6' }, { label: 'p', value: 'p' }, { label: 'div', value: 'div' }];

    // Add fields to sidebar
    addFilter('editor.BlockEdit', 'advgb/advImagePro', function (BlockEdit) {
        return function (props) {
            return React.createElement(
                Fragment,
                null,
                React.createElement(BlockEdit, props),
                props.isSelected && props.name === 'advgb/image' && React.createElement(
                    Fragment,
                    null,
                    React.createElement(
                        InspectorControls,
                        null,
                        React.createElement(
                            PanelBody,
                            { title: __('Content Tags', 'advanced-gutenberg'), className: 'advgb-pro-icon' },
                            React.createElement(SelectControl, {
                                label: __('Title tag', 'advanced-gutenberg'),
                                value: props.attributes.titleTag,
                                options: htmlTags,
                                onChange: function onChange(value) {
                                    return props.setAttributes({ titleTag: value });
                                }
                            }),
                            React.createElement(SelectControl, {
                                label: __('Subtitle tag', 'advanced-gutenberg'),
                                value: props.attributes.subtitleTag,
                                options: htmlTags,
                                onChange: function onChange(value) {
                                    return props.setAttributes({ subtitleTag: value });
                                }
                            })
                        )
                    )
                )
            );
        };
    });
})(wp.i18n, wp.hooks, wp.blockEditor, wp.components, wp.element);

/***/ }),

/***/ "./src/assets/blocks/advlist/pro.jsx":
/*!*******************************************!*\
  !*** ./src/assets/blocks/advlist/pro.jsx ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _components = __webpack_require__(/*! ../../../../../PublishPress-Blocks/src/assets/blocks/0-adv-components/components.jsx */ "../PublishPress-Blocks/src/assets/blocks/0-adv-components/components.jsx");

(function (wpI18n, wpHooks, wpBlockEditor, wpComponents, wpElement) {
    wpBlockEditor = wp.blockEditor || wp.editor;
    var addFilter = wpHooks.addFilter;
    var __ = wpI18n.__;
    var _wpBlockEditor = wpBlockEditor,
        InspectorControls = _wpBlockEditor.InspectorControls;
    var PanelBody = wpComponents.PanelBody;
    var Fragment = wpElement.Fragment;

    // Set attributes

    addFilter('blocks.registerBlockType', 'advgb/registerListProClass', function (settings) {
        if (settings.name === 'advgb/list') {
            settings.attributes = _extends(settings.attributes, {
                textColor: {
                    type: 'string'
                }
            });
        }

        return settings;
    });

    // Add fields to sidebar
    addFilter('editor.BlockEdit', 'advgb/listPro', function (BlockEdit) {
        return function (props) {
            return React.createElement(
                Fragment,
                null,
                React.createElement(BlockEdit, props),
                props.isSelected && props.name === 'advgb/list' && React.createElement(
                    Fragment,
                    null,
                    React.createElement(
                        InspectorControls,
                        null,
                        React.createElement(
                            PanelBody,
                            { title: __('Colors', 'advanced-gutenberg'), initialOpen: true, className: 'advgb-pro-icon' },
                            React.createElement(_components.AdvColorControl, {
                                label: __('Text Color', 'advanced-gutenberg'),
                                value: props.attributes.textColor,
                                onChange: function onChange(value) {
                                    return props.setAttributes({ textColor: value });
                                }
                            })
                        )
                    )
                ),
                props.attributes.id && React.createElement(
                    'div',
                    null,
                    props.attributes.textColor && React.createElement(
                        'style',
                        null,
                        '.' + props.attributes.id + ' li {\n                                        color: ' + props.attributes.textColor + ';\n                                    }'
                    )
                )
            );
        };
    });
})(wp.i18n, wp.hooks, wp.blockEditor, wp.components, wp.element);

/***/ }),

/***/ "./src/assets/blocks/count-up/pro.jsx":
/*!********************************************!*\
  !*** ./src/assets/blocks/count-up/pro.jsx ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

(function (wpI18n, wpHooks, wpBlockEditor, wpComponents, wpElement) {
    wpBlockEditor = wp.blockEditor || wp.editor;
    var addFilter = wpHooks.addFilter;
    var __ = wpI18n.__;
    var _wpBlockEditor = wpBlockEditor,
        InspectorControls = _wpBlockEditor.InspectorControls,
        BlockControls = _wpBlockEditor.BlockControls,
        AlignmentToolbar = _wpBlockEditor.AlignmentToolbar;
    var PanelBody = wpComponents.PanelBody,
        RangeControl = wpComponents.RangeControl;
    var Fragment = wpElement.Fragment;

    // Set attributes

    addFilter('blocks.registerBlockType', 'advgb/registerCountUpProClass', function (settings) {
        if (settings.name === 'advgb/count-up') {
            settings.attributes = _extends(settings.attributes, {
                headerSize: {
                    type: 'number'
                },
                descriptionSize: {
                    type: 'number'
                },
                align: {
                    type: 'string',
                    default: 'center'
                }
            });
        }

        return settings;
    });

    // Add fields to sidebar
    addFilter('editor.BlockEdit', 'advgb/countUpPro', function (BlockEdit) {
        return function (props) {
            return React.createElement(
                Fragment,
                null,
                React.createElement(BlockEdit, props),
                props.isSelected && props.name === 'advgb/count-up' && React.createElement(
                    Fragment,
                    null,
                    React.createElement(
                        BlockControls,
                        null,
                        React.createElement(AlignmentToolbar, {
                            value: props.attributes.align,
                            onChange: function onChange(value) {
                                return props.setAttributes({ align: value });
                            }
                        })
                    ),
                    React.createElement(
                        InspectorControls,
                        null,
                        React.createElement(
                            PanelBody,
                            { title: __('Header & Description', 'advanced-gutenberg'), className: 'advgb-pro-icon' },
                            React.createElement(RangeControl, {
                                label: __('Header size', 'advanced-gutenberg'),
                                value: props.attributes.headerSize || '',
                                onChange: function onChange(value) {
                                    return props.setAttributes({ headerSize: value });
                                },
                                min: 10,
                                max: 100,
                                beforeIcon: 'editor-textcolor',
                                allowReset: true
                            }),
                            React.createElement(RangeControl, {
                                label: __('Description size', 'advanced-gutenberg'),
                                value: props.attributes.descriptionSize || '',
                                onChange: function onChange(value) {
                                    return props.setAttributes({ descriptionSize: value });
                                },
                                min: 10,
                                max: 100,
                                beforeIcon: 'editor-textcolor',
                                allowReset: true
                            })
                        )
                    )
                ),
                props.attributes.id && React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'style',
                        null,
                        props.attributes.headerSize && '.' + props.attributes.id + ' .advgb-count-up-header {\n                                    font-size: ' + props.attributes.headerSize + 'px;\n                                }',
                        props.attributes.descriptionSize && '.' + props.attributes.id + ' .advgb-count-up-desc {\n                                    font-size: ' + props.attributes.descriptionSize + 'px;\n                                }',
                        props.attributes.align && '.' + props.attributes.id + '.advgb-count-up > div {\n                                    text-align: ' + props.attributes.align + ';\n                                }'
                    )
                )
            );
        };
    });
})(wp.i18n, wp.hooks, wp.blockEditor, wp.components, wp.element);

/***/ }),

/***/ "./src/assets/blocks/countdown/block.jsx":
/*!***********************************************!*\
  !*** ./src/assets/blocks/countdown/block.jsx ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function (wpI18n, wpBlocks, wpElement, wpComponents, wpBlockEditor) {
    wpBlockEditor = wp.blockEditor || wp.editor;
    var __ = wpI18n.__;
    var createElement = wpElement.createElement,
        Fragment = wpElement.Fragment,
        Component = wpElement.Component;
    var registerBlockType = wpBlocks.registerBlockType;
    var PanelBody = wpComponents.PanelBody,
        DateTimePicker = wpComponents.DateTimePicker,
        Tooltip = wpComponents.Tooltip,
        RangeControl = wpComponents.RangeControl,
        ToggleControl = wpComponents.ToggleControl,
        SelectControl = wpComponents.SelectControl,
        TextControl = wpComponents.TextControl;
    var _wpBlockEditor = wpBlockEditor,
        RichText = _wpBlockEditor.RichText,
        InspectorControls = _wpBlockEditor.InspectorControls,
        MediaUpload = _wpBlockEditor.MediaUpload,
        AlignmentToolbar = _wpBlockEditor.AlignmentToolbar,
        BlockControls = _wpBlockEditor.BlockControls,
        PanelColorSettings = _wpBlockEditor.PanelColorSettings,
        InnerBlocks = _wpBlockEditor.InnerBlocks;


    var previewImageData = 'data:image/png;base64,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';

    var advgCountdownIntervals = [];

    /**
     * Clears the process ID for the specified countdown block.
     */
    function clearTimer(blockID) {
        if (advgCountdownIntervals && typeof advgCountdownIntervals[blockID] !== 'undefined') {
            clearInterval(advgCountdownIntervals[blockID]);
        }
    }

    /**
     * Collects the process IDs for each countdown block.
     */
    function addTimer(blockID, interval) {
        if (blockID) {
            advgCountdownIntervals[blockID] = interval;
        }
    }

    var countdownEdit = function (_Component) {
        _inherits(countdownEdit, _Component);

        function countdownEdit() {
            _classCallCheck(this, countdownEdit);

            return _possibleConstructorReturn(this, (countdownEdit.__proto__ || Object.getPrototypeOf(countdownEdit)).apply(this, arguments));
        }

        _createClass(countdownEdit, [{
            key: 'componentWillMount',
            value: function componentWillMount() {
                var _props = this.props,
                    attributes = _props.attributes,
                    setAttributes = _props.setAttributes;

                var currentBlockConfig = advgbDefaultConfig['advgb-countdown'];

                // No override attributes of blocks inserted before
                if (attributes.changed !== true) {
                    if ((typeof currentBlockConfig === 'undefined' ? 'undefined' : _typeof(currentBlockConfig)) === 'object' && currentBlockConfig !== null) {
                        Object.keys(currentBlockConfig).map(function (attribute) {
                            if (typeof attributes[attribute] === 'boolean') {
                                attributes[attribute] = !!currentBlockConfig[attribute];
                            } else {
                                attributes[attribute] = currentBlockConfig[attribute];
                            }
                        });
                    }

                    // Finally set changed attribute to true, so we don't modify anything again
                    setAttributes({ changed: true });
                }
            }
        }, {
            key: 'componentDidMount',
            value: function componentDidMount() {
                var _props2 = this.props,
                    attributes = _props2.attributes,
                    setAttributes = _props2.setAttributes,
                    clientId = _props2.clientId;
                var blockID = attributes.blockID;

                // create a time of the next day only for a newly inserted block

                if (typeof blockID === 'undefined') {
                    setAttributes({ dateTime: moment().add(1, 'days').format('YYYY-MM-DDTHH:mm:ss') });
                }
                // Refresh the id to avoid duplicated ids when duplicating the block
                setAttributes({ blockID: 'advgb-countdown-' + clientId });

                this.initCountdown();
            }
        }, {
            key: 'componentDidUpdate',
            value: function componentDidUpdate(prevProps) {
                var attributes = this.props.attributes;
                var blockID = attributes.blockID,
                    dateTime = attributes.dateTime,
                    displayDLabel = attributes.displayDLabel,
                    displayHMSLabels = attributes.displayHMSLabels,
                    daysLabel = attributes.daysLabel,
                    dayLabel = attributes.dayLabel,
                    hoursLabel = attributes.hoursLabel,
                    hourLabel = attributes.hourLabel,
                    minutesLabel = attributes.minutesLabel,
                    minuteLabel = attributes.minuteLabel,
                    secondsLabel = attributes.secondsLabel,
                    timeHasCome = attributes.timeHasCome;
                var prevDateTime = prevProps.attributes.dateTime;
                var prevDisplayDLabel = prevProps.attributes.displayDLabel;
                var prevDisplayHMSLabels = prevProps.attributes.displayHMSLabels;
                var prevDaysLabel = prevProps.attributes.daysLabel;
                var prevDayLabel = prevProps.attributes.dayLabel;
                var prevHoursLabel = prevProps.attributes.hoursLabel;
                var prevHourLabel = prevProps.attributes.hourLabel;
                var prevMinutesLabel = prevProps.attributes.minutesLabel;
                var prevMinuteLabel = prevProps.attributes.minuteLabel;
                var prevSecondsLabel = prevProps.attributes.secondsLabel;
                var prevTimeHasCome = prevProps.attributes.timeHasCome;
                var prevBlockID = prevProps.attributes.blockID;


                if (blockID !== prevBlockID || dateTime !== prevDateTime || displayDLabel !== prevDisplayDLabel || displayHMSLabels !== prevDisplayHMSLabels || daysLabel !== prevDaysLabel || dayLabel !== prevDayLabel || hoursLabel !== prevHoursLabel || hourLabel !== prevHourLabel || minutesLabel !== prevMinutesLabel || minuteLabel !== prevMinuteLabel || secondsLabel !== prevSecondsLabel || timeHasCome !== prevTimeHasCome) {
                    this.initCountdown(true);
                }
            }
        }, {
            key: 'initCountdown',
            value: function initCountdown() {
                var refresh = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
                var attributes = this.props.attributes;
                var blockID = attributes.blockID,
                    dateTime = attributes.dateTime,
                    displayDLabel = attributes.displayDLabel,
                    displayHMSLabels = attributes.displayHMSLabels,
                    daysLabel = attributes.daysLabel,
                    dayLabel = attributes.dayLabel,
                    hoursLabel = attributes.hoursLabel,
                    hourLabel = attributes.hourLabel,
                    minutesLabel = attributes.minutesLabel,
                    minuteLabel = attributes.minuteLabel,
                    secondsLabel = attributes.secondsLabel,
                    timeHasCome = attributes.timeHasCome;

                // Set the date we're counting down to

                var countDownDate = new Date(moment(attributes.dateTime).format('YYYY/MM/DD HH:mm:ss')).getTime();
                var element = blockID + '-datetime';

                if (refresh) {
                    clearTimer(blockID);
                }

                // Update the count down every 1 second
                var interval = setInterval(function () {
                    if (refresh) {
                        advgbInnerHTML(element, '<span class="advgb-countdown__loading">' + __('Reloading...', 'advanced-gutenberg') + '</span>');
                    }

                    // Get today's date and time
                    var now = new Date().getTime();

                    // Find the distance between now and the count down date
                    var distance = countDownDate - now;

                    // Time calculations for days, hours, minutes and seconds and its labels if enabled
                    var days = Math.floor(distance / (1000 * 60 * 60 * 24));

                    var hours = Math.floor(distance % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
                    if (hours < 10) {
                        hours = '0' + hours;
                    }

                    var minutes = Math.floor(distance % (1000 * 60 * 60) / (1000 * 60));
                    if (minutes < 10) {
                        minutes = '0' + minutes;
                    }

                    var seconds = Math.floor(distance % (1000 * 60) / 1000);
                    if (seconds < 10) {
                        seconds = '0' + seconds;
                    }

                    // Prepare the output
                    var daysLabel_ = displayDLabel === true ? ' ' + daysLabel : '';
                    var dayLabel_ = displayDLabel === true ? ' ' + dayLabel : '';
                    var hoursLabel_ = displayHMSLabels === true ? ' ' + hoursLabel : '';
                    var hourLabel_ = displayHMSLabels === true ? ' ' + hourLabel : '';
                    var minutesLabel_ = displayHMSLabels === true ? ' ' + minutesLabel : '';
                    var minuteLabel_ = displayHMSLabels === true ? ' ' + minuteLabel : '';
                    var secondsLabel_ = displayHMSLabels === true ? ' ' + secondsLabel : '';

                    var output = '';
                    if (days > 0) {
                        if (days > 1) {
                            output += "<span class='advgb-countdown__days'>" + days + daysLabel_ + "</span>";
                        } else {
                            output += "<span class='advgb-countdown__days'>" + days + dayLabel_ + "</span>";
                        }
                    }

                    if (hours > 1 || hours == 0) {
                        output += "<span class='advgb-countdown__hours'>" + hours + hoursLabel_ + "</span>";
                    } else {
                        output += "<span class='advgb-countdown__hours'>" + hours + hourLabel_ + "</span>";
                    }

                    if (minutes > 1 || minutes == 0) {
                        output += "<span class='advgb-countdown__minutes'>" + minutes + minutesLabel_ + "</span>";
                    } else {
                        output += "<span class='advgb-countdown__minutes'>" + minutes + minuteLabel_ + "</span>";
                    }

                    output += "<span class='advgb-countdown__seconds'>" + seconds + secondsLabel_ + "</span>";

                    if (typeof element !== 'undefined' && element !== null) {
                        advgbInnerHTML(element, output);
                        //console.log( element );
                    }

                    // If the count down is over
                    if (distance < 0) {
                        clearTimer(blockID);
                        advgbInnerHTML(element, "<span class='advgb-countdown__timesup'>" + timeHasCome + "</span>");
                    }
                }, 1000);

                addTimer(blockID, interval);

                //console.log( moment(dateTime).format( 'YYYY/MM/DD HH:mm:ss' ) );
                //console.log( `${attributes.blockID}-datetime` );
            }
        }, {
            key: 'render',
            value: function render() {
                var _props3 = this.props,
                    className = _props3.className,
                    attributes = _props3.attributes,
                    setAttributes = _props3.setAttributes;
                var isPreview = attributes.isPreview,
                    dateTime = attributes.dateTime,
                    title = attributes.title,
                    blockID = attributes.blockID,
                    imageURL = attributes.imageURL,
                    imageID = attributes.imageID,
                    imageWidth = attributes.imageWidth,
                    displayImage = attributes.displayImage,
                    displayTitle = attributes.displayTitle,
                    alignment = attributes.alignment,
                    dateFormat = attributes.dateFormat,
                    displayEventDate = attributes.displayEventDate,
                    dayTimerSize = attributes.dayTimerSize,
                    dayTimerLineHeight = attributes.dayTimerLineHeight,
                    timerSize = attributes.timerSize,
                    timerLineHeight = attributes.timerLineHeight,
                    separator = attributes.separator,
                    displayDLabel = attributes.displayDLabel,
                    displayHMSLabels = attributes.displayHMSLabels,
                    daysLabel = attributes.daysLabel,
                    dayLabel = attributes.dayLabel,
                    hoursLabel = attributes.hoursLabel,
                    hourLabel = attributes.hourLabel,
                    minutesLabel = attributes.minutesLabel,
                    minuteLabel = attributes.minuteLabel,
                    secondsLabel = attributes.secondsLabel,
                    timeHasCome = attributes.timeHasCome,
                    displayDescription = attributes.displayDescription,
                    description = attributes.description,
                    displayButton = attributes.displayButton,
                    titleTag = attributes.titleTag,
                    dateTag = attributes.dateTag,
                    dateTimeDisplay = attributes.dateTimeDisplay,
                    titleColor = attributes.titleColor,
                    eventDateColor = attributes.eventDateColor,
                    descriptionColor = attributes.descriptionColor,
                    timerColor = attributes.timerColor,
                    backgroundColor = attributes.backgroundColor,
                    paddingTop = attributes.paddingTop,
                    paddingRight = attributes.paddingRight,
                    paddingBottom = attributes.paddingBottom,
                    paddingLeft = attributes.paddingLeft,
                    borderWidth = attributes.borderWidth,
                    borderColor = attributes.borderColor,
                    borderRadius = attributes.borderRadius,
                    borderStyle = attributes.borderStyle;


                var htmlTags = [{ label: __('h1', 'advanced-gutenberg'), value: 'h1' }, { label: __('h2', 'advanced-gutenberg'), value: 'h2' }, { label: __('h3', 'advanced-gutenberg'), value: 'h3' }, { label: __('h4', 'advanced-gutenberg'), value: 'h4' }, { label: __('h5', 'advanced-gutenberg'), value: 'h5' }, { label: __('h6', 'advanced-gutenberg'), value: 'h6' }, { label: __('p', 'advanced-gutenberg'), value: 'p' }, { label: __('div', 'advanced-gutenberg'), value: 'div' }];

                var listBorderStyles = [{ label: __('None', 'advanced-gutenberg'), value: 'none' }, { label: __('Solid', 'advanced-gutenberg'), value: 'solid' }, { label: __('Dotted', 'advanced-gutenberg'), value: 'dotted' }, { label: __('Dashed', 'advanced-gutenberg'), value: 'dashed' }, { label: __('Double', 'advanced-gutenberg'), value: 'double' }, { label: __('Groove', 'advanced-gutenberg'), value: 'groove' }, { label: __('Ridge', 'advanced-gutenberg'), value: 'ridge' }, { label: __('Inset', 'advanced-gutenberg'), value: 'inset' }, { label: __('Outset', 'advanced-gutenberg'), value: 'outset' }];

                var buttonTemplate = [['advgb/button', {
                    text: __('Click here to see the event', 'advanced-gutenberg'),
                    align: 'center'
                }]];

                var blockClassName = [alignment && 'advgb-countdown-alignment__' + alignment, separator && 'advgb-countdown-separator__' + separator, dateTimeDisplay && 'advgb-countdown-display__' + dateTimeDisplay].filter(Boolean).join(' ');

                return isPreview ? React.createElement('img', { alt: __('Countdown', 'advanced-gutenberg'), width: '100%', src: previewImageData }) : React.createElement(
                    Fragment,
                    null,
                    React.createElement(
                        BlockControls,
                        null,
                        React.createElement(AlignmentToolbar, {
                            value: alignment, onChange: function onChange(value) {
                                return setAttributes({ alignment: value === undefined ? 'center' : value });
                            } })
                    ),
                    React.createElement(
                        InspectorControls,
                        null,
                        React.createElement(
                            PanelBody,
                            { title: __('Date time', 'advanced-gutenberg') },
                            React.createElement(DateTimePicker, {
                                currentDate: dateTime,
                                onChange: function onChange(value) {
                                    return setAttributes({ dateTime: value });
                                },
                                is12Hour: true
                            })
                        ),
                        React.createElement(
                            PanelBody,
                            { title: __('Timer Settings', 'advanced-gutenberg') },
                            React.createElement(SelectControl, {
                                label: __('Days and time display', 'advanced-gutenberg'),
                                value: dateTimeDisplay,
                                options: [{ label: __('Split in Two Lines', 'advanced-gutenberg'), value: 'two-lines' }, { label: __('All in Same Line', 'advanced-gutenberg'), value: 'one-line' }],
                                onChange: function onChange(value) {
                                    return setAttributes({ dateTimeDisplay: value });
                                }
                            }),
                            dateTimeDisplay === 'two-lines' && React.createElement(
                                Fragment,
                                null,
                                React.createElement(RangeControl, {
                                    label: __('Font Size for days', 'advanced-gutenberg'),
                                    value: dayTimerSize,
                                    min: 1,
                                    max: 100,
                                    step: 1,
                                    onChange: function onChange(value) {
                                        return setAttributes({ dayTimerSize: value });
                                    }
                                }),
                                React.createElement(RangeControl, {
                                    label: __('Line Height for days', 'advanced-gutenberg'),
                                    value: dayTimerLineHeight,
                                    min: 1,
                                    max: 100,
                                    step: 1,
                                    onChange: function onChange(value) {
                                        return setAttributes({ dayTimerLineHeight: value });
                                    }
                                })
                            ),
                            React.createElement(RangeControl, {
                                label: dateTimeDisplay === 'two-lines' ? __('Font Size for hours, minutes, seconds', 'advanced-gutenberg') : __('Font Size', 'advanced-gutenberg'),
                                value: timerSize,
                                min: 1,
                                max: 100,
                                step: 1,
                                onChange: function onChange(value) {
                                    return setAttributes({ timerSize: value });
                                }
                            }),
                            React.createElement(RangeControl, {
                                label: dateTimeDisplay === 'two-lines' ? __('Line Height for hours, minutes, seconds', 'advanced-gutenberg') : __('Line Height', 'advanced-gutenberg'),
                                value: timerLineHeight,
                                min: 1,
                                max: 100,
                                step: 1,
                                onChange: function onChange(value) {
                                    return setAttributes({ timerLineHeight: value });
                                }
                            }),
                            React.createElement(SelectControl, {
                                label: __('Separator', 'advanced-gutenberg'),
                                help: __('Separator between hours, minutes and seconds', 'advanced-gutenberg'),
                                value: separator,
                                options: [{ label: __('Colon', 'advanced-gutenberg'), value: 'colon' }, { label: __('Slash', 'advanced-gutenberg'), value: 'slash' }, { label: __('Hyphen', 'advanced-gutenberg'), value: 'hyphen' }, { label: __('Vertical line', 'advanced-gutenberg'), value: 'vertical-line' }, { label: __('Empty space', 'advanced-gutenberg'), value: 'space' }, { label: __('None', 'advanced-gutenberg'), value: 'none' }],
                                onChange: function onChange(value) {
                                    return setAttributes({ separator: value });
                                }
                            }),
                            React.createElement(TextControl, {
                                label: __('Time has come', 'advanced-gutenberg'),
                                help: __('Message to display when countdown comes to 00:00:00', 'advanced-gutenberg'),
                                value: timeHasCome,
                                onChange: function onChange(value) {
                                    return setAttributes({ timeHasCome: value });
                                }
                            }),
                            React.createElement(ToggleControl, {
                                label: __('Display days label', 'advanced-gutenberg'),
                                checked: displayDLabel,
                                onChange: function onChange() {
                                    return setAttributes({ displayDLabel: !displayDLabel });
                                }
                            }),
                            displayDLabel && React.createElement(
                                Fragment,
                                null,
                                React.createElement(TextControl, {
                                    label: __('Days label (plural)', 'advanced-gutenberg'),
                                    value: daysLabel,
                                    onChange: function onChange(value) {
                                        return setAttributes({ daysLabel: value });
                                    }
                                }),
                                React.createElement(TextControl, {
                                    label: __('Day label (singular)', 'advanced-gutenberg'),
                                    value: dayLabel,
                                    onChange: function onChange(value) {
                                        return setAttributes({ dayLabel: value });
                                    }
                                })
                            ),
                            React.createElement(ToggleControl, {
                                label: __('Display hours, minutes, seconds labels', 'advanced-gutenberg'),
                                checked: displayHMSLabels,
                                onChange: function onChange() {
                                    return setAttributes({ displayHMSLabels: !displayHMSLabels });
                                }
                            }),
                            displayHMSLabels && React.createElement(
                                Fragment,
                                null,
                                React.createElement(TextControl, {
                                    label: __('Hours label (plural)', 'advanced-gutenberg'),
                                    value: hoursLabel,
                                    onChange: function onChange(value) {
                                        return setAttributes({ hoursLabel: value });
                                    }
                                }),
                                React.createElement(TextControl, {
                                    label: __('Hour label (singular)', 'advanced-gutenberg'),
                                    value: hourLabel,
                                    onChange: function onChange(value) {
                                        return setAttributes({ hourLabel: value });
                                    }
                                }),
                                React.createElement(TextControl, {
                                    label: __('Minutes label (plural)', 'advanced-gutenberg'),
                                    value: minutesLabel,
                                    onChange: function onChange(value) {
                                        return setAttributes({ minutesLabel: value });
                                    }
                                }),
                                React.createElement(TextControl, {
                                    label: __('Minute label (singular)', 'advanced-gutenberg'),
                                    value: minuteLabel,
                                    onChange: function onChange(value) {
                                        return setAttributes({ minuteLabel: value });
                                    }
                                }),
                                React.createElement(TextControl, {
                                    label: __('Seconds label', 'advanced-gutenberg'),
                                    value: secondsLabel,
                                    onChange: function onChange(value) {
                                        return setAttributes({ secondsLabel: value });
                                    }
                                })
                            )
                        ),
                        React.createElement(
                            PanelBody,
                            { title: __('Event Settings', 'advanced-gutenberg') },
                            React.createElement(ToggleControl, {
                                label: __('Image', 'advanced-gutenberg'),
                                checked: displayImage,
                                onChange: function onChange() {
                                    return setAttributes({ displayImage: !displayImage });
                                }
                            }),
                            displayImage && React.createElement(RangeControl, {
                                label: __('Image Width (px)', 'advanced-gutenberg'),
                                value: imageWidth,
                                onChange: function onChange(value) {
                                    return setAttributes({ imageWidth: value });
                                },
                                min: 100,
                                max: 1500
                            }),
                            React.createElement(ToggleControl, {
                                label: __('Title', 'advanced-gutenberg'),
                                checked: displayTitle,
                                onChange: function onChange() {
                                    return setAttributes({ displayTitle: !displayTitle });
                                }
                            }),
                            displayTitle && React.createElement(SelectControl, {
                                label: __('Title Tag', 'advanced-gutenberg'),
                                value: titleTag,
                                options: htmlTags,
                                onChange: function onChange(value) {
                                    return setAttributes({ titleTag: value });
                                }
                            }),
                            React.createElement(ToggleControl, {
                                label: __('Event Date', 'advanced-gutenberg'),
                                checked: displayEventDate,
                                onChange: function onChange() {
                                    return setAttributes({ displayEventDate: !displayEventDate });
                                }
                            }),
                            displayEventDate && React.createElement(
                                Fragment,
                                null,
                                React.createElement(SelectControl, {
                                    label: __('Event Date Tag', 'advanced-gutenberg'),
                                    value: dateTag,
                                    options: htmlTags,
                                    onChange: function onChange(value) {
                                        return setAttributes({ dateTag: value });
                                    }
                                }),
                                React.createElement(SelectControl, {
                                    label: __('Date Format', 'advanced-gutenberg'),
                                    value: dateFormat,
                                    options: [{ label: __('May 3, 2021 5:10 pm', 'advanced-gutenberg'), value: 'MMMM D, YYYY h:mm a' }, { label: __('2021-05-03', 'advanced-gutenberg'), value: 'YYYY-MM-DD' }, { label: __('May 3 2021, 5:10 pm', 'advanced-gutenberg'), value: 'MMMM D YYYY, h:mm a' }, { label: __('May 3, 5:10 pm', 'advanced-gutenberg'), value: 'MMMM D, h:mm a' }, { label: __('May 3', 'advanced-gutenberg'), value: 'MMMM D' }, { label: __('Monday', 'advanced-gutenberg'), value: 'dddd' }, { label: __('2021/05/03 17:10', 'advanced-gutenberg'), value: 'YYYY/MM/DD HH:mm' }, { label: __('2021/05/03', 'advanced-gutenberg'), value: 'YYYY/MM/DD' }, { label: __('03/05/2021 17:10', 'advanced-gutenberg'), value: 'DD/MM/YYYY HH:mm' }, { label: __('03/05/2021', 'advanced-gutenberg'), value: 'DD/MM/YYYY' }, { label: __('05/03/2021 17:10', 'advanced-gutenberg'), value: 'MM/DD/YYYY HH:mm' }, { label: __('05/03/2021', 'advanced-gutenberg'), value: 'MM/DD/YYYY' }],
                                    onChange: function onChange(value) {
                                        return setAttributes({ dateFormat: value });
                                    }
                                })
                            ),
                            React.createElement(ToggleControl, {
                                label: __('Description', 'advanced-gutenberg'),
                                checked: displayDescription,
                                onChange: function onChange() {
                                    return setAttributes({ displayDescription: !displayDescription });
                                }
                            }),
                            React.createElement(ToggleControl, {
                                label: __('Button', 'advanced-gutenberg'),
                                checked: displayButton,
                                onChange: function onChange() {
                                    return setAttributes({ displayButton: !displayButton });
                                }
                            })
                        ),
                        React.createElement(PanelColorSettings, {
                            title: __('Color Settings', 'advanced-gutenberg'),
                            initialOpen: false,
                            colorSettings: [{
                                label: __('Title Color', 'advanced-gutenberg'),
                                value: titleColor,
                                onChange: function onChange(value) {
                                    return setAttributes({ titleColor: value === undefined ? '#333' : value });
                                }
                            }, {
                                label: __('Event Date Color', 'advanced-gutenberg'),
                                value: eventDateColor,
                                onChange: function onChange(value) {
                                    return setAttributes({ eventDateColor: value === undefined ? '#333' : value });
                                }
                            }, {
                                label: __('Description Color', 'advanced-gutenberg'),
                                value: descriptionColor,
                                onChange: function onChange(value) {
                                    return setAttributes({ descriptionColor: value === undefined ? '#333' : value });
                                }
                            }, {
                                label: __('Timer Color', 'advanced-gutenberg'),
                                value: timerColor,
                                onChange: function onChange(value) {
                                    return setAttributes({ timerColor: value === undefined ? '#333' : value });
                                }
                            }, {
                                label: __('Background Color', 'advanced-gutenberg'),
                                value: backgroundColor,
                                onChange: function onChange(value) {
                                    return setAttributes({ backgroundColor: value === undefined ? '#f2f2f2' : value });
                                }
                            }]
                        }),
                        React.createElement(
                            PanelBody,
                            { title: __('Padding', 'advanced-gutenberg'), initialOpen: false },
                            React.createElement(RangeControl, {
                                label: __('Padding top', 'advanced-gutenberg'),
                                value: paddingTop || '',
                                onChange: function onChange(value) {
                                    return setAttributes({ paddingTop: value });
                                },
                                min: 0,
                                max: 100
                            }),
                            React.createElement(RangeControl, {
                                label: __('Padding right', 'advanced-gutenberg'),
                                value: paddingRight || '',
                                onChange: function onChange(value) {
                                    return setAttributes({ paddingRight: value });
                                },
                                min: 0,
                                max: 100
                            }),
                            React.createElement(RangeControl, {
                                label: __('Padding bottom', 'advanced-gutenberg'),
                                value: paddingBottom || '',
                                onChange: function onChange(value) {
                                    return setAttributes({ paddingBottom: value });
                                },
                                min: 0,
                                max: 100
                            }),
                            React.createElement(RangeControl, {
                                label: __('Padding left', 'advanced-gutenberg'),
                                value: paddingLeft || '',
                                onChange: function onChange(value) {
                                    return setAttributes({ paddingLeft: value });
                                },
                                min: 0,
                                max: 100
                            })
                        ),
                        React.createElement(
                            PanelBody,
                            { title: __('Border', 'advanced-gutenberg'), initialOpen: false },
                            React.createElement(RangeControl, {
                                label: __('Border radius', 'advanced-gutenberg'),
                                value: borderRadius || '',
                                onChange: function onChange(value) {
                                    return setAttributes({ borderRadius: value });
                                },
                                min: 0,
                                max: 100
                            }),
                            React.createElement(SelectControl, {
                                label: __('Border style', 'advanced-gutenberg'),
                                value: borderStyle,
                                options: listBorderStyles,
                                onChange: function onChange(value) {
                                    return setAttributes({ borderStyle: value });
                                }
                            }),
                            borderStyle !== 'none' && React.createElement(
                                Fragment,
                                null,
                                React.createElement(PanelColorSettings, {
                                    title: __('Border Color', 'advanced-gutenberg'),
                                    initialOpen: false,
                                    colorSettings: [{
                                        label: __('Border Color', 'advanced-gutenberg'),
                                        value: borderColor,
                                        onChange: function onChange(value) {
                                            return setAttributes({ borderColor: value === undefined ? '#2196f3' : value });
                                        }
                                    }]
                                }),
                                React.createElement(RangeControl, {
                                    label: __('Border width', 'advanced-gutenberg'),
                                    value: borderWidth || '',
                                    onChange: function onChange(value) {
                                        return setAttributes({ borderWidth: value });
                                    },
                                    min: 0,
                                    max: 100
                                })
                            )
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: blockClassName },
                        React.createElement(
                            'div',
                            {
                                className: 'advgb-countdown-inner',
                                id: blockID,
                                style: {
                                    backgroundColor: backgroundColor,
                                    padding: paddingTop + 'px ' + paddingRight + 'px ' + paddingBottom + 'px ' + paddingLeft + 'px',
                                    borderWidth: borderWidth + 'px',
                                    borderColor: '' + borderColor,
                                    borderRadius: borderRadius + 'px',
                                    borderStyle: '' + borderStyle
                                }
                            },
                            displayImage && React.createElement(MediaUpload, {
                                allowedTypes: ["image"],
                                onSelect: function onSelect(media) {
                                    return setAttributes({
                                        imageURL: media.sizes.medium ? media.sizes.medium.url : media.sizes.full.url,
                                        imageID: media.id
                                    });
                                },
                                value: imageID,
                                render: function render(_ref) {
                                    var open = _ref.open;
                                    return React.createElement(
                                        'div',
                                        { className: 'advgb-countdown__image' },
                                        React.createElement(
                                            Tooltip,
                                            { text: __('Click to change image', 'advanced-gutenberg') },
                                            React.createElement(
                                                'span',
                                                null,
                                                React.createElement('img', {
                                                    onClick: open,
                                                    src: imageURL,
                                                    alt: title,
                                                    style: {
                                                        width: imageWidth ? imageWidth + 'px' : undefined
                                                    }
                                                })
                                            )
                                        )
                                    );
                                }
                            }),
                            displayTitle && React.createElement(
                                'div',
                                { className: 'advgb-countdown__title' },
                                React.createElement(RichText, {
                                    tagName: titleTag,
                                    onChange: function onChange(value) {
                                        return setAttributes({ title: value });
                                    },
                                    value: title,
                                    placeholder: __("Write a title for this event", 'advanced-gutenberg'),
                                    allowedFormats: ['core/bold', 'core/italic'],
                                    style: {
                                        color: titleColor
                                    }
                                })
                            ),
                            displayEventDate && React.createElement(
                                'div',
                                { 'class': 'advgb-countdown__date' },
                                React.createElement(RichText.Content, {
                                    tagName: dateTag,
                                    value: moment(dateTime).format(dateFormat),
                                    style: {
                                        color: eventDateColor
                                    }
                                })
                            ),
                            displayDescription && React.createElement(
                                'div',
                                { className: 'advgb-countdown__description' },
                                React.createElement(RichText, {
                                    tagName: 'p',
                                    onChange: function onChange(value) {
                                        return setAttributes({ description: value });
                                    },
                                    value: description,
                                    placeholder: __("Write a description for this event", 'advanced-gutenberg'),
                                    allowedFormats: ['core/bold', 'core/italic', 'core/link'],
                                    style: {
                                        color: descriptionColor
                                    }
                                })
                            ),
                            React.createElement(
                                'div',
                                {
                                    id: blockID + '-datetime',
                                    'data-advgbdatetime': moment(dateTime).format('YYYY/MM/DD HH:mm:ss'),
                                    'data-advgbdisplaydlabel': displayDLabel,
                                    'data-advgbdayslabel': daysLabel,
                                    'data-advgbdaylabel': dayLabel,
                                    'data-advgbdisplayhmslabels': displayHMSLabels,
                                    'data-advgbhourslabel': hoursLabel,
                                    'data-advgbhourlabel': hourLabel,
                                    'data-advgbminuteslabel': minutesLabel,
                                    'data-advgbminutelabel': minuteLabel,
                                    'data-advgbsecondslabel': secondsLabel,
                                    'data-advgbtimehascome': timeHasCome,
                                    style: {
                                        color: timerColor
                                    }
                                },
                                React.createElement(
                                    'span',
                                    { 'class': 'advgb-countdown__loading' },
                                    __('Loading...', 'advanced-gutenberg')
                                )
                            ),
                            displayButton && React.createElement(
                                'div',
                                { className: 'advgb-countdown__button' },
                                React.createElement(InnerBlocks, {
                                    template: buttonTemplate,
                                    templateLock: false,
                                    allowedBlocks: ['advgb/button']
                                })
                            )
                        ),
                        React.createElement(
                            'style',
                            null,
                            '#' + blockID + '.advgb-countdown-inner #' + blockID + '-datetime > span:not(.advgb-countdown__loading) {\n                                font-size: ' + timerSize + 'px;\n                                line-height: ' + timerLineHeight + 'px;\n                            }\n                            .advgb-countdown-display__two-lines #' + blockID + '.advgb-countdown-inner #' + blockID + '-datetime > span.advgb-countdown__days {\n                                font-size: ' + dayTimerSize + 'px;\n                                line-height: ' + dayTimerLineHeight + 'px;\n                            }'
                        )
                    )
                );
            }
        }]);

        return countdownEdit;
    }(Component);

    var blockIcon = React.createElement(
        'svg',
        { xmlns: 'http://www.w3.org/2000/svg', height: '24px', viewBox: '0 0 24 24', width: '24px', fill: '#000000' },
        React.createElement('path', { d: 'M0 0h24v24H0V0z', fill: 'none' }),
        React.createElement('path', { d: 'M15.07 1.01h-6v2h6v-2zm-4 13h2v-6h-2v6zm8.03-6.62l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.14 4.74 14.19 4 12.07 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.11-.74-4.06-1.97-5.61zm-7.03 12.62c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z' })
    );
    var blockAttrs = {
        blockID: {
            type: 'string'
        },
        dateTime: {
            type: 'string'
            // a default value will be set in componentDidMount
            // value has to be a string; a number as a string (e.g. new Date().getTime()) will still be considered a number and will become undefined
        },
        title: {
            type: 'string',
            default: "Event's title"
        },
        imageURL: {
            type: 'string',
            default: advgbBlocks.pluginUrl + '/assets/blocks/countdown/clock.svg'
        },
        imageID: {
            type: 'number'
        },
        imageWidth: {
            type: 'number',
            default: 150
        },
        displayImage: {
            type: 'boolean',
            default: true
        },
        displayTitle: {
            type: 'boolean',
            default: true
        },
        dateFormat: {
            type: 'string',
            default: 'MMMM D, YYYY h:mm a'
        },
        displayEventDate: {
            type: 'boolean',
            default: true
        },
        dayTimerSize: {
            type: 'number',
            default: 40
        },
        dayTimerLineHeight: {
            type: 'number',
            default: 48
        },
        timerSize: {
            type: 'number',
            default: 30
        },
        timerLineHeight: {
            type: 'number',
            default: 38
        },
        separator: {
            type: 'string',
            default: 'colon'
        },
        displayDLabel: {
            type: 'boolean',
            default: true
        },
        displayHMSLabels: {
            type: 'boolean',
            default: false
        },
        daysLabel: {
            type: 'string',
            default: 'days'
        },
        dayLabel: {
            type: 'string',
            default: 'day'
        },
        hoursLabel: {
            type: 'string',
            default: 'hours'
        },
        hourLabel: {
            type: 'string',
            default: 'hour'
        },
        minutesLabel: {
            type: 'string',
            default: 'minutes'
        },
        minuteLabel: {
            type: 'string',
            default: 'minute'
        },
        secondsLabel: {
            type: 'string',
            default: 'seconds'
        },
        timeHasCome: {
            type: 'string',
            default: "Time's Up"
        },
        displayDescription: {
            type: 'boolean',
            default: true
        },
        description: {
            type: 'string'
        },
        displayButton: {
            type: 'boolean',
            default: true
        },
        titleTag: {
            type: 'string',
            default: 'h2'
        },
        dateTag: {
            type: 'string',
            default: 'p'
        },
        dateTimeDisplay: {
            type: 'string',
            default: 'two-lines'
        },
        titleColor: {
            type: 'string',
            default: '#333'
        },
        eventDateColor: {
            type: 'string',
            default: '#333'
        },
        descriptionColor: {
            type: 'string',
            default: '#333'
        },
        timerColor: {
            type: 'string',
            default: '#333'
        },
        backgroundColor: {
            type: 'string',
            default: '#f2f2f2'
        },
        paddingTop: {
            type: 'number',
            default: 30
        },
        paddingRight: {
            type: 'number',
            default: 30
        },
        paddingBottom: {
            type: 'number',
            default: 30
        },
        paddingLeft: {
            type: 'number',
            default: 30
        },
        borderWidth: {
            type: 'number',
            default: 1
        },
        borderColor: {
            type: 'string',
            default: '#ccc'
        },
        borderStyle: {
            type: 'string',
            default: 'none'
        },
        borderRadius: {
            type: 'number',
            default: 0
        },
        alignment: {
            type: 'string',
            default: 'center'
        },
        changed: {
            type: 'boolean',
            default: false
        },
        isPreview: {
            type: 'boolean',
            default: false
        }
    };

    registerBlockType('advgb/countdown', {
        title: __('Countdown', 'advanced-gutenberg'),
        description: __('Easily create a customizable countdown.', 'advanced-gutenberg'),
        icon: {
            src: blockIcon,
            foreground: typeof advgbBlocks !== 'undefined' ? advgbBlocks.color : undefined
        },
        category: 'advgb-category',
        keywords: [__('event', 'advanced-gutenberg'), __('date', 'advanced-gutenberg')],
        attributes: blockAttrs,
        example: {
            attributes: {
                isPreview: true
            }
        },
        supports: {
            anchor: true
        },
        edit: countdownEdit,
        save: function save(_ref2) {
            var attributes = _ref2.attributes;
            var className = attributes.className,
                blockID = attributes.blockID,
                dateTime = attributes.dateTime,
                title = attributes.title,
                imageURL = attributes.imageURL,
                imageWidth = attributes.imageWidth,
                displayImage = attributes.displayImage,
                displayTitle = attributes.displayTitle,
                alignment = attributes.alignment,
                dateFormat = attributes.dateFormat,
                displayEventDate = attributes.displayEventDate,
                dayTimerSize = attributes.dayTimerSize,
                dayTimerLineHeight = attributes.dayTimerLineHeight,
                timerSize = attributes.timerSize,
                timerLineHeight = attributes.timerLineHeight,
                separator = attributes.separator,
                displayDLabel = attributes.displayDLabel,
                displayHMSLabels = attributes.displayHMSLabels,
                daysLabel = attributes.daysLabel,
                dayLabel = attributes.dayLabel,
                hoursLabel = attributes.hoursLabel,
                hourLabel = attributes.hourLabel,
                minutesLabel = attributes.minutesLabel,
                minuteLabel = attributes.minuteLabel,
                secondsLabel = attributes.secondsLabel,
                timeHasCome = attributes.timeHasCome,
                displayDescription = attributes.displayDescription,
                description = attributes.description,
                displayButton = attributes.displayButton,
                titleTag = attributes.titleTag,
                dateTag = attributes.dateTag,
                dateTimeDisplay = attributes.dateTimeDisplay,
                titleColor = attributes.titleColor,
                eventDateColor = attributes.eventDateColor,
                descriptionColor = attributes.descriptionColor,
                timerColor = attributes.timerColor,
                backgroundColor = attributes.backgroundColor,
                paddingTop = attributes.paddingTop,
                paddingRight = attributes.paddingRight,
                paddingBottom = attributes.paddingBottom,
                paddingLeft = attributes.paddingLeft,
                borderWidth = attributes.borderWidth,
                borderColor = attributes.borderColor,
                borderRadius = attributes.borderRadius,
                borderStyle = attributes.borderStyle;


            var blockClassName = [alignment && 'advgb-countdown-alignment__' + alignment, separator && 'advgb-countdown-separator__' + separator, dateTimeDisplay && 'advgb-countdown-display__' + dateTimeDisplay].filter(Boolean).join(' ');

            return React.createElement(
                'div',
                { className: blockClassName },
                React.createElement(
                    'div',
                    {
                        className: 'advgb-countdown-inner',
                        id: blockID,
                        style: {
                            backgroundColor: backgroundColor,
                            padding: paddingTop + 'px ' + paddingRight + 'px ' + paddingBottom + 'px ' + paddingLeft + 'px',
                            borderWidth: borderWidth + 'px',
                            borderColor: '' + borderColor,
                            borderRadius: borderRadius + 'px',
                            borderStyle: '' + borderStyle
                        }
                    },
                    displayImage && React.createElement(
                        'div',
                        { className: 'advgb-countdown__image' },
                        React.createElement(
                            'span',
                            null,
                            React.createElement('img', {
                                src: imageURL,
                                alt: title,
                                style: {
                                    width: imageWidth ? imageWidth + 'px' : undefined
                                }
                            })
                        )
                    ),
                    displayTitle && React.createElement(
                        'div',
                        { className: 'advgb-countdown__title' },
                        React.createElement(RichText.Content, {
                            tagName: titleTag,
                            value: title,
                            style: {
                                color: titleColor
                            }
                        })
                    ),
                    displayEventDate && React.createElement(
                        'div',
                        { 'class': 'advgb-countdown__date' },
                        React.createElement(RichText.Content, {
                            tagName: dateTag,
                            value: moment(dateTime).format(dateFormat),
                            style: {
                                color: eventDateColor
                            }
                        })
                    ),
                    displayDescription && React.createElement(
                        'div',
                        { className: 'advgb-countdown__description' },
                        React.createElement(RichText.Content, {
                            tagName: 'p',
                            value: description,
                            style: {
                                color: descriptionColor
                            }
                        })
                    ),
                    React.createElement(
                        'div',
                        {
                            id: blockID + '-datetime',
                            'data-advgbdatetime': moment(dateTime).format('YYYY/MM/DD HH:mm:ss'),
                            'data-advgbdisplaydlabel': displayDLabel,
                            'data-advgbdayslabel': daysLabel,
                            'data-advgbdaylabel': dayLabel,
                            'data-advgbdisplayhmslabels': displayHMSLabels,
                            'data-advgbhourslabel': hoursLabel,
                            'data-advgbhourlabel': hourLabel,
                            'data-advgbminuteslabel': minutesLabel,
                            'data-advgbminutelabel': minuteLabel,
                            'data-advgbsecondslabel': secondsLabel,
                            'data-advgbtimehascome': timeHasCome,
                            style: {
                                color: timerColor
                            }
                        },
                        React.createElement(
                            'span',
                            { 'class': 'advgb-countdown__loading' },
                            __('Loading...', 'advanced-gutenberg')
                        )
                    ),
                    displayButton && React.createElement(
                        'div',
                        { className: 'advgb-countdown__button' },
                        React.createElement(InnerBlocks.Content, null)
                    )
                ),
                React.createElement(
                    'style',
                    null,
                    '#' + blockID + '.advgb-countdown-inner #' + blockID + '-datetime > span:not(.advgb-countdown__loading) {\n                        font-size: ' + timerSize + 'px;\n                        line-height: ' + timerLineHeight + 'px;\n                    }\n                    .advgb-countdown-display__two-lines #' + blockID + '.advgb-countdown-inner #' + blockID + '-datetime > span.advgb-countdown__days {\n                        font-size: ' + dayTimerSize + 'px;\n                        line-height: ' + dayTimerLineHeight + 'px;\n                    }'
                )
            );
        }
    });
})(wp.i18n, wp.blocks, wp.element, wp.components, wp.blockEditor);

/***/ }),

/***/ "./src/assets/blocks/feature-list/block.jsx":
/*!**************************************************!*\
  !*** ./src/assets/blocks/feature-list/block.jsx ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function (wpI18n, wpBlocks, wpElement, wpComponents, wpBlockEditor) {
    wpBlockEditor = wp.blockEditor || wp.editor;
    var __ = wpI18n.__;
    var createElement = wpElement.createElement,
        Fragment = wpElement.Fragment,
        Component = wpElement.Component;
    var registerBlockType = wpBlocks.registerBlockType;
    var PanelBody = wpComponents.PanelBody,
        RangeControl = wpComponents.RangeControl,
        ToggleControl = wpComponents.ToggleControl;
    var _wpBlockEditor = wpBlockEditor,
        RichText = _wpBlockEditor.RichText,
        InspectorControls = _wpBlockEditor.InspectorControls,
        AlignmentToolbar = _wpBlockEditor.AlignmentToolbar,
        BlockControls = _wpBlockEditor.BlockControls,
        PanelColorSettings = _wpBlockEditor.PanelColorSettings,
        InnerBlocks = _wpBlockEditor.InnerBlocks;


    var previewImageData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAADyCAYAAABkv9hQAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDA2IDc5LmRhYmFjYmIsIDIwMjEvMDQvMTQtMDA6Mzk6NDQgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6YTIwZTkzMjItZmQ4NC00YjczLWJjNmItNDllZjNkNGM5OGMxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjhFQ0VBRTU4QzI3QTExRUJCMEM3OTRENjY5MDk0NERDIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjhFQ0VBRTU3QzI3QTExRUJCMEM3OTRENjY5MDk0NERDIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCAyMi4xIChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MzlmNjIxMTEtZTVkYi00NzdmLWFkYjYtZDVlMzgyNjJlOTNiIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOmEyMGU5MzIyLWZkODQtNGI3My1iYzZiLTQ5ZWYzZDRjOThjMSIv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';

    var featureListEdit = function (_Component) {
        _inherits(featureListEdit, _Component);

        function featureListEdit() {
            _classCallCheck(this, featureListEdit);

            return _possibleConstructorReturn(this, (featureListEdit.__proto__ || Object.getPrototypeOf(featureListEdit)).apply(this, arguments));
        }

        _createClass(featureListEdit, [{
            key: 'componentWillMount',
            value: function componentWillMount() {
                var _props = this.props,
                    attributes = _props.attributes,
                    setAttributes = _props.setAttributes;

                var currentBlockConfig = advgbDefaultConfig['advgb-feature-list'];

                // No override attributes of blocks inserted before
                if (attributes.changed !== true) {
                    if ((typeof currentBlockConfig === 'undefined' ? 'undefined' : _typeof(currentBlockConfig)) === 'object' && currentBlockConfig !== null) {
                        Object.keys(currentBlockConfig).map(function (attribute) {
                            if (typeof attributes[attribute] === 'boolean') {
                                attributes[attribute] = !!currentBlockConfig[attribute];
                            } else {
                                attributes[attribute] = currentBlockConfig[attribute];
                            }
                        });
                    }

                    // Finally set changed attribute to true, so we don't modify anything again
                    setAttributes({ changed: true });
                }
            }
        }, {
            key: 'componentDidMount',
            value: function componentDidMount() {
                var _props2 = this.props,
                    attributes = _props2.attributes,
                    setAttributes = _props2.setAttributes,
                    clientId = _props2.clientId;
                var blockID = attributes.blockID;


                setAttributes({ blockID: 'advgb-feature-list-' + clientId });
            }
        }, {
            key: 'render',
            value: function render() {
                var _props3 = this.props,
                    className = _props3.className,
                    attributes = _props3.attributes,
                    setAttributes = _props3.setAttributes;
                var isPreview = attributes.isPreview,
                    blockID = attributes.blockID,
                    alignment = attributes.alignment,
                    stripes = attributes.stripes,
                    stripesBackground1 = attributes.stripesBackground1,
                    stripesBackground2 = attributes.stripesBackground2,
                    iconSize = attributes.iconSize,
                    spacingIconText = attributes.spacingIconText,
                    lineHeight = attributes.lineHeight,
                    fontSize = attributes.fontSize,
                    paddingTop = attributes.paddingTop,
                    paddingRight = attributes.paddingRight,
                    paddingBottom = attributes.paddingBottom,
                    paddingLeft = attributes.paddingLeft;


                var featureTemplate = [['advgb/feature', {
                    content: 'Feature 1'
                }], ['advgb/feature', {
                    content: 'Feature 2'
                }], ['advgb/feature', {
                    content: 'Feature 3'
                }], ['advgb/feature', {
                    content: 'Feature 4',
                    icon: 'no',
                    iconColor: '#cf2e2e'
                }]];

                var listClassName = [blockID, className, alignment && 'advgb-feature-list-alignment__' + alignment].filter(Boolean).join(' ');

                return isPreview ? React.createElement('img', { alt: __('Feature List', 'advanced-gutenberg'), width: '100%', src: previewImageData }) : React.createElement(
                    Fragment,
                    null,
                    React.createElement(
                        BlockControls,
                        null,
                        React.createElement(AlignmentToolbar, {
                            value: alignment, onChange: function onChange(value) {
                                return setAttributes({ alignment: value === undefined ? 'center' : value });
                            } })
                    ),
                    React.createElement(
                        InspectorControls,
                        null,
                        React.createElement(
                            PanelBody,
                            {
                                title: __('Main Settings', 'advanced-gutenberg'),
                                initialOpen: true
                            },
                            React.createElement(ToggleControl, {
                                label: __('Stripes', 'advanced-gutenberg'),
                                checked: stripes,
                                onChange: function onChange() {
                                    return setAttributes({ stripes: !stripes });
                                }
                            }),
                            stripes && React.createElement(PanelColorSettings, {
                                title: __('Stripes Colors', 'advanced-gutenberg'),
                                initialOpen: false,
                                colorSettings: [{
                                    label: __('Odd Background', 'advanced-gutenberg'),
                                    value: stripesBackground1,
                                    onChange: function onChange(value) {
                                        return setAttributes({ stripesBackground1: value === undefined ? '#ffffff' : value });
                                    }
                                }, {
                                    label: __('Even Background', 'advanced-gutenberg'),
                                    value: stripesBackground2,
                                    onChange: function onChange(value) {
                                        return setAttributes({ stripesBackground2: value === undefined ? '#f2f2f2' : value });
                                    }
                                }]
                            })
                        ),
                        React.createElement(
                            PanelBody,
                            {
                                title: __('Feature Settings', 'advanced-gutenberg'),
                                initialOpen: true
                            },
                            React.createElement(RangeControl, {
                                label: __('Text size', 'advanced-gutenberg'),
                                value: fontSize || '',
                                onChange: function onChange(size) {
                                    return setAttributes({ fontSize: size });
                                },
                                min: 10,
                                max: 100,
                                beforeIcon: 'editor-textcolor',
                                allowReset: true
                            }),
                            React.createElement(RangeControl, {
                                label: __('Icon size', 'advanced-gutenberg'),
                                value: iconSize || '',
                                onChange: function onChange(size) {
                                    return setAttributes({ iconSize: size });
                                },
                                min: 10,
                                max: 100,
                                allowReset: true
                            }),
                            React.createElement(RangeControl, {
                                label: __('Line height', 'advanced-gutenberg'),
                                value: lineHeight || '',
                                onChange: function onChange(size) {
                                    return setAttributes({ lineHeight: size });
                                },
                                min: 0,
                                max: 100,
                                allowReset: true
                            }),
                            React.createElement(RangeControl, {
                                label: __('Spacing between icon and text', 'advanced-gutenberg'),
                                value: spacingIconText || '',
                                onChange: function onChange(size) {
                                    return setAttributes({ spacingIconText: size });
                                },
                                min: 0,
                                max: 100,
                                allowReset: true
                            }),
                            React.createElement(RangeControl, {
                                label: __('Padding top', 'advanced-gutenberg'),
                                value: paddingTop || '',
                                onChange: function onChange(value) {
                                    return setAttributes({ paddingTop: value });
                                },
                                min: 0,
                                max: 100
                            }),
                            React.createElement(RangeControl, {
                                label: __('Padding right', 'advanced-gutenberg'),
                                value: paddingRight || '',
                                onChange: function onChange(value) {
                                    return setAttributes({ paddingRight: value });
                                },
                                min: 0,
                                max: 100
                            }),
                            React.createElement(RangeControl, {
                                label: __('Padding bottom', 'advanced-gutenberg'),
                                value: paddingBottom || '',
                                onChange: function onChange(value) {
                                    return setAttributes({ paddingBottom: value });
                                },
                                min: 0,
                                max: 100
                            }),
                            React.createElement(RangeControl, {
                                label: __('Padding left', 'advanced-gutenberg'),
                                value: paddingLeft || '',
                                onChange: function onChange(value) {
                                    return setAttributes({ paddingLeft: value });
                                },
                                min: 0,
                                max: 100
                            })
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: listClassName },
                        React.createElement(InnerBlocks, {
                            template: featureTemplate,
                            templateLock: false,
                            allowedBlocks: ['advgb/feature'],
                            className: listClassName
                        })
                    ),
                    React.createElement(
                        'style',
                        null,
                        '.' + blockID + '.wp-block-advgb-feature-list .wp-block-advgb-feature {\n                                font-size: ' + fontSize + 'px;\n                                line-height: ' + lineHeight + 'px;\n                                padding: ' + paddingTop + 'px ' + paddingRight + 'px ' + paddingBottom + 'px ' + paddingLeft + 'px;\n                            }\n                            .' + blockID + '.wp-block-advgb-feature-list .wp-block-advgb-feature:before {\n                                font-size: ' + iconSize + 'px;\n                                margin-right: ' + spacingIconText + 'px;\n                            }'
                    ),
                    stripes && React.createElement(
                        'style',
                        null,
                        '.' + blockID + '.wp-block-advgb-feature-list .block-editor-block-list__layout > div:nth-child(2n+1) {\n                                background: ' + stripesBackground1 + ';\n                            }\n                            .' + blockID + '.wp-block-advgb-feature-list .block-editor-block-list__layout > div {\n                                background: ' + stripesBackground2 + ';\n                            }'
                    )
                );
            }
        }]);

        return featureListEdit;
    }(Component);

    var blockIcon = React.createElement(
        'svg',
        { xmlns: 'http://www.w3.org/2000/svg', 'enable-background': 'new 0 0 24 24', height: '24px', viewBox: '0 0 24 24', width: '24px', fill: '#000000' },
        React.createElement(
            'g',
            null,
            React.createElement('rect', { fill: 'none', height: '24', width: '24' })
        ),
        React.createElement(
            'g',
            null,
            React.createElement(
                'g',
                null,
                React.createElement('path', { d: 'M20,3H4C2.9,3,2,3.9,2,5v14c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V5 C22,3.9,21.1,3,20,3z M20,19H4V5h16V19z', 'fill-rule': 'evenodd' }),
                React.createElement('polygon', { 'fill-rule': 'evenodd', points: '19.41,10.42 17.99,9 14.82,12.17 13.41,10.75 12,12.16 14.82,15' }),
                React.createElement('rect', { 'fill-rule': 'evenodd', height: '2', width: '5', x: '5', y: '7' }),
                React.createElement('rect', { 'fill-rule': 'evenodd', height: '2', width: '5', x: '5', y: '11' }),
                React.createElement('rect', { 'fill-rule': 'evenodd', height: '2', width: '5', x: '5', y: '15' })
            )
        )
    );
    var blockAttrs = {
        blockID: {
            type: 'string'
        },
        alignment: {
            type: 'string',
            default: 'center'
        },
        stripes: {
            type: 'boolean',
            default: true
        },
        stripesBackground1: {
            type: 'string',
            default: '#ffffff'
        },
        stripesBackground2: {
            type: 'string',
            default: '#f2f2f2'
        },
        fontSize: {
            type: 'number',
            default: 18
        },
        iconSize: {
            type: 'number',
            default: 22
        },
        lineHeight: {
            type: 'number',
            default: 30
        },
        spacingIconText: {
            type: 'number',
            default: 5
        },
        paddingTop: {
            type: 'number',
            default: 15
        },
        paddingRight: {
            type: 'number',
            default: 20
        },
        paddingBottom: {
            type: 'number',
            default: 15
        },
        paddingLeft: {
            type: 'number',
            default: 20
        },
        changed: {
            type: 'boolean',
            default: false
        },
        isPreview: {
            type: 'boolean',
            default: false
        }
    };

    registerBlockType('advgb/feature-list', {
        title: __('Feature List', 'advanced-gutenberg'),
        description: __('Show your visitors a list of features. This is ideal for pricing and comparison tables.', 'advanced-gutenberg'),
        icon: {
            src: blockIcon,
            foreground: typeof advgbBlocks !== 'undefined' ? advgbBlocks.color : undefined
        },
        category: 'advgb-category',
        keywords: [__('feature list', 'advanced-gutenberg'), __('features', 'advanced-gutenberg'), __('list', 'advanced-gutenberg')],
        attributes: blockAttrs,
        example: {
            attributes: {
                isPreview: true
            }
        },
        edit: featureListEdit,
        save: function save(_ref) {
            var attributes = _ref.attributes;
            var className = attributes.className,
                alignment = attributes.alignment,
                stripes = attributes.stripes,
                stripesBackground1 = attributes.stripesBackground1,
                stripesBackground2 = attributes.stripesBackground2,
                iconSize = attributes.iconSize,
                spacingIconText = attributes.spacingIconText,
                lineHeight = attributes.lineHeight,
                fontSize = attributes.fontSize,
                paddingTop = attributes.paddingTop,
                paddingRight = attributes.paddingRight,
                paddingBottom = attributes.paddingBottom,
                paddingLeft = attributes.paddingLeft,
                blockID = attributes.blockID;


            var listClassName = [blockID, className, alignment && 'advgb-feature-list-alignment__' + alignment].filter(Boolean).join(' ');

            return React.createElement(
                'div',
                { className: listClassName },
                React.createElement(InnerBlocks.Content, null)
            );
        }
    });
})(wp.i18n, wp.blocks, wp.element, wp.components, wp.blockEditor);

/***/ }),

/***/ "./src/assets/blocks/feature-list/feature.jsx":
/*!****************************************************!*\
  !*** ./src/assets/blocks/feature-list/feature.jsx ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function (wpI18n, wpBlocks, wpElement, wpComponents, wpBlockEditor) {
    wpBlockEditor = wp.blockEditor || wp.editor;
    var __ = wpI18n.__;
    var createElement = wpElement.createElement,
        Fragment = wpElement.Fragment,
        Component = wpElement.Component;
    var registerBlockType = wpBlocks.registerBlockType;
    var PanelBody = wpComponents.PanelBody,
        BaseControl = wpComponents.BaseControl,
        Dashicon = wpComponents.Dashicon;
    var _wpBlockEditor = wpBlockEditor,
        RichText = _wpBlockEditor.RichText,
        InspectorControls = _wpBlockEditor.InspectorControls,
        ColorPalette = _wpBlockEditor.ColorPalette;


    var previewImageData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAADyCAYAAABkv9hQAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDA2IDc5LmRhYmFjYmIsIDIwMjEvMDQvMTQtMDA6Mzk6NDQgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6YTIwZTkzMjItZmQ4NC00YjczLWJjNmItNDllZjNkNGM5OGMxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjhFQ0VBRTVDQzI3QTExRUJCMEM3OTRENjY5MDk0NERDIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjhFQ0VBRTVCQzI3QTExRUJCMEM3OTRENjY5MDk0NERDIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCAyMi4xIChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NTg5YThiMDAtNDI3Ny00MmVkLTk1NDYtYWZlMGYwM2I4YzMwIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOmEyMGU5MzIyLWZkODQtNGI3My1iYzZiLTQ5ZWYzZDRjOThjMSIv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';

    var featureEdit = function (_Component) {
        _inherits(featureEdit, _Component);

        function featureEdit() {
            _classCallCheck(this, featureEdit);

            return _possibleConstructorReturn(this, (featureEdit.__proto__ || Object.getPrototypeOf(featureEdit)).apply(this, arguments));
        }

        _createClass(featureEdit, [{
            key: 'componentWillMount',
            value: function componentWillMount() {
                var _props = this.props,
                    attributes = _props.attributes,
                    setAttributes = _props.setAttributes;

                var currentBlockConfig = advgbDefaultConfig['advgb-feature'];

                // No override attributes of blocks inserted before
                if (attributes.changed !== true) {
                    if ((typeof currentBlockConfig === 'undefined' ? 'undefined' : _typeof(currentBlockConfig)) === 'object' && currentBlockConfig !== null) {
                        Object.keys(currentBlockConfig).map(function (attribute) {
                            if (typeof attributes[attribute] === 'boolean') {
                                attributes[attribute] = !!currentBlockConfig[attribute];
                            } else {
                                attributes[attribute] = currentBlockConfig[attribute];
                            }
                        });
                    }

                    // Finally set changed attribute to true, so we don't modify anything again
                    setAttributes({ changed: true });
                }
            }
        }, {
            key: 'componentDidMount',
            value: function componentDidMount() {
                var _props2 = this.props,
                    attributes = _props2.attributes,
                    setAttributes = _props2.setAttributes,
                    clientId = _props2.clientId;
                var blockID = attributes.blockID;


                setAttributes({ blockID: 'advgb-feature-' + clientId });
            }
        }, {
            key: 'render',
            value: function render() {
                var _props3 = this.props,
                    className = _props3.className,
                    attributes = _props3.attributes,
                    setAttributes = _props3.setAttributes;
                var isPreview = attributes.isPreview,
                    blockID = attributes.blockID,
                    content = attributes.content,
                    icon = attributes.icon,
                    iconColor = attributes.iconColor;


                var listIcons = [{ label: __('None', 'advanced-gutenberg'), value: '' }, { label: __('Pushpin', 'advanced-gutenberg'), value: 'admin-post' }, { label: __('Configuration', 'advanced-gutenberg'), value: 'admin-generic' }, { label: __('Flag', 'advanced-gutenberg'), value: 'flag' }, { label: __('Star', 'advanced-gutenberg'), value: 'star-filled' }, { label: __('Checkmark', 'advanced-gutenberg'), value: 'yes' }, { label: __('Checkmark 2', 'advanced-gutenberg'), value: 'yes-alt' }, { label: __('Checkmark 3', 'advanced-gutenberg'), value: 'saved' }, { label: __('Minus', 'advanced-gutenberg'), value: 'minus' }, { label: __('Minus 2', 'advanced-gutenberg'), value: 'remove' }, { label: __('Plus', 'advanced-gutenberg'), value: 'plus' }, { label: __('Plus 2', 'advanced-gutenberg'), value: 'insert' }, { label: __('Play', 'advanced-gutenberg'), value: 'controls-play' }, { label: __('Arrow right', 'advanced-gutenberg'), value: 'arrow-right-alt' }, { label: __('Arrow right 2', 'advanced-gutenberg'), value: 'arrow-right-alt2' }, { label: __('X Cross 2', 'advanced-gutenberg'), value: 'no' }, { label: __('X Cross', 'advanced-gutenberg'), value: 'dismiss' }, { label: __('Warning', 'advanced-gutenberg'), value: 'warning' }, { label: __('Help', 'advanced-gutenberg'), value: 'editor-help' }, { label: __('Info', 'advanced-gutenberg'), value: 'info' }, { label: __('Info 2', 'advanced-gutenberg'), value: 'info-outline' }, { label: __('Circle', 'advanced-gutenberg'), value: 'marker' }];

                var listClassName = [blockID, className, icon && 'advgb-feature-' + icon].filter(Boolean).join(' ');

                return isPreview ? React.createElement('img', { alt: __('Feature', 'advanced-gutenberg'), width: '100%', src: previewImageData }) : React.createElement(
                    Fragment,
                    null,
                    React.createElement(
                        InspectorControls,
                        null,
                        React.createElement(
                            PanelBody,
                            { title: __('Icon Settings', 'advanced-gutenberg') },
                            React.createElement(
                                BaseControl,
                                { label: __('List icon', 'advanced-gutenberg') },
                                React.createElement(
                                    'div',
                                    { className: 'advgb-icon-items-wrapper' },
                                    listIcons.map(function (item, index) {
                                        return React.createElement(
                                            'div',
                                            { className: 'advgb-icon-item h20', key: index },
                                            React.createElement(
                                                'span',
                                                { onClick: function onClick() {
                                                        return setAttributes({ icon: item.value });
                                                    },
                                                    className: [item.value === icon && 'active', item.value === '' && 'remove-icon'].filter(Boolean).join(' ')
                                                },
                                                React.createElement(Dashicon, { icon: item.value })
                                            )
                                        );
                                    })
                                )
                            ),
                            icon && React.createElement(
                                Fragment,
                                null,
                                React.createElement(
                                    PanelBody,
                                    {
                                        title: [__('Icon color', 'advanced-gutenberg'), React.createElement('span', { key: 'advgb-list-icon-color',
                                            className: 'dashicons dashicons-' + icon,
                                            style: { color: iconColor, marginLeft: '10px' } })],
                                        initialOpen: true
                                    },
                                    React.createElement(ColorPalette, {
                                        value: iconColor,
                                        onChange: function onChange(value) {
                                            return setAttributes({ iconColor: value === undefined ? '#08ba79' : value });
                                        }
                                    })
                                )
                            )
                        )
                    ),
                    React.createElement(RichText, {
                        tagName: 'div',
                        onChange: function onChange(value) {
                            return setAttributes({ content: value });
                        },
                        value: content,
                        className: listClassName,
                        placeholder: __('Write a feature', 'advanced-gutenberg'),
                        allowedFormats: ['core/bold', 'core/italic', 'core/text-color']
                    }),
                    icon && React.createElement(
                        'style',
                        null,
                        '.' + blockID + ':before {\n                                    color: ' + iconColor + ';\n                                }'
                    )
                );
            }
        }]);

        return featureEdit;
    }(Component);

    var blockIcon = React.createElement(
        'svg',
        { xmlns: 'http://www.w3.org/2000/svg', height: '24px', viewBox: '0 0 24 24', width: '24px', fill: '#000000' },
        React.createElement('path', { d: 'M0 0h24v24H0V0z', fill: 'none' }),
        React.createElement('path', { d: 'M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z' })
    );
    var blockAttrs = {
        blockID: {
            type: 'string'
        },
        content: {
            type: 'string',
            default: ''
        },
        icon: {
            type: 'string',
            default: 'saved'
        },
        iconColor: {
            type: 'string',
            default: '#08ba79'
        },
        changed: {
            type: 'boolean',
            default: false
        },
        isPreview: {
            type: 'boolean',
            default: false
        }
    };

    registerBlockType('advgb/feature', {
        title: __('Feature', 'advanced-gutenberg'),
        description: __('Insert a feature inside Feature List block.', 'advanced-gutenberg'),
        icon: {
            src: blockIcon,
            foreground: typeof advgbBlocks !== 'undefined' ? advgbBlocks.color : undefined
        },
        parent: ['advgb/feature-list'],
        category: 'advgb-category',
        keywords: [__('features', 'advanced-gutenberg')],
        attributes: blockAttrs,
        example: {
            attributes: {
                isPreview: true
            }
        },
        edit: featureEdit,
        save: function save(_ref) {
            var attributes = _ref.attributes;
            var blockID = attributes.blockID,
                className = attributes.className,
                content = attributes.content,
                icon = attributes.icon,
                iconColor = attributes.iconColor;


            var listClassName = [blockID, className, icon && 'advgb-feature-' + icon].filter(Boolean).join(' ');

            return React.createElement(RichText.Content, {
                tagName: 'div',
                value: content,
                className: listClassName
            });
        }
    });
})(wp.i18n, wp.blocks, wp.element, wp.components, wp.blockEditor);

/***/ }),

/***/ "./src/assets/blocks/images-slider/pro.jsx":
/*!*************************************************!*\
  !*** ./src/assets/blocks/images-slider/pro.jsx ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


(function (wpI18n, wpHooks, wpBlockEditor, wpComponents, wpElement) {
    wpBlockEditor = wp.blockEditor || wp.editor;
    var addFilter = wpHooks.addFilter;
    var __ = wpI18n.__;
    var _wpBlockEditor = wpBlockEditor,
        InspectorControls = _wpBlockEditor.InspectorControls;
    var PanelBody = wpComponents.PanelBody,
        SelectControl = wpComponents.SelectControl,
        ToggleControl = wpComponents.ToggleControl,
        RangeControl = wpComponents.RangeControl;
    var Fragment = wpElement.Fragment;


    var htmlTags = [{ label: 'h1', value: 'h1' }, { label: 'h2', value: 'h2' }, { label: 'h3', value: 'h3' }, { label: 'h4', value: 'h4' }, { label: 'h5', value: 'h5' }, { label: 'h6', value: 'h6' }, { label: 'p', value: 'p' }, { label: 'div', value: 'div' }];

    // Add fields to sidebar
    addFilter('editor.BlockEdit', 'advgb/imagesSliderPro', function (BlockEdit) {
        return function (props) {
            return React.createElement(
                Fragment,
                null,
                React.createElement(BlockEdit, props),
                props.isSelected && props.name === 'advgb/images-slider' && React.createElement(
                    Fragment,
                    null,
                    React.createElement(
                        InspectorControls,
                        null,
                        React.createElement(
                            PanelBody,
                            { title: __('Autoplay & Content Tags', 'advanced-gutenberg'), initialOpen: true, className: 'advgb-pro-icon' },
                            React.createElement(ToggleControl, {
                                label: __('Autoplay', 'advanced-gutenberg'),
                                checked: props.attributes.autoplay,
                                onChange: function onChange() {
                                    return props.setAttributes({ autoplay: !props.attributes.autoplay });
                                }
                            }),
                            props.attributes.autoplay && React.createElement(RangeControl, {
                                label: __('Autoplay Speed', 'advanced-gutenberg'),
                                help: __('Change interval between slides in miliseconds.', 'advanced-gutenberg'),
                                min: 1000,
                                max: 20000,
                                value: props.attributes.autoplaySpeed,
                                onChange: function onChange(value) {
                                    return props.setAttributes({ autoplaySpeed: value });
                                }
                            }),
                            React.createElement(SelectControl, {
                                label: __('Title tag', 'advanced-gutenberg'),
                                value: props.attributes.titleTag,
                                options: htmlTags,
                                onChange: function onChange(value) {
                                    return props.setAttributes({ titleTag: value });
                                }
                            }),
                            React.createElement(SelectControl, {
                                label: __('Text tag', 'advanced-gutenberg'),
                                value: props.attributes.textTag,
                                options: htmlTags,
                                onChange: function onChange(value) {
                                    return props.setAttributes({ textTag: value });
                                }
                            })
                        )
                    )
                )
            );
        };
    });
})(wp.i18n, wp.hooks, wp.blockEditor, wp.components, wp.element);

/***/ }),

/***/ "./src/assets/blocks/pricing-table/block.jsx":
/*!***************************************************!*\
  !*** ./src/assets/blocks/pricing-table/block.jsx ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function (wpI18n, wpBlocks, wpElement, wpComponents, wpBlockEditor) {
    wpBlockEditor = wp.blockEditor || wp.editor;
    var __ = wpI18n.__;
    var createElement = wpElement.createElement,
        Fragment = wpElement.Fragment,
        Component = wpElement.Component;
    var registerBlockType = wpBlocks.registerBlockType;
    var PanelBody = wpComponents.PanelBody,
        RangeControl = wpComponents.RangeControl,
        ToggleControl = wpComponents.ToggleControl,
        SelectControl = wpComponents.SelectControl;
    var _wpBlockEditor = wpBlockEditor,
        RichText = _wpBlockEditor.RichText,
        InspectorControls = _wpBlockEditor.InspectorControls,
        AlignmentToolbar = _wpBlockEditor.AlignmentToolbar,
        BlockControls = _wpBlockEditor.BlockControls,
        PanelColorSettings = _wpBlockEditor.PanelColorSettings,
        InnerBlocks = _wpBlockEditor.InnerBlocks;


    var previewImageData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAADyCAYAAABkv9hQAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDA2IDc5LmRhYmFjYmIsIDIwMjEvMDQvMTQtMDA6Mzk6NDQgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6YTIwZTkzMjItZmQ4NC00YjczLWJjNmItNDllZjNkNGM5OGMxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjhFQ0VBRTYwQzI3QTExRUJCMEM3OTRENjY5MDk0NERDIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjhFQ0VBRTVGQzI3QTExRUJCMEM3OTRENjY5MDk0NERDIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCAyMi4xIChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MjUxZGIzMmUtMDg2Ni00NjU5LWE3NmQtNWM5NmY1Zjc0MGM2IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOmEyMGU5MzIyLWZkODQtNGI3My1iYzZiLTQ5ZWYzZDRjOThjMSIv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';

    var pricingTableEdit = function (_Component) {
        _inherits(pricingTableEdit, _Component);

        function pricingTableEdit() {
            _classCallCheck(this, pricingTableEdit);

            return _possibleConstructorReturn(this, (pricingTableEdit.__proto__ || Object.getPrototypeOf(pricingTableEdit)).apply(this, arguments));
        }

        _createClass(pricingTableEdit, [{
            key: 'componentWillMount',
            value: function componentWillMount() {
                var _props = this.props,
                    attributes = _props.attributes,
                    setAttributes = _props.setAttributes;

                var currentBlockConfig = advgbDefaultConfig['advgb-pricing-table'];

                // No override attributes of blocks inserted before
                if (attributes.changed !== true) {
                    if ((typeof currentBlockConfig === 'undefined' ? 'undefined' : _typeof(currentBlockConfig)) === 'object' && currentBlockConfig !== null) {
                        Object.keys(currentBlockConfig).map(function (attribute) {
                            if (typeof attributes[attribute] === 'boolean') {
                                attributes[attribute] = !!currentBlockConfig[attribute];
                            } else {
                                attributes[attribute] = currentBlockConfig[attribute];
                            }
                        });
                    }

                    // Finally set changed attribute to true, so we don't modify anything again
                    setAttributes({ changed: true });
                }
            }
        }, {
            key: 'componentDidMount',
            value: function componentDidMount() {
                var _props2 = this.props,
                    attributes = _props2.attributes,
                    setAttributes = _props2.setAttributes,
                    clientId = _props2.clientId;
                var blockID = attributes.blockID;


                setAttributes({ blockID: 'advgb-pricing-table-' + clientId });
            }
        }, {
            key: 'render',
            value: function render() {
                var _props3 = this.props,
                    className = _props3.className,
                    attributes = _props3.attributes,
                    setAttributes = _props3.setAttributes;
                var isPreview = attributes.isPreview,
                    blockID = attributes.blockID,
                    alignment = attributes.alignment,
                    heading = attributes.heading,
                    headingTag = attributes.headingTag,
                    displayHeading = attributes.displayHeading,
                    headingBorder = attributes.headingBorder,
                    price = attributes.price,
                    priceTag = attributes.priceTag,
                    priceBorder = attributes.priceBorder,
                    displayPrice = attributes.displayPrice,
                    priceSub = attributes.priceSub,
                    borderWidth = attributes.borderWidth,
                    borderColor = attributes.borderColor,
                    borderRadius = attributes.borderRadius,
                    borderStyle = attributes.borderStyle,
                    headingBackground = attributes.headingBackground,
                    priceBackground = attributes.priceBackground,
                    featuresBackground = attributes.featuresBackground,
                    headingPaddingTop = attributes.headingPaddingTop,
                    headingPaddingRight = attributes.headingPaddingRight,
                    headingPaddingBottom = attributes.headingPaddingBottom,
                    headingPaddingLeft = attributes.headingPaddingLeft,
                    pricePaddingTop = attributes.pricePaddingTop,
                    pricePaddingRight = attributes.pricePaddingRight,
                    pricePaddingBottom = attributes.pricePaddingBottom,
                    pricePaddingLeft = attributes.pricePaddingLeft,
                    featuresPaddingTop = attributes.featuresPaddingTop,
                    featuresPaddingRight = attributes.featuresPaddingRight,
                    featuresPaddingBottom = attributes.featuresPaddingBottom,
                    featuresPaddingLeft = attributes.featuresPaddingLeft;


                var featuresTemplate = [['advgb/feature-list'], ['advgb/button', {
                    text: __('Sign up', 'advanced-gutenberg'),
                    align: 'center',
                    marginTop: 30,
                    marginBottom: 30,
                    paddingTop: 6,
                    paddingRight: 15,
                    paddingBottom: 6,
                    paddingLeft: 15,
                    borderRadius: 6,
                    urlOpenNewTab: false
                }]];

                var htmlTags = [{ label: 'h1', value: 'h1' }, { label: 'h2', value: 'h2' }, { label: 'h3', value: 'h3' }, { label: 'h4', value: 'h4' }, { label: 'h5', value: 'h5' }, { label: 'h6', value: 'h6' }, { label: 'p', value: 'p' }, { label: 'div', value: 'div' }];

                var listBorderStyles = [{ label: __('None', 'advanced-gutenberg'), value: 'none' }, { label: __('Solid', 'advanced-gutenberg'), value: 'solid' }, { label: __('Dotted', 'advanced-gutenberg'), value: 'dotted' }, { label: __('Dashed', 'advanced-gutenberg'), value: 'dashed' }, { label: __('Double', 'advanced-gutenberg'), value: 'double' }, { label: __('Groove', 'advanced-gutenberg'), value: 'groove' }, { label: __('Ridge', 'advanced-gutenberg'), value: 'ridge' }, { label: __('Inset', 'advanced-gutenberg'), value: 'inset' }, { label: __('Outset', 'advanced-gutenberg'), value: 'outset' }];

                var blockClassName = ['advgb-pricing-table', alignment && 'advgb-pricing-table-alignment__' + alignment].filter(Boolean).join(' ');

                return isPreview ? React.createElement('img', { alt: __('Pricing Table', 'advanced-gutenberg'), width: '100%', src: previewImageData }) : React.createElement(
                    Fragment,
                    null,
                    React.createElement(
                        BlockControls,
                        null,
                        React.createElement(AlignmentToolbar, {
                            value: alignment, onChange: function onChange(value) {
                                return setAttributes({ alignment: value === undefined ? 'center' : value });
                            } })
                    ),
                    React.createElement(
                        InspectorControls,
                        null,
                        React.createElement(
                            PanelBody,
                            { title: __('Heading', 'advanced-gutenberg'), initialOpen: false },
                            React.createElement(ToggleControl, {
                                label: __('Display Heading', 'advanced-gutenberg'),
                                checked: displayHeading,
                                onChange: function onChange() {
                                    return setAttributes({ displayHeading: !displayHeading });
                                }
                            }),
                            displayHeading && React.createElement(
                                Fragment,
                                null,
                                React.createElement(SelectControl, {
                                    label: __('Heading Tag', 'advanced-gutenberg'),
                                    value: headingTag,
                                    options: htmlTags,
                                    onChange: function onChange(value) {
                                        return setAttributes({ headingTag: value });
                                    }
                                }),
                                borderWidth > 0 && React.createElement(ToggleControl, {
                                    label: __('Border Bottom', 'advanced-gutenberg'),
                                    checked: headingBorder,
                                    onChange: function onChange() {
                                        return setAttributes({ headingBorder: !headingBorder });
                                    }
                                }),
                                React.createElement(RangeControl, {
                                    label: __('Padding top', 'advanced-gutenberg'),
                                    value: headingPaddingTop || '',
                                    onChange: function onChange(value) {
                                        return setAttributes({ headingPaddingTop: value });
                                    },
                                    min: 0,
                                    max: 100
                                }),
                                React.createElement(RangeControl, {
                                    label: __('Padding right', 'advanced-gutenberg'),
                                    value: headingPaddingRight || '',
                                    onChange: function onChange(value) {
                                        return setAttributes({ headingPaddingRight: value });
                                    },
                                    min: 0,
                                    max: 100
                                }),
                                React.createElement(RangeControl, {
                                    label: __('Padding bottom', 'advanced-gutenberg'),
                                    value: headingPaddingBottom || '',
                                    onChange: function onChange(value) {
                                        return setAttributes({ headingPaddingBottom: value });
                                    },
                                    min: 0,
                                    max: 100
                                }),
                                React.createElement(RangeControl, {
                                    label: __('Padding left', 'advanced-gutenberg'),
                                    value: headingPaddingLeft || '',
                                    onChange: function onChange(value) {
                                        return setAttributes({ headingPaddingLeft: value });
                                    },
                                    min: 0,
                                    max: 100
                                })
                            )
                        ),
                        React.createElement(
                            PanelBody,
                            { title: __('Price', 'advanced-gutenberg') },
                            React.createElement(ToggleControl, {
                                label: __('Display Price', 'advanced-gutenberg'),
                                checked: displayPrice,
                                onChange: function onChange() {
                                    return setAttributes({ displayPrice: !displayPrice });
                                }
                            }),
                            displayPrice && React.createElement(
                                Fragment,
                                null,
                                React.createElement(SelectControl, {
                                    label: __('Price Tag', 'advanced-gutenberg'),
                                    value: priceTag,
                                    options: htmlTags,
                                    onChange: function onChange(value) {
                                        return setAttributes({ priceTag: value });
                                    }
                                }),
                                borderWidth > 0 && React.createElement(ToggleControl, {
                                    label: __('Border Bottom', 'advanced-gutenberg'),
                                    checked: priceBorder,
                                    onChange: function onChange() {
                                        return setAttributes({ priceBorder: !priceBorder });
                                    }
                                }),
                                React.createElement(RangeControl, {
                                    label: __('Padding top', 'advanced-gutenberg'),
                                    value: pricePaddingTop || '',
                                    onChange: function onChange(value) {
                                        return setAttributes({ pricePaddingTop: value });
                                    },
                                    min: 0,
                                    max: 100
                                }),
                                React.createElement(RangeControl, {
                                    label: __('Padding right', 'advanced-gutenberg'),
                                    value: pricePaddingRight || '',
                                    onChange: function onChange(value) {
                                        return setAttributes({ pricePaddingRight: value });
                                    },
                                    min: 0,
                                    max: 100
                                }),
                                React.createElement(RangeControl, {
                                    label: __('Padding bottom', 'advanced-gutenberg'),
                                    value: pricePaddingBottom || '',
                                    onChange: function onChange(value) {
                                        return setAttributes({ pricePaddingBottom: value });
                                    },
                                    min: 0,
                                    max: 100
                                }),
                                React.createElement(RangeControl, {
                                    label: __('Padding left', 'advanced-gutenberg'),
                                    value: pricePaddingLeft || '',
                                    onChange: function onChange(value) {
                                        return setAttributes({ pricePaddingLeft: value });
                                    },
                                    min: 0,
                                    max: 100
                                })
                            )
                        ),
                        React.createElement(
                            PanelBody,
                            { title: __('Features', 'advanced-gutenberg') },
                            React.createElement(RangeControl, {
                                label: __('Padding top', 'advanced-gutenberg'),
                                value: featuresPaddingTop || '',
                                onChange: function onChange(value) {
                                    return setAttributes({ featuresPaddingTop: value });
                                },
                                min: 0,
                                max: 100
                            }),
                            React.createElement(RangeControl, {
                                label: __('Padding right', 'advanced-gutenberg'),
                                value: featuresPaddingRight || '',
                                onChange: function onChange(value) {
                                    return setAttributes({ featuresPaddingRight: value });
                                },
                                min: 0,
                                max: 100
                            }),
                            React.createElement(RangeControl, {
                                label: __('Padding bottom', 'advanced-gutenberg'),
                                value: featuresPaddingBottom || '',
                                onChange: function onChange(value) {
                                    return setAttributes({ featuresPaddingBottom: value });
                                },
                                min: 0,
                                max: 100
                            }),
                            React.createElement(RangeControl, {
                                label: __('Padding left', 'advanced-gutenberg'),
                                value: featuresPaddingLeft || '',
                                onChange: function onChange(value) {
                                    return setAttributes({ featuresPaddingLeft: value });
                                },
                                min: 0,
                                max: 100
                            })
                        ),
                        React.createElement(
                            PanelBody,
                            { title: __('Border', 'advanced-gutenberg'), initialOpen: false },
                            React.createElement(RangeControl, {
                                label: __('Border radius', 'advanced-gutenberg'),
                                value: borderRadius || '',
                                onChange: function onChange(value) {
                                    return setAttributes({ borderRadius: value });
                                },
                                min: 0,
                                max: 100
                            }),
                            React.createElement(SelectControl, {
                                label: __('Border style', 'advanced-gutenberg'),
                                value: borderStyle,
                                options: listBorderStyles,
                                onChange: function onChange(value) {
                                    return setAttributes({ borderStyle: value });
                                }
                            }),
                            borderStyle !== 'none' && React.createElement(
                                Fragment,
                                null,
                                React.createElement(PanelColorSettings, {
                                    title: __('Border Color', 'advanced-gutenberg'),
                                    initialOpen: false,
                                    colorSettings: [{
                                        label: __('Border Color', 'advanced-gutenberg'),
                                        value: borderColor,
                                        onChange: function onChange(value) {
                                            return setAttributes({ borderColor: value === undefined ? '#2196f3' : value });
                                        }
                                    }]
                                }),
                                React.createElement(RangeControl, {
                                    label: __('Border width', 'advanced-gutenberg'),
                                    value: borderWidth || '',
                                    onChange: function onChange(value) {
                                        return setAttributes({ borderWidth: value });
                                    },
                                    min: 0,
                                    max: 100
                                })
                            )
                        ),
                        React.createElement(PanelColorSettings, {
                            title: __('Colors', 'advanced-gutenberg'),
                            initialOpen: false,
                            colorSettings: [{
                                label: __('Heading Background', 'advanced-gutenberg'),
                                value: headingBackground,
                                onChange: function onChange(value) {
                                    return setAttributes({ headingBackground: value === undefined ? '#f2f2f2' : value });
                                }
                            }, {
                                label: __('Price Background', 'advanced-gutenberg'),
                                value: priceBackground,
                                onChange: function onChange(value) {
                                    return setAttributes({ priceBackground: value === undefined ? '#fff' : value });
                                }
                            }, {
                                label: __('Features Background', 'advanced-gutenberg'),
                                value: featuresBackground,
                                onChange: function onChange(value) {
                                    return setAttributes({ featuresBackground: value === undefined ? '#fff' : value });
                                }
                            }]
                        })
                    ),
                    React.createElement(
                        'div',
                        { className: blockClassName },
                        React.createElement(
                            'div',
                            {
                                className: 'advgb-pricing-table-inner',
                                id: blockID
                            },
                            displayHeading && React.createElement(
                                'div',
                                { className: 'advgb-pricing-table__heading' },
                                React.createElement(RichText, {
                                    tagName: headingTag,
                                    onChange: function onChange(value) {
                                        return setAttributes({ heading: value });
                                    },
                                    value: heading,
                                    placeholder: __("Type a plan name", 'advanced-gutenberg'),
                                    allowedFormats: ['core/bold', 'core/italic', 'core/text-color']
                                })
                            ),
                            displayPrice && React.createElement(
                                'div',
                                { className: 'advgb-pricing-table__price' },
                                React.createElement(RichText, {
                                    tagName: priceTag,
                                    onChange: function onChange(value) {
                                        return setAttributes({ price: value });
                                    },
                                    value: price,
                                    placeholder: __("Type a price", 'advanced-gutenberg'),
                                    allowedFormats: ['core/bold', 'core/italic', 'core/superscript', 'core/subscript', 'core/strikethrough', 'core/text-color']
                                }),
                                React.createElement(RichText, {
                                    tagName: 'div',
                                    onChange: function onChange(value) {
                                        return setAttributes({ priceSub: value });
                                    },
                                    value: priceSub,
                                    className: 'advgb-pricing-table__pricesub',
                                    placeholder: __("Type a price subheading", 'advanced-gutenberg'),
                                    allowedFormats: ['core/bold', 'core/italic', 'core/superscript', 'core/subscript', 'core/strikethrough', 'core/text-color']
                                })
                            ),
                            React.createElement(
                                'div',
                                { className: 'advgb-pricing-table__features' },
                                React.createElement(InnerBlocks, {
                                    template: featuresTemplate,
                                    templateLock: false,
                                    allowedBlocks: ['advgb/feature-list', 'core/heading', 'core/paragraph', 'advgb/button', 'core/button', 'core/spacer', 'core/separator', 'advgb/icon']
                                })
                            )
                        )
                    ),
                    React.createElement(
                        'style',
                        null,
                        '#' + blockID + ' {\n                                border: ' + borderWidth + 'px ' + borderStyle + ' ' + borderColor + ';\n                                border-radius: ' + borderRadius + 'px;\n                            }\n                            #' + blockID + ' .advgb-pricing-table__heading {\n                                border-bottom: none;\n                                background: ' + headingBackground + ';\n                                padding: ' + headingPaddingTop + 'px ' + headingPaddingRight + 'px ' + headingPaddingBottom + 'px ' + headingPaddingLeft + 'px;\n                            }\n                            #' + blockID + ' .advgb-pricing-table__price {\n                                border-bottom: none;\n                                background: ' + priceBackground + ';\n                                padding: ' + pricePaddingTop + 'px ' + pricePaddingRight + 'px ' + pricePaddingBottom + 'px ' + pricePaddingLeft + 'px;\n                            }\n                            #' + blockID + ' .advgb-pricing-table__features {\n                                background: ' + featuresBackground + ';\n                                padding: ' + featuresPaddingTop + 'px ' + featuresPaddingRight + 'px ' + featuresPaddingBottom + 'px ' + featuresPaddingLeft + 'px;\n                            }'
                    ),
                    headingBorder && borderWidth > 0 && React.createElement(
                        'style',
                        null,
                        '#' + blockID + ' .advgb-pricing-table__heading {\n                                border-bottom: ' + borderWidth + 'px ' + borderStyle + ' ' + borderColor + ';\n                            }'
                    ),
                    priceBorder && borderWidth > 0 && React.createElement(
                        'style',
                        null,
                        '#' + blockID + ' .advgb-pricing-table__price {\n                                border-bottom: ' + borderWidth + 'px ' + borderStyle + ' ' + borderColor + ';\n                            }'
                    )
                );
            }
        }]);

        return pricingTableEdit;
    }(Component);

    var blockIcon = React.createElement(
        'svg',
        { xmlns: 'http://www.w3.org/2000/svg', 'enable-background': 'new 0 0 24 24', height: '24px', viewBox: '0 0 24 24', width: '24px', fill: '#000000' },
        React.createElement(
            'g',
            null,
            React.createElement('rect', { fill: 'none', height: '24', width: '24' }),
            React.createElement('path', { d: 'M14,2H6C4.9,2,4,2.9,4,4v16c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V8L14,2z M6,20V4h7v4h5v12H6z M11,19h2v-1h1 c0.55,0,1-0.45,1-1v-3c0-0.55-0.45-1-1-1h-3v-1h4v-2h-2V9h-2v1h-1c-0.55,0-1,0.45-1,1v3c0,0.55,0.45,1,1,1h3v1H9v2h2V19z' })
        )
    );
    var blockAttrs = {
        blockID: {
            type: 'string'
        },
        alignment: {
            type: 'string',
            default: 'center'
        },
        heading: {
            type: 'string',
            default: '<span class="has-inline-color has-white-color">Plan Heading</span>'
        },
        headingTag: {
            type: 'string',
            default: 'h3'
        },
        displayHeading: {
            type: 'boolean',
            default: true
        },
        headingBorder: {
            type: 'boolean',
            default: false
        },
        price: {
            type: 'string',
            default: '<span class="has-inline-color has-white-color">$99</span>'
        },
        priceTag: {
            type: 'string',
            default: 'h3'
        },
        priceBorder: {
            type: 'boolean',
            default: false
        },
        displayPrice: {
            type: 'boolean',
            default: true
        },
        priceSub: {
            type: 'string',
            default: '<sup><span class="has-inline-color has-white-color">yearly</span></sup>'
        },
        borderWidth: {
            type: 'number',
            default: 2
        },
        borderColor: {
            type: 'string',
            default: '#2196f3'
        },
        borderRadius: {
            type: 'number',
            default: 0
        },
        borderStyle: {
            type: 'string',
            default: 'solid'
        },
        headingBackground: {
            type: 'string',
            default: '#2196f3'
        },
        priceBackground: {
            type: 'string',
            default: '#82c2f7'
        },
        featuresBackground: {
            type: 'string',
            default: '#ffffff'
        },
        headingPaddingTop: {
            type: 'number',
            default: 20
        },
        headingPaddingRight: {
            type: 'number',
            default: 20
        },
        headingPaddingBottom: {
            type: 'number',
            default: 20
        },
        headingPaddingLeft: {
            type: 'number',
            default: 20
        },
        pricePaddingTop: {
            type: 'number',
            default: 20
        },
        pricePaddingRight: {
            type: 'number',
            default: 20
        },
        pricePaddingBottom: {
            type: 'number',
            default: 20
        },
        pricePaddingLeft: {
            type: 'number',
            default: 20
        },
        featuresPaddingTop: {
            type: 'number',
            default: 0
        },
        featuresPaddingRight: {
            type: 'number',
            default: 0
        },
        featuresPaddingBottom: {
            type: 'number',
            default: 0
        },
        featuresPaddingLeft: {
            type: 'number',
            default: 0
        },
        changed: {
            type: 'boolean',
            default: false
        },
        isPreview: {
            type: 'boolean',
            default: false
        }
    };

    registerBlockType('advgb/pricing-table', {
        title: __('Pricing Table', 'advanced-gutenberg'),
        description: __('Easily create a customizable pricing table.', 'advanced-gutenberg'),
        icon: {
            src: blockIcon,
            foreground: typeof advgbBlocks !== 'undefined' ? advgbBlocks.color : undefined
        },
        category: 'advgb-category',
        keywords: [__('pricing table', 'advanced-gutenberg'), __('pricing', 'advanced-gutenberg'), __('table', 'advanced-gutenberg')],
        attributes: blockAttrs,
        example: {
            attributes: {
                isPreview: true
            }
        },
        supports: {
            anchor: true
        },
        edit: pricingTableEdit,
        save: function save(_ref) {
            var attributes = _ref.attributes;
            var className = attributes.className,
                blockID = attributes.blockID,
                alignment = attributes.alignment,
                heading = attributes.heading,
                headingTag = attributes.headingTag,
                displayHeading = attributes.displayHeading,
                headingBorder = attributes.headingBorder,
                price = attributes.price,
                priceTag = attributes.priceTag,
                priceBorder = attributes.priceBorder,
                displayPrice = attributes.displayPrice,
                priceSub = attributes.priceSub,
                borderWidth = attributes.borderWidth,
                borderColor = attributes.borderColor,
                borderRadius = attributes.borderRadius,
                borderStyle = attributes.borderStyle,
                headingBackground = attributes.headingBackground,
                priceBackground = attributes.priceBackground,
                featuresBackground = attributes.featuresBackground,
                headingPaddingTop = attributes.headingPaddingTop,
                headingPaddingRight = attributes.headingPaddingRight,
                headingPaddingBottom = attributes.headingPaddingBottom,
                headingPaddingLeft = attributes.headingPaddingLeft,
                pricePaddingTop = attributes.pricePaddingTop,
                pricePaddingRight = attributes.pricePaddingRight,
                pricePaddingBottom = attributes.pricePaddingBottom,
                pricePaddingLeft = attributes.pricePaddingLeft,
                featuresPaddingTop = attributes.featuresPaddingTop,
                featuresPaddingRight = attributes.featuresPaddingRight,
                featuresPaddingBottom = attributes.featuresPaddingBottom,
                featuresPaddingLeft = attributes.featuresPaddingLeft;


            var blockClassName = ['advgb-pricing-table', alignment && 'advgb-pricing-table-alignment__' + alignment].filter(Boolean).join(' ');

            return React.createElement(
                'div',
                { className: blockClassName },
                React.createElement(
                    'div',
                    {
                        className: 'advgb-pricing-table-inner',
                        id: blockID },
                    displayHeading && React.createElement(
                        'div',
                        { className: 'advgb-pricing-table__heading' },
                        React.createElement(RichText.Content, {
                            tagName: headingTag,
                            value: heading
                        })
                    ),
                    displayPrice && React.createElement(
                        'div',
                        { className: 'advgb-pricing-table__price' },
                        React.createElement(RichText.Content, {
                            tagName: priceTag,
                            value: price
                        }),
                        React.createElement(RichText.Content, {
                            tagName: 'div',
                            value: priceSub,
                            className: 'advgb-pricing-table__pricesub'
                        })
                    ),
                    React.createElement(
                        'div',
                        { className: 'advgb-pricing-table__features' },
                        React.createElement(InnerBlocks.Content, null)
                    )
                )
            );
        }
    });
})(wp.i18n, wp.blocks, wp.element, wp.components, wp.blockEditor);

/***/ }),

/***/ "./src/assets/blocks/recent-posts/pro.jsx":
/*!************************************************!*\
  !*** ./src/assets/blocks/recent-posts/pro.jsx ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _components = __webpack_require__(/*! ../../../../../PublishPress-Blocks/src/assets/blocks/0-adv-components/components.jsx */ "../PublishPress-Blocks/src/assets/blocks/0-adv-components/components.jsx");

(function (wpI18n, wpHooks, wpBlockEditor, wpComponents, wpElement) {
    wpBlockEditor = wp.blockEditor || wp.editor;
    var addFilter = wpHooks.addFilter;
    var __ = wpI18n.__;
    var _wpBlockEditor = wpBlockEditor,
        InspectorControls = _wpBlockEditor.InspectorControls;
    var PanelBody = wpComponents.PanelBody,
        RangeControl = wpComponents.RangeControl,
        SelectControl = wpComponents.SelectControl,
        ToggleControl = wpComponents.ToggleControl,
        RadioControl = wpComponents.RadioControl,
        CheckboxControl = wpComponents.CheckboxControl;
    var Fragment = wpElement.Fragment;


    var DECORATION_STYLES = [{ label: __('Default', 'advanced-gutenberg'), value: 'default' }, { label: __('None', 'advanced-gutenberg'), value: 'none' }, { label: __('Underline', 'advanced-gutenberg'), value: 'underline' }];

    var BORDER_STYLES = [{ label: __('None', 'advanced-gutenberg'), value: 'none' }, { label: __('Solid', 'advanced-gutenberg'), value: 'solid' }, { label: __('Dotted', 'advanced-gutenberg'), value: 'dotted' }, { label: __('Dashed', 'advanced-gutenberg'), value: 'dashed' }, { label: __('Double', 'advanced-gutenberg'), value: 'double' }, { label: __('Groove', 'advanced-gutenberg'), value: 'groove' }, { label: __('Ridge', 'advanced-gutenberg'), value: 'ridge' }, { label: __('Inset', 'advanced-gutenberg'), value: 'inset' }, { label: __('Outset', 'advanced-gutenberg'), value: 'outset' }];

    // Set attributes
    addFilter('blocks.registerBlockType', 'advgb/registerRecentPostsProClass', function (settings) {
        if (settings.name === 'advgb/recent-posts') {
            settings.attributes = _extends(settings.attributes, {
                readMoreTextDecoration: {
                    type: 'string',
                    default: 'default'
                },
                readMoreTextDecorationH: {
                    type: 'string',
                    default: 'default'
                },
                readMoreTextColor: {
                    type: 'string'
                },
                readMoreTextColorH: {
                    type: 'string'
                },
                readMoreBgColor: {
                    type: 'string'
                },
                readMoreBgColorH: {
                    type: 'string'
                },
                readMoreBorderStyle: {
                    type: 'string',
                    default: 'none'
                },
                readMoreBorderColor: {
                    type: 'string',
                    default: '#000'
                },
                readMoreBorderColorH: {
                    type: 'string',
                    default: '#000'
                },
                readMoreBorderWidth: {
                    type: 'number',
                    default: 1
                },
                readMoreBorderRadius: {
                    type: 'number',
                    default: 0
                },
                readMorePaddingEnabled: {
                    type: 'boolean',
                    default: false
                },
                readMorePaddingTop: {
                    type: 'number',
                    default: 5
                },
                readMorePaddingBottom: {
                    type: 'number',
                    default: 5
                },
                readMorePaddingLeft: {
                    type: 'number',
                    default: 10
                },
                readMorePaddingRight: {
                    type: 'number',
                    default: 10
                },
                imageSizeEnabled: {
                    type: 'boolean',
                    default: false
                },
                imageWidth: {
                    type: 'number'
                },
                imageHeight: {
                    type: 'number'
                },
                imageWidthAuto: {
                    type: 'boolean',
                    default: true
                },
                imageHeightAuto: {
                    type: 'boolean',
                    default: true
                }
            });
        }

        return settings;
    });

    // Add fields to sidebar
    addFilter('editor.BlockEdit', 'advgb/recentPostsPro', function (BlockEdit) {
        return function (props) {
            return React.createElement(
                Fragment,
                null,
                React.createElement(BlockEdit, props),
                props.isSelected && props.name === 'advgb/recent-posts' && React.createElement(
                    Fragment,
                    null,
                    React.createElement(
                        InspectorControls,
                        null,
                        props.attributes.displayFeaturedImage && React.createElement(
                            PanelBody,
                            { title: __('Featured Image', 'advanced-gutenberg'), initialOpen: false, className: 'advgb-pro-icon' },
                            React.createElement(ToggleControl, {
                                label: __('Custom image size', 'advanced-gutenberg'),
                                checked: props.attributes.imageSizeEnabled,
                                onChange: function onChange() {
                                    return props.setAttributes({ imageSizeEnabled: !props.attributes.imageSizeEnabled });
                                }
                            }),
                            props.attributes.imageSizeEnabled && React.createElement(
                                Fragment,
                                null,
                                React.createElement(CheckboxControl, {
                                    label: __('auto', 'advanced-gutenberg'),
                                    checked: props.attributes.imageWidthAuto,
                                    onChange: function onChange(checked) {
                                        return props.setAttributes({ imageWidthAuto: !props.attributes.imageWidthAuto });
                                    },
                                    className: 'advgb-single-checkbox'
                                }),
                                React.createElement(RangeControl, {
                                    label: __('Image width (px)', 'advanced-gutenberg'),
                                    value: props.attributes.imageWidth || '',
                                    onChange: function onChange(value) {
                                        return props.setAttributes({ imageWidth: value });
                                    },
                                    min: 100,
                                    max: 2000,
                                    disabled: props.attributes.imageWidthAuto,
                                    help: props.attributes.imageWidthAuto ? __('Uncheck "auto" to set a custom width', 'advanced-gutenberg') : ''
                                }),
                                React.createElement(CheckboxControl, {
                                    label: __('auto', 'advanced-gutenberg'),
                                    checked: props.attributes.imageHeightAuto,
                                    onChange: function onChange() {
                                        return props.setAttributes({ imageHeightAuto: !props.attributes.imageHeightAuto });
                                    },
                                    className: 'advgb-single-checkbox'
                                }),
                                React.createElement(RangeControl, {
                                    label: __('Image height (px)', 'advanced-gutenberg'),
                                    value: props.attributes.imageHeight || '',
                                    onChange: function onChange(value) {
                                        return props.setAttributes({ imageHeight: value });
                                    },
                                    min: 100,
                                    max: 2000,
                                    disabled: props.attributes.imageHeightAuto,
                                    help: props.attributes.imageHeightAuto ? __('Uncheck "auto" to set a custom height', 'advanced-gutenberg') : ''
                                })
                            )
                        ),
                        props.attributes.displayReadMore && React.createElement(
                            Fragment,
                            null,
                            React.createElement(
                                PanelBody,
                                { title: __('Read more link', 'advanced-gutenberg'), initialOpen: false, className: 'advgb-pro-icon' },
                                React.createElement(SelectControl, {
                                    label: __('Text Decoration', 'advanced-gutenberg'),
                                    value: props.attributes.readMoreTextDecoration,
                                    options: DECORATION_STYLES,
                                    onChange: function onChange(value) {
                                        return props.setAttributes({ readMoreTextDecoration: value });
                                    }
                                }),
                                React.createElement(SelectControl, {
                                    label: __('Text Decoration (hover)', 'advanced-gutenberg'),
                                    value: props.attributes.readMoreTextDecorationH,
                                    options: DECORATION_STYLES,
                                    onChange: function onChange(value) {
                                        return props.setAttributes({ readMoreTextDecorationH: value });
                                    }
                                }),
                                React.createElement(_components.AdvColorControl, {
                                    label: __('Text Color', 'advanced-gutenberg'),
                                    value: props.attributes.readMoreTextColor,
                                    onChange: function onChange(value) {
                                        return props.setAttributes({ readMoreTextColor: value });
                                    }
                                }),
                                React.createElement(_components.AdvColorControl, {
                                    label: __('Text Color (hover)', 'advanced-gutenberg'),
                                    value: props.attributes.readMoreTextColorH,
                                    onChange: function onChange(value) {
                                        return props.setAttributes({ readMoreTextColorH: value });
                                    }
                                }),
                                React.createElement(_components.AdvColorControl, {
                                    label: __('Background Color', 'advanced-gutenberg'),
                                    value: props.attributes.readMoreBgColor,
                                    onChange: function onChange(value) {
                                        return props.setAttributes({ readMoreBgColor: value });
                                    }
                                }),
                                React.createElement(_components.AdvColorControl, {
                                    label: __('Background Color (hover)', 'advanced-gutenberg'),
                                    value: props.attributes.readMoreBgColorH,
                                    onChange: function onChange(value) {
                                        return props.setAttributes({ readMoreBgColorH: value });
                                    }
                                }),
                                React.createElement(SelectControl, {
                                    label: __('Border style', 'advanced-gutenberg'),
                                    value: props.attributes.readMoreBorderStyle,
                                    options: BORDER_STYLES,
                                    onChange: function onChange(value) {
                                        return props.setAttributes({ readMoreBorderStyle: value });
                                    }
                                }),
                                props.attributes.readMoreBorderStyle !== 'none' && React.createElement(
                                    Fragment,
                                    null,
                                    React.createElement(_components.AdvColorControl, {
                                        label: __('Border Color', 'advanced-gutenberg'),
                                        value: props.attributes.readMoreBorderColor,
                                        onChange: function onChange(value) {
                                            return props.setAttributes({ readMoreBorderColor: value });
                                        }
                                    }),
                                    React.createElement(_components.AdvColorControl, {
                                        label: __('Border Color (hover)', 'advanced-gutenberg'),
                                        value: props.attributes.readMoreBorderColorH,
                                        onChange: function onChange(value) {
                                            return props.setAttributes({ readMoreBorderColorH: value });
                                        }
                                    }),
                                    React.createElement(RangeControl, {
                                        label: __('Border width', 'advanced-gutenberg'),
                                        value: props.attributes.readMoreBorderWidth || '',
                                        onChange: function onChange(value) {
                                            return props.setAttributes({ readMoreBorderWidth: value });
                                        },
                                        min: 0,
                                        max: 10
                                    })
                                ),
                                React.createElement(RangeControl, {
                                    label: __('Border radius', 'advanced-gutenberg'),
                                    value: props.attributes.readMoreBorderRadius || '',
                                    onChange: function onChange(value) {
                                        return props.setAttributes({ readMoreBorderRadius: value });
                                    },
                                    min: 0,
                                    max: 100
                                }),
                                React.createElement(ToggleControl, {
                                    label: __('Enable padding', 'advanced-gutenberg'),
                                    checked: props.attributes.readMorePaddingEnabled,
                                    onChange: function onChange() {
                                        return props.setAttributes({ readMorePaddingEnabled: !props.attributes.readMorePaddingEnabled });
                                    }
                                }),
                                props.attributes.readMorePaddingEnabled && React.createElement(
                                    Fragment,
                                    null,
                                    React.createElement(RangeControl, {
                                        label: __('Padding top', 'advanced-gutenberg'),
                                        value: props.attributes.readMorePaddingTop || '',
                                        onChange: function onChange(value) {
                                            return props.setAttributes({ readMorePaddingTop: value });
                                        },
                                        min: 0,
                                        max: 50
                                    }),
                                    React.createElement(RangeControl, {
                                        label: __('Padding right', 'advanced-gutenberg'),
                                        value: props.attributes.readMorePaddingRight || '',
                                        onChange: function onChange(value) {
                                            return props.setAttributes({ readMorePaddingRight: value });
                                        },
                                        min: 0,
                                        max: 50
                                    }),
                                    React.createElement(RangeControl, {
                                        label: __('Padding bottom', 'advanced-gutenberg'),
                                        value: props.attributes.readMorePaddingBottom || '',
                                        onChange: function onChange(value) {
                                            return props.setAttributes({ readMorePaddingBottom: value });
                                        },
                                        min: 0,
                                        max: 50
                                    }),
                                    React.createElement(RangeControl, {
                                        label: __('Padding left', 'advanced-gutenberg'),
                                        value: props.attributes.readMorePaddingLeft || '',
                                        onChange: function onChange(value) {
                                            return props.setAttributes({ readMorePaddingLeft: value });
                                        },
                                        min: 0,
                                        max: 50
                                    })
                                )
                            )
                        )
                    )
                ),
                props.attributes.id && React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'style',
                        null,
                        '.' + props.attributes.id + ' .advgb-post-readmore a {\n                                ' + (props.attributes.readMoreTextColor ? 'color:' + props.attributes.readMoreTextColor + ';' : '') + '\n                                ' + (props.attributes.readMoreBgColor ? 'background:' + props.attributes.readMoreBgColor + ';' : '') + ';\n                                ' + (props.attributes.readMoreBorderRadius ? 'border-radius:' + props.attributes.readMoreBorderRadius + 'px;' : '') + '\n                                ' + (props.attributes.readMoreTextDecoration !== 'default' ? 'text-decoration:' + props.attributes.readMoreTextDecoration + ';' : '') + '\n                                ' + (props.attributes.readMorePaddingEnabled ? 'padding:' + props.attributes.readMorePaddingTop + 'px ' + props.attributes.readMorePaddingRight + 'px ' + props.attributes.readMorePaddingBottom + 'px ' + props.attributes.readMorePaddingLeft + 'px;' : '') + '\n                                ' + (props.attributes.readMoreBorderStyle !== 'none' ? 'border:' + props.attributes.readMoreBorderWidth + 'px ' + props.attributes.readMoreBorderStyle + ' ' + props.attributes.readMoreBorderColor + ';' : '') + '\n                            }\n                            .' + props.attributes.id + ' .advgb-post-readmore a:hover,\n                            .' + props.attributes.id + ' .advgb-post-readmore a:focus,\n                            .' + props.attributes.id + ' .advgb-post-readmore a:active {\n                                ' + (props.attributes.readMoreTextColorH ? 'color:' + props.attributes.readMoreTextColorH + ';' : '') + '\n                                ' + (props.attributes.readMoreBgColorH ? 'background:' + props.attributes.readMoreBgColorH + ';' : '') + '\n                                ' + (props.attributes.readMoreTextDecorationH !== 'default' ? 'text-decoration:' + props.attributes.readMoreTextDecorationH + ';' : '') + '\n                                ' + (props.attributes.readMoreBorderStyle !== 'none' ? 'border-color:' + props.attributes.readMoreBorderColorH + ';' : '') + '\n                            }',
                        props.attributes.imageSizeEnabled && '.' + props.attributes.id + '.advgb-recent-posts-block .advgb-recent-posts .advgb-recent-post .advgb-post-thumbnail img {\n                                    height: ' + (props.attributes.imageHeightAuto ? 'auto' : props.attributes.imageHeight + 'px') + ';\n                                    width: ' + (props.attributes.imageWidthAuto ? 'auto' : props.attributes.imageWidth + 'px') + ';\n                                }'
                    )
                )
            );
        };
    });
})(wp.i18n, wp.hooks, wp.blockEditor, wp.components, wp.element);

/***/ }),

/***/ "./src/assets/blocks/testimonial/pro.jsx":
/*!***********************************************!*\
  !*** ./src/assets/blocks/testimonial/pro.jsx ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

(function (wpI18n, wpHooks, wpBlockEditor, wpComponents, wpElement) {
    wpBlockEditor = wp.blockEditor || wp.editor;
    var addFilter = wpHooks.addFilter;
    var __ = wpI18n.__;
    var _wpBlockEditor = wpBlockEditor,
        InspectorControls = _wpBlockEditor.InspectorControls,
        BlockControls = _wpBlockEditor.BlockControls,
        AlignmentToolbar = _wpBlockEditor.AlignmentToolbar;
    var PanelBody = wpComponents.PanelBody,
        RangeControl = wpComponents.RangeControl;
    var Fragment = wpElement.Fragment;

    // Set attributes

    addFilter('blocks.registerBlockType', 'advgb/registerTestimonialProClass', function (settings) {
        if (settings.name === 'advgb/testimonial') {
            settings.attributes = _extends(settings.attributes, {
                nameSize: {
                    type: 'number'
                },
                positionSize: {
                    type: 'number'
                },
                descriptionSize: {
                    type: 'number'
                },
                align: {
                    type: 'string',
                    default: 'center'
                }
            });
        }

        return settings;
    });

    // Add fields to sidebar
    addFilter('editor.BlockEdit', 'advgb/testimonialPro', function (BlockEdit) {
        return function (props) {
            return React.createElement(
                Fragment,
                null,
                React.createElement(BlockEdit, props),
                props.isSelected && props.name === 'advgb/testimonial' && React.createElement(
                    Fragment,
                    null,
                    React.createElement(
                        BlockControls,
                        null,
                        React.createElement(AlignmentToolbar, {
                            value: props.attributes.align,
                            onChange: function onChange(value) {
                                return props.setAttributes({ align: value });
                            }
                        })
                    ),
                    React.createElement(
                        InspectorControls,
                        null,
                        React.createElement(
                            PanelBody,
                            { title: __('Content Size', 'advanced-gutenberg'), className: 'advgb-pro-icon' },
                            React.createElement(RangeControl, {
                                label: __('Name size', 'advanced-gutenberg'),
                                value: props.attributes.nameSize || '',
                                onChange: function onChange(value) {
                                    return props.setAttributes({ nameSize: value });
                                },
                                min: 10,
                                max: 100,
                                beforeIcon: 'editor-textcolor',
                                allowReset: true
                            }),
                            React.createElement(RangeControl, {
                                label: __('Position size', 'advanced-gutenberg'),
                                value: props.attributes.positionSize || '',
                                onChange: function onChange(value) {
                                    return props.setAttributes({ positionSize: value });
                                },
                                min: 10,
                                max: 100,
                                beforeIcon: 'editor-textcolor',
                                allowReset: true
                            }),
                            React.createElement(RangeControl, {
                                label: __('Description size', 'advanced-gutenberg'),
                                value: props.attributes.descriptionSize || '',
                                onChange: function onChange(value) {
                                    return props.setAttributes({ descriptionSize: value });
                                },
                                min: 10,
                                max: 100,
                                beforeIcon: 'editor-textcolor',
                                allowReset: true
                            })
                        )
                    )
                ),
                props.attributes.pid && React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'style',
                        null,
                        props.attributes.nameSize && '#' + props.attributes.pid + ' .advgb-testimonial .advgb-testimonial-name {\n                                    font-size: ' + props.attributes.nameSize + 'px;\n                                }',
                        props.attributes.positionSize && '#' + props.attributes.pid + ' .advgb-testimonial .advgb-testimonial-position {\n                                    font-size: ' + props.attributes.positionSize + 'px;\n                                }',
                        props.attributes.descriptionSize && '#' + props.attributes.pid + ' .advgb-testimonial .advgb-testimonial-desc {\n                                    font-size: ' + props.attributes.descriptionSize + 'px;\n                                }',
                        props.attributes.align && '#' + props.attributes.pid + ' .advgb-testimonial .advgb-testimonial-item {\n                                    text-align: ' + props.attributes.align + ';\n                                }'
                    )
                )
            );
        };
    });
})(wp.i18n, wp.hooks, wp.blockEditor, wp.components, wp.element);

/***/ }),

/***/ 0:
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** multi ./src/assets/blocks/advimage/pro.jsx ./src/assets/blocks/advlist/pro.jsx ./src/assets/blocks/count-up/pro.jsx ./src/assets/blocks/countdown/block.jsx ./src/assets/blocks/feature-list/block.jsx ./src/assets/blocks/feature-list/feature.jsx ./src/assets/blocks/images-slider/pro.jsx ./src/assets/blocks/pricing-table/block.jsx ./src/assets/blocks/recent-posts/pro.jsx ./src/assets/blocks/testimonial/pro.jsx ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./src/assets/blocks/advimage/pro.jsx */"./src/assets/blocks/advimage/pro.jsx");
__webpack_require__(/*! ./src/assets/blocks/advlist/pro.jsx */"./src/assets/blocks/advlist/pro.jsx");
__webpack_require__(/*! ./src/assets/blocks/count-up/pro.jsx */"./src/assets/blocks/count-up/pro.jsx");
__webpack_require__(/*! ./src/assets/blocks/countdown/block.jsx */"./src/assets/blocks/countdown/block.jsx");
__webpack_require__(/*! ./src/assets/blocks/feature-list/block.jsx */"./src/assets/blocks/feature-list/block.jsx");
__webpack_require__(/*! ./src/assets/blocks/feature-list/feature.jsx */"./src/assets/blocks/feature-list/feature.jsx");
__webpack_require__(/*! ./src/assets/blocks/images-slider/pro.jsx */"./src/assets/blocks/images-slider/pro.jsx");
__webpack_require__(/*! ./src/assets/blocks/pricing-table/block.jsx */"./src/assets/blocks/pricing-table/block.jsx");
__webpack_require__(/*! ./src/assets/blocks/recent-posts/pro.jsx */"./src/assets/blocks/recent-posts/pro.jsx");
module.exports = __webpack_require__(/*! ./src/assets/blocks/testimonial/pro.jsx */"./src/assets/blocks/testimonial/pro.jsx");


/***/ })

/******/ });
//# sourceMappingURL=blocks-pro.js.map