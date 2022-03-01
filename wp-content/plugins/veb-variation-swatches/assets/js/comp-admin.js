
/******/ (function(modules) { 
/******/ 	
/******/ 	var installedModules = {};
/******/
/******/ 	
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		module.l = true;
/******/
/******/ 		return module.exports;
/******/ 	}
/******/
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	return __webpack_require__(__webpack_require__.s = 12);
/******/ })
/************************************************************************/
/******/ ({

/***/ 12:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(13);


/***/ }),

/***/ 13:
/***/ (function(module, exports, __webpack_require__) {

(function ($) {

    Promise.resolve().then(function () {
        return __webpack_require__(14);
    }).then(function (_ref) {
        var COMPAdminHelper = _ref.COMPAdminHelper;


        $.fn.comp_live_feed = function () {
            COMPAdminHelper.LiveFeed();
        };

        $.fn.comp_deactivate_popup = function ($slug) {
            COMPAdminHelper.DeactivatePopup($slug);
        };
    });
})(jQuery);

/***/ }),

/***/ 14:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
 __webpack_require__.d(__webpack_exports__, "COMPAdminHelper", function() { return COMPAdminHelper; });
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }


var COMPAdminHelper = function ($) {
    var COMPAdminHelper = function () {
        function COMPAdminHelper() {
            _classCallCheck(this, COMPAdminHelper);
        }

        _createClass(COMPAdminHelper, null, [{
            key: 'LiveFeed',
            value: function LiveFeed() {
                $('.comp-live-feed-close').on('click', function (e) {
                    e.preventDefault();
                    var id = $(this).data('feed_id');
                    wp.ajax.send('comp_live_feed_close', {
                        data: { id: id }
                    });

                    $(this).parent().fadeOut('fast', function () {
                        $(this).remove();
                    });
                });
            }
        }, {
            key: 'ResetPopupData',
            value: function ResetPopupData(pluginslug) {
                var id = '#comp-plugin-deactivate-feedback-dialog-wrapper-' + pluginslug;
                var $button = $('.feedback-dialog-form-button-send', id);
                $button.prop('disabled', false).text($button.data('defaultvalue')).next().removeClass('visible');
            }
        }, {
            key: 'DeactivatePopup',
            value: function DeactivatePopup(pluginslug) {

                var id = '#comp-plugin-deactivate-feedback-dialog-wrapper-' + pluginslug;

                $('.wp-list-table.plugins').find('[data-slug="' + pluginslug + '"].active').each(function () {
                    var _this = this;

                    var deactivate_link = $(this).find('.deactivate a').prop('href');

                    $(this).data('deactivate_link', deactivate_link);

                    $(this).find('.deactivate a').on('click', function (event) {
                        event.preventDefault();

                        $(_this).COMPBackboneModal({
                            template: 'comp-deactive-feedback-dialog-' + pluginslug,
                            data: {
                                deactivate_link: deactivate_link,
                                plugin: pluginslug
                            }
                        });
                    });
                });
            }
        }]);

        return COMPAdminHelper;
    }();

    return COMPAdminHelper;
}(jQuery);



/***/ })

/******/ });