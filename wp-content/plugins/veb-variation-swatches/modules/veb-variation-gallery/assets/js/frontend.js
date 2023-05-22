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

 "./src/js/VebVariationGallery.js":
 (function() {

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

;

(function (window) {
  'use strict';

  var Plugin = function ($) {
    return function () {
      function _class2(element, options, name) {
        _classCallCheck(this, _class2);

        _defineProperty(this, "defaults", {});

        this.name = name;
        this.element = element; 
        this.$element = $(element);
        this.settings = $.extend(true, {}, this.defaults, options); 
        this.$wrapper = this.$element.closest('.product');
        this.$variations_form = this.$wrapper.find('.variations_form');
        this.$attributeFields = this.$variations_form.find('.variations select');
        this.$target = this.$element.parent();
        this.$slider = $('.veb-variation-gallery-slider', this.$element);
        this.$thumbnail = $('.veb-variation-gallery-thumbnail-slider', this.$element);
        this.thumbnail_columns = this.$element.data('thumbnail_columns');
        this.product_id = this.$variations_form.data('product_id');
        this.is_variation_product = this.$variations_form.length > 0;
        this.initial_load = true;

        this.is_vertical = !!veb_variation_gallery_options.is_vertical;

        this.$element.addClass('iwp-loaded');
        this.defaultDimension();
        this.defaultGallery();

        if (!!veb_variation_gallery_options.enable_gallery_preload) {
          this.initVariationImagePreload();
        }

        this.initEvents();
        this.initVariationGallery();

        if (!this.is_variation_product) {
          this.imagesLoaded();
        }

        if (this.is_variation_product) {
          this.initSlick();
          this.initZoom();
          this.initPhotoswipe();
        }

        $(document).trigger('veb_variation_gallery_loaded', [this]);
      }

      _createClass(_class2, [{
        key: "init",
        value: function init() {
          var _this = this;

          return _.debounce(function () {
            _this.initSlick();

            _this.initZoom();

            _this.initPhotoswipe();
          }, 500);
        }
      }, {
        key: "getChosenAttributes",
        value: function getChosenAttributes() {
          var data = {};
          var count = 0;
          var chosen = 0;
          this.$attributeFields.each(function () {
            var attribute_name = $(this).data('attribute_name') || $(this).attr('name');
            var value = $(this).val() || '';

            if (value.length > 0) {
              chosen++;
            }

            count++;
            data[attribute_name] = value;
          });
          return {
            'count': count,
            'chosenCount': chosen,
            'data': data
          };
        }
      }, {
        key: "defaultDimension",
        value: function defaultDimension() {
          var _this2 = this;

          this.$element.css('min-height', this.$element.height()).css('min-width', this.$element.width());
          $(window).on('resize.iwp', _.debounce(function (event) {
            if (event.originalEvent) {
              _this2.$element.css('min-height', _this2.$element.height()).css('min-width', _this2.$element.width());
            }
          }, 300));
          $(window).on('resize.iwp', _.debounce(function (event) {
            if (event.originalEvent) {
              _this2.$element.css('min-height', '').css('min-width', '');
            }
          }, 100, {
            'leading': true,
            'trailing': false
          }));
        }
      }, {
        key: "dimension",
        value: function dimension() {
        }
      }, {
        key: "initEvents",
        value: function initEvents() {
          var _this3 = this;

          this.$element.on('veb_variation_gallery_slider_slick_init', function (event, gallery) {
            if (veb_variation_gallery_options.is_vertical) {
              $(window).on('resize', _this3.enableThumbnailPositionDebounce());

              _this3.$slider.on('setPosition', _this3.thumbnailHeightDebounce());

              _this3.$slider.on('afterChange', function () {
                _this3.thumbnailHeight();
              });
            }

            if (veb_variation_gallery_options.enable_thumbnail_slide) {
              var thumbnails = _this3.$thumbnail.find('.iwp-gallery-thumbnail-image').length;

              if (parseInt(veb_variation_gallery_options.gallery_thumbnails_columns) < thumbnails) {
                _this3.$thumbnail.find('.iwp-gallery-thumbnail-image').removeClass('current-thumbnail');

                _this3.initThumbnailSlick();
              } else {
                _this3.$slider.slick('slickSetOption', 'asNavFor', null, false);
              }
            }
          });
          this.$element.on('veb_variation_gallery_slick_destroy', function (event, gallery) {
            if (_this3.$thumbnail.hasClass('slick-initialized')) {
              _this3.$thumbnail.slick('unslick');
            }
          });
          this.$element.on('veb_variation_gallery_image_loaded', this.init());
        }
      }, {
        key: "initSlick",
        value: function initSlick() {
          var _this4 = this;

          if (this.$slider.is('.slick-initialized')) {
            this.$slider.slick('unslick');
          }

          this.$slider.off('init');
          this.$slider.off('beforeChange');
          this.$slider.off('afterChange');
          this.$element.trigger('veb_variation_gallery_before_init', [this]);

          this.$slider.on('init', function (event) {
            if (_this4.initial_load) {
              _this4.initial_load = false; 
            }
          }).on('beforeChange', function (event, slick, currentSlide, nextSlide) {
            _this4.$thumbnail.find('.iwp-gallery-thumbnail-image').not('.slick-slide').removeClass('current-thumbnail');

            _this4.$thumbnail.find('.iwp-gallery-thumbnail-image').not('.slick-slide').eq(nextSlide).addClass('current-thumbnail');
          }).on('afterChange', function (event, slick, currentSlide) {
            _this4.stopVideo(_this4.$slider);

            _this4.initZoomForTarget(currentSlide);
          }).slick();

          this.$thumbnail.find('.iwp-gallery-thumbnail-image').not('.slick-slide').first().addClass('current-thumbnail');
          this.$thumbnail.find('.iwp-gallery-thumbnail-image').not('.slick-slide').each(function (index, el) {
            $(el).find('div, img').on('click', function (event) {
              event.preventDefault();
              event.stopPropagation();

              _this4.$slider.slick('slickGoTo', index);
            });
          });

          _.delay(function () {
            _this4.$element.trigger('veb_variation_gallery_slider_slick_init', [_this4]);
          }, 1);

          _.delay(function () {
            _this4.removeLoadingClass();
          }, 100);
        }
      }, {
        key: "initZoomForTarget",
        value: function initZoomForTarget(currentSlide) {
          if (!veb_variation_gallery_options.enable_gallery_zoom) {
            return;
          }

          var galleryWidth = parseInt(this.$target.width()),
              zoomEnabled = false,
              zoomTarget = this.$slider.slick('getSlick').$slides.eq(currentSlide);
          $(zoomTarget).each(function (index, target) {
            var image = $(target).find('img');

            if (parseInt(image.data('large_image_width')) > galleryWidth) {
              zoomEnabled = true;
              return false;
            }
          });

          if (!$().zoom) {
            return;
          }


          if (zoomEnabled) {
            var zoom_options = $.extend({
              touch: false
            }, wc_single_product_params.zoom_options);

            if ('ontouchstart' in document.documentElement) {
              zoom_options.on = 'click';
            }

            zoomTarget.trigger('zoom.destroy');
            zoomTarget.zoom(zoom_options);
          }
        }
      }, {
        key: "initZoom",
        value: function initZoom() {
          var currentSlide = this.$slider.slick('slickCurrentSlide');
          this.initZoomForTarget(currentSlide);
        }
      }, {
        key: "initPhotoswipe",
        value: function initPhotoswipe() {
          var _this5 = this;

          if (!veb_variation_gallery_options.enable_gallery_lightbox) {
            return;
          }

          this.$element.off('click', '.veb-variation-gallery-trigger');
          this.$element.off('click', '.iwp-gallery-image a');
          this.$element.on('click', '.veb-variation-gallery-trigger', function (event) {
            _this5.openPhotoswipe(event);
          });
          this.$element.on('click', '.iwp-gallery-image a', function (event) {
            _this5.openPhotoswipe(event);
          });
        }
      }, {
        key: "openPhotoswipe",
        value: function openPhotoswipe(event) {
          var _this6 = this;

          event.preventDefault();

          if (typeof PhotoSwipe === 'undefined') {
            return false;
          }

          var pswpElement = $('.pswp')[0],
              items = this.getGalleryItems();
          var options = $.extend({
            index: this.$slider.slick('slickCurrentSlide')
          }, wc_single_product_params.photoswipe_options);

          var photoswipe = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options); 

          photoswipe.listen('close', function () {
            _this6.stopVideo(pswpElement);
          });
          photoswipe.listen('afterChange', function () {
            _this6.stopVideo(pswpElement);
          });
          photoswipe.init();
        }
      }, {
        key: "stopVideo",
        value: function stopVideo(element) {
          $(element).find('iframe, video').each(function () {
            var tag = $(this).prop('tagName').toLowerCase();

            if (tag === 'iframe') {
              var player = $(this)[0];
              var src = $(this).attr('src');
              var ytcommand = {
                'event': 'command',
                'func': 'pauseVideo',
                'args': ''
              };
              var vcommand = {
                'method': 'pause',
                'value': 'true'
              }; 

              var url = new URL(src);
              var searchParams = new URLSearchParams(url.search);
              player.contentWindow.postMessage(JSON.stringify(ytcommand), '*'); 

              if (!searchParams.has('background')) {
                player.contentWindow.postMessage(JSON.stringify(vcommand), '*');
              } 

            }

            if (tag === 'video') {
              $(this)[0].pause();
            }
          });
        }
      }, {
        key: "addLoadingClass",
        value: function addLoadingClass() {
          if (veb_variation_gallery_options.preloader_disable) {
            return true;
          }

          this.$element.addClass('loading-gallery');
        }
      }, {
        key: "removeLoadingClass",
        value: function removeLoadingClass() {
          this.$element.removeClass('loading-gallery');
        }
      }, {
        key: "getGalleryItems",
        value: function getGalleryItems() {
          var $slides = this.$slider.slick('getSlick').$slides,
              items = [];

          if ($slides.length > 0) {
            $slides.each(function (i, el) {
              var img = $(el).find('img, iframe, video');
              var tag = $(img).prop('tagName').toLowerCase();
              var src, item;

              switch (tag) {
                case 'img':
                  var large_image_src = img.attr('data-large_image'),
                      large_image_w = img.attr('data-large_image_width'),
                      large_image_h = img.attr('data-large_image_height');
                  item = {
                    src: large_image_src,
                    w: large_image_w,
                    h: large_image_h,
                    title: img.attr('data-caption') ? img.attr('data-caption') : img.attr('title')
                  };
                  break;

                case 'iframe':
                  src = img.attr('src');
                  item = {
                    html: "<iframe loading=\"lazy\" class=\"iwp-lightbox-iframe\" src=\"".concat(src, "\" style=\"width: 100%; height: 100%; margin: 0;padding: 0; background-color: #000000\" frameborder=\"0\" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>")
                  };
                  break;

                case 'video':
                  src = img.attr('src');
                  item = {
                    html: "<video preload=\"auto\" class=\"iwp-lightbox-video\" disablePictureInPicture controls controlsList=\"nodownload\" src=\"".concat(src, "\" style=\"width: 100%; height: 100%; margin: 0;padding: 0; background-color: #000000\"></video>")
                  };
                  break;
              }

              items.push(item);
            });
          }

          return items;
        }
      }, {
        key: "destroySlick",
        value: function destroySlick() {
          this.$slider.html('');
          this.$thumbnail.html('');

          if (this.$slider.is('.slick-initialized')) {
            this.$slider.slick('unslick');
          }

          this.$element.trigger('veb_variation_gallery_slick_destroy', [this]);
        }
      }, {
        key: "defaultGallery",
        value: function defaultGallery() {
          var _this7 = this;

          if (this.is_variation_product) {
            if (this.$element.defaultXHR) {
              this.$element.defaultXHR.abort();
            }

            this.$element.defaultXHR = $.ajax({
              global: false,

              url: wc_add_to_cart_variation_params.wc_ajax_url.toString().replace('%%endpoint%%', 'get_default_gallery'),
              method: 'POST',
              data: {
                product_id: this.product_id
              },
              success: function success(data) {
                if (data) {
                  _this7.$element.data('veb_variation_gallery_default', data);

                  _this7.$element.trigger('woo_variation_default_gallery_loaded', [_this7, data]);
                } else {
                  _this7.$element.data('veb_variation_gallery_default', []);

                  _this7.$element.trigger('woo_variation_default_gallery_loaded', [_this7, []]);

                  console.error("Variation Gallery not available on variation id ".concat(_this7.product_id, "."));
                }
              }
            });
          }
        }
      }, {
        key: "initVariationImagePreload",
        value: function initVariationImagePreload() {
          var _this8 = this;

          if (this.is_variation_product) {
            if (this.$element.imagesXHR) {
              this.$element.imagesXHR.abort();
            }

            this.$element.defaultXHR = $.ajax({
              global: false,
              url: wc_add_to_cart_variation_params.wc_ajax_url.toString().replace('%%endpoint%%', 'get_variation_gallery'),
              method: 'POST',
              data: {
                product_id: this.product_id
              },
              success: function success(images) {
                if (images) {
                  if (images.length > 1) {
                    _this8.imagePreload(images);
                  }

                  _this8.$element.data('veb_variation_gallery_variation_images', images);

                  _this8.$element.trigger('veb_variation_gallery_variation_images', [_this8, images]);
                } else {
                  _this8.$element.data('veb_variation_gallery_variation_images', []);

                  console.error("Variation Gallery variations images not available on variation id ".concat(_this8.product_id, "."));
                }
              }
            });
          }
        }
      }, {
        key: "imagePreload",
        value: function imagePreload(images) {
          for (var i = 0; i < images.length; i++) {
            try {
              var _img = new Image();

              var _gallery = new Image();

              var _full = new Image();

              var _thumbnail = new Image();

              _img.src = images[i].src;

              if (images[i].srcset) {
                _img.srcset = images[i].srcset;
              }

              _gallery.src = images[i].gallery_thumbnail_src;
              _full.src = images[i].full_src;
              _thumbnail.src = images[i].archive_src;
              var video_link = $.trim(images[i].video_link);

              if (video_link && images[i].video_embed_type === 'video') {
                var req = new XMLHttpRequest();
                req.open('GET', video_link, true);
                req.responseType = 'blob';

                req.onload = function () {

                  if (this.status === 200) {
                    var videoBlob = this.response;
                    var vid = URL.createObjectURL(videoBlob);
                  }
                };

                req.onerror = function () {
                };

                req.send();
              } 

            } catch (e) {
              console.error(e);
            }
          }
        }
      }, {
        key: "showVariationImage",
        value: function showVariationImage(variation) {
          if (variation) {
            this.addLoadingClass();
            this.galleryInit(variation.variation_gallery_images || []);
          }
        }
      }, {
        key: "resetVariationImage",
        value: function resetVariationImage() {
          if (!this.$element.is('.loading-gallery')) {
            this.addLoadingClass();
            this.galleryReset();
          }
        }
      }, {
        key: "initVariationGallery",
        value: function initVariationGallery() {
          var _this9 = this;

          this.$variations_form.off('reset_image.iwp');
          this.$variations_form.off('click.iwp', '.reset_variations');
          this.$variations_form.off('show_variation.iwp');
          this.$variations_form.off('hide_variation.iwp');

          this.$variations_form.on('show_variation.iwp', function (event, variation) {
            _this9.showVariationImage(variation);
          });

          if (veb_variation_gallery_options.gallery_reset_on_variation_change) {
            this.$variations_form.on('hide_variation.iwp', function () {
              _this9.resetVariationImage();
            });
          } else {
            this.$variations_form.on('click.iwp', '.reset_variations', function () {
              _this9.resetVariationImage();
            });
          }
        }
      }, {
        key: "galleryReset",
        value: function galleryReset() {
          var _this10 = this;

          var $default_gallery = this.$element.data('veb_variation_gallery_default');

          if ($default_gallery && $default_gallery.length > 0) {
            this.galleryInit($default_gallery);
          } else {
            _.delay(function () {
              _this10.removeLoadingClass();
            }, 100);
          }
        }
      }, {
        key: "galleryInit",
        value: function galleryInit(images) {
          var _this11 = this;

          var hasGallery = images.length > 1;
          this.$element.trigger('before_veb_variation_gallery_init', [this, images]);
          this.destroySlick();
          var slider_inner_html = images.map(function (image) {
            var template = wp.template('veb-variation-gallery-slider-template');
            return template(image);
          }).join('');
          var thumbnail_inner_html = images.map(function (image) {
            var template = wp.template('veb-variation-gallery-thumbnail-template');
            return template(image);
          }).join('');

          if (hasGallery) {
            this.$target.addClass('veb-variation-gallery-has-product-thumbnail');
            this.$target.removeClass('veb-variation-gallery-no-product-thumbnail');
          } else {
            this.$target.addClass('veb-variation-gallery-no-product-thumbnail');
            this.$target.removeClass('veb-variation-gallery-has-product-thumbnail');
          }

          this.$slider.html(slider_inner_html);

          if (hasGallery) {
            this.$thumbnail.html(thumbnail_inner_html);
          } else {
            this.$thumbnail.html('');
          }


          _.delay(function () {
            _this11.imagesLoaded();
          }, 1);

        }
      }, {
        key: "imagesLoaded",
        value: function imagesLoaded() {
          var _this12 = this;

          if (!$().imagesLoaded.done) {
            this.$element.trigger('veb_variation_gallery_image_loading', [this]);
            this.$element.trigger('veb_variation_gallery_image_loaded', [this]);
            return;
          }

          this.$element.imagesLoaded().progress(function (instance, image) {
            _this12.$element.trigger('veb_variation_gallery_image_loading', [_this12]);
          }).done(function (instance) {
            _this12.$element.trigger('veb_variation_gallery_image_loaded', [_this12]);
          });
        }
      }, {
        key: "initThumbnailSlick",
        value: function initThumbnailSlick() {
          var _this13 = this;

          if (this.$thumbnail.hasClass('slick-initialized')) {
            this.$thumbnail.slick('unslick');
          }

          this.$thumbnail.off('init');
          this.$thumbnail.on('init', function () {}).slick();

          _.delay(function () {
            _this13.$element.trigger('veb_variation_gallery_thumbnail_slick_init', [_this13]);
          }, 1);
        }
      }, {
        key: "thumbnailHeight",
        value: function thumbnailHeight() {
          if (this.is_vertical) {
            if (this.$slider.slick('getSlick').$slides.length > 1) {
              this.$thumbnail.height(this.$slider.height());
            } else {
              this.$thumbnail.height(0);
            }
          } else {
            this.$thumbnail.height('auto');
          }

          if (this.$thumbnail.hasClass('slick-initialized')) {
            this.$thumbnail.slick('setPosition');
          }
        }
      }, {
        key: "thumbnailHeightDebounce",
        value: function thumbnailHeightDebounce(event) {
          var _this14 = this;

          return _.debounce(function () {
            _this14.thumbnailHeight();
          }, 401);
        }
      }, {
        key: "enableThumbnailPosition",
        value: function enableThumbnailPosition() {
          if (!veb_variation_gallery_options.is_mobile) {
          }

          if (veb_variation_gallery_options.is_vertical) {
            if (window.matchMedia('(max-width: 768px)').matches || window.matchMedia('(max-width: 480px)').matches) {
              this.is_vertical = false;
              this.$element.removeClass("".concat(veb_variation_gallery_options.thumbnail_position_class_prefix, "left ").concat(veb_variation_gallery_options.thumbnail_position_class_prefix, "right ").concat(veb_variation_gallery_options.thumbnail_position_class_prefix, "bottom"));
              this.$element.addClass("".concat(veb_variation_gallery_options.thumbnail_position_class_prefix, "bottom"));
              this.$slider.slick('setPosition');
            } else {
              this.is_vertical = true;
              this.$element.removeClass("".concat(veb_variation_gallery_options.thumbnail_position_class_prefix, "left ").concat(veb_variation_gallery_options.thumbnail_position_class_prefix, "right ").concat(veb_variation_gallery_options.thumbnail_position_class_prefix, "bottom"));
              this.$element.addClass("".concat(veb_variation_gallery_options.thumbnail_position_class_prefix).concat(veb_variation_gallery_options.thumbnail_position));
              this.$slider.slick('setPosition');
            }
          }
        }
      }, {
        key: "enableThumbnailPositionDebounce",
        value: function enableThumbnailPositionDebounce(event) {
          var _this15 = this;

          return _.debounce(function () {
            _this15.enableThumbnailPosition();
          }, 400);
        }
      }, {
        key: "destroy",
        value: function destroy() {
          this.$element.removeData(this.name);
        }
      }]);

      return _class2;
    }();
  }(jQuery);

  var jQueryPlugin = function ($) {
    return function (PluginName, ClassName) {
      $.fn[PluginName] = function (options) {
        var _this16 = this;

        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        return this.each(function (index, element) {
          var $element = $(element);
          var data = $element.data(PluginName);

          if (!data) {
            data = new ClassName($element, $.extend({}, options), PluginName);
            $element.data(PluginName, data);
          }

          if (typeof options === 'string') {
            if (_typeof(data[options]) === 'object') {
              return data[options];
            }

            if (typeof data[options] === 'function') {
              var _data;

              return (_data = data)[options].apply(_data, args);
            }
          }

          return _this16;
        });
      }; 


      $.fn[PluginName].Constructor = ClassName;

      $[PluginName] = function (options) {
        var _$;

        for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          args[_key2 - 1] = arguments[_key2];
        }

        return (_$ = $({}))[PluginName].apply(_$, [options].concat(args));
      };


      $.fn[PluginName].noConflict = function () {
        return $.fn[PluginName];
      };
    };
  }(jQuery);

  jQueryPlugin('VebVariationGallery', Plugin);
})(window);

 }),

 "./src/js/frontend.js":
 (function() {

jQuery(function ($) {
  try {
    $(document).on('veb_variation_gallery_init', function () {
      $('.veb-variation-gallery-wrapper:not(.iwp-loaded)').VebVariationGallery();
    }) 
    .trigger('veb_variation_gallery_init');
  } catch (err) {
    window.console.log(err);
  } 


  $(document).on('wc_variation_form', '.variations_form', function () {
    $(document).trigger('veb_variation_gallery_init');
  }); 

  $(document).on('qv_loader_stop', function () {
    $('.veb-variation-gallery-wrapper:not(.veb-variation-gallery-product-type-variable):not(.iwp-loaded)').VebVariationGallery();
  });

  if (window.elementorFrontend && window.elementorFrontend.hooks) {
    elementorFrontend.hooks.addAction('frontend/element_ready/woocommerce-product-images.default', function ($scope) {
      $(document).trigger('veb_variation_gallery_init');
    });
  }
}); 

 }),

 "./src/scss/frontend.scss":
 (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);


 }),

 "./src/scss/slider.scss":
 (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);


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
 			"/assets/js/frontend": 0,
 			"assets/css/admin": 0,
 			"assets/css/slick": 0,
 			"assets/css/frontend": 0
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
 		
 		var chunkLoadingGlobal = self["webpackChunkveb_variation_gallery"] = self["webpackChunkveb_variation_gallery"] || [];
 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
 	}();

 	__webpack_require__.O(undefined, ["assets/css/admin","assets/css/slick","assets/css/frontend"], function() { return __webpack_require__("./src/js/VebVariationGallery.js"); })
 	__webpack_require__.O(undefined, ["assets/css/admin","assets/css/slick","assets/css/frontend"], function() { return __webpack_require__("./src/js/frontend.js"); })
 	__webpack_require__.O(undefined, ["assets/css/admin","assets/css/slick","assets/css/frontend"], function() { return __webpack_require__("./src/scss/frontend.scss"); })
 	__webpack_require__.O(undefined, ["assets/css/admin","assets/css/slick","assets/css/frontend"], function() { return __webpack_require__("./src/scss/slider.scss"); })
 	var __webpack_exports__ = __webpack_require__.O(undefined, ["assets/css/admin","assets/css/slick","assets/css/frontend"], function() { return __webpack_require__("./src/scss/backend.scss"); })
 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
 	
 })()
;