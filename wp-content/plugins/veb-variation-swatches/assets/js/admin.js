/******/ (function(modules) { 
/******/ 	
/******/ 	var installedModules = {};
/******/
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		
/******/ 		module.l = true;
/******/
/******/ 		return module.exports;
/******/ 	}
/******/
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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
__webpack_require__(3);
__webpack_require__(4);
__webpack_require__(5);
__webpack_require__(6);
__webpack_require__(7);
module.exports = __webpack_require__(8);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

jQuery(function ($) {
    Promise.resolve().then(function () {
        return __webpack_require__(2);
    }).then(function (_ref) {
        var PluginHelper = _ref.PluginHelper;


        PluginHelper.COMPAdmin();
        PluginHelper.SelectWoo();
        PluginHelper.ColorPicker();
        PluginHelper.FieldDependency();
        PluginHelper.ImageUploader();
        PluginHelper.AttributeDialog();

        $('#woocommerce-product-data').on('woocommerce_variations_loaded', function () {
            PluginHelper.GalleryNotification();
        });

        $('#variable_product_options').on('woocommerce_variations_added', function () {
            PluginHelper.GalleryNotification();
        });

        $(document.body).on('woocommerce_added_attribute', function () {
            PluginHelper.SelectWoo();
            PluginHelper.ColorPicker();
            PluginHelper.ImageUploader();
            PluginHelper.AttributeDialog();
        });

        $(document.body).on('inwp_pro_product_swatches_variation_loaded', function () {
            PluginHelper.ColorPicker();
            PluginHelper.ImageUploader();
        });
    });
}); 

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
 __webpack_require__.d(__webpack_exports__, "PluginHelper", function() { return PluginHelper; });
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }


var PluginHelper = function ($) {
    var PluginHelper = function () {
        function PluginHelper() {
            _classCallCheck(this, PluginHelper);
        }

        _createClass(PluginHelper, null, [{
            key: 'COMPAdmin',
            value: function COMPAdmin() {
                if ($().comp_live_feed) {
                    $().comp_live_feed();
                }
                if ($().comp_deactivate_popup) {
                    $().comp_deactivate_popup('veb-variation-swatches');
                }
            }
        }, {
            key: 'GalleryNotification',
            value: function GalleryNotification() {
                $('.woocommerce_variation').each(function () {
                    var optionsWrapper = $(this).find('.options:first');
                    var galleryWrapper = $(this).find('.veb-variation-gallery-message');

                    galleryWrapper.insertBefore(optionsWrapper);
                });

                $('input.upload_image_id').on('change', function (event) {
                    var value = $.trim($(this).val());

                    if (value) {
                        $(this).closest('.data').find('.veb-variation-gallery-message').addClass('enable');
                    } else {
                        $(this).closest('.data').find('.veb-variation-gallery-message').removeClass('enable');
                    }
                });

                $('a.install-veb-variation-gallery-action').on('click', function (event) {
                    event.preventDefault();

                    var $parent = $(this).parent();

                    var installing = $parent.data('installing');
                    var activated = $parent.data('activated');
                    var nonce = $parent.data('nonce');

                    $parent.text(installing);
                    wp.ajax.send('install_veb_variation_gallery', {
                        data: {
                            'nonce': nonce
                        },
                        success: function success(response) {
                            $parent.text(activated);
                            _.delay(function () {
                                $('.woocommerce_variable_attributes .veb-variation-gallery-message').remove();
                            }, 5000);
                        },
                        error: function error(response) {
                            $parent.text(activated);
                            _.delay(function () {
                                $('.woocommerce_variable_attributes .veb-variation-gallery-message').remove();
                            }, 5000);
                        }
                    });
                });
            }
        }, {
            key: 'ImageUploader',
            value: function ImageUploader() {
                $(document).off('click', 'button.inwp_upload_image_button');
                $(document).on('click', 'button.inwp_upload_image_button', this.AddImage);
                $(document).on('click', 'button.inwp_remove_image_button', this.RemoveImage);
            }
        }, {
            key: 'AddImage',
            value: function AddImage(event) {
                var _this = this;

                event.preventDefault();
                event.stopPropagation();

                var file_frame = void 0;

                if (typeof wp !== 'undefined' && wp.media && wp.media.editor) {

                    if (file_frame) {
                        file_frame.open();
                        return;
                    }

                    file_frame = wp.media.frames.select_image = wp.media({
                        title: INWPPluginObject.media_title,
                        button: {
                            text: INWPPluginObject.button_title
                        },
                        multiple: false
                    });

                    file_frame.on('select', function () {
                        var attachment = file_frame.state().get('selection').first().toJSON();

                        if ($.trim(attachment.id) !== '') {

                            var url = typeof attachment.sizes.thumbnail === 'undefined' ? attachment.sizes.full.url : attachment.sizes.thumbnail.url;

                            $(_this).prev().val(attachment.id);
                            $(_this).closest('.meta-image-field-wrapper').find('img').attr('src', url);
                            $(_this).next().show();
                        }
                   
                    });

                    file_frame.on('open', function () {

                        var selection = file_frame.state().get('selection');
                        var current = $(_this).prev().val();
                        var attachment = wp.media.attachment(current);
                        attachment.fetch();
                        selection.add(attachment ? [attachment] : []);
                    });

                    file_frame.open();
                }
            }
        }, {
            key: 'RemoveImage',
            value: function RemoveImage(event) {

                event.preventDefault();
                event.stopPropagation();

                var placeholder = $(this).closest('.meta-image-field-wrapper').find('img').data('placeholder');
                $(this).closest('.meta-image-field-wrapper').find('img').attr('src', placeholder);
                $(this).prev().prev().val('');
                $(this).hide();
                return false;
            }
        }, {
            key: 'SelectWoo',
            value: function SelectWoo() {
                var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'select.inwp-selectwoo';

                if ($().selectWoo) {
                    $(selector).selectWoo({
                        allowClear: true
                    });
                }
            }
        }, {
            key: 'ColorPicker',
            value: function ColorPicker() {
                var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'input.inwp-color-picker';

                if ($().wpColorPicker) {
                    $(selector).wpColorPicker();
                }
            }
        }, {
            key: 'FieldDependency',
            value: function FieldDependency() {
                var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[data-inwpdepends]';

                if ($().FormFieldDependency) {
                    $(selector).FormFieldDependency();
                }
            }
        }, {
            key: 'savingDialog',
            value: function savingDialog($wrapper, $dialog, taxonomy) {

                var data = {};
                var term = '';


                $dialog.find('input, select').each(function () {
                    var key = $(this).attr('name');
                    var value = $(this).val();
                    if (key) {
                        if (key === 'tag_name') {
                            term = value;
                        } else {
                            data[key] = value;
                        }
                        $(this).val('');
                    }
                });

                if (term) {
                    $('.product_attributes').block({
                        message: null,
                        overlayCSS: {
                            background: '#FFFFFF',
                            opacity: 0.6
                        }
                    });

                    var ajax_data = _extends({
                        action: 'woocommerce_add_new_attribute',
                        taxonomy: taxonomy,
                        term: term,
                        security: woocommerce_admin_meta_boxes.add_attribute_nonce
                    }, data);

                    $.post(woocommerce_admin_meta_boxes.ajax_url, ajax_data, function (response) {

                        if (response.error) {
                 
                            window.alert(response.error);
                        } else if (response.slug) {
                  
                            $wrapper.find('select.attribute_values').append('<option value="' + response.term_id + '" selected="selected">' + response.name + '</option>');
                            $wrapper.find('select.attribute_values').change();
                        }

                        $('.product_attributes').unblock();
                    });
                } else {
                    $('.product_attributes').unblock();
                }
            }
        }, {
            key: 'AttributeDialog',
            value: function AttributeDialog() {

                var self = this;
                $('.product_attributes').on('click', 'button.inwp_add_new_attribute', function (event) {

                    event.preventDefault();

                    var $wrapper = $(this).closest('.woocommerce_attribute');
                    var attribute = $wrapper.data('taxonomy');
                    var title = $(this).data('dialog_title');

                    $('.inwp-attribute-dialog-for-' + attribute).dialog({
                        title: '',
                        dialogClass: 'wp-dialog inwp-attribute-dialog',
                        classes: {
                            "ui-dialog": "wp-dialog inwp-attribute-dialog"
                        },
                        autoOpen: false,
                        draggable: true,
                        width: 'auto',
                        modal: true,
                        resizable: false,
                        closeOnEscape: true,
                        position: {
                            my: "center",
                            at: "center",
                            of: window
                        },
                        open: function open() {
          
                            $('.ui-widget-overlay').bind('click', function () {
                                $('#attribute-dialog').dialog('close');
                            });
                        },
                        create: function create() {
        
                        }
                    }).dialog("option", "title", title).dialog("option", "buttons", [{
                        text: INWPPluginObject.dialog_save,
                        click: function click() {
                            self.savingDialog($wrapper, $(this), attribute);
                            $(this).dialog("close").dialog("destroy");
                        }
                    }, {
                        text: INWPPluginObject.dialog_cancel,
                        click: function click() {
                            $(this).dialog("close").dialog("destroy");
                        }
                    }]).dialog('open');
                });
            }
        }]);

        return PluginHelper;
    }();

    return PluginHelper;
}(jQuery);



/***/ }),
/* 3 */
/***/ (function(module, exports) {


/***/ }),
/* 4 */
/***/ (function(module, exports) {


/***/ }),
/* 5 */
/***/ (function(module, exports) {


/***/ }),
/* 6 */
/***/ (function(module, exports) {


/***/ }),
/* 7 */
/***/ (function(module, exports) {


/***/ }),
/* 8 */
/***/ (function(module, exports) {


/***/ })
/******/ ]);