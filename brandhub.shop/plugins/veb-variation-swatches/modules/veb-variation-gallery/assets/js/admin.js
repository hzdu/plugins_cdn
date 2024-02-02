/**
 * WooCommerce Additional Variation Images And Swatches Pro
 *
 * This source file is subject to the GNU General Public License v3.0
 * that is bundled with this package in the file license.txt.
 * It is also available through the world-wide-web at this URL:
 * http://www.gnu.org/licenses/gpl-3.0.html
 * 
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to support@innovativewp.org so we can send you a copy immediately.
 *
 * @author    InnovativeWP
 * @copyright Copyright (c) 2021, InnovativeWP.
 * @license   http://www.gnu.org/licenses/gpl-3.0.html GNU General Public License v3.0
 */

 (function() { 
 	var __webpack_modules__ = ({

 "./src/js/VebVariationGalleryAdmin.js":
 (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
 __webpack_require__.d(__webpack_exports__, {
   "VebVariationGalleryAdmin": function() { return  VebVariationGalleryAdmin; }
 });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }


var VebVariationGalleryAdmin = function ($) {
  var VebVariationGalleryAdmin = function () {
    function VebVariationGalleryAdmin() {
      _classCallCheck(this, VebVariationGalleryAdmin);
    }

    _createClass(VebVariationGalleryAdmin, null, [{
      key: "COMPAdmin",
      value: function COMPAdmin() {
        if ($().comp_deactivate_popup) {
          $().comp_deactivate_popup('veb-variation-gallery');
        }
      }
    }, {
      key: "HandleDiv",
      value: function HandleDiv() {
        $(document.body).on('click', '.veb-variation-gallery-wrapper .handle-div', function () {
          $(this).closest('.veb-variation-gallery-postbox').toggleClass('closed');
          var ariaExpandedValue = !$(this).closest('.veb-variation-gallery-postbox').hasClass('closed');
          $(this).attr('aria-expanded', ariaExpandedValue);
        });
      }
    }, {
      key: "ImageUploader",
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
      key: "AddImage",
      value: function AddImage(event) {
        var _this = this;

        event.preventDefault();
        event.stopPropagation();
        var frame;
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
              type: ['image'] 

            } 

          }); 

          frame.on('select', function () {
            var images = frame.state().get('selection').toJSON();
            var html = images.map(function (image) {
              if (image.type === 'image') {
                var id = image.id,
                    _image$sizes = image.sizes;
                _image$sizes = _image$sizes === void 0 ? {} : _image$sizes;
                var thumbnail = _image$sizes.thumbnail,
                    full = _image$sizes.full;
                var url = thumbnail ? thumbnail.url : full.url;
                var template = wp.template('veb-variation-gallery-image');
                return template({
                  id: id,
                  url: url,
                  product_variation_id: product_variation_id,
                  loop: loop
                });
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
      key: "VariationChanged",
      value: function VariationChanged($el) {
        $($el).closest('.woocommerce_variation').addClass('variation-needs-update');
        $('button.cancel-variation-changes, button.save-variation-changes').removeAttr('disabled');
        $('#variable_product_options').trigger('woocommerce_variations_input_changed');

        $($el).closest('.dokan-product-variation-itmes').addClass('variation-needs-update');
        $('.dokan-product-variation-wrapper').trigger('dokan_variations_input_changed');
        $(document).trigger('veb_variation_gallery_admin_variation_changed', this);
      }
    }, {
      key: "ProNotice",
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
      key: "RemoveImage",
      value: function RemoveImage(event) {
        var _this2 = this;

        event.preventDefault();
        event.stopPropagation(); 

        VebVariationGalleryAdmin.VariationChanged(this);

        _.delay(function () {
          VebVariationGalleryAdmin.ProNotice(_this2);
          $(_this2).parent().remove();
        }, 1);
      }
    }, {
      key: "Sortable",
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
            VebVariationGalleryAdmin.VariationChanged(this);
          }
        });
      }
    }]);

    return VebVariationGalleryAdmin;
  }();

  return VebVariationGalleryAdmin;
}(jQuery);



 })

 	});
 	var __webpack_module_cache__ = {};
 	
 	function __webpack_require__(moduleId) {
 		var cachedModule = __webpack_module_cache__[moduleId];
 		if (cachedModule !== undefined) {
 			return cachedModule.exports;
 		}
 		var module = __webpack_module_cache__[moduleId] = {
 			exports: {}
 		};
 	
 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
 	
 		return module.exports;
 	}
 	
 	!function() {
 		__webpack_require__.d = function(exports, definition) {
 			for(var key in definition) {
 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
 				}
 			}
 		};
 	}();
 	
 	!function() {
 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
 	}();
 	
 	!function() {
 		__webpack_require__.r = function(exports) {
 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
 			}
 			Object.defineProperty(exports, '__esModule', { value: true });
 		};
 	}();
 	
var __webpack_exports__ = {};
!function() {
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

jQuery(function ($) {
  Promise.resolve().then(function () {
    return _interopRequireWildcard(__webpack_require__("./src/js/VebVariationGalleryAdmin.js"));
  }).then(function (_ref) {
    var VebVariationGalleryAdmin = _ref.VebVariationGalleryAdmin;
    VebVariationGalleryAdmin.HandleDiv();
    VebVariationGalleryAdmin.ImageUploader();
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
}();
 })()
;