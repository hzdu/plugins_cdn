/**
 * WooCommerce Additional Variation Images And Swatches Pro - Addon 2
 *
 * This source file is subject to the GNU General Public License v3.0
 * that is bundled with this package in the file license.txt.
 * It is also available through the world-wide-web at this URL:
 * http://www.gnu.org/licenses/gpl-3.0.html
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to support@innovativewp.org so we can send you a copy immediately.
 *
 * @author    InnovativeWP
 * @copyright Copyright (c) 2021, InnovativeWP.
 * @license   http://www.gnu.org/licenses/gpl-3.0.html GNU General Public License v3.0
 */
/******/ (function(modules) { 
/******/ 	var installedModules = {};
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
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/******/ ({

/***/ 10:
/***/ (function(module, exports, __webpack_require__) {

jQuery(function ($) {
    Promise.resolve().then(function () {
        return __webpack_require__(11);
    }).then(function (_ref) {
        var VebVariationGalleryAdmin = _ref.VebVariationGalleryAdmin;

        VebVariationGalleryAdmin.COMPAdmin();

        $('#woocommerce-product-data').on('woocommerce_variations_loaded', function () {
            VebVariationGalleryAdmin.ImageUploader();
            VebVariationGalleryAdmin.Sortable();
        });

        $('#variable_product_options').on('woocommerce_variations_added', function () {
            VebVariationGalleryAdmin.ImageUploader();
            VebVariationGalleryAdmin.Sortable();
        });

        $('.dokan-product-variation-wrapper').on('dokan_variations_loaded dokan_variations_added', function () {
            VebVariationGalleryAdmin.ImageUploader();
            VebVariationGalleryAdmin.Sortable();
        });

        $(document).trigger('veb_variation_gallery_admin_loaded');
    });
}); 

 }),

/***/ 11:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VebVariationGalleryAdmin", function() { return VebVariationGalleryAdmin; });
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VebVariationGalleryAdmin = function ($) {
    var VebVariationGalleryAdmin = function () {
        function VebVariationGalleryAdmin() {
            _classCallCheck(this, VebVariationGalleryAdmin);
        }

        _createClass(VebVariationGalleryAdmin, null, [{
            key: 'COMPAdmin',
            value: function COMPAdmin() {
                if ($().comp_deactivate_popup) {
                    $().comp_deactivate_popup('veb-variation-gallery');
                }
            }
        }, {
            key: 'ImageUploader',
            value: function ImageUploader() {
                $(document).off('click', '.add-veb-variation-gallery-image');
                $(document).off('click', '.remove-veb-variation-gallery-image');

                $(document).on('click', '.add-veb-variation-gallery-image', this.AddImage);
                $(document).on('click', '.remove-veb-variation-gallery-image', this.RemoveImage);

                $('.woocommerce_variation').each(function () {
                    var optionsWrapper = $(this).find('.options:first');
                    var galleryWrapper = $(this).find('.veb-variation-gallery-wrapper');

                    galleryWrapper.insertBefore(optionsWrapper);
                });

                $(document).trigger('veb_variation_gallery_admin_image_uploader_attached', this);
            }
        }, {
            key: 'AddImage',
            value: function AddImage(event) {
                var _this = this;

                event.preventDefault();
                event.stopPropagation();

                var frame = void 0;
                var product_variation_id = $(this).data('product_variation_id');
                var loop = $(this).data('product_variation_loop');

                if (typeof wp !== 'undefined' && wp.media && wp.media.editor) {

                    if (frame) {
                        frame.open();
                        return;
                    }

                    frame = wp.media({
                        title: veb_variation_gallery_admin.choose_image,
                        button: {
                            text: veb_variation_gallery_admin.add_image
                        },
                        
                        library: {
                            type: ['image'] // [ 'video', 'image' ]
                        }
                        
                    });

                    frame.on('select', function () {

                        var images = frame.state().get('selection').toJSON();

                        var html = images.map(function (image) {
                            if (image.type === 'image') {
                                var id = image.id,
                                    _image$sizes = image.sizes;
                                _image$sizes = _image$sizes === undefined ? {} : _image$sizes;
                                var thumbnail = _image$sizes.thumbnail,
                                    full = _image$sizes.full;


                                var url = thumbnail ? thumbnail.url : full.url;
                                var template = wp.template('veb-variation-gallery-image');
                                return template({ id: id, url: url, product_variation_id: product_variation_id, loop: loop });
                            }
                        }).join('');

                        $(_this).parent().prev().find('.veb-variation-gallery-images').append(html);

                        VebVariationGalleryAdmin.Sortable();
                        VebVariationGalleryAdmin.VariationChanged(_this);

                        _.delay(function () {
                            VebVariationGalleryAdmin.ProNotice(_this);
                        }, 5);
                    });

                    frame.open();
                }
            }
        }, {
            key: 'VariationChanged',
            value: function VariationChanged($el) {

                $($el).closest('.woocommerce_variation').addClass('variation-needs-update');
                $('button.cancel-variation-changes, button.save-variation-changes').removeAttr('disabled');
                $('#variable_product_options').trigger('woocommerce_variations_input_changed');

                // Dokan Support
                $($el).closest('.dokan-product-variation-itmes').addClass('variation-needs-update');
                $('.dokan-product-variation-wrapper').trigger('dokan_variations_input_changed');

                $(document).trigger('veb_variation_gallery_admin_variation_changed', this);
            }
        }, {
            key: 'ProNotice',
            value: function ProNotice($el) {
                var total = $($el).closest('.veb-variation-gallery-wrapper').find('.veb-variation-gallery-images > li').length;
                $($el).closest('.veb-variation-gallery-wrapper').find('.veb-variation-gallery-images > li').each(function (i, el) {
                    if (i >= 2) {
                        $(el).remove();
                        $($el).closest('.veb-variation-gallery-wrapper').find('.veb-variation-gallery-pro-button').show();
                    } else {
                        $($el).closest('.veb-variation-gallery-wrapper').find('.veb-variation-gallery-pro-button').hide();
                    }
                });
            }
        }, {
            key: 'RemoveImage',
            value: function RemoveImage(event) {
                var _this2 = this;

                event.preventDefault();
                event.stopPropagation();

                // Variation Changed
                VebVariationGalleryAdmin.VariationChanged(this);

                _.delay(function () {
                    VebVariationGalleryAdmin.ProNotice(_this2);
                    $(_this2).parent().remove();
                }, 1);
            }
        }, {
            key: 'Sortable',
            value: function Sortable() {
                $('.veb-variation-gallery-images').sortable({
                    items: 'li.image',
                    cursor: 'move',
                    scrollSensitivity: 40,
                    forcePlaceholderSize: true,
                    forceHelperSize: false,
                    helper: 'clone',
                    opacity: 0.65,
                    placeholder: 'veb-variation-gallery-sortable-placeholder',
                    start: function start(event, ui) {
                        ui.item.css('background-color', '#F6F6F6');
                    },
                    stop: function stop(event, ui) {
                        ui.item.removeAttr('style');
                    },
                    update: function update() {
                        // Variation Changed
                        VebVariationGalleryAdmin.VariationChanged(this);
                    }
                });
            }
        }]);

        return VebVariationGalleryAdmin;
    }();

    return VebVariationGalleryAdmin;
}(jQuery);



/***/ }),

/***/ 9:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(10);


/***/ })

/******/ });