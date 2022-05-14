/*!
 * Additional Variation Images Gallery for WooCommerce - Pro v1.2.7 
 * 
 * Author: Emran Ahmed ( emran.bd.08@gmail.com ) 
 * Date: 9/4/2021, 1:28:34 AM
 * Released under the GPLv3 license.
 */
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(3);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

jQuery(function ($) {
  Promise.resolve().then(function () {
    return __webpack_require__(2);
  }).then(function (_ref) {
    var WooVariationGalleryAdminPro = _ref.WooVariationGalleryAdminPro;


    WooVariationGalleryAdminPro.GWPAdmin();

    WooVariationGalleryAdminPro.ExtendMediaGrid();
    WooVariationGalleryAdminPro.DefaultProductGallery();
    WooVariationGalleryAdminPro.ImageUploader();

    $('#woocommerce-product-data').on('woocommerce_variations_loaded', function () {
      WooVariationGalleryAdminPro.ImageUploader();
      WooVariationGalleryAdminPro.Sortable();
    });

    $('#variable_product_options').on('woocommerce_variations_added', function () {
      WooVariationGalleryAdminPro.ImageUploader();
      WooVariationGalleryAdminPro.Sortable();
    });

    // Dokan Pro Support
    $('.dokan-product-variation-wrapper').on('dokan_variations_loaded dokan_variations_added', function () {
      WooVariationGalleryAdminPro.ImageUploader();
      WooVariationGalleryAdminPro.Sortable();
    });

    $(document).trigger('woo_variation_gallery_pro_admin_loaded');
  });
}); // end of jquery main wrapper

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WooVariationGalleryAdminPro", function() { return WooVariationGalleryAdminPro; });
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*global woo_variation_gallery_admin */
var WooVariationGalleryAdminPro = function ($) {
  var WooVariationGalleryAdminPro = function () {
    function WooVariationGalleryAdminPro() {
      _classCallCheck(this, WooVariationGalleryAdminPro);
    }

    _createClass(WooVariationGalleryAdminPro, null, [{
      key: 'GWPAdmin',
      value: function GWPAdmin() {
        if ($().gwp_deactivate_popup) {
          $().gwp_deactivate_popup('woo-variation-gallery');
        }
      }
    }, {
      key: 'ExtendMediaGrid',
      value: function ExtendMediaGrid() {

        (function (media) {
          wp.media.view.Attachment.prototype.template = wp.template('wvg-attachment');
        })(wp.media);
      }
    }, {
      key: 'DefaultProductGallery',
      value: function DefaultProductGallery() {
        $('.add_product_images').off('click', 'a');

        // Product gallery file uploads.
        var product_gallery_frame = void 0;
        var $image_gallery_ids = $('#product_image_gallery');
        var $product_images = $('#product_images_container').find('ul.product_images');

        $('.add_product_images').on('click', 'a', function (event) {
          var $el = $(this);

          event.preventDefault();

          // If the media frame already exists, reopen it.
          if (product_gallery_frame) {
            product_gallery_frame.open();
            return;
          }

          // Create the media frame.
          product_gallery_frame = wp.media.frames.product_gallery = wp.media({
            // Set the title of the modal.
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

          // When an image is selected, run a callback.
          product_gallery_frame.on('select', function () {
            var selection = product_gallery_frame.state().get('selection');
            var attachment_ids = $image_gallery_ids.val();

            selection.map(function (attachment) {
              attachment = attachment.toJSON();

              if (attachment.id) {
                attachment_ids = attachment_ids ? attachment_ids + ',' + attachment.id : attachment.id;
                var attachment_image = attachment.sizes && attachment.sizes.thumbnail ? attachment.sizes.thumbnail.url : attachment.url;

                var css_class = 'image';
                if (attachment.woo_variation_gallery_video) {
                  css_class += ' video';
                }

                $product_images.append('<li class="' + css_class + '" data-attachment_id="' + attachment.id + '"><img src="' + attachment_image + '" /><ul class="actions"><li><a href="#" class="delete" title="' + $el.data('delete') + '">' + $el.data('text') + '</a></li></ul></li>');
              }
            });

            $image_gallery_ids.val(attachment_ids);
          });

          // Finally, open the modal.
          product_gallery_frame.open();
        });
      }
    }, {
      key: 'ImageUploader',
      value: function ImageUploader() {
        $(document).off('click', '.add-woo-variation-gallery-image');
        $(document).off('click', '.woo-variation-gallery-images > li.image');
        $(document).off('click', '.woo_variation_gallery_media_video_popup_link');
        $(document).off('click', '.remove-woo-variation-gallery-image');

        $(document).on('click', '.add-woo-variation-gallery-image', this.AddImage);
        $(document).on('click', '.woo-variation-gallery-images > li.image', this.ChangeImage);
        $(document).on('click', '.remove-woo-variation-gallery-image', this.RemoveImage);
        $(document).on('click', '.woo_variation_gallery_media_video_popup_link', this.AttachmentVideoPopup);

        $('.woocommerce_variation').each(function () {
          var optionsWrapper = $(this).find('.options:first');
          var galleryWrapper = $(this).find('.woo-variation-gallery-wrapper');
          galleryWrapper.insertBefore(optionsWrapper);
        });

        $(document).trigger('woo_variation_gallery_admin_pro_image_uploader_attached', this);
      }
    }, {
      key: 'ChangeImage',
      value: function ChangeImage(event) {
        var _this = this;

        event.preventDefault();
        event.stopPropagation();

        // console.log($(this))
        // console.log($(this).index())

        var frame = void 0;
        var product_variation_id = $(this).closest('.woo-variation-gallery-wrapper').data('product_variation_id');
        var selected = $(this).find('input.wvg_variation_id_input').val();
        var index = $(this).index();

        // console.log(product_variation_id)

        if (typeof wp !== 'undefined' && wp.media && wp.media.editor) {

          // If the media frame already exists, reopen it.
          if (frame) {
            frame.open();
            return;
          }

          // Create the media frame.
          frame = wp.media({
            title: woo_variation_gallery_admin.choose_image,
            button: {
              text: woo_variation_gallery_admin.update_image
            },
            /*states : [
                new wp.media.controller.Library({
                    title      : woo_variation_gallery_admin.choose_image,
                    filterable : 'all',
                    multiple   : 'add'
                })
            ],*/
            library: {
              type: ['image'] // [ 'video', 'image' ]
            }
            // multiple : true
            // multiple : 'add'
          });

          // When an image is selected, run a callback.
          frame.on('select', function () {

            var images = frame.state().get('selection').toJSON();

            var html = images.map(function (image) {
              if (image.type === 'image') {
                var id = image.id,
                    woo_variation_gallery_video = image.woo_variation_gallery_video,
                    _image$sizes = image.sizes;
                _image$sizes = _image$sizes === undefined ? {} : _image$sizes;
                var thumbnail = _image$sizes.thumbnail,
                    full = _image$sizes.full;


                var url = thumbnail ? thumbnail.url : full.url;
                var template = wp.template('woo-variation-gallery-image');
                return template({ id: id, url: url, product_variation_id: product_variation_id, woo_variation_gallery_video: woo_variation_gallery_video });
              }
            }).join('');

            // $(this).remove();
            //$(this).closest('.woo-variation-gallery-wrapper').find('.woo-variation-gallery-images').append(html);
            //$(this).closest('.woo-variation-gallery-wrapper').find('.woo-variation-gallery-images > li.image').eq(index).replaceWith(html);

            // $(this).closest('.woo-variation-gallery-wrapper').find('.woo-variation-gallery-images > li.image').eq(index).after(html);
            $(_this).after(html);

            _.delay(function () {
              $(_this).remove();
            }, 1);

            // Variation Changed
            WooVariationGalleryAdminPro.Sortable();
            WooVariationGalleryAdminPro.VariationChanged(_this);
          });

          frame.on('open', function () {
            var selection = frame.state().get('selection');

            if (selected > 0) {
              var attachment = wp.media.attachment(selected);
              attachment.fetch();
              selection.add(attachment ? [attachment] : []);
            }
          });

          // Finally, open the modal.
          frame.open();
        }
      }
    }, {
      key: 'AddImage',
      value: function AddImage(event) {
        var _this2 = this;

        event.preventDefault();
        event.stopPropagation();

        var frame = void 0;
        var product_variation_id = $(this).closest('.woo-variation-gallery-wrapper').data('product_variation_id');
        var selected = $(this).find('input.wvg_variation_id_input').val();

        // console.log(product_variation_id)

        if (typeof wp !== 'undefined' && wp.media && wp.media.editor) {

          // If the media frame already exists, reopen it.
          if (frame) {
            frame.open();
            return;
          }

          // Create the media frame.
          frame = wp.media({
            title: woo_variation_gallery_admin.choose_image,
            button: {
              text: woo_variation_gallery_admin.add_image
            },
            /*states : [
                new wp.media.controller.Library({
                    title      : woo_variation_gallery_admin.choose_image,
                    filterable : 'all',
                    multiple   : 'add'
                })
            ],*/
            library: {
              type: ['image'] // [ 'video', 'image' ]
            },
            // multiple : true
            multiple: 'add'
          });

          // When an image is selected, run a callback.
          frame.on('select', function () {

            var images = frame.state().get('selection').toJSON();

            var html = images.map(function (image) {
              if (image.type === 'image') {
                var id = image.id,
                    woo_variation_gallery_video = image.woo_variation_gallery_video,
                    _image$sizes2 = image.sizes;
                _image$sizes2 = _image$sizes2 === undefined ? {} : _image$sizes2;
                var thumbnail = _image$sizes2.thumbnail,
                    full = _image$sizes2.full;


                var url = thumbnail ? thumbnail.url : full.url;
                var template = wp.template('woo-variation-gallery-image');
                return template({ id: id, url: url, product_variation_id: product_variation_id, woo_variation_gallery_video: woo_variation_gallery_video });
              }
            }).join('');

            $(_this2).closest('.woo-variation-gallery-wrapper').find('.woo-variation-gallery-images').append(html);

            _.delay(function () {
              if ($(_this2).is('li.image')) {
                $(_this2).remove();
              }
            }, 1);

            // Variation Changed
            WooVariationGalleryAdminPro.Sortable();
            WooVariationGalleryAdminPro.VariationChanged(_this2);
          });

          /*
                          frame.on('open', () => {
                              let selection = frame.state().get('selection');
                               if (selected > 0) {
                                  let attachment = wp.media.attachment(selected);
                                  attachment.fetch();
                                  selection.add(attachment ? [attachment] : []);
                              }
                          });
          */

          // Finally, open the modal.
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

        $(document).trigger('woo_variation_gallery_admin_variation_changed', this);
      }
    }, {
      key: 'RemoveImage',
      value: function RemoveImage(event) {
        var _this3 = this;

        event.preventDefault();
        event.stopPropagation();

        // Variation Changed
        WooVariationGalleryAdminPro.VariationChanged(this);

        _.delay(function () {
          $(_this3).parent().remove();
        }, 1);
      }
    }, {
      key: 'Sortable',
      value: function Sortable() {
        $('.woo-variation-gallery-images').sortable({
          items: 'li.image',
          cursor: 'move',
          scrollSensitivity: 40,
          forcePlaceholderSize: true,
          forceHelperSize: false,
          helper: 'clone',
          opacity: 0.65,
          placeholder: 'woo-variation-gallery-sortable-placeholder',
          start: function start(event, ui) {
            ui.item.css('background-color', '#F6F6F6');
          },
          stop: function stop(event, ui) {
            ui.item.removeAttr('style');
          },
          update: function update() {
            // Variation Changed
            WooVariationGalleryAdminPro.VariationChanged(this);
          }
        });
      }
    }, {
      key: 'AttachmentVideoPopup',
      value: function AttachmentVideoPopup(event) {
        var _this4 = this;

        event.preventDefault();
        event.stopPropagation();

        var frame = void 0;
        if (typeof wp !== 'undefined' && wp.media && wp.media.editor) {

          // If the media frame already exists, reopen it.
          if (frame) {
            frame.open();
            return;
          }

          // Create the media frame.
          frame = wp.media({
            title: woo_variation_gallery_admin.choose_video,
            button: {
              text: woo_variation_gallery_admin.add_video
            },
            /*states : [
                new wp.media.controller.Library({
                    title      : woo_variation_gallery_admin.choose_image,
                    filterable : 'all',
                    multiple   : 'add'
                })
            ],*/
            library: {
              type: ['video'] // [ 'video', 'image' ]
            },
            multiple: false
          });

          // When an image is selected, run a callback.
          frame.on('select', function () {

            var video = frame.state().get('selection').first().toJSON();

            if (video.type === 'video') {
              $(_this4).closest('.compat-attachment-fields').find('.compat-field-woo_variation_gallery_media_video input').val(video.url).change();
            }
          });

          frame.on('open', function () {
            frame.$el.find('.media-frame-content').addClass('wvg-media-frame-modify');
          });

          // Finally, open the modal.
          frame.open();
        }
      }
    }]);

    return WooVariationGalleryAdminPro;
  }();

  return WooVariationGalleryAdminPro;
}(jQuery);



/***/ }),
/* 3 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);