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

 "./src/js/VebVariationGalleryAdminPro.js":
 (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
 __webpack_require__.d(__webpack_exports__, {
   "VebVariationGalleryAdminPro": function() { return  VebVariationGalleryAdminPro; }
 });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var VebVariationGalleryAdminPro = function ($) {
  var VebVariationGalleryAdminPro = function () {
    function VebVariationGalleryAdminPro() {
      _classCallCheck(this, VebVariationGalleryAdminPro);
    }

    _createClass(VebVariationGalleryAdminPro, null, [{
      key: "ExtendMediaGrid",
      value: function ExtendMediaGrid() {
        (function (media) {
          wp.media.view.Attachment.prototype.template = wp.template('iwp_media_attachment');
        })(wp.media);
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
      key: "DefaultProductGallery",
      value: function DefaultProductGallery() {
        var product_gallery_frame;
        var $image_gallery_ids = $('#product_image_gallery');
        var $product_images = $('#product_images_container').find('ul.product_images');
        $('.add_product_images').off('click', 'a').on('click', 'a', function (event) {
          var $el = $(this);
          event.preventDefault(); 

          if (product_gallery_frame) {
            product_gallery_frame.open();
            return;
          }


          product_gallery_frame = wp.media.frames.product_gallery = wp.media({
            title: $el.data('choose'),
            button: {
              text: $el.data('update')
            },
            states: [new wp.media.controller.Library({
              title: $el.data('choose'),
              filterable: 'all',
              multiple: true
            })]
          });

          product_gallery_frame.on('select', function () {
            var selection = product_gallery_frame.state().get('selection');
            var attachment_ids = $image_gallery_ids.val();
            selection.map(function (attachment) {
              attachment = attachment.toJSON();

              if (attachment.id) {
                attachment_ids = attachment_ids ? attachment_ids + ',' + attachment.id : attachment.id;
                var attachment_image = attachment.sizes && attachment.sizes.thumbnail ? attachment.sizes.thumbnail.url : attachment.url;
                var css_class = 'image';

                if (attachment.veb_variation_gallery_video) {
                  css_class += ' video';
                }

                $product_images.append('<li class="' + css_class + '" data-attachment_id="' + attachment.id + '"><img src="' + attachment_image + '" /><ul class="actions"><li><a href="#" class="delete" title="' + $el.data('delete') + '">' + $el.data('text') + '</a></li></ul></li>');
              }
            });
            $image_gallery_ids.val(attachment_ids);
          });

          product_gallery_frame.open();
        });
      }
    }, {
      key: "ImageUploader",
      value: function ImageUploader() {
        $(document).off('click', '.add-veb-variation-gallery-image');
        $(document).off('click', '.veb-variation-gallery-images > li.image');
        $(document).off('click', '.veb_variation_gallery_media_video_popup_link');
        $(document).off('click', '.remove-veb-variation-gallery-image');
        $(document).on('click', '.add-veb-variation-gallery-image', this.AddImage);
        $(document).on('click', '.veb-variation-gallery-images > li.image', this.ChangeImage);
        $(document).on('click', '.remove-veb-variation-gallery-image', this.RemoveImage);
        $(document).on('click', '.veb_variation_gallery_media_video_popup_link', this.AttachmentVideoPopup);
        $('.woocommerce_variation').each(function () {
          var optionsWrapper = $(this).find('.options:first');
          var galleryWrapper = $(this).find('.veb-variation-gallery-wrapper');
          galleryWrapper.insertBefore(optionsWrapper);
        });
        $(document).trigger('veb_variation_gallery_admin_pro_image_uploader_attached', this);
      }
    }, {
      key: "ChangeImage",
      value: function ChangeImage(event) {
        var _this = this;

        event.preventDefault();
        event.stopPropagation();

        var frame;
        var product_variation_id = $(this).closest('.veb-variation-gallery-wrapper').data('product_variation_id');
        var selected = $(this).find('input.iwp_variation_id_input').val();
        var index = $(this).index(); 

        if (typeof wp !== 'undefined' && wp.media && wp.media.editor) {

          if (frame) {
            frame.open();
            return;
          } 


          frame = wp.media({
            title: veb_variation_gallery_admin.choose_image,
            button: {
              text: veb_variation_gallery_admin.update_image
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
                    veb_variation_gallery_video = image.veb_variation_gallery_video,
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
                  veb_variation_gallery_video: veb_variation_gallery_video
                });
              }
            }).join('');
            $(_this).after(html);

            _.delay(function () {
              $(_this).remove();
            }, 1);


            VebVariationGalleryAdminPro.Sortable();
            VebVariationGalleryAdminPro.VariationChanged(_this);
          });
          frame.on('open', function () {
            var selection = frame.state().get('selection');

            if (selected > 0) {
              var attachment = wp.media.attachment(selected);
              attachment.fetch();
              selection.add(attachment ? [attachment] : []);
            }
          });

          frame.open();
        }
      }
    }, {
      key: "AddImage",
      value: function AddImage(event) {
        var _this2 = this;

        event.preventDefault();
        event.stopPropagation();
        var frame;
        var product_variation_id = $(this).closest('.veb-variation-gallery-wrapper').data('product_variation_id');
        var selected = $(this).find('input.iwp_variation_id_input').val(); 

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

            },
            multiple: 'add'
          });
          frame.on('select', function () {
            var images = frame.state().get('selection').toJSON();
            var html = images.map(function (image) {
              if (image.type === 'image') {
                var id = image.id,
                    veb_variation_gallery_video = image.veb_variation_gallery_video,
                    _image$sizes2 = image.sizes;
                _image$sizes2 = _image$sizes2 === void 0 ? {} : _image$sizes2;
                var thumbnail = _image$sizes2.thumbnail,
                    full = _image$sizes2.full;
                var url = thumbnail ? thumbnail.url : full.url;
                var template = wp.template('veb-variation-gallery-image');
                return template({
                  id: id,
                  url: url,
                  product_variation_id: product_variation_id,
                  veb_variation_gallery_video: veb_variation_gallery_video
                });
              }
            }).join('');
            $(_this2).closest('.veb-variation-gallery-wrapper').find('.veb-variation-gallery-images').append(html);

            _.delay(function () {
              if ($(_this2).is('li.image')) {
                $(_this2).remove();
              }
            }, 1);


            VebVariationGalleryAdminPro.Sortable();
            VebVariationGalleryAdminPro.VariationChanged(_this2);
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
      key: "RemoveImage",
      value: function RemoveImage(event) {
        var _this3 = this;

        event.preventDefault();
        event.stopPropagation();

        VebVariationGalleryAdminPro.VariationChanged(this);

        _.delay(function () {
          $(_this3).parent().remove();
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
            VebVariationGalleryAdminPro.VariationChanged(this);
          }
        });
      }
    }, {
      key: "AttachmentVideoPopup",
      value: function AttachmentVideoPopup(event) {
        var _this4 = this;

        event.preventDefault();
        event.stopPropagation();
        var frame;

        if (typeof wp !== 'undefined' && wp.media && wp.media.editor) {
          if (frame) {
            frame.open();
            return;
          } 


          frame = wp.media({
            title: veb_variation_gallery_admin.choose_video,
            button: {
              text: veb_variation_gallery_admin.add_video
            },

            library: {
              type: ['video'] 

            },
            multiple: false
          });

          frame.on('select', function () {
            var video = frame.state().get('selection').first().toJSON();

            if (video.type === 'video') {
              $(_this4).closest('.compat-attachment-fields').find('.compat-field-veb_variation_gallery_media_video input').val(video.url).change();
            }
          });
          frame.on('open', function () {
            frame.$el.find('.media-frame-content').addClass('iwp-media-frame-modify');
          }); 

          frame.open();
        }
      }
    }]);

    return VebVariationGalleryAdminPro;
  }();

  return VebVariationGalleryAdminPro;
}(jQuery);



 }),

 "./src/js/backend.js":
 (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

jQuery(function ($) {
  Promise.resolve().then(function () {
    return _interopRequireWildcard(__webpack_require__("./src/js/VebVariationGalleryAdminPro.js"));
  }).then(function (_ref) {
    var VebVariationGalleryAdminPro = _ref.VebVariationGalleryAdminPro;
    VebVariationGalleryAdminPro.ExtendMediaGrid();
    VebVariationGalleryAdminPro.DefaultProductGallery();
    VebVariationGalleryAdminPro.ImageUploader();
    VebVariationGalleryAdminPro.HandleDiv();
    $('#woocommerce-product-data').on('woocommerce_variations_loaded', function () {
      VebVariationGalleryAdminPro.ImageUploader();
      VebVariationGalleryAdminPro.Sortable();
    });
    $('#variable_product_options').on('woocommerce_variations_added', function () {
      VebVariationGalleryAdminPro.ImageUploader();
      VebVariationGalleryAdminPro.Sortable();
    }); 

    $('.dokan-product-variation-wrapper').on('dokan_variations_loaded dokan_variations_added', function () {
      VebVariationGalleryAdminPro.ImageUploader();
      VebVariationGalleryAdminPro.Sortable();
    });
    $(document).trigger('veb_variation_gallery_pro_admin_loaded');
  });
});

 }),

 "./src/scss/backend.scss":
 (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);


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
 	
 	__webpack_require__.m = __webpack_modules__;
 	
 	!function() {
 		var deferred = [];
 		__webpack_require__.O = function(result, chunkIds, fn, priority) {
 			if(chunkIds) {
 				priority = priority || 0;
 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
 				deferred[i] = [chunkIds, fn, priority];
 				return;
 			}
 			var notFulfilled = Infinity;
 			for (var i = 0; i < deferred.length; i++) {
 				var chunkIds = deferred[i][0];
 				var fn = deferred[i][1];
 				var priority = deferred[i][2];
 				var fulfilled = true;
 				for (var j = 0; j < chunkIds.length; j++) {
 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every(function(key) { return __webpack_require__.O[key](chunkIds[j]); })) {
 						chunkIds.splice(j--, 1);
 					} else {
 						fulfilled = false;
 						if(priority < notFulfilled) notFulfilled = priority;
 					}
 				}
 				if(fulfilled) {
 					deferred.splice(i--, 1)
 					var r = fn();
 					if (r !== undefined) result = r;
 				}
 			}
 			return result;
 		};
 	}();
 	
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
 	
 	!function() {
 		var installedChunks = {
 			"/assets/js/admin": 0,
 			"assets/css/admin": 0
 		};
 		
 		__webpack_require__.O.j = function(chunkId) { return installedChunks[chunkId] === 0; };
 		
 		var webpackJsonpCallback = function(parentChunkLoadingFunction, data) {
 			var chunkIds = data[0];
 			var moreModules = data[1];
 			var runtime = data[2];
 			var moduleId, chunkId, i = 0;
 			if(chunkIds.some(function(id) { return installedChunks[id] !== 0; })) {
 				for(moduleId in moreModules) {
 					if(__webpack_require__.o(moreModules, moduleId)) {
 						__webpack_require__.m[moduleId] = moreModules[moduleId];
 					}
 				}
 				if(runtime) var result = runtime(__webpack_require__);
 			}
 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
 			for(;i < chunkIds.length; i++) {
 				chunkId = chunkIds[i];
 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
 					installedChunks[chunkId][0]();
 				}
 				installedChunks[chunkId] = 0;
 			}
 			return __webpack_require__.O(result);
 		}
 		
 		var chunkLoadingGlobal = self["webpackChunkveb_variation_gallery_pro"] = self["webpackChunkveb_variation_gallery_pro"] || [];
 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
 	}();

 	__webpack_require__.O(undefined, ["assets/css/admin"], function() { return __webpack_require__("./src/js/backend.js"); })
 	var __webpack_exports__ = __webpack_require__.O(undefined, ["assets/css/admin"], function() { return __webpack_require__("./src/scss/backend.scss"); })
 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
 	
 })()
;